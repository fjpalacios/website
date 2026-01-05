# Development Guidelines

**Last Updated:** January 4, 2026

## Core Principles

### 1. Test-Driven Development (TDD)

Always write tests first:

1. Write failing test
2. Implement code to pass test
3. Refactor while keeping tests green

**Coverage Requirements:**

- Unit Tests: 95%+ coverage
- E2E Tests: All critical flows
- Always run tests before committing

### 2. Code Quality

**TypeScript:**

- Strict mode enabled
- No `any` types
- Explicit return types

**Naming:**

- Files: `kebab-case.ts`
- Components: `PascalCase.astro`
- Functions: `camelCase()`
- Constants: `SCREAMING_SNAKE_CASE`
- Types: `PascalCase`

**Commits:** Follow Conventional Commits

```bash
feat(scope): description
fix(scope): description
docs(scope): description
test(scope): description
refactor(scope): description
```

### 3. Multi-language Rules

**The Golden Rule:** All URLs = `/{lang}/{translated-slug}/`

```typescript
// ✅ CORRECT
/es/publicaciones/mi-articulo/
/en/posts/my-article/

// ❌ WRONG
/es/posts/my-article/        // English slug in Spanish
/publicaciones/mi-articulo/  // Missing language
```

**i18n Field:** Only for translated content (categories, genres), not for independent entities (authors, publishers).

**URL Generation:**

```typescript
// ✅ CORRECT: Dynamic paths
const basePath = lang === "es" ? "/es/categorias" : "/en/categories";
const url = `${basePath}/${item.data.category_slug}`;

// ❌ WRONG: Hardcoded
const url = `/es/${item.slug}`;
```

## File Structure

```
src/
├── components/          # Astro components
├── pages/
│   ├── index.astro      # Root redirect
│   ├── es/              # Spanish routes
│   └── en/              # English routes
├── utils/               # Utilities
└── __tests__/           # Unit tests
    ├── components/
    ├── utils/
    └── __helpers__/     # Reusable test utilities

e2e/                     # E2E tests (Playwright)
docs/                    # Documentation
```

## Daily Workflow

```bash
# 1. Start dev server
bun run dev

# 2. Make changes (TDD)
# - Write test
# - Implement
# - Verify

# 3. Run tests
bun run test
bun run test:e2e

# 4. Check quality
bun run lint
bun run format

# 5. Build
bun run build

# 6. Commit
git add .
git commit -m "feat(scope): description"
git push
```

## Pre-commit Checklist

- [ ] All tests pass
- [ ] E2E tests pass
- [ ] Build succeeds
- [ ] Code linted and formatted
- [ ] Documentation updated if needed

## Common Pitfalls

### Wrong URL Generation

```typescript
// ❌ WRONG
<a href={`/${lang}/${item.slug}`}>
<a href={`/es/categorias/${item.slug}`}>

// ✅ CORRECT
const basePath = lang === "es" ? "/es/categorias" : "/en/categories";
<a href={`${basePath}/${item.data.category_slug}`}>
```

### Missing i18n Check

```typescript
// ❌ WRONG: Assuming all have i18n
<LanguageSwitcher translationSlug={item.data.i18n} />

// ✅ CORRECT: Check first
{item.data.i18n && (
  <LanguageSwitcher translationSlug={item.data.i18n} />
)}
```

### Testing Only Happy Paths

```typescript
// ❌ WRONG: Only success cases
test("slugify works", () => {
  expect(slugify("Hello")).toBe("hello");
});

// ✅ CORRECT: Edge cases + errors
describe("slugify", () => {
  test("converts basic text", () => {...});
  test("handles empty string", () => {...});
  test("handles special characters", () => {...});
  test("handles very long text", () => {...});
});
```

## Resources

- [Astro Docs](https://docs.astro.build/)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
