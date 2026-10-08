---
title: "What happens when your telemetry backend goes down?"
slug: "collector-backend-outage"
description: "Follow a backend outage through the OpenTelemetry Collector's retries, queues, and persistent storage—and test what survives a Collector restart."
publishedAt: 2026-10-16
author: "juraci"
tags: ["collector", "architecture"]
tldr: "A sending queue buys time during a backend outage. Persistent storage lets queued telemetry survive a Collector restart. Neither removes capacity limits or guarantees delivery: test the failure boundaries before you need them."
keyTakeaways:
  - "Retries handle temporary export failures; queue capacity determines how much incoming telemetry can wait."
  - "A persistent exporter queue protects data that reaches it, provided the storage survives the restart."
  - "Recovery requires export capacity above the ongoing ingestion rate, or the backlog cannot drain."
  - "Test backend outages and Collector restarts separately, and verify individual records at the destination."
faqEntries:
  - question: "Does the OpenTelemetry Collector lose data when a backend is unavailable?"
    answer: "It can buffer data and retry temporary failures, but data can still be lost through queue overflow, exhausted retries, permanent export errors, or failures elsewhere in the pipeline. The outcome depends on the configured exporter and upstream retry behavior."
  - question: "Does file_storage make the entire Collector pipeline persistent?"
    answer: "No. When referenced by sending_queue.storage, it persists that exporter's queue. Data still buffered in an SDK or an earlier processor is outside that protection, and the storage volume must survive the Collector restart."
  - question: "Does max_elapsed_time set the maximum age of queued telemetry?"
    answer: "No. It limits a request's export retry sequence, rather than acting as a queue-wide retention policy. Setting it to zero removes that retry deadline, but does not remove queue capacity limits or make permanent errors retryable."
---

Your application is healthy. Requests are completing, logs are being emitted, and the Collector is running. Then your observability backend becomes unavailable.

For a while, nothing obvious changes. The Collector keeps receiving telemetry. Your dashboards stop moving. When the backend recovers, you discover a gap covering exactly the period you wanted to investigate.

Where did the data go?

The resilience lessons in our OTel Track work through three layers: in-memory queues, persistent queues, and external messaging. To choose between them, start with the failure you need to survive. A backend outage and a Collector restart ask different things of your pipeline.

## Follow the failed export backward

Consider this path:

```text
Application → Collector receiver → processors → exporter queue → backend
```

When the backend stops accepting data, exporter workers encounter failures. For retryable errors, they wait and try again. Meanwhile, new telemetry fills the sending queue. A short outage can end before either capacity or retries run out. A longer one exposes those limits. The [Collector resiliency guide](https://opentelemetry.io/docs/collector/resiliency/) describes both failure boundaries.

There are two separate questions here: how long should a worker keep trying to export a request, and how much additional data can wait behind it?

Retry time cannot answer the capacity question. A queue cannot make a permanent export error retryable.

## Retries buy opportunities; queues buy capacity

For the OTLP exporter in Collector Contrib 0.143.0, you can make the policy explicit:

```yaml
exporters:
  otlp/backend:
    endpoint: backend:4317
    tls:
      insecure: true
    retry_on_failure:
      enabled: true
      initial_interval: 1s
      max_interval: 5s
      max_elapsed_time: 10m
    sending_queue:
      enabled: true
      sizer: requests
      queue_size: 5000
      num_consumers: 4
```

The plaintext connection is for a local lab. Use your destination's TLS and authentication configuration in production.

Here, capacity is measured in requests, not spans or bytes. `max_elapsed_time` limits a request's retry sequence; it does not set a retention period for the whole queue. Setting it to `0` removes that deadline, but permanent errors still terminate retries. See the version-pinned [exporter helper configuration](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.143.0/exporter/exporterhelper/README.md) and [retry implementation](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.143.0/exporter/exporterhelper/internal/retry_sender.go).

Suppose you measure 20 requests per second arriving at an initially empty exporter queue. During a complete outage, 5,000 request slots give roughly 250 seconds of buffering. This is a planning estimate: request sizes, occupied slots, in-flight work, and traffic bursts affect the result.

Now ask about recovery. If the backend accepts 30 requests per second while 20 new requests per second keep arriving, only 10 requests per second go toward the backlog. A backlog of 5,000 requests would take about 500 seconds to drain under those assumptions.

An outage budget needs a recovery budget too. If export throughput merely matches ingestion, the backlog stays with you.

## Backpressure has to reach something that can retry

With the queue's default nonblocking overflow behavior, a full queue rejects new enqueue attempts. Whether those records are recovered depends on the components upstream. Trace the error path all the way back to the source instead of assuming that every rejected record will be retried.

Memory pressure introduces another boundary. The `memory_limiter` processor can refuse incoming data with a non-permanent error, allowing compatible upstream components to retry. Put it first in the processor list, and size the process with headroom. It helps protect the Collector from exhausting memory; it does not provide storage. The [memory limiter documentation](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.143.0/processor/memorylimiterprocessor/README.md) explains these responsibilities.

## A Collector restart is a different failure

An in-memory queue can bridge a backend outage while the Collector remains alive. Kill the Collector, and the queued data has no durable home.

An exporter queue backed by `file_storage` addresses that restart boundary. The extension must be enabled under `service.extensions` and referenced by `sending_queue.storage`. Its directory needs writable storage that survives replacement of the Collector process or container. See the [file storage extension](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/v0.143.0/extension/storage/filestorage/README.md).

That protection starts when data reaches the persistent queue. A separate batch processor can still hold data earlier in the pipeline. Its size threshold and timeout control flushing, rather than disk persistence. See the [batch processor documentation](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.143.0/processor/batchprocessor/README.md).

This distinction makes a useful test: send an identifiable record while the backend is down, confirm it reaches the exporter queue, kill the Collector, and then look for that same record after recovery.

## Try the outage yourself

This lab uses two Collectors. One is the gateway under test; the other stands in for the backend and prints received logs. It pins Contrib **0.143.0** for reproducibility, rather than claiming to use the latest release.

Save these three files in an empty directory. In `gateway.yaml`, deliberately omit a separate batch processor so this experiment isolates the exporter queue:

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 256
    spike_limit_mib: 64

extensions:
  file_storage:
    directory: /var/lib/otelcol/storage
    create_directory: true
    fsync: true

exporters:
  otlp/backend:
    endpoint: backend:4317
    tls:
      insecure: true
    retry_on_failure:
      enabled: true
      initial_interval: 1s
      max_interval: 5s
      max_elapsed_time: 0
    sending_queue:
      enabled: true
      sizer: requests
      queue_size: 100
      num_consumers: 1
      storage: file_storage

service:
  extensions: [file_storage]
  pipelines:
    logs:
      receivers: [otlp]
      processors: [memory_limiter]
      exporters: [otlp/backend]
```

Use `backend.yaml` to make delivery visible:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
exporters:
  debug:
    verbosity: detailed
service:
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [debug]
```

Finally, save `compose.yaml`:

```yaml
name: collector-outage-lab
services:
  gateway:
    image: otel/opentelemetry-collector-contrib:0.143.0
    user: "0:0"
    mem_limit: 512m
    environment:
      GOMEMLIMIT: 200MiB
    ports:
      - "127.0.0.1:14318:4318"
    volumes:
      - ./gateway.yaml:/etc/otelcol-contrib/config.yaml:ro,z
      - queue-data:/var/lib/otelcol
  backend:
    image: otel/opentelemetry-collector-contrib:0.143.0
    mem_limit: 512m
    volumes:
      - ./backend.yaml:/etc/otelcol-contrib/config.yaml:ro,z
volumes:
  queue-data:
```

The gateway runs as root only to simplify named-volume permissions in this local lab. In production, give the Collector's service user ownership of its storage directory. The named volume is what preserves the queue when we recreate the container.

Validate and start the configuration:

```bash
docker compose run --rm --no-deps gateway validate --config /etc/otelcol-contrib/config.yaml
docker compose run --rm --no-deps backend validate --config /etc/otelcol-contrib/config.yaml
docker compose up -d
docker compose stop backend
```

Send one record with a distinctive body. Wait for the gateway's startup message if the request initially cannot connect:

```bash
curl --fail-with-body http://localhost:14318/v1/logs \
  -H 'Content-Type: application/json' \
  --data '{"resourceLogs":[{"resource":{"attributes":[{"key":"service.name","value":{"stringValue":"outage-lab"}}]},"scopeLogs":[{"scope":{"name":"outage-lab"},"logRecords":[{"severityNumber":9,"severityText":"INFO","body":{"stringValue":"survive-restart-001"}}]}]}]}'
```

Inspect the gateway logs for export retry messages. A successful response from the gateway alone does not prove backend delivery.

```bash
docker compose logs gateway
```

Once the gateway is retrying, kill it and recreate its container while the backend remains stopped:

```bash
docker compose kill -s SIGKILL gateway
docker compose up -d --no-deps --force-recreate gateway
docker compose start backend
docker compose logs -f backend
```

Look for `survive-restart-001` in the backend's output. Its arrival demonstrates recovery of that record across both the backend outage and the gateway process failure. It does not establish an exactly-once guarantee or prove survival of a disk failure.

For a comparison, remove `storage: file_storage` from `sending_queue`, clean up the lab, and repeat with a different marker. Killing the gateway then removes the in-memory buffer before the backend can receive it.

Running these experiments with the pinned image produced the following results:

| Queue | Record sent while backend was stopped | Result after gateway crash and backend recovery |
| --- | --- | --- |
| Persistent | `survive-restart-001` | Appeared in the backend's debug output |
| In memory | `memory-only-001` | Did not appear; a fresh `recovery-control-001` record did arrive |

The control record checks that the second experiment's missing marker was not simply caused by a backend that remained unavailable.

After each experiment, stop the log follower with Ctrl+C and clean up:

```bash
docker compose down -v
```

The `-v` deletes this lab's queue volume. Wait until you have finished inspecting the results.

## Watch recovery as closely as the outage

A running process is only one piece of evidence. Track exporter queue occupancy and capacity, enqueue failures, receiver refusals, and successful exports. For logs, useful metric names include `otelcol_exporter_queue_size`, `otelcol_exporter_queue_capacity`, `otelcol_exporter_enqueue_failed_log_records`, and `otelcol_exporter_sent_log_records`. Export format and version can affect their rendered names; check the [internal telemetry documentation](https://opentelemetry.io/docs/collector/internal-telemetry/).

Pair those measurements with an identifiable record at the destination. A shrinking queue is encouraging, but you still need to establish whether data was delivered or discarded. Keep a monitoring path available during the backend outage you are testing.

## When local persistence is not enough

If the failure budget includes losing a gateway's storage, or retaining a substantial backlog independently of Collector instances, an external broker such as Kafka may fit the requirements. That introduces its own retention, replication, capacity, and operational decisions.

Also inspect when the consuming Collector marks messages as processed. Acceptance into a downstream asynchronous buffer is a different milestone from successful backend delivery. The [Kafka receiver configuration](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/v0.143.0/receiver/kafkareceiver/README.md) exposes message-marking and commit controls; test the complete path rather than treating Kafka as a blanket delivery guarantee.

Before sizing a production pipeline, write down the outage it must tolerate: expected arrival rate, maximum downtime, whether the Collector or its disk may disappear, acceptable loss, and required catch-up time. Then run that failure against the design.

These are the questions we explore in the queues, WAL, messaging, and monitoring lessons of the [OTel Track](/products/otel-track/). The most useful result is a measured answer to: **when this backend fails, which telemetry survives, and how do we know?**
