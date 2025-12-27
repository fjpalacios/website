# Personal Website

[![CI/CD](https://github.com/fjpalacios/website/actions/workflows/ci.yml/badge.svg)](https://github.com/fjpalacios/website/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/fjpalacios/website/branch/master/graph/badge.svg)](https://codecov.io/gh/fjpalacios/website)

Personal website and resume built with [Astro](https://astro.build/). Featuring comprehensive testing, CI/CD, and modern web development best practices.

## ✨ Features

- 🌍 **Multi-language support**: Spanish (default) and English with native Astro i18n and translated URL paths
- 📝 **Blog functionality**: Posts, tutorials, and book reviews with full taxonomy system
- 🏷️ **Rich taxonomy**: Categories, genres, publishers, authors with multilingual support
- 🔍 **Full-text search**: Pagefind-powered instant search with language filtering, keyboard shortcuts, and mobile support
- 🎨 **Theme switcher**: Dark and light themes with localStorage persistence and FOUC prevention (multi-layer approach)
- 📱 **Responsive design**: Mobile-first approach, tested across multiple devices
- ♿ **Accessible**: WCAG 2.1 AA compliant with comprehensive accessibility testing
- 🚀 **Fast**: Static site generation with Astro and View Transitions for SPA-like navigation
- 🎯 **SEO optimized**: Complete meta tags, JSON-LD structured data (Book, BlogPosting, TechArticle), Open Graph, Twitter Cards, canonical URLs, and hreflang support
- 💅 **SCSS styling**: Modular and maintainable styles with CSS variables
- 🧪 **Fully tested**: 441 tests (319 unit + 122 E2E) with 97%+ coverage (including 34 SEO tests + 25 search tests)
- 🔄 **CI/CD**: Automated testing, linting, and Lighthouse performance checks
- 🪝 **Pre-commit hooks**: Automatic linting and testing before commits

## 🛠️ Tech Stack

### Core

- **Framework**: Astro 5.x
- **Language**: TypeScript
- **Styling**: SCSS with CSS variables for theming
- **Icons**: Fontello custom icon font
- **Package Manager**: Bun

### Testing

- **Unit Tests**: Vitest + Testing Library (319 tests, 97%+ coverage)
- **E2E Tests**: Playwright (122 tests across multiple viewports)
- **Search Tests**: 25 dedicated E2E tests for Pagefind integration
- **Accessibility**: Axe-core with WCAG 2.1 AA compliance
- **Performance**: Lighthouse CI integration
- **SEO Tests**: 34 dedicated unit tests for SEO component + E2E structured data validation

### Content

- **Content Collections**: Astro's native content collections for type-safe blog content
- **MDX Support**: Enhanced markdown with React-like components
- **Frontmatter Validation**: Zod schemas for content type safety

### Development Tools

- **Linting**: ESLint with TypeScript, Astro, and import plugins
- **Formatting**: Prettier with Astro plugin
- **Git Hooks**: Husky + lint-staged
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
/
├── .github/
│   └── workflows/
│       └── ci.yml         # CI/CD pipeline configuration
├── .husky/                # Git hooks configuration
├── docs/                  # Project documentation
│   ├── BLOG_MIGRATION_SPEC.md
│   └── BLOG_MIGRATION_PROGRESS.md
├── e2e/                   # End-to-end tests (Playwright) - 7 files
│   ├── breadcrumbs.spec.ts           # Breadcrumb navigation (10 tests)
│   ├── rss.spec.ts                   # RSS feeds validation (12 tests)
│   ├── search.spec.ts                # Search functionality (25 tests) ⭐
│   ├── seo-itemlist.spec.ts          # SEO ItemList schema (40 tests)
│   ├── seo-meta.spec.ts              # SEO meta tags (15 tests)
│   ├── seo-structured-data.spec.ts   # SEO structured data (20 tests)
│   └── state-performance.spec.ts     # State & performance (10 tests)
├── public/                # Static assets (images, fonts, favicon)
├── src/
│   ├── __tests__/         # Unit tests (Vitest) - 319 tests
│   │   ├── content.test.ts
│   │   ├── locales.test.ts
│   │   ├── setup.ts
│   │   ├── theme.test.ts
│   │   ├── components/
│   │   │   └── SEO.test.ts  # 34 SEO tests
│   │   └── utils/
│   │       └── blog/      # Blog utility tests
│   │           ├── categories.test.ts
│   │           ├── genres.test.ts
│   │           ├── publishers.test.ts
│   │           └── ...
│   ├── components/        # Reusable Astro components
│   │   ├── BaseHead.astro
│   │   ├── SEO.astro      # SEO component with Open Graph & JSON-LD
│   │   ├── CategoryList.astro
│   │   ├── GenreList.astro
│   │   ├── LanguageSwitcher.astro
│   │   ├── Paginator.astro
│   │   ├── PostList.astro
│   │   ├── PublisherList.astro
│   │   └── ...
│   ├── content/           # Content collections
│   │   ├── config.ts      # Content collections configuration
│   │   ├── authors/       # Author profiles (JSON)
│   │   ├── categories/    # Blog categories (JSON)
│   │   ├── challenges/    # Reading challenges (JSON)
│   │   ├── genres/        # Book genres (JSON)
│   │   ├── posts/         # Blog posts (MDX)
│   │   ├── publishers/    # Book publishers (JSON)
│   │   ├── series/        # Book series (JSON)
│   │   ├── tutorials/     # Tutorial content (MDX)
│   │   ├── books/         # Book reviews (MDX)
│   │   ├── es/            # Spanish static content
│   │   └── en/            # English static content
│   ├── layouts/           # Page layouts with View Transitions
│   ├── locales/           # Translations (JSON)
│   │   ├── index.ts       # Translation helper functions
│   │   ├── es/
│   │   └── en/
│   ├── pages/             # Routes and pages
│   │   ├── es/            # Spanish pages
│   │   │   ├── blog/
│   │   │   ├── tutoriales/
│   │   │   ├── libros/
│   │   │   ├── categoria/
│   │   │   ├── genero/
│   │   │   └── editorial/
│   │   ├── en/            # English pages
│   │   │   ├── blog/
│   │   │   ├── tutorials/
│   │   │   ├── books/
│   │   │   ├── category/
│   │   │   ├── genre/
│   │   │   └── publisher/
│   │   └── index.astro    # Root redirect to /es/
│   ├── scripts/           # Client-side TypeScript modules
│   │   └── theme.ts       # Theme management logic
│   ├── styles/            # Global and component SCSS
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
│       └── blog/          # Blog-specific utilities
├── astro.config.mjs       # Astro configuration
├── vitest.config.ts       # Unit test configuration
├── playwright.config.ts   # E2E test configuration
└── package.json
```

## 📝 Blog System

The website features a comprehensive blog system with three content types and a rich taxonomy structure, all fully multilingual.

### Content Types

- **Posts** (`/posts/`): Regular blog articles
- **Tutorials** (`/tutorials/`): Technical how-to guides and tutorials
- **Books** (`/books/`): Book reviews and reading notes

All content is written in **MDX** (Markdown + JSX) with frontmatter validation using Zod schemas.

### Taxonomy System

The blog uses a multi-dimensional taxonomy system for content organization. **All URLs use plural nouns** for consistency and SEO best practices:

| Taxonomy       | URL Path             | Applies To              | i18n Support |
| -------------- | -------------------- | ----------------------- | ------------ |
| **Categories** | `/categories/[slug]` | Posts, Tutorials, Books | ✅ Yes       |
| **Genres**     | `/genres/[slug]`     | Books                   | ✅ Yes       |
| **Publishers** | `/publishers/[slug]` | Books                   | ❌ No\*      |
| **Authors**    | `/authors/[slug]`    | Books                   | ❌ No\*      |
| **Series**     | `/series/[slug]`     | Books                   | ✅ Yes       |
| **Challenges** | `/challenges/[slug]` | Books                   | ✅ Yes       |

**\* Publishers and Authors are independent entities per language**, not translations. For example, "Debolsillo" (ES) and "Penguin Random House" (EN) are different publishers.

### URL Structure Examples

**Note:** All URLs use plural nouns in both languages for consistency, following SEO best practices and REST API conventions.

```
Spanish:
/es/publicaciones/                        # All posts (was /es/posts/)
/es/publicaciones/pagina/2/               # Posts pagination (was /es/posts/page/2/)
/es/publicaciones/mi-articulo/            # Individual post
/es/tutoriales/                           # All tutorials
/es/tutoriales/como-hacer-x/              # Individual tutorial
/es/libros/                               # All book reviews
/es/libros/el-nombre-del-viento/          # Individual book review
/es/categorias/libros/                    # Category: books
/es/categorias/libros/pagina/2/           # Category pagination
/es/generos/terror/                       # Genre: horror
/es/editoriales/debolsillo/               # Publisher: Debolsillo
/es/series/fjallbacka/                    # Series: Fjällbacka
/es/retos/reto-lectura-2017/              # Challenge: 2017 Reading Challenge

English:
/en/posts/                                # All posts
/en/posts/page/2/                         # Posts pagination
/en/posts/my-article/                     # Individual post
/en/tutorials/                            # All tutorials
/en/tutorials/how-to-do-x/                # Individual tutorial
/en/books/                                # All book reviews
/en/books/the-name-of-the-wind/           # Individual book review
/en/categories/books/                     # Category: books
/en/categories/books/page/2/              # Category pagination
/en/genres/horror/                        # Genre: horror
/en/publishers/penguin-random-house/      # Publisher: Penguin Random House
/en/series/fjallbacka/                    # Series: Fjällbacka
/en/challenges/2017-reading-challenge/    # Challenge: 2017 Reading Challenge
```

### Why Plural URLs?

Following industry standards and SEO best practices:

- ✅ **Consistency**: All collection URLs use the same pattern
- ✅ **Semantic clarity**: `/books/` clearly indicates "collection of books"
- ✅ **REST API standard**: Matches REST conventions (`/api/books/`)
- ✅ **Better SEO**: More descriptive and expected by users
- ✅ **Industry practice**: Used by GitHub, Medium, Dev.to, etc.

### i18n Translation Strategy

**Categories and Genres** have bidirectional i18n mappings:

```json
// Spanish category: /src/content/categories/tutoriales.json
{
  "slug": "tutoriales",
  "name": "Tutoriales",
  "i18n": "tutorials"  // Maps to English version
}

// English category: /src/content/categories/tutorials.json
{
  "slug": "tutorials",
  "name": "Tutorials",
  "i18n": "tutoriales"  // Maps back to Spanish
}
```

**Publishers and Authors** don't have i18n fields because they represent different entities per language, not translations.

### Content Collections

All blog content uses Astro's Content Collections with Zod schema validation:

```typescript
// Example: Posts collection schema
const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    slug: z.string(),
    lang: z.enum(["es", "en"]),
    categories: z.array(z.string()),
    image: z.string().optional(),
    // ... more fields
  }),
});
```

This provides:

- **Type safety**: TypeScript types auto-generated from schemas
- **Validation**: Content validated at build time
- **Autocomplete**: Full IDE support for frontmatter fields
- **Refactoring**: Safe renames and structure changes

### Blog-Specific Commands

```bash
# Run blog-specific tests
bun run test -- blog

# Run taxonomy tests
bun run test -- categories
bun run test -- genres
bun run test -- publishers

# Build and check generated pages (currently 35 pages)
bun run build
```

## 🔍 Search System

The website features **full-text search** powered by [Pagefind](https://pagefind.app/), a static search library that creates an index at build time.

### Search Features

- **Instant results**: Search as you type with no backend required
- **Language filtering**: Automatically filters by current language (ES/EN)
- **Keyboard shortcuts**: `Cmd+K` / `Ctrl+K` to open, `Esc` to close
- **Modal UI**: Clean, accessible search modal with ARIA support
- **Mobile responsive**: Works on all screen sizes
- **Content exclusion**: Index pages and navigation excluded from results
- **ViewTransitions compatible**: Persists through SPA-like navigation

### Search Implementation

- **Component**: `src/components/Search.astro` (190 lines)
- **Styling**: `src/styles/components/search.scss` (327 lines, BEM methodology)
- **Index generation**: Automatic at build time via Pagefind
- **Dev support**: `scripts/copy-pagefind-dev.js` for development mode

### What's Indexed

- ✅ **Blog posts** (books, tutorials, posts)
- ✅ **Taxonomy detail pages** (authors, categories, genres, etc.)
- ✅ **Static pages** (about, contact)
- ❌ **Index/listing pages** (excluded with `data-pagefind-ignore`)
- ❌ **Navigation/breadcrumbs** (excluded to prevent noise)

### Testing

The search system has **25 dedicated E2E tests** covering:

- Modal open/close (keyboard + click)
- Search results and filtering
- Language-specific results
- UI translations
- Content exclusion
- Edge cases (special chars, long queries, empty queries)
- ViewTransitions persistence

See `e2e/search.spec.ts` for the full test suite.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

### Development

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `bun install`     | Installs dependencies                        |
| `bun run dev`     | Starts local dev server at `localhost:4321`  |
| `bun run build`   | Build your production site to `./dist/`      |
| `bun run preview` | Preview your build locally, before deploying |

### Code Quality

| Command          | Action                    |
| :--------------- | :------------------------ |
| `bun run lint`   | Run ESLint and fix issues |
| `bun run format` | Format code with Prettier |

### Testing

| Command                  | Action                                   |
| :----------------------- | :--------------------------------------- |
| `bun run test`           | Run unit tests in watch mode             |
| `bun run test:run`       | Run unit tests once                      |
| `bun run test:ui`        | Open Vitest UI                           |
| `bun run test:coverage`  | Generate coverage report (97%+ coverage) |
| `bun run test:e2e`       | Run E2E tests with Playwright            |
| `bun run test:e2e:ui`    | Run E2E tests in interactive mode        |
| `bun run test:e2e:debug` | Debug E2E tests                          |

## 🧪 Testing Strategy

### Unit Tests (Vitest)

Located in `src/__tests__/`, covering:

- **Theme system** (18 tests): Dark/light switching, localStorage persistence, View Transitions compatibility
- **Locales** (9 tests): Translation functions, language switching logic
- **Content** (14 tests): Data structure validation for resume, about, and contact content
- **SEO component** (34 tests): Open Graph tags, Twitter Cards, canonical URLs, hreflang, JSON-LD schemas, image URL handling
- **Blog utilities** (244+ tests): Content collections, taxonomy, frontmatter validation
  - Categories (13 tests): Structure, i18n mappings, content references
  - Genres (14 tests): Structure, i18n mappings, hierarchy validation
  - Publishers (13 tests): Structure, language independence
  - Authors (8 tests): Content validation, language independence
  - Posts, Tutorials, Books: Frontmatter validation, slug uniqueness, date formats
  - Pagination (37 tests), filtering, sorting logic
  - Slugify (31 tests): URL generation, special characters, translations

**Total**: 319 tests (21 test files)  
**Coverage**: 97%+ statements, 90%+ branches, 100% functions

### E2E Tests (Playwright)

Located in `e2e/`, covering:

- **Search** (25 tests): Modal UI, keyboard shortcuts, results filtering, language support, content exclusion
- **SEO** (75+ tests): Meta tags, Open Graph, Twitter Cards, JSON-LD structured data (Book, BlogPosting, TechArticle)
- **Breadcrumbs** (10 tests): Navigation, ARIA labels, structured data
- **RSS Feeds** (12 tests): Feed generation, autodiscovery, content validation
- **Accessibility**: WCAG 2.1 Level AA compliance, keyboard navigation
- **Performance**: Load times, console errors, resource loading
- **State management**: LocalStorage persistence, theme across ViewTransitions

**Total**: 122 tests (7 test files) across Chromium

## 🏗️ Content Management

### Static Content

Type-safe content in TypeScript files:

- **Resume data**: `src/content/{lang}/resume.ts`
- **About page**: `src/content/{lang}/about.ts`
- **Contact info**: `src/content/{lang}/contact.ts`
- **UI translations**: `src/locales/{lang}/common.json`

All content follows TypeScript interfaces defined in `src/types/content.ts`.

### Blog Content (Content Collections)

Dynamic content using Astro Content Collections with MDX and JSON:

- **Posts**: `src/content/posts/{lang}/[slug].mdx`
- **Tutorials**: `src/content/tutorials/{lang}/[slug].mdx`
- **Books**: `src/content/books/{lang}/[slug].mdx`
- **Categories**: `src/content/categories/[slug].json`
- **Genres**: `src/content/genres/[slug].json`
- **Publishers**: `src/content/publishers/[slug].json`
- **Authors**: `src/content/authors/[slug].json`

All collections are validated with Zod schemas defined in `src/content/config.ts`.

## 🎨 Theme System

The theme switcher features a **multi-layer FOUC prevention approach** ensuring zero visual flash on page load:

### Theme Features

- **CSS variables** for colors with dark theme as default
- **SCSS modules** for theme definitions on `html` and `html.light`
- **localStorage** for persistence across sessions
- **View Transitions compatible**: Theme persists during SPA-like navigation
- **Keyboard accessible**: Full support for keyboard-only users

### FOUC Prevention Strategy (3 Layers)

1. **CSS Layer (Primary)**: Dark theme variables set directly on `html` element

   - No JavaScript required for default theme
   - Instant theme application on page load
   - Light theme applied via `html.light` class

2. **JavaScript Layer (Head)**: Blocking script applies saved theme

   - Runs before page render
   - Applies `.dark` or `.light` class to `<html>` and `<body>`
   - Updates `data-theme` attribute for CSS hooks

3. **Icon Update Layer (Inline)**: Immediate theme icon update
   - Inline script after Menu component
   - Updates icon without waiting for DOMContentLoaded
   - Prevents icon flash from showing wrong emoji

Theme logic is extracted to `src/scripts/theme.ts` for reusability and testing.

## 🌍 Internationalization

- **Default language**: Spanish (`es`)
- **Available languages**: Spanish (`es`), English (`en`)
- **Routing**: `/es/` and `/en/` prefixes with native Astro i18n helpers
- **Root behavior**: `/` redirects to `/es/`
- **Path aliases**: Configured for easy imports (`@components`, `@locales`, etc.)

## 🔄 CI/CD Pipeline

GitHub Actions workflows run on every push and PR:

### Main CI/CD Pipeline (`.github/workflows/ci.yml`)

1. **Lint & Format Check**: ESLint + Prettier validation
2. **Unit Tests**: Vitest with coverage reporting to Codecov (319 tests)
3. **E2E Tests**: Playwright tests on Chromium (122 tests)
4. **Build Check**: Ensures production build succeeds
5. **Lighthouse CI**: Performance, accessibility, SEO, and best practices audits

### Dependabot Automation

**Dependabot Lockfile Fix** (`.github/workflows/dependabot-lockfile-fix.yml`):

- Automatically syncs `bun.lock` when Dependabot updates `package.json`
- Prevents CI failures from frozen lockfile mismatches
- Comments on PR when lockfile is updated

**Dependabot Auto-Merge** (`.github/workflows/dependabot-auto-merge.yml`):

- Auto-merges minor and patch updates after CI passes
- Flags major updates for manual review

### Pre-commit Hooks

Husky + lint-staged automatically run before every commit:

- Lints and formats staged files
- Runs unit tests to catch regressions early

### Dependabot

Automated dependency management configured in `.github/dependabot.yml`:

- **Weekly updates**: Runs every Monday at 09:00 (Europe/Madrid)
- **NPM dependencies**: Grouped by type (dev/prod) for minor and patch updates
- **GitHub Actions**: Keeps workflow dependencies up-to-date
- **Auto-merge**: Minor and patch updates are automatically merged after CI passes
- **Manual review**: Major updates are flagged and require manual approval
- **Ignored majors**: Core packages (Astro, TypeScript, Playwright, Vitest) require manual major updates

## 📊 Code Quality Metrics

- **Total Tests**: 441 tests (319 unit + 122 E2E)
- **Unit Tests**: 319 tests across 21 test files (including 34 SEO tests)
- **Unit Test Coverage**: 97%+ statements, 90%+ branches, 100% functions
- **E2E Tests**: 122 tests across 7 test files covering all critical flows
- **Search Tests**: 25 dedicated E2E tests for Pagefind integration
- **Accessibility**: WCAG 2.1 Level AA compliant
- **Performance**: Optimized for Core Web Vitals
- **SEO**: Complete metadata with Open Graph, Twitter Cards, JSON-LD structured data (Book, BlogPosting, TechArticle), canonical URLs, hreflang, sitemap
- **Build Output**: 88 pages generated (resume, blog, taxonomy pages, paginated listings)

## 🚀 Performance Features

- **Static Site Generation**: Pre-rendered HTML for instant loads
- **View Transitions**: Smooth SPA-like navigation without full page reloads
- **Responsive Images**: Optimized assets for different screen sizes
- **CSS Optimization**: Scoped styles, CSS variables, no runtime JS for styling
- **Lazy Loading**: Images and non-critical resources load on demand

## ♿ Accessibility Features

- **Semantic HTML**: Proper landmark elements (`nav`, `main`, `header`)
- **ARIA attributes**: Labels, roles, and states where needed
- **Keyboard navigation**: Full tab order and focus management
- **Screen reader support**: Meaningful alt text and labels
- **Color contrast**: WCAG AA compliant contrast ratios
- **Focus indicators**: Visible focus states for all interactive elements

## 🔧 Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/fjpalacios/website.git
   cd website
   ```

2. **Install Bun** (if not already installed)

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Install dependencies**

   ```bash
   bun install
   ```

4. **Start development server**

   ```bash
   bun run dev
   ```

5. **Run tests**

   ```bash
   # Unit tests
   bun run test

   # E2E tests (requires build first)
   bun run build
   bun run test:e2e
   ```

## 📝 Contributing

This is a personal website, but contributions are welcome!

### Documentation

- **[CONTRIBUTING.md](.github/CONTRIBUTING.md)**: Development workflow, branch naming, commit format
- **[docs/SEARCH_IMPLEMENTATION.md](docs/SEARCH_IMPLEMENTATION.md)**: Pagefind search architecture and usage ⭐
- **[docs/SEARCH_AUDIT.md](docs/SEARCH_AUDIT.md)**: Deep audit report of search implementation
- **[docs/BLOG_MIGRATION_SPEC.md](docs/BLOG_MIGRATION_SPEC.md)**: Blog system architecture and migration plan
- **[docs/BLOG_MIGRATION_PROGRESS.md](docs/BLOG_MIGRATION_PROGRESS.md)**: Current implementation status and progress
- **[docs/SESSION_2025-12-21_CONTEXT.md](docs/SESSION_2025-12-21_CONTEXT.md)**: Project context and URL structure
- **[docs/TAXONOMY_DETAIL_PAGES_ANALYSIS.md](docs/TAXONOMY_DETAIL_PAGES_ANALYSIS.md)**: Technical analysis of taxonomy pages
- **[docs/DEVELOPMENT_GUIDELINES.md](docs/DEVELOPMENT_GUIDELINES.md)**: Development best practices and patterns
- **[docs/ROADMAP.md](docs/ROADMAP.md)**: Project roadmap and future plans
- **[docs/SESSION\_\*.md](docs/)**: Session reports documenting decisions and fixes

### Contribution Guidelines

Please see [CONTRIBUTING.md](.github/CONTRIBUTING.md) for details on:

- Development workflow (feature branches, PRs)
- Branch naming conventions
- Commit message format (Conventional Commits)
- Testing requirements
- Code review process

### Quick Start for Contributors:

```bash
# 1. Create a feature branch
git checkout -b feature/your-feature

# 2. Make changes and commit
git commit -m "feat: add new feature"

# 3. Push and create PR
git push -u origin feature/your-feature
gh pr create --title "feat: add new feature"
```

**Note**: The `master` branch is protected. All changes must go through pull requests and pass CI/CD checks.

## 📄 License

This project structure and code are available for reference under MIT License. Content (resume, about, contact info) is personal and copyrighted.

## 👤 Author

**Francisco Javier Palacios Pérez (Javi)**

- Website: https://fjp.es
- GitHub: [@fjpalacios](https://github.com/fjpalacios)
- LinkedIn: [fjpalacios](https://www.linkedin.com/in/fjpalacios/)

---

Built with ❤️ using Astro, TypeScript, and modern web development best practices.
