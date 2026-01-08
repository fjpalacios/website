/**
 * Unified Routing Configuration
 * Phase 3: Unified i18n Routing System
 *
 * This configuration defines how content types map to routes, templates,
 * and features. It enables a single dynamic page to handle all language
 * variants instead of maintaining duplicate page files.
 *
 * @see docs/PHASE_3_UNIFIED_ROUTING.md
 * @see docs/ROUTE_MAPPING.md
 */

import { PAGINATION_CONFIG } from "@/config/pagination";
import { routingLogger } from "@/utils/logger";
import type { Language } from "@/utils/routes";

/**
 * Page type enum
 * Defines the different types of pages that can be rendered
 */
export type PageType = "list" | "detail" | "pagination" | "rss" | "static";

/**
 * Content category enum
 * Distinguishes between main content types and taxonomies
 */
export type ContentCategory = "content" | "taxonomy" | "static";

/**
 * Template name for rendering
 * Maps to components in src/templates/
 */
export type TemplateName =
  | "ContentList"
  | "ContentDetail"
  | "ContentPagination"
  | "TaxonomyListGrouped"
  | "TaxonomyDetail"
  | "StaticPage"
  | "RSSFeed";

/**
 * Collection name from Astro Content Collections
 */
export type CollectionName =
  | "books"
  | "tutorials"
  | "posts"
  | "authors"
  | "publishers"
  | "genres"
  | "categories"
  | "series"
  | "challenges"
  | "courses";

/**
 * Content Type Configuration
 * Defines all properties and behavior for each content type
 */
export interface ContentTypeConfig {
  /** Unique identifier (canonical name used in code) */
  id: string;

  /** Content category (content, taxonomy, or static) */
  category: ContentCategory;

  /** Astro Content Collection name */
  collection: CollectionName | null;

  /** Route segment translations by language */
  routeSegments: Record<Language, string>;

  /** Template mappings for different page types */
  templates: {
    list?: TemplateName;
    detail?: TemplateName;
    pagination?: TemplateName;
    rss?: TemplateName;
  };

  /** Feature flags */
  features: {
    /** Has paginated list pages */
    hasPagination: boolean;

    /** Has RSS feed */
    hasRSS: boolean;

    /** Items per page (if paginated) */
    itemsPerPage?: number;

    /** Show related content on detail pages */
    showRelated?: boolean;

    /** Enable search indexing */
    searchable?: boolean;
  };

  /** SEO configuration */
  seo: {
    /** Schema.org type */
    schemaType: string;

    /** Generate ItemList schema for list pages */
    generateItemList: boolean;

    /** Default meta description key (for i18n lookup) */
    descriptionKey?: string;
  };

  /** Data loader functions */
  dataLoaders: {
    /** Function to get all items for a language */
    getAll?: string; // Function name in utils

    /** Function to get single item by slug */
    getBySlug?: string; // Function name in utils
  };
}

/**
 * Route Configuration Registry
 * Central source of truth for all content types and their routing rules
 */
export const CONTENT_TYPES: Record<string, ContentTypeConfig> = {
  // =================================================================
  // MAIN CONTENT TYPES (books, tutorials, posts)
  // =================================================================

  books: {
    id: "books",
    category: "content",
    collection: "books",
    routeSegments: {
      en: "books",
      es: "libros",
    },
    templates: {
      list: "ContentList",
      detail: "ContentDetail",
      pagination: "ContentPagination",
      rss: "RSSFeed",
    },
    features: {
      hasPagination: true,
      hasRSS: true,
      itemsPerPage: PAGINATION_CONFIG.books,
      showRelated: true,
      searchable: true,
    },
    seo: {
      schemaType: "Book",
      generateItemList: true,
      descriptionKey: "pages.booksDescription",
    },
    dataLoaders: {
      getAll: "getAllBooksForLanguage",
      getBySlug: "getBookBySlug",
    },
  },

  tutorials: {
    id: "tutorials",
    category: "content",
    collection: "tutorials",
    routeSegments: {
      en: "tutorials",
      es: "tutoriales",
    },
    templates: {
      list: "ContentList",
      detail: "ContentDetail",
      pagination: "ContentPagination",
      rss: "RSSFeed",
    },
    features: {
      hasPagination: true,
      hasRSS: true,
      itemsPerPage: PAGINATION_CONFIG.tutorials,
      showRelated: true,
      searchable: true,
    },
    seo: {
      schemaType: "Article",
      generateItemList: true,
      descriptionKey: "pages.tutorialsDescription",
    },
    dataLoaders: {
      getAll: "getAllTutorialsForLanguage",
      getBySlug: "getTutorialBySlug",
    },
  },

  posts: {
    id: "posts",
    category: "content",
    collection: "posts",
    routeSegments: {
      en: "posts",
      es: "publicaciones",
    },
    templates: {
      list: "ContentList",
      detail: "ContentDetail",
      pagination: "ContentPagination",
    },
    features: {
      hasPagination: true,
      hasRSS: false,
      itemsPerPage: PAGINATION_CONFIG.posts,
      showRelated: true,
      searchable: true,
    },
    seo: {
      schemaType: "BlogPosting",
      generateItemList: true,
      descriptionKey: "pages.postsDescription",
    },
    dataLoaders: {
      getAll: "getAllPostsForLanguage",
      getBySlug: "getPostBySlug",
    },
  },

  // =================================================================
  // TAXONOMIES (authors, publishers, genres, etc.)
  // =================================================================

  authors: {
    id: "authors",
    category: "taxonomy",
    collection: "authors",
    routeSegments: {
      en: "authors",
      es: "autores",
    },
    templates: {
      list: "TaxonomyListGrouped",
      detail: "TaxonomyDetail",
    },
    features: {
      hasPagination: false,
      hasRSS: false,
      showRelated: false,
      searchable: true,
    },
    seo: {
      schemaType: "Person",
      generateItemList: false,
      descriptionKey: "pages.authorsDescription",
    },
    dataLoaders: {
      getAll: "getAllAuthorsForLanguage",
      getBySlug: "getAuthorBySlug",
    },
  },

  publishers: {
    id: "publishers",
    category: "taxonomy",
    collection: "publishers",
    routeSegments: {
      en: "publishers",
      es: "editoriales",
    },
    templates: {
      list: "TaxonomyListGrouped",
      detail: "TaxonomyDetail",
    },
    features: {
      hasPagination: false,
      hasRSS: false,
      showRelated: false,
      searchable: true,
    },
    seo: {
      schemaType: "Organization",
      generateItemList: false,
      descriptionKey: "pages.publishersDescription",
    },
    dataLoaders: {
      getAll: "getAllPublishersForLanguage",
      getBySlug: "getPublisherBySlug",
    },
  },

  genres: {
    id: "genres",
    category: "taxonomy",
    collection: "genres",
    routeSegments: {
      en: "genres",
      es: "generos",
    },
    templates: {
      list: "TaxonomyListGrouped",
      detail: "TaxonomyDetail",
    },
    features: {
      hasPagination: false,
      hasRSS: false,
      showRelated: false,
      searchable: true,
    },
    seo: {
      schemaType: "Thing",
      generateItemList: false,
      descriptionKey: "pages.genresDescription",
    },
    dataLoaders: {
      getAll: "getAllGenresForLanguage",
      getBySlug: "getGenreBySlug",
    },
  },

  categories: {
    id: "categories",
    category: "taxonomy",
    collection: "categories",
    routeSegments: {
      en: "categories",
      es: "categorias",
    },
    templates: {
      list: "TaxonomyListGrouped",
      detail: "TaxonomyDetail",
    },
    features: {
      hasPagination: false,
      hasRSS: false,
      showRelated: false,
      searchable: true,
    },
    seo: {
      schemaType: "Thing",
      generateItemList: false,
      descriptionKey: "pages.categoriesDescription",
    },
    dataLoaders: {
      getAll: "getAllCategoriesForLanguage",
      getBySlug: "getCategoryBySlug",
    },
  },

  series: {
    id: "series",
    category: "taxonomy",
    collection: "series",
    routeSegments: {
      en: "series",
      es: "series",
    },
    templates: {
      list: "TaxonomyListGrouped",
      detail: "TaxonomyDetail",
    },
    features: {
      hasPagination: false,
      hasRSS: false,
      showRelated: false,
      searchable: true,
    },
    seo: {
      schemaType: "Thing",
      generateItemList: false,
      descriptionKey: "pages.seriesDescription",
    },
    dataLoaders: {
      getAll: "getAllSeriesForLanguage",
      getBySlug: "getSeriesBySlug",
    },
  },

  challenges: {
    id: "challenges",
    category: "taxonomy",
    collection: "challenges",
    routeSegments: {
      en: "challenges",
      es: "retos",
    },
    templates: {
      list: "TaxonomyListGrouped",
      detail: "TaxonomyDetail",
    },
    features: {
      hasPagination: false,
      hasRSS: false,
      showRelated: false,
      searchable: true,
    },
    seo: {
      schemaType: "Thing",
      generateItemList: false,
      descriptionKey: "pages.challengesDescription",
    },
    dataLoaders: {
      getAll: "getAllChallengesForLanguage",
      getBySlug: "getChallengeBySlug",
    },
  },

  courses: {
    id: "courses",
    category: "taxonomy",
    collection: "courses",
    routeSegments: {
      en: "courses",
      es: "cursos",
    },
    templates: {
      list: "TaxonomyListGrouped",
      detail: "TaxonomyDetail",
    },
    features: {
      hasPagination: false,
      hasRSS: false,
      showRelated: false,
      searchable: true,
    },
    seo: {
      schemaType: "Course",
      generateItemList: false,
      descriptionKey: "pages.coursesDescription",
    },
    dataLoaders: {
      getAll: "getAllCoursesForLanguage",
      getBySlug: "getCourseBySlug",
    },
  },
};

/**
 * Route Parser - Converts URL path to content type config
 *
 * @param lang - Language code (en, es)
 * @param routeSegment - First segment after language (e.g., "books", "libros")
 * @returns Content type config if found, null otherwise
 *
 * @example
 * parseRouteSegment("es", "libros") // Returns CONTENT_TYPES.books
 * parseRouteSegment("en", "books") // Returns CONTENT_TYPES.books
 * parseRouteSegment("es", "autores") // Returns CONTENT_TYPES.authors
 */
export function parseRouteSegment(lang: Language, routeSegment: string): ContentTypeConfig | null {
  for (const config of Object.values(CONTENT_TYPES)) {
    if (config.routeSegments[lang] === routeSegment) {
      return config;
    }
  }
  return null;
}

/**
 * Get localized route segment for a content type
 *
 * @param contentTypeId - Content type ID (e.g., "books", "authors")
 * @param lang - Language code
 * @returns Localized route segment
 *
 * @example
 * getRouteSegment("books", "es") // "libros"
 * getRouteSegment("books", "en") // "books"
 * getRouteSegment("authors", "es") // "autores"
 */
export function getRouteSegment(contentTypeId: string, lang: Language): string {
  const config = CONTENT_TYPES[contentTypeId];
  if (!config) {
    routingLogger.warn(`Unknown content type: ${contentTypeId}`);
    return contentTypeId;
  }
  return config.routeSegments[lang] || contentTypeId;
}

/**
 * Get content type config by ID
 *
 * @param contentTypeId - Content type ID
 * @returns Content type config if found, null otherwise
 */
export function getContentTypeConfig(contentTypeId: string): ContentTypeConfig | null {
  return CONTENT_TYPES[contentTypeId] || null;
}

/**
 * Get all content type IDs
 *
 * @returns Array of all content type IDs
 */
export function getAllContentTypeIds(): string[] {
  return Object.keys(CONTENT_TYPES);
}

/**
 * Get content types by category
 *
 * @param category - Content category filter
 * @returns Array of content type configs matching the category
 */
export function getContentTypesByCategory(category: ContentCategory): ContentTypeConfig[] {
  return Object.values(CONTENT_TYPES).filter((config) => config.category === category);
}

/**
 * Check if a content type has a specific feature
 *
 * @param contentTypeId - Content type ID
 * @param feature - Feature name to check
 * @returns True if feature is enabled, false otherwise
 */
export function hasFeature(contentTypeId: string, feature: keyof ContentTypeConfig["features"]): boolean {
  const config = CONTENT_TYPES[contentTypeId];
  if (!config) return false;
  return Boolean(config.features[feature]);
}

/**
 * Validate route configuration at build time
 * Throws error if configuration is invalid
 */
export function validateRouteConfig(): void {
  const errors: string[] = [];

  for (const [id, config] of Object.entries(CONTENT_TYPES)) {
    // Check ID matches
    if (config.id !== id) {
      errors.push(`Config ID mismatch: key="${id}" but config.id="${config.id}"`);
    }

    // Check route segments exist for both languages
    if (!config.routeSegments.en || !config.routeSegments.es) {
      errors.push(`Missing route segments for ${id}`);
    }

    // Check at least one template is defined
    const hasTemplate = Object.values(config.templates).some((t) => t !== undefined);
    if (!hasTemplate) {
      errors.push(`No templates defined for ${id}`);
    }

    // Check pagination config
    if (config.features.hasPagination && !config.features.itemsPerPage) {
      errors.push(`Pagination enabled but itemsPerPage not set for ${id}`);
    }

    // Check RSS config
    if (config.features.hasRSS && !config.templates.rss) {
      errors.push(`RSS enabled but no RSS template for ${id}`);
    }

    // Check collection for content/taxonomy types
    if (config.category !== "static" && !config.collection) {
      errors.push(`No collection defined for ${config.category} type: ${id}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Route configuration validation failed:\n${errors.join("\n")}`);
  }

  routingLogger.info("✅ Configuration validated successfully");
}

/**
 * Special route segments (not content types)
 * These handle things like pagination, about pages, etc.
 */
export const SPECIAL_SEGMENTS: Record<string, Record<Language, string>> = {
  page: {
    en: "page",
    es: "pagina",
  },
  about: {
    en: "about",
    es: "acerca-de",
  },
  feeds: {
    en: "feeds",
    es: "feeds",
  },
};

/**
 * Get special route segment
 *
 * @param segment - Special segment key
 * @param lang - Language code
 * @returns Localized special segment
 */
export function getSpecialSegment(segment: string, lang: Language): string {
  return SPECIAL_SEGMENTS[segment]?.[lang] || segment;
}

/**
 * Check if a segment is a special segment
 *
 * @param segment - Segment to check
 * @param lang - Language code
 * @returns True if segment is a special segment
 */
export function isSpecialSegment(segment: string, lang: Language): boolean {
  return Object.values(SPECIAL_SEGMENTS).some((translations) => translations[lang] === segment);
}
