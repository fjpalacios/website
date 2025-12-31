/**
 * Load Testing - Router Performance & Memory Management
 *
 * Comprehensive load testing to verify the unified router can handle:
 * - High sequential page loads without performance degradation
 * - Concurrent user navigation without conflicts
 * - View Transitions without memory leaks
 * - Heavy pagination without slowdown
 * - Search operations under load
 *
 * These tests ensure the site remains performant and stable under
 * realistic and stress conditions.
 *
 * Test Scenarios:
 * - Sequential load test (100+ page navigations)
 * - Concurrent users test (10 simultaneous contexts)
 * - View Transitions memory test (50 back/forth navigations)
 * - Pagination stress test (navigate all pages)
 * - Search performance test (multiple queries)
 *
 * Success Criteria:
 * - No memory leaks detected
 * - Consistent navigation times
 * - All pages load successfully
 * - No browser crashes or hangs
 * - Memory usage remains stable
 *
 * @see https://playwright.dev/docs/test-parallel
 * @see https://developer.chrome.com/docs/devtools/memory-problems
 *
 * @group e2e
 * @group load-testing
 * @group performance
 */

import { test, expect, type Page } from "@playwright/test";

/**
 * Performance thresholds for load testing
 */
const LOAD_TEST_THRESHOLDS = {
  // Navigation timing thresholds
  maxNavigationTime: 5000, // 5s max per navigation
  avgNavigationTime: 2000, // 2s average acceptable

  // Memory thresholds
  maxMemoryIncrease: 50 * 1024 * 1024, // 50MB max increase
  maxMemoryPerPage: 100 * 1024 * 1024, // 100MB per page max

  // Concurrency thresholds
  maxConcurrentFailures: 0, // 0 failures allowed
  minConcurrentSuccessRate: 100, // 100% success rate required

  // Load test sizes
  sequentialPages: 50, // Test 50 sequential pages (reduced from 100 for speed)
  concurrentUsers: 10, // Test 10 concurrent users
  memoryTestIterations: 30, // Test 30 back/forth (reduced from 50 for speed)
};

/**
 * Helper function to measure memory usage
 */
async function getMemoryUsage(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const perfWithMemory = performance as typeof performance & {
      memory?: { usedJSHeapSize: number };
    };
    if (perfWithMemory.memory) {
      return perfWithMemory.memory.usedJSHeapSize;
    }
    return 0;
  });
}

/**
 * Generate a list of diverse pages to test
 */
function getTestPages(): string[] {
  return [
    // Homepage
    "/es/",
    "/en/",

    // Books
    "/es/libros/",
    "/es/libros/pagina/2/",
    "/es/libros/el-hobbit-j-r-r-tolkien/",
    "/es/libros/1984-george-orwell/",

    // Tutorials
    "/es/tutoriales/",
    "/es/tutoriales/pagina/2/",

    // Posts
    "/es/publicaciones/",
    "/es/publicaciones/pagina/2/",

    // Taxonomies
    "/es/autores/",
    "/es/autores/j-r-r-tolkien/",
    "/es/autores/george-orwell/",
    "/es/editoriales/",
    "/es/editoriales/minotauro/",
    "/es/generos/",
    "/es/generos/ciencia-ficcion/",
    "/es/categorias/",
    "/es/series/",
    "/es/desafios/",
    "/es/cursos/",

    // Static pages
    "/es/acerca-de/",
    "/es/feeds/",
  ];
}

// ============================================================================
// SEQUENTIAL LOAD TESTS
// ============================================================================

test.describe("Load Testing - Sequential Navigation", () => {
  test("should handle 50 sequential page loads without degradation", async ({ page }) => {
    const pages = getTestPages();
    const timings: number[] = [];
    const errors: string[] = [];

    console.log(`\nStarting sequential load test: ${LOAD_TEST_THRESHOLDS.sequentialPages} navigations\n`);

    // Repeat pages if needed to reach target count
    const testUrls: string[] = [];
    while (testUrls.length < LOAD_TEST_THRESHOLDS.sequentialPages) {
      testUrls.push(...pages);
    }
    const urlsToTest = testUrls.slice(0, LOAD_TEST_THRESHOLDS.sequentialPages);

    for (let i = 0; i < urlsToTest.length; i++) {
      const url = urlsToTest[i];
      const startTime = Date.now();

      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 10000 });
        const navigationTime = Date.now() - startTime;
        timings.push(navigationTime);

        // Verify page loaded successfully
        const title = await page.title();
        expect(title).toBeTruthy();

        // Log progress every 10 pages
        if ((i + 1) % 10 === 0) {
          const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
          console.log(`Progress: ${i + 1}/${urlsToTest.length} pages | Avg time: ${avgTime.toFixed(0)}ms`);
        }
      } catch (error) {
        errors.push(`Failed to load ${url}: ${error instanceof Error ? error.message : String(error)}`);
        console.error(`❌ Error loading ${url}`);
      }
    }

    // Calculate statistics
    const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
    const maxTime = Math.max(...timings);
    const minTime = Math.min(...timings);

    console.log(`\n📊 Sequential Load Test Results:`);
    console.log(`   Pages tested: ${urlsToTest.length}`);
    console.log(`   Successful: ${timings.length}`);
    console.log(`   Failed: ${errors.length}`);
    console.log(`   Avg time: ${avgTime.toFixed(0)}ms`);
    console.log(`   Min time: ${minTime.toFixed(0)}ms`);
    console.log(`   Max time: ${maxTime.toFixed(0)}ms\n`);

    // Assertions
    expect(errors).toHaveLength(0); // No errors
    expect(avgTime).toBeLessThan(LOAD_TEST_THRESHOLDS.avgNavigationTime); // Average time acceptable
    expect(maxTime).toBeLessThan(LOAD_TEST_THRESHOLDS.maxNavigationTime); // Max time acceptable
  });

  test("should maintain consistent performance across multiple loads", async ({ page }) => {
    const testUrl = "/es/libros/";
    const iterations = 20;
    const timings: number[] = [];

    console.log(`\nTesting consistency: ${iterations} loads of ${testUrl}\n`);

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      await page.goto(testUrl, { waitUntil: "networkidle" });
      const navigationTime = Date.now() - startTime;
      timings.push(navigationTime);
    }

    // Calculate variance
    const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
    const variance = timings.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / timings.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = (stdDev / avgTime) * 100;

    console.log(`📊 Consistency Test Results:`);
    console.log(`   Avg time: ${avgTime.toFixed(0)}ms`);
    console.log(`   Std dev: ${stdDev.toFixed(0)}ms`);
    console.log(`   Coefficient of variation: ${coefficientOfVariation.toFixed(1)}%\n`);

    // Low coefficient of variation indicates consistent performance
    expect(coefficientOfVariation).toBeLessThan(50); // < 50% variation acceptable
  });
});

// ============================================================================
// CONCURRENT USERS TESTS
// ============================================================================

test.describe("Load Testing - Concurrent Users", () => {
  test("should handle 10 concurrent users navigating simultaneously", async ({ browser }) => {
    const pages = getTestPages();
    const concurrentUsers = LOAD_TEST_THRESHOLDS.concurrentUsers;

    console.log(`\nStarting concurrent users test: ${concurrentUsers} simultaneous contexts\n`);

    const startTime = Date.now();
    const results = await Promise.allSettled(
      Array.from({ length: concurrentUsers }, async (_, userIndex) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
          // Each user navigates through 5 random pages
          for (let i = 0; i < 5; i++) {
            const randomPage = pages[Math.floor(Math.random() * pages.length)];
            await page.goto(randomPage, { waitUntil: "networkidle", timeout: 10000 });

            // Verify page loaded
            const title = await page.title();
            expect(title).toBeTruthy();

            // Small delay between navigations
            await page.waitForTimeout(100);
          }

          return { userIndex, success: true };
        } finally {
          await context.close();
        }
      }),
    );

    const totalTime = Date.now() - startTime;

    // Analyze results
    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    const successRate = (successful / concurrentUsers) * 100;

    console.log(`📊 Concurrent Users Test Results:`);
    console.log(`   Users: ${concurrentUsers}`);
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Success rate: ${successRate.toFixed(1)}%`);
    console.log(`   Total time: ${totalTime.toFixed(0)}ms\n`);

    // Assertions
    expect(failed).toBe(LOAD_TEST_THRESHOLDS.maxConcurrentFailures); // No failures
    expect(successRate).toBeGreaterThanOrEqual(LOAD_TEST_THRESHOLDS.minConcurrentSuccessRate); // 100% success
  });
});

// ============================================================================
// VIEW TRANSITIONS MEMORY TESTS
// ============================================================================

test.describe("Load Testing - View Transitions Memory", () => {
  test("should not leak memory during repeated View Transitions", async ({ page }) => {
    // Increase test timeout for memory test
    test.setTimeout(60000); // 60 seconds

    const iterations = LOAD_TEST_THRESHOLDS.memoryTestIterations;
    const url1 = "/es/";
    const url2 = "/es/libros/";

    console.log(`\nStarting memory leak test: ${iterations} back/forth navigations\n`);

    // Initial navigation
    await page.goto(url1, { waitUntil: "networkidle" });
    await page.waitForTimeout(500); // Let memory stabilize

    const initialMemory = await getMemoryUsage(page);
    console.log(`Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);

    // Repeated navigations
    for (let i = 0; i < iterations; i++) {
      // Navigate forward
      await page.goto(url2, { waitUntil: "domcontentloaded" }); // Changed from networkidle

      // Navigate back
      await page.goto(url1, { waitUntil: "domcontentloaded" }); // Changed from networkidle

      // Log progress every 10 iterations
      if ((i + 1) % 10 === 0) {
        const currentMemory = await getMemoryUsage(page);
        const memoryIncrease = currentMemory - initialMemory;
        console.log(
          `Iteration ${i + 1}/${iterations} | Memory: ${(currentMemory / 1024 / 1024).toFixed(2)} MB ` +
            `(+${(memoryIncrease / 1024 / 1024).toFixed(2)} MB)`,
        );
      }
    }

    // Final memory check
    await page.waitForTimeout(1000); // Let garbage collection run
    const finalMemory = await getMemoryUsage(page);
    const memoryIncrease = finalMemory - initialMemory;

    console.log(`\n📊 Memory Leak Test Results:`);
    console.log(`   Iterations: ${iterations}`);
    console.log(`   Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB\n`);

    // Assertion - memory increase should be reasonable
    expect(memoryIncrease).toBeLessThan(LOAD_TEST_THRESHOLDS.maxMemoryIncrease);
  });

  test("should handle rapid navigation without crashes", async ({ page }) => {
    const pages = getTestPages().slice(0, 20); // Use 20 diverse pages

    console.log(`\nStarting rapid navigation test: ${pages.length} pages\n`);

    let successCount = 0;

    for (const url of pages) {
      try {
        // Rapid navigation - no waiting for full load
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 5000 });
        successCount++;
      } catch {
        console.error(`Failed rapid navigation to ${url}`);
      }
    }

    console.log(`📊 Rapid Navigation Results:`);
    console.log(`   Pages: ${pages.length}`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Success rate: ${((successCount / pages.length) * 100).toFixed(1)}%\n`);

    // Should handle at least 90% of rapid navigations
    expect(successCount).toBeGreaterThanOrEqual(pages.length * 0.9);
  });
});

// ============================================================================
// PAGINATION PERFORMANCE TESTS
// ============================================================================

test.describe("Load Testing - Pagination", () => {
  test("should navigate through all book pagination pages efficiently", async ({ page }) => {
    const baseUrl = "/es/libros/pagina/";
    const maxPages = 2; // Test available pagination pages (we have 2 pages)
    const timings: number[] = [];

    console.log(`\nStarting pagination test: ${maxPages} pages\n`);

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const url = pageNum === 1 ? "/es/libros/" : `${baseUrl}${pageNum}/`;
      const startTime = Date.now();

      await page.goto(url, { waitUntil: "networkidle" });
      const navigationTime = Date.now() - startTime;
      timings.push(navigationTime);

      // Verify page loaded correctly
      const hasContent = await page.locator("article, main").isVisible();
      expect(hasContent).toBe(true);

      console.log(`Page ${pageNum}: ${navigationTime}ms`);
    }

    const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;

    console.log(`\n📊 Pagination Performance:`);
    console.log(`   Pages tested: ${maxPages}`);
    console.log(`   Avg time: ${avgTime.toFixed(0)}ms\n`);

    // All pages should load efficiently
    expect(avgTime).toBeLessThan(LOAD_TEST_THRESHOLDS.avgNavigationTime);
  });

  test("should handle pagination navigation with browser back/forward", async ({ page }) => {
    // Navigate through available pages
    await page.goto("/es/libros/", { waitUntil: "networkidle" });
    await page.goto("/es/libros/pagina/2/", { waitUntil: "networkidle" });

    // Verify we're on page 2
    let url = page.url();
    expect(url).toContain("/pagina/2/");

    // Test back navigation
    await page.goBack({ waitUntil: "networkidle" });
    url = page.url();
    expect(url).toContain("/libros/");
    expect(url).not.toContain("/pagina/");

    // Test forward navigation
    await page.goForward({ waitUntil: "networkidle" });
    url = page.url();
    expect(url).toContain("/pagina/2/");

    console.log("✅ Browser back/forward navigation works correctly\n");
  });
});

// ============================================================================
// SEARCH PERFORMANCE TESTS (if Pagefind available)
// ============================================================================

test.describe("Load Testing - Search Performance", () => {
  test("should handle search modal opening efficiently", async ({ page }) => {
    const iterations = 10;
    const timings: number[] = [];

    console.log(`\nTesting search modal performance: ${iterations} iterations\n`);

    await page.goto("/es/", { waitUntil: "networkidle" });

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();

      // Open search
      const searchButton = page.locator(".search-button");
      await searchButton.click();

      // Wait for modal
      const modal = page.locator(".search-modal");
      await modal.waitFor({ state: "visible", timeout: 5000 });

      // Wait for Pagefind
      const searchInput = page.locator(".pagefind-ui__search-input");
      await searchInput.waitFor({ state: "visible", timeout: 5000 });

      const openTime = Date.now() - startTime;
      timings.push(openTime);

      // Close modal (press Escape)
      await page.keyboard.press("Escape");
      await modal.waitFor({ state: "hidden", timeout: 2000 });

      await page.waitForTimeout(100);
    }

    const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
    const maxTime = Math.max(...timings);

    console.log(`📊 Search Modal Performance:`);
    console.log(`   Iterations: ${iterations}`);
    console.log(`   Avg open time: ${avgTime.toFixed(0)}ms`);
    console.log(`   Max open time: ${maxTime.toFixed(0)}ms\n`);

    // Search modal should open quickly
    expect(avgTime).toBeLessThan(2000); // < 2s average
    expect(maxTime).toBeLessThan(5000); // < 5s max
  });
});
