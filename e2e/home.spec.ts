import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/es/");
  });

  test("should have valid Spanish SEO properties", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page).toHaveTitle("Francisco Javier Palacios Pérez");
    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute("content", "https://fjp.es/es/");
    await expect(page.locator('head meta[property="og:type"]')).toHaveAttribute("content", "website");
    await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
      "content",
      "Página web personal de Francisco Javier Palacios Pérez, desarrollador de software de Valencia (España)",
    );
  });

  test("should have valid English SEO properties after language switch", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator(".header__subtitle")).toHaveText("Desarrollador de software");

    // Click language switcher
    await page.locator(".menu .menu__left .language-switcher img").click();
    await page.waitForURL("/en/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("Francisco Javier Palacios Pérez");
    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute("content", "https://fjp.es/en/");
    await expect(page.locator('head meta[property="og:type"]')).toHaveAttribute("content", "website");
    await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
      "content",
      "Francisco Javier Palacios Pérez's personal website, Software Developer based in Valencia (Spain)",
    );
  });

  test("should have no detectable accessibility violations", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test.describe("Menu bar", () => {
    test("should have a functional language switcher", async ({ page }) => {
      await expect(page.locator(".header__subtitle")).toHaveText("Desarrollador de software");

      await page.locator(".menu .menu__left .language-switcher img").click();
      await page.waitForURL("/en/");

      await expect(page.locator(".header__subtitle")).toHaveText("Software Developer");
    });

    test("should have a functional light/dark theme switcher", async ({ page }) => {
      // Check initial dark theme
      const bodyBefore = await page.locator("body");
      await expect(bodyBefore).toHaveCSS("background-color", "rgb(17, 21, 28)");

      // Click theme switcher
      await page.locator(".menu .menu__left .theme-switcher .theme-switcher__selector__image").click();

      // Check light theme
      const bodyAfter = await page.locator("body");
      await expect(bodyAfter).toHaveCSS("background-color", "rgb(251, 254, 249)");
    });
  });

  test.describe("Header", () => {
    test("should hide the phone on the screen", async ({ page }) => {
      await expect(page.locator(".header__contact .phone")).not.toBeVisible();
    });

    test("should hide the website on the screen", async ({ page }) => {
      await expect(page.locator(".header__contact .globe")).not.toBeVisible();
    });
  });
});
