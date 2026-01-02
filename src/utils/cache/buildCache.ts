/**
 * Build-time Cache System
 *
 * Provides in-memory memoization for expensive operations during static site generation.
 * This cache is active only during the build process and is cleared between builds.
 *
 * **Why We Need This:**
 * During route generation, the same content collections are fetched multiple times:
 * - Once for list pages
 * - Once for pagination calculation
 * - Once for detail pages
 * - Once for target language availability checks
 *
 * Without caching, this results in duplicate Astro collection queries and I/O operations.
 *
 * **How It Works:**
 * 1. First call: Cache miss → Execute expensive operation → Store result
 * 2. Subsequent calls: Cache hit → Return stored result instantly
 * 3. After build: Cache is cleared automatically
 *
 * @module cache/buildCache
 */

import { buildLogger } from "../logger";

type CacheKey = string;
type CacheValue = unknown;

/**
 * Simple in-memory cache for build-time operations
 *
 * Uses a Map for O(1) lookups and stores any type of value.
 * Tracks hits/misses to measure cache effectiveness.
 */
class BuildCache {
  /** Internal storage using Map for fast lookups */
  private cache: Map<CacheKey, CacheValue> = new Map();

  /** Number of cache hits (successful lookups) */
  private hits = 0;

  /** Number of cache misses (had to compute value) */
  private misses = 0;

  /**
   * Get a value from cache or compute it if not present
   *
   * This is the main cache method. It implements the "cache-aside" pattern:
   * 1. Check if value exists in cache
   * 2. If yes: Return cached value (cache hit)
   * 3. If no: Compute value, store in cache, return it (cache miss)
   *
   * @param key - Unique identifier for this cached value
   * @param computeFn - Async function to compute the value if not cached
   * @returns The cached or freshly computed value
   *
   * @example
   * ```ts
   * const books = await buildCache.getOrCompute(
   *   'books-en',
   *   async () => await getAllBooks('en')
   * );
   * ```
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
   *
   * Same as `getOrCompute` but for synchronous operations.
   * Use this when the compute function doesn't return a Promise.
   *
   * @param key - Unique identifier for this cached value
   * @param computeFn - Synchronous function to compute the value if not cached
   * @returns The cached or freshly computed value
   *
   * @example
   * ```ts
   * const result = buildCache.getOrComputeSync(
   *   'expensive-calc',
   *   () => performExpensiveCalculation()
   * );
   * ```
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
   * Clear all cached values and reset statistics
   *
   * Called automatically between builds. Can also be used in tests
   * to ensure cache isolation between test cases.
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   *
   * Returns metrics about cache performance:
   * - size: Number of cached entries
   * - hits: Number of successful cache lookups
   * - misses: Number of times value had to be computed
   * - hitRate: Percentage of requests served from cache
   *
   * @returns Object containing cache statistics
   *
   * @example
   * ```ts
   * const stats = buildCache.getStats();
   * console.log(`Cache hit rate: ${stats.hitRate}`);
   * // Output: "Cache hit rate: 50.00%"
   * ```
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
 *
 * This is a singleton used throughout the build process.
 * Import and use this instance instead of creating new BuildCache instances.
 *
 * @example
 * ```ts
 * import { buildCache } from '@/utils/cache/buildCache';
 *
 * const data = await buildCache.getOrCompute('my-key', async () => {
 *   return await fetchExpensiveData();
 * });
 * ```
 */
export const buildCache = new BuildCache();

/**
 * Generate a cache key for content collections
 *
 * Creates a consistent key format for caching Astro collection queries.
 * Format: `collection:{collectionName}:{lang}`
 *
 * @param collectionName - Name of the Astro collection (e.g., 'books', 'posts')
 * @param lang - Language code (e.g., 'en', 'es')
 * @returns Cache key string
 *
 * @example
 * ```ts
 * const key = generateCollectionCacheKey('books', 'en');
 * // Returns: "collection:books:en"
 * ```
 */
export function generateCollectionCacheKey(collectionName: string, lang: string): string {
  return `collection:${collectionName}:${lang}`;
}

/**
 * Generate a cache key for taxonomy items
 *
 * Creates a consistent key format for caching taxonomy queries.
 * Format: `taxonomy:{taxonomyType}:{lang}:{withContent ? 'with-content' : 'all'}`
 *
 * @param taxonomyType - Type of taxonomy (e.g., 'authors', 'genres')
 * @param lang - Language code (e.g., 'en', 'es')
 * @param withContent - Whether to only include items with related content
 * @returns Cache key string
 *
 * @example
 * ```ts
 * const key = generateTaxonomyCacheKey('authors', 'en', true);
 * // Returns: "taxonomy:authors:en:with-content"
 * ```
 */
export function generateTaxonomyCacheKey(taxonomyType: string, lang: string, withContent = false): string {
  return `taxonomy:${taxonomyType}:${lang}:${withContent ? "with-content" : "all"}`;
}

/**
 * Log cache statistics to console
 *
 * Useful for debugging and monitoring cache effectiveness during builds.
 * Call this at the end of route generation to see performance metrics.
 *
 * @example
 * ```ts
 * // At end of build
 * logCacheStats();
 * // Output: [Build Cache] Stats: { size: 12, hits: 18, misses: 12, hitRate: '60.00%' }
 * ```
 */
export function logCacheStats(): void {
  const stats = buildCache.getStats();
  buildLogger.info(`Cache Stats:`, stats);
}
