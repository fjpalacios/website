# Website Roadmap

**Last Updated:** January 3, 2026  
**Branch:** `feature/blog-foundation`

## Current Status

### ✅ Code: 100% Complete

- Unified router handling 86 dynamic paths
- 25 reusable page templates
- Full i18n support (ES/EN)
- 1,545 tests passing (1,118 unit + 427 E2E)
- Lighthouse 100/100 on all metrics
- Build: 86 pages in ~9 seconds

### 🟡 Content: 5% Complete

- Test data only (14 books ES, 1 book EN, 2 posts, 3 tutorials)
- **Pending migration:**
  - 144 book reviews from WordPress
  - ~50-100 posts from Sargatanacode

### 🔴 Launch: Not Started

---

## Phases

### Phase 1-5: Foundation & Features ✅ COMPLETE

**Status:** 100% Complete (Dec 20-30, 2025)

All core features implemented:

- Unified routing system
- SEO (Open Graph, JSON-LD, sitemaps)
- RSS feeds
- Search (Pagefind)
- Accessibility (WCAG AAA)
- Performance optimization
- Testing infrastructure

### Phase 6: Content Migration 🔴

**Status:** Not Started  
**Priority:** HIGH  
**Estimated:** 20-40 hours

#### 6.1 WordPress Books (144 reviews)

**Location:** `/WordPress/output/` (already extracted as Markdown)

Tasks:

- [ ] Create classification script (books vs posts vs tutorials)
- [ ] Transform WordPress shortcodes to MDX
- [ ] Extract metadata (ISBN, pages, publisher, etc.)
- [ ] Download and optimize images
- [ ] Create missing authors/publishers
- [ ] Assign genres
- [ ] Validate all pages render

**Estimated:** 12-20 hours

#### 6.2 Sargatanacode Posts (~50-100 posts)

**Location:** Rails database (needs extraction)

Tasks:

- [ ] Create database extraction script
- [ ] Transform to MDX format
- [ ] Map categories
- [ ] Download images
- [ ] Link translations (ES ↔ EN)
- [ ] Validate rendering

**Estimated:** 6-10 hours

#### 6.3 Gatsby Content Audit

Tasks:

- [ ] Compare Gatsby vs WordPress/Sargatanacode
- [ ] Identify orphaned content
- [ ] Migrate any unique content

**Estimated:** 2-4 hours

### Phase 7: Launch 🔴

**Status:** Not Started  
**Priority:** After content migration  
**Estimated:** 6-8 hours

Tasks:

- [ ] Deploy to Cloudflare Pages
- [ ] Configure DNS (fjp.es)
- [ ] Setup redirects (WordPress → Astro)
- [ ] Install analytics (Umami + Google Search Console)
- [ ] Create Privacy Policy page
- [ ] Final cross-browser/device testing
- [ ] Monitor performance and errors

---

## Future Enhancements (Post-Launch)

### Optional: Third Language Support

Add Catalan, French, or Portuguese support.

**Effort:** 8-12 hours (architecture already ready)

### Optional: Analytics Dashboard

Custom analytics dashboard with:

- Top pages
- Reading time stats
- Popular books/tutorials
- Referrer sources

**Effort:** 10-15 hours

---

## Key Achievements

### Unified Router Architecture

**Before:**

- 52 duplicate files (26 ES + 26 EN)
- ~4,500 lines of code
- 50% code duplication

**After:**

- 1 unified router
- 25 reusable templates
- ~3,200 lines of code (-29%)
- 0% duplication

### Quality Metrics

- **Lighthouse:** 100/100 (all categories)
- **WCAG:** Level AAA compliant
- **Test Coverage:** 97%+ statements, 90%+ branches
- **TypeScript:** 0 errors (strict mode)
- **ESLint:** 0 errors, 0 warnings
- **Build Speed:** ~9 seconds for 86 pages

---

## Next Steps

1. **Content Migration** - Create WordPress classification script
2. **Launch** - After content is migrated
3. **Monitor** - Analytics and error tracking
