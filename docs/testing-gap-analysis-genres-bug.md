# Testing Gap Analysis: Why Genres Language Switcher Bug Wasn't Caught

**Date**: 2026-01-02  
**Bug**: Genres language switcher appearing disabled despite valid i18n data  
**Root Cause**: `src/utils/taxonomyPages.ts:177` checking same slug instead of i18n field

## Summary

The bug existed in production despite having **comprehensive test coverage**. This document analyzes why the bug wasn't caught and proposes improvements to prevent similar issues.

## Existing Test Coverage

### ✅ What We Have

#### 1. Unit Tests for Genres (`src/__tests__/utils/blog/genres.test.ts`)

**Coverage**:

- ✅ Genre files exist and have valid JSON
- ✅ Required fields present (`name`, `genre_slug`, `language`)
- ✅ Genres exist in both languages
- ✅ Unique slugs per language
- ✅ i18n field exists on genres with translations
- ✅ Reciprocal i18n mappings (if ES has `i18n: "fiction"`, EN has `i18n: "ficcion"`)
- ✅ Valid i18n references (referenced slugs exist)

**What it doesn't test**:

- ❌ Runtime behavior of `generateTaxonomyDetailPaths()`
- ❌ `hasTargetContent` flag calculation
- ❌ Language switcher state (enabled/disabled)

#### 2. Unit Tests for Taxonomy Pages (`src/__tests__/utils/taxonomyPages.test.ts`)

**Coverage**:

- ✅ Array field filtering (categories, genres, challenges)
- ✅ Singular field filtering (author, publisher, series)
- ✅ Content matching logic

**What it doesn't test**:

- ❌ `generateTaxonomyDetailPaths()` function
- ❌ `hasTargetContent` calculation
- ❌ i18n field usage in path generation

#### 3. E2E Tests for Language Switching (`e2e/language-switching-edge-cases.spec.ts`)

**Coverage**:

- ✅ Language switcher disabled when content has no translation
- ✅ URL preservation (query params, hash fragments)
- ✅ Theme persistence across language switches
- ✅ Navigation history
- ✅ Hreflang tags
- ✅ Accessibility (ARIA labels)

**What it doesn't test**:

- ❌ Language switcher state on **taxonomy pages** specifically
- ❌ All tests use **content pages** (books, posts)
- ❌ No tests for genres, categories, challenges, authors, publishers, series

#### 4. E2E Tests for Routing (`e2e/routing.spec.ts`)

**Coverage**:

- ✅ Genres list page renders
- ✅ Genre detail page renders
- ✅ Book cards visible on genre pages

**What it doesn't test**:

- ❌ Language switcher state on genre pages
- ❌ Language switching functionality from genre pages

## The Gap: Missing Tests

### Root Cause of Testing Gap

The bug existed in **utility code** (`taxonomyPages.ts`) but all **E2E tests focused on content pages**:

```typescript
// ❌ Bug was here (taxonomyPages.ts:177)
const hasTargetContent = targetTaxonomySlugs.has(taxonomySlug);

// But E2E tests only checked books/posts
test("should disable language switcher when content has no translation", async ({ page }) => {
  await page.goto("/es/libros/area-81-stephen-king/"); // ← Book page, not taxonomy
  const isDisabled = await languageSwitcher.isDisabled();
  expect(isDisabled).toBe(true);
});
```

### Why Unit Tests Missed It

The unit tests for `taxonomyPages.ts` only test **filtering logic**, not **path generation**:

```typescript
// ✅ Tests this
const matches = Array.isArray(value) && value.includes(taxonomySlug);

// ❌ Doesn't test this
const hasTargetContent = translationSlug
  ? targetTaxonomySlugs.has(translationSlug)
  : targetTaxonomySlugs.has(taxonomySlug);
```

## Proposed Testing Improvements

### 1. Unit Test: `generateTaxonomyDetailPaths()` with i18n

**File**: `src/__tests__/utils/taxonomyPages.test.ts`

```typescript
describe("generateTaxonomyDetailPaths", () => {
  it("should set hasTargetContent=true when i18n slug exists in target language", async () => {
    // Mock data
    const config = TAXONOMY_CONFIGS.genres;
    const lang = "es";

    // Mock getCollection to return:
    // ES: { genre_slug: "ficcion", i18n: "fiction" }
    // EN: { genre_slug: "fiction", i18n: "ficcion" }

    const paths = await generateTaxonomyDetailPaths(config, lang, contactES);

    // Find the "ficcion" genre path
    const ficcionPath = paths.find((p) => p.slug === "ficcion");

    // Should have hasTargetContent=true because "fiction" exists in EN
    expect(ficcionPath.props.hasTargetContent).toBe(true);
  });

  it("should set hasTargetContent=false when i18n slug doesn't exist", async () => {
    // ES: { genre_slug: "romance", i18n: "romance-en" }
    // EN: (no "romance-en" genre exists)

    const paths = await generateTaxonomyDetailPaths(config, "es", contactES);
    const romancePath = paths.find((p) => p.slug === "romance");

    expect(romancePath.props.hasTargetContent).toBe(false);
  });

  it("should fallback to slug matching when i18n field is missing", async () => {
    // ES: { genre_slug: "biography" } (no i18n field)
    // EN: { genre_slug: "biography" } (same slug in both languages)

    const paths = await generateTaxonomyDetailPaths(config, "es", contactES);
    const bioPath = paths.find((p) => p.slug === "biography");

    // Should check if "biography" slug exists in EN
    expect(bioPath.props.hasTargetContent).toBe(true);
  });
});
```

### 2. E2E Test: Taxonomy Pages Language Switching

**File**: `e2e/language-switching-taxonomy.spec.ts` (NEW)

```typescript
import { test, expect } from "@playwright/test";

test.describe("Language Switching - Taxonomy Pages", () => {
  test.describe("Genres", () => {
    test("should enable language switcher on genre with translation", async ({ page }) => {
      // Go to Spanish genre that has English translation
      await page.goto("/es/generos/ficcion/");

      const languageSwitcher = page.locator(".language-switcher");

      // Should be visible and enabled
      await expect(languageSwitcher).toBeVisible();
      await expect(languageSwitcher).toBeEnabled();

      // Should have correct target URL
      const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
      expect(targetUrl).toBe("/en/genres/fiction");
    });

    test("should switch from ES genre to EN genre", async ({ page }) => {
      await page.goto("/es/generos/terror/");

      const languageSwitcher = page.locator(".language-switcher");
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      // Should be on English horror page
      expect(page.url()).toContain("/en/genres/horror");
      await expect(page).toHaveTitle(/Horror/);
    });

    test("should switch from EN genre to ES genre", async ({ page }) => {
      await page.goto("/en/genres/fiction/");

      const languageSwitcher = page.locator(".language-switcher");
      await languageSwitcher.click();
      await page.waitForLoadState("networkidle");

      // Should be on Spanish ficcion page
      expect(page.url()).toContain("/es/generos/ficcion");
      await expect(page).toHaveTitle(/Ficción/);
    });

    test("should disable switcher on genre without translation", async ({ page }) => {
      // Assuming "biografía" genre exists only in Spanish
      await page.goto("/es/generos/biografia/");

      const languageSwitcher = page.locator(".language-switcher");
      await expect(languageSwitcher).toBeDisabled();
    });
  });

  test.describe("Categories", () => {
    test("should enable language switcher on category with translation", async ({ page }) => {
      await page.goto("/es/categorias/libros/");

      const languageSwitcher = page.locator(".language-switcher");
      await expect(languageSwitcher).toBeEnabled();

      const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
      expect(targetUrl).toBe("/en/categories/books");
    });
  });

  test.describe("Authors", () => {
    test("should enable language switcher on author with translation", async ({ page }) => {
      await page.goto("/es/autores/stephen-king/");

      const languageSwitcher = page.locator(".language-switcher");
      // Check state based on current implementation
      const isEnabled = await languageSwitcher.isEnabled();

      if (isEnabled) {
        // If enabled, should have valid target URL
        const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
        expect(targetUrl).toContain("/en/authors/");
      }
    });
  });

  test.describe("Challenges", () => {
    test("should enable language switcher on challenge with translation", async ({ page }) => {
      await page.goto("/es/retos/reto-lectura-2017/");

      const languageSwitcher = page.locator(".language-switcher");

      // Should be enabled if challenge has translation
      const isEnabled = await languageSwitcher.isEnabled();
      expect(isEnabled).toBe(true);

      const targetUrl = await languageSwitcher.getAttribute("data-lang-url");
      expect(targetUrl).toBe("/en/challenges/2017-reading-challenge");
    });
  });
});
```

### 3. Integration Test: Full Taxonomy i18n Flow

**File**: `src/__tests__/utils/routeGenerators/taxonomy.test.ts` (ADD TO EXISTING)

```typescript
describe("Taxonomy Route Generator - i18n Support", () => {
  it("should pass correct hasTargetContent to genre detail pages", async () => {
    const config = {
      taxonomyConfig: TAXONOMY_CONFIGS.genres,
      lang: "es",
      targetLang: "en",
      routeSegment: "generos",
      contentType: "genres",
      contact: mockContact,
      itemsPropsKey: "genresWithCounts",
    };

    const routes = await generateTaxonomyRoutes(config);

    // Find fiction genre route
    const fictionRoute = routes.find((r) => r.params.route === "generos/ficcion" && r.props.pageType === "detail");

    expect(fictionRoute).toBeDefined();
    expect(fictionRoute.props.hasTargetContent).toBe(true); // ← This would have caught the bug
  });

  it("should pass hasTargetContent=false when translation doesn't exist", async () => {
    // Test with a genre that only exists in one language
    const routes = await generateTaxonomyRoutes({ ...config, lang: "es" });

    const spanishOnlyRoute = routes.find((r) => r.params.route === "generos/solo-espanol");

    expect(spanishOnlyRoute.props.hasTargetContent).toBe(false);
  });
});
```

## Why These Tests Would Have Caught the Bug

### Before the Fix (Bug Present)

```typescript
// ❌ Bug: checking same slug
const hasTargetContent = targetTaxonomySlugs.has(taxonomySlug);
// For "ficcion" → checks if "ficcion" exists in EN → FALSE

// Test would fail:
expect(fictionRoute.props.hasTargetContent).toBe(true); // ❌ FAIL (got false)
```

### After the Fix (Bug Resolved)

```typescript
// ✅ Fix: checking i18n slug
const translationSlug = taxonomyItem.data.i18n;
const hasTargetContent = translationSlug
  ? targetTaxonomySlugs.has(translationSlug)
  : targetTaxonomySlugs.has(taxonomySlug);
// For "ficcion" with i18n:"fiction" → checks if "fiction" exists in EN → TRUE

// Test passes:
expect(fictionRoute.props.hasTargetContent).toBe(true); // ✅ PASS
```

## Implementation Priority

### High Priority (Prevents Regression)

1. ✅ Unit test for `generateTaxonomyDetailPaths()` i18n logic
2. ✅ E2E test for genres language switching (most common taxonomy)

### Medium Priority (Comprehensive Coverage)

3. E2E tests for categories and challenges (have valid i18n data)
4. Integration test in `taxonomy.test.ts`

### Low Priority (Edge Cases)

5. E2E tests for authors (invalid i18n format)
6. Tests for publishers/series (no i18n content yet)

## Testing Best Practices Learned

### 1. Test the Full Path, Not Just Components

```typescript
// ❌ Not enough
test("genres have i18n field", () => {
  /* checks data */
});

// ✅ Also test
test("hasTargetContent uses i18n field", () => {
  /* checks behavior */
});
```

### 2. E2E Tests Should Cover All Page Types

```typescript
// ❌ Only testing content pages
test("language switcher on books page", ...);

// ✅ Also test taxonomy pages
test("language switcher on genres page", ...);
test("language switcher on categories page", ...);
```

### 3. Test Critical User Journeys

```typescript
// ✅ Critical journey
test("user switches from ES genre to EN genre", async ({ page }) => {
  await page.goto("/es/generos/ficcion/");
  await clickLanguageSwitcher(page);
  expect(page.url()).toContain("/en/genres/fiction");
});
```

### 4. Integration Tests for Complex Functions

```typescript
// ✅ Test the actual function that generates routes
test("generateTaxonomyDetailPaths sets hasTargetContent correctly", async () => {
  const paths = await generateTaxonomyDetailPaths(config, "es", contact);
  expect(paths[0].props.hasTargetContent).toBe(true);
});
```

## Conclusion

The bug slipped through because:

1. **Unit tests** validated data structure but not runtime behavior
2. **E2E tests** covered content pages but not taxonomy pages
3. **Integration tests** for route generators didn't exist

The proposed tests would have caught this bug at **all three levels**:

- Unit: Test `hasTargetContent` calculation logic
- Integration: Test `generateTaxonomyDetailPaths()` output
- E2E: Test language switcher on actual genre pages

## Next Steps

1. ✅ Fix implemented in `taxonomyPages.ts`
2. ⏳ Add unit tests for `generateTaxonomyDetailPaths()`
3. ⏳ Add E2E test file `language-switching-taxonomy.spec.ts`
4. ⏳ Run full test suite and verify 100% pass
5. ⏳ Update `i18n-field-analysis.md` with test coverage status
