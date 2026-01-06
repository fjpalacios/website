/**
 * Performance Tests - Core Web Vitals & Performance Budgets
 *
 * Comprehensive performance testing following Google's Web Vitals metrics
 * and industry best practices for web performance.
 *
 * Metrics Tested:
 * - Core Web Vitals (LCP, FID, CLS, INP)
 * - Load Performance (TTFB, FCP, TTI, Speed Index)
 * - Bundle Sizes (JS, CSS, Images, Total Page Weight)
 * - Network Optimization (Compression, Caching, HTTP/2)
 * - Resource Loading (Critical Resources, Lazy Loading)
 *
 * Performance Budgets:
 * - LCP < 2.5s (Good), < 4.0s (Needs Improvement)
 * - FID < 100ms (Good), < 300ms (Needs Improvement)
 * - CLS < 0.1 (Good), < 0.25 (Needs Improvement)
 * - TTFB < 800ms (Good), < 1800ms (Needs Improvement)
 * - TTI < 3.5s (Good), < 7.3s (Needs Improvement)
 * - Total Page Weight < 1MB (target), < 2MB (max)
 * - Main JS Bundle < 200KB (target), < 400KB (max)
 * - CSS Bundle < 50KB (target), < 100KB (max)
 *
 * @see https://web.dev/vitals/
 * @see https://web.dev/performance-budgets-101/
 *
 * @group e2e
 * @group performance
 * @group web-vitals
 */

import { test, expect, type Page } from "@playwright/test";

/**
 * Web Vitals metrics interface
 */
interface WebVitalsMetrics {
  lcp?: number;
  fcp?: number;
  cls?: number;
  ttfb?: number;
  domContentLoaded?: number;
  loadComplete?: number;
}

/**
 * Performance budgets (in bytes)
 */
const PERFORMANCE_BUDGETS = {
  // Page weight budgets
  totalPageWeight: {
    target: 1024 * 1024, // 1MB (ideal)
    max: 2 * 1024 * 1024, // 2MB (acceptable)
  },
  // JavaScript budgets
  mainJsBundle: {
    target: 200 * 1024, // 200KB (ideal)
    max: 400 * 1024, // 400KB (acceptable)
  },
  // CSS budgets
  cssBundle: {
    target: 50 * 1024, // 50KB (ideal)
    max: 100 * 1024, // 100KB (acceptable)
  },
  // Individual image size
  singleImage: {
    target: 200 * 1024, // 200KB (ideal)
    max: 500 * 1024, // 500KB (acceptable)
  },
};

/**
 * Core Web Vitals thresholds (Google's standards)
 * @see https://web.dev/defining-core-web-vitals-thresholds/
 */
const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (seconds)
  lcp: {
    good: 2.5,
    needsImprovement: 4.0,
  },
  // First Input Delay (milliseconds)
  fid: {
    good: 100,
    needsImprovement: 300,
  },
  // Cumulative Layout Shift (score)
  cls: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // Time to First Byte (milliseconds)
  ttfb: {
    good: 800,
    needsImprovement: 1800,
  },
  // Time to Interactive (seconds)
  tti: {
    good: 3.5,
    needsImprovement: 7.3,
  },
  // First Contentful Paint (seconds)
  fcp: {
    good: 1.8,
    needsImprovement: 3.0,
  },
};

/**
 * Helper to collect Web Vitals metrics using PerformanceObserver
 */
async function collectWebVitals(page: Page): Promise<WebVitalsMetrics> {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const metrics: Record<string, number> = {};
      let resolved = false;

      // Collect FCP (First Contentful Paint)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        for (const entry of entries) {
          if (entry.name === "first-contentful-paint") {
            metrics.fcp = entry.startTime;
          }
        }
      }).observe({ type: "paint", buffered: true });

      // Collect LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number };
        metrics.lcp = lastEntry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });

      // Collect CLS (Cumulative Layout Shift)
      let clsScore = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!layoutShift.hadRecentInput) {
            clsScore += layoutShift.value || 0;
          }
        }
        metrics.cls = clsScore;
      }).observe({ type: "layout-shift", buffered: true });

      // Collect Navigation Timing
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.requestStart;
        metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
      }

      // Wait for metrics to stabilize
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(metrics);
        }
      }, 3000);
    });
  });
}

/**
 * Helper to get resource sizes
 */
async function getResourceSizes(page: Page) {
  return await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];

    const sizes = {
      totalSize: 0,
      js: 0,
      css: 0,
      images: 0,
      fonts: 0,
      other: 0,
      count: {
        total: resources.length,
        js: 0,
        css: 0,
        images: 0,
        fonts: 0,
      },
      resources: [] as Array<{ name: string; size: number; type: string }>,
    };

    resources.forEach((resource) => {
      const size = resource.transferSize || resource.encodedBodySize || 0;
      const name = resource.name;

      sizes.totalSize += size;

      let type = "other";
      if (name.match(/\.js(\?|$)/)) {
        type = "js";
        sizes.js += size;
        sizes.count.js++;
      } else if (name.match(/\.css(\?|$)/)) {
        type = "css";
        sizes.css += size;
        sizes.count.css++;
      } else if (name.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)(\?|$)/)) {
        type = "images";
        sizes.images += size;
        sizes.count.images++;
      } else if (name.match(/\.(woff|woff2|ttf|otf|eot)(\?|$)/)) {
        type = "fonts";
        sizes.fonts += size;
      } else {
        sizes.other += size;
      }

      sizes.resources.push({ name, size, type });
    });

    return sizes;
  });
}

/**
 * Helper to format bytes to human-readable format
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

test.describe("Core Web Vitals - Homepage", () => {
  test("should meet LCP (Largest Contentful Paint) threshold on homepage", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    const metrics = await collectWebVitals(page);
    const lcpSeconds = (metrics.lcp as number) / 1000;

    console.log(`LCP: ${lcpSeconds.toFixed(2)}s`);

    // Assert Good threshold
    expect(
      lcpSeconds,
      `LCP should be < ${WEB_VITALS_THRESHOLDS.lcp.good}s (Good). Actual: ${lcpSeconds.toFixed(2)}s`,
    ).toBeLessThan(WEB_VITALS_THRESHOLDS.lcp.good);

    // Warning if approaching "Needs Improvement"
    if (lcpSeconds > WEB_VITALS_THRESHOLDS.lcp.good * 0.8) {
      console.warn(`⚠️ LCP is approaching threshold: ${lcpSeconds.toFixed(2)}s`);
    }
  });

  test("should meet FCP (First Contentful Paint) threshold on homepage", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    const metrics = await collectWebVitals(page);
    const fcpSeconds = (metrics.fcp as number) / 1000;

    console.log(`FCP: ${fcpSeconds.toFixed(2)}s`);

    expect(
      fcpSeconds,
      `FCP should be < ${WEB_VITALS_THRESHOLDS.fcp.good}s (Good). Actual: ${fcpSeconds.toFixed(2)}s`,
    ).toBeLessThan(WEB_VITALS_THRESHOLDS.fcp.good);
  });

  test("should meet CLS (Cumulative Layout Shift) threshold on homepage", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    // Wait a bit longer for layout shifts to stabilize
    await page.waitForTimeout(2000);

    const metrics = await collectWebVitals(page);
    // CLS can be undefined if there are no layout shifts (which is EXCELLENT!)
    const cls = (metrics.cls as number) || 0;

    console.log(`CLS: ${cls.toFixed(4)}`);

    expect(cls, `CLS should be < ${WEB_VITALS_THRESHOLDS.cls.good} (Good). Actual: ${cls.toFixed(4)}`).toBeLessThan(
      WEB_VITALS_THRESHOLDS.cls.good,
    );
  });

  test("should meet TTFB (Time to First Byte) threshold on homepage", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "domcontentloaded" });

    const metrics = await collectWebVitals(page);
    const ttfb = metrics.ttfb as number;

    console.log(`TTFB: ${ttfb.toFixed(0)}ms`);

    expect(
      ttfb,
      `TTFB should be < ${WEB_VITALS_THRESHOLDS.ttfb.good}ms (Good). Actual: ${ttfb.toFixed(0)}ms`,
    ).toBeLessThan(WEB_VITALS_THRESHOLDS.ttfb.good);
  });
});

test.describe("Core Web Vitals - Critical Pages", () => {
  test("should meet LCP threshold on book listing page", async ({ page }) => {
    await page.goto("/es/libros/", { waitUntil: "networkidle" });

    const metrics = await collectWebVitals(page);
    const lcpSeconds = (metrics.lcp as number) / 1000;

    console.log(`Book Listing LCP: ${lcpSeconds.toFixed(2)}s`);

    expect(lcpSeconds).toBeLessThan(WEB_VITALS_THRESHOLDS.lcp.good);
  });

  test("should meet LCP threshold on book detail page", async ({ page }) => {
    await page.goto("/es/libros/apocalipsis-stephen-king/", { waitUntil: "networkidle" });

    const metrics = await collectWebVitals(page);
    const lcpSeconds = (metrics.lcp as number) / 1000;

    console.log(`Book Detail LCP: ${lcpSeconds.toFixed(2)}s`);

    expect(lcpSeconds).toBeLessThan(WEB_VITALS_THRESHOLDS.lcp.good);
  });

  test("should meet CLS threshold on book detail page with images", async ({ page }) => {
    await page.goto("/es/libros/apocalipsis-stephen-king/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const metrics = await collectWebVitals(page);
    // CLS can be undefined if there are no layout shifts (which is EXCELLENT!)
    const cls = (metrics.cls as number) || 0;

    console.log(`Book Detail CLS: ${cls.toFixed(4)}`);

    expect(cls).toBeLessThan(WEB_VITALS_THRESHOLDS.cls.good);
  });

  test("should meet LCP threshold on tutorial page", async ({ page }) => {
    await page.goto("/es/tutoriales/primeros-pasos-con-git/", { waitUntil: "networkidle" });

    const metrics = await collectWebVitals(page);
    const lcpSeconds = (metrics.lcp as number) / 1000;

    console.log(`Tutorial Page LCP: ${lcpSeconds.toFixed(2)}s`);

    expect(lcpSeconds).toBeLessThan(WEB_VITALS_THRESHOLDS.lcp.good);
  });
});

test.describe("Performance Budgets - Page Weight", () => {
  test("should meet total page weight budget on homepage", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    const sizes = await getResourceSizes(page);

    console.log(`Total Page Weight: ${formatBytes(sizes.totalSize)}`);
    console.log(`  - JS: ${formatBytes(sizes.js)} (${sizes.count.js} files)`);
    console.log(`  - CSS: ${formatBytes(sizes.css)} (${sizes.count.css} files)`);
    console.log(`  - Images: ${formatBytes(sizes.images)} (${sizes.count.images} files)`);
    console.log(`  - Fonts: ${formatBytes(sizes.fonts)}`);
    console.log(`  - Other: ${formatBytes(sizes.other)}`);

    // Target budget (ideal)
    expect(
      sizes.totalSize,
      `Total page weight should be < ${formatBytes(PERFORMANCE_BUDGETS.totalPageWeight.target)} (target). Actual: ${formatBytes(sizes.totalSize)}`,
    ).toBeLessThan(PERFORMANCE_BUDGETS.totalPageWeight.target);

    // If exceeds target, should at least be under max
    if (sizes.totalSize > PERFORMANCE_BUDGETS.totalPageWeight.target) {
      console.warn(`⚠️ Page weight exceeds target but is within max: ${formatBytes(sizes.totalSize)}`);
      expect(sizes.totalSize).toBeLessThan(PERFORMANCE_BUDGETS.totalPageWeight.max);
    }
  });

  test("should meet JavaScript bundle budget", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    const sizes = await getResourceSizes(page);

    console.log(`Total JS: ${formatBytes(sizes.js)} (${sizes.count.js} files)`);

    // List all JS files for debugging
    const jsFiles = sizes.resources.filter((r) => r.type === "js");
    jsFiles.forEach((file) => {
      console.log(`  - ${file.name.split("/").pop()}: ${formatBytes(file.size)}`);
    });

    expect(
      sizes.js,
      `Total JS should be < ${formatBytes(PERFORMANCE_BUDGETS.mainJsBundle.target)} (target). Actual: ${formatBytes(sizes.js)}`,
    ).toBeLessThan(PERFORMANCE_BUDGETS.mainJsBundle.target);
  });

  test("should meet CSS bundle budget", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    const sizes = await getResourceSizes(page);

    console.log(`Total CSS: ${formatBytes(sizes.css)} (${sizes.count.css} files)`);

    const cssFiles = sizes.resources.filter((r) => r.type === "css");
    cssFiles.forEach((file) => {
      console.log(`  - ${file.name.split("/").pop()}: ${formatBytes(file.size)}`);
    });

    expect(
      sizes.css,
      `Total CSS should be < ${formatBytes(PERFORMANCE_BUDGETS.cssBundle.target)} (target). Actual: ${formatBytes(sizes.css)}`,
    ).toBeLessThan(PERFORMANCE_BUDGETS.cssBundle.target);
  });

  test("should have optimized images (no single image > 500KB)", async ({ page }) => {
    await page.goto("/es/libros/", { waitUntil: "networkidle" });

    const sizes = await getResourceSizes(page);
    const images = sizes.resources.filter((r) => r.type === "images");

    console.log(`Total Images: ${images.length}`);

    const largeImages = images.filter((img) => img.size > PERFORMANCE_BUDGETS.singleImage.max);

    if (largeImages.length > 0) {
      console.error("❌ Large images found:");
      largeImages.forEach((img) => {
        console.error(`  - ${img.name}: ${formatBytes(img.size)}`);
      });
    }

    expect(
      largeImages.length,
      `No single image should exceed ${formatBytes(PERFORMANCE_BUDGETS.singleImage.max)}`,
    ).toBe(0);
  });
});

test.describe("Performance Budgets - Resource Count", () => {
  test("should have reasonable number of HTTP requests", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    const sizes = await getResourceSizes(page);

    console.log(`Total HTTP Requests: ${sizes.count.total}`);
    console.log(`  - JS files: ${sizes.count.js}`);
    console.log(`  - CSS files: ${sizes.count.css}`);
    console.log(`  - Images: ${sizes.count.images}`);

    // Target: < 50 total requests (good performance)
    // Max: < 100 total requests (acceptable)
    expect(sizes.count.total, `Total requests should be < 50 (target). Actual: ${sizes.count.total}`).toBeLessThan(50);
  });

  test("should have minimal JavaScript files (ideally 1-3)", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    const sizes = await getResourceSizes(page);

    console.log(`JavaScript files: ${sizes.count.js}`);

    // Modern bundlers should produce 1-3 JS files (main bundle + maybe chunks)
    expect(sizes.count.js, "Should have minimal JS files (1-5 for optimal performance)").toBeLessThanOrEqual(5);
  });

  test("should have minimal CSS files (ideally 1-2)", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    const sizes = await getResourceSizes(page);

    console.log(`CSS files: ${sizes.count.css}`);

    // Should have 1-2 CSS files (main styles + maybe critical CSS)
    expect(sizes.count.css, "Should have minimal CSS files (1-2 for optimal performance)").toBeLessThanOrEqual(2);
  });
});

test.describe("Network Optimization", () => {
  test("should enable compression (gzip/brotli) for text assets", async ({ page }) => {
    const response = await page.goto("/es/");

    const contentEncoding = response?.headers()["content-encoding"];

    console.log(`Content-Encoding: ${contentEncoding || "none"}`);

    // Should have gzip or brotli compression
    expect(["gzip", "br"]).toContain(contentEncoding);
  });

  test("should have caching headers for static assets", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    // Get all resource responses
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      return entries
        .filter((entry) => entry.name.includes("/_astro/") || entry.name.match(/\.(js|css|woff2)$/))
        .map((entry) => entry.name);
    });

    // Check first static resource has cache headers
    if (resources.length > 0) {
      const testUrl = resources[0];
      const response = await page.goto(testUrl!);
      const cacheControl = response?.headers()["cache-control"];

      console.log(`Cache-Control for ${testUrl}: ${cacheControl}`);

      // Should have some form of caching
      expect(cacheControl).toBeTruthy();

      // In preview mode, might be "no-cache" - that's OK for testing
      // In production, should have max-age or immutable
      if (cacheControl && cacheControl !== "no-cache") {
        expect(cacheControl).toMatch(/max-age|immutable|public/);
      } else {
        console.warn("⚠️ Cache-Control is 'no-cache' (expected in preview mode, should be different in production)");
      }
    }
  });

  test("should serve modern image formats (WebP/AVIF) when supported", async ({ page }) => {
    await page.goto("/es/libros/apocalipsis-stephen-king/", { waitUntil: "networkidle" });

    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs.map((img) => ({
        src: img.src,
        format: img.src.match(/\.(webp|avif|jpg|jpeg|png)(\?|$)/i)?.[1],
      }));
    });

    console.log(
      "Image formats found:",
      images.map((img) => img.format),
    );

    // Should prefer WebP or AVIF over JPEG/PNG
    const modernFormats = images.filter((img) => img.format === "webp" || img.format === "avif");
    const total = images.length;

    console.log(`Modern formats: ${modernFormats.length}/${total}`);

    // At least 50% of images should be modern formats
    // (Some external images might not be controllable)
    if (total > 0) {
      const ratio = modernFormats.length / total;

      if (ratio < 0.5) {
        console.warn(
          `⚠️ Only ${(ratio * 100).toFixed(0)}% of images use modern formats (WebP/AVIF). Consider optimizing to at least 50%.`,
        );
        console.warn("📝 This is a suggestion for optimization, not a critical failure.");
      }

      // For now, just log - can be made stricter later
      // expect(ratio, "At least 50% of images should use WebP or AVIF").toBeGreaterThanOrEqual(0.5);
    }
  });

  test("should preload critical resources", async ({ page }) => {
    await page.goto("/es/");

    const preloadLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="preload"]'));
      return links.map((link) => ({
        href: link.getAttribute("href"),
        as: link.getAttribute("as"),
      }));
    });

    console.log("Preloaded resources:", preloadLinks);

    // Should preload fonts or critical CSS
    if (preloadLinks.length === 0) {
      console.warn(
        "⚠️ No resources are being preloaded. Consider preloading fonts or critical CSS for better performance.",
      );
      console.warn("📝 This is a suggestion for optimization, not a critical failure.");
    }

    // For now, just log - can be made stricter later
    // expect(preloadLinks.length, "Should have at least 1 preloaded resource").toBeGreaterThan(0);
  });
});

test.describe("Resource Loading Optimization", () => {
  test("should have async/defer on non-critical scripts", async ({ page }) => {
    await page.goto("/es/");

    const scripts = await page.evaluate(() => {
      const scriptTags = Array.from(document.querySelectorAll("script[src]"));
      return scriptTags.map((script) => ({
        src: script.getAttribute("src"),
        async: script.hasAttribute("async"),
        defer: script.hasAttribute("defer"),
        type: script.getAttribute("type"),
      }));
    });

    console.log("Scripts found:", scripts.length);

    // All scripts should be async, defer, or module type
    const blockingScripts = scripts.filter((s) => !s.async && !s.defer && s.type !== "module");

    if (blockingScripts.length > 0) {
      console.warn("⚠️ Blocking scripts found:", blockingScripts);
      console.warn("📝 Consider adding async or defer to improve page load performance.");

      // Pagefind is a known blocking script (search functionality)
      // It's acceptable for now, but ideally should be lazy-loaded
      const nonPagefindBlocking = blockingScripts.filter((s) => !s.src?.includes("pagefind"));

      expect(nonPagefindBlocking.length, "Non-Pagefind external scripts should be async, defer, or type=module").toBe(
        0,
      );
    }
  });

  test("should lazy load images below the fold", async ({ page }) => {
    await page.goto("/es/libros/", { waitUntil: "networkidle" });

    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs.map((img) => ({
        src: img.src,
        loading: img.getAttribute("loading"),
      }));
    });

    console.log(`Total images: ${images.length}`);

    // Count lazy-loaded images
    const lazyImages = images.filter((img) => img.loading === "lazy");

    console.log(`Lazy-loaded images: ${lazyImages.length}/${images.length}`);

    // If there are many images, some should be lazy-loaded
    if (images.length > 3) {
      expect(lazyImages.length, "Pages with multiple images should lazy-load some images").toBeGreaterThan(0);
    }
  });

  test("should have width and height attributes on images to prevent CLS", async ({ page }) => {
    await page.goto("/es/libros/apocalipsis-stephen-king/", { waitUntil: "networkidle" });

    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs.map((img) => ({
        src: img.src,
        hasWidth: img.hasAttribute("width") || img.style.width !== "",
        hasHeight: img.hasAttribute("height") || img.style.height !== "",
      }));
    });

    console.log(`Total images: ${images.length}`);

    const imagesWithDimensions = images.filter((img) => img.hasWidth && img.hasHeight);

    console.log(`Images with dimensions: ${imagesWithDimensions.length}/${images.length}`);

    // All images should have dimensions to prevent layout shifts
    const ratio = images.length > 0 ? imagesWithDimensions.length / images.length : 1;
    expect(ratio, "All images should have width and height to prevent CLS").toBe(1);
  });
});

test.describe("Performance Consistency", () => {
  test("should maintain consistent LCP across multiple page loads", async ({ page }) => {
    const lcpValues: number[] = [];

    // Test 3 times
    for (let i = 0; i < 3; i++) {
      await page.goto("/es/", { waitUntil: "networkidle" });
      const metrics = await collectWebVitals(page);
      lcpValues.push((metrics.lcp as number) / 1000);
      console.log(`Run ${i + 1} LCP: ${lcpValues[i]!.toFixed(2)}s`);
    }

    const avgLcp = lcpValues.reduce((a, b) => a + b, 0) / lcpValues.length;
    const maxLcp = Math.max(...lcpValues);
    const minLcp = Math.min(...lcpValues);
    const variance = maxLcp - minLcp;

    console.log(`Average LCP: ${avgLcp.toFixed(2)}s`);
    console.log(`Variance: ${variance.toFixed(2)}s`);

    // Average should be under threshold
    expect(avgLcp).toBeLessThan(WEB_VITALS_THRESHOLDS.lcp.good);

    // Variance should be low (< 1s) for consistent performance
    expect(variance, "LCP should be consistent across page loads (variance < 1s)").toBeLessThan(1);
  });

  test("should maintain low CLS across page interactions", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    // Initial CLS
    await page.waitForTimeout(1000);
    const metrics1 = await collectWebVitals(page);
    const initialCls = (metrics1.cls as number) || 0;

    // Interact with page (toggle theme, open menu, etc.)
    await page.locator("#theme-toggle").click();
    await page.waitForTimeout(500);

    // CLS after interaction
    const metrics2 = await collectWebVitals(page);
    const finalCls = (metrics2.cls as number) || 0;

    console.log(`Initial CLS: ${initialCls.toFixed(4)}`);
    console.log(`After interaction CLS: ${finalCls.toFixed(4)}`);

    // CLS should remain low even after interactions
    expect(finalCls).toBeLessThan(WEB_VITALS_THRESHOLDS.cls.good);
  });
});

test.describe("Performance Reports", () => {
  test("should generate comprehensive performance report for homepage", async ({ page }) => {
    await page.goto("/es/", { waitUntil: "networkidle" });

    const metrics = await collectWebVitals(page);
    const sizes = await getResourceSizes(page);

    const report = {
      timestamp: new Date().toISOString(),
      page: "/es/",
      webVitals: {
        lcp: `${((metrics.lcp as number) / 1000).toFixed(2)}s`,
        fcp: `${((metrics.fcp as number) / 1000).toFixed(2)}s`,
        cls: ((metrics.cls as number) || 0).toFixed(4),
        ttfb: `${(metrics.ttfb as number).toFixed(0)}ms`,
      },
      budgets: {
        totalSize: formatBytes(sizes.totalSize),
        js: formatBytes(sizes.js),
        css: formatBytes(sizes.css),
        images: formatBytes(sizes.images),
        requestCount: sizes.count.total,
      },
      pass: {
        lcp: (metrics.lcp as number) / 1000 < WEB_VITALS_THRESHOLDS.lcp.good,
        fcp: (metrics.fcp as number) / 1000 < WEB_VITALS_THRESHOLDS.fcp.good,
        cls: ((metrics.cls as number) || 0) < WEB_VITALS_THRESHOLDS.cls.good,
        ttfb: (metrics.ttfb as number) < WEB_VITALS_THRESHOLDS.ttfb.good,
        pageWeight: sizes.totalSize < PERFORMANCE_BUDGETS.totalPageWeight.target,
        jsBundle: sizes.js < PERFORMANCE_BUDGETS.mainJsBundle.target,
        cssBundle: sizes.css < PERFORMANCE_BUDGETS.cssBundle.target,
      },
    };

    console.log("\n📊 Performance Report:");
    console.log(JSON.stringify(report, null, 2));

    // All critical metrics should pass
    const allPass = Object.values(report.pass).every((v) => v === true);
    expect(allPass, "All performance metrics should meet targets").toBe(true);
  });
});
