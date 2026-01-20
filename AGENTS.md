Personal website built with **Astro 5** (high test coverage, Lighthouse 100/100). Bilingual (ES/EN), Pagefind search, WCAG AAA. **Use ONLY best engineering practices. Reject ALL anti-patterns.**

## 🎯 Project Overview

Static blog with **book reviews** as primary content, plus tech tutorials and posts. Multiple dynamic routes with unified bilingual routing. **Zero-config excellence**: TypeScript strict, BEM SCSS, TDD with 100% coverage target.

### Content Structure

The site manages several content types in `src/content/`:

- **Books** (`books/`) - Book reviews with ratings, genres, series, challenges
- **Authors** (`authors/`) - Author profiles and bibliographies
- **Publishers** (`publishers/`) - Publishing house information
- **Series** (`series/`) - Book series collections
- **Genres** (`genres/`) - Genre taxonomies
- **Challenges** (`challenges/`) - Reading challenges and goals
- **Posts** (`posts/`) - Blog posts and articles
- **Tutorials** (`tutorials/`) - Technical tutorials and guides
- **Courses** (`courses/`) - Educational course metadata

All content is written in **MDX** format for dynamic components within markdown.

## 🤖 Guidelines for LLM Agents

These are the primary responsibilities expected of an LLM agent within this project:

- **Code Exploration:**
  - Locate specific code, utilities, schemas, or comments through pattern matching or full-text searches.
  - Provide summaries of found code snippets or files for the sake of documentation or testing.
- **Refactoring Suggestions:**
  - Identify duplicated logic and recommend ways to abstract into reusable components.
  - Highlight anti-patterns and other opportunities for refactor based on modern industry practices.
  - When touching code, if you see something that can be refactored, PROPOSE a change immediately (document in `docs/` for future implementation).
- **Testing Contributions:**
  - Write initial drafts for unit tests, integration tests, or e2e tests.
  - Follow TDD: write tests first, then implementation.
  - Target 100% test coverage for all new code.
- **Documentation Management:**
  - Create `docs/` directory if it doesn't exist.
  - Document EVERYTHING in markdown files (but write like a human: concise, not extremely verbose).
  - Update existing documentation (`docs/ROADMAP.md`, `DEVELOPMENT_GUIDELINES.md`, etc.) when changes are made.
  - For new projects, create a `docs/ROADMAP.md` detailing what and how you plan to implement.
  - Document refactoring proposals in `docs/` for later implementation.
  - Highlight areas where documentation is missing so they can be addressed promptly.

## 🛠️ Setup & Commands (Bun)

```bash
bun install
bun run dev          # http://localhost:4321
bun run build
bun run preview
bun run format       # Prettier
bun run lint         # ESLint
bun run typecheck    # TS strict
bun run test         # Vitest unit tests
bun run test:e2e     # Playwright E2E tests
bun run test:coverage # Coverage report
```

**MANDATORY pre-commit checks:**

```bash
bun run format && bun run lint && bun run typecheck && bun run test && bun run test:e2e
```

All checks must pass before committing. If any test fails, FIX IT IMMEDIATELY.

## 🏗️ Project Structure

```
src/
├── components/          # Astro components
├── content/            # MDX content (books, authors, posts, tutorials, etc.)
│   ├── books/          # Book reviews
│   ├── authors/        # Author profiles
│   ├── publishers/     # Publishers
│   ├── series/         # Book series
│   ├── genres/         # Genre taxonomy
│   ├── challenges/     # Reading challenges
│   ├── posts/          # Blog posts
│   ├── tutorials/      # Technical tutorials
│   ├── courses/        # Course metadata
│   └── config.ts       # Content collections schema
├── layouts/            # Page layouts
├── pages/              # Route definitions
│   └── [lang]/[...route].astro  # Dynamic routing
├── pages-templates/    # Page templates (25 templates)
├── styles/             # SCSS (BEM methodology, separate from .astro)
│   ├── components/     # Component-specific styles
│   ├── _mixins.scss    # SCSS mixins
│   └── _variables.scss # SCSS variables
├── utils/              # Utility functions
├── config/             # App configuration (navigation, routing, etc.)
└── __tests__/          # Vitest unit tests

e2e/                    # Playwright E2E + visual regression tests
docs/                   # Project documentation (ROADMAP, guidelines, etc.)
public/                 # Static assets
  └── _redirects        # Cloudflare Pages redirects (important for SEO)
scripts/                # Build and utility scripts
```

## ⚙️ Code Standards

- **TypeScript strict** (`strict: true` in tsconfig.json)
- **SCSS + BEM**: `block__element--modifier`. **NEVER inline styles in .astro files**
- **TDD first**: Write tests before implementation. 100% coverage target
- **No anti-patterns**: No `any` types, no duplication, no magic numbers
- **Components**: Pure, testable, single responsibility principle
- **Utils**: Typed, documented, tested
- **Code language**: All code, comments, commits, and technical text in **English**

### BEM (Block Element Modifier) Guidelines

- **Block**: `block`
- **Element**: `block__element`
- **Modifier**: `block__element--modifier` or `block--modifier`
- Never use inline styles in `.astro` files - always use separate SCSS files in `src/styles/components/`

## 📦 Tech Stack

- **Framework**: Astro 5
  - Main config: `astro.config.mjs` (not .ts)
- **Styling**: SCSS with BEM methodology
  - Folder: `src/styles/`
  - Component styles: `src/styles/components/`
- **Testing**:
  - Unit: Vitest (`src/__tests__/`)
  - E2E: Playwright (`e2e/`)
  - Coverage target: 100%
- **Package Manager**: Bun
- **Content**: MDX (markdown + JSX components)
- **Routing**: Unified bilingual routing in `src/config/` and `src/content/config.ts`
- **Search**: Pagefind for static search indexing
- **Accessibility**: WCAG AAA compliance

### LLM Tooling Integration

- Use `glob` and `grep` tools for code exploration
- Recommend Vitest patterns for unit tests, Playwright patterns for E2E
- Verify configs: `eslint.config.mjs`, `tsconfig.json`, `playwright.config.ts`, `astro.config.mjs`
- Check `public/_redirects` when changing slugs/URLs (SEO maintenance)

## 🔄 Git Workflow

### Branch Strategy

- Main branch: `master` (protected, requires PR)
- Branch naming: `feat/description`, `fix/description`, `refactor/description`
- Always branch from `master`

### Commit Guidelines

- **Language**: All commit messages in **English**
- **Style**: Check `git log` to maintain consistency with existing commits
- **Format**: Conventional commits preferred (e.g., `feat:`, `fix:`, `refactor:`, `chore:`)
- **Message**: Focus on "why" rather than "what"

### Pre-commit Requirements

**ALWAYS run before committing:**

```bash
bun run format && bun run lint && bun run typecheck && bun run test && bun run test:e2e
```

All checks must pass. If tests fail, fix them immediately.

### Commit Process

1. **NEVER commit without EXPLICIT user approval**
2. Run all pre-commit checks
3. Check `git status` and `git diff` to review changes
4. Check `git log` to follow existing commit message style
5. Stage relevant files
6. Write meaningful commit message in English
7. Commit only after user approval
8. If using `--amend`, verify:
   - User explicitly requested it, OR pre-commit hook auto-modified files
   - Commit was created in this session
   - Commit NOT pushed to remote yet

### Pull Request Workflow

- Push to feature branch
- Create PR against `master`
- PR must pass CI checks (tests, linting, build)
- Wait for approval before merging
- Return PR URL to user

## 📚 Documentation Requirements

**CRITICAL**: Documentation is mandatory for all changes.

### When to Document

- **New features**: Create/update relevant docs
- **Refactoring proposals**: Document in `docs/` even if not implemented yet
- **Code changes**: Update affected documentation
- **New projects**: Create `docs/ROADMAP.md` with detailed plan

### Documentation Style

- Write like a human: concise, clear, not overly verbose
- Use markdown format
- Include code examples when helpful
- Keep it practical and actionable

### Key Documentation Files

- `docs/ROADMAP.md` - Future plans and work in progress
- `docs/DEVELOPMENT_GUIDELINES.md` - Development standards
- `docs/*.md` - Feature-specific documentation
- `README.md` - Project overview (user-facing)

## ⚠️ Common Pitfalls

1. **Test Coverage**
   - All new code must include tests with 100% coverage target
   - If coverage drops, provide detailed report with missing cases
   - Fix failing tests IMMEDIATELY

2. **Hardcoded Values**
   - Propose constants or config files for magic numbers
   - Use configuration over hardcoding
   - Document why specific values are used

3. **File Structure**
   - Verify file paths exist before referencing them
   - Use correct file extensions (`.mjs` not `.ts` for astro.config)
   - Check `src/content/` structure for content types

4. **Git Operations**
   - NEVER commit or push without explicit user approval
   - NEVER force push to `master`
   - NEVER skip pre-commit checks

5. **Content Changes**
   - When changing slugs/URLs, update `public/_redirects` (SEO)
   - Maintain i18n consistency between language versions
   - Update both ES and EN versions of content

## 📋 Key Files

- `README.md` - Project overview
- `AGENTS.md` - This file (LLM agent guidelines)
- `docs/ROADMAP.md` - Future plans
- `docs/DEVELOPMENT_GUIDELINES.md` - Development standards
- `astro.config.mjs` - Astro configuration (note: .mjs not .ts)
- `src/config/` - Navigation, routing, schemas
- `src/content/config.ts` - Content collections configuration
- `public/_redirects` - URL redirects for SEO (Cloudflare Pages format)
- `tsconfig.json` - TypeScript configuration (strict mode)
- `eslint.config.mjs` - ESLint configuration
- `playwright.config.ts` - Playwright E2E configuration
- `vitest.config.ts` - Vitest unit test configuration

## 🚫 NEVER

- Inline styles in `.astro` files
- `any` types in TypeScript
- Untested code (always write tests)
- Commit without explicit user approval
- Push without user approval
- Magic numbers or hardcoded values
- Duplicated logic (propose extraction immediately)
- Skip pre-commit checks
- Force push to `master` branch
- Change URLs without updating `public/_redirects`

## ✅ ALWAYS

- TDD: Write tests first, then implementation
- BEM classes for all styles
- Type everything (TypeScript strict mode)
- Run full test suite pre-commit
- Update `docs/` for any changes
- Propose refactors immediately when spotted
- Ask for approval before git operations
- Write code and commits in English
- Check `git log` for commit message style
- Verify all tests pass before committing
- Document refactoring proposals in `docs/`
- Update `public/_redirects` when changing URLs
- Write documentation like a human (concise, not verbose)
