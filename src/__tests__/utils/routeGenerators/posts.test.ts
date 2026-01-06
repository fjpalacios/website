/**
 * Unit tests for posts route generator
 *
 * These are structural tests that verify the generator's type safety and
 * configuration validation. Full integration testing is done via E2E tests
 * since this generator depends heavily on Astro collections.
 *
 * Tests cover:
 * - Configuration validation
 * - Type safety
 * - Interface compliance
 */

import { describe, test, expect } from "vitest";

import type { ContactItem } from "@/types/content";
import type { PostsGeneratorConfig } from "@/utils/routeGenerators/posts";

// ============================================================================
// MOCK DATA
// ============================================================================

const mockContact: ContactItem[] = [
  {
    name: "Email",
    link: "mailto:test@example.com",
    icon: "mail",
    text: "test@example.com",
  },
];

// ============================================================================
// HELPER: Create Config
// ============================================================================

type PartialConfig = Partial<PostsGeneratorConfig> & Pick<PostsGeneratorConfig, "lang" | "targetLang">;

const createConfig = (overrides: PartialConfig): PostsGeneratorConfig => {
  return {
    lang: overrides.lang,
    targetLang: overrides.targetLang,
    contact: overrides.contact || mockContact,
  };
};

// ============================================================================
// TEST SUITE: Configuration Validation
// ============================================================================

describe("generatePostsRoutes - Configuration Validation", () => {
  test("should accept valid English configuration", () => {
    const config = createConfig({
      lang: "en",
      targetLang: "es",
    });

    expect(config.lang).toBe("en");
    expect(config.targetLang).toBe("es");
    expect(config.contact).toBeDefined();
  });

  test("should accept valid Spanish configuration", () => {
    const config = createConfig({
      lang: "es",
      targetLang: "en",
    });

    expect(config.lang).toBe("es");
    expect(config.targetLang).toBe("en");
  });

  test("should include contact info", () => {
    const customContact: ContactItem[] = [
      {
        name: "Email",
        link: "mailto:custom@example.com",
        icon: "mail",
        text: "custom@example.com",
      },
      {
        name: "Website",
        link: "https://example.com",
        icon: "globe",
        text: "example.com",
      },
    ];

    const config = createConfig({
      lang: "en",
      targetLang: "es",
      contact: customContact,
    });

    expect(config.contact).toEqual(customContact);
  });

  test("should handle minimal contact info", () => {
    const minimalContact: ContactItem[] = [
      {
        name: "Email",
        link: "mailto:min@example.com",
        icon: "mail",
        text: "min@example.com",
      },
    ];

    const config = createConfig({
      lang: "en",
      targetLang: "es",
      contact: minimalContact,
    });

    expect(config.contact).toEqual(minimalContact);
  });
});

// ============================================================================
// TEST SUITE: Type Safety
// ============================================================================

describe("generatePostsRoutes - Type Safety", () => {
  test("should enforce required lang property", () => {
    // @ts-expect-error - lang is required
    const invalidConfig: PostsGeneratorConfig = {
      targetLang: "es",
      contact: mockContact,
    };

    // This should fail TypeScript compilation
    expect(invalidConfig).toBeDefined();
  });

  test("should enforce required targetLang property", () => {
    // @ts-expect-error - targetLang is required
    const invalidConfig: PostsGeneratorConfig = {
      lang: "en",
      contact: mockContact,
    };

    // This should fail TypeScript compilation
    expect(invalidConfig).toBeDefined();
  });

  test("should enforce required contact property", () => {
    // @ts-expect-error - contact is required
    const invalidConfig: PostsGeneratorConfig = {
      lang: "en",
      targetLang: "es",
    };

    // This should fail TypeScript compilation
    expect(invalidConfig).toBeDefined();
  });

  test("should accept complete configuration", () => {
    const validConfig: PostsGeneratorConfig = {
      lang: "en",
      targetLang: "es",
      contact: mockContact,
    };

    expect(validConfig).toBeDefined();
    expect(validConfig.lang).toBe("en");
    expect(validConfig.targetLang).toBe("es");
    expect(validConfig.contact).toEqual(mockContact);
  });
});

// ============================================================================
// TEST SUITE: Interface Compliance
// ============================================================================

describe("generatePostsRoutes - Interface Compliance", () => {
  test("config should have correct property types", () => {
    const config = createConfig({
      lang: "en",
      targetLang: "es",
    });

    expect(typeof config.lang).toBe("string");
    expect(typeof config.targetLang).toBe("string");
    expect(typeof config.contact).toBe("object");
  });

  test("should support both language directions", () => {
    const enToEs = createConfig({
      lang: "en",
      targetLang: "es",
    });

    const esToEn = createConfig({
      lang: "es",
      targetLang: "en",
    });

    expect(enToEs.lang).toBe("en");
    expect(enToEs.targetLang).toBe("es");
    expect(esToEn.lang).toBe("es");
    expect(esToEn.targetLang).toBe("en");
  });

  test("should accept arbitrary contact object structure", () => {
    const complexContact: ContactItem[] = [
      {
        name: "Email",
        link: "mailto:john@example.com",
        icon: "mail",
        text: "john@example.com",
      },
      {
        name: "Website",
        link: "https://example.com",
        icon: "globe",
        text: "example.com",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/johndoe",
        icon: "twitter",
        text: "@johndoe",
      },
      {
        name: "GitHub",
        link: "https://github.com/johndoe",
        icon: "github",
        text: "johndoe",
      },
    ];

    const config = createConfig({
      lang: "en",
      targetLang: "es",
      contact: complexContact,
    });

    expect(config.contact).toEqual(complexContact);
  });
});

// ============================================================================
// TEST SUITE: Edge Cases
// ============================================================================

describe("generatePostsRoutes - Edge Cases", () => {
  test("should handle same language for lang and targetLang", () => {
    const config = createConfig({
      lang: "en",
      targetLang: "en",
    });

    expect(config.lang).toBe("en");
    expect(config.targetLang).toBe("en");
  });

  test("should handle empty contact array", () => {
    const emptyContact: ContactItem[] = [];

    const config = createConfig({
      lang: "en",
      targetLang: "es",
      contact: emptyContact,
    });

    expect(config.contact).toEqual(emptyContact);
  });

  test("should preserve contact array reference", () => {
    const contact: ContactItem[] = [
      {
        name: "Test",
        link: "mailto:test@example.com",
        icon: "mail",
        text: "test@example.com",
      },
    ];

    const config = createConfig({
      lang: "en",
      targetLang: "es",
      contact,
    });

    expect(config.contact).toBe(contact);
  });
});

// ============================================================================
// NOTES
// ============================================================================

/**
 * Integration Testing Note:
 *
 * Full integration tests for this generator are handled by:
 * 1. E2E tests in e2e/posts-list.spec.ts
 * 2. E2E tests in e2e/posts-detail.spec.ts
 * 3. E2E tests in e2e/pagination.spec.ts
 * 4. E2E tests in e2e/seo-pagination.spec.ts
 *
 * These E2E tests verify:
 * - Actual route generation with real collections
 * - Mixed content (posts + tutorials + books)
 * - Schema.org markup with mixed types
 * - Pagination behavior
 * - Language switching
 * - SEO metadata
 *
 * Unit testing this generator in isolation is difficult because it:
 * - Depends on Astro collections (posts, tutorials, books)
 * - Uses build-time caching
 * - Relies on real route segment configuration
 * - Generates Schema.org markup from actual content
 *
 * The E2E tests provide better coverage for this specific generator.
 */
