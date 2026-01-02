import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Pagination SEO Meta Tags
 *
 * Verifies that paginated pages have:
 * - Unique titles with page numbers
 * - Unique descriptions with page numbers
 * - Correct rel="prev" and rel="next" links
 * - Self-referencing canonical URLs
 * - Robots directives for deep pages (>5)
 *
 * Tests cover:
 * - Posts (mixed content: posts + tutorials + books)
 * - Books
 * - Tutorials
 * - Spanish and English languages
 */

test.describe("SEO Pagination Meta Tags", () => {
  test.describe("Posts - Spanish", () => {
    test("page 1 should have correct meta tags and next link only", async ({ page }) => {
      await page.goto("/es/publicaciones/");

      // Title should NOT include page number for page 1
      const title = await page.title();
      expect(title).toContain("Publicaciones");
      expect(title).not.toContain("Página");

      // Canonical URL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe("https://fjp.es/es/publicaciones/");

      // Should have next link (assuming there are multiple pages)
      const nextLink = await page.locator('link[rel="next"]').getAttribute("href");
      if (nextLink) {
        expect(nextLink).toBe("https://fjp.es/es/publicaciones/pagina/2/");
      }

      // Should NOT have prev link on page 1
      const prevLink = page.locator('link[rel="prev"]');
      await expect(prevLink).toHaveCount(0);

      // Should NOT have robots directive on page 1
      const robots = page.locator('meta[name="robots"]');
      await expect(robots).toHaveCount(0);
    });

    test("page 2 should have unique title and description with page number", async ({ page }) => {
      await page.goto("/es/publicaciones/pagina/2/");

      // Title should include page number
      const title = await page.title();
      expect(title).toContain("Publicaciones");
      expect(title).toContain("Página 2");

      // Description should include page number
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description).toContain("página 2");
    });

    test("page 2 should have correct prev/next links", async ({ page }) => {
      await page.goto("/es/publicaciones/pagina/2/");

      // Canonical URL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe("https://fjp.es/es/publicaciones/pagina/2/");

      // Should have prev link pointing to page 1 (base URL)
      const prevLink = await page.locator('link[rel="prev"]').getAttribute("href");
      expect(prevLink).toBe("https://fjp.es/es/publicaciones/");

      // Should have next link (if there are more pages)
      const nextLink = page.locator('link[rel="next"]');
      const nextCount = await nextLink.count();
      if (nextCount > 0) {
        const nextHref = await nextLink.getAttribute("href");
        expect(nextHref).toBe("https://fjp.es/es/publicaciones/pagina/3/");
      }

      // Should NOT have robots directive on page 2
      const robots = page.locator('meta[name="robots"]');
      await expect(robots).toHaveCount(0);
    });

    test("page 6 should have robots noindex, follow directive", async ({ page }) => {
      // Skip if there aren't enough pages
      const response = await page.goto("/es/publicaciones/pagina/6/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      // Should have robots directive for deep pagination
      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      expect(robots).toBe("noindex, follow");
    });
  });

  test.describe("Posts - English", () => {
    test("page 1 should have correct meta tags", async ({ page }) => {
      await page.goto("/en/posts/");

      // Title should NOT include page number
      const title = await page.title();
      expect(title).toContain("Posts");
      expect(title).not.toContain("Page");

      // Canonical URL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe("https://fjp.es/en/posts/");

      // Should NOT have prev link
      const prevLink = page.locator('link[rel="prev"]');
      await expect(prevLink).toHaveCount(0);
    });

    test("page 2 should have unique title with page number", async ({ page }) => {
      const response = await page.goto("/en/posts/page/2/");

      // Skip if page doesn't exist (not enough content yet)
      if (response?.status() === 404) {
        test.skip();
        return;
      }

      // Title should include page number
      const title = await page.title();
      expect(title).toContain("Posts");
      expect(title).toContain("Page 2");

      // Description should include page number
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description).toContain("page 2");
    });

    test("page 2 should have correct prev/next links", async ({ page }) => {
      const response = await page.goto("/en/posts/page/2/");

      // Skip if page doesn't exist (not enough content yet)
      if (response?.status() === 404) {
        test.skip();
        return;
      }

      // Should have prev link to page 1
      const prevLink = await page.locator('link[rel="prev"]').getAttribute("href");
      expect(prevLink).toBe("https://fjp.es/en/posts/");

      // Canonical URL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe("https://fjp.es/en/posts/page/2/");
    });
  });

  test.describe("Books - Spanish", () => {
    test("page 1 should have next link if multiple pages exist", async ({ page }) => {
      await page.goto("/es/libros/");

      // Check if there are multiple pages
      const nextLink = page.locator('link[rel="next"]');
      const nextCount = await nextLink.count();

      if (nextCount > 0) {
        const nextHref = await nextLink.getAttribute("href");
        expect(nextHref).toBe("https://fjp.es/es/libros/pagina/2/");
      }

      // Should NOT have prev link
      const prevLink = page.locator('link[rel="prev"]');
      await expect(prevLink).toHaveCount(0);
    });

    test("page 2 should have unique title and correct links", async ({ page }) => {
      const response = await page.goto("/es/libros/pagina/2/");

      // Skip if page doesn't exist (not enough content yet)
      if (response?.status() === 404) {
        test.skip();
        return;
      }

      // Title should include page number
      const title = await page.title();
      expect(title).toContain("Libros");
      expect(title).toContain("Página 2");

      // Should have prev link
      const prevLink = await page.locator('link[rel="prev"]').getAttribute("href");
      expect(prevLink).toBe("https://fjp.es/es/libros/");

      // Canonical URL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe("https://fjp.es/es/libros/pagina/2/");
    });
  });

  test.describe("Books - English", () => {
    test("page 1 should have correct canonical", async ({ page }) => {
      await page.goto("/en/books/");

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe("https://fjp.es/en/books/");

      // Should NOT have prev link
      const prevLink = page.locator('link[rel="prev"]');
      await expect(prevLink).toHaveCount(0);
    });

    test("page 2 should have English page number in title", async ({ page }) => {
      const response = await page.goto("/en/books/page/2/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      const title = await page.title();
      expect(title).toContain("Books");
      expect(title).toContain("Page 2");
    });
  });

  test.describe("Tutorials - Spanish", () => {
    test("page 1 should have correct meta tags", async ({ page }) => {
      await page.goto("/es/tutoriales/");

      const title = await page.title();
      expect(title).toContain("Tutoriales");

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe("https://fjp.es/es/tutoriales/");
    });

    test("page 2 should have correct pagination metadata", async ({ page }) => {
      const response = await page.goto("/es/tutoriales/pagina/2/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      // Title with page number
      const title = await page.title();
      expect(title).toContain("Página 2");

      // Prev link
      const prevLink = await page.locator('link[rel="prev"]').getAttribute("href");
      expect(prevLink).toBe("https://fjp.es/es/tutoriales/");

      // Canonical
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe("https://fjp.es/es/tutoriales/pagina/2/");
    });
  });

  test.describe("Tutorials - English", () => {
    test("page 1 should have correct canonical", async ({ page }) => {
      await page.goto("/en/tutorials/");

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe("https://fjp.es/en/tutorials/");
    });

    test("page 2 should use English translations", async ({ page }) => {
      const response = await page.goto("/en/tutorials/page/2/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      // Title should use "Page" not "Página"
      const title = await page.title();
      expect(title).toContain("Page 2");
      expect(title).not.toContain("Página");
    });
  });

  test.describe("Robots Directive for Deep Pagination", () => {
    test("pages 1-5 should NOT have robots directive", async ({ page }) => {
      // Test pages 1-5 (if they exist)
      const pagesToTest = [
        "/es/publicaciones/",
        "/es/publicaciones/pagina/2/",
        "/es/publicaciones/pagina/3/",
        "/es/publicaciones/pagina/4/",
        "/es/publicaciones/pagina/5/",
      ];

      for (const url of pagesToTest) {
        const response = await page.goto(url);

        // Skip if page doesn't exist
        if (response?.status() === 404) {
          continue;
        }

        const robots = page.locator('meta[name="robots"]');
        await expect(robots).toHaveCount(0);
      }
    });

    test("page 6+ should have robots noindex, follow", async ({ page }) => {
      const response = await page.goto("/es/publicaciones/pagina/6/");

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      expect(robots).toBe("noindex, follow");
    });
  });

  test.describe("Canonical URLs", () => {
    test("all pagination pages should have self-referencing canonical", async ({ page }) => {
      const urls = [
        { url: "/es/publicaciones/", expected: "https://fjp.es/es/publicaciones/" },
        { url: "/es/publicaciones/pagina/2/", expected: "https://fjp.es/es/publicaciones/pagina/2/" },
        { url: "/en/posts/", expected: "https://fjp.es/en/posts/" },
        { url: "/en/posts/page/2/", expected: "https://fjp.es/en/posts/page/2/" },
        { url: "/es/libros/", expected: "https://fjp.es/es/libros/" },
        { url: "/en/books/", expected: "https://fjp.es/en/books/" },
        { url: "/es/tutoriales/", expected: "https://fjp.es/es/tutoriales/" },
        { url: "/en/tutorials/", expected: "https://fjp.es/en/tutorials/" },
      ];

      for (const { url, expected } of urls) {
        const response = await page.goto(url);

        // Skip if page doesn't exist
        if (response?.status() === 404) {
          continue;
        }

        const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
        expect(canonical).toBe(expected);
      }
    });
  });
});
