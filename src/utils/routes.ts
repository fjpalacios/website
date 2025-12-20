/**
 * Route translations for localized URLs
 * Following SEO best practices: all URLs should be in the content's language
 */

export type RouteSegment =
  | "posts"
  | "tutorials"
  | "books"
  | "categories"
  | "genres"
  | "publishers"
  | "series"
  | "challenges"
  | "author"
  | "about";

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
  author: {
    en: "author",
    es: "autor",
  },
  about: {
    en: "about",
    es: "acerca-de",
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

export function buildAuthorUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "author", slug);
}

export function buildAboutUrl(lang: string): string {
  return buildLocalizedPath(lang, "about");
}
