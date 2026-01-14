/**
 * Viewport Helper Functions
 *
 * Utilities for setting and managing viewport sizes in tests.
 */

import type { Page } from "@playwright/test";

import { VIEWPORTS, type ViewportKey } from "./test-data";

/**
 * Set viewport to a predefined size
 * @param page - Playwright page instance
 * @param viewport - Viewport key (mobile, tablet, desktop)
 */
export async function setViewport(page: Page, viewport: ViewportKey): Promise<void> {
  await page.setViewportSize(VIEWPORTS[viewport]);
}

/**
 * Test across multiple viewports
 * Helper to run the same test logic across different screen sizes
 *
 * @example
 * await testAcrossViewports(page, ['mobile', 'desktop'], async (viewport) => {
 *   await page.goto('/es');
 *   await expect(page.locator('header')).toBeVisible();
 * });
 */
export async function testAcrossViewports(
  page: Page,
  viewports: ViewportKey[],
  testFn: (viewport: ViewportKey) => Promise<void>,
): Promise<void> {
  for (const viewport of viewports) {
    await setViewport(page, viewport);
    await testFn(viewport);
  }
}
