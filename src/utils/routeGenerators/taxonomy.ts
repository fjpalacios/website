/**
 * Route Generator: Taxonomy Pages
 *
 * Generates routes for taxonomy types that organize content by metadata.
 * Each taxonomy has:
 * - List page: Shows all taxonomy items with content counts
 * - Detail pages: Show all content related to a specific taxonomy item (with pagination)
 *
 * Taxonomy Types:
 * - Authors: Book and tutorial authors
 * - Publishers: Book publishers
 * - Genres: Book genres (Fiction, Mystery, etc.)
 * - Categories: Post/tutorial categories (Programming, DevOps, etc.)
 * - Series: Book series
 * - Challenges: Reading challenges
 * - Courses: Tutorial courses
 *
 * Route Examples:
 * - List: /en/authors → Shows all authors with book counts
 * - Detail: /en/authors/stephen-king → Shows all Stephen King's books
 * - Detail Paginated: /en/authors/stephen-king/page/2 → Page 2 of Stephen King's books
 *
 * @module routeGenerators/taxonomy
 */

import type { TaxonomyConfig } from "@/utils/taxonomyPages";
import {
  getTaxonomyItemsWithCount,
  hasTargetContent as checkHasTargetContent,
  generateTaxonomyDetailPaths,
} from "@/utils/taxonomyPages";

/**
 * Configuration for taxonomy route generation
 */
export interface TaxonomyGeneratorConfig {
  /** Taxonomy configuration containing collection name and related content fetchers */
  taxonomyConfig: TaxonomyConfig;

  /** Current language code (e.g., 'en', 'es') */
  lang: string;

  /** Target language for checking if translations exist */
  targetLang: string;

  /** Localized route segment (e.g., 'authors' in EN, 'autores' in ES) */
  routeSegment: string;

  /** Content type identifier matching the taxonomy (e.g., 'authors', 'publishers') */
  contentType: string;

  /** Contact information for the current language */
  contact: unknown;

  /** Property key name for passing taxonomy items to templates (e.g., 'authorsWithCounts') */
  itemsPropsKey: string;
}

export interface GeneratedPath {
  params: { lang: string; route: string };
  props: Record<string, unknown>;
}

/**
 * Generate all routes for a taxonomy type
 *
 * Process:
 * 1. Fetch all taxonomy items with content counts
 * 2. Filter out items with zero content
 * 3. Generate list page showing all items
 * 4. Generate detail pages for each item (with pagination if needed)
 *
 * Performance Note:
 * This function is called in parallel with other content types during build.
 * It uses the taxonomy config's efficient content counting methods.
 *
 * @param config - Taxonomy generation configuration
 * @returns Array of generated route paths with params and props
 *
 * @example
 * ```ts
 * const authorRoutes = await generateTaxonomyRoutes({
 *   taxonomyConfig: TAXONOMY_CONFIGS.authors,
 *   lang: 'en',
 *   targetLang: 'es',
 *   routeSegment: 'authors',
 *   contentType: 'authors',
 *   contact: contactEn,
 *   itemsPropsKey: 'authorsWithCounts'
 * });
 * // Returns: [list page, detail page 1, detail page 2, ...]
 * ```
 */
export async function generateTaxonomyRoutes(config: TaxonomyGeneratorConfig): Promise<GeneratedPath[]> {
  const { taxonomyConfig, lang, targetLang, routeSegment, contentType, contact, itemsPropsKey } = config;

  const paths: GeneratedPath[] = [];

  // Fetch all taxonomy items and count their related content
  const itemsData = await getTaxonomyItemsWithCount(taxonomyConfig, lang);

  // Only include items that have at least one piece of content
  // Sort alphabetically by name for consistent ordering
  const itemsWithContent = itemsData
    .filter(({ count }) => count > 0)
    .sort((a, b) => a.item.data.name.localeCompare(b.item.data.name));

  // Check if target language has any content for translation links
  const hasTargetContent = await checkHasTargetContent(taxonomyConfig, targetLang);

  // 1. LIST PAGE (no pagination, shows all items)
  paths.push({
    params: { lang, route: routeSegment },
    props: {
      contentType,
      pageType: "list",
      lang,
      itemsWithContent,
      contact,
      hasTargetContent,
    },
  });

  // 2. DETAIL PAGES (with pagination for related content)
  const detailPaths = await generateTaxonomyDetailPaths(taxonomyConfig, lang, contact);

  for (const { slug, props } of detailPaths) {
    // Add taxonomy items to props for sidebar
    const enhancedProps = {
      ...props,
      [itemsPropsKey]: itemsWithContent,
    };

    paths.push({
      params: { lang, route: `${routeSegment}/${slug}` },
      props: {
        contentType,
        pageType: "detail",
        ...enhancedProps,
      },
    });
  }

  return paths;
}
