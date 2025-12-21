# Personal Website

[![CI/CD](https://github.com/fjpalacios/website/actions/workflows/ci.yml/badge.svg)](https://github.com/fjpalacios/website/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/fjpalacios/website/branch/master/graph/badge.svg)](https://codecov.io/gh/fjpalacios/website)

Personal website and resume built with [Astro](https://astro.build/). Featuring comprehensive testing, CI/CD, and modern web development best practices.

## ✨ Features

- 🌍 **Multi-language support**: Spanish (default) and English with native Astro i18n and translated URL paths
- 📝 **Blog functionality**: Posts, tutorials, and book reviews with full taxonomy system
- 🏷️ **Rich taxonomy**: Categories, genres, publishers, authors with multilingual support
- 🎨 **Theme switcher**: Dark and light themes with localStorage persistence and FOUC prevention
- 📱 **Responsive design**: Mobile-first approach, tested across multiple devices
- ♿ **Accessible**: WCAG 2.1 AA compliant with comprehensive accessibility testing
- 🚀 **Fast**: Static site generation with Astro and View Transitions for SPA-like navigation
- 🎯 **SEO optimized**: Complete meta tags, JSON-LD structured data, sitemap, and Open Graph support
- 💅 **SCSS styling**: Modular and maintainable styles with CSS variables
- 🧪 **Fully tested**: 438 tests with 97.72% coverage
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

- **Unit Tests**: Vitest + Testing Library (438 tests, 97.72% coverage)
- **E2E Tests**: Playwright (69+ tests across multiple viewports)
- **Accessibility**: Axe-core with WCAG 2.1 AA compliance
- **Performance**: Lighthouse CI integration

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
├── e2e/                   # End-to-end tests (Playwright)
│   ├── about.spec.ts
│   ├── accessibility-comprehensive.spec.ts
│   ├── blog.spec.ts
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   ├── responsive.spec.ts
│   ├── seo-meta.spec.ts
│   └── state-performance.spec.ts
├── public/                # Static assets (images, fonts, favicon)
├── src/
│   ├── __tests__/         # Unit tests (Vitest) - 438 tests
│   │   ├── content.test.ts
│   │   ├── locales.test.ts
│   │   ├── setup.ts
│   │   ├── theme.test.ts
│   │   └── utils/
│   │       └── blog/      # Blog utility tests
│   │           ├── categories.test.ts
│   │           ├── genres.test.ts
│   │           ├── publishers.test.ts
│   │           └── ...
│   ├── components/        # Reusable Astro components
│   │   ├── BaseHead.astro
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
/es/posts/                            # All posts
/es/posts/page/2/                     # Posts pagination
/es/posts/mi-articulo/                # Individual post
/es/tutorials/                        # All tutorials
/es/tutorials/como-hacer-x/           # Individual tutorial
/es/books/                            # All book reviews
/es/books/el-nombre-del-viento/       # Individual book review
/es/categories/libros/                # Category: books
/es/categories/libros/page/2/         # Category pagination
/es/genres/terror/                    # Genre: horror
/es/publishers/debolsillo/            # Publisher: Debolsillo
/es/series/fjallbacka/                # Series: Fjällbacka
/es/challenges/reto-lectura-2017/     # Challenge: 2017 Reading Challenge

English:
/en/posts/                            # All posts
/en/posts/my-article/                 # Individual post
/en/tutorials/                        # All tutorials
/en/tutorials/how-to-do-x/            # Individual tutorial
/en/books/                            # All book reviews
/en/books/the-name-of-the-wind/       # Individual book review
/en/categories/books/                 # Category: books
/en/genres/horror/                    # Genre: horror
/en/publishers/penguin-random-house/  # Publisher: Penguin Random House
/en/series/fjallbacka/                # Series: Fjällbacka
/en/challenges/2017-reading-challenge/ # Challenge: 2017 Reading Challenge
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

| Command                  | Action                                     |
| :----------------------- | :----------------------------------------- |
| `bun run test`           | Run unit tests in watch mode               |
| `bun run test:run`       | Run unit tests once                        |
| `bun run test:ui`        | Open Vitest UI                             |
| `bun run test:coverage`  | Generate coverage report (97.72% coverage) |
| `bun run test:e2e`       | Run E2E tests with Playwright              |
| `bun run test:e2e:ui`    | Run E2E tests in interactive mode          |
| `bun run test:e2e:debug` | Debug E2E tests                            |

## 🧪 Testing Strategy

### Unit Tests (Vitest)

Located in `src/__tests__/`, covering:

- **Theme system** (18 tests): Dark/light switching, localStorage persistence, View Transitions compatibility
- **Locales** (9 tests): Translation functions, language switching logic
- **Content** (14 tests): Data structure validation for resume, about, and contact content
- **Blog utilities** (397 tests): Content collections, taxonomy, frontmatter validation
  - Categories (13 tests): Structure, i18n mappings, content references
  - Genres (14 tests): Structure, i18n mappings, hierarchy validation
  - Publishers (13 tests): Structure, language independence
  - Posts, Tutorials, Books: Frontmatter validation, slug uniqueness, date formats
  - Pagination, filtering, sorting logic

**Total**: 438 tests  
**Coverage**: 97.72% statements, 98.74% lines, 100% functions

### E2E Tests (Playwright)

Located in `e2e/`, covering:

- **Home & About pages**: SEO validation, metadata, accessibility
- **Navigation**: Language switching, menu navigation, routing, 404 handling
- **Accessibility**: WCAG 2.1 Level AA compliance, keyboard navigation, ARIA labels
- **Responsive design**: Mobile (iPhone 12, iPhone SE), Tablet (iPad), Desktop viewports
- **Performance**: Load times, console errors, resource loading
- **State management**: LocalStorage persistence, theme across navigation
- **SEO & Social**: Open Graph, Twitter Cards, JSON-LD structured data

**Total**: 69+ tests across multiple projects/viewports

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

The theme switcher features:

- **CSS variables** for colors
- **SCSS placeholders** for theme definitions
- **localStorage** for persistence across sessions
- **FOUC prevention**: Inline script applies theme before page render
- **View Transitions compatible**: Theme persists during SPA-like navigation
- **Keyboard accessible**: Full support for keyboard-only users

Theme logic is extracted to `src/scripts/theme.ts` for reusability and testing.

## 🌍 Internationalization

- **Default language**: Spanish (`es`)
- **Available languages**: Spanish (`es`), English (`en`)
- **Routing**: `/es/` and `/en/` prefixes with native Astro i18n helpers
- **Root behavior**: `/` redirects to `/es/`
- **Path aliases**: Configured for easy imports (`@components`, `@locales`, etc.)

## 🔄 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR:

1. **Lint & Format Check**: ESLint + Prettier validation
2. **Unit Tests**: Vitest with coverage reporting to Codecov
3. **E2E Tests**: Playwright tests on Chromium
4. **Build Check**: Ensures production build succeeds
5. **Lighthouse CI**: Performance, accessibility, SEO, and best practices audits (PRs only)

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

- **Unit Tests**: 438 tests across all features
- **Unit Test Coverage**: 97.72% statements, 98.74% lines, 100% functions
- **E2E Test Coverage**: 69+ tests covering all critical user flows
- **Accessibility**: WCAG 2.1 Level AA compliant
- **Performance**: Optimized for Core Web Vitals
- **SEO**: Complete metadata, structured data, sitemap
- **Build Output**: 35 pages generated (resume, blog, taxonomy pages)

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
- **[docs/BLOG_MIGRATION_SPEC.md](docs/BLOG_MIGRATION_SPEC.md)**: Blog system architecture and migration plan
- **[docs/BLOG_MIGRATION_PROGRESS.md](docs/BLOG_MIGRATION_PROGRESS.md)**: Current implementation status and progress
- **[docs/SESSION_2025-12-21_CONTEXT.md](docs/SESSION_2025-12-21_CONTEXT.md)**: Project context and URL structure ⭐ **READ THIS FIRST!**
- **[docs/TAXONOMY_DETAIL_PAGES_ANALYSIS.md](docs/TAXONOMY_DETAIL_PAGES_ANALYSIS.md)**: Technical analysis of taxonomy pages
- **[docs/DEVELOPMENT_GUIDELINES.md](docs/DEVELOPMENT_GUIDELINES.md)**: Development best practices and patterns
- **[docs/SESSION_*.md](docs/)**: Session reports documenting decisions and fixes

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
