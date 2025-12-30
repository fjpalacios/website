# Personal Website

[![CI/CD](https://github.com/fjpalacios/website/actions/workflows/ci.yml/badge.svg)](https://github.com/fjpalacios/website/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/fjpalacios/website/branch/master/graph/badge.svg)](https://codecov.io/gh/fjpalacios/website)

My personal website and blog built with [Astro](https://astro.build/). Clean, fast, and fully tested.

**Live:** https://fjp.es (coming soon)

## ✨ Features

- 🌍 **Bilingual** - Spanish and English with proper i18n routing
- 📝 **Blog** - Posts, tutorials, and book reviews
- 🔍 **Search** - Full-text search with [Pagefind](https://pagefind.app/)
- 🎨 **Dark mode** - Persistent theme switching with zero flash
- ♿ **Accessible** - WCAG 2.1 Level AAA compliant
- 🚀 **Fast** - Lighthouse 100/100 on all metrics
- 🧪 **Tested** - 1,336 tests (1,084 unit + 252 E2E)
- 📱 **Responsive** - Mobile-first design

## 🛠️ Tech Stack

- **Framework:** [Astro](https://astro.build/) 5.x
- **Language:** TypeScript
- **Styling:** SCSS with CSS variables
- **Testing:** Vitest + Playwright
- **Package Manager:** Bun
- **Deployment:** Cloudflare Pages (planned)

## 🚀 Quick Start

```bash
# Install Bun (if needed)
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start dev server
bun run dev

# Run tests
bun run test           # Unit tests
bun run test:e2e       # E2E tests (requires build first)
```

## 📁 Project Structure

```
/
├── src/
│   ├── components/         # Reusable Astro components
│   ├── content/            # Content collections (MDX + JSON)
│   │   ├── books/          # Book reviews
│   │   ├── posts/          # Blog posts
│   │   ├── tutorials/      # Technical tutorials
│   │   └── ...             # Taxonomies (authors, genres, etc.)
│   ├── layouts/            # Page layouts
│   ├── pages/              # Routes
│   │   └── [lang]/[...route].astro  # Unified router
│   ├── pages-templates/    # Page templates (25 files)
│   ├── styles/             # SCSS modules
│   └── utils/              # Helper functions
├── e2e/                    # E2E tests (Playwright)
├── docs/                   # Project documentation
└── public/                 # Static assets
```

## 🧞 Commands

| Command                 | Action                               |
| :---------------------- | :----------------------------------- |
| `bun install`           | Install dependencies                 |
| `bun run dev`           | Start dev server at `localhost:4321` |
| `bun run build`         | Build production site to `./dist/`   |
| `bun run preview`       | Preview production build locally     |
| `bun run lint`          | Lint code with ESLint                |
| `bun run format`        | Format code with Prettier            |
| `bun run test`          | Run unit tests (watch mode)          |
| `bun run test:coverage` | Generate coverage report             |
| `bun run test:e2e`      | Run E2E tests with Playwright        |

## 🏗️ Architecture Highlights

### Unified Routing

Single router file (`src/pages/[lang]/[...route].astro`) handles all content types:

- ✅ Zero code duplication
- ✅ Type-safe with TypeScript
- ✅ Easy to add new languages (config change only)
- ✅ 86 dynamic paths generated automatically

**Before:** 52 files, 50% duplication  
**After:** 1 router + 25 templates, 0% duplication

### Content Collections

Type-safe content with Zod validation:

```typescript
// Automatic TypeScript types from schema
const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    categories: z.array(z.string()),
    // ... more fields
  }),
});
```

### Theme System

Multi-layer FOUC prevention:

1. CSS-first (dark theme as default)
2. Blocking script in `<head>` (applies saved theme)
3. Inline script (updates icon immediately)

Result: Zero visual flash on page load.

## 🧪 Testing

- **Unit tests:** 1,084 tests with Vitest (97%+ coverage)
- **E2E tests:** 252 tests with Playwright
- **Total:** 1,336 tests covering all critical paths

Key test areas:

- SEO (34 unit + 75 E2E tests)
- Accessibility (50 E2E tests)
- Search (25 E2E tests)
- Routing (114 unit tests)
- Print styles (28 E2E tests)

## 🌍 i18n

- **Default:** Spanish (`es`)
- **Available:** English (`en`)
- **Routes:** `/es/...` and `/en/...`
- **Scalable:** Add new language = config change only

URL examples:

```
/es/publicaciones/           # Posts (ES)
/en/posts/                   # Posts (EN)
/es/libros/el-nombre-del-viento/  # Book detail (ES)
/en/books/the-name-of-the-wind/   # Book detail (EN)
```

## 📊 Quality Metrics

- ✅ **Lighthouse:** 100/100 (Performance, Accessibility, Best Practices, SEO)
- ✅ **WCAG:** Level AAA compliant
- ✅ **Test Coverage:** 97%+ statements, 90%+ branches
- ✅ **TypeScript:** 0 errors, strict mode
- ✅ **ESLint:** 0 errors, 0 warnings
- ✅ **Build:** 88 pages in ~8 seconds

## 🔍 Search

Full-text search powered by [Pagefind](https://pagefind.app/):

- Instant results (no backend needed)
- Language filtering (ES/EN)
- Keyboard shortcuts (`Cmd+K`)
- Mobile-friendly modal UI

## 📝 Contributing

This is a personal website, but contributions are welcome! Please:

1. Create a feature branch
2. Write tests for new features
3. Follow [Conventional Commits](https://www.conventionalcommits.org/)
4. Open a PR

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for details.

## 📚 Documentation

- [Search Implementation](docs/SEARCH_IMPLEMENTATION.md)
- [Blog System](docs/BLOG_MIGRATION_SPEC.md)
- [Router Architecture](docs/ROUTER_COMPLEXITY_ANALYSIS.md)
- [Development Guidelines](docs/DEVELOPMENT_GUIDELINES.md)
- [Roadmap](docs/ROADMAP.md)

## 📄 License

Code: MIT License  
Content: © Francisco Javier Palacios Pérez

## 👤 Author

**Francisco Javier Palacios Pérez (Javi)**

- Website: https://fjp.es
- GitHub: [@fjpalacios](https://github.com/fjpalacios)
- LinkedIn: [fjpalacios](https://www.linkedin.com/in/fjpalacios/)

---

Built with ❤️ using Astro, TypeScript, and modern web development best practices.
