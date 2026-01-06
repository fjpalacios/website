/**
 * Collection utilities for blog content
 */

import type { LanguageKey } from "@/types";

export interface CollectionItem {
  id?: string; // Astro 5 uses id
  slug?: string; // Legacy property for compatibility
  data: {
    title: string;
    date: Date;
    language: LanguageKey;
  };
}

export interface GroupedByYear {
  year: number;
  items: CollectionItem[];
}

/**
 * Sort collection items by publish date
 *
 * @param items - Array of collection items
 * @param order - Sort order: 'asc' (oldest first) or 'desc' (newest first)
 * @returns Sorted array of items
 *
 * @example
 * sortByDate(items, 'desc') // Newest first (default)
 * sortByDate(items, 'asc') // Oldest first
 */
export function sortByDate<T extends CollectionItem>(items: T[], order: "asc" | "desc" = "desc"): T[] {
  if (order !== "asc" && order !== "desc") {
    throw new Error('Order must be "asc" or "desc"');
  }

  // Create a copy to avoid mutating original array
  const sorted = [...items];

  return sorted.sort((a, b) => {
    const dateA = a.data.date.getTime();
    const dateB = b.data.date.getTime();

    if (order === "desc") {
      return dateB - dateA; // Newest first
    } else {
      return dateA - dateB; // Oldest first
    }
  });
}

/**
 * Filter collection items by language
 *
 * @param items - Array of collection items
 * @param language - Target language
 * @returns Filtered array of items matching the language
 *
 * @example
 * filterByLanguage(items, 'es') // Only Spanish items
 * filterByLanguage(items, 'en') // Only English items
 */
export function filterByLanguage<T extends CollectionItem>(items: T[], language: LanguageKey): T[] {
  return items.filter((item) => item.data.language === language);
}

/**
 * Group collection items by year (sorted by year descending, items within year sorted by date descending)
 *
 * @param items - Array of collection items
 * @returns Array of objects with year and items
 *
 * @example
 * groupByYear(items)
 * // => [
 * //   { year: 2024, items: [...] },
 * //   { year: 2023, items: [...] }
 * // ]
 */
export function groupByYear(items: CollectionItem[]): GroupedByYear[] {
  if (items.length === 0) {
    return [];
  }

  // First, sort items by date descending
  const sortedItems = sortByDate(items, "desc");

  // Group by year
  const grouped = new Map<number, CollectionItem[]>();

  for (const item of sortedItems) {
    const year = item.data.date.getFullYear();

    if (!grouped.has(year)) {
      grouped.set(year, []);
    }

    grouped.get(year)!.push(item);
  }

  // Convert Map to array and sort by year descending
  return Array.from(grouped.entries())
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, items]) => ({ year, items }));
}
