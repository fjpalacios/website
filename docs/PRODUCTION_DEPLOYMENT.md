# Production Deployment Guide

Step-by-step checklist to deploy the site to production with Cloudflare Pages.

---

## Prerequisites

- ✅ Content migrated
- ✅ All tests passing
- ✅ Build successful
- ✅ `public/_redirects` file ready

---

## Phase 1: Cloudflare Setup

### 1.1 Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Create free account
3. Verify email

### 1.2 Add Domains to Cloudflare

**For fjp.es:**

1. Dashboard → Add site
2. Enter `fjp.es`
3. Select **Free Plan**
4. Cloudflare will scan DNS records
5. Review and import existing records
6. Note the **Cloudflare nameservers** (e.g., `bob.ns.cloudflare.com`, `lucy.ns.cloudflare.com`)

**For sargantanacode.es:**

1. Repeat same process for `sargantanacode.es`
2. Select **Free Plan**
3. Note the **nameservers**

### 1.3 Update DNS at DonDominio

**For each domain (fjp.es and sargantanacode.es):**

1. Login to DonDominio
2. Go to domain management
3. Find **DNS / Nameservers** section
4. Replace DonDominio nameservers with Cloudflare nameservers:
   ```
   bob.ns.cloudflare.com
   lucy.ns.cloudflare.com
   ```
5. Save changes
6. Wait 24-48h for DNS propagation (usually faster)

### 1.4 Verify DNS Propagation

```bash
dig fjp.es NS
dig sargantanacode.es NS
```

Should return Cloudflare nameservers.

---

## Phase 2: Deploy to Cloudflare Pages

### 2.1 Connect GitHub Repository

1. Cloudflare Dashboard → Pages → Create a project
2. Connect to Git → Select GitHub
3. Authorize Cloudflare
4. Select repository: `fjpalacios/website`
5. Select branch: `main` (or your production branch)

### 2.2 Configure Build Settings

```
Framework preset: Astro
Build command: bun run build
Build output directory: dist
Root directory: /
Node version: 18 (or latest)
```

### 2.3 Add Environment Variables (if needed)

- Click **Environment variables**
- Add any required variables (e.g., API keys)

### 2.4 Deploy

1. Click **Save and Deploy**
2. Wait for build (~2-3 minutes)
3. Note the preview URL: `https://website-xxx.pages.dev`

---

## Phase 3: Configure Custom Domains

### 3.1 Add fjp.es to Cloudflare Pages

1. Pages → Your project → Custom domains
2. Click **Set up a custom domain**
3. Enter: `fjp.es`
4. Click **Continue**
5. Add CNAME record (Cloudflare does this automatically)
6. Repeat for `www.fjp.es` (optional)

### 3.2 Verify HTTPS

- Cloudflare automatically provisions SSL certificate
- Wait ~5 minutes
- Visit `https://fjp.es` to verify

---

## Phase 4: Configure Redirects

### 4.1 WordPress Redirects (Already Done ✅)

The `public/_redirects` file is already configured with 336 redirects:

```
/1984-de-george-orwell/ /es/libros/1984-de-george-orwell/ 301
/carrie-de-stephen-king/ /es/libros/carrie-de-stephen-king/ 301
# ... 334 more
```

Cloudflare Pages reads this file automatically.

### 4.2 SargantanaCode Domain Redirect

**Option A: Cloudflare Page Rule (Recommended)**

1. Cloudflare Dashboard → sargantanacode.es → Rules → Page Rules
2. Create Page Rule:
   ```
   URL pattern: sargantanacode.es/*
   Setting: Forwarding URL
   Status code: 301 - Permanent Redirect
   Destination URL: https://fjp.es/es/tutoriales/$1
   ```
3. Save and Deploy

**Option B: Deploy Separate Pages Project**

1. Create new repo with only `_redirects` file:
   ```
   /*  https://fjp.es/es/tutoriales/:splat  301
   ```
2. Deploy as Cloudflare Pages project
3. Add `sargantanacode.es` as custom domain

**Recommendation:** Use Option A (simpler, uses 1 of 3 free page rules).

---

## Phase 5: Root Language Redirect

### 5.1 Create Cloudflare Worker

1. Pages → Your project → Functions
2. Create `functions/_middleware.js`:

```javascript
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Only handle root path
  if (url.pathname !== "/" && url.pathname !== "") {
    return context.next();
  }

  // Check cookie first
  const cookie = request.headers.get("Cookie") || "";
  if (cookie.includes("preferred-language=es")) {
    return Response.redirect(new URL("/es/", url), 302);
  }
  if (cookie.includes("preferred-language=en")) {
    return Response.redirect(new URL("/en/", url), 302);
  }

  // Parse Accept-Language header
  const acceptLanguage = request.headers.get("Accept-Language") || "";
  const isSpanish = /^es\b/i.test(acceptLanguage);
  const targetLang = isSpanish ? "es" : "en";

  // Redirect and set cookie
  const response = Response.redirect(new URL(`/${targetLang}/`, url), 302);
  response.headers.set("Set-Cookie", `preferred-language=${targetLang}; Path=/; Max-Age=31536000; SameSite=Lax`);

  return response;
}
```

3. Commit and push to trigger redeployment

**Cloudflare Workers Free Tier Limits:**

- ✅ **100,000 requests/day** included
- ✅ Sufficient for personal blogs/sites
- ✅ Only counts requests to `/` (root), not all pages

Since only the root path uses the worker, and visitors get a cookie after first visit, actual worker usage will be much lower than total site traffic.

### 5.2 Test Language Detection

```bash
# Test Spanish
curl -I -H "Accept-Language: es-ES" https://fjp.es/
# Should redirect to /es/

# Test English
curl -I -H "Accept-Language: en-US" https://fjp.es/
# Should redirect to /en/
```

---

## Phase 6: Analytics Setup

### 6.1 Umami (or your analytics tool)

Add tracking script to `src/layouts/BaseLayout.astro`:

```html
<script async src="https://analytics.umami.is/script.js" data-website-id="your-website-id"></script>
```

**Note:** CDN does NOT affect JS-based analytics. Script runs in browser, not on CDN.

### 6.2 Google Search Console

1. Go to https://search.google.com/search-console
2. Add property: `fjp.es`
3. Verify ownership (DNS TXT record or HTML file)
4. Submit sitemap: `https://fjp.es/sitemap-index.xml`
5. Use "Change of Address" tool (if migrating from WordPress)

### 6.3 Cloudflare Analytics (Bonus)

- Cloudflare Dashboard → Analytics
- View traffic, cache hit ratio, threats blocked
- Free with all plans

---

## Phase 7: Post-Deployment Checks

### 7.1 Verify Core Functionality

- [ ] Homepage loads (`https://fjp.es/`)
- [ ] Language redirect works (`/` → `/es/` or `/en/`)
- [ ] Books page loads (`/es/libros/`)
- [ ] Individual book pages load
- [ ] Search works (Pagefind)
- [ ] Language switcher works
- [ ] RSS feeds work (`/es/rss.xml`)
- [ ] Sitemap accessible (`/sitemap-index.xml`)

### 7.2 Test Redirects

```bash
# Test WordPress redirects
curl -I https://fjp.es/1984-de-george-orwell/
# Should: 301 → https://fjp.es/es/libros/1984-de-george-orwell/

# Test SargantanaCode redirect
curl -I https://sargantanacode.es/que-es-git/
# Should: 301 → https://fjp.es/es/tutoriales/...
```

### 7.3 Performance Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://fjp.es/es/ --view
```

Should show: 100/100 on all metrics.

### 7.4 Cross-Browser Testing

Test on:

- Chrome (Desktop + Mobile)
- Firefox
- Safari (Mac + iOS)
- Edge

---

## Phase 8: Monitor (First 48 Hours)

### 8.1 Watch for Errors

- Cloudflare Dashboard → Analytics → Traffic
- Check for 404s, 500s
- Monitor Cloudflare Workers logs (if any errors)

### 8.2 Track Redirects

- Google Search Console → Coverage
- Look for redirect chains (should be single 301)
- Check crawl errors

### 8.3 Performance Monitoring

- Cloudflare Analytics → Cache hit ratio (should be >80%)
- Response time (should be <200ms globally)

---

## Phase 9: Shutdown Old Sites (After 3-6 Months)

**Only after confirming:**

- [ ] All redirects working
- [ ] No 404 errors in Search Console
- [ ] Traffic fully migrated
- [ ] Google rankings stable

**Then:**

1. Keep WordPress/Rails as backup (read-only)
2. Remove from public DNS (or show maintenance page)
3. Cancel hosting if desired

---

## Troubleshooting

### DNS Not Propagating

```bash
# Check current nameservers
dig fjp.es NS

# Flush local DNS cache (Mac)
sudo dscacheutil -flushcache

# Flush local DNS cache (Linux)
sudo systemd-resolve --flush-caches
```

### Redirects Not Working

1. Check `public/_redirects` syntax (no spaces before paths)
2. Verify file is in `dist/` after build
3. Check Cloudflare Pages Functions logs

### SSL Certificate Issues

- Wait 5-10 minutes after adding custom domain
- Verify DNS points to Cloudflare
- Check Cloudflare Dashboard → SSL/TLS → Edge Certificates

### Language Detection Not Working

- Check `functions/_middleware.js` is deployed
- View Functions logs in Cloudflare Dashboard
- Test with different `Accept-Language` headers

---

## Key Resources

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Cloudflare Functions:** https://developers.cloudflare.com/pages/functions/
- **Cloudflare Page Rules:** https://developers.cloudflare.com/rules/page-rules/
- **DonDominio DNS Guide:** https://www.dondominio.com/help/es/728/cambiar-los-dns/

---

## Summary

**Estimated time:** 2-4 hours

**Costs:** $0 (everything on free tiers)

**Result:**

- ✅ Global CDN (285+ cities)
- ✅ Automatic HTTPS
- ✅ 301 redirects (SEO-friendly)
- ✅ Dynamic language detection
- ✅ Analytics working
- ✅ Sub-100ms response times worldwide
