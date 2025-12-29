/**
 * Route Generator: Taxonomy Pages
 *
 * Generates routes for taxonomy types:
 * - List page (e.g., /en/authors)
 * - Detail pages with pagination (e.g., /en/authors/author-slug, /en/authors/author-slug/page/2)
 *
 * Used by: Authors, Publishers, Genres, Categories, Series, Challenges, Courses
 */

import type { TaxonomyConfig } from "@/utils/taxonomyPages";
import { getTaxonomyItemsWithCount, generateTaxonomyDetailPaths } from "@/utils/taxonomyPages";

export interface TaxonomyGeneratorConfig {
  /** Taxonomy configuration (from TAXONOMY_CONFIGS) */
  taxonomyConfig: TaxonomyConfig;

  /** Current language (e.g., 'en', 'es') */
  lang: string;

  /** Target language for content availability check */
  targetLang: string;

  /** Route segment in current language (e.g., 'authors', 'autores') */
  routeSegment: string;

  /** Content type identifier (e.g., 'authors', 'publishers') */
  contentType: string;

  /** Contact data for current language */
  contact: unknown;

  /** Props key for taxonomy items (e.g., 'authorsWithCounts', 'publishersWithCounts') */
  itemsPropsKey: string;
}

export interface GeneratedPath {
  params: { lang: string; route: string };
  props: Record<string, unknown>;
}

/**
 * Generate all routes for a taxonomy
 *
 * @param config Configuration object
 * @returns Array of generated paths
 */
export async function generateTaxonomyRoutes(config: TaxonomyGeneratorConfig): Promise<GeneratedPath[]> {
  const { taxonomyConfig, lang, targetLang, routeSegment, contentType, contact, itemsPropsKey } = config;

  const paths: GeneratedPath[] = [];

  // Get all taxonomy items with counts
  const itemsData = await getTaxonomyItemsWithCount(taxonomyConfig, lang);
  const itemsWithContent = itemsData
    .filter(({ count }) => count > 0)
    .sort((a, b) => a.item.data.name.localeCompare(b.item.data.name));

  // Check if target language has content
  const hasTargetContent = await hasTargetContent(taxonomyConfig, targetLang);

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
