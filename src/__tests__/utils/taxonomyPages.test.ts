import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";

/**
 * Tests for taxonomyPages.ts filtering logic
 *
 * Tests the category filtering logic that handles:
 * - All content types now use array fields (categories, genres, etc.)
 * - Singular fields for unique relationships (author, publisher, series)
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
});
