import { describe, expect, it } from "vitest";

import { hasTranslation, isIndexPage, isStaticPage } from "../../utils/translation-availability";

describe("translation-availability helpers", () => {
  describe("isStaticPage", () => {
    it("should return true for Spanish home page", () => {
      expect(isStaticPage("/es", "es")).toBe(true);
      expect(isStaticPage("/es/", "es")).toBe(true);
    });

    it("should return true for English home page", () => {
      expect(isStaticPage("/en", "en")).toBe(true);
      expect(isStaticPage("/en/", "en")).toBe(true);
    });

    it("should return true for Spanish about page", () => {
      expect(isStaticPage("/es/acerca-de", "es")).toBe(true);
      expect(isStaticPage("/es/acerca-de/", "es")).toBe(true);
    });

    it("should return true for English about page", () => {
      expect(isStaticPage("/en/about", "en")).toBe(true);
      expect(isStaticPage("/en/about/", "en")).toBe(true);
    });

    it("should return false for content pages", () => {
      expect(isStaticPage("/es/libros", "es")).toBe(false);
      expect(isStaticPage("/en/books/my-book", "en")).toBe(false);
    });

    it("should return false for taxonomy pages", () => {
      expect(isStaticPage("/es/autores/stephen-king", "es")).toBe(false);
      expect(isStaticPage("/en/categories/fiction", "en")).toBe(false);
    });
  });

  describe("isIndexPage", () => {
    it("should return true for Spanish posts index", () => {
      expect(isIndexPage("/es/publicaciones", "es")).toBe(true);
      expect(isIndexPage("/es/publicaciones/", "es")).toBe(true);
    });

    it("should return true for English posts index", () => {
      expect(isIndexPage("/en/posts", "en")).toBe(true);
      expect(isIndexPage("/en/posts/", "en")).toBe(true);
    });

    it("should return true for Spanish tutorials index", () => {
      expect(isIndexPage("/es/tutoriales", "es")).toBe(true);
    });

    it("should return true for English tutorials index", () => {
      expect(isIndexPage("/en/tutorials", "en")).toBe(true);
    });

    it("should return true for Spanish books index", () => {
      expect(isIndexPage("/es/libros", "es")).toBe(true);
    });

    it("should return true for English books index", () => {
      expect(isIndexPage("/en/books", "en")).toBe(true);
    });

    it("should return true for feeds page", () => {
      expect(isIndexPage("/es/feeds", "es")).toBe(true);
      expect(isIndexPage("/en/feeds", "en")).toBe(true);
    });

    it("should return true for taxonomy indexes", () => {
      expect(isIndexPage("/es/autores", "es")).toBe(true);
      expect(isIndexPage("/en/authors", "en")).toBe(true);
      expect(isIndexPage("/es/categorias", "es")).toBe(true);
      expect(isIndexPage("/en/categories", "en")).toBe(true);
      expect(isIndexPage("/es/generos", "es")).toBe(true);
      expect(isIndexPage("/en/genres", "en")).toBe(true);
      expect(isIndexPage("/es/editoriales", "es")).toBe(true);
      expect(isIndexPage("/en/publishers", "en")).toBe(true);
      expect(isIndexPage("/es/series", "es")).toBe(true);
      expect(isIndexPage("/en/series", "en")).toBe(true);
      expect(isIndexPage("/es/retos", "es")).toBe(true);
      expect(isIndexPage("/en/challenges", "en")).toBe(true);
      expect(isIndexPage("/es/cursos", "es")).toBe(true);
      expect(isIndexPage("/en/courses", "en")).toBe(true);
    });

    it("should return false for detail pages", () => {
      expect(isIndexPage("/es/libros/mi-libro", "es")).toBe(false);
      expect(isIndexPage("/en/posts/my-post", "en")).toBe(false);
    });

    it("should return false for paginated pages", () => {
      expect(isIndexPage("/es/libros/pagina/2", "es")).toBe(false);
      expect(isIndexPage("/en/posts/page/3", "en")).toBe(false);
    });

    it("should return false for home page", () => {
      expect(isIndexPage("/es", "es")).toBe(false);
      expect(isIndexPage("/en/", "en")).toBe(false);
    });
  });

  describe("hasTranslation", () => {
    describe("static pages", () => {
      it("should always return true for home page", () => {
        expect(hasTranslation("/es", "es", undefined, undefined)).toBe(true);
        expect(hasTranslation("/en/", "en", undefined, undefined)).toBe(true);
      });

      it("should always return true for about page", () => {
        expect(hasTranslation("/es/acerca-de", "es", undefined, undefined)).toBe(true);
        expect(hasTranslation("/en/about", "en", undefined, undefined)).toBe(true);
      });
    });

    describe("index pages", () => {
      it("should return true when hasTargetContent is true", () => {
        expect(hasTranslation("/es/libros", "es", undefined, true)).toBe(true);
        expect(hasTranslation("/en/tutorials", "en", undefined, true)).toBe(true);
      });

      it("should return false when hasTargetContent is false", () => {
        expect(hasTranslation("/es/libros", "es", undefined, false)).toBe(false);
        expect(hasTranslation("/en/tutorials", "en", undefined, false)).toBe(false);
      });

      it("should return true when hasTargetContent is undefined (backward compatibility)", () => {
        expect(hasTranslation("/es/libros", "es", undefined, undefined)).toBe(true);
        expect(hasTranslation("/en/posts", "en", undefined, undefined)).toBe(true);
      });
    });

    describe("detail pages", () => {
      it("should return true when translationSlug is provided", () => {
        expect(hasTranslation("/es/libros/mi-libro", "es", "my-book", undefined)).toBe(true);
        expect(hasTranslation("/en/posts/my-post", "en", "mi-publicacion", undefined)).toBe(true);
      });

      it("should return false when translationSlug is undefined", () => {
        expect(hasTranslation("/es/libros/mi-libro", "es", undefined, undefined)).toBe(false);
        expect(hasTranslation("/en/tutorials/my-tutorial", "en", undefined, undefined)).toBe(false);
      });

      it("should return false when translationSlug is empty string", () => {
        expect(hasTranslation("/es/libros/mi-libro", "es", "", undefined)).toBe(false);
        expect(hasTranslation("/en/posts/my-post", "en", "", undefined)).toBe(false);
      });
    });

    describe("taxonomy detail pages", () => {
      it("should depend on translationSlug like content pages", () => {
        expect(hasTranslation("/es/autores/stephen-king", "es", "stephen-king", undefined)).toBe(true);
        expect(hasTranslation("/en/categories/fiction", "en", undefined, undefined)).toBe(false);
      });
    });

    describe("edge cases", () => {
      it("should handle paths with trailing slashes", () => {
        expect(hasTranslation("/es/", "es", undefined, undefined)).toBe(true);
        expect(hasTranslation("/es/acerca-de/", "es", undefined, undefined)).toBe(true);
        expect(hasTranslation("/es/libros/", "es", undefined, true)).toBe(true);
      });

      it("should handle empty translationSlug for index pages", () => {
        expect(hasTranslation("/es/libros", "es", "", true)).toBe(true);
      });
    });
  });
});
