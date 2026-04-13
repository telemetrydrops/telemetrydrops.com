---
title: "Route your logs by severity with the OpenTelemetry Collector"
slug: "severity-based-log-routing"
description: "How to use the OpenTelemetry Collector's routing connector to split logs by severity, sending critical logs to your vendor and archiving the rest to cheaper storage."
publishedAt: 2026-04-01
author: "juraci"
tags: ["collector", "logs", "cost-optimization"]
tldr: "Use the routing connector to send WARN/ERROR logs to your vendor and archive DEBUG/INFO to cheap storage. Split by severity at the pipeline level, not at the application."
keyTakeaways:
  - "The routing connector evaluates each log record and directs it to the right pipeline based on severity"
  - "Use action: move to avoid duplicating logs across pipelines"
  - "Tune batch processors per destination — low latency for vendors, high throughput for archives"
  - "The severity threshold is a policy decision — adjust based on your log distribution and operational needs"
faqEntries:
  - question: "How do I route logs by severity in the OpenTelemetry Collector?"
    answer: "Use the routing connector with a condition like severity_number >= SEVERITY_NUMBER_WARN. Logs matching the condition go to one pipeline, and everything else falls through to the default pipeline."
  - question: "What is the difference between action move and copy in the routing connector?"
    answer: "With action: move, matched logs go to exactly one destination. With the default copy behavior, matched logs are sent to both the matched pipeline and the default pipeline, causing duplication."
---

Not all logs deserve the same storage tier. ERROR and WARN messages demand fast query performance because they trigger alerts and drive incident investigation. DEBUG and INFO messages serve a different purpose: they provide context when you need to understand what happened before an error. These forensic logs can tolerate slower query performance in exchange for lower storage costs.

The OpenTelemetry Collector's routing connector makes this split straightforward. You define a condition based on severity, and the connector directs each log record to the right pipeline.

## The configuration

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

connectors:
  routing:
    default_pipelines: [logs/standard]
    error_mode: ignore
    table:
      - context: log
        condition: severity_number >= SEVERITY_NUMBER_WARN
        action: move
        pipelines: [logs/critical]

exporters:
  debug/critical:
    verbosity: detailed
  debug/standard:
    verbosity: detailed

service:
  telemetry:
    logs:
      level: info
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [routing]
    logs/critical:
      receivers: [routing]
      exporters: [debug/critical]
    logs/standard:
      receivers: [routing]
      exporters: [debug/standard]
```

Three pipelines form the routing topology. The first pipeline receives all logs via OTLP and exports to the routing connector. The connector evaluates each log record: those with `severity_number >= SEVERITY_NUMBER_WARN` (13 or higher, covering WARN, ERROR, and FATAL) move to the critical pipeline. Everything else falls through to the standard pipeline via `default_pipelines`.

A few details worth noting. The `context: log` setting means the condition evaluates per individual log record, not per resource batch. The `action: move` ensures matched logs go to exactly one destination; without it, the default `copy` behavior sends matched logs to both the matched pipeline and the default pipeline. And `error_mode: ignore` prevents OTTL evaluation errors from dropping data in production.

## Try it locally

Start the collector:

```bash
otelcol-contrib --config config.yaml
```

Send logs at different severity levels using `telemetrygen`:

```bash
# WARN logs -> routed to critical pipeline
telemetrygen logs --otlp-insecure --logs 2 \
  --severity-number 13 --severity-text WARN \
  --body "disk usage above threshold"

# ERROR logs -> routed to critical pipeline
telemetrygen logs --otlp-insecure --logs 2 \
  --severity-number 17 --severity-text ERROR \
  --body "connection refused to database"

# INFO logs -> routed to standard pipeline
telemetrygen logs --otlp-insecure --logs 2 \
  --severity-number 9 --severity-text INFO \
  --body "request processed successfully"

# DEBUG logs -> routed to standard pipeline
telemetrygen logs --otlp-insecure --logs 2 \
  --severity-number 5 --severity-text DEBUG \
  --body "cache lookup key=user-123"
```

The collector output confirms the split. WARN and ERROR logs appear under `debug/critical`, while INFO and DEBUG logs appear under `debug/standard`.

## From demo to production

In a real deployment, replace the debug exporters with actual backends. The critical pipeline exports to your observability vendor (Grafana Cloud, Datadog, or similar) with aggressive batching for near-real-time delivery. The standard pipeline exports to cheaper storage like local files or object storage with relaxed batching for write efficiency.

```yaml
exporters:
  otlp/vendor:
    endpoint: your-vendor-endpoint:4317

  file/archive:
    path: ./archive.jsonl
    rotation:
      max_megabytes: 100
      max_days: 7

processors:
  batch/vendor:
    timeout: 1s
    send_batch_size: 1024

  batch/archive:
    timeout: 10s
    send_batch_size: 5000
```

Each pipeline gets its own batch processor tuned to its destination. Vendor pipelines want low latency for alerting. Archive pipelines want throughput for efficient writes.

## Where the threshold goes

The example routes WARN and above to the vendor. This is a policy decision. If your team relies on INFO logs for operational dashboards, shift the threshold to `SEVERITY_NUMBER_INFO` and archive only DEBUG and TRACE levels. The cost impact depends on your log distribution: if 90% of your volume is DEBUG, archiving DEBUG yields substantial savings. If INFO dominates, you may need to archive INFO as well to see meaningful reduction.
