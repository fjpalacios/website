/**
 * Wait Helper Functions
 *
 * Custom wait conditions and timing utilities for E2E tests.
 */

import type { Page, Locator } from "@playwright/test";

/**
 * Wait for element to be stable (not moving/animating)
 * Useful for elements with transitions or animations
 *
 * @param locator - Element locator
 * @param timeoutMs - Maximum time to wait (default 5000ms)
 */
export async function waitForElementStable(locator: Locator, timeoutMs = 5000): Promise<void> {
  const startTime = Date.now();
  let previousBox = await locator.boundingBox();

  while (Date.now() - startTime < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const currentBox = await locator.boundingBox();

    if (
      previousBox &&
      currentBox &&
      previousBox.x === currentBox.x &&
      previousBox.y === currentBox.y &&
      previousBox.width === currentBox.width &&
      previousBox.height === currentBox.height
    ) {
      return; // Element is stable
    }

    previousBox = currentBox;
  }

  throw new Error(`Element did not stabilize within ${timeoutMs}ms`);
}

/**
 * Wait for images to load on the page
 * Ensures all visible images are fully loaded
 *
 * @param page - Playwright page instance
 */
export async function waitForImagesLoaded(page: Page): Promise<void> {
  await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll("img"));
    return Promise.all(
      images
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.addEventListener("load", resolve);
              img.addEventListener("error", resolve); // Also resolve on error to not block
            }),
        ),
    );
  });
}

/**
 * Wait for network to be completely idle
 * More strict than waitForLoadState('networkidle')
 *
 * @param page - Playwright page instance
 * @param idleTimeMs - Time with no network activity (default 500ms)
 */
export async function waitForNetworkIdle(page: Page, idleTimeMs = 500): Promise<void> {
  let timeout: NodeJS.Timeout;
  let resolve: () => void;

  const promise = new Promise<void>((res) => {
    resolve = res;
  });

  const resetTimeout = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => resolve(), idleTimeMs);
  };

  page.on("request", resetTimeout);
  page.on("response", resetTimeout);

  resetTimeout(); // Start initial timeout

  await promise;

  page.off("request", resetTimeout);
  page.off("response", resetTimeout);
}
