import { describe, expect, it } from "vitest";

import { authorsSchema } from "@/schemas/blog";

describe("Authors Collection Schema", () => {
  describe("Valid authors", () => {
    it("should validate a complete valid author", () => {
      const validAuthor = {
        name: "Stephen King",
        author_slug: "stephen-king",
        bio: "Stephen King is an American author of horror, supernatural fiction...",
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
        bio: "Camilla Läckberg es una escritora sueca de novelas policíacas...",
        language: "es",
        gender: "female",
      };

      expect(() => authorsSchema.parse(spanishAuthor)).not.toThrow();
    });

    it("should validate author without optional fields", () => {
      const minimalAuthor = {
        name: "John Doe",
        author_slug: "john-doe",
        bio: "An author.",
        language: "en",
      };

      expect(() => authorsSchema.parse(minimalAuthor)).not.toThrow();
    });
  });

  describe("Required fields", () => {
    const baseAuthor = {
      name: "Test Author",
      author_slug: "test-author",
      bio: "Test bio",
      language: "es",
    };

    it("should require name", () => {
      const { name, ...authorWithoutName } = baseAuthor;
      expect(() => authorsSchema.parse(authorWithoutName)).toThrow();
    });

    it("should require author_slug", () => {
      const { author_slug, ...authorWithoutSlug } = baseAuthor;
      expect(() => authorsSchema.parse(authorWithoutSlug)).toThrow();
    });

    it("should require bio", () => {
      const { bio, ...authorWithoutBio } = baseAuthor;
      expect(() => authorsSchema.parse(authorWithoutBio)).toThrow();
    });

    it("should require language", () => {
      const { language, ...authorWithoutLanguage } = baseAuthor;
      expect(() => authorsSchema.parse(authorWithoutLanguage)).toThrow();
    });
  });

  describe("Field validation", () => {
    const baseAuthor = {
      name: "Test Author",
      author_slug: "test-author",
      bio: "Test bio",
      language: "es",
    };

    it("should reject empty name", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, name: "" })).toThrow();
    });

    it("should reject empty author_slug", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, author_slug: "" })).toThrow();
    });

    it("should reject empty bio", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, bio: "" })).toThrow();
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
      bio: "Test bio",
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

    it("should accept optional website field", () => {
      const withWebsite = { ...baseAuthor, website: "https://example.com" };
      expect(() => authorsSchema.parse(withWebsite)).not.toThrow();
    });

    it("should reject invalid website URL", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, website: "not-a-url" })).toThrow();
    });

    it("should accept optional twitter field", () => {
      const withTwitter = { ...baseAuthor, twitter: "@author" };
      expect(() => authorsSchema.parse(withTwitter)).not.toThrow();
    });

    it("should accept twitter without @ symbol", () => {
      const withTwitter = { ...baseAuthor, twitter: "author" };
      expect(() => authorsSchema.parse(withTwitter)).not.toThrow();
    });

    it("should accept optional goodreads field", () => {
      const withGoodreads = {
        ...baseAuthor,
        goodreads: "https://goodreads.com/author/123",
      };
      expect(() => authorsSchema.parse(withGoodreads)).not.toThrow();
    });

    it("should reject invalid goodreads URL", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, goodreads: "not-a-url" })).toThrow();
    });

    it("should accept optional wikipedia field", () => {
      const withWikipedia = {
        ...baseAuthor,
        wikipedia: "https://en.wikipedia.org/wiki/Author",
      };
      expect(() => authorsSchema.parse(withWikipedia)).not.toThrow();
    });

    it("should reject invalid wikipedia URL", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, wikipedia: "not-a-url" })).toThrow();
    });

    it("should accept optional birth_year", () => {
      const withBirth = { ...baseAuthor, birth_year: 1947 };
      expect(() => authorsSchema.parse(withBirth)).not.toThrow();
    });

    it("should reject negative birth_year", () => {
      expect(() => authorsSchema.parse({ ...baseAuthor, birth_year: -100 })).toThrow();
    });

    it("should reject birth_year in the future", () => {
      const futureYear = new Date().getFullYear() + 1;
      expect(() => authorsSchema.parse({ ...baseAuthor, birth_year: futureYear })).toThrow();
    });

    it("should accept optional death_year", () => {
      const withDeath = { ...baseAuthor, death_year: 2020 };
      expect(() => authorsSchema.parse(withDeath)).not.toThrow();
    });

    it("should accept optional nationality", () => {
      const withNationality = { ...baseAuthor, nationality: "American" };
      expect(() => authorsSchema.parse(withNationality)).not.toThrow();
    });
  });

  describe("Edge cases", () => {
    const baseAuthor = {
      name: "Test Author",
      author_slug: "test-author",
      bio: "Test bio",
      language: "es",
    };

    it("should handle very long name", () => {
      const longName = "A".repeat(200);
      expect(() => authorsSchema.parse({ ...baseAuthor, name: longName })).not.toThrow();
    });

    it("should handle very long bio", () => {
      const longBio = "A".repeat(5000);
      expect(() => authorsSchema.parse({ ...baseAuthor, bio: longBio })).not.toThrow();
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
        bio: "Stephen King is an American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.",
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
        bio: "Camilla Läckberg es una escritora sueca de novelas policíacas, especialmente conocida por su serie de novelas ambientadas en Fjällbacka.",
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
        bio: "Indie author writing fantasy novels.",
        language: "en",
      };

      expect(() => authorsSchema.parse(indieAuthor)).not.toThrow();
    });

    it("should validate historical author", () => {
      const historicalAuthor = {
        name: "Edgar Allan Poe",
        author_slug: "edgar-allan-poe",
        bio: "Edgar Allan Poe was an American writer, poet, editor, and literary critic.",
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
        bio: "A contemporary author with strong social media presence.",
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
        bio: "Stephen King is an American author...",
        language: "en",
        i18n: "stephen-king-es", // Points to Spanish version
      };

      expect(() => authorsSchema.parse(authorWithI18n)).not.toThrow();
    });

    it("should allow same author in different languages", () => {
      const englishVersion = {
        name: "Stephen King",
        author_slug: "stephen-king-en",
        bio: "Stephen King is an American author...",
        language: "en",
        i18n: "stephen-king-es",
      };

      const spanishVersion = {
        name: "Stephen King",
        author_slug: "stephen-king-es",
        bio: "Stephen King es un autor estadounidense...",
        language: "es",
        i18n: "stephen-king-en",
      };

      expect(() => authorsSchema.parse(englishVersion)).not.toThrow();
      expect(() => authorsSchema.parse(spanishVersion)).not.toThrow();
    });
  });
});
