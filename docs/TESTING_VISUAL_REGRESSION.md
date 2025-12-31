# Visual Regression Testing Guide

**Last Updated:** December 31, 2025  
**Test File:** `e2e/visual-regression.spec.ts`  
**Tests:** 29 automated visual regression tests  
**Status:** ✅ All tests passing

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [What is Visual Regression Testing?](#what-is-visual-regression-testing)
3. [Test Coverage](#test-coverage)
4. [How It Works](#how-it-works)
5. [Running Tests](#running-tests)
6. [Updating Baselines](#updating-baselines)
7. [Understanding Failures](#understanding-failures)
8. [Best Practices](#best-practices)
9. [Configuration](#configuration)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This project uses **Playwright's screenshot comparison** for visual regression testing. These tests capture screenshots of pages and components, then compare them against baseline images to detect unintended visual changes.

### Key Benefits

- ✅ **Catches visual bugs** before they reach production
- ✅ **Detects CSS regressions** automatically
- ✅ **Tests responsive design** across breakpoints
- ✅ **Verifies theme consistency** (light/dark)
- ✅ **Fast feedback** (~18 seconds for 29 tests)
- ✅ **Zero maintenance** once baselines are established

---

## What is Visual Regression Testing?

Visual regression testing compares screenshots pixel-by-pixel to detect changes in:

- Layout and positioning
- Colors and styling
- Typography and spacing
- Component rendering
- Responsive behavior
- Theme appearance

### When Tests Fail

Tests fail when screenshots differ from baselines by more than the threshold (default: 0 pixels). This indicates:

- ✅ **Intentional changes** - Update baselines after review
- ❌ **Unintended regressions** - Fix the issue before committing

---

## Test Coverage

### Summary (29 tests)

| Category         | Tests | Description                                 |
| ---------------- | ----- | ------------------------------------------- |
| **Homepage**     | 7     | ES/EN, light/dark, mobile/tablet/desktop    |
| **Books**        | 6     | Listing + detail, multiple viewports/themes |
| **Tutorials**    | 3     | Listing, multiple viewports/themes          |
| **Posts**        | 3     | Listing, multiple viewports/themes          |
| **Taxonomies**   | 4     | Authors, genres, publishers                 |
| **Static Pages** | 3     | About, Feeds pages                          |
| **Components**   | 3     | Search modal (multiple states)              |

### Detailed Test List

#### Homepage (7 tests)

```typescript
✅ Desktop - ES light theme (1920x1080)
✅ Desktop - ES dark theme (1920x1080)
✅ Desktop - EN light theme (1920x1080)
✅ Tablet - ES light theme (768x1024)
✅ Tablet - ES dark theme (768x1024)
✅ Mobile - ES light theme (375x667)
✅ Mobile - ES dark theme (375x667)
```

#### Books Pages (6 tests)

```typescript
✅ Listing - Desktop light (1920x1080)
✅ Listing - Desktop dark (1920x1080)
✅ Listing - Mobile light (375x667)
✅ Detail - Desktop light (El Hobbit page)
✅ Detail - Desktop dark (El Hobbit page)
✅ Detail - Mobile light (El Hobbit page)
```

#### Tutorials Pages (3 tests)

```typescript
✅ Listing - Desktop light (1920x1080)
✅ Listing - Desktop dark (1920x1080)
✅ Listing - Mobile light (375x667)
```

#### Posts Pages (3 tests)

```typescript
✅ Listing - Desktop light (1920x1080)
✅ Listing - Desktop dark (1920x1080)
✅ Listing - Mobile light (375x667)
```

#### Taxonomy Pages (4 tests)

```typescript
✅ Authors listing - Desktop light
✅ Author detail - Desktop light (Tolkien page)
✅ Genres listing - Desktop light
✅ Publishers listing - Desktop light
```

#### Static Pages (3 tests)

```typescript
✅ About page - Desktop light
✅ About page - Desktop dark
✅ Feeds page - Desktop light
```

#### Components (3 tests)

```typescript
✅ Search modal - Desktop light
✅ Search modal - Desktop dark
✅ Search modal - Mobile light
```

---

## How It Works

### First Run: Generate Baselines

```bash
bun run test:e2e -- e2e/visual-regression.spec.ts
```

**What happens:**

1. Playwright navigates to each page/component
2. Waits for page to be stable (fonts loaded, network idle)
3. Captures full-page screenshot
4. Saves as baseline in `e2e/visual-regression.spec.ts-snapshots/`

**Output:** `✅ 29 tests passed - baselines generated`

### Subsequent Runs: Compare Against Baselines

```bash
bun run test:e2e -- e2e/visual-regression.spec.ts
```

**What happens:**

1. Captures new screenshot
2. Compares pixel-by-pixel with baseline
3. **Pass** if identical (or within threshold)
4. **Fail** if differences detected

**Output on change:**

```
❌ Test failed: homepage-es-desktop-light.png

Expected: e2e/visual-regression.spec.ts-snapshots/homepage-es-desktop-light-visual-regression-linux.png
Received: test-results/.../homepage-es-desktop-light-actual.png
   Diff: test-results/.../homepage-es-desktop-light-diff.png
```

---

## Running Tests

### Run All Visual Regression Tests

```bash
bun run test:e2e -- e2e/visual-regression.spec.ts
```

### Run Specific Test

```bash
# Run only homepage tests
bun run test:e2e -- e2e/visual-regression.spec.ts -g "Homepage"

# Run only dark theme tests
bun run test:e2e -- e2e/visual-regression.spec.ts -g "dark"

# Run only mobile tests
bun run test:e2e -- e2e/visual-regression.spec.ts -g "mobile"
```

### Run in UI Mode (Interactive)

```bash
bun run test:e2e -- e2e/visual-regression.spec.ts --ui
```

**Benefits:**

- Visual diff viewer
- Interactive baseline comparison
- One-click baseline updates
- Timeline and trace viewer

### Run in Debug Mode

```bash
bun run test:e2e -- e2e/visual-regression.spec.ts --debug
```

---

## Updating Baselines

### When to Update

Update baselines after **intentional** visual changes:

- ✅ CSS/styling updates
- ✅ Layout modifications
- ✅ New components added
- ✅ Typography changes
- ✅ Color scheme updates

### How to Update

#### Method 1: Update All Baselines

```bash
bun run test:e2e -- e2e/visual-regression.spec.ts --update-snapshots
```

**Use when:** You've made intentional changes affecting multiple pages

#### Method 2: Update Specific Baseline

```bash
# Update only homepage baselines
bun run test:e2e -- e2e/visual-regression.spec.ts -g "Homepage" --update-snapshots

# Update only dark theme baselines
bun run test:e2e -- e2e/visual-regression.spec.ts -g "dark" --update-snapshots
```

**Use when:** Changes affect only specific pages/themes

#### Method 3: UI Mode (Recommended)

```bash
bun run test:e2e -- e2e/visual-regression.spec.ts --ui
```

**Steps:**

1. Run tests in UI mode
2. Click on failing test
3. View side-by-side comparison
4. Click "Update baseline" if change is intentional

### After Updating

```bash
# Verify new baselines pass
bun run test:e2e -- e2e/visual-regression.spec.ts

# Commit new baselines
git add e2e/visual-regression.spec.ts-snapshots/
git commit -m "visual: update baselines after [description of change]"
```

---

## Understanding Failures

### Failure Output

```
❌ Test failed: homepage-es-desktop-light.png

Error: Screenshot comparison failed:

Expected: /path/to/baseline.png
Received: /path/to/actual.png
    Diff: /path/to/diff.png

6789 pixels (ratio 0.01 of all image pixels) are different
```

### Analyzing Failures

#### 1. View the Diff Image

```bash
# Diff images are in test-results/
open test-results/*/homepage-es-desktop-light-diff.png
```

**Diff image colors:**

- ⚪ **White** = Pixels match
- 🔴 **Red** = Pixels differ
- 🟡 **Yellow** = Small differences

#### 2. Common Causes

**Small pixel differences (<0.1% ratio):**

- Font rendering variations (OS/browser differences)
- Image compression artifacts
- Anti-aliasing differences

**Solution:** Increase threshold or accept as acceptable

**Large differences (>1% ratio):**

- CSS regression
- Layout shift
- Missing content
- Wrong theme applied
- Component not loaded

**Solution:** Fix the issue before updating baseline

#### 3. Use Playwright Trace

```bash
bun run test:e2e -- e2e/visual-regression.spec.ts --trace on
```

**View trace:**

```bash
npx playwright show-trace test-results/.../trace.zip
```

**Trace includes:**

- Network requests
- Console logs
- DOM snapshots
- Screenshot timeline

---

## Best Practices

### 1. Keep Baselines Stable

- ✅ Wait for fonts to load
- ✅ Wait for network idle
- ✅ Disable animations
- ✅ Use fixed viewports
- ✅ Set timeout for dynamic content

### 2. Review Changes Carefully

- ✅ Always view diff images before updating
- ✅ Verify changes are intentional
- ✅ Test across all affected pages
- ✅ Document reason for baseline update

### 3. Handle Dynamic Content

**Problem:** Content changes (dates, random elements) cause false failures

**Solutions:**

```typescript
// Hide dynamic elements
await page.locator(".timestamp").evaluate((el) => (el.style.visibility = "hidden"));

// Set fixed date
await page.clock.setFixedTime(new Date("2025-01-01"));

// Mock API responses
await page.route("**/api/random", (route) =>
  route.fulfill({
    body: JSON.stringify({ data: "fixed value" }),
  }),
);
```

### 4. Organize Tests by Purpose

- **Pages:** Test complete page layouts
- **Components:** Test isolated component rendering
- **Responsive:** Test breakpoints
- **Themes:** Test light/dark consistency

### 5. Use Descriptive Names

```typescript
// ❌ Bad
await expect(page).toHaveScreenshot("test1.png");

// ✅ Good
await expect(page).toHaveScreenshot("homepage-es-desktop-light.png");
```

### 6. Test Critical Paths First

**Priority order:**

1. Homepage (most visible)
2. Main content pages (books, tutorials, posts)
3. Detail pages
4. Taxonomy pages
5. Static pages
6. Components

---

## Configuration

### Viewport Configurations

```typescript
const VIEWPORTS = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  tablet: { width: 768, height: 1024 }, // iPad
  desktop: { width: 1920, height: 1080 }, // Full HD
};
```

### Screenshot Options

```typescript
await expect(page).toHaveScreenshot("filename.png", {
  fullPage: true, // Capture entire page (scroll)
  animations: "disabled", // Disable CSS animations
  timeout: 30000, // Max time to wait (30s)
  maxDiffPixels: 0, // Allow 0 pixel differences
  maxDiffPixelRatio: 0, // 0% difference allowed
});
```

### Custom Thresholds (If Needed)

```typescript
// Allow up to 100 different pixels
await expect(page).toHaveScreenshot("filename.png", {
  maxDiffPixels: 100,
});

// Allow up to 0.1% difference
await expect(page).toHaveScreenshot("filename.png", {
  maxDiffPixelRatio: 0.001,
});
```

---

## Troubleshooting

### Issue: Tests fail on CI but pass locally

**Cause:** Font rendering differences between OS/browsers

**Solution:**

```typescript
// Add maxDiffPixelRatio for font rendering tolerance
await expect(page).toHaveScreenshot("filename.png", {
  maxDiffPixelRatio: 0.001, // 0.1% tolerance
});
```

### Issue: Flaky tests (intermittent failures)

**Causes:**

- Animations not fully settled
- Fonts not loaded
- Network requests pending
- View transitions in progress

**Solutions:**

```typescript
// Wait for fonts
await page.evaluate(() => document.fonts.ready);

// Wait for network
await page.waitForLoadState("networkidle");

// Wait for animations
await page.waitForTimeout(500);

// Disable animations
await expect(page).toHaveScreenshot("file.png", {
  animations: "disabled",
});
```

### Issue: Search modal screenshots vary

**Cause:** Pagefind UI initialization timing

**Solution:**

```typescript
async function openSearchModal(page: Page): Promise<void> {
  const searchButton = page.locator(".search-button");
  await searchButton.click();

  // Wait for modal
  const modal = page.locator(".search-modal");
  await modal.waitFor({ state: "visible", timeout: 5000 });

  // Wait for Pagefind input
  const searchInput = page.locator(".pagefind-ui__search-input");
  await searchInput.waitFor({ state: "visible", timeout: 5000 });

  // Extra wait for UI to settle
  await page.waitForTimeout(500);
}
```

### Issue: Dark theme not applying

**Cause:** Theme toggle not visible or slow to respond

**Solution:**

```typescript
async function activateDarkTheme(page: Page): Promise<void> {
  const themeToggle = page.locator("#theme-toggle");
  const isVisible = await themeToggle.isVisible({ timeout: 2000 }).catch(() => false);

  if (!isVisible) {
    // Set theme via JavaScript if toggle not found
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    });
  } else {
    await themeToggle.click();
  }

  // Wait for theme transition
  await page.waitForTimeout(300);
}
```

### Issue: Baseline files not found

**Cause:** First run or baselines deleted

**Solution:**

```bash
# Generate baselines
bun run test:e2e -- e2e/visual-regression.spec.ts

# Commit baselines
git add e2e/visual-regression.spec.ts-snapshots/
git commit -m "visual: add baseline screenshots"
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Install Playwright browsers
        run: bunx playwright install --with-deps chromium

      - name: Run visual regression tests
        run: bun run test:e2e -- e2e/visual-regression.spec.ts

      - name: Upload diff images on failure
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: visual-regression-diffs
          path: test-results/**/\*-diff.png
          retention-days: 7
```

---

## Resources

### Playwright Documentation

- [Visual Comparisons Guide](https://playwright.dev/docs/test-snapshots)
- [Screenshot API Reference](https://playwright.dev/docs/api/class-page#page-screenshot)
- [Test Configuration](https://playwright.dev/docs/test-configuration)

### Related Testing

- [Accessibility Testing Guide](./TESTING_ACCESSIBILITY.md)
- [Performance Testing Guide](./TESTING_PERFORMANCE.md)
- [E2E Testing Overview](../README.md)

---

## Summary

### Current Status

- ✅ **29 tests** automated and passing
- ✅ **41 baseline screenshots** established
- ✅ **7 page types** covered
- ✅ **3 viewports** tested (mobile, tablet, desktop)
- ✅ **2 themes** tested (light, dark)
- ✅ **2 languages** tested (ES, EN)
- ✅ **18.1s** execution time

### Coverage Breakdown

| Type           | Count | Pages                                                 |
| -------------- | ----- | ----------------------------------------------------- |
| **Pages**      | 26    | Homepage, Books, Tutorials, Posts, Taxonomies, Static |
| **Components** | 3     | Search modal (multiple states)                        |
| **Total**      | 29    | Comprehensive coverage                                |

### Next Steps

1. **Run regularly** - Execute on every commit via CI/CD
2. **Review failures** - Always investigate before updating baselines
3. **Expand coverage** - Add more components as needed
4. **Monitor performance** - Keep execution time under 30s
5. **Document changes** - Explain baseline updates in commits

---

**Questions?** Refer to Playwright's [Visual Comparison Guide](https://playwright.dev/docs/test-snapshots) or check existing tests for examples.

**Last Test Run:** December 31, 2025 - ✅ 29/29 passing (18.1s)
