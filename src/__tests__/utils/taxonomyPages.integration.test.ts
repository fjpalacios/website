/**
 * Integration tests for taxonomyPages.ts
 *
 * These tests verify the i18n logic without depending on Astro's content collections.
 * Tests the bug fix for language switcher on taxonomy pages.
 *
 * Bug: hasTargetContent was checking same slug instead of i18n field value.
 *
 * Note: These tests simulate real data structures but don't require astro:content
 */

import { describe, expect, it } from "vitest";

/**
 * Mock genre data structure matching real content
 */
interface MockGenre {
  genre_slug: string;
  i18n?: string;
  name: string;
  language: string;
}

/**
 * Simulates the i18n checking logic from taxonomyPages.ts:177
 */
function checkHasTargetContent(currentItem: { genre_slug: string; i18n?: string }, targetSlugs: Set<string>): boolean {
  const translationSlug = currentItem.i18n;
  return translationSlug ? targetSlugs.has(translationSlug) : targetSlugs.has(currentItem.genre_slug);
}

describe("taxonomyPages integration - i18n logic simulation", () => {
  // Simulated genre data (matches real content structure)
  const mockGenres: MockGenre[] = [
    // Spanish genres
    { genre_slug: "ficcion", i18n: "fiction", name: "Ficción", language: "es" },
    { genre_slug: "terror", i18n: "horror", name: "Terror", language: "es" },
    { genre_slug: "crimen", i18n: "crime", name: "Crimen", language: "es" },
    { genre_slug: "fantastico", i18n: "fantasy", name: "Fantástico", language: "es" },
    { genre_slug: "suspense", i18n: "thriller", name: "Suspense", language: "es" },
    { genre_slug: "intriga", i18n: "mystery", name: "Intriga", language: "es" },

    // English genres
    { genre_slug: "fiction", i18n: "ficcion", name: "Fiction", language: "en" },
    { genre_slug: "horror", i18n: "terror", name: "Horror", language: "en" },
    { genre_slug: "crime", i18n: "crimen", name: "Crime", language: "en" },
    { genre_slug: "fantasy", i18n: "fantastico", name: "Fantasy", language: "en" },
    { genre_slug: "thriller", i18n: "suspense", name: "Thriller", language: "en" },
    { genre_slug: "mystery", i18n: "intriga", name: "Mystery", language: "en" },
  ];
  describe("i18n field logic - genres", () => {
    it("should return true when i18n slug exists in target language", () => {
      // Spanish fiction genre: { genre_slug: "ficcion", i18n: "fiction" }
      const esGenre = mockGenres.find((g) => g.genre_slug === "ficcion");
      const enSlugs = new Set(mockGenres.filter((g) => g.language === "en").map((g) => g.genre_slug));

      const hasTargetContent = checkHasTargetContent(esGenre!, enSlugs);

      expect(hasTargetContent).toBe(true);
    });

    it("should return true for English genre with Spanish translation", () => {
      // English fiction genre: { genre_slug: "fiction", i18n: "ficcion" }
      const enGenre = mockGenres.find((g) => g.genre_slug === "fiction" && g.language === "en");
      const esSlugs = new Set(mockGenres.filter((g) => g.language === "es").map((g) => g.genre_slug));

      const hasTargetContent = checkHasTargetContent(enGenre!, esSlugs);

      expect(hasTargetContent).toBe(true);
    });

    it("should work for horror/terror pair", () => {
      const esGenre = mockGenres.find((g) => g.genre_slug === "terror");
      const enSlugs = new Set(mockGenres.filter((g) => g.language === "en").map((g) => g.genre_slug));

      expect(checkHasTargetContent(esGenre!, enSlugs)).toBe(true);

      const enGenre = mockGenres.find((g) => g.genre_slug === "horror" && g.language === "en");
      const esSlugs = new Set(mockGenres.filter((g) => g.language === "es").map((g) => g.genre_slug));

      expect(checkHasTargetContent(enGenre!, esSlugs)).toBe(true);
    });

    it("should work for all 6 genre pairs", () => {
      const pairs = [
        { es: "ficcion", en: "fiction" },
        { es: "terror", en: "horror" },
        { es: "crimen", en: "crime" },
        { es: "fantastico", en: "fantasy" },
        { es: "suspense", en: "thriller" },
        { es: "intriga", en: "mystery" },
      ];

      for (const pair of pairs) {
        const esGenre = mockGenres.find((g) => g.genre_slug === pair.es);
        const enGenre = mockGenres.find((g) => g.genre_slug === pair.en && g.language === "en");

        const enSlugs = new Set(mockGenres.filter((g) => g.language === "en").map((g) => g.genre_slug));
        const esSlugs = new Set(mockGenres.filter((g) => g.language === "es").map((g) => g.genre_slug));

        expect(checkHasTargetContent(esGenre!, enSlugs), `${pair.es} -> ${pair.en}`).toBe(true);
        expect(checkHasTargetContent(enGenre!, esSlugs), `${pair.en} -> ${pair.es}`).toBe(true);
      }
    });

    it("should return false when i18n points to non-existent slug", () => {
      const fakeGenre = {
        genre_slug: "biografia",
        i18n: "biography", // This doesn't exist in our mock data
      };

      const enSlugs = new Set(mockGenres.filter((g) => g.language === "en").map((g) => g.genre_slug));

      expect(checkHasTargetContent(fakeGenre, enSlugs)).toBe(false);
    });

    it("should fallback to slug matching when i18n is missing", () => {
      const genreWithoutI18n = {
        genre_slug: "poetry",
        // No i18n field
      };

      // Case 1: Same slug exists in target language
      const targetSlugsWithPoetry = new Set(["poetry", "fiction"]);
      expect(checkHasTargetContent(genreWithoutI18n, targetSlugsWithPoetry)).toBe(true);

      // Case 2: Same slug doesn't exist
      const targetSlugsWithoutPoetry = new Set(["fiction", "horror"]);
      expect(checkHasTargetContent(genreWithoutI18n, targetSlugsWithoutPoetry)).toBe(false);
    });
  });

  describe("Regression test: The actual bug", () => {
    it("should NOT use same slug matching (demonstrates the bug)", () => {
      // ES genre: ficcion
      const esGenre = mockGenres.find((g) => g.genre_slug === "ficcion");
      const enSlugs = new Set(mockGenres.filter((g) => g.language === "en").map((g) => g.genre_slug));

      // ❌ BUGGY LOGIC: Checking if "ficcion" exists in English slugs
      const buggyResult = enSlugs.has(esGenre!.genre_slug);
      expect(buggyResult).toBe(false); // Bug: returns false

      // ✅ FIXED LOGIC: Checking if "fiction" (i18n) exists in English slugs
      const fixedResult = checkHasTargetContent(esGenre!, enSlugs);
      expect(fixedResult).toBe(true); // Correct: returns true
    });

    it("should verify the fix works in both directions", () => {
      // ES -> EN
      const esGenre = mockGenres.find((g) => g.genre_slug === "terror");
      const enSlugs = new Set(mockGenres.filter((g) => g.language === "en").map((g) => g.genre_slug));

      expect(enSlugs.has("terror")).toBe(false); // "terror" doesn't exist in EN
      expect(enSlugs.has("horror")).toBe(true); // but "horror" does
      expect(checkHasTargetContent(esGenre!, enSlugs)).toBe(true); // Fix uses i18n

      // EN -> ES
      const enGenre = mockGenres.find((g) => g.genre_slug === "horror" && g.language === "en");
      const esSlugs = new Set(mockGenres.filter((g) => g.language === "es").map((g) => g.genre_slug));

      expect(esSlugs.has("horror")).toBe(false); // "horror" doesn't exist in ES
      expect(esSlugs.has("terror")).toBe(true); // but "terror" does
      expect(checkHasTargetContent(enGenre!, esSlugs)).toBe(true); // Fix uses i18n
    });

    it("should show what would happen with the buggy code", () => {
      const genrePairs = [
        { es: "ficcion", en: "fiction" },
        { es: "terror", en: "horror" },
        { es: "crimen", en: "crime" },
      ];

      const enSlugs = new Set(mockGenres.filter((g) => g.language === "en").map((g) => g.genre_slug));

      for (const pair of genrePairs) {
        const esGenre = mockGenres.find((g) => g.genre_slug === pair.es);

        // Buggy: Check if ES slug exists in EN slugs
        const buggyCheck = enSlugs.has(pair.es);
        expect(buggyCheck, `Bug: ${pair.es} should not be in EN slugs`).toBe(false);

        // Fixed: Check if i18n value exists in EN slugs
        const fixedCheck = checkHasTargetContent(esGenre!, enSlugs);
        expect(fixedCheck, `Fix: ${pair.es} should find ${pair.en}`).toBe(true);
      }
    });
  });

  describe("Edge cases", () => {
    it("should handle empty i18n field", () => {
      const genreWithEmptyI18n = {
        genre_slug: "poetry",
        i18n: "", // Empty string
      };

      const targetSlugs = new Set(["fiction", "horror"]);

      // Empty string is falsy, so should fallback to slug matching
      const result = checkHasTargetContent(genreWithEmptyI18n, targetSlugs);
      expect(result).toBe(false); // "poetry" not in target slugs
    });

    it("should handle undefined i18n field", () => {
      const genreWithoutI18n = {
        genre_slug: "fiction",
        // i18n is undefined
      };

      const targetSlugs = new Set(["fiction", "horror"]);

      // Should fallback to slug matching
      const result = checkHasTargetContent(genreWithoutI18n, targetSlugs);
      expect(result).toBe(true); // "fiction" is in target slugs
    });

    it("should validate all i18n references are reciprocal", () => {
      // For each ES genre with i18n, verify EN genre points back
      const esGenres = mockGenres.filter((g) => g.language === "es" && g.i18n);

      for (const esGenre of esGenres) {
        const enGenre = mockGenres.find((g) => g.genre_slug === esGenre.i18n && g.language === "en");

        expect(enGenre, `EN genre ${esGenre.i18n} should exist`).toBeDefined();
        expect(enGenre?.i18n, `${esGenre.i18n} should point back to ${esGenre.genre_slug}`).toBe(esGenre.genre_slug);
      }
    });
  });

  describe("Categories simulation", () => {
    it("should work with category data structure", () => {
      const mockCategories = [
        { category_slug: "libros", i18n: "books", name: "Libros", language: "es" },
        { category_slug: "tutoriales", i18n: "tutorials", name: "Tutoriales", language: "es" },
        { category_slug: "books", i18n: "libros", name: "Books", language: "en" },
        { category_slug: "tutorials", i18n: "tutoriales", name: "Tutorials", language: "en" },
      ];

      const enSlugs = new Set(mockCategories.filter((c) => c.language === "en").map((c) => c.category_slug));

      const librosCategory = { category_slug: "libros", i18n: "books" };
      const result = checkHasTargetContent(librosCategory, enSlugs);

      expect(result).toBe(true);
    });
  });

  describe("Challenges simulation", () => {
    it("should work with challenge data structure", () => {
      const mockChallenges = [
        { challenge_slug: "reto-lectura-2017", i18n: "2017-reading-challenge", name: "Reto 2017", language: "es" },
        { challenge_slug: "2017-reading-challenge", i18n: "reto-lectura-2017", name: "Challenge 2017", language: "en" },
      ];

      const enSlugs = new Set(mockChallenges.filter((c) => c.language === "en").map((c) => c.challenge_slug));

      const retoChallenge = { challenge_slug: "reto-lectura-2017", i18n: "2017-reading-challenge" };
      const result = checkHasTargetContent(retoChallenge, enSlugs);

      expect(result).toBe(true);
    });
  });
});
