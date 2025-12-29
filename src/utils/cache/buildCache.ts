/**
 * Build-time Cache System
 *
 * Provides memoization for expensive operations during static site generation.
 * This cache is only used during build time and is cleared between builds.
 *
 * Performance Benefits:
 * - Avoid duplicate content collection queries
 * - Reduce redundant data transformations
 * - Minimize I/O operations
 *
 * @module cache/buildCache
 */

type CacheKey = string;
type CacheValue = unknown;

/**
 * Simple in-memory cache for build-time operations
 */
class BuildCache {
  private cache: Map<CacheKey, CacheValue> = new Map();
  private hits = 0;
  private misses = 0;

  /**
   * Get a value from cache or compute it if not present
   */
  async getOrCompute<T>(key: CacheKey, computeFn: () => Promise<T>): Promise<T> {
    if (this.cache.has(key)) {
      this.hits++;
      return this.cache.get(key) as T;
    }

    this.misses++;
    const value = await computeFn();
    this.cache.set(key, value);
    return value;
  }

  /**
   * Get a value from cache synchronously or compute it if not present
   */
  getOrComputeSync<T>(key: CacheKey, computeFn: () => T): T {
    if (this.cache.has(key)) {
      this.hits++;
      return this.cache.get(key) as T;
    }

    this.misses++;
    const value = computeFn();
    this.cache.set(key, value);
    return value;
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;

    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: hitRate.toFixed(2) + "%",
    };
  }

  /**
   * Check if a key exists in cache
   */
  has(key: CacheKey): boolean {
    return this.cache.has(key);
  }

  /**
   * Manually set a cache value
   */
  set<T>(key: CacheKey, value: T): void {
    this.cache.set(key, value);
  }

  /**
   * Get a value from cache without computing
   */
  get<T>(key: CacheKey): T | undefined {
    return this.cache.get(key) as T | undefined;
  }
}

/**
 * Global build cache instance
 */
export const buildCache = new BuildCache();

/**
 * Generate a cache key for content collections
 */
export function generateCollectionCacheKey(collectionName: string, lang: string): string {
  return `collection:${collectionName}:${lang}`;
}

/**
 * Generate a cache key for taxonomy items
 */
export function generateTaxonomyCacheKey(taxonomyType: string, lang: string, withContent = false): string {
  return `taxonomy:${taxonomyType}:${lang}:${withContent ? "with-content" : "all"}`;
}

/**
 * Log cache statistics (useful for debugging performance)
 */
export function logCacheStats(): void {
  const stats = buildCache.getStats();
  console.log(`[Build Cache] Stats:`, stats);
}
