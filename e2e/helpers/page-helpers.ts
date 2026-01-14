/**
 * Page Helper Functions
 *
 * Common utilities for page interactions and navigation in E2E tests.
 */

import type { Page, Response } from "@playwright/test";

/**
 * Wait for page to be fully loaded and stable
 * Includes network idle, fonts loaded, and animation settle time
 */
export async function waitForPageStable(page: Page): Promise<void> {
  // Wait for network to be idle
  await page.waitForLoadState("networkidle");

  // Wait for fonts to load (prevents font rendering differences)
  await page.evaluate(() => document.fonts.ready);

  // Wait for animations to settle
  await page.waitForTimeout(500);
}

/**
 * Check if a page exists (not 404)
 * @param page - Playwright page instance
 * @param url - URL to check
 * @returns true if page exists, false if 404
 */
export async function pageExists(page: Page, url: string): Promise<boolean> {
  const response: Response | null = await page.goto(url);
  return response?.status() !== 404;
}

/**
 * Activate dark theme on the page
 * Tries to click theme toggle, falls back to JS if toggle not found
 */
export async function activateDarkTheme(page: Page): Promise<void> {
  const themeToggle = page.locator("#theme-toggle");
  const isVisible = await themeToggle.isVisible({ timeout: 2000 }).catch(() => false);

  if (!isVisible) {
    // If toggle not found, set theme via JavaScript
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    });
  } else {
    await themeToggle.click();
  }

  // Wait for theme transition to complete
  await page.waitForTimeout(300);
}

/**
 * Open search modal
 * Clicks search button and waits for modal to be fully rendered
 */
export async function openSearchModal(page: Page): Promise<void> {
  const searchButton = page.locator(".search-button");
  await searchButton.click();

  // Wait for modal to open
  const modal = page.locator(".search-modal");
  await modal.waitFor({ state: "visible", timeout: 5000 });

  // Wait for Pagefind UI to initialize
  const searchInput = page.locator(".pagefind-ui__search-input");
  await searchInput.waitFor({ state: "visible", timeout: 5000 });

  // Wait for search UI to be fully rendered
  await page.waitForTimeout(500);
}

/**
 * Wait for language switcher to be ready
 * More resilient version that handles JS initialization delays
 */
export async function waitForLanguageSwitcherReady(page: Page) {
  const languageSwitcher = page.locator(".language-switcher");
  await languageSwitcher.waitFor({ state: "visible", timeout: 5000 });

  try {
    await page.waitForFunction(
      () => {
        const button = document.querySelector(".language-switcher");
        return button?.hasAttribute("data-lang-switcher-ready");
      },
      { timeout: 5000 },
    );
  } catch {
    // If timeout, the switcher might not have JS initialized
    // This is OK for some tests - they can still check visibility and attributes
  }

  return languageSwitcher;
}

/**
 * Check if language switch target exists
 * @param page - Playwright page instance
 * @param languageSwitcher - Language switcher locator
 * @returns true if target page exists, false otherwise
 */
export async function checkLanguageSwitchTarget(
  page: Page,
  languageSwitcher: ReturnType<Page["locator"]>,
): Promise<boolean> {
  const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
  if (!targetUrl || targetUrl === "#") {
    return false;
  }

  const currentUrl = page.url();
  const targetExists = await pageExists(page, targetUrl);
  await page.goto(currentUrl); // Go back to original page
  await waitForLanguageSwitcherReady(page); // Wait for switcher to be ready again

  return targetExists;
}
