# Route Mapping - Phase 3: Unified i18n Routing

**Created**: December 28, 2025  
**Status**: 📋 Planning Phase  
**Purpose**: Complete mapping of current duplicate routes for unified routing migration

---

## Executive Summary

### Current State

```
Total Duplicate Files:   58 files (29 EN + 29 ES)
Total Duplicate Lines:   ~4,099 lines
Duplication Rate:        95%+ identical code
Largest Files:           250 lines (books detail pages)
```

### Differences Between Language Versions

**Only 3-5 lines differ per file**:

1. **Import line**: `contactEn` vs `contactEs` (line 8)
2. **Lang constant**: `"en"` vs `"es"` (line 13)
3. **Target lang**: Inverse for language switcher (line 20)
4. **Description text**: Hard-coded text (could use i18n) (line 25)
5. **Base path**: `/en/books` vs `/es/libros` (line 62)

**Everything else is 100% identical** - perfect candidate for unification.

---

## Complete Route Inventory

### Content Type: Books (libros)

| File Type    | EN Path                       | ES Path                          | Lines   | Page Type   | Has Pagination | Has RSS |
| ------------ | ----------------------------- | -------------------------------- | ------- | ----------- | -------------- | ------- |
| List         | `/en/books/index.astro`       | `/es/libros/index.astro`         | 75      | list        | ✅             | ✅      |
| Detail       | `/en/books/[slug].astro`      | `/es/libros/[slug].astro`        | 250     | detail      | ❌             | ❌      |
| Pagination   | `/en/books/page/[page].astro` | `/es/libros/pagina/[page].astro` | 80      | pagination  | ✅             | ❌      |
| RSS Feed     | `/en/books/rss.xml.ts`        | `/es/libros/rss.xml.ts`          | 30      | rss         | ❌             | ✅      |
| **Subtotal** | **4 files**                   | **4 files**                      | **435** | **8 total** | -              | -       |

### Content Type: Tutorials (tutoriales)

| File Type    | EN Path                           | ES Path                              | Lines   | Page Type   | Has Pagination | Has RSS |
| ------------ | --------------------------------- | ------------------------------------ | ------- | ----------- | -------------- | ------- |
| List         | `/en/tutorials/index.astro`       | `/es/tutoriales/index.astro`         | 75      | list        | ✅             | ✅      |
| Detail       | `/en/tutorials/[slug].astro`      | `/es/tutoriales/[slug].astro`        | 145     | detail      | ❌             | ❌      |
| Pagination   | `/en/tutorials/page/[page].astro` | `/es/tutoriales/pagina/[page].astro` | 80      | pagination  | ✅             | ❌      |
| RSS Feed     | `/en/tutorials/rss.xml.ts`        | `/es/tutoriales/rss.xml.ts`          | 30      | rss         | ❌             | ✅      |
| **Subtotal** | **4 files**                       | **4 files**                          | **330** | **8 total** | -              | -       |

### Content Type: Posts (publicaciones)

| File Type    | EN Path                       | ES Path                                 | Lines   | Page Type   | Has Pagination | Has RSS |
| ------------ | ----------------------------- | --------------------------------------- | ------- | ----------- | -------------- | ------- |
| List         | `/en/posts/index.astro`       | `/es/publicaciones/index.astro`         | 75      | list        | ✅             | ❌      |
| Detail       | `/en/posts/[slug].astro`      | `/es/publicaciones/[slug].astro`        | 107     | detail      | ❌             | ❌      |
| Pagination   | `/en/posts/page/[page].astro` | `/es/publicaciones/pagina/[page].astro` | 80      | pagination  | ✅             | ❌      |
| **Subtotal** | **3 files**                   | **3 files**                             | **262** | **6 total** | -              | -       |

### Taxonomy: Authors (autores)

| File Type    | EN Path                    | ES Path                    | Lines   | Page Type       | Has Pagination |
| ------------ | -------------------------- | -------------------------- | ------- | --------------- | -------------- |
| List         | `/en/authors/index.astro`  | `/es/autores/index.astro`  | 67      | taxonomy-list   | ❌             |
| Detail       | `/en/authors/[slug].astro` | `/es/autores/[slug].astro` | 102     | taxonomy-detail | ✅             |
| **Subtotal** | **2 files**                | **2 files**                | **169** | **4 total**     | -              |

### Taxonomy: Publishers (editoriales)

| File Type    | EN Path                       | ES Path                        | Lines   | Page Type       | Has Pagination |
| ------------ | ----------------------------- | ------------------------------ | ------- | --------------- | -------------- |
| List         | `/en/publishers/index.astro`  | `/es/editoriales/index.astro`  | 67      | taxonomy-list   | ❌             |
| Detail       | `/en/publishers/[slug].astro` | `/es/editoriales/[slug].astro` | 79      | taxonomy-detail | ✅             |
| **Subtotal** | **2 files**                   | **2 files**                    | **146** | **4 total**     | -              |

### Taxonomy: Genres (generos)

| File Type    | EN Path                   | ES Path                    | Lines   | Page Type       | Has Pagination |
| ------------ | ------------------------- | -------------------------- | ------- | --------------- | -------------- |
| List         | `/en/genres/index.astro`  | `/es/generos/index.astro`  | 67      | taxonomy-list   | ❌             |
| Detail       | `/en/genres/[slug].astro` | `/es/generos/[slug].astro` | 86      | taxonomy-detail | ✅             |
| **Subtotal** | **2 files**               | **2 files**                | **153** | **4 total**     | -              |

### Taxonomy: Categories (categorias)

| File Type    | EN Path                       | ES Path                       | Lines   | Page Type       | Has Pagination |
| ------------ | ----------------------------- | ----------------------------- | ------- | --------------- | -------------- |
| List         | `/en/categories/index.astro`  | `/es/categorias/index.astro`  | 67      | taxonomy-list   | ❌             |
| Detail       | `/en/categories/[slug].astro` | `/es/categorias/[slug].astro` | 88      | taxonomy-detail | ✅             |
| **Subtotal** | **2 files**                   | **2 files**                   | **155** | **4 total**     | -              |

### Taxonomy: Series (series)

| File Type    | EN Path                   | ES Path                   | Lines   | Page Type       | Has Pagination |
| ------------ | ------------------------- | ------------------------- | ------- | --------------- | -------------- |
| List         | `/en/series/index.astro`  | `/es/series/index.astro`  | 67      | taxonomy-list   | ❌             |
| Detail       | `/en/series/[slug].astro` | `/es/series/[slug].astro` | 82      | taxonomy-detail | ✅             |
| **Subtotal** | **2 files**               | **2 files**               | **149** | **4 total**     | -              |

### Taxonomy: Challenges (retos)

| File Type    | EN Path                       | ES Path                  | Lines   | Page Type       | Has Pagination |
| ------------ | ----------------------------- | ------------------------ | ------- | --------------- | -------------- |
| List         | `/en/challenges/index.astro`  | `/es/retos/index.astro`  | 67      | taxonomy-list   | ❌             |
| Detail       | `/en/challenges/[slug].astro` | `/es/retos/[slug].astro` | 82      | taxonomy-detail | ✅             |
| **Subtotal** | **2 files**                   | **2 files**              | **149** | **4 total**     | -              |

### Taxonomy: Courses (cursos)

| File Type    | EN Path                    | ES Path                   | Lines   | Page Type       | Has Pagination |
| ------------ | -------------------------- | ------------------------- | ------- | --------------- | -------------- |
| List         | `/en/courses/index.astro`  | `/es/cursos/index.astro`  | 67      | taxonomy-list   | ❌             |
| Detail       | `/en/courses/[slug].astro` | `/es/cursos/[slug].astro` | 87      | taxonomy-detail | ✅             |
| **Subtotal** | **2 files**                | **2 files**               | **154** | **4 total**     | -              |

### Static Pages

| File Type    | EN Path           | ES Path               | Lines   | Page Type   |
| ------------ | ----------------- | --------------------- | ------- | ----------- |
| Homepage     | `/en/index.astro` | `/es/index.astro`     | 77      | static      |
| About        | `/en/about.astro` | `/es/acerca-de.astro` | 50      | static      |
| Feeds        | `/en/feeds.astro` | `/es/feeds.astro`     | 45      | static      |
| **Subtotal** | **3 files**       | **3 files**           | **172** | **6 total** |

### RSS Feeds (Global)

| File Type    | EN Path          | ES Path          | Lines  | Page Type   |
| ------------ | ---------------- | ---------------- | ------ | ----------- |
| Global RSS   | `/en/rss.xml.ts` | `/es/rss.xml.ts` | 50     | rss         |
| **Subtotal** | **1 file**       | **1 file**       | **50** | **2 total** |

---

## Summary Statistics

### By Content Type

| Content Type | EN Files | ES Files | Total Files | Total Lines | Avg Lines/File |
| ------------ | -------- | -------- | ----------- | ----------- | -------------- |
| Books        | 4        | 4        | 8           | 435         | 54             |
| Tutorials    | 4        | 4        | 8           | 330         | 41             |
| Posts        | 3        | 3        | 6           | 262         | 44             |
| Authors      | 2        | 2        | 4           | 169         | 42             |
| Publishers   | 2        | 2        | 4           | 146         | 37             |
| Genres       | 2        | 2        | 4           | 153         | 38             |
| Categories   | 2        | 2        | 4           | 155         | 39             |
| Series       | 2        | 2        | 4           | 149         | 37             |
| Challenges   | 2        | 2        | 4           | 149         | 37             |
| Courses      | 2        | 2        | 4           | 154         | 39             |
| Static Pages | 3        | 3        | 6           | 172         | 29             |
| RSS Feeds    | 1        | 1        | 2           | 50          | 25             |
| **TOTAL**    | **29**   | **29**   | **58**      | **2,324**   | **40**         |

### By Page Type

| Page Type    | Count  | % of Total | Avg Lines |
| ------------ | ------ | ---------- | --------- |
| Detail pages | 20     | 34.5%      | 111       |
| List pages   | 20     | 34.5%      | 67        |
| Pagination   | 6      | 10.3%      | 80        |
| RSS feeds    | 6      | 10.3%      | 35        |
| Static pages | 6      | 10.3%      | 57        |
| **TOTAL**    | **58** | **100%**   | **70**    |

---

## Proposed Unified Architecture

### New File Structure

```
src/pages/
├── [lang]/
│   ├── [...route].astro              # Universal dynamic router (MAIN FILE)
│   └── rss.xml.ts                     # Dynamic RSS generator
│
├── index.astro                         # Root redirect (/) → /{defaultLang}
└── rss.xml.ts                          # Global RSS feed

src/config/
├── routes.ts                           # Route segment mappings
├── content-types.ts                    # Content type configurations
└── page-types.ts                       # Page type templates mapping

src/templates/
├── ContentList.astro                   # Generic list template
├── ContentDetail.astro                 # Generic detail template
├── ContentPagination.astro             # Generic pagination template
├── TaxonomyList.astro                  # Taxonomy list template
├── TaxonomyDetail.astro                # Taxonomy detail template
└── StaticPage.astro                    # Static page template

src/utils/routing/
├── parser.ts                           # URL parsing logic
├── matcher.ts                          # Route matching logic
├── loader.ts                           # Content loading logic
└── generator.ts                        # Static path generation
```

### Route Segment Mapping

```typescript
// src/config/routes.ts

export const ROUTE_SEGMENTS: Record<string, Record<Language, string>> = {
  // Content types
  books: { en: "books", es: "libros" },
  tutorials: { en: "tutorials", es: "tutoriales" },
  posts: { en: "posts", es: "publicaciones" },

  // Taxonomies
  authors: { en: "authors", es: "autores" },
  publishers: { en: "publishers", es: "editoriales" },
  genres: { en: "genres", es: "generos" },
  categories: { en: "categories", es: "categorias" },
  series: { en: "series", es: "series" },
  challenges: { en: "challenges", es: "retos" },
  courses: { en: "courses", es: "cursos" },

  // Special segments
  page: { en: "page", es: "pagina" },
  about: { en: "about", es: "acerca-de" },
  feeds: { en: "feeds", es: "feeds" },
};
```

### Content Type Configuration

```typescript
// src/config/content-types.ts

export interface ContentTypeConfig {
  id: string;
  collection: string;
  template: {
    list: string;
    detail: string;
  };
  features: {
    pagination: boolean;
    rss: boolean;
    itemsPerPage?: number;
  };
  seo: {
    type: string; // Schema.org type
    generateItemList: boolean;
  };
}

export const CONTENT_TYPES: Record<string, ContentTypeConfig> = {
  books: {
    id: "books",
    collection: "books",
    template: { list: "ContentList", detail: "BookDetail" },
    features: { pagination: true, rss: true, itemsPerPage: 12 },
    seo: { type: "Book", generateItemList: true },
  },

  tutorials: {
    id: "tutorials",
    collection: "tutorials",
    template: { list: "ContentList", detail: "TutorialDetail" },
    features: { pagination: true, rss: true, itemsPerPage: 12 },
    seo: { type: "Article", generateItemList: true },
  },

  posts: {
    id: "posts",
    collection: "posts",
    template: { list: "ContentList", detail: "PostDetail" },
    features: { pagination: true, rss: false, itemsPerPage: 12 },
    seo: { type: "BlogPosting", generateItemList: true },
  },

  // Taxonomies...
  authors: {
    id: "authors",
    collection: "authors",
    template: { list: "TaxonomyList", detail: "TaxonomyDetail" },
    features: { pagination: false, rss: false },
    seo: { type: "Person", generateItemList: false },
  },

  // ... other taxonomies follow same pattern
};
```

---

## Migration Strategy

### Phase 1: Proof of Concept (Week 1)

**Target**: Books pages only

```
BEFORE (8 files):
✅ /en/books/index.astro
✅ /en/books/[slug].astro
✅ /en/books/page/[page].astro
✅ /en/books/rss.xml.ts
✅ /es/libros/index.astro
✅ /es/libros/[slug].astro
✅ /es/libros/pagina/[page].astro
✅ /es/libros/rss.xml.ts

AFTER (1 file):
✅ /[lang]/[...route].astro (handles all 8 cases)
```

**Success Criteria**:

- All book URLs still work
- Both languages render correctly
- Pagination works
- RSS feeds valid
- SEO metadata preserved
- All tests pass

### Phase 2: Full Migration (Week 2-3)

**Priority Order**:

1. ✅ Books (POC already done)
2. Tutorials (similar to books)
3. Posts (similar to books)
4. Authors (taxonomy pattern)
5. Publishers (taxonomy pattern)
6. Genres (taxonomy pattern)
7. Categories (taxonomy pattern)
8. Series (taxonomy pattern)
9. Challenges (taxonomy pattern)
10. Courses (taxonomy pattern)
11. Static pages (special handling)

**Per Content Type Timeline**: ~2-4 hours each

### Phase 3: Cleanup (Week 4)

1. Delete old files (with backup)
2. Update documentation
3. Final testing
4. Performance optimization

---

## URL Preservation Matrix

### Books

| Old URL                               | New URL (same)                        | Status |
| ------------------------------------- | ------------------------------------- | ------ |
| `/en/books`                           | `/en/books`                           | ✅     |
| `/en/books/page/2`                    | `/en/books/page/2`                    | ✅     |
| `/en/books/the-stand-stephen-king`    | `/en/books/the-stand-stephen-king`    | ✅     |
| `/en/books/rss.xml`                   | `/en/books/rss.xml`                   | ✅     |
| `/es/libros`                          | `/es/libros`                          | ✅     |
| `/es/libros/pagina/2`                 | `/es/libros/pagina/2`                 | ✅     |
| `/es/libros/apocalipsis-stephen-king` | `/es/libros/apocalipsis-stephen-king` | ✅     |
| `/es/libros/rss.xml`                  | `/es/libros/rss.xml`                  | ✅     |

### Authors

| Old URL                    | New URL (same)             | Status |
| -------------------------- | -------------------------- | ------ |
| `/en/authors`              | `/en/authors`              | ✅     |
| `/en/authors/stephen-king` | `/en/authors/stephen-king` | ✅     |
| `/es/autores`              | `/es/autores`              | ✅     |
| `/es/autores/stephen-king` | `/es/autores/stephen-king` | ✅     |

**Result**: ✅ ALL URLs PRESERVED - Zero breaking changes

---

## Duplication Analysis

### Exact Duplication Examples

#### Books List Page (`/books/index.astro`)

**Lines that differ** (5 out of 75 = 93% duplication):

```diff
# Line 8
- import contactEn from "@/content/static/contact/en.json";
+ import contactEs from "@/content/static/contact/es.json";

# Line 13
- const lang = "en";
+ const lang = "es";

# Line 20
- const targetLang = "es";
+ const targetLang = "en";

# Line 25
- const pageDescription = "Book reviews";
+ const pageDescription = "Reseñas de libros";

# Line 62
- <Paginator basePath="/en/books" />
+ <Paginator basePath="/es/libros" />
```

**Everything else**: 100% identical (70 lines)

#### Books Detail Page (`/books/[slug].astro`)

**Lines that differ** (4 out of 250 = 98% duplication):

```diff
# Line 15
- import contactEn from "@/content/static/contact/en.json";
+ import contactEs from "@/content/static/contact/es.json";

# Line 17
- const lang = "en";
+ const lang = "es";

# Line 21
- const targetLang = "es";
+ const targetLang = "en";

# Various SEO strings (could be i18n)
- const ogTitle = "Book Review: ...";
+ const ogTitle = "Reseña del libro: ...";
```

**Everything else**: 100% identical (246 lines)

### Code Smell: Magic Strings

Many hard-coded strings should be in i18n system:

```typescript
// BEFORE (hard-coded)
const pageDescription = "Book reviews";

// AFTER (i18n)
const pageDescription = t(lang, "pages.booksDescription");
```

---

## Breaking Changes

### ✅ NONE

All URLs will be preserved exactly. The routing system will:

1. Parse URL: `/es/libros/apocalipsis-stephen-king`
2. Extract: `lang = "es"`, `route = "libros/apocalipsis-stephen-king"`
3. Map: `"libros"` → `contentType = "books"`
4. Load: Get book with slug `"apocalipsis-stephen-king"` in ES
5. Render: Use book detail template
6. Output: Identical HTML to current version

**Result**: Zero breaking changes. Users won't notice anything different.

---

## Testing Matrix

### Unit Tests Required

```typescript
// src/__tests__/routing/
├── route-segment-mapping.test.ts       // Test ROUTE_SEGMENTS lookup
├── content-type-config.test.ts         // Test CONTENT_TYPES config
├── url-parser.test.ts                  // Test URL parsing logic
├── route-matcher.test.ts               // Test route matching
├── content-loader.test.ts              // Test content loading
└── template-selector.test.ts           // Test template selection

// Expected: ~150 new unit tests
```

### Integration Tests Required

```typescript
// src/__tests__/integration/routing/
├── books-routing.test.ts               // Books list/detail/pagination
├── tutorials-routing.test.ts           // Tutorials list/detail/pagination
├── posts-routing.test.ts               // Posts list/detail/pagination
├── taxonomy-routing.test.ts            // All taxonomy pages
├── static-routing.test.ts              // Static pages
└── rss-routing.test.ts                 // RSS feeds

// Expected: ~80 new integration tests
```

### E2E Tests Required

```typescript
// e2e/routing/
├── navigation.spec.ts                  // Test all navigation
├── language-switch.spec.ts             // Test lang switcher
├── url-preservation.spec.ts            // Test URLs unchanged
└── content-loading.spec.ts             // Test content loads

// Expected: ~30 new E2E tests
```

### Manual Testing Checklist

**Per Content Type** (10 types × 4 checks = 40 tests):

- [ ] List page loads (EN)
- [ ] List page loads (ES)
- [ ] Detail page loads (EN)
- [ ] Detail page loads (ES)
- [ ] Pagination works (if applicable)
- [ ] RSS works (if applicable)
- [ ] Language switcher works
- [ ] SEO metadata correct
- [ ] Performance acceptable
- [ ] No console errors

---

## Risk Assessment

### High Risk Areas

1. **Static Path Generation**

   - Risk: getStaticPaths() becomes very complex
   - Mitigation: Break into smaller generator functions
   - Testing: Verify all paths generated correctly

2. **Build Time**

   - Risk: May increase due to unified generation
   - Mitigation: Add caching, optimize data fetching
   - Testing: Measure before/after with Hyperfine

3. **SEO Impact**

   - Risk: URLs must remain exactly the same
   - Mitigation: Extensive testing, gradual rollout
   - Testing: Compare generated URLs before/after

4. **Type Safety**
   - Risk: Dynamic routing reduces type safety
   - Mitigation: Strong TypeScript types, runtime validation
   - Testing: Comprehensive unit tests

### Medium Risk Areas

1. **Developer Experience**

   - Risk: Team must learn new patterns
   - Mitigation: Comprehensive documentation, examples
   - Testing: Code review, pair programming

2. **Error Handling**

   - Risk: 404s if route matching fails
   - Mitigation: Robust error handling, fallbacks
   - Testing: Test invalid URLs

3. **Performance**
   - Risk: Runtime overhead from route matching
   - Mitigation: Caching, memoization
   - Testing: Lighthouse audits

### Low Risk Areas

1. **Rollback** - Easy to revert if needed (backup branch exists)
2. **User Impact** - Zero visible changes (URLs preserved)
3. **Content** - No content changes required

---

## Performance Benchmarks

### Baseline (Current Architecture)

```bash
# To be measured BEFORE migration
bun run build                 # Build time
hyperfine "bun run build"     # Average build time
du -sh dist/                  # Bundle size
lighthouse <urls>             # Lighthouse scores
```

**Record these metrics**:

- Build time: **\_** seconds
- Bundle size: **\_** MB
- Lighthouse Performance: **\_**
- Time to generate static paths: **\_** seconds

### Target (Unified Architecture)

**Acceptable ranges**:

- Build time: ±10% (slight increase acceptable)
- Bundle size: -5% to +5% (should be similar)
- Lighthouse: Same or better (no degradation)
- Static path generation: ±15% (slight increase acceptable)

**Red flags** (requires optimization):

- Build time increases >25%
- Bundle size increases >10%
- Lighthouse score drops >5 points
- Memory usage spikes

---

## Next Steps

### ✅ Completed

1. ✅ Read Phase 3 documentation (1,131 lines)
2. ✅ Map all current routes (58 files)
3. ✅ Analyze duplication (95%+ confirmed)
4. ✅ Create this route mapping document

### 🔄 In Progress

5. Design route config structure (NEXT)

### 📋 Pending

6. Create POC branch
7. Implement POC for books
8. Test POC thoroughly
9. Document POC findings
10. Get approval to continue full migration

---

## Appendix: File Listings

### Complete EN File List (29 files)

```
src/pages/en/about.astro
src/pages/en/authors/[slug].astro
src/pages/en/authors/index.astro
src/pages/en/books/[slug].astro
src/pages/en/books/index.astro
src/pages/en/books/page/[page].astro
src/pages/en/books/rss.xml.ts
src/pages/en/categories/[slug].astro
src/pages/en/categories/index.astro
src/pages/en/challenges/[slug].astro
src/pages/en/challenges/index.astro
src/pages/en/courses/[slug].astro
src/pages/en/courses/index.astro
src/pages/en/feeds.astro
src/pages/en/genres/[slug].astro
src/pages/en/genres/index.astro
src/pages/en/index.astro
src/pages/en/posts/[slug].astro
src/pages/en/posts/index.astro
src/pages/en/posts/page/[page].astro
src/pages/en/publishers/[slug].astro
src/pages/en/publishers/index.astro
src/pages/en/rss.xml.ts
src/pages/en/series/[slug].astro
src/pages/en/series/index.astro
src/pages/en/tutorials/[slug].astro
src/pages/en/tutorials/index.astro
src/pages/en/tutorials/page/[page].astro
src/pages/en/tutorials/rss.xml.ts
```

### Complete ES File List (29 files)

```
src/pages/es/acerca-de.astro
src/pages/es/autores/[slug].astro
src/pages/es/autores/index.astro
src/pages/es/categorias/[slug].astro
src/pages/es/categorias/index.astro
src/pages/es/cursos/[slug].astro
src/pages/es/cursos/index.astro
src/pages/es/editoriales/[slug].astro
src/pages/es/editoriales/index.astro
src/pages/es/feeds.astro
src/pages/es/generos/[slug].astro
src/pages/es/generos/index.astro
src/pages/es/index.astro
src/pages/es/libros/[slug].astro
src/pages/es/libros/index.astro
src/pages/es/libros/pagina/[page].astro
src/pages/es/libros/rss.xml.ts
src/pages/es/publicaciones/[slug].astro
src/pages/es/publicaciones/index.astro
src/pages/es/publicaciones/pagina/[page].astro
src/pages/es/retos/[slug].astro
src/pages/es/retos/index.astro
src/pages/es/rss.xml.ts
src/pages/es/series/[slug].astro
src/pages/es/series/index.astro
src/pages/es/tutoriales/[slug].astro
src/pages/es/tutoriales/index.astro
src/pages/es/tutoriales/pagina/[page].astro
src/pages/es/tutoriales/rss.xml.ts
```

---

**Document Status**: ✅ COMPLETE  
**Next Action**: Design route config structure  
**Estimated Time**: 2-3 hours
