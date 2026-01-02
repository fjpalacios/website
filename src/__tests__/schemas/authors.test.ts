import { describe, expect, it } from "vitest";

import { authorsSchema } from "@/schemas/blog";

describe("Authors Collection Schema", () => {
  describe("Valid authors", () => {
    it("should validate a complete valid author", () => {
      const validAuthor = {
        name: "Stephen King",
        author_slug: "stephen-king",
        language: "en",
        gender: "male",
        picture: "./stephen-king.jpg",
        website: "https://stephenking.com",
        twitter: "@StephenKing",
      };

      expect(() => authorsSchema.parse(validAuthor)).not.toThrow();
    });

    it("should validate author in Spanish", () => {
      const spanishAuthor = {
        name: "Camilla Läckberg",
        author_slug: "camilla-lackberg",
        language: "es",
        gender: "female",
      };

      expect(() => authorsSchema.parse(spanishAuthor)).not.toThrow();
    });

    it("should validate author without optional fields", () => {
      const minimalAuthor = {
        name: "John Doe",
        author_slug: "john-doe",
        language: "en",
      };

      expect(() => authorsSchema.parse(minimalAuthor)).not.toThrow();
    });
  });

  describe("Required fields", () => {
    const baseAuthor = {
      name: "Test Author",
      author_slug: "test-author",
      language: "es",
    };

    it("should require name", () => {
      const { name: _name, ...authorWithoutName } = baseAuthor;
      expect(() => authorsSchema.parse(authorWithoutName)).toThrow();
    });

    it("should require author_slug", () => {
      const { author_slug: _author_slug, ...authorWithoutSlug } = baseAuthor;
      expect(() => authorsSchema.parse(authorWithoutSlug)).toThrow();
    });

    it("should require language", () => {
      const { language: _language, ...authorWithoutLanguage } = baseAuthor;
      expect(() => authorsSchema.parse(authorWithoutLanguage)).toThrow();
    });
  });

  describe("Field validation", () => {
    const baseAuthor = {
      name: "Test Author",
      author_slug: "test-author",
      language: "es",
    };

    it("should reject empty name", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, name: "" })).toThrow();
    });

    it("should reject empty author_slug", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, author_slug: "" })).toThrow();
    });

    it("should reject invalid language", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, language: "fr" })).toThrow();
    });

    it("should accept es language", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, language: "es" })).not.toThrow();
    });

    it("should accept en language", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, language: "en" })).not.toThrow();
    });
  });

  describe("Optional fields", () => {
    const baseAuthor = {
      name: "Test Author",
      author_slug: "test-author",
      language: "es",
    };

    it("should accept optional gender field", () => {
      const withGender = { ...baseAuthor, gender: "male" };
      expect(() => authorsSchema.parse(withGender)).not.toThrow();
    });

    it("should accept all gender values", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, gender: "male" })).not.toThrow();
      expect(() => authorsSchema.parse({ ...baseAuthor, gender: "female" })).not.toThrow();
      expect(() => authorsSchema.parse({ ...baseAuthor, gender: "other" })).not.toThrow();
    });

    it("should reject invalid gender value", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, gender: "unknown" })).toThrow();
    });

    it("should accept optional picture field", () => {
      const withPicture = { ...baseAuthor, picture: "./author.jpg" };
      expect(() => authorsSchema.parse(withPicture)).not.toThrow();
    });
  });

  describe("Edge cases", () => {
    const baseAuthor = {
      name: "Test Author",
      author_slug: "test-author",
      language: "es",
    };

    it("should handle very long name", () => {
      const longName = "A".repeat(200);
      expect(() => authorsSchema.parse({ ...baseAuthor, name: longName })).not.toThrow();
    });

    it("should handle name with special characters", () => {
      const specialName = "Seán O'Brien-García";
      expect(() => authorsSchema.parse({ ...baseAuthor, name: specialName })).not.toThrow();
    });

    it("should handle slug with numbers", () => {
      const numericSlug = "author-123-name";
      expect(() => authorsSchema.parse({ ...baseAuthor, author_slug: numericSlug })).not.toThrow();
    });

    it("should handle old birth years", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, birth_year: 1800 })).not.toThrow();
    });
  });

  describe("Real-world examples", () => {
    it("should validate Stephen King author entry", () => {
      const stephenKing = {
        name: "Stephen King",
        author_slug: "stephen-king",
        language: "en",
        gender: "male",
        picture: "./stephen-king.jpg",
        website: "https://stephenking.com",
        twitter: "@StephenKing",
        birth_year: 1947,
        nationality: "American",
      };

      expect(() => authorsSchema.parse(stephenKing)).not.toThrow();
    });

    it("should validate Camilla Läckberg in Spanish", () => {
      const camillaLackberg = {
        name: "Camilla Läckberg",
        author_slug: "camilla-lackberg",
        language: "es",
        gender: "female",
        picture: "./camilla-lackberg.jpg",
        website: "https://camillalackberg.com",
        birth_year: 1974,
        nationality: "Swedish",
      };

      expect(() => authorsSchema.parse(camillaLackberg)).not.toThrow();
    });

    it("should validate minimal author (indie/unknown)", () => {
      const indieAuthor = {
        name: "Jane Smith",
        author_slug: "jane-smith",
        language: "en",
      };

      expect(() => authorsSchema.parse(indieAuthor)).not.toThrow();
    });

    it("should validate historical author", () => {
      const historicalAuthor = {
        name: "Edgar Allan Poe",
        author_slug: "edgar-allan-poe",
        language: "en",
        gender: "male",
        birth_year: 1809,
        death_year: 1849,
        nationality: "American",
        wikipedia: "https://en.wikipedia.org/wiki/Edgar_Allan_Poe",
      };

      expect(() => authorsSchema.parse(historicalAuthor)).not.toThrow();
    });

    it("should validate author with all social links", () => {
      const socialAuthor = {
        name: "Modern Author",
        author_slug: "modern-author",
        language: "en",
        gender: "other",
        picture: "./modern-author.jpg",
        website: "https://modernauthor.com",
        twitter: "@modernauthor",
        goodreads: "https://goodreads.com/author/show/123456",
        wikipedia: "https://en.wikipedia.org/wiki/Modern_Author",
        birth_year: 1985,
        nationality: "Canadian",
      };

      expect(() => authorsSchema.parse(socialAuthor)).not.toThrow();
    });
  });

  describe("i18n support", () => {
    it("should accept optional i18n field", () => {
      const authorWithI18n = {
        name: "Stephen King",
        author_slug: "stephen-king",
        language: "en",
        i18n: "stephen-king-es", // Points to Spanish version
      };

      expect(() => authorsSchema.parse(authorWithI18n)).not.toThrow();
    });

    it("should allow same author in different languages", () => {
      const englishVersion = {
        name: "Stephen King",
        author_slug: "stephen-king-en",
        language: "en",
        i18n: "stephen-king-es",
      };

      const spanishVersion = {
        name: "Stephen King",
        author_slug: "stephen-king-es",
        language: "es",
        i18n: "stephen-king-en",
      };

      expect(() => authorsSchema.parse(englishVersion)).not.toThrow();
      expect(() => authorsSchema.parse(spanishVersion)).not.toThrow();
    });
  });
});
