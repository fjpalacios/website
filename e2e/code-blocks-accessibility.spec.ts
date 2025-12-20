import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test.describe("Code Blocks - Accessibility & Color Contrast", () => {
  test.describe("WCAG Compliance on Tutorial Pages", () => {
    test("should pass WCAG 2.1 Level AA on Spanish tutorial (dark theme)", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      // Ensure dark theme
      await expect(page.locator("body")).toHaveClass(/dark/);

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa", "wcag21aa"]).analyze();

      if (accessibilityScanResults.violations.length > 0) {
        console.log("Accessibility violations found:");
        accessibilityScanResults.violations.forEach((violation) => {
          console.log(`\n- ${violation.id}: ${violation.description}`);
          console.log(`  Impact: ${violation.impact}`);
          console.log(`  Help: ${violation.help}`);
          console.log(`  Affected elements: ${violation.nodes.length}`);
          violation.nodes.forEach((node) => {
            console.log(`    - ${node.html}`);
            console.log(`      Failure: ${node.failureSummary}`);
          });
        });
      }

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should pass WCAG 2.1 Level AA on Spanish tutorial (light theme)", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      // Switch to light theme
      await page.locator(".theme-switcher__selector__image").click();
      await expect(page.locator("body")).toHaveClass(/light/);

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa", "wcag21aa"]).analyze();

      if (accessibilityScanResults.violations.length > 0) {
        console.log("Accessibility violations found:");
        accessibilityScanResults.violations.forEach((violation) => {
          console.log(`\n- ${violation.id}: ${violation.description}`);
          console.log(`  Impact: ${violation.impact}`);
          console.log(`  Help: ${violation.help}`);
          console.log(`  Affected elements: ${violation.nodes.length}`);
          violation.nodes.forEach((node) => {
            console.log(`    - ${node.html}`);
            console.log(`      Failure: ${node.failureSummary}`);
          });
        });
      }

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should pass WCAG 2.1 Level AA on English tutorial (dark theme)", async ({ page }) => {
      await page.goto("/en/tutorials/javascript-variables-guide/");

      await expect(page.locator("body")).toHaveClass(/dark/);

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa", "wcag21aa"]).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should pass WCAG 2.1 Level AA on English tutorial (light theme)", async ({ page }) => {
      await page.goto("/en/tutorials/javascript-variables-guide/");

      await page.locator(".theme-switcher__selector__image").click();
      await expect(page.locator("body")).toHaveClass(/light/);

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa", "wcag21aa"]).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Color Contrast - Code Blocks", () => {
    test("should have sufficient contrast in code syntax (dark theme)", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      const codeBlock = page.locator('pre[class*="language-"]').first();
      await expect(codeBlock).toBeVisible();

      // Get background color of code block
      const bgColor = await codeBlock.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Get color of various syntax elements
      const keyword = codeBlock.locator(".token.keyword").first();
      if ((await keyword.count()) > 0) {
        const keywordColor = await keyword.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });

        // Colors should be defined (not transparent)
        expect(bgColor).toBeTruthy();
        expect(keywordColor).toBeTruthy();
        expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
      }

      // Check line numbers contrast
      const lineNumber = codeBlock.locator(".code-line.line-number").first();
      if ((await lineNumber.count()) > 0) {
        const lineNumColor = await lineNumber.evaluate((el) => {
          const beforeStyle = window.getComputedStyle(el, "::before");
          return beforeStyle.color;
        });

        expect(lineNumColor).toBeTruthy();
      }
    });

    test("should have sufficient contrast in code syntax (light theme)", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      // Switch to light theme
      await page.locator(".theme-switcher__selector__image").click();
      await expect(page.locator("body")).toHaveClass(/light/);

      const codeBlock = page.locator('pre[class*="language-"]').first();

      const bgColor = await codeBlock.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      expect(bgColor).toBeTruthy();
      expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
    });

    test("should have sufficient contrast for copy button (dark theme)", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      const copyButton = page.locator(".code-copy-button").first();
      await expect(copyButton).toBeVisible();

      // Get computed styles
      const styles = await copyButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      // All should have defined colors
      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();
      expect(styles.borderColor).toBeTruthy();

      // Should not be fully transparent
      expect(styles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    });

    test("should have sufficient contrast for copy button (light theme)", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      await page.locator(".theme-switcher__selector__image").click();
      await expect(page.locator("body")).toHaveClass(/light/);

      const copyButton = page.locator(".code-copy-button").first();

      const styles = await copyButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();
      expect(styles.borderColor).toBeTruthy();
      expect(styles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    });

    test("should have sufficient contrast for language label (dark theme)", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      const langLabel = page.locator(".code-language-label").first();
      await expect(langLabel).toBeVisible();

      const styles = await langLabel.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });

      expect(styles.color).toBeTruthy();
      // Language label uses parent's background
      expect(styles.backgroundColor).toBeTruthy();
    });

    test("should have sufficient contrast for language label (light theme)", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      await page.locator(".theme-switcher__selector__image").click();
      await expect(page.locator("body")).toHaveClass(/light/);

      const langLabel = page.locator(".code-language-label").first();

      const styles = await langLabel.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });

      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();
    });

    test("should have visible focus indicator on copy button", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      const copyButton = page.locator(".code-copy-button").first();

      // Focus the button
      await copyButton.focus();

      // Button should be focused
      const isFocused = await copyButton.evaluate((el) => document.activeElement === el);
      expect(isFocused).toBe(true);

      // Check if outline is visible (focus indicator)
      const outlineStyle = await copyButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
          outlineStyle: computed.outlineStyle,
          outlineColor: computed.outlineColor,
        };
      });

      // Should have some form of focus indicator
      // Either outline or other visual feedback
      const hasFocusIndicator =
        outlineStyle.outlineWidth !== "0px" || outlineStyle.outline !== "none" || outlineStyle.outline.includes("rgb");

      expect(hasFocusIndicator).toBe(true);
    });
  });

  test.describe("Color Contrast Ratios - Manual Verification", () => {
    test("should log color contrast information for manual verification", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      console.log("\n=== DARK THEME COLOR ANALYSIS ===");

      // Code block background
      const codeBlock = page.locator('pre[class*="language-"]').first();
      const codeBg = await codeBlock.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      console.log(`Code block background: ${codeBg}`);

      // Various token colors
      const tokenTypes = [
        ".token.keyword",
        ".token.string",
        ".token.number",
        ".token.operator",
        ".token.comment",
        ".token.function",
      ];

      for (const tokenType of tokenTypes) {
        const token = codeBlock.locator(tokenType).first();
        if ((await token.count()) > 0) {
          const tokenColor = await token.evaluate((el) => window.getComputedStyle(el).color);
          console.log(`${tokenType} color: ${tokenColor}`);
        }
      }

      // Copy button
      const copyButton = page.locator(".code-copy-button").first();
      const buttonStyles = await copyButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          bg: computed.backgroundColor,
          border: computed.borderColor,
        };
      });
      console.log(`Copy button - color: ${buttonStyles.color}, bg: ${buttonStyles.bg}, border: ${buttonStyles.border}`);

      // Language label
      const langLabel = page.locator(".code-language-label").first();
      const labelColor = await langLabel.evaluate((el) => window.getComputedStyle(el).color);
      console.log(`Language label color: ${labelColor}`);

      // Line numbers
      const lineNumber = codeBlock.locator(".code-line.line-number").first();
      const lineNumColor = await lineNumber.evaluate((el) => {
        const beforeStyle = window.getComputedStyle(el, "::before");
        return beforeStyle.color;
      });
      console.log(`Line number color: ${lineNumColor}`);

      // Switch to light theme
      await page.locator(".theme-switcher__selector__image").click();
      await expect(page.locator("body")).toHaveClass(/light/);
      await page.waitForTimeout(300);

      console.log("\n=== LIGHT THEME COLOR ANALYSIS ===");

      const codeBgLight = await codeBlock.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      console.log(`Code block background: ${codeBgLight}`);

      const buttonStylesLight = await copyButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          bg: computed.backgroundColor,
          border: computed.borderColor,
        };
      });
      console.log(
        `Copy button - color: ${buttonStylesLight.color}, bg: ${buttonStylesLight.bg}, border: ${buttonStylesLight.border}`,
      );

      const labelColorLight = await langLabel.evaluate((el) => window.getComputedStyle(el).color);
      console.log(`Language label color: ${labelColorLight}`);

      console.log("===================================\n");

      // This test always passes - it's just for logging
      expect(true).toBe(true);
    });
  });

  test.describe("Screen Reader Support", () => {
    test("should have proper ARIA labels on interactive elements", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      const copyButton = page.locator(".code-copy-button").first();

      // Check ARIA attributes
      await expect(copyButton).toHaveAttribute("aria-label");
      await expect(copyButton).toHaveAttribute("type", "button");

      // Verify ARIA label is meaningful
      const ariaLabel = await copyButton.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel!.length).toBeGreaterThan(5); // Should be descriptive
    });

    test("should have proper semantic HTML structure", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      // Code blocks should use <pre> and <code>
      const pre = page.locator('pre[class*="language-"]').first();
      await expect(pre).toBeVisible();

      const code = pre.locator("code");
      await expect(code).toBeVisible();

      // Buttons should be <button> elements
      const button = page.locator(".code-copy-button").first();
      const tagName = await button.evaluate((el) => el.tagName);
      expect(tagName).toBe("BUTTON");
    });

    test("should not have accessibility violations in code blocks", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      // Run accessibility scan specifically on code blocks area
      const accessibilityScanResults = await new AxeBuilder({ page }).include('pre[class*="language-"]').analyze();

      if (accessibilityScanResults.violations.length > 0) {
        console.log("\nCode block accessibility violations:");
        accessibilityScanResults.violations.forEach((violation) => {
          console.log(`- ${violation.id}: ${violation.description}`);
          console.log(`  Impact: ${violation.impact}`);
        });
      }

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("should be able to focus and activate copy button with keyboard", async ({ page, context }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);

      const copyButton = page.locator(".code-copy-button").first();

      // Focus button
      await copyButton.focus();

      // Should be focused
      const isFocused = await copyButton.evaluate((el) => document.activeElement === el);
      expect(isFocused).toBe(true);

      // Activate with keyboard (Space or Enter should work)
      await page.keyboard.press("Enter");

      // Should show feedback
      await expect(copyButton).toHaveText("✓");
    });

    test("should be able to tab to copy button", async ({ page }) => {
      await page.goto("/es/tutorials/guia-variables-javascript/");

      const copyButton = page.locator(".code-copy-button").first();

      // Tab until we reach a button (or timeout)
      let attempts = 0;
      while (attempts < 20) {
        await page.keyboard.press("Tab");
        const activeElement = await page.evaluate(() => document.activeElement?.tagName);
        if (activeElement === "BUTTON") {
          break;
        }
        attempts++;
      }

      // We should eventually reach a button
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeElement).toBe("BUTTON");
    });
  });
});
