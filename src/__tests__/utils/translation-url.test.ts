import { describe, expect, it } from "vitest";

import {
  buildDetailPageUrl,
  buildHomeUrl,
  buildStaticPageUrl,
  isHomePage,
  isStaticPage,
} from "../../utils/translation-url";

describe("translation-url helpers", () => {
  describe("isHomePage", () => {
    it("should return true for empty path parts", () => {
      expect(isHomePage([])).toBe(true);
    });

    it("should return true for path with only language", () => {
      expect(isHomePage(["es"])).toBe(true);
      expect(isHomePage(["en"])).toBe(true);
    });

    it("should return false for path with more segments", () => {
      expect(isHomePage(["es", "libros"])).toBe(false);
      expect(isHomePage(["en", "about"])).toBe(false);
    });
  });

  describe("isStaticPage", () => {
    it("should return true for about page (es)", () => {
      expect(isStaticPage(["es", "acerca-de"], "es")).toBe(true);
    });

    it("should return true for about page (en)", () => {
      expect(isStaticPage(["en", "about"], "en")).toBe(true);
    });

    it("should return false for content pages", () => {
      expect(isStaticPage(["es", "libros", "slug"], "es")).toBe(false);
      expect(isStaticPage(["en", "books", "slug"], "en")).toBe(false);
    });

    it("should return false for listing pages", () => {
      expect(isStaticPage(["es", "libros"], "es")).toBe(false);
      expect(isStaticPage(["en", "tutorials"], "en")).toBe(false);
    });

    it("should handle pagination paths", () => {
      expect(isStaticPage(["es", "libros", "pagina", "2"], "es")).toBe(false);
    });
  });

  describe("buildHomeUrl", () => {
    it("should build Spanish home URL", () => {
      expect(buildHomeUrl("es")).toBe("/es");
    });

    it("should build English home URL", () => {
      expect(buildHomeUrl("en")).toBe("/en");
    });
  });

  describe("buildStaticPageUrl", () => {
    it("should translate about page from Spanish to English", () => {
      const result = buildStaticPageUrl(["es", "acerca-de"], "es", "en");
      expect(result).toBe("/en/about");
    });

    it("should translate about page from English to Spanish", () => {
      const result = buildStaticPageUrl(["en", "about"], "en", "es");
      expect(result).toBe("/es/acerca-de");
    });

    it("should handle unknown segments by swapping language only", () => {
      const result = buildStaticPageUrl(["es", "unknown-segment"], "es", "en");
      expect(result).toBe("/en/unknown-segment");
    });

    it("should redirect pagination pages to page 1 in target language", () => {
      // Spanish pagination to English (should go to page 1)
      const result1 = buildStaticPageUrl(["es", "publicaciones", "pagina", "2"], "es", "en");
      expect(result1).toBe("/en/posts");

      // English pagination to Spanish (should go to page 1)
      const result2 = buildStaticPageUrl(["en", "books", "page", "3"], "en", "es");
      expect(result2).toBe("/es/libros");

      // Tutorials pagination
      const result3 = buildStaticPageUrl(["es", "tutoriales", "pagina", "5"], "es", "en");
      expect(result3).toBe("/en/tutorials");

      // Posts pagination
      const result4 = buildStaticPageUrl(["en", "posts", "page", "10"], "en", "es");
      expect(result4).toBe("/es/publicaciones");
    });

    it("should handle feeds page translation", () => {
      const result = buildStaticPageUrl(["es", "feeds"], "es", "en");
      expect(result).toBe("/en/feeds");
    });
  });

  describe("buildDetailPageUrl", () => {
    it("should build Spanish detail page URL", () => {
      const result = buildDetailPageUrl("libros", "mi-libro", "es", "es");
      expect(result).toBe("/es/libros/mi-libro");
    });

    it("should build English detail page URL", () => {
      const result = buildDetailPageUrl("books", "my-book", "en", "en");
      expect(result).toBe("/en/books/my-book");
    });

    it("should translate from Spanish books to English books", () => {
      const result = buildDetailPageUrl("libros", "my-translated-book", "es", "en");
      expect(result).toBe("/en/books/my-translated-book");
    });

    it("should translate from English tutorials to Spanish tutoriales", () => {
      const result = buildDetailPageUrl("tutorials", "mi-tutorial", "en", "es");
      expect(result).toBe("/es/tutoriales/mi-tutorial");
    });

    it("should handle posts translation", () => {
      const result = buildDetailPageUrl("posts", "my-post", "en", "es");
      expect(result).toBe("/es/publicaciones/my-post");
    });

    it("should handle authors translation", () => {
      const result = buildDetailPageUrl("authors", "stephen-king", "en", "es");
      expect(result).toBe("/es/autores/stephen-king");
    });

    it("should handle categories translation", () => {
      const result = buildDetailPageUrl("categories", "ficcion", "en", "es");
      expect(result).toBe("/es/categorias/ficcion");
    });

    it("should handle genres translation", () => {
      const result = buildDetailPageUrl("genres", "terror", "en", "es");
      expect(result).toBe("/es/generos/terror");
    });
  });

  describe("edge cases", () => {
    it("should handle empty translationSlug gracefully", () => {
      const result = buildDetailPageUrl("books", "", "en", "es");
      expect(result).toBe("/es/libros/");
    });

    it("should handle paths with trailing slashes", () => {
      const result = buildStaticPageUrl(["es", "acerca-de"], "es", "en");
      expect(result).toBe("/en/about");
    });
  });
});
