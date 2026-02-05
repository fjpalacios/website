# AGENTS.md

Astro 5 static site. Bilingual (ES/EN), book reviews + blog. TypeScript strict, BEM SCSS, TDD. Lighthouse 100, WCAG AAA.

---

## Commands

```bash
# Dev & build
bun run dev              # localhost:4321
bun run build            # production build (Astro + Pagefind)
bun run preview          # preview built site

# Lint & format
bun run format           # Prettier (write)
bun run lint             # ESLint (fix)
bun run typecheck        # tsc --noEmit (strict)

# Unit tests (Vitest)
bun run test                          # all unit tests
bun run test src/__tests__/utils/foo.test.ts  # single file
bun run test:watch                    # watch mode
bun run test:coverage                 # coverage report

# E2E tests (Playwright)
bun run test:e2e                      # full e2e suite (builds first)
bun run test:e2e:ui                   # Playwright UI
bun run test:visual                   # visual regression only
bun run test:visual:update            # update visual snapshots

# Pre-commit (ALL must pass)
bun run format && bun run lint && bun run typecheck && bun run test && bun run test:e2e
```

---

## Project Layout

```
src/
├── components/          # .astro components (PascalCase)
├── content/             # MDX collections: books, authors, posts, tutorials…
│   └── config.ts        # Zod schemas for all collections
├── layouts/             # Page layouts
├── pages/               # Routes — [lang]/[...route].astro (dynamic bilingual)
├── pages-templates/     # Reusable page templates
├── styles/
│   ├── components/      # Per-component SCSS (kebab-case, BEM)
│   ├── _mixins.scss
│   └── _variables.scss
├── utils/               # Pure typed helpers (camelCase)
├── config/              # App-wide config: nav, routing, i18n
├── constants/           # UPPER_SNAKE_CASE constants
├── types/               # Shared TS interfaces
├── locales/             # i18n strings
└── __tests__/           # Vitest — mirrors src/ structure

e2e/                     # Playwright specs + visual snapshots
public/_redirects        # Cloudflare 301 redirects (SEO — update when changing URLs)
docs/                    # All project documentation
scripts/                 # Build/migration/validation helpers
```

---

## Code Style

### TypeScript

- `strict: true` — no `any`, no implicit returns, no magic numbers
- Explicit types on all function signatures
- Interfaces for object shapes; `zod` for runtime validation
- Prefix unused vars with `_` (ESLint enforced)

### Imports

Path aliases are mandatory — no relative `../../` chains:

```ts
import { something } from "@/utils/something";
import MyComponent from "@components/MyComponent.astro";
```

Order (enforced by ESLint `import/order`): **builtin → external → `@/` aliases → sibling/parent**. Blank line between groups, alphabetized within each.

### Naming

| What            | Convention                 | Example                    |
| --------------- | -------------------------- | -------------------------- |
| Components      | PascalCase `.astro`        | `AuthorInfo.astro`         |
| Utils / helpers | camelCase `.ts`            | `bookLinkHelpers.ts`       |
| SCSS files      | kebab-case                 | `book-list.scss`           |
| CSS classes     | BEM                        | `book-list__title--active` |
| Constants       | UPPER_SNAKE_CASE           | `MAX_BOOKS_PER_PAGE`       |
| Test files      | `*.test.ts` next to source | `Rating.test.ts`           |

### Styles — SCSS + BEM

- **Zero inline styles** in `.astro` files (custom ESLint rule enforces this)
- Every component gets a matching file in `src/styles/components/`
- BEM: `block__element--modifier`

### Error Handling

- Typed error classes in `src/utils/errors.ts`
- Never silently swallow — log or rethrow
- Content validation errors (`bun run validate`) must fail the build

---

## Testing

- **TDD**: tests first, then implementation. Target **100% coverage**.
- Unit tests live in `src/__tests__/`, mirroring `src/` structure.
- E2E specs in `e2e/`. Playwright projects: `chromium`, `visual-regression`, responsive (iPhone 12, iPhone SE, iPad, large desktop).
- `astro:content` is mocked via `src/__mocks__/astro-content.ts` — check it before writing content-related tests.
- Test environment: `happy-dom` (configured in `vitest.config.ts`).

---

## Git

- Main branch: `master`. Feature branches: `feat/…`, `fix/…`, `refactor/…`
- Conventional commits in **English** (`feat:`, `fix:`, `refactor:`, `chore:`)
- **NEVER commit or push without explicit user approval**
- Run the full pre-commit chain above before every commit — fix any failure immediately

---

## Hard Rules

- No `any` types. No inline styles. No magic numbers. No duplicated logic.
- All code, comments, commits, and docs in **English**.
- Changing a URL? Update `public/_redirects`.
- Spotted something refactorable? Document it in `docs/` — propose it now.
- Failing test? Fix it. No exceptions.
