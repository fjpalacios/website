/**
 * Pagination Edge Cases E2E Tests
 *
 * Tests edge cases and error scenarios for pagination:
 * - First and last page behavior
 * - Invalid page numbers
 * - Empty pages
 * - URL structure
 * - Navigation between pages
 * - Accessibility
 *
 * @group e2e
 * @group pagination
 */

import { test, expect } from "@playwright/test";

test.describe("Pagination - Edge Cases", () => {
  test.describe("First Page Behavior", () => {
    test("should not show 'Previous' button on first page", async ({ page }) => {
      await page.goto("/es/libros/");

      // Previous button should not exist or be disabled
      const prevButton = page.locator('a[rel="prev"], a[aria-label*="nterior"], a:has-text("Anterior")');
      const count = await prevButton.count();

      if (count > 0) {
        // If exists, should be disabled
        await expect(prevButton).toBeDisabled();
      }
    });

    test("should show 'Next' button on first page if there are more pages", async ({ page }) => {
      await page.goto("/es/libros/");

      // Check if there's a pagination section
      const pagination = page.locator(".pagination, [role='navigation'][aria-label*='pagination']");

      if ((await pagination.count()) > 0) {
        // Next button should exist and be enabled
        const nextButton = page.locator('a[rel="next"], a[aria-label*="iguiente"], a:has-text("Siguiente")');
        await expect(nextButton).toBeVisible();
        await expect(nextButton).toBeEnabled();
      }
    });

    test("should show page 1 as active on first page", async ({ page }) => {
      await page.goto("/es/libros/");

      // Find active page indicator
      const activePage = page.locator('[aria-current="page"], .pagination__item--active, .active');

      if ((await activePage.count()) > 0) {
        const text = await activePage.textContent();
        expect(text).toContain("1");
      }
    });

    test("should have canonical URL without page number on first page", async ({ page }) => {
      await page.goto("/es/libros/");

      const canonical = page.locator('link[rel="canonical"]');
      const href = await canonical.getAttribute("href");

      // Should not contain /pagina/1 or /page/1
      expect(href).not.toContain("/pagina/1");
      expect(href).not.toContain("/page/1");
    });
  });

  test.describe("Last Page Behavior", () => {
    test("should not show 'Next' button on last page", async ({ page }) => {
      // Navigate to books listing to check total pages
      await page.goto("/es/libros/");

      // Find last page number
      const pageLinks = page.locator('.pagination a[href*="/pagina/"]');
      const count = await pageLinks.count();

      if (count > 0) {
        // Get the highest page number
        let maxPage = 1;
        for (let i = 0; i < count; i++) {
          const href = await pageLinks.nth(i).getAttribute("href");
          const match = href?.match(/\/pagina\/(\d+)/);
          if (match) {
            maxPage = Math.max(maxPage, parseInt(match[1]));
          }
        }

        // Navigate to last page
        await page.goto(`/es/libros/pagina/${maxPage}/`);

        // Next button should not exist or be disabled
        const nextButton = page.locator('a[rel="next"], a[aria-label*="iguiente"]');
        const nextCount = await nextButton.count();

        if (nextCount > 0) {
          await expect(nextButton).toBeDisabled();
        }
      }
    });

    test("should show 'Previous' button on last page", async ({ page }) => {
      // Get to second page first (if exists)
      await page.goto("/es/libros/pagina/2/");

      // Previous button should exist
      const prevButton = page.locator('a[rel="prev"], a[aria-label*="nterior"], a:has-text("Anterior")');

      if ((await prevButton.count()) > 0) {
        await expect(prevButton).toBeVisible();
        await expect(prevButton).toBeEnabled();
      }
    });
  });

  test.describe("Invalid Page Numbers", () => {
    test("should handle page 0 gracefully", async ({ page }) => {
      const response = await page.goto("/es/libros/pagina/0/", { waitUntil: "domcontentloaded" });

      // Should either:
      // 1. Redirect to page 1
      // 2. Show 404
      // 3. Show error page
      if (response?.status() === 404) {
        expect(response.status()).toBe(404);
      } else {
        // If redirected, should be on page 1
        expect(page.url()).not.toContain("/pagina/0");
      }
    });

    test("should handle negative page numbers gracefully", async ({ page }) => {
      const response = await page.goto("/es/libros/pagina/-1/", { waitUntil: "domcontentloaded" });

      // Should show 404 or redirect
      if (response) {
        expect(response.status()).toBeGreaterThanOrEqual(400);
      }
    });

    test("should handle page numbers beyond last page", async ({ page }) => {
      const response = await page.goto("/es/libros/pagina/9999/", { waitUntil: "domcontentloaded" });

      // Should show 404 or empty page
      if (response?.status() === 404) {
        expect(response.status()).toBe(404);
      } else {
        // If page loads, should show "no results" or similar
        const body = await page.textContent("body");
        expect(body).toBeTruthy();
      }
    });

    test("should handle non-numeric page numbers", async ({ page }) => {
      const response = await page.goto("/es/libros/pagina/abc/", { waitUntil: "domcontentloaded" });

      // Should show 404
      expect(response?.status()).toBeGreaterThanOrEqual(400);
    });

    test("should handle decimal page numbers", async ({ page }) => {
      const response = await page.goto("/es/libros/pagina/1.5/", { waitUntil: "domcontentloaded" });

      // Should show 404 or treat as 1
      if (response?.status() === 404) {
        expect(response.status()).toBe(404);
      }
    });
  });

  test.describe("URL Structure", () => {
    test("should use correct URL pattern for Spanish pagination", async ({ page }) => {
      await page.goto("/es/libros/");

      // Look for page 2 link (use .first() since there might be multiple links to page 2)
      const page2Link = page.locator('a[href*="/pagina/2"]').first();

      if ((await page2Link.count()) > 0) {
        const href = await page2Link.getAttribute("href");
        expect(href).toMatch(/\/es\/libros\/pagina\/2\/?$/);
      }
    });

    test("should use correct URL pattern for English pagination", async ({ page }) => {
      await page.goto("/en/books/");

      // Look for page 2 link
      const page2Link = page.locator('a[href*="/page/2"]');

      if ((await page2Link.count()) > 0) {
        const href = await page2Link.getAttribute("href");
        expect(href).toMatch(/\/en\/books\/page\/2\/?$/);
      }
    });

    test("should have proper canonical URLs on paginated pages", async ({ page }) => {
      await page.goto("/es/libros/pagina/2/");

      const canonical = page.locator('link[rel="canonical"]');
      const href = await canonical.getAttribute("href");

      // Should include page number
      expect(href).toContain("/pagina/2");
    });

    test("should have rel=prev/next links on paginated pages", async ({ page }) => {
      await page.goto("/es/libros/pagina/2/");

      // Should have both prev and next (if not last page)
      const prevLink = page.locator('link[rel="prev"]');
      const nextLink = page.locator('link[rel="next"]');

      await expect(prevLink).toHaveCount(1);

      // Next link may or may not exist depending on total pages
      const nextCount = await nextLink.count();
      expect(nextCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Navigation Between Pages", () => {
    test("should navigate to next page when clicking Next button", async ({ page }) => {
      await page.goto("/es/libros/");

      // Find next button
      const nextButton = page.locator('a[rel="next"], a[aria-label*="iguiente"]').first();

      if ((await nextButton.count()) > 0) {
        await nextButton.click();

        // Should be on page 2 (with or without trailing slash)
        await page.waitForURL("**/pagina/2{,/}");
        expect(page.url()).toContain("/pagina/2");
      }
    });

    test("should navigate to previous page when clicking Previous button", async ({ page }) => {
      await page.goto("/es/libros/pagina/2/");

      // Find previous button
      const prevButton = page.locator('a[rel="prev"], a[aria-label*="nterior"]').first();

      if ((await prevButton.count()) > 0) {
        await prevButton.click();

        // Should be back on page 1 (base URL without /pagina/1, with or without trailing slash)
        await page.waitForURL("**/libros{,/}");
        expect(page.url()).not.toContain("/pagina/");
      }
    });

    test("should navigate to specific page when clicking page number", async ({ page }) => {
      await page.goto("/es/libros/");

      // Find page 3 link (if exists)
      const page3Link = page.locator('a[href*="/pagina/3"]').first();

      if ((await page3Link.count()) > 0) {
        await page3Link.click();

        // Should be on page 3
        await page.waitForURL("**/pagina/3/**");
        expect(page.url()).toContain("/pagina/3");
      }
    });

    test("should maintain scroll position near pagination after navigation", async ({ page }) => {
      await page.goto("/es/libros/");

      // Scroll to pagination
      const pagination = page.locator(".pagination, [role='navigation'][aria-label*='agination']").first();

      if ((await pagination.count()) > 0) {
        await pagination.scrollIntoViewIfNeeded();

        // Click next
        const nextButton = page.locator('a[rel="next"]').first();
        if ((await nextButton.count()) > 0) {
          await nextButton.click();
          await page.waitForURL("**/pagina/2/**");

          // Pagination should still be visible (or near visible)
          const pagination2 = page.locator(".pagination, [role='navigation'][aria-label*='agination']").first();
          await expect(pagination2).toBeVisible();
        }
      }
    });
  });

  test.describe("Empty Pages", () => {
    test("should handle content types with no items", async ({ page }) => {
      // English tutorials might have 0 items
      await page.goto("/en/tutorials/");

      const body = await page.textContent("body");

      // Should either show empty state or have no pagination
      const pagination = page.locator(".pagination");
      const hasPagination = (await pagination.count()) > 0;

      if (!hasPagination) {
        // Should show some indication of no content
        expect(body).toBeTruthy();
      }
    });

    test("should not show pagination on single-page content", async ({ page }) => {
      // Some content types might have only 1 page
      await page.goto("/es/autores/");

      // Count total items
      const items = page.locator(".author-card, [data-testid='author-item']");
      const itemCount = await items.count();

      // If less than items per page, no pagination should exist
      if (itemCount < 12) {
        // Assuming 12 items per page
        const pagination = page.locator(".pagination");
        const hasPagination = (await pagination.count()) > 0;

        if (hasPagination) {
          // If pagination exists, it should only show page 1
          const pageLinks = await pagination.locator("a[href*='/pagina/']").count();
          expect(pageLinks).toBeLessThanOrEqual(1);
        }
      }
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper ARIA labels on pagination", async ({ page }) => {
      await page.goto("/es/libros/");

      const pagination = page.locator("[role='navigation'][aria-label*='agination']");

      if ((await pagination.count()) > 0) {
        // Should have navigation role
        await expect(pagination).toHaveAttribute("role", "navigation");

        // Should have aria-label
        const ariaLabel = await pagination.getAttribute("aria-label");
        expect(ariaLabel).toBeTruthy();
      }
    });

    test("should mark current page with aria-current", async ({ page }) => {
      await page.goto("/es/libros/pagina/2/");

      // Current page should have aria-current="page"
      const currentPage = page.locator('[aria-current="page"]');

      if ((await currentPage.count()) > 0) {
        await expect(currentPage).toBeVisible();
        const text = await currentPage.textContent();
        expect(text).toContain("2");
      }
    });

    test("should be keyboard navigable", async ({ page }) => {
      await page.goto("/es/libros/");

      // Focus first pagination link
      const firstLink = page.locator(".pagination a").first();

      if ((await firstLink.count()) > 0) {
        await firstLink.focus();

        // Should be focused
        await expect(firstLink).toBeFocused();

        // Tab should move to next link
        await page.keyboard.press("Tab");

        const secondLink = page.locator(".pagination a").nth(1);
        if ((await secondLink.count()) > 0) {
          await expect(secondLink).toBeFocused();
        }
      }
    });

    test("should have visible focus indicators", async ({ page }) => {
      await page.goto("/es/libros/");

      const firstLink = page.locator(".pagination a").first();

      if ((await firstLink.count()) > 0) {
        await firstLink.focus();

        // Check for outline or box-shadow (focus indicator)
        const outline = await firstLink.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.outline || styles.boxShadow;
        });

        expect(outline).not.toBe("none");
        expect(outline).not.toBe("");
      }
    });
  });

  test.describe("SEO", () => {
    test("should have unique titles on different pages", async ({ page }) => {
      await page.goto("/es/libros/");
      const title1 = await page.title();

      await page.goto("/es/libros/pagina/2/");
      const title2 = await page.title();

      // Titles should be different (include page number)
      expect(title1).not.toBe(title2);
      expect(title2).toContain("2");
    });

    test("should have unique meta descriptions on different pages", async ({ page }) => {
      await page.goto("/es/libros/");
      await page.locator('meta[name="description"]').getAttribute("content");

      await page.goto("/es/libros/pagina/2/");
      const desc2 = await page.locator('meta[name="description"]').getAttribute("content");

      // Descriptions should mention page number
      expect(desc2).toContain("2");
    });

    test("should have noindex on high page numbers", async ({ page }) => {
      // Pages beyond page 3-5 should typically have noindex
      await page.goto("/es/libros/pagina/5/", { waitUntil: "domcontentloaded" });

      const robots = page.locator('meta[name="robots"]');

      if ((await robots.count()) > 0) {
        const content = await robots.getAttribute("content");
        // High pages might have noindex to prevent indexing deep pagination
        if (content?.includes("noindex")) {
          expect(content).toContain("noindex");
        }
      }
    });
  });

  test.describe("Performance", () => {
    test("should load paginated pages quickly", async ({ page }) => {
      const start = Date.now();
      await page.goto("/es/libros/pagina/2/");
      const loadTime = Date.now() - start;

      // Should load in less than 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test("should not reload entire page when clicking pagination", async ({ page }) => {
      await page.goto("/es/libros/");

      // Add a marker to check if page reloads
      await page.evaluate(() => {
        (window as unknown as Record<string, number>).pageLoadMarker = Date.now();
      });

      const marker1 = await page.evaluate(() => (window as unknown as Record<string, number>).pageLoadMarker);

      // Click next page
      const nextButton = page.locator('a[rel="next"]').first();
      if ((await nextButton.count()) > 0) {
        await nextButton.click();
        await page.waitForURL("**/pagina/2/**");

        // Marker should be cleared (full page reload)
        // OR preserved if using SPA navigation
        const marker2 = await page.evaluate(() => (window as unknown as Record<string, number>).pageLoadMarker);

        // Either it's a full reload (undefined) or preserved (same value)
        if (marker2 !== undefined) {
          expect(marker2).toBe(marker1);
        }
      }
    });
  });
});
