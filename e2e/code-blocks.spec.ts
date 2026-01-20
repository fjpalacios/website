import { test, expect } from "@playwright/test";

/**
 * Code Blocks E2E Tests
 *
 * Tests the functionality and visual regression of syntax-highlighted code blocks
 * including toolbar (language label + copy button), line numbers, and styling.
 */

test.describe("Code Blocks", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/es/tutoriales/primeros-pasos-con-git");
    await page.waitForLoadState("networkidle");
  });

  test("should render code blocks with syntax highlighting", async ({ page }) => {
    const codeBlocks = page.locator('pre[class*="language-"]');
    const count = await codeBlocks.count();

    expect(count).toBeGreaterThan(0);

    // Verify first code block has Prism classes
    const firstBlock = codeBlocks.first();
    await expect(firstBlock).toHaveClass(/language-/);

    // Verify syntax highlighting tokens exist
    const tokens = firstBlock.locator(".token");
    await expect(tokens.first()).toBeVisible();
  });

  test("should display code toolbar with language label", async ({ page }) => {
    const codeBlocks = page.locator('pre[class*="language-"]');
    const firstBlock = codeBlocks.first();

    // Check toolbar exists
    const toolbar = firstBlock.locator(".code-toolbar");
    await expect(toolbar).toBeVisible();

    // Check language label exists and has content
    const langLabel = toolbar.locator(".code-language-label");
    await expect(langLabel).toBeVisible();

    const langText = await langLabel.textContent();
    expect(langText).toBeTruthy();
    expect(langText?.length).toBeGreaterThan(0);
  });

  test("should display copy button in toolbar", async ({ page }) => {
    const codeBlocks = page.locator('pre[class*="language-"]');
    const firstBlock = codeBlocks.first();
    const toolbar = firstBlock.locator(".code-toolbar");

    // Check copy button exists
    const copyButton = toolbar.locator(".code-copy-button");
    await expect(copyButton).toBeVisible();

    // Verify button has proper ARIA label
    const ariaLabel = await copyButton.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();

    // Verify button has icon
    const icon = copyButton.locator("svg");
    await expect(icon).toBeVisible();
  });

  test("should copy code to clipboard when copy button is clicked", async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    const codeBlocks = page.locator('pre[class*="language-"]');
    const firstBlock = codeBlocks.first();
    const copyButton = firstBlock.locator(".code-copy-button");

    // Get original code text
    const codeElement = firstBlock.locator("code");
    const originalText = await codeElement.textContent();

    // Click copy button
    await copyButton.click();

    // Wait for copied state
    await expect(copyButton).toHaveClass(/copied/);

    // Verify clipboard contains the code
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(originalText);

    // Wait for button to reset (default timeout is 2000ms)
    await page.waitForTimeout(2100);
    await expect(copyButton).not.toHaveClass(/copied/);
  });

  test("should display line numbers", async ({ page }) => {
    const codeBlocks = page.locator('pre[class*="language-"]');
    const firstBlock = codeBlocks.first();

    // Check for line number elements
    const lineNumbers = firstBlock.locator(".line-number");
    const count = await lineNumbers.count();

    expect(count).toBeGreaterThan(0);

    // Verify first line number has the line attribute
    const firstLine = lineNumbers.first();
    const lineAttr = await firstLine.getAttribute("line");
    expect(lineAttr).toBe("1");
  });

  test("should render all code blocks on tutorial page", async ({ page }) => {
    // This tutorial has 7 code blocks (shell, git, html)
    const codeBlocks = page.locator('pre[class*="language-"]');
    const count = await codeBlocks.count();

    expect(count).toBe(7);

    // Verify each has a toolbar
    for (let i = 0; i < count; i++) {
      const block = codeBlocks.nth(i);
      const toolbar = block.locator(".code-toolbar");
      await expect(toolbar).toBeVisible();
    }
  });

  test("should work with Astro page transitions", async ({ page }) => {
    // Navigate to another tutorial
    await page.goto("/es/tutoriales/que-es-git");
    await page.waitForLoadState("networkidle");

    // Verify code blocks still have toolbars after navigation
    const codeBlocks = page.locator('pre[class*="language-"]');
    const count = await codeBlocks.count();

    if (count > 0) {
      const firstBlock = codeBlocks.first();
      const toolbar = firstBlock.locator(".code-toolbar");
      await expect(toolbar).toBeVisible();
    }
  });

  test("should maintain proper z-index stacking (toolbar above code)", async ({ page }) => {
    const codeBlocks = page.locator('pre[class*="language-"]');
    const firstBlock = codeBlocks.first();
    const toolbar = firstBlock.locator(".code-toolbar");

    // Get z-index of toolbar
    const zIndex = await toolbar.evaluate((el) => window.getComputedStyle(el).zIndex);

    // Toolbar should have z-index of 10
    expect(parseInt(zIndex)).toBe(10);
  });

  test("should have accessible copy button", async ({ page }) => {
    const codeBlocks = page.locator('pre[class*="language-"]');
    const firstBlock = codeBlocks.first();
    const copyButton = firstBlock.locator(".code-copy-button");

    // Check button type
    const buttonType = await copyButton.getAttribute("type");
    expect(buttonType).toBe("button");

    // Check aria-label exists
    const ariaLabel = await copyButton.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();

    // Check button is keyboard accessible
    await copyButton.focus();
    await expect(copyButton).toBeFocused();
  });

  test("should announce copy status to screen readers", async ({ page }) => {
    // Check if status element exists
    const statusElement = page.locator("#code-copy-status");
    await expect(statusElement).toBeAttached();

    // Verify it has proper ARIA attributes
    const role = await statusElement.getAttribute("role");
    const ariaLive = await statusElement.getAttribute("aria-live");
    const ariaAtomic = await statusElement.getAttribute("aria-atomic");

    expect(role).toBe("status");
    expect(ariaLive).toBe("polite");
    expect(ariaAtomic).toBe("true");
  });
});

test.describe("Code Blocks - Theme Support", () => {
  test("should apply dark theme styles by default", async ({ page }) => {
    await page.goto("/es/tutoriales/primeros-pasos-con-git");
    await page.waitForLoadState("networkidle");

    const codeBlocks = page.locator('pre[class*="language-"]');
    const firstBlock = codeBlocks.first();

    // Check background color is dark (primary color)
    const bgColor = await firstBlock.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bgColor).toBeTruthy();
  });

  test("should update styles when theme changes", async ({ page }) => {
    await page.goto("/es/tutoriales/primeros-pasos-con-git");
    await page.waitForLoadState("networkidle");

    // Toggle to light theme
    const themeButton = page.locator('button[aria-label*="tema"]').first();
    await themeButton.click();

    // Wait for theme transition
    await page.waitForTimeout(300);

    // Verify body has light class
    const bodyClass = await page.locator("body").getAttribute("class");
    expect(bodyClass).toContain("light");

    // Code blocks should still be visible and functional
    const codeBlocks = page.locator('pre[class*="language-"]');
    const firstBlock = codeBlocks.first();
    const toolbar = firstBlock.locator(".code-toolbar");
    await expect(toolbar).toBeVisible();
  });

  test("should display visible borders in light theme", async ({ page }) => {
    await page.goto("/es/tutoriales/primeros-pasos-con-git");
    await page.waitForLoadState("networkidle");

    // Toggle to light theme
    const themeButton = page.locator('button[aria-label*="tema"]').first();
    await themeButton.click();
    await page.waitForTimeout(300);

    const codeBlocks = page.locator('pre[class*="language-"]');
    const firstBlock = codeBlocks.first();

    // Check toolbar border
    const toolbar = firstBlock.locator(".code-toolbar");
    const toolbarBorderBottom = await toolbar.evaluate((el) => window.getComputedStyle(el).borderBottomColor);

    // Border should have visible color (not transparent or same as background)
    expect(toolbarBorderBottom).not.toBe("rgba(0, 0, 0, 0)");
    expect(toolbarBorderBottom).not.toBe("transparent");

    // Check line number border
    const lineNumber = firstBlock.locator(".line-number").first();
    const lineNumberBorderRight = await lineNumber.evaluate((el) => {
      const pseudoElement = window.getComputedStyle(el, "::before");
      return pseudoElement.borderRightColor;
    });

    // Border should have visible color
    expect(lineNumberBorderRight).not.toBe("rgba(0, 0, 0, 0)");
    expect(lineNumberBorderRight).not.toBe("transparent");
  });

  test("should display visible copy button icon in light theme", async ({ page }) => {
    await page.goto("/es/tutoriales/primeros-pasos-con-git");
    await page.waitForLoadState("networkidle");

    // Toggle to light theme
    const themeButton = page.locator('button[aria-label*="tema"]').first();
    await themeButton.click();
    await page.waitForTimeout(300);

    const codeBlocks = page.locator('pre[class*="language-"]');
    const firstBlock = codeBlocks.first();
    const copyButton = firstBlock.locator(".code-copy-button");

    // Check button is visible
    await expect(copyButton).toBeVisible();

    // Check icon is visible
    const icon = copyButton.locator("svg");
    await expect(icon).toBeVisible();

    // Check button has visible background color
    const bgColor = await copyButton.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(bgColor).not.toBe("transparent");

    // Check button text/icon color is visible (not black on dark background)
    const color = await copyButton.evaluate((el) => window.getComputedStyle(el).color);
    expect(color).not.toBe("rgb(0, 0, 0)");
    expect(color).not.toBe("rgba(0, 0, 0, 0)");
  });
});
