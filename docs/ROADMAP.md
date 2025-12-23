# 🗺️ Website Roadmap - Blog Migration Complete

**Last Updated:** December 23, 2025  
**Current Branch:** `feature/blog-foundation`  
**Status:** Phase 4 Complete → Moving to Phase 5 (Production Ready)

---

## 📊 Progress Overview

- **Phase 1:** Foundation ✅ 100%
- **Phase 2:** Content Migration 🟡 5%
- **Phase 3:** i18n & Components ✅ 100%
- **Phase 4:** Routing & Pages ✅ 100%
- **Phase 5:** Production Ready 🟡 60%
- **Phase 6:** Content Complete 🔴 0%
- **Phase 7:** Launch 🔴 0%

**Overall Progress:** 95% Code / 5% Content / 60% Total

---

## 📚 Content Migration Overview

**Three Content Sources to Migrate:**

### 1. **fjp.es (WordPress) - 144 Book Reviews**

- **Location:** `/WordPress/output/` (already extracted as Markdown)
- **Status:** Ready to migrate
- **Format:** Needs transformation (WordPress shortcodes → Astro MDX)
- **Estimated Time:** 8-12 hours
- **Priority:** HIGHEST

### 2. **sargatanacode.es - ~50-100 Posts**

- **Location:** Database (Markdown format stored in DB)
- **Status:** Needs extraction script
- **Format:** Already Markdown, needs frontmatter generation
- **Estimated Time:** 6-10 hours
- **Priority:** HIGH

### 3. **Gatsby Site - Verify No Orphaned Content**

- **Location:** Current Gatsby implementation
- **Status:** Audit needed
- **Purpose:** Ensure no unique content left behind
- **Estimated Time:** 2-4 hours
- **Priority:** LOW

**Total Content to Migrate:** ~200-250 pieces (books + posts + tutorials)

---

## 🎯 Current Sprint - In Progress

### ✅ Task 1: E2E SEO Tests Validation (IN PROGRESS)

**Status:** Running tests now  
**Estimated Time:** 30 minutes  
**Assignee:** User (running now)

**Tasks:**

- [x] Start dev server (`bun run dev`)
- [ ] Run E2E tests (`bun run test:e2e e2e/seo-structured-data.spec.ts`)
- [ ] Verify all tests pass
- [ ] Fix any failing tests if needed
- [ ] Update documentation with results

**Success Criteria:**

- All E2E SEO tests passing ✅
- Structured data validated on rendered pages
- No console errors during tests

---

## 🔴 Phase 5: Production Readiness (60% → 100%)

### ✅ SEO & Metadata (100% Complete)

**Status:** ✅ COMPLETED (Dec 23, 2025)

- [x] SEO component with Open Graph
- [x] Twitter Cards
- [x] JSON-LD schemas (Book, BlogPosting, TechArticle, Person)
- [x] Canonical URLs
- [x] Hreflang tags for bilingual support
- [x] Dynamic meta descriptions for taxonomy pages
- [x] 34 unit tests for SEO component
- [x] E2E tests for structured data
- [x] Favicon updated to blog version

**Files:**

- `src/components/SEO.astro`
- `src/__tests__/components/SEO.test.ts`
- `e2e/seo-structured-data.spec.ts`

---

### 🔲 RSS Feeds Enhancement (Current: 80% → Target: 100%)

**Status:** 🟡 MOSTLY COMPLETE  
**Priority:** High  
**Estimated Time:** 1 hour

**Current State:**

- ✅ `/rss.xml` - Global feed (all content types)
- ✅ `/es/libros/rss.xml` - Spanish books
- ✅ `/es/tutoriales/rss.xml` - Spanish tutorials
- ✅ `/en/books/rss.xml` - English books
- ✅ `/en/tutorials/rss.xml` - English tutorials
- ❌ `/es/publicaciones/rss.xml` - **MISSING** Spanish posts
- ❌ `/en/posts/rss.xml` - **MISSING** English posts

**What's Needed:**

#### Task 5.1: Create Missing RSS Feeds

- [ ] Create `/src/pages/es/publicaciones/rss.xml.ts`
- [ ] Create `/src/pages/en/posts/rss.xml.ts`
- [ ] Follow same pattern as books/tutorials feeds
- [ ] Filter by language (`es` or `en`)
- [ ] Sort by date descending

**Example Implementation:**

```typescript
// src/pages/es/publicaciones/rss.xml.ts
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const allPosts = await getCollection("posts");
  const spanishPosts = allPosts
    .filter((post) => post.data.language === "es")
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "fjp.es - Publicaciones",
    description: "Artículos sobre desarrollo web, tecnología y más",
    site: context.site!,
    items: spanishPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/es/publicaciones/${post.data.post_slug}`,
      customData: `<language>es</language>`,
    })),
  });
}
```

#### Task 5.2: Add RSS Auto-Discovery Links

- [ ] Add `<link rel="alternate" type="application/rss+xml">` to `<head>`
- [ ] Add for each feed type (posts, tutorials, books)
- [ ] Make language-aware (only show feeds for current language)

**File:** `src/layouts/Layout.astro`

```astro
{
  lang === "es" && (
    <>
      <link
        rel="alternate"
        type="application/rss+xml"
        title="fjp.es - Publicaciones"
        href="/es/publicaciones/rss.xml"
      />
      <link rel="alternate" type="application/rss+xml" title="fjp.es - Tutoriales" href="/es/tutoriales/rss.xml" />
      <link rel="alternate" type="application/rss+xml" title="fjp.es - Libros" href="/es/libros/rss.xml" />
    </>
  )
}
```

#### Task 5.3: Create RSS Subscription Pages (Nice to Have)

**Priority:** Low (optional)  
**Estimated Time:** 1 hour

- [ ] Create `/es/suscribirse.astro` - Visual page explaining RSS
- [ ] Create `/en/subscribe.astro`
- [ ] Show all available feeds with icons
- [ ] Explain what RSS is and how to use it
- [ ] Link to popular RSS readers (Feedly, Inoreader, NetNewsWire)

**Success Criteria:**

- All content types have RSS feeds ✅
- RSS auto-discovery links in HTML ✅
- Feeds validate on https://validator.w3.org/feed/
- (Optional) User-friendly subscription pages

---

### 🔲 Breadcrumbs with Schema.org Markup

**Status:** 🔴 NOT STARTED  
**Priority:** High  
**Estimated Time:** 3 hours

**Why:** Improves UX (navigation) and SEO (rich snippets in Google search results)

#### Task 5.4: Create Breadcrumb Component

- [ ] Create `src/components/Breadcrumbs.astro`
- [ ] Accept `items` prop: `Array<{label: string, href?: string}>`
- [ ] Render styled breadcrumb trail
- [ ] Include JSON-LD BreadcrumbList schema
- [ ] Match current design aesthetic (colors, fonts)
- [ ] Responsive (stack on mobile if needed)

**Design Considerations:**

```
Home > Libros > Terror > Apocalipsis
[icon] [link] [separator] [link] [separator] [link] [separator] [current]
```

**Style Requirements:**

- Use existing CSS variables for colors
- Separator: `>` or `/` or custom icon from Fontello
- Current page: no link, different style (bold/color)
- Hover states on links
- Accessible (proper ARIA labels)

**JSON-LD Schema:**

```typescript
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://fjp.es/es/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Libros",
      item: "https://fjp.es/es/libros/",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Terror",
      item: "https://fjp.es/es/generos/terror/",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Apocalipsis",
      // No "item" for current page
    },
  ],
};
```

#### Task 5.5: Add Breadcrumbs to Detail Pages

- [ ] Book detail pages (`/es/libros/[slug].astro`)
- [ ] Post detail pages (`/es/publicaciones/[slug].astro`)
- [ ] Tutorial detail pages (`/es/tutoriales/[slug].astro`)
- [ ] Both ES and EN versions

**Example for Book Page:**

```astro
---
const breadcrumbItems = [
  { label: t(lang, "ui.home"), href: `/${lang}/` },
  { label: t(lang, "pages.books"), href: `/${lang}/${t(lang, "routes.books")}/` },
  { label: book.title }, // Current page, no href
];
---

<Breadcrumbs items={breadcrumbItems} lang={lang} />
```

#### Task 5.6: Add Tests for Breadcrumbs

- [ ] Unit tests for Breadcrumbs component (rendering, schema generation)
- [ ] E2E tests for breadcrumb presence and functionality
- [ ] Validate schema with Google Rich Results Test

**Success Criteria:**

- Breadcrumbs appear on all detail pages ✅
- Schema validates in Google Rich Results Test ✅
- Styled consistently with site design ✅
- All links work correctly ✅
- Tests passing (unit + E2E) ✅

---

### 🔲 ItemList Schema for Listing Pages

**Status:** 🔴 NOT STARTED  
**Priority:** Medium  
**Estimated Time:** 2 hours

**Why:** Helps Google understand list pages, may appear as carousels in search results

#### Task 5.7: Create ItemList Schema Generator

- [ ] Create utility function `src/utils/schemas/itemList.ts`
- [ ] Accept array of items with minimal info (name, url, position)
- [ ] Generate valid ItemList schema
- [ ] Support different item types (Book, Article, etc.)

**Implementation:**

```typescript
// src/utils/schemas/itemList.ts
export function generateItemListSchema(
  items: Array<{
    name: string;
    url: string;
    type?: "Book" | "BlogPosting" | "TechArticle";
  }>,
  baseUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": item.type || "Thing",
        name: item.name,
        url: `${baseUrl}${item.url}`,
      },
    })),
  };
}
```

#### Task 5.8: Add ItemList to Listing Pages

- [ ] Books listing (`/es/libros/index.astro`)
- [ ] Posts listing (`/es/publicaciones/index.astro`)
- [ ] Tutorials listing (`/es/tutoriales/index.astro`)
- [ ] Category pages (`/es/categorias/[slug].astro`)
- [ ] Genre pages (`/es/generos/[slug].astro`)
- [ ] Author pages (`/es/autores/[slug].astro`)
- [ ] Both ES and EN versions

**Example for Books Listing:**

```astro
---
import { generateItemListSchema } from "@utils/schemas/itemList";

const itemListSchema = generateItemListSchema(
  books.map((book) => ({
    name: book.data.title,
    url: `/${lang}/${t(lang, "routes.books")}/${book.data.post_slug}/`,
    type: "Book",
  })),
  site.toString(),
);
---

<script type="application/ld+json" set:html={JSON.stringify(itemListSchema)} />
```

#### Task 5.9: Test ItemList Schemas

- [ ] Unit tests for schema generator
- [ ] E2E tests verifying schema presence
- [ ] Validate with Google Rich Results Test
- [ ] Check that all URLs are absolute

**Success Criteria:**

- ItemList schemas on all listing pages ✅
- Schemas validate correctly ✅
- Position numbers are sequential ✅
- URLs are absolute (https://) ✅
- Tests passing ✅

---

### 🔲 Performance Optimization

**Status:** 🔴 NOT STARTED  
**Priority:** High  
**Estimated Time:** 4 hours

**Why:** Core Web Vitals affect SEO ranking and user experience

#### Task 5.10: Run Baseline Performance Audit

- [ ] Run Lighthouse on 5 representative pages:
  - Home (`/es/`)
  - Post listing (`/es/publicaciones/`)
  - Post detail (`/es/publicaciones/de-ruby-a-javascript/`)
  - Book detail (`/es/libros/apocalipsis-stephen-king/`)
  - About page (`/es/sobre-mi/`)
- [ ] Document current scores (Performance, Accessibility, Best Practices, SEO)
- [ ] Identify top 5 issues affecting score

**How to Run:**

```bash
# Option 1: Manual Lighthouse in Chrome DevTools
# Open page → DevTools → Lighthouse tab → Generate report

# Option 2: Lighthouse CI (automated)
bun add -D @lhci/cli
npx lhci autorun --collect.url=http://localhost:4321/es/
```

**Document Results:**

```
Page: /es/
- Performance: X/100
- Accessibility: X/100
- Best Practices: X/100
- SEO: X/100

Top Issues:
1. [Issue description]
2. [Issue description]
```

#### Task 5.11: Image Optimization

- [ ] Install `@astrojs/image` or use Astro's built-in Image component
- [ ] Replace all `<img>` tags with `<Image>` component
- [ ] Add `loading="lazy"` to below-the-fold images
- [ ] Ensure all images have `width` and `height` attributes
- [ ] Optimize book covers (resize to max 800px width)
- [ ] Add `alt` text to all images (accessibility)

**Before:**

```astro
<img src={book.data.cover} alt="" />
```

**After:**

```astro
<Image
  src={book.data.cover}
  alt={`Cover of ${book.data.title} by ${authorName}`}
  width={800}
  height={1200}
  loading="lazy"
  format="webp"
/>
```

**Impact:** -30-50% image size, faster LCP (Largest Contentful Paint)

#### Task 5.12: Font Optimization

- [ ] Check if custom fonts are being used
- [ ] If using custom fonts, preload critical fonts
- [ ] Use `font-display: swap` to avoid FOIT (Flash of Invisible Text)
- [ ] Consider subsetting fonts (remove unused glyphs)

**In `<head>`:**

```html
<link rel="preload" href="/fonts/your-font.woff2" as="font" type="font/woff2" crossorigin />
```

**In CSS:**

```css
@font-face {
  font-family: "YourFont";
  src: url("/fonts/your-font.woff2") format("woff2");
  font-display: swap; /* Show fallback font while loading */
}
```

#### Task 5.13: Code Splitting & Lazy Loading

- [ ] Review bundle size with `bun run build` and check `dist/_astro/` folder
- [ ] Identify large JavaScript bundles (>100KB)
- [ ] Lazy load non-critical components
- [ ] Use dynamic imports for heavy libraries (if any)

**Example: Lazy load a heavy component**

```astro
---
// Instead of:
// import HeavyComponent from '@components/HeavyComponent.astro';

// Use client:load with dynamic import if needed
---

<HeavyComponent client:load />
```

#### Task 5.14: Minimize Render-Blocking Resources

- [ ] Inline critical CSS (above-the-fold styles)
- [ ] Defer non-critical JavaScript
- [ ] Remove unused CSS with PurgeCSS or similar
- [ ] Minimize third-party scripts

**Check:**

```bash
# See what's blocking render in Lighthouse report
# Look for "Eliminate render-blocking resources" section
```

#### Task 5.15: Enable Compression

- [ ] Verify Brotli/Gzip compression is enabled
- [ ] Check with browser DevTools → Network tab → Response Headers
- [ ] Should see `Content-Encoding: br` or `gzip`

**Note:** GitHub Pages enables this automatically. If self-hosting, configure in server.

#### Task 5.16: Add Performance Budget

- [ ] Create `.lighthouserc.json` config file
- [ ] Set performance budgets (max bundle size, max load time)
- [ ] Add to CI/CD to fail builds that exceed budget

**Example `.lighthouserc.json`:**

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    }
  }
}
```

#### Task 5.17: Re-run Performance Audit

- [ ] Run Lighthouse again on same 5 pages
- [ ] Compare before/after scores
- [ ] Document improvements
- [ ] Fix any remaining issues

**Success Criteria:**

- Performance score >90 on all pages ✅
- LCP (Largest Contentful Paint) <2.5s ✅
- FID (First Input Delay) <100ms ✅
- CLS (Cumulative Layout Shift) <0.1 ✅
- All images optimized ✅
- No render-blocking resources ✅

---

### 🔲 Search Functionality (Pagefind)

**Status:** 🔴 NOT STARTED  
**Priority:** High  
**Estimated Time:** 3 hours

**Why:** Essential UX feature for content-heavy blogs, improves navigation and user engagement

**Decision:** Using **Pagefind** (recommended over Fuse.js for performance)

#### Task 5.18: Install and Configure Pagefind

- [ ] Install Pagefind: `bun add -D pagefind`
- [ ] Add Pagefind to build process
- [ ] Configure indexing options

**Installation:**

```bash
bun add -D pagefind
```

**Update `package.json`:**

```json
{
  "scripts": {
    "build": "astro build && pagefind --source dist"
  }
}
```

**Create config:** `pagefind.yml`

```yaml
source: dist
bundle_dir: _pagefind
root_selector: main
exclude_selectors:
  - nav
  - footer
  - .menu
```

#### Task 5.19: Create Search Component

- [ ] Create `src/components/Search.astro`
- [ ] Add search input with icon
- [ ] Style to match site design
- [ ] Add keyboard shortcut (Cmd+K / Ctrl+K)
- [ ] Results modal/dropdown
- [ ] Highlight matching text

**Basic Implementation:**

```astro
---
// src/components/Search.astro
---

<div class="search-container">
  <input type="search" id="search" placeholder="Buscar..." aria-label="Buscar en el sitio" />
  <div id="search-results"></div>
</div>

<script>
  import "@pagefind/default-ui/css/ui.css";

  window.addEventListener("DOMContentLoaded", () => {
    // @ts-ignore
    new PagefindUI({
      element: "#search",
      showSubResults: true,
      translations: {
        placeholder: "Buscar en el blog...",
        clear_search: "Limpiar",
        load_more: "Cargar más resultados",
        search_label: "Buscar en este sitio",
        filters_label: "Filtros",
        zero_results: "No se encontraron resultados para [SEARCH_TERM]",
      },
    });
  });
</script>

<style>
  .search-container {
    /* Your custom styles */
  }
</style>
```

#### Task 5.20: Add Search to Layout

- [ ] Add Search component to `src/layouts/Layout.astro`
- [ ] Show on all pages EXCEPT index and about (as requested)
- [ ] Position in header or as floating button
- [ ] Make it keyboard accessible (Cmd+K to focus)

**Conditional Rendering:**

```astro
---
const showSearch =
  !Astro.url.pathname.match(/^\/(es|en)?\/?$/) &&
  !Astro.url.pathname.includes("/sobre-mi") &&
  !Astro.url.pathname.includes("/about");
---

{showSearch && <Search lang={lang} />}
```

#### Task 5.21: Customize Search UI

- [ ] Match color scheme (dark/light theme)
- [ ] Use site fonts
- [ ] Adjust spacing and sizing
- [ ] Add smooth animations
- [ ] Mobile-responsive design

**Custom CSS:**

```scss
// Override Pagefind default styles
.pagefind-ui {
  --pagefind-ui-primary: var(--color-primary);
  --pagefind-ui-background: var(--color-background);
  --pagefind-ui-border: var(--color-border);
  --pagefind-ui-font: var(--font-family);
}
```

#### Task 5.22: Add Language Filtering

- [ ] Configure Pagefind to index language attribute
- [ ] Filter results by current page language
- [ ] Spanish pages only show Spanish results
- [ ] English pages only show English results

**Config Update:**

```yaml
# pagefind.yml
glob: "**/*.html"
keep_index_url: false
force_language: ["es", "en"]
```

**In Search Component:**

```typescript
new PagefindUI({
  element: "#search",
  filters: {
    lang: lang, // Pass current page language
  },
});
```

#### Task 5.23: Test Search Functionality

- [ ] Build site and verify `_pagefind/` folder created
- [ ] Test search with various queries
- [ ] Verify results are relevant
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Test on mobile devices
- [ ] Test with both languages

**Test Cases:**

- Search for "git" → Should find tutorials
- Search for "King" → Should find Stephen King books
- Search for "JavaScript" → Should find related posts
- Empty search → Should show nothing or recent posts
- Non-existent term → Should show "No results" message

#### Task 5.24: Add Search to E2E Tests

- [ ] Create `e2e/search.spec.ts`
- [ ] Test search input appears
- [ ] Test search with query returns results
- [ ] Test keyboard shortcuts work
- [ ] Test results are clickable

**Success Criteria:**

- Search works on all pages (except index/about) ✅
- Results are fast (<500ms) ✅
- UI matches site design ✅
- Language filtering works ✅
- Keyboard accessible ✅
- Mobile responsive ✅
- E2E tests passing ✅

---

### 🔲 Analytics & Monitoring Setup

**Status:** 🔴 NOT STARTED  
**Priority:** Medium (can be done after launch)  
**Estimated Time:** 2 hours

**Tools:** Umami + Google Search Console + Sentry (all FREE)

**Why Umami instead of Google Analytics?**

- ✅ **Privacy-friendly:** No cookies, no tracking across sites, GDPR compliant without banner
- ✅ **Lightweight:** 2KB script vs 45KB of GA4
- ✅ **Simple UI:** Easy to understand, not overwhelming
- ✅ **Not blocked:** Adblockers don't block it (because it's not invasive)
- ✅ **FREE tier:** 100K events/month (sufficient for personal blogs)
- ❌ **Less powerful:** No conversion funnels, no audience segmentation, no AI predictions
- ❌ **Less integrations:** Doesn't connect with Google Ads or marketing tools

**Umami vs Google Analytics:**

| Feature         | Umami                  | Google Analytics 4         |
| --------------- | ---------------------- | -------------------------- |
| Privacy         | 🟢 GDPR without banner | 🔴 Requires cookie consent |
| Script size     | 🟢 ~2KB                | 🟡 ~45KB                   |
| Setup           | 🟢 5 minutes           | 🟡 Complex                 |
| Cost            | 🟢 Free (<100K events) | 🟢 Free (unlimited)        |
| Features        | 🟡 Basic metrics       | 🟢 Advanced analytics      |
| Integrations    | 🔴 Limited             | 🟢 Google ecosystem        |
| User experience | 🟢 Fast, not blocked   | 🔴 Slow, often blocked     |

**Recommendation for this blog:**

- **Umami:** For page views, referrers, countries, devices → Privacy-first, simple
- **Google Search Console:** For SEO keywords, indexing, rich snippets → Essential, no alternative
- **Sentry:** For JavaScript errors → Essential for debugging

You DON'T need Google Analytics unless you're selling products, running ads, or need advanced funnels.

#### Task 5.25: Set Up Umami Analytics

**What:** Privacy-friendly web analytics (Google Analytics alternative)  
**Why:** Track visitors, page views, referrers without compromising privacy  
**Cost:** FREE

**Option 1: Umami Cloud (RECOMMENDED - Easiest) 🌟**

1. [ ] Go to https://cloud.umami.is/
2. [ ] Sign up with email
3. [ ] Plan: FREE tier (100,000 events/month - sufficient for personal blogs)
4. [ ] Create new website
5. [ ] Copy tracking script

**FREE Tier Limits:**

- 100,000 events per month (page views + custom events)
- Unlimited websites
- Example: 3,000 visitors/month × 3 pages/visit = 9,000 events → Plenty of room

**Option 2: Self-Hosted (FREE Forever, More Work)**

1. [ ] Fork https://github.com/umami-software/umami
2. [ ] Deploy to Railway.app (500 hours/month free)
3. [ ] Create PostgreSQL database on Supabase.com (500MB free)
4. [ ] Connect Umami to database
5. [ ] Access dashboard (e.g., umami.railway.app)

**No limits, 100% free, but requires 30-60 min setup.**

**Implementation:**

- [ ] Add Umami tracking script to `src/layouts/Layout.astro`
- [ ] Only load in production (not localhost)
- [ ] Respect DNT (Do Not Track) header
- [ ] Add data-respect-dnt attribute

```astro
{
  import.meta.env.PROD && (
    <script
      defer
      src="https://analytics.umami.is/script.js"
      data-website-id="your-website-id"
      data-respect-dnt="true"
    />
  )
}
```

**What You'll Track:**

- Page views per URL
- Visitors (unique)
- Referrers (where traffic comes from)
- Countries
- Devices (mobile/desktop)
- Browsers

**No Personal Data:** No cookies, no IP tracking, GDPR compliant

#### Task 5.26: Set Up Google Search Console

**What:** Official Google tool for webmasters  
**Why:** See what keywords bring traffic, fix indexing issues, monitor SEO health  
**Cost:** FREE ✅

**Steps:**

1. [ ] Go to https://search.google.com/search-console
2. [ ] Sign in with Google account
3. [ ] Add property → Choose "URL prefix"
4. [ ] Enter your domain (e.g., https://fjp.es)
5. [ ] Verify ownership (HTML file upload or DNS TXT record)

**Verification Methods:**

- **HTML file:** Upload `google-site-verification-xxx.html` to `public/`
- **DNS:** Add TXT record to your domain DNS settings
- **Meta tag:** Add `<meta name="google-site-verification" content="xxx">` to `<head>`

**After Verification:** 6. [ ] Submit sitemap URL: `https://fjp.es/sitemap-index.xml` 7. [ ] Wait 48-72 hours for data to start appearing

**What You'll Monitor:**

- Search queries that bring traffic
- Click-through rate (CTR) from Google
- Average position in search results
- Index coverage (pages Google has crawled)
- Mobile usability issues
- Rich results (book reviews, breadcrumbs)
- Core Web Vitals

**Best Practice:** Check weekly, especially after major updates

#### Task 5.27: Set Up Sentry Error Tracking

**What:** Captures JavaScript errors in production with stack traces  
**Why:** Know when things break for users, fix before they report  
**Cost:** FREE (5,000 errors/month)

**Steps:**

1. [ ] Go to https://sentry.io
2. [ ] Sign up with email or GitHub
3. [ ] Create new project → Select "Astro"
4. [ ] Copy DSN (Data Source Name)

**Installation:**

```bash
bun add @sentry/astro
```

**Configuration:**

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import sentry from "@sentry/astro";

export default defineConfig({
  integrations: [
    sentry({
      dsn: "your-sentry-dsn",
      sourceMapsUploadOptions: {
        project: "your-project-name",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      // Only in production
      enabled: import.meta.env.PROD,
    }),
  ],
});
```

**What You'll Track:**

- JavaScript runtime errors
- Unhandled promise rejections
- Network errors (failed API calls)
- User context (browser, OS, page URL)
- Stack traces with source maps

**Set Up Alerts:**

- [ ] Configure email alerts for new errors
- [ ] Set up Slack/Discord webhook (optional)
- [ ] Create issue rules (auto-resolve after X days)

**Privacy Settings:**

- [ ] Enable IP anonymization
- [ ] Scrub sensitive data (emails, tokens)
- [ ] Set data retention period

#### Task 5.28: Add Privacy Policy Page (Required for Analytics)

- [ ] Create `/es/privacidad.astro`
- [ ] Create `/en/privacy.astro`
- [ ] Explain what data is collected (Umami, Sentry)
- [ ] Mention Google Search Console (no user tracking)
- [ ] Add contact info for data requests
- [ ] Link from footer

**Template:**

```markdown
# Privacy Policy

This website uses:

- **Umami Analytics**: Privacy-friendly analytics, no cookies, no personal data
- **Sentry**: Error tracking for improving user experience
- **Google Search Console**: SEO monitoring, no user tracking

We do NOT:

- Use cookies for tracking
- Sell your data
- Track you across websites
- Collect personal information

Your privacy is respected. 🔒
```

#### Task 5.29: Test Analytics & Monitoring

- [ ] Visit site in incognito mode
- [ ] Check Umami dashboard shows page view
- [ ] Trigger a test error (console.error)
- [ ] Check Sentry dashboard shows error
- [ ] Verify Search Console shows sitemap submitted

**Success Criteria:**

- Umami tracking visitors ✅
- Google Search Console verified and monitoring ✅
- Sentry catching errors ✅
- Privacy policy published ✅
- All tools set to FREE plans ✅

---

## 🟢 Phase 6: Content Migration (0% → 100%)

**Estimated Time:** 20-40 hours (depending on content volume and cleanup needed)

**Content Sources:**

1. **fjp.es (WordPress)** - 144 book reviews already extracted in `/WordPress/output/` (Markdown format)
2. **sargatanacode.es** - Posts stored in database (Markdown format, requires database connection to extract)
3. **Gatsby site** - Existing content in current Gatsby implementation

**Migration Strategy:**

- Prioritize WordPress books (already in Markdown, just need transformation)
- Then sargatanacode posts (need extraction script first)
- Finally complete any remaining Gatsby content not yet migrated

### 🔲 Source 1: WordPress Books Migration (fjp.es)

**Status:** 🔴 NOT STARTED  
**Priority:** HIGHEST  
**Estimated Time:** 8-12 hours

**Current State:**

- **144 book reviews** already extracted in `/WordPress/output/` (Markdown files)
- Format needs transformation (WordPress shortcodes → Astro MDX)
- Images need to be downloaded and optimized
- Metadata needs to be extracted from content body into frontmatter

**Sample File Analysis:** `/WordPress/output/1984-george-orwell.md`

```yaml
# Current format
---
title: "1984, de George Orwell"
date: "2016-12-01"
---
![[titulo-foto]](images/1984-p.jpg)
[estrellas] [relectura]
**[titulo]**, de [autor]
**Páginas:** 352 **ISBN:** 9788420664262
**Comprar:** [papel id="842066426X"] [ebook id="B003CT38JG"]
**Editorial:** [editorial]
```

**Target format:**

```yaml
---
title: "1984"
date: 2016-12-01
language: "es"
post_slug: "1984-george-orwell"
excerpt: "En el año 1984 Londres es una ciudad lúgubre..."
score: "fav" # Extract from [estrellas]
author: "george-orwell"
publisher: "debolsillo" # Extract from [editorial]
genres: ["distopia", "ficcion"]
isbn: "9788420664262"
pages: 352
cover: "/images/books/1984-george-orwell.jpg"
book_cover: "/images/books/1984-george-orwell.jpg"
---
```

#### Task 6.0: Create WordPress to Astro Migration Script

**Priority:** Do this FIRST - it will save tons of manual work

- [ ] Create `/scripts/migrate-wordpress-books.js`
- [ ] Parse frontmatter + body content
- [ ] Extract metadata from body (pages, ISBN, editorial, etc.)
- [ ] Transform WordPress shortcodes to proper frontmatter fields
- [ ] Convert `[autor]`, `[titulo]`, `[editorial]` references
- [ ] Map rating `[estrellas]` to score (1-5 or "fav")
- [ ] Detect `[relectura]` flag and add to metadata
- [ ] Clean up body content (remove shortcodes)
- [ ] Generate proper slug from title + author
- [ ] Download images from WordPress if available
- [ ] Generate new MDX files in `src/content/books/es/`

**Script Structure:**

```javascript
// scripts/migrate-wordpress-books.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const INPUT_DIR = "../WordPress/output";
const OUTPUT_DIR = "./src/content/books/es";

// Mapping dictionaries
const PUBLISHER_MAP = {
  Debolsillo: "debolsillo",
  "Penguin Random House": "penguin-random-house",
  // ... add more as discovered
};

const AUTHOR_MAP = {
  "George Orwell": "george-orwell",
  "Stephen King": "stephen-king",
  // ... add more as discovered
};

function parseWordPressBook(filepath) {
  const content = fs.readFileSync(filepath, "utf8");
  const { data, content: body } = matter(content);

  // Extract metadata from body
  const pagesMatch = body.match(/\*\*Páginas:\*\* (\d+)/);
  const isbnMatch = body.match(/\*\*ISBN:\*\* (\d+)/);
  const editorialMatch = body.match(/\*\*Editorial:\*\* \[editorial\]/);

  // Parse shortcodes
  const hasReread = body.includes("[relectura]");
  const starsMatch = body.match(/\[estrellas\]/);

  // Transform
  return {
    ...data,
    language: "es",
    pages: pagesMatch ? parseInt(pagesMatch[1]) : null,
    isbn: isbnMatch ? isbnMatch[1] : null,
    // ... more transformations
  };
}

// Process all files
const files = fs.readdirSync(INPUT_DIR);
files.forEach((file) => {
  if (file.endsWith(".md")) {
    const book = parseWordPressBook(path.join(INPUT_DIR, file));
    // Write to OUTPUT_DIR
  }
});
```

**Run with:**

```bash
bun run scripts/migrate-wordpress-books.js --dry-run  # Preview changes
bun run scripts/migrate-wordpress-books.js  # Actually migrate
```

#### Task 6.1: WordPress Books - First Pass (20 books)

**Test the script with a small batch first**

- [ ] Run migration script on 20 books (2016-2017 books)
- [ ] Verify generated MDX files are correct
- [ ] Check that all frontmatter fields are populated
- [ ] Ensure images are downloaded
- [ ] Test that pages render correctly
- [ ] Fix any issues in the script

**Books to test (2016):**

- 1984, George Orwell
- Frankenstein, Mary Shelley
- El Principito
- El Hobbit
- Carrie, Stephen King
- (etc... pick 20 early books)

**Manual verification checklist per book:**

- [ ] Title correct
- [ ] Author slug matches existing author or new author created
- [ ] Publisher slug correct
- [ ] Genres assigned (manually add if needed)
- [ ] ISBN present
- [ ] Pages count correct
- [ ] Cover image exists and loads
- [ ] Excerpt is from synopsis section
- [ ] Body content clean (no shortcodes remaining)
- [ ] Score mapped correctly (stars → 1-5 or "fav")
- [ ] Reread flag captured if present

#### Task 6.2: Create Missing Authors from WordPress Books

- [ ] Extract all unique authors from 144 books
- [ ] Cross-reference with existing `src/content/authors/`
- [ ] Create missing author JSON files
- [ ] Add author bios where available (from WordPress `[bio]` shortcode)

**Script to extract authors:**

```bash
# Quick & dirty author extraction
grep -h "autor=" /home/fjpalacios/Code/WordPress/output/*.md | \
  sed 's/.*autor="\([^"]*\)".*/\1/' | \
  sort -u > authors-to-create.txt
```

#### Task 6.3: Create Missing Publishers from WordPress Books

- [ ] Extract all unique publishers from 144 books
- [ ] Cross-reference with existing `src/content/publishers/`
- [ ] Create missing publisher JSON files

#### Task 6.4: Assign Genres to WordPress Books

**This will be semi-manual**

WordPress books don't have genre metadata, needs to be assigned based on:

- Book content/synopsis
- Known book classification (fiction, horror, sci-fi, etc.)
- Can use AI assistance or manual classification

**Approach:**

- [ ] Group books by author (many Stephen King → horror)
- [ ] Classify by decade/era
- [ ] Use ISBN lookups for genre information
- [ ] Batch assign genres by category

**Tool suggestion:**
Create a helper script that presents each book and suggests genres:

```bash
bun run scripts/assign-genres-interactive.js
# Shows: "1984 by George Orwell"
# Suggests: ["distopia", "ficcion", "ciencia-ficcion"]
# Accept/modify/skip
```

#### Task 6.5: WordPress Books - Full Migration (144 books)

- [ ] Run migration script on ALL 144 books
- [ ] Spot-check 20 random books for correctness
- [ ] Build site and verify all pages render
- [ ] Check for broken links or missing images
- [ ] Fix any issues discovered

#### Task 6.6: WordPress Images Optimization

- [ ] Download all book cover images
- [ ] Optimize images (resize to 800px max width)
- [ ] Convert to WebP format
- [ ] Organize in `/public/images/books/` by year or alphabetically
- [ ] Update paths in MDX files

**Bulk image optimization:**

```bash
# Using sharp-cli or imagemagick
find public/images/books -name "*.jpg" -exec \
  convert {} -resize 800x -quality 85 -format webp {}.webp \;
```

**Success Criteria:**

- All 144 WordPress books migrated ✅
- All authors exist in system ✅
- All publishers exist in system ✅
- Genres assigned to all books ✅
- All images optimized and loading ✅
- All pages render without errors ✅
- SkillBarYear shows accurate data for all years ✅

---

### 🔲 Source 2: Sargatanacode Posts Migration

**Status:** 🔴 NOT STARTED  
**Priority:** HIGH  
**Estimated Time:** 6-10 hours

**Current State:**

- Content stored in sargatanacode.es database
- Posts are in Markdown format (already!)
- Need database connection to extract
- Unknown number of posts (estimate: 50-100?)

#### Task 6.7: Database Connection & Audit

- [ ] Connect to sargatanacode.es database
- [ ] Identify table structure (posts, metadata, etc.)
- [ ] Count total posts to migrate
- [ ] Check what metadata is available (date, categories, tags, language)
- [ ] Verify Markdown content quality
- [ ] Check for embedded images/assets

**Database connection script:**

```javascript
// scripts/extract-sargatanacode.js
import mysql from "mysql2/promise"; // or postgres, etc.

const connection = await mysql.createConnection({
  host: process.env.SARGATA_DB_HOST,
  user: process.env.SARGATA_DB_USER,
  password: process.env.SARGATA_DB_PASS,
  database: "sargatanacode",
});

// Query posts
const [rows] = await connection.execute('SELECT * FROM posts WHERE status = "published"');

console.log(`Found ${rows.length} posts to migrate`);
```

#### Task 6.8: Create Sargatanacode Extraction Script

- [ ] Create `/scripts/extract-sargatanacode-posts.js`
- [ ] Connect to database
- [ ] Extract all published posts
- [ ] Parse Markdown content
- [ ] Extract metadata (title, date, categories, tags, slug)
- [ ] Identify language (ES or EN)
- [ ] Find post translations (ES ↔ EN mapping via slug or ID)
- [ ] Download embedded images
- [ ] Generate frontmatter
- [ ] Save as MDX files in `src/content/posts/{lang}/`

**Output format:**

```yaml
---
title: "Cómo usar Git"
date: 2018-05-20
language: "es"
post_slug: "como-usar-git"
excerpt: "Tutorial básico de Git..."
categories: ["tutoriales", "desarrollo"]
tags: ["git", "control-versiones"]
image: "/images/posts/git-tutorial.jpg"
i18n_slug: "how-to-use-git" # If translation exists
---
Markdown content here...
```

#### Task 6.9: Sargatanacode - First Pass (10 posts)

**Test with small batch**

- [ ] Extract 10 posts from database
- [ ] Verify MDX files are correctly generated
- [ ] Check all frontmatter fields populated
- [ ] Ensure images downloaded
- [ ] Test posts render correctly
- [ ] Fix any issues in extraction script

#### Task 6.10: Map Sargatanacode Categories to Astro

- [ ] Extract all unique categories from database
- [ ] Map to existing Astro categories
- [ ] Create new categories if needed (maintain i18n)

**Example mapping:**

```
Sargatanacode → Astro
"Programming" → "desarrollo"
"Tutorials" → "tutoriales"
"Books" → "libros"
```

#### Task 6.11: Sargatanacode - Full Extraction

- [ ] Run extraction script on ALL posts
- [ ] Verify post count matches database
- [ ] Spot-check 10 random posts
- [ ] Build site and verify all render
- [ ] Fix any broken links or missing images

#### Task 6.12: Sargatanacode Images Optimization

- [ ] Download all post images from database or filesystem
- [ ] Optimize images (resize, compress)
- [ ] Convert to WebP
- [ ] Organize in `/public/images/posts/`
- [ ] Update paths in MDX files

**Success Criteria:**

- All sargatanacode posts extracted ✅
- All translations linked (ES ↔ EN) ✅
- Categories mapped correctly ✅
- All images optimized ✅
- All posts render without errors ✅

---

### 🔲 Source 3: Complete Gatsby Content (if needed)

**Status:** 🔴 NOT STARTED  
**Priority:** LOW (only if unique content exists)  
**Estimated Time:** 2-4 hours

**Purpose:** Verify no content is left behind in Gatsby that isn't in WordPress or Sargatanacode

#### Task 6.13: Gatsby Content Audit

- [ ] Compare Gatsby content folders vs WordPress/Sargatanacode
- [ ] Identify any unique posts/tutorials/books not in other sources
- [ ] Check for orphaned content (drafts, unpublished)
- [ ] Document what (if anything) needs manual migration

**Content to check:**

- `/content/books/` → Compare with WordPress books
- `/content/posts/` → Compare with Sargatanacode
- `/content/tutorials/` → Compare with Sargatanacode

#### Task 6.14: Migrate Gatsby-Only Content (if any found)

- [ ] Copy unique MDX files from Gatsby
- [ ] Update frontmatter to Astro format
- [ ] Verify metadata complete
- [ ] Test rendering

**Success Criteria:**

- All unique Gatsby content migrated (or confirmed none exists) ✅
- No content left behind ✅

---

### 🔲 Post-Migration Cleanup & Validation

**Status:** 🔴 NOT STARTED  
**Estimated Time:** 4-6 hours

#### Task 6.15: Content Validation

- [ ] Build site and verify page count
  - Expected: ~240+ pages (144 books + ~100 posts + existing)
- [ ] Test all book pages render
- [ ] Test all post pages render
- [ ] Test all tutorial pages render
- [ ] Check for 404 errors
- [ ] Verify all images load
- [ ] Test language switcher on all content

#### Task 6.16: Cross-Reference Links

- [ ] Check internal links between posts
- [ ] Verify author links work
- [ ] Test category/genre/publisher links
- [ ] Fix any broken links

#### Task 6.17: SEO Audit Post-Migration

- [ ] Run Lighthouse on sample pages
- [ ] Verify structured data on all content types
- [ ] Check meta descriptions are unique
- [ ] Ensure all images have alt text
- [ ] Validate sitemap includes all pages

#### Task 6.18: SkillBarYear Verification

- [ ] Check 2016 shows correct book count
- [ ] Check 2017 shows correct book count
- [ ] Check all years up to current
- [ ] Verify progress bars display correctly

**Success Criteria:**

- All content renders without errors ✅
- No broken links ✅
- SEO audit passes ✅
- SkillBarYear accurate for all years ✅
- Build completes in <10 seconds ✅

## 🚀 Phase 7: Launch Preparation (0% → 100%)

**Estimated Time:** 4-6 hours

### 🔲 Pre-Launch Checklist

**Status:** 🔴 NOT STARTED

#### Task 7.1: Final Testing

- [ ] Run full E2E test suite on production build
- [ ] Test all critical user flows
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Test both languages (ES and EN)

#### Task 7.2: SEO Final Check

- [ ] Verify sitemap.xml is generated
- [ ] Check robots.txt allows crawling
- [ ] Test all meta tags are present
- [ ] Validate structured data with Google Rich Results
- [ ] Check canonical URLs on all pages
- [ ] Verify hreflang tags on bilingual content

#### Task 7.3: Performance Final Check

- [ ] Run Lighthouse on production build
- [ ] Ensure all pages score >90
- [ ] Check image optimization
- [ ] Verify lazy loading works
- [ ] Test Core Web Vitals

#### Task 7.4: Accessibility Final Check

- [ ] Run axe DevTools on all page types
- [ ] Test keyboard navigation
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Verify ARIA labels
- [ ] Check color contrast

#### Task 7.5: Content Review

- [ ] Proofread all migrated content
- [ ] Check for broken links
- [ ] Verify all images have alt text
- [ ] Check author bios are complete
- [ ] Verify contact information is current

#### Task 7.6: Analytics Verification

- [ ] Confirm Umami is tracking
- [ ] Verify Google Search Console is set up
- [ ] Test Sentry error tracking
- [ ] Check privacy policy is linked

#### Task 7.7: Merge to Master

- [ ] Ensure all tests pass
- [ ] Create comprehensive PR from `feature/blog-foundation` to `master`
- [ ] Get review (if applicable)
- [ ] Merge PR
- [ ] Delete feature branch

**PR Description Template:**

```markdown
# Blog Migration - Complete

This massive PR completes the migration from Gatsby to Astro.

## Summary of Changes

### Features Added

- Complete blog system with posts, tutorials, and books
- Multilingual support (ES/EN) with i18n routing
- Rich taxonomy system (categories, genres, publishers, authors, series, courses)
- Comprehensive SEO (Open Graph, Twitter Cards, JSON-LD)
- RSS feeds for all content types
- Search functionality (Pagefind)
- Breadcrumbs with schema.org markup
- Performance optimizations
- Analytics and monitoring (Umami, GSC, Sentry)

### Content Migrated

- X posts (ES + EN)
- X tutorials (ES + EN)
- X book reviews
- X authors
- X categories
- X genres

### Testing

- 301 unit tests (97.72% coverage)
- 80+ E2E tests
- Performance score >90 on all pages
- Accessibility WCAG 2.1 AA compliant

### Breaking Changes

None. This is a complete rewrite but maintains URL structure for SEO.

Closes #X
```

#### Task 7.8: Deploy to GitHub Pages

- [ ] Configure GitHub Pages in repo settings
- [ ] Set custom domain (fjp.es)
- [ ] Update DNS settings
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Enable HTTPS (automatic with GitHub Pages)

**GitHub Pages Configuration:**

```
Settings → Pages
- Source: Deploy from a branch
- Branch: master
- Folder: / (root)
- Custom domain: fjp.es
- Enforce HTTPS: ✓
```

**DNS Configuration (at your domain registrar):**

```
Type: CNAME
Host: www
Value: fjpalacios.github.io

Type: A (apex domain)
Host: @
Values:
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
```

#### Task 7.9: Post-Launch Monitoring (First 48 Hours)

- [ ] Monitor Sentry for errors
- [ ] Check Google Search Console for crawl errors
- [ ] Review Umami analytics for traffic patterns
- [ ] Test site on production URL
- [ ] Share with friends/colleagues for feedback

#### Task 7.10: Submit to Search Engines

- [ ] Google Search Console: Submit sitemap
- [ ] Bing Webmaster Tools: Submit site
- [ ] Request re-indexing for important pages

**Success Criteria:**

- Site live on fjp.es ✅
- HTTPS enabled ✅
- All content accessible ✅
- No critical errors in Sentry ✅
- Google Search Console showing data ✅
- Analytics tracking visitors ✅

---

## 📈 Post-Launch Phase (Ongoing)

### Content Creation

- [ ] Write new posts regularly
- [ ] Add new book reviews as you read
- [ ] Update tutorials with new versions/techniques
- [ ] Create new courses

### SEO Monitoring

- [ ] Weekly: Check Google Search Console
- [ ] Monthly: Review top-performing content
- [ ] Quarterly: Update old content for freshness
- [ ] Monitor backlinks and mentions

### Performance Maintenance

- [ ] Monthly: Run Lighthouse audits
- [ ] Quarterly: Review and optimize images
- [ ] Update dependencies regularly
- [ ] Monitor bundle size

### Content Improvements

- [ ] Add comments system (optional)
- [ ] Add related posts suggestions
- [ ] Create "Popular Posts" widget
- [ ] Add newsletter subscription (optional)

---

## 🎉 Completion Criteria

This roadmap is complete when:

✅ All phases marked as 100%  
✅ All E2E tests passing  
✅ Performance score >90 on all pages  
✅ Site live on fjp.es  
✅ All content migrated from Gatsby  
✅ Analytics tracking visitors  
✅ No critical errors in production

---

## 📊 Progress Tracking

Update this section as tasks are completed:

**Last Updated:** December 23, 2025

| Phase                      | Progress | Status         |
| -------------------------- | -------- | -------------- |
| Phase 1: Foundation        | 100%     | ✅ Complete    |
| Phase 2: Content Migration | 5%       | 🟡 In Progress |
| Phase 3: i18n & Components | 100%     | ✅ Complete    |
| Phase 4: Routing & Pages   | 100%     | ✅ Complete    |
| Phase 5: Production Ready  | 60%      | 🟡 In Progress |
| Phase 6: Content Complete  | 0%       | 🔴 Not Started |
| Phase 7: Launch            | 0%       | 🔴 Not Started |

**Overall:** 60% Complete (95% code ready, 5% content migrated)

---

## 🆘 Need Help?

If stuck on any task:

1. Check documentation: `docs/BLOG_MIGRATION_SPEC.md`
2. Review progress report: `docs/BLOG_MIGRATION_PROGRESS.md`
3. Ask for clarification in next session

---

**Remember:** This is a marathon, not a sprint. Quality over speed! 🚀
