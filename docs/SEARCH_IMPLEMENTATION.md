# Search Implementation - Pagefind

**Last Updated:** December 27, 2025  
**Status:** ✅ Complete - Functional in both dev and production  
**Technology:** Pagefind by CloudCannon

---

## 📋 Overview

The website features a **full-text search** powered by [Pagefind](https://pagefind.app/), a static search library that creates an index at build time and provides instant search results without a backend.

### Key Features

- ✅ **Instant search** - Results appear as you type
- ✅ **Language filtering** - Automatically filters by current language (ES/EN)
- ✅ **Modal UI** - Clean, accessible search modal
- ✅ **Keyboard shortcuts** - `Cmd+K` / `Ctrl+K` to open, `Esc` to close
- ✅ **Mobile responsive** - Works on all screen sizes
- ✅ **Accessible** - WCAG 2.1 AA compliant with ARIA labels
- ✅ **Custom styling** - Fully themed to match site design
- ✅ **ViewTransitions compatible** - Works with Astro's view transitions

---

## 🏗️ Architecture

### File Structure

```
src/
├── components/
│   └── Search.astro              # Search modal component
├── styles/
│   └── components/
│       └── search.scss           # Search styling (BEM)
└── layouts/
    └── Layout.astro              # Loads Pagefind CSS/JS

scripts/
└── copy-pagefind-dev.js          # Dev helper script

public/
└── pagefind/                     # ⚠️ Generated (gitignored)
    ├── pagefind-ui.css
    ├── pagefind-ui.js
    └── ... (index files)
```

### Component Breakdown

**1. Search.astro** (`src/components/Search.astro`)

- Modal container with backdrop
- Close button with icon
- Search input container (`#search`)
- Pagefind initialization script
- Event handlers (keyboard, clicks)
- Language-specific translations

**2. search.scss** (`src/styles/components/search.scss`)

- BEM methodology for class names
- Modal styling (`.search-modal`)
- Pagefind UI customization (`:global()` selectors)
- Theme variables integration
- Dark mode support
- Responsive breakpoints

**3. Layout.astro** (`src/layouts/Layout.astro`)

- Loads Pagefind CSS: `<link href="/pagefind/pagefind-ui.css">`
- Loads Pagefind JS: `<script src="/pagefind/pagefind-ui.js">`
- Includes `<Search>` component globally

---

## 🔧 How It Works

### Build Process

1. **Content is built** → Astro generates static HTML in `dist/`
2. **Pagefind indexes content** → `pagefind --site dist` creates index
3. **Pagefind generates assets** → Output in `dist/pagefind/`

**Build command:**

```bash
bun run build
# Runs: astro build && bun run pagefind --site dist
```

### What Gets Indexed

Pagefind indexes **detail/content pages** but **excludes index/listing pages** to keep search results relevant.

**✅ Indexed pages (detail content):**

- Individual book pages (`/es/libros/[slug]`, `/en/books/[slug]`)
- Individual posts (`/es/publicaciones/[slug]`, `/en/posts/[slug]`)
- Individual tutorials (`/es/tutoriales/[slug]`, `/en/tutorials/[slug]`)
- Author detail pages (`/es/autores/[slug]`, `/en/authors/[slug]`)
- Category detail pages (`/es/categorias/[slug]`, `/en/categories/[slug]`)
- Genre detail pages (`/es/generos/[slug]`, `/en/genres/[slug]`)
- Publisher detail pages (`/es/editoriales/[slug]`, `/en/publishers/[slug]`)
- Series detail pages (`/es/series/[slug]`, `/en/series/[slug]`)
- Challenge detail pages (`/es/retos/[slug]`, `/en/challenges/[slug]`)
- Course detail pages (`/es/cursos/[slug]`, `/en/courses/[slug]`)
- About page (`/es/acerca-de`, `/en/about`)
- Home page (`/es`, `/en`)

**❌ Excluded from index (listing pages):**

- Author index (`/es/autores/`, `/en/authors/`)
- Category index (`/es/categorias/`, `/en/categories/`)
- Genre index (`/es/generos/`, `/en/genres/`)
- Publisher index (`/es/editoriales/`, `/en/publishers/`)
- Series index (`/es/series/`, `/en/series/`)
- Challenge index (`/es/retos/`, `/en/challenges/`)
- Course index (`/es/cursos/`, `/en/courses/`)
- Book index pages (`/es/libros/`, `/en/books/`)
- Post index pages (`/es/publicaciones/`, `/en/posts/`)
- Tutorial index pages (`/es/tutoriales/`, `/en/tutorials/`)

**Why exclude index pages?**

1. They contain repetitive content (lists of titles/excerpts)
2. Individual pages provide better, more targeted results
3. Keeps search results clean and relevant
4. Reduces noise in search results

**Implementation:**
All index pages wrap their content with `<div data-pagefind-ignore>`:

```astro
<Title title={pageTitle} />

<div data-pagefind-ignore>
  {itemsWithContent.length > 0 ? <AuthorList authors={itemsWithContent} ... /> : <div class="empty-state">...</div>}
</div>
```

**Total indexed:** 87 pages, 4159 words, 2 languages (ES, EN)

### Development Workflow

**The Problem:**  
Pagefind only runs **after build**, so in development (`bun run dev`) the `/pagefind/` directory doesn't exist, causing:

- ❌ 404 errors for `pagefind-ui.css`
- ❌ 404 errors for `pagefind-ui.js`
- ❌ Search doesn't work in dev mode

**The Solution:**  
We copy Pagefind assets from `dist/pagefind/` → `public/pagefind/` so they're available during development.

**Script:** `scripts/copy-pagefind-dev.js`

```javascript
// Copies dist/pagefind → public/pagefind
// Run manually or automatically via npm scripts
```

**Development commands:**

```bash
# Option 1: Copy Pagefind, then start dev server
bun run dev:search

# Option 2: Just start dev (if Pagefind already copied)
bun run dev

# After build, assets are auto-copied
bun run build
```

**NPM Scripts:**

```json
{
  "dev": "astro dev",
  "dev:search": "bun run scripts/copy-pagefind-dev.js && astro dev",
  "build": "astro build && bun run pagefind --site dist",
  "postbuild": "bun run scripts/copy-pagefind-dev.js"
}
```

**Key Points:**

- ✅ `postbuild` hook auto-copies after every build
- ✅ `dev:search` copies before starting dev server
- ✅ `public/pagefind/` is gitignored (generated content)
- ⚠️ If you modify content, re-run build + copy script

---

## 🎨 Styling

### Theme Integration

Pagefind UI is fully themed using CSS custom properties:

```scss
:global(.search-modal__container .pagefind-ui) {
  --pagefind-ui-primary: #{$accent}; // Yellow accent
  --pagefind-ui-text: #{$text}; // White text
  --pagefind-ui-background: #{$primary}; // Dark background
  --pagefind-ui-border: rgba(255, 255, 255, 0.1);
}
```

### Custom Overrides

We override Pagefind's default styles for:

- **Search input** - Custom padding, borders, focus states
- **Results cards** - Rounded corners, hover effects, shadows
- **Clear button** - Color transitions
- **Highlights** - Yellow background for matched terms
- **Scrollbars** - Themed scrollbar in results area

### BEM Structure

```scss
.search-modal                    // Block: Modal container
  &__backdrop                    // Element: Dark backdrop
  &__content                     // Element: Modal content box
  &__header                      // Element: Header with close button
  &__close                       // Element: Close button
  &__container                   // Element: Search results container
```

---

## 🔌 Integration

### Adding Search to a Page

Search is globally available via `Layout.astro`. It's included on every page automatically.

**Open search programmatically:**

```javascript
// Via button click
document.getElementById("search-toggle").click();

// Via function
window.openSearch(); // (if exposed globally)
```

**Keyboard shortcuts:**

- `Cmd+K` or `Ctrl+K` - Open search
- `Esc` - Close search

### Language Filtering

Pagefind automatically filters results by language using the `lang` attribute:

```html
<html lang="es">
  <!-- Spanish results only -->
  <html lang="en">
    <!-- English results only -->
  </html>
</html>
```

The `Search.astro` component reads `document.body.dataset.lang` to configure translations.

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Search opens with `Cmd+K` / `Ctrl+K`
- [ ] Search closes with `Esc`
- [ ] Clicking backdrop closes modal
- [ ] Close button works
- [ ] Search input focuses automatically
- [ ] Results appear as you type
- [ ] Clicking result navigates to page
- [ ] Spanish pages show Spanish results only
- [ ] English pages show English results only
- [ ] Mobile responsive (modal fits screen)
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Dark mode styling correct
- [ ] Light mode styling correct (if implemented)

### E2E Tests

**Status:** ⚠️ Not yet implemented

**Recommended tests:**

```typescript
// e2e/search.spec.ts
test.describe("Search functionality", () => {
  test("opens with Cmd+K shortcut", async ({ page }) => {
    await page.goto("/es/");
    await page.keyboard.press("Meta+K");
    await expect(page.locator("#searchModal")).toBeVisible();
  });

  test("shows results for query", async ({ page }) => {
    await page.goto("/es/");
    await page.keyboard.press("Meta+K");

    const input = page.locator(".pagefind-ui__search-input");
    await input.fill("git");

    await expect(page.locator(".pagefind-ui__result")).toHaveCountGreaterThan(0);
  });

  test("filters by language", async ({ page }) => {
    // Spanish page should only show Spanish results
    await page.goto("/es/");
    await page.keyboard.press("Meta+K");
    await page.locator(".pagefind-ui__search-input").fill("tutorial");

    const results = page.locator(".pagefind-ui__result-link");
    const hrefs = await results.evaluateAll((els) => els.map((el) => el.getAttribute("href")));

    expect(hrefs.every((href) => href.startsWith("/es/"))).toBe(true);
  });
});
```

---

## 📦 Dependencies

```json
{
  "devDependencies": {
    "pagefind": "^1.4.0"
  }
}
```

**Pagefind Version:** 1.4.0  
**License:** MIT  
**Size:** ~100KB (JS + CSS + WASM)

---

## 🐛 Known Issues & Limitations

### 1. ❌ CSS not loading in dev mode (SOLVED ✅)

**Issue:** Pagefind CSS/JS only exist after build, not in development.

**Solution:** Copy `dist/pagefind/` → `public/pagefind/` using script.

**Commands:**

```bash
bun run build              # Generates Pagefind index
bun run dev:search         # Copies assets + starts dev
```

### 2. ⚠️ Stale index in development

**Issue:** If you modify content and run `bun run dev`, search results may be outdated.

**Solution:** Re-run build to regenerate index:

```bash
bun run build              # Regenerates index
bun run scripts/copy-pagefind-dev.js  # (auto-runs via postbuild)
```

### 3. ⚠️ Search icon in menu not implemented

**Issue:** The search button (`#search-toggle`) needs to be added to the Menu component.

**TODO:**

- Add search icon button in `Menu.astro`
- Style button (similar to theme switcher)
- Test on mobile breakpoints

---

## 🔮 Future Enhancements

### High Priority

- [ ] Add search button to Menu component
- [ ] Implement E2E tests for search
- [ ] Add loading state indicator
- [ ] Add "No results" illustration/message

### Medium Priority

- [ ] Add filters (by content type: posts, books, tutorials)
- [ ] Add date range filters
- [ ] Add sort options (relevance, date)
- [ ] Show content type badge on results

### Low Priority

- [ ] Add search analytics (track popular queries)
- [ ] Add "Did you mean?" suggestions
- [ ] Add recent searches history
- [ ] Add keyboard shortcuts help modal

---

## 📚 Resources

- **Pagefind Documentation:** https://pagefind.app/
- **Pagefind GitHub:** https://github.com/CloudCannon/pagefind
- **Astro Search Guide:** https://docs.astro.build/en/guides/integrations-guide/
- **BEM Methodology:** http://getbem.com/

---

## 🚀 Quick Reference

### Important Files

| File                                | Purpose                       |
| ----------------------------------- | ----------------------------- |
| `src/components/Search.astro`       | Search modal component        |
| `src/styles/components/search.scss` | Search styling                |
| `scripts/copy-pagefind-dev.js`      | Dev helper script             |
| `public/pagefind/`                  | Generated assets (gitignored) |

### Commands

| Command                                | Purpose                              |
| -------------------------------------- | ------------------------------------ |
| `bun run build`                        | Build site + generate Pagefind index |
| `bun run dev`                          | Start dev server                     |
| `bun run dev:search`                   | Copy assets + start dev              |
| `bun run scripts/copy-pagefind-dev.js` | Copy Pagefind to public/             |

### Keyboard Shortcuts

| Key                | Action               |
| ------------------ | -------------------- |
| `Cmd+K` / `Ctrl+K` | Open search          |
| `Esc`              | Close search         |
| `Tab`              | Navigate results     |
| `Enter`            | Open selected result |

---

**Last Updated:** December 27, 2025  
**Implemented By:** Session 2025-12-27  
**Status:** ✅ Production Ready

---

_This document should be updated whenever search functionality changes._
