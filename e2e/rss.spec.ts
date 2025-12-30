import { expect, test } from "@playwright/test";

test.describe("RSS Feeds", () => {
  test.describe("Autodiscovery Links", () => {
    test("should have RSS autodiscovery links on Spanish pages", async ({ page }) => {
      await page.goto("/es/");

      const generalFeed = page.locator('link[rel="alternate"][type="application/rss+xml"][href="/es/rss.xml"]');
      await expect(generalFeed).toHaveCount(1);

      const booksFeed = page.locator('link[rel="alternate"][type="application/rss+xml"][href="/es/libros/rss.xml"]');
      await expect(booksFeed).toHaveCount(1);

      const tutorialsFeed = page.locator(
        'link[rel="alternate"][type="application/rss+xml"][href="/es/tutoriales/rss.xml"]',
      );
      await expect(tutorialsFeed).toHaveCount(1);
    });

    test("should have RSS autodiscovery links on English pages", async ({ page }) => {
      await page.goto("/en/");

      const generalFeed = page.locator('link[rel="alternate"][type="application/rss+xml"][href="/en/rss.xml"]');
      await expect(generalFeed).toHaveCount(1);

      const booksFeed = page.locator('link[rel="alternate"][type="application/rss+xml"][href="/en/books/rss.xml"]');
      await expect(booksFeed).toHaveCount(1);

      const tutorialsFeed = page.locator(
        'link[rel="alternate"][type="application/rss+xml"][href="/en/tutorials/rss.xml"]',
      );
      await expect(tutorialsFeed).toHaveCount(1);
    });
  });

  test.describe("Feed Pages", () => {
    test("should display Spanish feeds page with correct links", async ({ page }) => {
      await page.goto("/es/feeds");

      await expect(page).toHaveTitle(/RSS/);

      // Check feed links are present
      const generalFeedLink = page.locator('a[href="/es/rss.xml"]');
      await expect(generalFeedLink).toBeVisible();

      const booksFeedLink = page.locator('a[href="/es/libros/rss.xml"]');
      await expect(booksFeedLink).toBeVisible();

      const tutorialsFeedLink = page.locator('a[href="/es/tutoriales/rss.xml"]');
      await expect(tutorialsFeedLink).toBeVisible();
    });

    test("should display English feeds page with correct links", async ({ page }) => {
      await page.goto("/en/feeds");

      await expect(page).toHaveTitle(/RSS/);

      // Check feed links are present
      const generalFeedLink = page.locator('a[href="/en/rss.xml"]');
      await expect(generalFeedLink).toBeVisible();

      const booksFeedLink = page.locator('a[href="/en/books/rss.xml"]');
      await expect(booksFeedLink).toBeVisible();

      const tutorialsFeedLink = page.locator('a[href="/en/tutorials/rss.xml"]');
      await expect(tutorialsFeedLink).toBeVisible();
    });

    test("should have working language switcher on feeds pages", async ({ page }) => {
      await page.goto("/es/feeds");

      // Click language switcher
      await page.locator(".language-switcher").click();
      await page.waitForURL("/en/feeds");

      await expect(page).toHaveTitle(/RSS/);
      await expect(page.locator('a[href="/en/rss.xml"]')).toBeVisible();
    });
  });

  test.describe("XML Feed Content", () => {
    test("should return valid XML for Spanish general feed", async ({ page }) => {
      const response = await page.goto("/es/rss.xml");
      expect(response?.status()).toBe(200);
      expect(response?.headers()["content-type"]).toContain("xml");

      const content = await response?.text();
      expect(content).toContain('<?xml version="1.0"');
      expect(content).toContain("<rss");
      expect(content).toContain("<channel>");
      expect(content).toContain("fjp.es - Blog en Español");
      expect(content).toContain("<language>es</language>");
    });

    test("should return valid XML for English general feed", async ({ page }) => {
      const response = await page.goto("/en/rss.xml");
      expect(response?.status()).toBe(200);
      expect(response?.headers()["content-type"]).toContain("xml");

      const content = await response?.text();
      expect(content).toContain('<?xml version="1.0"');
      expect(content).toContain("<rss");
      expect(content).toContain("<channel>");
      expect(content).toContain("fjp.es - Blog in English");
      expect(content).toContain("<language>en</language>");
    });

    test("should return valid XML for Spanish books feed", async ({ page }) => {
      const response = await page.goto("/es/libros/rss.xml");
      expect(response?.status()).toBe(200);

      const content = await response?.text();
      expect(content).toContain("<rss");
      expect(content).toContain("<channel>");
      expect(content).toContain("Reseñas de Libros");
    });

    test("should return valid XML for English books feed", async ({ page }) => {
      const response = await page.goto("/en/books/rss.xml");
      expect(response?.status()).toBe(200);

      const content = await response?.text();
      expect(content).toContain("<rss");
      expect(content).toContain("<channel>");
      expect(content).toContain("Book Reviews");
    });

    test("should contain items in Spanish general feed", async ({ page }) => {
      const response = await page.goto("/es/rss.xml");
      const content = await response?.text();

      expect(content).toContain("<item>");
      expect(content).toContain("<title>");
      expect(content).toContain("<link>");
      expect(content).toContain("<pubDate>");
      expect(content).toContain("<description>");
      expect(content).toContain("/es/"); // Spanish URLs
    });

    test("should contain items in English general feed", async ({ page }) => {
      const response = await page.goto("/en/rss.xml");
      const content = await response?.text();

      expect(content).toContain("<item>");
      expect(content).toContain("<title>");
      expect(content).toContain("<link>");
      expect(content).toContain("<pubDate>");
      expect(content).toContain("<description>");
      expect(content).toContain("/en/"); // English URLs
    });

    test("should have bilingual content in root feed with language tags", async ({ page }) => {
      const response = await page.goto("/rss.xml");
      const content = await response?.text();

      expect(content).toContain("All Languages");
      expect(content).toContain("[ES]"); // Spanish content prefix
      expect(content).toContain("[EN]"); // English content prefix
      expect(content).toContain("<language>es</language>");
      expect(content).toContain("<language>en</language>");
    });
  });
});
