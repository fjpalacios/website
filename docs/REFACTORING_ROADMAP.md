# 🔧 Refactoring Roadmap

**Project**: website (fjp.es) - Technical Refactoring Plan  
**Created**: December 27, 2025  
**Status**: 🎯 ACTIVE  
**Current Phase**: Phase 1 ✅ COMPLETE

> **Note**: This is the **technical refactoring roadmap**. For content migration, see `ROADMAP.md`.

---

## 🎯 Mission

Systematically eliminate code duplication, improve maintainability, and establish excellent code patterns across the codebase.

**Starting Point**: ~1,800 lines of duplicate code (50% duplication)  
**Target**: ~300 lines (reduce by 81%)  
**Approach**: 3 phases over 2-3 months

---

## 📊 Overall Progress

```
Phase 1: Quick Wins (8h)          ✅ COMPLETE  100%  [████████████████████]
Phase 2: Medium Complexity (15h)  📋 PLANNED    0%   [                    ]
Phase 3: Unified Routing (35h)    📋 PLANNED    0%   [                    ]
───────────────────────────────────────────────────────────────────────────
Total Progress:                    🟡 IN PROGRESS  14%  [███                 ]
```

**Overall Status**: 8 hours completed, 50 hours remaining (~14%)

---

## ✅ Phase 1: Quick Wins - COMPLETE

**Status**: ✅ **100% COMPLETE**  
**Completion Date**: December 27, 2025  
**Time**: 7.5 hours (vs 8h estimated)  
**Branch**: `feature/blog-foundation`

### Completed Tasks

| #         | Task                 | Lines Saved | Tests Added | Commit        | Time     |
| --------- | -------------------- | ----------- | ----------- | ------------- | -------- |
| 1         | RSS Generator        | ~150        | 27          | `9534c8d`     | 3h       |
| 2         | Pagination Generator | ~72         | 16          | `f18d872`     | 2h       |
| 3         | Pagination Config    | ~0          | 14          | `75830e4`     | 30m      |
| 4         | Score Utility        | ~24         | 42          | `5d9363b`     | 30m      |
| 5         | Cleanup & Quality    | ~10         | 0           | `d94ebdb`     | 2h       |
| **TOTAL** | **5 tasks**          | **~256**    | **99**      | **5 commits** | **7.5h** |

### Key Achievements

✅ RSS feeds consolidated (7 files → 1 generator)  
✅ Generic pagination utility created  
✅ Centralized pagination config  
✅ Type-safe score formatter  
✅ Zero production `any` types  
✅ 24 future refactoring opportunities identified  
✅ 4,400+ lines of documentation created

### Testing Status

```
✅ Unit Tests: 623/623 passing (100%)
✅ E2E Tests: 122/122 passing (100%)
✅ Build: Successful
✅ Lint: No errors
✅ Coverage: 95%+ maintained
```

### Documentation Created

- `REFACTORING_PROPOSALS.md` (1,272 lines) - Complete strategy
- `PHASE_1_QUICK_WINS.md` (1,321 lines) - Implementation guide
- `PHASE_3_UNIFIED_ROUTING.md` (1,130 lines) - Future plan
- `README_REFACTORING.md` (485 lines) - Overview
- `REFACTORING_OPPORTUNITIES.md` (NEW) - 24 identified improvements

**Next Action**: ✅ Create PR, code review, merge to main

---

## 📋 Phase 2: Medium Complexity - PLANNED

**Status**: 📋 **READY TO START**  
**Estimated Effort**: 15-20 hours  
**Timeline**: January 2026 (Weeks 1-4)  
**Priority**: 🔴 HIGH  
**Risk**: 🟡 MEDIUM

### Overview

Focus on consolidating repetitive patterns and improving code quality with medium-complexity refactorings that provide high value.

**Goals**:

1. Eliminate taxonomy component duplication (~228 lines)
2. Consolidate URL builder functions
3. Clean up magic numbers
4. Simplify complex conditionals
5. Improve overall maintainability

**Expected Impact**: ~300+ more lines eliminated

---

### Task 2.1: Taxonomy Components Consolidation

**Priority**: 🔴 **HIGH** (Start Here)  
**Effort**: 4-6 hours  
**Impact**: ~228 lines eliminated  
**Risk**: 🟡 MEDIUM  
**Timeline**: Week 1-2 (Jan 6-12)

#### Problem

7 virtually identical components (95%+ similarity):

```
src/components/AuthorList.astro      (38 lines)
src/components/CategoryList.astro    (38 lines)
src/components/ChallengeList.astro   (38 lines)
src/components/CourseList.astro      (38 lines)
src/components/GenreList.astro       (38 lines)
src/components/PublisherList.astro   (38 lines)
src/components/SeriesList.astro      (38 lines)
──────────────────────────────────────────────
Total: 266 duplicate lines
```

**Only differences**: Component name, prop names, slug field names

#### Solution

Create generic `TaxonomyList.astro` component:

```astro
<TaxonomyList
  items={categoriesWithContent}
  title="Categories"
  lang="en"
  routeKey="categories"
  slugField="category_slug"
  showCount={true}
/>
```

#### Implementation Plan

**Week 1 (Jan 6-12)**:

1. **Day 1 (2h)**: Design & Create Component

   - [ ] Design generic TaxonomyList.astro interface
   - [ ] Implement component with proper TypeScript types
   - [ ] Write comprehensive tests (15+ tests)
   - [ ] Verify styling works correctly

2. **Day 2 (1.5h)**: Proof of Concept

   - [ ] Migrate CategoryList (first)
   - [ ] Update all CategoryList usages
   - [ ] Run full test suite
   - [ ] Verify visual output identical

3. **Day 3-4 (2.5h)**: Full Migration
   - [ ] Migrate remaining 6 components
   - [ ] Update all imports across codebase
   - [ ] Delete old component files
   - [ ] Update documentation

**Success Criteria**:

- ✅ All 7 components using TaxonomyList
- ✅ All tests passing
- ✅ Visual output identical
- ✅ ~228 lines eliminated
- ✅ Easier to maintain

**Rollback Plan**: Keep old files temporarily, feature flag if needed

---

### Task 2.2: URL Builder Functions Refactoring

**Priority**: 🟡 **MEDIUM**  
**Effort**: 2-3 hours  
**Impact**: Improved maintainability  
**Risk**: 🟢 LOW  
**Timeline**: Week 2 (Jan 13-19)

#### Problem

14 nearly identical functions in `src/utils/routes.ts`:

```typescript
export function buildPostUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "posts", slug);
}
export function buildTutorialUrl(lang: string, slug: string): string {
  return buildLocalizedPath(lang, "tutorials", slug);
}
// ... 12 more identical
```

#### Solution

Factory function with backwards compatibility:

```typescript
type ContentType = 'posts' | 'tutorials' | 'books' | /* ... */;

export function buildContentUrl(
  type: ContentType,
  lang: string,
  slug: string
): string {
  return buildLocalizedPath(lang, type, slug);
}

// Keep helpers as thin wrappers
export const buildPostUrl = (lang: string, slug: string) =>
  buildContentUrl('posts', lang, slug);
```

#### Implementation Steps

1. **Step 1 (1h)**: Create generic function

   - [ ] Design ContentType union type
   - [ ] Implement buildContentUrl()
   - [ ] Write tests (10+ scenarios)

2. **Step 2 (1h)**: Refactor existing functions

   - [ ] Convert to thin wrappers
   - [ ] Verify no usage changes needed
   - [ ] Run full test suite

3. **Step 3 (1h)**: Optional cleanup
   - [ ] Gradually migrate usages to generic function
   - [ ] Update documentation
   - [ ] Consider removing wrappers (breaking change discussion)

---

### Task 2.3: Pagination Index URL Builders

**Priority**: 🟢 **LOW**  
**Effort**: 1 hour  
**Impact**: Consistency  
**Risk**: 🟢 LOW  
**Timeline**: Week 2 (Jan 13-19) - With Task 2.2

#### Problem

3 identical functions in `src/utils/routes.ts`:

```typescript
buildPostsIndexUrl(lang, page?)
buildTutorialsIndexUrl(lang, page?)
buildBooksIndexUrl(lang, page?)
```

#### Solution

```typescript
export function buildPaginatedIndexUrl(contentType: RouteSegment, lang: string, page?: number): string {
  const base = buildLocalizedPath(lang, contentType);
  if (page && page > 1) {
    const pageSegment = getLocalizedRoute("page", lang);
    return `${base}/${pageSegment}/${page}`;
  }
  return base;
}
```

**Implementation**: 1 hour, can be done together with Task 2.2

---

### Task 2.4: Magic Numbers Cleanup

**Priority**: 🟡 **MEDIUM**  
**Effort**: 2-3 hours  
**Impact**: Readability  
**Risk**: 🟢 LOW  
**Timeline**: Week 3 (Jan 20-26)

#### Files to Update

| File                             | Magic Numbers | Priority |
| -------------------------------- | ------------- | -------- |
| `src/utils/blog/pagination.ts`   | 7, 4, 2, 3    | HIGH     |
| `src/components/Paginator.astro` | 7, 2, 1       | MEDIUM   |
| `src/components/Search.astro`    | 300ms         | LOW      |
| `src/layouts/Layout.astro`       | 2000ms        | LOW      |
| Taxonomy pages                   | 999           | LOW      |

#### Example Refactoring

**Before**:

```typescript
if (totalPages <= 7) {
  // Why 7?
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}
```

**After**:

```typescript
const PAGINATION_CONFIG = {
  SHOW_ALL_THRESHOLD: 7, // Show all pages if 7 or fewer
  PAGES_AROUND_CURRENT: 2,
  // ...
} as const;

if (totalPages <= PAGINATION_CONFIG.SHOW_ALL_THRESHOLD) {
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}
```

#### Implementation

1. **Day 1 (1.5h)**: High-priority files

   - [ ] pagination.ts constants
   - [ ] Paginator.astro constants
   - [ ] Update tests

2. **Day 2 (1h)**: Low-priority files
   - [ ] Timeout values
   - [ ] Sort order defaults
   - [ ] Documentation

---

### Task 2.5: Complex Conditionals Simplification

**Priority**: 🟢 **LOW**  
**Effort**: 3-4 hours  
**Impact**: Readability  
**Risk**: 🟢 LOW  
**Timeline**: Week 3 (Jan 20-26)

#### Target Functions

1. **LanguageSwitcher.astro** - `getTranslatedUrl()` (50 lines)
2. **Menu.astro** - Translation availability logic
3. **taxonomyPages.ts** - Date extraction ternary chains

#### Approach

Break down complex functions into smaller, single-responsibility functions:

```typescript
// Before: 50-line nested monster
function getTranslatedUrl(): string {
  // ... complex nesting
}

// After: Clear, testable functions
function getTranslatedUrl(): string {
  if (isHomePage()) return `/${targetLang}`;
  if (isStaticPage()) return translateStaticPageUrl();
  if (isDetailPage()) return translateDetailPageUrl();
  return `/${targetLang}`;
}

function isHomePage(): boolean {
  /* ... */
}
function translateStaticPageUrl(): string {
  /* ... */
}
```

---

### Task 2.6: Additional Quick Wins

**Priority**: 🟢 **LOW**  
**Effort**: 2-3 hours  
**Impact**: Various  
**Risk**: 🟢 LOW  
**Timeline**: Week 3-4 (Jan 20-31) - Fill-in work

#### Items

1. **Consolidate Contact Imports** (30 min)

   ```typescript
   // Create src/utils/content/contact.ts
   export function getContact(lang: "es" | "en"): ContactItem[];
   ```

2. **Menu Navigation Config** (1h)

   - Move to config-driven approach
   - Easier to add/remove menu items

3. **SEO Alternate URL Extraction** (1h)

   - Extract to separate utility
   - Better testability

4. **Test Organization** (ongoing)
   - Better describe grouping when touching tests
   - Extract common fixtures opportunistically

---

### Phase 2 Timeline (Gantt View)

```
Week 1 (Jan 6-12):    [████████████        ] Task 2.1 (4-6h)
Week 2 (Jan 13-19):   [              ██████] Task 2.2, 2.3 (3-4h)
Week 3 (Jan 20-26):   [        ████████████] Task 2.4, 2.5 (5-7h)
Week 4 (Jan 27-31):   [        ████        ] Task 2.6 + Buffer (2-3h)
```

**Total**: 15-20 hours over 4 weeks

---

### Phase 2 Success Criteria

**Quantitative**:

- ✅ ~300+ lines eliminated
- ✅ All tests passing (unit + E2E)
- ✅ Build successful
- ✅ Code coverage maintained (95%+)
- ✅ No regressions

**Qualitative**:

- ✅ Significantly improved readability
- ✅ Easier to add new taxonomy types
- ✅ Clearer URL building patterns
- ✅ Better maintainability overall

**Deliverables**:

- 6 tasks completed
- Updated documentation
- Comprehensive tests
- Phase 2 completion report

---

## 📋 Phase 3: Unified Routing - FUTURE

**Status**: 📋 **PLANNED**  
**Estimated Effort**: 30-40 hours  
**Timeline**: February-March 2026  
**Priority**: 🔴 HIGH (Major Impact)  
**Risk**: 🔴 HIGH (Architectural)

### The Big Refactor

**Goal**: Eliminate language-specific page duplication

**Current State**:

- 53 page files (26 EN + 26 ES + 1 root)
- ~1,400+ duplicate lines
- 95%+ identical code between language versions

**Target State**:

- ~26 unified page files
- Single source of truth
- Astro i18n integration

### Strategy

Implement unified routing with language detection:

```
Before:
/pages/en/books/index.astro    (76 lines)
/pages/es/libros/index.astro   (76 lines)  ← 95% duplicate

After:
/pages/[lang]/[...books]/index.astro  (80 lines)  ← ONE file
```

### Prerequisites

- ✅ Phase 1 complete
- ✅ Phase 2 complete
- 🔲 Astro i18n research
- 🔲 Migration strategy documented
- 🔲 Rollback plan in place
- 🔲 Comprehensive E2E test suite

### Detailed Plan

See `docs/PHASE_3_UNIFIED_ROUTING.md` for complete 30-page implementation guide.

### High-Level Timeline

**February 2026** - Research & Planning (8h):

- Week 1-2: Astro i18n research, prototyping
- Week 3-4: Migration strategy, rollback planning

**March 2026** - Implementation (25-30h):

- Week 1: Core routing infrastructure (8h)
- Week 2: Content pages migration (8h)
- Week 3: Taxonomy pages migration (8h)
- Week 4: Testing & refinement (6-8h)

**April 2026** - Deployment:

- Staging deployment
- Full regression testing
- Gradual production rollout
- Monitoring

### Risk Mitigation

1. **Feature Flag**: Toggle between old/new routing
2. **Gradual Rollout**: One content type at a time
3. **Double Testing**: 2x E2E test coverage
4. **Keep Old Pages**: Temporary fallback
5. **Close Monitoring**: Error tracking post-deploy

### Expected Impact

- **~1,400 lines eliminated** (biggest win)
- 81% total duplication reduction
- Easier to add new languages
- Easier to add new content types
- Unified codebase

---

## 📅 Overall Timeline

### Q4 2025

**December 27** ✅ DONE

- Phase 1 complete
- 256 lines eliminated
- Patterns established

**December 28-31** - Holidays / PR Review

- Create Phase 1 PR
- Code review
- Merge to main
- Deploy Phase 1 changes

### Q1 2026

**January (Weeks 1-4)** - Phase 2

- Week 1-2: Taxonomy Components (HIGH)
- Week 2: URL Builders (MEDIUM)
- Week 3: Magic Numbers & Conditionals (LOW)
- Week 4: Quick Wins + Buffer

**February (Weeks 1-4)** - Phase 3 Planning

- Research Astro i18n best practices
- Prototype unified routing
- Document migration strategy
- Create rollback plan

**March (Weeks 1-4)** - Phase 3 Implementation

- Week 1: Core infrastructure
- Week 2: Content pages
- Week 3: Taxonomy pages
- Week 4: Testing & refinement

### Q2 2026

**April** - Phase 3 Deployment & Monitoring

- Staging deployment
- Regression testing
- Production rollout
- Monitor for issues

**May-June** - Stabilization & Optimization

- Address any issues
- Performance optimization
- Documentation updates
- Celebrate success 🎉

---

## 🎯 When to Do What?

### Priority Decision Framework

**DO IT NOW** if:

- ✅ Duplicated 3+ times
- ✅ Blocking features
- ✅ Causing bugs
- ✅ Quick win (<2h)

**SCHEDULE FOR NEXT PHASE** if:

- 🟡 Medium complexity (2-8h)
- 🟡 Not blocking work
- 🟡 Part of larger initiative

**BACKLOG** if:

- 🟢 Low impact
- 🟢 High effort
- 🟢 Nice-to-have

**DON'T DO** if:

- ❌ Working fine
- ❌ Premature optimization
- ❌ Over-engineering

---

## 📊 Progress Tracking

### Current State (Post-Phase 1)

```
Total Files: ~150
Lines of Code: ~12,500
Duplicate Code: ~1,550 lines (down from 1,800)
Test Coverage: 95%+
Unit Tests: 623 passing
E2E Tests: 122 passing
```

### Target State (Post-Phase 3)

```
Total Files: ~120 (-30)
Lines of Code: ~11,000 (-1,500)
Duplicate Code: ~300 lines (-1,250 = 81% reduction)
Test Coverage: 95%+ maintained
Unit Tests: 700+ passing
E2E Tests: 150+ passing
```

### Phase-by-Phase Progress

| Phase     | Status     | Lines Eliminated | Hours    | Completion  |
| --------- | ---------- | ---------------- | -------- | ----------- |
| Phase 1   | ✅ Done    | 256              | 7.5      | Dec 27      |
| Phase 2   | 📋 Planned | ~300             | 15-20    | Jan 31      |
| Phase 3   | 📋 Planned | ~1,400           | 30-40    | Mar 31      |
| **TOTAL** | **14%**    | **~1,956**       | **~55h** | **Q1 2026** |

---

## ✅ Immediate Next Actions

### This Week (Dec 28-31)

**Priority 1**: Create Phase 1 Pull Request

- [ ] Push `feature/blog-foundation` to remote
- [ ] Create PR with detailed description
- [ ] Request code review
- [ ] Address feedback
- [ ] Merge to main

**Priority 2**: Prepare Phase 2 Kickoff

- [ ] Review REFACTORING_OPPORTUNITIES.md
- [ ] Create GitHub issues for Phase 2 tasks
- [ ] Set up project board
- [ ] Schedule kickoff meeting (Jan 6)

**Priority 3**: Documentation

- [ ] Update main README with Phase 1 achievements
- [ ] Share Phase 1 completion report
- [ ] Announce Phase 2 timeline

### Next Week (Jan 6-12)

**Phase 2 Kickoff**:

- [ ] Team meeting - Review Phase 1, discuss Phase 2
- [ ] Start Task 2.1: Taxonomy Components
- [ ] Set up weekly check-ins

---

## 📝 Communication Plan

### Reporting Cadence

**Weekly** (During Active Phase):

- Progress update
- Blockers identified
- Next week's plan

**Per Phase**:

- Completion report
- Metrics & achievements
- Lessons learned

**Monthly**:

- Overall roadmap review
- Priority adjustments
- Timeline updates

### Stakeholders

1. **Dev Team**: Weekly updates, code reviews
2. **Tech Lead**: Phase completions, major decisions
3. **Product**: Impact on features, timelines
4. **Users**: Transparent (no user impact)

---

## 🔄 Roadmap Adjustments

### When to Re-evaluate

- ✅ After Phase 1 (Done - Dec 27)
- 📋 After Phase 2 (Jan 31)
- 📋 After Phase 3 (Mar 31)
- 🔲 If major issues discovered
- 🔲 If priorities shift

### Flexibility

This roadmap is **adaptable**:

- Phases can be broken into smaller sprints
- Tasks can be re-prioritized
- Timelines adjust for resources
- Some tasks can be skipped if obsolete

**Current Status**: Following plan, no adjustments needed

---

## 🎓 Lessons Learned (Phase 1)

### What Worked Well

✅ TDD approach - Tests first, implementation second  
✅ Incremental commits - Small, focused changes  
✅ Documentation-first - Clear plans before coding  
✅ Pre-commit hooks - Caught issues early  
✅ Pattern establishment - Generic utilities pattern

### Challenges Overcome

✅ Prettier parsing code examples in markdown  
✅ Type safety improvements (eliminated `any`)  
✅ Comprehensive test coverage (99 new tests)

### Apply to Phase 2

- Continue TDD strictly
- Keep commits small and focused
- Document before implementing
- Set up proper testing infrastructure first
- Use same generic utility pattern

---

## 📚 Reference Documents

### Core Documentation

1. **REFACTORING_PROPOSALS.md** - Complete 3-phase strategy
2. **PHASE_1_QUICK_WINS.md** - Phase 1 detailed plan (COMPLETE)
3. **PHASE_3_UNIFIED_ROUTING.md** - Phase 3 detailed plan
4. **REFACTORING_OPPORTUNITIES.md** - 24 identified improvements
5. **This file** - Overall roadmap & timeline

### Supporting Docs

- `README_REFACTORING.md` - High-level overview
- `BOOK_MIGRATION_GUIDE.md` - Content migration (separate)
- `ROADMAP.md` - Content migration roadmap (separate)

### Code References

- `src/utils/rss/generator.ts` - Generic RSS pattern (Phase 1)
- `src/utils/pagination/generator.ts` - Generic pagination (Phase 1)
- `src/config/pagination.ts` - Config pattern (Phase 1)

---

## 🎯 Success Definition

### Phase 1 Success ✅ ACHIEVED

- ✅ All 5 tasks completed
- ✅ 256 lines eliminated
- ✅ 99 tests added, all passing
- ✅ Zero `any` types in production
- ✅ Patterns established for future work

### Phase 2 Success (Targets)

- ✅ ~300 lines eliminated
- ✅ Taxonomy components consolidated
- ✅ URL builders refactored
- ✅ Magic numbers eliminated
- ✅ All tests passing
- ✅ Improved readability

### Phase 3 Success (Targets)

- ✅ ~1,400 lines eliminated
- ✅ Unified routing implemented
- ✅ Single source for all pages
- ✅ i18n properly integrated
- ✅ No SEO regressions
- ✅ Performance maintained/improved

### Overall Success (Q1 2026)

- ✅ 81% duplication reduction (~1,950 lines)
- ✅ Maintainable, scalable codebase
- ✅ Clear patterns established
- ✅ Excellent documentation
- ✅ 95%+ test coverage maintained
- ✅ Production stable, no regressions

---

## 🚀 Conclusion

This refactoring roadmap provides a **clear, actionable, phased approach** to systematically improve the codebase over Q1 2026.

**Phase 1** ✅ COMPLETE: Foundation laid, patterns proven  
**Phase 2** 📋 NEXT: High-value medium-complexity improvements  
**Phase 3** 📋 FUTURE: Major architectural breakthrough

**Total Investment**: ~55 hours over 3 months  
**Total Impact**: ~1,950 duplicate lines eliminated (81% reduction)  
**Result**: World-class, maintainable, scalable codebase

**Current Status**: 🎯 **ACTIVE** - Ready for Phase 2 (January 2026)

---

**Roadmap Version**: 1.0  
**Created**: December 27, 2025  
**Last Updated**: December 27, 2025  
**Next Review**: January 31, 2026 (Post-Phase 2)  
**Owner**: Development Team

**Questions?** See `REFACTORING_PROPOSALS.md` for detailed analysis or create an issue.
