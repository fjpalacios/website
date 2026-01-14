/**
 * Accessibility Tests with axe-core
 *
 * Comprehensive accessibility testing for all page types using axe-core.
 * Tests follow WCAG 2.1 Level AA standards.
 *
 * Coverage:
 * - All content type pages (books, tutorials, posts)
 * - All taxonomy pages (authors, publishers, genres, etc.)
 * - Static pages (home, about, feeds)
 * - Pagination
 * - Language switching
 * - Interactive elements (search, theme toggle, menu)
 *
 * @group e2e
 * @group accessibility
 * @group a11y
 */

import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

/**
 * Helper function to open search modal and wait for it to be ready
 * This handles the timing issues with Pagefind initialization
 */
async function openSearchModal(page: Page): Promise<void> {
  const searchButton = page.locator(".search-button");
  await searchButton.click();

  // Wait for modal to open (check visibility and aria-hidden attribute)
  const modal = page.locator(".search-modal");
  await modal.waitFor({ state: "visible", timeout: 10000 });
  await page.waitForFunction(
    () => {
      const modal = document.querySelector(".search-modal");
      return modal && modal.getAttribute("aria-hidden") === "false";
    },
    { timeout: 10000 },
  );

  // Wait for Pagefind UI to initialize (search input appears)
  const searchInput = page.locator(".pagefind-ui__search-input");
  await searchInput.waitFor({ state: "visible", timeout: 5000 });
}

test.describe("Accessibility Tests", () => {
  test.describe("Home Pages", () => {
    test("should not have accessibility violations on Spanish home page", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on English home page", async ({ page }) => {
      await page.goto("/en/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Content Type Pages - Books", () => {
    test("should not have accessibility violations on books listing page", async ({ page }) => {
      await page.goto("/es/libros/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on book detail page", async ({ page }) => {
      await page.goto("/es/libros/apocalipsis-de-stephen-king/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on paginated books page", async ({ page }) => {
      await page.goto("/es/libros/pagina/2/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Content Type Pages - Tutorials", () => {
    test("should not have accessibility violations on tutorials listing page", async ({ page }) => {
      await page.goto("/es/tutoriales/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on tutorial detail page", async ({ page }) => {
      await page.goto("/es/tutoriales/primeros-pasos-con-git/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Content Type Pages - Posts", () => {
    test("should not have accessibility violations on posts listing page", async ({ page }) => {
      await page.goto("/es/publicaciones/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on post detail page", async ({ page }) => {
      await page.goto("/es/publicaciones/de-ruby-a-javascript/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Taxonomy Pages - Authors", () => {
    test("should not have accessibility violations on authors listing page", async ({ page }) => {
      await page.goto("/es/autores/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on author detail page", async ({ page }) => {
      await page.goto("/es/autores/stephen-king/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Taxonomy Pages - Publishers", () => {
    test("should not have accessibility violations on publishers listing page", async ({ page }) => {
      await page.goto("/es/editoriales/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on publisher detail page", async ({ page }) => {
      await page.goto("/es/editoriales/penguin-random-house/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Taxonomy Pages - Genres", () => {
    test("should not have accessibility violations on genres listing page", async ({ page }) => {
      await page.goto("/es/generos/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on genre detail page", async ({ page }) => {
      await page.goto("/es/generos/terror/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Taxonomy Pages - Categories", () => {
    test("should not have accessibility violations on categories listing page", async ({ page }) => {
      await page.goto("/es/categorias/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on category detail page", async ({ page }) => {
      await page.goto("/es/categorias/tutoriales/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Taxonomy Pages - Series", () => {
    test("should not have accessibility violations on series listing page", async ({ page }) => {
      await page.goto("/es/series/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Taxonomy Pages - Challenges", () => {
    test("should not have accessibility violations on challenges listing page", async ({ page }) => {
      await page.goto("/es/retos/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on challenge detail page", async ({ page }) => {
      await page.goto("/es/retos/reto-lectura-2017/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Taxonomy Pages - Courses", () => {
    test("should not have accessibility violations on courses listing page", async ({ page }) => {
      await page.goto("/es/cursos/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on course detail page", async ({ page }) => {
      await page.goto("/es/cursos/master-git-desde-cero/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Static Pages", () => {
    test("should not have accessibility violations on about page", async ({ page }) => {
      await page.goto("/es/acerca-de/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on feeds page", async ({ page }) => {
      await page.goto("/es/feeds/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Interactive Elements", () => {
    test("should not have accessibility violations with menu open", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Open menu (if it's a hamburger menu)
      const menuButton = page.locator('[aria-label*="menu"], [aria-label*="menú"], .menu-toggle');
      if ((await menuButton.count()) > 0) {
        await menuButton.click();
        await page.waitForTimeout(300); // Wait for animation

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should not have accessibility violations with search modal open", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Open search - use .first() to get the button, not the close button
      const searchButton = page.locator('[aria-label*="earch"], [aria-label*="uscar"]').first();
      if ((await searchButton.count()) > 0) {
        await openSearchModal(page);
        await page.waitForTimeout(300); // Wait for modal to open

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should not have accessibility violations in dark theme", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Switch to dark theme
      const themeToggle = page.locator('[aria-label*="tema"], [aria-label*="theme"]');
      if ((await themeToggle.count()) > 0) {
        await themeToggle.click();
        await page.waitForTimeout(300);

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });

  test.describe("Specific WCAG Criteria", () => {
    test("should have sufficient color contrast", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).include("body").analyze();

      const contrastViolations = accessibilityScanResults.violations.filter((v) => v.id === "color-contrast");

      expect(contrastViolations).toEqual([]);
    });

    test("should have proper heading hierarchy", async ({ page }) => {
      await page.goto("/es/libros/apocalipsis-de-stephen-king/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).include("body").analyze();

      const headingViolations = accessibilityScanResults.violations.filter((v) => v.id.includes("heading"));

      expect(headingViolations).toEqual([]);
    });

    test("should have alt text on all images", async ({ page }) => {
      await page.goto("/es/libros/apocalipsis-de-stephen-king/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).include("body").analyze();

      const imageViolations = accessibilityScanResults.violations.filter((v) => v.id === "image-alt");

      expect(imageViolations).toEqual([]);
    });

    test("should have proper form labels", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Open search to test form - use .first() to get the button, not the close button
      const searchButton = page.locator('[aria-label*="earch"], [aria-label*="uscar"]').first();
      if ((await searchButton.count()) > 0) {
        await openSearchModal(page);
        await page.waitForTimeout(300);

        const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).include("body").analyze();

        const labelViolations = accessibilityScanResults.violations.filter(
          (v) => v.id === "label" || v.id === "label-title-only",
        );

        expect(labelViolations).toEqual([]);
      }
    });

    test("should have proper ARIA attributes", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .include("body")
        .analyze();

      const ariaViolations = accessibilityScanResults.violations.filter((v) => v.id.includes("aria"));

      expect(ariaViolations).toEqual([]);
    });

    test("should have keyboard accessible interactive elements", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).include("body").analyze();

      const keyboardViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === "focus-order-semantics" || v.id === "focusable-content",
      );

      expect(keyboardViolations).toEqual([]);
    });

    test("should have proper landmark regions", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).include("body").analyze();

      const landmarkViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === "landmark-one-main" || v.id === "region",
      );

      expect(landmarkViolations).toEqual([]);
    });

    test("should have proper HTML lang attribute", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).include("html").analyze();

      const langViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === "html-has-lang" || v.id === "html-lang-valid",
      );

      expect(langViolations).toEqual([]);
    });

    test("should have valid HTML structure", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).include("body").analyze();

      const htmlViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === "duplicate-id" || v.id === "duplicate-id-active" || v.id === "duplicate-id-aria",
      );

      expect(htmlViolations).toEqual([]);
    });
  });

  test.describe("Search Modal Accessibility", () => {
    test("should not have accessibility violations in search modal - dark theme", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Open search modal
      await openSearchModal(page);

      // Perform a search to show results
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("king");
      await page.waitForTimeout(1500); // Wait for search results

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .include(".search-modal")
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations in search modal - light theme", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Switch to light theme
      const themeToggle = page.locator(".theme-switcher");
      await themeToggle.click();
      await page.waitForTimeout(300); // Wait for theme transition

      // Open search modal
      await openSearchModal(page);

      // Perform a search to show results
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("king");
      await page.waitForTimeout(1000); // Wait for search results

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .include(".search-modal")
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should have proper ARIA attributes on search modal", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Check modal is hidden by default
      const modal = page.locator(".search-modal");
      await expect(modal).toHaveAttribute("aria-hidden", "true");

      // Open modal
      // Open search modal
      await openSearchModal(page);

      // Check modal is visible
      await expect(modal).toHaveAttribute("aria-hidden", "false");

      // Check search input has proper label
      const searchInput = page.locator(".pagefind-ui__search-input");
      const ariaLabel = await searchInput.getAttribute("aria-label");
      const placeholder = await searchInput.getAttribute("placeholder");
      expect(ariaLabel || placeholder).toBeTruthy();
    });

    test("should have sufficient color contrast in search modal - dark theme", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Open search modal
      await openSearchModal(page);

      // Perform a search
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("king");
      await page.waitForTimeout(1000);

      // Run contrast-only check
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2aa"])
        .include(".search-modal")
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter((v) => v.id === "color-contrast");

      expect(contrastViolations).toEqual([]);
    });

    test("should have sufficient color contrast in search modal - light theme", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Switch to light theme
      const themeToggle = page.locator(".theme-switcher");
      await themeToggle.click();
      await page.waitForTimeout(300);

      // Open search modal
      await openSearchModal(page);

      // Perform a search
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("king");
      await page.waitForTimeout(1000);

      // Run contrast-only check
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2aa"])
        .include(".search-modal")
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter((v) => v.id === "color-contrast");

      expect(contrastViolations).toEqual([]);
    });

    test("should be keyboard navigable", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Open search modal using keyboard shortcut
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");

      // Wait for modal to open
      await page.waitForSelector(".search-modal[aria-hidden='false']");

      // Check focus is on search input
      const searchInput = page.locator(".pagefind-ui__search-input");
      await expect(searchInput).toBeFocused({ timeout: 2000 });

      // Type search query
      await page.keyboard.type("king");
      await page.waitForTimeout(1000);

      // Tab through results
      await page.keyboard.press("Tab");

      // Close with Escape
      await page.keyboard.press("Escape");
      await page.waitForSelector(".search-modal[aria-hidden='true']", { state: "hidden" });

      // Modal should be closed
      const modal = page.locator(".search-modal");
      await expect(modal).toHaveAttribute("aria-hidden", "true");
    });

    test("should trap focus inside modal when open", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Open modal
      // Open search modal
      await openSearchModal(page);

      // Get all focusable elements inside modal
      const modalFocusableElements = page.locator(".search-modal button, .search-modal input, .search-modal a[href]");
      const count = await modalFocusableElements.count();

      // Focus should cycle within modal
      expect(count).toBeGreaterThan(0);

      // Tab through all elements
      for (let i = 0; i < count + 2; i++) {
        await page.keyboard.press("Tab");
        const activeElement = page.locator(":focus");
        const isInModal = await activeElement.evaluate((el) => {
          return el.closest(".search-modal") !== null;
        });
        expect(isInModal).toBe(true);
      }
    });

    test("should have visible focus indicators on all interactive elements", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Open modal
      // Open search modal
      await openSearchModal(page);

      // Perform search
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("king");
      await page.waitForTimeout(1000);

      // Check focus indicators with axe
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a"])
        .include(".search-modal")
        .analyze();

      const focusViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === "focus-order-semantics" || v.id === "focusable-content",
      );

      expect(focusViolations).toEqual([]);
    });

    test("should properly announce search results to screen readers", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Open modal
      // Open search modal
      await openSearchModal(page);

      // Perform search
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("king");
      await page.waitForTimeout(1000);

      // Check that results counter is visible and has text
      // Pagefind uses .pagefind-ui__message for the results count
      const resultsMessage = page.locator(".pagefind-ui__message");
      await expect(resultsMessage).toBeVisible();
      const messageText = await resultsMessage.textContent();
      expect(messageText).toContain("resultado");
    });

    test("should have proper heading structure in search results", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Open modal
      // Open search modal
      await openSearchModal(page);

      // Perform search
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("king");
      await page.waitForTimeout(1000);

      // Check heading structure
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a"])
        .include(".search-modal")
        .analyze();

      const headingViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === "heading-order" || v.id === "empty-heading",
      );

      expect(headingViolations).toEqual([]);
    });

    test("should have visible card boundaries in light theme", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Switch to light theme
      const themeToggle = page.locator(".theme-switcher");
      await themeToggle.click();
      await page.waitForTimeout(300);

      // Open modal
      // Open search modal
      await openSearchModal(page);

      // Perform search
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("king");
      await page.waitForTimeout(1000);

      // Get first result card
      const firstResult = page.locator(".pagefind-ui__result").first();
      await expect(firstResult).toBeVisible();

      // Check that border is visible (has border color and width)
      const borderStyle = await firstResult.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          borderWidth: styles.borderWidth,
          borderColor: styles.borderColor,
          borderStyle: styles.borderStyle,
        };
      });

      expect(borderStyle.borderWidth).not.toBe("0px");
      // border-style can be "solid" or "none solid" if different on each side
      expect(borderStyle.borderStyle).toContain("solid");
      expect(borderStyle.borderColor).not.toBe("rgba(0, 0, 0, 0)");
    });
  });

  test.describe("Mobile Accessibility", () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

    test("should not have accessibility violations on mobile home page", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should not have accessibility violations on mobile book detail", async ({ page }) => {
      await page.goto("/es/libros/apocalipsis-de-stephen-king/");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should have sufficient touch target sizes on mobile", async ({ page }) => {
      await page.goto("/es/");
      await page.waitForLoadState("networkidle");

      // Check interactive elements have minimum touch targets
      // Focus on primary interactive elements (buttons and navigation links)
      const buttons = page.locator("button, nav a, .language-switcher a, .theme-switcher");
      const count = await buttons.count();

      for (let i = 0; i < Math.min(count, 20); i++) {
        // Check first 20 elements
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          if (box) {
            // WCAG 2.1 Level AAA requires 44x44px minimum
            // Level AA requires 24x24px (for most elements)
            // We'll use 20px as a practical minimum for mobile devices
            const minDimension = Math.min(box.width, box.height);
            if (minDimension > 0) {
              const elementText = await button.textContent();
              const elementRole = await button.getAttribute("role");

              // WCAG 2.1 Level AA requires 24x24px minimum touch targets
              // We enforce 24px minimum for proper mobile accessibility
              expect(
                minDimension,
                `Element ${i}: "${elementText?.trim().substring(0, 30)}" (role: ${elementRole})`,
              ).toBeGreaterThanOrEqual(24);
            }
          }
        }
      }
    });
  });
});
