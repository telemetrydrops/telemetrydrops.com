---
title: "Three OpenTelemetry talks worth watching from KubeCon India 2026"
slug: "best-otel-talks-kubecon-india-2026"
description: "Our picks from KubeCon + CloudNativeCon India 2026: a Prometheus outage post-mortem, a deep dive into the hidden cost of telemetry format conversions, and how to instrument AI agents with OpenTelemetry."
publishedAt: 2026-07-04
author: "juraci"
tags: ["metrics", "architecture", "semantic-conventions"]
tldr: "Three KubeCon India 2026 talks worth your time: a Prometheus cardinality outage and its production fixes, a 20x performance win from Arrow-based telemetry pipelines, and instrumenting AI agents with OpenTelemetry's GenAI semantic conventions. Honorable mentions cover air-gapped observability and Bayesian clinical alerting."
keyTakeaways:
  - "Prometheus does not degrade gracefully under memory pressure — it goes blank instead of shedding load, so telemetry pipelines need the same back-pressure and capacity planning as production services"
  - "Format conversion between telemetry representations, not processing logic, is where most Collector CPU time goes — Arrow-based OTAP pipelines showed roughly 20x throughput over OTLP in early benchmarks"
  - "OpenTelemetry's GenAI semantic conventions plus eBPF zero-code instrumentation can capture full agent behavior — prompts, tool calls, and token usage — without redeploying every service"
---

KubeCon + CloudNativeCon India 2026 (June 18-19) ran a compact but dense observability track: nine talks covering OpenTelemetry, Prometheus reliability, service mesh telemetry, GPU inference monitoring, air-gapped environments, and AIOps. We picked three that stood out for how directly they apply to teams running OpenTelemetry in production, plus two honorable mentions worth your time if you have it.

## Who Watches the Watchers? From Closed Observability To Open Control at Scale

**Aditi Gupta (JioHotstar), Madhu Patel (Adobe) & Sandeep Kanabar (Gen)** | [Watch on YouTube](https://www.youtube.com/watch?v=nYxLSHljwxQ)

The talk opens with a 3 a.m. page: a GDPR compliance pipeline where a single upstream request fans out into 20 downstream responses, repeated over a five-day safety buffer. When upstream load grew from 10,000 to 2 million messages a day, the pipeline reached 1.4 billion messages in a week and crashed — but the more damaging failure was that nobody noticed, because the Grafana dashboards meant to confirm health were themselves blank. The monitoring stack had gone down under the same load.

The speakers trace this to three root causes: cardinality explosion (a single high-uniqueness label pushed Prometheus from thousands to millions of series and past its memory limit), a mismatch between block duration, block size, and compaction frequency that stayed invisible at small scale, and a 15-day local retention window that needlessly duplicated data already held for 90 days in Cortex. Their fix combines four production changes: active traffic shaping in the OpenTelemetry Collector (batching, tail sampling, and a hard memory limiter that rejects new data rather than let the process OOM), cardinality firewalling through recording rules and per-scrape sample limits, TSDB tuning that cut block duration from two hours to fifteen minutes, and bounded queues with exponential retry back-off between the Collector and Prometheus remote write. Together, these brought Prometheus memory from roughly 16 GB down to about 2 GB and reduced OOM crashes to zero.

**Why this talk stood out:** Cardinality explosions and Prometheus OOMs are a familiar failure mode, but the talk's real contribution is the framing: telemetry pipelines are distributed systems in their own right, and every label, span, or retained day carries a real, non-amortized cost that needs the same back-pressure and capacity planning you'd apply to a production service.

## The Invisible Tax: How Data Format Conversions Drive up Telemetry Pipeline Costs

**Cijo Thomas (Microsoft)** | [Watch on YouTube](https://www.youtube.com/watch?v=A-94_ip0IFo)

Renaming a log attribute is computationally trivial in isolation — millions of operations per second on a single CPU core. Real pipelines never get close to that throughput. Thomas shows why: before any transformation runs, incoming OTLP bytes must be decoded into the Collector's in-memory representation, and after processing, re-encoded back into bytes. In a pass-through Collector doing no processing at all, more than half of CPU time can go purely to decoding, and each additional transformation rule adds cost mainly because OTLP's row-oriented in-memory layout scatters attributes across memory rather than grouping them. The same problem compounds inside SDKs, where a log can pass through three or four in-memory shapes (logging library format, SDK format, generated Protobuf, then bytes) before it even reaches the wire — some telemetry passes through ten to twenty distinct shapes before it's queryable.

The proposed fix is to make the in-memory representation match the wire format: Apache Arrow, a columnar format with a wire counterpart (Arrow IPC), satisfies that plus supports bulk operations like renaming and filtering efficiently. OpenTelemetry's Arrow project built OTAP (OpenTelemetry Arrow Protocol) on top of this — losslessly convertible to and from OTLP — and an experimental Rust-based "data flow engine" that operates natively on Arrow batches with zero conversion. Benchmarks show around 100,000 logs/second for OTLP versus roughly 2.5 million logs/second for the Arrow-native path on a single core, a ~20x difference, and the Arrow-based engine's CPU usage stayed flat as more transformation rules were added, while the traditional Collector's climbed past 10% overhead after just four rules.

**Why this talk stood out:** It quantifies a cost every Collector operator pays but rarely measures. Phase three of the Arrow project now aims to extend this all the way into the SDK — worth watching if you operate collectors, gateways, or agent fleets at any real scale.

## What Did My Agent Do? Observability and Accountability for AI Agents

**Ishan Jain (Grafana Labs)** | [Watch on YouTube](https://www.youtube.com/watch?v=Bx_BU7dGyiI)

Jain's starting point is that large language models behave like black boxes even to the teams that built them: non-deterministic, expensive to run at scale, and prone to hallucination. When an AI response is wrong, engineers need to reconstruct exactly what happened — what context the model had, which chunk it retrieved, whether the system prompt itself was flawed. In traditional software, source code is ground truth for debugging; with AI, traces take that role instead, since the model's internals aren't inspectable.

The talk distinguishes LLM observability (prompts, responses, and token usage for a single model call) from agent observability, which also needs to capture which tools, MCP servers, workflows, and databases were invoked across a full agentic run. OpenTelemetry's GenAI semantic conventions define span names and attributes for exactly this, and Jain recommends OpenLIT, an OpenTelemetry-native SDK, over hand-rolled instrumentation for capturing that detail with less effort. For services that can't be redeployed, he pairs OpenTelemetry eBPF instrumentation (zero-code capture of LLM calls to providers like OpenAI or Anthropic) with OpenLIT: eBPF gives fast baseline coverage, OpenLIT enriches the same trace with agent- and tool-level detail. A live demo showed the difference directly — the eBPF-only trace captured input, output, and token usage but not which tools were invoked, while the combined trace showed exactly that. At production scale, where traces are too long to review manually, Jain's practical workaround is connecting an observability backend to an AI assistant via MCP and asking it to analyze why a trace behaved unexpectedly.

**Why this talk stood out:** A concrete, demoed answer to a question most teams are only starting to ask — how do you actually instrument an AI agent, not just the model call underneath it — using standards (GenAI semantic conventions) rather than a vendor-specific approach.

## Honorable mentions

Two more talks worth your time if you have it. **[Offline but Not Blind: Observability in Air-Gapped Kubernetes Environment](https://www.youtube.com/watch?v=Ith_TOa85Lw)** (Manoj Sardana, HCL Software) walks through building Kubernetes observability for banking and government clusters with no internet access, using OpenTelemetry and a self-hosted LGTM stack (Loki, Grafana, Tempo, Mimir), including a split-brain design so the monitoring system can watch itself without depending on itself. **[Patients as Time-Series: High-Stakes Clinical Alerting With OpenSearch & K8s](https://www.youtube.com/watch?v=Vn5OkBWVV5o)** (Seema Saharan & Aakanksha Saharan) makes a case that applies well beyond healthcare: replacing hard-threshold alerting with trajectory-aware, Bayesian probabilistic alerts that distinguish a system that's been stable for days from one that arrived at the same value after a sharp decline — directly applicable to AIOps and fraud detection.

## What these talks have in common

Each of the top three picks is really about the same question at a different layer: what does it cost to observe a system, and where does that cost actually come from? The Prometheus outage talk shows the cost of treating a telemetry pipeline as free infrastructure instead of a distributed system that needs its own reliability engineering. The invisible tax talk shows the cost hiding in plain sight inside every Collector and SDK, paid on every byte regardless of how little processing happens. And the AI agent talk shows a new category of telemetry cost and value emerging as agentic systems move into production, one that existing single-turn evaluation tools aren't built to capture yet. None of these are "should we adopt OpenTelemetry" conversations anymore — they're "how do we operate it well at the cost and scale we actually have" conversations.
