import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

import { PAGINATION_CONFIG } from "@/config/pagination";
import type { ContactItem } from "@/types/content";
import { filterByLanguage, prepareBookSummary, preparePostSummary, prepareTutorialSummary } from "@/utils/blog";
import type { BookSummary, PostSummary } from "@/utils/blog";
import { extractContentDate } from "@/utils/content-date";

export const ITEMS_PER_PAGE = PAGINATION_CONFIG.taxonomy;

/**
 * Generic taxonomy configuration
 */
export interface TaxonomyConfig {
  collection: "categories" | "genres" | "publishers" | "authors" | "series" | "challenges" | "courses";
  slugField: string; // e.g., "category_slug", "genre_slug", etc.
  contentCollections: Array<"posts" | "tutorials" | "books">; // Which content types use this taxonomy
  contentField: string; // Field name in content that references this taxonomy (e.g., "categories", "genres")
  isSingular?: boolean; // If true, content has a single value instead of array (e.g., author, publisher)
}

/**
 * Taxonomy configurations for each type
 */
export const TAXONOMY_CONFIGS: Record<string, TaxonomyConfig> = {
  categories: {
    collection: "categories",
    slugField: "category_slug",
    contentCollections: ["posts", "tutorials", "books"],
    contentField: "categories",
  },
  genres: {
    collection: "genres",
    slugField: "genre_slug",
    contentCollections: ["books"],
    contentField: "genres",
  },
  publishers: {
    collection: "publishers",
    slugField: "publisher_slug",
    contentCollections: ["books"],
    contentField: "publisher",
    isSingular: true,
  },
  authors: {
    collection: "authors",
    slugField: "author_slug",
    contentCollections: ["books"],
    contentField: "author",
    isSingular: true,
  },
  series: {
    collection: "series",
    slugField: "series_slug",
    contentCollections: ["books"],
    contentField: "series",
    isSingular: true,
  },
  challenges: {
    collection: "challenges",
    slugField: "challenge_slug",
    contentCollections: ["books"],
    contentField: "challenges",
    isSingular: false,
  },
  courses: {
    collection: "courses",
    slugField: "course_slug",
    contentCollections: ["tutorials"],
    contentField: "course",
    isSingular: true,
  },
};

/**
 * Get all taxonomy items for a language
 */
export async function getAllTaxonomyItems(config: TaxonomyConfig, lang: string) {
  const items = await getCollection(config.collection);
  return filterByLanguage(items, lang);
}

/**
 * Get all content that uses a specific taxonomy
 */
export async function getAllContentForTaxonomy(config: TaxonomyConfig, lang: string) {
  const allContent: Array<CollectionEntry<"posts"> | CollectionEntry<"tutorials"> | CollectionEntry<"books">> = [];

  for (const collectionName of config.contentCollections) {
    const collection = await getCollection(collectionName);
    const filtered = filterByLanguage(collection, lang);
    allContent.push(...filtered);
  }

  return allContent;
}

/**
 * Count items for a taxonomy slug
 */
export function countItemsForTaxonomy(
  content: Array<CollectionEntry<"posts"> | CollectionEntry<"tutorials"> | CollectionEntry<"books">>,
  taxonomySlug: string,
  config: TaxonomyConfig,
): number {
  return content.filter((item) => {
    const value = item.data[config.contentField];
    if (config.isSingular) {
      return value === taxonomySlug;
    }
    return Array.isArray(value) && value.includes(taxonomySlug);
  }).length;
}

/**
 * Get taxonomy items with content count
 */
export async function getTaxonomyItemsWithCount(config: TaxonomyConfig, lang: string) {
  const taxonomyItems = await getAllTaxonomyItems(config, lang);
  const content = await getAllContentForTaxonomy(config, lang);

  return taxonomyItems.map((item) => {
    const slug = item.data[config.slugField];
    const count = countItemsForTaxonomy(content, slug, config);
    return { item, count };
  });
}

/**
 * Check if target language has content for this taxonomy
 */
export async function hasTargetContent(config: TaxonomyConfig, targetLang: string): Promise<boolean> {
  const targetItems = await getAllTaxonomyItems(config, targetLang);
  const targetContent = await getAllContentForTaxonomy(config, targetLang);

  return targetItems.some((item) => {
    const slug = item.data[config.slugField];
    const count = countItemsForTaxonomy(targetContent, slug, config);
    return count > 0;
  });
}

/**
 * Transform content to summary format
 */
export function prepareContentSummary(
  item: CollectionEntry<"posts"> | CollectionEntry<"tutorials"> | CollectionEntry<"books">,
): PostSummary | BookSummary {
  if (item.collection === "posts") {
    return preparePostSummary(item as CollectionEntry<"posts">);
  } else if (item.collection === "tutorials") {
    return prepareTutorialSummary(item as CollectionEntry<"tutorials">);
  } else {
    return prepareBookSummary(item as CollectionEntry<"books">);
  }
}

/**
 * Generate static paths for taxonomy detail pages
 */
export async function generateTaxonomyDetailPaths(config: TaxonomyConfig, lang: string, contact: ContactItem[]) {
  const taxonomyItems = await getAllTaxonomyItems(config, lang);
  const allContent = await getAllContentForTaxonomy(config, lang);

  // Get target language items to check if translation exists
  const targetLang = lang === "es" ? "en" : "es";
  const targetTaxonomyItems = await getAllTaxonomyItems(config, targetLang);
  const targetTaxonomySlugs = new Set(targetTaxonomyItems.map((item) => item.data[config.slugField]));

  const paths = [];

  for (const taxonomyItem of taxonomyItems) {
    const taxonomySlug = taxonomyItem.data[config.slugField];

    // Check if this taxonomy item exists in the target language
    // If item has i18n field, use it to find the translated slug
    // Otherwise, fall back to checking if the same slug exists in target language
    const translationSlug = taxonomyItem.data.i18n;
    const hasTargetContent = translationSlug
      ? targetTaxonomySlugs.has(translationSlug)
      : targetTaxonomySlugs.has(taxonomySlug);

    // Filter content by taxonomy
    const taxonomyContent = allContent.filter((item) => {
      const value = item.data[config.contentField];

      // Handle singular fields (e.g., author, publisher)
      if (config.isSingular) {
        return value === taxonomySlug;
      }

      // Handle plural fields (e.g., categories, genres)
      return Array.isArray(value) && value.includes(taxonomySlug);
    });

    // Sort content
    // For courses: sort by order field (ascending), then by date (descending) as fallback
    // For other taxonomies: sort by date (descending)
    taxonomyContent.sort((a, b) => {
      if (config.collection === "courses") {
        // If both have order field, sort by order ascending
        const orderA = a.collection === "tutorials" ? a.data.order : undefined;
        const orderB = b.collection === "tutorials" ? b.data.order : undefined;

        if (orderA !== undefined && orderB !== undefined) {
          return orderA - orderB;
        }

        // If only one has order, prioritize the one with order
        if (orderA !== undefined) return -1;
        if (orderB !== undefined) return 1;

        // If neither has order, fall back to date descending
      }

      // Default: sort by date descending
      const dateA = extractContentDate(a);
      const dateB = extractContentDate(b);
      return dateB.getTime() - dateA.getTime();
    });

    // Calculate total pages and items
    const totalItems = taxonomyContent.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Generate path for each page
    for (let page = 1; page <= Math.max(1, totalPages); page++) {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginatedContent = taxonomyContent.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      // Transform to summary format
      const transformedContent = paginatedContent.map(prepareContentSummary);

      paths.push({
        slug: taxonomySlug,
        page: page === 1 ? undefined : page.toString(),
        props: {
          taxonomyItem,
          content: transformedContent,
          currentPage: page,
          totalPages: Math.max(1, totalPages),
          totalItems, // Total items in taxonomy (across all pages)
          lang,
          contact,
          hasTargetContent, // Add this prop for language switcher
        },
      });
    }
  }

  return paths;
}
