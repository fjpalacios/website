/**
 * Route Configuration
 *
 * Centralized configuration for all route generation.
 * This eliminates repetitive code blocks in the router.
 *
 * Benefits:
 * - Single source of truth for route configuration
 * - Type-safe configuration
 * - Easy to add new content types
 * - Reduces router complexity by ~200 lines
 *
 * @module config/routeConfig
 */

import { SCHEMA_TYPES, type SchemaType } from "@/types/schema";
import { getAllBooksForLanguage, BOOKS_PER_PAGE, generateBookDetailPaths } from "@/utils/booksPages";
import { getAllTutorialsForLanguage, TUTORIALS_PER_PAGE, generateTutorialDetailPaths } from "@/utils/tutorialsPages";

/**
 * Content type configuration for routes with pagination
 */
export interface ContentTypeConfig {
  /** Content type identifier (matches Astro props) */
  contentType: string;
  /** Route key for i18n (e.g., "books", "tutorials") */
  routeKey: string;
  /** Function to get all items for a language */
  getAllItems: (lang: string) => Promise<Array<{ slug: string; title: string; excerpt: string }>>;
  /** Items per page for pagination */
  itemsPerPage: number;
  /** Function to generate detail page paths */
  generateDetailPaths: (
    lang: string,
    contact: unknown,
  ) => Promise<Array<{ slug: string; props: Record<string, unknown> }>>;
  /** Schema.org type for structured data */
  schemaType: SchemaType;
  /** Function to extract item data for schemas */
  extractItemData: (item: { title?: string; excerpt?: string; slug: string }) => {
    name: string;
    slug: string;
    excerpt: string;
  };
}

/**
 * Static page configuration
 */
export interface StaticPageConfig {
  /** Content type identifier */
  contentType: string;
  /** Route key for i18n */
  routeKey: string;
  /** Whether to load content from file */
  loadContent?: boolean;
  /** Content file path (if loadContent is true) */
  contentPath?: string;
}

/**
 * Configuration for content types with pagination
 *
 * These content types have:
 * - List page (e.g., /books)
 * - Pagination pages (e.g., /books/page/2)
 * - Detail pages (e.g., /books/my-book)
 */
export const CONTENT_TYPE_CONFIGS: Record<string, ContentTypeConfig> = {
  books: {
    contentType: "books",
    routeKey: "books",
    getAllItems: getAllBooksForLanguage,
    itemsPerPage: BOOKS_PER_PAGE,
    generateDetailPaths: generateBookDetailPaths,
    schemaType: SCHEMA_TYPES.BOOK,
    extractItemData: (book) => ({
      name: book.title || "",
      slug: book.slug,
      excerpt: book.excerpt || "",
    }),
  },
  tutorials: {
    contentType: "tutorials",
    routeKey: "tutorials",
    getAllItems: getAllTutorialsForLanguage,
    itemsPerPage: TUTORIALS_PER_PAGE,
    generateDetailPaths: generateTutorialDetailPaths,
    schemaType: SCHEMA_TYPES.TECH_ARTICLE,
    extractItemData: (tutorial) => ({
      name: tutorial.title || "",
      slug: tutorial.slug,
      excerpt: tutorial.excerpt || "",
    }),
  },
  // Note: Posts are handled separately due to mixed content complexity
};

/**
 * Configuration for static pages
 *
 * These pages have no pagination or dynamic content:
 * - About page
 * - Feeds page
 */
export const STATIC_PAGE_CONFIGS: Record<string, StaticPageConfig> = {
  about: {
    contentType: "about",
    routeKey: "about",
    loadContent: true,
    contentPath: "@content/{lang}/about.ts",
  },
  feeds: {
    contentType: "feeds",
    routeKey: "feeds",
    loadContent: false,
  },
};

/**
 * Taxonomy types that need route generation
 */
export const TAXONOMY_TYPES = [
  "authors",
  "publishers",
  "genres",
  "categories",
  "series",
  "challenges",
  "courses",
] as const;

export type TaxonomyType = (typeof TAXONOMY_TYPES)[number];

/**
 * Get content type configuration
 *
 * @param contentType - The content type to get config for
 * @returns Content type configuration or undefined
 */
export function getContentTypeConfig(contentType: string): ContentTypeConfig | undefined {
  return CONTENT_TYPE_CONFIGS[contentType];
}

/**
 * Get static page configuration
 *
 * @param contentType - The static page type to get config for
 * @returns Static page configuration or undefined
 */
export function getStaticPageConfig(contentType: string): StaticPageConfig | undefined {
  return STATIC_PAGE_CONFIGS[contentType];
}

/**
 * Check if a content type has pagination
 *
 * @param contentType - The content type to check
 * @returns True if content type has pagination
 */
export function hasPagination(contentType: string): boolean {
  return contentType in CONTENT_TYPE_CONFIGS || contentType === "posts";
}
