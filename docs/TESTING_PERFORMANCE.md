# Performance Testing Guide

**Project:** Personal Website - Blog Foundation  
**Last Updated:** December 31, 2025  
**Status:** ✅ Complete - All tests passing with excellent metrics  
**Performance Grade:** A+ (All Core Web Vitals in "Good" range)

---

## 📊 Overview

This project maintains **exceptional web performance** across all pages with automated testing to ensure performance standards are met. We use Playwright with custom Web Vitals collectors to measure real-world performance metrics.

### Test Results

```
✅ 25 performance tests passing in 22.5s
✅ All Core Web Vitals in "Good" range
✅ Page weight: 41.87 KB (96% under budget)
✅ 4 HTTP requests total (92% under budget)
✅ LCP: 0.07s (97% faster than target)
✅ CLS: 0.0000 (perfect - no layout shifts)
```

### Current Performance Metrics (Homepage)

| Metric                             | Value    | Target   | Status       |
| ---------------------------------- | -------- | -------- | ------------ |
| **LCP** (Largest Contentful Paint) | 0.07s    | < 2.5s   | ✅ Excellent |
| **FCP** (First Contentful Paint)   | 0.07s    | < 1.8s   | ✅ Excellent |
| **CLS** (Cumulative Layout Shift)  | 0.0000   | < 0.1    | ✅ Perfect   |
| **TTFB** (Time to First Byte)      | 3ms      | < 800ms  | ✅ Excellent |
| **Total Page Weight**              | 41.87 KB | < 1 MB   | ✅ Excellent |
| **JavaScript**                     | 28.45 KB | < 200 KB | ✅ Excellent |
| **CSS**                            | 13.42 KB | < 50 KB  | ✅ Excellent |
| **HTTP Requests**                  | 4        | < 50     | ✅ Excellent |

---

## 🎯 What We Test

### 1. Core Web Vitals (8 tests)

#### Homepage Tests

- **LCP (Largest Contentful Paint)** - Measures loading performance
- **FCP (First Contentful Paint)** - Measures perceived loading speed
- **CLS (Cumulative Layout Shift)** - Measures visual stability
- **TTFB (Time to First Byte)** - Measures server responsiveness

#### Critical Pages Tests

- **Book Listing** - LCP under threshold
- **Book Detail** - LCP and CLS under threshold
- **Tutorial Page** - LCP under threshold

### 2. Performance Budgets - Page Weight (4 tests)

- **Total page weight** - Must be < 1 MB (target), < 2 MB (max)
- **JavaScript bundle** - Must be < 200 KB (target), < 400 KB (max)
- **CSS bundle** - Must be < 50 KB (target), < 100 KB (max)
- **Individual images** - No single image > 500 KB

### 3. Performance Budgets - Resource Count (3 tests)

- **Total HTTP requests** - Should be < 50 (target), < 100 (max)
- **JavaScript files** - Should be 1-5 files (optimal bundling)
- **CSS files** - Should be 1-2 files (optimal bundling)

### 4. Network Optimization (4 tests)

- **Compression** - gzip or brotli enabled for text assets
- **Caching headers** - Proper cache-control for static assets
- **Modern image formats** - WebP/AVIF usage (currently advisory)
- **Resource preloading** - Critical resources preloaded (currently advisory)

### 5. Resource Loading Optimization (3 tests)

- **Script loading** - async/defer on non-critical scripts
- **Image lazy loading** - Images below fold lazy-loaded
- **Image dimensions** - width/height attributes to prevent CLS

### 6. Performance Consistency (2 tests)

- **LCP consistency** - Consistent performance across multiple loads
- **CLS during interactions** - No layout shifts when interacting

### 7. Performance Reports (1 test)

- **Comprehensive report** - Generates full performance snapshot

---

## 🛠️ Tools & Technologies

### Web Performance APIs

We use native browser Performance APIs:

- **PerformanceObserver** - For LCP, FCP, CLS measurement
- **PerformanceNavigationTiming** - For TTFB, DOM timing
- **PerformanceResourceTiming** - For bundle sizes, request counts

### Playwright

Playwright provides the E2E testing framework with real browser metrics:

```typescript
import { test, expect, type Page } from "@playwright/test";

// Collect real Web Vitals
const metrics = await collectWebVitals(page);

// Measure resource sizes
const sizes = await getResourceSizes(page);
```

### Performance Budgets

We enforce strict budgets based on industry best practices:

```typescript
const PERFORMANCE_BUDGETS = {
  totalPageWeight: {
    target: 1024 * 1024, // 1MB
    max: 2 * 1024 * 1024, // 2MB
  },
  mainJsBundle: {
    target: 200 * 1024, // 200KB
    max: 400 * 1024, // 400KB
  },
  cssBundle: {
    target: 50 * 1024, // 50KB
    max: 100 * 1024, // 100KB
  },
};
```

### Web Vitals Thresholds (Google Standards)

```typescript
const WEB_VITALS_THRESHOLDS = {
  lcp: { good: 2.5, needsImprovement: 4.0 }, // seconds
  fid: { good: 100, needsImprovement: 300 }, // milliseconds
  cls: { good: 0.1, needsImprovement: 0.25 }, // score
  ttfb: { good: 800, needsImprovement: 1800 }, // milliseconds
  fcp: { good: 1.8, needsImprovement: 3.0 }, // seconds
};
```

---

## 📝 Test File Structure

### Location

```
e2e/performance.spec.ts (721 lines)
```

### Organization

Tests are organized into logical groups:

```typescript
test.describe("Performance Tests", () => {
  test.describe("Core Web Vitals - Homepage", () => {
    /* 4 tests */
  });
  test.describe("Core Web Vitals - Critical Pages", () => {
    /* 4 tests */
  });
  test.describe("Performance Budgets - Page Weight", () => {
    /* 4 tests */
  });
  test.describe("Performance Budgets - Resource Count", () => {
    /* 3 tests */
  });
  test.describe("Network Optimization", () => {
    /* 4 tests */
  });
  test.describe("Resource Loading Optimization", () => {
    /* 3 tests */
  });
  test.describe("Performance Consistency", () => {
    /* 2 tests */
  });
  test.describe("Performance Reports", () => {
    /* 1 test */
  });
});
```

### Helper Functions

**collectWebVitals()** - Collects Core Web Vitals using PerformanceObserver:

```typescript
async function collectWebVitals(page: Page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const metrics: Record<string, number> = {};

      // Collect FCP
      new PerformanceObserver((entryList) => {
        // ... collect first-contentful-paint
      }).observe({ type: "paint", buffered: true });

      // Collect LCP
      new PerformanceObserver((entryList) => {
        // ... collect largest-contentful-paint
      }).observe({ type: "largest-contentful-paint", buffered: true });

      // Collect CLS
      let clsScore = 0;
      new PerformanceObserver((entryList) => {
        // ... accumulate layout-shift scores
      }).observe({ type: "layout-shift", buffered: true });

      // Navigation Timing for TTFB
      const navigation = performance.getEntriesByType("navigation")[0];
      metrics.ttfb = navigation.responseStart - navigation.requestStart;

      setTimeout(() => resolve(metrics), 3000);
    });
  });
}
```

**getResourceSizes()** - Analyzes all network resources:

```typescript
async function getResourceSizes(page: Page) {
  return await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource");

    return {
      totalSize: /* sum of all transferSize */,
      js: /* sum of .js files */,
      css: /* sum of .css files */,
      images: /* sum of images */,
      count: { total, js, css, images },
      resources: /* array of all resources */,
    };
  });
}
```

---

## 🚀 Running Tests

### All Performance Tests

```bash
bun run test:e2e -- e2e/performance.spec.ts
```

### Specific Test Groups

```bash
# Core Web Vitals only
bun run test:e2e -- e2e/performance.spec.ts -g "Core Web Vitals"

# Performance Budgets only
bun run test:e2e -- e2e/performance.spec.ts -g "Performance Budgets"

# Network Optimization only
bun run test:e2e -- e2e/performance.spec.ts -g "Network Optimization"
```

### Watch Mode (Development)

```bash
bun run test:e2e:ui
```

Opens Playwright UI where you can:

- Run tests individually
- See live performance metrics
- View network waterfall
- Debug performance issues

### CI/CD Integration

Tests run automatically on:

- Every push to `feature/*` branches
- Every pull request to `main`
- Pre-deployment checks

**Expected behavior:**

- ✅ All tests must pass
- ❌ Build fails if any metric exceeds budget
- 📊 Performance reports generated

---

## 🔧 Understanding Test Results

### Core Web Vitals Scores

**LCP (Largest Contentful Paint)** - Loading Performance

- **Good:** < 2.5s (✅ Green)
- **Needs Improvement:** 2.5s - 4.0s (⚠️ Orange)
- **Poor:** > 4.0s (❌ Red)

Our score: **0.07s** ✅

**FCP (First Contentful Paint)** - Perceived Speed

- **Good:** < 1.8s (✅ Green)
- **Needs Improvement:** 1.8s - 3.0s (⚠️ Orange)
- **Poor:** > 3.0s (❌ Red)

Our score: **0.07s** ✅

**CLS (Cumulative Layout Shift)** - Visual Stability

- **Good:** < 0.1 (✅ Green)
- **Needs Improvement:** 0.1 - 0.25 (⚠️ Orange)
- **Poor:** > 0.25 (❌ Red)

Our score: **0.0000** ✅ (Perfect - no layout shifts!)

**TTFB (Time to First Byte)** - Server Responsiveness

- **Good:** < 800ms (✅ Green)
- **Needs Improvement:** 800ms - 1800ms (⚠️ Orange)
- **Poor:** > 1800ms (❌ Red)

Our score: **3ms** ✅

### Performance Budget Results

**Page Weight: 41.87 KB / 1 MB (4% used)**

- JS: 28.45 KB (14% of budget)
- CSS: 13.42 KB (27% of budget)
- Images: 0 Bytes (homepage has no images)

**HTTP Requests: 4 / 50 (8% used)**

- 2 JavaScript files
- 2 CSS files
- 0 Images (on homepage)

### Sample Test Output

```
$ bun run test:e2e -- e2e/performance.spec.ts

Running 25 tests using 6 workers

✓ Core Web Vitals - Homepage
  ✓ should meet LCP threshold (0.20s) ✅
  ✓ should meet FCP threshold (0.11s) ✅
  ✓ should meet CLS threshold (0.0000) ✅
  ✓ should meet TTFB threshold (10ms) ✅

✓ Performance Budgets - Page Weight
  ✓ Total: 41.87 KB < 1 MB ✅
  ✓ JS: 28.45 KB < 200 KB ✅
  ✓ CSS: 13.42 KB < 50 KB ✅
  ✓ Images: All optimized ✅

📊 Performance Report:
{
  "webVitals": {
    "lcp": "0.07s", "fcp": "0.07s",
    "cls": "0.0000", "ttfb": "3ms"
  },
  "budgets": {
    "totalSize": "41.87 KB",
    "js": "28.45 KB", "css": "13.42 KB",
    "requestCount": 4
  },
  "pass": {
    "lcp": true, "fcp": true, "cls": true,
    "ttfb": true, "pageWeight": true,
    "jsBundle": true, "cssBundle": true
  }
}

25 passed (22.5s)
```

---

## 💡 Performance Optimization Recommendations

### Current Status

The website already performs exceptionally well. The following are **advisory recommendations** for further optimization, not critical issues:

### 1. Image Optimization (Advisory)

**Current:** Using JPG format for images  
**Recommendation:** Convert to WebP or AVIF for ~30-50% size reduction

```bash
# Example conversion
cwebp input.jpg -q 80 -o output.webp
```

**Benefits:**

- Smaller file sizes
- Faster load times
- Better mobile performance

**Implementation:**

```astro
<picture>
  <source srcset="cover.avif" type="image/avif" />
  <source srcset="cover.webp" type="image/webp" />
  <img src="cover.jpg" alt="Book cover" />
</picture>
```

### 2. Resource Preloading (Advisory)

**Current:** No resources preloaded  
**Recommendation:** Preload critical fonts or above-the-fold CSS

```astro
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
```

**Benefits:**

- Faster font rendering
- Reduced layout shifts
- Better perceived performance

### 3. Script Loading (Advisory)

**Current:** Pagefind script loads synchronously  
**Recommendation:** Lazy-load search functionality

```astro
<!-- Load search only when needed -->
<button id="search-trigger">Search</button>

<script>
  document.getElementById("search-trigger").addEventListener("click", async () => {
    const { PagefindUI } = await import("/pagefind/pagefind-ui.js");
    // Initialize search
  });
</script>
```

**Benefits:**

- Faster initial page load
- Better First Input Delay (FID)
- Reduced main thread blocking

### 4. HTTP/2 Server Push (Future)

**Recommendation:** Use HTTP/2 Server Push for critical resources

```nginx
# Nginx configuration
location / {
    http2_push /styles/critical.css;
    http2_push /fonts/inter.woff2;
}
```

**Benefits:**

- Parallel resource loading
- Reduced round trips
- Faster page rendering

---

## 📚 Web Performance Resources

### Official Standards

- [Web Vitals](https://web.dev/vitals/) - Google's Core Web Vitals guide
- [Performance Budgets 101](https://web.dev/performance-budgets-101/) - Budget setting guide
- [Largest Contentful Paint (LCP)](https://web.dev/lcp/) - LCP optimization
- [Cumulative Layout Shift (CLS)](https://web.dev/cls/) - CLS optimization
- [First Input Delay (FID)](https://web.dev/fid/) - FID optimization

### Tools & Testing

- [Playwright Performance API](https://playwright.dev/docs/api/class-performance) - Testing documentation
- [WebPageTest](https://www.webpagetest.org/) - Online performance testing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Automated auditing
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/) - Performance profiling

### Learning Resources

- [web.dev Performance](https://web.dev/explore/performance) - Comprehensive guides
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance) - Performance APIs
- [High Performance Browser Networking](https://hpbn.co/) - Deep dive book
- [Performance Now Conference](https://perfnow.nl/) - Annual conference

---

## 🎯 Performance Monitoring

### Continuous Monitoring

**Current Implementation:**

- Automated tests run on every commit
- Performance budgets enforced in CI/CD
- Regression detection built-in

**Future Enhancements:**

1. **Real User Monitoring (RUM)**

   - Track actual user metrics
   - Geographic performance variations
   - Device/browser performance

2. **Performance Dashboard**

   - Historical performance trends
   - Budget usage over time
   - Regression alerts

3. **Lighthouse CI**
   - Automated Lighthouse audits
   - Score tracking over time
   - Performance recommendations

### Setting Up Monitoring

**Example Lighthouse CI:**

```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI
on: [push]
jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
```

---

## ✅ Best Practices

### 1. Measure Before Optimizing

Always baseline current performance before making changes:

```bash
# Run performance tests before changes
bun run test:e2e -- e2e/performance.spec.ts

# Make changes

# Run tests again to verify improvement
bun run test:e2e -- e2e/performance.spec.ts
```

### 2. Focus on Real-World Impact

Prioritize optimizations that improve Core Web Vitals:

- **LCP:** Optimize images, reduce server response time
- **CLS:** Add dimensions to images, avoid layout shifts
- **FID:** Reduce JavaScript execution, use web workers

### 3. Set Realistic Budgets

Our budgets are based on:

- Mobile 3G connection (1.6 Mbps)
- Time to Interactive < 5s
- Total page weight < 1 MB

### 4. Test on Real Devices

Playwright tests run in real browsers, but also test on:

- Real mobile devices
- Slow network conditions
- Different geographic locations

### 5. Monitor Regressions

Performance can degrade over time:

- Run tests automatically
- Track metrics over time
- Alert on budget violations

---

## 🔍 Debugging Performance Issues

### When Tests Fail

**LCP Too High (> 2.5s)**

1. Check largest element:

   ```javascript
   // In browser console
   new PerformanceObserver((list) => {
     const entries = list.getEntries();
     const lastEntry = entries[entries.length - 1];
     console.log("LCP element:", lastEntry.element);
   }).observe({ type: "largest-contentful-paint", buffered: true });
   ```

2. Common causes:

   - Large, unoptimized images
   - Slow server response (TTFB)
   - Render-blocking resources

3. Solutions:
   - Optimize images (WebP, proper sizing)
   - Preload critical resources
   - Use CDN for static assets

**CLS Too High (> 0.1)**

1. Identify shifting elements:

   ```javascript
   let cls = 0;
   new PerformanceObserver((list) => {
     for (const entry of list.getEntries()) {
       if (!entry.hadRecentInput) {
         cls += entry.value;
         console.log("Layout shift:", entry.value, entry.sources);
       }
     }
   }).observe({ type: "layout-shift", buffered: true });
   ```

2. Common causes:

   - Images without dimensions
   - Dynamic content insertion
   - Web fonts causing layout shifts

3. Solutions:
   - Add width/height to all images
   - Reserve space for dynamic content
   - Use font-display: optional

**Page Weight Too High (> 1 MB)**

1. Analyze bundle composition:

   ```bash
   # Check resource sizes in test output
   bun run test:e2e -- e2e/performance.spec.ts -g "Page Weight"
   ```

2. Common causes:

   - Unoptimized images
   - Unnecessary JavaScript libraries
   - Duplicate dependencies

3. Solutions:
   - Compress images
   - Code-split JavaScript
   - Remove unused dependencies

---

## 📊 Performance Metrics Glossary

### Core Web Vitals

**LCP (Largest Contentful Paint):** Time until the largest content element is visible

- Measures: Loading performance
- Good: < 2.5s
- Target: First 75% of page loads

**FID (First Input Delay):** Time from first interaction to browser response

- Measures: Interactivity
- Good: < 100ms
- Target: First 75% of user interactions

**CLS (Cumulative Layout Shift):** Sum of all unexpected layout shift scores

- Measures: Visual stability
- Good: < 0.1
- Target: First 75% of page loads

### Additional Metrics

**TTFB (Time to First Byte):** Time from navigation start to first byte received

- Good: < 800ms
- Measures: Server performance

**FCP (First Contentful Paint):** Time until first content is painted

- Good: < 1.8s
- Measures: Perceived loading speed

**TTI (Time to Interactive):** Time until page is fully interactive

- Good: < 3.5s
- Measures: Usability

**Speed Index:** How quickly content is visually displayed

- Good: < 3.4s
- Measures: Visual progress

---

## 🎉 Summary

### Current Performance Status

**Grade: A+** 🏆

- ✅ All Core Web Vitals in "Good" range
- ✅ Page weight 96% under budget
- ✅ Zero layout shifts (perfect CLS)
- ✅ Lightning-fast load times (< 100ms)
- ✅ Minimal HTTP requests (4 total)
- ✅ Optimal bundle sizes

### Maintenance

**Monthly reviews:**

- Run full performance test suite
- Review performance trends
- Check for new optimization opportunities
- Update budgets if needed

**On new features:**

- Run performance tests before merge
- Ensure budgets are not exceeded
- Test on slow connections
- Verify no performance regressions

**User feedback:**

- Monitor real-world performance
- Track Core Web Vitals in production
- Analyze slow pages
- Optimize based on data

---

**Last Test Run:** December 31, 2025  
**Test Duration:** 22.5 seconds  
**Tests Passed:** 25/25  
**Performance Grade:** A+  
**Status:** ✅ All systems excellent!
