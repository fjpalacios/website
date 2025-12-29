# Testing Strategy - Phase 5.3

**Date:** December 29, 2025  
**Status:** 🔄 In Progress  
**Phase:** 5.3 - Router Testing

---

## 📊 Current Test Coverage

### Unit Tests (src/**tests**/)

**Total:** 964 tests ✅ (all passing)

**Coverage:**

- Components: ✅ High coverage
- Utils: ✅ High coverage
- Route generators: 🔴 **Missing tests** (to be added in Phase 5.3)
- Config: ✅ 36 tests (routeSegments.ts)

### E2E Tests (e2e/)

**Total:** 122 tests ✅ (all passing)

**Files:**

1. `breadcrumbs.spec.ts` - Breadcrumb navigation
2. `rss.spec.ts` - RSS feed generation
3. `search.spec.ts` - Pagefind search functionality
4. `seo-itemlist.spec.ts` - SEO ItemList structured data
5. `seo-meta.spec.ts` - Meta tags
6. `seo-structured-data.spec.ts` - JSON-LD schemas
7. `state-performance.spec.ts` - State persistence and performance

**Coverage:**

- SEO: ✅ Excellent (meta, structured data, itemlists)
- Search: ✅ Complete (Pagefind integration)
- Navigation: ✅ Basic (language switcher, breadcrumbs)
- Routing: 🟡 **Partial** (no dedicated routing tests)
- Performance: ✅ Theme persistence

---

## 🎯 Phase 5.3 Goals

### 1. Unit Tests for Route Generators

**Files to test:**

```
src/utils/routeGenerators/
├── contentTypeWithPagination.ts  ← Need tests
├── taxonomy.ts                   ← Need tests
└── staticPage.ts                 ← Need tests
```

**Test files to create:**

```
src/__tests__/utils/routeGenerators/
├── contentTypeWithPagination.test.ts  (~40 tests)
├── taxonomy.test.ts                   (~40 tests)
└── staticPage.test.ts                 (~30 tests)
```

**Expected total:** ~110 new unit tests

**Why these tests?**

- Route generators are **critical** (any bug = 404 pages)
- Currently **zero coverage** for these utilities
- Need to ensure:
  - Correct path generation
  - Pagination works correctly
  - Language switching works
  - Edge cases handled (empty content, invalid params)

---

### 2. E2E Tests for Routing (Optional)

**Current situation:**

- 7 E2E test files exist
- Basic navigation tested (language switcher, breadcrumbs)
- **NO dedicated routing tests**

**Question:** Do we need MORE E2E tests for routing?

**Answer:** 🟡 **Optional, but recommended**

#### Why Add E2E Routing Tests?

**Pros:**

- ✅ Test actual page rendering (not just path generation)
- ✅ Catch template issues (missing components, broken imports)
- ✅ Verify 404 handling
- ✅ Test deep links work correctly
- ✅ Integration test (router + templates + content)

**Cons:**

- ⚠️ Unit tests already cover path generation logic
- ⚠️ Build process catches template errors
- ⚠️ More time to write (~2-3 hours)

#### Recommended E2E Routing Tests

**File:** `e2e/routing.spec.ts` (~20-30 tests)

**Test scenarios:**

```typescript
describe("Dynamic Routing", () => {
  // Content type routes
  test("GET /es/libros/ - should render books list");
  test("GET /es/libros/page/2/ - should render page 2");
  test("GET /es/libros/1984-george-orwell/ - should render book detail");
  test("GET /es/publicaciones/ - should render posts list");
  test("GET /es/tutoriales/ - should render tutorials list");

  // Taxonomy routes
  test("GET /es/autores/ - should render authors list");
  test("GET /es/autores/stephen-king/ - should render author detail");
  test("GET /es/autores/stephen-king/page/2/ - should render page 2");
  test("GET /es/categorias/libros/ - should render category");
  test("GET /es/generos/terror/ - should render genre");

  // Static routes
  test("GET /es/ - should render home page");
  test("GET /es/acerca-de/ - should render about page");

  // Language switching
  test("GET /en/books/ - should render English books list");
  test("GET /es/libros/ and /en/books/ - should have same content");

  // Error handling
  test("GET /es/libros/nonexistent-book/ - should return 404");
  test("GET /es/invalid-route/ - should return 404");

  // Deep links
  test("GET /es/autores/stephen-king/page/999/ - should handle invalid page");
  test("GET /es/libros/page/0/ - should redirect to page 1");
});
```

**Estimated:** ~25 tests, ~2-3 hours to write

#### Verdict: Should We Add E2E Routing Tests?

**My recommendation:** 🟢 **YES, add them**

**Reasons:**

1. **High value:** Catch integration issues unit tests miss
2. **Low risk:** Build already works, tests confirm it stays working
3. **One-time effort:** Write once, run forever
4. **Confidence:** Know routing works end-to-end before Phase 6 (content migration)
5. **Regression protection:** Future changes won't break routing

**When to add:**

- After unit tests are complete
- Before Phase 5.4 (documentation)
- Estimated time: 2-3 hours

---

## 📋 Phase 5.3 Task Breakdown

### Task 1: Unit Tests for contentTypeWithPagination

**File:** `src/__tests__/utils/routeGenerators/contentTypeWithPagination.test.ts`

**Test cases:**

```typescript
describe("contentTypeWithPagination", () => {
  // Basic generation
  test("generates routes for books without pagination");
  test("generates routes for posts without pagination");
  test("generates routes for tutorials without pagination");

  // Pagination
  test("generates pagination routes for books (2 pages)");
  test("generates pagination routes for posts (5 pages)");
  test("skips pagination if only 1 page");

  // Languages
  test("generates Spanish routes with /es/ prefix");
  test("generates English routes with /en/ prefix");

  // Edge cases
  test("handles empty content array");
  test("handles single item (no pagination)");
  test("handles exact page boundary (10 items, 10 per page)");
  test("handles 11 items (creates page 2 with 1 item)");

  // Props validation
  test("passes correct props to list page");
  test("passes correct props to detail page");
  test("passes pagination props to page 2");
});
```

**Estimated:** ~40 tests

---

### Task 2: Unit Tests for taxonomy

**File:** `src/__tests__/utils/routeGenerators/taxonomy.test.ts`

**Test cases:**

```typescript
describe("taxonomy", () => {
  // Authors
  test("generates author list route");
  test("generates author detail routes");
  test("generates author pagination routes");

  // Categories
  test("generates category list route");
  test("generates category detail routes");

  // Genres
  test("generates genre list route");
  test("generates genre detail routes");

  // Publishers
  test("generates publisher list route");
  test("generates publisher detail routes");

  // Series
  test("generates series list route");
  test("generates series detail routes");

  // Challenges
  test("generates challenge list route");
  test("generates challenge detail routes");

  // Courses
  test("generates course list route");
  test("generates course detail routes");

  // Languages
  test("generates Spanish taxonomy routes");
  test("generates English taxonomy routes");

  // Edge cases
  test("handles taxonomy with no items");
  test("handles single taxonomy item");
  test("skips pagination if items fit in 1 page");
});
```

**Estimated:** ~40 tests

---

### Task 3: Unit Tests for staticPage

**File:** `src/__tests__/utils/routeGenerators/staticPage.test.ts`

**Test cases:**

```typescript
describe("staticPage", () => {
  // Home page
  test("generates Spanish home route");
  test("generates English home route");
  test("passes correct props to home template");

  // About page
  test("generates Spanish about route");
  test("generates English about route");

  // Other static pages
  test("generates contact page");
  test("generates 404 page");

  // Edge cases
  test("handles missing template");
  test("handles invalid language");
  test("validates props structure");
});
```

**Estimated:** ~30 tests

---

### Task 4: E2E Routing Tests (Recommended)

**File:** `e2e/routing.spec.ts`

**Test cases:** See "Recommended E2E Routing Tests" section above

**Estimated:** ~25 tests

---

## 📊 Testing Summary

### Before Phase 5.3

```
Unit tests: 964
E2E tests:  122
Total:      1,086 ✅
```

### After Phase 5.3 (with E2E)

```
Unit tests: 964 + 110 = 1,074
E2E tests:  122 + 25  = 147
Total:                 1,221 ✅
```

### After Phase 5.3 (without E2E)

```
Unit tests: 964 + 110 = 1,074
E2E tests:  122       = 122
Total:                 1,196 ✅
```

---

## ⏱️ Time Estimates

| Task                            | Estimated Time | Priority  |
| ------------------------------- | -------------- | --------- |
| contentTypeWithPagination tests | 2-3 hours      | 🔴 High   |
| taxonomy tests                  | 2-3 hours      | 🔴 High   |
| staticPage tests                | 1-2 hours      | 🔴 High   |
| E2E routing tests               | 2-3 hours      | 🟡 Medium |
| **Total (with E2E)**            | **7-11 hours** | -         |
| **Total (without E2E)**         | **5-8 hours**  | -         |

---

## 🎯 Recommendation

### Priority Order

1. ✅ **contentTypeWithPagination tests** (most complex, highest risk)
2. ✅ **taxonomy tests** (second most complex)
3. ✅ **staticPage tests** (simplest, quick win)
4. 🟡 **E2E routing tests** (optional but recommended)

### My Vote: Include E2E Tests

**Why:**

- Only adds 2-3 hours
- High value for catching integration bugs
- Peace of mind before content migration
- Future-proofs against regressions

**Final estimated time:** 7-11 hours total

---

## ✅ Success Criteria

### Unit Tests

- [x] All route generator files have test coverage
- [ ] 100% function coverage for route generators
- [ ] All edge cases tested
- [ ] 110+ new tests passing
- [ ] No regressions (964 original tests still passing)

### E2E Tests (if included)

- [ ] All content type routes tested
- [ ] All taxonomy routes tested
- [ ] Static pages tested
- [ ] 404 handling tested
- [ ] Language switching tested
- [ ] 25+ new E2E tests passing

### Overall

- [ ] Total test count: 1,196+ (without E2E) or 1,221+ (with E2E)
- [ ] All tests passing (100% pass rate)
- [ ] Build succeeds
- [ ] No ESLint errors
- [ ] Coverage report shows improvement

---

## 📚 Related Documentation

- **DEVELOPMENT_GUIDELINES.md:** Testing best practices
- **ROADMAP.md:** Phase 5.3 details
- **BLOG_MIGRATION_PROGRESS.md:** Progress tracking

---

**Next Steps:**

1. Create `contentTypeWithPagination.test.ts`
2. Create `taxonomy.test.ts`
3. Create `staticPage.test.ts`
4. Create `routing.spec.ts` (optional but recommended)
5. Run all tests: `bun run test && bun run test:e2e`
6. Verify 100% pass rate
7. Move to Phase 5.2 (Performance)

---

**Document Status:** ✅ Ready - Testing plan complete  
**Last Updated:** December 29, 2025
