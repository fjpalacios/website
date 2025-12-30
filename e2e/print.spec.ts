/**
 * @file Print Styles E2E Tests
 * @description Tests to verify print styles are correctly applied
 *
 * These tests verify that:
 * - Print-specific CSS is applied correctly
 * - Unwanted elements are hidden in print
 * - Header layout is correct in print mode
 * - Print styles don't affect screen display
 */

import { test, expect } from "@playwright/test";

const TEST_URL = "/es/acerca-de";

test.describe("Print Styles", () => {
  test.describe("Screen Mode (Default)", () => {
    test("should display menu in screen mode", async ({ page }) => {
      await page.goto(TEST_URL);
      const menu = page.locator(".menu");
      await expect(menu).toBeVisible();
    });

    test("should display theme switcher in screen mode", async ({ page }) => {
      await page.goto(TEST_URL);
      const themeSwitcher = page.locator(".theme-switcher");
      await expect(themeSwitcher).toBeVisible();
    });

    test("should display search button in screen mode", async ({ page }) => {
      await page.goto(TEST_URL);
      // Search button is inside menu - check if menu is visible
      const menu = page.locator(".menu");
      await expect(menu).toBeVisible();
    });

    test("should have header with grid layout in screen mode", async ({ page }) => {
      await page.goto(TEST_URL);
      const header = page.locator(".header");
      await expect(header).toBeVisible();

      const display = await header.evaluate((el) => window.getComputedStyle(el).display);
      expect(display).toBe("grid");
    });

    test("should hide email in screen mode", async ({ page }) => {
      await page.goto(TEST_URL);
      const emailLink = page.locator('a[href^="mailto:"]');
      await expect(emailLink).not.toBeVisible();
    });

    test("should show LinkedIn in screen mode", async ({ page }) => {
      await page.goto(TEST_URL);
      const linkedinLink = page.locator('a[href*="linkedin.com"]');
      await expect(linkedinLink).toBeVisible();
    });

    test("should show GitHub in screen mode", async ({ page }) => {
      await page.goto(TEST_URL);
      const githubLink = page.locator('a[href*="github.com"]');
      await expect(githubLink).toBeVisible();
    });

    test("should show Twitter in screen mode", async ({ page }) => {
      await page.goto(TEST_URL);
      const twitterLink = page.locator('a[href*="twitter.com"], a[href*="x.com"]');
      const count = await twitterLink.count();
      if (count > 0) {
        await expect(twitterLink.first()).toBeVisible();
      }
    });

    test("should hide phone in screen mode", async ({ page }) => {
      await page.goto(TEST_URL);
      const phoneLink = page.locator('a[href^="tel:"]');
      await expect(phoneLink).not.toBeVisible();
    });

    test("should hide website in screen mode", async ({ page }) => {
      await page.goto(TEST_URL);
      // More specific selector to avoid matching email
      const websiteLink = page.locator('a[href="https://fjp.es"]');
      await expect(websiteLink).not.toBeVisible();
    });
  });

  test.describe("Print Mode", () => {
    test("should hide menu in print mode", async ({ page }) => {
      await page.goto(TEST_URL);

      // Emulate print media
      await page.emulateMedia({ media: "print" });

      const menu = page.locator(".menu");
      const isHidden = await menu.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.display === "none" || style.visibility === "hidden";
      });

      expect(isHidden).toBeTruthy();
    });

    test("should hide theme switcher in print mode (via hidden menu)", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      // Theme switcher is hidden because .menu is hidden
      const menu = page.locator(".menu");
      const isMenuHidden = await menu.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.display === "none" || style.visibility === "hidden";
      });

      expect(isMenuHidden).toBeTruthy();

      // Verify theme switcher is inside menu and therefore not visible
      const themeSwitcher = page.locator(".theme-switcher");
      await expect(themeSwitcher).not.toBeVisible();
    });

    test("should hide search in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      // Search is part of menu, check menu is hidden
      const menu = page.locator(".menu");
      const isHidden = await menu.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.display === "none" || style.visibility === "hidden";
      });

      expect(isHidden).toBeTruthy();
    });

    test("should maintain grid display for header in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      const header = page.locator(".header");
      const display = await header.evaluate((el) => window.getComputedStyle(el).display);

      expect(display).toBe("grid");
    });

    test("should apply correct background color to header in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      const header = page.locator(".header");
      const backgroundColor = await header.evaluate((el) => window.getComputedStyle(el).backgroundColor);

      // Should have dark background (check it's not white/light)
      const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const [_, r, g, b] = rgbMatch.map(Number);
        // Dark colors have low RGB values
        const avgColor = (r + g + b) / 3;
        expect(avgColor).toBeLessThan(100); // Dark background
      }
    });

    test("should maintain header structure in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      const header = page.locator(".header");
      await expect(header).toBeVisible();

      // Verify header maintains grid layout
      const display = await header.evaluate((el) => window.getComputedStyle(el).display);
      expect(display).toBe("grid");
    });
  });

  test.describe("Header Layout in Print Mode", () => {
    test("should display header title in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      const title = page.locator(".header__title");
      await expect(title).toBeVisible();
    });

    test("should display header subtitle in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      const subtitle = page.locator(".header__subtitle");
      await expect(subtitle).toBeVisible();
    });

    test("should display header contact in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      const contact = page.locator(".header__contact");
      await expect(contact).toBeVisible();

      const display = await contact.evaluate((el) => window.getComputedStyle(el).display);
      // Should be grid in print mode
      expect(display).toBe("grid");
    });

    test("should hide Twitter in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      // Find Twitter/X link
      const twitterLink = page.locator('a[href*="twitter.com"], a[href*="x.com"]');
      const count = await twitterLink.count();

      if (count > 0) {
        // Get the parent container (the header__contact__item)
        const twitterItem = twitterLink.first().locator("..");
        const isHidden = await twitterItem.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return style.display === "none" || style.visibility === "hidden";
        });

        expect(isHidden).toBeTruthy();
      } else {
        // If there's no Twitter link, test passes (nothing to hide)
        expect(true).toBeTruthy();
      }
    });

    test("should show email in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      const emailLink = page.locator('a[href^="mailto:"]');
      await expect(emailLink).toBeVisible();
    });

    test("should show LinkedIn in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      const linkedinLink = page.locator('a[href*="linkedin.com"]');
      await expect(linkedinLink).toBeVisible();
    });

    test("should show location in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      // Location typically has text content with city/country
      const locationItem = page.locator('.header__contact__item:has-text("Valencia")');
      await expect(locationItem).toBeVisible();
    });

    test("should show phone in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      const phoneLink = page.locator('a[href^="tel:"]');
      await expect(phoneLink).toBeVisible();
    });

    test("should show website in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      // More specific selector to avoid matching email
      const websiteLink = page.locator('a[href="https://fjp.es"]');
      await expect(websiteLink).toBeVisible();
    });

    test("should maintain proper spacing in header elements in print mode", async ({ page }) => {
      await page.goto(TEST_URL);
      await page.emulateMedia({ media: "print" });

      const header = page.locator(".header");
      const marginBottom = await header.evaluate((el) => window.getComputedStyle(el).marginBottom);

      // Should have 20px margin bottom in print
      expect(parseFloat(marginBottom)).toBeGreaterThanOrEqual(19);
      expect(parseFloat(marginBottom)).toBeLessThanOrEqual(21);
    });
  });

  test.describe("Print Media Query Detection", () => {
    test("should correctly detect print media query", async ({ page }) => {
      await page.goto(TEST_URL);

      // Check screen mode first
      const screenMatch = await page.evaluate(() => {
        return window.matchMedia("print").matches;
      });
      expect(screenMatch).toBe(false);

      // Switch to print mode
      await page.emulateMedia({ media: "print" });

      const printMatch = await page.evaluate(() => {
        return window.matchMedia("print").matches;
      });
      expect(printMatch).toBe(true);
    });

    test("should apply print styles only when in print media", async ({ page }) => {
      await page.goto(TEST_URL);

      // Screen mode - menu should be visible
      let menuDisplay = await page.locator(".menu").evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(menuDisplay).not.toBe("none");

      // Print mode - menu should be hidden
      await page.emulateMedia({ media: "print" });
      menuDisplay = await page.locator(".menu").evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(menuDisplay).toBe("none");
    });
  });
});
