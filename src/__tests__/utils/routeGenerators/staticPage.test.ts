/**
 * Tests for staticPage.ts route generator
 *
 * Tests the generation of routes for static pages (about, feeds, etc.)
 * These are simple pages without pagination or dynamic lists
 */

import { describe, test, expect } from "vitest";

import { generateStaticPageRoute, type StaticPageConfig } from "@/utils/routeGenerators/staticPage";

// ============================================================================
// TEST DATA FACTORIES
// ============================================================================

/**
 * Create a full config object for testing
 */
function createConfig(overrides: Partial<StaticPageConfig> = {}): StaticPageConfig {
  return {
    lang: "es",
    routeSegment: "acerca-de",
    contentType: "about",
    contact: { name: "Test Contact", email: "test@example.com" },
    ...overrides,
  };
}

// ============================================================================
// TEST SUITE: Basic Generation
// ============================================================================

describe("generateStaticPageRoute - Basic Generation", () => {
  test("should generate route for About page in Spanish", () => {
    const config = createConfig({
      lang: "es",
      routeSegment: "acerca-de",
      contentType: "about",
    });

    const paths = generateStaticPageRoute(config);

    expect(paths).toHaveLength(1);
    expect(paths[0].params).toEqual({
      lang: "es",
      route: "acerca-de",
    });
    expect(paths[0].props).toMatchObject({
      contentType: "about",
      pageType: "static",
      lang: "es",
    });
  });

  test("should generate route for About page in English", () => {
    const config = createConfig({
      lang: "en",
      routeSegment: "about",
      contentType: "about",
    });

    const paths = generateStaticPageRoute(config);

    expect(paths).toHaveLength(1);
    expect(paths[0].params).toEqual({
      lang: "en",
      route: "about",
    });
    expect(paths[0].props).toMatchObject({
      contentType: "about",
      pageType: "static",
      lang: "en",
    });
  });

  test("should generate route for Feeds page in Spanish", () => {
    const config = createConfig({
      lang: "es",
      routeSegment: "feeds",
      contentType: "feeds",
    });

    const paths = generateStaticPageRoute(config);

    expect(paths).toHaveLength(1);
    expect(paths[0].params).toEqual({
      lang: "es",
      route: "feeds",
    });
    expect(paths[0].props.contentType).toBe("feeds");
  });

  test("should generate route for Feeds page in English", () => {
    const config = createConfig({
      lang: "en",
      routeSegment: "feeds",
      contentType: "feeds",
    });

    const paths = generateStaticPageRoute(config);

    expect(paths).toHaveLength(1);
    expect(paths[0].params).toEqual({
      lang: "en",
      route: "feeds",
    });
    expect(paths[0].props.contentType).toBe("feeds");
  });

  test("should always return array with single item", () => {
    const config = createConfig();
    const paths = generateStaticPageRoute(config);

    expect(Array.isArray(paths)).toBe(true);
    expect(paths).toHaveLength(1);
  });
});

// ============================================================================
// TEST SUITE: Content Handling
// ============================================================================

describe("generateStaticPageRoute - Content Handling", () => {
  test("should add content with dynamic key when content provided", () => {
    const mockAboutContent = {
      title: "About Me",
      body: "This is my story...",
    };

    const config = createConfig({
      contentType: "about",
      content: mockAboutContent,
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props).toHaveProperty("aboutContent");
    expect(paths[0].props.aboutContent).toEqual(mockAboutContent);
  });

  test("should use correct content key for different content types", () => {
    const mockFeedsContent = {
      rssFeeds: ["feed1", "feed2"],
    };

    const config = createConfig({
      contentType: "feeds",
      content: mockFeedsContent,
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props).toHaveProperty("feedsContent");
    expect(paths[0].props.feedsContent).toEqual(mockFeedsContent);
  });

  test("should not add content key when content is undefined", () => {
    const config = createConfig({
      contentType: "about",
      content: undefined,
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props).not.toHaveProperty("aboutContent");
  });

  test("should not add content key when content is not provided", () => {
    const config = createConfig({
      contentType: "about",
      // No content property
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props).not.toHaveProperty("aboutContent");
  });

  test("should handle null content by adding it", () => {
    const config = createConfig({
      contentType: "about",
      content: null,
    });

    const paths = generateStaticPageRoute(config);

    // null is a valid value (different from undefined), so it should be added
    expect(paths[0].props).toHaveProperty("aboutContent");
    expect(paths[0].props.aboutContent).toBeNull();
  });

  test("should handle empty object as content", () => {
    const config = createConfig({
      contentType: "about",
      content: {},
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props).toHaveProperty("aboutContent");
    expect(paths[0].props.aboutContent).toEqual({});
  });

  test("should handle array as content", () => {
    const mockContent = ["item1", "item2", "item3"];

    const config = createConfig({
      contentType: "feeds",
      content: mockContent,
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props).toHaveProperty("feedsContent");
    expect(paths[0].props.feedsContent).toEqual(mockContent);
  });

  test("should handle complex nested content", () => {
    const mockContent = {
      title: "About",
      sections: [
        { id: 1, title: "Section 1", content: "Content 1" },
        { id: 2, title: "Section 2", content: "Content 2" },
      ],
      metadata: {
        author: "John Doe",
        date: "2024-01-01",
      },
    };

    const config = createConfig({
      contentType: "about",
      content: mockContent,
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props.aboutContent).toEqual(mockContent);
  });
});

// ============================================================================
// TEST SUITE: Additional Props
// ============================================================================

describe("generateStaticPageRoute - Additional Props", () => {
  test("should merge additional props into route props", () => {
    const config = createConfig({
      additionalProps: {
        customField1: "value1",
        customField2: "value2",
      },
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props).toMatchObject({
      customField1: "value1",
      customField2: "value2",
    });
  });

  test("should handle empty additionalProps object", () => {
    const config = createConfig({
      additionalProps: {},
    });

    const paths = generateStaticPageRoute(config);

    // Should still generate route successfully
    expect(paths).toHaveLength(1);
    expect(paths[0].props).toHaveProperty("contentType");
    expect(paths[0].props).toHaveProperty("pageType");
  });

  test("should handle undefined additionalProps", () => {
    const config = createConfig({
      additionalProps: undefined,
    });

    const paths = generateStaticPageRoute(config);

    // Should work with default empty object
    expect(paths).toHaveLength(1);
    expect(paths[0].props).toHaveProperty("contentType");
  });

  test("should not have additionalProps when not provided", () => {
    const config = createConfig();
    // No additionalProps specified

    const paths = generateStaticPageRoute(config);

    // Should work fine (additionalProps defaults to {})
    expect(paths).toHaveLength(1);
  });

  test("should merge complex additional props", () => {
    const config = createConfig({
      additionalProps: {
        seo: {
          title: "About Page",
          description: "Learn more about us",
        },
        analytics: {
          pageId: "about-page",
          trackingEnabled: true,
        },
      },
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props).toHaveProperty("seo");
    expect(paths[0].props).toHaveProperty("analytics");
    expect(paths[0].props.seo).toEqual({
      title: "About Page",
      description: "Learn more about us",
    });
  });

  test("should override default props with additional props", () => {
    const config = createConfig({
      contentType: "about",
      additionalProps: {
        // This should NOT override because contentType is set first
        // But let's test with a different prop
        pageType: "custom-static",
      },
    });

    const paths = generateStaticPageRoute(config);

    // additionalProps are spread AFTER base props, so they override
    expect(paths[0].props.pageType).toBe("custom-static");
  });

  test("should combine content and additional props", () => {
    const mockContent = { title: "About" };
    const config = createConfig({
      contentType: "about",
      content: mockContent,
      additionalProps: {
        customField: "custom value",
      },
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props).toHaveProperty("aboutContent");
    expect(paths[0].props).toHaveProperty("customField");
    expect(paths[0].props.aboutContent).toEqual(mockContent);
    expect(paths[0].props.customField).toBe("custom value");
  });
});

// ============================================================================
// TEST SUITE: Props Validation
// ============================================================================

describe("generateStaticPageRoute - Props Validation", () => {
  test("should have all required base props", () => {
    const config = createConfig();
    const paths = generateStaticPageRoute(config);

    expect(paths[0].props).toHaveProperty("contentType");
    expect(paths[0].props).toHaveProperty("pageType");
    expect(paths[0].props).toHaveProperty("lang");
    expect(paths[0].props).toHaveProperty("contact");
  });

  test("should set pageType to static", () => {
    const config = createConfig();
    const paths = generateStaticPageRoute(config);

    expect(paths[0].props.pageType).toBe("static");
  });

  test("should include contact data", () => {
    const mockContact = {
      name: "Custom Contact",
      email: "custom@example.com",
      phone: "+123456789",
    };

    const config = createConfig({
      contact: mockContact,
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props.contact).toEqual(mockContact);
  });

  test("should set correct lang value", () => {
    const configES = createConfig({ lang: "es" });
    const configEN = createConfig({ lang: "en" });

    const pathsES = generateStaticPageRoute(configES);
    const pathsEN = generateStaticPageRoute(configEN);

    expect(pathsES[0].props.lang).toBe("es");
    expect(pathsEN[0].props.lang).toBe("en");
  });

  test("should set correct contentType value", () => {
    const configAbout = createConfig({ contentType: "about" });
    const configFeeds = createConfig({ contentType: "feeds" });

    const pathsAbout = generateStaticPageRoute(configAbout);
    const pathsFeeds = generateStaticPageRoute(configFeeds);

    expect(pathsAbout[0].props.contentType).toBe("about");
    expect(pathsFeeds[0].props.contentType).toBe("feeds");
  });
});

// ============================================================================
// TEST SUITE: Edge Cases
// ============================================================================

describe("generateStaticPageRoute - Edge Cases", () => {
  test("should handle route segment with special characters", () => {
    const config = createConfig({
      routeSegment: "acerca-de-mi",
      contentType: "about",
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].params.route).toBe("acerca-de-mi");
  });

  test("should handle content type with hyphens", () => {
    const config = createConfig({
      contentType: "privacy-policy",
      routeSegment: "politica-privacidad",
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props.contentType).toBe("privacy-policy");
  });

  test("should handle very long content", () => {
    const longContent = {
      text: "a".repeat(10000), // 10k characters
    };

    const config = createConfig({
      content: longContent,
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props.aboutContent).toEqual(longContent);
  });

  test("should handle content with special characters", () => {
    const specialContent = {
      title: "Björk's Café & Restaurant™",
      description: "¡Bienvenidos! 你好 مرحبا",
    };

    const config = createConfig({
      content: specialContent,
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props.aboutContent).toEqual(specialContent);
  });

  test("should handle empty string as routeSegment", () => {
    const config = createConfig({
      routeSegment: "",
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].params.route).toBe("");
  });

  test("should handle numeric values in content", () => {
    const config = createConfig({
      content: 12345,
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props.aboutContent).toBe(12345);
  });

  test("should handle boolean values in content", () => {
    const config = createConfig({
      content: true,
    });

    const paths = generateStaticPageRoute(config);

    expect(paths[0].props.aboutContent).toBe(true);
  });
});

// ============================================================================
// TEST SUITE: Integration
// ============================================================================

describe("generateStaticPageRoute - Integration", () => {
  test("should generate complete About page route for realistic scenario", () => {
    const mockAboutContent = {
      title: "Acerca de Mí",
      introduction: "Soy desarrollador full-stack...",
      experience: [
        { company: "Company A", years: 3 },
        { company: "Company B", years: 2 },
      ],
      skills: ["JavaScript", "TypeScript", "React", "Node.js"],
    };

    const mockContact = {
      name: "Francisco Javier Palacios",
      email: "contact@fjp.es",
      social: {
        github: "fjpalacios",
        twitter: "@fjpalacios",
      },
    };

    const config = createConfig({
      lang: "es",
      routeSegment: "acerca-de",
      contentType: "about",
      content: mockAboutContent,
      contact: mockContact,
      additionalProps: {
        seo: {
          title: "Acerca de Mí - Francisco Javier Palacios",
          description: "Conoce más sobre mi experiencia como desarrollador",
        },
      },
    });

    const paths = generateStaticPageRoute(config);

    expect(paths).toHaveLength(1);
    expect(paths[0].params).toEqual({
      lang: "es",
      route: "acerca-de",
    });
    expect(paths[0].props).toMatchObject({
      contentType: "about",
      pageType: "static",
      lang: "es",
      contact: mockContact,
      aboutContent: mockAboutContent,
      seo: {
        title: "Acerca de Mí - Francisco Javier Palacios",
        description: "Conoce más sobre mi experiencia como desarrollador",
      },
    });
  });

  test("should generate Feeds page route with RSS feed data", () => {
    const mockFeedsContent = {
      rssFeeds: [
        { title: "All Posts", url: "/es/rss.xml", description: "Todas las publicaciones" },
        { title: "Books", url: "/es/libros/rss.xml", description: "Reseñas de libros" },
        { title: "Tutorials", url: "/es/tutoriales/rss.xml", description: "Tutoriales" },
      ],
    };

    const config = createConfig({
      lang: "es",
      routeSegment: "feeds",
      contentType: "feeds",
      content: mockFeedsContent,
      additionalProps: {
        seo: {
          title: "RSS Feeds - fjp.es",
        },
      },
    });

    const paths = generateStaticPageRoute(config);

    expect(paths).toHaveLength(1);
    expect(paths[0].props).toMatchObject({
      contentType: "feeds",
      pageType: "static",
      feedsContent: mockFeedsContent,
    });
  });

  test("should work for future static pages (e.g., privacy-policy)", () => {
    const mockPrivacyContent = {
      lastUpdated: "2024-01-01",
      sections: [
        { id: 1, title: "Data Collection", content: "We collect..." },
        { id: 2, title: "Data Usage", content: "We use..." },
      ],
    };

    const config = createConfig({
      lang: "en",
      routeSegment: "privacy-policy",
      contentType: "privacy",
      content: mockPrivacyContent,
    });

    const paths = generateStaticPageRoute(config);

    expect(paths).toHaveLength(1);
    expect(paths[0].params).toEqual({
      lang: "en",
      route: "privacy-policy",
    });
    expect(paths[0].props).toHaveProperty("privacyContent");
    expect(paths[0].props.privacyContent).toEqual(mockPrivacyContent);
  });
});
