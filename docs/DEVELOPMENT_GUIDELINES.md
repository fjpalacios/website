# Development Guidelines & Best Practices

**Document Purpose:** Guidelines for maintaining code quality and documentation standards  
**Last Updated:** December 21, 2025  
**Status:** Living Document

---

## 🎯 Core Principles

### 1. Test-Driven Development (TDD)

**Always follow this workflow:**

```
1. Write failing test
2. Implement minimal code to pass test
3. Refactor while keeping tests green
4. Repeat
```

**Example:**
```typescript
// ❌ BAD: Write code first
export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-');
}

// ✅ GOOD: Write test first
describe('slugify', () => {
  test('converts text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
  
  test('handles special characters', () => {
    expect(slugify('¿Qué tal?')).toBe('que-tal');
  });
});

// Then implement the function
```

### 2. Exhaustive Testing

**Coverage Requirements:**
- Unit Tests: 95%+ coverage
- E2E Tests: All critical user flows
- Integration Tests: All data relationships

**Test Types:**

| Test Type | Purpose | Tools | Location |
|-----------|---------|-------|----------|
| Unit | Test individual functions/components | Vitest | `src/__tests__/` |
| E2E | Test user workflows | Playwright | `e2e/` |
| Integration | Test data relationships | Vitest | `src/__tests__/integration/` |
| Visual | Prevent UI regressions | Playwright | `e2e/*.spec.ts` |

### 3. Documentation First

**Before coding, document:**
- What you're building
- Why you're building it
- How it fits in the system
- What decisions you made

**After coding, update:**
- `docs/BLOG_MIGRATION_PROGRESS.md` - Progress tracker
- `docs/SESSION_*.md` - Session reports
- `README.md` - If public API changes
- Inline comments - Complex logic

### 4. Code Quality Standards

**TypeScript:**
- ✅ Strict mode enabled
- ✅ No `any` types
- ✅ Explicit return types for functions
- ✅ Interfaces over types when possible

**Naming Conventions:**
```typescript
// Files: kebab-case
category-list.astro
blog-utils.ts

// Components: PascalCase
CategoryList.astro
PostList.astro

// Functions: camelCase
slugify()
prepareBooksummary()

// Constants: SCREAMING_SNAKE_CASE
POSTS_PER_PAGE = 10
MAX_TITLE_LENGTH = 100

// Types/Interfaces: PascalCase
interface PostSummary { }
type Language = 'es' | 'en'
```

---

## 🌍 Multi-language Architecture

### URL Structure Rules

**The Golden Rule:**
```
All URLs = /{language}/{translated-slug}/
```

**Examples:**
```typescript
// ✅ CORRECT
/es/publicaciones/mi-articulo/
/en/posts/my-article/

/es/categorias/tutoriales/
/en/categories/tutorials/

// ❌ WRONG
/es/posts/my-article/        // English slug in Spanish path
/en/categorias/tutorials/    // Spanish path in English URL
/publicaciones/mi-articulo/  // Missing language prefix
```

### i18n Implementation

**When to use `i18n` field:**
```json
// Categories, Genres, Series, Challenges → YES
{
  "category_slug": "tutoriales",
  "name": "Tutoriales",
  "language": "es",
  "i18n": "tutorials"  // ✅ Maps to English version
}

// Publishers, Authors → NO (independent per language)
{
  "publisher_slug": "debolsillo",
  "name": "Debolsillo",
  "language": "es"
  // ❌ NO i18n field - Spanish-only entity
}
```

**URL Generation Pattern:**
```typescript
// ✅ CORRECT: Build URLs dynamically based on language
const basePath = lang === "es" 
  ? `/es/categorias` 
  : `/en/categories`;

const url = `${basePath}/${item.data.category_slug}`;

// ❌ WRONG: Hardcoded paths
const url = `/es/${item.slug}`;  // Ignores language context
```

---

## 📁 File Organization

### Component Structure

```
src/components/
├── Layout components (Header, Footer, etc.)
│   ├── Header.astro
│   ├── Footer.astro
│   └── Menu.astro
│
├── Content display (Lists, cards, etc.)
│   ├── PostList.astro
│   ├── CategoryList.astro
│   └── BookCard.astro
│
├── UI elements (Buttons, forms, etc.)
│   ├── Paginator.astro
│   ├── Breadcrumbs.astro
│   └── ThemeSwitcher.astro
│
└── Specialized (Domain-specific)
    ├── SeriesBookList.astro
    ├── BookMetadata.astro
    └── AuthorInfo.astro
```

### Page Structure

```
src/pages/
├── index.astro                 # Root redirect
├── es/                         # Spanish routes
│   ├── index.astro             # Home
│   ├── acerca-de.astro         # About
│   ├── publicaciones/          # Posts
│   │   ├── index.astro         # Listing
│   │   ├── [page].astro        # Pagination
│   │   └── [slug].astro        # Detail
│   └── categorias/             # Categories
│       ├── index.astro         # Listing
│       └── [slug].astro        # Detail
└── en/                         # English routes
    └── (same structure as es/)
```

### Test Structure

```
src/__tests__/
├── components/                 # Component unit tests
│   ├── CategoryList.test.ts
│   └── Paginator.test.ts
│
├── utils/                      # Utility function tests
│   └── blog/
│       ├── slugify.test.ts
│       └── pagination.test.ts
│
└── integration/                # Integration tests
    └── taxonomy-content.test.ts

e2e/                            # End-to-end tests
├── navigation.spec.ts
├── taxonomy-details.spec.ts
└── accessibility.spec.ts
```

---

## 🧪 Testing Patterns

### Unit Test Pattern

```typescript
// src/__tests__/components/CategoryList.test.ts
import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import CategoryList from '@components/CategoryList.astro';

describe('CategoryList Component', () => {
  const mockData = {
    categories: [
      { 
        category: { 
          data: { 
            category_slug: 'tutoriales', 
            name: 'Tutoriales',
            language: 'es'
          } 
        }, 
        count: 10 
      }
    ],
    lang: 'es',
    title: 'All Categories'
  };

  test('renders all categories', () => {
    const { getAllByRole } = render(CategoryList, { props: mockData });
    const links = getAllByRole('link');
    expect(links).toHaveLength(1);
  });

  test('generates correct Spanish URLs', () => {
    const { getAllByRole } = render(CategoryList, { props: mockData });
    const link = getAllByRole('link')[0];
    expect(link.getAttribute('href')).toBe('/es/categorias/tutoriales');
  });

  test('generates correct English URLs', () => {
    const englishData = {
      ...mockData,
      categories: [{
        category: {
          data: {
            category_slug: 'tutorials',
            name: 'Tutorials',
            language: 'en'
          }
        },
        count: 10
      }],
      lang: 'en'
    };
    
    const { getAllByRole } = render(CategoryList, { props: englishData });
    const link = getAllByRole('link')[0];
    expect(link.getAttribute('href')).toBe('/en/categories/tutorials');
  });
});
```

### E2E Test Pattern

```typescript
// e2e/taxonomy-details.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Category Detail Page', () => {
  test('Spanish category page works correctly', async ({ page }) => {
    // Navigate to page
    await page.goto('/es/categorias/tutoriales');
    
    // Verify page loaded
    await expect(page).toHaveTitle(/Categoría: Tutoriales/);
    await expect(page.locator('h1')).toContainText('Categoría: Tutoriales');
    
    // Verify content is filtered
    const posts = page.locator('.post-list article');
    await expect(posts).toHaveCountGreaterThan(0);
    
    // Verify sidebar links
    const sidebarLinks = page.locator('.categories a');
    const firstLink = sidebarLinks.first();
    const href = await firstLink.getAttribute('href');
    expect(href).toMatch(/^\/es\/categorias\/[a-z-]+$/);
    
    // Test navigation
    await firstLink.click();
    await expect(page).toHaveURL(/\/es\/categorias\/.+/);
  });

  test('language switcher works', async ({ page }) => {
    await page.goto('/es/categorias/tutoriales');
    
    // Click language switcher
    await page.click('[data-language="en"]');
    
    // Should navigate to English equivalent
    await expect(page).toHaveURL('/en/categories/tutorials');
    await expect(page.locator('h1')).toContainText('Category: Tutorials');
  });
});
```

---

## 📝 Documentation Standards

### Session Reports

**Create a session report when:**
- Fixing a bug
- Implementing a feature
- Making architectural decisions
- Discovering issues

**Template:**
```markdown
# Session Report - YYYY-MM-DD - [Brief Title]

**Duration:** X hours  
**Type:** [Bug Fix / Feature / Analysis / Refactor]  
**Status:** [Complete / In Progress / Blocked]

## Issues Addressed
1. Issue description
2. Root cause
3. Solution applied

## Changes Made
- File modified: Description
- File created: Purpose

## Verification
- ✅ Tests pass
- ✅ Build succeeds
- ✅ Manual testing completed

## Next Steps
- [ ] Action item 1
- [ ] Action item 2
```

### Code Comments

**When to comment:**
```typescript
// ✅ GOOD: Explain WHY, not WHAT
// Sort by series order instead of date because users expect to see books
// in reading order (Book 1, 2, 3...) regardless of when they were read
seriesBooks.sort((a, b) => a.data.series_order - b.data.series_order);

// ❌ BAD: Obvious comment (describes WHAT code does)
// Sort books by series order
seriesBooks.sort((a, b) => a.data.series_order - b.data.series_order);

// ✅ GOOD: Complex logic explanation
// Publishers don't have i18n mapping because they represent different
// entities per language (e.g., "Debolsillo" in ES vs "Penguin" in EN),
// not translations of the same entity
if (!publisher.data.i18n) {
  // Disable language switcher
}

// ✅ GOOD: Gotcha or non-obvious behavior
// Must check readyState because script can execute before DOM is ready
// when using View Transitions API
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addCopyButtons);
}
```

### Commit Messages

**Follow Conventional Commits:**

```bash
# Format
<type>(<scope>): <description>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style (formatting, no logic change)
refactor: Code refactor (no feature/bug)
test:     Add or update tests
chore:    Build process, dependencies

# Examples
feat(taxonomy): add series detail pages with reading order
fix(i18n): correct URL generation in CategoryList component
docs(migration): update progress report with Phase 4 status
test(taxonomy): add E2E tests for detail page navigation
refactor(pagination): extract page number logic to utility
```

---

## 🔧 Development Workflow

### Daily Workflow

```bash
# 1. Start dev server
bun run dev

# 2. Make changes following TDD
# - Write test
# - Implement feature
# - Verify test passes

# 3. Run all tests
bun run test
bun run test:e2e

# 4. Check code quality
bun run lint
bun run format

# 5. Build to verify production
bun run build

# 6. Update documentation
# - Update BLOG_MIGRATION_PROGRESS.md
# - Create/update session report
# - Update README.md if needed

# 7. Commit with conventional commit message
git add .
git commit -m "feat(component): add new feature"

# 8. Push (pre-commit hooks will run automatically)
git push
```

### Pre-commit Checklist

Before every commit, verify:

- [ ] All tests pass (`bun run test`)
- [ ] E2E tests pass (`bun run test:e2e`)
- [ ] Build succeeds (`bun run build`)
- [ ] Code is linted (`bun run lint`)
- [ ] Code is formatted (`bun run format`)
- [ ] Documentation is updated
- [ ] Commit message follows convention

### Documentation Update Checklist

When touching code, check if these need updates:

- [ ] `docs/BLOG_MIGRATION_PROGRESS.md` - Implementation progress
- [ ] `docs/SESSION_*.md` - Session reports for decisions
- [ ] `README.md` - If features, commands, or API changes
- [ ] Inline code comments - Complex logic explained
- [ ] Test documentation - New test patterns

---

## 🚫 Common Pitfalls

### 1. Wrong URL Generation

```typescript
// ❌ WRONG: Using wrong field or ignoring language
<a href={`/${lang}/${item.slug}`}>

// ❌ WRONG: Hardcoded path for one language
<a href={`/es/categorias/${item.slug}`}>

// ✅ CORRECT: Dynamic base path + correct slug field
const basePath = lang === "es" ? "/es/categorias" : "/en/categories";
<a href={`${basePath}/${item.data.category_slug}`}>
```

### 2. Missing i18n Handling

```typescript
// ❌ WRONG: Assuming all entities have i18n
<LanguageSwitcher translationSlug={item.data.i18n} />

// ✅ CORRECT: Check if i18n exists
{item.data.i18n && (
  <LanguageSwitcher translationSlug={item.data.i18n} />
)}

// Or disable switcher
<LanguageSwitcher 
  translationSlug={item.data.i18n} 
  disabled={!item.data.i18n} 
/>
```

### 3. Testing Only Happy Path

```typescript
// ❌ WRONG: Only test successful cases
test('slugify works', () => {
  expect(slugify('Hello')).toBe('hello');
});

// ✅ CORRECT: Test edge cases and errors
describe('slugify', () => {
  test('converts basic text', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
  
  test('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
  
  test('handles special characters', () => {
    expect(slugify('¿Qué tal?')).toBe('que-tal');
  });
  
  test('handles very long text', () => {
    const longText = 'a'.repeat(1000);
    expect(slugify(longText).length).toBeLessThanOrEqual(200);
  });
});
```

### 4. Forgetting to Update Documentation

```typescript
// ❌ WRONG: Make changes and commit without docs
// Implement feature → Commit → Done

// ✅ CORRECT: Always update docs
// Implement feature → Update docs → Commit
```

---

## 🎓 Learning Resources

### Astro

- [Astro Documentation](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro i18n Guide](https://docs.astro.build/en/guides/internationalization/)

### Testing

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Best Practices

- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

## 📞 Getting Help

### When Stuck

1. **Read the documentation** (this file and related docs)
2. **Check session reports** for similar issues
3. **Review tests** to understand expected behavior
4. **Search codebase** for similar implementations
5. **Ask for help** with specific, detailed questions

### Reporting Issues

When reporting an issue, include:

1. **What you were trying to do**
2. **What you expected to happen**
3. **What actually happened**
4. **Steps to reproduce**
5. **Error messages** (full stack trace)
6. **Environment details** (OS, Node version, etc.)

---

**Last Updated:** December 21, 2025  
**Next Review:** When starting new major feature

---

_This document evolves with the project. Update it when establishing new patterns or discovering best practices._
