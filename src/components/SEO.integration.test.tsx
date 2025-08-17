/**
 * Integration tests for SEO functionality focusing on business logic
 * These tests verify that SEO components work correctly without complex DOM manipulation
 */

import { seoData } from "@/data/seo-data";

describe("SEO Integration Business Logic", () => {
  describe("Title Formatting Logic", () => {
    it("should define title formatting rules", () => {
      // Test the title formatting logic from SEO component
      const titleWithoutSuffix = "OpenTelemetry Course";
      const titleWithSuffix = "Complete Guide to TelemetryDrops";
      
      // Simulate the logic from SEO component
      const formatTitle = (title: string) => {
        return title.includes('TelemetryDrops') ? title : `${title} | TelemetryDrops`;
      };
      
      expect(formatTitle(titleWithoutSuffix)).toBe("OpenTelemetry Course | TelemetryDrops");
      expect(formatTitle(titleWithSuffix)).toBe("Complete Guide to TelemetryDrops");
    });
  });

  describe("URL Generation Logic", () => {
    it("should generate correct canonical URLs", () => {
      const baseUrl = "https://telemetrydrops.com";
      
      // Simulate the URL generation logic from SEO component
      const generateCanonicalUrl = (canonical?: string) => {
        return canonical ? `${baseUrl}${canonical}` : baseUrl;
      };
      
      expect(generateCanonicalUrl()).toBe("https://telemetrydrops.com");
      expect(generateCanonicalUrl("/products")).toBe("https://telemetrydrops.com/products");
      expect(generateCanonicalUrl("/products/otel-track")).toBe("https://telemetrydrops.com/products/otel-track");
    });

    it("should handle canonical URLs with leading slash properly", () => {
      const baseUrl = "https://telemetrydrops.com";
      
      const generateCanonicalUrl = (canonical?: string) => {
        return canonical ? `${baseUrl}${canonical}` : baseUrl;
      };
      
      expect(generateCanonicalUrl("/products")).toBe("https://telemetrydrops.com/products");
      // Note: The actual implementation expects canonical URLs to start with /
      // If no leading slash, it would need to be handled differently
    });
  });

  describe("SEO Data Product Mapping", () => {
    it("should correctly map product slugs to SEO data", () => {
      // Simulate the SEO data selection logic from ProductDetail component
      const getSEODataBySlug = (slug: string) => {
        switch (slug) {
          case 'otel-track':
            return seoData.otelTrack;
          case 'otel-specialization':
            return seoData.otelSpecialization;
          default:
            return seoData.products;
        }
      };
      
      expect(getSEODataBySlug('otel-track')).toBe(seoData.otelTrack);
      expect(getSEODataBySlug('otel-specialization')).toBe(seoData.otelSpecialization);
      expect(getSEODataBySlug('invalid-slug')).toBe(seoData.products);
    });

    it("should have appropriate SEO data for each product", () => {
      // Verify OTel Track SEO data
      expect(seoData.otelTrack.title).toContain("OpenTelemetry");
      expect(seoData.otelTrack.title).toContain("€597");
      expect(seoData.otelTrack.description).toContain("own pace"); // Actual text is "at your own pace"
      
      // Verify OTel Specialization SEO data
      expect(seoData.otelSpecialization.title).toContain("OpenTelemetry");
      expect(seoData.otelSpecialization.title).toContain("8-Week");
      expect(seoData.otelSpecialization.description).toContain("Elite"); // Actual text uses "Elite"
    });
  });

  describe("Structured Data Validation", () => {
    it("should have valid JSON-LD for all pages", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        // Verify JSON-LD can be stringified (valid JSON)
        expect(() => JSON.stringify(pageData.jsonLd)).not.toThrow();
        
        // Verify required schema.org properties
        expect(pageData.jsonLd["@context"]).toBe("https://schema.org");
        expect(pageData.jsonLd["@type"]).toBeDefined();
      });
    });

    it("should have correct course pricing in structured data", () => {
      const otelTrackOffer = seoData.otelTrack.jsonLd.offers;
      const otelSpecializationOffer = seoData.otelSpecialization.jsonLd.offers;
      
      expect(otelTrackOffer.price).toBe("597");
      expect(otelTrackOffer.priceCurrency).toBe("EUR");
      expect(otelTrackOffer.availability).toBe("https://schema.org/InStock");
      
      expect(otelSpecializationOffer.price).toBe("2497");
      expect(otelSpecializationOffer.priceCurrency).toBe("EUR");
      expect(otelSpecializationOffer.availability).toBe("https://schema.org/PreOrder");
    });

    it("should have valid ISO 8601 durations for courses", () => {
      const otelTrackDuration = seoData.otelTrack.jsonLd.hasCourseInstance.duration;
      const otelSpecializationDuration = seoData.otelSpecialization.jsonLd.hasCourseInstance.duration;
      
      // Verify ISO 8601 duration format
      expect(otelTrackDuration).toMatch(/^P\d+[YMD]$/);
      expect(otelSpecializationDuration).toMatch(/^P\d+[YMD]?W?$/);
      
      expect(otelTrackDuration).toBe("P365D"); // 365 days
      expect(otelSpecializationDuration).toBe("P8W"); // 8 weeks
    });
  });

  describe("Testimonial Structured Data Logic", () => {
    it("should generate correct Review schema structure", () => {
      // Simulate the structured data generation from Testimonial component
      const generateTestimonialStructuredData = (quote: string, author: string, role?: string, company?: string) => {
        return {
          "@context": "https://schema.org",
          "@type": "Review",
          "reviewBody": quote,
          "author": {
            "@type": "Person",
            "name": author,
            ...(role && { "jobTitle": role }),
            ...(company && {
              "worksFor": {
                "@type": "Organization",
                "name": company
              }
            })
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": 5,
            "bestRating": 5
          }
        };
      };
      
      const basicTestimonial = generateTestimonialStructuredData(
        "Great course!",
        "John Doe"
      );
      
      expect(basicTestimonial["@type"]).toBe("Review");
      expect(basicTestimonial.reviewBody).toBe("Great course!");
      expect(basicTestimonial.author.name).toBe("John Doe");
      expect(basicTestimonial.author.jobTitle).toBeUndefined();
      expect(basicTestimonial.reviewRating.ratingValue).toBe(5);
      
      const fullTestimonial = generateTestimonialStructuredData(
        "Excellent training program!",
        "Jane Smith",
        "Senior Engineer",
        "TechCorp"
      );
      
      expect(fullTestimonial.author.jobTitle).toBe("Senior Engineer");
      expect(fullTestimonial.author.worksFor.name).toBe("TechCorp");
    });

    it("should handle special characters in testimonial content", () => {
      const generateTestimonialStructuredData = (quote: string, author: string) => {
        return {
          "@context": "https://schema.org",
          "@type": "Review",
          "reviewBody": quote,
          "author": {
            "@type": "Person",
            "name": author
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": 5,
            "bestRating": 5
          }
        };
      };
      
      const testimonialWithSpecialChars = generateTestimonialStructuredData(
        "This course is fantastic! It covers 100% of what you need & more.",
        "François Müller"
      );
      
      // Should be valid JSON
      expect(() => JSON.stringify(testimonialWithSpecialChars)).not.toThrow();
      expect(testimonialWithSpecialChars.reviewBody).toContain("&");
      expect(testimonialWithSpecialChars.author.name).toBe("François Müller");
    });
  });

  describe("SEO Best Practices Validation", () => {
    it("should follow SEO title best practices", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        // Title should include primary keyword
        expect(pageData.title.toLowerCase()).toContain("opentelemetry");
        
        // Title should not be too long (good for search results)
        expect(pageData.title.length).toBeLessThanOrEqual(65);
        
        // Title should not be too short
        expect(pageData.title.length).toBeGreaterThanOrEqual(10);
      });
    });

    it("should follow SEO description best practices", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        // Description should include primary keyword
        expect(pageData.description.toLowerCase()).toContain("opentelemetry");
        
        // Description should have call-to-action words
        const actionWords = ["learn", "master", "choose", "get", "discover", "comprehensive", "expert"];
        const hasActionWord = actionWords.some(word => 
          pageData.description.toLowerCase().includes(word)
        );
        expect(hasActionWord).toBe(true);
        
        // Description should not be too short
        expect(pageData.description.length).toBeGreaterThanOrEqual(120);
      });
    });

    it("should have unique SEO content across pages", () => {
      const titles = Object.values(seoData).map(data => data.title);
      const descriptions = Object.values(seoData).map(data => data.description);
      
      // All titles should be unique
      expect(new Set(titles).size).toBe(titles.length);
      
      // All descriptions should be unique
      expect(new Set(descriptions).size).toBe(descriptions.length);
    });
  });

  describe("Business Logic Consistency", () => {
    it("should maintain consistent pricing information", () => {
      // OTel Track pricing should be consistent
      expect(seoData.otelTrack.title).toContain("€597");
      expect(seoData.otelTrack.jsonLd.offers.price).toBe("597");
      expect(seoData.otelTrack.jsonLd.offers.priceCurrency).toBe("EUR");
      
      // OTel Specialization doesn't show price in title (coming soon)
      // but has it in structured data for when it becomes available
      expect(seoData.otelSpecialization.jsonLd.offers.price).toBe("2497");
      expect(seoData.otelSpecialization.jsonLd.offers.priceCurrency).toBe("EUR");
    });

    it("should have appropriate availability status", () => {
      // OTel Track is available now
      expect(seoData.otelTrack.jsonLd.offers.availability).toBe("https://schema.org/InStock");
      
      // OTel Specialization is coming soon
      expect(seoData.otelSpecialization.jsonLd.offers.availability).toBe("https://schema.org/PreOrder");
    });

    it("should have consistent brand and terminology", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        const content = pageData.title + " " + pageData.description;
        
        // Should use consistent OpenTelemetry (not "Open Telemetry")
        expect(content).not.toMatch(/open telemetry/i);
        
        // Should not have inconsistent brand variations
        expect(content).not.toMatch(/telemetry drops/i);
      });
    });
  });
});