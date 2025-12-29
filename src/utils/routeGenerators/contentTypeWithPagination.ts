/**
 * Route Generator: Content Types with Pagination
 *
 * Generates routes for content types that support:
 * - List page (e.g., /en/books)
 * - Pagination pages (e.g., /en/books/page/2)
 * - Detail pages (e.g., /en/books/my-book)
 *
 * Used by: Books, Tutorials, Posts
 *
 * Performance Optimizations:
 * - Uses build cache to avoid duplicate content fetching
 * - Parallel fetching of current and target language content
 */

import { paginateItems, getPageCount } from "@/utils/blog";
import { getCachedCollection } from "@/utils/cache/cachedLoaders";
import { generateItemListSchema } from "@/utils/schemas/itemList";

export interface ContentTypeWithPaginationConfig<T> {
  /** Current language (e.g., 'en', 'es') */
  lang: string;

  /** Target language for content availability check */
  targetLang: string;

  /** Route segment in current language (e.g., 'books', 'libros') */
  routeSegment: string;

  /** Page segment in current language (e.g., 'page', 'pagina') */
  pageSegment: string;

  /** Content type identifier (e.g., 'books', 'tutorials', 'posts') */
  contentType: string;

  /** Function to get all items for current language */
  getAllItems: (lang: string) => Promise<T[]>;

  /** Items per page */
  itemsPerPage: number;

  /** Function to generate detail paths */
  generateDetailPaths: (
    lang: string,
    contact: unknown,
  ) => Promise<Array<{ slug: string; props: Record<string, unknown> }>>;

  /** Contact data for current language */
  contact: unknown;

  /** Schema.org type for ItemList (e.g., 'Book', 'TechArticle', 'BlogPosting') */
  schemaType: "Book" | "TechArticle" | "BlogPosting";

  /** Function to extract item data for schema */
  extractItemData: (item: T) => { name: string; slug: string; excerpt: string };
}

export interface GeneratedPath {
  params: { lang: string; route: string };
  props: Record<string, unknown>;
}

/**
 * Generate all routes for a content type with pagination
 *
 * @param config Configuration object
 * @returns Array of generated paths
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
    paths.push({
      params: { lang, route: `${routeSegment}/${slug}` },
      props: {
        contentType,
        pageType: "detail",
        lang,
        ...props,
        hasTargetContent,
      },
    });
  }

  return paths;
}
