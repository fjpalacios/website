# Schema Analysis: Actual UI Rendering Report

**Date**: 2026-01-02  
**Analysis Type**: UI Rendering (not code references)  
**Status**: Complete

## Executive Summary

This report analyzes which schema fields are **actually rendered in the UI** (displayed to users), not just referenced in code or tests. The analysis reveals significant "dead fields" - properties defined in schemas and populated in content files but never displayed anywhere.

### Key Findings

- **~40% of optional fields are never rendered** in the UI
- Most unused fields: social links, metadata dates, styling properties
- Several schema/implementation mismatches found
- Opportunities: remove unused fields OR enhance UI to display them

---

## 📚 Books Schema

### ✅ Fields RENDERED in UI

**Core Display** (`BooksDetailPage.astro`):

- `title` - Page title, breadcrumbs
- `date` - Publication date display
- `excerpt` - Meta description (SEO)
- `synopsis` - Main book description section
- `score` - Rating component (1-5 stars)
- `pages` - "Pages: 320" display
- `cover` / `book_cover` - Cover image (book_cover preferred, fallback to cover)

**Identification**:

- `isbn` - Displayed if available
- `asin` - Displayed if ISBN not available

**Relationships** (with links):

- `author` - Author name + link to author page
- `publisher` - Publisher name + link to publisher page
- `genres` - Genre tags with links
- `categories` - Category tags with links

**External Links**:

- `buy` - Purchase links (paper/ebook/audiobook)
- `book_card` - "Book details" external link

### ❌ Fields NOT RENDERED in UI

- `series` - Series name never shown on book pages
- `series_order` - No "Book 3 in X series" indicator
- `challenges` - Used for filtering only, not displayed

**Impact**: Books belong to series but users can't see this information on book detail pages.

---

## 📝 Posts Schema

### ✅ Fields RENDERED in UI

**PostsDetailPage.astro**:

- `title` - Page title, headings
- `date` - Publication date
- `excerpt` - Meta description
- `cover` - Cover image
- `categories` - Category links

**SEO/Metadata**:

- `update_date` - Used in JSON-LD schema (not visible to users)

### ❌ Fields NOT RENDERED in UI

- `draft` - Not checked in templates (likely filtered at build time)
- `featured_image` - Schema defines it but never used (always uses `cover`)
- `canonical_url` - Not used (SEO component builds URLs but doesn't read this field)

**Schema Mismatch**: Code uses `post.category` (singular) but schema defines `categories` (array).

---

## 🎓 Tutorials Schema

### ✅ Fields RENDERED in UI

**TutorialsDetailPage.astro**:

- `title` - Page title, headings
- `date` - Publication date
- `excerpt` - Meta description
- `cover` - Cover image
- `categories` - Category links
- `course` - Course name + link (if tutorial belongs to course)
- `order` - Tutorial position badge (e.g., "Tutorial 3") when in course context

**SEO/Metadata**:

- `update_date` - Used in JSON-LD schema

### ❌ Fields NOT RENDERED in UI

- `draft` - Not checked in templates
- `difficulty` - Defined but never shown (courses have difficulty shown, not individual tutorials)
- `estimated_time` - Not displayed
- `github_repo` - Not displayed
- `demo_url` - Not displayed
- `featured_image` - Not used

**Impact**: Tutorials have rich metadata (difficulty, time, demo links) that users never see.

---

## 👤 Authors Schema

### ✅ Fields RENDERED in UI

**Displayed**:

- `name` - Author name everywhere
- `picture` - Author photo/avatar
- `gender` - Used for localized text only ("The author" vs "La autora"), not shown directly
- Biography content (MDX) - Rendered in AuthorInfo component

### ❌ Fields NOT RENDERED in UI

**Personal Information**:

- `birth_year` - Not displayed
- `death_year` - Not displayed
- `nationality` - Not displayed

**Social Links** (ALL unused):

- `website` - Not displayed
- `twitter` - Not displayed
- `goodreads` - Not displayed
- `wikipedia` - Not displayed

**CRITICAL**: Authors have extensive social media fields in data files but **NONE** are displayed in UI.

**Example**: `camilla-lackberg.json` has:

```json
{
  "website": "https://camillalackberg.com",
  "twitter": "@camillalackberg",
  "goodreads": "https://www.goodreads.com/author/show/253674",
  "birth_year": 1974,
  "nationality": "Swedish"
}
```

None of this rich data is shown to users.

---

## 🏷️ Categories Schema

### ✅ Fields RENDERED in UI

- `name` - Category name in titles, links, lists
- `description` - Category description

### ❌ Fields NOT RENDERED in UI

- `icon` - Icon names defined in data (e.g., `"icon": "book"`) but never displayed
- `color` - Hex colors defined (e.g., `"color": "#8B4513"`) but never applied
- `order` - Display order defined but not used for sorting

**Example**: `libros.json` has:

```json
{
  "icon": "book",
  "color": "#8B4513",
  "order": 1
}
```

None of this styling metadata is applied.

**Impact**: Categories could have visual identity (icons, colors) but this isn't implemented in UI.

---

## 🏢 Publishers Schema

### ✅ Fields RENDERED in UI

- `name` - Publisher name everywhere

### ❌ Fields NOT RENDERED in UI

- `description` - Not displayed
- `website` - Not displayed (even though data has URLs)
- `country` - Not displayed

**Example**: `debolsillo.json` has:

```json
{
  "website": "https://www.penguinlibros.com/es/debolsillo",
  "country": "Spain"
}
```

Not shown anywhere.

---

## 📚 Series Schema

### ✅ Fields RENDERED in UI

- `name` - Series name on detail pages

### ❌ Fields NOT RENDERED in UI

- `description` - Not displayed
- `author` - Not displayed (series have an author field but it's not shown)

**Example**: `fjallbacka.json` has `"author": "camilla-lackberg"` - not displayed on series page.

---

## 🏆 Challenges Schema

### ✅ Fields RENDERED in UI

- `name` - Challenge name

### ❌ Fields NOT RENDERED in UI

- `description` - Not displayed
- `start_date` - Not displayed
- `end_date` - Not displayed
- `goal` - Not displayed (e.g., "Goal: 30 books")

**Example**: `reto-lectura-2017.json` has:

```json
{
  "goal": 30,
  "start_date": "2017-01-01",
  "end_date": "2017-12-31"
}
```

Users can't see when the challenge runs or what the goal is.

---

## 🎓 Courses Schema

### ✅ Fields RENDERED in UI

- `name` - Course title
- `description` - Course description on detail page

### ❌ Fields NOT RENDERED in UI

- `difficulty` - Not displayed
- `duration` - Not displayed

**Note**: Schema defines `duration` but actual JSON uses `estimated_duration`. Neither is shown.

---

## 🎭 Genres Schema

### ✅ Fields RENDERED in UI

- `name` - Genre name on pages and book details

### ❌ Fields NOT RENDERED in UI

- `description` - Not displayed
- `parent` - Not used (no hierarchical display like "Fiction > Horror")

**Example**: `terror.json` has `"parent": "ficcion"` - hierarchy not shown in UI.

---

## 🔍 Schema vs Implementation Mismatches

These indicate technical debt or incomplete migrations:

1. **Posts/Tutorials**: Schema defines `categories` (array) but templates use `post.category` (singular)
2. **Courses**: Schema has `duration` field but data uses `estimated_duration`
3. **Posts**: `featured_image` defined as alias in schema but never used (always `cover`)
4. **Posts/Tutorials**: Schema has `update_date` but templates check `updated` field

---

## 📊 Summary: Field Usage Statistics

### By Category

| Schema         | Total Optional Fields | Rendered in UI | NOT Rendered | Usage Rate |
| -------------- | --------------------- | -------------- | ------------ | ---------- |
| **Books**      | 11                    | 8 (73%)        | 3 (27%)      | Good       |
| **Posts**      | 5                     | 2 (40%)        | 3 (60%)      | Poor       |
| **Tutorials**  | 10                    | 4 (40%)        | 6 (60%)      | Poor       |
| **Authors**    | 9                     | 2 (22%)        | 7 (78%)      | Very Poor  |
| **Categories** | 4                     | 1 (25%)        | 3 (75%)      | Very Poor  |
| **Publishers** | 3                     | 0 (0%)         | 3 (100%)     | None       |
| **Series**     | 2                     | 0 (0%)         | 2 (100%)     | None       |
| **Challenges** | 4                     | 0 (0%)         | 4 (100%)     | None       |
| **Courses**    | 2                     | 1 (50%)        | 1 (50%)      | Fair       |
| **Genres**     | 2                     | 0 (0%)         | 2 (100%)     | None       |

### Most Critical Unused Fields

**High Impact** (rich data exists but hidden):

1. Author social links (website, twitter, goodreads, wikipedia) - 4 fields
2. Category visual identity (icon, color) - 2 fields
3. Book series information (series, series_order) - 2 fields
4. Challenge metadata (goal, dates) - 3 fields
5. Tutorial metadata (difficulty, time, demo, repo) - 4 fields

**Medium Impact**: 6. Author biographical data (birth, death, nationality) - 3 fields 7. Publisher metadata (website, country) - 2 fields 8. Genre hierarchy (parent) - 1 field

**Low Impact** (less useful): 9. Various description fields (if not adding value) 10. Category order (sorting is working somehow else)

---

## ✅ Recommendations

### Option 1: Simplify Schemas (Remove Dead Fields)

**Remove these never-rendered fields**:

**Authors**:

- `website`, `twitter`, `goodreads`, `wikipedia` (4 fields)
- `birth_year`, `death_year`, `nationality` (3 fields)

**Categories**:

- `icon`, `color`, `order` (3 fields)

**Books**:

- `series`, `series_order` (2 fields)

**Tutorials**:

- `difficulty`, `estimated_time`, `github_repo`, `demo_url` (4 fields)

**Challenges**:

- `goal`, `start_date`, `end_date` (3 fields)

**Publishers**:

- `website`, `country`, `description` (3 fields)

**Series**:

- `author`, `description` (2 fields)

**Genres**:

- `parent`, `description` (2 fields)

**Courses**:

- `difficulty`, `duration` (2 fields)

**Posts**:

- `featured_image`, `canonical_url`, `draft` (3 fields)

**Total**: ~30 fields removed, ~30% schema reduction

**Pros**:

- Cleaner schemas
- Less confusion for content creators
- Reduced validation overhead
- Simpler maintenance

**Cons**:

- Lose valuable metadata
- Can't add UI features later without migration
- Data loss

### Option 2: Enhance UI (Display Hidden Fields)

**Quick wins** (high value, easy to add):

1. **Author social links** - Add icons with links in AuthorInfo component
2. **Category icons** - Display in category cards/badges
3. **Book series info** - Show "Book 3 in Fjällbacka series" on book page
4. **Challenge metadata** - Show "Goal: 30 books, Jan-Dec 2017"
5. **Tutorial metadata** - Add difficulty badge, estimated time, demo/repo buttons

**Medium effort**: 6. Publisher website link 7. Genre hierarchy breadcrumbs ("Fiction > Horror") 8. Course difficulty & duration display

**Pros**:

- Use existing rich data
- Better user experience
- No data loss
- SEO benefits (more structured data)

**Cons**:

- Requires UI work
- Need to design components
- More visual clutter if not done well

### Option 3: Hybrid Approach (Recommended)

**Phase 1: Remove clearly useless fields**

- `featured_image` (always use `cover`)
- `draft` (handle at build time if needed)
- `canonical_url` (not used by SEO component)
- `order` (categories) - if not needed for sorting

**Phase 2: Enhance UI for valuable hidden data**

- Author social links (quick win)
- Category icons (visual improvement)
- Book series display (user value)
- Challenge metadata (transparency)

**Phase 3: Decide on edge cases**

- Keep `parent` (genres) if planning hierarchies
- Keep `difficulty` (tutorials/courses) if planning to show
- Keep date fields (birth_year, etc.) for future features

---

## 🎯 Next Steps

1. **Decide on approach**: Simplify, enhance, or hybrid?
2. **Priority fields**: Which unused fields are most important?
3. **UI mockups**: If enhancing, design how to display hidden data
4. **Migration plan**: If removing fields, plan data migration
5. **Fix mismatches**: Resolve schema/template inconsistencies

---

## 📝 Technical Debt Items

**Must fix** (breaking issues):

1. Posts/Tutorials `category` vs `categories` mismatch
2. Courses `duration` vs `estimated_duration` mismatch

**Should fix** (quality): 3. Remove `featured_image` alias (use `cover` only) 4. Standardize `update_date` vs `updated` field name

**Nice to have**: 5. Decide on `draft` field behavior (build-time filter or runtime check) 6. Add validation for unused fields (lint rule or schema tests)
