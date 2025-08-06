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
          "Instrumenting an application",
          "Visualizing telemetry",
          "Placing a Collector in the middle"
        ]
      },
      {
        title: "Fundamentals",
        lessons: [
          "Problems we solve",
          "Audiences",
          "Project philosophy",
          "Instrumentation",
          "Telemetry",
          "Observability",
          "Monitoring",
          "OpenTelemetry",
          "Bonus: Observability 2.0"
        ]
      },
      {
        title: "Observability signals",
        lessons: [
          "Logs",
          "Metrics",
          "Traces",
          "Profiles",
          "Events"
        ]
      },
      {
        title: "OTel in practice",
        lessons: [
          "What are we going to observe?",
          "What are our pain points?",
          "Adding the OTel SDK",
          "Instrumenting our initialization",
          "Observing HTTP calls",
          "New spans, or events?",
          "Understanding normal latency between services",
          "Propagating context manually"
        ]
      },
      {
        title: "Data model",
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
          "Audience",
          "Tracing",
          "Metrics"
        ]
      },
      {
        title: "OpenTelemetry SDK",
        lessons: [
          "The basics to survive",
          "SDKs in detail",
          "Using a configuration file"
        ]
      },
      {
        title: "OpenTelemetry Collector",
        lessons: [
          "Introduction",
          "Component types",
          "Getting the Collector",
          "Configuration",
          "Agents vs. Gateways vs. Collectors",
          "Scaling the Collector",
          "Monitoring Collectors",
          "OTTL",
          "Resilience techniques",
          "Security",
          "Building your Collector"
        ]
      },
      {
        title: "Extending the Collector",
        lessons: [
          "Introduction",
          "Receivers",
          "Processors",
          "Exporters",
          "Extensions",
          "Connectors"
        ]
      },
      {
        title: "OpenTelemetry Operator",
        lessons: [
          "Coming soon",
        ]
      },
      {
        title: "OpAMP",
        lessons: [
          "Coming soon",
        ]
      },
      {
        title: "Architecture",
        lessons: [
          "Coming soon",
        ]
      },
      {
        title: "Interoperability",
        lessons: [
          "Coming soon",
        ]
      },
      {
        title: "Migration",
        lessons: [
          "Coming soon",
        ]
      },
      {
        title: "Observability culture",
        lessons: [
          "Coming soon",
        ]
      }
    ],
    price: "€2,497",
    ctaText: "Join waitlist",
    ctaLink: "/waiting-list",
    available: false
  },
  {
    id: "track",
    slug: "otel-track",
    title: "OTel Track",
    description: "Complete course to learn at your own pace",
    fullDescription: "The OTel Track is a complete and self-guided course that allows you to master OpenTelemetry at your own pace. The last modules will be completed by the end of April.",
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
        description: "Over 50 lessons covering everything about OpenTelemetry."
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
          "Instrumenting an application",
          "Visualizing telemetry",
          "Placing a Collector in the middle"
        ]
      },
      {
        title: "Fundamentals",
        lessons: [
          "Problems we solve",
          "Audiences",
          "Project philosophy",
          "Instrumentation",
          "Telemetry",
          "Observability",
          "Monitoring",
          "OpenTelemetry",
          "Bonus: Observability 2.0"
        ]
      },
      {
        title: "Observability signals",
        lessons: [
          "Logs",
          "Metrics",
          "Traces",
          "Profiles",
          "Events"
        ]
      },
      {
        title: "OTel in practice",
        lessons: [
          "What are we going to observe?",
          "What are our pain points?",
          "Adding the OTel SDK",
          "Instrumenting our initialization",
          "Observing HTTP calls",
          "New spans, or events?",
          "Understanding normal latency between services",
          "Propagating context manually"
        ]
      },
      {
        title: "Data model",
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
          "Audience",
          "Tracing",
          "Metrics"
        ]
      },
      {
        title: "OpenTelemetry SDK",
        lessons: [
          "The basics to survive",
          "SDKs in detail",
          "Using a configuration file"
        ]
      },
      {
        title: "OpenTelemetry Collector",
        lessons: [
          "Introduction",
          "Component types",
          "Getting the Collector",
          "Configuration",
          "Agents vs. Gateways vs. Collectors",
          "Scaling the Collector",
          "Monitoring Collectors",
          "OTTL",
          "Resilience techniques",
          "Security",
          "Building your Collector"
        ]
      },
      {
        title: "Extending the Collector",
        lessons: [
          "Introduction",
          "Receivers",
          "Processors",
          "Exporters",
          "Extensions",
          "Connectors"
        ]
      },
      {
        title: "OpenTelemetry Operator",
        lessons: [
          "Coming soon",
        ]
      },
      {
        title: "OpAMP",
        lessons: [
          "Coming soon",
        ]
      },
      {
        title: "Architecture",
        lessons: [
          "Coming soon",
        ]
      },
      {
        title: "Interoperability",
        lessons: [
          "Coming soon",
        ]
      },
      {
        title: "Migration",
        lessons: [
          "Coming soon",
        ]
      },
      {
        title: "Observability culture",
        lessons: [
          "Coming soon",
        ]
      }
    ],
    price: "€597",
    ctaText: "Buy now",
    ctaLink: "https://mn.dosedetelemetria.com/plans/1891200?bundle_token=d45d84d8fe78847f490ec416f9326179&utm_source=website",
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

export function getRandomTestimonials(count: number): string[] {
  const allTestimonials = Object.values(productTestimonialMapping).flat();
  const uniqueTestimonials = [...new Set(allTestimonials)];
  return uniqueTestimonials.sort(() => Math.random() - 0.5).slice(0, count);
}