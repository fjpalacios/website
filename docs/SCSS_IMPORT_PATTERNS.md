# SCSS Import Patterns in Astro Components

## Problem Statement

Astro components can import SCSS in two ways:

1. **Frontmatter import**: `import "@styles/components/foo.scss"`
2. **Style tag with @use**: `<style lang="scss">@use "../styles/components/foo";</style>`

Both patterns work, but they behave differently when SCSS files contain `:global()` selectors.

## The Rule

### MUST: Use `<style>` tags for SCSS with `:global()` selectors

**Reason**: Astro's scoped styling system only processes `:global()` selectors when they're inside `<style>` tags. Frontmatter imports bypass this processing, causing global styles to break.

**Example of the bug**: Search modal (commit `bfc3127`) had broken styles (missing backdrop blur, colors, padding) because it used frontmatter import for SCSS with `:global()`.

### SHOULD: Use frontmatter imports for component-scoped SCSS

**Reason**: Cleaner code organization, consistent with other asset imports.

## Pattern Decision Tree

```
Does your SCSS file contain :global() selectors?
│
├─ YES → Use <style> tag with @use
│   Example: Search.astro, Footer.astro, LanguageSwitcher.astro
│
└─ NO → Use frontmatter import
    Example: Rating.astro, Title.astro, OptimizedImage.astro
```

## Examples

### ✅ CORRECT: SCSS with `:global()` → `<style>` tag

```astro
---
// Footer.astro
import { getFooterItems } from "@config/navigation";
---

<footer class="footer">
  <!-- ... -->
</footer>

<style lang="scss">
  @use "../styles/components/footer";
</style>
```

```scss
// footer.scss
.footer {
  background: var(--primary);

  // This :global() NEEDS to be in a <style> tag to work
  :global(body.light) & {
    background: #fbfef9;
  }
}
```

### ❌ INCORRECT: SCSS with `:global()` → frontmatter import

```astro
---
// Footer.astro (BROKEN)
import { getFooterItems } from "@config/navigation";
import "@styles/components/footer.scss"; // ❌ Won't process :global()
---

<footer class="footer">
  <!-- ... -->
</footer>
```

Result: Light theme styles won't apply because `:global()` wasn't processed.

### ✅ CORRECT: Component-scoped SCSS → frontmatter import

```astro
---
// Rating.astro
import "@styles/components/rating.scss";
---

<div class="rating">
  <!-- ... -->
</div>
```

```scss
// rating.scss (no :global() selectors)
.rating {
  display: flex;
  gap: 0.25rem;

  &__star {
    color: var(--accent);
  }
}
```

## Automated Testing

The architecture test `scss-import-patterns.test.ts` validates these patterns:

```bash
bun test src/__tests__/architecture/scss-import-patterns.test.ts
```

**What it checks**:

1. ✅ SCSS files with `:global()` use `<style>` tags
2. ✅ Each component has exactly one import method (no duplicates)
3. 📊 Documents all components with `:global()` selectors

**When it fails**:

- Provides clear error message with correct pattern
- Blocks CI/CD until fixed

## Current State (2026-01-03)

Components with `:global()` selectors (all using `<style>` tags ✅):

| Component        | SCSS File              | Pattern    |
| ---------------- | ---------------------- | ---------- |
| Search.astro     | search.scss            | ✅ Correct |
| Footer.astro     | footer.scss            | ✅ Correct |
| LanguageSwitcher | language-switcher.scss | ✅ Correct |

Components with component-scoped SCSS (all using frontmatter imports ✅):

| Component            | SCSS File            |
| -------------------- | -------------------- |
| Rating.astro         | rating.scss          |
| Title.astro          | title.scss           |
| OptimizedImage.astro | optimized-image.scss |
| LatestPosts.astro    | latest-posts.scss    |

## Migration Guide

If you need to convert from one pattern to another:

### Frontmatter → `<style>` tag

**Before:**

```astro
---
import "@styles/components/foo.scss";
---

<div class="foo"></div>
```

**After:**

```astro
---
// No import
---

<div class="foo"></div>

<style lang="scss">
  @use "../styles/components/foo";
</style>
```

### `<style>` tag → Frontmatter

**Before:**

```astro
---
// No import
---

<div class="foo"></div>

<style lang="scss">
  @use "../styles/components/foo";
</style>
```

**After:**

```astro
---
import "@styles/components/foo.scss";
---

<div class="foo"></div>
```

**⚠️ IMPORTANT**: Only do this if `foo.scss` has **NO** `:global()` selectors!

## Related Issues

- Commit `bfc3127`: Fixed search modal broken styles
- Issue #6: Extract embedded styles to SCSS modules (MEDIUM priority)
- Commit `9c81742`: Part 2/2 of style extraction

## References

- [Astro Scoped Styles](https://docs.astro.build/en/guides/styling/#scoped-styles)
- [Astro Global Styles](https://docs.astro.build/en/guides/styling/#global-styles)
- BEM Methodology for class naming
