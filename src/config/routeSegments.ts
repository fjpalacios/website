/**
 * Route Segment Configuration for Internationalization
 *
 * DEPRECATED: This module now proxies to src/config/languages.ts
 * for backwards compatibility. Use functions from @config/languages directly.
 *
 * **Migration Guide:**
 * ```ts
 * // OLD
 * import { getRouteSegment } from "@config/routeSegments";
 * getRouteSegment('books', 'es');
 *
 * // NEW
 * import { getUrlSegment } from "@config/languages";
 * getUrlSegment('es', 'books');
 * ```
 *
 * **Why the change?**
 * - Centralized language configuration
 * - Auto-generated TypeScript types
 * - Easier to add new languages
 *
 * @module config/routeSegments
 * @deprecated Use @config/languages instead
 */

import { getAllLanguages, getUrlSegment, type LanguageConfig } from "@/config/languages";
import type { LanguageKey } from "@/types";

/**
 * Route segment translations by content/page type
 * Generated from language configuration for backwards compatibility
 */
export const ROUTE_SEGMENTS: Record<string, Record<LanguageKey, string>> = (() => {
  const languages = getAllLanguages();
  const segments: Record<string, Record<string, string>> = {};

  // Get all segment keys from the first language
  const firstLang = languages[0];
  const segmentKeys = Object.keys(firstLang.urlSegments) as (keyof LanguageConfig["urlSegments"])[];

  // Build the ROUTE_SEGMENTS structure
  for (const key of segmentKeys) {
    segments[key] = {};
    for (const lang of languages) {
      segments[key][lang.code] = lang.urlSegments[key];
    }
  }

  return segments as Record<string, Record<LanguageKey, string>>;
})();

/**
 * Get the localized route segment for a given key and language
 *
 * @deprecated Use getUrlSegment(lang, key) from @config/languages instead
 * @param key - The route segment key (e.g., 'books', 'tutorials', 'page')
 * @param lang - The target language
 * @returns The localized route segment
 *
 * @example
 * getRouteSegment('books', 'en') // => 'books'
 * getRouteSegment('books', 'es') // => 'libros'
 * getRouteSegment('page', 'es') // => 'pagina'
 */
export function getRouteSegment(key: string, lang: LanguageKey): string {
  // Proxy to new language config system
  return getUrlSegment(lang, key as keyof LanguageConfig["urlSegments"]);
}

/**
 * Get multiple route segments at once
 *
 * @deprecated Build URLs using getUrlSegment() instead
 * @param keys - Array of route segment keys
 * @param lang - The target language
 * @returns Object mapping keys to their localized segments
 *
 * @example
 * getRouteSegments(['books', 'page'], 'es')
 * // => { books: 'libros', page: 'pagina' }
 */
export function getRouteSegments(keys: string[], lang: LanguageKey): Record<string, string> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = getRouteSegment(key, lang);
      return acc;
    },
    {} as Record<string, string>,
  );
}
