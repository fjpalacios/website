import { test, expect } from "@playwright/test";

test.describe("Social Media & SEO Meta Tags", () => {
  test.describe("Open Graph tags - Spanish Home", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/es/");
    });

    test("should have correct og:title", async ({ page }) => {
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        "Francisco Javier Palacios Pérez",
      );
    });

    test("should have correct og:description", async ({ page }) => {
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
        "content",
        "Página web personal de Francisco Javier Palacios Pérez, desarrollador de software de Valencia (España)",
      );
    });

    test("should have correct og:image", async ({ page }) => {
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        "https://fjp.es/images/defaults/post-default.jpg",
      );
    });

    test("should have correct og:url", async ({ page }) => {
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://fjp.es/es/");
    });

    test("should have correct og:type", async ({ page }) => {
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
    });
  });

  test.describe("Twitter Card tags - Spanish Home", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/es/");
    });

    test("should have correct twitter:card", async ({ page }) => {
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    });

    test("should have correct twitter:title", async ({ page }) => {
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
        "content",
        "Francisco Javier Palacios Pérez",
      );
    });

    test("should have correct twitter:description", async ({ page }) => {
      await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
        "content",
        "Página web personal de Francisco Javier Palacios Pérez, desarrollador de software de Valencia (España)",
      );
    });

    test("should have correct twitter:image", async ({ page }) => {
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        "content",
        "https://fjp.es/images/defaults/post-default.jpg",
      );
    });
  });

  test.describe("Open Graph tags - English About", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/en/about/");
    });

    test("should have correct og:title for about page", async ({ page }) => {
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        "About me - Francisco Javier Palacios Pérez",
      );
    });

    test("should have correct og:url for about page", async ({ page }) => {
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://fjp.es/en/about/");
    });

    test("should have correct og:description for English", async ({ page }) => {
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
        "content",
        "Francisco Javier Palacios Pérez's personal website, Software Developer based in Valencia (Spain)",
      );
    });
  });

  test.describe("JSON-LD Structured Data", () => {
    test("should have valid JSON-LD schema on Spanish home", async ({ page }) => {
      await page.goto("/es/");

      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
      expect(jsonLdScripts.length).toBeGreaterThan(0);

      // Find the Person schema
      let personSchema = null;
      for (const script of jsonLdScripts) {
        const content = await script.textContent();
        if (content) {
          const schema = JSON.parse(content);
          if (schema["@type"] === "Person") {
            personSchema = schema;
            break;
          }
        }
      }

      expect(personSchema).toBeTruthy();
      expect(personSchema!["@context"]).toBe("https://schema.org");
      expect(personSchema!.name).toBe("Francisco Javier Palacios Pérez");
      expect(personSchema!.jobTitle).toBe("Desarrollador de software");
      expect(personSchema!.url).toBe("https://fjp.es");
      expect(personSchema!.sameAs).toContain("https://www.linkedin.com/in/fjpalacios/");
      expect(personSchema!.sameAs).toContain("https://github.com/fjpalacios");
      expect(personSchema!.address.addressLocality).toBe("Valencia");
      expect(personSchema!.address.addressCountry).toBe("ES");
    });

    test("should have valid JSON-LD schema on English home", async ({ page }) => {
      await page.goto("/en/");

      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();

      // Find the Person schema
      let personSchema = null;
      for (const script of jsonLdScripts) {
        const content = await script.textContent();
        if (content) {
          const schema = JSON.parse(content);
          if (schema["@type"] === "Person") {
            personSchema = schema;
            break;
          }
        }
      }

      expect(personSchema).toBeTruthy();
      expect(personSchema!.jobTitle).toBe("Software Developer");
    });
  });

  test("should have viewport meta tag", async ({ page }) => {
    await page.goto("/es/");

    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
      "content",
      "width=device-width, initial-scale=1.0",
    );
  });

  test("should have charset meta tag", async ({ page }) => {
    await page.goto("/es/");

    const charset = await page.locator("meta[charset]").getAttribute("charset");
    expect(charset?.toLowerCase()).toBe("utf-8");
  });

  test("should have favicon", async ({ page }) => {
    await page.goto("/es/");

    await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/favicon.ico");
  });
});
