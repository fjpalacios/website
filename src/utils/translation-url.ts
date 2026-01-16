/**
 * Translation URL Helpers
 *
 * Extracted from LanguageSwitcher.astro to simplify complex URL translation logic.
 * These pure functions handle URL building for different page types across languages.
 *
 * @module utils/translation-url
 */

import { getCanonicalSegment, getLocalizedRoute, type RouteSegment } from "./routes";

/**
 * Check if the given path represents the home page
 * @param pathParts - Array of path segments
 * @returns True if this is the home page
 * @example
 * isHomePage([]) // true
 * isHomePage(["es"]) // true
 * isHomePage(["es", "libros"]) // false
 */
export function isHomePage(pathParts: string[]): boolean {
  return pathParts.length === 0 || pathParts.length === 1;
}

/**
 * Check if the given path represents a static page (about, feeds)
 * Static pages always have translations available
 *
 * @param pathParts - Array of path segments
 * @param currentLang - Current language code
 * @returns True if this is a static page
 * @example
 * isStaticPage(["es", "acerca-de"], "es") // true
 * isStaticPage(["en", "about"], "en") // true
 * isStaticPage(["es", "libros"], "es") // false
 */
export function isStaticPage(pathParts: string[], currentLang: string): boolean {
  if (pathParts.length < 2) {
    return false;
  }

  const localizedSegment = pathParts[1];
  const canonicalSegment = getCanonicalSegment(localizedSegment, currentLang);

  // Static pages: about, feeds, shelf
  const staticPages = ["about", "feeds", "shelf"];

  return staticPages.includes(canonicalSegment || "");
}

/**
 * Build home page URL for target language
 * @param targetLang - Target language code
 * @returns Home page URL
 * @example
 * buildHomeUrl("es") // "/es"
 * buildHomeUrl("en") // "/en"
 */
export function buildHomeUrl(targetLang: string): string {
  return `/${targetLang}`;
}

/**
 * Build static page URL translating the route segment
 * Used for pages like /about, /feeds that always have translations
 * Also handles pagination pages by redirecting to page 1 of the target language
 * Translates all known route segments in the path (e.g., /books/stats, /books/shelf)
 *
 * @param pathParts - Array of path segments from current URL
 * @param currentLang - Current language code
 * @param targetLang - Target language code
 * @returns Translated URL
 * @example
 * buildStaticPageUrl(["es", "acerca-de"], "es", "en") // "/en/about"
 * buildStaticPageUrl(["en", "feeds"], "en", "es") // "/es/feeds"
 * buildStaticPageUrl(["en", "posts", "page", "2"], "en", "es") // "/es/publicaciones" (page 1)
 * buildStaticPageUrl(["es", "libros", "pagina", "3"], "es", "en") // "/en/books" (page 1)
 * buildStaticPageUrl(["es", "libros", "estadisticas"], "es", "en") // "/en/books/stats"
 * buildStaticPageUrl(["en", "books", "shelf"], "en", "es") // "/es/libros/estanteria"
 */
export function buildStaticPageUrl(pathParts: string[], currentLang: string, targetLang: string): string {
  if (pathParts.length < 2) {
    return buildHomeUrl(targetLang);
  }

  const localizedSegment = pathParts[1];
  const canonicalSegment = getCanonicalSegment(localizedSegment, currentLang);

  if (!canonicalSegment) {
    // Unknown segment, just swap language
    return `/${targetLang}/${localizedSegment}`;
  }

  // Translate segment to target language
  const translatedSegment = getLocalizedRoute(canonicalSegment as RouteSegment, targetLang);

  // Check if this is a pagination page (e.g., /posts/page/2 or /publicaciones/pagina/2)
  // If so, redirect to page 1 (the index) in the target language
  if (pathParts.length >= 3) {
    const thirdSegment = pathParts[2];
    // Check if the third segment is a pagination segment ("page" or "pagina")
    if (thirdSegment === "page" || thirdSegment === "pagina") {
      // Redirect to page 1 (the index page) in target language
      return `/${targetLang}/${translatedSegment}`;
    }
  }

  // Rebuild path with remaining segments (if any), translating known route segments
  const remainingParts = pathParts.slice(2).map((segment) => {
    const segmentCanonical = getCanonicalSegment(segment, currentLang);
    if (segmentCanonical) {
      return getLocalizedRoute(segmentCanonical as RouteSegment, targetLang);
    }
    return segment;
  });
  const remainingPath = remainingParts.length ? `/${remainingParts.join("/")}` : "";

  return `/${targetLang}/${translatedSegment}${remainingPath}`;
}

/**
 * Build detail page URL with translated route segment
 * Used for content pages (books, posts, tutorials) and taxonomy pages
 *
 * @param localizedSegment - Current localized segment (e.g., "libros", "books")
 * @param translationSlug - Slug of the translated content
 * @param currentLang - Current language code
 * @param targetLang - Target language code
 * @returns Translated detail page URL
 * @example
 * buildDetailPageUrl("libros", "my-book", "es", "en") // "/en/books/my-book"
 * buildDetailPageUrl("tutorials", "mi-tutorial", "en", "es") // "/es/tutoriales/mi-tutorial"
 */
export function buildDetailPageUrl(
  localizedSegment: string,
  translationSlug: string,
  currentLang: string,
  targetLang: string,
): string {
  // Get canonical segment from current localized path
  const canonicalSegment = getCanonicalSegment(localizedSegment, currentLang);

  if (!canonicalSegment) {
    // Fallback if we can't determine the content type
    return buildHomeUrl(targetLang);
  }

  // Translate to target language
  const translatedSegment = getLocalizedRoute(canonicalSegment as RouteSegment, targetLang);

  return `/${targetLang}/${translatedSegment}/${translationSlug}`;
}
