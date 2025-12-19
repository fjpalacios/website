import { test, expect } from "@playwright/test";

// This file is designed to run with multiple projects (viewports) in playwright.config.ts
// Each project will run all tests with its configured viewport

test("should render correctly", async ({ page }) => {
  await page.goto("/es/");

  // Menu should be visible
  await expect(page.locator(".menu")).toBeVisible();

  // Header should be visible
  await expect(page.locator(".header")).toBeVisible();

  // Content should be visible
  await expect(page.locator(".content")).toBeVisible();
});

test("should have accessible interactive elements", async ({ page }) => {
  await page.goto("/es/");

  // Theme switcher should be clickable
  const themeSwitcher = page.locator(".theme-switcher .theme-switcher__selector__image");
  await expect(themeSwitcher).toBeVisible();

  // Language switcher should be clickable
  const langSwitcher = page.locator(".language-switcher img");
  await expect(langSwitcher).toBeVisible();

  // Navigation links should be clickable
  const navLinks = page.locator(".navigation__link a");
  await expect(navLinks.first()).toBeVisible();
});

test("should switch theme", async ({ page }) => {
  await page.goto("/es/");

  const body = page.locator("body");
  await expect(body).toHaveClass(/dark/);

  await page.locator(".theme-switcher__selector__image").click();

  await expect(body).toHaveClass(/light/);
});

test("should switch language", async ({ page }) => {
  await page.goto("/es/");

  await expect(page.locator("html")).toHaveAttribute("lang", "es");

  await page.locator(".language-switcher img").click();
  await page.waitForURL("/en/");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("should navigate correctly", async ({ page }) => {
  await page.goto("/es/");

  await page.locator(".navigation__link a[href='/es/about/']").click();
  await page.waitForURL("/es/about/");

  await expect(page).toHaveTitle("Sobre mí - Francisco Javier Palacios Pérez");
});

test("should not have horizontal scroll", async ({ page }) => {
  await page.goto("/es/");

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for rounding
});

test("should have proper layout", async ({ page }) => {
  await page.goto("/es/");

  // Check that menu exists and has width
  const menu = page.locator(".menu");
  const boundingBox = await menu.boundingBox();

  expect(boundingBox).toBeTruthy();
  expect(boundingBox!.width).toBeGreaterThan(0);
});
