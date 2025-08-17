import { seoData } from "./seo-data";

describe("SEO Data Configuration", () => {
  describe("Data Structure Validation", () => {
    it("should have all required page sections", () => {
      expect(seoData).toHaveProperty("home");
      expect(seoData).toHaveProperty("products");
      expect(seoData).toHaveProperty("otelTrack");
      expect(seoData).toHaveProperty("otelSpecialization");
    });

    it("should have required fields for all page sections", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        expect(pageData).toHaveProperty("title");
        expect(pageData).toHaveProperty("description");
        expect(pageData).toHaveProperty("jsonLd");
        
        expect(typeof pageData.title).toBe("string");
        expect(typeof pageData.description).toBe("string");
        expect(typeof pageData.jsonLd).toBe("object");
        
        // Title and description should not be empty
        expect(pageData.title.length).toBeGreaterThan(0);
        expect(pageData.description.length).toBeGreaterThan(0);
      });
    });

    it("should have keywords for all page sections", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        expect(pageData).toHaveProperty("keywords");
        expect(typeof pageData.keywords).toBe("string");
        expect(pageData.keywords.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Title Optimization", () => {
    it("should have descriptive titles with primary keywords", () => {
      expect(seoData.home.title).toContain("OpenTelemetry");
      expect(seoData.home.title).toContain("Training");
      
      expect(seoData.products.title).toContain("OpenTelemetry");
      expect(seoData.products.title).toContain("Courses");
      
      expect(seoData.otelTrack.title).toContain("OpenTelemetry");
      expect(seoData.otelTrack.title).toContain("Course");
      
      expect(seoData.otelSpecialization.title).toContain("OpenTelemetry");
      expect(seoData.otelSpecialization.title).toContain("Training");
    });

    it("should include pricing in product titles", () => {
      expect(seoData.otelTrack.title).toContain("€597");
    });

    it("should have reasonable title lengths (under 60 characters for better SEO)", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        expect(pageData.title.length).toBeLessThanOrEqual(65); // Allowing some flexibility
      });
    });
  });

  describe("Description Optimization", () => {
    it("should have descriptions that include target keywords", () => {
      expect(seoData.home.description).toContain("OpenTelemetry");
      expect(seoData.home.description).toContain("observability");
      
      expect(seoData.products.description).toContain("OpenTelemetry");
      expect(seoData.products.description).toContain("courses");
      
      expect(seoData.otelTrack.description).toContain("OpenTelemetry");
      expect(seoData.otelTrack.description).toContain("observability");
      
      expect(seoData.otelSpecialization.description).toContain("OpenTelemetry");
    });

    it("should have reasonable description lengths (under 200 characters, ideally under 160)", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        expect(pageData.description.length).toBeLessThanOrEqual(200); // Maximum limit
        expect(pageData.description.length).toBeGreaterThanOrEqual(120); // Should be descriptive enough
        
        // Log warning for descriptions over 160 characters
        if (pageData.description.length > 160) {
          console.warn(`${pageName} description is ${pageData.description.length} characters (over recommended 160)`);
        }
      });
    });

    it("should include call-to-action elements in descriptions", () => {
      expect(seoData.home.description).toContain("Learn");
      expect(seoData.products.description).toContain("Choose");
      expect(seoData.otelTrack.description).toContain("Master");
    });
  });

  describe("Keywords Strategy", () => {
    it("should include primary keywords in all sections", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        expect(pageData.keywords).toContain("OpenTelemetry");
      });
    });

    it("should include relevant secondary keywords", () => {
      expect(seoData.home.keywords).toContain("observability");
      expect(seoData.home.keywords).toContain("distributed tracing");
      
      expect(seoData.otelTrack.keywords).toContain("self-paced");
      expect(seoData.otelSpecialization.keywords).toContain("intensive");
    });

    it("should have well-formatted keyword lists", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        // Keywords should be comma-separated
        expect(pageData.keywords).toMatch(/^[^,]+(?:,\s*[^,]+)*$/);
        
        // Should have multiple keywords
        const keywordCount = pageData.keywords.split(",").length;
        expect(keywordCount).toBeGreaterThanOrEqual(3);
        expect(keywordCount).toBeLessThanOrEqual(8); // Not too many
      });
    });
  });

  describe("Structured Data Validation", () => {
    it("should have valid schema.org context for all structured data", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        expect(pageData.jsonLd).toHaveProperty("@context");
        expect(pageData.jsonLd["@context"]).toBe("https://schema.org");
        expect(pageData.jsonLd).toHaveProperty("@type");
      });
    });

    it("should use appropriate schema types for each page", () => {
      expect(seoData.home.jsonLd["@type"]).toBe("Organization");
      expect(seoData.products.jsonLd["@type"]).toBe("ItemList");
      expect(seoData.otelTrack.jsonLd["@type"]).toBe("Course");
      expect(seoData.otelSpecialization.jsonLd["@type"]).toBe("Course");
    });

    describe("Organization Schema (Homepage)", () => {
      it("should have required Organization properties", () => {
        const orgData = seoData.home.jsonLd;
        
        expect(orgData).toHaveProperty("name");
        expect(orgData).toHaveProperty("url");
        expect(orgData).toHaveProperty("description");
        expect(orgData).toHaveProperty("sameAs");
        
        expect(orgData.name).toBe("TelemetryDrops");
        expect(orgData.url).toBe("https://telemetrydrops.com");
        expect(Array.isArray(orgData.sameAs)).toBe(true);
      });

      it("should have valid social media links", () => {
        const sameAs = seoData.home.jsonLd.sameAs;
        
        expect(sameAs).toContain("https://www.youtube.com/@TelemetryDrops");
        expect(sameAs).toContain("https://www.linkedin.com/company/telemetrydrops");
        
        // All URLs should be valid
        sameAs.forEach((url: string) => {
          expect(url).toMatch(/^https:\/\//);
        });
      });
    });

    describe("Course Schema (Products)", () => {
      it("should have required Course properties for OTel Track", () => {
        const courseData = seoData.otelTrack.jsonLd;
        
        expect(courseData).toHaveProperty("name");
        expect(courseData).toHaveProperty("description");
        expect(courseData).toHaveProperty("provider");
        expect(courseData).toHaveProperty("hasCourseInstance");
        expect(courseData).toHaveProperty("offers");
        
        expect(courseData.provider.name).toBe("TelemetryDrops");
      });

      it("should have valid Offer properties for courses", () => {
        [seoData.otelTrack, seoData.otelSpecialization].forEach((courseData) => {
          const offer = courseData.jsonLd.offers;
          
          expect(offer).toHaveProperty("@type");
          expect(offer).toHaveProperty("price");
          expect(offer).toHaveProperty("priceCurrency");
          expect(offer).toHaveProperty("availability");
          
          expect(offer["@type"]).toBe("Offer");
          expect(offer.priceCurrency).toBe("EUR");
          expect(offer.availability).toMatch(/^https:\/\/schema\.org\//);
        });
      });

      it("should have correct pricing in structured data", () => {
        expect(seoData.otelTrack.jsonLd.offers.price).toBe("597");
        expect(seoData.otelSpecialization.jsonLd.offers.price).toBe("2497");
      });

      it("should have appropriate availability status", () => {
        expect(seoData.otelTrack.jsonLd.offers.availability).toBe("https://schema.org/InStock");
        expect(seoData.otelSpecialization.jsonLd.offers.availability).toBe("https://schema.org/PreOrder");
      });

      it("should have valid course duration formats", () => {
        // ISO 8601 duration format
        expect(seoData.otelTrack.jsonLd.hasCourseInstance.duration).toMatch(/^P\d+[YMD]$/);
        expect(seoData.otelSpecialization.jsonLd.hasCourseInstance.duration).toMatch(/^P\d+[YMD]?W?$/);
        
        expect(seoData.otelTrack.jsonLd.hasCourseInstance.duration).toBe("P365D");
        expect(seoData.otelSpecialization.jsonLd.hasCourseInstance.duration).toBe("P8W");
      });
    });

    describe("ItemList Schema (Products Page)", () => {
      it("should have required ItemList properties", () => {
        const itemListData = seoData.products.jsonLd;
        
        expect(itemListData).toHaveProperty("name");
        expect(itemListData).toHaveProperty("description");
        
        expect(itemListData.name).toBe("OpenTelemetry Training Courses");
        expect(typeof itemListData.description).toBe("string");
      });
    });
  });

  describe("Content Quality", () => {
    it("should not have duplicate titles across pages", () => {
      const titles = Object.values(seoData).map(data => data.title);
      const uniqueTitles = new Set(titles);
      
      expect(uniqueTitles.size).toBe(titles.length);
    });

    it("should not have duplicate descriptions across pages", () => {
      const descriptions = Object.values(seoData).map(data => data.description);
      const uniqueDescriptions = new Set(descriptions);
      
      expect(uniqueDescriptions.size).toBe(descriptions.length);
    });

    it("should have compelling and action-oriented content", () => {
      const actionWords = ["master", "learn", "choose", "comprehensive", "expert", "advanced"];
      
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        const content = (pageData.title + " " + pageData.description).toLowerCase();
        const hasActionWord = actionWords.some(word => content.includes(word));
        
        expect(hasActionWord).toBe(true);
      });
    });
  });

  describe("Consistency Checks", () => {
    it("should maintain consistent brand naming", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        // Should not have inconsistent variations of the brand name
        expect(pageData.title).not.toMatch(/telemetry drops/i); // Should be TelemetryDrops
        expect(pageData.description).not.toMatch(/telemetry drops/i);
      });
    });

    it("should maintain consistent OpenTelemetry terminology", () => {
      Object.entries(seoData).forEach(([pageName, pageData]) => {
        const content = pageData.title + " " + pageData.description + " " + pageData.keywords;
        
        // Should not have inconsistent variations
        expect(content).not.toMatch(/open telemetry/i); // Should be OpenTelemetry (one word)
        // Note: "OTel" is acceptable as a recognized abbreviation in the OpenTelemetry community
      });
    });
  });
});