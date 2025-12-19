import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test.describe("Accessibility - Comprehensive", () => {
  test.describe("WCAG 2.1 Level A Compliance", () => {
    test("should pass WCAG 2.1 Level A on Spanish home", async ({ page }) => {
      await page.goto("/es/");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should pass WCAG 2.1 Level A on English home", async ({ page }) => {
      await page.goto("/en/");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should pass WCAG 2.1 Level A on Spanish about", async ({ page }) => {
      await page.goto("/es/about/");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should pass WCAG 2.1 Level A on English about", async ({ page }) => {
      await page.goto("/en/about/");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("WCAG 2.1 Level AA Compliance", () => {
    test("should pass WCAG 2.1 Level AA on Spanish home", async ({ page }) => {
      await page.goto("/es/");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should pass WCAG 2.1 Level AA on English about", async ({ page }) => {
      await page.goto("/en/about/");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("should be able to tab through interactive elements", async ({ page }) => {
      await page.goto("/es/");

      // Start tabbing
      await page.keyboard.press("Tab");

      // First focusable element should be a link or input
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.tagName;
      });

      expect(["A", "INPUT", "BUTTON", "LABEL"]).toContain(focused);
    });

    test("should be able to activate theme switcher", async ({ page }) => {
      await page.goto("/es/");

      const bodyBefore = page.locator("body");
      const initialTheme = await bodyBefore.getAttribute("class");

      // Click theme switcher
      await page.locator(".theme-switcher__selector__image").click();

      const finalTheme = await bodyBefore.getAttribute("class");

      // Theme should have changed
      expect(initialTheme).not.toBe(finalTheme);
    });

    test("should show focus indicators on interactive elements", async ({ page }) => {
      await page.goto("/es/");

      // Tab to first interactive element
      await page.keyboard.press("Tab");

      // Wait a bit for focus to settle
      await page.waitForTimeout(100);

      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe("Screen Reader Support", () => {
    test("should have proper ARIA labels on language switcher", async ({ page }) => {
      await page.goto("/es/");

      const langSwitcherImg = page.locator(".language-switcher img");

      // Should have alt text
      const alt = await langSwitcherImg.getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt).toContain("Inglés");
    });

    test("should have proper title on theme switcher", async ({ page }) => {
      await page.goto("/es/");

      const themeSwitcher = page.locator(".theme-switcher__selector__image");

      // Should have title attribute
      const title = await themeSwitcher.getAttribute("title");
      expect(title).toBeTruthy();
      expect(title).toContain("tema");
    });

    test("should have semantic HTML structure", async ({ page }) => {
      await page.goto("/es/");

      // Should have nav element
      await expect(page.locator("nav")).toBeVisible();

      // Should have main element
      await expect(page.locator("main")).toBeVisible();

      // Should have proper heading hierarchy
      await expect(page.locator("h1")).toBeVisible();
    });

    test("should have lang attribute on html element", async ({ page }) => {
      await page.goto("/es/");
      await expect(page.locator("html")).toHaveAttribute("lang", "es");

      await page.goto("/en/");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });

    test("should have descriptive page titles", async ({ page }) => {
      await page.goto("/es/");
      const homeTitle = await page.title();
      expect(homeTitle.length).toBeGreaterThan(0);
      expect(homeTitle).toContain("Francisco");

      await page.goto("/es/about/");
      const aboutTitle = await page.title();
      expect(aboutTitle.length).toBeGreaterThan(0);
      expect(aboutTitle).toContain("Sobre");
    });
  });

  test.describe("Color Contrast", () => {
    test("should have sufficient color contrast in dark theme", async ({ page }) => {
      await page.goto("/es/");

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();

      const contrastViolations = accessibilityScanResults.violations.filter((v) => v.id === "color-contrast");

      expect(contrastViolations).toHaveLength(0);
    });

    test("should pass basic accessibility in light theme", async ({ page }) => {
      await page.goto("/es/");

      // Switch to light theme
      await page.locator(".theme-switcher__selector__image").click();

      // Just check no critical violations
      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).analyze();

      // Filter only critical violations
      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      expect(criticalViolations).toHaveLength(0);
    });
  });

  test.describe("Images & Alternative Text", () => {
    test("should have alt text on all images", async ({ page }) => {
      await page.goto("/es/");

      const images = page.locator("img");
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute("alt");
        expect(alt).toBeTruthy();
      }
    });

    test("should have meaningful alt text on language flags", async ({ page }) => {
      await page.goto("/es/");

      const flagImg = page.locator(".language-switcher img");
      const alt = await flagImg.getAttribute("alt");

      expect(alt).toBeTruthy();
      expect(alt!.length).toBeGreaterThan(5); // Should be descriptive
    });
  });

  test.describe("Form Controls & Interactive Elements", () => {
    test("should have associated labels for form controls", async ({ page }) => {
      await page.goto("/es/");

      // Should have associated label
      const labelFor = await page.locator('label[for="selector"]').count();
      expect(labelFor).toBe(1);
    });

    test("should have proper input types", async ({ page }) => {
      await page.goto("/es/");

      const checkbox = page.locator("#selector");
      const type = await checkbox.getAttribute("type");

      expect(type).toBe("checkbox");
    });
  });
});
