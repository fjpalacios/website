/**
 * Cached Content Loaders
 *
 * Provides cached versions of expensive content loading operations.
 * These wrappers use the build cache to avoid redundant data fetching.
 *
 * **Why These Wrappers Exist:**
 * Instead of calling content loaders directly, we wrap them with caching logic.
 * This ensures consistent cache key generation and makes the caching transparent
 * to the calling code.
 *
 * **Pattern:**
 * ```ts
 * // Without cache (multiple queries)
 * const books1 = await getAllBooksForLanguage('en'); // Query 1
 * const books2 = await getAllBooksForLanguage('en'); // Query 2 (duplicate!)
 *
 * // With cache (single query)
 * const books1 = await getCachedCollection('books', 'en', getAllBooksForLanguage); // Query
 * const books2 = await getCachedCollection('books', 'en', getAllBooksForLanguage); // Cache hit!
 * ```
 *
 * **Available Loaders:**
 * - `getCachedBooks` - For book collections
 * - `getCachedTutorials` - For tutorial collections
 * - `getCachedContent` - For post collections
 * - `getCachedCollection` - Generic loader for any collection type
 *
 * @module cache/cachedLoaders
 */

import { buildCache, generateCollectionCacheKey } from "./buildCache";

/**
 * Cached version of getAllBooksForLanguage
 *
 * Use this instead of calling getAllBooksForLanguage directly to benefit
 * from build-time caching.
 *
 * @param lang - Language code ('en' or 'es')
 * @param getAllBooksFn - The actual book loading function
 * @returns Promise resolving to array of books
 *
 * @example
 * ```ts
 * const books = await getCachedBooks('en', getAllBooksForLanguage);
 * ```
 */
export async function getCachedBooks(
  lang: string,
  getAllBooksFn: (lang: string) => Promise<unknown[]>,
): Promise<unknown[]> {
  const cacheKey = generateCollectionCacheKey("books", lang);
  return buildCache.getOrCompute(cacheKey, () => getAllBooksFn(lang));
}

/**
 * Cached version of getAllTutorialsForLanguage
 *
 * Use this instead of calling getAllTutorialsForLanguage directly to benefit
 * from build-time caching.
 *
 * @param lang - Language code ('en' or 'es')
 * @param getAllTutorialsFn - The actual tutorial loading function
 * @returns Promise resolving to array of tutorials
 *
 * @example
 * ```ts
 * const tutorials = await getCachedTutorials('es', getAllTutorialsForLanguage);
 * ```
 */
export async function getCachedTutorials(
  lang: string,
  getAllTutorialsFn: (lang: string) => Promise<unknown[]>,
): Promise<unknown[]> {
  const cacheKey = generateCollectionCacheKey("tutorials", lang);
  return buildCache.getOrCompute(cacheKey, () => getAllTutorialsFn(lang));
}

/**
 * Cached version of getAllContentForLanguage (posts)
 *
 * Use this instead of calling getAllContentForLanguage directly to benefit
 * from build-time caching.
 *
 * @param lang - Language code ('en' or 'es')
 * @param getAllContentFn - The actual content loading function
 * @returns Promise resolving to array of posts
 *
 * @example
 * ```ts
 * const posts = await getCachedContent('en', getAllContentForLanguage);
 * ```
 */
export async function getCachedContent(
  lang: string,
  getAllContentFn: (lang: string) => Promise<unknown[]>,
): Promise<unknown[]> {
  const cacheKey = generateCollectionCacheKey("posts", lang);
  return buildCache.getOrCompute(cacheKey, () => getAllContentFn(lang));
}

/**
 * Generic cached content loader
 *
 * This is the most flexible caching function. Use it for any content type
 * by providing the collection name, language, and loader function.
 *
 * **Recommended Usage:**
 * This is the preferred method for route generators as it works with any
 * content type without needing type-specific wrapper functions.
 *
 * **Cache Key Format:**
 * Generates keys as `collection:{collectionName}:{lang}`
 *
 * @param collectionName - Name of the collection (e.g., 'books', 'tutorials', 'posts')
 * @param lang - Language code ('en' or 'es')
 * @param loaderFn - Function that loads the content (receives lang parameter)
 * @returns Promise resolving to array of items of type T
 *
 * @example
 * ```ts
 * // In route generator
 * const books = await getCachedCollection('books', 'en', getAllBooksForLanguage);
 * const tutorials = await getCachedCollection('tutorials', 'es', getAllTutorialsForLanguage);
 * const posts = await getCachedCollection('posts', 'en', getAllContentForLanguage);
 * ```
 */
export async function getCachedCollection<T>(
  collectionName: string,
  lang: string,
  loaderFn: (lang: string) => Promise<T[]>,
): Promise<T[]> {
  const cacheKey = generateCollectionCacheKey(collectionName, lang);
  return buildCache.getOrCompute(cacheKey, () => loaderFn(lang));
}
