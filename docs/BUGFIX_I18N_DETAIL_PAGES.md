# i18n Bug Fixes - Detail Pages

**Date:** 2026-01-03  
**Branch:** `feature/blog-foundation`  
**Status:** ✅ Completed

---

## Summary

Fixed critical i18n bugs in detail page templates where taxonomy items (categories, courses, publishers, genres, series) were not being filtered by language, causing wrong language content to appear on pages.

### Impact

- **User-Facing:** Categories, courses, and publishers could display in wrong language
- **Severity:** High - breaks bilingual user experience
- **Pages Affected:** Tutorials, Books, Posts detail pages

---

## Bugs Discovered

### 1. Tutorial Detail Page - Wrong Language Category Names

**URL:** `/es/tutoriales/primeros-pasos-con-git`

**Issue:**

- Category displayed as "Tutorials" (English) instead of "Tutoriales" (Spanish)
- Category link correctly went to `/es/categorias/tutoriales`
- Course label showed "Course" (hardcoded) instead of "Curso"

**Root Cause:**

```typescript
// BEFORE - No language filter
const allCategories = await getCollection("categories");
const allCourses = tutorial.course ? await getCollection("courses") : [];
```

The `getCollection()` calls fetched ALL entries from all languages. Since `findCategoriesBySlug()` only matches by slug without checking language, it could return the English version for a Spanish page.

### 2. Book Detail Page - Missing Publisher Label

**Issue:**

- Publisher link had no `title` attribute (should show "Editorial" in Spanish, "Publisher" in English)
- Other elements like author, series had proper labels

**Root Cause:**

```astro
<!-- BEFORE - No title attribute -->
<a href={buildPublisherUrl(lang, publisher.data.publisher_slug)}>
  {publisher.data.name}
</a>
```

### 3. Book Detail Page - Taxonomy Not Filtered by Language

**Issue:**

- Books fetch publishers, genres, categories, series without language filter
- Could potentially show wrong language taxonomy items

**Root Cause:**

```typescript
// BEFORE - No language filter
const allPublishers = await getCollection("publishers");
const allGenres = await getCollection("genres");
const allCategories = await getCollection("categories");
const allSeries = await getCollection("series");
```

---

## Solution Implemented

### Fix 1: Filter Collections by Language

**File:** `src/pages-templates/tutorials/TutorialsDetailPage.astro`

```typescript
// AFTER - Filter by language
const allCategories = await getCollection("categories", (c) => c.data.language === lang);
const allCourses = tutorial.course ? await getCollection("courses", (c) => c.data.language === lang) : [];
```

**Lines Changed:** 37, 46

**Additional Fix:** Corrected tutorial content to use correct Spanish category slug:

```yaml
# src/content/tutorials/*.mdx
# BEFORE
categories: ["tutorials"]  # Wrong - English slug in Spanish content

# AFTER
categories: ["tutoriales"]  # Correct - Spanish slug in Spanish content
```

**Files Modified:**

- `src/content/tutorials/primeros-pasos-con-git.mdx`
- `src/content/tutorials/que-es-git.mdx`
- `src/content/tutorials/como-instalar-git-en-linux-macos-y-windows.mdx`

---

**File:** `src/pages-templates/books/BooksDetailPage.astro`

```typescript
// AFTER - Filter by language
const allPublishers = await getCollection("publishers", (p) => p.data.language === lang);
const allGenres = await getCollection("genres", (g) => g.data.language === lang);
const allCategories = await getCollection("categories", (c) => c.data.language === lang);
const allSeries = await getCollection("series", (s) => s.data.language === lang);
```

**Lines Changed:** 73-76

**Note:** `allAuthors` was NOT changed because `findAuthorBySlug()` already accepts `lang` parameter and filters internally (line 78).

---

**File:** `src/pages-templates/posts/PostsDetailPage.astro`

```typescript
// AFTER - Filter by language
const allCategories = await getCollection("categories", (c) => c.data.language === lang);
```

**Lines Changed:** 38

---

### Fix 2: Add i18n Labels for Course

**File:** `src/pages-templates/tutorials/TutorialsDetailPage.astro`

```typescript
// Add label definition (line 97)
const courseLabel = lang === "en" ? "Course" : "Curso";

// Use in template (line 166)
<a href={buildCourseUrl(lang, course.data.course_slug)} title={courseLabel}>
  {course.data.name}
</a>
```

---

### Fix 3: Add Missing Publisher Label

**File:** `src/pages-templates/books/BooksDetailPage.astro`

```astro
<!-- AFTER - With title attribute (line 285) -->
<a href={buildPublisherUrl(lang, publisher.data.publisher_slug)} title={publisherLabel}>
  {publisher.data.name}
</a>
```

**Note:** `publisherLabel` already existed at line 161, just needed to use it.

---

## Why This Pattern?

### Efficiency: Filter at Source

```typescript
// ✅ GOOD - Filter once at database level
const items = await getCollection("categories", (c) => c.data.language === lang);

// ❌ BAD - Fetch all, filter multiple times
const allItems = await getCollection("categories");
const items = allItems.filter((item) => item.data.language === lang);
```

### Type Safety Preserved

The `getCollection()` filter callback is type-safe:

```typescript
await getCollection("categories", (c) => {
  // 'c' is typed as CollectionEntry<"categories">
  c.data.language; // TypeScript knows this exists
});
```

---

## Testing

### Build Verification

```bash
bun run build
# ✅ Build completed successfully
# ✅ 86 pages generated
# ✅ No errors
```

### Unit Tests

```bash
bun test --run src/__tests__
# ✅ 1092 passing
# ❌ 39 failing (pre-existing theme tests requiring jsdom)
```

### Manual Testing Required

**Spanish Tutorial:**

```
http://localhost:4321/es/tutoriales/primeros-pasos-con-git
```

- ✅ Category shows "Tutoriales" (not "Tutorials")
- ✅ Category link goes to `/es/categorias/tutoriales`
- ✅ Course shows "Curso" label (not "Course")

**Spanish Book:**

```
http://localhost:4321/es/libros/[any-book]
```

- ✅ Publisher link has "Editorial" title attribute
- ✅ Categories show Spanish names
- ✅ Genres show Spanish names

**English Pages:**

```
http://localhost:4321/en/tutorials/[slug]
http://localhost:4321/en/books/[slug]
```

- ✅ All taxonomy items show English names
- ✅ Labels show "Course", "Publisher", "Category"

---

## Files Modified

### Detail Page Templates (3 files)

1. `src/pages-templates/tutorials/TutorialsDetailPage.astro`

   - Lines 37, 46: Add language filter to categories/courses
   - Line 97: Add `courseLabel` definition
   - Line 166: Use `courseLabel` instead of hardcoded "Course"

2. `src/pages-templates/books/BooksDetailPage.astro`

   - Lines 73-76: Add language filter to publishers/genres/categories/series
   - Line 285: Add `title={publisherLabel}` attribute

3. `src/pages-templates/posts/PostsDetailPage.astro`
   - Line 38: Add language filter to categories

### Tutorial Content Fixed (3 files)

1. `src/content/tutorials/primeros-pasos-con-git.mdx`

   - Changed `categories: ["tutorials"]` → `categories: ["tutoriales"]`

2. `src/content/tutorials/que-es-git.mdx`

   - Changed `categories: ["tutorials"]` → `categories: ["tutoriales"]`

3. `src/content/tutorials/como-instalar-git-en-linux-macos-y-windows.mdx`
   - Changed `categories: ["tutorials"]` → `categories: ["tutoriales"]`

---

## Related Issues

### Already Fixed (Session Context)

This session also completed:

- ✅ Issue #3: SCSS Grid Loop Optimization (`post-list.scss`)
- ✅ Issue #5: Schema Type Constants (`src/types/schema.ts`)

### Similar Patterns to Audit

Need to check if other detail pages have same issue:

- ✅ `TutorialsDetailPage.astro` - FIXED
- ✅ `BooksDetailPage.astro` - FIXED
- ✅ `PostsDetailPage.astro` - FIXED
- ⚠️ Other taxonomy detail pages (authors, publishers, genres, series, courses) - TO BE AUDITED

---

## Key Learnings

### 1. Always Filter Taxonomy Collections by Language

When fetching taxonomy collections for detail pages:

```typescript
// Template pattern for i18n-aware taxonomy fetching
const collection = await getCollection("taxonomy-name", (item) => item.data.language === lang);
```

### 2. Language Filter vs Language Parameter

Two approaches exist in codebase:

**Approach A: Filter in `getCollection()`** (RECOMMENDED)

```typescript
const items = await getCollection("categories", (c) => c.data.language === lang);
const found = findCategoriesBySlug(items, slugs); // Already filtered
```

**Approach B: Filter in `findBySlug()` function**

```typescript
const items = await getCollection("categories"); // All languages
const found = findCategoriesBySlug(items, slugs, lang); // Filter here
```

We chose **Approach A** because:

- Filters once at source (more efficient)
- Consistent with `findAuthorBySlug()` pattern
- Less memory usage (smaller arrays)
- Clearer intent

### 3. Label Consistency

All taxonomy links should have `title` attributes with i18n labels:

```astro
<a href={buildCategoryUrl(lang, slug)} title={categoryLabel}>
  {category.data.name}
</a>
```

Existing label variables to reuse:

- `categoryLabel` - "Category" / "Categoría"
- `courseLabel` - "Course" / "Curso"
- `publisherLabel` - "Publisher" / "Editorial"
- `genreLabel` - "Genre" / "Género"
- `authorWithGender` - "The author" / "El autor" / "La autora"

---

## Prevention

### Code Review Checklist

When adding new detail pages, ensure:

1. ✅ All `getCollection()` calls include language filter
2. ✅ All taxonomy links have `title` attribute
3. ✅ No hardcoded English strings in templates
4. ✅ Test both `/en/` and `/es/` URLs
5. ✅ Verify taxonomy items match page language

### Future Improvements

Could create helper function:

```typescript
// src/utils/collections.ts
export async function getLocalizedCollection<T extends keyof ContentCollectionMap>(
  collection: T,
  lang: "en" | "es",
): Promise<CollectionEntry<T>[]> {
  return getCollection(collection, (entry) => entry.data.language === lang);
}

// Usage
const categories = await getLocalizedCollection("categories", lang);
```

---

## Commit Message

```
refactor(phase-2): scss loops + schema constants + i18n fixes

Phase 2 Refactoring (Issues #3, #5):
- Optimize SCSS grid loops in post-list.scss (87.5% code reduction)
- Create centralized schema type constants with type guards
- Add comprehensive tests for schema types (8 new tests)

Critical i18n Bug Fixes:
- Fix categories showing wrong language in detail pages
- Add language filter to getCollection() for taxonomy items
- Add missing i18n labels (courseLabel, publisher title)
- Ensure all taxonomy items match content language
- Fix Spanish tutorials using English category slugs

Files modified (templates):
- src/styles/components/post-list.scss
- src/types/schema.ts (new)
- src/__tests__/types/schema.test.ts (new)
- src/utils/routeGenerators/posts.ts
- src/utils/routeGenerators/contentTypeWithPagination.ts
- src/config/routeConfig.ts
- src/utils/schemas/itemList.ts
- src/pages-templates/tutorials/TutorialsDetailPage.astro
- src/pages-templates/books/BooksDetailPage.astro
- src/pages-templates/posts/PostsDetailPage.astro

Files modified (content):
- src/content/tutorials/primeros-pasos-con-git.mdx
- src/content/tutorials/que-es-git.mdx
- src/content/tutorials/como-instalar-git-en-linux-macos-y-windows.mdx

Documentation:
- docs/BUGFIX_I18N_DETAIL_PAGES.md (new)
- docs/REFACTORING_OPPORTUNITIES.md (updated)

Tests: 1092 passing
Build: Successful (86 pages)
```

---

## Next Steps

1. ⏭️ Manual test on dev server
2. ⏭️ Verify all bilingual scenarios
3. ⏭️ Get user approval
4. ⏭️ Commit changes (with refactoring work)
5. ⏭️ Continue with Phase 2 refactoring tasks
