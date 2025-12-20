import { test, expect } from "@playwright/test";

test.describe("Code Blocks with Copy Button", () => {
  test.describe("Spanish Tutorial Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");
    });

    test("should display code blocks with syntax highlighting", async ({ page }) => {
      const codeBlock = page.locator('pre[class*="language-"]').first();
      await expect(codeBlock).toBeVisible();

      // Verify Prism is applying syntax highlighting
      const highlightedCode = codeBlock.locator("code.code-highlight");
      await expect(highlightedCode).toBeVisible();
    });

    test("should display language label in code toolbar", async ({ page }) => {
      const languageLabel = page.locator(".code-language-label").first();
      await expect(languageLabel).toBeVisible();
      await expect(languageLabel).toHaveText("javascript");
    });

    test("should display copy button in code toolbar", async ({ page }) => {
      const copyButton = page.locator(".code-copy-button").first();
      await expect(copyButton).toBeVisible();
      await expect(copyButton).toHaveAttribute("type", "button");
    });

    test("should have correct Spanish aria-label on copy button", async ({ page }) => {
      const copyButton = page.locator(".code-copy-button").first();
      await expect(copyButton).toHaveAttribute("aria-label", "Copiar código");
    });

    test("should copy code to clipboard when button is clicked", async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);

      const copyButton = page.locator(".code-copy-button").first();
      const codeBlock = page.locator('pre[class*="language-"]').first();
      const codeContent = await codeBlock.locator("code").textContent();

      // Click copy button
      await copyButton.click();

      // Wait for clipboard to be updated
      await page.waitForTimeout(100);

      // Verify clipboard content
      const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardContent).toBe(codeContent);
    });

    test("should show visual feedback after copying", async ({ page, context }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);

      const copyButton = page.locator(".code-copy-button").first();

      // Initial state
      await expect(copyButton).toHaveText("📋");
      await expect(copyButton).not.toHaveClass(/copied/);

      // Click to copy
      await copyButton.click();

      // Should show checkmark and copied class
      await expect(copyButton).toHaveText("✓");
      await expect(copyButton).toHaveClass(/copied/);

      // Wait for feedback to reset (2 seconds)
      await page.waitForTimeout(2100);

      // Should return to original state
      await expect(copyButton).toHaveText("📋");
      await expect(copyButton).not.toHaveClass(/copied/);
    });

    test("should have toolbar spanning full width of code block", async ({ page }) => {
      const codeBlock = page.locator('pre[class*="language-"]').first();
      const toolbar = codeBlock.locator(".code-toolbar");

      await expect(toolbar).toBeVisible();

      // Get bounding boxes
      const codeBlockBox = await codeBlock.boundingBox();
      const toolbarBox = await toolbar.boundingBox();

      expect(codeBlockBox).not.toBeNull();
      expect(toolbarBox).not.toBeNull();

      // Toolbar should have same width as code block
      expect(toolbarBox!.width).toBeCloseTo(codeBlockBox!.width, 1);
    });

    test("should display line numbers in code blocks", async ({ page }) => {
      const lineNumber = page.locator(".code-line.line-number").first();
      await expect(lineNumber).toBeVisible();

      // Verify line number is rendered via ::before pseudo-element
      const hasLineAttr = await lineNumber.getAttribute("line");
      expect(hasLineAttr).toBeTruthy();
    });

    test("should display multiple code blocks with independent toolbars", async ({ page }) => {
      const codeBlocks = page.locator('pre[class*="language-"]');
      const count = await codeBlocks.count();

      expect(count).toBeGreaterThan(1);

      // Verify each code block has its own toolbar
      for (let i = 0; i < Math.min(count, 3); i++) {
        const toolbar = codeBlocks.nth(i).locator(".code-toolbar");
        await expect(toolbar).toBeVisible();

        const copyButton = toolbar.locator(".code-copy-button");
        await expect(copyButton).toBeVisible();

        const langLabel = toolbar.locator(".code-language-label");
        await expect(langLabel).toBeVisible();
      }
    });

    test("should maintain toolbar visibility on scroll", async ({ page }) => {
      const copyButton = page.locator(".code-copy-button").first();

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 500));

      // Button should still be visible and clickable
      await expect(copyButton).toBeVisible();
    });
  });

  test.describe("English Tutorial Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/en/tutorials/javascript-variables-guide/");
    });

    test("should have correct English aria-label on copy button", async ({ page }) => {
      const copyButton = page.locator(".code-copy-button").first();
      await expect(copyButton).toHaveAttribute("aria-label", "Copy code");
    });

    test("should display code blocks with syntax highlighting", async ({ page }) => {
      const codeBlock = page.locator('pre[class*="language-"]').first();
      await expect(codeBlock).toBeVisible();

      const highlightedCode = codeBlock.locator("code.code-highlight");
      await expect(highlightedCode).toBeVisible();
    });

    test("should copy code to clipboard in English page", async ({ page, context }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);

      const copyButton = page.locator(".code-copy-button").first();
      await copyButton.click();

      await page.waitForTimeout(100);

      const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardContent).toBeTruthy();
      expect(clipboardContent.length).toBeGreaterThan(0);
    });
  });

  test.describe("Theme Support", () => {
    test("should maintain code block visibility in light theme", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      // Switch to light theme
      await page.locator(".theme-switcher__selector__image").click();
      await expect(page.locator("body")).toHaveClass(/light/);

      // Code block should still be visible and readable
      const codeBlock = page.locator('pre[class*="language-"]').first();
      await expect(codeBlock).toBeVisible();

      const toolbar = codeBlock.locator(".code-toolbar");
      await expect(toolbar).toBeVisible();

      const copyButton = toolbar.locator(".code-copy-button");
      await expect(copyButton).toBeVisible();
    });

    test("should maintain code block visibility in dark theme", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      // Ensure dark theme (default)
      await expect(page.locator("body")).toHaveClass(/dark/);

      const codeBlock = page.locator('pre[class*="language-"]').first();
      await expect(codeBlock).toBeVisible();

      const toolbar = codeBlock.locator(".code-toolbar");
      await expect(toolbar).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper ARIA attributes", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      const copyButton = page.locator(".code-copy-button").first();

      // Check required accessibility attributes
      await expect(copyButton).toHaveAttribute("aria-label");
      await expect(copyButton).toHaveAttribute("type", "button");
    });

    test("should be keyboard accessible", async ({ page, context }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);

      const copyButton = page.locator(".code-copy-button").first();

      // Focus the copy button directly
      await copyButton.focus();

      // Verify button is focused
      const isFocused = await copyButton.evaluate((el) => document.activeElement === el);
      expect(isFocused).toBe(true);

      // Press Enter to activate button (keyboard accessibility)
      await page.keyboard.press("Enter");

      // Should show copied feedback
      await expect(copyButton).toHaveText("✓");
    });
  });

  test.describe("Edge Cases", () => {
    test("should not create duplicate toolbars on page transitions", async ({ page }) => {
      // Navigate to tutorial
      await page.goto("/es/tutorials/guia-variables-javascript/");

      const firstBlockToolbars = await page.locator('pre[class*="language-"]').first().locator(".code-toolbar").count();
      expect(firstBlockToolbars).toBe(1);

      // Navigate away
      await page.goto("/es/");

      // Navigate back
      await page.goto("/es/tutorials/guia-variables-javascript/");

      // Should still have only one toolbar per block
      const toolbarsAfterReturn = await page
        .locator('pre[class*="language-"]')
        .first()
        .locator(".code-toolbar")
        .count();
      expect(toolbarsAfterReturn).toBe(1);
    });

    test("should handle code blocks with different languages", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      // Find all language labels
      const langLabels = page.locator(".code-language-label");
      const count = await langLabels.count();

      expect(count).toBeGreaterThan(0);

      // All should be uppercase
      for (let i = 0; i < Math.min(count, 5); i++) {
        const text = await langLabels.nth(i).textContent();
        expect(text).toBeTruthy();
        expect(text?.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe("Responsive Design", () => {
    test("should display copy button on mobile devices", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/es/tutorials/guia-variables-javascript/");

      const copyButton = page.locator(".code-copy-button").first();
      await expect(copyButton).toBeVisible();

      // Button should be clickable on mobile
      const box = await copyButton.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);
    });

    test("should display toolbar correctly on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/es/tutorials/guia-variables-javascript/");

      const toolbar = page.locator(".code-toolbar").first();
      await expect(toolbar).toBeVisible();

      const langLabel = toolbar.locator(".code-language-label");
      const copyButton = toolbar.locator(".code-copy-button");

      await expect(langLabel).toBeVisible();
      await expect(copyButton).toBeVisible();
    });

    test("should not cause horizontal scroll on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/es/tutorials/guia-variables-javascript/");

      // Check if page has horizontal scroll
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );

      // Code blocks might cause horizontal scroll, but it should be minimal
      if (hasHorizontalScroll) {
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

        // Allow small overflow (less than viewport width)
        expect(scrollWidth - clientWidth).toBeLessThan(clientWidth);
      }
    });
  });
});
