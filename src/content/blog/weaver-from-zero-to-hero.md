---
title: "Weaver from zero to hero: a getting started guide"
slug: "weaver-from-zero-to-hero"
description: "Adopt OpenTelemetry Weaver to turn hand-maintained telemetry constants into a versioned schema with generated code and CI-enforced contracts."
publishedAt: 2026-04-25
author: "juraci"
tags: ["semantic-conventions", "instrumentation"]
tldr: "Replace your hand-written attribute and metric constants with a Weaver registry. Generate Go code from the schema, enforce it in CI, and stop drift between contract and instrumentation before it reaches production."
keyTakeaways:
  - "Weaver treats your telemetry contract as a source artifact: YAML in, generated code and docs out, with built-in OpenTelemetry policies enforced."
  - "A registry pins attribute keys, metric units, and stability levels so typos and missing units fail at validation time, not in dashboards."
  - "Generated constants become the only spelling of an attribute or enum value in your codebase, eliminating the most common drift case."
  - "CI gates (`weaver registry check`, regenerate-and-diff, and `weaver registry diff` against main) turn the schema into a real review surface."
  - "Spans need a small jq filter and `sampling_relevant` flags; database, HTTP, and messaging spans should follow upstream semconv rather than being redefined locally."
faqEntries:
  - question: "What is OpenTelemetry Weaver?"
    answer: "Weaver is the tool the OpenTelemetry project uses to manage semantic conventions. You describe attributes, metrics, spans, and events in YAML, and Weaver validates the description, generates code or documentation through Jinja2 templates, and enforces policies written in Rego."
  - question: "Why generate telemetry constants instead of hand-writing them?"
    answer: "Hand-written constants drift. Typos, redefinitions across services, missing units, and unclear stability levels accumulate until a dashboard breaks. Generating constants from a schema makes the contract authoritative, gives every constant a documented brief and stability, and lets CI catch drift before it merges."
  - question: "Does Weaver replace the official OpenTelemetry semantic conventions?"
    answer: "No. Weaver is what produces the official semconv packages. You use it to define your own conventions on top of (or alongside) the upstream ones. Database, HTTP, and messaging spans should still follow the official semantic conventions; your registry covers your business attributes."
  - question: "How do I keep generated code from drifting from the schema?"
    answer: "Run `weaver registry generate` in CI, format the output, and use `git diff --exit-code` against the checked-in generated files. If the schema changed without a regeneration, or if someone edited the generated files by hand, the job fails."
---

Every production Go service that uses OpenTelemetry eventually grows a file like this one:

```go
// internal/telemetry/const.go
package telemetry

const (
    ATTR_USER_ID          = "user.id"
    ATTR_ORDER_ID         = "order.id"
    ATTR_PRODUCT_ID       = "product.id"
    ATTR_PRODUCT_CATEGORY = "product.category"
    ATTR_CUSTOMER_TIER    = "customer.tier"
    ATTR_PAYMENT_METHOD   = "payment.method"
    ATTR_ORDER_TOTAL      = "order.total"
)

const (
    USER_REGISTRATIONS_TOTAL  = "users.registrations.total"
    ORDER_PROCESSING_DURATION = "orders.processing.duration"
    ORDERS_ACTIVE             = "orders.active"
)
```

This is how drift starts. A typo in one handler. A new service that redefines `order.id` as `orderID`. A metric that ships without a unit. A stability guarantee nobody can point to. The file compiles, the tests pass, and the telemetry keeps flowing, right up until a dashboard breaks because someone spelled an attribute differently in a new code path.

OpenTelemetry has an answer for this, and it is a separate project called Weaver. This post walks through adopting it, using the `stage-1-monolith` example from [otel-in-practice](https://github.com/telemetrydrops/otel-in-practice) as the target. We start with the file above, end with generated code backed by a versioned schema and enforced in continuous integration, and skip the bits most teams do not need on day one.

## What Weaver actually is

Weaver is a tool that treats your telemetry contract as a source artifact. You describe your attributes, metrics, spans, and events in YAML, and Weaver does three useful things with that description:

1. It validates the description itself, catching mistakes like metrics without units, attributes without stability levels, or references to names that do not exist.
2. It generates code, documentation, or anything else a [Jinja2](https://jinja.palletsprojects.com/) template can produce.
3. It enforces policies, either the built-in OpenTelemetry naming rules or custom ones you write in [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/).

Weaver is the same tool the OpenTelemetry project uses to generate the official semantic convention packages across every supported language. The semantic conventions you already reference, `http.request.method`, `db.system.name`, `service.name`, all come out of a Weaver registry. Adopting Weaver for your own conventions means working the same way upstream does, with the same tool.

The project lives at [open-telemetry/weaver](https://github.com/open-telemetry/weaver). This post uses version 0.22.1, the current release at the time of writing.

## The mental model

Three moving parts make up a Weaver setup.

The **registry** is a directory of YAML files. One of them is the manifest, which names the registry and declares dependencies. The rest describe attributes, attribute groups, metrics, spans, events, and entities. This is the source of truth for what your telemetry contract says.

The **templates** are a directory of [Jinja2](https://jinja.palletsprojects.com/) files plus a `weaver.yaml` configuration file. Templates turn the resolved registry into output files. For Go, that output is constants, variables, and helper functions. For TypeScript, it could be type definitions. For documentation, Markdown.

The **policies** are Rego rules. The built-in policies enforce OpenTelemetry conventions, including naming rules, stability transitions, and deprecation handling. Custom policies let you add organizational rules, for example, "every attribute must start with `ecommerce.`" or "no new metrics may be introduced at stability level `development` after the 1.0 release."

These three parts map cleanly onto the hand-written file at the top of this post. The `const` blocks become a registry. The act of writing them becomes codegen. The tribal knowledge about "how we name things here" becomes policies.

## Step 1: author the schema

Start by creating a registry inside the application repository. For the `stage-1-monolith` example, that means adding a `telemetry/registry/` directory next to the Go code:

```
stage-1-monolith/
├── internal/
├── telemetry/
│   └── registry/
│       ├── manifest.yaml
│       ├── attributes.yaml
│       └── metrics.yaml
└── main.go
```

The manifest identifies the registry and is required. A minimal one looks like this:

```yaml
# telemetry/registry/manifest.yaml
name: ecommerce
description: "Telemetry conventions for the ecommerce monolith"
semconv_version: 0.1.0
schema_url: https://telemetrydrops.com/schemas/ecommerce
```

The `semconv_version` is yours to manage, not OpenTelemetry's. It is the version of your conventions, bumped on schema changes. The `schema_url` is a stable identifier that Weaver embeds in generated output and emitted data so that consumers can tell which version of your contract a piece of telemetry adheres to.

Attributes come next. The ones in the original `const.go` translate directly:

```yaml
# telemetry/registry/attributes.yaml
file_format: definition/2

attributes:
  - key: ecommerce.user.id
    type: string
    stability: stable
    brief: "Identifier of the customer performing the operation."
    examples: ['user-9f3a', 'user-1c2d']

  - key: ecommerce.order.id
    type: string
    stability: stable
    brief: "Identifier of the order being processed."
    examples: ['ord-2024-0001', 'ord-2024-0042']

  - key: ecommerce.order.total
    type: double
    stability: stable
    brief: "Order total in the customer's billing currency."
    examples: [19.99, 149.00]

  - key: ecommerce.payment.method
    type:
      allow_custom_values: true
      members:
        - id: credit_card
          value: credit_card
          stability: stable
          brief: "Credit or debit card"
        - id: paypal
          value: paypal
          stability: stable
          brief: "PayPal account"
        - id: apple_pay
          value: apple_pay
          stability: stable
          brief: "Apple Pay"
    stability: stable
    brief: "Payment method selected by the customer."

  - key: ecommerce.customer.tier
    type:
      allow_custom_values: false
      members:
        - id: standard
          value: standard
          stability: stable
          brief: "Standard customer"
        - id: premium
          value: premium
          stability: stable
          brief: "Premium customer"
    stability: stable
    brief: "Customer tier for pricing and feature gates."
```

Three things to notice. First, every attribute has a `stability` field. Weaver refuses to generate from a schema where stability is missing, which forces you to answer the question up front rather than in a postmortem. Second, the attribute keys are namespaced with `ecommerce.` The Weaver project recommends dot-separated lowercase with a domain prefix, and in a minute we will turn that recommendation into a CI check. Third, `ecommerce.payment.method` and `ecommerce.customer.tier` are enums. Weaver knows the set of allowed values, and generated code can expose each as a named constant.

Metrics follow the same pattern:

```yaml
# telemetry/registry/metrics.yaml
file_format: definition/2

metrics:
  - name: ecommerce.orders.processing.duration
    instrument: histogram
    unit: s
    stability: stable
    brief: "End-to-end duration of processing a single order."
    attributes:
      - ref: ecommerce.payment.method
        requirement_level: required
      - ref: ecommerce.customer.tier
        requirement_level: recommended

  - name: ecommerce.orders.active
    instrument: updowncounter
    unit: "{order}"
    stability: stable
    brief: "Number of orders currently being processed."

  - name: ecommerce.users.registrations
    instrument: counter
    unit: "{registration}"
    stability: stable
    brief: "Total number of successful user registrations."
```

A few details to call out. The histogram unit changed from `ms` in the original code to `s` in the schema, because OpenTelemetry now recommends seconds for duration histograms across all signals. Weaver does not enforce semantic equivalents like "use seconds for durations," but it does validate the unit string itself: `weaver registry check` rejects malformed units like `secs` or `mss` against the [Unified Code for Units of Measure (UCUM)](https://ucum.org/) rules, so typos fail at validation time rather than producing silent garbage in your backend. The `{order}` and `{registration}` units are UCUM annotations that express "a dimensionless count of orders" in a machine-readable way. Your backend can use them to render axis labels; your schema consumers can tell that these are not bytes or seconds. The metric name also dropped its `.total` suffix, which OpenTelemetry naming conventions no longer recommend for counters; the suffix is implied by the instrument type.

Validate what you have so far:

```bash
weaver registry check -r ./telemetry/registry/
```

If everything is well-formed, the command prints a short summary and exits zero. If an attribute is missing a `brief` or a metric is missing a `unit`, Weaver tells you which file and which line. Weaver also prints a warning that `definition/2` is not yet stable; this is a known marker in version 0.22.1 and does not indicate a problem with your registry.

## Step 2: generate Go code

A schema on its own does nothing. The payoff comes from codegen. Weaver ships without a default Go template (the official OpenTelemetry semantic convention Go package has its own bespoke one), so you write a small template that fits your project.

Create a templates directory alongside the registry:

```
stage-1-monolith/
└── telemetry/
    ├── registry/
    │   ├── manifest.yaml
    │   ├── attributes.yaml
    │   └── metrics.yaml
    └── templates/
        └── registry/
            └── go/
                ├── weaver.yaml
                ├── attributes.go.j2
                └── metrics.go.j2
```

The directory layout matters because Weaver wires the CLI to it by convention. When you later run `weaver registry generate --templates ./telemetry/templates/ go ./internal/telemetry/`, the `--templates` flag points at the parent directory containing the `registry/` subdirectory, and the positional `go` argument selects the target subdirectory inside it. Weaver loads `./telemetry/templates/registry/go/weaver.yaml` and runs every template listed there.

The `weaver.yaml` inside the Go target directory tells Weaver what to produce:

```yaml
# telemetry/templates/registry/go/weaver.yaml
text_maps:
  go_types:
    int: int64
    double: float64
    string: string
    boolean: bool

acronyms: ["HTTP", "API", "ID", "URL", "DB"]

comment_formats:
  go:
    format: markdown
    prefix: "// "

params:
  package_name: telemetry

templates:
  - template: attributes.go.j2
    filter: semconv_grouped_attributes
    application_mode: single
    file_name: "attributes_gen.go"

  - template: metrics.go.j2
    filter: semconv_grouped_metrics
    application_mode: single
    file_name: "metrics_gen.go"
```

The attributes template walks the attribute list and emits one constant per entry:

```jinja2
{# telemetry/templates/registry/go/attributes.go.j2 #}
// Code generated by weaver. DO NOT EDIT.

package {{ params.package_name }}

// Attribute keys from the ecommerce semantic convention registry.
const (
{% for group in ctx %}
{% for attr in group.attributes %}
    {{ attr.brief | comment(format="go") }}
    Attr{{ attr.name | pascal_case_const }} = "{{ attr.name }}"
{% endfor %}
{% endfor %}
)
```

Two details worth noting. The `comment` filter takes its format as a keyword argument (`format="go"`), not a positional one, and it produces the full `// ...` comment line, so the template does not add the `//` prefix itself. Resolved attributes expose their identifier on `attr.name`, not `attr.key`; the input YAML uses `key`, but the resolved schema that templates consume uses `name`.

The metrics template follows the same pattern, with one quirk: the resolved identifier for metrics lives on `metric.metric_name` rather than `metric.name`:

```jinja2
{# telemetry/templates/registry/go/metrics.go.j2 #}
// Code generated by weaver. DO NOT EDIT.

package {{ params.package_name }}

// Metric names and units from the ecommerce semantic convention registry.
{% for group in ctx %}
{% for metric in group.metrics %}

{{ metric.brief | comment(format="go") }}
const (
    {{ metric.metric_name | pascal_case_const }}Name = "{{ metric.metric_name }}"
    {{ metric.metric_name | pascal_case_const }}Unit = "{{ metric.unit }}"
)
{% endfor %}
{% endfor %}
```

Run the generator. The subcommand takes the target as the first positional argument and the output directory as the second; `--registry` and `--templates` point at the source directories:

```bash
weaver registry generate \
    --registry ./telemetry/registry/ \
    --templates ./telemetry/templates/ \
    go \
    ./internal/telemetry/
```

Weaver drops two files into `internal/telemetry/`, `attributes_gen.go` and `metrics_gen.go`. The Jinja iteration leaves a few extra blank lines inside the `const` blocks; pipe the output through `gofmt -w internal/telemetry/` after every generation to keep the files clean. The CI workflow in Step 4 does this automatically. The attributes file then looks like this:

```go
// Code generated by weaver. DO NOT EDIT.

package telemetry

// Attribute keys from the ecommerce semantic convention registry.
const (
    // Customer tier for pricing and feature gates.
    AttrEcommerceCustomerTier = "ecommerce.customer.tier"
    // Identifier of the order being processed.
    AttrEcommerceOrderId = "ecommerce.order.id"
    // Order total in the customer's billing currency.
    AttrEcommerceOrderTotal = "ecommerce.order.total"
    // Payment method selected by the customer.
    AttrEcommercePaymentMethod = "ecommerce.payment.method"
    // Identifier of the customer performing the operation.
    AttrEcommerceUserId = "ecommerce.user.id"
)
```

Next to the hand-written `const.go`, the generated file is not smaller, but it is better in ways that matter at scale. Every constant carries a comment sourced from the schema brief, so hovering over `AttrEcommerceOrderId` in an editor shows the semantic definition. The casing is consistent because a function produced it, not a series of humans. The `DO NOT EDIT` header and the `_gen.go` suffix make it obvious to reviewers that changes belong upstream in the schema.

If you want `ID` rendered in upper case, Weaver's `acronym` filter will do it, but it needs the raw key as input (not a pascal-cased string) and a bit of extra template work. The simpler `pascal_case_const` used here is enough to get started; you can layer acronym handling in later.

There is one more piece of free leverage in the schema: enum members. The payment method and customer tier attributes already declare their allowed values, and the template can emit constants for each one. Append this block to `attributes.go.j2`:

```jinja2
{% for group in ctx %}
{% for attr in group.attributes %}
{% if attr.type is mapping and attr.type.members is defined %}
// Allowed values for {{ attr.name }}.
const (
{% for m in attr.type.members %}
    {{ attr.name | pascal_case_const }}{{ m.id | pascal_case_const }} = "{{ m.value }}"
{% endfor %}
)
{% endif %}
{% endfor %}
{% endfor %}
```

Regenerate, run `gofmt -w`, and the attributes file gains constants for every enum value the schema knows about:

```go
// Allowed values for ecommerce.payment.method.
const (
    EcommercePaymentMethodCreditcard = "credit_card"
    EcommercePaymentMethodPaypal     = "paypal"
    EcommercePaymentMethodApplepay   = "apple_pay"
)

// Allowed values for ecommerce.customer.tier.
const (
    EcommerceCustomerTierStandard = "standard"
    EcommerceCustomerTierPremium  = "premium"
)
```

Now `EcommercePaymentMethodCreditcard` is the only way to spell "credit_card" in the codebase. A typo at a call site fails to compile rather than producing a span attribute that no dashboard recognizes.

## Step 3: use it in the application

Wiring the generated symbols into the application is mechanical. The original handler looked like this:

```go
// internal/handlers/orders.go (before)
span.SetAttributes(
    attribute.String(telemetry.ATTR_USER_ID, req.UserID),
    attribute.String(telemetry.ATTR_PAYMENT_METHOD, req.PaymentMethod),
)
```

After generation, it becomes:

```go
// internal/handlers/orders.go (after)
span.SetAttributes(
    attribute.String(telemetry.AttrEcommerceUserId, req.UserID),
    attribute.String(telemetry.AttrEcommercePaymentMethod, req.PaymentMethod),
)
```

The metric creation in `internal/services/order_service.go` undergoes the same substitution:

```go
processingHist, err := meter.Float64Histogram(
    telemetry.EcommerceOrdersProcessingDurationName,
    metric.WithDescription("End-to-end duration of processing a single order."),
    metric.WithUnit(telemetry.EcommerceOrdersProcessingDurationUnit),
    metric.WithExplicitBucketBoundaries(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5),
)
```

One observation worth calling out: the bucket boundaries moved from milliseconds to seconds. The schema change forced this, which is exactly the point. The contract and the code now tell the same story. The description string is still hand-written; the same template-extension pattern used for enum members can emit a constructor helper that bakes the description and unit in, but the constants alone close the most common drift case and keep the example small.

Delete `const.go`. The hand-maintained constants are no longer the source of truth, and leaving them in place invites the exact drift you just spent an afternoon eliminating.

## Step 4: enforce the contract in CI

A schema that lives in a repo is only as good as the review process around it. Weaver exposes two commands that turn the schema into a gate: `check` and `diff`.

The `check` command validates the registry against the built-in OpenTelemetry policies and any custom ones you provide. Run it on every pull request:

```yaml
# .github/workflows/telemetry.yml
name: telemetry

on:
  pull_request:
    paths:
      - "telemetry/**"
      - ".github/workflows/telemetry.yml"

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Validate the registry
        run: |
          docker run --rm \
            -v "${{ github.workspace }}:/work" \
            otel/weaver:v0.22.1 \
            registry check \
              --registry /work/telemetry/registry/
```

Weaver offers a `--future` flag that opts into validation rules scheduled for upcoming releases, so you find out about tightening rules before they become errors. At the time of writing, `--future` treats the `definition/2` file format marker as an error, which would fail this job for reasons unrelated to your schema. Once the format is marked stable upstream, adding `--future` back to the invocation is the right move.

Checking the schema catches typos and missing fields. It does not catch drift between generated code and the schema. That check looks like this:

```yaml
      - name: Generate and verify checked-in code is current
        run: |
          docker run --rm \
            -v "${{ github.workspace }}:/work" \
            otel/weaver:v0.22.1 \
            registry generate \
              --registry /work/telemetry/registry/ \
              --templates /work/telemetry/templates/ \
              go \
              /work/internal/telemetry/
          gofmt -w internal/telemetry/
          git diff --exit-code internal/telemetry/
```

The `gofmt -w` step is what keeps the diff meaningful: without it, the blank-line noise from Jinja iteration would fail the diff check on every run. With it, the diff is clean unless the schema changed without a corresponding regeneration, which is the case the gate is meant to catch. If someone changed the generated code by hand, the same check catches that too.

The third gate is a diff between the branch under review and the main branch. Not every schema change is safe. Renaming a stable attribute breaks every consumer that queries by it. Removing a required attribute breaks dashboards. The `diff` command surfaces these:

```yaml
      - name: Diff against main
        run: |
          git fetch origin main:main
          git worktree add /tmp/main main
          docker run --rm \
            -v "${{ github.workspace }}:/work" \
            -v /tmp/main:/baseline \
            otel/weaver:v0.22.1 \
            registry diff \
              --baseline-registry /baseline/telemetry/registry/ \
              --registry /work/telemetry/registry/ \
              --diff-format markdown
```

The output highlights added, renamed, deprecated, and removed items. You can post it as a comment on the pull request so the reviewer sees the schema changes alongside the code changes. For organizations with a stricter policy on stable-attribute renames, you can fail the job if the diff contains a `removed` or `renamed` section at stability `stable`. A ten-line Rego policy covers that case; see the [Weaver validation guide](https://github.com/open-telemetry/weaver/blob/main/docs/usage.md) for custom policy examples.

## Step 5: spans

Spans deserve their own step. They are where most teams have the worst drift, because span names tend to be invented at the call site, attributes vary between handlers, and the same business operation gets recorded under three different names across services. Weaver handles spans with the same registry-and-codegen pattern, but with a few differences worth knowing.

A span entry needs `type`, `kind`, `brief`, `stability`, and a structured `name`. The `type` is the schema identifier, like `ecommerce.order.process`. The `kind` is one of `client`, `server`, `producer`, `consumer`, or `internal`. The `name.note` is what shows up at runtime when the span is recorded. For internal business operations with stable names, using the dotted type identifier as the runtime name reads cleanly and queries well in any backend. For HTTP, database, and messaging spans, OpenTelemetry has its own naming conventions ("`{http.request.method} {http.route}`" and similar) that you should follow rather than redefining locally.

```yaml
# telemetry/registry/spans.yaml
file_format: definition/2

spans:
  - type: ecommerce.order.process
    kind: internal
    stability: stable
    name:
      note: "ecommerce.order.process"
    brief: "Process a single customer order end-to-end."
    attributes:
      - ref: ecommerce.user.id
        requirement_level: required
        sampling_relevant: true
      - ref: ecommerce.payment.method
        requirement_level: required
        sampling_relevant: true
      - ref: ecommerce.order.id
        requirement_level: recommended
      - ref: ecommerce.order.total
        requirement_level: recommended
      - ref: ecommerce.customer.tier
        requirement_level: recommended
```

The `sampling_relevant: true` flag tells consumers (and the OpenTelemetry sampler implementations that respect it) that the attribute should be available at span start, not deferred. Putting it on the user identifier and the payment method is the difference between "we can sample by customer" and "we have to sample blindly."

Codegen for spans needs an inline jq filter, because Weaver does not ship a `semconv_grouped_spans` filter the way it does for attributes and metrics. Add a third entry to `weaver.yaml`:

```yaml
templates:
  - template: spans.go.j2
    filter: 'semconv_signal("span"; {}) | group_by(.root_namespace) | map({root_namespace: .[0].root_namespace, spans: . | sort_by(.id)})'
    application_mode: single
    file_name: "spans_gen.go"
```

The single quotes around the filter are required. The colons inside `semconv_signal("span"; {})` collide with YAML mapping syntax, and an unquoted form fails with `mapping values are not allowed in this context`. This took longer to debug than it should have; the quotes are the fix.

The template walks the resolved spans and emits one constant per span name. The resolved schema exposes the span identifier as `span.id` (prefixed with `span.`) and the runtime name as `span.name`, so a small `replace` is needed to build a Go-friendly identifier:

```jinja2
{# spans.go.j2 #}
// Code generated by weaver. DO NOT EDIT.

package {{ params.package_name }}

// Span names from the ecommerce semantic convention registry.
const (
{% for group in ctx %}
{% for span in group.spans %}
    {{ span.brief | comment(format="go") }}
    Span{{ span.id | replace("span.", "") | pascal_case_const }}Name = "{{ span.name }}"
{% endfor %}
{% endfor %}
)
```

In the application code, this turns the call site from a string literal into a generated constant:

```go
// internal/services/order_service.go
ctx, span := s.tracer.Start(ctx, telemetry.SpanEcommerceOrderProcessName,
    trace.WithAttributes(
        attribute.String(telemetry.AttrEcommerceUserId, userID),
        attribute.String(telemetry.AttrEcommercePaymentMethod, paymentMethod),
    ),
)
```

There is one more thing to settle before declaring the spans story complete: what does *not* belong in your registry. Database, HTTP, and messaging spans should follow upstream OpenTelemetry semantic conventions, not be redefined in your own `ecommerce.` namespace. Until you import the upstream registry as a dependency (the "extend the official registry" item in the next section), the right move at those instrumentation sites is to keep using the official semconv Go package. In the example monolith, the order repository looks like this:

```go
// internal/repositories/order_repo.go
import semconv "go.opentelemetry.io/otel/semconv/v1.34.0"

ctx, span := r.tracer.Start(ctx, "INSERT orders",
    trace.WithAttributes(
        semconv.DBSystemNamePostgreSQL,
        semconv.DBOperationName("INSERT"),
        semconv.DBCollectionName("orders"),
        attribute.String(telemetry.AttrEcommerceOrderId, order.ID),
    ),
)
```

The database attributes (`db.system.name`, `db.operation.name`, `db.collection.name`) come from the official Go semconv package. The business attribute (`ecommerce.order.id`) comes from your generated constants. Mixing the two in the same span is the right pattern; redefining `db.system.name` in your own registry is not.

## What "hero" looks like

With these steps in place, the team now has a real telemetry contract. The schema declares which attributes, metrics, and spans exist, how stable they are, and what units they use. The generator produces the code the application actually calls, so any mismatch between intent and implementation fails at build time, not in a dashboard a week later. Continuous integration enforces the contract on every change. The generated documentation (a `weaver registry generate markdown` run away) gives downstream consumers, analytics teams, security reviewers, anyone who cares what the application emits, a single source of truth they can bookmark.

None of this prevents bad instrumentation. A developer can still emit an attribute that is not in the schema, pass the wrong value to a generated constant, or ignore the contract entirely and go back to raw strings. Catching those cases is what `weaver registry live-check` is for, and it is worth a separate post. The point of the steps here is to eliminate a specific class of problem: drift between the contract and the code. After adopting Weaver, that drift can no longer slip in unnoticed. It surfaces in code review, before it surfaces in an incident.

## What is next

A few directions open up from this baseline.

**Publish the registry as an artifact.** The registry is a handful of YAML files. Zipping it and attaching it to a GitHub release gives downstream services a stable identifier they can import. A backend team building dashboards can pin to `ecommerce@1.2.0` and know exactly which attributes they will see.

**Extend the official OpenTelemetry registry.** The manifest supports declaring dependencies on other registries, including the [open-telemetry/semantic-conventions](https://github.com/open-telemetry/semantic-conventions) repository. Once declared, your schema can `ref` any upstream attribute, and your generated code exposes both your conventions and the imported ones in a single package. That is how the official language SDKs produce their semconv packages.

**Add [live validation](https://github.com/open-telemetry/weaver/blob/main/docs/usage.md) in integration tests.** Point `weaver registry live-check` at a local collector endpoint, run the test suite, and fail the build if emitted telemetry violates the schema. That catches the "developer bypassed the constants" case that CI-time checks cannot.

**Write custom Rego policies.** The built-in OpenTelemetry policies are a strong baseline, but organizations often have additional rules, such as mandatory attribute prefixes, required attributes on every customer-facing span, or caps on the number of enum values on high-cardinality attributes. Rego lets you encode those and enforce them alongside the built-in checks.

Each of these is a project in its own right. Starting with schema, codegen, application wiring, and CI gets a team to the point where telemetry has a contract and the contract is enforced. That is the foundation the rest builds on.

The code for the example monolith lives at [telemetrydrops/otel-in-practice](https://github.com/telemetrydrops/otel-in-practice) on the `adopt-weaver` branch, and the Weaver reference, including the full CLI documentation, is at [open-telemetry/weaver](https://github.com/open-telemetry/weaver). A good next step after reading this post is to copy the pieces above into your own repository, delete your equivalent of `const.go`, and see which drift your schema catches on the first run.
