/**
 * Unit Tests: Cached Content Loaders
 * Tests for build-time caching of content collections
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

import { buildCache } from "@/utils/cache/buildCache";
import { getCachedBooks, getCachedTutorials, getCachedContent, getCachedCollection } from "@/utils/cache/cachedLoaders";

// Mock buildCache
vi.mock("@/utils/cache/buildCache", () => ({
  buildCache: {
    getOrCompute: vi.fn(),
  },
  generateCollectionCacheKey: vi.fn((collection: string, lang: string) => `collection:${collection}:${lang}`),
}));

describe("cachedLoaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCachedBooks()", () => {
    it("should call buildCache with correct key for books", async () => {
      const mockBooks = [{ id: "book1" }, { id: "book2" }];
      const mockLoader = vi.fn().mockResolvedValue(mockBooks);

      vi.mocked(buildCache.getOrCompute).mockResolvedValue(mockBooks);

      const result = await getCachedBooks("en", mockLoader);

      expect(buildCache.getOrCompute).toHaveBeenCalledWith("collection:books:en", expect.any(Function));
      expect(result).toEqual(mockBooks);
    });

    it("should pass language to loader function", async () => {
      const mockBooks = [{ id: "book1" }];
      const mockLoader = vi.fn().mockResolvedValue(mockBooks);

      vi.mocked(buildCache.getOrCompute).mockImplementation(async (_key: string, fn: () => Promise<unknown>) => {
        return fn();
      });

      await getCachedBooks("es", mockLoader);

      expect(mockLoader).toHaveBeenCalledWith("es");
    });

    it("should return cached value if available", async () => {
      const cachedBooks = [{ id: "cached" }];
      const mockLoader = vi.fn();

      vi.mocked(buildCache.getOrCompute).mockResolvedValue(cachedBooks);

      const result = await getCachedBooks("en", mockLoader);

      expect(result).toEqual(cachedBooks);
      expect(mockLoader).not.toHaveBeenCalled();
    });
  });

  describe("getCachedTutorials()", () => {
    it("should call buildCache with correct key for tutorials", async () => {
      const mockTutorials = [{ id: "tutorial1" }, { id: "tutorial2" }];
      const mockLoader = vi.fn().mockResolvedValue(mockTutorials);

      vi.mocked(buildCache.getOrCompute).mockResolvedValue(mockTutorials);

      const result = await getCachedTutorials("en", mockLoader);

      expect(buildCache.getOrCompute).toHaveBeenCalledWith("collection:tutorials:en", expect.any(Function));
      expect(result).toEqual(mockTutorials);
    });

    it("should pass language to loader function", async () => {
      const mockTutorials = [{ id: "tutorial1" }];
      const mockLoader = vi.fn().mockResolvedValue(mockTutorials);

      vi.mocked(buildCache.getOrCompute).mockImplementation(async (_key: string, fn: () => Promise<unknown>) => {
        return fn();
      });

      await getCachedTutorials("es", mockLoader);

      expect(mockLoader).toHaveBeenCalledWith("es");
    });
  });

  describe("getCachedContent()", () => {
    it("should call buildCache with correct key for posts", async () => {
      const mockPosts = [{ id: "post1" }, { id: "post2" }];
      const mockLoader = vi.fn().mockResolvedValue(mockPosts);

      vi.mocked(buildCache.getOrCompute).mockResolvedValue(mockPosts);

      const result = await getCachedContent("en", mockLoader);

      expect(buildCache.getOrCompute).toHaveBeenCalledWith("collection:posts:en", expect.any(Function));
      expect(result).toEqual(mockPosts);
    });

    it("should pass language to loader function", async () => {
      const mockPosts = [{ id: "post1" }];
      const mockLoader = vi.fn().mockResolvedValue(mockPosts);

      vi.mocked(buildCache.getOrCompute).mockImplementation(async (_key: string, fn: () => Promise<unknown>) => {
        return fn();
      });

      await getCachedContent("es", mockLoader);

      expect(mockLoader).toHaveBeenCalledWith("es");
    });
  });

  describe("getCachedCollection()", () => {
    it("should work with any collection name", async () => {
      const mockItems = [{ id: "item1" }, { id: "item2" }];
      const mockLoader = vi.fn().mockResolvedValue(mockItems);

      vi.mocked(buildCache.getOrCompute).mockResolvedValue(mockItems);

      const result = await getCachedCollection("authors", "en", mockLoader);

      expect(buildCache.getOrCompute).toHaveBeenCalledWith("collection:authors:en", expect.any(Function));
      expect(result).toEqual(mockItems);
    });

    it("should support different collection types", async () => {
      const collections = [
        { name: "books", items: [{ id: "b1" }] },
        { name: "tutorials", items: [{ id: "t1" }] },
        { name: "posts", items: [{ id: "p1" }] },
        { name: "authors", items: [{ id: "a1" }] },
      ];

      for (const { name, items } of collections) {
        const mockLoader = vi.fn().mockResolvedValue(items);

        vi.mocked(buildCache.getOrCompute).mockResolvedValue(items);

        const result = await getCachedCollection(name, "en", mockLoader);

        expect(buildCache.getOrCompute).toHaveBeenCalledWith(`collection:${name}:en`, expect.any(Function));
        expect(result).toEqual(items);
      }
    });

    it("should generate unique keys for different languages", async () => {
      const mockLoader = vi.fn().mockResolvedValue([]);

      vi.mocked(buildCache.getOrCompute).mockResolvedValue([]);

      await getCachedCollection("books", "en", mockLoader);
      await getCachedCollection("books", "es", mockLoader);

      expect(buildCache.getOrCompute).toHaveBeenCalledWith("collection:books:en", expect.any(Function));
      expect(buildCache.getOrCompute).toHaveBeenCalledWith("collection:books:es", expect.any(Function));
    });

    it("should return typed results", async () => {
      interface Book {
        id: string;
        title: string;
      }

      const mockBooks: Book[] = [
        { id: "1", title: "Book 1" },
        { id: "2", title: "Book 2" },
      ];
      const mockLoader = vi.fn().mockResolvedValue(mockBooks);

      vi.mocked(buildCache.getOrCompute).mockResolvedValue(mockBooks);

      const result = await getCachedCollection<Book>("books", "en", mockLoader);

      expect(result[0].title).toBe("Book 1");
      expect(result[1].title).toBe("Book 2");
    });
  });
});
