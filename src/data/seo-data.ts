export const seoData = {
  home: {
    title: "OpenTelemetry Training Courses | Expert-Led OTel Education",
    description: "Master OpenTelemetry with expert-led courses. Learn observability, distributed tracing, and telemetry instrumentation from OpenTelemetry project contributors. Get certified today!",
    keywords: "OpenTelemetry training, OTel course, observability training, distributed tracing course, telemetry instrumentation, OpenTelemetry certification",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "TelemetryDrops",
      "url": "https://telemetrydrops.com",
      "logo": "https://telemetrydrops.com/logo.svg",
      "description": "Expert OpenTelemetry training and education",
      "sameAs": [
        "https://www.youtube.com/@TelemetryDrops",
        "https://www.linkedin.com/company/telemetrydrops"
      ]
    }
  },
  products: {
    title: "OpenTelemetry Courses & Specialization Programs",
    description: "Choose from self-paced OpenTelemetry courses or intensive specialization programs. Learn from project contributors with hands-on projects and certification.",
    keywords: "OpenTelemetry course, OTel specialization, observability certification, OpenTelemetry training program",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "OpenTelemetry Training Courses",
      "description": "Comprehensive OpenTelemetry training programs"
    }
  },
  otelTrack: {
    title: "Complete OpenTelemetry Course - Self-Paced Learning | €597",
    description: "Master OpenTelemetry at your own pace with our comprehensive course. 50+ lessons covering API, SDK, Collector, and more. Get certified in observability and telemetry.",
    keywords: "OpenTelemetry course, OTel track, self-paced learning, observability course, telemetry training, OpenTelemetry certification",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "OTel Track",
      "description": "Complete course to learn OpenTelemetry at your own pace",
      "provider": {
        "@type": "Organization",
        "name": "TelemetryDrops"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "duration": "P365D"
      },
      "offers": {
        "@type": "Offer",
        "price": "597",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      }
    }
  },
  otelSpecialization: {
    title: "Premium OpenTelemetry Training - 8-Week Intensive Program",
    description: "Elite OpenTelemetry specialization with weekly mentoring, practical projects, and personalized feedback. Limited cohort enrollment with expert instructors.",
    keywords: "OpenTelemetry specialization, OTel intensive training, observability mentoring, OpenTelemetry expert training",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "OTel Specialization",
      "description": "Intensive training with weekly conversations and practical projects",
      "provider": {
        "@type": "Organization",
        "name": "TelemetryDrops"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "duration": "P8W"
      },
      "offers": {
        "@type": "Offer",
        "price": "2497",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/PreOrder"
      }
    }
  }
};