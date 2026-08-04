import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";

import { extractContentDate } from "../../utils/content-date";

describe("content-date helpers", () => {
  describe("extractContentDate", () => {
    describe("posts", () => {
      it("should extract date from post with date field", () => {
        const post: CollectionEntry<"posts"> = {
          id: "test",
          collection: "posts",
          data: {
            title: "Test Post",
            date: new Date("2025-01-15"),
            excerpt: "Test",
            post_slug: "test-post",
            categories: [],
            language: "es",
          },
        } as unknown as CollectionEntry<"posts">;

        const result = extractContentDate(post);
        expect(result).toEqual(new Date("2025-01-15"));
      });

      it("should handle post with missing date (returns epoch)", () => {
        const post: CollectionEntry<"posts"> = {
          id: "test",
          collection: "posts",
          data: {
            title: "Test Post",
            excerpt: "Test",
            post_slug: "test-post",
            categories: [],
            language: "es",
          },
        } as unknown as CollectionEntry<"posts">;

        const result = extractContentDate(post);
        expect(result).toEqual(new Date(0));
      });
    });

    describe("tutorials", () => {
      it("should extract date from tutorial with date field", () => {
        const tutorial: CollectionEntry<"tutorials"> = {
          id: "test",
          collection: "tutorials",
          data: {
            title: "Test Tutorial",
            date: new Date("2024-12-01"),
            excerpt: "Test",
            post_slug: "test-tutorial",
            categories: [],
            language: "es",
          },
        } as unknown as CollectionEntry<"tutorials">;

        const result = extractContentDate(tutorial);
        expect(result).toEqual(new Date("2024-12-01"));
      });

      it("should handle tutorial with missing date (returns epoch)", () => {
        const tutorial: CollectionEntry<"tutorials"> = {
          id: "test",
          collection: "tutorials",
          data: {
            title: "Test Tutorial",
            excerpt: "Test",
            post_slug: "test-tutorial",
            categories: [],
            language: "es",
          },
        } as unknown as CollectionEntry<"tutorials">;

        const result = extractContentDate(tutorial);
        expect(result).toEqual(new Date(0));
      });
    });

    describe("books", () => {
      it("should extract date from book", () => {
        const book: CollectionEntry<"books"> = {
          id: "test",
          collection: "books",
          data: {
            title: "Test Book",
            date: new Date("2024-08-15"),
            excerpt: "Test",
            post_slug: "test-book",
            isbn: "1234567890",
            score: 4,
            author: "test-author",
            genres: [],
            challenges: [],
            categories: [],
            language: "es",
          },
        } as CollectionEntry<"books">;

        const result = extractContentDate(book);
        expect(result).toEqual(new Date("2024-08-15"));
      });

      it("should handle book with missing date (returns epoch)", () => {
        const book: CollectionEntry<"books"> = {
          id: "test",
          collection: "books",
          data: {
            title: "Test Book",
            excerpt: "Test",
            post_slug: "test-book",
            isbn: "1234567890",
            score: 4,
            author: "test-author",
            genres: [],
            challenges: [],
            categories: [],
            language: "es",
          },
        } as unknown as CollectionEntry<"books">;

        const result = extractContentDate(book);
        expect(result).toEqual(new Date(0));
      });
    });

    describe("edge cases", () => {
      it("should handle invalid dates gracefully", () => {
        const post: CollectionEntry<"posts"> = {
          id: "test",
          collection: "posts",
          data: {
            title: "Test",
            description: "Test",
            date: new Date("invalid"),
            categories: [],
            lang: "es",
          },
        } as unknown as CollectionEntry<"posts">;

        const result = extractContentDate(post);
        expect(result.toString()).toBe("Invalid Date");
      });

      it("should handle string dates", () => {
        const post: CollectionEntry<"posts"> = {
          id: "test",
          collection: "posts",
          data: {
            title: "Test",
            description: "Test",
            date: "2025-01-01" as unknown as Date,
            categories: [],
            lang: "es",
          },
        } as unknown as CollectionEntry<"posts">;

        const result = extractContentDate(post);
        expect(result).toEqual(new Date("2025-01-01"));
      });

      it("should handle undefined date gracefully", () => {
        const item = {
          id: "test",
          collection: "posts",
          data: {
            title: "Test",
            description: "Test",
            date: undefined,
            categories: [],
            lang: "es",
          },
        } as unknown as CollectionEntry<"posts">;

        const result = extractContentDate(item);
        expect(result).toEqual(new Date(0));
      });

      it("should sort content by date correctly", () => {
        const items = [
          {
            id: "post1",
            collection: "posts",
            data: {
              title: "Post 1",
              description: "Test",
              date: new Date("2024-01-15"),
              categories: [],
              lang: "es",
            },
          } as unknown as CollectionEntry<"posts">,
          {
            id: "post2",
            collection: "posts",
            data: {
              title: "Post 2",
              description: "Test",
              date: new Date("2024-03-20"),
              categories: [],
              lang: "es",
            },
          } as unknown as CollectionEntry<"posts">,
          {
            id: "post3",
            collection: "posts",
            data: {
              title: "Post 3",
              description: "Test",
              date: new Date("2024-02-10"),
              categories: [],
              lang: "es",
            },
          } as unknown as CollectionEntry<"posts">,
        ];

        const sorted = items.sort((a, b) => {
          const dateA = extractContentDate(a);
          const dateB = extractContentDate(b);
          return dateB.getTime() - dateA.getTime();
        });

        expect(sorted[0].id).toBe("post2"); // 2024-03-20
        expect(sorted[1].id).toBe("post3"); // 2024-02-10
        expect(sorted[2].id).toBe("post1"); // 2024-01-15
      });
    });
  });
});
