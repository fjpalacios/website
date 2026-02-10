// Tests for Layout component
// Verifies performance hints, resource hints, and critical third-party preconnects

import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

const LAYOUT_PATH = path.resolve(__dirname, "../../layouts/Layout.astro");

describe("Layout component", () => {
  let content: string;

  it("should exist", () => {
    expect(fs.existsSync(LAYOUT_PATH)).toBe(true);
    content = fs.readFileSync(LAYOUT_PATH, "utf-8");
  });

  describe("Resource hints — preconnect", () => {
    it("should include preconnect hint for cloudflareinsights.com", () => {
      content = fs.readFileSync(LAYOUT_PATH, "utf-8");

      // Cloudflare injects its Web Analytics beacon script at the edge.
      // Preconnecting early eliminates the connection setup latency (~200ms on mobile).
      expect(content).toMatch(/<link\s+rel="preconnect"\s+href="https:\/\/cloudflareinsights\.com"/);
    });

    it("should include dns-prefetch fallback for cloudflareinsights.com", () => {
      content = fs.readFileSync(LAYOUT_PATH, "utf-8");

      // dns-prefetch is a fallback for browsers that don't support preconnect
      expect(content).toMatch(/<link\s+rel="dns-prefetch"\s+href="https:\/\/cloudflareinsights\.com"/);
    });

    it("should place resource hints before ViewTransitions and other scripts", () => {
      content = fs.readFileSync(LAYOUT_PATH, "utf-8");

      const preconnectPos = content.indexOf('rel="preconnect"');
      const viewTransitionsPos = content.indexOf("<ViewTransitions");

      expect(preconnectPos).toBeGreaterThan(-1);
      expect(viewTransitionsPos).toBeGreaterThan(-1);
      expect(preconnectPos).toBeLessThan(viewTransitionsPos);
    });
  });

  describe("Performance hints — preload", () => {
    it("should conditionally preload cover images for detail pages", () => {
      content = fs.readFileSync(LAYOUT_PATH, "utf-8");

      expect(content).toMatch(/preloadImage\s*&&.*rel="preload".*as="image"/s);
    });
  });
});
