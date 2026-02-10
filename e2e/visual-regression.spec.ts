/**
 * Visual Regression Tests - Hybrid Approach
 *
 * IMPORTANT: This file uses a HYBRID approach to visual testing:
 *
 * ✅ VISUAL TESTS (screenshots) for:
 *    - Static pages (404, About, Feeds)
 *    - UI Components (Header, Footer, Search Modal, Theme Toggle)
 *    - Specific content details (one book, one tutorial - won't change)
 *
 * ❌ NO VISUAL TESTS for:
 *    - Homepage (has "latest 5 books" - changes frequently)
 *    - Listing pages (books, tutorials, posts - content changes)
 *    - Taxonomy pages with dynamic content
 *    → These are tested with STRUCTURE TESTS in structure-dynamic-content.spec.ts
 *
 * Why this approach?
 * - Visual tests break every time content is added/changed
 * - Structure tests validate functionality without caring about exact pixels
 * - This approach keeps tests stable while maintaining quality
 *
 * See: docs/VISUAL_REGRESSION_STRATEGY.md
 *
 * @group e2e
 * @group visual
 * @group regression
 */

import { test, expect } from "@playwright/test";

import {
  VIEWPORTS,
  STABLE_CONTENT,
  waitForPageStable,
  activateDarkTheme,
  openSearchModal,
  setViewport,
} from "./helpers";

// ============================================================================
// STATIC PAGES - VISUAL TESTS
// ============================================================================

test.describe("Visual Regression - Static Pages", () => {
  test.describe("404 Page", () => {
    for (const [name] of Object.entries(VIEWPORTS)) {
      test(`404 page ${name}`, async ({ page }) => {
        await setViewport(page, name as keyof typeof VIEWPORTS);
        await page.goto("/this-page-does-not-exist");
        await waitForPageStable(page);

        // Stop the auto-redirect countdown interval and freeze the text
        // so the snapshot is deterministic regardless of timing
        await page.evaluate(() => {
          const el = document.getElementById("redirect-text");
          if (el) el.textContent = "";
        });

        await expect(page).toHaveScreenshot(`404-${name}.png`, {
          fullPage: true,
          animations: "disabled",
          mask: [page.locator("#redirect-text")],
        });
      });
    }
  });

  test.describe("About Page", () => {
    test("about page desktop light", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto("/es/acerca-de");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("about-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("about page desktop dark", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto("/es/acerca-de");
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("about-desktop-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("about page mobile", async ({ page }) => {
      await setViewport(page, "mobile");
      await page.goto("/es/acerca-de");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("about-mobile-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });
  });

  test.describe("Feeds Page", () => {
    test("feeds page desktop light", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto("/es/feeds");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("feeds-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });
  });
});

// ============================================================================
// SPECIFIC CONTENT PAGES - VISUAL TESTS
// These test ONE specific piece of content that won't change
// ============================================================================

test.describe("Visual Regression - Stable Content", () => {
  test.describe("Book Detail - Stable Example", () => {
    const bookUrl = STABLE_CONTENT.books.es.url;

    test("book detail desktop light", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto(bookUrl);
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("book-detail-stable-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });

    test("book detail desktop dark", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto(bookUrl);
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("book-detail-stable-desktop-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("book detail mobile", async ({ page }) => {
      await setViewport(page, "mobile");
      await page.goto(bookUrl);
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("book-detail-stable-mobile-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });
  });

  test.describe("Tutorial Detail - Stable Example", () => {
    const tutorialUrl = STABLE_CONTENT.tutorials.es.url;

    test("tutorial detail desktop light", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto(tutorialUrl);
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("tutorial-detail-stable-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });

    test("tutorial detail desktop dark", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto(tutorialUrl);
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("tutorial-detail-stable-desktop-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });
  });

  test.describe("Post Detail - Stable Example", () => {
    const postUrl = STABLE_CONTENT.posts.es.url;

    test("post detail desktop light", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto(postUrl);
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("post-detail-stable-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });

    test("post detail desktop dark", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto(postUrl);
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("post-detail-stable-desktop-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("post detail mobile", async ({ page }) => {
      await setViewport(page, "mobile");
      await page.goto(postUrl);
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("post-detail-stable-mobile-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });
  });
});

// ============================================================================
// UI COMPONENTS - VISUAL TESTS
// These components are static and should look consistent
// ============================================================================

test.describe("Visual Regression - UI Components", () => {
  test.describe("Header Component", () => {
    test("header desktop light", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto("/es");
      await waitForPageStable(page);

      const header = page.locator("header");
      await expect(header).toHaveScreenshot("header-desktop-light.png", {
        animations: "disabled",
      });
    });

    test("header desktop dark", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto("/es");
      await waitForPageStable(page);
      await activateDarkTheme(page);

      const header = page.locator("header");
      await expect(header).toHaveScreenshot("header-desktop-dark.png", {
        animations: "disabled",
      });
    });

    test("header mobile light", async ({ page }) => {
      await setViewport(page, "mobile");
      await page.goto("/es");
      await waitForPageStable(page);

      const header = page.locator("header");
      await expect(header).toHaveScreenshot("header-mobile-light.png", {
        animations: "disabled",
      });
    });
  });

  test.describe("Footer Component", () => {
    test("footer desktop light", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto("/es");
      await waitForPageStable(page);

      // Use main footer with .footer class (not section footers)
      const footer = page.locator("footer.footer");
      await expect(footer).toHaveScreenshot("footer-desktop-light.png", {
        animations: "disabled",
      });
    });

    test("footer desktop dark", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto("/es");
      await waitForPageStable(page);
      await activateDarkTheme(page);

      // Use main footer with .footer class (not section footers)
      const footer = page.locator("footer.footer");
      await expect(footer).toHaveScreenshot("footer-desktop-dark.png", {
        animations: "disabled",
      });
    });
  });

  test.describe("Search Modal Component", () => {
    test("search modal desktop light", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto("/es");
      await waitForPageStable(page);
      await openSearchModal(page);

      const modal = page.locator(".search-modal");
      await expect(modal).toHaveScreenshot("search-modal-desktop-light.png", {
        animations: "disabled",
      });
    });

    test("search modal desktop dark", async ({ page }) => {
      await setViewport(page, "desktop");
      await page.goto("/es");
      await waitForPageStable(page);
      await activateDarkTheme(page);
      await openSearchModal(page);

      const modal = page.locator(".search-modal");
      await expect(modal).toHaveScreenshot("search-modal-desktop-dark.png", {
        animations: "disabled",
      });
    });

    test("search modal mobile light", async ({ page }) => {
      await setViewport(page, "mobile");
      await page.goto("/es");
      await waitForPageStable(page);
      await openSearchModal(page);

      const modal = page.locator(".search-modal");
      await expect(modal).toHaveScreenshot("search-modal-mobile-light.png", {
        animations: "disabled",
      });
    });
  });
});

// ============================================================================
// HOMEPAGE - VISUAL TESTS WITH MASKING
// Mask dynamic "latest books" section, test static parts
// ============================================================================

test.describe("Visual Regression - Homepage (Partial)", () => {
  test("homepage hero section desktop", async ({ page }) => {
    await setViewport(page, "desktop");
    await page.goto("/es");
    await waitForPageStable(page);

    // Take screenshot but mask dynamic content
    await expect(page).toHaveScreenshot("homepage-hero-desktop.png", {
      fullPage: false, // Only above the fold
      animations: "disabled",
      mask: [page.locator(".latest-books, .recent-books").first(), page.locator(".book-card, article")],
    });
  });

  test("homepage static sections (no dynamic content)", async ({ page }) => {
    await setViewport(page, "desktop");
    await page.goto("/es");
    await waitForPageStable(page);

    // Test header + hero only (static parts)
    await expect(page).toHaveScreenshot("homepage-static-sections.png", {
      fullPage: false,
      animations: "disabled",
      clip: { x: 0, y: 0, width: 1920, height: 800 }, // Above the fold
      mask: [page.locator(".latest-books, .book-card")],
    });
  });
});

// ============================================================================
// LISTING PAGES - COMPONENT-LEVEL VISUAL TESTS
// Don't test full page (content changes), only UI chrome
// ============================================================================

test.describe("Visual Regression - Listing Page Chrome", () => {
  test("books listing header and navigation", async ({ page }) => {
    await setViewport(page, "desktop");
    await page.goto("/es/libros");
    await waitForPageStable(page);

    // Test page header/title area only (not the book grid)
    const headerArea = page.locator("main > :not(.book-grid)").first();
    await expect(headerArea).toHaveScreenshot("listing-header.png", {
      animations: "disabled",
    });
  });

  test("pagination component", async ({ page }) => {
    await setViewport(page, "desktop");
    await page.goto("/es/libros");
    await waitForPageStable(page);

    // Test pagination UI if it exists
    const pagination = page.locator(".pagination, .paginator");
    const exists = await pagination.isVisible().catch(() => false);

    if (exists) {
      await expect(pagination).toHaveScreenshot("pagination-component.png", {
        animations: "disabled",
      });
    }
  });
});

// ============================================================================
// THEME TOGGLE - VISUAL TESTS
// ============================================================================

test.describe("Visual Regression - Theme Toggle", () => {
  test("theme toggle light mode", async ({ page }) => {
    await setViewport(page, "desktop");
    await page.goto("/es");
    await waitForPageStable(page);

    const toggle = page.locator("#theme-toggle, .theme-toggle");
    await expect(toggle).toHaveScreenshot("theme-toggle-light.png", {
      animations: "disabled",
    });
  });

  test("theme toggle dark mode", async ({ page }) => {
    await setViewport(page, "desktop");
    await page.goto("/es");
    await waitForPageStable(page);
    await activateDarkTheme(page);

    const toggle = page.locator("#theme-toggle, .theme-toggle");
    await expect(toggle).toHaveScreenshot("theme-toggle-dark.png", {
      animations: "disabled",
    });
  });
});

// ============================================================================
// LANGUAGE SWITCHER - VISUAL TESTS
// ============================================================================

test.describe("Visual Regression - Language Switcher", () => {
  test("language switcher enabled state", async ({ page }) => {
    await setViewport(page, "desktop");
    await page.goto("/es");
    await waitForPageStable(page);

    const switcher = page.locator(".language-switcher");
    await expect(switcher).toHaveScreenshot("language-switcher-enabled.png", {
      animations: "disabled",
    });
  });

  test("language switcher disabled state", async ({ page }) => {
    await setViewport(page, "desktop");
    // Go to page without translation
    await page.goto("/es/libros");
    await waitForPageStable(page);

    const switcher = page.locator(".language-switcher");
    const isDisabled = await switcher.isDisabled();

    if (isDisabled) {
      await expect(switcher).toHaveScreenshot("language-switcher-disabled.png", {
        animations: "disabled",
      });
    }
  });
});
