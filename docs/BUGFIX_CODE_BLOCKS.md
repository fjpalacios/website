# Code Blocks Critical Bug Fix

**Date:** 2026-01-03  
**Severity:** CRITICAL  
**Status:** ✅ RESOLVED  
**Commit:** `e02e06f`  
**Files Modified:** 2  
**Tests Added:** 12 E2E tests

---

## Problem Description

### Symptoms

Code blocks on tutorial pages were rendering without their toolbar (language label + copy button) in the static build. The toolbar was visible in development mode but disappeared in production (`astro preview`).

**Affected Pages:**

- All tutorial detail pages (`/es/tutoriales/*`, `/en/tutorials/*`)
- Any page with syntax-highlighted code blocks

**Impact:**

- **Severity:** CRITICAL - Major UX degradation
- **Scope:** 100% of code blocks site-wide
- **User Experience:** No language identification, no copy functionality
- **Accessibility:** Reduced usability for screen reader users

---

## Root Cause Analysis

### Technical Details

**Problem Location:** `src/layouts/Layout.astro` lines 177-282

The code block setup consisted of two `<script>` tags:

```html
<!-- BEFORE: Broken code -->
<script is:inline define:vars={{ /* config */ }}>
  window.__CODE_BLOCK_I18N__ = { copyText, copiedText };
  window.__CODE_BLOCK_TIMINGS__ = { copyFeedbackMs };
</script>

<!-- Script 2: Setup code blocks (NOT WORKING) -->
<script is:inline>
  (function () {
    function setupCodeBlocks() {
      // Create toolbar, language label, copy button...
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setupCodeBlocks);
    } else {
      setupCodeBlocks();
    }
  })();
</script>
```

### Why It Failed

1. **Script 1 with `is:inline` + `define:vars`:**

   - Astro automatically wraps this in an IIFE: `(function() { ... })();`
   - Variables `copyText`, `copiedText`, `copyFeedbackMs` became local scoped
   - Assignment to `window.__CODE_BLOCK_I18N__` referenced undefined variables
   - Result: Global variables not set correctly

2. **Script 2 with `is:inline`:**
   - The `is:inline` directive tells Astro NOT to process the script
   - In Astro 5, unprocessed inline scripts with complex IIFEs don't execute reliably in static builds
   - The setupCodeBlocks() function never ran
   - Result: No toolbars rendered

### Discovery Process

1. **Initial Report:** User noticed missing toolbar in production
2. **Verification:** Created debug E2E test - confirmed toolbar absent
3. **Hypothesis:** Suspected CSS issue - disproved (styles present)
4. **Investigation:** Added console.logs - never executed (script not running)
5. **Root Cause:** Identified `is:inline` preventing script execution
6. **Solution:** Removed `is:inline` from second script, fixed first script

---

## Solution Implemented

### Changes Made

**File 1: `src/layouts/Layout.astro` (lines 177-186)**

```html
<!-- BEFORE -->
<script is:inline define:vars={{
  copyText: t(lang, "codeBlock.copy"),
  copiedText: t(lang, "codeBlock.copied"),
  copyFeedbackMs: TIMINGS.CODE_COPY_FEEDBACK_MS,
}}>
  window.__CODE_BLOCK_I18N__ = { copyText, copiedText };
  window.__CODE_BLOCK_TIMINGS__ = { copyFeedbackMs };
</script>

<!-- AFTER -->
<script is:inline set:html={`
  window.__CODE_BLOCK_I18N__ = {
    copyText: ${JSON.stringify(t(lang, "codeBlock.copy"))},
    copiedText: ${JSON.stringify(t(lang, "codeBlock.copied"))}
  };
  window.__CODE_BLOCK_TIMINGS__ = {
    copyFeedbackMs: ${TIMINGS.CODE_COPY_FEEDBACK_MS}
  };
`}></script>
```

**Changes:**

- Replaced `define:vars` with `set:html` + `JSON.stringify()`
- Avoids automatic IIFE wrapping
- Variables directly injected into global scope

**File 2: `src/layouts/Layout.astro` (line 187)**

```html
<!-- BEFORE -->
<script is:inline>

<!-- AFTER -->
<script>
```

**Changes:**

- Removed `is:inline` directive
- Allows Astro to process the script correctly
- Ensures execution in both dev and production builds

---

## Testing & Verification

### E2E Test Suite Created

**File:** `e2e/code-blocks.spec.ts`  
**Tests:** 12 comprehensive tests  
**Coverage:**

- ✅ Syntax highlighting rendering
- ✅ Toolbar presence and visibility
- ✅ Language label display
- ✅ Copy button functionality
- ✅ Clipboard integration
- ✅ Line numbers rendering
- ✅ Multiple code blocks per page
- ✅ Astro page transitions compatibility
- ✅ Z-index stacking
- ✅ Accessibility (ARIA labels, keyboard focus)
- ✅ Screen reader announcements
- ✅ Theme switching support

### Test Results

```
Unit Tests: 1168/1168 passing ✅
E2E Tests (Code Blocks): 12/12 passing ✅
Build: Successful ✅
```

### Manual Verification

**Before Fix:**

- ❌ No toolbar visible in production
- ❌ No language labels
- ❌ No copy buttons
- ❌ Poor UX for developers reading tutorials

**After Fix:**

- ✅ Toolbar renders correctly
- ✅ Language labels display properly (shell, git, html, etc.)
- ✅ Copy buttons functional
- ✅ Clipboard API works as expected
- ✅ Visual feedback on copy (icon change + "copied" class)
- ✅ Consistent across all themes (dark/light)

---

## Prevention Measures

### 1. E2E Test Coverage

Added comprehensive test suite to prevent regression:

- Tests run on every commit via CI
- Covers all critical toolbar functionality
- Validates both visual and functional aspects

### 2. Documentation

- This bug report documents the issue for future reference
- Code comments added explaining the `is:inline` removal
- Pattern documented for other inline scripts

### 3. Best Practices Established

- **Avoid `is:inline` for complex scripts** - Let Astro process them
- **Use `set:html` for variable injection** - Avoid `define:vars` with `is:inline`
- **Always test static builds** - Don't rely solely on dev mode
- **E2E tests for critical UI** - Especially for JavaScript-dependent features

---

## Lessons Learned

### Key Takeaways

1. **Astro 5 Behavior Change:** `is:inline` has different behavior in Astro 5 vs earlier versions
2. **Dev vs Production Parity:** Always test in production-like environment (astro preview)
3. **Script Processing:** Understanding when Astro processes vs ignores scripts is critical
4. **Test Coverage:** E2E tests caught what unit tests missed
5. **User Reports:** User feedback revealed production-only bug

### Similar Issues to Watch

**Other scripts using `is:inline`:**

- Theme switcher script (verified working)
- Search initialization (verified working)
- Analytics scripts (third-party, different pattern)

**Action:** Review all `is:inline` usage periodically

---

## Timeline

- **11:47 UTC** - User reported missing code block headers
- **11:50 UTC** - Created debug test, confirmed issue
- **11:52 UTC** - Investigated HTML/CSS, ruled out styling issue
- **11:55 UTC** - Added console.logs, discovered script not executing
- **11:57 UTC** - Identified root cause: `is:inline` directive
- **11:58 UTC** - Implemented fix
- **12:00 UTC** - Tests passing (12/12 E2E + 1168/1168 unit)
- **12:02 UTC** - Committed fix with comprehensive test suite

**Total Resolution Time:** ~15 minutes (investigation + fix)  
**Total Task Time:** ~2 hours (including test suite creation + documentation)

---

## Related Files

**Modified:**

- `src/layouts/Layout.astro` - Fixed script execution

**Created:**

- `e2e/code-blocks.spec.ts` - Comprehensive E2E test suite
- `docs/BUGFIX_CODE_BLOCKS.md` - This document

**Documentation:**

- `docs/REFACTORING_OPPORTUNITIES.md` - Updated with completion status

---

## Commit Details

```
commit e02e06f
Author: Javi Palacios <javi@fjp.es>
Date: Sat Jan 3 12:02:15 2026 +0100

refactor(phase-2): CSS variables + fix critical code blocks bug

- Issue #7: Convert hardcoded colors to CSS variables
- Critical Bug Fix: Code blocks toolbar not rendering
- E2E Test Coverage: Add comprehensive code-blocks.spec.ts

Tests:
- Unit: 1168/1168 passing ✅
- E2E Code Blocks: 12/12 passing ✅
- Build: Successful ✅
```

---

## References

- **Original Feature:** Code blocks implemented in commit `53ed1d8`
- **Astro Docs:** [Scripts and Event Handling](https://docs.astro.build/en/guides/client-side-scripts/)
- **Prism Docs:** [Prism Syntax Highlighter](https://prismjs.com/)
- **Related Issue:** Phase 2 Refactoring - Code Quality Improvements
