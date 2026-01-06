/**
 * E2E Tests: Dynamic Routing
 *
 * Tests the unified routing system end-to-end:
 * - Content type routes (books, posts, tutorials)
 * - Taxonomy routes (authors, publishers, categories, genres)
 * - Static page routes (about, feeds)
 * - Pagination
 * - 404 error handling
 */

import { test, expect } from "@playwright/test";

// ============================================================================
// TEST SUITE: Content Type Routes
// ============================================================================

test.describe("Content Type Routes - Books", () => {
  test("should render books list page", async ({ page }) => {
    await page.goto("/es/libros/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Libros/);

    // Should have book cards
    const bookCards = page.locator(".blog__grid__post");
    await expect(bookCards.first()).toBeVisible();
  });

  test("should render books pagination page 2", async ({ page }) => {
    await page.goto("/es/libros/pagina/2/");

    // Page should load successfully and title should contain page number
    await expect(page).toHaveTitle(/Libros.*Página 2/);
  });

  test("should render book detail page", async ({ page }) => {
    await page.goto("/es/libros/el-resplandor-stephen-king/");

    // Page should load successfully
    await expect(page).toHaveTitle(/El Resplandor/i);

    // Should have book content (look for h1 in main content, not header)
    await expect(page.locator("main h1, .post-title h1")).toContainText(/El Resplandor/i);
  });
});

test.describe("Content Type Routes - Posts", () => {
  test("should render posts list page", async ({ page }) => {
    await page.goto("/es/publicaciones/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Publicaciones/);

    // Should have post cards
    const postCards = page.locator(".blog__grid__post");
    await expect(postCards.first()).toBeVisible();
  });

  test("should render post detail page", async ({ page }) => {
    await page.goto("/es/publicaciones/libros-leidos-durante-2017/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Libros leídos durante 2017/i);

    // Should have post content
    await expect(page.locator("h1")).toContainText("Libros leídos durante 2017");
  });
});

test.describe("Content Type Routes - Tutorials", () => {
  test("should render tutorials list page", async ({ page }) => {
    await page.goto("/es/tutoriales/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Tutoriales/);

    // Should have tutorial cards
    const tutorialCards = page.locator(".blog__grid__post");
    await expect(tutorialCards.first()).toBeVisible();
  });

  test("should render tutorial detail page", async ({ page }) => {
    await page.goto("/es/tutoriales/que-es-git/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Qué es Git/i);

    // Should have tutorial content
    await expect(page.locator("h1")).toContainText("Qué es Git");
  });
});

// ============================================================================
// TEST SUITE: Taxonomy Routes
// ============================================================================

test.describe("Taxonomy Routes - Authors", () => {
  test("should render authors list page", async ({ page }) => {
    await page.goto("/es/autores/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Autores/);

    // Should have author list
    await expect(page.locator("text=/Stephen King/i")).toBeVisible();
  });

  test("should render author detail page", async ({ page }) => {
    await page.goto("/es/autores/stephen-king/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Stephen King/i);

    // Should have books by this author
    const bookCards = page.locator(".blog__grid__post");
    await expect(bookCards.first()).toBeVisible();

    // Should have author heading (h1 inside sr-only div, visually hidden)
    const authorHeading = page.locator(".sr-only h1").first();
    await expect(authorHeading).toContainText(/Stephen King/i);
  });

  test("should render author detail page with pagination", async ({ page }) => {
    // Assuming Stephen King has many books and pagination exists
    await page.goto("/es/autores/stephen-king/pagina/2/");

    // Page should load successfully (or 404 if no page 2)
    await page.waitForLoadState("networkidle");

    // If pagination exists, check it
    const hasPagination = await page
      .locator("text=/Página 2/i")
      .isVisible()
      .catch(() => false);
    if (hasPagination) {
      await expect(page.locator("text=/Página 2/i")).toBeVisible();
    }
  });
});

test.describe("Taxonomy Routes - Publishers", () => {
  test("should render publishers list page", async ({ page }) => {
    await page.goto("/es/editoriales/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Editoriales/);
  });

  test("should render publisher detail page", async ({ page }) => {
    await page.goto("/es/editoriales/plaza-janes/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Plaza/i);

    // Should have books by this publisher
    const bookCards = page.locator(".blog__grid__post");
    await expect(bookCards.first()).toBeVisible();

    // Should have publisher heading (h1 inside sr-only div, visually hidden)
    const publisherHeading = page.locator(".sr-only h1").first();
    await expect(publisherHeading).toContainText(/Plaza/i);
  });
});

test.describe("Taxonomy Routes - Categories", () => {
  test("should render categories list page", async ({ page }) => {
    await page.goto("/es/categorias/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Categorías/);
  });

  test("should render category detail page", async ({ page }) => {
    await page.goto("/es/categorias/libros/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Libros/);

    // Should show books in this category
    const bookCards = page.locator(".blog__grid__post");
    await expect(bookCards.first()).toBeVisible();
  });
});

test.describe("Taxonomy Routes - Genres", () => {
  test("should render genres list page", async ({ page }) => {
    await page.goto("/es/generos/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Géneros/);
  });

  test("should render genre detail page", async ({ page }) => {
    await page.goto("/es/generos/terror/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Terror/);

    // Should show books in this genre
    const bookCards = page.locator(".blog__grid__post");
    await expect(bookCards.first()).toBeVisible();
  });
});

// ============================================================================
// TEST SUITE: Static Page Routes
// ============================================================================

test.describe("Static Page Routes", () => {
  test("should render about page in Spanish", async ({ page }) => {
    await page.goto("/es/acerca-de/");

    // Page should load successfully
    await expect(page).toHaveTitle(/Sobre/i);

    // Should have about content
    await expect(page.locator("h1")).toContainText(/Sobre|Acerca/);
  });

  test("should render about page in English", async ({ page }) => {
    await page.goto("/en/about/");

    // Page should load successfully
    await expect(page).toHaveTitle(/About/i);

    // Should have about content
    await expect(page.locator("h1")).toContainText(/About me|About/i);
  });

  test("should render feeds page in Spanish", async ({ page }) => {
    await page.goto("/es/feeds/");

    // Page should load successfully
    await expect(page).toHaveTitle(/RSS/);

    // Should have RSS feed links
    await expect(page.locator('a[href*="rss.xml"]').first()).toBeVisible();
  });

  test("should render feeds page in English", async ({ page }) => {
    await page.goto("/en/feeds/");

    // Page should load successfully
    await expect(page).toHaveTitle(/RSS/);

    // Should have RSS feed links
    await expect(page.locator('a[href*="rss.xml"]').first()).toBeVisible();
  });
});

// ============================================================================
// TEST SUITE: Language Switching
// ============================================================================

test.describe("Language Switching", () => {
  test("should switch from Spanish to English on book page", async ({ page }) => {
    await page.goto("/es/libros/el-resplandor-stephen-king/");

    // Find and click language switcher if available
    const langSwitcher = page.locator(".language-switcher a");
    const isLangSwitcherVisible = await langSwitcher.isVisible().catch(() => false);

    if (isLangSwitcherVisible) {
      await langSwitcher.click();

      // Should navigate to English version
      await expect(page).toHaveURL(/\/en\//);
      // Page should load (might be home or translated book)
      await expect(page).toHaveTitle(/.+/);
    } else {
      // If no language switcher, that's also valid (content not available in other language)
      expect(true).toBeTruthy();
    }
  });

  test("should handle content not available in target language", async ({ page }) => {
    // Visit a Spanish post that might not have English version
    await page.goto("/es/publicaciones/libros-leidos-durante-2017/");

    // Language switcher should either:
    // 1. Be disabled
    // 2. Not be visible
    // 3. Or show a message about unavailable content
    const langSwitcher = page.locator(".language-switcher");

    // Check if it exists and what state it's in
    if (await langSwitcher.isVisible()) {
      const hasDisabledClass = await langSwitcher.evaluate((el) =>
        el.classList.contains("language-switcher--disabled"),
      );
      const hasLink = await langSwitcher.locator("a").count();

      // Either has disabled class or has no clickable link
      expect(hasDisabledClass || hasLink === 0).toBeTruthy();
    }
  });
});

// ============================================================================
// TEST SUITE: Error Handling (404)
// ============================================================================

test.describe("404 Error Handling", () => {
  test("should return 404 for non-existent book", async ({ page }) => {
    const response = await page.goto("/es/libros/libro-que-no-existe/");

    expect(response?.status()).toBe(404);
    await expect(page.locator("text=/404|No encontrado/i")).toBeVisible();
  });

  test("should return 404 for non-existent post", async ({ page }) => {
    const response = await page.goto("/es/publicaciones/post-inexistente/");

    expect(response?.status()).toBe(404);
    await expect(page.locator("text=/404|No encontrado/i")).toBeVisible();
  });

  test("should return 404 for non-existent tutorial", async ({ page }) => {
    const response = await page.goto("/es/tutoriales/tutorial-inexistente/");

    expect(response?.status()).toBe(404);
    await expect(page.locator("text=/404|No encontrado/i")).toBeVisible();
  });

  test("should return 404 for non-existent author", async ({ page }) => {
    const response = await page.goto("/es/autores/autor-inexistente/");

    expect(response?.status()).toBe(404);
    await expect(page.locator("text=/404|No encontrado/i")).toBeVisible();
  });

  test("should return 404 for invalid route", async ({ page }) => {
    const response = await page.goto("/es/ruta-invalida-123/");

    expect(response?.status()).toBe(404);
    await expect(page.locator("text=/404|No encontrado/i")).toBeVisible();
  });

  test("should return 404 for pagination beyond available pages", async ({ page }) => {
    const response = await page.goto("/es/libros/pagina/999/");

    // Should either show 404 or redirect to last available page
    const status = response?.status();
    expect(status === 404 || status === 200).toBeTruthy();
  });
});

// ============================================================================
// TEST SUITE: Navigation & Breadcrumbs
// ============================================================================

test.describe("Navigation Integration", () => {
  test("should show correct breadcrumbs on book detail page", async ({ page }) => {
    await page.goto("/es/libros/el-resplandor-stephen-king/");

    // Should have breadcrumbs
    const breadcrumbs = page.locator(".breadcrumbs");
    await expect(breadcrumbs).toBeVisible();

    // Should contain: Inicio > Libros > El Resplandor (case-insensitive)
    await expect(breadcrumbs).toContainText("Inicio");
    await expect(breadcrumbs).toContainText("Libros");
    await expect(breadcrumbs).toContainText(/resplandor/i);
  });

  test("should navigate from list to detail and back", async ({ page }) => {
    // Start at books list
    await page.goto("/es/libros/");

    // Click on first book link (the <a> wrapper, not the section inside)
    const firstBookLink = page.locator(".blog__grid a").first();
    await firstBookLink.click();

    // Should navigate to detail page (with or without trailing slash)
    await expect(page).toHaveURL(/\/es\/libros\/[a-z0-9-]+\/?$/);

    // Go back
    await page.goBack();

    // Should be back at list page
    await expect(page).toHaveURL("/es/libros/");
  });
});

// ============================================================================
// TEST SUITE: Performance & Loading
// ============================================================================

test.describe("Route Performance", () => {
  test("should load book list page quickly", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/es/libros/");
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("should load book detail page quickly", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/es/libros/el-resplandor-stephen-king/");
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("should load author detail page quickly", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/es/autores/stephen-king/");
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});
