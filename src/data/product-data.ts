export interface ProductFeature {
  text: string;
}

export interface DetailedFeature {
  title: string;
  description: string;
}

export interface CurriculumModule {
  title: string;
  lessons: string[];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  features: ProductFeature[];
  detailedFeatures: DetailedFeature[];
  curriculum: CurriculumModule[];
  price: string;
  originalPrice?: string;
  discount?: {
    percentage: number;
    label: string;
    couponCode?: string;
  };
  ctaText: string;
  ctaLink: string;
  available: boolean;
  popular?: boolean;
}

export const productData: Product[] = [
  {
    id: "specialization",
    slug: "otel-specialization",
    title: "OTel Specialization",
    description: "Intensive training with weekly conversations and practical projects",
    fullDescription: "Our OpenTelemetry specialization is an immersive 8-week program with weekly conversations, practical projects, and personalized feedback from the best market experts.",
    features: [
      { text: "Limited cohort enrollment" },
      { text: "Weekly expert conversations" },
      { text: "Practical projects with personalized feedback" },
      { text: "Completion certificate" },
      { text: "Access to private student group" },
      { text: "Exclusive supplementary materials" }
    ],
    detailedFeatures: [
      {
        title: "Weekly conversations",
        description: "Weekly sessions with experts where you can ask questions and receive personalized guidance."
      },
      {
        title: "Practical projects",
        description: "Develop real projects that simulate production environments and receive detailed feedback."
      },
      {
        title: "Exclusive community",
        description: "Access to a private group where you can interact with other students and share experiences."
      },
      {
        title: "Recognized certificate",
        description: "Upon completing the course, you receive a certificate that attests to your OpenTelemetry skills."
      },
      {
        title: "Exclusive material",
        description: "Access to content, articles, and resources that aren't available anywhere else."
      },
      {
        title: "Priority support",
        description: "Direct channel with instructors to resolve technical questions throughout the program."
      }
    ],
    curriculum: [
      {
        title: "The Basics in 3 Lessons",
        lessons: [
          "Instrumenting an Application",
          "Visualizing Telemetry",
          "Placing a Collector in the Middle"
        ]
      },
      {
        title: "Fundamentals",
        lessons: [
          "Problems We Solve",
          "Audiences",
          "Project Philosophy",
          "Instrumentation",
          "Telemetry",
          "Observability",
          "Monitoring",
          "OpenTelemetry",
          "Bonus: Observability 2.0"
        ]
      },
      {
        title: "Observability Signals",
        lessons: [
          "Logs",
          "Metrics",
          "Traces",
          "Profiles",
          "Events"
        ]
      },
      {
        title: "OTel in Practice",
        lessons: [
          "What Are We Going to Observe?",
          "What Are Our Pain Points?",
          "Adding OTel SDK",
          "Instrumenting Our Initialization",
          "Observing HTTP Calls",
          "Propagating Context Manually",
          "New Spans, or Events?",
          "Understanding Normal Latency Between Services"
        ]
      },
      {
        title: "Data Model",
        lessons: [
          "Introduction",
          "Attributes",
          "Scope",
          "Resources",
          "Context",
          "Baggage",
          "Traces",
          "Metrics",
          "Logs",
          "Profiles",
          "Bonus: Entities"
        ]
      },
      {
        title: "OpenTelemetry API",
        lessons: [
          "Events",
          "Audience",
          "Tracing",
          "Metrics",
          "Profiles",
          "Log Bridge"
        ]
      },
      {
        title: "OpenTelemetry SDK",
        lessons: [
          "SDKs in Detail",
          "The Basics to Survive",
          "Resources",
          "Distributed Tracing",
          "Metrics",
          "Logs",
          "Using a Configuration File"
        ]
      },
      {
        title: "OpenTelemetry Collector",
        lessons: [
          "Introduction",
          "Component Types",
          "Getting the Collector",
          "Configuration",
          "Agents vs. Gateways vs. Collectors",
          "Monitoring Collectors",
          "OTTL - Introduction",
          "OTTL - Context",
          "OTTL - Advanced Cases",
          "Resilience Techniques - Queues",
          "Resilience Techniques - WAL",
          "Resilience Techniques - Messaging",
          "Security - TLS",
          "Security - Authentication",
          "Building Your Collector",
          "Connectors: Span Metrics",
          "Scaling the Collector"
        ]
      },
      {
        title: "Extending the Collector",
        lessons: [
          "Introduction",
          "Extensions",
          "Receivers",
          "Processors",
          "Exporters",
          "Connectors"
        ]
      },
      {
        title: "OpenTelemetry Operator",
        lessons: [
          "Introduction",
          "Operators for Kubernetes",
          "CRD - Collector",
          "Collector Operation Modes",
          "Installation",
          "CRD - Auto-Instrumentation",
          "Target Allocator"
        ]
      },
      {
        title: "OpAMP",
        lessons: [
          "OpAMP"
        ]
      },
      {
        title: "Architecture",
        lessons: [
          "Architecture - Instrumentation",
          "Architecture - Pipeline"
        ]
      },
      {
        title: "AI",
        lessons: [
          "A Glimpse of the Future",
          "AI for Observability",
          "Observability for AI"
        ]
      },
      {
        title: "Migration",
        lessons: [
          "Migration"
        ]
      },
      {
        title: "Observability Culture",
        lessons: [
          "Observability Culture"
        ]
      }
    ],
    price: "€999",
    ctaText: "Enroll now",
    ctaLink: "https://mn.dosedetelemetria.com/plans/1948548?bundle_token=f91ec446224acd04b2236784685ac72e&utm_source=website",
    available: false
  },
  {
    id: "track",
    slug: "otel-track",
    title: "OTel Track",
    description: "Complete course to learn at your own pace",
    fullDescription: "The OTel Track is a complete and self-guided course that allows you to master OpenTelemetry at your own pace. We are starting the recording process, with the first videos available soon and new videos coming every week.",
    features: [
      { text: "One year access to lessons" },
      { text: "Completion certificate" },
      { text: "In-depth content" },
      { text: "Content updates" }
    ],
    detailedFeatures: [
      {
        title: "Learn at your own pace",
        description: "Study when and where you want, with one year access to all course content."
      },
      {
        title: "In-depth content",
        description: "Over 80 lessons covering everything about OpenTelemetry."
      },
      {
        title: "Strong theoretical foundation",
        description: "Understand the 'why', not just the 'how'."
      },
      {
        title: "Digital certificate",
        description: "Upon completing the course, you receive a certificate that you can add to your resume and LinkedIn."
      },
      {
        title: "Beyond technical aspects",
        description: "Learn about architecture, migration, observability culture."
      },
      {
        title: "Constant updates",
        description: "The course is regularly updated to keep up with OpenTelemetry developments."
      }
    ],
    curriculum: [
      {
        title: "The Basics in 3 Lessons",
        lessons: [
          "Instrumenting an Application",
          "Visualizing Telemetry",
          "Placing a Collector in the Middle"
        ]
      },
      {
        title: "Fundamentals",
        lessons: [
          "Problems We Solve",
          "Audiences",
          "Project Philosophy",
          "Instrumentation",
          "Telemetry",
          "Observability",
          "Monitoring",
          "OpenTelemetry",
          "Bonus: Observability 2.0"
        ]
      },
      {
        title: "Observability Signals",
        lessons: [
          "Logs",
          "Metrics",
          "Traces",
          "Profiles",
          "Events"
        ]
      },
      {
        title: "OTel in Practice",
        lessons: [
          "What Are We Going to Observe?",
          "What Are Our Pain Points?",
          "Adding OTel SDK",
          "Instrumenting Our Initialization",
          "Observing HTTP Calls",
          "Propagating Context Manually",
          "New Spans, or Events?",
          "Understanding Normal Latency Between Services"
        ]
      },
      {
        title: "Data Model",
        lessons: [
          "Introduction",
          "Attributes",
          "Scope",
          "Resources",
          "Context",
          "Baggage",
          "Traces",
          "Metrics",
          "Logs",
          "Profiles",
          "Bonus: Entities"
        ]
      },
      {
        title: "OpenTelemetry API",
        lessons: [
          "Events",
          "Audience",
          "Tracing",
          "Metrics",
          "Profiles",
          "Log Bridge"
        ]
      },
      {
        title: "OpenTelemetry SDK",
        lessons: [
          "SDKs in Detail",
          "The Basics to Survive",
          "Resources",
          "Distributed Tracing",
          "Metrics",
          "Logs",
          "Using a Configuration File"
        ]
      },
      {
        title: "OpenTelemetry Collector",
        lessons: [
          "Introduction",
          "Component Types",
          "Getting the Collector",
          "Configuration",
          "Agents vs. Gateways vs. Collectors",
          "Monitoring Collectors",
          "OTTL - Introduction",
          "OTTL - Context",
          "OTTL - Advanced Cases",
          "Resilience Techniques - Queues",
          "Resilience Techniques - WAL",
          "Resilience Techniques - Messaging",
          "Security - TLS",
          "Security - Authentication",
          "Building Your Collector",
          "Connectors: Span Metrics",
          "Scaling the Collector"
        ]
      },
      {
        title: "Extending the Collector",
        lessons: [
          "Introduction",
          "Extensions",
          "Receivers",
          "Processors",
          "Exporters",
          "Connectors"
        ]
      },
      {
        title: "OpenTelemetry Operator",
        lessons: [
          "Introduction",
          "Operators for Kubernetes",
          "CRD - Collector",
          "Collector Operation Modes",
          "Installation",
          "CRD - Auto-Instrumentation",
          "Target Allocator"
        ]
      },
      {
        title: "OpAMP",
        lessons: [
          "OpAMP"
        ]
      },
      {
        title: "Architecture",
        lessons: [
          "Architecture - Instrumentation",
          "Architecture - Pipeline"
        ]
      },
      {
        title: "AI",
        lessons: [
          "A Glimpse of the Future",
          "AI for Observability",
          "Observability for AI"
        ]
      },
      {
        title: "Migration",
        lessons: [
          "Migration"
        ]
      },
      {
        title: "Observability Culture",
        lessons: [
          "Observability Culture"
        ]
      }
    ],
    price: "€499",
    ctaText: "Buy now",
    ctaLink: "https://mn.dosedetelemetria.com/plans/1948557?bundle_token=f9f52783d3655e0c2be14c012bab2ab5&utm_source=website",
    available: true,
    popular: true
  }
];

// For linking testimonials to specific products
export const productTestimonialMapping = {
  "specialization": ["claudio", "willian", "rafael"],
  "track": ["mateus", "willian", "claudio"]
};

// Helper functions to get testimonials
export function getTestimonialsForProduct(productId: string): string[] {
  return productTestimonialMapping[productId as keyof typeof productTestimonialMapping] || [];
}

export function getRandomTestimonialIds(count: number): string[] {
  const allTestimonials = Object.values(productTestimonialMapping).flat();
  const uniqueTestimonials = Array.from(new Set(allTestimonials));
  return uniqueTestimonials.sort(() => Math.random() - 0.5).slice(0, count);
}