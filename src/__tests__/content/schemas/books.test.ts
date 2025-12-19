import { describe, it, expect } from "vitest";

// This will fail initially - we haven't implemented the schema yet
// That's the point of TDD: RED -> GREEN -> REFACTOR
describe("Books Collection Schema", () => {
  describe("Valid book entries", () => {
    it("should validate a complete book entry with all fields", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const validBook = {
        title: "Apocalipsis",
        post_slug: "apocalipsis-stephen-king",
        date: new Date("2017-05-02"),
        excerpt: "Me ha encantado. Es un libro excelente, aunque no apto para gente que acaba de empezar a leer.",
        language: "es",
        synopsis: "Esta narración cuenta cómo un virus gripal...",
        score: 5,
        pages: 1584,
        isbn: "9788497599412",
        author: "stephen-king",
        publisher: "debolsillo",
        genres: ["fiction-horror"],
        series: null,
        challenges: ["stephen-king"],
        categories: ["books", "reviews"],
        buy: [
          { type: "paper", link: "https://www.amazon.es/dp/8497599411/" },
          { type: "ebook", link: "https://www.amazon.es/dp/B074CM34L6/" },
        ],
        book_card: "http://www.megustaleer.com/libro/apocalipsis/ES0003864",
        cover: "./cover.jpg",
        book_cover: "apocalipsis-g.jpg",
        i18n: "",
      };

      expect(() => booksSchema.parse(validBook)).not.toThrow();
    });

    it("should validate a minimal book entry with only required fields", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const minimalBook = {
        title: "Test Book",
        post_slug: "test-book",
        date: new Date("2024-01-01"),
        excerpt: "A test book excerpt.",
        language: "es",
        synopsis: "A test synopsis.",
        score: 3,
        pages: 200,
        author: "test-author",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(minimalBook)).not.toThrow();
    });

    it("should accept both date objects and date strings", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const bookWithDateString = {
        title: "Test",
        post_slug: "test",
        date: "2024-01-01",
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 4,
        pages: 300,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(bookWithDateString)).not.toThrow();
    });
  });

  describe("Required fields validation", () => {
    it("should reject book without title", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const invalidBook = {
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });

    it("should reject book without post_slug", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const invalidBook = {
        title: "Test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });

    it("should reject book without author", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const invalidBook = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });
  });

  describe("Score validation", () => {
    it("should accept scores from 1 to 5", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const validScores = [1, 2, 3, 4, 5];

      for (const score of validScores) {
        const book = {
          title: "Test",
          post_slug: "test",
          date: new Date(),
          excerpt: "Test",
          language: "es",
          synopsis: "Test",
          score,
          pages: 200,
          author: "test",
          cover: "./cover.jpg",
        };

        expect(() => booksSchema.parse(book)).not.toThrow();
      }
    });

    it("should reject score less than 1", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const invalidBook = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 0,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });

    it("should reject score greater than 5", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const invalidBook = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 6,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });

    it("should reject non-integer scores", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const invalidBook = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3.5,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });
  });

  describe("Pages validation", () => {
    it("should reject negative page numbers", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const invalidBook = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: -100,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });

    it("should reject zero pages", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const invalidBook = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 0,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });
  });

  describe("Language validation", () => {
    it('should accept "es" as language', async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const book = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(book)).not.toThrow();
    });

    it('should accept "en" as language', async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const book = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "en",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(book)).not.toThrow();
    });

    it("should reject invalid language codes", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const invalidBook = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "fr",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });
  });

  describe("Buy links validation", () => {
    it("should accept valid buy links array", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const book = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
        buy: [
          {
            type: "paper",
            link: "https://www.amazon.es/dp/123456789/",
            store: "Amazon",
          },
          {
            type: "ebook",
            link: "https://www.casadellibro.com/libro-test/123456",
          },
        ],
      };

      expect(() => booksSchema.parse(book)).not.toThrow();
    });

    it("should reject buy links with invalid type", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const invalidBook = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
        buy: [{ type: "invalid", link: "https://example.com" }],
      };

      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });

    it("should reject buy links with invalid URL", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const invalidBook = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
        buy: [{ type: "paper", link: "not-a-url" }],
      };

      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });
  });

  describe("Arrays validation", () => {
    it("should accept empty arrays for genres, challenges, categories", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const book = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
        genres: [],
        challenges: [],
        categories: [],
      };

      expect(() => booksSchema.parse(book)).not.toThrow();
    });

    it("should default to empty arrays if not provided", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const book = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      const result = booksSchema.parse(book);
      expect(result.genres).toEqual([]);
      expect(result.challenges).toEqual([]);
      expect(result.categories).toEqual([]);
    });
  });

  describe("Optional fields", () => {
    it("should allow ISBN to be optional", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const book = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(book)).not.toThrow();
    });

    it("should allow ASIN to be optional", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const book = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(book)).not.toThrow();
    });

    it("should allow publisher to be optional", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const book = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(book)).not.toThrow();
    });

    it("should allow series to be null or string", async () => {
      const { booksSchema } = await import("@/schemas/blog");

      const bookWithNull = {
        title: "Test",
        post_slug: "test",
        date: new Date(),
        excerpt: "Test",
        language: "es",
        synopsis: "Test",
        score: 3,
        pages: 200,
        author: "test",
        cover: "./cover.jpg",
        series: null,
      };

      const bookWithSeries = {
        ...bookWithNull,
        series: "fjallbacka",
      };

      expect(() => booksSchema.parse(bookWithNull)).not.toThrow();
      expect(() => booksSchema.parse(bookWithSeries)).not.toThrow();
    });
  });
});
