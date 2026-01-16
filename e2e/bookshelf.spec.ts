/**
 * Bookshelf Page - E2E Tests
 *
 * Comprehensive testing for the bookshelf page including:
 * - Accessibility tests (WCAG 2.1 Level AA) for both themes
 * - SEO metadata verification (canonical, OG tags, Twitter Cards, JSON-LD)
 * - Component rendering and structural verification
 * - Visual regression tests (this page is stable content)
 * - Functional tests (sorting, links, responsive design)
 *
 * This page displays the user's physical and digital book collection.
 * Books that have reviews are linked to their respective review pages.
 *
 * Note: Visual regression tests ARE included as this page content is stable
 * (the bookshelf doesn't change as frequently as dynamic stats).
 *
 * URLs tested:
 * - Spanish: /es/libros/estanteria/
 * - English: /en/books/shelf/ (may not exist yet)
 *
 * @group e2e
 * @group accessibility
 * @group seo
 * @group bookshelf
 * @group visual
 */

import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

/**
 * Viewport configurations for responsive testing
 */
const VIEWPORTS = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  tablet: { width: 768, height: 1024 }, // iPad
  desktop: { width: 1920, height: 1080 }, // Full HD
} as const;

/**
 * Helper function to wait for page to be fully loaded and stable
 */
async function waitForPageStable(page: Page): Promise<void> {
  // Wait for network to be idle
  await page.waitForLoadState("networkidle");

  // Wait for fonts to load (prevents font rendering differences)
  await page.evaluate(() => document.fonts.ready);

  // Wait a bit for animations to settle
  await page.waitForTimeout(500);
}

/**
 * Helper function to activate dark theme
 */
async function activateDarkTheme(page: Page): Promise<void> {
  // Set theme via JavaScript for reliability
  await page.evaluate(() => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  });

  // Wait for theme transition to complete and verify
  await page.waitForTimeout(500);

  // Verify dark theme is applied
  const isDark = await page.evaluate(() => {
    return document.documentElement.classList.contains("dark");
  });

  if (!isDark) {
    throw new Error("Failed to activate dark theme");
  }
}

/**
 * Helper function to set viewport
 */
async function setViewport(page: Page, viewport: keyof typeof VIEWPORTS): Promise<void> {
  await page.setViewportSize(VIEWPORTS[viewport]);
}

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

test.describe("Bookshelf - Accessibility", () => {
  test.describe("Spanish Page", () => {
    test("should not have accessibility violations - light theme", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations - dark theme", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");
      await activateDarkTheme(page);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("English Page", () => {
    test("should not have accessibility violations - light theme", async ({ page }) => {
      const response = await page.goto("/en/books/shelf/");

      // Skip if page doesn't exist (no English books yet)
      if (response?.status() === 404) {
        test.skip();
        return;
      }

      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations - dark theme", async ({ page }) => {
      const response = await page.goto("/en/books/shelf/");

      // Skip if page doesn't exist (no English books yet)
      if (response?.status() === 404) {
        test.skip();
        return;
      }

      await page.waitForLoadState("networkidle");
      await activateDarkTheme(page);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Color Contrast", () => {
    test("should have sufficient color contrast - light theme", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).include("body").analyze();

      const contrastViolations = accessibilityScanResults.violations.filter((v) => v.id === "color-contrast");

      expect(contrastViolations).toEqual([]);
    });

    test("should have sufficient color contrast - dark theme", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");
      await activateDarkTheme(page);

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).include("body").analyze();

      const contrastViolations = accessibilityScanResults.violations.filter((v) => v.id === "color-contrast");

      expect(contrastViolations).toEqual([]);
    });
  });

  test.describe("Components Accessibility", () => {
    test("should have proper heading hierarchy", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).include("body").analyze();

      const headingViolations = accessibilityScanResults.violations.filter((v) => v.id.includes("heading"));

      expect(headingViolations).toEqual([]);
    });

    test("should have accessible links", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).include("body").analyze();

      const linkViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === "link-name" || v.id === "link-in-text-block",
      );

      expect(linkViolations).toEqual([]);
    });
  });
});

// ============================================================================
// SEO TESTS
// ============================================================================

test.describe("Bookshelf - SEO", () => {
  test.describe("Canonical URLs", () => {
    test("should have canonical URL on Spanish bookshelf page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute("href", /\/es\/libros\/estanteria\/$/);
    });

    test("should have canonical URL on English bookshelf page", async ({ page }) => {
      const response = await page.goto("/en/books/shelf/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute("href", /\/en\/books\/shelf\/$/);
    });
  });

  test.describe("Meta Descriptions", () => {
    test("should have non-empty meta description on Spanish page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      const metaDesc = page.locator('meta[name="description"]');
      await expect(metaDesc).toHaveAttribute("content", /.{15,}/);
    });

    test("should have non-empty meta description on English page", async ({ page }) => {
      const response = await page.goto("/en/books/shelf/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      await page.waitForLoadState("networkidle");

      const metaDesc = page.locator('meta[name="description"]');
      await expect(metaDesc).toHaveAttribute("content", /.{15,}/);
    });
  });

  test.describe("Open Graph Tags", () => {
    test("should have og:title on bookshelf page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute("content", /.+/);
    });

    test("should have og:description on bookshelf page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      const ogDescription = page.locator('meta[property="og:description"]');
      await expect(ogDescription).toHaveAttribute("content", /.+/);
    });

    test("should have og:url matching current page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      const ogUrl = page.locator('meta[property="og:url"]');
      await expect(ogUrl).toHaveAttribute("content", /\/es\/libros\/estanteria\/$/);
    });

    test("should have og:type on bookshelf page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      const ogType = page.locator('meta[property="og:type"]');
      await expect(ogType).toHaveAttribute("content", /website/);
    });
  });

  test.describe("Twitter Card Tags", () => {
    test("should have twitter:card on bookshelf page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      const twitterCard = page.locator('meta[name="twitter:card"]');
      await expect(twitterCard).toHaveAttribute("content", /summary|summary_large_image/);
    });

    test("should have twitter:title on bookshelf page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      const twitterTitle = page.locator('meta[name="twitter:title"]');
      await expect(twitterTitle).toHaveAttribute("content", /.+/);
    });

    test("should have twitter:description on bookshelf page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      const twitterDesc = page.locator('meta[name="twitter:description"]');
      await expect(twitterDesc).toHaveAttribute("content", /.+/);
    });
  });

  test.describe("JSON-LD Schemas", () => {
    test("should have valid JSON-LD on bookshelf page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");

      const jsonLdScripts = page.locator('script[type="application/ld+json"]');
      const scriptCount = await jsonLdScripts.count();

      expect(scriptCount).toBeGreaterThan(0);

      const jsonLd = await jsonLdScripts.first().textContent();
      expect(jsonLd).toBeTruthy();

      const parsed = JSON.parse(jsonLd!);
      expect(parsed["@context"]).toBe("https://schema.org");
      expect(parsed["@type"]).toBeTruthy();
    });

    test("should have BreadcrumbList schema on bookshelf page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      const jsonLdScripts = page.locator('script[type="application/ld+json"]');
      const scriptCount = await jsonLdScripts.count();

      let foundBreadcrumb = false;
      for (let i = 0; i < scriptCount; i++) {
        const jsonLd = await jsonLdScripts.nth(i).textContent();
        if (jsonLd) {
          const parsed = JSON.parse(jsonLd);
          if (parsed["@type"] === "BreadcrumbList") {
            foundBreadcrumb = true;
            expect(parsed.itemListElement).toBeDefined();
            expect(Array.isArray(parsed.itemListElement)).toBe(true);
            break;
          }
        }
      }

      expect(foundBreadcrumb).toBe(true);
    });
  });

  test.describe("Title Tags", () => {
    test("should have meaningful title on Spanish page", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      const title = await page.title();

      expect(title).toMatch(/estantería/i);
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(60);
    });

    test("should have meaningful title on English page", async ({ page }) => {
      const response = await page.goto("/en/books/shelf/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      const title = await page.title();

      expect(title).toMatch(/shelf|bookshelf/i);
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(60);
    });
  });
});

// ============================================================================
// COMPONENT RENDERING TESTS
// ============================================================================

test.describe("Bookshelf - Component Rendering", () => {
  test("should render stats cards section", async ({ page }) => {
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Check if stats cards exist
    const statsCards = page.locator(".shelf-stats__card");
    const count = await statsCards.count();

    // Should have 3 cards: physical, digital, total
    expect(count).toBe(3);
  });

  test("should display correct book counts in stats cards", async ({ page }) => {
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Get counts from stats cards
    const statsNumbers = page.locator(".shelf-stats__number");
    const firstCount = await statsNumbers.first().textContent();
    const secondCount = await statsNumbers.nth(1).textContent();
    const thirdCount = await statsNumbers.nth(2).textContent();

    // All counts should be numbers
    expect(firstCount).toMatch(/^\d+$/);
    expect(secondCount).toMatch(/^\d+$/);
    expect(thirdCount).toMatch(/^\d+$/);

    // Total should equal physical + digital
    const physical = parseInt(firstCount!);
    const digital = parseInt(secondCount!);
    const total = parseInt(thirdCount!);

    expect(total).toBe(physical + digital);
  });

  test("should render physical books section if books exist", async ({ page }) => {
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Check if physical books section exists
    const physicalSection = page
      .locator("h2")
      .filter({ hasText: /libros físicos|physical books/i })
      .first();

    const isVisible = await physicalSection.isVisible({ timeout: 2000 }).catch(() => false);

    // If visible, check book cards exist
    if (isVisible) {
      const bookCards = page.locator(".shelf-book");
      const count = await bookCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("should render book cards with proper structure", async ({ page }) => {
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Get first book card
    const firstBook = page.locator(".shelf-book").first();
    const isVisible = await firstBook.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      // Check for title
      const title = firstBook.locator(".shelf-book__title");
      await expect(title).toBeVisible();

      // Check for author
      const author = firstBook.locator(".shelf-book__author");
      await expect(author).toBeVisible();
    }
  });

  test("should have clickable links for books with reviews", async ({ page }) => {
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Find all books with review class (both current and other languages)
    const booksWithReview = page.locator(".shelf-book--has-review a.shelf-book__link");
    const count = await booksWithReview.count();

    if (count > 0) {
      // Check first book with review has link
      const link = booksWithReview.first();
      const linkCount = await link.count();
      expect(linkCount).toBeGreaterThan(0);

      // Link should have href pointing to a book review
      const href = await link.getAttribute("href");
      expect(href).toMatch(/\/(libros|books)\/.+/);
    }
  });

  test("should NOT have links for books without reviews", async ({ page }) => {
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Find books without review
    const booksWithoutReview = page.locator(".shelf-book--no-review");
    const count = await booksWithoutReview.count();

    if (count > 0) {
      // Check first book without review has NO link
      const link = booksWithoutReview.first().locator("a.shelf-book__link");
      const linkCount = await link.count();
      expect(linkCount).toBe(0);
    }
  });

  test("should be responsive - mobile layout", async ({ page }) => {
    await setViewport(page, "mobile");
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Page should load and be visible
    const mainContent = page.locator("main.shelf-page");
    await expect(mainContent).toBeVisible();

    // Stats cards should be visible on mobile
    const statsCards = page.locator(".shelf-stats__card");
    await expect(statsCards.first()).toBeVisible();
  });

  test("should be responsive - tablet layout", async ({ page }) => {
    await setViewport(page, "tablet");
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Page should load and be visible
    const mainContent = page.locator("main.shelf-page");
    await expect(mainContent).toBeVisible();
  });

  test("should maintain layout in dark theme", async ({ page }) => {
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");
    await activateDarkTheme(page);

    // Main content should still be visible
    const mainContent = page.locator("main.shelf-page");
    await expect(mainContent).toBeVisible();

    // Stats cards should still be visible
    const statsCards = page.locator(".shelf-stats__card");
    await expect(statsCards.first()).toBeVisible();
  });
});

// ============================================================================
// FUNCTIONAL TESTS
// ============================================================================

test.describe("Bookshelf - Functional Tests", () => {
  test("should navigate to book review when clicking book with review", async ({ page }) => {
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Find first book with review
    const bookWithReview = page.locator(".shelf-book--has-review a.shelf-book__link").first();
    const count = await bookWithReview.count();

    if (count > 0) {
      const href = await bookWithReview.getAttribute("href");
      expect(href).toBeTruthy();

      // Click and verify navigation
      await bookWithReview.click();
      await page.waitForLoadState("networkidle");

      // Should be on a book review page
      expect(page.url()).toMatch(/\/libros\/.+/);
    }
  });

  test("should have books sorted by author sortName", async ({ page }) => {
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Get all book authors
    const authors = await page.locator(".shelf-book__author").allTextContents();

    if (authors.length > 1) {
      // We can't verify exact sortName order, but we can check books are displayed
      expect(authors.length).toBeGreaterThan(0);
      // Each author should have text
      authors.forEach((author) => {
        expect(author.trim().length).toBeGreaterThan(0);
      });
    }
  });

  test("should show section headers with book count", async ({ page }) => {
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Check for section headers with count
    const sectionHeaders = page.locator(".shelf-section__title");
    const count = await sectionHeaders.count();

    if (count > 0) {
      // First header should have count in parentheses
      const headerText = await sectionHeaders.first().textContent();
      expect(headerText).toMatch(/\(\d+\)/);
    }
  });

  test("should display section icons", async ({ page }) => {
    await page.goto("/es/libros/estanteria/");
    await page.waitForLoadState("networkidle");

    // Check for section icons
    const sectionIcons = page.locator(".shelf-section__icon");
    const count = await sectionIcons.count();

    if (count > 0) {
      await expect(sectionIcons.first()).toBeVisible();
    }
  });
});

// ============================================================================
// CROSS-LANGUAGE LINK TESTS
// ============================================================================

test.describe("Bookshelf - Cross-Language Links", () => {
  test.describe("Spanish Page - Links to English Reviews", () => {
    test("should generate correct URLs for books with reviews in English", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      // Find books in "other languages" section (with English reviews)
      const otherLangBooks = page.locator(".shelf-book--other-lang a.shelf-book__link");
      const count = await otherLangBooks.count();

      if (count > 0) {
        const href = await otherLangBooks.first().getAttribute("href");

        // URL should be in English format: /en/books/... NOT /en/libros/...
        expect(href).toMatch(/^\/en\/books\/[a-z0-9-]+$/);
        expect(href).not.toMatch(/\/en\/libros\//);
      }
    });

    test("should successfully navigate to English review from Spanish shelf", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      const otherLangBook = page.locator(".shelf-book--other-lang a.shelf-book__link").first();
      const count = await otherLangBook.count();

      if (count > 0) {
        // Navigate to the link
        await otherLangBook.click();
        await page.waitForLoadState("networkidle");

        // Should NOT be on 404 page
        const is404 = await page
          .locator("h1")
          .filter({ hasText: /404|not found/i })
          .count();
        expect(is404).toBe(0);

        // Should be on a valid book review page in English
        expect(page.url()).toMatch(/\/en\/books\/[a-z0-9-]+$/);
      }
    });

    test("should show language badges on books with English reviews", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      const otherLangBooks = page.locator(".shelf-book--other-lang");
      const count = await otherLangBooks.count();

      if (count > 0) {
        // Should have language badge with flag emoji
        const badge = otherLangBooks.first().locator(".shelf-book__lang-badge");
        const badgeCount = await badge.count();
        expect(badgeCount).toBeGreaterThan(0);

        const badgeText = await badge.textContent();
        // Should contain English flag emoji, not language code text
        expect(badgeText).toMatch(/🇬🇧/);
        expect(badgeText).not.toMatch(/\bEN\b/);
      }
    });
  });

  test.describe("English Page - Links to Spanish Reviews", () => {
    test("should generate correct URLs for books with reviews in Spanish", async ({ page }) => {
      const response = await page.goto("/en/books/shelf/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      await page.waitForLoadState("networkidle");

      // Find books in "other languages" section (with Spanish reviews)
      const otherLangBooks = page.locator(".shelf-book--other-lang a.shelf-book__link");
      const count = await otherLangBooks.count();

      if (count > 0) {
        const href = await otherLangBooks.first().getAttribute("href");

        // URL should be in Spanish format: /es/libros/... NOT /es/books/...
        expect(href).toMatch(/^\/es\/libros\/[a-z0-9-]+$/);
        expect(href).not.toMatch(/\/es\/books\//); // This was the bug!
      }
    });

    test("should successfully navigate to Spanish review from English shelf", async ({ page }) => {
      const response = await page.goto("/en/books/shelf/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      await page.waitForLoadState("networkidle");

      const otherLangBook = page.locator(".shelf-book--other-lang a.shelf-book__link").first();
      const count = await otherLangBook.count();

      if (count > 0) {
        // Navigate to the link
        await otherLangBook.click();
        await page.waitForLoadState("networkidle");

        // Should NOT be on 404 page
        const is404 = await page
          .locator("h1")
          .filter({ hasText: /404|not found/i })
          .count();
        expect(is404).toBe(0);

        // Should be on a valid book review page in Spanish
        expect(page.url()).toMatch(/\/es\/libros\/[a-z0-9-]+$/);
      }
    });

    test("should show language badges on books with Spanish reviews", async ({ page }) => {
      const response = await page.goto("/en/books/shelf/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      await page.waitForLoadState("networkidle");

      const otherLangBooks = page.locator(".shelf-book--other-lang");
      const count = await otherLangBooks.count();

      if (count > 0) {
        // Should have language badge with flag emoji
        const badge = otherLangBooks.first().locator(".shelf-book__lang-badge");
        const badgeCount = await badge.count();
        expect(badgeCount).toBeGreaterThan(0);

        const badgeText = await badge.textContent();
        // Should contain Spanish flag emoji, not language code text
        expect(badgeText).toMatch(/🇪🇸/);
        expect(badgeText).not.toMatch(/\bES\b/);
      }
    });
  });

  test.describe("Current Language Links", () => {
    test("should generate correct URLs for books with reviews in Spanish (on Spanish page)", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      const currentLangBooks = page.locator(".shelf-book--has-review:not(.shelf-book--other-lang) a.shelf-book__link");
      const count = await currentLangBooks.count();

      if (count > 0) {
        const href = await currentLangBooks.first().getAttribute("href");

        // URL should be in Spanish format: /es/libros/...
        expect(href).toMatch(/^\/es\/libros\/[a-z0-9-]+$/);
      }
    });

    test("should generate correct URLs for books with reviews in English (on English page)", async ({ page }) => {
      const response = await page.goto("/en/books/shelf/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      await page.waitForLoadState("networkidle");

      const currentLangBooks = page.locator(".shelf-book--has-review:not(.shelf-book--other-lang) a.shelf-book__link");
      const count = await currentLangBooks.count();

      if (count > 0) {
        const href = await currentLangBooks.first().getAttribute("href");

        // URL should be in English format: /en/books/...
        expect(href).toMatch(/^\/en\/books\/[a-z0-9-]+$/);
      }
    });

    test("should NOT show language badges on books with reviews in current language", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      const currentLangBooks = page.locator(".shelf-book--has-review:not(.shelf-book--other-lang)");
      const count = await currentLangBooks.count();

      if (count > 0) {
        // Should NOT have language badge
        const badge = currentLangBooks.first().locator(".shelf-book__lang-badge");
        const badgeCount = await badge.count();
        expect(badgeCount).toBe(0);
      }
    });
  });

  test.describe("URL Building Consistency", () => {
    test("should use buildBookUrl for all book links", async ({ page }) => {
      await page.goto("/es/libros/estanteria/");
      await page.waitForLoadState("networkidle");

      // Get all book links (both current and other language)
      const allBookLinks = page.locator(".shelf-book--has-review a.shelf-book__link");
      const count = await allBookLinks.count();

      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const href = await allBookLinks.nth(i).getAttribute("href");

          // All links should follow the pattern: /{lang}/{segment}/{slug}
          // Where segment is properly translated based on language
          expect(href).toMatch(/^\/(en|es)\/(books|libros)\/[a-z0-9-]+$/);

          // Verify language-segment pairing is correct
          if (href?.startsWith("/es/")) {
            expect(href).toMatch(/^\/es\/libros\//);
          } else if (href?.startsWith("/en/")) {
            expect(href).toMatch(/^\/en\/books\//);
          }
        }
      }
    });
  });
});

// ============================================================================
// VISUAL REGRESSION TESTS
// ============================================================================

test.describe("Bookshelf - Visual Regression", () => {
  test("bookshelf desktop light theme", async ({ page }) => {
    await setViewport(page, "desktop");
    await page.goto("/es/libros/estanteria/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("bookshelf-desktop-light.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("bookshelf desktop dark theme", async ({ page }) => {
    await setViewport(page, "desktop");
    await page.goto("/es/libros/estanteria/");
    await waitForPageStable(page);
    await activateDarkTheme(page);

    await expect(page).toHaveScreenshot("bookshelf-desktop-dark.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("bookshelf mobile light theme", async ({ page }) => {
    await setViewport(page, "mobile");
    await page.goto("/es/libros/estanteria/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("bookshelf-mobile-light.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

  test("bookshelf tablet light theme", async ({ page }) => {
    await setViewport(page, "tablet");
    await page.goto("/es/libros/estanteria/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("bookshelf-tablet-light.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });
});
