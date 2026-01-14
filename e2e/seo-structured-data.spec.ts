import { test, expect, type Page, type Response } from "@playwright/test";

/**
 * Helper to check if a page exists
 */
async function pageExists(page: Page, url: string): Promise<boolean> {
  const response: Response | null = await page.goto(url);
  return response?.status() !== 404;
}

test.describe("SEO Structured Data - Content Pages", () => {
  test.describe("Book Pages - JSON-LD Schema", () => {
    test("should have Book schema with review on Spanish book page", async ({ page }) => {
      await page.goto("/es/libros/apocalipsis-de-stephen-king/");

      // Find all JSON-LD scripts (there will be multiple: Person + Book)
      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
      expect(jsonLdScripts.length).toBeGreaterThan(1);

      // Find the Book schema (not the Person schema)
      let bookSchema = null;
      for (const script of jsonLdScripts) {
        const content = await script.textContent();
        const schema = JSON.parse(content!);
        if (schema["@type"] === "Book") {
          bookSchema = schema;
          break;
        }
      }

      // Validate Book schema exists and has correct structure
      expect(bookSchema).toBeTruthy();
      expect(bookSchema!["@context"]).toBe("https://schema.org");
      expect(bookSchema!["@type"]).toBe("Book");
      expect(bookSchema!.name).toBeTruthy();
      expect(bookSchema!.author).toBeTruthy();
      expect(bookSchema!.author["@type"]).toBe("Person");
      expect(bookSchema!.inLanguage).toBe("es");

      // Validate review structure
      expect(bookSchema!.review).toBeTruthy();
      expect(bookSchema!.review["@type"]).toBe("Review");
      expect(bookSchema!.review.reviewRating).toBeTruthy();
      expect(bookSchema!.review.reviewRating["@type"]).toBe("Rating");
      expect(bookSchema!.review.reviewRating.ratingValue).toBeGreaterThan(0);
      expect(bookSchema!.review.reviewRating.bestRating).toBe(5);
      expect(bookSchema!.review.datePublished).toBeTruthy();
    });

    test("should have Book schema on English book page", async ({ page }) => {
      // Skip if English book pages don't exist
      const exists = await pageExists(page, "/en/books/the-stand-stephen-king/");
      if (!exists) {
        test.skip();
        return;
      }

      await page.goto("/en/books/the-stand-stephen-king/");

      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
      let bookSchema = null;
      for (const script of jsonLdScripts) {
        const content = await script.textContent();
        const schema = JSON.parse(content!);
        if (schema["@type"] === "Book") {
          bookSchema = schema;
          break;
        }
      }

      expect(bookSchema).toBeTruthy();
      expect(bookSchema!.inLanguage).toBe("en");
    });

    test("should have og:type=book on book pages", async ({ page }) => {
      await page.goto("/es/libros/apocalipsis-de-stephen-king/");

      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "book");
    });
  });

  test.describe("Post Pages - JSON-LD Schema", () => {
    test("should have BlogPosting schema on Spanish post page", async ({ page }) => {
      await page.goto("/es/publicaciones/libros-leidos-durante-2017/");

      // Find the BlogPosting schema
      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
      let articleSchema = null;
      for (const script of jsonLdScripts) {
        const content = await script.textContent();
        const schema = JSON.parse(content!);
        if (schema["@type"] === "BlogPosting") {
          articleSchema = schema;
          break;
        }
      }

      expect(articleSchema).toBeTruthy();
      expect(articleSchema!["@context"]).toBe("https://schema.org");
      expect(articleSchema!["@type"]).toBe("BlogPosting");
      expect(articleSchema!.headline).toBeTruthy();
      expect(articleSchema!.description).toBeTruthy();
      expect(articleSchema!.datePublished).toBeTruthy();
      expect(articleSchema!.author["@type"]).toBe("Person");
      expect(articleSchema!.inLanguage).toBe("es");
    });

    test("should have og:type=article on post pages", async ({ page }) => {
      await page.goto("/es/publicaciones/libros-leidos-durante-2017/");

      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    });
  });

  test.describe("Tutorial Pages - JSON-LD Schema", () => {
    test("should have TechArticle schema on Spanish tutorial page", async ({ page }) => {
      await page.goto("/es/tutoriales/que-es-git/");

      // Find the TechArticle schema
      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
      let tutorialSchema = null;
      for (const script of jsonLdScripts) {
        const content = await script.textContent();
        const schema = JSON.parse(content!);
        if (schema["@type"] === "TechArticle") {
          tutorialSchema = schema;
          break;
        }
      }

      expect(tutorialSchema).toBeTruthy();
      expect(tutorialSchema!["@context"]).toBe("https://schema.org");
      expect(tutorialSchema!["@type"]).toBe("TechArticle");
      expect(tutorialSchema!.headline).toBeTruthy();
      expect(tutorialSchema!.description).toBeTruthy();
      expect(tutorialSchema!.datePublished).toBeTruthy();
      expect(tutorialSchema!.inLanguage).toBe("es");
    });

    test("should have og:type=article on tutorial pages", async ({ page }) => {
      await page.goto("/es/tutoriales/que-es-git/");

      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    });
  });

  test.describe("Canonical URLs", () => {
    test("should have canonical URL on book page", async ({ page }) => {
      await page.goto("/es/libros/apocalipsis-de-stephen-king/");

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute("href", "https://fjp.es/es/libros/apocalipsis-de-stephen-king/");
    });

    test("should have canonical URL on post page", async ({ page }) => {
      await page.goto("/es/publicaciones/libros-leidos-durante-2017/");

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute("href", "https://fjp.es/es/publicaciones/libros-leidos-durante-2017/");
    });
  });

  test.describe("Hreflang Tags", () => {
    test("should have hreflang tags on pages with translations", async ({ page }) => {
      await page.goto("/es/acerca-de/");

      const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
      const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');

      await expect(hreflangEs).toHaveAttribute("href", "https://fjp.es/es/acerca-de/");
      await expect(hreflangEn).toHaveAttribute("href", "https://fjp.es/en/about/");
    });

    test("should have hreflang tags on translated book pages", async ({ page }) => {
      await page.goto("/es/libros/apocalipsis-de-stephen-king/");

      const hreflangTags = page.locator('link[rel="alternate"][hreflang]');
      const count = await hreflangTags.count();

      // Should have at least Spanish hreflang (and English if translation exists)
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe("Open Graph Locale", () => {
    test("should have og:locale=es_ES on Spanish pages", async ({ page }) => {
      await page.goto("/es/");

      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "es_ES");
    });

    test("should have og:locale=en_US on English pages", async ({ page }) => {
      await page.goto("/en/");

      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_US");
    });
  });

  test.describe("Twitter Cards", () => {
    test("should have Twitter username on all pages", async ({ page }) => {
      await page.goto("/es/");

      await expect(page.locator('meta[name="twitter:site"]')).toHaveAttribute("content", "@fjpalacios");
    });

    test("should use summary_large_image card type", async ({ page }) => {
      await page.goto("/es/libros/apocalipsis-de-stephen-king/");

      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    });
  });

  test.describe("Image URLs", () => {
    test("should use absolute URLs for OG images", async ({ page }) => {
      await page.goto("/es/libros/apocalipsis-de-stephen-king/");

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(ogImage).toMatch(/^https?:\/\//);
    });

    test("should use absolute URLs for Twitter images", async ({ page }) => {
      await page.goto("/es/libros/apocalipsis-de-stephen-king/");

      const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute("content");
      expect(twitterImage).toMatch(/^https?:\/\//);
    });
  });

  test.describe("Taxonomy Pages SEO", () => {
    test("should have proper meta description on author page", async ({ page }) => {
      await page.goto("/es/autores/stephen-king/");

      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description).toBeTruthy();
      expect(description).toContain("libro");
    });

    test("should have proper meta description on category page", async ({ page }) => {
      await page.goto("/es/categorias/libros/");

      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description).toBeTruthy();
    });

    test("should have og:type=website on taxonomy pages", async ({ page }) => {
      await page.goto("/es/autores/stephen-king/");

      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
    });
  });
});
