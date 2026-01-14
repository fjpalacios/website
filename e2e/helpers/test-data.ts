/**
 * Test Data and Configuration
 *
 * Centralized test data, URLs, and configuration for E2E tests.
 * Imports from actual app config to stay in sync.
 */

import { getLanguageCodes, getUrlSegment, type LanguageKey } from "../../src/config/languages";
import { PAGINATION_CONFIG } from "../../src/config/pagination";

/**
 * Viewport configurations for responsive testing
 */
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  tablet: { width: 768, height: 1024 }, // iPad
  desktop: { width: 1920, height: 1080 }, // Full HD
} as const;

export type ViewportKey = keyof typeof VIEWPORTS;

/**
 * Available languages for testing (from app config)
 */
export const LANGUAGES = getLanguageCodes();

/**
 * Default language for tests
 */
export const DEFAULT_LANG: LanguageKey = "es";

/**
 * Pagination configuration (from app config)
 */
export const PAGINATION = {
  books: PAGINATION_CONFIG.books,
  tutorials: PAGINATION_CONFIG.tutorials,
  posts: PAGINATION_CONFIG.posts,
  taxonomy: PAGINATION_CONFIG.taxonomy,
} as const;

/**
 * Content type for testing
 */
export type ContentType = keyof typeof PAGINATION;

/**
 * Get localized URL for a content type
 * @param lang - Language code
 * @param contentType - Content type (books, tutorials, posts)
 * @returns Localized URL path
 *
 * @example
 * getLocalizedUrl("es", "books") // => "/es/libros"
 * getLocalizedUrl("en", "books") // => "/en/books"
 */
export function getLocalizedUrl(lang: LanguageKey, contentType: ContentType): string {
  const segment = getUrlSegment(lang, contentType);
  return `/${lang}/${segment}`;
}

/**
 * Get localized URL for pagination
 * @param lang - Language code
 * @param contentType - Content type
 * @param pageNumber - Page number (1-based)
 * @returns Localized pagination URL
 *
 * @example
 * getPaginationUrl("es", "books", 2) // => "/es/libros/pagina/2"
 * getPaginationUrl("en", "books", 2) // => "/en/books/page/2"
 */
export function getPaginationUrl(lang: LanguageKey, contentType: ContentType, pageNumber: number): string {
  const segment = getUrlSegment(lang, contentType);
  const pageSegment = getUrlSegment(lang, "page");
  return `/${lang}/${segment}/${pageSegment}/${pageNumber}`;
}

/**
 * Get localized taxonomy URL
 * @param lang - Language code
 * @param taxonomyType - Taxonomy type (genres, authors, etc.)
 * @returns Localized taxonomy list URL
 *
 * @example
 * getTaxonomyUrl("es", "genres") // => "/es/generos"
 * getTaxonomyUrl("en", "genres") // => "/en/genres"
 */
export function getTaxonomyUrl(
  lang: LanguageKey,
  taxonomyType: "genres" | "authors" | "publishers" | "series" | "categories" | "challenges",
): string {
  const segment = getUrlSegment(lang, taxonomyType);
  return `/${lang}/${segment}`;
}

/**
 * Static test content that won't change
 * These are specific books/tutorials/posts we know exist and use for stable tests
 */
export const STABLE_CONTENT = {
  books: {
    es: {
      slug: "1984-de-george-orwell",
      url: "/es/libros/1984-de-george-orwell",
      title: "1984",
    },
    // Add more stable book examples as needed
  },
  tutorials: {
    es: {
      slug: "que-es-git",
      url: "/es/tutoriales/que-es-git",
      title: "¿Qué es Git?",
    },
    en: {
      slug: "what-is-git",
      url: "/en/tutorials/what-is-git",
      title: "What is Git?",
    },
  },
  posts: {
    es: {
      slug: "libros-leidos-durante-2017",
      url: "/es/publicaciones/libros-leidos-durante-2017",
      title: "Libros leídos durante 2017",
    },
  },
} as const;

/**
 * Genres that exist in the system
 * Used for taxonomy tests
 */
export const GENRES = {
  es: ["terror", "fantastico", "intriga", "romantico", "historico"],
  en: [], // Currently no English genre pages exist
} as const;
