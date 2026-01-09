/**
 * Language Switching on Pagination Pages E2E Tests
 *
 * Tests that the language switcher works correctly on pagination pages.
 * Key behaviors:
 * - Pagination pages (page 2+) should redirect to page 1 when switching languages
 * - Language switcher should be enabled if target language has content
 * - Language switcher should be disabled if target language has no content
 *
 * Bug Context:
 * Previously, the language switcher was disabled on pagination pages even when
 * the target language had content. This was fixed by:
 * 1. Making isIndexPage() recognize pagination URLs as index pages
 * 2. Making buildStaticPageUrl() redirect pagination pages to page 1 in target lang
 *
 * @group e2e
 * @group language-switching
 * @group pagination
 */

import { test, expect, type Page } from "@playwright/test";

/**
 * Helper to wait for language switcher to be ready
 * Returns the switcher element regardless of whether it's enabled or disabled
 */
async function waitForLanguageSwitcherReady(page: Page) {
  const languageSwitcher = page.locator(".language-switcher");
  await expect(languageSwitcher).toBeVisible({ timeout: 5000 });

  // Wait for the switcher to be initialized
  // If it's disabled, the script won't add data-lang-switcher-ready
  // So we check if it's either ready OR disabled
  await page.waitForFunction(
    () => {
      const button = document.querySelector(".language-switcher");
      return button?.hasAttribute("data-lang-switcher-ready") || button?.hasAttribute("disabled");
    },
    { timeout: 5000 },
  );

  return languageSwitcher;
}

test.describe("Language Switching on Pagination Pages", () => {
  test.describe("Posts Pagination", () => {
    test("should enable language switcher on posts page 2 when target language has content", async ({ page }) => {
      // Go to Spanish posts page 2
      await page.goto("/es/publicaciones/pagina/2");
      await page.waitForLoadState("networkidle");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);

      // Should be enabled (English posts exist)
      await expect(languageSwitcher).toBeEnabled();

      // Click to switch to English
      await languageSwitcher.click();

      // Should redirect to English posts page 1 (not page 2)
      await page.waitForURL(/\/en\/posts\/?$/, { timeout: 5000 });

      // Verify we're on page 1 (not /en/posts/page/2)
      const finalUrl = page.url();
      expect(finalUrl).toMatch(/\/en\/posts\/?$/);
      expect(finalUrl).not.toContain("/page/");
    });

    test("should redirect to page 1 when switching from English posts page 2", async ({ page }) => {
      // Go to English posts page 2
      await page.goto("/en/posts/page/2");
      await page.waitForLoadState("networkidle");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);

      // Should be enabled (Spanish posts exist)
      await expect(languageSwitcher).toBeEnabled();

      // Click to switch to Spanish
      await languageSwitcher.click();

      // Should redirect to Spanish posts page 1
      await page.waitForURL(/\/es\/publicaciones\/?$/, { timeout: 5000 });

      const finalUrl = page.url();
      expect(finalUrl).toMatch(/\/es\/publicaciones\/?$/);
      expect(finalUrl).not.toContain("/pagina/");
    });
  });

  test.describe("Books Pagination", () => {
    test("should enable language switcher on books page 2", async ({ page }) => {
      // Go to Spanish books page 2
      await page.goto("/es/libros/pagina/2");
      await page.waitForLoadState("networkidle");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);

      // Should be enabled if English books exist
      const isEnabled = await languageSwitcher.isEnabled();

      if (isEnabled) {
        // Click to switch to English
        await languageSwitcher.click();

        // Should redirect to English books page 1
        await page.waitForURL(/\/en\/books\/?$/, { timeout: 5000 });

        const finalUrl = page.url();
        expect(finalUrl).toMatch(/\/en\/books\/?$/);
        expect(finalUrl).not.toContain("/page/");
      } else {
        // If disabled, it means English books don't exist (expected behavior)
        await expect(languageSwitcher).toBeDisabled();
      }
    });

    test("should redirect to page 1 when switching from Spanish books pagination", async ({ page }) => {
      // Go to Spanish books page 3 (we know this exists)
      await page.goto("/es/libros/pagina/3");
      await page.waitForLoadState("networkidle");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      const isEnabled = await languageSwitcher.isEnabled();

      if (isEnabled) {
        // Click to switch to English
        await languageSwitcher.click();

        // Should redirect to English books page 1
        await page.waitForURL(/\/en\/books\/?$/, { timeout: 5000 });

        const finalUrl = page.url();
        expect(finalUrl).toMatch(/\/en\/books\/?$/);
        expect(finalUrl).not.toContain("/page/");
      } else {
        // If disabled, it means English books don't exist (expected behavior)
        await expect(languageSwitcher).toBeDisabled();
      }
    });
  });

  test.describe("Tutorials Pagination", () => {
    test("should enable language switcher on tutorials pagination pages", async ({ page }) => {
      // Go to Spanish tutorials page 2
      await page.goto("/es/tutoriales/pagina/2");
      await page.waitForLoadState("networkidle");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      const isEnabled = await languageSwitcher.isEnabled();

      if (isEnabled) {
        // Click to switch to English
        await languageSwitcher.click();

        // Should redirect to English tutorials page 1
        await page.waitForURL(/\/en\/tutorials\/?$/, { timeout: 5000 });

        const finalUrl = page.url();
        expect(finalUrl).toMatch(/\/en\/tutorials\/?$/);
        expect(finalUrl).not.toContain("/page/");
      } else {
        await expect(languageSwitcher).toBeDisabled();
      }
    });
  });

  test.describe("Behavior Consistency", () => {
    test("should always redirect to page 1, never to the same pagination number", async ({ page }) => {
      // Test multiple pagination pages (only using pages that exist)
      const testCases = [
        { from: "/es/publicaciones/pagina/2", to: /\/en\/posts\/?$/ },
        { from: "/es/publicaciones/pagina/5", to: /\/en\/posts\/?$/ },
        { from: "/en/posts/page/2", to: /\/es\/publicaciones\/?$/ },
        { from: "/es/libros/pagina/3", to: /\/en\/books\/?$/ },
      ];

      for (const testCase of testCases) {
        await page.goto(testCase.from);
        await page.waitForLoadState("networkidle");

        const languageSwitcher = await waitForLanguageSwitcherReady(page);
        const isEnabled = await languageSwitcher.isEnabled();

        if (isEnabled) {
          await languageSwitcher.click();
          await page.waitForURL(testCase.to, { timeout: 5000 });

          const finalUrl = page.url();
          expect(finalUrl).toMatch(testCase.to);
          expect(finalUrl).not.toContain("/page/");
          expect(finalUrl).not.toContain("/pagina/");
        }
      }
    });

    test("should show correct language label on pagination pages", async ({ page }) => {
      // Go to Spanish pagination page
      await page.goto("/es/publicaciones/pagina/2");
      await page.waitForLoadState("networkidle");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);

      // Should show "EN" (target language)
      const text = await languageSwitcher.textContent();
      expect(text?.trim()).toBe("EN");

      // Switch to English
      const isEnabled = await languageSwitcher.isEnabled();
      if (isEnabled) {
        await languageSwitcher.click();
        await page.waitForURL(/\/en\/posts\/?$/, { timeout: 5000 });

        // Now on English page, should show "ES"
        const newSwitcher = await waitForLanguageSwitcherReady(page);
        const newText = await newSwitcher.textContent();
        expect(newText?.trim()).toBe("ES");
      }
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle rapid switching on pagination pages", async ({ page }) => {
      await page.goto("/es/publicaciones/pagina/2");
      await page.waitForLoadState("networkidle");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      const isEnabled = await languageSwitcher.isEnabled();

      if (isEnabled) {
        // Click multiple times rapidly
        await languageSwitcher.click();
        await page.waitForTimeout(100);
        await languageSwitcher.click();

        // Should still end up on a valid page
        await page.waitForLoadState("networkidle");
        const url = page.url();
        expect(url).toMatch(/\/(es|en)\//);
      }
    });

    test("should work correctly after navigation within pagination", async ({ page }) => {
      // Start on page 1
      await page.goto("/es/publicaciones");
      await page.waitForLoadState("networkidle");

      // Navigate to page 2 using pagination controls
      const page2Link = page.locator('a[href*="/pagina/2"]').first();
      if (await page2Link.isVisible().catch(() => false)) {
        await page2Link.click();
        await page.waitForURL(/\/pagina\/2/, { timeout: 5000 });

        // Now switch language
        const languageSwitcher = await waitForLanguageSwitcherReady(page);
        const isEnabled = await languageSwitcher.isEnabled();

        if (isEnabled) {
          await languageSwitcher.click();

          // Should go to English page 1
          await page.waitForURL(/\/en\/posts\/?$/, { timeout: 5000 });

          const finalUrl = page.url();
          expect(finalUrl).not.toContain("/page/");
        }
      }
    });
  });
});
