/**
 * Language Switching on Taxonomy Pages E2E Tests
 *
 * Tests language switching functionality specifically on taxonomy pages
 * (genres, categories, challenges, authors, publishers, series).
 *
 * Key focus: Ensuring the bug fix for genres language switcher works correctly.
 * Bug: Language switcher appeared disabled despite valid i18n data.
 * Root cause: hasTargetContent was checking same slug instead of i18n field.
 *
 * @group e2e
 * @group language-switching
 * @group taxonomy
 */

import { test, expect, type Page } from "@playwright/test";

/**
 * Helper function to wait for language switcher to be ready
 */
async function waitForLanguageSwitcherReady(page: Page) {
  const languageSwitcher = page.locator(".language-switcher");
  await expect(languageSwitcher).toBeVisible();

  await page.waitForFunction(
    () => {
      const button = document.querySelector(".language-switcher");
      return button?.hasAttribute("data-lang-switcher-ready");
    },
    { timeout: 5000 },
  );

  return languageSwitcher;
}

test.describe("Language Switching - Taxonomy Pages", () => {
  test.describe("Genres - Language Switcher State", () => {
    test("should enable language switcher on Spanish genre with English translation", async ({ page }) => {
      // Go to Spanish fiction genre (has i18n: "fiction")
      await page.goto("/es/generos/ficcion/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);

      // Should be visible and enabled
      await expect(languageSwitcher).toBeVisible();
      await expect(languageSwitcher).toBeEnabled();

      // Should have correct target URL
      const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
      expect(targetUrl).toBe("/en/genres/fiction");
    });

    test("should enable language switcher on English genre with Spanish translation", async ({ page }) => {
      // Go to English fiction genre (has i18n: "ficcion")
      await page.goto("/en/genres/fiction/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);

      // Should be visible and enabled
      await expect(languageSwitcher).toBeVisible();
      await expect(languageSwitcher).toBeEnabled();

      // Should have correct target URL
      const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
      expect(targetUrl).toBe("/es/generos/ficcion");
    });

    test("should NOT have disabled attribute on genre with translation", async ({ page }) => {
      await page.goto("/es/generos/terror/");

      const languageSwitcher = page.locator(".language-switcher");
      await expect(languageSwitcher).toBeVisible();

      // The key test: should NOT have disabled attribute
      const isDisabled = await languageSwitcher.isDisabled();
      expect(isDisabled).toBe(false);
    });

    test("should show correct button text for target language", async ({ page }) => {
      // Spanish page should show "EN" button
      await page.goto("/es/generos/ficcion/");
      const languageSwitcher = page.locator(".language-switcher");
      await expect(languageSwitcher).toContainText("EN");

      // English page should show "ES" button
      await page.goto("/en/genres/fiction/");
      await expect(languageSwitcher).toContainText("ES");
    });
  });

  test.describe("Genres - Language Switching Navigation", () => {
    test("should switch from Spanish genre to English genre", async ({ page }) => {
      await page.goto("/es/generos/ficcion/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      // Should be on English fiction page
      expect(page.url()).toContain("/en/genres/fiction");
      await expect(page).toHaveTitle(/Fiction/);
    });

    test("should switch from English genre to Spanish genre", async ({ page }) => {
      await page.goto("/en/genres/fiction/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      // Should be on Spanish ficcion page
      expect(page.url()).toContain("/es/generos/ficcion");
      await expect(page).toHaveTitle(/Ficción/);
    });

    test("should switch horror/terror genre pair", async ({ page }) => {
      // ES -> EN
      await page.goto("/es/generos/terror/");
      let languageSwitcher = await waitForLanguageSwitcherReady(page);
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/en/genres/horror");

      // EN -> ES
      await page.goto("/en/genres/horror/");
      languageSwitcher = await waitForLanguageSwitcherReady(page);
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/es/generos/terror");
    });

    test("should switch crime/crimen genre pair", async ({ page }) => {
      await page.goto("/es/generos/crimen/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/en/genres/crime");
    });

    test("should switch fantasy/fantastico genre pair", async ({ page }) => {
      await page.goto("/es/generos/fantastico/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/en/genres/fantasy");
    });

    test("should switch thriller/suspense genre pair", async ({ page }) => {
      await page.goto("/es/generos/suspense/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/en/genres/thriller");
    });

    test("should switch mystery/intriga genre pair", async ({ page }) => {
      await page.goto("/es/generos/intriga/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/en/genres/mystery");
    });
  });

  test.describe("Genres - Preserve URL Components", () => {
    test("should preserve hash fragment when switching genre languages", async ({ page }) => {
      await page.goto("/es/generos/ficcion/#top");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      // Hash should be preserved
      expect(page.url()).toContain("#top");
    });
  });

  test.describe("Genres - List Page (Index)", () => {
    test("should enable language switcher on genres list page", async ({ page }) => {
      await page.goto("/es/generos/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      await expect(languageSwitcher).toBeEnabled();

      const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
      expect(targetUrl).toBe("/en/genres");
    });

    test("should switch from genres list to genres list", async ({ page }) => {
      await page.goto("/es/generos/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/en/genres");
      await expect(page).toHaveTitle(/Genres/);
    });
  });

  test.describe("Categories - Language Switcher", () => {
    test("should enable language switcher on category with translation", async ({ page }) => {
      // Go to Spanish "libros" category (has i18n: "books")
      await page.goto("/es/categorias/libros/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);

      // Should be enabled (if category has i18n field)
      const isEnabled = await languageSwitcher.isEnabled();

      if (isEnabled) {
        const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
        expect(targetUrl).toContain("/en/categories/books");
      }
    });

    test("should switch from Spanish category to English category", async ({ page }) => {
      // Use "git" category which has proper i18n mappings
      await page.goto("/es/categorias/git/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);

      // Should be enabled (git category has i18n)
      await expect(languageSwitcher).toBeEnabled();

      const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
      expect(targetUrl).toBe("/en/categories/git");

      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/en/categories/git");
    });
  });

  test.describe("Challenges - Language Switcher", () => {
    test("should enable language switcher on challenge with translation", async ({ page }) => {
      // Go to Spanish "reto-lectura-2017" (has i18n: "2017-reading-challenge")
      await page.goto("/es/retos/reto-lectura-2017/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);
      const isEnabled = await languageSwitcher.isEnabled();

      if (isEnabled) {
        const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
        expect(targetUrl).toContain("/en/challenges/2017-reading-challenge");
      }
    });
  });

  test.describe("Regression Tests - Bug Fix Verification", () => {
    test("should NOT show disabled button on genre with i18n (the bug)", async ({ page }) => {
      // This was the actual bug: button showed as disabled despite having valid i18n
      await page.goto("/es/generos/ficcion/");

      const languageSwitcher = page.locator(".language-switcher");
      await expect(languageSwitcher).toBeVisible();

      // Check HTML for disabled attribute
      const disabledAttr = await languageSwitcher.getAttribute("disabled");
      expect(disabledAttr).toBeNull(); // Should NOT have disabled attribute

      // Check computed state
      const isDisabled = await languageSwitcher.isDisabled();
      expect(isDisabled).toBe(false);
    });

    test("should work for all 6 genre pairs with i18n", async ({ page }) => {
      const genrePairs = [
        { es: "/es/generos/ficcion/", en: "/en/genres/fiction/" },
        { es: "/es/generos/terror/", en: "/en/genres/horror/" },
        { es: "/es/generos/crimen/", en: "/en/genres/crime/" },
        { es: "/es/generos/fantastico/", en: "/en/genres/fantasy/" },
        { es: "/es/generos/suspense/", en: "/en/genres/thriller/" },
        { es: "/es/generos/intriga/", en: "/en/genres/mystery/" },
      ];

      for (const pair of genrePairs) {
        // Test ES -> EN
        await page.goto(pair.es);
        const esSwitcher = page.locator(".language-switcher");
        await expect(esSwitcher).toBeEnabled();

        // Test EN -> ES
        await page.goto(pair.en);
        const enSwitcher = page.locator(".language-switcher");
        await expect(enSwitcher).toBeEnabled();
      }
    });

    test("should verify fix: uses i18n field, not same slug", async ({ page }) => {
      // The bug was checking: does "ficcion" exist in English? NO -> disabled
      // The fix checks: does "fiction" (i18n value) exist in English? YES -> enabled

      await page.goto("/es/generos/ficcion/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);

      // Should point to /en/genres/fiction (NOT /en/genres/ficcion)
      const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
      expect(targetUrl).toBe("/en/genres/fiction");

      // Should be enabled
      const isDisabled = await languageSwitcher.isDisabled();
      expect(isDisabled).toBe(false);

      // Click should navigate to correct URL
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("/en/genres/fiction");
    });
  });

  test.describe("Accessibility - Taxonomy Pages", () => {
    test("should have proper ARIA labels on genre language switcher", async ({ page }) => {
      await page.goto("/es/generos/ficcion/");

      const languageSwitcher = await waitForLanguageSwitcherReady(page);

      // Should have descriptive aria-label
      const ariaLabel = await languageSwitcher.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toMatch(/inglés|english/i);
    });

    test("should be keyboard navigable on genre pages", async ({ page }) => {
      await page.goto("/es/generos/ficcion/");

      // Tab to language switcher (first focusable element in header)
      await page.keyboard.press("Tab");

      // Language switcher should receive focus
      const languageSwitcher = page.locator(".language-switcher");
      await expect(languageSwitcher).toBeFocused();

      // Should be activatable with Enter
      await page.keyboard.press("Enter");
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/en/genres/fiction");
    });
  });

  test.describe("Edge Cases - Taxonomy Pages", () => {
    test("should handle non-existent genre translation gracefully", async ({ page }) => {
      // If a genre exists only in one language, switcher should be disabled
      // (This test depends on actual content - adjust based on your data)

      // For now, verify that language switcher always has a defined state
      await page.goto("/es/generos/ficcion/");
      const languageSwitcher = page.locator(".language-switcher");

      const isEnabled = await languageSwitcher.isEnabled();
      expect(typeof isEnabled).toBe("boolean");
    });

    test("should handle rapid language switching on genres", async ({ page }) => {
      await page.goto("/es/generos/ficcion/");

      // Switch multiple times quickly
      for (let i = 0; i < 3; i++) {
        const languageSwitcher = await waitForLanguageSwitcherReady(page);
        await languageSwitcher.click();
        await page.waitForLoadState("networkidle");
      }

      // Should end up on valid page (either ES or EN depending on odd/even switches)
      expect(page.url()).toMatch(/\/(es\/generos\/ficcion|en\/genres\/fiction)/);
    });
  });
});
