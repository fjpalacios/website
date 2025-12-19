import { test, expect } from "@playwright/test";

test.describe("Navigation & Routing", () => {
  test("should redirect from root to /es/", async ({ page }) => {
    await page.goto("/");

    // Should redirect to Spanish home
    await expect(page).toHaveURL("/es/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });

  test("should handle direct navigation to English home", async ({ page }) => {
    await page.goto("/en/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("Francisco Javier Palacios Pérez");
    await expect(page.locator(".header__subtitle")).toHaveText("Software Developer");
  });

  test("should handle direct navigation to English about page", async ({ page }) => {
    await page.goto("/en/about/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("About me - Francisco Javier Palacios Pérez");
  });

  test("should navigate between pages using menu links", async ({ page }) => {
    await page.goto("/es/");

    // Click on About link
    await page.locator(".navigation__link a[href='/es/about/']").click();
    await page.waitForURL("/es/about/");

    await expect(page).toHaveTitle("Sobre mí - Francisco Javier Palacios Pérez");

    // Click on Home link
    await page.locator(".navigation__link a[href='/es/']").click();
    await page.waitForURL("/es/");

    await expect(page).toHaveTitle("Francisco Javier Palacios Pérez");
  });

  test("should maintain active link styling on current page", async ({ page }) => {
    await page.goto("/es/");

    const homeLink = page.locator(".navigation__link a[href='/es/']");
    await expect(homeLink).toHaveClass(/navigation__link--active/);

    const aboutLink = page.locator(".navigation__link a[href='/es/about/']");
    await expect(aboutLink).not.toHaveClass(/navigation__link--active/);

    // Navigate to about
    await aboutLink.click();
    await page.waitForURL("/es/about/");

    await expect(homeLink).not.toHaveClass(/navigation__link--active/);
    await expect(aboutLink).toHaveClass(/navigation__link--active/);
  });

  test("should handle 404 pages gracefully", async ({ page }) => {
    const response = await page.goto("/non-existent-page");

    // Astro returns 404 status
    expect(response?.status()).toBe(404);
  });

  test("should handle invalid language codes", async ({ page }) => {
    const response = await page.goto("/fr/");

    // Should return 404 for unsupported languages
    expect(response?.status()).toBe(404);
  });

  test("should preserve theme preference across navigation", async ({ page }) => {
    await page.goto("/es/");

    // Switch to light theme
    await page.locator(".menu .menu__left .theme-switcher .theme-switcher__selector__image").click();

    await expect(page.locator("body")).toHaveClass(/light/);

    // Navigate to about page
    await page.locator(".navigation__link a[href='/es/about/']").click();
    await page.waitForURL("/es/about/");

    // Theme should be preserved
    await expect(page.locator("body")).toHaveClass(/light/);
  });

  test("should preserve theme preference across language switch", async ({ page }) => {
    await page.goto("/es/");

    // Switch to light theme
    await page.locator(".menu .menu__left .theme-switcher .theme-switcher__selector__image").click();

    await expect(page.locator("body")).toHaveClass(/light/);

    // Switch language
    await page.locator(".menu .menu__left .language-switcher img").click();
    await page.waitForURL("/en/");

    // Theme should be preserved
    await expect(page.locator("body")).toHaveClass(/light/);
  });
});
