---
title: "Six OpenTelemetry talks worth watching from KubeCon EU 2026"
slug: "best-otel-talks-kubecon-eu-2026"
description: "Our picks from KubeCon EU 2026 in Amsterdam: three applied observability talks showing real-world OTel deployments, and three core project updates that affect every Collector operator."
publishedAt: 2026-04-15
author: "juraci"
tags: ["collector", "instrumentation", "architecture"]
tldr: "Six KubeCon EU 2026 talks worth your time: DigitalOcean's migration at scale, a Bluetooth party game with real-time metrics, AI agents in Doom, profiling alpha launch, OTTL debugging tools, and the batch processor deprecation."
keyTakeaways:
  - "OpenTelemetry has moved past adoption questions — the hard problems are now about operating it well at scale"
  - "The batch processor is being deprecated in favor of exporter-side batching — this affects nearly every Collector deployment"
  - "Profiling reached alpha status as the fourth signal, with trace-to-profile correlation built into the format"
  - "The OTTL playground at ottl.run compiles the Collector to WebAssembly for browser-based debugging"
---

KubeCon EU 2026 in Amsterdam had no shortage of observability content. Between the main conference tracks and the co-located events, attendees faced the familiar problem of too many good talks running in parallel. To help you prioritize your watch list, we picked six talks that stood out: three where teams applied OpenTelemetry to solve real problems, and three that moved the core project forward in meaningful ways.

## Applied observability

### We deleted our observability stack and rebuilt it with OTel

**Yash Sharma & Kunju Perath (DigitalOcean)** | [Watch on YouTube](https://www.youtube.com/watch?v=Z0oum6Eh1is)

DigitalOcean's managed Kubernetes team (DOKS) runs 20,000+ customer clusters across 13 cloud regions with a team of 18 engineers. Their existing setup relied on a single Prometheus instance per control plane cluster. It handled control plane metrics well enough, but left blind spots everywhere else: no observability into the kube-system namespace on customer clusters, no worker node telemetry, and only file-based audit logs that vanished on cluster restarts.

The team adopted an agent-gateway pattern with the OpenTelemetry Collector. Lightweight agent collectors run at each layer (control plane cluster, customer kube-system namespace, and worker nodes as systemd services) and forward telemetry to stateless gateway collectors, which export data via the OpenTelemetry Protocol (OTLP) to the DigitalOcean observability backend. The Prometheus receiver made migration practical by enabling a near one-to-one port of existing scrape configurations. The transform processor replaced a custom Go service they had built just for adding metadata like control plane cluster IDs.

The talk is honest about what went wrong. Adding the OpenTelemetry Kubernetes Operator introduced Custom Resource Definition (CRD) conflicts with their existing internal operators and created a fast-moving dependency in their Go monorepo. Bare deployment configurations would have been simpler. They also learned to invest early in understanding the OTLP data model, particularly the distinction between resource attributes and telemetry attributes, because confusion between the two slowed debugging. After the migration, mean time to detect issues dropped from hours to minutes.

**Why this talk stood out:** A concrete migration story at serious scale, with practical lessons about what to adopt and what to skip.

### 18 Bluetooth controllers walk into a bar: observability and reliability

**Simon Schrottner & Manuel Timelthaler** | [Watch on YouTube](https://www.youtube.com/watch?v=Y9agHID8Ml4)

Simon Schrottner (an OpenFeature maintainer at Dynatrace) built an open source party game where players use PlayStation Move controllers as accelerometer-based inputs in a spoon-and-egg style competition. The game runs on a Raspberry Pi, and debugging failures at conferences was frustrating without any visibility into the system. He partnered with Manuel Timelthaler (Tractive) to add proper observability.

The team refactored the original Python monolith into a microservices architecture using gRPC, which enabled OpenTelemetry auto-instrumentation to capture spans, traces, and logs with minimal manual effort. They deployed an OpenTelemetry Collector on the Raspberry Pi alongside a feature flag proxy (flagd from OpenFeature) for runtime configuration changes during gameplay.

The interesting discovery was that high-frequency metric collection posed a bigger challenge than high cardinality. Prometheus scraping at its default 60-second interval missed entire games that lasted only 10 seconds. Tuning the scrape interval to 10 seconds still produced square-wave graphs that revealed nothing about actual gameplay. Switching to push-based metrics with 100-millisecond aggregation intervals brought the system to near real-time fidelity, producing graphs where you could visually reconstruct how a game unfolded. Adding just one label (a game ID) with 32 controllers jumped Prometheus series from 1,200 to 18,000.

The Raspberry Pi ran the full stack locally: game services, the Collector, Prometheus, and Grafana. Completely off-grid operation matters at conferences where Wi-Fi is unreliable.

**Why this talk stood out:** It proves that OpenTelemetry and CNCF observability tools work well beyond traditional web services. The high-frequency data challenges they encountered apply directly to Internet of Things (IoT), real-time systems, and the emerging world of AI agent monitoring.

### Observing chaos: real-time monitoring of AI-driven Kubernetes destruction

**Josh Halley & Ricardo Aravena** | [Watch on YouTube](https://www.youtube.com/watch?v=KOM-PQNpcjk)

This talk puts up to 16 AI players, each running as a neural network inside a Kubernetes pod, into a Doom deathmatch. The system uses PyTorch for model hosting and training, combining IMPALA for distributed scaling, ResNet for visual perception, Long Short-Term Memory (LSTM) for temporal context, and dueling heads for action evaluation. Players share their best hyperparameters through a distributed InterPlanetary File System (IPFS) network, creating an adversarial training loop where winning strategies feed back into improved models.

The observability story is what makes this relevant beyond the spectacle. The team instrumented everything with OpenTelemetry, following the generative AI semantic conventions for spans and traces. Each player pod includes a Model Context Protocol (MCP) server that exposes player metrics, and a supervisor agent aggregates data from all players via MCP clients. The dashboards show service maps, player frag counts, MCP call statistics, neural network performance, and container restarts. Distributed traces capture the full communication flow from the MCP supervisor through individual players.

Training went through 14 iterations before the players performed adequately. Early versions spent most of their time hitting walls. The team also switched from standard Docker containers to WebAssembly to speed up pod restarts when players got fragged.

**Why this talk stood out:** While framed as a game, the architecture directly parallels the challenges of operating AI agents in production distributed systems: long-lived agentic flows, high restart rates, MCP-based coordination, and the need for observability that spans AI reasoning and infrastructure layers.

## Core OpenTelemetry

### The fourth pillar arrives: OpenTelemetry profiling alpha in action

**Felix Geisendorfer & Florian Lehner** | [Watch on YouTube](https://www.youtube.com/watch?v=TKp2snmgvtQ)

Felix Geisendorfer (Datadog) and Florian Lehner (Elastic) announced the alpha launch of the OpenTelemetry profiling signal, the fourth pillar alongside traces, metrics, and logs. They merged the alpha live on stage, a milestone that involved 30 OTLP pull requests and contributions from many individuals and companies through the profiling Special Interest Group (SIG).

The profiling signal captures stack traces sampled over time, producing flame graphs, thread timelines, and flame scope views. Three use cases drive adoption: incident response (identifying which functions became hot after a deployment), cost optimization (pinpointing where CPU and memory consumption occurs), and performance tuning (comparing P99 and P50 request paths through trace and span correlation).

The format introduces improvements over pprof. A dictionary-based deduplication system stores strings once in a string table and uses references throughout, reducing wire size by up to 40%. Stack traces become first-class citizens with single identifiers. A new "link" message provides direct correlation with traces and spans through trace ID and span ID fields.

The eBPF-based profiling receiver runs as a DaemonSet on Linux nodes, collecting data from all processes without requiring application instrumentation or restarts. It supports native languages (C, C++, Rust, and Go) and interpreted languages (Java, JavaScript/V8, PHP, Node.js, and Perl) through custom stack unwinders, at approximately 1% CPU overhead.

**Why this talk stood out:** A genuine milestone for the project. Profiling has been in the works for years, and seeing the alpha merged on stage gave the audience a tangible sense of progress. The trace-to-profile correlation built into the format is the feature that will make this signal more useful than standalone profilers.

### When OTTL goes off the rails: debugging transformations

**Edmo Vamerlatti Costa & Tyler Helmuth** | [Watch on YouTube](https://www.youtube.com/watch?v=465RlwgsNHg)

Tyler Helmuth (Honeycomb) and Edmo Vamerlatti Costa (Elastic) focus on the single most important prerequisite for writing correct OpenTelemetry Transformation Language (OTTL) statements: understanding how data looks inside the Collector. OTTL operates on P data, the Collector's internal representation that mirrors the OpenTelemetry protobuf data model. Guessing path names leads to statements that silently fail or prevent the Collector from starting.

The talk introduces three debugging tools. The debug exporter, configured with verbosity set to "detailed", prints the full telemetry payload to the console for verifying field names, attribute types, and values. Debug logs, enabled by setting the Collector's log level to debug, provide a step-by-step audit trail showing the transform context before any statement runs, whether each condition matched, and the state of data after each statement executes. The OTTL playground at ottl.run compiles the Collector to WebAssembly and runs it in a browser, offering visual diffs, breakpoints, and execution timing without needing a live Collector instance.

Three live demos illustrate common mistakes: a case-sensitive string match failing because the Collector sees lowercase text, a JSON body parse introducing an unexpected map key that corrupts subsequent statements, and a statement running under the wrong context that forces unnecessary iteration over every data point.

**Why this talk stood out:** OTTL adoption is growing, and the tooling has not kept pace until now. The OTTL playground alone is worth knowing about. This is the most immediately actionable talk on the list.

### OpenTelemetry Collector SIG: project updates

**Jade G, Dmitrii A, Alex B, Evan B & Antoine T** | [Watch on YouTube](https://www.youtube.com/watch?v=0zwLl8QGOdM)

The first-ever Collector SIG project update at KubeCon packed several significant changes into 35 minutes.

The biggest shift is the deprecation of the batch processor in favor of exporter-side batching. The original batch processor maintained its own in-memory buffer that could not propagate back-pressure errors from downstream queues. The new approach places batching after the sending queue in the exporter, supports configurable queue sizes in both item counts and bytes, and enables persistent queuing. For operators, this means removing the batch processor from pipelines and configuring batching under the exporter's sending queue section instead.

On the stability front, 25 modules have reached stable status after roughly 18 months of work on the 1.0 effort. The k8s attributes processor now aligns with OpenTelemetry semantic conventions and delivers around 20% memory reduction since version 0.147. OTTL and the transform processor reached beta, with a new inferred context feature that eliminates the need for users to specify OTTL contexts manually. The Prometheus receiver is approaching stabilization, with metric start time determination now handled by a dedicated processor.

Profiles reached alpha status with the OpenTelemetry proto 1.10 release, and a new prof receiver in contrib allows the Collector to report its own profiles. The eBPF profiler became an officially supported distribution. The team also introduced component-level attributes for the Collector's own telemetry, available behind a feature gate, with universal pipeline metrics measured at the framework level replacing per-component instrumentation.

**Why this talk stood out:** The batch processor deprecation alone affects nearly every Collector deployment in production. If you run the Collector and only watch one talk from this list, this is the one that will save you from a surprise in a future upgrade.

## What these talks have in common

Across all six picks, a pattern emerges: OpenTelemetry is past the "should we adopt it?" phase. The conversations have moved to how teams manage the complexity that comes with real-world deployments. DigitalOcean learned that adopting every available OTel component at once creates more problems than it solves. The Bluetooth team discovered that default scrape intervals hide entire workloads. The OTTL debugging talk exists because enough people are writing transformations in production to need dedicated tooling for when those transformations break. The Collector SIG is deprecating a processor that has been part of nearly every pipeline configuration since the project began.

These are signs of a maturing ecosystem, one where the hard problems are no longer "how do I get started?" but "how do I operate this well?"
