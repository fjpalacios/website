/**
 * Navigation Configuration
 *
 * Centralized configuration for all site navigation (menu, footer, etc).
 * Provides granular control over visibility, language support, and content availability.
 *
 * This is the single source of truth for navigation structure across the entire site.
 *
 * @module config/navigation
 */

import { getLanguageCodes, type LanguageKey } from "@/config/languages";
import { buildLogger } from "@/utils/logger";

/**
 * Match strategy for determining if a navigation item is active
 * - "exact": Path must match exactly (for home, about)
 * - "prefix": Path must start with the route (for content pages with subpages)
 */
export type MatchStrategy = "exact" | "prefix";

/**
 * Valid route keys that can be used in navigation
 */
export type RouteKey =
  | "home"
  | "about"
  | "posts"
  | "tutorials"
  | "books"
  | "stats"
  | "feeds"
  | "categories"
  | "genres"
  | "publishers"
  | "series"
  | "challenges"
  | "authors"
  | "courses";

/**
 * Navigation item configuration
 *
 * Provides fine-grained control over where and how navigation items appear.
 */
export interface NavigationItem {
  /**
   * Unique identifier for the navigation item
   * Used for translation keys (e.g., t(lang, `pages.${id}`))
   */
  id: string;

  /**
   * Route key used to build the localized URL
   * - "home": Special case for home page (/)
   * - Other values: Passed to buildLocalizedPath() or used with i18n
   */
  routeKey: RouteKey;

  /**
   * Strategy for determining if this item is active based on current path
   */
  matchStrategy: MatchStrategy;

  /**
   * Languages where this section is available
   * If undefined, available in all languages
   * If defined, only shown in specified languages
   *
   * @default undefined (all languages)
   * @example ["es"] - Only Spanish
   * @example ["es", "en"] - Both languages
   */
  visibleIn?: LanguageKey[];

  /**
   * Whether to show this item in the main navigation menu
   * @default true
   */
  showInMenu?: boolean;

  /**
   * Whether to show this item in the footer navigation
   * @default true
   */
  showInFooter?: boolean;
}

/**
 * Main navigation items definition
 *
 * ORDER MATTERS - items will be displayed in this order in menus/footer.
 * This is the single source of truth for all site navigation.
 *
 * Configuration Guidelines:
 * - visibleIn: Restrict to specific languages (omit for all languages)
 * - showInMenu: false to hide from main menu (e.g., feeds, utility pages)
 * - showInFooter: false to hide from footer (e.g., home page)
 * - matchStrategy: "exact" for single pages, "prefix" for sections with subpages
 */
const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  {
    id: "home",
    routeKey: "home",
    matchStrategy: "exact",
    showInMenu: true,
    showInFooter: false,
  },
  {
    id: "about",
    routeKey: "about",
    matchStrategy: "exact",
    showInMenu: true,
    showInFooter: true,
  },
  {
    id: "posts",
    routeKey: "posts",
    matchStrategy: "prefix",
    showInMenu: true,
    showInFooter: true,
  },
  {
    id: "tutorials",
    routeKey: "tutorials",
    matchStrategy: "prefix",
    showInMenu: false,
    showInFooter: true,
  },
  {
    id: "books",
    routeKey: "books",
    matchStrategy: "prefix",
    showInMenu: false,
    showInFooter: true,
  },
  {
    id: "stats",
    routeKey: "stats",
    matchStrategy: "exact",
    showInMenu: false,
    showInFooter: true,
  },
  {
    id: "feeds",
    routeKey: "feeds",
    matchStrategy: "prefix",
    showInMenu: false,
    showInFooter: true,
  },
  {
    id: "categories",
    routeKey: "categories",
    matchStrategy: "prefix",
    showInMenu: false,
    showInFooter: true,
  },
  {
    id: "genres",
    routeKey: "genres",
    matchStrategy: "prefix",
    showInMenu: false,
    showInFooter: true,
  },
  {
    id: "publishers",
    routeKey: "publishers",
    matchStrategy: "prefix",
    showInMenu: false,
    showInFooter: true,
  },
  {
    id: "series",
    routeKey: "series",
    matchStrategy: "prefix",
    showInMenu: false,
    showInFooter: true,
  },
  {
    id: "challenges",
    routeKey: "challenges",
    matchStrategy: "prefix",
    showInMenu: false,
    showInFooter: true,
  },
  {
    id: "authors",
    routeKey: "authors",
    matchStrategy: "prefix",
    showInMenu: false,
    showInFooter: true,
  },
  {
    id: "courses",
    routeKey: "courses",
    matchStrategy: "prefix",
    showInMenu: false,
    showInFooter: true,
  },
] as const;

/**
 * Content availability configuration
 *
 * Defines which sections should check for dynamic content vs static pages.
 *
 * STATIC PAGES: Always available in specified languages (don't need content check)
 * DYNAMIC PAGES: Need content collection check to determine availability
 */
const STATIC_PAGES: Readonly<Record<string, LanguageKey[] | undefined>> = {
  home: getLanguageCodes(), // Static page - all languages
  about: getLanguageCodes(), // Static page - all languages
};

/**
 * Map route keys to their corresponding content collection names
 * Used for dynamic content availability checking
 */
const ROUTE_TO_COLLECTION: Readonly<Partial<Record<RouteKey, string>>> = {
  posts: "posts",
  tutorials: "tutorials",
  books: "books",
  stats: "books", // Stats page should only show when books exist
  series: "series",
  challenges: "challenges",
  authors: "authors",
  courses: "courses",
  categories: "categories",
  genres: "genres",
  publishers: "publishers",
};

/**
 * Fallback content availability for testing environments
 * This is used when astro:content is not available (e.g., in Vitest)
 * Update this when adding/removing content in different languages
 *
 * Note: "posts" section checks are special - they aggregate posts+tutorials+books
 * (see hasContentInLanguage implementation for details)
 *
 * Current state (2025-01-05):
 * - Spanish: All collections have content
 * - English: Only books (14), authors (4), categories (4), genres (6), publishers (2), courses (2)
 */
const CONTENT_AVAILABILITY_FALLBACK: Readonly<Partial<Record<RouteKey, LanguageKey[]>>> = {
  posts: ["es"], // Only used for individual posts check in fallback
  tutorials: ["es"],
  books: ["es", "en"],
  stats: ["es", "en"], // Same as books
  series: ["es"],
  challenges: ["es"],
  authors: ["es", "en"],
  courses: ["es", "en"],
  categories: ["es", "en"],
  genres: ["es", "en"],
  publishers: ["es", "en"],
};

/**
 * Check if a section has published content in a given language
 *
 * For static pages (home, about, feeds): Returns hardcoded availability
 * For dynamic pages: Checks if content collection has entries for that language
 *                    Falls back to CONTENT_AVAILABILITY_FALLBACK in test environments
 *
 * Special case for "posts" and "feeds":
 *   These sections are aggregated pages that show ALL content types (posts + tutorials + books).
 *   Therefore, they check if ANY of these three collections have content in the requested language.
 *   - posts: /es/publicaciones/ or /en/posts/ (blog aggregator page)
 *   - feeds: /es/feeds/ or /en/feeds/ (RSS feeds page)
 *
 * @param routeKey - The route key to check
 * @param lang - Language code ("es" or "en")
 * @returns true if content exists or page is static, false otherwise
 *
 * @example
 * ```typescript
 * // Static page check
 * await hasContentInLanguage("home", "es") // true (static page)
 * await hasContentInLanguage("about", "en") // true (static page)
 *
 * // Dynamic content check (uses Astro collections in build, fallback in tests)
 * await hasContentInLanguage("tutorials", "es") // true (has Spanish tutorials)
 * await hasContentInLanguage("tutorials", "en") // false (no English tutorials)
 *
 * // Special aggregated check for posts section
 * await hasContentInLanguage("posts", "en") // true (has books in English, even if no posts)
 * ```
 */
export async function hasContentInLanguage(routeKey: RouteKey, lang: LanguageKey): Promise<boolean> {
  // Check if it's a static page first
  const staticAvailability = STATIC_PAGES[routeKey];
  if (staticAvailability !== undefined) {
    return staticAvailability.includes(lang);
  }

  // Special case: "posts" and "feeds" sections are aggregated pages
  // They show posts + tutorials + books, so check all three collections
  if (routeKey === "posts" || routeKey === "feeds") {
    try {
      const { getCollection } = await import("astro:content");

      // Check posts, tutorials, and books collections
      const [postsEntries, tutorialsEntries, booksEntries] = await Promise.all([
        getCollection("posts"),
        getCollection("tutorials"),
        getCollection("books"),
      ]);

      // Check if ANY of the three collections has content in this language
      const hasPostsContent = postsEntries.some((entry) => entry.data.language === lang);
      const hasTutorialsContent = tutorialsEntries.some((entry) => entry.data.language === lang);
      const hasBooksContent = booksEntries.some((entry) => entry.data.language === lang);

      return hasPostsContent || hasTutorialsContent || hasBooksContent;
    } catch {
      // Fallback for test environments
      // If ANY of posts/tutorials/books has content in this language, show the section
      const hasPostsFallback = CONTENT_AVAILABILITY_FALLBACK.posts?.includes(lang) ?? false;
      const hasTutorialsFallback = CONTENT_AVAILABILITY_FALLBACK.tutorials?.includes(lang) ?? false;
      const hasBooksFallback = CONTENT_AVAILABILITY_FALLBACK.books?.includes(lang) ?? false;

      return hasPostsFallback || hasTutorialsFallback || hasBooksFallback;
    }
  }

  // For other dynamic pages, check the corresponding collection
  const collectionName = ROUTE_TO_COLLECTION[routeKey];
  if (!collectionName) {
    // Unknown route - default to true (fail open)
    return true;
  }

  try {
    // Try to dynamically import the collection (only available in Astro build)
    const { getCollection } = await import("astro:content");
    const entries = await getCollection(
      collectionName as
        | "posts"
        | "tutorials"
        | "books"
        | "authors"
        | "categories"
        | "genres"
        | "publishers"
        | "challenges"
        | "courses",
    );

    // Check if any entry exists for this language
    const hasContent = entries.some((entry) => (entry.data as { language?: string }).language === lang);
    return hasContent;
  } catch (error) {
    // If astro:content is not available (e.g., in tests), use fallback
    const fallbackAvailability = CONTENT_AVAILABILITY_FALLBACK[routeKey];
    if (fallbackAvailability !== undefined) {
      return fallbackAvailability.includes(lang);
    }

    // If no fallback exists, log warning and return false
    buildLogger.warn(`Failed to check content for ${routeKey} in ${lang}:`, error);
    return false;
  }
}

/**
 * Get ALL navigation items (unfiltered)
 *
 * Returns all configured navigation items regardless of language or visibility settings.
 * Useful for administrative purposes or when you need the complete list.
 *
 * @returns Array of all navigation items
 *
 * @example
 * ```typescript
 * import { getAllNavigationItems } from "@config/navigation";
 *
 * const allItems = getAllNavigationItems();
 * // Returns complete array of all 13 navigation items
 * ```
 */
export function getAllNavigationItems(): NavigationItem[] {
  return [...NAVIGATION_ITEMS];
}

/**
 * Get navigation items for the main menu
 *
 * Filters items based on:
 * - showInMenu !== false
 * - visibleIn (if specified) includes the requested language
 *
 * Returns items suitable for display in the primary navigation menu.
 *
 * @param lang - Language code ("es" or "en")
 * @returns Array of navigation items for menu
 *
 * @example
 * ```typescript
 * import { getMenuItems } from "@config/navigation";
 *
 * const menuItems = getMenuItems("es");
 * // Returns items with showInMenu=true and available in Spanish
 * // Example: home, about, posts, tutorials, books, categories, ..., challenges
 *
 * const menuItemsEN = getMenuItems("en");
 * // Returns items with showInMenu=true and available in English
 * // Example: home, about, posts, tutorials, books, categories, ... (no challenges)
 * ```
 */
export function getMenuItems(lang: LanguageKey): NavigationItem[] {
  return NAVIGATION_ITEMS.filter(
    (item) =>
      item.showInMenu !== false && // Explicitly shown in menu (default true)
      (!item.visibleIn || item.visibleIn.includes(lang)), // Available in this language
  );
}

/**
 * Get navigation items for the footer
 *
 * Filters items based on:
 * - showInFooter !== false
 * - visibleIn (if specified) includes the requested language
 * - hasContentInLanguage() returns true (section has actual content)
 *
 * Returns items suitable for display in the footer navigation.
 * Only includes sections that have actual published content.
 *
 * @param lang - Language code ("es" or "en")
 * @returns Promise resolving to array of navigation items for footer
 *
 * @example
 * ```typescript
 * import { getFooterItems } from "@config/navigation";
 *
 * const footerItems = await getFooterItems("es");
 * // Returns items with:
 * // - showInFooter=true (includes feeds, excludes home)
 * // - Available in Spanish
 * // - Has actual published content
 *
 * const footerItemsEN = await getFooterItems("en");
 * // Same as above but for English
 * // Will exclude sections without English content (tutorials, series, courses, challenges)
 * ```
 */
export async function getFooterItems(lang: LanguageKey): Promise<NavigationItem[]> {
  // First filter by basic criteria (showInFooter, visibleIn)
  const candidateItems = NAVIGATION_ITEMS.filter(
    (item) =>
      item.showInFooter !== false && // Not explicitly hidden from footer (default true)
      (!item.visibleIn || item.visibleIn.includes(lang)), // Available in this language
  );

  // Then filter by content availability (async check)
  const itemsWithContent = await Promise.all(
    candidateItems.map(async (item) => {
      const hasContent = await hasContentInLanguage(item.routeKey, lang);
      return hasContent ? item : null;
    }),
  );

  // Filter out null values and return
  return itemsWithContent.filter((item): item is NavigationItem => item !== null);
}
