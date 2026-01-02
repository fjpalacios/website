import { describe, expect, it } from "vitest";

import { categoriesSchema } from "@/schemas/blog";

describe("Categories Collection Schema", () => {
  describe("Valid categories", () => {
    it("should validate a complete valid category", () => {
      const validCategory = {
        name: "Book Reviews",
        category_slug: "book-reviews",
        description: "Reviews and opinions about books",
        language: "en",
      };

      expect(() => categoriesSchema.parse(validCategory)).not.toThrow();
    });

    it("should validate category in Spanish", () => {
      const spanishCategory = {
        name: "Reseñas de Libros",
        category_slug: "resenas-de-libros",
        description: "Reseñas y opiniones sobre libros",
        language: "es",
      };

      expect(() => categoriesSchema.parse(spanishCategory)).not.toThrow();
    });

    it("should validate category without description", () => {
      const minimalCategory = {
        name: "Programming",
        category_slug: "programming",
        language: "en",
      };

      expect(() => categoriesSchema.parse(minimalCategory)).not.toThrow();
    });
  });

  describe("Required fields", () => {
    const baseCategory = {
      name: "Test Category",
      category_slug: "test-category",
      language: "es",
    };

    it("should require name", () => {
      const { name: _name, ...categoryWithoutName } = baseCategory;
      expect(() => categoriesSchema.parse(categoryWithoutName)).toThrow();
    });

    it("should require category_slug", () => {
      const { category_slug: _category_slug, ...categoryWithoutSlug } = baseCategory;
      expect(() => categoriesSchema.parse(categoryWithoutSlug)).toThrow();
    });

    it("should require language", () => {
      const { language: _language, ...categoryWithoutLanguage } = baseCategory;
      expect(() => categoriesSchema.parse(categoryWithoutLanguage)).toThrow();
    });
  });

  describe("Field validation", () => {
    const baseCategory = {
      name: "Test Category",
      category_slug: "test-category",
      language: "es",
    };

    it("should reject empty name", () => {
      expect(() => categoriesSchema.parse({ ...baseCategory, name: "" })).toThrow();
    });

    it("should reject empty category_slug", () => {
      expect(() => categoriesSchema.parse({ ...baseCategory, category_slug: "" })).toThrow();
    });

    it("should reject invalid language", () => {
      expect(() => categoriesSchema.parse({ ...baseCategory, language: "fr" })).toThrow();
    });

    it("should accept es language", () => {
      expect(() => categoriesSchema.parse({ ...baseCategory, language: "es" })).not.toThrow();
    });

    it("should accept en language", () => {
      expect(() => categoriesSchema.parse({ ...baseCategory, language: "en" })).not.toThrow();
    });
  });

  describe("Optional fields", () => {
    const baseCategory = {
      name: "Test Category",
      category_slug: "test-category",
      language: "es",
    };

    it("should accept optional description field", () => {
      const withDescription = {
        ...baseCategory,
        description: "A test category description",
      };
      expect(() => categoriesSchema.parse(withDescription)).not.toThrow();
    });

    it("should accept empty description", () => {
      const withEmptyDescription = { ...baseCategory, description: "" };
      expect(() => categoriesSchema.parse(withEmptyDescription)).not.toThrow();
    });
  });

  describe("Edge cases", () => {
    const baseCategory = {
      name: "Test Category",
      category_slug: "test-category",
      language: "es",
    };

    it("should handle very long name", () => {
      const longName = "A".repeat(200);
      expect(() => categoriesSchema.parse({ ...baseCategory, name: longName })).not.toThrow();
    });

    it("should handle very long description", () => {
      const longDescription = "A".repeat(1000);
      expect(() => categoriesSchema.parse({ ...baseCategory, description: longDescription })).not.toThrow();
    });

    it("should handle name with special characters", () => {
      const specialName = "C++ & C# Programming";
      expect(() => categoriesSchema.parse({ ...baseCategory, name: specialName })).not.toThrow();
    });

    it("should handle slug with numbers", () => {
      const numericSlug = "category-123";
      expect(() => categoriesSchema.parse({ ...baseCategory, category_slug: numericSlug })).not.toThrow();
    });
  });

  describe("Real-world examples", () => {
    it("should validate book reviews category", () => {
      const bookReviews = {
        name: "Book Reviews",
        category_slug: "book-reviews",
        description: "Reviews and opinions about fiction and non-fiction books",
        language: "en",
      };

      expect(() => categoriesSchema.parse(bookReviews)).not.toThrow();
    });

    it("should validate tutorials category in Spanish", () => {
      const tutorials = {
        name: "Tutoriales",
        category_slug: "tutoriales",
        description: "Tutoriales de programación y desarrollo web",
        language: "es",
      };

      expect(() => categoriesSchema.parse(tutorials)).not.toThrow();
    });

    it("should validate development category", () => {
      const development = {
        name: "Web Development",
        category_slug: "web-development",
        description: "Articles about web development, frontend, backend, and DevOps",
        language: "en",
      };

      expect(() => categoriesSchema.parse(development)).not.toThrow();
    });

    it("should validate minimal category", () => {
      const minimal = {
        name: "General",
        category_slug: "general",
        language: "en",
      };

      expect(() => categoriesSchema.parse(minimal)).not.toThrow();
    });

    it("should validate year review category", () => {
      const yearReview = {
        name: "Year in Review",
        category_slug: "year-in-review",
        description: "Annual summaries and retrospectives",
        language: "en",
      };

      expect(() => categoriesSchema.parse(yearReview)).not.toThrow();
    });
  });

  describe("i18n support", () => {
    it("should accept optional i18n field", () => {
      const categoryWithI18n = {
        name: "Book Reviews",
        category_slug: "book-reviews-en",
        description: "Reviews and opinions about books",
        language: "en",
        i18n: "resenas-de-libros-es", // Points to Spanish version
      };

      expect(() => categoriesSchema.parse(categoryWithI18n)).not.toThrow();
    });

    it("should allow same category in different languages", () => {
      const englishVersion = {
        name: "Book Reviews",
        category_slug: "book-reviews",
        description: "Reviews about books",
        language: "en",
        i18n: "resenas-de-libros",
      };

      const spanishVersion = {
        name: "Reseñas de Libros",
        category_slug: "resenas-de-libros",
        description: "Reseñas sobre libros",
        language: "es",
        i18n: "book-reviews",
      };

      expect(() => categoriesSchema.parse(englishVersion)).not.toThrow();
      expect(() => categoriesSchema.parse(spanishVersion)).not.toThrow();
    });
  });
});
