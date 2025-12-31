# 🗺️ Roadmap: Testing Enhancements & Performance Optimizations

**Project:** Personal Website - Blog Foundation  
**Branch:** `feature/blog-foundation`  
**Created:** December 31, 2025  
**Status:** 🚧 In Progress  
**Priority:** HIGH

---

## 📊 Overall Progress

**Phase 1: Testing Enhancements (Option 4)**

- [x] 4.1 Accessibility Testing with axe-core (1/1) ✅
- [ ] 4.2 Performance Testing (0/1)
- [ ] 4.3 Visual Regression Testing (0/1)
- [ ] 4.4 Load Testing (0/1)

**Phase 2: Performance Optimizations (Option 3)**

- [ ] 3.1 Image Optimization (0/1)
- [ ] 3.2 Component Lazy Loading (0/1)
- [ ] 3.3 Service Worker & Caching (0/1)
- [ ] 3.4 Prefetch Critical Routes (0/1)
- [ ] 3.5 CSS Optimization (0/1)

**Total Progress:** 1/9 tasks completed (11%)

---

## 🎯 PHASE 1: Testing Enhancements (Option 4)

### Objective

Enhance test infrastructure with accessibility, performance, and visual regression testing to ensure high-quality, maintainable codebase.

---

### 4.1 Accessibility Testing with axe-core

**Status:** ✅ COMPLETE  
**Priority:** 🔴 Critical  
**Completed:** December 31, 2025  
**Actual Time:** 50 minutes  
**Dependencies:** None

#### Tasks

- [x] Install `@axe-core/playwright`
- [x] Verify existing `e2e/accessibility.spec.ts` (discovered 861 lines, 50 tests)
- [x] Implement automated WCAG 2.1 AA testing
- [x] Test all major page types
- [x] Test interactive elements (menu, search modal)
- [x] Test both themes (light/dark)
- [x] Test mobile viewport
- [x] Generate violation reports
- [x] Document accessibility testing guide
- [x] Run tests and verify 0 violations

#### Results

**Test Execution:**

```bash
$ bun run test:e2e -- e2e/accessibility.spec.ts

✅ 50 tests passed in 22.4s
✅ 0 WCAG violations detected
✅ All page types tested
✅ All interactive elements tested
✅ Both themes tested (light + dark)
✅ Mobile viewport tested (iPhone SE 375x667)
```

**Coverage:**

- **28 tests** - Page types (home, books, tutorials, posts, taxonomies, static)
- **5 tests** - Interactive elements (menu, search, theme, language, keyboard)
- **10 tests** - Specific WCAG criteria (contrast, headings, alt text, labels, ARIA, etc.)
- **13 tests** - Search modal accessibility (comprehensive testing)
- **3 tests** - Mobile accessibility (viewport + touch targets)

**Documentation:**

- Created `docs/TESTING_ACCESSIBILITY.md` (~800 lines)
- Comprehensive guide covering:
  - Test patterns and examples
  - WCAG 2.1 Level AA requirements
  - Common issues and solutions
  - Theme considerations (light/dark)
  - Mobile accessibility
  - Debugging violations
  - Best practices
  - Resources

**Files:**

- `e2e/accessibility.spec.ts` (861 lines, 50 tests)
- `docs/TESTING_ACCESSIBILITY.md` (comprehensive guide)
- `docs/SESSION_2025-12-31_ACCESSIBILITY_TESTING.md` (session notes)

---

### 4.2 Performance Testing

**Status:** ⏳ Not Started  
**Priority:** 🔴 Critical  
**Estimated Time:** 1.5 hours  
**Dependencies:** None

#### Tasks

- [ ] Create `e2e/performance.spec.ts`
- [ ] Implement Core Web Vitals testing
- [ ] Implement bundle size monitoring
- [ ] Implement asset size checks
- [ ] Test network optimization
- [ ] Set performance budgets
- [ ] Create performance dashboard/report
- [ ] Document performance testing guide
- [ ] Run tests and verify all metrics pass

#### Metrics to Monitor

**Core Web Vitals:**

- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] TTFB (Time to First Byte) < 800ms
- [ ] TTI (Time to Interactive) < 3.5s

**Bundle & Asset Sizes:**

- [ ] Total page size < 1MB
- [ ] Main JS bundle < 200KB
- [ ] CSS bundle < 50KB
- [ ] Images optimized (WebP/AVIF ready)

**Network Optimization:**

- [ ] HTTP/2 enabled
- [ ] Compression enabled (gzip/brotli)
- [ ] Caching headers correct (immutable for assets)
- [ ] No render-blocking resources

#### Pages to Test

- `/es/` (homepage - most critical)
- `/es/libros/` (book listing)
- `/es/libros/apocalipsis-stephen-king/` (book detail - heavy content)
- Search results page

#### Test Categories

**1. Core Web Vitals Tests**

```typescript
test("Homepage LCP < 2.5s");
test("Homepage FID < 100ms");
test("Homepage CLS < 0.1");
test("Book detail LCP < 2.5s");
test("Book listing LCP < 2.5s");
```

**2. Bundle Size Tests**

```typescript
test("Main JS bundle < 200KB");
test("CSS bundle < 50KB");
test("Total page size < 1MB");
test("No duplicate dependencies");
```

**3. Asset Optimization Tests**

```typescript
test("All images have correct format (WebP/AVIF)");
test("Images have width/height attributes");
test("Fonts are preloaded");
test("Critical CSS is inlined");
```

**4. Network Tests**

```typescript
test("HTTP/2 enabled");
test("Compression enabled");
test("Cache headers correct");
test("No 404s in resources");
```

#### Success Criteria

- [ ] All Core Web Vitals within thresholds
- [ ] Bundle sizes within budgets
- [ ] Network optimization verified
- [ ] Performance reports generated
- [ ] CI/CD integration ready
- [ ] Documentation complete

#### Files to Create

- `e2e/performance.spec.ts` (~300 lines)
- `docs/TESTING_PERFORMANCE.md` (guide)

---

### 4.3 Visual Regression Testing

**Status:** ⏳ Not Started  
**Priority:** 🟡 Medium  
**Estimated Time:** 1 hour  
**Dependencies:** None

#### Tasks

- [ ] Create `e2e/visual/` directory
- [ ] Create `e2e/visual/homepage.spec.ts`
- [ ] Create `e2e/visual/book-detail.spec.ts`
- [ ] Create `e2e/visual/components.spec.ts`
- [ ] Implement screenshot comparison
- [ ] Test responsive breakpoints
- [ ] Test both themes
- [ ] Generate baseline screenshots
- [ ] Document visual testing guide
- [ ] Run tests and establish baselines

#### Components/Pages to Test

**Pages:**

- Homepage (desktop, tablet, mobile)
- Book detail (desktop, tablet, mobile)
- Book listing (desktop, tablet, mobile)
- Post listing (desktop, tablet, mobile)

**Components:**

- Menu (open state, both themes)
- Search modal (open state, both themes)
- Rating component (scores: 1-5, fav)
- Breadcrumbs
- Language switcher
- Theme toggle
- Pagination
- Content badges

**Breakpoints:**

- Mobile: 375x667 (iPhone SE)
- Tablet: 768x1024 (iPad)
- Desktop: 1920x1080 (Full HD)

**Themes:**

- Light theme
- Dark theme

#### Test Structure

```typescript
describe("Visual Regression - Homepage", () => {
  test("Desktop light theme", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/es/");
    await expect(page).toHaveScreenshot("homepage-desktop-light.png");
  });

  test("Desktop dark theme", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/es/");
    await page.click("[data-theme-toggle]");
    await expect(page).toHaveScreenshot("homepage-desktop-dark.png");
  });

  test("Mobile light theme", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/es/");
    await expect(page).toHaveScreenshot("homepage-mobile-light.png");
  });
});
```

#### Success Criteria

- [ ] Baseline screenshots established
- [ ] All viewports tested
- [ ] Both themes tested
- [ ] Component isolation tested
- [ ] CI/CD integration ready
- [ ] Documentation complete

#### Files to Create

- `e2e/visual/homepage.spec.ts` (~150 lines)
- `e2e/visual/book-detail.spec.ts` (~150 lines)
- `e2e/visual/components.spec.ts` (~200 lines)
- `docs/TESTING_VISUAL.md` (guide)

#### Screenshot Storage

```
e2e/visual/__screenshots__/
├── homepage-desktop-light.png
├── homepage-desktop-dark.png
├── homepage-tablet-light.png
├── homepage-tablet-dark.png
├── homepage-mobile-light.png
├── homepage-mobile-dark.png
├── book-detail-desktop-light.png
├── ...
```

---

### 4.4 Load Testing (Unified Router)

**Status:** ⏳ Not Started  
**Priority:** 🟡 Medium  
**Estimated Time:** 0.5 hours  
**Dependencies:** None

#### Tasks

- [ ] Create `e2e/load-test.spec.ts`
- [ ] Implement sequential load test (100 pages)
- [ ] Implement concurrent user test (10 users)
- [ ] Test View Transitions memory leaks
- [ ] Test pagination performance
- [ ] Test search performance
- [ ] Document load testing guide
- [ ] Run tests and verify scalability

#### Test Scenarios

**1. Sequential Load Test**

```typescript
test("Router handles 100 sequential page loads", async ({ page }) => {
  // Load all 88 static pages + dynamic routes
  // Verify no memory leaks
  // Measure average load time
});
```

**2. Concurrent Users Test**

```typescript
test("Router handles 10 concurrent users", async ({ browser }) => {
  // Create 10 browser contexts
  // Navigate simultaneously
  // Verify all succeed
  // Measure resource usage
});
```

**3. View Transitions Memory Test**

```typescript
test("View Transitions do not leak memory", async ({ page }) => {
  // Navigate back/forth 50 times
  // Monitor memory usage
  // Verify no significant increase
});
```

**4. Pagination Performance Test**

```typescript
test("Pagination through all pages", async ({ page }) => {
  // Navigate through all paginated pages
  // Verify fast response times
  // Check proper caching
});
```

**5. Search Performance Test**

```typescript
test("Search handles heavy queries", async ({ page }) => {
  // Perform 20 different searches
  // Verify fast response times
  // Check Pagefind performance
});
```

#### Success Criteria

- [ ] 100 sequential loads complete without errors
- [ ] 10 concurrent users handled successfully
- [ ] No memory leaks detected
- [ ] Pagination performs well
- [ ] Search responds quickly
- [ ] Documentation complete

#### Files to Create

- `e2e/load-test.spec.ts` (~250 lines)
- `docs/TESTING_LOAD.md` (guide)

---

### Phase 1 Summary

**Total Tasks:** 4 main tasks, ~40 subtasks  
**Total Time:** ~4 hours  
**Total Test Files:** 7 new files  
**Expected New Tests:** ~100 tests

**Dependencies to Install:**

```bash
bun add -D @axe-core/playwright
```

**Success Criteria:**

- [ ] All accessibility tests passing (0 violations)
- [ ] All performance metrics within budgets
- [ ] Visual baselines established
- [ ] Load tests passing
- [ ] Documentation complete
- [ ] CI/CD integration ready

---

## 🚀 PHASE 2: Performance Optimizations (Option 3)

### Objective

Optimize website performance to improve Core Web Vitals, reduce bundle sizes, and enhance user experience.

---

### 3.1 Image Optimization

**Status:** ⏳ Not Started  
**Priority:** 🔴 Critical  
**Estimated Time:** 1.5 hours  
**Dependencies:** Phase 1 complete (performance baseline)

#### Tasks

- [ ] Create `OptimizedImage.astro` component
- [ ] Implement WebP/AVIF conversion
- [ ] Add lazy loading for below-the-fold images
- [ ] Implement responsive images with srcset
- [ ] Add blur placeholder effect
- [ ] Optimize existing images
- [ ] Update all image usages
- [ ] Test image performance
- [ ] Document image optimization guide

#### Implementation Plan

**1. Create OptimizedImage Component**

```astro
---
// src/components/OptimizedImage.astro
import { Image } from "astro:assets";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: "lazy" | "eager";
  class?: string;
}

const { src, alt, width, height, loading = "lazy", class: className } = Astro.props;
---

<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  loading={loading}
  class={className}
  formats={["avif", "webp", "jpg"]}
  quality={85}
  densities={[1, 2]}
/>
```

**2. Images to Optimize**

- [ ] Book covers (`/public/images/books/` - ~14 images)
- [ ] Author photos (`/public/images/authors/` - ~4 images)
- [ ] Default covers (`/public/images/defaults/` - ~6 images)
- [ ] Any other static images

**3. Update Usage**

- [ ] Update book detail pages
- [ ] Update author pages
- [ ] Update listings
- [ ] Update homepage

#### Expected Improvements

- **File size reduction:** 60-80%
- **Format support:** AVIF (best), WebP (fallback), JPG (final fallback)
- **Lazy loading:** Below-the-fold images
- **LCP improvement:** ~0.5-1.0s

#### Success Criteria

- [ ] All images use OptimizedImage component
- [ ] AVIF/WebP formats generated
- [ ] Lazy loading implemented
- [ ] Performance tests show improvement
- [ ] Documentation complete

#### Files to Create/Modify

- `src/components/OptimizedImage.astro` (new)
- `astro.config.mjs` (modify - image config)
- `docs/IMAGES_OPTIMIZATION.md` (guide)
- Multiple component files (update image usage)

---

### 3.2 Component Lazy Loading

**Status:** ⏳ Not Started  
**Priority:** 🟡 Medium  
**Estimated Time:** 1 hour  
**Dependencies:** None

#### Tasks

- [ ] Identify heavy components to lazy load
- [ ] Implement lazy loading for SearchModal
- [ ] Defer Pagefind initialization
- [ ] Defer non-critical scripts
- [ ] Implement code splitting by route
- [ ] Test lazy loading behavior
- [ ] Measure bundle size reduction
- [ ] Document lazy loading strategy

#### Components to Lazy Load

**1. Search Modal**

```astro
---
// Only load when search is opened
const SearchModal = lazy(() => import("@components/SearchModal.astro"));
---
```

**2. Pagefind**

```typescript
// Defer Pagefind loading until search is opened
let pagefind = null;

async function initializeSearch() {
  if (!pagefind) {
    const { PagefindUI } = await import("@pagefind/default-ui");
    pagefind = new PagefindUI({ element: "#search" });
  }
}

// Initialize only when search button is clicked
document.querySelector("[data-search-open]").addEventListener("click", initializeSearch);
```

**3. Analytics (if added)**

```html
<!-- Defer analytics -->
<script src="/scripts/analytics.js" defer></script>
```

**4. View Transitions Polyfill (conditional)**

```astro
---
// Only load polyfill for browsers that need it
if (!("startViewTransition" in document)) {
  // Load polyfill
}
---
```

#### Expected Improvements

- **Initial bundle size:** -30-40%
- **TTI improvement:** ~0.5-0.8s
- **First load:** Faster initial render

#### Success Criteria

- [ ] Heavy components lazy loaded
- [ ] Bundle size reduced
- [ ] TTI improved
- [ ] No degradation in UX
- [ ] Documentation complete

#### Files to Modify

- `src/components/SearchModal.astro`
- `src/components/ClientRouter.astro`
- `src/layouts/BaseLayout.astro`
- `docs/LAZY_LOADING.md` (guide)

---

### 3.3 Service Worker & Caching

**Status:** ⏳ Not Started  
**Priority:** 🟡 Medium  
**Estimated Time:** 1 hour  
**Dependencies:** None

#### Tasks

- [ ] Create Service Worker file
- [ ] Implement caching strategies
- [ ] Define cache names and versions
- [ ] Cache static assets
- [ ] Implement network-first for HTML
- [ ] Create offline fallback page
- [ ] Register Service Worker
- [ ] Test caching behavior
- [ ] Document caching strategy

#### Caching Strategies

**Cache-First (Static Assets):**

- CSS files (1 year)
- JavaScript files (1 year)
- Fonts (1 year)
- Images (6 months)

**Network-First (Dynamic Content):**

- HTML pages (fallback to cache)
- Pagefind API calls

**Cache-Only (Critical Assets):**

- Offline fallback page
- Essential styles

#### Implementation

**1. Service Worker (`public/sw.js`)**

```javascript
const CACHE_NAME = "website-v1";
const STATIC_CACHE = ["/", "/es/", "/styles/global.css", "/scripts/theme.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first for static assets
  if (url.pathname.match(/\.(css|js|woff2|jpg|png|svg)$/)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return (
          response ||
          fetch(request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      }),
    );
  }
  // Network-first for HTML
  else {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
  }
});
```

**2. Registration**

```javascript
// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```

**3. Offline Fallback Page**

```astro
---
// src/pages/offline.astro
import BaseLayout from "@layouts/BaseLayout.astro";
---

<BaseLayout title="Offline">
  <h1>You're offline</h1>
  <p>Please check your internet connection.</p>
</BaseLayout>
```

#### Expected Improvements

- **Repeat visits:** Instant load from cache
- **Offline support:** Basic functionality
- **Bandwidth usage:** Reduced significantly

#### Success Criteria

- [ ] Service Worker registered successfully
- [ ] Static assets cached
- [ ] Offline page works
- [ ] Cache invalidation works
- [ ] No broken functionality
- [ ] Documentation complete

#### Files to Create

- `public/sw.js` (new - ~150 lines)
- `src/pages/offline.astro` (new)
- `docs/SERVICE_WORKER.md` (guide)

#### Files to Modify

- `src/layouts/BaseLayout.astro` (register SW)

---

### 3.4 Prefetch Critical Routes

**Status:** ⏳ Not Started  
**Priority:** 🟢 Low  
**Estimated Time:** 0.5 hours  
**Dependencies:** None

#### Tasks

- [ ] Identify critical routes to prefetch
- [ ] Implement prefetch on idle
- [ ] Implement prefetch on hover
- [ ] Add priority hints for resources
- [ ] Test prefetch behavior
- [ ] Measure navigation speed improvement
- [ ] Document prefetch strategy

#### Prefetch Strategies

**1. Prefetch on Idle (Critical Pages)**

```astro
---
// Prefetch critical pages when browser is idle
const criticalPages = ["/es/libros/", "/es/publicaciones/", "/es/tutoriales/", "/es/autores/"];
---

{criticalPages.map((page) => <link rel="prefetch" href={page} />)}
```

**2. Prefetch on Hover (Predictive)**

```javascript
// Prefetch when user hovers over links
document.querySelectorAll('a[href^="/es/"]').forEach((link) => {
  link.addEventListener(
    "mouseenter",
    () => {
      const href = link.getAttribute("href");
      if (href && !document.querySelector(`link[href="${href}"]`)) {
        const prefetch = document.createElement("link");
        prefetch.rel = "prefetch";
        prefetch.href = href;
        document.head.appendChild(prefetch);
      }
    },
    { once: true },
  );
});
```

**3. Priority Hints**

```html
<!-- Critical resources -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/styles/critical.css" as="style" />

<!-- Important images -->
<img src="/hero.jpg" fetchpriority="high" alt="Hero" />

<!-- Defer non-critical -->
<img src="/footer-logo.jpg" fetchpriority="low" alt="Logo" />
```

#### Expected Improvements

- **Navigation speed:** Instant (perceived)
- **User experience:** Smoother transitions

#### Success Criteria

- [ ] Critical routes prefetched
- [ ] Hover prefetch works
- [ ] Priority hints applied
- [ ] No negative impact on initial load
- [ ] Documentation complete

#### Files to Modify

- `src/components/ClientRouter.astro` (add prefetch logic)
- `src/layouts/BaseLayout.astro` (add priority hints)
- `docs/PREFETCH_STRATEGY.md` (guide)

---

### 3.5 CSS Optimization

**Status:** ⏳ Not Started  
**Priority:** 🟢 Low  
**Estimated Time:** 0.5 hours  
**Dependencies:** None

#### Tasks

- [ ] Extract critical CSS
- [ ] Inline critical CSS
- [ ] Defer non-critical CSS
- [ ] Purge unused CSS
- [ ] Minify CSS
- [ ] Test CSS optimization
- [ ] Measure CSS bundle reduction
- [ ] Document CSS optimization

#### Optimization Strategies

**1. Critical CSS Inline**

```astro
---
// Extract and inline critical CSS
const criticalCSS = `
  /* Above-the-fold styles */
  body { margin: 0; font-family: 'Inter', sans-serif; }
  header { background: var(--color-primary); }
  /* ... */
`;
---

<head>
  <style set:html={criticalCSS}></style>

  <!-- Defer non-critical CSS -->
  <link rel="preload" href="/styles/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript>
    <link rel="stylesheet" href="/styles/main.css" />
  </noscript>
</head>
```

**2. PurgeCSS Configuration**

```javascript
// Remove unused CSS
import purgecss from "@fullhuman/postcss-purgecss";

export default {
  plugins: [
    purgecss({
      content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
      safelist: ["dark", "light", "theme-toggle"],
    }),
  ],
};
```

**3. CSS Minification**

```javascript
// Use cssnano for minification
import cssnano from "cssnano";

export default {
  plugins: [
    cssnano({
      preset: [
        "default",
        {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
        },
      ],
    }),
  ],
};
```

#### Expected Improvements

- **CSS bundle size:** -20-30%
- **First Paint:** Faster (no render-blocking)

#### Success Criteria

- [ ] Critical CSS inlined
- [ ] Non-critical CSS deferred
- [ ] Unused CSS purged
- [ ] CSS minified
- [ ] No visual regressions
- [ ] Documentation complete

#### Files to Modify

- `astro.config.mjs` (add PostCSS config)
- `src/layouts/BaseLayout.astro` (inline critical CSS)
- `docs/CSS_OPTIMIZATION.md` (guide)

---

### Phase 2 Summary

**Total Tasks:** 5 main tasks, ~35 subtasks  
**Total Time:** ~4-5 hours  
**Total New Files:** ~10 files

**Expected Improvements:**

- 📉 Bundle size reduction: ~40%
- 📉 Image size reduction: ~70%
- ⚡ LCP improvement: -1.0s
- ⚡ TTI improvement: -0.8s
- 📊 Lighthouse score: maintain 100/100

**Success Criteria:**

- [ ] All optimizations implemented
- [ ] Performance tests show improvements
- [ ] No functionality broken
- [ ] No visual regressions
- [ ] Documentation complete
- [ ] CI/CD integration ready

---

## 📈 Success Metrics

### Testing Enhancements (Phase 1)

**Quantitative:**

- [ ] +100 new tests passing
- [ ] 0 accessibility violations
- [ ] All performance budgets met
- [ ] All visual baselines established
- [ ] All load tests passing

**Qualitative:**

- [ ] Comprehensive test coverage
- [ ] Easy to maintain tests
- [ ] Clear test documentation
- [ ] CI/CD integration ready

### Performance Optimizations (Phase 2)

**Before (Baseline - Current):**

- LCP: ~2.5s
- TTI: ~3.5s
- Bundle size: ~200KB
- Image sizes: Original (JPG/PNG)
- Lighthouse: 100/100

**After (Target):**

- LCP: < 2.0s (-0.5s improvement)
- TTI: < 3.0s (-0.5s improvement)
- Bundle size: < 150KB (-25% reduction)
- Image sizes: WebP/AVIF (-70% reduction)
- Lighthouse: 100/100 (maintained)

---

## 🚀 Execution Plan

### Order of Execution

**Week 1: Testing Enhancements**

1. ✅ Day 1: 4.1 Accessibility Testing (1h)
2. ✅ Day 2: 4.2 Performance Testing (1.5h)
3. ✅ Day 3: 4.3 Visual Regression (1h)
4. ✅ Day 4: 4.4 Load Testing (0.5h)
5. ✅ Day 5: Review, documentation, commit

**Week 2: Performance Optimizations** 6. ✅ Day 1: 3.1 Image Optimization (1.5h) 7. ✅ Day 2: 3.2 Component Lazy Loading (1h) 8. ✅ Day 3: 3.3 Service Worker (1h) 9. ✅ Day 4: 3.4 Prefetch + 3.5 CSS Optimization (1h) 10. ✅ Day 5: Review, testing, documentation, commit

### Commit Strategy

**Commit 1: Accessibility Testing**

```
feat(testing): add comprehensive accessibility testing with axe-core

- Install @axe-core/playwright
- Create accessibility-enhanced.spec.ts
- Test 13+ page types for WCAG 2.1 AA compliance
- Test interactive elements and themes
- 0 violations across all pages

TESTING: 40+ new accessibility tests passing
```

**Commit 2: Performance & Visual Testing**

```
feat(testing): add performance and visual regression testing

- Create performance.spec.ts with Core Web Vitals tests
- Create visual regression tests for key pages/components
- Establish performance budgets and baselines
- Test responsive design and themes

TESTING: 60+ new tests passing
```

**Commit 3: Load Testing**

```
feat(testing): add load testing for unified router

- Test sequential and concurrent page loads
- Test View Transitions memory management
- Test pagination and search performance

TESTING: 10+ new load tests passing
```

**Commit 4: Image Optimization**

```
perf(images): implement WebP/AVIF optimization with lazy loading

- Create OptimizedImage component
- Convert all images to modern formats
- Implement lazy loading
- Add responsive srcset

PERFORMANCE: 70% image size reduction, LCP improved by 0.5s
```

**Commit 5: Bundle Optimization**

```
perf(bundle): implement lazy loading and Service Worker

- Lazy load heavy components
- Implement Service Worker caching
- Add prefetch strategies
- Optimize CSS delivery

PERFORMANCE: 40% bundle reduction, TTI improved by 0.8s
```

---

## 📚 Documentation Plan

### Documents to Create

**Testing:**

- [ ] `docs/TESTING_ACCESSIBILITY.md` - Accessibility testing guide
- [ ] `docs/TESTING_PERFORMANCE.md` - Performance testing guide
- [ ] `docs/TESTING_VISUAL.md` - Visual regression testing guide
- [ ] `docs/TESTING_LOAD.md` - Load testing guide
- [ ] `docs/SESSION_2025-12-31_TESTING_ENHANCEMENTS.md` - Session notes

**Performance:**

- [ ] `docs/IMAGES_OPTIMIZATION.md` - Image optimization guide
- [ ] `docs/LAZY_LOADING.md` - Lazy loading strategy
- [ ] `docs/SERVICE_WORKER.md` - Service Worker & caching
- [ ] `docs/PREFETCH_STRATEGY.md` - Prefetch strategies
- [ ] `docs/CSS_OPTIMIZATION.md` - CSS optimization guide
- [ ] `docs/SESSION_2025-12-31_PERFORMANCE_OPTIMIZATIONS.md` - Session notes

---

## ⚠️ Risks & Mitigations

### Testing Phase Risks

**Risk 1: Accessibility tests find violations**

- **Mitigation:** Fix violations before proceeding
- **Likelihood:** Low (currently 0 violations)

**Risk 2: Performance tests fail budget constraints**

- **Mitigation:** Implement optimizations before setting final budgets
- **Likelihood:** Low (currently excellent performance)

**Risk 3: Visual regression tests too sensitive**

- **Mitigation:** Configure threshold for acceptable differences
- **Likelihood:** Medium

### Performance Phase Risks

**Risk 1: Image optimization breaks layouts**

- **Mitigation:** Test thoroughly, maintain aspect ratios
- **Likelihood:** Low

**Risk 2: Service Worker causes caching issues**

- **Mitigation:** Implement proper cache invalidation strategy
- **Likelihood:** Medium

**Risk 3: Lazy loading causes UX degradation**

- **Mitigation:** Test loading indicators, ensure fast initialization
- **Likelihood:** Low

---

## 📞 Checkpoints

### After Phase 1 (Testing)

- [ ] Review all new tests
- [ ] Verify 0 regressions
- [ ] Review documentation
- [ ] Get user approval before Phase 2

### After Phase 2 (Performance)

- [ ] Run all tests (unit + E2E + new)
- [ ] Verify performance improvements
- [ ] Check Lighthouse scores
- [ ] Verify no broken functionality
- [ ] Get user approval before final commit

---

## ✅ Final Deliverables

### Code

- [ ] ~10 new test files (~1000 lines)
- [ ] ~15 modified component files
- [ ] ~10 new documentation files
- [ ] All tests passing (1149 unit + 421+ E2E)

### Documentation

- [ ] Testing guides (4 docs)
- [ ] Performance guides (5 docs)
- [ ] Session notes (2 docs)
- [ ] Updated README with new scripts/processes

### Metrics

- [ ] Lighthouse 100/100 maintained
- [ ] 0 accessibility violations
- [ ] Performance budgets met
- [ ] Visual baselines established
- [ ] Load tests passing

---

**Last Updated:** December 31, 2025  
**Next Review:** After Phase 1 completion  
**Owner:** Developer Team

---

**Ready to start?** Let's begin with **Phase 1, Task 4.1: Accessibility Testing with axe-core** 🚀
