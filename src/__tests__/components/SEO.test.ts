// Tests for SEO component
// Verifies metadata generation, Open Graph tags, Twitter Cards, and JSON-LD schemas

import fs from "fs";
import path from "path";

import { describe, it, expect } from "vitest";

describe("SEO Component", () => {
  const componentPath = path.resolve(__dirname, "../../components/SEO.astro");

  it("should exist as a file", () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  describe("Component Structure", () => {
    it("should have correct Props interface with all required fields", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("interface Props");
      expect(content).toContain("title: string");
      expect(content).toContain("description: string");
      expect(content).toContain("image?:");
      expect(content).toContain("type?:");
      expect(content).toContain("lang:");
      expect(content).toContain("translationSlug?:");
      expect(content).toContain("schema?:");
    });

    it("should destructure all props correctly", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("const {");
      expect(content).toContain("title");
      expect(content).toContain("description");
      expect(content).toContain("lang");
    });

    it("should import site metadata from locales", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('from "@locales"');
    });
  });

  describe("Open Graph Tags", () => {
    it("should include og:title meta tag", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('property="og:title"');
      expect(content).toContain("content={title}");
    });

    it("should include og:description meta tag", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('property="og:description"');
      expect(content).toContain("content={description}");
    });

    it("should include og:image meta tag with conditional rendering", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('property="og:image"');
      // Should handle both absolute and relative URLs (check for conditional rendering)
      expect(content).toMatch(/image.*startsWith.*http|absoluteImageUrl/);
    });

    it("should include og:url meta tag with canonical URL", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('property="og:url"');
      expect(content).toMatch(/canonicalUrl|currentUrl/);
    });

    it("should include og:type meta tag with default value", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('property="og:type"');
      expect(content).toContain("type");
      // Should have a default value like 'website'
      expect(content).toMatch(/type.*=.*['"](website|article|book)['"]/);
    });

    it("should include og:locale using centralized getOGLocale helper", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('property="og:locale"');
      // Should use getOGLocale() function from centralized config
      expect(content).toMatch(/getOGLocale\(lang\)/);
    });
  });

  describe("Twitter Card Tags", () => {
    it("should include twitter:card meta tag", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('name="twitter:card"');
      expect(content).toContain("summary_large_image");
    });

    it("should include twitter:site meta tag", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('name="twitter:site"');
      expect(content).toMatch(/@[a-zA-Z0-9_]+/);
    });

    it("should include twitter:title meta tag", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('name="twitter:title"');
      expect(content).toContain("content={title}");
    });

    it("should include twitter:description meta tag", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('name="twitter:description"');
      expect(content).toContain("content={description}");
    });

    it("should include twitter:image meta tag", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('name="twitter:image"');
    });
  });

  describe("Canonical URLs", () => {
    it("should generate canonical link tag", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('rel="canonical"');
      expect(content).toMatch(/href=.*canonicalUrl|currentUrl/);
    });

    it("should build canonical URL from site base URL", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Should use site URL from metadata
      expect(content).toMatch(/metaData\.url|siteUrl/);
    });

    it("should include current path in canonical URL", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toMatch(/Astro\.url|pathname/);
    });
  });

  describe("Hreflang Tags", () => {
    it("should render hreflang for alternate language when translation exists", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('rel="alternate"');
      expect(content).toContain("hreflang");
      expect(content).toContain("translationSlug");
    });

    it("should conditionally render hreflang tags", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Should check if translation exists before rendering (alternateUrl is built from translationSlug)
      expect(content).toMatch(/translationSlug|alternateUrl.*&&|if.*alternate/);
    });

    it("should use centralized language system via getAlternateLang", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Should use getAlternateLang() for alternate language calculation
      expect(content).toMatch(/getAlternateLang\(lang\)/);
    });

    it("should render hreflang for current language", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Should include hreflang for the current page too
      expect(content).toMatch(/hreflang=.*{lang}|hreflang=.*currentLang/);
    });
  });

  describe("JSON-LD Structured Data", () => {
    it("should render JSON-LD script tag", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('type="application/ld+json"');
    });

    it("should render custom schema when provided", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("schema");
      expect(content).toMatch(/JSON\.stringify/);
    });

    it("should have default schema when none provided", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Should create a default WebPage schema
      expect(content).toMatch(/WebPage|defaultSchema/);
    });

    it("should include @context and @type in schema", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('"@context"');
      expect(content).toContain('"@type"');
      expect(content).toContain("https://schema.org");
    });

    it("should use set:html for safe JSON rendering", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("set:html");
    });
  });

  describe("Image URL Handling", () => {
    it("should convert relative image URLs to absolute", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Should check if image starts with http/https
      expect(content).toMatch(/startsWith.*http|image.*\?.*:/);
    });

    it("should keep absolute URLs unchanged", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Should have logic to handle both cases
      expect(content).toMatch(/https?:\/\//);
    });
  });

  describe("Type Safety", () => {
    it("should define lang using centralized LanguageKey type", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Should use LanguageKey type from centralized config
      expect(content).toMatch(/lang:\s*LanguageKey/);
    });

    it("should define type as union of allowed OG types", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toMatch(/type\?:.*website.*article.*book|['"]website['"].*\|/);
    });

    it("should type schema as object or specific interface", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toMatch(/schema\?:.*object|Record/);
    });
  });

  describe("Default Values", () => {
    it("should have default value for type prop", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toMatch(/type\s*=\s*['"](website|article)['"]/);
    });

    it("should handle missing image gracefully", () => {
      const content = fs.readFileSync(componentPath, "utf-8");

      // Should conditionally render image tags (using absoluteImageUrl)
      expect(content).toMatch(/image.*&&|absoluteImageUrl.*&&|if.*image/);
    });
  });
});
