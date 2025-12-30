# Color Refactoring Plan

**Date:** 2025-12-30  
**Status:** Proposed  
**Priority:** High (Maintainability & Consistency)

## Problem

Currently, the project has **41+ hardcoded color values** scattered across SCSS files, creating:

- ❌ Inconsistency between dark/light themes
- ❌ Difficulty maintaining color changes
- ❌ Mix of variables and hardcoded values
- ❌ No single source of truth for colors

## Current State

### Files with Hardcoded Colors:

- `src/styles/components/author-info.scss` (3 colors)
- `src/styles/components/code-blocks.scss` (10+ colors)
- `src/styles/components/search.scss` (20+ colors)
- `src/styles/components/skill-bar.scss` (1 color)
- `src/styles/pages/feeds.scss` (2 colors)
- `src/styles/_mixins.scss` (6+ colors)

### Examples of Hardcoded Colors:

```scss
// ❌ BAD - Hardcoded colors
color: #d63384;
background: #fbfef9;
border: solid #ddd 1px;
box-shadow: 2px 2px 10px #333;
color: rgba(255, 255, 255, 0.2);
```

## Solution: Semantic Color Variables

### Proposed New Variables

Add these to `src/styles/_variables.scss`:

```scss
// ========================================
// SEMANTIC COLOR VARIABLES
// ========================================

// Border colors
$border-light: var(--border-light);
$border-medium: var(--border-medium);
$border-dark: var(--border-dark);

// Shadow colors
$shadow-light: var(--shadow-light);
$shadow-medium: var(--shadow-medium);
$shadow-dark: var(--shadow-dark);

// Code syntax highlighting (fixed for both themes)
$code-syntax-pink: var(--code-syntax-pink);
$code-syntax-line-numbers: var(--code-syntax-line-numbers);
$code-syntax-success: var(--code-syntax-success);
$code-syntax-white: var(--code-syntax-white);

// Inline code (theme-aware)
$inline-code-bg-light: var(--inline-code-bg-light);
$inline-code-text-light: var(--inline-code-text-light);
$inline-code-border-light: var(--inline-code-border-light);

// Overlay/backdrop colors
$overlay-light: var(--overlay-light);
$overlay-dark: var(--overlay-dark);

// Neutral grays (theme-independent)
$gray-lightest: var(--gray-lightest);
$gray-lighter: var(--gray-lighter);
$gray-light: var(--gray-light);
$gray-medium: var(--gray-medium);
$gray-dark: var(--gray-dark);
$gray-darker: var(--gray-darker);
```

### Theme-Specific Values

```scss
// Dark theme
html {
  // Borders
  --border-light: rgba(255, 255, 255, 0.1);
  --border-medium: rgba(255, 255, 255, 0.15);
  --border-dark: rgba(255, 255, 255, 0.2);

  // Shadows
  --shadow-light: rgba(0, 0, 0, 0.1);
  --shadow-medium: rgba(0, 0, 0, 0.2);
  --shadow-dark: rgba(0, 0, 0, 0.3);

  // Code syntax (fixed - doesn't change between themes)
  --code-syntax-pink: #ff6ac1;
  --code-syntax-line-numbers: #8b95a8;
  --code-syntax-success: #4ade80;
  --code-syntax-white: #ffffff;

  // Inline code (dark theme)
  --inline-code-bg-dark: var(--primary); // #192734
  --inline-code-text-dark: var(--code); // #8be9fd

  // Overlays
  --overlay-light: rgba(0, 0, 0, 0.4);
  --overlay-dark: rgba(0, 0, 0, 0.6);

  // Neutral grays
  --gray-lightest: #eee;
  --gray-lighter: #ddd;
  --gray-light: #9a9a9a;
  --gray-medium: #7a7a7a;
  --gray-dark: #636363;
  --gray-darker: #333;

  &.light {
    // Borders
    --border-light: rgba(0, 0, 0, 0.08);
    --border-medium: rgba(0, 0, 0, 0.12);
    --border-dark: rgba(0, 0, 0, 0.15);

    // Shadows
    --shadow-light: rgba(0, 0, 0, 0.05);
    --shadow-medium: rgba(0, 0, 0, 0.1);
    --shadow-dark: rgba(0, 0, 0, 0.15);

    // Code syntax (same as dark)
    --code-syntax-pink: #ff6ac1;
    --code-syntax-line-numbers: #8b95a8;
    --code-syntax-success: #16a34a;
    --code-syntax-white: #ffffff;

    // Inline code (light theme)
    --inline-code-bg-light: rgba(0, 86, 179, 0.08);
    --inline-code-text-light: #d63384;
    --inline-code-border-light: rgba(0, 86, 179, 0.12);

    // Overlays
    --overlay-light: rgba(0, 0, 0, 0.2);
    --overlay-dark: rgba(0, 0, 0, 0.4);

    // Neutral grays (same or adjusted)
    --gray-lightest: #f8f9fa;
    --gray-lighter: #e9ecef;
    --gray-light: #999999;
    --gray-medium: #7a7a7a;
    --gray-dark: #6a6a6a;
    --gray-darker: #284b63;
  }
}
```

## Migration Strategy

### Phase 1: Add New Variables ✅

Add all semantic variables to `_variables.scss`

### Phase 2: Replace Hardcoded Colors (Priority Order)

1. **Code blocks** (`code-blocks.scss`)

   - Replace `#ff6ac1`, `#8b95a8`, `#4ade80`, etc.
   - Use `$code-syntax-*` variables

2. **Search modal** (`search.scss`)

   - Replace all hardcoded theme colors
   - Use existing theme variables + new semantic ones

3. **Mixins** (`_mixins.scss`)

   - Replace grays (`#9a9a9a`, `#7a7a7a`, `#999999`)
   - Use `$gray-*` variables

4. **Components**
   - `author-info.scss`: Replace `#ddd`, `#fff`, `#333`
   - `skill-bar.scss`: Replace `#eee`
   - `feeds.scss`: Replace `#d0d0d0`, `#ffffff`

### Phase 3: Verification

- Visual regression testing (both themes)
- Accessibility contrast checks
- Code review for any missed colors

## Benefits

- ✅ Single source of truth for all colors
- ✅ Easy theme switching and customization
- ✅ Consistent color usage across components
- ✅ Better maintainability
- ✅ Easier to add new themes in future

## Files to Modify

1. `src/styles/_variables.scss` - Add new variables
2. `src/styles/components/code-blocks.scss` - Replace ~10 colors
3. `src/styles/components/search.scss` - Replace ~20 colors
4. `src/styles/_mixins.scss` - Replace ~6 colors
5. `src/styles/components/author-info.scss` - Replace 3 colors
6. `src/styles/components/skill-bar.scss` - Replace 1 color
7. `src/styles/pages/feeds.scss` - Replace 2 colors

## Timeline

- **Estimated time:** 2-3 hours
- **Testing time:** 1 hour
- **Total:** 3-4 hours

## Risk Assessment

- **Risk:** Low (mostly visual changes)
- **Testing:** Extensive visual testing needed
- **Rollback:** Easy (git revert)

---

**Next Step:** Review and approve this plan before implementing.
