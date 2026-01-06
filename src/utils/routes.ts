/**
 * Route translations for localized URLs
 * Following SEO best practices: all URLs should be in the content's language
 */

import { getLanguageCodes, isValidLanguage as isValidLang, type LanguageKey } from "@/config/languages";

export type RouteSegment =
  | "posts"
  | "tutorials"
  | "books"
  | "categories"
  | "genres"
  | "publishers"
  | "series"
  | "challenges"
  | "authors"
  | "courses"
  | "about"
  | "feeds"
  | "page"
  | "score";

/**
 * Route translations map
 * Key: route segment in code
 * Value: localized route segments by language
 */
export const routeTranslations: Record<RouteSegment, Record<string, string>> = {
  posts: {
    en: "posts",
    es: "publicaciones",
  },
  tutorials: {
    en: "tutorials",
    es: "tutoriales",
  },
  books: {
    en: "books",
    es: "libros",
  },
  categories: {
    en: "categories",
    es: "categorias",
  },
  genres: {
    en: "genres",
    es: "generos",
  },
  publishers: {
    en: "publishers",
    es: "editoriales",
  },
  series: {
    en: "series",
    es: "series",
  },
  challenges: {
    en: "challenges",
    es: "retos",
  },
  authors: {
    en: "authors",
    es: "autores",
  },
  courses: {
    en: "courses",
    es: "cursos",
  },
  about: {
    en: "about",
    es: "acerca-de",
  },
  feeds: {
    en: "feeds",
    es: "feeds",
  },
  page: {
    en: "page",
    es: "pagina",
  },
  score: {
    en: "score",
    es: "score",
  },
};

/**
 * Get localized route segment
 * @param segment - Route segment key
 * @param lang - Language code (es, en)
 * @returns Localized route segment
 */
export function getLocalizedRoute(segment: RouteSegment, lang: string): string {
  return routeTranslations[segment]?.[lang] || segment;
}

/**
 * Build localized path
 * @param lang - Language code
 * @param segments - Route segments to build
 * @returns Localized path with language prefix
 */
export function buildLocalizedPath(lang: string, ...segments: (RouteSegment | string)[]): string {
  const localizedSegments = segments.map((segment) => {
    // Check if segment is a known route segment
    if (segment in routeTranslations) {
      return getLocalizedRoute(segment as RouteSegment, lang);
    }
    // Otherwise return as-is (e.g., slugs)
    return segment;
  });

  return `/${lang}/${localizedSegments.join("/")}`;
}

/**
 * Get reverse route mapping (from localized segment to canonical segment)
 * Useful for URL parsing and routing
 */
export function getCanonicalSegment(localizedSegment: string, lang: string): RouteSegment | null {
  for (const [canonical, translations] of Object.entries(routeTranslations)) {
    if (translations[lang] === localizedSegment) {
      return canonical as RouteSegment;
    }
  }
  return null;
}

/**
 * Generic URL builders
 */

/**
 * Content type for detail URLs
 */
export type ContentType =
  | "posts"
  | "tutorials"
  | "books"
  | "categories"
  | "genres"
  | "publishers"
  | "series"
  | "challenges"
  | "courses"
  | "authors";

/**
 * Generic builder for content detail URLs
 * @param type - Content type (posts, books, tutorials, etc.)
 * @param lang - Language code
 * @param slug - Content slug
 * @returns Localized URL for content detail page
 *
 * @example
 * buildContentUrl("posts", "es", "my-post") // "/es/publicaciones/my-post"
 * buildContentUrl("books", "en", "book-title") // "/en/books/book-title"
 */
export function buildContentUrl(type: ContentType, lang: string, slug: string): string {
  return buildLocalizedPath(lang, type, slug);
}

/**
 * Generic builder for simple index URLs (without pagination)
 * @param type - Content type
 * @param lang - Language code
 * @returns Localized URL for index page
 *
 * @example
 * buildIndexUrl("authors", "es") // "/es/autores"
 * buildIndexUrl("categories", "en") // "/en/categories"
 */
export function buildIndexUrl(type: RouteSegment, lang: string): string {
  return buildLocalizedPath(lang, type);
}

/**
 * Generic builder for paginated index URLs
 * @param type - Content type
 * @param lang - Language code
 * @param page - Page number (optional, default to base URL)
 * @returns Localized URL for paginated index page
 *
 * @example
 * buildPaginatedIndexUrl("posts", "es") // "/es/publicaciones"
 * buildPaginatedIndexUrl("posts", "es", 2) // "/es/publicaciones/pagina/2"
 */
export function buildPaginatedIndexUrl(type: ContentType, lang: string, page?: number): string {
  const base = buildLocalizedPath(lang, type);
  if (page && page > 1) {
    const pageSegment = getLocalizedRoute("page", lang);
    return `${base}/${pageSegment}/${page}`;
  }
  return base;
}

/**
 * Helper functions for common URL patterns
 * These are thin wrappers around generic builders for backwards compatibility
 */

export function buildPostUrl(lang: string, slug: string): string {
  return buildContentUrl("posts", lang, slug);
}

export function buildTutorialUrl(lang: string, slug: string): string {
  return buildContentUrl("tutorials", lang, slug);
}

export function buildBookUrl(lang: string, slug: string): string {
  return buildContentUrl("books", lang, slug);
}

export function buildCategoryUrl(lang: string, slug: string): string {
  return buildContentUrl("categories", lang, slug);
}

export function buildGenreUrl(lang: string, slug: string): string {
  return buildContentUrl("genres", lang, slug);
}

export function buildPublisherUrl(lang: string, slug: string): string {
  return buildContentUrl("publishers", lang, slug);
}

export function buildSeriesUrl(lang: string, slug: string): string {
  return buildContentUrl("series", lang, slug);
}

export function buildChallengeUrl(lang: string, slug: string): string {
  return buildContentUrl("challenges", lang, slug);
}

export function buildCourseUrl(lang: string, slug: string): string {
  return buildContentUrl("courses", lang, slug);
}

export function buildAuthorUrl(lang: string, slug: string): string {
  return buildContentUrl("authors", lang, slug);
}

export function buildScoreUrl(lang: string, score: string | number): string {
  return buildLocalizedPath(lang, "score", String(score));
}

export function buildAboutUrl(lang: string): string {
  return buildIndexUrl("about", lang);
}

export function buildFeedsUrl(lang: string): string {
  return buildIndexUrl("feeds", lang);
}

/**
 * Helper functions for pagination URLs
 * These are thin wrappers around buildPaginatedIndexUrl for backwards compatibility
 */

export function buildPostsIndexUrl(lang: string, page?: number): string {
  return buildPaginatedIndexUrl("posts", lang, page);
}

export function buildTutorialsIndexUrl(lang: string, page?: number): string {
  return buildPaginatedIndexUrl("tutorials", lang, page);
}

export function buildBooksIndexUrl(lang: string, page?: number): string {
  return buildPaginatedIndexUrl("books", lang, page);
}

export function buildAuthorsIndexUrl(lang: string): string {
  return buildIndexUrl("authors", lang);
}

export function buildCategoriesIndexUrl(lang: string): string {
  return buildIndexUrl("categories", lang);
}

export function buildGenresIndexUrl(lang: string): string {
  return buildIndexUrl("genres", lang);
}

export function buildPublishersIndexUrl(lang: string): string {
  return buildIndexUrl("publishers", lang);
}

export function buildSeriesIndexUrl(lang: string): string {
  return buildIndexUrl("series", lang);
}

export function buildChallengesIndexUrl(lang: string): string {
  return buildIndexUrl("challenges", lang);
}

export function buildCoursesIndexUrl(lang: string): string {
  return buildIndexUrl("courses", lang);
}

/**
 * Language utilities for dynamic routes
 */

export type Language = LanguageKey;

/**
 * Get all supported languages
 */
export function getLanguages(): LanguageKey[] {
  return getLanguageCodes();
}

/**
 * Get default language
 */
export function getDefaultLanguage(): LanguageKey {
  return getLanguageCodes()[0];
}

/**
 * Validate if a language code is supported
 */
export function isValidLanguage(lang: string): lang is LanguageKey {
  return isValidLang(lang);
}
