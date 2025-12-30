import { type Page, expect, test } from "@playwright/test";

/**
 * Helper function to wait for Pagefind to be ready and indexed
 */
async function waitForPagefindReady(page: Page) {
  // Wait for Pagefind library to load
  await page.waitForFunction(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return typeof (window as any).PagefindUI !== "undefined";
    },
    { timeout: 10000 },
  );

  // Additional wait for index to be ready
  await page.waitForTimeout(1500);
}

test.describe("Search Functionality", () => {
  test.describe("Search Modal", () => {
    test("should open search modal with keyboard shortcut (Cmd+K)", async ({ page }) => {
      await page.goto("/es/libros");

      // Wait for Pagefind to be ready
      await waitForPagefindReady(page);

      // Modal should be hidden initially
      const modal = page.locator("#searchModal");
      await expect(modal).toHaveAttribute("aria-hidden", "true");

      // Press Cmd+K (use Meta key for Mac, Control for others)
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");

      // Modal should be visible
      await expect(modal).toHaveAttribute("aria-hidden", "false");

      // Search input should be visible
      const searchInput = page.locator(".pagefind-ui__search-input");
      await expect(searchInput).toBeVisible();

      // Wait for automatic focus (TIMINGS.SEARCH_INPUT_FOCUS_MS = 300ms)
      // Use a longer timeout to account for Pagefind initialization
      await expect(searchInput).toBeFocused({ timeout: 2000 });
    });

    test("should open search modal with button click", async ({ page }) => {
      await page.goto("/es/libros");

      // Modal should be hidden initially
      const modal = page.locator("#searchModal");
      await expect(modal).toHaveAttribute("aria-hidden", "true");

      // Click search button in menu
      const searchButton = page.locator("#search-toggle");
      await expect(searchButton).toBeVisible();
      await searchButton.click();

      // Modal should be visible
      await expect(modal).toHaveAttribute("aria-hidden", "false");

      // Search input should be visible
      const searchInput = page.locator(".pagefind-ui__search-input");
      await expect(searchInput).toBeVisible();
    });

    test("should close search modal with ESC key", async ({ page }) => {
      await page.goto("/es/libros");

      // Open modal
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");
      const modal = page.locator("#searchModal");
      await expect(modal).toHaveAttribute("aria-hidden", "false");

      // Press ESC to close
      await page.keyboard.press("Escape");

      // Modal should be hidden
      await expect(modal).toHaveAttribute("aria-hidden", "true");
    });

    test("should close search modal with close button", async ({ page }) => {
      await page.goto("/es/libros");

      // Open modal
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");
      const modal = page.locator("#searchModal");
      await expect(modal).toHaveAttribute("aria-hidden", "false");

      // Click close button
      const closeButton = page.locator(".search-modal__close");
      await closeButton.click();

      // Modal should be hidden
      await expect(modal).toHaveAttribute("aria-hidden", "true");
    });

    test("should close search modal when clicking backdrop", async ({ page }) => {
      await page.goto("/es/libros");

      // Open modal
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");
      const modal = page.locator("#searchModal");
      await expect(modal).toHaveAttribute("aria-hidden", "false");

      // Click backdrop
      const backdrop = page.locator(".search-modal__backdrop");
      await backdrop.click();

      // Modal should be hidden
      await expect(modal).toHaveAttribute("aria-hidden", "true");
    });
  });

  test.describe("Search Results", () => {
    test("should show search results when typing in Spanish page", async ({ page }) => {
      await page.goto("/es/libros");

      // Wait for Pagefind to be ready
      await waitForPagefindReady(page);

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");

      // Wait for modal to be visible
      const modal = page.locator("#searchModal");
      await expect(modal).toHaveAttribute("aria-hidden", "false");

      // Type search query
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("Stephen King");

      // Wait for results to appear (using waitFor with proper timeout)
      const results = page.locator(".pagefind-ui__result");
      await expect(results.first()).toBeVisible({ timeout: 10000 });

      // Check if results appear
      const resultsCount = await results.count();

      // Should have at least 1 result
      expect(resultsCount).toBeGreaterThan(0);

      // Results should be in Spanish (check page URLs)
      const firstResult = results.first();
      const firstResultLink = firstResult.locator(".pagefind-ui__result-link");
      const href = await firstResultLink.getAttribute("href");

      // Spanish URLs should contain /es/
      expect(href).toContain("/es/");
    });

    test("should show search results when typing in English page", async ({ page }) => {
      await page.goto("/en/books");

      // Wait for Pagefind to be ready
      await waitForPagefindReady(page);

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");

      // Wait for modal to be visible
      const modal = page.locator("#searchModal");
      await expect(modal).toHaveAttribute("aria-hidden", "false");

      // Type search query
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("Stephen King");

      // Wait for results to appear (using waitFor with proper timeout)
      const results = page.locator(".pagefind-ui__result");
      await expect(results.first()).toBeVisible({ timeout: 10000 });

      // Check if results appear
      const resultsCount = await results.count();

      // Should have at least 1 result
      expect(resultsCount).toBeGreaterThan(0);

      // Results should be in English (check page URLs)
      const firstResult = results.first();
      const firstResultLink = firstResult.locator(".pagefind-ui__result-link");
      const href = await firstResultLink.getAttribute("href");

      // English URLs should contain /en/
      expect(href).toContain("/en/");
    });

    test("should show zero results message for non-existent query", async ({ page }) => {
      await page.goto("/es/libros");

      // Wait for Pagefind to be ready
      await waitForPagefindReady(page);

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");

      // Wait for modal to open and focus delay (TIMINGS.SEARCH_INPUT_FOCUS_MS = 300ms)
      await page.waitForTimeout(800);

      // Type non-existent query
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("xyzabc123nonexistent");

      // Wait for search to complete
      await page.waitForTimeout(3000);

      // Should show zero results message (in Spanish)
      const message = page.locator(".pagefind-ui__message");
      await expect(message).toContainText("No se encontraron resultados", { timeout: 10000 });
    });

    test("should navigate to result when clicking on it", async ({ page }) => {
      await page.goto("/es/libros");

      // Wait for Pagefind to be ready
      await waitForPagefindReady(page);

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");

      // Wait for modal to be visible
      const modal = page.locator("#searchModal");
      await expect(modal).toHaveAttribute("aria-hidden", "false");

      // Type search query
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("Stephen King");

      // Wait for results to appear
      const firstResult = page.locator(".pagefind-ui__result").first();
      await expect(firstResult).toBeVisible({ timeout: 10000 });

      // Get the link element
      const firstResultLink = firstResult.locator(".pagefind-ui__result-link");
      await expect(firstResultLink).toBeVisible();

      const href = await firstResultLink.getAttribute("href");

      // Ensure href is not null
      expect(href).not.toBeNull();

      // Store current URL to detect navigation
      const currentUrl = page.url();

      // Click the result
      await firstResultLink.click();

      // Wait for URL to change (with View Transitions this happens client-side)
      await page.waitForFunction((oldUrl) => window.location.href !== oldUrl, currentUrl, { timeout: 10000 });

      // Verify we navigated to the result page
      expect(page.url()).toContain(href || "");
    });
  });

  test.describe("Search UI Translations", () => {
    test("should show Spanish translations on Spanish pages", async ({ page }) => {
      await page.goto("/es/libros");

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");

      // Wait for Pagefind to initialize
      await page.waitForTimeout(1000);

      // Check placeholder text
      const searchInput = page.locator(".pagefind-ui__search-input");
      const placeholder = await searchInput.getAttribute("placeholder");
      expect(placeholder).toContain("Buscar");
    });

    test("should show English translations on English pages", async ({ page }) => {
      await page.goto("/en/books");

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");

      // Wait for Pagefind to initialize
      await page.waitForTimeout(1000);

      // Check placeholder text
      const searchInput = page.locator(".pagefind-ui__search-input");
      const placeholder = await searchInput.getAttribute("placeholder");
      expect(placeholder).toContain("Search");
    });
  });

  test.describe("Search Button Visibility", () => {
    test("should display search button in menu", async ({ page }) => {
      await page.goto("/es/libros");

      const searchButton = page.locator("#search-toggle");
      await expect(searchButton).toBeVisible();

      // Should have SVG icon
      const icon = searchButton.locator(".search-button__icon");
      await expect(icon).toBeVisible();
      // Verify it's an SVG element (not emoji)
      await expect(icon).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    });

    test("should have proper ARIA labels on search button", async ({ page }) => {
      await page.goto("/es/libros");

      const searchButton = page.locator("#search-toggle");

      // Should have aria-label
      const ariaLabel = await searchButton.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();

      // Should have title
      const title = await searchButton.getAttribute("title");
      expect(title).toBeTruthy();
    });
  });

  test.describe("Pagefind Assets Loading", () => {
    test("should load Pagefind CSS", async ({ page }) => {
      await page.goto("/es/libros");

      // Check if Pagefind CSS is loaded
      const stylesheets = await page
        .locator('link[rel="stylesheet"]')
        .evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));

      const pagefindCSS = stylesheets.find((href) => href.includes("/pagefind/pagefind-ui.css"));
      expect(pagefindCSS).toBeTruthy();
    });

    test("should load Pagefind JS", async ({ page }) => {
      await page.goto("/es/libros");

      // Check if Pagefind JS is loaded
      const scripts = await page
        .locator("script[src]")
        .evaluateAll((scripts) => scripts.map((script) => (script as HTMLScriptElement).src));

      const pagefindJS = scripts.find((src) => src.includes("/pagefind/pagefind-ui.js"));
      expect(pagefindJS).toBeTruthy();
    });

    test("should have PagefindUI available in window", async ({ page }) => {
      await page.goto("/es/libros");

      // Wait for script to load
      await page.waitForTimeout(1000);

      // Check if PagefindUI is available
      const hasPagefindUI = await page.evaluate(() => typeof window.PagefindUI !== "undefined");
      expect(hasPagefindUI).toBe(true);
    });
  });

  test.describe("Content Exclusion & Indexing", () => {
    test("should NOT show index/listing pages in search results", async ({ page }) => {
      await page.goto("/es/libros");

      // Wait for Pagefind to be ready
      await waitForPagefindReady(page);

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");

      // Wait for modal to be visible
      const modal = page.locator("#searchModal");
      await expect(modal).toHaveAttribute("aria-hidden", "false");

      // Search for "Stephen King" - should return book detail pages, not listing pages
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("Stephen King");

      // Wait for results to appear
      const results = page.locator(".pagefind-ui__result-link");
      await expect(results.first()).toBeVisible({ timeout: 10000 });

      // Get all result URLs
      const resultsCount = await results.count();

      // Should have results
      expect(resultsCount).toBeGreaterThan(0);

      // Check that none of the results are the main listing pages
      // (index pages that end with /libros/, /publicaciones/, /tutoriales/)
      for (let i = 0; i < resultsCount; i++) {
        const href = await results.nth(i).getAttribute("href");

        // Main listing/index pages should NOT appear (these have data-pagefind-ignore)
        const isMainListingPage =
          href === "/es/libros/" ||
          href === "/es/publicaciones/" ||
          href === "/es/tutoriales/" ||
          href === "/es/autores/" ||
          href === "/es/categorias/" ||
          href === "/es/generos/" ||
          href === "/es/editoriales/" ||
          href === "/es/series/" ||
          href === "/es/retos/" ||
          href === "/es/cursos/" ||
          href === "/en/books/" ||
          href === "/en/posts/" ||
          href === "/en/tutorials/" ||
          href === "/en/authors/" ||
          href === "/en/categories/" ||
          href === "/en/genres/" ||
          href === "/en/publishers/" ||
          href === "/en/series/" ||
          href === "/en/challenges/" ||
          href === "/en/courses/";

        expect(isMainListingPage).toBe(false);
      }
    });

    test("should NOT index JSON-LD schema URLs in listing pages", async ({ page }) => {
      await page.goto("/es/libros");

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");
      await page.waitForTimeout(1000);

      // Search for "ItemList" (a term that only appears in JSON-LD schemas)
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("ItemList schema");
      await page.waitForTimeout(1500);

      // Should show zero results (schema content in listing pages is inside data-pagefind-ignore)
      const message = page.locator(".pagefind-ui__message");
      const hasNoResults = (await message.textContent())?.includes("No se encontraron resultados");

      // Either shows no results or very few results (not from listing page schemas)
      const results = page.locator(".pagefind-ui__result");
      const resultsCount = await results.count();

      // Should have 0 results or the message should say no results
      expect(hasNoResults || resultsCount === 0).toBe(true);
    });

    test("should show correct title metadata for book pages", async ({ page }) => {
      await page.goto("/es/libros");

      // Wait for Pagefind to be ready
      await waitForPagefindReady(page);

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");
      await page.waitForTimeout(800);

      // Search for a known book
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("Stephen King");
      await page.waitForTimeout(3000);

      // Wait for results to appear
      await page.waitForSelector(".pagefind-ui__result-title", { timeout: 10000 });

      // Get first result title
      const firstResultTitle = page.locator(".pagefind-ui__result-title").first();
      const titleText = await firstResultTitle.textContent();

      // Title should NOT contain date (format: "Title - 01 ene. 2025")
      // Title metadata should be clean book title only
      expect(titleText).toBeTruthy();
      expect(titleText).not.toMatch(/\d{2}\s\w{3}\.\s\d{4}/); // Should not match "01 ene. 2025" pattern
    });

    test("should show correct title metadata for taxonomy pages", async ({ page }) => {
      await page.goto("/es/autores");

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");
      await page.waitForTimeout(1000);

      // Search for an author that has a detail page (not just books)
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("autor");
      await page.waitForTimeout(1500);

      // Get all results
      const results = page.locator(".pagefind-ui__result");
      const resultsCount = await results.count();

      if (resultsCount > 0) {
        // Check that at least one result has proper title
        const firstResultTitle = page.locator(".pagefind-ui__result-title").first();
        const titleText = await firstResultTitle.textContent();

        // Title should exist and be non-empty
        expect(titleText).toBeTruthy();
        expect(titleText?.trim().length).toBeGreaterThan(0);
      }
    });
  });

  test.describe("Search Edge Cases", () => {
    test("should handle special characters in search query", async ({ page }) => {
      await page.goto("/es/libros");

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");
      await page.waitForTimeout(1000);

      // Search with accents and special characters
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("José García");
      await page.waitForTimeout(1500);

      // Should either show results or zero results message (no crash)
      const hasResults = (await page.locator(".pagefind-ui__result").count()) > 0;
      const hasMessage = await page.locator(".pagefind-ui__message").isVisible();

      expect(hasResults || hasMessage).toBe(true);
    });

    test("should handle very long search queries", async ({ page }) => {
      await page.goto("/es/libros");

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");
      await page.waitForTimeout(1000);

      // Type very long query (100+ chars)
      const searchInput = page.locator(".pagefind-ui__search-input");
      const longQuery =
        "this is a very long search query that contains many words and should be handled gracefully by the search implementation without breaking";
      await searchInput.fill(longQuery);
      await page.waitForTimeout(1500);

      // Should show zero results message (not crash)
      const message = page.locator(".pagefind-ui__message");
      await expect(message).toBeVisible();
    });

    test("should handle empty search query", async ({ page }) => {
      await page.goto("/es/libros");

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");
      await page.waitForTimeout(1000);

      // Leave search empty (just focus input)
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.focus();
      await page.waitForTimeout(800);

      // Should not show any results or error (empty state)
      const results = page.locator(".pagefind-ui__result");
      const resultsCount = await results.count();
      expect(resultsCount).toBe(0);
    });

    test("should handle search with symbols and punctuation", async ({ page }) => {
      await page.goto("/es/libros");

      // Open search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");
      await page.waitForTimeout(1000);

      // Search with symbols
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("C++ programming!");
      await page.waitForTimeout(1500);

      // Should either show results or zero results message (no crash)
      const hasResults = (await page.locator(".pagefind-ui__result").count()) > 0;
      const hasMessage = await page.locator(".pagefind-ui__message").isVisible();

      expect(hasResults || hasMessage).toBe(true);
    });
  });

  test.describe("Search Persistence & Navigation", () => {
    test("should persist search functionality after view transitions", async ({ page }) => {
      await page.goto("/es/libros");

      // Wait for Pagefind to be ready
      await waitForPagefindReady(page);

      // Open search and perform search
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");

      // Wait for modal to be visible
      const modal = page.locator("#searchModal");
      await expect(modal).toHaveAttribute("aria-hidden", "false");

      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.fill("Stephen King");

      // Wait for results to appear
      const firstResultLink = page.locator(".pagefind-ui__result-link").first();
      await expect(firstResultLink).toBeVisible({ timeout: 10000 });

      // Store current URL to detect navigation
      const currentUrl = page.url();

      // Navigate by clicking first result
      await firstResultLink.click();

      // Wait for URL to change (View Transitions)
      await page.waitForFunction((oldUrl) => window.location.href !== oldUrl, currentUrl, { timeout: 10000 });

      // Try opening search again on new page (should work after Astro view transition)
      await page.keyboard.press(process.platform === "darwin" ? "Meta+KeyK" : "Control+KeyK");

      // Modal should open
      await expect(modal).toHaveAttribute("aria-hidden", "false", { timeout: 5000 });
    });
  });
});
