# Migration Strategy and Redirects Plan

**Date:** December 29, 2025  
**Status:** 📋 Planning Phase  
**Priority:** 🔴 Critical for Production Launch

---

## 🎯 Executive Summary

### Key Decisions

| Decision                | Choice                                          | Rationale                                          |
| ----------------------- | ----------------------------------------------- | -------------------------------------------------- |
| **Hosting**             | Cloudflare Pages (free tier)                    | Edge functions + CDN + advanced redirects          |
| **Architecture**        | Astro Static + Cloudflare Edge Functions        | Best performance + dynamic features where needed   |
| **Root Redirect**       | `/` → `/es` (ES browsers) or `/en` (all others) | Spanish only for Spanish speakers, English default |
| **WordPress Redirects** | 301 permanent via `_redirects` file             | SEO-friendly, preserves Google rankings            |
| **SargantanaCode**      | 301 permanent via Cloudflare Page Rule          | Domain-level wildcard redirect                     |
| **CDN**                 | Cloudflare (free)                               | No current CDN, Cloudflare adds significant value  |
| **Domains**             | DonDominio → Cloudflare DNS                     | Keep DonDominio as registrar, use Cloudflare DNS   |

### Current State

- **fjp.es:** WordPress site, sitemap at `https://fjp.es/sitemap.xml`
- **sargantanacode.es:** Ruby on Rails, sitemap at `https://sargantanacode.es/sitemap.xml.gz`
- **Hosting:** Both at DonDominio, no CDN
- **Content:** ~200+ pieces to migrate (WordPress + Rails)

### Migration Phases

1. ✅ **Phase 5.1:** Router refactoring (COMPLETE)
2. 🔄 **Phase 5.3:** Router testing (IN PROGRESS)
3. ⏳ **Phase 5.2:** Router performance
4. ⏳ **Phase 5.4:** Router documentation
5. 🚧 **CODE COMPLETE CHECKPOINT** ← Must complete before Phase 6
6. ⏳ **Phase 6:** Content migration
7. ⏳ **Phase 7:** Deploy to Cloudflare Pages
8. ⏳ **Phase 8:** Set up all redirects
9. ⏳ **Phase 9:** Monitor for 3-6 months
10. ⏳ **Phase 10:** Shut down sargantanacode.es

---

## 📋 Table of Contents

0. [Executive Summary](#-executive-summary)
1. [Current Infrastructure](#current-infrastructure)
2. [Migration Order Strategy](#migration-order-strategy)
3. [Redirect Requirements](#redirect-requirements)
4. [Root Redirect (/ → /es or /en)](#root-redirect----es-or-en)
5. [WordPress Permalink Migration](#wordpress-permalink-migration)
6. [SargantanaCode Domain Migration](#sargantanacode-domain-migration)
7. [Technical Implementation](#technical-implementation)
8. [SEO Considerations](#seo-considerations)
9. [Open Questions & Answers](#open-questions--answers)
10. [Implementation Checklist](#implementation-checklist)

---

## Migration Order Strategy

### ✅ Phase Order (IMPORTANT)

**DO NOT start Phase 6 (Content Migration) until Phases 5.2, 5.3, and 5.4 are complete!**

```
Current: Phase 5.1 ✅ COMPLETE (Router Refactoring - Magic Strings)
Next:    Phase 5.3 🔄 IN PROGRESS (Router Testing)
Then:    Phase 5.2 ⏳ PENDING (Router Performance)
Then:    Phase 5.4 ⏳ PENDING (Router Documentation)
------- CODE COMPLETE CHECKPOINT -------
Then:    Phase 6   ⏳ PENDING (Content Migration)
Then:    Create PR for blog feature
Then:    Merge to main
------- CONTENT MIGRATION CHECKPOINT -------
Finally: Add remaining content incrementally
```

### 🎯 Rationale

**Why finish code first:**

1. ✅ **Stability:** All router code tested and documented
2. ✅ **Clean PR:** Blog feature PR without 200+ content files noise
3. ✅ **Incremental content:** Add content after core infrastructure is solid
4. ✅ **No rush:** Content already public at fjp.es and sargantanacode.es

**Why separate content migration:**

1. ✅ **Smaller PRs:** Easier to review
2. ✅ **Rollback safety:** Can revert content without affecting code
3. ✅ **Iterative approach:** Test production with small content batches first

---

## Current Infrastructure

### 🌐 Existing Sites

#### fjp.es (WordPress)

- **CMS:** WordPress
- **Sitemap:** https://fjp.es/sitemap.xml (sitemap index)
- **Content:** Blog posts, book reviews, tutorials
- **Status:** Active - will continue running during transition

#### sargantanacode.es (Ruby on Rails)

- **Framework:** Ruby on Rails
- **Repository:** `/home/fjpalacios/Code/SargantanaCode/web-ror/`
- **Sitemap:** https://sargantanacode.es/sitemap.xml.gz
- **Content:** Programming tutorials, courses
- **Status:** Active - will be phased out after migration

### 🏠 Domain Hosting

**Registrar:** DonDominio (both fjp.es and sargantanacode.es)

**Current Setup:**

- ✅ Both domains registered at DonDominio
- ❌ No CDN currently configured
- ❌ No edge functions/workers active

### 🚀 Target Hosting Strategy

#### ✅ Recommended: Cloudflare Pages (Free Tier)

**Why Cloudflare Pages:**

- ✅ **Free hosting** with unlimited bandwidth (no quotas like Netlify/Vercel)
- ✅ **Edge functions** support for dynamic language detection
- ✅ **Advanced redirects** via `_redirects` file (301 permanent redirects)
- ✅ **Global CDN** included (285+ cities worldwide)
- ✅ **Works with DonDominio domains** (current registrar)
- ✅ **Better redirect handling** than GitHub Pages
- ✅ **No build limits** (GitHub Pages has 10 builds/hour limit)
- ✅ **Preview deployments** for PRs
- ✅ **Automatic HTTPS** with custom domains

**Comparison with alternatives:**

| Feature                  | Cloudflare Pages | GitHub Pages | Netlify     | Vercel      |
| ------------------------ | ---------------- | ------------ | ----------- | ----------- |
| Free tier bandwidth      | ✅ Unlimited     | ✅ 100GB/mo  | ⚠️ 100GB/mo | ⚠️ 100GB/mo |
| Edge functions           | ✅ Yes           | ❌ No        | ✅ Yes      | ✅ Yes      |
| Advanced redirects       | ✅ Yes           | ⚠️ Limited   | ✅ Yes      | ✅ Yes      |
| Global CDN               | ✅ 285+ cities   | ✅ Yes       | ✅ Yes      | ✅ Yes      |
| Build time limit         | ✅ 20min         | ⚠️ 10min     | ✅ 15min    | ⚠️ 45min    |
| Cost after free tier     | $0 (truly free)  | $0           | Paid plans  | Paid plans  |
| DonDominio compatibility | ✅ Yes           | ✅ Yes       | ✅ Yes      | ✅ Yes      |
| 301 redirect support     | ✅ Excellent     | ⚠️ Limited   | ✅ Good     | ✅ Good     |

#### Why NOT GitHub Pages

While GitHub Pages is simpler, it has critical limitations for this project:

- ❌ **No edge functions:** Can't do dynamic language detection at edge
- ❌ **Limited redirects:** Redirects require workarounds (meta refresh or client-side JS)
- ❌ **No 301 support:** Can't do proper SEO-friendly permanent redirects
- ❌ **Build limits:** 10 builds per hour (problematic for CI/CD)
- ❌ **No `_redirects` file:** Must use Jekyll plugins or client-side solutions

#### Why NOT Netlify/Vercel

Both are excellent but have restrictive free tiers:

- ⚠️ **100GB bandwidth limit** per month (Cloudflare = unlimited)
- ⚠️ **Paid plans required** after free tier (Cloudflare stays free)
- ✅ Similar features otherwise (edge functions, redirects, CDN)

### 💡 Final Recommendation

**Use Cloudflare Pages** for this project because:

1. **Better redirect handling** (critical for SEO during WordPress migration)
2. **Edge functions** for dynamic language detection (UX improvement)
3. **Unlimited bandwidth** (no surprises, truly free forever)
4. **Superior CDN** (285+ cities = better global performance)
5. **No build limits** (better for CI/CD workflows)

**Implementation approach:**

1. Host main site on **Cloudflare Pages**
2. Use DonDominio DNS → Point to Cloudflare
3. Use Cloudflare edge workers for language detection
4. Use `_redirects` file for WordPress/SargantanaCode redirects
5. Keep GitHub repo as source of truth

**See:** `docs/CLOUDFLARE_ARCHITECTURE_FAQ.md` for detailed technical analysis

---

## Redirect Requirements

### Summary of Needs

| Source                     | Target                    | Type                   | Priority     |
| -------------------------- | ------------------------- | ---------------------- | ------------ |
| `/`                        | `/es` or `/en` (dynamic)  | 302/Language detection | 🔴 Critical  |
| `fjp.es/old-wordpress-url` | `fjp.es/es/new-astro-url` | 301 Permanent          | 🔴 Critical  |
| `sargantanacode.es/*`      | `fjp.es/es/*`             | 301 Permanent          | 🟡 Important |

---

## Root Redirect (/ → /es or /en)

### Current Behavior

Based on analysis, root `/` currently redirects to `/es` (Spanish as default).

**Question:** Is this static or dynamic?

### Desired Behavior

**Dynamic language detection:**

1. **User visits `/`**
2. **Check `Accept-Language` header** from browser
3. **If Spanish detected** (`es`, `es-ES`, `es-MX`, etc.) → Redirect to `/es/`
4. **If English detected** (`en`, `en-US`, `en-GB`, etc.) → Redirect to `/en/`
5. **If other language** (any non-Spanish language) → Redirect to `/en/` (default fallback for non-Spanish speakers)
6. **Remember preference** (cookie/localStorage for subsequent visits)

**Rationale:** `/es/` only for Spanish speakers, `/en/` for everyone else (likely to understand English better than Spanish even if not native)

### Technical Implementation Options

#### Option 1: Astro Middleware (Recommended)

**File:** `src/middleware.ts` (or `src/middleware/index.ts`)

```typescript
// Pseudo-code
export function onRequest({ request, redirect, cookies }) {
  const url = new URL(request.url);

  // Only handle root path
  if (url.pathname !== "/") {
    return; // Let other routes pass through
  }

  // Check if user has language preference cookie
  const savedLang = cookies.get("preferred-language");
  if (savedLang && (savedLang === "es" || savedLang === "en")) {
    return redirect(`/${savedLang}/`, 302);
  }

  // Parse Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  const preferredLang = parseAcceptLanguage(acceptLanguage);

  if (preferredLang === "es") {
    cookies.set("preferred-language", "es", { path: "/", maxAge: 31536000 });
    return redirect("/es/", 302);
  } else if (preferredLang === "en") {
    cookies.set("preferred-language", "en", { path: "/", maxAge: 31536000 });
    return redirect("/en/", 302);
  }

  // Default fallback (any non-Spanish language → /en/)
  return redirect("/en/", 302);
}

function parseAcceptLanguage(header: string): "es" | "en" | null {
  // Parse header like: "es-ES,es;q=0.9,en;q=0.8"
  // Return 'es' if Spanish detected, otherwise 'en' (default for non-Spanish speakers)
}
```

**Redirect Type:** `302 Found` (Temporary) - Allows changing preference

**Pros:**

- ✅ Works in Astro SSR or Static mode
- ✅ No external dependencies
- ✅ Full control over logic

**Cons:**

- ⚠️ Requires SSR or Edge function (not pure static)

#### Option 2: Client-side JavaScript (Static fallback)

**File:** `src/pages/index.astro`

```astro
---
// This page only shows if JS disabled
---

<script>
  // Redirect based on navigator.language
  const browserLang = navigator.language.split("-")[0];
  const targetLang = browserLang === "es" ? "es" : "en";
  window.location.href = `/${targetLang}/`;
</script>

<noscript>
  <meta http-equiv="refresh" content="0; url=/en/" />
</noscript>
```

**Pros:**

- ✅ Works with static hosting
- ✅ No SSR required

**Cons:**

- ❌ Flash of content (user sees root page briefly)
- ❌ SEO implications (search engines may not execute JS)
- ❌ Doesn't work with JS disabled

#### Option 3: Cloudflare Workers / Edge Functions (Recommended for Cloudflare Pages)

**File:** Cloudflare Worker or `_worker.js`

```javascript
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Only handle root path
  if (url.pathname !== "/") {
    return context.next();
  }

  // Check cookie first
  const cookie = request.headers.get("Cookie");
  if (cookie?.includes("preferred-language=es")) {
    return Response.redirect(new URL("/es/", url), 302);
  }
  if (cookie?.includes("preferred-language=en")) {
    return Response.redirect(new URL("/en/", url), 302);
  }

  // Parse Accept-Language header
  const acceptLanguage = request.headers.get("Accept-Language") || "";
  const isSpanish = /^es\b/i.test(acceptLanguage);

  const targetLang = isSpanish ? "es" : "en";
  const response = Response.redirect(new URL(`/${targetLang}/`, url), 302);

  // Set cookie
  response.headers.set("Set-Cookie", `preferred-language=${targetLang}; Path=/; Max-Age=31536000; SameSite=Lax`);

  return response;
}
```

**Pros:**

- ✅ Works with Cloudflare Pages (free tier)
- ✅ No flash of content
- ✅ Extremely fast (edge-level)
- ✅ No SSR overhead

**Cons:**

- ⚠️ Cloudflare-specific (but Cloudflare Pages is free)

**Recommended:** Option 3 (Cloudflare Workers) if using Cloudflare Pages (recommended hosting).

---

## WordPress Permalink Migration

### Problem Statement

WordPress uses different URL structures than Astro. Examples:

**WordPress (fjp.es):**

```
https://fjp.es/libros-leidos-durante-2017/
https://fjp.es/reto-literario-stephen-king/
https://fjp.es/redireccionar-htaccess-http-https/
```

**Astro (new structure):**

```
https://fjp.es/es/publicaciones/libros-leidos-durante-2017/
https://fjp.es/es/publicaciones/reto-literario-stephen-king/
https://fjp.es/es/tutoriales/redireccionar-htaccess-http-https/
```

**If no redirects:** Old Google results → 404 errors → Lost traffic + Bad SEO

### Required Actions

#### Step 1: Audit WordPress Permalinks

**TODO:** Export full list of WordPress URLs

**Available Resources:**

1. ✅ WordPress sitemap index: `https://fjp.es/sitemap.xml` (sitemap index - contains links to individual sitemaps)
2. ✅ WordPress export XML: `/home/fjpalacios/Code/WordPress/entries.xml` (already extracted)
3. Google Search Console (if access available)
4. WordPress database export (if access available)

**Action:** Parse sitemap.xml to get complete URL list, cross-reference with entries.xml

**Deliverable:** CSV file with:

```csv
old_url,new_url,type
/libros-leidos-durante-2017/,/es/publicaciones/libros-leidos-durante-2017/,post
/reto-literario-stephen-king/,/es/publicaciones/reto-literario-stephen-king/,post
/redireccionar-htaccess-http-https/,/es/tutoriales/redireccionar-htaccess-http-https/,tutorial
/libro/1984-george-orwell/,/es/libros/1984-george-orwell/,book
```

#### Step 2: Implement Redirects

**Option A: Astro Redirects (astro.config.mjs)**

```typescript
// astro.config.mjs
export default defineConfig({
  redirects: {
    "/libros-leidos-durante-2017/": "/es/publicaciones/libros-leidos-durante-2017/",
    "/reto-literario-stephen-king/": "/es/publicaciones/reto-literario-stephen-king/",
    // ... etc (could be hundreds of entries)
  },
});
```

**Redirect Type:** `301 Moved Permanently` (for SEO)

**Pros:**

- ✅ Built-in Astro feature
- ✅ Works in static mode
- ✅ SEO-friendly

**Cons:**

- ⚠️ Large config file if 200+ redirects
- ⚠️ Manual maintenance

**Option B: Middleware Pattern Matching**

```typescript
// src/middleware.ts
const wordpressRedirects = {
  "/libros-leidos-durante-": "/es/publicaciones/libros-leidos-durante-",
  "/reto-literario-": "/es/publicaciones/reto-literario-",
  "/libro/": "/es/libros/",
  // Pattern-based redirects
};

export function onRequest({ request, redirect }) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Check if path matches WordPress pattern
  for (const [oldPattern, newPattern] of Object.entries(wordpressRedirects)) {
    if (path.startsWith(oldPattern)) {
      const newPath = path.replace(oldPattern, newPattern);
      return redirect(newPath, 301);
    }
  }
}
```

**Pros:**

- ✅ More flexible (pattern matching)
- ✅ Smaller config
- ✅ Can handle dynamic cases

**Cons:**

- ⚠️ Requires SSR/hybrid mode

**Option C: \_redirects file (Netlify/Cloudflare Pages)**

```
# _redirects file (in public/ directory)
/libros-leidos-durante-2017/   /es/publicaciones/libros-leidos-durante-2017/   301
/reto-literario-stephen-king/  /es/publicaciones/reto-literario-stephen-king/  301
/libro/*                       /es/libros/:splat                                301
```

**Pros:**

- ✅ Platform-native (fast)
- ✅ Works with static hosting
- ✅ Wildcard support

**Cons:**

- ⚠️ Platform-specific (Netlify vs Vercel vs Cloudflare different formats)

**Recommended:** Use **Option C** (\_redirects file) with **Cloudflare Pages** (recommended hosting platform - free tier includes edge functions + CDN).

#### Step 3: Validate Redirects

**Testing checklist:**

- [ ] Test old URLs redirect to new URLs
- [ ] Verify 301 status code (not 302)
- [ ] Check redirect chain length (should be 1 hop, not multiple)
- [ ] Test with curl: `curl -I https://fjp.es/old-url/`
- [ ] Submit updated sitemap to Google Search Console

---

## SargantanaCode Domain Migration

### Problem Statement

**Current:**

- `sargantanacode.es` has its own content (tutorials, posts)
- Content will be migrated to `fjp.es/es/tutoriales/` and `/es/publicaciones/`

**Goal:**

- Keep `sargantanacode.es` alive temporarily
- Redirect all traffic to `fjp.es` eventually
- Use 301 redirects for SEO juice transfer

### Timeline

```
Now:        sargantanacode.es ACTIVE + fjp.es ACTIVE (both separate)
Phase 6:    Migrate content to fjp.es
Phase 7:    Test new fjp.es in production
Phase 8:    Set up redirects from sargantanacode.es → fjp.es
Phase 9:    Monitor traffic for "tiempo prudencial" (3-6 months?)
Phase 10:   Shut down sargantanacode.es (domain can expire or park)
```

### Required Actions

#### Step 1: Map SargantanaCode URLs

**Available Resources:**

- ✅ Ruby on Rails app repository: `/home/fjpalacios/Code/SargantanaCode/web-ror/`
- ✅ Sitemap: `https://sargantanacode.es/sitemap.xml.gz` (gzipped sitemap)
- ✅ Routes file: `config/routes.rb` (Rails routing configuration)

**Action Required:**

1. Download and decompress sitemap: `curl https://sargantanacode.es/sitemap.xml.gz | gunzip > sargantanacode-urls.xml`
2. Parse sitemap to extract all URLs
3. Map each URL to new fjp.es equivalent
4. Consider URL structure differences (Rails vs Astro)

**Example mapping:**

```csv
old_url,new_url
https://sargantanacode.es/que-es-git/,https://fjp.es/es/tutoriales/que-es-git/
https://sargantanacode.es/primeros-pasos-con-git/,https://fjp.es/es/tutoriales/primeros-pasos-con-git/
https://sargantanacode.es/instalar-git/,https://fjp.es/es/tutoriales/como-instalar-git-en-linux-macos-y-windows/
```

#### Step 2: Implement Domain-Level Redirect

**Context:**

- Both domains (fjp.es and sargantanacode.es) registered at **DonDominio**
- Currently no CDN configured
- Target hosting: **Cloudflare Pages** (recommended for free CDN + edge functions)

**Option A: Cloudflare Page Rules (Recommended)**

**Setup:**

1. Add both domains to Cloudflare (free plan)
2. Point DonDominio DNS to Cloudflare nameservers
3. Create Page Rule for sargantanacode.es

```
Forwarding URL: https://sargantanacode.es/*
Destination: https://fjp.es/es/tutoriales/$1
Status Code: 301 - Permanent Redirect
```

**Pros:**

- ✅ Free (Cloudflare free plan includes 3 page rules)
- ✅ Edge-level (extremely fast)
- ✅ Works with DonDominio domains
- ✅ Automatic HTTPS
- ✅ Includes CDN benefits

**Option B: Cloudflare \_redirects File**

Deploy sargantanacode.es as a Cloudflare Pages project with `_redirects` file:

```
# _redirects
/*  https://fjp.es/es/tutoriales/:splat  301
```

**Pros:**

- ✅ Entire domain redirects automatically
- ✅ Fast (edge-level)
- ✅ SEO-friendly (301)

**Cons:**

- ⚠️ Assumes URL structure similarity (may need adjustments)

**Option C: Per-URL Redirects (If URL structures differ)**

If URL structures differ significantly, create explicit mappings in `_redirects` file:

```
# sargantanacode.es/_redirects (Cloudflare Pages)
/que-es-git/                  https://fjp.es/es/tutoriales/que-es-git/                301
/primeros-pasos-con-git/      https://fjp.es/es/tutoriales/primeros-pasos-con-git/    301
# ... etc (generate from sitemap mapping)
```

**Recommended Approach:**

1. Use **Cloudflare Page Rules** (Option A) for simple wildcard redirect
2. If URL structures differ, use **per-URL redirects** (Option C)
3. Test thoroughly before shutting down Rails app

#### Step 3: Update Google Search Console

1. Add `fjp.es` to Google Search Console (if not already)
2. Submit new sitemap (`https://fjp.es/sitemap.xml`)
3. Use "Change of Address" tool (if moving domain)
4. Monitor for crawl errors

#### Step 4: Monitor Traffic

**Metrics to track:**

- Redirect hits from sargantanacode.es
- 404 errors on fjp.es (indicates missing redirects)
- Organic traffic changes
- Search rankings for key pages

**Tools:**

- Google Analytics
- Google Search Console
- Server logs

**Decision point:** After 3-6 months of consistent traffic on fjp.es and declining sargantanacode.es traffic, safe to shut down.

---

## Technical Implementation

### Phase A: Root Redirect (Priority 1)

**Timeline:** Implement during Phase 5.x (before content migration)

**Tasks:**

1. Create `src/middleware.ts` for language detection
2. Implement Accept-Language parsing
3. Set language preference cookie
4. Test with different browser languages
5. Document behavior

**Test cases:**

- [ ] Browser set to Spanish → Redirects to /es/
- [ ] Browser set to English → Redirects to /en/
- [ ] Browser set to French → Redirects to /es/ (default)
- [ ] Cookie set to 'en' → Ignores browser, goes to /en/
- [ ] Direct access to /es/ → No redirect (stays on /es/)

---

### Phase B: WordPress Redirects (Priority 1)

**Timeline:** Implement during Phase 6 (content migration)

**Tasks:**

1. Export WordPress permalink list from fjp.es
2. Map old URLs → new URLs
3. Create `_redirects` file or `astro.config.mjs` entries
4. Deploy redirects to production
5. Test old URLs (curl + browser)
6. Submit updated sitemap to Google Search Console

**Deliverable:** `wordpress-redirects.csv` + `_redirects` file

---

### Phase C: SargantanaCode Redirects (Priority 2)

**Timeline:** Implement after Phase 6 (content live on fjp.es)

**Tasks:**

1. Export SargantanaCode URL list
2. Map old URLs → new URLs
3. Configure domain-level redirect at hosting provider
4. Test redirects
5. Monitor traffic for 3-6 months
6. Shut down sargantanacode.es domain

**Deliverable:** `sargantanacode-redirects.csv` + hosting config

---

## SEO Considerations

### 301 vs 302 Redirects

| Type              | Use Case                                      | SEO Impact                        |
| ----------------- | --------------------------------------------- | --------------------------------- |
| **301 Permanent** | Old content moved forever (WordPress → Astro) | ✅ Transfers ~90-99% of SEO juice |
| **302 Temporary** | Language preference (/ → /es/ or /en/)        | ⚠️ No SEO transfer (intentional)  |

**Rule:** Use 301 for content migration, 302 for user preferences.

### Redirect Chains

**BAD:**

```
fjp.es/old-url/ → fjp.es/temp-url/ → fjp.es/es/new-url/
(2 hops = slower + less SEO juice)
```

**GOOD:**

```
fjp.es/old-url/ → fjp.es/es/new-url/
(1 hop = fast + full SEO juice)
```

**Action:** Audit redirect chains before launch.

### Sitemap Updates

**Old sitemap:**

```xml
<url>
  <loc>https://fjp.es/libros-leidos-durante-2017/</loc>
  <lastmod>2018-01-01</lastmod>
</url>
```

**New sitemap:**

```xml
<url>
  <loc>https://fjp.es/es/publicaciones/libros-leidos-durante-2017/</loc>
  <lastmod>2025-12-29</lastmod>
</url>
```

**Action:** Generate new sitemap with Astro, submit to Google Search Console.

---

## Open Questions & Answers

### 1. WordPress Permalink Structure

**Question:** What is the current fjp.es WordPress permalink structure?

**Available Data:**

- ✅ WordPress sitemap index: `https://fjp.es/sitemap.xml`
- ✅ WordPress export XML: `/home/fjpalacios/Code/WordPress/entries.xml`

**Action Required:**

- [ ] Parse sitemap.xml to identify URL patterns
- [ ] Analyze entries.xml for permalink structure
- [ ] Document common patterns

**Likely structure:** `/%postname%/` (e.g., `/libros-leidos-durante-2017/`)

**Impact:** Determines redirect mapping complexity.

---

### 2. SargantanaCode URL Structure ✅ ANSWERED

**Question:** What is the current sargantanacode.es URL structure?

**Answer:**

- **Framework:** Ruby on Rails
- **Sitemap:** `https://sargantanacode.es/sitemap.xml.gz` (gzipped)
- **Routes:** Defined in `/home/fjpalacios/Code/SargantanaCode/web-ror/config/routes.rb`

**Action Required:**

- [ ] Download and parse sitemap: `curl https://sargantanacode.es/sitemap.xml.gz | gunzip`
- [ ] Review `config/routes.rb` for URL patterns
- [ ] Map Rails routes to Astro equivalents

**Likely structure:** `/{slug}/` (simple slug-based, typical for Rails)

---

### 3. Hosting Platform ✅ DECIDED

**Question:** Where will fjp.es be hosted after migration?

**Decision:** **Cloudflare Pages** (free tier)

**Current Infrastructure:**

- Domains registered at **DonDominio** (both fjp.es and sargantanacode.es)
- No CDN currently configured
- No edge functions active

**Why Cloudflare Pages:**

- ✅ Free tier with unlimited bandwidth (no quotas)
- ✅ Edge functions for language detection
- ✅ Advanced redirects support (`_redirects` file with 301 support)
- ✅ Global CDN included (285+ cities)
- ✅ Works seamlessly with DonDominio DNS
- ✅ Better redirect handling than GitHub Pages
- ✅ No build time limits (GitHub Pages = 10 builds/hour)
- ✅ Truly free forever (no paid tier required)

**Why NOT GitHub Pages:**

- ❌ No edge functions
- ❌ Limited redirect capabilities (no proper 301 support)
- ❌ Build time limits
- ❌ Can't do dynamic language detection at edge

**Impact:** Using Cloudflare Pages enables:

1. Dynamic language detection at edge (better UX)
2. Proper 301 redirects (better SEO)
3. Unlimited bandwidth (no cost surprises)
4. Superior global performance

**See:** `docs/CLOUDFLARE_ARCHITECTURE_FAQ.md` for detailed technical comparison

---

### 4. SSR vs Static ✅ ANSWERED

**Question:** Will fjp.es use Astro SSR (hybrid mode) or pure static?

**Answer & Recommendation:**

**Use Astro Static + Cloudflare Edge Functions (Hybrid approach)**

**Why:**

- ✅ **Static pages:** Fast, cacheable, SEO-friendly (main content)
- ✅ **Edge functions:** For dynamic language detection (root redirect)
- ✅ **No SSR overhead:** Pages are static, only root redirect is dynamic
- ✅ **Free:** Cloudflare Pages free tier includes edge functions
- ✅ **Best of both worlds:** Static performance + dynamic features where needed

**Configuration:**

```typescript
// astro.config.mjs
export default defineConfig({
  output: "static", // Static site generation
  // Edge functions handled by Cloudflare _worker.js
});
```

**Impact:** Static site with edge-level language detection = best performance + best UX.

---

## Implementation Checklist

### Before Content Migration (Phase 5.x)

- [x] **Decide hosting strategy:** Cloudflare Pages (free tier with edge functions + CDN)
- [x] **Decide architecture:** Astro Static + Cloudflare Edge Functions (hybrid approach)
- [ ] Implement root redirect (/ → /es or /en) with language detection via Cloudflare Worker
- [ ] Test language detection with multiple browsers (ES, EN, FR, DE, etc.)
- [ ] Document root redirect behavior
- [ ] Set up Cloudflare account and add domains (fjp.es, sargantanacode.es)
- [ ] Configure DonDominio DNS to point to Cloudflare nameservers

### During Content Migration (Phase 6)

- [ ] Download and parse WordPress sitemap: `curl https://fjp.es/sitemap.xml`
- [ ] Parse WordPress export XML: `/home/fjpalacios/Code/WordPress/entries.xml`
- [ ] Create WordPress redirect mapping CSV (old URL → new URL)
- [ ] Generate `_redirects` file for Cloudflare Pages
- [ ] Test redirect file locally (dry run)
- [ ] Deploy redirects to Cloudflare Pages
- [ ] Test all old WordPress URLs (curl + browser)
- [ ] Generate new sitemap.xml with Astro
- [ ] Verify sitemap includes all new URLs

### After Content Migration (Phase 7+)

- [ ] Download and parse SargantanaCode sitemap: `curl https://sargantanacode.es/sitemap.xml.gz | gunzip`
- [ ] Review Rails routes: `/home/fjpalacios/Code/SargantanaCode/web-ror/config/routes.rb`
- [ ] Create SargantanaCode redirect mapping CSV
- [ ] Configure Cloudflare Page Rule for sargantanacode.es → fjp.es wildcard redirect
- [ ] OR create per-URL `_redirects` file if URL structures differ
- [ ] Test SargantanaCode redirects thoroughly
- [ ] Submit new sitemap to Google Search Console (https://fjp.es/sitemap.xml)
- [ ] Set up Google Analytics tracking (if not already)
- [ ] Monitor traffic for 3-6 months:
  - [ ] Track redirect hits from sargantanacode.es
  - [ ] Monitor 404 errors on fjp.es
  - [ ] Check organic traffic changes
  - [ ] Monitor search rankings
- [ ] After traffic stable, decide shutdown date for sargantanacode.es
- [ ] Shut down sargantanacode.es Rails app (domain can expire or be parked)

---

## Resources

- **Astro Redirects:** https://docs.astro.build/en/guides/routing/#redirects
- **Astro Middleware:** https://docs.astro.build/en/guides/middleware/
- **Netlify Redirects:** https://docs.netlify.com/routing/redirects/
- **Vercel Redirects:** https://vercel.com/docs/edge-network/redirects
- **Cloudflare Page Rules:** https://developers.cloudflare.com/rules/page-rules/
- **Google Change of Address:** https://support.google.com/webmasters/answer/9370220

---

**Status:** 📋 Planning complete - Awaiting implementation during Phase 5.x and Phase 6  
**Next Review:** Before starting Phase 6 (Content Migration)  
**Owner:** fjpalacios
