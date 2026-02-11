# Personal Website

[![CI/CD](https://github.com/fjpalacios/website/actions/workflows/ci.yml/badge.svg)](https://github.com/fjpalacios/website/actions/workflows/ci.yml)
[![Lighthouse](https://img.shields.io/badge/lighthouse-100-brightgreen?logo=lighthouse)](https://fjp.es)
[![Tests](https://img.shields.io/badge/tests-2238%20passing-brightgreen)](https://github.com/fjpalacios/website)
[![Live](https://img.shields.io/badge/live-fjp.es-blue)](https://fjp.es)

My personal blog built with Astro. Book reviews, tech tutorials, and blog posts in Spanish and English.

---

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server (http://localhost:4321)
bun run dev

# Run tests
bun run test           # Unit tests (1,692 tests)
bun run test:e2e       # E2E tests (546 tests)
bun run test:coverage  # Coverage report
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
🧪 **Tested** - 2,238 tests (1,692 unit + 546 E2E)  
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

- **[DEVELOPMENT_GUIDELINES.md](docs/DEVELOPMENT_GUIDELINES.md)** - Coding standards
- **[ADDING_LANGUAGES.md](docs/ADDING_LANGUAGES.md)** - Add new language (~15 min)
- **[IMAGE_GENERATION.md](docs/IMAGE_GENERATION.md)** - Generate OG images

---

## Metrics

- **Pages:** 554 pages generated in ~9 seconds
- **Tests:** 2,238 tests (1,692 unit + 546 E2E)
- **Coverage:** 91.59% statements, 81.19% branches
- **TypeScript:** 0 errors (strict mode)
- **Lighthouse:** 100/100 (Performance, Accessibility, Best Practices, SEO)

---

## License

**Code:** MIT License  
**Content:** © 2026 Francisco Javier Palacios Pérez - All Rights Reserved
