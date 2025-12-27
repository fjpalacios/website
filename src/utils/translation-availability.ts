/**
 * Translation Availability Helpers
 *
 * Extracted from Menu.astro to simplify translation availability logic.
 * Determines whether a translation exists for the current page.
 *
 * @module utils/translation-availability
 */

import { t } from "@locales";

/**
 * Check if the given path represents a static page
 * Static pages always have translations available (home, about)
 *
 * @param currentPath - Current URL pathname
 * @param lang - Current language code
 * @returns True if this is a static page
 * @example
 * isStaticPage("/es", "es") // true (home)
 * isStaticPage("/es/acerca-de", "es") // true (about)
 * isStaticPage("/es/libros", "es") // false (listing)
 */
export function isStaticPage(currentPath: string, lang: string): boolean {
  // Normalize path (remove trailing slash for comparison)
  const normalizedPath = currentPath.endsWith("/") ? currentPath.slice(0, -1) : currentPath;

  // Home page
  if (normalizedPath === `/${lang}`) {
    return true;
  }

  // About page
  const aboutRoute = t(lang, "routes.about");
  if (normalizedPath === `/${lang}/${aboutRoute}`) {
    return true;
  }

  return false;
}

/**
 * Check if the given path represents an index/listing page
 * Index pages show lists of content (books, posts, tutorials, taxonomies)
 *
 * @param currentPath - Current URL pathname
 * @param lang - Current language code
 * @returns True if this is an index/listing page
 * @example
 * isIndexPage("/es/libros", "es") // true
 * isIndexPage("/en/posts", "en") // true
 * isIndexPage("/es/libros/mi-libro", "es") // false (detail page)
 */
export function isIndexPage(currentPath: string, lang: string): boolean {
  // Normalize path (remove trailing slash for comparison)
  const normalizedPath = currentPath.endsWith("/") ? currentPath.slice(0, -1) : currentPath;

  // Build list of all index routes for this language
  const indexRoutes = [
    `/${lang}/${t(lang, "routes.posts")}`,
    `/${lang}/${t(lang, "routes.tutorials")}`,
    `/${lang}/${t(lang, "routes.books")}`,
    `/${lang}/${t(lang, "routes.feeds")}`,
    `/${lang}/${t(lang, "routes.authors")}`,
    `/${lang}/${t(lang, "routes.categories")}`,
    `/${lang}/${t(lang, "routes.genres")}`,
    `/${lang}/${t(lang, "routes.publishers")}`,
    `/${lang}/${t(lang, "routes.series")}`,
    `/${lang}/${t(lang, "routes.challenges")}`,
    `/${lang}/${t(lang, "routes.courses")}`,
  ];

  return indexRoutes.includes(normalizedPath);
}

/**
 * Determine if translation is available for the current page
 *
 * Rules:
 * 1. Static pages (home, about) always have translation available
 * 2. Index/listing pages check hasTargetContent (if provided) to know if target language has content
 * 3. Content detail pages depend on translationSlug being provided
 * 4. Taxonomy detail pages depend on translationSlug being provided
 *
 * @param currentPath - Current URL pathname
 * @param lang - Current language code
 * @param translationSlug - Slug of the translated version (for detail pages)
 * @param hasTargetContent - Whether target language has content (for index pages)
 * @returns True if translation is available
 * @example
 * // Static page (always true)
 * hasTranslation("/es", "es", undefined, undefined) // true
 *
 * // Index page with content
 * hasTranslation("/es/libros", "es", undefined, true) // true
 *
 * // Detail page with translation
 * hasTranslation("/es/libros/mi-libro", "es", "my-book", undefined) // true
 *
 * // Detail page without translation
 * hasTranslation("/es/libros/mi-libro", "es", undefined, undefined) // false
 */
export function hasTranslation(
  currentPath: string,
  lang: string,
  translationSlug?: string,
  hasTargetContent?: boolean,
): boolean {
  // Static pages always have translation
  if (isStaticPage(currentPath, lang)) {
    return true;
  }

  // Index pages check if target language has content
  if (isIndexPage(currentPath, lang)) {
    // If hasTargetContent is not provided, assume translation exists (backward compatibility)
    return hasTargetContent !== undefined ? hasTargetContent : true;
  }

  // Detail pages depend on translationSlug
  // Empty string is treated as no translation
  return translationSlug !== undefined && translationSlug !== "";
}
