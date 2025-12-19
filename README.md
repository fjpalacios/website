# Personal Website

[![CI/CD](https://github.com/fjpalacios/website/actions/workflows/ci.yml/badge.svg)](https://github.com/fjpalacios/website/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/fjpalacios/website/branch/master/graph/badge.svg)](https://codecov.io/gh/fjpalacios/website)

Personal website and resume built with [Astro](https://astro.build/). Featuring comprehensive testing, CI/CD, and modern web development best practices.

## ✨ Features

- 🌍 **Multi-language support**: Spanish (default) and English with native Astro i18n
- 🎨 **Theme switcher**: Dark and light themes with localStorage persistence and FOUC prevention
- 📱 **Responsive design**: Mobile-first approach, tested across multiple devices
- ♿ **Accessible**: WCAG 2.1 AA compliant with comprehensive accessibility testing
- 🚀 **Fast**: Static site generation with Astro and View Transitions for SPA-like navigation
- 🎯 **SEO optimized**: Complete meta tags, JSON-LD structured data, sitemap, and Open Graph support
- 💅 **SCSS styling**: Modular and maintainable styles with CSS variables
- 🧪 **Fully tested**: 97%+ unit test coverage + comprehensive E2E tests
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

- **Unit Tests**: Vitest + Testing Library (41 tests, 97%+ coverage)
- **E2E Tests**: Playwright (69+ tests across multiple viewports)
- **Accessibility**: Axe-core with WCAG 2.1 AA compliance
- **Performance**: Lighthouse CI integration

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
├── e2e/                   # End-to-end tests (Playwright)
│   ├── about.spec.ts
│   ├── accessibility-comprehensive.spec.ts
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   ├── responsive.spec.ts
│   ├── seo-meta.spec.ts
│   └── state-performance.spec.ts
├── public/                # Static assets (images, fonts, favicon)
├── src/
│   ├── __tests__/         # Unit tests (Vitest)
│   │   ├── content.test.ts
│   │   ├── locales.test.ts
│   │   ├── setup.ts
│   │   └── theme.test.ts
│   ├── components/        # Reusable Astro components
│   ├── content/           # Content in TypeScript (resume, about, contact)
│   │   ├── config.ts      # Content collections configuration
│   │   ├── es/            # Spanish content
│   │   └── en/            # English content
│   ├── layouts/           # Page layouts with View Transitions
│   ├── locales/           # Translations (JSON)
│   │   ├── index.ts       # Translation helper functions
│   │   ├── es/
│   │   └── en/
│   ├── pages/             # Routes and pages
│   │   ├── es/            # Spanish pages
│   │   ├── en/            # English pages
│   │   └── index.astro    # Root redirect to /es/
│   ├── scripts/           # Client-side TypeScript modules
│   │   └── theme.ts       # Theme management logic
│   ├── styles/            # Global and component SCSS
│   └── types/             # TypeScript type definitions
├── astro.config.mjs       # Astro configuration
├── vitest.config.ts       # Unit test configuration
├── playwright.config.ts   # E2E test configuration
└── package.json
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

**Coverage**: 97.43% lines, 92.68% statements, 100% functions

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

Content is organized in TypeScript files for type safety:

- **Resume data**: `src/content/{lang}/resume.ts`
- **About page**: `src/content/{lang}/about.ts`
- **Contact info**: `src/content/{lang}/contact.ts`
- **UI translations**: `src/locales/{lang}/common.json`

All content follows TypeScript interfaces defined in `src/types/content.ts`.

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

- **Unit Test Coverage**: 97.43% lines, 100% functions
- **E2E Test Coverage**: 69+ tests covering all critical user flows
- **Accessibility**: WCAG 2.1 Level AA compliant
- **Performance**: Optimized for Core Web Vitals
- **SEO**: Complete metadata, structured data, sitemap

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

While this is a personal website, feel free to:

- Report bugs or accessibility issues
- Suggest improvements
- Use the project structure and setup as a reference for your own projects

## 📄 License

This project structure and code are available for reference under MIT License. Content (resume, about, contact info) is personal and copyrighted.

## 👤 Author

**Francisco Javier Palacios Pérez (Javi)**

- Website: https://fjp.es
- GitHub: [@fjpalacios](https://github.com/fjpalacios)
- LinkedIn: [fjpalacios](https://www.linkedin.com/in/fjpalacios/)

---

Built with ❤️ using Astro, TypeScript, and modern web development best practices.

# Test protection
