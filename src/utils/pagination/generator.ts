/**
 * Generic pagination generator for Astro static paths
 * Consolidates duplicate pagination logic from booksPages, tutorialsPages, and postsPages
 */

import type { ContactItem } from "@/types/content";
import { getPageCount } from "@/utils/blog";

/**
 * Options for generating pagination paths
 */
export interface PaginationPathsOptions<T> {
  /** Array of items to paginate */
  items: T[];
  /** Number of items per page */
  itemsPerPage: number;
  /** Language code (es/en) */
  lang: string;
  /** Contact information */
  contact: ContactItem[];
  /** Key name for items in props (e.g., 'books', 'tutorials', 'posts') */
  itemsKey: string;
}

/**
 * Result of pagination path generation
 */
export interface PaginationPath<T> {
  page: string;
  props: {
    lang: string;
    currentPage: number;
    totalPages: number;
    contact: ContactItem[];
    [key: string]: T[] | string | number | ContactItem[];
  };
}

/**
 * Generate static paths for pagination pages (page 2+)
 * Page 1 is typically the index page and handled separately
 *
 * @param options - Configuration for pagination generation
 * @returns Array of pagination paths for Astro getStaticPaths()
 *
 * @example
 * ```ts
 * const books = await getAllBooksForLanguage('es');
 * const paths = generatePaginationPaths({
 *   items: books,
 *   itemsPerPage: 12,
 *   lang: 'es',
 *   contact: contactData,
 *   itemsKey: 'books'
 * });
 * ```
 */
export function generatePaginationPaths<T>(options: PaginationPathsOptions<T>): PaginationPath<T>[] {
  const { items, itemsPerPage, lang, contact, itemsKey } = options;

  const totalPages = getPageCount(items.length, itemsPerPage);
  const paths: PaginationPath<T>[] = [];

  // Generate paths for each page (starting from page 2)
  // Page 1 is the index and handled separately
  for (let page = 2; page <= totalPages; page++) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    paths.push({
      page: page.toString(),
      props: {
        lang,
        [itemsKey]: items.slice(start, end),
        currentPage: page,
        totalPages,
        contact,
      },
    });
  }

  return paths;
}

/**
 * Options for generating detail paths
 */
export interface DetailPathsOptions<T> {
  /** Collection entries to generate paths for */
  entries: T[];
  /** Language code (es/en) */
  lang: string;
  /** Contact information */
  contact: ContactItem[];
  /** Key name for entry in props (e.g., 'bookEntry', 'tutorialEntry', 'postEntry') */
  entryKey: string;
}

/**
 * Result of detail path generation
 */
export interface DetailPath<T> {
  slug: string;
  props: {
    lang: string;
    contact: ContactItem[];
    [key: string]: T | string | ContactItem[];
  };
}

/**
 * Generate static paths for detail pages
 * Filters entries by language and creates a path for each entry
 *
 * @param options - Configuration for detail path generation
 * @returns Array of detail paths for Astro getStaticPaths()
 *
 * @example
 * ```ts
 * const books = await getCollection('books');
 * const paths = generateDetailPaths({
 *   entries: books,
 *   lang: 'es',
 *   contact: contactData,
 *   entryKey: 'bookEntry'
 * });
 * ```
 */
export function generateDetailPaths<T extends { data: { language: string; post_slug: string } }>(
  options: DetailPathsOptions<T>,
): DetailPath<T>[] {
  const { entries, lang, contact, entryKey } = options;

  // Filter by language
  const langEntries = entries.filter((entry) => entry.data.language === lang);

  // Map to detail paths
  return langEntries.map((entry) => ({
    slug: entry.data.post_slug,
    props: {
      [entryKey]: entry,
      lang,
      contact,
    },
  }));
}
