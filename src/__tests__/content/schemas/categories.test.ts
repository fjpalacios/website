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
      const { name, ...categoryWithoutName } = baseCategory;
      expect(() => categoriesSchema.parse(categoryWithoutName)).toThrow();
    });

    it("should require category_slug", () => {
      const { category_slug, ...categoryWithoutSlug } = baseCategory;
      expect(() => categoriesSchema.parse(categoryWithoutSlug)).toThrow();
    });

    it("should require language", () => {
      const { language, ...categoryWithoutLanguage } = baseCategory;
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

    it("should accept optional icon field", () => {
      const withIcon = { ...baseCategory, icon: "book" };
      expect(() => categoriesSchema.parse(withIcon)).not.toThrow();
    });

    it("should accept optional color field", () => {
      const withColor = { ...baseCategory, color: "#3b82f6" };
      expect(() => categoriesSchema.parse(withColor)).not.toThrow();
    });

    it("should accept optional order field", () => {
      const withOrder = { ...baseCategory, order: 1 };
      expect(() => categoriesSchema.parse(withOrder)).not.toThrow();
    });

    it("should reject negative order", () => {
      expect(() => categoriesSchema.parse({ ...baseCategory, order: -1 })).toThrow();
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

    it("should handle large order numbers", () => {
      expect(() => categoriesSchema.parse({ ...baseCategory, order: 999 })).not.toThrow();
    });
  });

  describe("Real-world examples", () => {
    it("should validate book reviews category", () => {
      const bookReviews = {
        name: "Book Reviews",
        category_slug: "book-reviews",
        description: "Reviews and opinions about fiction and non-fiction books",
        language: "en",
        icon: "book-open",
        color: "#3b82f6",
        order: 1,
      };

      expect(() => categoriesSchema.parse(bookReviews)).not.toThrow();
    });

    it("should validate tutorials category in Spanish", () => {
      const tutorials = {
        name: "Tutoriales",
        category_slug: "tutoriales",
        description: "Tutoriales de programación y desarrollo web",
        language: "es",
        icon: "code",
        color: "#10b981",
        order: 2,
      };

      expect(() => categoriesSchema.parse(tutorials)).not.toThrow();
    });

    it("should validate development category", () => {
      const development = {
        name: "Web Development",
        category_slug: "web-development",
        description: "Articles about web development, frontend, backend, and DevOps",
        language: "en",
        icon: "globe",
        order: 3,
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
        icon: "calendar",
        color: "#f59e0b",
        order: 10,
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

  describe("UI metadata", () => {
    it("should support icon for visual representation", () => {
      const withIcon = {
        name: "Programming",
        category_slug: "programming",
        language: "en",
        icon: "code-bracket",
      };

      expect(() => categoriesSchema.parse(withIcon)).not.toThrow();
    });

    it("should support color for category styling", () => {
      const withColor = {
        name: "Design",
        category_slug: "design",
        language: "en",
        color: "#ec4899",
      };

      expect(() => categoriesSchema.parse(withColor)).not.toThrow();
    });

    it("should support order for category sorting", () => {
      const withOrder = {
        name: "Featured",
        category_slug: "featured",
        language: "en",
        order: 0, // First in list
      };

      expect(() => categoriesSchema.parse(withOrder)).not.toThrow();
    });

    it("should support all UI metadata together", () => {
      const fullUI = {
        name: "Tutorials",
        category_slug: "tutorials",
        description: "Step-by-step programming tutorials",
        language: "en",
        icon: "academic-cap",
        color: "#8b5cf6",
        order: 2,
      };

      expect(() => categoriesSchema.parse(fullUI)).not.toThrow();
    });
  });
});
