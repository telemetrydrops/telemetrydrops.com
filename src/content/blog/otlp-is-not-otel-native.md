---
title: "OTLP support is not OpenTelemetry support"
slug: "otlp-is-not-otel-native"
description: "Accepting OTLP only means a vendor opened a port and can decode the wire format. Being OpenTelemetry-native means preserving and understanding the data model: semantic conventions, a shared resource model, and version drift."
publishedAt: 2026-05-25
author: "juraci"
tags: ["semantic-conventions", "architecture", "collector"]
tldr: "OTLP is the envelope; OpenTelemetry-native is reading the letter inside. A tool that accepts OTLP but renames attributes, splits signals into disconnected schemas, or ignores semantic-convention drift is OTLP-compatible, not OpenTelemetry-native. Use the five-question scorecard to tell them apart."
keyTakeaways:
  - "Accepting OTLP is the easy part: it means decoding the wire format. The value lives in the shared vocabulary the protocol carries, not the port that receives it."
  - "An OpenTelemetry-native backend speaks semantic conventions without translation. If a tool makes you map attributes to its internal field names before dashboards work, the data model is lost at the ingest seam."
  - "Traces, metrics, and logs should share one resource model so correlation is a property of the data, not a join table you maintain. Three disconnected schemas for three signals is a red flag."
  - "Semantic conventions are versioned and drift over time. Native tools track the drift so a dashboard survives an SDK upgrade instead of silently going empty."
  - "Producer-side lock-in is real: a Collector distribution can emit technically-valid OTLP that only its own backend understands. Native means preserving semantics on output, for any conformant backend."
faqEntries:
  - question: "What is the difference between OTLP support and OpenTelemetry support?"
    answer: "OTLP support means a tool can receive and decode the OpenTelemetry Protocol wire format. OpenTelemetry-native support means it preserves and understands the data model once OTLP is decoded: it uses semantic conventions natively, shares a resource model across signals, and tracks convention version drift. Accepting OTLP is necessary but not sufficient."
  - question: "How can I tell if a backend is truly OpenTelemetry-native?"
    answer: "Watch what happens at ingest. If the tool requires you to map incoming attributes like http.response.status_code to its own internal field names before dashboards work, it is OTLP-compatible, not native. A native backend groups by service.name without an alias and labels spans by their semantic-convention attributes out of the box."
  - question: "Can a Collector distribution cause vendor lock-in even though it speaks OTLP?"
    answer: "Yes. A vendor's distribution can accept OTLP, emit OTLP, and still reshape the data model on the way through, renaming attributes or flattening the resource model into a private dialect. The bytes still decode as OTLP, but only that vendor's backend can make sense of them. Producer-side lock-in is harder to spot because the wire format still says OTLP."
---

Open a vendor's pricing page and you will find "OpenTelemetry support" listed as a feature, usually next to a checkbox that means "we accept OTLP." Accepting the OpenTelemetry Protocol (OTLP) means the vendor opened a port and can decode the wire format. That is the easiest part of supporting OpenTelemetry, and it is the part that gets marketed the hardest.

OTLP is the envelope. OpenTelemetry-native is reading the letter inside. A product that accepts OTLP but ignores what the data means is no more OpenTelemetry-native than an email server is fluent in every language it relays. The protocol is a transport. The value is the shared vocabulary that travels through it, and that vocabulary is where most of the work, and most of the lock-in, actually lives.

This article lays out what OpenTelemetry-native means in practice, on both sides of the pipeline: the backend that reads your telemetry and the agent that produces it. None of these points are about whether a tool can ingest OTLP. They are about whether it preserves and understands the data model once OTLP is decoded.

## The shared vocabulary is the point

OpenTelemetry's semantic conventions define canonical names for the things telemetry describes. An HTTP server span carries `http.request.method` and `http.response.status_code`. A database client span carries `db.system.name`. These names are not decoration. They are a contract between the code that produces telemetry and every tool that later reads it.

An OpenTelemetry-native backend speaks that contract without translation. It groups by `service.name` because that is the resource attribute that identifies a service, and it does so without asking you to configure an alias. It knows `http.response.status_code` is the canonical key for an HTTP status, not `status`, not `http_status`, not `responseCode`. It renders a span using the OpenTelemetry span kind rather than mapping it onto a vendor-specific notion of "transaction" or "segment."

The tell is what happens at ingest. If a tool requires you to map incoming attributes to its own internal field names before its dashboards work, it is OTLP-compatible, not OpenTelemetry-native. The mapping step is the seam where the data model is lost. Once `http.response.status_code` becomes the backend's proprietary `status_code` field, you have left OpenTelemetry behind and entered that vendor's schema. Everything you build on top of it, dashboards, alerts, saved queries, is now expressed in a private language.

Native behavior shows up in small, unglamorous places: a query autocomplete that suggests `service.namespace`, a default service view that already knows which attribute carries the deployment environment, a trace waterfall that labels spans by their semantic-convention attributes rather than asking you to teach it what each field means.

## Resource attributes are a shared model, not a per-signal afterthought

The most underappreciated part of the data model is the resource. In OpenTelemetry, resource attributes describe the entity that produces telemetry, not the individual signal. The `service.name` on a trace is the same `service.name` on a metric and on a log, because the entity emitting all three is the same. The same holds for `k8s.pod.name`, `k8s.namespace.name`, `host.name`, and the rest of the resource attributes.

This is what makes correlation a property of the data rather than a feature you bolt on. When traces, metrics, and logs share a resource model, moving from a latency spike on a metric to the traces behind it to the logs those traces emitted is a matter of matching shared attributes. There is no join table to maintain, no per-signal field mapping to keep in sync. The join is built into the data.

A product that accepts OTLP but stores traces, metrics, and logs in three disconnected schemas misses this entirely. You end up back where you started before OpenTelemetry: three query languages, three places where `service.name` might be spelled differently, and three dashboards that quietly disagree about which environment a service runs in. The OTLP port was opened, but the model that gives OTLP its value was discarded on the way in. Three disconnected schemas for three signals is a reliable red flag.

## Semantic conventions drift, and native tools track the drift

Semantic conventions are versioned, and they change. `http.method` became `http.request.method`. `http.status_code` became `http.response.status_code`. `db.system` became `db.system.name`. These migrations are deliberate and documented, but they mean that telemetry emitted by an older SDK and telemetry emitted by a newer one can describe the same concept with different attribute names.

A backend that hardcodes a single version of the conventions breaks silently across an SDK upgrade. A dashboard built last year against `http.status_code` returns no data once the services behind it move to an SDK that emits `http.response.status_code`, and nothing announces the failure. The panel just goes empty, or worse, half empty, while half your fleet still runs the old SDK.

An OpenTelemetry-native tool treats semantic-convention version drift as a first-class concern. It surfaces which version your incoming data uses, it understands that `http.method` and `http.request.method` refer to the same thing across a migration window, and it helps you move dashboards forward instead of letting them rot. Handling version drift explicitly is one of the clearest signals that a tool was built around the data model rather than around a one-time OTLP decoder.

## Portability cuts both ways: config and semantics

Most discussions of OpenTelemetry lock-in focus on the backend. The producer side deserves the same scrutiny, because the OpenTelemetry Collector is where semantics are most easily preserved and most quietly broken.

The portability argument for the Collector is straightforward. The upstream Collector, a vendor's distribution, and a custom build assembled with the OpenTelemetry Collector Builder all share the same receivers, processors, exporters, and the same OpenTelemetry Transformation Language (OTTL). A pipeline you write against one runs against another, because the configuration surface is shared:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

processors:
  batch: {}
  resourcedetection:
    detectors: [env, system]

exporters:
  otlp_grpc:
    endpoint: backend.example.com:4317

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [otlp_grpc]
```

That configuration travels. Swap the `otlp_grpc` exporter's endpoint and it points at a different backend. If a tool only works with its own proprietary agent and cannot consume a pipeline like this, the lock-in has not gone away. It has just acquired a new logo.

But config portability is only half of it, and this is the part vendors gloss over. A vendor's Collector distribution can accept OTLP, emit OTLP, and still destroy the data model on the way through. Suppose vendor A's distribution quietly renames `http.response.status_code` to `status_code`, flattens resource attributes into span attributes, or restructures metric data points into a shape that only vendor A's backend expects. The bytes leaving that Collector are still technically OTLP. They will still decode. But they have been reshaped into a dialect that only vendor A understands.

Point that output at vendor B, and vendor B sees OTLP it cannot make sense of: metrics with names it does not recognize, attributes that no longer match the conventions, a resource model that has been pulled apart. The escape hatch OpenTelemetry was supposed to provide is gone, and it was taken away by the agent, not the backend. Producer-side lock-in is harder to spot precisely because the wire format still says OTLP. Being OpenTelemetry-native on the producer side means the Collector preserves semantic conventions on output, so the telemetry it emits is meaningful to any conformant backend, not just the one that shipped the distribution.

## The format you write should match the format you read

The two halves of the pipeline meet at a simple test: does the telemetry survive the round trip? In an OpenTelemetry-native setup, the attribute keys you write are the attribute keys you query. You can author a query against the SDK documentation, because the name the SDK emits is the name the backend stores. An OTTL expression that references `attributes["http.response.status_code"]` means the same thing in the Collector as the field you filter on in the backend's query language.

When that round trip holds, the documentation for your instrumentation doubles as the documentation for your queries, and knowledge transfers across tools instead of being re-learned per vendor. When the backend renames attributes at ingest, or the agent reshapes them on output, the contract is broken at one of those seams, and you are back to maintaining a private translation layer in your head.

## A scorecard for your own stack

The distinction between OTLP-compatible and OpenTelemetry-native comes down to five yes-or-no questions you can ask about any tool or distribution in your pipeline:

1. Does it use OpenTelemetry semantic conventions natively, without requiring you to map attributes at ingest?
2. Do traces, metrics, and logs share the same resource model, so correlation needs no join table?
3. Is semantic-convention version drift handled explicitly, so dashboards survive an SDK upgrade?
4. Can you run any Collector distribution, and does the Collector preserve semantics on output rather than reshaping OTLP into a private dialect?
5. Do attribute names survive the round trip unchanged, from the SDK that writes them to the query that reads them?

Four or five yeses describes a tool built around the OpenTelemetry data model. Two or three describes a tool that decodes OTLP but treats the model as optional. Zero or one describes a marketing checkbox.

## OpenTelemetry is a semantics problem, not a transport problem

The OTLP port is the easiest thing to open, which is exactly why it is the thing vendors advertise. Understanding the data model, preserving it on the way in, and refusing to reshape it on the way out, is the work that actually compounds. Semantic conventions, a shared resource model, and version awareness are what let your telemetry mean the same thing across every tool that touches it. That portability is the entire promise of OpenTelemetry, and it is not delivered by accepting OTLP. It is delivered by respecting what OTLP carries.

When you evaluate a vendor or build your own Collector distribution, look past the OTLP checkbox and ask the five questions above. The answers tell you whether you are adopting OpenTelemetry or just renting a port that happens to speak it.

If you want to go deeper on the data model that underpins all of this, the resource model, the semantic conventions, and the Collector architecture from the ground up, that is exactly what we teach in the OpenTelemetry track at Telemetry Drops.
