# Cloudflare Architecture - FAQ and Deep Dive

**Date:** December 29, 2025  
**Status:** 📚 Reference Document  
**Audience:** Future sessions, onboarding, architecture decisions

---

## 📋 Table of Contents

1. [CDN 101 - What is a CDN?](#cdn-101---what-is-a-cdn)
2. [Cloudflare Overview](#cloudflare-overview)
3. [Cloudflare Free Tier Details](#cloudflare-free-tier-details)
4. [Page Rules vs Workers vs \_redirects](#page-rules-vs-workers-vs-_redirects)
5. [Analytics and Statistics](#analytics-and-statistics)
6. [DNS Configuration with DigitalOcean](#dns-configuration-with-digitalocean)
7. [When to Add CDN to Current Sites](#when-to-add-cdn-to-current-sites)
8. [Architecture Decision Summary](#architecture-decision-summary)

---

## CDN 101 - What is a CDN?

### Definition

A **CDN (Content Delivery Network)** is a geographically distributed network of servers that cache and serve copies of your static content closer to your users.

### How It Works

**Without CDN:**

```
User in Tokyo → [12,000 km] → Server in Spain → Response (300-500ms latency)
```

**With CDN:**

```
User in Tokyo → [50 km] → CDN Server in Tokyo → Response (20-50ms latency)
```

### What Does a CDN Cache?

**Everything static:**

- ✅ HTML pages
- ✅ CSS files
- ✅ JavaScript files
- ✅ Images (JPG, PNG, WebP, SVG)
- ✅ Fonts (WOFF, WOFF2, TTF)
- ✅ Videos
- ✅ PDFs and documents

**NOT just images!** This is a common misconception.

### CDN Benefits

| Benefit                    | Description                          | Impact                  |
| -------------------------- | ------------------------------------ | ----------------------- |
| **Lower Latency**          | Content served from nearest server   | 2-10x faster load times |
| **Reduced Bandwidth**      | Origin server handles fewer requests | Lower hosting costs     |
| **Geographic Performance** | Fast for users worldwide             | Global reach            |
| **DDoS Protection**        | CDN absorbs malicious traffic        | Better uptime           |
| **Compression**            | Automatic Gzip/Brotli compression    | 20-30% smaller files    |
| **HTTP/2 & HTTP/3**        | Modern protocols automatically       | Faster multiplexing     |

### Does CDN Help Already Fast Sites?

**YES!** Even if your HTML is already fast:

#### 1. Geographic Latency

```
Static Site (HTML only) without CDN:
- User in Spain → Amsterdam Server → 20ms ✅
- User in Argentina → Amsterdam Server → 250ms ❌
- User in Japan → Amsterdam Server → 350ms ❌

Same Site with CDN:
- User in Spain → CDN Madrid → 10ms ✅
- User in Argentina → CDN Buenos Aires → 30ms ✅
- User in Japan → CDN Tokyo → 20ms ✅
```

**Improvement:** 2-10x faster for international users

#### 2. Automatic Compression

Cloudflare compresses HTML/CSS/JS with **Brotli** (better than Gzip):

- Reduces file size 20-30%
- No configuration needed
- Works for all content types

**Improvement:** Pages load faster even for local users

#### 3. HTTP/2 and HTTP/3

Modern protocols enable:

- **Multiplexing:** Multiple resources in 1 connection
- **Server Push:** Resources sent before requested
- **QUIC:** Faster connection establishment

**Improvement:** 20-40% faster resource loading

#### 4. Traffic Spike Protection

If your blog goes viral:

- CDN absorbs traffic spike
- Origin server stays stable
- No downtime

**Improvement:** 99.9%+ uptime guaranteed

#### 5. Smart Caching

Even HTML can be cached with proper rules:

- First user → Cache MISS (fetches from origin)
- Subsequent users → Cache HIT (instant response from edge)

**Improvement:** 90%+ of requests served from cache

### Performance Benchmark (Real World)

**Static HTML site without CDN:**

- From Spain: TTFB 50ms, Total 300ms
- From Argentina: TTFB 250ms, Total 800ms

**Same site with Cloudflare CDN:**

- From Spain: TTFB 10ms, Total 150ms (**2x faster**)
- From Argentina: TTFB 30ms, Total 200ms (**4x faster**)

---

## Cloudflare Overview

### What is Cloudflare?

Cloudflare is **much more than a CDN:**

| Service             | Description                               |
| ------------------- | ----------------------------------------- |
| **CDN**             | 300+ datacenters in 100+ countries        |
| **DNS**             | One of the world's fastest DNS (1.1.1.1)  |
| **Reverse Proxy**   | Sits between users and your server        |
| **WAF**             | Web Application Firewall (blocks attacks) |
| **DDoS Protection** | Mitigates distributed attacks             |
| **Edge Computing**  | Workers (serverless functions at edge)    |
| **SSL/TLS**         | Free certificates                         |
| **Analytics**       | Traffic and performance insights          |
| **Page Rules**      | Advanced routing and caching rules        |

**Important:** Cloudflare does NOT host your website. It proxies traffic to your existing server.

### Cloudflare Pages (Different from Cloudflare CDN)

**Cloudflare Pages** = Hosting platform (like Netlify/Vercel)

| Feature                   | Cloudflare CDN       | Cloudflare Pages           |
| ------------------------- | -------------------- | -------------------------- |
| **Hosts your site**       | ❌ No (only proxies) | ✅ Yes (full hosting)      |
| **Static site generator** | ❌ No                | ✅ Yes (Astro, Next, etc.) |
| **Git integration**       | ❌ No                | ✅ Yes (auto-deploy)       |
| **Edge Functions**        | ✅ Yes (Workers)     | ✅ Yes (built-in)          |
| **\_redirects file**      | ❌ No                | ✅ Yes                     |
| **Free tier**             | ✅ Yes               | ✅ Yes                     |

**For this project:** We'll use **Cloudflare Pages** (includes CDN + hosting + edge functions)

---

## Cloudflare Free Tier Details

### What's Included (Free Forever)

| Feature              | Free Tier Limit         | Enough for fjp.es?                  |
| -------------------- | ----------------------- | ----------------------------------- |
| **Bandwidth**        | ✅ Unlimited            | ✅ Yes (even 10M visitors)          |
| **Requests**         | ✅ Unlimited            | ✅ Yes                              |
| **CDN**              | ✅ All 300+ datacenters | ✅ Yes                              |
| **DNS**              | ✅ Unlimited queries    | ✅ Yes                              |
| **SSL/TLS**          | ✅ Free certificates    | ✅ Yes                              |
| **DDoS Protection**  | ✅ Unmetered            | ✅ Yes                              |
| **Domains**          | ✅ Unlimited            | ✅ Yes (fjp.es + sargantanacode.es) |
| **Page Rules**       | 3 per domain            | ✅ Yes (need 1, have 6 total)       |
| **Workers**          | 100,000 requests/day    | ✅ Yes (~3M/month)                  |
| **Cloudflare Pages** | 500 builds/month        | ✅ Yes (continuous deployment)      |
| **Pages Functions**  | 100,000 requests/day    | ✅ Yes (language detection)         |

### Page Rules Limit: 3 per Domain

**What are Page Rules?**  
URL-based configurations (redirects, cache settings, security).

**For your setup:**

```
fjp.es: 3 available
  - Used: 0
  - Available: 3

sargantanacode.es: 3 available
  - Used: 1 (redirect to fjp.es)
  - Available: 2

Total: 6 Page Rules, using 1
```

**What if you need more?**

- Paid plan: $5/month for 20 additional Page Rules
- For this project: **Not needed**

### Workers Limit: 100,000 requests/day

**What are Workers?**  
Serverless JavaScript functions that run at Cloudflare's edge (not on your server).

**Use case:** Dynamic language detection (`/` → `/es/` or `/en/`)

**Calculation:**

```
100,000 requests/day = 3,000,000 requests/month

Realistic usage:
- 10,000 total visitors/day
- ~500 hit root path / directly (5%)
- Workers consume: 500/day
- Remaining: 99,500/day unused

Conclusion: More than enough ✅
```

**What if you exceed?**

- Cloudflare pauses your Worker temporarily
- For this traffic: **Impossible to exceed**
- Paid plan: $5/month for 10M additional requests

### Cloudflare Pages: 500 builds/month

**What counts as a build?**  
Each `git push` that triggers deployment.

**Realistic usage:**

```
Development phase: 10-20 builds/day = 300-600/month (may exceed)
Production phase: 1-5 builds/week = 4-20/month ✅

For stable site: Never exceed 500/month
```

**What if you exceed?**

- Build queue pauses until next month
- OR upgrade to paid: $20/month for 5,000 builds

**For this project:** 500/month is enough once site is stable.

### When Does It Stop Being Free?

**TL;DR: Almost never for a personal blog.**

**Scenarios that remain free:**

- ✅ 10,000 visitors/day → Free
- ✅ 100,000 visitors/day → Free
- ✅ 1,000,000 visitors/day → Free (if mostly static)
- ✅ Bandwidth: 1TB/month → Free
- ✅ Bandwidth: 100TB/month → Free

**Only pay if you need:**

- Advanced WAF rules
- More than 3 Page Rules per domain
- More than 100k Workers requests/day
- Priority support
- Custom SSL certificates (not Let's Encrypt)

**For fjp.es + sargantanacode.es:** **Free forever** ✅

---

## Page Rules vs Workers vs \_redirects

### Comparison Table

| Feature            | Page Rules              | Workers             | \_redirects (Pages)     |
| ------------------ | ----------------------- | ------------------- | ----------------------- |
| **What are they?** | URL-based configs       | Edge functions      | Static redirect file    |
| **Limit**          | 3 per domain            | 100k/day            | Unlimited               |
| **Dynamic logic?** | ❌ No (static patterns) | ✅ Yes (JavaScript) | ❌ No (static patterns) |
| **Read headers?**  | ❌ No                   | ✅ Yes              | ❌ No                   |
| **Read cookies?**  | ❌ No                   | ✅ Yes              | ❌ No                   |
| **If/else logic?** | ❌ No                   | ✅ Yes              | ❌ No                   |
| **Wildcards?**     | ✅ Yes (`*`, `$1`)      | ✅ Yes              | ✅ Yes (`:splat`)       |
| **Redirects?**     | ✅ 301/302              | ✅ 301/302/307/308  | ✅ 301/302              |
| **Cache control?** | ✅ Yes                  | ✅ Yes              | ❌ No                   |
| **Cost?**          | Free (3/domain)         | Free (100k/day)     | Free (unlimited)        |

### Use Cases

#### Page Rules: Static redirects with patterns

**Good for:**

- Redirect entire domain: `sargantanacode.es/*` → `fjp.es/es/$1`
- Set cache rules: `fjp.es/static/*` → Cache everything
- Force HTTPS: `http://fjp.es/*` → `https://fjp.es/*`

**Example:**

```
Page Rule 1:
  URL: https://sargantanacode.es/*
  Forwarding URL (301): https://fjp.es/es/tutoriales/$1
```

**Cannot do:**

- ❌ Read Accept-Language header
- ❌ Read cookies
- ❌ Conditional logic based on user

#### Workers: Dynamic logic at edge

**Good for:**

- Language detection based on headers
- A/B testing
- Auth checking
- Personalized redirects
- Complex routing logic

**Example:**

```javascript
// functions/_middleware.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (url.pathname === "/") {
    const lang = request.headers.get("Accept-Language");
    const isSpanish = /^es\b/i.test(lang);
    return Response.redirect(new URL(isSpanish ? "/es/" : "/en/", url), 302);
  }

  return context.next();
}
```

**Cannot do:**

- ❌ Unlimited requests (100k/day limit)

#### \_redirects File: Unlimited static redirects

**Good for:**

- WordPress permalinks → Astro URLs (200+ redirects)
- Simple URL changes
- No dynamic logic needed

**Example:**

```
# public/_redirects
/libros-leidos-durante-2017/  /es/publicaciones/libros-leidos-durante-2017/  301
/reto-literario-stephen-king/  /es/publicaciones/reto-literario-stephen-king/  301
# ... 200+ more
/libro/*  /es/libros/:splat  301
```

**Cannot do:**

- ❌ Read headers/cookies
- ❌ Conditional logic
- ❌ Only works with Cloudflare Pages (not regular Cloudflare proxy)

### Decision Matrix for This Project

| Redirect Type                  | Method           | Why                                    |
| ------------------------------ | ---------------- | -------------------------------------- |
| **`/` → `/es/` or `/en/`**     | Worker           | Needs Accept-Language header (dynamic) |
| **WordPress permalinks**       | \_redirects file | 200+ static redirects (unlimited)      |
| **sargantanacode.es → fjp.es** | Page Rule        | Simple domain-level wildcard           |

**Summary:**

- 1 Worker (language detection)
- 1 \_redirects file (WordPress permalinks)
- 1 Page Rule (sargantanacode.es)

---

## Analytics and Statistics

### Question: Does CDN Affect Analytics?

**Answer: NO** ✅

### How Umami (or any JS-based analytics) Works

```
1. User requests page
   ↓
2. Cloudflare serves cached HTML (fast)
   ↓
3. Browser receives HTML
   ↓
4. Browser executes JS (including Umami script)
   ↓
5. Umami JS sends tracking request to Umami server
   ↓
6. Visit is recorded ✅
```

**Key insight:** Analytics JavaScript runs **in the user's browser**, not on CDN servers.

### Example HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- This HTML can be cached by CDN -->
    <title>My Blog Post</title>
  </head>
  <body>
    <h1>Hello World</h1>

    <!-- Umami tracking script -->
    <script async src="https://analytics.umami.is/script.js" data-website-id="your-website-id"></script>

    <!-- Script executes in browser, not in CDN -->
  </body>
</html>
```

**Flow:**

1. CDN serves HTML (cached, fast)
2. Browser downloads `script.js` from Umami's server
3. Script executes **client-side** (in visitor's browser)
4. Script sends pageview to Umami server
5. **Visitor is counted** ✅

### Server-Side Analytics (Server Logs)

**Scenario:** You want to analyze server access logs.

**Problem:** Cloudflare proxies all traffic → Your server sees Cloudflare IPs, not visitor IPs.

**Solution:** Cloudflare adds headers with real visitor data:

```
Request headers forwarded by Cloudflare:
- CF-Connecting-IP: 123.45.67.89 (real visitor IP)
- X-Forwarded-For: 123.45.67.89
- CF-IPCountry: ES (visitor country)
- CF-Ray: 8bc123def456-MAD (unique request ID)
```

**Your server can:**

- Read `CF-Connecting-IP` for real visitor IP
- Log accurate visitor statistics
- Build server-side analytics

**Conclusion:** Server logs still work correctly ✅

### Cloudflare Analytics (Bonus)

Cloudflare provides **additional analytics** (free):

- Total requests
- Bandwidth consumed
- Cache hit ratio
- Threats blocked
- Top countries
- Top paths

**This does NOT replace Umami** but complements it.

**Example insights:**

```
Cloudflare Analytics:
- 50,000 requests/day
- 40,000 served from cache (80% cache hit rate)
- 10,000 reached origin server
- 500 threats blocked

Umami Analytics:
- 8,000 unique visitors/day (different metric)
- Top page: /es/libros/1984/
- Average session: 3 minutes
```

Both metrics are useful and independent.

---

## DNS Configuration with DigitalOcean

### Current Setup

```
DonDominio (Domain Registrar):
  fjp.es
    └── Nameservers: DonDominio's DNS
        └── A record: 123.456.789.101 (DigitalOcean Droplet)

  sargantanacode.es
    └── Nameservers: DonDominio's DNS
        └── A record: 123.456.789.101 (same Droplet)

DigitalOcean Droplet (123.456.789.101):
  - WordPress (fjp.es)
  - Ruby on Rails (sargantanacode.es)
  - Nginx/Apache serving both sites
```

**Traffic flow:**

```
User → DonDominio DNS (resolves to 123.456.789.101)
     → Directly to DigitalOcean Droplet
     → WordPress/Rails responds
```

### How Cloudflare Changes This

```
DonDominio (Domain Registrar):
  fjp.es
    └── Nameservers: Cloudflare's DNS ← CHANGE HERE
        └── A record: 123.456.789.101 (proxied through Cloudflare)

User → Cloudflare DNS (resolves to Cloudflare IP: 104.21.x.x)
     → Cloudflare CDN (proxies request)
     → DigitalOcean Droplet (123.456.789.101)
     → WordPress/Rails responds
     → Cloudflare caches response
     → User receives response (fast)
```

**Key changes:**

1. Nameservers point to Cloudflare (not DonDominio)
2. DNS A record stays the same (123.456.789.101)
3. Traffic flows through Cloudflare first
4. Your server sees Cloudflare IPs (but headers reveal real visitor IP)

### Step-by-Step: Adding Cloudflare to Existing Sites

#### Step 1: Add Domain to Cloudflare

```
1. Sign up at cloudflare.com (free)
2. Click "Add a Site"
3. Enter: fjp.es
4. Choose "Free Plan"
5. Cloudflare scans your current DNS records
```

#### Step 2: Review Imported DNS Records

Cloudflare auto-imports from DonDominio:

| Type | Name | Content         | Proxy Status |
| ---- | ---- | --------------- | ------------ |
| A    | @    | 123.456.789.101 | 🟠 Proxied   |
| A    | www  | 123.456.789.101 | 🟠 Proxied   |
| MX   | @    | mail.fjp.es     | ⚪ DNS only  |
| TXT  | @    | "v=spf1..."     | ⚪ DNS only  |

**Proxy Status:**

- 🟠 **Proxied (orange cloud):** Traffic goes through Cloudflare CDN
- ⚪ **DNS only (gray cloud):** Traffic goes directly to server

**For web traffic: Use Proxied**  
**For email/SSH: Use DNS only**

#### Step 3: Update Nameservers at DonDominio

Cloudflare gives you 2 nameservers:

```
john.ns.cloudflare.com
maya.ns.cloudflare.com
```

**In DonDominio control panel:**

1. Go to: Dominios → fjp.es → DNS/Nameservers
2. Change from:
   ```
   ns1.dondominio.com
   ns2.dondominio.com
   ```
   To:
   ```
   john.ns.cloudflare.com
   maya.ns.cloudflare.com
   ```
3. Save changes

**Propagation time:** 1-24 hours (usually 1-2 hours)

#### Step 4: Verify It Works

```bash
# Check DNS resolves to Cloudflare
dig fjp.es

# Should show Cloudflare IPs (not your droplet)
# Example: 104.21.x.x or 172.67.x.x
```

```bash
# Check website loads
curl -I https://fjp.es

# Headers should include:
# server: cloudflare
# cf-ray: 8bc123def456-MAD
```

**Your WordPress/Rails site still works!** No changes needed on server.

#### Step 5: Configure Cloudflare Settings

**Recommended settings:**

1. **SSL/TLS:** Full (encrypts Cloudflare ↔ Your Server)
2. **Always Use HTTPS:** ON
3. **Auto Minify:** ON (HTML, CSS, JS)
4. **Brotli Compression:** ON
5. **HTTP/2:** ON (default)
6. **HTTP/3:** ON

### What Happens to Your DigitalOcean Droplet?

**NOTHING changes on your server:**

- Same IP: 123.456.789.101
- Same WordPress installation
- Same Rails app
- Same Nginx/Apache configs
- Same database

**Only difference:**

- Requests come from Cloudflare IPs (not visitor IPs directly)
- Headers include `CF-Connecting-IP` with real visitor IP
- Less direct traffic (CDN handles most static content)

### Can You Keep Using DigitalOcean Directly?

**Yes!** You can always access your server directly via IP:

```bash
# Bypassing Cloudflare (direct to DigitalOcean)
curl http://123.456.789.101

# Goes through Cloudflare (uses domain)
curl https://fjp.es
```

**For debugging:** Access server directly by IP if Cloudflare has issues.

---

## When to Add CDN to Current Sites

### Question: Should We Add Cloudflare to WordPress/Rails Now?

**Answer: NO (not recommended)** ❌

### Reasons to Wait

#### 1. Sites Are Temporary

```
Current plan:
- WordPress (fjp.es) → Will be replaced by Astro
- Rails (sargantanacode.es) → Will be shut down

Timeline: 2-3 months
```

**Why configure CDN for sites you'll replace soon?**

#### 2. WordPress + Cloudflare Complexity

WordPress has dynamic admin panel (`/wp-admin`) that shouldn't be cached:

**Required Page Rules:**

```
Rule 1: fjp.es/wp-admin/*
  → Cache Level: Bypass

Rule 2: fjp.es/wp-login.php
  → Cache Level: Bypass

Rule 3: fjp.es/wp-cron.php
  → Cache Level: Bypass
```

**Potential issues:**

- Plugins may conflict with CDN caching
- Need to purge cache after content updates
- Testing required to ensure admin panel works

**Effort:** Medium-High for temporary benefit

#### 3. Rails + Cloudflare Complexity

Rails also has dynamic routes that need careful cache configuration.

**Effort:** Medium for site that will be shut down

#### 4. Risk of Downtime

Changing nameservers on production sites = risk:

- DNS propagation issues
- Misconfigured cache rules
- Debugging time

**For sites being replaced:** Not worth the risk

### Better Approach: Fresh Start with Astro

```
Timeline:

Now (Phase 5.x):
  ✅ Keep WordPress/Rails as-is (no CDN changes)
  ✅ Focus on finishing Astro code

Phase 6:
  ✅ Migrate content to Astro locally
  ✅ Test thoroughly

Phase 7:
  ✅ Deploy Astro to Cloudflare Pages (fresh, clean setup)
  ✅ Test on subdomain first (beta.fjp.es)

Phase 8:
  ✅ Switch DNS to Cloudflare (point to new Astro site)
  ✅ Configure redirects

Phase 9:
  ✅ Monitor for 3-6 months

Phase 10:
  ✅ Shut down WordPress/Rails
  ✅ Save $12-20/month on DigitalOcean
```

**Benefits:**

- ✅ Zero risk to current production sites
- ✅ Clean Cloudflare configuration from scratch
- ✅ No need to migrate CDN configs later
- ✅ Cloudflare Pages is simpler than Cloudflare + DigitalOcean

### When to Add CDN to Current Sites

**Only if:**

- Sites will remain long-term (not being replaced)
- Traffic is significant and international
- You have time to test thoroughly
- You understand cache invalidation

**For this project:** **Wait until Phase 7** ✅

---

## Architecture Decision Summary

### Final Stack

| Component                 | Technology        | Rationale                             |
| ------------------------- | ----------------- | ------------------------------------- |
| **Hosting**               | Cloudflare Pages  | Free, includes CDN + edge functions   |
| **Static Site Generator** | Astro             | Fast, modern, content-focused         |
| **Content**               | MDX + JSON        | Type-safe, version controlled         |
| **Language Detection**    | Cloudflare Worker | Dynamic `/` → `/es/` or `/en/`        |
| **WordPress Redirects**   | \_redirects file  | Unlimited redirects (200+)            |
| **Domain Redirect**       | Page Rule         | sargantanacode.es → fjp.es            |
| **Analytics**             | Umami             | Privacy-focused, self-hosted          |
| **Domains**               | DonDominio        | Keep as registrar, use Cloudflare DNS |
| **Cost**                  | $0/month          | Everything free tier                  |

### Resource Allocation

| Resource                 | Available       | Used | Remaining |
| ------------------------ | --------------- | ---- | --------- |
| **Page Rules**           | 6 (3×2 domains) | 1    | 5         |
| **Workers requests/day** | 100,000         | ~500 | 99,500    |
| **\_redirects**          | Unlimited       | ~200 | Unlimited |
| **Bandwidth**            | Unlimited       | Any  | Unlimited |
| **Builds/month**         | 500             | ~50  | 450       |

### Cost Projection

| Service                  | Current (WordPress+Rails) | Future (Astro+Cloudflare) |
| ------------------------ | ------------------------- | ------------------------- |
| **DigitalOcean Droplet** | $12-20/month              | $0 (eliminated)           |
| **Cloudflare Pages**     | $0                        | $0                        |
| **Domain Registration**  | ~€25/year (both domains)  | ~€25/year (same)          |
| **Total/year**           | ~$170-265                 | ~$25                      |
| **Savings**              | -                         | **$145-240/year** 💰      |

### Performance Improvement (Estimated)

| Metric                     | Current (DigitalOcean) | Future (Cloudflare Pages) | Improvement |
| -------------------------- | ---------------------- | ------------------------- | ----------- |
| **TTFB (Spain)**           | 50ms                   | 10ms                      | 5x faster   |
| **TTFB (Argentina)**       | 250ms                  | 30ms                      | 8x faster   |
| **TTFB (Japan)**           | 350ms                  | 20ms                      | 17x faster  |
| **Page Load (Spain)**      | 300ms                  | 150ms                     | 2x faster   |
| **Page Load (Global Avg)** | 800ms                  | 200ms                     | 4x faster   |
| **Uptime**                 | 99%                    | 99.99%                    | Better      |

---

## Quick Reference

### Cloudflare Limits Cheat Sheet

```
✅ UNLIMITED (Free Tier):
- Bandwidth
- Requests
- CDN data centers
- DNS queries
- Domains
- SSL certificates
- _redirects (Cloudflare Pages only)

📊 LIMITED (Free Tier):
- Page Rules: 3 per domain
- Workers: 100,000 requests/day
- Builds: 500/month (Cloudflare Pages)

💰 PAID UPGRADES:
- More Page Rules: $5/month (+20 rules)
- More Workers: $5/month (+10M requests)
- More Builds: $20/month (+5,000 builds)
```

### Redirect Methods Decision Tree

```
Need to redirect?
│
├─ Need to read headers/cookies? → YES → Use WORKER
│
├─ Single domain wildcard? → YES → Use PAGE RULE
│
├─ Many URLs (100+)? → YES → Use _REDIRECTS FILE
│
└─ Few URLs (< 10)? → Use PAGE RULE or _REDIRECTS FILE
```

### When to Use What

| Use Case                 | Method      | File/Location              |
| ------------------------ | ----------- | -------------------------- |
| **Language detection**   | Worker      | `functions/_middleware.js` |
| **WordPress permalinks** | \_redirects | `public/_redirects`        |
| **Domain redirect**      | Page Rule   | Cloudflare Dashboard       |
| **Cache control**        | Page Rule   | Cloudflare Dashboard       |
| **Force HTTPS**          | Page Rule   | Cloudflare Dashboard       |

---

## Related Documentation

- **MIGRATION_STRATEGY_AND_REDIRECTS.md:** Full migration plan
- **PROJECT_PRIORITIES.md:** Phase order and priorities
- **ROADMAP.md:** Complete project roadmap

---

**Document Status:** ✅ Complete - Reference for future sessions  
**Last Updated:** December 29, 2025  
**Next Review:** After Phase 7 (Deploy)
