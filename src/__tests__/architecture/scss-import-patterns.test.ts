import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { describe, it, expect } from "vitest";

/**
 * Architecture Test: SCSS Import Patterns
 *
 * Validates that Astro components follow the correct pattern for importing SCSS:
 *
 * RULE 1: SCSS files with :global() selectors MUST be imported via <style> tags
 * - Astro's scoped styling system only processes :global() within <style> tags
 * - Frontmatter imports bypass this processing, breaking global styles
 *
 * RULE 2: SCSS files without :global() selectors SHOULD use frontmatter imports
 * - Cleaner code organization
 * - Consistent with other asset imports
 *
 * This test prevents bugs like the search modal styling issue (commit bfc3127)
 */

const COMPONENTS_DIR = join(process.cwd(), "src/components");
const STYLES_DIR = join(process.cwd(), "src/styles/components");

interface ComponentStyleInfo {
  componentPath: string;
  componentName: string;
  scssPath: string | null;
  hasGlobalSelectors: boolean;
  usesFrontmatterImport: boolean;
  usesStyleTag: boolean;
}

/**
 * Get all .astro files in components directory
 */
function getAstroComponents(): string[] {
  if (!existsSync(COMPONENTS_DIR)) return [];

  return readdirSync(COMPONENTS_DIR)
    .filter((file) => file.endsWith(".astro"))
    .map((file) => join(COMPONENTS_DIR, file));
}

/**
 * Extract SCSS import info from an Astro component
 */
function analyzeComponent(componentPath: string): ComponentStyleInfo {
  const content = readFileSync(componentPath, "utf-8");
  const componentName = componentPath.split("/").pop()?.replace(".astro", "") || "";

  // Check for frontmatter import (e.g., import "@styles/components/foo.scss")
  const frontmatterImportMatch = content.match(/import\s+["']@styles\/components\/(.+?)\.scss["']/);
  const usesFrontmatterImport = !!frontmatterImportMatch;

  // Check for <style> tag with @use (e.g., <style lang="scss">@use "../styles/components/foo"</style>)
  const styleTagMatch = content.match(/<style[^>]*>\s*@use\s+["']\.\.\/styles\/components\/(.+?)["']/);
  const usesStyleTag = !!styleTagMatch;

  // Determine SCSS file path
  let scssFileName: string | null = null;
  if (frontmatterImportMatch) {
    scssFileName = frontmatterImportMatch[1];
  } else if (styleTagMatch) {
    scssFileName = styleTagMatch[1].replace(/\.scss$/, "");
  }

  const scssPath = scssFileName ? join(STYLES_DIR, `${scssFileName}.scss`) : null;

  // Check if SCSS file has :global() selectors
  let hasGlobalSelectors = false;
  if (scssPath && existsSync(scssPath)) {
    const scssContent = readFileSync(scssPath, "utf-8");
    hasGlobalSelectors = scssContent.includes(":global(");
  }

  return {
    componentPath,
    componentName,
    scssPath,
    hasGlobalSelectors,
    usesFrontmatterImport,
    usesStyleTag,
  };
}

describe("SCSS Import Patterns", () => {
  const components = getAstroComponents();
  const componentsWithStyles = components
    .map(analyzeComponent)
    .filter((info) => info.scssPath !== null && existsSync(info.scssPath));

  it("should find Astro components with SCSS imports", () => {
    expect(componentsWithStyles.length).toBeGreaterThan(0);
  });

  describe("RULE: SCSS with :global() selectors must use <style> tags", () => {
    const componentsWithGlobal = componentsWithStyles.filter((info) => info.hasGlobalSelectors);

    it("should find components with :global() selectors", () => {
      expect(componentsWithGlobal.length).toBeGreaterThan(0);
    });

    componentsWithGlobal.forEach((info) => {
      it(`${info.componentName}: should use <style> tag for SCSS with :global()`, () => {
        expect(info.usesStyleTag).toBe(true);
        expect(info.usesFrontmatterImport).toBe(false);

        // Provide helpful error message
        if (!info.usesStyleTag && info.usesFrontmatterImport) {
          throw new Error(
            `${info.componentName} uses frontmatter import for ${info.scssPath?.split("/").pop()} which contains :global() selectors.\n\n` +
              `INCORRECT (current):\n` +
              `  import "@styles/components/${info.scssPath?.split("/").pop()?.replace(".scss", "")}"\n\n` +
              `CORRECT:\n` +
              `  <style lang="scss">\n` +
              `    @use "../styles/components/${info.scssPath?.split("/").pop()?.replace(".scss", "")}";\n` +
              `  </style>\n\n` +
              `Reason: :global() selectors must be processed by Astro's scoped styling system.`,
          );
        }
      });
    });
  });

  describe("RULE: SCSS without :global() should prefer frontmatter imports", () => {
    const componentsWithoutGlobal = componentsWithStyles.filter((info) => !info.hasGlobalSelectors);

    it("should find components without :global() selectors", () => {
      expect(componentsWithoutGlobal.length).toBeGreaterThan(0);
    });

    componentsWithoutGlobal.forEach((info) => {
      it(`${info.componentName}: should use frontmatter import for component-scoped SCSS`, () => {
        // This is a SHOULD, not MUST - both patterns work, but frontmatter is preferred
        if (info.usesStyleTag && !info.usesFrontmatterImport) {
          console.warn(
            `⚠️  ${info.componentName} uses <style> tag but SCSS has no :global() selectors.\n` +
              `   Consider using frontmatter import for consistency:\n` +
              `   import "@styles/components/${info.scssPath?.split("/").pop()?.replace(".scss", "")}"\n`,
          );
        }

        // Don't fail - just document the preference
        expect(true).toBe(true);
      });
    });
  });

  describe("INTEGRITY: Component-SCSS mapping", () => {
    componentsWithStyles.forEach((info) => {
      it(`${info.componentName}: should have exactly one import method (frontmatter OR <style> tag)`, () => {
        const importCount = (info.usesFrontmatterImport ? 1 : 0) + (info.usesStyleTag ? 1 : 0);

        expect(importCount).toBe(1);

        if (importCount !== 1) {
          throw new Error(
            `${info.componentName} has ${importCount} SCSS import methods (should be exactly 1).\n` +
              `Frontmatter: ${info.usesFrontmatterImport}, Style tag: ${info.usesStyleTag}`,
          );
        }
      });
    });
  });

  describe("DOCUMENTATION: Current state", () => {
    it("should document all components with :global() selectors", () => {
      const withGlobal = componentsWithStyles
        .filter((info) => info.hasGlobalSelectors)
        .map((info) => ({
          component: info.componentName,
          scss: info.scssPath?.split("/").pop(),
          usesCorrectPattern: info.usesStyleTag && !info.usesFrontmatterImport,
        }));

      console.log("\n📊 Components with :global() selectors:");
      console.table(withGlobal);

      expect(withGlobal.length).toBeGreaterThan(0);
    });
  });
});
