---
title: "You don't have too much telemetry. You have bad telemetry."
slug: "bad-telemetry-not-volume-problem"
description: "Why observability cost problems are governance problems, not volume problems. A practical framework for identifying and eliminating telemetry waste before reaching for sampling."
publishedAt: 2026-04-15
author: "juraci"
tags: ["collector", "cost-optimization"]
tldr: "Most organizations don't have a telemetry volume problem. They have a governance problem. Fix bad telemetry at the source before sampling."
keyTakeaways:
  - "Telemetry cost is a governance problem, not a volume problem"
  - "Health check floods, debug log leaks, and high-cardinality metrics are the top offenders"
  - "Fix at source, not at pipe — collector filtering is a safety net, not a strategy"
  - "Sampling after cleanup is a strategic decision; sampling before cleanup is waste reduction theater"
faqEntries:
  - question: "How do I reduce OpenTelemetry Collector costs?"
    answer: "Start by auditing what you collect. Most cost comes from health check traces, abandoned debug logs, and high-cardinality metrics, not from valuable telemetry. Address these at the source before adding collector-level filters."
  - question: "Should I use sampling to reduce telemetry costs?"
    answer: "Only after eliminating bad telemetry. Sampling garbage gives you a smaller pile of garbage. Clean up your telemetry estate first, then sample the remaining valuable data intentionally."
---

The quarterly budget review arrives, and the observability line item has doubled again. The reflexive response is familiar: "We need to sample more aggressively" or "Let's only observe critical services." These tactics will reduce costs. They will also destroy your ability to debug production incidents, trading a financial problem for an operational one.

The uncomfortable truth is that most organizations do not have a volume problem. They have a governance problem. Before reaching for the sampling dial, engineering leaders should ask a more fundamental question: do we actually know what we are collecting, and is it worth keeping?

## The governance gap

Most organizations cannot answer three basic questions about their telemetry: What are we collecting? Who owns it? Is it valuable?

Telemetry tends to grow organically. A developer enables debug logging during an incident and forgets to disable it. Auto-instrumentation captures every internal function call by default. Library internals generate spans that no one ever examines. Over months and years, this accumulation becomes the baseline that everyone assumes is necessary.

The result is a telemetry estate where no one understands the data, no one owns the data, and no one has consciously decided the data is worth the cost of keeping it. When the bill arrives, the only lever that seems available is sampling, which treats all telemetry as equally valuable and cuts it indiscriminately.

## Patterns of bad telemetry

Before implementing sampling, engineering leaders should understand the common patterns of telemetry that provides minimal debugging value while consuming significant resources.

Health check floods represent one of the most common offenders. Kubernetes probes, load balancer checks, and monitoring systems generate millions of traces daily. These traces confirm that services are responding, but they reveal nothing about application behavior, user experience, or system bottlenecks. They crowd out useful signal and consume pipeline capacity.

Debug logs abandoned in production create similar waste. During incident response, engineers often increase logging verbosity to understand system behavior. Once the incident resolves, these verbose settings remain in place, generating enormous log volumes that no one examines until the next billing cycle.

High-cardinality metric attributes cause a different kind of problem. Adding user identifiers or transaction IDs to metric labels seems useful until the metrics backend collapses under millions of unique time series. The cost grows multiplicatively with each additional high-cardinality attribute.

Internal span proliferation occurs when auto-instrumentation, especially via eBPF, captures every method call within a service. A single user request might generate fifteen spans, ten of which complete in under a millisecond and represent internal implementation details rather than meaningful system boundaries. These spans add noise to traces without aiding debugging.

Orphaned spans result from broken context propagation between services. These spans cannot be assembled into coherent traces, rendering them useless for understanding request flow. They consume storage and processing resources while providing zero debugging value.

## Fix at source, not at pipe

Many organizations attempt to address telemetry waste by adding filters in their collection pipeline. This approach misses the fundamental inefficiency. By the time data reaches the collector, the application has already generated, serialized, and transmitted it across the network. Filtering at the collector reduces storage costs, but the computational and network costs have already been incurred.

Source-level fixes eliminate waste entirely. Configuring instrumentation agents to exclude health check endpoints prevents those traces from being created. Establishing log level policies in deployment configurations ensures debug logging stays in development environments. Code review practices can catch high-cardinality metric attributes before they reach production.

The collector should serve as a safety net for edge cases, not the primary mechanism for data governance. Filter processors handle scenarios that cannot be addressed at the source, such as legacy applications or third-party services. For everything else, the most cost-effective solution is preventing waste from being generated.

## The volume question remains

Even after addressing bad telemetry, some organizations will still face legitimate volume challenges. High-traffic systems generate substantial telemetry even when every span and log provides genuine value. The difference is what happens next.

Sampling garbage gives you a smaller pile of garbage. When telemetry is a mix of useful signal and noise, sampling cuts both indiscriminately. You reduce costs, but you also reduce your ability to debug the specific incidents that sampling happened to discard.

Sampling after cleanup is a strategic decision about valuable data. When you have eliminated the noise, every piece of remaining telemetry serves a purpose. Sampling decisions become intentional trade-offs between cost and observability coverage rather than desperate cuts to an unmanaged data stream. Tail-based sampling can preserve error traces while reducing successful request volume. Rate limiting can cap burst traffic while maintaining baseline visibility.

The key insight is that cleanup dramatically reduces the volume that needs sampling in the first place. Organizations often discover that addressing bad telemetry alone brings costs within acceptable ranges, eliminating the need for aggressive sampling entirely.

## A practical approach for engineering leaders

Addressing telemetry governance requires visibility before action. Start by inventorying what you collect, identifying the top contributors to volume across traces, metrics, and logs. Most organizations find that a small number of sources account for the majority of data.

Categorize that volume by type. Health checks, internal spans, debug logs, and high-cardinality metrics each require different remediation strategies. Understanding the composition of your telemetry guides where to focus effort.

Assess value honestly by asking when each category of telemetry last contributed to resolving an incident. If no one can recall using health check traces for debugging, they are candidates for elimination or aggressive filtering.

Implement fixes at the source where possible. Agent configuration changes, log level policies, and instrumentation code reviews address the root cause rather than treating symptoms. Reserve collector-level filtering for cases where source changes are impractical.

Finally, if volume remains a concern after cleanup, implement sampling with intention. Document what is being sampled and why. Ensure that sampling policies preserve the traces most likely to matter during incidents, such as errors, high-latency requests, and specific customer traffic.

The path from reactive cost cutting to intentional data governance requires effort, but the reward is an observability system that costs less and works better. The next time the budget conversation surfaces, the answer should not be "sample more." It should be "we know exactly what we collect, and it is worth keeping."
