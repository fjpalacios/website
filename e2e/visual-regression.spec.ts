import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test.describe("Spanish Pages", () => {
    test("should match homepage screenshot - dark theme", async ({ page }) => {
      await page.goto("/es/");

      // Wait for page to be fully loaded
      await page.waitForLoadState("networkidle");

      // Take screenshot and compare
      await expect(page).toHaveScreenshot("home-es-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match homepage screenshot - light theme", async ({ page }) => {
      await page.goto("/es/");

      // Switch to light theme
      await page.locator(".theme-switcher__selector__image").click();
      await page.waitForTimeout(300); // Wait for theme transition

      // Take screenshot and compare
      await expect(page).toHaveScreenshot("home-es-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match about page screenshot - dark theme", async ({ page }) => {
      await page.goto("/es/about/");

      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot("about-es-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match about page screenshot - light theme", async ({ page }) => {
      await page.goto("/es/about/");

      // Switch to light theme
      await page.locator(".theme-switcher__selector__image").click();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot("about-es-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });
  });

  test.describe("English Pages", () => {
    test("should match homepage screenshot - dark theme", async ({ page }) => {
      await page.goto("/en/");

      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot("home-en-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match homepage screenshot - light theme", async ({ page }) => {
      await page.goto("/en/");

      // Switch to light theme
      await page.locator(".theme-switcher__selector__image").click();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot("home-en-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match about page screenshot - dark theme", async ({ page }) => {
      await page.goto("/en/about/");

      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot("about-en-dark.png", {
        fullPage: true,
        animations: "disabled",
      });
    });

    test("should match about page screenshot - light theme", async ({ page }) => {
      await page.goto("/en/about/");

      // Switch to light theme
      await page.locator(".theme-switcher__selector__image").click();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot("about-en-light.png", {
        fullPage: true,
        animations: "disabled",
      });
    });
  });

  test.describe("Component Screenshots", () => {
    test("should match menu component", async ({ page }) => {
      await page.goto("/es/");

      const menu = page.locator(".menu");
      await expect(menu).toHaveScreenshot("menu-component.png");
    });

    test("should match header component", async ({ page }) => {
      await page.goto("/es/");

      const header = page.locator(".header");
      await expect(header).toHaveScreenshot("header-component.png");
    });

    test("should match theme switcher states", async ({ page }) => {
      await page.goto("/es/");

      // Dark theme checkbox
      const themeSwitcher = page.locator(".theme-switcher");
      await expect(themeSwitcher).toHaveScreenshot("theme-switcher-dark.png");

      // Click to switch to light
      await page.locator(".theme-switcher__selector__image").click();
      await page.waitForTimeout(300);

      // Light theme checkbox
      await expect(themeSwitcher).toHaveScreenshot("theme-switcher-light.png");
    });
  });
});
