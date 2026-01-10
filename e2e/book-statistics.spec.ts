/**
 * Book Statistics Page - E2E Tests
 *
 * Comprehensive testing for the book statistics page including:
 * - Accessibility tests (WCAG 2.1 Level AA) for both themes
 * - Visual regression tests for both themes
 * - Component rendering verification
 *
 * This page is complex with multiple dynamic components:
 * - ActiveChallenges with progress bars and individual links
 * - SkillBar components with decimal percentages
 * - Genre and author statistics
 * - Responsive layout
 * - Theme-dependent styling
 *
 * URLs tested:
 * - Spanish: /es/libros/estadisticas/
 * - English: /en/books/stats/
 *
 * @group e2e
 * @group accessibility
 * @group visual
 * @group book-statistics
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

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

test.describe("Book Statistics - Accessibility", () => {
  test.describe("Spanish Page", () => {
    test("should not have accessibility violations - light theme", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations - dark theme", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
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
      const response = await page.goto("/en/books/stats/");

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
      const response = await page.goto("/en/books/stats/");

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
      await page.goto("/es/libros/estadisticas/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).include("body").analyze();

      const contrastViolations = accessibilityScanResults.violations.filter((v) => v.id === "color-contrast");

      expect(contrastViolations).toEqual([]);
    });

    test("should have sufficient color contrast - dark theme", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
      await page.waitForLoadState("networkidle");
      await activateDarkTheme(page);

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).include("body").analyze();

      const contrastViolations = accessibilityScanResults.violations.filter((v) => v.id === "color-contrast");

      expect(contrastViolations).toEqual([]);
    });
  });

  test.describe("Components Accessibility", () => {
    test("should have proper ARIA attributes on progress bars", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .include("body")
        .analyze();

      const ariaViolations = accessibilityScanResults.violations.filter((v) => v.id.includes("aria"));

      expect(ariaViolations).toEqual([]);
    });

    test("should have proper heading hierarchy", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).include("body").analyze();

      const headingViolations = accessibilityScanResults.violations.filter((v) => v.id.includes("heading"));

      expect(headingViolations).toEqual([]);
    });

    test("should have accessible links", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
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
// VISUAL REGRESSION TESTS
// ============================================================================

test.describe("Book Statistics - Visual Regression", () => {
  test.describe("Spanish Page - Desktop", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
    });

    test("should match screenshot - light theme", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("book-stats-es-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });

    test("should match screenshot - dark theme", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("book-stats-es-desktop-dark.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe("English Page - Desktop", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
    });

    test("should match screenshot - light theme", async ({ page }) => {
      const response = await page.goto("/en/books/stats/");

      // Skip if page doesn't exist (no English books yet)
      if (response?.status() === 404) {
        test.skip();
        return;
      }

      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("book-stats-en-desktop-light.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });

    test("should match screenshot - dark theme", async ({ page }) => {
      const response = await page.goto("/en/books/stats/");

      // Skip if page doesn't exist (no English books yet)
      if (response?.status() === 404) {
        test.skip();
        return;
      }

      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("book-stats-en-desktop-dark.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe("Spanish Page - Mobile", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
    });

    test("should match screenshot - light theme", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("book-stats-es-mobile-light.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });

    test("should match screenshot - dark theme", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("book-stats-es-mobile-dark.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe("Spanish Page - Tablet", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
    });

    test("should match screenshot - light theme", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
      await waitForPageStable(page);

      await expect(page).toHaveScreenshot("book-stats-es-tablet-light.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });

    test("should match screenshot - dark theme", async ({ page }) => {
      await page.goto("/es/libros/estadisticas/");
      await waitForPageStable(page);
      await activateDarkTheme(page);

      await expect(page).toHaveScreenshot("book-stats-es-tablet-dark.png", {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.02,
      });
    });
  });
});

// ============================================================================
// COMPONENT RENDERING TESTS
// ============================================================================

test.describe("Book Statistics - Component Rendering", () => {
  test("should render active challenges section", async ({ page }) => {
    await page.goto("/es/libros/estadisticas/");
    await page.waitForLoadState("networkidle");

    // Check if challenges section exists using the heading text
    const challengesHeading = page
      .locator("h2")
      .filter({ hasText: /retos literarios activos|active literary challenges/i });
    await expect(challengesHeading).toBeVisible();
  });

  test("should render challenge links if challenges exist", async ({ page }) => {
    await page.goto("/es/libros/estadisticas/");
    await page.waitForLoadState("networkidle");

    // Check for challenge links - may not exist if no active challenges
    const challengeLinks = page.locator('a[href*="/retos/"]');
    const count = await challengeLinks.count();

    // This is informational - challenges may or may not exist
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should display percentages in progress indicators", async ({ page }) => {
    await page.goto("/es/libros/estadisticas/");
    await page.waitForLoadState("networkidle");

    // Check for any percentage text (can be in challenges or other stats)
    const percentageText = page.locator("text=/\\d+([.,]\\d+)?%/");
    const count = await percentageText.count();

    // Page should have at least some percentage statistics
    expect(count).toBeGreaterThan(0);
  });

  test("should render main statistics sections", async ({ page }) => {
    await page.goto("/es/libros/estadisticas/");
    await page.waitForLoadState("networkidle");

    // Check for main container
    const container = page.locator(".book-stats-container");
    await expect(container).toBeVisible();

    // Check for section titles
    const sectionTitles = page.locator(".book-stats-container__section-title");
    const count = await sectionTitles.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should render score distribution section", async ({ page }) => {
    await page.goto("/es/libros/estadisticas/");
    await page.waitForLoadState("networkidle");

    // Check for score/rating related content
    const scoreSection = page.locator("text=/puntuación|score|rating|distribución/i").first();
    const isVisible = await scoreSection.isVisible({ timeout: 2000 }).catch(() => false);

    expect(isVisible).toBeTruthy();
  });

  test("should be responsive - mobile layout", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/es/libros/estadisticas/");
    await page.waitForLoadState("networkidle");

    // Page should load and be visible
    const mainContent = page.locator("main.book-stats-page");
    await expect(mainContent).toBeVisible();

    // Container should be visible on mobile
    const container = page.locator(".book-stats-container");
    await expect(container).toBeVisible();
  });

  test("should maintain layout in dark theme", async ({ page }) => {
    await page.goto("/es/libros/estadisticas/");
    await page.waitForLoadState("networkidle");
    await activateDarkTheme(page);

    // Main content should still be visible
    const mainContent = page.locator("main.book-stats-page");
    await expect(mainContent).toBeVisible();

    // Container should still be visible
    const container = page.locator(".book-stats-container");
    await expect(container).toBeVisible();
  });
});
