# Bug Fix: Genres Language Switcher Not Working

**Date**: 2026-01-02  
**Status**: ✅ Fixed  
**Affected Feature**: Language switching for taxonomy detail pages (specifically Genres)

## Problem

Language switcher buttons on genre detail pages appeared **disabled** despite having valid i18n data in both languages.

**Example**:

- `/es/generos/ficcion/` - Button showed as disabled
- `/en/genres/fiction/` - Button showed as disabled

Both pages had correct i18n values:

```json
// fiction.json (EN)
{ "genre_slug": "fiction", "i18n": "ficcion" }

// ficcion.json (ES)
{ "genre_slug": "ficcion", "i18n": "fiction" }
```

## Root Cause

**File**: `src/utils/taxonomyPages.ts`  
**Line**: 177

The `generateTaxonomyDetailPaths()` function was checking if a translation exists by looking for the **same slug** in the target language:

```typescript
// ❌ Wrong logic
const hasTargetContent = targetTaxonomySlugs.has(taxonomySlug);
```

This doesn't work for taxonomies because:

- Taxonomies use **different slugs** per language (`fiction` vs `ficcion`)
- The `i18n` field points to the **translated slug**, not the same slug
- Code was asking "does `fiction` exist in Spanish?" when it should ask "does `ficcion` exist in Spanish?"

## Solution

Changed the logic to check using the **i18n field** value instead:

```typescript
// ✅ Correct logic
const translationSlug = taxonomyItem.data.i18n;
const hasTargetContent = translationSlug
  ? targetTaxonomySlugs.has(translationSlug)
  : targetTaxonomySlugs.has(taxonomySlug);
```

Now it asks "does the slug referenced in i18n field exist in target language?"

### Code Changes

**Modified File**: `src/utils/taxonomyPages.ts`

```diff
  for (const taxonomyItem of taxonomyItems) {
    const taxonomySlug = taxonomyItem.data[config.slugField];

-   // Check if this taxonomy item exists in the target language
-   const hasTargetContent = targetTaxonomySlugs.has(taxonomySlug);
+   // Check if this taxonomy item exists in the target language
+   // If item has i18n field, use it to find the translated slug
+   // Otherwise, fall back to checking if the same slug exists in target language
+   const translationSlug = taxonomyItem.data.i18n;
+   const hasTargetContent = translationSlug
+     ? targetTaxonomySlugs.has(translationSlug)
+     : targetTaxonomySlugs.has(taxonomySlug);
```

## Impact

### Fixed

- ✅ Genres language switcher now works correctly for all 6 translated pairs:
  - `fiction` ↔ `ficcion`
  - `horror` ↔ `terror`
  - `crime` ↔ `crimen`
  - `fantasy` ↔ `fantastico`
  - `thriller` ↔ `suspense`
  - `mystery` ↔ `intriga`

### Benefit for Future Implementations

This fix also applies to **any taxonomy** that uses the `i18n` field:

- Categories (when implemented)
- Challenges (when implemented)
- Authors (if implemented)
- Series (if implemented)
- Courses (if implemented)

## Verification

Build output shows language switcher buttons are now enabled:

**ES Page** (`/es/generos/ficcion/`):

```html
<button
  type="button"
  class="language-switcher"
  data-lang-url="/en/genres/fiction"
  aria-label="Cambia a Inglés"
></button>
```

**EN Page** (`/en/genres/fiction/`):

```html
<button
  type="button"
  class="language-switcher"
  data-lang-url="/es/generos/ficcion"
  aria-label="Switch to Spanish language"
></button>
```

No `disabled` attribute present on either page. ✅

## Related Files

- `src/utils/taxonomyPages.ts` - Contains the fix
- `src/pages-templates/genres/GenresDetailPage.astro` - Passes i18n to Layout
- `src/utils/translation-availability.ts` - Checks hasTargetContent flag
- `src/components/LanguageSwitcher.astro` - Renders the button
- `src/utils/routeGenerators/taxonomy.ts` - Calls generateTaxonomyDetailPaths

## Next Steps

Following the plan from `docs/i18n-field-analysis.md`:

1. ✅ **DONE**: Fix Genres language switching
2. **TODO**: Implement Categories language switching (6 pairs ready)
3. **TODO**: Implement Challenges language switching (1 pair ready)
4. **TODO**: Investigate Authors mystery (invalid i18n format but reportedly works)
5. **TODO**: Remove i18n field from Publishers (no content, not needed)
