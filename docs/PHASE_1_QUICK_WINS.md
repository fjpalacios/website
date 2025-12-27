# Phase 1: Quick Wins Implementation Plan

**Status**: 📋 PLANNED - Not Started  
**Total Effort**: 8 hours  
**Lines Removed**: ~252 lines  
**Risk Level**: 🟢 LOW  
**Priority**: ⭐ HIGH - Start Here

---

## Overview

This phase focuses on **low-risk, high-value** refactorings that can be completed independently. Each task provides immediate benefits without requiring architectural changes.

**Key Principles**:

- ✅ No breaking changes to existing functionality
- ✅ Each task is independent (can be done in any order)
- ✅ Comprehensive tests for each change
- ✅ Document all decisions and patterns

---

## Tasks Breakdown

### Task 1: Generic RSS Generator

**Effort**: 3 hours  
**Priority**: 🔴 CRITICAL  
**Lines Removed**: ~150 lines  
**Risk**: 🟢 LOW

#### Current State

6 RSS files with 95% duplicate code:

```
/pages/en/rss.xml.ts          (40 lines)
/pages/es/rss.xml.ts          (40 lines)
/pages/en/books/rss.xml.ts    (25 lines)
/pages/es/libros/rss.xml.ts   (25 lines)
/pages/en/tutorials/rss.xml.ts (25 lines)
/pages/es/tutoriales/rss.xml.ts (25 lines)
```

**Problem**: Same logic repeated 6 times, only differs in:

- Language string ("en" vs "es")
- Title/description text
- URL paths

#### Implementation Steps

**Step 1.1: Create RSS Generator Utility (45 min)**

````typescript
// Create: src/utils/rss/generator.ts

import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { buildContentUrl } from "@/utils/routes";

export interface RSSConfig {
  lang: string;
  collections: string[];
  title: Record<string, string>;
  description: Record<string, string>;
  siteUrl?: string;
}

/**
 * Generates RSS feed for given language and collections
 *
 * @param context - Astro API context
 * @param config - RSS configuration
 * @returns RSS feed response
 *
 * @example
 * ```typescript
 * export async function GET(context: APIContext) {
 *   return generateRSS(context, {
 *     lang: 'en',
 *     collections: ['books', 'posts', 'tutorials'],
 *     title: { en: 'Blog in English', es: 'Blog en Español' },
 *     description: { en: 'Description', es: 'Descripción' }
 *   });
 * }
 * ```
 */
export async function generateRSS(context: APIContext, config: RSSConfig) {
  const { lang, collections, title, description, siteUrl } = config;

  // Validate inputs
  if (!lang || !collections.length) {
    throw new Error("RSS Generator: lang and collections are required");
  }

  // Fetch all collections for language
  const allContent = [];

  for (const collectionName of collections) {
    try {
      const items = await getCollection(collectionName, ({ data }) => data.language === lang);
      allContent.push(...items);
    } catch (error) {
      console.error(`Failed to fetch collection: ${collectionName}`, error);
      // Continue with other collections
    }
  }

  // Sort by date (newest first)
  const sortedContent = allContent.sort((a, b) => {
    const dateA = new Date(a.data.date);
    const dateB = new Date(b.data.date);
    return dateB.getTime() - dateA.getTime();
  });

  // Build RSS items
  const items = sortedContent.map((item) => {
    const url = buildContentUrl(lang, item.collection, item.slug);

    return {
      title: item.data.title,
      pubDate: new Date(item.data.date),
      description: item.data.description || "",
      link: url,
      author: item.data.author || undefined,
      categories: item.data.tags || [],
    };
  });

  // Generate RSS feed
  return rss({
    title: title[lang] || title.en || "RSS Feed",
    description: description[lang] || description.en || "",
    site: siteUrl || context.site?.toString() || "",
    customData: `<language>${lang}</language>`,
    items,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
  });
}

/**
 * Generates RSS feed for a single collection type
 */
export async function generateCollectionRSS(
  context: APIContext,
  config: Omit<RSSConfig, "collections"> & { collection: string },
) {
  return generateRSS(context, {
    ...config,
    collections: [config.collection],
  });
}
````

**Step 1.2: Create RSS Config (15 min)**

```typescript
// Create: src/config/rss.ts

export const RSS_CONFIG = {
  general: {
    collections: ["books", "posts", "tutorials"],
    title: {
      en: "fjp.es - Blog in English",
      es: "fjp.es - Blog en Español",
    },
    description: {
      en: "Personal blog about books, programming and technology",
      es: "Blog personal sobre libros, programación y tecnología",
    },
  },
  books: {
    collections: ["books"],
    title: {
      en: "fjp.es - Book Reviews",
      es: "fjp.es - Reseñas de Libros",
    },
    description: {
      en: "Book reviews and reading recommendations",
      es: "Reseñas de libros y recomendaciones de lectura",
    },
  },
  tutorials: {
    collections: ["tutorials"],
    title: {
      en: "fjp.es - Tutorials",
      es: "fjp.es - Tutoriales",
    },
    description: {
      en: "Programming tutorials and technical articles",
      es: "Tutoriales de programación y artículos técnicos",
    },
  },
} as const;
```

**Step 1.3: Refactor Main RSS Files (30 min)**

```typescript
// Update: src/pages/en/rss.xml.ts
import type { APIContext } from "astro";
import { generateRSS } from "@/utils/rss/generator";
import { RSS_CONFIG } from "@/config/rss";

export async function GET(context: APIContext) {
  return generateRSS(context, {
    lang: "en",
    ...RSS_CONFIG.general,
  });
}

// Update: src/pages/es/rss.xml.ts
import type { APIContext } from "astro";
import { generateRSS } from "@/utils/rss/generator";
import { RSS_CONFIG } from "@/config/rss";

export async function GET(context: APIContext) {
  return generateRSS(context, {
    lang: "es",
    ...RSS_CONFIG.general,
  });
}
```

**Step 1.4: Refactor Collection-Specific RSS (30 min)**

```typescript
// Update: src/pages/en/books/rss.xml.ts
import type { APIContext } from "astro";
import { generateCollectionRSS } from "@/utils/rss/generator";
import { RSS_CONFIG } from "@/config/rss";

export async function GET(context: APIContext) {
  return generateCollectionRSS(context, {
    lang: "en",
    collection: "books",
    ...RSS_CONFIG.books,
  });
}

// Similar for /es/libros/rss.xml.ts, tutorials, etc.
```

**Step 1.5: Write Tests (60 min)**

```typescript
// Create: src/__tests__/utils/rss/generator.test.ts

import { describe, it, expect, vi } from "vitest";
import { generateRSS, generateCollectionRSS } from "@/utils/rss/generator";

describe("RSS Generator", () => {
  describe("generateRSS", () => {
    it("should generate RSS feed with multiple collections", async () => {
      // Test implementation
    });

    it("should filter by language", async () => {
      // Test implementation
    });

    it("should sort items by date (newest first)", async () => {
      // Test implementation
    });

    it("should handle empty collections gracefully", async () => {
      // Test implementation
    });

    it("should include proper metadata", async () => {
      // Test implementation
    });

    it("should generate correct URLs for items", async () => {
      // Test implementation
    });

    it("should handle missing descriptions", async () => {
      // Test implementation
    });

    it("should throw error for invalid config", async () => {
      // Test implementation
    });
  });

  describe("generateCollectionRSS", () => {
    it("should generate RSS for single collection", async () => {
      // Test implementation
    });
  });
});
```

#### Testing Checklist

- [ ] Unit tests pass for RSS generator
- [ ] RSS feeds validate with RSS validator
- [ ] EN RSS feed generates correctly
- [ ] ES RSS feed generates correctly
- [ ] Books RSS feeds work (EN/ES)
- [ ] Tutorials RSS feeds work (EN/ES)
- [ ] RSS items have correct URLs
- [ ] RSS items sorted by date
- [ ] Language metadata correct
- [ ] No broken links in feeds

#### Validation Commands

```bash
# Run tests
bun run test src/__tests__/utils/rss/

# Build and check feeds
bun run build
curl http://localhost:4321/en/rss.xml | head -50
curl http://localhost:4321/es/rss.xml | head -50

# Validate RSS format
npx rss-validator http://localhost:4321/en/rss.xml
npx rss-validator http://localhost:4321/es/rss.xml

# Test in RSS reader
# Add feed to your RSS reader and verify items appear correctly
```

#### Files to Modify

**New Files**:

- ✅ `src/utils/rss/generator.ts` (~120 lines)
- ✅ `src/config/rss.ts` (~40 lines)
- ✅ `src/__tests__/utils/rss/generator.test.ts` (~150 lines)

**Modified Files**:

- ✅ `src/pages/en/rss.xml.ts` (40 → 8 lines)
- ✅ `src/pages/es/rss.xml.ts` (40 → 8 lines)
- ✅ `src/pages/en/books/rss.xml.ts` (25 → 8 lines)
- ✅ `src/pages/es/libros/rss.xml.ts` (25 → 8 lines)
- ✅ `src/pages/en/tutorials/rss.xml.ts` (25 → 8 lines)
- ✅ `src/pages/es/tutoriales/rss.xml.ts` (25 → 8 lines)

**Net Result**: +310 new, -132 removed = **+178 lines** (but 150 lines of duplication eliminated)

#### Success Criteria

✅ All RSS feeds generate correctly  
✅ RSS validation passes  
✅ Tests have 100% coverage  
✅ No breaking changes to feed URLs  
✅ Feed readers can consume feeds  
✅ Documentation complete

---

### Task 2: Generic Pagination Generator

**Effort**: 2 hours  
**Priority**: 🟠 HIGH  
**Lines Removed**: ~72 lines  
**Risk**: 🟢 LOW

#### Current State

3 files with nearly identical pagination logic:

```
/utils/booksPages.ts - generateBooksPaginationPaths() (24 lines)
/utils/tutorialsPages.ts - generateTutorialsPaginationPaths() (24 lines)
/utils/postsPages.ts - generatePostsPaginationPaths() (24 lines)
```

**Problem**: Same pagination algorithm repeated 3 times, only differs in:

- Item type
- Items per page constant
- Function names

#### Implementation Steps

**Step 2.1: Create Generic Pagination Utility (30 min)**

````typescript
// Create: src/utils/pagination/generator.ts

import type { ContactItem } from "@/types";

export interface PaginationConfig<T> {
  items: T[];
  lang: string;
  contact: ContactItem[];
  itemsPerPage: number;
  startPage?: number;
}

export interface PaginationPathResult<T> {
  page: string;
  props: {
    lang: string;
    items: T[];
    currentPage: number;
    totalPages: number;
    contact: ContactItem[];
  };
}

/**
 * Generates pagination paths for static site generation
 *
 * @param config - Pagination configuration
 * @returns Array of pagination path objects
 *
 * @example
 * ```typescript
 * const paths = generatePaginationPaths({
 *   items: books,
 *   lang: 'en',
 *   contact: contactEn,
 *   itemsPerPage: 12,
 *   startPage: 2 // Start from page 2 (page 1 handled by index)
 * });
 * ```
 */
export function generatePaginationPaths<T>(config: PaginationConfig<T>): PaginationPathResult<T>[] {
  const { items, lang, contact, itemsPerPage, startPage = 2 } = config;

  // Validate inputs
  if (!items || !Array.isArray(items)) {
    throw new Error("Pagination: items must be an array");
  }

  if (itemsPerPage < 1) {
    throw new Error("Pagination: itemsPerPage must be greater than 0");
  }

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Generate paths for each page
  const paths: PaginationPathResult<T>[] = [];

  for (let page = startPage; page <= totalPages; page++) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    paths.push({
      page: page.toString(),
      props: {
        lang,
        items: items.slice(start, end),
        currentPage: page,
        totalPages,
        contact,
      },
    });
  }

  return paths;
}

/**
 * Gets page count for given items and page size
 */
export function getPageCount(itemCount: number, itemsPerPage: number): number {
  return Math.ceil(itemCount / itemsPerPage);
}

/**
 * Gets items for specific page
 */
export function getPageItems<T>(items: T[], page: number, itemsPerPage: number): T[] {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return items.slice(start, end);
}
````

**Step 2.2: Update Books Pagination (15 min)**

```typescript
// Update: src/utils/booksPages.ts

import { generatePaginationPaths } from "@/utils/pagination/generator";
import type { ContactItem } from "@/types";

export const BOOKS_PER_PAGE = 12;

export async function generateBooksPaginationPaths(lang: string, contact: ContactItem[]) {
  const sortedBooks = await getAllBooksForLanguage(lang);

  return generatePaginationPaths({
    items: sortedBooks,
    lang,
    contact,
    itemsPerPage: BOOKS_PER_PAGE,
    startPage: 2, // Page 1 is handled by index.astro
  });
}
```

**Step 2.3: Update Tutorials Pagination (15 min)**

```typescript
// Update: src/utils/tutorialsPages.ts

import { generatePaginationPaths } from "@/utils/pagination/generator";

export const TUTORIALS_PER_PAGE = 12;

export async function generateTutorialsPaginationPaths(lang: string, contact: ContactItem[]) {
  const sortedTutorials = await getAllTutorialsForLanguage(lang);

  return generatePaginationPaths({
    items: sortedTutorials,
    lang,
    contact,
    itemsPerPage: TUTORIALS_PER_PAGE,
    startPage: 2,
  });
}
```

**Step 2.4: Update Posts Pagination (15 min)**

```typescript
// Update: src/utils/postsPages.ts

import { generatePaginationPaths } from "@/utils/pagination/generator";

export const POSTS_PER_PAGE = 12;

export async function generatePostsPaginationPaths(lang: string, contact: ContactItem[]) {
  const sortedPosts = await getAllContentForLanguage(lang);

  return generatePaginationPaths({
    items: sortedPosts,
    lang,
    contact,
    itemsPerPage: POSTS_PER_PAGE,
    startPage: 2,
  });
}
```

**Step 2.5: Write Tests (45 min)**

```typescript
// Create: src/__tests__/utils/pagination/generator.test.ts

import { describe, it, expect } from "vitest";
import { generatePaginationPaths, getPageCount, getPageItems } from "@/utils/pagination/generator";

describe("Pagination Generator", () => {
  const mockItems = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
  }));

  const mockContact = [{ type: "email", url: "test@example.com" }];

  describe("generatePaginationPaths", () => {
    it("should generate correct number of pages", () => {
      const paths = generatePaginationPaths({
        items: mockItems,
        lang: "en",
        contact: mockContact,
        itemsPerPage: 12,
      });

      // 50 items / 12 per page = 5 pages
      // Starting from page 2 = 4 pages (2, 3, 4, 5)
      expect(paths).toHaveLength(4);
    });

    it("should slice items correctly for each page", () => {
      const paths = generatePaginationPaths({
        items: mockItems,
        lang: "en",
        contact: mockContact,
        itemsPerPage: 12,
        startPage: 2,
      });

      // Page 2 should have items 12-23 (indices 12-23)
      expect(paths[0].props.items).toHaveLength(12);
      expect(paths[0].props.items[0].id).toBe(13);
      expect(paths[0].props.items[11].id).toBe(24);
    });

    it("should include correct metadata in props", () => {
      const paths = generatePaginationPaths({
        items: mockItems,
        lang: "en",
        contact: mockContact,
        itemsPerPage: 12,
      });

      expect(paths[0].props.lang).toBe("en");
      expect(paths[0].props.currentPage).toBe(2);
      expect(paths[0].props.totalPages).toBe(5);
      expect(paths[0].props.contact).toBe(mockContact);
    });

    it("should handle custom start page", () => {
      const paths = generatePaginationPaths({
        items: mockItems,
        lang: "en",
        contact: mockContact,
        itemsPerPage: 12,
        startPage: 1,
      });

      expect(paths).toHaveLength(5); // All pages
      expect(paths[0].page).toBe("1");
    });

    it("should throw error for invalid items", () => {
      expect(() =>
        generatePaginationPaths({
          items: null as any,
          lang: "en",
          contact: mockContact,
          itemsPerPage: 12,
        }),
      ).toThrow();
    });

    it("should throw error for invalid itemsPerPage", () => {
      expect(() =>
        generatePaginationPaths({
          items: mockItems,
          lang: "en",
          contact: mockContact,
          itemsPerPage: 0,
        }),
      ).toThrow();
    });

    it("should handle empty items array", () => {
      const paths = generatePaginationPaths({
        items: [],
        lang: "en",
        contact: mockContact,
        itemsPerPage: 12,
      });

      expect(paths).toHaveLength(0);
    });

    it("should handle items that fit in one page", () => {
      const paths = generatePaginationPaths({
        items: mockItems.slice(0, 10),
        lang: "en",
        contact: mockContact,
        itemsPerPage: 12,
        startPage: 1,
      });

      expect(paths).toHaveLength(1);
      expect(paths[0].props.items).toHaveLength(10);
    });
  });

  describe("getPageCount", () => {
    it("should calculate correct page count", () => {
      expect(getPageCount(50, 12)).toBe(5);
      expect(getPageCount(48, 12)).toBe(4);
      expect(getPageCount(0, 12)).toBe(0);
    });
  });

  describe("getPageItems", () => {
    it("should return correct items for page", () => {
      const items = getPageItems(mockItems, 2, 12);
      expect(items).toHaveLength(12);
      expect(items[0].id).toBe(13);
    });

    it("should handle last page with fewer items", () => {
      const items = getPageItems(mockItems, 5, 12);
      expect(items).toHaveLength(2); // 50 items, last page has 2
    });
  });
});
```

#### Testing Checklist

- [ ] Unit tests pass for pagination generator
- [ ] Books pagination works (EN/ES)
- [ ] Tutorials pagination works (EN/ES)
- [ ] Posts pagination works (EN/ES)
- [ ] Page numbers are correct
- [ ] Items sliced correctly per page
- [ ] Last page handles remaining items
- [ ] Metadata (currentPage, totalPages) correct
- [ ] No breaking changes to existing pages

#### Files to Modify

**New Files**:

- ✅ `src/utils/pagination/generator.ts` (~100 lines)
- ✅ `src/__tests__/utils/pagination/generator.test.ts` (~120 lines)

**Modified Files**:

- ✅ `src/utils/booksPages.ts` (remove 24 lines, add import)
- ✅ `src/utils/tutorialsPages.ts` (remove 24 lines, add import)
- ✅ `src/utils/postsPages.ts` (remove 24 lines, add import)

**Net Result**: +220 new, -72 removed = **+148 lines** (but 72 lines of duplication eliminated)

#### Success Criteria

✅ All pagination paths generate correctly  
✅ Tests have 100% coverage  
✅ No breaking changes to URLs  
✅ All pagination pages render correctly  
✅ Documentation complete

---

### Task 3: Centralize Pagination Config

**Effort**: 1 hour  
**Priority**: 🟡 MEDIUM  
**Lines Removed**: ~10 lines  
**Risk**: 🟢 VERY LOW

#### Current State

Magic number `12` repeated in 4+ files:

```typescript
// In multiple files:
export const BOOKS_PER_PAGE = 12;
export const POSTS_PER_PAGE = 12;
export const TUTORIALS_PER_PAGE = 12;
```

#### Implementation Steps

**Step 3.1: Create Config File (15 min)**

```typescript
// Create: src/config/pagination.ts

/**
 * Centralized pagination configuration
 *
 * All pagination sizes are defined here to ensure consistency
 * across the application.
 */
export const PAGINATION_CONFIG = {
  /**
   * Default items per page for all content types
   */
  DEFAULT_ITEMS_PER_PAGE: 12,

  /**
   * Content-specific pagination sizes
   */
  books: 12,
  tutorials: 12,
  posts: 12,
  taxonomy: 10, // Categories, genres, etc.

  /**
   * Maximum items per page (safety limit)
   */
  MAX_ITEMS_PER_PAGE: 50,

  /**
   * Minimum items per page
   */
  MIN_ITEMS_PER_PAGE: 1,
} as const;

/**
 * Type-safe pagination size getter
 */
export function getPaginationSize(contentType: keyof typeof PAGINATION_CONFIG): number {
  return PAGINATION_CONFIG[contentType] as number;
}

/**
 * Validates pagination size is within acceptable range
 */
export function validatePaginationSize(size: number): boolean {
  return size >= PAGINATION_CONFIG.MIN_ITEMS_PER_PAGE && size <= PAGINATION_CONFIG.MAX_ITEMS_PER_PAGE;
}
```

**Step 3.2: Update Files to Use Config (30 min)**

```typescript
// Update: src/utils/booksPages.ts
import { PAGINATION_CONFIG } from "@/config/pagination";

export const BOOKS_PER_PAGE = PAGINATION_CONFIG.books;

// Update: src/utils/tutorialsPages.ts
import { PAGINATION_CONFIG } from "@/config/pagination";

export const TUTORIALS_PER_PAGE = PAGINATION_CONFIG.tutorials;

// Update: src/utils/postsPages.ts
import { PAGINATION_CONFIG } from "@/config/pagination";

export const POSTS_PER_PAGE = PAGINATION_CONFIG.posts;

// Similar for other files using pagination sizes
```

**Step 3.3: Write Tests (15 min)**

```typescript
// Create: src/__tests__/config/pagination.test.ts

import { describe, it, expect } from "vitest";
import { PAGINATION_CONFIG, getPaginationSize, validatePaginationSize } from "@/config/pagination";

describe("Pagination Config", () => {
  it("should have valid default size", () => {
    expect(PAGINATION_CONFIG.DEFAULT_ITEMS_PER_PAGE).toBeGreaterThan(0);
  });

  it("should have consistent sizes", () => {
    expect(PAGINATION_CONFIG.books).toBe(12);
    expect(PAGINATION_CONFIG.tutorials).toBe(12);
    expect(PAGINATION_CONFIG.posts).toBe(12);
  });

  describe("getPaginationSize", () => {
    it("should return correct size for content type", () => {
      expect(getPaginationSize("books")).toBe(12);
      expect(getPaginationSize("taxonomy")).toBe(10);
    });
  });

  describe("validatePaginationSize", () => {
    it("should validate acceptable sizes", () => {
      expect(validatePaginationSize(12)).toBe(true);
      expect(validatePaginationSize(1)).toBe(true);
      expect(validatePaginationSize(50)).toBe(true);
    });

    it("should reject invalid sizes", () => {
      expect(validatePaginationSize(0)).toBe(false);
      expect(validatePaginationSize(-1)).toBe(false);
      expect(validatePaginationSize(51)).toBe(false);
    });
  });
});
```

#### Files to Modify

**New Files**:

- ✅ `src/config/pagination.ts` (~50 lines)
- ✅ `src/__tests__/config/pagination.test.ts` (~40 lines)

**Modified Files**:

- ✅ `src/utils/booksPages.ts` (update import)
- ✅ `src/utils/tutorialsPages.ts` (update import)
- ✅ `src/utils/postsPages.ts` (update import)
- ✅ Any other files using pagination constants

---

### Task 4: Extract Score Utility

**Effort**: 1 hour  
**Priority**: 🟡 MEDIUM  
**Lines Removed**: ~20 lines  
**Risk**: 🟢 VERY LOW

#### Current State

Score rendering logic duplicated in 2 files:

```typescript
// In both /en/books/[slug].astro and /es/libros/[slug].astro
const renderScoreEmoji = () => {
  if (book.score === "fav") {
    return "❤️❤️❤️❤️❤️";
  }
  const stars = "★".repeat(book.score);
  const emptyStars = "☆".repeat(5 - book.score);
  return stars + emptyStars;
};
```

#### Implementation Steps

**Step 4.1: Create Utility (20 min)**

````typescript
// Create: src/utils/book/scoreFormatter.ts

/**
 * Formats book score as emoji representation
 *
 * @param score - Numeric score (1-5) or "fav" for favorites
 * @returns Emoji string representation
 *
 * @example
 * ```typescript
 * renderScoreEmoji(4)    // "★★★★☆"
 * renderScoreEmoji("fav") // "❤️❤️❤️❤️❤️"
 * ```
 */
export function renderScoreEmoji(score: number | "fav"): string {
  if (score === "fav") {
    return "❤️".repeat(5);
  }

  // Validate numeric score
  if (score < 1 || score > 5) {
    console.warn(`Invalid score: ${score}. Must be 1-5 or "fav"`);
    return "☆☆☆☆☆"; // Return empty stars for invalid score
  }

  const filledStars = "★".repeat(score);
  const emptyStars = "☆".repeat(5 - score);

  return filledStars + emptyStars;
}

/**
 * Gets text representation of score
 */
export function getScoreText(score: number | "fav", lang: "en" | "es"): string {
  if (score === "fav") {
    return lang === "en" ? "Favorite" : "Favorito";
  }
  return `${score}/5`;
}

/**
 * Gets accessibility label for score
 */
export function getScoreAriaLabel(score: number | "fav", lang: "en" | "es"): string {
  if (score === "fav") {
    return lang === "en" ? "Rated as favorite" : "Marcado como favorito";
  }

  const text = lang === "en" ? `Rated ${score} out of 5 stars` : `Puntuación ${score} de 5 estrellas`;

  return text;
}
````

**Step 4.2: Update Book Pages (20 min)**

```typescript
// Update: src/pages/en/books/[slug].astro
import { renderScoreEmoji, getScoreAriaLabel } from '@/utils/book/scoreFormatter';

// Remove inline renderScoreEmoji function
// Replace with:
const scoreEmoji = renderScoreEmoji(book.score);
const scoreLabel = getScoreAriaLabel(book.score, lang);

// In template:
<span aria-label={scoreLabel}>{scoreEmoji}</span>

// Same for src/pages/es/libros/[slug].astro
```

**Step 4.3: Write Tests (20 min)**

```typescript
// Create: src/__tests__/utils/book/scoreFormatter.test.ts

import { describe, it, expect } from "vitest";
import { renderScoreEmoji, getScoreText, getScoreAriaLabel } from "@/utils/book/scoreFormatter";

describe("Score Formatter", () => {
  describe("renderScoreEmoji", () => {
    it("should render favorite as hearts", () => {
      expect(renderScoreEmoji("fav")).toBe("❤️❤️❤️❤️❤️");
    });

    it("should render numeric scores correctly", () => {
      expect(renderScoreEmoji(5)).toBe("★★★★★");
      expect(renderScoreEmoji(4)).toBe("★★★★☆");
      expect(renderScoreEmoji(3)).toBe("★★★☆☆");
      expect(renderScoreEmoji(2)).toBe("★★☆☆☆");
      expect(renderScoreEmoji(1)).toBe("★☆☆☆☆");
    });

    it("should handle invalid scores", () => {
      expect(renderScoreEmoji(0)).toBe("☆☆☆☆☆");
      expect(renderScoreEmoji(6)).toBe("☆☆☆☆☆");
    });
  });

  describe("getScoreText", () => {
    it("should return correct text for favorite", () => {
      expect(getScoreText("fav", "en")).toBe("Favorite");
      expect(getScoreText("fav", "es")).toBe("Favorito");
    });

    it("should return numeric score text", () => {
      expect(getScoreText(4, "en")).toBe("4/5");
      expect(getScoreText(4, "es")).toBe("4/5");
    });
  });

  describe("getScoreAriaLabel", () => {
    it("should return accessibility label for favorite", () => {
      expect(getScoreAriaLabel("fav", "en")).toBe("Rated as favorite");
      expect(getScoreAriaLabel("fav", "es")).toBe("Marcado como favorito");
    });

    it("should return accessibility label for numeric score", () => {
      expect(getScoreAriaLabel(4, "en")).toBe("Rated 4 out of 5 stars");
      expect(getScoreAriaLabel(4, "es")).toBe("Puntuación 4 de 5 estrellas");
    });
  });
});
```

---

### Task 5: Cleanup & Type Fixes

**Effort**: 1 hour  
**Priority**: 🟢 LOW  
**Lines Removed**: ~5 lines  
**Risk**: 🟢 VERY LOW

#### Tasks

1. **Remove commented dead code** (15 min)

   - Search for commented code
   - Verify it's not needed
   - Delete

2. **Fix `any` types** (30 min)

   - Find all uses of `any`
   - Replace with proper types
   - Update function signatures

3. **Add missing JSDoc** (15 min)
   - Document public functions
   - Add examples where helpful

---

## Execution Order

### Recommended Sequence

1. ✅ **Task 3** - Centralize Config (1h)

   - Quickest win
   - No dependencies
   - Sets foundation

2. ✅ **Task 4** - Score Utility (1h)

   - Independent
   - Small scope
   - Good practice

3. ✅ **Task 2** - Pagination Generator (2h)

   - Medium complexity
   - Builds confidence
   - Can use Task 3 config

4. ✅ **Task 1** - RSS Generator (3h)

   - Most complex
   - Highest impact
   - Last to minimize risk

5. ✅ **Task 5** - Cleanup (1h)
   - Final polish
   - Easy to do last

### Alternative: By Priority

If time is limited, do in order of business value:

1. RSS Generator (highest user impact)
2. Pagination Generator (frequent changes)
3. Score Utility (visible to users)
4. Config Centralization (maintainability)
5. Cleanup (nice to have)

---

## Testing Strategy

### Before Starting

```bash
# Run full test suite
bun run test

# Record current metrics
bun run build
# Note build time
# Note bundle size
```

### After Each Task

```bash
# Run tests for that task
bun run test src/__tests__/[task-path]

# Run full test suite
bun run test

# Build and verify
bun run build

# Visual testing
bun run dev
# Check affected pages
```

### Before Committing

```bash
# Full test suite
bun run test

# E2E tests
bun run test:e2e

# Build verification
bun run build

# Check no regressions
git diff --stat
```

---

## Success Metrics

### Quantitative

- ✅ 252 lines of duplicate code removed
- ✅ All 524+ unit tests passing
- ✅ Code coverage maintained or improved
- ✅ Build time unchanged or improved
- ✅ 0 breaking changes

### Qualitative

- ✅ Code more maintainable
- ✅ Patterns established for future
- ✅ Documentation improved
- ✅ Team confidence increased

---

## Risk Mitigation

### Rollback Plan

Each task can be reverted independently:

```bash
# If Task 1 fails:
git revert <commit-hash>
# RSS still works with old code

# If Task 2 fails:
git revert <commit-hash>
# Pagination still works with old code
```

### Safety Measures

1. ✅ **Branch per task**: Create feature branch for each
2. ✅ **Test before merge**: Full suite must pass
3. ✅ **Review required**: Code review before merge
4. ✅ **Staging deploy**: Test on staging first
5. ✅ **Incremental**: Don't do all tasks at once

---

## Documentation Requirements

### Per Task

- [ ] Update JSDoc comments
- [ ] Add usage examples
- [ ] Document breaking changes (if any)
- [ ] Update related README files

### Overall

- [ ] Update DEVELOPMENT_GUIDELINES.md
- [ ] Add patterns to style guide
- [ ] Create CHANGELOG entry
- [ ] Update TODO lists

---

## Commit Strategy

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Example Commits

```bash
# Task 1
git commit -m "refactor(rss): create generic RSS generator

- Extract RSS generation logic to reusable utility
- Create centralized RSS configuration
- Add comprehensive test coverage
- Remove 150 lines of duplicate code

Benefits:
- DRY: Single source of truth for RSS
- Maintainability: Easier to update RSS logic
- Consistency: Guaranteed identical RSS format
- Extensibility: Easy to add new collections

Tests: ✅ All 12 new tests passing
Validation: ✅ RSS feeds validated successfully"

# Task 2
git commit -m "refactor(pagination): create generic pagination generator

- Extract pagination logic to reusable utility
- Add type-safe pagination configuration
- Add comprehensive test coverage
- Remove 72 lines of duplicate code

Benefits:
- DRY: Single pagination algorithm
- Type Safety: Generic types for any content
- Testability: Isolated pagination logic
- Reusability: Works for any content type

Tests: ✅ All 15 new tests passing"
```

---

## Phase 1 Complete Checklist

### Pre-Flight

- [ ] Read all task documentation
- [ ] Understand dependencies
- [ ] Set up feature branches
- [ ] Back up current state

### Task Completion

- [ ] Task 1: RSS Generator ✅
- [ ] Task 2: Pagination Generator ✅
- [ ] Task 3: Config Centralization ✅
- [ ] Task 4: Score Utility ✅
- [ ] Task 5: Cleanup & Types ✅

### Quality Gates

- [ ] All unit tests passing
- [ ] E2E tests passing
- [ ] Code coverage maintained
- [ ] Build successful
- [ ] No lint errors
- [ ] Documentation updated

### Final Steps

- [ ] Merge all branches
- [ ] Deploy to staging
- [ ] Manual testing on staging
- [ ] Create release notes
- [ ] Deploy to production
- [ ] Monitor for issues

---

## Next Steps

After Phase 1 completion, evaluate:

1. **Continue to Phase 2?** (High-impact refactors)
2. **Pause and monitor** (Let changes settle)
3. **Plan Phase 3?** (The big i18n refactor)

See `REFACTORING_PROPOSALS.md` for Phase 2 and 3 details.

---

**Document Status**: ✅ COMPLETE  
**Last Updated**: December 27, 2025  
**Ready to Execute**: YES
