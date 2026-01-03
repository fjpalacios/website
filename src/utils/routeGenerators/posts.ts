/**
 * Route Generator: Posts (Mixed Content)
 *
 * Generates routes for the Posts feed, which is a special case that combines
 * three different content types into a single chronological feed:
 * - Blog posts (type: "post")
 * - Tutorial articles (type: "tutorial")
 * - Book reviews (type: "book")
 *
 * This generator is separate from contentTypeWithPagination because:
 * 1. It combines multiple content types with different schemas
 * 2. Each item needs dynamic Schema.org type mapping (BlogPosting, TechArticle, Book)
 * 3. Each item needs dynamic route segment mapping based on its type
 * 4. The feed shows mixed content sorted chronologically
 *
 * Route Structure:
 * - List Page: /en/posts → First page of mixed content
 * - Pagination: /en/posts/page/2 → Subsequent pages
 * - Detail: /en/posts/my-post → Individual post detail (posts collection only)
 *
 * Note: Book and tutorial details are accessed via their own routes
 * (e.g., /en/books/my-book, /en/tutorials/my-tutorial)
 *
 * @module routeGenerators/posts
 */

import { getRouteSegment } from "@/config/routeSegments";
import { SCHEMA_TYPES } from "@/types/schema";
import { paginateItems, getPageCount } from "@/utils/blog";
import { getCachedCollection } from "@/utils/cache/cachedLoaders";
import { getAllContentForLanguage, POSTS_PER_PAGE, generatePostDetailPaths } from "@/utils/postsPages";
import { generateItemListSchema } from "@/utils/schemas/itemList";

/**
 * Maps content type to Schema.org type and route segment
 * Used for mixed content where each item can be a different type
 */
const CONTENT_TYPE_MAPPING = {
  book: {
    schemaType: SCHEMA_TYPES.BOOK,
    routeKey: "books" as const,
  },
  tutorial: {
    schemaType: SCHEMA_TYPES.TECH_ARTICLE,
    routeKey: "tutorials" as const,
  },
  post: {
    schemaType: SCHEMA_TYPES.BLOG_POSTING,
    routeKey: "posts" as const,
  },
} as const;

/**
 * Get content type mapping for schema generation
 *
 * @param contentType - The content type from post data
 * @returns Schema type and route key for the content
 */
function getContentTypeMapping(contentType: string) {
  return CONTENT_TYPE_MAPPING[contentType as keyof typeof CONTENT_TYPE_MAPPING] || CONTENT_TYPE_MAPPING.post;
}

export interface GeneratedPath {
  params: { lang: string; route: string };
  props: Record<string, unknown>;
}

/**
 * Configuration for posts route generation
 */
export interface PostsGeneratorConfig {
  /** Current language code (e.g., 'en', 'es') */
  lang: string;

  /** Target language for checking if translations exist */
  targetLang: string;

  /** Contact information for the current language */
  contact: unknown;
}

/**
 * Generate all routes for the Posts feed (mixed content)
 *
 * This generator creates three types of routes:
 * 1. **List Page** (page 1): Shows first N items from mixed feed with Schema.org ItemList
 * 2. **Pagination Pages** (page 2+): Shows subsequent N items per page
 * 3. **Detail Pages**: Individual pages for posts collection entries only
 *
 * Generation Process:
 * 1. Fetch all content (posts + tutorials + books) for current and target languages
 * 2. Combine and sort chronologically (newest first)
 * 3. Calculate total pages needed
 * 4. Generate list page with mixed Schema.org types
 * 5. Generate pagination pages
 * 6. Generate detail pages for posts collection only
 *
 * Schema Mapping:
 * - Books → Schema.org "Book"
 * - Tutorials → Schema.org "TechArticle"
 * - Posts → Schema.org "BlogPosting"
 *
 * Caching:
 * Uses build cache for content fetching to avoid duplicate queries.
 *
 * @param config - Posts generation configuration
 * @returns Array of generated route paths (list + pagination + post details)
 *
 * @example
 * ```ts
 * const postsRoutes = await generatePostsRoutes({
 *   lang: 'en',
 *   targetLang: 'es',
 *   contact: contactEn
 * });
 * // Returns: [list page, pagination pages..., post detail pages...]
 * ```
 */
export async function generatePostsRoutes(config: PostsGeneratorConfig): Promise<GeneratedPath[]> {
  const { lang, targetLang, contact } = config;

  const paths: GeneratedPath[] = [];

  const routeSegment = getRouteSegment("posts", lang);
  const pageSegment = getRouteSegment("page", lang);

  // ⚡ Performance: Fetch both languages in parallel using cached loaders
  const [sortedContent, targetContent] = await Promise.all([
    getCachedCollection("posts", lang, getAllContentForLanguage),
    getCachedCollection("posts", targetLang, getAllContentForLanguage),
  ]);

  const hasTargetContent = targetContent.length > 0;
  const totalPages = getPageCount(sortedContent.length, POSTS_PER_PAGE);

  // 1. LIST PAGE (page 1)
  const posts = paginateItems(sortedContent, 1, POSTS_PER_PAGE);

  // Generate ItemList schema for mixed content
  // Each item gets its appropriate Schema.org type and route
  const itemListSchema = generateItemListSchema(
    posts.map((post) => {
      // Use mapping helper to get schema type and route key
      const { schemaType, routeKey } = getContentTypeMapping(post.type);
      const localizedRouteSegment = getRouteSegment(routeKey, lang);

      return {
        name: post.title,
        url: `/${lang}/${localizedRouteSegment}/${post.slug}/`,
        type: schemaType,
        description: post.excerpt,
      };
    }),
    "https://fjp.es",
  );

  paths.push({
    params: { lang, route: routeSegment },
    props: {
      contentType: "posts",
      pageType: "list",
      lang,
      posts,
      currentPage: 1,
      totalPages,
      itemListSchema,
      contact,
      hasTargetContent,
    },
  });

  // 2. PAGINATION PAGES (page 2+)
  for (let page = 2; page <= totalPages; page++) {
    const paginatedPosts = paginateItems(sortedContent, page, POSTS_PER_PAGE);

    paths.push({
      params: { lang, route: `${routeSegment}/${pageSegment}/${page}` },
      props: {
        contentType: "posts",
        pageType: "pagination",
        lang,
        posts: paginatedPosts,
        currentPage: page,
        totalPages,
        contact,
        hasTargetContent,
      },
    });
  }

  // 3. DETAIL PAGES (only for "posts" collection, not books/tutorials)
  // Books and tutorials have their own detail routes
  const postDetailPaths = await generatePostDetailPaths(lang, contact);

  for (const { slug, props } of postDetailPaths) {
    paths.push({
      params: { lang, route: `${routeSegment}/${slug}` },
      props: {
        contentType: "posts",
        pageType: "detail",
        ...props,
        hasTargetContent,
      },
    });
  }

  return paths;
}
