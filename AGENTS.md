Personal website built with **Astro 5** (96.88% test coverage, Lighthouse 100/100). Bilingual (ES/EN), Pagefind search, WCAG AAA. **Use ONLY best engineering practices. Reject ALL anti-patterns.**

## 🎯 Project Overview

Static blog with book reviews, tech tutorials, posts. **86 dynamic routes**, unified bilingual routing. **Zero-config excellence**: TypeScript strict, BEM SCSS, TDD 100% coverage target.

## 🤖 Guidelines for LLM Agents

These are the primary responsibilities expected of an LLM agent within this project:

- **Code Exploration:**
  - Locate specific code, utilities, schemas, or comments through pattern matching or full-text searches.
  - Provide summaries of found code snippets or files for the sake of documentation or testing.
- **Refactoring Suggestions:**
  - Identify duplicated logic and recommend ways to abstract into reusable components.
  - Highlight anti-patterns and other opportunities for refactor based on modern industry practices.
- **Testing Contributions:**
  - Write initial drafts for unit tests, integration tests, or e2e tests.
- **Documentation Drafting:**
  - Update any existing documentation (`docs/ ROADMAP.md`, `DEVELOPMENT_GUIDELINES.md`, etc.) when changes are made to code or workflow.
  - Highlight areas where documentation is missing for humans so they can promptly fill gaps if necessary.
- **Limitations of LLM Execution:**
  - Do not execute sensitive operations related to `git` or CI/CD pipelines unless specifically asked.
  - Avoid assuming existing functionality: verify before suggesting edits.

## 🛠️ Setup & Commands (Bun)

```bash
bun install
bun run dev          # http://localhost:4321
bun run build
bun run preview
bun run format       # Prettier
bun run lint         # ESLint
bun run typecheck    # TS strict
bun run test         # 1,389 unit (96.88%)
bun run test:e2e     # 427 E2E (Playwright)
bun run test:coverage
```

MANDATORY pre-commit: `bun run format && bun run lint && bun run typecheck && bun run test && bun run test:e2e`

## 🏗️ Structure

```
src/
├── components/ # Astro components
├── content/ # MDX (books/, posts/, tutorials/, authors/)
├── layouts/
├── pages/ # [lang]/[...route].astro (86 routes)
├── pages-templates/ # 25 templates
├── styles/ # SCSS (BEM, separate from .astro)
├── utils/
└── __tests__/ # Vitest unit
e2e/ # Playwright E2E + visual regression
```

## ⚙️ Code Standards

- TypeScript strict (strict: true)
- SCSS + BEM (--block\_\_element--modifier). Never inline styles in .astro
- TDD first: 100% coverage target. Fix failing tests IMMEDIATELY
- No anti-patterns: No any, no duplication, no magic numbers
- Components: Pure, testable, single responsibility
- Utils: Typed, documented, tested

## 📦 Tech Stack Breakdown

- **Framework**: Astro 5
  - Main configuration file: `astro.config.ts`
- **Styling**: SCSS using BEM methodology
  - Folder: `src/styles/`
  - Guidelines on class naming (BEM): Block, Element (e.g., `block__element`), Modifier (`block__element--modifier`)
- **Testing**:
  - Unit Testing: **Vitest** (directory: `src/__tests__/`).
  - E2E Testing + Visual Regression: **Playwright** (directory: `e2e/`).
  - Run Playwright tests: `bun run test:e2e`
- **Dependency Management**: **Bun**
- **Routing**: Config defined in `src/config` and `src/content/config.ts` (bilingual).

### LLM Tooling Integration Guidelines

- Use code search tools (grep, glob) for finding dependencies and analyzing them.
- For testing, recommend appropriate Vitest/Playwright testing patterns when applicable.
- Verify configurations related to these dependencies (eslint, tsconfig, playwright configs).

## 🚀 Workflow

1. `bun run format && bun run lint && bun run typecheck && bun run test && bun run test:e2e`
2. ALWAYS propose refactors (DRY violations, tech debt, anti-patterns...)
3. Ask approval BEFORE commit/push
4. Branch from main: feat/|fix/|refactor/[description]

## ⚠️ Common Pitfalls and Warnings

1. **High Test Coverage Policy:**
   - Ensure that all new code includes unit tests with 100% coverage.
   - If test coverage drops, provide a detailed report indicating the reasons and missing cases.
2. **Avoid Hardcoded Values**:
   - Propose constants or configuration files for detected hardcoded values.
   - Example: Replace magic number `86` (dynamic routes) with a constant in configuration or environment variable.
3. **Verify File Structure**:
   - Ensure all references to files (e.g., `src/pages` for routing) are valid and exist before accessing them.

## 📋 Key Files

- README.md - Overview
- docs/ROADMAP.md - Next steps
- docs/DEVELOPMENT_GUIDELINES.md - Standards
- astro.config.ts - Config
- src/config/ - Navigation, routing, schemas
- src/content/config.ts - Collections

## 🚫 NEVER

- Inline styles in .astro
- any types
- Untested code
- Commit without explicit approval
- Magic values
- Duplicated logic (propose extraction)

## ✅ ALWAYS

- TDD (write tests first)
- BEM classes
- Type everything
- Run full test suite pre-commit
- Update docs/ for changes/roadmap
- Propose refactors immediately
