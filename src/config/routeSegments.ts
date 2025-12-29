/**
 * Route segment configuration for internationalization
 *
 * Centralizes all route translations to avoid magic strings throughout the codebase.
 * Each entry maps a content type or page type to its localized URL segment.
 */

import type { LanguageKey } from "@/types";

/**
 * Route segment translations by content/page type
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
