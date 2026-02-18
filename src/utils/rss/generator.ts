/**
 * RSS Feed Generator
 * Provides reusable functions for generating RSS feeds across different content types
 */

import type { CollectionEntry } from "astro:content";

import { getDefaultLanguageCode, getUrlSegment } from "@/config/languages";
import type { LanguageKey } from "@/types";

/**
 * Configuration for RSS feed metadata
 */
export interface RSSFeedConfig {
  title: string;
  description: string;
  site: string;
  language?: LanguageKey;
}

/**
 * Configuration for individual RSS items
 */
export interface RSSItemConfig {
  title: string;
  pubDate: Date;
  description: string;
  link: string;
  customData?: string;
}

/**
 * RSS feed output structure
 */
export interface RSSFeedOutput {
  title: string;
  description: string;
  site: string;
  customData?: string;
  items: RSSItemConfig[];
}

/**
 * Content item type that can be in RSS feeds
 */
type ContentItem = CollectionEntry<"books"> | CollectionEntry<"posts"> | CollectionEntry<"tutorials">;

/**
 * Builds the correct URL for a content item based on its collection type and language
 *
 * @param item - Content item from Astro collections
 * @param lang - Language code (es or en)
 * @returns Relative URL path for the content item
 */
export function buildContentUrl(item: ContentItem, lang: LanguageKey): string {
  const slug = item.data.post_slug;
  const collection = item.collection;

  // Build URL pattern based on collection type using centralized config
  if (collection === "books") {
    return `/${lang}/${getUrlSegment(lang, "books")}/${slug}`;
  }

  if (collection === "tutorials") {
    return `/${lang}/${getUrlSegment(lang, "tutorials")}/${slug}`;
  }

  // Default to posts for any other collection type
  return `/${lang}/${getUrlSegment(lang, "posts")}/${slug}`;
}

/**
 * Generates RSS feed for a single collection filtered by language
 *
 * @param items - Collection items (books, posts, or tutorials)
 * @param config - RSS feed configuration with language filter
 * @returns RSS feed output structure
 */
export function generateSingleCollectionFeed(items: ContentItem[], config: RSSFeedConfig): RSSFeedOutput {
  const { title, description, site, language } = config;

  if (!language) {
    throw new Error("Language is required for single collection feed");
  }

  // Filter items by language and sort by date (newest first)
  const filteredItems = items
    .filter((item) => item.data.language === language)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return {
    title,
    description,
    site,
    customData: `<language>${language}</language>`,
    items: filteredItems.map((item) => ({
      title: item.data.title,
      pubDate: item.data.date,
      description: item.data.excerpt,
      link: buildContentUrl(item, language),
      customData: `<language>${language}</language>`,
    })),
  };
}

/**
 * Generates RSS feed combining multiple collections filtered by language
 *
 * @param collections - Array of collection arrays to combine
 * @param config - RSS feed configuration with language filter
 * @returns RSS feed output structure
 */
export function generateMultiCollectionFeed(collections: ContentItem[][], config: RSSFeedConfig): RSSFeedOutput {
  const { title, description, site, language } = config;

  if (!language) {
    throw new Error("Language is required for multi-collection feed");
  }

  // Combine all collections, filter by language, and sort by date
  const allContent = collections
    .flat()
    .filter((item) => item.data.language === language)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return {
    title,
    description,
    site,
    customData: `<language>${language}</language>`,
    items: allContent.map((item) => ({
      title: item.data.title,
      pubDate: item.data.date,
      description: item.data.excerpt,
      link: buildContentUrl(item, language),
      customData: `<language>${language}</language>`,
    })),
  };
}

/**
 * Generates bilingual RSS feed with all content regardless of language
 * Adds language prefix to titles (e.g., "[ES] Title")
 *
 * @param collections - Array of collection arrays to combine
 * @param config - RSS feed configuration (language is optional for bilingual)
 * @returns RSS feed output structure
 */
export function generateBilingualFeed(
  collections: ContentItem[][],
  config: Omit<RSSFeedConfig, "language">,
): RSSFeedOutput {
  const { title, description, site } = config;

  // Combine all collections and sort by date (no language filter)
  const allContent = collections
    .flat()
    .sort((a: ContentItem, b: ContentItem) => b.data.date.valueOf() - a.data.date.valueOf());

  return {
    title,
    description,
    site,
    // No customData at feed level for bilingual feeds
    items: allContent.map((item) => {
      const lang = (item.data.language || getDefaultLanguageCode()) as LanguageKey;

      return {
        title: `[${lang.toUpperCase()}] ${item.data.title}`,
        pubDate: item.data.date,
        description: item.data.excerpt,
        link: buildContentUrl(item, lang),
        customData: `<language>${lang}</language>`,
      };
    }),
  };
}

/**
 * Main RSS feed generator - delegates to appropriate specialized function
 *
 * @param options - Generation options
 * @param options.items - Single collection or array of collections
 * @param options.config - RSS feed configuration
 * @param options.bilingual - Whether to generate bilingual feed (default: false)
 * @returns RSS feed output structure
 */
export function generateRSSFeed(options: {
  items: ContentItem[] | ContentItem[][];
  config: RSSFeedConfig | Omit<RSSFeedConfig, "language">;
  bilingual?: boolean;
}): RSSFeedOutput {
  const { items, config, bilingual = false } = options;

  // Bilingual feed
  if (bilingual) {
    const collections = Array.isArray(items[0]) ? (items as ContentItem[][]) : [items as ContentItem[]];
    return generateBilingualFeed(collections, config);
  }

  // Single collection feed
  if (!Array.isArray(items[0])) {
    return generateSingleCollectionFeed(items as ContentItem[], config as RSSFeedConfig);
  }

  // Multi-collection feed
  return generateMultiCollectionFeed(items as ContentItem[][], config as RSSFeedConfig);
}
