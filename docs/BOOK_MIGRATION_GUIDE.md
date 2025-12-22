# Book Migration Guide

## Overview

This document provides comprehensive guidelines for migrating book reviews from the legacy WordPress site to the new Astro-based website.

## Source Materials

### Primary Sources

1. **WordPress Markdown Exports**: `/home/fjpalacios/Code/WordPress/output/*.md`

   - ⚠️ **IMPORTANT**: Exports contain ONLY `title` and `date` in frontmatter
   - ⚠️ **NO metadata**: No ISBN, pages, score, buy links, book_card, publisher, etc.
   - Use ONLY for review content (body), NOT for metadata
   - Example frontmatter in exports:
     ```yaml
     ---
     title: "Book Title, by Author Name"
     date: "2017-01-23"
     ---
     ```

2. **Original WordPress Sites** ⭐ **MANDATORY FOR ALL METADATA**:

   - **Books & Blog Posts**: https://fjp.es/blog/
   - **Book Reviews Index**: https://fjp.es/libros/resenas/
   - **Tutorials & Other Posts**: https://sargantanacode.es/
   - **YOU MUST visit the original page for EVERY book** to get:
     - Complete synopsis
     - ISBN, pages, score
     - Buy links (Amazon paper, ebook)
     - Book card link (megustaleer.com, planetadelibros.com, etc.)
     - Publisher information
     - Cover image URL
   - URL pattern: `https://fjp.es/book-slug/`
   - Example: https://fjp.es/todo-esto-te-dare-dolores-redondo/

3. **Images**: Cover images MUST be downloaded from original site
   - WordPress export folder has some images but NOT all
   - Always get cover from original webpage: Right-click → Save image

### WordPress Export Files

- **Main export**: `/home/fjpalacios/Code/WordPress/entries.xml`
- **Books export**: `/home/fjpalacios/Code/WordPress/books.xml`
- **Markdown output**: `/home/fjpalacios/Code/WordPress/output/`

## Golden Rules for Book Migration

### 1. Complete Metadata is Mandatory

Every book must have **ALL** required metadata fields. **WordPress exports do NOT contain metadata** - only `title` and `date`.

⚠️ **YOU MUST visit the original website** (https://fjp.es/book-slug/) for EVERY book to extract:

- `title`: Book title (clean, without author name)
- `post_slug`: URL-friendly slug
- `date`: Publication date (YYYY-MM-DD format) - only field in WordPress export
- `excerpt`: Brief description for lists (150-200 characters) - create from synopsis
- `language`: "es" or "en"
- `synopsis`: Complete book synopsis (from original site sidebar)
- `score`: Rating out of 5 (0-5) - check original site footer/sidebar
- `pages`: Number of pages - from "**Páginas:**" on original site
- `isbn`: ISBN-13 format - from "**ISBN:**" on original site
- `author`: Author slug reference (create if doesn't exist)
- `publisher`: Publisher slug reference (create if doesn't exist) - from "**Editorial:**"
- `genres`: Array of genre slugs (check sidebar or infer from content)
- `categories`: Array of category slugs (typically `["libros", "resenas"]`)
- `challenges`: Array of challenge slugs (e.g., `["reto-lectura-2017"]`)
- `cover`: Default fallback (`/images/defaults/book-default-es.jpg`)
- `book_cover`: Path to actual cover (`/images/books/book-name.jpg`)
- `buy`: Array with `type`, `link` - from "**Comprar:**" links on original site
- `book_card`: URL from "**ficha del libro**" link on original site (OPTIONAL but recommended)

**Where to find each field on original site (https://fjp.es/book-slug/):**

```
┌─────────────────────────────────────┐
│ [Book Cover Image] ← Right-click    │
│                                      │
│ Book Title ← title (clean)          │
│                                      │
│ Páginas: 640 ← pages                │
│ ISBN: 9788408163176 ← isbn          │
│ Comprar: [papel] [ebook] ← buy      │
│ Editorial: Planeta ← publisher      │
│ [ficha del libro] ← book_card       │
│                                      │
│ Sinopsis                            │
│ ────────                            │
│ Complete synopsis text... ← synopsis│
│                                      │
│ Opinión                             │
│ ───────                             │
│ Review content... ← from export     │
│                                      │
│ [Footer: ⭐⭐⭐⭐⭐] ← score           │
└─────────────────────────────────────┘
```

**If metadata is missing from original site**: Search online (Goodreads, Google Books, Amazon)

### 2. Images: CRITICAL - Always Verify They Exist! 🔴

⚠️ **IMAGES ARE CRITICAL**: A book/author without images looks broken and unprofessional. **ALWAYS verify images exist and load correctly.**

#### Cover Images: Understanding the Fields

**IMPORTANT**: There are THREE different image fields for books:

1. **`cover`**: Default fallback image

   - **Almost always**: `/images/defaults/book-default-es.jpg` (or `-en.jpg` for English)
   - Used as fallback when specific images are not available
   - **DO NOT change this unless you have a specific reason**
   - Path: `/images/defaults/book-default-[language].jpg`

2. **`book_cover`**: The actual book cover image ⭐ **THIS IS WHAT YOU NEED TO SET**

   - The real book cover that appears on the book detail page
   - High quality image of the book cover
   - Path: `/images/books/book-name.jpg`
   - Stored in: `/home/fjpalacios/Code/website/public/images/books/`
   - **This is mandatory for every book migration**

3. **`post_image`** (OPTIONAL): Featured post image
   - Used in lists and blog roll views
   - Can be different from `book_cover` (e.g., a quote image, custom graphic)
   - Path: `/images/posts/post-name.jpg`
   - Stored in: `/home/fjpalacios/Code/website/public/images/posts/`
   - If not specified, `book_cover` is used

**Typical Frontmatter Structure**:

```yaml
cover: "/images/defaults/book-default-es.jpg" # Keep as default
book_cover: "/images/books/apocalipsis-stephen-king.jpg" # Set this!
post_image: "/images/posts/special-image.jpg" # Optional
```

**Book Cover Image Checklist** ⚠️ **MANDATORY**:

- [ ] Download book cover from original website (https://fjp.es/book-slug/)
  - Right-click on cover image → Copy image address
  - Use `wget` or save directly
- [ ] Save to `/public/images/books/` with descriptive name (e.g., `book-slug.jpg`)
- [ ] **VERIFY file exists**: `ls -lh public/images/books/book-slug.jpg`
- [ ] **CHECK file size**: Should be > 5KB (if smaller, re-download)
- [ ] Add `book_cover` field to frontmatter with correct path
- [ ] Keep `cover` field as default (`/images/defaults/book-default-es.jpg`)
- [ ] **TEST in browser**: Image must load on book detail page

#### Author Images: Equally Important!

**Author Photo Checklist** ⚠️ **MANDATORY if creating new author**:

- [ ] Download author photo from original website
  - URL pattern: `https://fjp.es/wp-content/uploads/author-slug.jpg`
- [ ] Save to `/public/images/authors/` with author slug name
- [ ] **VERIFY file exists**: `ls -lh public/images/authors/author-slug.jpg`
- [ ] **CHECK file size**: Should be > 5KB
- [ ] Add `picture` field to author frontmatter
- [ ] **TEST in browser**: Image must load on author page

**Common image commands**:

```bash
# Download book cover
wget "https://fjp.es/wp-content/uploads/book-cover.jpg" -O public/images/books/book-slug.jpg

# Download author photo
wget "https://fjp.es/wp-content/uploads/author-name.jpg" -O public/images/authors/author-slug.jpg

# Verify images exist
ls -lh public/images/books/book-slug.jpg
ls -lh public/images/authors/author-slug.jpg

# Check if images are referenced correctly
grep -n "book_cover\|picture" src/content/books/book-slug.mdx
grep -n "picture" src/content/authors/author-slug-es.mdx
```

### 3. Use MDX Components for References

**ALWAYS** use MDX components when referencing authors or books, regardless of whether they're currently reviewed or not. The components are smart: they'll show links when content exists, and plain text otherwise.

#### Import Required Components

At the top of the MDX file, after frontmatter:

```mdx
---
title: "Book Title"
# ... frontmatter
---

import Spoiler from "@components/blog/Spoiler.astro"
import AuthorLink from "@components/blog/AuthorLink.astro"
import BookLink from "@components/blog/BookLink.astro

"
```

#### Use AuthorLink for ALL Author Mentions

```mdx
<AuthorLink name="Stephen King" />
<AuthorLink name="Dolores Redondo" />
<AuthorLink name="Stieg Larsson" />
```

**Rules**:

- Use for EVERY author mention in the text
- Name must match exactly (case-sensitive)
- Works even if author bio doesn't exist yet
- Will automatically link when author is added

#### Use BookLink for ALL Book Mentions

```mdx
<BookLink title="Apocalipsis" />
<BookLink title="Todo esto te daré" />
<BookLink title="El guardián invisible" />
```

**Rules**:

- Use for EVERY book mention in the text
- Title can be partial or full
- Works even if book review doesn't exist yet
- Will automatically link when book is reviewed

### 4. Correct Heading Hierarchy

**IMPORTANT CONTEXT**: Book review pages are NOT rendered in isolation. The page layout includes:

- Page title/header (H1) - automatically generated from frontmatter
- Metadata section (author, date, genres, etc.)
- Navigation breadcrumbs
- Other UI elements

Therefore, **the MDX content itself should use H4 level (`####`)** for section headings within reviews.

Book reviews follow this structure (check `apocalipsis-stephen-king.mdx` as reference):

```mdx
---
title: "Book Title" # This becomes the page H1
# ... frontmatter
---

import Spoiler from "@components/blog/Spoiler.astro";
import AuthorLink from "@components/blog/AuthorLink.astro";
import BookLink from "@components/blog/BookLink.astro";

Main review content here (no heading needed)...

#### Características

Content about narrative structure, style, etc.

#### Personajes

Character descriptions...

#### Pros y contras

Mi **pro** va para...

Mi **contra** va para...

#### Cita

> Quote from the book
```

**Heading Rules**:

- **Never use `#` (H1)** - the page title from frontmatter is already rendered as H1
- **Use `####` (H4)** for main review sections (Características, Personajes, Pros y contras, Cita)
- **Use `#####` (H5)** for subsections if needed (rare)
- **Start review text directly** without heading - it comes right after the metadata section
- Common H4 sections: `Características`, `Personajes`, `Pros y contras`, `Cita`, `El final`

**Why H4 and not H2?**: The page structure includes intermediate heading levels (H2, H3) for metadata sections, navigation, and other UI elements. Using H4 for content sections maintains proper semantic HTML hierarchy and accessibility.

### 5. Author Biographies

When creating author files (`/src/content/authors/`):

#### Frontmatter Requirements

```yaml
---
name: "Author Full Name"
author_slug: "author-slug"
language: "es"  # or "en"
gender: "male" | "female" | "other"  # optional
birth_year: 1969  # optional
death_year: 2000  # optional
nationality: "Spanish"  # optional
picture: "/images/authors/author-name.jpg"  # optional
website: "https://example.com"  # optional, must be valid URL or omit
twitter: "@authorhandle"  # optional, or omit
goodreads: "https://goodreads.com/..."  # optional, must be valid URL or omit
wikipedia: "https://wikipedia.org/..."  # optional, must be valid URL or omit
i18n: "en"  # or "es" - points to other language version
---
```

**IMPORTANT**: For optional URL fields (`website`, `twitter`, `goodreads`, `wikipedia`):

- Either provide a valid URL
- Or **omit the field entirely**
- **NEVER** use `null`, `undefined`, or empty strings

#### Biography Content

- Use MDX components for book and author references
- Write in appropriate language (Spanish for `-es`, English for `-en`)
- Include links to their works using `<BookLink>`
- Create both language versions (`author-name-es.mdx` and `author-name-en.mdx`)

### 6. Publisher Information

Create JSON files in `/src/content/publishers/`:

```json
{
  "name": "Publisher Name",
  "publisher_slug": "publisher-slug",
  "language": "es",
  "website": "https://example.com",
  "description": "Brief description",
  "i18n": "en"
}
```

### 7. Spoiler Sections

For content that contains spoilers:

```mdx
<Spoiler>Content with spoilers here...</Spoiler>
```

### 8. Reading Challenges

If the book is part of a reading challenge:

1. Add to frontmatter: `challenge: "reto-lectura-2017"`
2. Verify challenge exists in `/src/content/challenges/`
3. Update challenge post if it lists books (e.g., `libros-leidos-durante-2017.mdx`)

## Migration Workflow

### Step-by-Step Process

⚠️ **CRITICAL**: WordPress exports contain ONLY review content. ALL metadata must come from the original website!

1. **Read WordPress Export** (for content only)

   ```bash
   cat /home/fjpalacios/Code/WordPress/output/book-name.md
   ```

   - Get the review text (body content)
   - Note: Frontmatter only has `title` and `date` - ignore it!

2. **Fetch Original Web Page** ⭐ **MANDATORY FOR METADATA**

   - Visit https://fjp.es/book-slug/
   - Extract ALL metadata from the page:
     - **Páginas**: Number of pages
     - **ISBN**: Full ISBN-13
     - **Comprar**: Buy links (papel + ebook at minimum)
     - **Editorial**: Publisher name and slug
     - **Ficha del libro**: book_card URL (megustaleer, planetadelibros, maeva, etc.)
     - **Sinopsis**: Complete book synopsis
     - **Puntuación**: Score (see sidebar or footer)
     - **Cover image**: Right-click and copy image URL
   - Also check author bio section for author photo and info

3. **Check Dependencies**

   - Author exists? Check `/src/content/authors/`
   - If not, create author bio (both languages)
   - Publisher exists? Check `/src/content/publishers/`
   - If not, create publisher JSON
   - Genres exist? Check `/src/content/genres/`
   - If not, create genre JSON files

4. **Download Cover Image** ⚠️ **CRITICAL - ALWAYS VERIFY!**

   ```bash
   # From original site
   wget https://fjp.es/wp-content/uploads/.../cover.jpg -O /home/fjpalacios/Code/website/public/images/books/book-slug.jpg

   # VERIFY it exists and has content
   ls -lh /home/fjpalacios/Code/website/public/images/books/book-slug.jpg
   # Should show file size > 5KB
   ```

   **Important**:

   - The downloaded image goes into `book_cover` field, NOT `cover` field
   - Always check file size - if too small, image didn't download correctly
   - Test in browser after migration to ensure image loads

5. **Create MDX File**

   - Path: `/src/content/books/book-slug.mdx`
   - Complete frontmatter with ALL fields
   - Import required components
   - Convert content from WordPress export
   - Apply MDX components to all author/book references
   - Fix heading hierarchy
   - Add spoiler tags where needed

6. **Test Build**

   ```bash
   cd /home/fjpalacios/Code/website
   bun run build
   ```

7. **Visual Verification**

   - Check book appears in lists
   - Check book detail page renders correctly
   - Verify cover image appears
   - Verify all links work

8. **Update Documentation**
   - Mark book as migrated in progress tracking
   - Note any issues or special cases

## Common Mistakes to Avoid

### Critical Errors (Will break migration)

1. ❌ **Trusting WordPress export metadata** - Exports have ONLY title/date, nothing else!
2. ❌ **Not visiting original website** - ALL metadata must come from https://fjp.es/book-slug/
3. ❌ **Missing or broken images** 🔴 **CRITICAL**:
   - Not downloading book cover
   - Not downloading author photo
   - Image file doesn't exist (check with `ls`)
   - Image file corrupted (check size > 5KB)
   - Wrong path in frontmatter
4. ❌ **Using wrong field names**:
   - ❌ `buy_links` → ✅ `buy`
   - ❌ `challenge` → ✅ `challenges` (array!)
   - ❌ Missing `book_cover` → ✅ Always required
5. ❌ **Confusing `cover` with `book_cover`**:
   - `cover` = default fallback (don't change)
   - `book_cover` = actual book cover (this is what you set!)
6. ❌ **Wrong `buy` format**:
   - ❌ `{name: "Amazon", url: "..."}`
   - ✅ `{type: "paper", link: "..."}`
7. ❌ **Using `null` for optional fields** - Omit them entirely instead
8. ❌ **Forgetting `book_card`** - Check for "ficha del libro" link on original site

### Content Errors

9. ❌ **Not using MDX components** - ALL author/book mentions need `<AuthorLink>` / `<BookLink>`
10. ❌ **Wrong heading hierarchy** - Use H4 (`####`) for review sections, never H1 or H2
11. ❌ **Broken image references** - Path in frontmatter doesn't match actual file location
12. ❌ **Not creating author bios** - Need both ES and EN versions
13. ❌ **Forgetting to import components** - Must import at top of MDX file
14. ❌ **Not testing build** - Run `bun run build` after each migration
15. ❌ **Not testing images in browser** - Images may not load even if file exists

## Reference Examples

### Excellent Migration Examples

- **`apocalipsis-stephen-king.mdx`**: Perfect structure, all metadata, correct components
- **`la-princesa-de-hielo.mdx`**: Good structure (but missing cover image - needs fix)
- **`el-misterio-de-styles-agatha-christie.mdx`**: Complete with all components

### Examples to Fix

- **`cuentos-de-navidad-charles-dickens.mdx`**: Missing metadata, wrong headings, no MDX components
- **`la-princesa-de-hielo.mdx`**: Missing book cover image

## Tools and Resources

- **WordPress Export**: `/home/fjpalacios/Code/WordPress/output/`
- **Original Sites**: https://fjp.es/ and https://sargantanacode.es/
- **Book Details**: Goodreads, Google Books, Amazon
- **ISBN Lookup**: https://isbnsearch.org/
- **Schema Reference**: `/src/schemas/blog.ts`

## Quality Checklist

Before considering a book migration complete:

### Metadata (from original website)

- [ ] ⭐ Visited original website: `https://fjp.es/book-slug/`
- [ ] All required frontmatter fields populated (see schema)
- [ ] `title` cleaned (without author name)
- [ ] `excerpt` created from synopsis (150-200 chars)
- [ ] `synopsis` copied from original site
- [ ] `score` verified (1-5 stars from footer/sidebar)
- [ ] `pages` extracted from "**Páginas:**" field
- [ ] `isbn` extracted from "**ISBN:**" field
- [ ] `buy` array with correct format (`type`, `link`)
  - [ ] At minimum: paper + ebook links from "**Comprar:**"
- [ ] `book_card` URL from "**ficha del libro**" link (if available)
- [ ] `publisher` identified from "**Editorial:**" field
- [ ] `challenges` is array format: `["reto-lectura-2017"]`
- [ ] `cover` kept as default: `/images/defaults/book-default-es.jpg`

### Images ⚠️ **HIGH PRIORITY**

- [ ] Book cover downloaded from original site
- [ ] **File exists**: `ls -lh public/images/books/book-slug.jpg` ✓
- [ ] **File size OK**: > 5KB (not a broken download)
- [ ] Saved to `/public/images/books/book-slug.jpg`
- [ ] `book_cover` field set correctly in frontmatter
- [ ] Cover displays in both list and detail views
- [ ] If new author: author photo downloaded
- [ ] **Author photo exists**: `ls -lh public/images/authors/author-slug.jpg` ✓
- [ ] **Author photo size OK**: > 5KB
- [ ] `picture` field set in author frontmatter
- [ ] Author photo displays on author page

### Dependencies

- [ ] Author bio exists (both ES + EN)
- [ ] Author photo downloaded and saved
- [ ] Publisher exists (both ES + EN if needed)
- [ ] All genres exist

### Content

- [ ] MDX components imported (`AuthorLink`, `BookLink`, `Spoiler`)
- [ ] ALL author mentions use `<AuthorLink name="..." />`
- [ ] ALL book mentions use `<BookLink title="..." />`
- [ ] Heading hierarchy correct (H2 for sections, no H1)
- [ ] Spoiler tags applied where needed
- [ ] Review content from WordPress export properly formatted

### Testing

- [ ] Build passes: `bun run build`
- [ ] No errors or warnings
- [ ] Visual verification in detail page
- [ ] Buy links work
- [ ] Book card link works
- [ ] Reading challenge updated if applicable

## Notes

- **Language Consistency**: Code, comments, commits, and generated text must be in English. Explanations and documentation for context can be in Spanish.
- **Testing**: Always run `bun run build` after each migration to catch errors early.
- **Incrementality**: Migrate one book at a time, test, commit, then move to next.
- **Quality over Speed**: Better to migrate fewer books correctly than many books with errors.
