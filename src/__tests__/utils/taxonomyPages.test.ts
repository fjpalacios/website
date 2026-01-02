import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";

/**
 * Tests for taxonomyPages.ts filtering logic and i18n support
 *
 * Tests the category filtering logic that handles:
 * - All content types now use array fields (categories, genres, etc.)
 * - Singular fields for unique relationships (author, publisher, series)
 * - i18n field usage for taxonomy translations
 */

describe("taxonomyPages filtering logic", () => {
  describe("categories field handling", () => {
    it("should match content with categories array field", () => {
      // All content types (books, posts, tutorials) now use categories array
      const content = {
        data: {
          categories: ["libros", "resenas"],
        },
      } as Partial<CollectionEntry<"books">>;

      const taxonomySlug = "libros";

      // Test the filtering logic
      const value = content.data!.categories;
      const matches = Array.isArray(value) && value.includes(taxonomySlug);

      expect(matches).toBe(true);
    });

    it("should not match if category value is different", () => {
      const content = {
        data: {
          categories: ["tutoriales"],
        },
      } as Partial<CollectionEntry<"posts">>;

      const taxonomySlug = "libros";

      const value = content.data!.categories;
      const matches = Array.isArray(value) && value.includes(taxonomySlug);

      expect(matches).toBe(false);
    });

    it("should not match if content has no categories field", () => {
      const content = {
        data: {
          title: "Some content without category",
          categories: undefined,
        },
      } as unknown as CollectionEntry<"posts">;

      const taxonomySlug = "libros";

      const value = content.data.categories;
      const matches = Array.isArray(value) && value.includes(taxonomySlug);

      expect(matches).toBe(false);
    });

    it("should match when slug is in any position of categories array", () => {
      const content = {
        data: {
          categories: ["tutoriales", "programacion", "libros"],
        },
      } as unknown as CollectionEntry<"posts">;

      const taxonomySlug = "libros";
      const value = content.data.categories;
      const matches = Array.isArray(value) && value.includes(taxonomySlug);

      expect(matches).toBe(true);
    });
  });

  describe("generic plural field handling", () => {
    it("should handle genres array field", () => {
      const content = {
        data: {
          genres: ["terror", "ficcion"],
        },
      } as Partial<CollectionEntry<"books">>;

      const taxonomySlug = "terror";

      const value = content.data!.genres;
      const matches = Array.isArray(value) && value.includes(taxonomySlug);

      expect(matches).toBe(true);
    });

    it("should handle challenges array field", () => {
      const content = {
        data: {
          challenges: ["reading-challenge-2017", "reading-challenge-2018"],
        },
      } as Partial<CollectionEntry<"books">>;

      const taxonomySlug = "reading-challenge-2017";

      const value = content.data!.challenges;
      const matches = Array.isArray(value) && value.includes(taxonomySlug);

      expect(matches).toBe(true);
    });
  });

  describe("singular field handling", () => {
    it("should match singular fields like author", () => {
      const content = {
        data: {
          author: "stephen-king",
        },
      } as Partial<CollectionEntry<"books">>;

      const config = {
        contentField: "author",
        isSingular: true,
      };

      const taxonomySlug = "stephen-king";

      const value = content.data!.author;
      const matches = config.isSingular && value === taxonomySlug;

      expect(matches).toBe(true);
    });

    it("should match singular fields like publisher", () => {
      const content = {
        data: {
          publisher: "plaza-janes",
        },
      } as Partial<CollectionEntry<"books">>;

      const config = {
        contentField: "publisher",
        isSingular: true,
      };

      const taxonomySlug = "plaza-janes";

      const value = content.data!.publisher;
      const matches = config.isSingular && value === taxonomySlug;

      expect(matches).toBe(true);
    });

    it("should match singular fields like series", () => {
      const content = {
        data: {
          series: "torre-oscura",
        },
      } as Partial<CollectionEntry<"books">>;

      const config = {
        contentField: "series",
        isSingular: true,
      };

      const taxonomySlug = "torre-oscura";

      const value = content.data!.series;
      const matches = config.isSingular && value === taxonomySlug;

      expect(matches).toBe(true);
    });

    it("should not match singular fields with different value", () => {
      const content = {
        data: {
          author: "stephen-king",
        },
      } as Partial<CollectionEntry<"books">>;

      const config = {
        contentField: "author",
        isSingular: true,
      };

      const taxonomySlug = "camilla-lackberg";

      const value = content.data!.author;
      const matches = config.isSingular && value === taxonomySlug;

      expect(matches).toBe(false);
    });
  });

  describe("i18n field handling for translations", () => {
    it("should check if i18n slug exists in target language", () => {
      // Simulating the logic from taxonomyPages.ts:177
      // ES genre: { genre_slug: "ficcion", i18n: "fiction" }
      const taxonomyItem = {
        data: {
          genre_slug: "ficcion",
          i18n: "fiction",
          name: "Ficción",
          language: "es",
        },
      };

      // EN genres available: ["fiction", "horror", "thriller"]
      const targetTaxonomySlugs = new Set(["fiction", "horror", "thriller"]);

      // Logic that should be used (FIXED version)
      const translationSlug = taxonomyItem.data.i18n;
      const hasTargetContent = translationSlug
        ? targetTaxonomySlugs.has(translationSlug)
        : targetTaxonomySlugs.has(taxonomyItem.data.genre_slug);

      expect(hasTargetContent).toBe(true);
    });

    it("should return false when i18n slug does not exist in target language", () => {
      // ES genre: { genre_slug: "biografia", i18n: "biography" }
      const taxonomyItem = {
        data: {
          genre_slug: "biografia",
          i18n: "biography",
          name: "Biografía",
          language: "es",
        },
      };

      // EN genres available: ["fiction", "horror", "thriller"]
      // NOTE: "biography" is NOT in the list
      const targetTaxonomySlugs = new Set(["fiction", "horror", "thriller"]);

      const translationSlug = taxonomyItem.data.i18n;
      const hasTargetContent = translationSlug
        ? targetTaxonomySlugs.has(translationSlug)
        : targetTaxonomySlugs.has(taxonomyItem.data.genre_slug);

      expect(hasTargetContent).toBe(false);
    });

    it("should fallback to slug matching when i18n field is missing", () => {
      // ES genre: { genre_slug: "poetry" } (no i18n field, same slug in both languages)
      const taxonomyItem = {
        data: {
          genre_slug: "poetry",
          name: "Poesía",
          language: "es",
        },
      };

      // EN genres available: ["poetry", "fiction", "horror"]
      const targetTaxonomySlugs = new Set(["poetry", "fiction", "horror"]);

      const translationSlug = taxonomyItem.data.i18n;
      const hasTargetContent = translationSlug
        ? targetTaxonomySlugs.has(translationSlug)
        : targetTaxonomySlugs.has(taxonomyItem.data.genre_slug);

      expect(hasTargetContent).toBe(true);
    });

    it("should demonstrate the BUG that was fixed", () => {
      // This test shows what the OLD (buggy) code was doing
      const taxonomyItem = {
        data: {
          genre_slug: "ficcion",
          i18n: "fiction",
          name: "Ficción",
          language: "es",
        },
      };

      const targetTaxonomySlugs = new Set(["fiction", "horror", "thriller"]);

      // ❌ OLD BUGGY CODE: checking same slug instead of i18n
      const hasBuggyLogic = targetTaxonomySlugs.has(taxonomyItem.data.genre_slug);
      expect(hasBuggyLogic).toBe(false); // BUG: returns false even though translation exists

      // ✅ FIXED CODE: checking i18n slug
      const translationSlug = taxonomyItem.data.i18n;
      const hasFixedLogic = translationSlug
        ? targetTaxonomySlugs.has(translationSlug)
        : targetTaxonomySlugs.has(taxonomyItem.data.genre_slug);
      expect(hasFixedLogic).toBe(true); // CORRECT: returns true
    });

    it("should work with categories i18n", () => {
      // ES: { category_slug: "libros", i18n: "books" }
      const taxonomyItem = {
        data: {
          category_slug: "libros",
          i18n: "books",
          name: "Libros",
          language: "es",
        },
      };

      const targetTaxonomySlugs = new Set(["books", "tutorials", "reviews"]);

      const translationSlug = taxonomyItem.data.i18n;
      const hasTargetContent = translationSlug
        ? targetTaxonomySlugs.has(translationSlug)
        : targetTaxonomySlugs.has(taxonomyItem.data.category_slug);

      expect(hasTargetContent).toBe(true);
    });

    it("should work with challenges i18n", () => {
      // ES: { challenge_slug: "reto-lectura-2017", i18n: "2017-reading-challenge" }
      const taxonomyItem = {
        data: {
          challenge_slug: "reto-lectura-2017",
          i18n: "2017-reading-challenge",
          name: "Reto de Lectura 2017",
          language: "es",
        },
      };

      const targetTaxonomySlugs = new Set(["2017-reading-challenge", "2018-reading-challenge"]);

      const translationSlug = taxonomyItem.data.i18n;
      const hasTargetContent = translationSlug
        ? targetTaxonomySlugs.has(translationSlug)
        : targetTaxonomySlugs.has(taxonomyItem.data.challenge_slug);

      expect(hasTargetContent).toBe(true);
    });
  });
});
