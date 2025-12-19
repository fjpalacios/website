import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/es/about/");
  });

  test("should have valid Spanish SEO properties", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page).toHaveTitle("Sobre mí - Francisco Javier Palacios Pérez");
    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute("content", "https://fjp.es/es/about/");
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
    await page.waitForURL("/en/about/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("About me - Francisco Javier Palacios Pérez");
    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute("content", "https://fjp.es/en/about/");
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
});
