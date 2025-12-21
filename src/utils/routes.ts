/**
 * Route translations for localized URLs
 * Following SEO best practices: all URLs should be in the content's language
 */

export type RouteSegment =
  | "posts"
  | "tutorials"
  | "books"
  | "categories"
  | "tags"
  | "genres"
  | "publishers"
  | "series"
  | "challenges"
  | "authors"
  | "author"
  | "courses"
  | "about"
  | "page";

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
  tags: {
    en: "tag",
    es: "etiqueta",
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
  author: {
    en: "author",
    es: "autor",
  },
  courses: {
    en: "courses",
    es: "cursos",
  },
  about: {
    en: "about",
    es: "acerca-de",
  },
  page: {
    en: "page",
    es: "pagina",
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
 * Helper functions for common URL patterns
 */

export function buildPostUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "posts", slug);
}

export function buildTutorialUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "tutorials", slug);
}

export function buildBookUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "books", slug);
}

export function buildCategoryUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "categories", slug);
}

export function buildTagUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "tags", slug);
}

export function buildGenreUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "genres", slug);
}

export function buildPublisherUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "publishers", slug);
}

export function buildSeriesUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "series", slug);
}

export function buildChallengeUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "challenges", slug);
}

export function buildCourseUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "courses", slug);
}

export function buildAuthorUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "author", slug);
}

export function buildAboutUrl(lang: string): string {
  return buildLocalizedPath(lang, "about");
}

/**
 * Helper functions for pagination URLs
 */

export function buildPostsIndexUrl(lang: string, page?: number): string {
  const base = buildLocalizedPath(lang, "posts");
  if (page && page > 1) {
    const pageSegment = getLocalizedRoute("page", lang);
    return `${base}/${pageSegment}/${page}`;
  }
  return base;
}

export function buildTutorialsIndexUrl(lang: string, page?: number): string {
  const base = buildLocalizedPath(lang, "tutorials");
  if (page && page > 1) {
    const pageSegment = getLocalizedRoute("page", lang);
    return `${base}/${pageSegment}/${page}`;
  }
  return base;
}

export function buildBooksIndexUrl(lang: string, page?: number): string {
  const base = buildLocalizedPath(lang, "books");
  if (page && page > 1) {
    const pageSegment = getLocalizedRoute("page", lang);
    return `${base}/${pageSegment}/${page}`;
  }
  return base;
}

/**
 * Language utilities for dynamic routes
 */

export type Language = "es" | "en";

/**
 * Get all supported languages
 */
export function getLanguages(): Language[] {
  return ["es", "en"];
}

/**
 * Get default language
 */
export function getDefaultLanguage(): Language {
  return "es";
}

/**
 * Validate if a language code is supported
 */
export function isValidLanguage(lang: string): lang is Language {
  return getLanguages().includes(lang as Language);
}
