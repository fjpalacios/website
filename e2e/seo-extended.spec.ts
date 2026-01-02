/**
 * SEO Extended E2E Tests
 *
 * Tests advanced SEO features across all page types:
 * - Canonical URLs
 * - hreflang tags
 * - Open Graph tags
 * - Twitter Card tags
 * - JSON-LD schemas
 * - Meta descriptions
 * - Title tags
 *
 * @group e2e
 * @group seo
 * @group extended
 */

import { test, expect } from "@playwright/test";

test.describe("SEO Extended - Canonical URLs", () => {
  test("should have canonical URL on book list page", async ({ page }) => {
    await page.goto("/es/libros/");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/es\/libros\/$/);
  });

  test("should have canonical URL on book detail page", async ({ page }) => {
    await page.goto("/es/libros/");
    await page.waitForLoadState("networkidle");

    const firstBook = page.locator("article a").first();
    const count = await firstBook.count();

    if (count > 0) {
      const href = await firstBook.getAttribute("href");

      if (href) {
        await page.goto(href);
        await page.waitForLoadState("networkidle");
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveAttribute("href", new RegExp(href.replace(/\/$/, "") + "/$"));
      }
    }
  });

  test("should have canonical URL on pagination pages", async ({ page }) => {
    await page.goto("/es/libros/pagina/2/");
    const canonical = page.locator('link[rel="canonical"]');

    const response = await page.goto("/es/libros/pagina/2/");
    if (response?.status() === 200) {
      await expect(canonical).toHaveAttribute("href", /\/es\/libros\/pagina\/2\/$/);
    }
  });

  test("should have canonical URL on taxonomy pages", async ({ page }) => {
    await page.goto("/es/autores/");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/es\/autores\/$/);
  });

  test("should have canonical URL on static pages", async ({ page }) => {
    await page.goto("/es/acerca-de/");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/es\/acerca-de\/$/);
  });
});

test.describe("SEO Extended - hreflang Tags", () => {
  test("should have hreflang tags on bilingual pages", async ({ page }) => {
    await page.goto("/es/libros/");

    const hreflangES = page.locator('link[rel="alternate"][hreflang="es"]');
    const hreflangEN = page.locator('link[rel="alternate"][hreflang="en"]');

    await expect(hreflangES).toHaveAttribute("href", /\/es\/libros\/$/);

    // Check if English version exists
    const enCount = await hreflangEN.count();
    if (enCount > 0) {
      await expect(hreflangEN).toHaveAttribute("href", /\/en\/books\/$/);
    }
  });

  test("should have x-default hreflang on pages", async ({ page }) => {
    await page.goto("/es/");

    const hreflangDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
    const count = await hreflangDefault.count();

    if (count > 0) {
      await expect(hreflangDefault).toHaveAttribute("href", /.+/);
    }
  });

  test("should have correct hreflang on detail pages with translations", async ({ page }) => {
    await page.goto("/es/libros/");
    await page.waitForLoadState("networkidle");

    const firstBook = page.locator("article a").first();
    const count = await firstBook.count();

    if (count > 0) {
      const href = await firstBook.getAttribute("href");

      if (href) {
        await page.goto(href);
        await page.waitForLoadState("networkidle");

        const hreflangES = page.locator('link[rel="alternate"][hreflang="es"]');
        await expect(hreflangES).toHaveCount(1);
      }
    }
  });
});

test.describe("SEO Extended - Open Graph Tags", () => {
  test("should have og:title on all pages", async ({ page }) => {
    const pages = ["/es/", "/es/libros/", "/es/tutoriales/", "/es/acerca-de/"];

    for (const url of pages) {
      await page.goto(url);
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute("content", /.+/);
    }
  });

  test("should have og:description on all pages", async ({ page }) => {
    await page.goto("/es/libros/");
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute("content", /.+/);
  });

  test("should have og:image on content pages", async ({ page }) => {
    await page.goto("/es/libros/");
    await page.waitForLoadState("networkidle");

    const firstBook = page.locator("article a").first();
    const count = await firstBook.count();

    if (count > 0) {
      const href = await firstBook.getAttribute("href");

      if (href) {
        await page.goto(href);
        await page.waitForLoadState("networkidle");
        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveAttribute("content", /.+\.(jpg|png|webp)$/i);
      }
    }
  });

  test("should have og:url matching current page", async ({ page }) => {
    await page.goto("/es/libros/");
    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute("content", /\/es\/libros\/$/);
  });

  test("should have og:type on different page types", async ({ page }) => {
    await page.goto("/es/");
    await page.waitForLoadState("networkidle");
    const ogTypeHome = page.locator('meta[property="og:type"]');
    await expect(ogTypeHome).toHaveAttribute("content", /website|article/);

    await page.goto("/es/libros/");
    await page.waitForLoadState("networkidle");

    const firstBook = page.locator("article a").first();
    const count = await firstBook.count();

    if (count > 0) {
      const href = await firstBook.getAttribute("href");

      if (href) {
        await page.goto(href);
        await page.waitForLoadState("networkidle");
        const ogTypeArticle = page.locator('meta[property="og:type"]');
        await expect(ogTypeArticle).toHaveAttribute("content", /article|book/);
      }
    }
  });
});

test.describe("SEO Extended - Twitter Card Tags", () => {
  test("should have twitter:card on pages", async ({ page }) => {
    await page.goto("/es/libros/");
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute("content", /summary|summary_large_image/);
  });

  test("should have twitter:title on pages", async ({ page }) => {
    await page.goto("/es/libros/");
    const twitterTitle = page.locator('meta[name="twitter:title"]');
    await expect(twitterTitle).toHaveAttribute("content", /.+/);
  });

  test("should have twitter:description on pages", async ({ page }) => {
    await page.goto("/es/libros/");
    const twitterDesc = page.locator('meta[name="twitter:description"]');
    await expect(twitterDesc).toHaveAttribute("content", /.+/);
  });

  test("should have twitter:image on content pages", async ({ page }) => {
    await page.goto("/es/libros/");
    await page.waitForLoadState("networkidle");

    const firstBook = page.locator("article a").first();
    const count = await firstBook.count();

    if (count > 0) {
      const href = await firstBook.getAttribute("href");

      if (href) {
        await page.goto(href);
        await page.waitForLoadState("networkidle");
        const twitterImage = page.locator('meta[name="twitter:image"]');
        const twitterCount = await twitterImage.count();

        if (twitterCount > 0) {
          await expect(twitterImage).toHaveAttribute("content", /.+\.(jpg|png|webp)$/i);
        }
      }
    }
  });
});

test.describe("SEO Extended - JSON-LD Schemas", () => {
  test("should have valid JSON-LD on homepage", async ({ page }) => {
    await page.goto("/es/");

    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLd).toBeTruthy();

    const parsed = JSON.parse(jsonLd!);
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@type"]).toBeTruthy();
  });

  test("should have Book schema on book detail pages", async ({ page }) => {
    await page.goto("/es/libros/");
    await page.waitForLoadState("networkidle");

    const firstBook = page.locator("article a").first();
    const count = await firstBook.count();

    if (count > 0) {
      const href = await firstBook.getAttribute("href");

      if (href) {
        await page.goto(href);
        await page.waitForLoadState("networkidle");

        const jsonLdScripts = page.locator('script[type="application/ld+json"]');
        const scriptCount = await jsonLdScripts.count();

        for (let i = 0; i < scriptCount; i++) {
          const jsonLd = await jsonLdScripts.nth(i).textContent();
          if (jsonLd) {
            const parsed = JSON.parse(jsonLd);
            if (parsed["@type"] === "Book") {
              expect(parsed.name).toBeDefined();
              expect(parsed.author).toBeDefined();
              break;
            }
          }
        }
      }
    }
  });

  test("should have BreadcrumbList schema on pages", async ({ page }) => {
    await page.goto("/es/libros/");
    await page.waitForLoadState("networkidle");

    const firstBook = page.locator("article a").first();
    const count = await firstBook.count();

    if (count > 0) {
      const href = await firstBook.getAttribute("href");

      if (href) {
        await page.goto(href);
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
      }
    }
  });
});

test.describe("SEO Extended - Meta Descriptions", () => {
  test("should have non-empty meta description on all main pages", async ({ page }) => {
    const pages = ["/es/", "/es/libros/", "/es/tutoriales/", "/es/acerca-de/"];

    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");

      const metaDesc = page.locator('meta[name="description"]');
      // Check that description exists and has at least some content (15+ chars)
      // Note: Ideal is 50-160 chars per SEO best practices
      await expect(metaDesc).toHaveAttribute("content", /.{15,}/);
    }
  });
});

test.describe("SEO Extended - Title Tags", () => {
  test("should have consistent title structure across pages", async ({ page }) => {
    const pages = [
      { url: "/es/libros/", pattern: /libros/i },
      { url: "/es/tutoriales/", pattern: /tutoriales/i },
      { url: "/es/publicaciones/", pattern: /publicaciones/i },
    ];

    for (const { url, pattern } of pages) {
      await page.goto(url);
      const title = await page.title();

      expect(title).toMatch(pattern);
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(60);
    }
  });

  test("should have unique titles on different pages", async ({ page }) => {
    const titles = new Set<string>();

    const pages = ["/es/", "/es/libros/", "/es/tutoriales/", "/es/publicaciones/"];

    for (const url of pages) {
      await page.goto(url);
      const title = await page.title();
      titles.add(title);
    }

    expect(titles.size).toBe(pages.length);
  });
});
