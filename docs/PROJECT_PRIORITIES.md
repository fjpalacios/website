# Project Priorities and Strategy

**Last Updated:** December 29, 2025  
**Status:** 📋 Active Planning Document

---

## 🎯 Current Priority Order

### ✅ Phase 5.1 - COMPLETE

Router refactoring (magic strings elimination, error handling, taxonomies loop, schema mapper)

### 🔄 Phase 5.3 - IN PROGRESS

Router testing (unit tests for generators, E2E routing tests, integration tests)

### ⏳ Phase 5.2 - NEXT

Router performance optimization

### ⏳ Phase 5.4 - AFTER 5.2

Router documentation (JSDoc, update docs)

---

## 🚧 CODE COMPLETE CHECKPOINT

**⚠️ DO NOT START PHASE 6 UNTIL ALL ABOVE PHASES COMPLETE**

**Rationale:**

- ✅ Ensure all router code is stable, tested, and documented
- ✅ Create clean PR for blog feature (without 200+ content files)
- ✅ Separate infrastructure from content
- ✅ Enable safe rollback if needed

---

## 📦 Phase 6 - Content Migration (AFTER Code Complete)

**Order:**

1. Complete Phases 5.2, 5.3, 5.4
2. Create PR for blog feature
3. Review and merge to main
4. THEN start content migration
5. Add content incrementally (not all at once)

**Why Wait:**

- No rush - Content already public at fjp.es and sargantanacode.es
- This is a consolidation + redesign, not new content launch
- Cleaner git history
- Easier to review changes
- Safer deployment strategy

---

## 🌍 Domain Strategy

### Current State

- **fjp.es:** WordPress site (will continue running during transition)
- **sargantanacode.es:** Separate site (will be phased out eventually)

### Target State

- **fjp.es:** Unified Astro site with all content
- **sargantanacode.es:** All traffic redirected to fjp.es (301 permanent redirects)

### Timeline

1. **Now:** Both sites independent
2. **Phase 6:** Migrate content to new fjp.es
3. **Phase 7:** Deploy new fjp.es to production
4. **Phase 8:** Set up redirects from old URLs
5. **Phase 9:** Set up redirects from sargantanacode.es
6. **Phase 10:** Monitor for 3-6 months ("tiempo prudencial")
7. **Phase 11:** Shut down sargantanacode.es

---

## 🔄 Critical Features to Implement

### 1. Root Language Redirect (High Priority)

**Current:** `/` → `/es/` (static redirect)

**Required:** Dynamic language detection

- Browser language ES → `/es/`
- Browser language EN → `/en/`
- **Other languages → `/en/`** (English default for non-Spanish speakers)
- Remember preference (cookie)

**Implementation:** Cloudflare Edge Worker (recommended) or Astro middleware

**Timeline:** Implement during Phase 5.x (before content migration)

---

### 2. WordPress URL Redirects (Critical Priority)

**Problem:** Old WordPress URLs will break when migrating to Astro

**Example:**

```
Old: https://fjp.es/libros-leidos-durante-2017/
New: https://fjp.es/es/publicaciones/libros-leidos-durante-2017/
```

**Solution:** 301 permanent redirects for ALL old URLs

**Actions Required:**

1. Export all WordPress permalinks from fjp.es
2. Map old URLs → new Astro URLs
3. Implement redirects (\_redirects file or astro.config.mjs)
4. Test thoroughly
5. Update sitemap.xml
6. Submit to Google Search Console

**Timeline:** Implement during Phase 6 (content migration)

**Impact:** Critical for SEO - old Google results must not 404

---

### 3. SargantanaCode Domain Redirects (Important Priority)

**Problem:** sargantanacode.es content will move to fjp.es

**Example:**

```
Old: https://sargantanacode.es/que-es-git/
New: https://fjp.es/es/tutoriales/que-es-git/
```

**Solution:** Domain-level 301 redirects (entire domain)

**Actions Required:**

1. Map all sargantanacode.es URLs → fjp.es URLs
2. Configure domain-level redirect at hosting provider
3. Monitor traffic for 3-6 months
4. Shut down domain when traffic minimal

**Timeline:** After Phase 6 (once content live on fjp.es)

**Impact:** Important for SEO + user experience

---

## 📋 Technical Decisions ✅ RESOLVED

### Q1: WordPress Permalink Structure

**Question:** What is the current fjp.es WordPress permalink structure?

**Available Data:**

- Sitemap index: `https://fjp.es/sitemap.xml`
- Export XML: `/home/fjpalacios/Code/WordPress/entries.xml`

**Action:** Parse sitemap during Phase 6  
**Likely structure:** `/%postname%/` (simple slug-based)

---

### Q2: Hosting Platform ✅ DECIDED

**Decision:** **Cloudflare Pages** (free tier)

**Rationale:**

- ✅ Free hosting with unlimited bandwidth
- ✅ Edge functions for language detection
- ✅ Advanced redirects (\_redirects file)
- ✅ Global CDN included
- ✅ Works with DonDominio domains (current registrar)
- ✅ Better redirect handling than GitHub Pages

**Alternative:** GitHub Pages (simpler but limited redirects)

---

### Q3: SSR vs Static ✅ DECIDED

**Decision:** **Astro Static + Cloudflare Edge Functions**

**Rationale:**

- ✅ Pages are static (fast, cacheable)
- ✅ Edge functions for dynamic features (language detection)
- ✅ No SSR overhead for content
- ✅ Best of both worlds: static performance + dynamic UX

**Configuration:**

```typescript
// astro.config.mjs
export default defineConfig({
  output: "static", // Static site generation
  // Edge functions via Cloudflare _worker.js
});
```

---

### Q4: SargantanaCode URL Inventory ✅ ANSWERED

**Answer:** Ruby on Rails app, sitemap at `https://sargantanacode.es/sitemap.xml.gz`

**Resources:**

- Repository: `/home/fjpalacios/Code/SargantanaCode/web-ror/`
- Routes: `config/routes.rb`
- Sitemap: Download and parse during Phase 7+

**Action:** `curl https://sargantanacode.es/sitemap.xml.gz | gunzip`

---

## 📚 Documentation References

- **Migration Strategy:** `docs/MIGRATION_STRATEGY_AND_REDIRECTS.md` (full details)
- **Roadmap:** `docs/ROADMAP.md`
- **Blog Progress:** `docs/BLOG_MIGRATION_PROGRESS.md`

---

## ✅ Key Takeaways

1. **Code first, content later** - Complete Phases 5.2, 5.3, 5.4 before Phase 6
2. **No rush on content** - Already public, this is consolidation not launch
3. **Redirects are critical** - Must not break existing Google results
4. **301 redirects for SEO** - Permanent redirects for all old URLs
5. **Dynamic language detection** - Improve UX with browser language detection
6. **Incremental approach** - Add content gradually after infrastructure solid
7. **Monitor before shutdown** - Keep sargantanacode.es alive 3-6 months during transition

---

**Next Action:** Continue with Phase 5.3 (Router Testing)
