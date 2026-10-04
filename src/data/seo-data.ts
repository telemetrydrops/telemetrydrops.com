import { productData, type Product } from "./product-data";

export function courseSchema(product: Product) {
  const url = `https://telemetrydrops.com/products/${product.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: product.title,
    description: product.fullDescription,
    url,
    provider: { "@type": "Organization", "@id": "https://telemetrydrops.com/#organization", name: "Telemetry Drops", url: "https://telemetrydrops.com/" },
    offers: {
      "@type": "Offer",
      url,
      price: product.price.replace(/[^\d.]/g, ""),
      priceCurrency: "EUR",
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}

export const seoData = {
  home: {
    title: "OpenTelemetry Training by Project Contributors",
    description: "Learn OpenTelemetry instrumentation, SDKs and Collector pipelines with project contributors. Compare self-paced courses and mentored training.",
    keywords: "OpenTelemetry training, OTel course, observability training, distributed tracing course, telemetry instrumentation, OpenTelemetry education",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://telemetrydrops.com/#organization",
      "name": "Telemetry Drops",
      "alternateName": "TelemetryDrops",
      "legalName": "Dose de Telemetria GmbH",
      "url": "https://telemetrydrops.com/",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "contact@telemetrydrops.com",
        "telephone": "+49 176 4655-4626",
        "contactType": "customer support"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Hauptstr. 14",
        "postalCode": "13158",
        "addressLocality": "Berlin",
        "addressCountry": "DE"
      },
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
    description: "Choose from self-paced OpenTelemetry courses or intensive specialization programs. Learn from project contributors with hands-on projects and completion certificates.",
    keywords: "OpenTelemetry course, OTel specialization, observability certification, OpenTelemetry training program",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "OpenTelemetry Training Courses",
      "description": "Comprehensive OpenTelemetry training programs",
      "itemListElement": productData.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://telemetrydrops.com/products/${product.slug}/`,
        item: courseSchema(product),
      }))
    }
  },
  otelTrack: {
    title: "Self-Paced OpenTelemetry Course: OTel Track",
    description: "Master OpenTelemetry at your own pace with our comprehensive course. Over 80 lessons covering API, SDK, Collector, and more. Includes one year of access and a completion certificate.",
    keywords: "OpenTelemetry course, OTel track, self-paced learning, observability course, telemetry training, OpenTelemetry education",
  },
  otelSpecialization: {
    title: "Mentored OpenTelemetry Training: Specialization",
    description: "Eight-week OpenTelemetry specialization with weekly mentoring, practical projects, and personalized feedback. Limited cohort enrollment with expert instructors.",
    keywords: "OpenTelemetry specialization, OTel intensive training, observability mentoring, OpenTelemetry expert training",
  },
  podcast: {
    title: "OTel Drops Podcast – Weekly OpenTelemetry Updates",
    description: "OTel Drops is your weekly digest of everything happening in the OpenTelemetry community. AI-hosted, curated by OTel maintainer Juraci Paixão Kröhling. New episodes every week on Spotify.",
    keywords: "OTel Drops, OpenTelemetry podcast, OTel podcast, observability podcast, OpenTelemetry community, weekly OTel updates, Bianca, Florian",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "PodcastSeries",
      "name": "OTel Drops",
      "description": "Weekly OpenTelemetry community updates. AI-hosted, curated by Juraci Paixão Kröhling.",
      "url": "https://telemetrydrops.com/podcast",
      "producer": {
        "@type": "Organization",
        "name": "TelemetryDrops",
        "url": "https://telemetrydrops.com"
      },
      "sameAs": [
        "https://open.spotify.com/show/3xJnu5gEUbBoqRbd5lzwLO"
      ]
    }
  },
  events: {
    title: "OpenTelemetry Workshops & Training Events",
    description: "In-person and virtual OpenTelemetry workshops led by project contributors. Master Collector architecture, pipelines, transformations, and production deployment patterns.",
    keywords: "OpenTelemetry workshop, OTel training event, observability workshop, Collector workshop, in-person training",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "EventSeries",
      "name": "OpenTelemetry Workshops & Training Events",
      "description": "Exclusive hands-on workshops by TelemetryDrops",
      "organizer": {
        "@type": "Organization",
        "name": "TelemetryDrops",
        "url": "https://telemetrydrops.com"
      }
    }
  },
  blog: {
    title: "OpenTelemetry Blog — Practical Observability Engineering",
    description: "Technical articles on OpenTelemetry, observability engineering, and telemetry best practices. Written by OTel maintainers and practitioners.",
    keywords: "OpenTelemetry blog, observability engineering, OTel articles, telemetry best practices",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Telemetry Drops Blog",
      "description": "Practical OpenTelemetry and observability engineering",
      "publisher": {
        "@type": "Organization",
        "name": "TelemetryDrops",
        "url": "https://telemetrydrops.com"
      }
    }
  }
};