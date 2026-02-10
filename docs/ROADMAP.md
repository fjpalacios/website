# Website Roadmap

**Last Updated:** February 10, 2026

---

## Current Status

### ✅ Code: Complete

- Unified router (86 dynamic paths, 25 templates)
- Full i18n (ES/EN) with centralized config
- 1,658 tests passing (unit) + 535 e2e
- Lighthouse 100/100 across all pages (a11y 100 on book detail after heading hierarchy fix)
- Build: ~9 seconds

### 🟢 Content: ~15% Complete

- 144 book reviews migrated from WordPress
- 4 challenge posts migrated
- ~50-100 posts from SargantanaCode pending
- Test data in place

### 🔴 Production: Not Deployed

---

## Phases

### Phase 1-5: Foundation ✅ COMPLETE

All core features implemented:

- Routing, SEO, RSS, Search
- Accessibility (WCAG AAA)
- Testing infrastructure
- i18n automation

### Phase 6: Content Migration 🟢 IN PROGRESS

**Status:** Partially complete

- [x] WordPress books (144 reviews)
- [x] Challenge posts (4 posts)
- [ ] SargantanaCode posts (~50-100)
- [ ] Remaining WordPress posts

**Estimated:** 10-20 hours remaining

### Phase 7: Production Deployment 🔴 PENDING

**Priority:** HIGH after content complete

Tasks:

- [ ] Deploy to Cloudflare Pages
- [ ] Configure DNS (fjp.es + sargantanacode.es)
- [ ] Set up redirects (WordPress + SargantanaCode)
- [ ] Configure analytics (Umami + Google Search Console)
- [ ] Test all functionality
- [ ] Monitor for 48 hours

**Estimated:** 2-4 hours

**See:** `docs/PRODUCTION_DEPLOYMENT.md` for step-by-step guide

---

## Future Enhancements

### Add Third Language

The system is ready. Adding a new language takes ~15 minutes:

```bash
bun run new:language fr "Français" --with-content
```

Then:

1. Add config (2 min)
2. Translate strings (10-15 min)
3. Run validation (1 min)

### Analytics Dashboard

Custom dashboard with reading stats, popular content, etc.

**Estimated:** 10-15 hours

---

## Next Steps

1. **Finish content migration** - Complete SargantanaCode posts
2. **Deploy to production** - Follow PRODUCTION_DEPLOYMENT.md
3. **Monitor and optimize** - Track analytics, fix any issues
