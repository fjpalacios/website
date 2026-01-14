# Development Guidelines

Quick reference for coding standards and best practices.

---

## Core Principles

### 1. TDD Always

1. Write failing test
2. Implement code
3. Refactor

**Coverage:** 95%+ unit tests, all critical flows in E2E.

### 2. Code Quality

**TypeScript:**

- Strict mode, no `any`, explicit return types

**Naming:**

- Files: `kebab-case.ts`
- Components: `PascalCase.astro`
- Functions: `camelCase()`
- Constants: `SCREAMING_SNAKE_CASE`

**Commits:** Conventional Commits

```bash
feat(scope): add feature
fix(scope): fix bug
docs(scope): update docs
```

### 3. i18n Rules

**Golden Rule:** All URLs = `/{lang}/{translated-slug}/`

```typescript
// ✅ CORRECT
/es/publicaciones/mi-articulo/
/en/posts/my-article/

// ❌ WRONG
/es/posts/my-article/        // English slug in Spanish
/publicaciones/mi-articulo/  // Missing language
```

**URL Generation:**

```typescript
// ✅ CORRECT
const basePath = lang === "es" ? "/es/categorias" : "/en/categories";
const url = `${basePath}/${item.slug}`;

// ❌ WRONG
const url = `/es/${item.slug}`;
```

---

## Daily Workflow

```bash
# 1. Start dev
bun run dev

# 2. Make changes (TDD: test → code → refactor)

# 3. Run tests
bun run test
bun run test:e2e

# 4. Check quality
bun run lint
bun run format

# 5. Build
bun run build

# 6. Commit
git commit -m "feat(scope): description"
```

---

## Pre-commit Checklist

- [ ] All tests pass
- [ ] Build succeeds
- [ ] Code linted/formatted
- [ ] Docs updated (if needed)

---

## Common Pitfalls

### Wrong URL Generation

```typescript
// ❌ WRONG
<a href={`/${lang}/${item.slug}`}>

// ✅ CORRECT
const segments = lang === "es" ? "/publicaciones" : "/posts";
<a href={`/${lang}${segments}/${item.slug}`}>
```

### Missing i18n Check

```typescript
// ❌ WRONG
<LanguageSwitcher translationSlug={item.data.i18n} />

// ✅ CORRECT
{item.data.i18n && <LanguageSwitcher translationSlug={item.data.i18n} />}
```

### Testing Only Happy Paths

```typescript
// ❌ WRONG
test("slugify works", () => {
  expect(slugify("Hello")).toBe("hello");
});

// ✅ CORRECT
describe("slugify", () => {
  test("converts basic text", () => {...});
  test("handles empty string", () => {...});
  test("handles special chars", () => {...});
});
```

---

## Resources

- [Astro Docs](https://docs.astro.build/)
- [Vitest Docs](https://vitest.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
