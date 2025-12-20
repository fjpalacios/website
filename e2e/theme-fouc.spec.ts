import { expect, test } from "@playwright/test";

test.describe("Theme - FOUC Prevention", () => {
  test("should not flash dark theme when loading with light theme preference", async ({ page }) => {
    // Set light theme in localStorage before navigation
    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
    });

    // Navigate to page
    await page.goto("/es/tutorials/guia-variables-javascript/");

    // Check that body has light class immediately
    const bodyClass = await page.locator("body").getAttribute("class");
    expect(bodyClass).toContain("light");
    expect(bodyClass).not.toContain("dark");

    // Verify background color is light (not dark)
    const backgroundColor = await page.locator("body").evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Light theme background is #fbfef9 which is rgb(251, 254, 249)
    expect(backgroundColor).toMatch(/rgb\(251,\s*254,\s*249\)/);
  });

  test("should not flash light theme when loading with dark theme preference", async ({ page }) => {
    // Set dark theme in localStorage before navigation
    await page.addInitScript(() => {
      localStorage.setItem("theme", "dark");
    });

    // Navigate to page
    await page.goto("/es/tutorials/guia-variables-javascript/");

    // Check that body has dark class immediately
    const bodyClass = await page.locator("body").getAttribute("class");
    expect(bodyClass).toContain("dark");
    expect(bodyClass).not.toContain("light");

    // Verify background color is dark (not light)
    const backgroundColor = await page.locator("body").evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Dark theme background is #11151c which is rgb(17, 21, 28)
    expect(backgroundColor).toMatch(/rgb\(17,\s*21,\s*28\)/);
  });

  test("should apply dark theme by default when no preference is saved", async ({ page }) => {
    // Clear localStorage before navigation
    await page.addInitScript(() => {
      localStorage.clear();
    });

    // Navigate to page
    await page.goto("/es/tutorials/guia-variables-javascript/");

    // Check that body has dark class (default)
    const bodyClass = await page.locator("body").getAttribute("class");
    expect(bodyClass).toContain("dark");

    // Verify background color is dark
    const backgroundColor = await page.locator("body").evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(backgroundColor).toMatch(/rgb\(17,\s*21,\s*28\)/);
  });

  test("should keep theme consistent on page reload", async ({ page }) => {
    // Set light theme
    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
    });

    await page.goto("/es/tutorials/guia-variables-javascript/");

    // Verify light theme
    let bodyClass = await page.locator("body").getAttribute("class");
    expect(bodyClass).toContain("light");

    // Reload page
    await page.reload();

    // Verify theme is still light (no flash)
    bodyClass = await page.locator("body").getAttribute("class");
    expect(bodyClass).toContain("light");
    expect(bodyClass).not.toContain("dark");
  });

  test("should apply theme to both html and body elements", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
    });

    await page.goto("/es/tutorials/guia-variables-javascript/");

    // Check html element
    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("light");

    // Check body element
    const bodyClass = await page.locator("body").getAttribute("class");
    expect(bodyClass).toContain("light");
  });
});
