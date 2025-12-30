/**
 * Route Segment Configuration for Internationalization
 *
 * Centralizes all URL segment translations to maintain consistency
 * across the application and avoid magic strings in the codebase.
 *
 * **Purpose:**
 * - Provide translated URL segments for all content types and pages
 * - Enable type-safe route segment lookups
 * - Make it easy to add new languages in the future
 * - Keep URL structure organized and maintainable
 *
 * **Structure:**
 * Each entry maps a content/page type to its localized URL segments:
 * - **Content Types:** books, tutorials, posts
 * - **Taxonomies:** authors, publishers, genres, categories, series, challenges, courses
 * - **Static Pages:** about, contact
 * - **Utility:** page (for pagination URLs)
 *
 * **Usage:**
 * ```ts
 * // Get a single segment
 * const segment = getRouteSegment('books', 'es'); // => 'libros'
 *
 * // Get multiple segments at once
 * const segments = getRouteSegments(['books', 'page'], 'es');
 * // => { books: 'libros', page: 'pagina' }
 *
 * // Build a URL
 * const url = `/${lang}/${getRouteSegment('books', lang)}/${slug}`;
 * ```
 *
 * **Examples:**
 * - EN: `/en/books/my-book` → ES: `/es/libros/my-book`
 * - EN: `/en/tutorials/page/2` → ES: `/es/tutoriales/pagina/2`
 * - EN: `/en/authors/stephen-king` → ES: `/es/autores/stephen-king`
 *
 * @module config/routeSegments
 */

import type { LanguageKey } from "@/types";

/**
 * Route segment translations by content/page type
 *
 * This configuration object stores all URL segment translations.
 * Add new entries here when creating new content types or pages.
 *
 * **Format:**
 * ```ts
 * {
 *   [key: string]: {
 *     en: string;  // English segment
 *     es: string;  // Spanish segment
 *   }
 * }
 * ```
 *
 * **Adding a New Route:**
 * ```ts
 * newContentType: {
 *   en: "new-content",
 *   es: "nuevo-contenido",
 * },
 * ```
 */
export const ROUTE_SEGMENTS: Record<string, Record<LanguageKey, string>> = {
  // Content Types
  books: {
    en: "books",
    es: "libros",
  },
  tutorials: {
    en: "tutorials",
    es: "tutoriales",
  },
  posts: {
    en: "posts",
    es: "publicaciones",
  },

  // Taxonomies
  authors: {
    en: "authors",
    es: "autores",
  },
  publishers: {
    en: "publishers",
    es: "editoriales",
  },
  genres: {
    en: "genres",
    es: "generos",
  },
  categories: {
    en: "categories",
    es: "categorias",
  },
  series: {
    en: "series",
    es: "series",
  },
  challenges: {
    en: "challenges",
    es: "retos",
  },
  courses: {
    en: "courses",
    es: "cursos",
  },

  // Static Pages
  about: {
    en: "about",
    es: "acerca-de",
  },
  contact: {
    en: "contact",
    es: "contacto",
  },
  feeds: {
    en: "feeds",
    es: "feeds",
  },

  // Pagination
  page: {
    en: "page",
    es: "pagina",
  },
} as const;

/**
 * Get the localized route segment for a given key and language
 *
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
  const segment = ROUTE_SEGMENTS[key]?.[lang];

  if (!segment) {
    throw new Error(
      `Route segment not found for key "${key}" and language "${lang}". ` +
        `Available keys: ${Object.keys(ROUTE_SEGMENTS).join(", ")}`,
    );
  }

  return segment;
}

/**
 * Get multiple route segments at once
 *
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
