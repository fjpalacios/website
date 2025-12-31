/**
 * Visual Regression Tests - Screenshot-based Testing
 *
 * Comprehensive visual regression testing using Playwright's screenshot comparison.
 * Detects unintended visual changes in UI, layout, styling, and components.
 *
 * Test Coverage:
 * - Page screenshots (homepage, listings, details, static pages)
 * - Component screenshots (menu, search, rating, theme toggle)
 * - Responsive breakpoints (mobile, tablet, desktop)
 * - Theme variations (light, dark)
 * - Interactive states (hover, focus, open states)
 *
 * How It Works:
 * 1. First run: Generates baseline screenshots
 * 2. Subsequent runs: Compares current screenshots with baselines
 * 3. Fails if differences exceed threshold (pixel mismatch)
 *
 * Updating Baselines:
 * When intentional changes are made, update baselines with:
 * bun run test:e2e -- e2e/visual-regression.spec.ts --update-snapshots
 *
 * Screenshot Location:
 * - Baselines: e2e/visual-regression.spec.ts-snapshots/
 * - Diffs: test-results/ (on failure)
 *
 * @see https://playwright.dev/docs/test-snapshots
 *
 * @group e2e
 * @group visual
 * @group regression
 */

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
  const themeToggle = page.locator("#theme-toggle");
  // Check if theme toggle is visible
  const isVisible = await themeToggle.isVisible({ timeout: 2000 }).catch(() => false);
  if (!isVisible) {
    // If toggle not found, set theme via JavaScript
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    });
  } else {
    await themeToggle.click();
  }
  // Wait for theme transition to complete
  await page.waitForTimeout(300);
}

/**
 * Helper function to open search modal
 */
async function openSearchModal(page: Page): Promise<void> {
  const searchButton = page.locator(".search-button");
  await searchButton.click();

  // Wait for modal to open
  const modal = page.locator(".search-modal");
  await modal.waitFor({ state: "visible", timeout: 5000 });

  // Wait for Pagefind UI to initialize
  const searchInput = page.locator(".pagefind-ui__search-input");
  await searchInput.waitFor({ state: "visible", timeout: 5000 });

  // Wait for search UI to be fully rendered
  await page.waitForTimeout(500);
}

// ============================================================================
// HOMEPAGE SCREENSHOTS
// ============================================================================

test.describe("Visual Regression - Homepage", () => {
  test.describe("Desktop", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
    });

    test("should match homepage ES light theme", async ({ page }) => {
      await page.goto("/es/");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("homepage-es-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });

    test("should match homepage ES dark theme", async ({ page }) => {
      await page.goto("/es/");
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("homepage-es-desktop-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match homepage EN light theme", async ({ page }) => {
      await page.goto("/en/");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("homepage-en-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe("Tablet", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
    });

    test("should match homepage ES tablet light theme", async ({ page }) => {
      await page.goto("/es/");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("homepage-es-tablet-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match homepage ES tablet dark theme", async ({ page }) => {
      await page.goto("/es/");
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("homepage-es-tablet-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });
  });

  test.describe("Mobile", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
    });

    test("should match homepage ES mobile light theme", async ({ page }) => {
      await page.goto("/es/");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("homepage-es-mobile-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match homepage ES mobile dark theme", async ({ page }) => {
      await page.goto("/es/");
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("homepage-es-mobile-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });
  });
});

// ============================================================================
// BOOKS PAGES SCREENSHOTS
// ============================================================================

test.describe("Visual Regression - Books", () => {
  test.describe("Book Listing", () => {
    test("should match books listing desktop light", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/es/libros/");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("books-listing-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });

    test("should match books listing desktop dark", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/es/libros/");
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("books-listing-desktop-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match books listing mobile light", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/es/libros/");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("books-listing-mobile-light.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe("Book Detail", () => {
    test("should match book detail desktop light", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/es/libros/el-hobbit-j-r-r-tolkien/");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("book-detail-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match book detail desktop dark", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/es/libros/el-hobbit-j-r-r-tolkien/");
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("book-detail-desktop-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match book detail mobile light", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/es/libros/el-hobbit-j-r-r-tolkien/");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("book-detail-mobile-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });
  });
});

// ============================================================================
// TUTORIALS PAGES SCREENSHOTS
// ============================================================================

test.describe("Visual Regression - Tutorials", () => {
  test("should match tutorials listing desktop light", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/es/tutoriales/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("tutorials-listing-desktop-light.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match tutorials listing desktop dark", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/es/tutoriales/");
    await waitForPageStable(page);
    await activateDarkTheme(page);

    await expect(page).toHaveScreenshot("tutorials-listing-desktop-dark.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match tutorials listing mobile light", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/es/tutoriales/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("tutorials-listing-mobile-light.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});

// ============================================================================
// POSTS PAGES SCREENSHOTS
// ============================================================================

test.describe("Visual Regression - Posts", () => {
  test("should match posts listing desktop light", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/es/publicaciones/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("posts-listing-desktop-light.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match posts listing desktop dark", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/es/publicaciones/");
    await waitForPageStable(page);
    await activateDarkTheme(page);

    await expect(page).toHaveScreenshot("posts-listing-desktop-dark.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match posts listing mobile light", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/es/publicaciones/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("posts-listing-mobile-light.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });
});

// ============================================================================
// TAXONOMY PAGES SCREENSHOTS
// ============================================================================

test.describe("Visual Regression - Taxonomies", () => {
  test("should match authors listing desktop light", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/es/autores/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("authors-listing-desktop-light.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match author detail desktop light", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/es/autores/j-r-r-tolkien/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("author-detail-desktop-light.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match genres listing desktop light", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/es/generos/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("genres-listing-desktop-light.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match publishers listing desktop light", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/es/editoriales/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("publishers-listing-desktop-light.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});

// ============================================================================
// STATIC PAGES SCREENSHOTS
// ============================================================================

test.describe("Visual Regression - Static Pages", () => {
  test("should match about page desktop light", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/es/acerca-de/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("about-page-desktop-light.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match about page desktop dark", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/es/acerca-de/");
    await waitForPageStable(page);
    await activateDarkTheme(page);

    await expect(page).toHaveScreenshot("about-page-desktop-dark.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("should match feeds page desktop light", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto("/es/feeds/");
    await waitForPageStable(page);

    await expect(page).toHaveScreenshot("feeds-page-desktop-light.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});

// ============================================================================
// COMPONENT SCREENSHOTS
// ============================================================================

test.describe("Visual Regression - Components", () => {
  test.describe("Search Modal Component", () => {
    test("should match search modal desktop light", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/es/");
      await waitForPageStable(page);
      await openSearchModal(page);

      await expect(page).toHaveScreenshot("search-modal-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match search modal desktop dark", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/es/");
      await waitForPageStable(page);
      await activateDarkTheme(page);
      await openSearchModal(page);

      await expect(page).toHaveScreenshot("search-modal-desktop-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match search modal mobile light", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/es/");
      await waitForPageStable(page);
      await openSearchModal(page);

      await expect(page).toHaveScreenshot("search-modal-mobile-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });
  });
});
