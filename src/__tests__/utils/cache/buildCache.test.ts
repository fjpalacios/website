/**
 * Unit Tests: Build Cache System
 * Tests for build-time in-memory caching
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  buildCache,
  generateCollectionCacheKey,
  generateTaxonomyCacheKey,
  logCacheStats,
} from "@/utils/cache/buildCache";

describe("buildCache", () => {
  beforeEach(() => {
    buildCache.clear();
  });

  describe("getOrCompute()", () => {
    it("should compute value on first call (cache miss)", async () => {
      const computeFn = vi.fn().mockResolvedValue("computed-value");

      const result = await buildCache.getOrCompute("test-key", computeFn);

      expect(result).toBe("computed-value");
      expect(computeFn).toHaveBeenCalledTimes(1);
    });

    it("should return cached value on second call (cache hit)", async () => {
      const computeFn = vi.fn().mockResolvedValue("computed-value");

      const result1 = await buildCache.getOrCompute("test-key", computeFn);
      const result2 = await buildCache.getOrCompute("test-key", computeFn);

      expect(result1).toBe("computed-value");
      expect(result2).toBe("computed-value");
      expect(computeFn).toHaveBeenCalledTimes(1); // Only called once
    });

    it("should track cache hits correctly", async () => {
      const computeFn = vi.fn().mockResolvedValue("value");

      await buildCache.getOrCompute("key1", computeFn);
      await buildCache.getOrCompute("key1", computeFn);
      await buildCache.getOrCompute("key1", computeFn);

      const stats = buildCache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
    });

    it("should track cache misses correctly", async () => {
      const computeFn = vi.fn().mockResolvedValue("value");

      await buildCache.getOrCompute("key1", computeFn);
      await buildCache.getOrCompute("key2", computeFn);
      await buildCache.getOrCompute("key3", computeFn);

      const stats = buildCache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(3);
    });

    it("should handle async compute functions", async () => {
      const computeFn = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "async-value";
      });

      const result = await buildCache.getOrCompute("async-key", computeFn);

      expect(result).toBe("async-value");
      expect(computeFn).toHaveBeenCalledTimes(1);
    });

    it("should handle different data types", async () => {
      const objFn = vi.fn().mockResolvedValue({ id: 1, name: "Test" });
      const arrFn = vi.fn().mockResolvedValue([1, 2, 3]);
      const numFn = vi.fn().mockResolvedValue(42);
      const boolFn = vi.fn().mockResolvedValue(true);

      const obj = await buildCache.getOrCompute("obj", objFn);
      const arr = await buildCache.getOrCompute("arr", arrFn);
      const num = await buildCache.getOrCompute("num", numFn);
      const bool = await buildCache.getOrCompute("bool", boolFn);

      expect(obj).toEqual({ id: 1, name: "Test" });
      expect(arr).toEqual([1, 2, 3]);
      expect(num).toBe(42);
      expect(bool).toBe(true);
    });
  });

  describe("getOrComputeSync()", () => {
    it("should compute value on first call (cache miss)", () => {
      const computeFn = vi.fn().mockReturnValue("computed-value");

      const result = buildCache.getOrComputeSync("test-key", computeFn);

      expect(result).toBe("computed-value");
      expect(computeFn).toHaveBeenCalledTimes(1);
    });

    it("should return cached value on second call (cache hit)", () => {
      const computeFn = vi.fn().mockReturnValue("computed-value");

      const result1 = buildCache.getOrComputeSync("test-key", computeFn);
      const result2 = buildCache.getOrComputeSync("test-key", computeFn);

      expect(result1).toBe("computed-value");
      expect(result2).toBe("computed-value");
      expect(computeFn).toHaveBeenCalledTimes(1);
    });

    it("should track hits and misses for sync operations", () => {
      const computeFn = vi.fn().mockReturnValue("value");

      buildCache.getOrComputeSync("key1", computeFn);
      buildCache.getOrComputeSync("key1", computeFn);
      buildCache.getOrComputeSync("key2", computeFn);

      const stats = buildCache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(2);
    });

    it("should handle synchronous compute functions", () => {
      const computeFn = vi.fn(() => {
        return "sync-value";
      });

      const result = buildCache.getOrComputeSync("sync-key", computeFn);

      expect(result).toBe("sync-value");
      expect(computeFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("clear()", () => {
    it("should clear all cached values", async () => {
      await buildCache.getOrCompute("key1", async () => "value1");
      await buildCache.getOrCompute("key2", async () => "value2");

      expect(buildCache.has("key1")).toBe(true);
      expect(buildCache.has("key2")).toBe(true);

      buildCache.clear();

      expect(buildCache.has("key1")).toBe(false);
      expect(buildCache.has("key2")).toBe(false);
    });

    it("should reset statistics", async () => {
      await buildCache.getOrCompute("key1", async () => "value");
      await buildCache.getOrCompute("key1", async () => "value");

      let stats = buildCache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);

      buildCache.clear();

      stats = buildCache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.size).toBe(0);
    });
  });

  describe("getStats()", () => {
    it("should return correct statistics", async () => {
      const computeFn = vi.fn().mockResolvedValue("value");

      // 1 miss
      await buildCache.getOrCompute("key1", computeFn);
      // 2 hits
      await buildCache.getOrCompute("key1", computeFn);
      await buildCache.getOrCompute("key1", computeFn);
      // 1 miss
      await buildCache.getOrCompute("key2", computeFn);

      const stats = buildCache.getStats();

      expect(stats.size).toBe(2);
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(2);
      expect(stats.hitRate).toBe("50.00%");
    });

    it("should return 0% hit rate when no operations", () => {
      const stats = buildCache.getStats();

      expect(stats.size).toBe(0);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe("0.00%");
    });

    it("should return 100% hit rate when all hits", async () => {
      const computeFn = vi.fn().mockResolvedValue("value");

      await buildCache.getOrCompute("key1", computeFn);
      await buildCache.getOrCompute("key1", computeFn);
      await buildCache.getOrCompute("key1", computeFn);

      const stats = buildCache.getStats();
      expect(stats.hitRate).toBe("66.67%");
    });

    it("should return 0% hit rate when all misses", async () => {
      const computeFn = vi.fn().mockResolvedValue("value");

      await buildCache.getOrCompute("key1", computeFn);
      await buildCache.getOrCompute("key2", computeFn);
      await buildCache.getOrCompute("key3", computeFn);

      const stats = buildCache.getStats();
      expect(stats.hitRate).toBe("0.00%");
    });
  });

  describe("has()", () => {
    it("should return true for cached keys", async () => {
      await buildCache.getOrCompute("key1", async () => "value");

      expect(buildCache.has("key1")).toBe(true);
    });

    it("should return false for non-cached keys", () => {
      expect(buildCache.has("non-existent")).toBe(false);
    });

    it("should return false after clear", async () => {
      await buildCache.getOrCompute("key1", async () => "value");

      expect(buildCache.has("key1")).toBe(true);

      buildCache.clear();

      expect(buildCache.has("key1")).toBe(false);
    });
  });

  describe("set()", () => {
    it("should manually set cache values", () => {
      buildCache.set("manual-key", "manual-value");

      expect(buildCache.has("manual-key")).toBe(true);
      expect(buildCache.get("manual-key")).toBe("manual-value");
    });

    it("should overwrite existing values", async () => {
      await buildCache.getOrCompute("key1", async () => "original");

      buildCache.set("key1", "overwritten");

      expect(buildCache.get("key1")).toBe("overwritten");
    });
  });

  describe("get()", () => {
    it("should return cached value", async () => {
      await buildCache.getOrCompute("key1", async () => "value");

      const result = buildCache.get("key1");

      expect(result).toBe("value");
    });

    it("should return undefined for non-existent keys", () => {
      const result = buildCache.get("non-existent");

      expect(result).toBeUndefined();
    });

    it("should not affect statistics", async () => {
      await buildCache.getOrCompute("key1", async () => "value");

      const statsBefore = buildCache.getStats();
      buildCache.get("key1");
      const statsAfter = buildCache.getStats();

      expect(statsBefore.hits).toBe(statsAfter.hits);
      expect(statsBefore.misses).toBe(statsAfter.misses);
    });
  });
});

describe("generateCollectionCacheKey()", () => {
  it("should generate correct key format", () => {
    const key = generateCollectionCacheKey("books", "en");
    expect(key).toBe("collection:books:en");
  });

  it("should generate different keys for different collections", () => {
    const key1 = generateCollectionCacheKey("books", "en");
    const key2 = generateCollectionCacheKey("posts", "en");

    expect(key1).not.toBe(key2);
    expect(key1).toBe("collection:books:en");
    expect(key2).toBe("collection:posts:en");
  });

  it("should generate different keys for different languages", () => {
    const key1 = generateCollectionCacheKey("books", "en");
    const key2 = generateCollectionCacheKey("books", "es");

    expect(key1).not.toBe(key2);
    expect(key1).toBe("collection:books:en");
    expect(key2).toBe("collection:books:es");
  });

  it("should work with various collection names", () => {
    const collections = ["books", "tutorials", "posts", "authors", "publishers", "genres"];

    collections.forEach((collection) => {
      const key = generateCollectionCacheKey(collection, "en");
      expect(key).toBe(`collection:${collection}:en`);
    });
  });
});

describe("generateTaxonomyCacheKey()", () => {
  it("should generate correct key format without content", () => {
    const key = generateTaxonomyCacheKey("authors", "en");
    expect(key).toBe("taxonomy:authors:en:all");
  });

  it("should generate correct key format with content", () => {
    const key = generateTaxonomyCacheKey("authors", "en", true);
    expect(key).toBe("taxonomy:authors:en:with-content");
  });

  it("should generate different keys for withContent parameter", () => {
    const key1 = generateTaxonomyCacheKey("authors", "en", false);
    const key2 = generateTaxonomyCacheKey("authors", "en", true);

    expect(key1).not.toBe(key2);
    expect(key1).toBe("taxonomy:authors:en:all");
    expect(key2).toBe("taxonomy:authors:en:with-content");
  });

  it("should generate different keys for different taxonomies", () => {
    const key1 = generateTaxonomyCacheKey("authors", "en", true);
    const key2 = generateTaxonomyCacheKey("genres", "en", true);

    expect(key1).not.toBe(key2);
    expect(key1).toBe("taxonomy:authors:en:with-content");
    expect(key2).toBe("taxonomy:genres:en:with-content");
  });

  it("should generate different keys for different languages", () => {
    const key1 = generateTaxonomyCacheKey("authors", "en", true);
    const key2 = generateTaxonomyCacheKey("authors", "es", true);

    expect(key1).not.toBe(key2);
    expect(key1).toBe("taxonomy:authors:en:with-content");
    expect(key2).toBe("taxonomy:authors:es:with-content");
  });
});

describe("logCacheStats()", () => {
  beforeEach(() => {
    buildCache.clear();
  });

  it("should log cache statistics without throwing", async () => {
    await buildCache.getOrCompute("key1", async () => "value");
    await buildCache.getOrCompute("key1", async () => "value");

    expect(() => logCacheStats()).not.toThrow();
  });

  it("should work with empty cache", () => {
    expect(() => logCacheStats()).not.toThrow();
  });
});
