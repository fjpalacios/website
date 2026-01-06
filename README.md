# Personal Website

My personal blog built with Astro. Book reviews, tech tutorials, and blog posts in Spanish and English.

**Live:** https://fjp.es (coming soon)  
**Status:** ✅ Code complete, pending content migration

---

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server (http://localhost:4321)
bun run dev

# Run tests
bun run test           # Unit tests (1,389 tests)
bun run test:e2e       # E2E tests (427 tests)
bun run test:coverage  # Coverage report (96.88%)
```

---

## Tech Stack

- **[Astro 5](https://astro.build/)** - Static site generator
- **TypeScript** - Type safety (strict mode)
- **SCSS** - Styles with BEM methodology
- **[Vitest](https://vitest.dev/)** - Unit testing
- **[Playwright](https://playwright.dev/)** - E2E testing
- **[Pagefind](https://pagefind.app/)** - Full-text search

---

## Project Structure

```
src/
├── components/          # Reusable Astro components
├── content/             # MDX content collections
│   ├── books/          # Book reviews
│   ├── posts/          # Blog posts
│   ├── tutorials/      # Tech tutorials
│   └── authors/        # Author bios
├── layouts/             # Page layouts
├── pages/               # Routes
│   ├── index.astro     # Root redirect
│   └── [lang]/
│       └── [...route].astro  # Unified router (86 dynamic routes)
├── pages-templates/     # Page templates (25 templates)
├── styles/              # SCSS modules (BEM)
├── utils/               # Utilities & helpers
└── __tests__/           # Test suites
    └── __helpers__/     # Reusable test utilities
```

---

## Key Features

✨ **Bilingual** - Spanish/English with unified routing  
🔍 **Search** - Full-text search with Cmd+K (Pagefind)  
🌓 **Dark Mode** - Zero-flash theme switching  
⚡ **Performance** - Lighthouse 100/100 on all metrics  
♿ **Accessibility** - WCAG AAA compliant  
🧪 **Tested** - 1,816 tests (96.88% coverage)  
📱 **Responsive** - Mobile-first design  
🔗 **SEO** - Open Graph, JSON-LD, sitemaps, RSS

---

## Commands

| Command                 | Action                       |
| :---------------------- | :--------------------------- |
| `bun run dev`           | Start dev server (port 4321) |
| `bun run build`         | Build for production         |
| `bun run preview`       | Preview production build     |
| `bun run test`          | Run unit tests               |
| `bun run test:e2e`      | Run E2E tests                |
| `bun run test:coverage` | Generate coverage report     |
| `bun run lint`          | Lint code with ESLint        |
| `bun run format`        | Format code with Prettier    |

---

## Documentation

- **[ROADMAP.md](docs/ROADMAP.md)** - Project status and next steps
- **[DEVELOPMENT_GUIDELINES.md](docs/DEVELOPMENT_GUIDELINES.md)** - Coding standards
- **[CLOUDFLARE_ARCHITECTURE_FAQ.md](docs/CLOUDFLARE_ARCHITECTURE_FAQ.md)** - Deployment guide
- **[MIGRATION_STRATEGY_AND_REDIRECTS.md](docs/MIGRATION_STRATEGY_AND_REDIRECTS.md)** - Content migration plan

---

## Metrics

- **Pages:** 86 pages generated in ~9 seconds
- **Tests:** 1,816 tests (1,389 unit + 427 E2E)
- **Coverage:** 96.88% statements, 88.94% branches
- **TypeScript:** 0 errors (strict mode)
- **Lighthouse:** 100/100 (Performance, Accessibility, Best Practices, SEO)
- **Build Size:** Optimized with ViewTransitions

---

## License

**Code:** MIT License  
**Content:** © 2026 Francisco Javier Palacios Pérez - All Rights Reserved
