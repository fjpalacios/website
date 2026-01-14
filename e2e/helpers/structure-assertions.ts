/**
 * Structure Test Assertions
 *
 * Reusable assertions for testing page structure and layout.
 * These test the DOM structure, not visual appearance.
 */

import { expect, type Page, type Locator } from "@playwright/test";

/**
 * Assert that a listing page has the correct structure
 * Tests for grid layout, card elements, and minimum content
 *
 * @param page - Playwright page instance
 * @param options - Configuration options
 */
export async function assertListingStructure(
  page: Page,
  options: {
    gridSelector: string;
    cardSelector: string;
    minItems?: number;
    maxItems?: number;
    hasPagination?: boolean;
  },
): Promise<void> {
  const { gridSelector, cardSelector, minItems = 1, maxItems, hasPagination = false } = options;

  // Grid container exists
  const grid = page.locator(gridSelector);
  await expect(grid).toBeVisible();

  // Has items
  const items = grid.locator(cardSelector);
  const count = await items.count();

  expect(count).toBeGreaterThanOrEqual(minItems);
  if (maxItems) {
    expect(count).toBeLessThanOrEqual(maxItems);
  }

  // First few items are in viewport
  const itemsToCheck = Math.min(count, 3);
  for (let i = 0; i < itemsToCheck; i++) {
    await expect(items.nth(i)).toBeInViewport();
  }

  // Pagination exists if expected
  if (hasPagination && count >= (maxItems || 12)) {
    await expect(page.locator(".pagination, .paginator")).toBeVisible();
  }
}

/**
 * Assert that a book card has the correct structure
 *
 * @param card - Book card locator
 */
export async function assertBookCardStructure(card: Locator): Promise<void> {
  // Must have title
  await expect(card.locator(".book-title, h3, h2")).toBeVisible();

  // Must have cover image
  const cover = card.locator(".book-cover img, img");
  await expect(cover).toBeVisible();

  // Image must be loaded
  const isLoaded = await cover.evaluate((el: Element) => (el as HTMLImageElement).complete);
  expect(isLoaded).toBe(true);

  // Must have link
  const link = card.locator("a");
  await expect(link).toHaveAttribute("href", /.+/);

  // Link should point to correct path
  const href = await link.getAttribute("href");
  expect(href).toMatch(/\/(es|en)\/libros\/.+/);
}

/**
 * Assert that a tutorial card has the correct structure
 *
 * @param card - Tutorial card locator
 */
export async function assertTutorialCardStructure(card: Locator): Promise<void> {
  // Must have title
  await expect(card.locator("h3, h2, .tutorial-title")).toBeVisible();

  // Must have link
  const link = card.locator("a");
  await expect(link).toHaveAttribute("href", /.+/);

  // Link should point to correct path
  const href = await link.getAttribute("href");
  expect(href).toMatch(/\/(es|en)\/tutoriales|tutorials\/.+/);
}

/**
 * Assert that a post card has the correct structure
 *
 * @param card - Post card locator
 */
export async function assertPostCardStructure(card: Locator): Promise<void> {
  // Must have title
  await expect(card.locator("h3, h2, .post-title")).toBeVisible();

  // Must have date
  await expect(card.locator("time, .post-date")).toBeVisible();

  // Must have link
  const link = card.locator("a");
  await expect(link).toHaveAttribute("href", /.+/);
}

/**
 * Assert that page header/menu has correct structure
 * Note: The site uses a Menu component (nav.menu) for navigation, not a semantic <header>
 *
 * @param page - Playwright page instance
 */
export async function assertHeaderStructure(page: Page): Promise<void> {
  // Menu navigation (the actual "header" of the site)
  const menu = page.locator("nav.menu");
  await expect(menu).toBeVisible();

  // Navigation links
  const navigation = menu.locator(".navigation");
  await expect(navigation).toBeVisible();

  // Should have at least one navigation link
  const navLinks = navigation.locator("li");
  const linkCount = await navLinks.count();
  expect(linkCount).toBeGreaterThan(0);

  // Theme toggle
  await expect(menu.locator("#theme-toggle")).toBeVisible();

  // Language switcher
  await expect(menu.locator(".language-switcher")).toBeVisible();

  // Search button
  await expect(menu.locator(".search-button")).toBeVisible();
}

/**
 * Assert that page footer has correct structure
 * Note: There might be multiple <footer> elements on the page, we want the main footer
 *
 * @param page - Playwright page instance
 */
export async function assertFooterStructure(page: Page): Promise<void> {
  // Use the main footer with .footer class (not section footers)
  const footer = page.locator("footer.footer");
  await expect(footer).toBeVisible();

  // Should have some links
  const links = footer.locator("a");
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
}

/**
 * Assert that a page has no layout breaks
 * Checks for elements with 0 dimensions, overflow issues, etc.
 *
 * @param page - Playwright page instance
 */
export async function assertNoLayoutBreaks(page: Page): Promise<void> {
  // Check no elements with 0 width/height that should be visible
  const hiddenElements = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll("*"));
    return elements
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);
        return (
          computed.display !== "none" &&
          computed.visibility !== "hidden" &&
          (rect.width === 0 || rect.height === 0) &&
          el.textContent?.trim() !== ""
        );
      })
      .map((el) => ({
        tag: el.tagName,
        class: el.className,
        text: el.textContent?.substring(0, 50),
      }));
  });

  // Allow some 0-size elements (decorative, spacers, etc)
  expect(hiddenElements.length).toBeLessThan(5);
}

/**
 * Assert that no content is cut off (horizontal scroll)
 *
 * @param page - Playwright page instance
 */
export async function assertNoHorizontalScroll(page: Page): Promise<void> {
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });

  expect(hasHorizontalScroll).toBe(false);
}

/**
 * Assert pagination structure
 *
 * @param page - Playwright page instance
 * @param options - Pagination options
 */
export async function assertPaginationStructure(
  page: Page,
  options: {
    currentPage: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  },
): Promise<void> {
  const { currentPage, hasNext, hasPrev } = options;

  const pagination = page.locator(".pagination, .paginator");
  await expect(pagination).toBeVisible();

  // Current page indicator
  const current = pagination.locator(`.active, [aria-current="page"]`);
  await expect(current).toBeVisible();
  await expect(current).toContainText(String(currentPage));

  // Previous link
  if (hasPrev) {
    const prev = pagination.locator('a[rel="prev"], .prev:not(.disabled)');
    await expect(prev).toBeVisible();
  }

  // Next link
  if (hasNext) {
    const next = pagination.locator('a[rel="next"], .next:not(.disabled)');
    await expect(next).toBeVisible();
  }
}
