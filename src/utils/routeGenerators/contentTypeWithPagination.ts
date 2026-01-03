/**
 * Route Generator: Content Types with Pagination
 *
 * Generates routes for content types that support pagination and have both
 * list pages and individual detail pages.
 *
 * Route Structure:
 * - List Page (page 1): /en/books → First 10 items
 * - Pagination Pages: /en/books/page/2 → Next 10 items
 * - Detail Pages: /en/books/my-book → Individual item page
 *
 * Supported Content Types:
 * - Books: Book reviews with metadata (author, publisher, genre, etc.)
 * - Tutorials: Technical articles organized by categories and courses
 * - Posts: Mixed content feed (books + tutorials combined, chronological)
 *
 * Key Features:
 * - Automatic pagination based on configurable items-per-page
 * - Schema.org ItemList generation for SEO
 * - Translation availability detection
 * - Build-time caching to avoid duplicate queries
 * - Parallel fetching of current and target language content
 *
 * Performance Optimizations:
 * - Uses build cache to avoid duplicate content fetching
 * - Parallel fetching of current and target language content
 * - All collection queries are cached at build time
 *
 * @module routeGenerators/contentTypeWithPagination
 */

import { type SchemaType } from "@/types/schema";
import { paginateItems, getPageCount } from "@/utils/blog";
import { getCachedCollection } from "@/utils/cache/cachedLoaders";
import { generateItemListSchema } from "@/utils/schemas/itemList";

/**
 * Configuration for content type route generation with pagination support
 */
export interface ContentTypeWithPaginationConfig<T> {
  /** Current language code (e.g., 'en', 'es') */
  lang: string;

  /** Target language for checking if translations exist */
  targetLang: string;

  /** Localized route segment (e.g., 'books' in EN, 'libros' in ES) */
  routeSegment: string;

  /** Localized pagination segment (e.g., 'page' in EN, 'pagina' in ES) */
  pageSegment: string;

  /** Content type identifier (e.g., 'books', 'tutorials', 'posts') */
  contentType: string;

  /** Function to fetch all items for the current language */
  getAllItems: (lang: string) => Promise<T[]>;

  /** Number of items to display per page (e.g., 10 for books, 20 for posts) */
  itemsPerPage: number;

  /** Function to generate detail page routes for individual items */
  generateDetailPaths: (
    lang: string,
    contact: unknown,
  ) => Promise<Array<{ slug: string; props: Record<string, unknown> }>>;

  /** Contact information for the current language */
  contact: unknown;

  /** Schema.org type for ItemList schema (used for SEO) */
  schemaType: SchemaType;

  /** Function to extract necessary data from each item for schema generation */
  extractItemData: (item: T) => { name: string; slug: string; excerpt: string };
}

export interface GeneratedPath {
  params: { lang: string; route: string };
  props: Record<string, unknown>;
}

/**
 * Generate all routes for a content type with pagination support
 *
 * This generator creates three types of routes:
 * 1. **List Page** (page 1): Shows first N items with Schema.org ItemList
 * 2. **Pagination Pages** (page 2+): Shows subsequent N items per page
 * 3. **Detail Pages**: Individual pages for each content item
 *
 * Generation Process:
 * 1. Fetch content for current and target languages (parallel, cached)
 * 2. Calculate total pages needed based on item count
 * 3. Generate list page with Schema.org markup
 * 4. Generate pagination pages (if total pages > 1)
 * 5. Generate detail pages using provided generator function
 *
 * Caching Strategy:
 * All content fetching uses the build cache to avoid duplicate queries.
 * The cache key format is `collection:{contentType}:{lang}`.
 *
 * @param config - Content type configuration with pagination settings
 * @returns Array of generated route paths (list + pagination + details)
 *
 * @example
 * ```ts
 * const bookRoutes = await generateContentTypeWithPaginationRoutes({
 *   lang: 'en',
 *   targetLang: 'es',
 *   routeSegment: 'books',
 *   pageSegment: 'page',
 *   contentType: 'books',
 *   getAllItems: getAllBooksForLanguage,
 *   itemsPerPage: 10,
 *   generateDetailPaths: generateBookDetailPaths,
 *   contact: contactEn,
 *   schemaType: 'Book',
 *   extractItemData: (book) => ({ name: book.title, slug: book.slug, excerpt: book.excerpt })
 * });
 * // Returns: [list page, pagination pages..., detail pages...]
 * ```
 */
export async function generateContentTypeWithPaginationRoutes<T>(
  config: ContentTypeWithPaginationConfig<T>,
): Promise<GeneratedPath[]> {
  const {
    lang,
    targetLang,
    routeSegment,
    pageSegment,
    contentType,
    getAllItems,
    itemsPerPage,
    generateDetailPaths,
    contact,
    schemaType,
    extractItemData,
  } = config;

  const paths: GeneratedPath[] = [];

  // ⚡ Performance: Fetch both languages in parallel using cached loaders
  const [sortedItems, targetItems] = await Promise.all([
    getCachedCollection(contentType, lang, getAllItems),
    getCachedCollection(contentType, targetLang, getAllItems),
  ]);

  const hasTargetContent = targetItems.length > 0;
  const totalPages = getPageCount(sortedItems.length, itemsPerPage);

  // 1. LIST PAGE (page 1)
  const items = paginateItems(sortedItems, 1, itemsPerPage);
  const itemListSchema = generateItemListSchema(
    items.map((item) => {
      const { name, slug, excerpt } = extractItemData(item);
      return {
        name,
        url: `/${lang}/${routeSegment}/${slug}/`,
        type: schemaType,
        description: excerpt,
      };
    }),
    "https://fjp.es",
  );

  paths.push({
    params: { lang, route: routeSegment },
    props: {
      contentType,
      pageType: "list",
      lang,
      [contentType]: items, // Dynamic key: books, tutorials, or posts
      currentPage: 1,
      totalPages,
      itemListSchema,
      contact,
      hasTargetContent,
    },
  });

  // 2. PAGINATION PAGES (page 2+)
  for (let page = 2; page <= totalPages; page++) {
    const paginatedItems = paginateItems(sortedItems, page, itemsPerPage);

    paths.push({
      params: { lang, route: `${routeSegment}/${pageSegment}/${page}` },
      props: {
        contentType,
        pageType: "pagination",
        lang,
        [contentType]: paginatedItems, // Dynamic key
        currentPage: page,
        totalPages,
        contact,
        hasTargetContent,
      },
    });
  }

  // 3. DETAIL PAGES
  const detailPaths = await generateDetailPaths(lang, contact);

  for (const { slug, props } of detailPaths) {
    // Calculate hasTargetContent for THIS specific entry
    // Check if this entry has an i18n field and if that translation exists in target language
    const entryKey = Object.keys(props).find((k) => k.endsWith("Entry")) || "";
    const entry = props[entryKey] as { data?: { i18n?: string } } | undefined;
    const hasSpecificTranslation = entry?.data?.i18n
      ? targetItems.some((item: { slug: string }) => item.slug === entry.data.i18n)
      : false;

    paths.push({
      params: { lang, route: `${routeSegment}/${slug}` },
      props: {
        contentType,
        pageType: "detail",
        lang,
        ...props,
        hasTargetContent: hasSpecificTranslation,
      },
    });
  }

  return paths;
}
