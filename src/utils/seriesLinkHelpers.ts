/**
 * Helper utilities for SeriesLink component
 * Contains pure functions for series lookup
 */

import { buildSeriesUrl } from "@utils/routes";
import type { CollectionEntry } from "astro:content";

import type { LanguageKey } from "@/types";

/**
 * Detect language from URL pathname
 * @param pathname - URL pathname (e.g., "/en/series/harry-potter" or "/es/series/harry-potter")
 * @returns Detected language ("en" or "es"), defaults to "es" if not detected
 *
 * @example
 * detectLanguageFromUrl("/en/series/harry-potter") // "en"
 * detectLanguageFromUrl("/es/series/harry-potter") // "es"
 * detectLanguageFromUrl("/unknown/path") // "es" (default)
 */
export const detectLanguageFromUrl = (pathname: string): LanguageKey => {
  return pathname.startsWith("/en/") ? "en" : "es";
};

/**
 * Find a series by case-insensitive name match
 */
export const findSeries = (
  series: CollectionEntry<"series">[],
  name: string,
): CollectionEntry<"series"> | undefined => {
  const searchName = name.toLowerCase();
  return series.find((s) => s.data.name.toLowerCase() === searchName);
};

/**
 * Generate series URL if series exists
 */
export const generateSeriesUrl = (series: CollectionEntry<"series"> | undefined, lang: LanguageKey): string | null => {
  return series ? buildSeriesUrl(lang, series.data.series_slug) : null;
};
