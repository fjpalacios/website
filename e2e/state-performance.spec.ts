import { test, expect } from "@playwright/test";

test.describe("LocalStorage & State Persistence", () => {
  test("should persist theme preference in localStorage", async ({ page }) => {
    await page.goto("/es/");

    // Default should be dark
    let theme = await page.evaluate(() => localStorage.getItem("theme"));
    expect(theme).toBe("dark");

    // Switch to light
    await page.locator(".theme-switcher__selector__image").click();

    theme = await page.evaluate(() => localStorage.getItem("theme"));
    expect(theme).toBe("light");
  });

  test("should load theme from localStorage on page load", async ({ page }) => {
    // Set theme in localStorage before navigation
    await page.goto("/es/");
    await page.evaluate(() => localStorage.setItem("theme", "light"));

    // Reload page
    await page.reload();

    // Should load light theme
    await expect(page.locator("body")).toHaveClass(/light/);
  });

  test("should maintain theme across browser refresh", async ({ page }) => {
    await page.goto("/es/");

    // Switch to light theme
    await page.locator(".theme-switcher__selector__image").click();
    await expect(page.locator("body")).toHaveClass(/light/);

    // Refresh page
    await page.reload();

    // Theme should persist
    await expect(page.locator("body")).toHaveClass(/light/);
  });

  test("should maintain theme in new tab/context", async ({ context }) => {
    // First page sets light theme
    const page1 = await context.newPage();
    await page1.goto("/es/");
    await page1.locator(".theme-switcher__selector__image").click();
    await expect(page1.locator("body")).toHaveClass(/light/);

    // Second page in same context should have light theme
    const page2 = await context.newPage();
    await page2.goto("/es/");
    await expect(page2.locator("body")).toHaveClass(/light/);

    await page1.close();
    await page2.close();
  });

  test("should clear theme when localStorage is cleared", async ({ page }) => {
    await page.goto("/es/");

    // Set light theme
    await page.locator(".theme-switcher__selector__image").click();
    await expect(page.locator("body")).toHaveClass(/light/);

    // Clear localStorage
    await page.evaluate(() => localStorage.clear());

    // Reload - should default to dark
    await page.reload();
    await expect(page.locator("body")).toHaveClass(/dark/);
  });
});

test.describe("View Transitions", () => {
  test("should have smooth transitions between pages", async ({ page }) => {
    await page.goto("/es/");

    // Navigate to about
    await page.locator(".navigation__link a[href='/es/about/']").click();
    await page.waitForURL("/es/about/");

    // Check we're on the new page
    await expect(page).toHaveTitle("Sobre mí - Francisco Javier Palacios Pérez");
  });

  test("should maintain theme during view transitions", async ({ page }) => {
    await page.goto("/es/");

    // Set light theme
    await page.locator(".theme-switcher__selector__image").click();
    await expect(page.locator("body")).toHaveClass(/light/);

    // Navigate to about with view transition
    await page.locator(".navigation__link a[href='/es/about/']").click();
    await page.waitForURL("/es/about/");

    // Theme should be preserved during transition
    await expect(page.locator("body")).toHaveClass(/light/);
  });

  test("should re-initialize theme toggle after view transition", async ({ page }) => {
    await page.goto("/es/");

    // Navigate to about
    await page.locator(".navigation__link a[href='/es/about/']").click();
    await page.waitForURL("/es/about/");

    // Theme toggle should still work
    const bodyBefore = page.locator("body");
    await expect(bodyBefore).toHaveClass(/dark/);

    await page.locator(".theme-switcher__selector__image").click();

    await expect(bodyBefore).toHaveClass(/light/);
  });
});

test.describe("Performance & Loading", () => {
  test("should load home page quickly", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/es/");
    const loadTime = Date.now() - startTime;

    // Should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("should have no console errors on page load", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/es/");

    expect(consoleErrors).toHaveLength(0);
  });

  test("should have no uncaught exceptions", async ({ page }) => {
    const exceptions: string[] = [];

    page.on("pageerror", (error) => {
      exceptions.push(error.message);
    });

    await page.goto("/es/");

    // Interact with the page
    await page.locator(".theme-switcher__selector__image").click();
    await page.locator(".language-switcher img").click();

    expect(exceptions).toHaveLength(0);
  });

  test("should load all critical resources", async ({ page }) => {
    const response = await page.goto("/es/");

    expect(response?.status()).toBe(200);

    // Check critical resources are loaded
    const images = await page.locator("img").count();
    expect(images).toBeGreaterThan(0);
  });
});
