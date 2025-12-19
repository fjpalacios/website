# Blog Migration Specification: Gatsby → Astro

## Executive Summary

This document outlines the complete migration strategy for integrating the blog functionality from the Gatsby project (`website-gatsby`) into the current Astro project (`website`). The migration will follow TDD (Test-Driven Development) principles, Astro best practices, and maintain 95%+ code coverage.

## Current Architecture Analysis (Gatsby)

### Content Structure

The Gatsby blog has a sophisticated content architecture with multiple entity types:

#### Primary Content Types (Posts)

1. **Books** (`/content/books/YYYY/slug/`)

   - Book reviews with metadata (ISBN, pages, score, etc.)
   - Author relationships
   - Publisher relationships
   - Genre/Series/Challenge relationships
   - Buy links (paper/ebook)
   - Cover images

2. **Posts** (`/content/posts/YYYY/slug/`)

   - General blog posts
   - Can include book lists, yearly reviews, etc.
   - Custom MDX components (BookLink, AuthorLink, etc.)

3. **Tutorials** (`/content/tutorials/YYYY/slug/`)
   - Programming tutorials
   - Course relationships
   - Code examples

#### Taxonomies (Relationship Entities)

4. **Authors** (`/content/authors/slug/`)

   - Author bio (multilingual: es.md, en.md)
   - Picture, gender
   - Books authored

5. **Categories** (`/content/categories/slug/`)

   - Post categorization (books, reviews, tutorials)
   - Translatable names

6. **Publishers** (`/content/publishers/slug/`)

   - Publishing house info
   - Books published

7. **Genres** (`/content/genres/fiction/subgenre/`)

   - Nested genre taxonomy (fiction > horror, fiction > crime)
   - Hierarchical structure

8. **Series** (`/content/series/slug/`)

   - Book series info
   - Books in series

9. **Challenges** (`/content/challenges/slug/`)

   - Reading challenges (e.g., "Stephen King Challenge")
   - Associated books

10. **Courses** (`/content/courses/slug/`)
    - Tutorial series
    - Associated tutorials

### Key Features

1. **Multilingual Support (i18n)**

   - Spanish (default) and English
   - Per-entity translation files
   - Language-specific routing

2. **Rich Metadata**

   - ISBNs, ASINs for books
   - Scores (1-5 rating)
   - Publication dates
   - Buy links
   - Cover images

3. **Custom MDX Components**

   - `<BookLink>` - Internal book links
   - `<AuthorLink>` - Internal author links
   - `<Spoiler>` - Collapsible spoiler sections
   - `<SkillBarYear>` - Year statistics visualization

4. **Dynamic Routing**

   - `/blog` - All posts (paginated)
   - `/blog/page/2` - Pagination
   - `/libros`, `/tutoriales` - Type-specific listings
   - `/libros/ficcion/terror` - Genre filtering
   - `/autor/stephen-king` - Author pages
   - `/serie/fjallbacka` - Series pages
   - `/reto-literario-stephen-king` - Challenge pages
   - Language prefix: `/en/blog`, `/en/books`, etc.

5. **Pagination**
   - 10 posts per page
   - Type-specific pagination
   - Category/Genre/Author pagination

## Target Architecture (Astro)

### Content Collections Design

```typescript
// src/content/config.ts

import { defineCollection, reference, z } from "astro:content";

// ============================================================================
// TAXONOMY COLLECTIONS (Referenced by posts)
// ============================================================================

const authorsCollection = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    author_slug: z.string(),
    gender: z.enum(["male", "female", "other", "unknown"]),
    picture: z.string().optional(),
    bio: z.object({
      es: z.string(), // Relative path to es.md
      en: z.string(), // Relative path to en.md
    }),
  }),
});

const publishersCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    publisher_slug: z.string(),
    country: z.string().optional(),
    website: z.string().url().optional(),
  }),
});

const genresCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    genre_slug: z.string(),
    parent: z.string().optional(), // Parent genre slug for nesting
  }),
});

const seriesCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    series_slug: z.string(),
    description: z.string().optional(),
  }),
});

const challengesCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    challenge_slug: z.string(),
    description: z.string(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
  }),
});

const coursesCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    course_slug: z.string(),
    description: z.string(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  }),
});

const categoriesCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    category_slug: z.string(),
    description: z.string().optional(),
  }),
});

// ============================================================================
// POST COLLECTIONS (Primary content)
// ============================================================================

const booksCollection = defineCollection({
  type: "content",
  schema: z.object({
    // Basic metadata
    title: z.string(),
    post_slug: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    language: z.enum(["es", "en"]),

    // Book-specific metadata
    synopsis: z.string(),
    score: z.number().min(1).max(5),
    pages: z.number().positive(),
    isbn: z.string().optional(),
    asin: z.string().optional(),

    // Relationships
    author: reference("authors"),
    publisher: reference("publishers").optional(),
    genres: z.array(reference("genres")).default([]),
    series: reference("series").optional(),
    challenges: z.array(reference("challenges")).default([]),
    categories: z.array(reference("categories")).default([]),

    // External links
    buy: z
      .array(
        z.object({
          type: z.enum(["paper", "ebook", "audiobook"]),
          link: z.string().url(),
          store: z.string().optional(), // Amazon, Casa del Libro, etc.
        }),
      )
      .optional(),
    book_card: z.string().url().optional(), // megustaleer.com link

    // Images
    cover: z.string(), // Relative path to cover image
    book_cover: z.string().optional(), // Original book cover filename

    // i18n
    i18n: z.string().optional(), // Slug of translated version
  }),
});

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    post_slug: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    language: z.enum(["es", "en"]),
    categories: z.array(reference("categories")).default([]),
    cover: z.string().optional(),
    i18n: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const tutorialsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    post_slug: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    language: z.enum(["es", "en"]),
    categories: z.array(reference("categories")).default([]),
    tutorial: z.string().optional(), // Tutorial series slug
    course: reference("courses").optional(),
    cover: z.string().optional(),
    i18n: z.string().optional(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  // Existing collections
  es: emptyCollection,
  en: emptyCollection,

  // Blog taxonomy collections
  authors: authorsCollection,
  publishers: publishersCollection,
  genres: genresCollection,
  series: seriesCollection,
  challenges: challengesCollection,
  courses: coursesCollection,
  categories: categoriesCollection,

  // Blog post collections
  books: booksCollection,
  posts: postsCollection,
  tutorials: tutorialsCollection,
};
```

### Directory Structure

```
src/
├── content/
│   ├── config.ts                    # Collection schemas
│   │
│   ├── authors/
│   │   ├── stephen-king/
│   │   │   ├── index.md             # Author metadata
│   │   │   ├── es.md                # Spanish bio
│   │   │   ├── en.md                # English bio
│   │   │   └── stephen-king.jpg     # Author photo
│   │   └── camilla-lackberg/
│   │       └── ...
│   │
│   ├── books/
│   │   ├── 2017/
│   │   │   ├── apocalipsis-stephen-king.md
│   │   │   └── la-princesa-de-hielo.md
│   │   ├── 2018/
│   │   └── ...
│   │
│   ├── posts/
│   │   ├── 2018/
│   │   │   └── libros-leidos-durante-2017.md
│   │   └── ...
│   │
│   ├── tutorials/
│   │   ├── 2017/
│   │   │   └── what-is-git.md
│   │   └── ...
│   │
│   ├── publishers/
│   │   └── debolsillo.json
│   │
│   ├── genres/
│   │   └── fiction/
│   │       ├── horror.json
│   │       └── crime.json
│   │
│   ├── series/
│   │   └── fjallbacka.json
│   │
│   ├── challenges/
│   │   └── stephen-king.json
│   │
│   ├── courses/
│   │   └── mastering-git-from-scratch.json
│   │
│   └── categories/
│       ├── books.json
│       ├── reviews.json
│       └── tutorials.json
│
├── pages/
│   ├── [lang]/
│   │   ├── blog/
│   │   │   ├── index.astro          # /blog, /en/blog
│   │   │   ├── [page].astro         # /blog/page/2
│   │   │   └── [slug].astro         # /blog/mi-post
│   │   │
│   │   ├── libros/
│   │   │   ├── index.astro          # /libros (book reviews)
│   │   │   ├── [page].astro
│   │   │   └── [slug].astro         # /libros/apocalipsis-stephen-king
│   │   │
│   │   ├── tutoriales/
│   │   │   ├── index.astro          # /tutoriales
│   │   │   ├── [page].astro
│   │   │   └── [slug].astro
│   │   │
│   │   ├── autor/
│   │   │   └── [slug].astro         # /autor/stephen-king
│   │   │
│   │   ├── categoria/
│   │   │   └── [slug].astro         # /categoria/reviews
│   │   │
│   │   ├── serie/
│   │   │   └── [slug].astro         # /serie/fjallbacka
│   │   │
│   │   ├── editorial/
│   │   │   └── [slug].astro         # /editorial/debolsillo
│   │   │
│   │   ├── genero/
│   │   │   └── [slug].astro         # /genero/ficcion/terror
│   │   │
│   │   └── reto/
│   │       └── [slug].astro         # /reto/stephen-king
│   │
│   └── blog.astro                   # Redirect to /blog or /en/blog
│
├── components/
│   ├── blog/
│   │   ├── BookLink.astro           # Internal book link component
│   │   ├── AuthorLink.astro         # Internal author link component
│   │   ├── Spoiler.astro            # Spoiler collapsible component
│   │   ├── SkillBarYear.astro       # Year stats visualization
│   │   ├── BookCard.astro           # Book preview card
│   │   ├── PostCard.astro           # Post preview card
│   │   ├── Pagination.astro         # Pagination component
│   │   ├── BuyLinks.astro           # Buy links (Amazon, etc.)
│   │   └── BookMetadata.astro       # Book metadata display
│   │
│   └── ...
│
└── utils/
    ├── blog/
    │   ├── getCollections.ts        # Helper functions for collections
    │   ├── pagination.ts            # Pagination logic
    │   ├── slugify.ts               # Slug generation
    │   └── i18n.ts                  # Blog i18n utilities
    │
    └── ...
```

### Routing Strategy

#### Spanish (default)

- `/blog` → All posts (books + posts + tutorials)
- `/blog/page/2` → Paginated
- `/libros` → Only book reviews
- `/libros/apocalipsis-stephen-king` → Book detail
- `/tutoriales` → Only tutorials
- `/tutoriales/que-es-git` → Tutorial detail
- `/autor/stephen-king` → Author page with all their books
- `/categoria/reviews` → Category page
- `/serie/fjallbacka` → Series page
- `/editorial/debolsillo` → Publisher page
- `/genero/ficcion/terror` → Genre page
- `/reto/stephen-king` → Challenge page

#### English

- `/en/blog`
- `/en/blog/page/2`
- `/en/books`
- `/en/books/apocalipsis-stephen-king`
- `/en/tutorials`
- `/en/author/stephen-king`
- etc.

#### ⚠️ IMPORTANT: Slug Consistency Across Site

**ACTION REQUIRED**: When implementing blog routes, existing pages must be updated to maintain slug consistency across languages.

**Current Issue**: The "About" page currently uses `/about` for both Spanish and English versions, which breaks i18n consistency.

**Required Changes** (to be implemented in Phase 2 or 3):

**Spanish routes:**

- `/sobre-mi` (currently `/about`) - About page
- `/contacto` (currently `/contact`) - Contact page
- `/blog` - Blog home
- `/libros` - Books listing
- `/tutoriales` - Tutorials listing

**English routes:**

- `/en/about` - About page
- `/en/contact` - Contact page
- `/en/blog` - Blog home
- `/en/books` - Books listing
- `/en/tutorials` - Tutorials listing

**Migration Strategy:**

1. Update Astro routing structure to support language-specific slugs
2. Update existing pages (`about.astro`, `contact.astro`) to use proper i18n slugs
3. Implement redirects from old URLs (`/about` → `/sobre-mi` or `/en/about` based on language detection)
4. Update navigation components to use correct language-specific routes
5. Test all internal links and update documentation

**Files to modify:**

- `src/pages/about.astro` → split into `src/pages/sobre-mi.astro` + `src/pages/en/about.astro`
- `src/pages/contact.astro` → split into `src/pages/contacto.astro` + `src/pages/en/contact.astro`
- Navigation components (header, footer)
- Sitemap generation
- Any hardcoded links in content

### MDX Components Migration

All Gatsby MDX components will be migrated to Astro components:

1. **BookLink** → `<BookLink title="..." />`

   - Queries books collection by title
   - Generates internal link with proper slug
   - Shows book icon + title

2. **AuthorLink** → `<AuthorLink name="..." />`

   - Queries authors collection by name
   - Generates internal link to author page
   - Shows author name (optionally with photo)

3. **Spoiler** → `<Spoiler>content</Spoiler>`

   - Collapsible spoiler section
   - Uses details/summary HTML elements
   - Styled with CSS

4. **SkillBarYear** → `<SkillBarYear year="2017" />`
   - Fetches reading statistics for given year
   - Displays bar chart visualization

## Migration Plan (TDD Approach)

### Phase 1: Foundation (Week 1)

#### Task 1.1: Content Collections Schema

**Test First:**

```typescript
// src/__tests__/content/schemas.test.ts
describe("Content Collections Schemas", () => {
  describe("Books Collection", () => {
    it("should validate valid book entry", () => {
      const validBook = {
        title: "Apocalipsis",
        post_slug: "apocalipsis-stephen-king",
        date: new Date("2017-05-02"),
        excerpt: "Me ha encantado...",
        language: "es",
        synopsis: "Esta narración cuenta...",
        score: 5,
        pages: 1584,
        isbn: "9788497599412",
        author: "stephen-king",
        publisher: "debolsillo",
        genres: ["fiction-horror"],
        cover: "./cover.jpg",
      };

      expect(() => booksSchema.parse(validBook)).not.toThrow();
    });

    it("should reject invalid score", () => {
      const invalidBook = { ...validBook, score: 6 };
      expect(() => booksSchema.parse(invalidBook)).toThrow();
    });

    it("should require mandatory fields", () => {
      const incompleteBook = { title: "Test" };
      expect(() => booksSchema.parse(incompleteBook)).toThrow();
    });
  });

  describe("Authors Collection", () => {
    // Similar tests for authors
  });

  // ... tests for all collections
});
```

**Then Implement:**

- Create `src/content/config.ts` with all Zod schemas
- Ensure all tests pass

#### Task 1.2: Utility Functions

**Test First:**

```typescript
// src/__tests__/utils/blog/slugify.test.ts
describe("Slug Generation", () => {
  it("should generate valid slug from title", () => {
    expect(slugify("Apocalipsis, de Stephen King")).toBe("apocalipsis-de-stephen-king");
  });

  it("should handle special characters", () => {
    expect(slugify("¿Qué es Git?")).toBe("que-es-git");
  });
});

// src/__tests__/utils/blog/getCollections.test.ts
describe("Collection Helpers", () => {
  it("should get all books for an author", async () => {
    const books = await getBooksByAuthor("stephen-king");
    expect(books.length).toBeGreaterThan(0);
    expect(books[0].data.author.slug).toBe("stephen-king");
  });

  it("should filter books by language", async () => {
    const spanishBooks = await getBooksByLanguage("es");
    expect(spanishBooks.every((b) => b.data.language === "es")).toBe(true);
  });
});

// src/__tests__/utils/blog/pagination.test.ts
describe("Pagination", () => {
  it("should calculate correct page count", () => {
    expect(getPageCount(25, 10)).toBe(3);
  });

  it("should slice items correctly for page", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const page2 = paginateItems(items, 2, 10);
    expect(page2).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });
});
```

**Then Implement:**

- Create utility functions in `src/utils/blog/`
- Ensure 100% test coverage

### Phase 2: Content Migration (Week 2)

#### Task 2.1: Migrate Taxonomy Content

- Copy `/content/authors` → `/src/content/authors`
- Copy `/content/publishers` → `/src/content/publishers` (convert to JSON)
- Copy `/content/genres` → `/src/content/genres` (convert to JSON)
- Copy `/content/series` → `/src/content/series` (convert to JSON)
- Copy `/content/challenges` → `/src/content/challenges` (convert to JSON)
- Copy `/content/courses` → `/src/content/courses` (convert to JSON)
- Copy `/content/categories` → `/src/content/categories` (convert to JSON)

**Test:**

```typescript
// src/__tests__/content/taxonomy.test.ts
describe("Taxonomy Content Integrity", () => {
  it("should load all authors correctly", async () => {
    const authors = await getCollection("authors");
    expect(authors.length).toBeGreaterThan(0);

    const stephenKing = authors.find((a) => a.data.author_slug === "stephen-king");
    expect(stephenKing).toBeDefined();
    expect(stephenKing.data.name).toBe("Stephen King");
  });

  // Similar tests for other taxonomies
});
```

#### Task 2.2: Migrate Post Content

- Copy `/content/books` → `/src/content/books`
- Copy `/content/posts` → `/src/content/posts`
- Copy `/content/tutorials` → `/src/content/tutorials`
- Update frontmatter to match new schema
- Convert Gatsby image paths to Astro image paths

**Test:**

```typescript
// src/__tests__/content/posts.test.ts
describe("Post Content Integrity", () => {
  it("should load all books", async () => {
    const books = await getCollection("books");
    expect(books.length).toBeGreaterThan(0);
  });

  it("should have valid references", async () => {
    const apocalipsis = (await getCollection("books")).find((b) => b.data.post_slug === "apocalipsis-stephen-king");

    expect(apocalipsis).toBeDefined();
    expect(apocalipsis.data.author).toBe("stephen-king");

    // Verify reference resolves
    const author = await getEntry("authors", apocalipsis.data.author);
    expect(author).toBeDefined();
    expect(author.data.name).toBe("Stephen King");
  });
});
```

### Phase 3: MDX Components (Week 3)

#### Task 3.1: Create Astro Components

**Test First:**

```typescript
// src/__tests__/components/blog/BookLink.test.ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import BookLink from "@/components/blog/BookLink.astro";

test("BookLink renders correct link and title", async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(BookLink, {
    props: { title: "Apocalipsis, de Stephen King" },
  });

  expect(result).toContain('href="/libros/apocalipsis-stephen-king"');
  expect(result).toContain("Apocalipsis");
});

test("BookLink with full title prop", async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(BookLink, {
    props: { title: "Apocalipsis, de Stephen King", full: true },
  });

  expect(result).toContain("Apocalipsis, de Stephen King");
});
```

**Then Implement:**

- `BookLink.astro`
- `AuthorLink.astro`
- `Spoiler.astro`
- `SkillBarYear.astro`
- etc.

### Phase 4: Routing & Pages (Week 4)

#### Task 4.1: Create Blog Listing Pages

**Test First (E2E):**

```typescript
// e2e/blog/blog-listing.test.ts
import { expect, test } from "@playwright/test";

test.describe("Blog Listing", () => {
  test("should display all blog posts", async ({ page }) => {
    await page.goto("/blog");

    await expect(page.locator("h1")).toContainText("Blog");

    const posts = page.locator('[data-testid="post-card"]');
    await expect(posts).toHaveCount(10); // First page

    // Check pagination
    await expect(page.locator('[data-testid="pagination"]')).toBeVisible();
  });

  test("should navigate to page 2", async ({ page }) => {
    await page.goto("/blog");
    await page.click("text=2");

    await expect(page).toHaveURL("/blog/page/2");
    const posts = page.locator('[data-testid="post-card"]');
    await expect(posts.first()).toBeVisible();
  });
});
```

**Then Implement:**

- `src/pages/[lang]/blog/index.astro`
- `src/pages/[lang]/blog/[page].astro`
- `src/pages/[lang]/blog/[slug].astro`

#### Task 4.2: Create Type-Specific Listings

- `src/pages/[lang]/libros/` (books)
- `src/pages/[lang]/tutoriales/` (tutorials)
- E2E tests for each

#### Task 4.3: Create Taxonomy Pages

- Author pages
- Category pages
- Publisher pages
- Genre pages
- Series pages
- Challenge pages
- E2E tests for each

### Phase 5: Polish & Documentation (Week 5)

#### Task 5.1: RSS Feed

```typescript
// src/pages/rss.xml.ts
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const books = await getCollection("books");
  const posts = await getCollection("posts");
  const tutorials = await getCollection("tutorials");

  const allPosts = [...books, ...posts, ...tutorials].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "fjp.es - Blog",
    description: "Blog personal sobre libros, programación y tecnología",
    site: context.site,
    items: allPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/blog/${post.data.post_slug}/`,
    })),
  });
}
```

#### Task 5.2: SEO & Open Graph

- Meta tags for blog posts
- Open Graph images
- Structured data (JSON-LD) for books

#### Task 5.3: Documentation

- Update README with blog section
- Update CONTRIBUTING with blog content guidelines
- Create blog writing guide

## Testing Strategy

### Unit Tests (Vitest)

- Content collection schemas validation
- Utility functions (slugify, pagination, etc.)
- MDX component rendering
- Target: 95%+ coverage

### Integration Tests (Vitest)

- Content queries with relationships
- Collection filtering and sorting
- i18n content loading

### E2E Tests (Playwright)

- Blog listing navigation
- Post detail pages
- Pagination
- Author/Category/Genre pages
- Language switching
- Search functionality (if implemented)

### Visual Regression Tests (Optional)

- Playwright screenshots
- Compare before/after migration

## Performance Considerations

1. **Static Generation**

   - All blog pages are static (SSG)
   - No SSR needed

2. **Image Optimization**

   - Use Astro's `<Image>` component
   - Serve WebP/AVIF formats
   - Lazy loading below the fold

3. **Code Splitting**

   - Separate bundles for blog section
   - Lazy load MDX components

4. **Pagination**
   - 10 posts per page
   - Prevents large page sizes

## SEO Strategy

1. **Canonical URLs**

   - Spanish: `/blog/slug`
   - English: `/en/blog/slug`
   - Proper canonical tags

2. **Hreflang Tags**

   - Link translated versions
   - Proper language targeting

3. **Structured Data**

   - Book reviews: `schema.org/Book`
   - Tutorials: `schema.org/TechArticle`
   - Author pages: `schema.org/Person`

4. **Sitemap**
   - Include all blog URLs
   - Separate sitemap for blog?

## Accessibility

1. **Semantic HTML**

   - Proper heading hierarchy
   - ARIA labels where needed

2. **Keyboard Navigation**

   - Tab order
   - Skip links

3. **Screen Reader Support**

   - Alt text for all images
   - Descriptive link text

4. **Color Contrast**
   - WCAG 2.1 AA compliant
   - Dark mode support

## Migration Checklist

- [ ] Phase 1: Foundation & Schemas

  - [ ] Content collections config
  - [ ] Zod schemas for all entities
  - [ ] Utility functions
  - [ ] Unit tests (95%+ coverage)

- [ ] Phase 2: Content Migration

  - [ ] Migrate taxonomy content
  - [ ] Migrate post content
  - [ ] Verify all references
  - [ ] Integration tests

- [ ] Phase 3: MDX Components

  - [ ] BookLink component
  - [ ] AuthorLink component
  - [ ] Spoiler component
  - [ ] SkillBarYear component
  - [ ] Other custom components
  - [ ] Component tests

- [ ] Phase 4: Routing & Pages

  - [ ] Blog listing pages
  - [ ] Book listing pages
  - [ ] Tutorial listing pages
  - [ ] Post detail pages
  - [ ] Taxonomy pages (author, category, etc.)
  - [ ] E2E tests

- [ ] Phase 5: Polish

  - [ ] RSS feed
  - [ ] SEO optimization
  - [ ] Open Graph tags
  - [ ] Accessibility audit
  - [ ] Performance audit
  - [ ] Documentation

- [ ] Phase 6: Review & Deploy
  - [ ] Code review
  - [ ] PR following contribution guidelines
  - [ ] Merge to master
  - [ ] Deploy

## Success Metrics

- ✅ 95%+ test coverage maintained
- ✅ All CI/CD checks pass
- ✅ Lighthouse scores remain 90+
- ✅ Zero accessibility violations
- ✅ All blog URLs redirect properly
- ✅ SEO metadata complete
- ✅ i18n works correctly
- ✅ All images optimized

## Timeline

- **Week 1**: Foundation (schemas, utils, tests)
- **Week 2**: Content migration
- **Week 3**: MDX components
- **Week 4**: Routing & pages
- **Week 5**: Polish & documentation
- **Week 6**: Review & deploy

Total: **6 weeks** for complete migration with TDD approach.

---

_This specification will be updated as the migration progresses._
