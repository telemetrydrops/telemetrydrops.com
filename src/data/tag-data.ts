export interface TagInfo {
  displayName: string;
  description: string;
}

export const VALID_TAGS = [
  "collector",
  "instrumentation",
  "traces",
  "metrics",
  "logs",
  "sampling",
  "cost-optimization",
  "ottl",
  "kubernetes",
  "semantic-conventions",
  "architecture",
  "security",
] as const;

export type ValidTag = (typeof VALID_TAGS)[number];

export const tagInfo: Record<ValidTag, TagInfo> = {
  collector: {
    displayName: "Collector",
    description: "OpenTelemetry Collector architecture, components, configuration, and deployment patterns.",
  },
  instrumentation: {
    displayName: "Instrumentation",
    description: "SDK usage, auto-instrumentation, and manual instrumentation patterns.",
  },
  traces: {
    displayName: "Traces",
    description: "Distributed tracing, spans, and context propagation.",
  },
  metrics: {
    displayName: "Metrics",
    description: "Metric types, cardinality, and Prometheus interop.",
  },
  logs: {
    displayName: "Logs",
    description: "Log collection, deduplication, and routing.",
  },
  sampling: {
    displayName: "Sampling",
    description: "Head sampling, tail sampling, and rate limiting.",
  },
  "cost-optimization": {
    displayName: "Cost Optimization",
    description: "Telemetry governance, volume reduction, and efficient pipelines.",
  },
  ottl: {
    displayName: "OTTL",
    description: "OpenTelemetry Transformation Language.",
  },
  kubernetes: {
    displayName: "Kubernetes",
    description: "Operator, target allocator, and Kubernetes-specific patterns.",
  },
  "semantic-conventions": {
    displayName: "Semantic Conventions",
    description: "Naming, resource attributes, and signal conventions.",
  },
  architecture: {
    displayName: "Architecture",
    description: "Pipeline design, deployment patterns, and scaling.",
  },
  security: {
    displayName: "Security",
    description: "Pipeline security, authentication, and data privacy.",
  },
};
