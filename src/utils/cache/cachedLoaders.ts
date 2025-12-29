/**
 * Cached Content Loaders
 *
 * Provides cached versions of expensive content loading operations.
 * These wrappers use the build cache to avoid redundant data fetching.
 *
 * @module cache/cachedLoaders
 */

import { buildCache, generateCollectionCacheKey } from "./buildCache";

/**
 * Cached version of getAllBooksForLanguage
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
 */
export async function getCachedCollection<T>(
  collectionName: string,
  lang: string,
  loaderFn: (lang: string) => Promise<T[]>,
): Promise<T[]> {
  const cacheKey = generateCollectionCacheKey(collectionName, lang);
  return buildCache.getOrCompute(cacheKey, () => loaderFn(lang));
}
