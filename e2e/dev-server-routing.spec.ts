/**
 * E2E Tests: Dev Server Routing (regression guard)
 *
 * Guards against astro issue #16949:
 * "dev server renders dynamic route with empty props {} after upgrading to
 * 6.4.0 (getStaticPaths regression)".
 *
 * The unified router at src/pages/[lang]/[...route].astro receives its
 * contentType / pageType / lang from getStaticPaths. When astro's dev server
 * fails to resolve the static path entry (e.g. astro 6.4.0 - 6.4.4), every
 * catch-all route renders the 404 fallback with contentType="" and pageType="".
 *
 * `astro build` is unaffected by the bug, so the regular e2e suite (which runs
 * against `astro preview` / built output) does NOT catch this regression.
 * This spec runs against `astro dev` only — see the `dev-server` project in
 * playwright.config.ts.
 *
 * If you see this test failing with "404 - Template Not Found" or empty
 * contentType / pageType, astro has likely been bumped to a broken version.
 * Pin to the last known-good version in package.json and open an issue at
 * https://github.com/withastro/astro/issues/16949
 */

import { test, expect } from "@playwright/test";

// ============================================================================
// REGRESSION GUARDS — astro 6.4.x dev server empty props bug
// ============================================================================

test.describe("Dev server - catch-all routing (regression #16949)", () => {
  test("ES books list does not render 404 fallback", async ({ page }) => {
    const response = await page.goto("/es/libros/");

    // Page must respond successfully (the bug returns 200 with 404 fallback HTML)
    expect(response?.status(), "HTTP status should be 200").toBe(200);

    // The router's 404 fallback shows this exact string when contentType is empty
    await expect(page.locator("body")).not.toContainText("404 - Template Not Found");
    await expect(page.locator("body")).not.toContainText('contentType=""');

    // Sanity check: real books list content should be present
    await expect(page).toHaveTitle(/Libros/);
  });

  test("EN tutorials list does not render 404 fallback", async ({ page }) => {
    const response = await page.goto("/en/tutorials/");

    expect(response?.status()).toBe(200);

    await expect(page.locator("body")).not.toContainText("404 - Template Not Found");
    await expect(page.locator("body")).not.toContainText('contentType=""');

    await expect(page).toHaveTitle(/Tutorials/);
  });

  test("ES static page (about) does not render 404 fallback", async ({ page }) => {
    const response = await page.goto("/es/acerca-de/");

    expect(response?.status()).toBe(200);

    await expect(page.locator("body")).not.toContainText("404 - Template Not Found");
    await expect(page.locator("body")).not.toContainText('contentType=""');
  });

  test("ES feeds page does not render 404 fallback", async ({ page }) => {
    const response = await page.goto("/es/feeds/");

    expect(response?.status()).toBe(200);

    await expect(page.locator("body")).not.toContainText("404 - Template Not Found");
    await expect(page.locator("body")).not.toContainText('contentType=""');
  });

  test("ES book detail page does not render 404 fallback", async ({ page }) => {
    const response = await page.goto("/es/libros/1984-de-george-orwell/");

    expect(response?.status()).toBe(200);

    await expect(page.locator("body")).not.toContainText("404 - Template Not Found");
    await expect(page.locator("body")).not.toContainText('contentType=""');
  });
});
