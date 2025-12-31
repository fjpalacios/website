# 🛠️ Development Scripts

Automation scripts to improve developer experience and content management.

## ✨ New Features

**All scripts now support automatic entity creation!**

- 📚 **Books**: Auto-creates authors, publishers, genres, and categories if they don't exist
- 📝 **Posts**: Auto-creates categories if they don't exist
- 🎓 **Tutorials**: Auto-creates courses and categories if they don't exist

**No more "Entity not found" errors!** Just provide names, and the scripts handle the rest.

---

## 📝 Content Creation Scripts

### Create a New Book

```bash
# Interactive mode (recommended - most user-friendly)
bun run new:book -- --interactive

# Command line mode (now with auto-creation!)
bun run new:book -- --title "El nombre del viento" --author "Patrick Rothfuss" --lang es

# With all options (entities will be auto-created if they don't exist)
bun run new:book -- \
  --title "El nombre del viento" \
  --author "Patrick Rothfuss" \
  --lang es \
  --isbn "9788401352836" \
  --pages 872 \
  --publisher "Plaza & Janés" \
  --score 5 \
  --genres "Fantasía,Ficción" \
  --categories "Libros,Reseñas"
```

**Options:**

- `--title` (required): Book title
- `--author` (required): Author **name** (will be created if doesn't exist)
- `--lang` (optional): Language code (`es` | `en`) - default: `es`
- `--isbn` (optional): ISBN number
- `--pages` (optional): Number of pages
- `--publisher` (optional): Publisher **name** (will be created if doesn't exist)
- `--score` (optional): Rating (`1-5` | `fav`)
- `--genres` (optional): Comma-separated genre **names** (will be created if don't exist)
- `--categories` (optional): Comma-separated category **names** (will be created if don't exist)
- `--interactive` (optional): Run in interactive mode

**What gets auto-created:**

- ✨ Author file: `src/content/authors/{author-slug}-{lang}.mdx`
- ✨ Publisher file: `src/content/publishers/{publisher-slug}.json` (if publisher provided)
- ✨ Genre files: `src/content/genres/{genre-slug}.json` (for each new genre)
- ✨ Category files: `src/content/categories/{category-slug}.json` (for each new category)

**Output:**

- Creates file: `src/content/books/{slug}.mdx`
- Auto-generates slug from title (handles ñ, á, and special characters)
- Includes template structure with all required fields
- Reports which entities were created vs. found

### Create a New Post

```bash
# Interactive mode
bun run new:post -- --interactive

# Command line mode (categories auto-created if needed)
bun run new:post -- --title "Mi experiencia con Astro" --lang es

# With categories and tags
bun run new:post -- \
  --title "Mi experiencia con Astro" \
  --categories "Publicaciones,Desarrollo Web" \
  --tags "astro,javascript,web"
```

**Options:**

- `--title` (required): Post title
- `--lang` (optional): Language code (`es` | `en`) - default: `es`
- `--categories` (optional): Comma-separated category **names** (will be created if don't exist) - default: `["publicaciones"]` (es) or `["posts"]` (en)
- `--tags` (optional): Comma-separated tag names
- `--interactive` (optional): Run in interactive mode

**What gets auto-created:**

- ✨ Category files: `src/content/categories/{category-slug}.json` (for each new category)

**Output:**

- Creates file: `src/content/posts/{slug}.mdx`
- Auto-generates slug from title
- Includes template structure with sections

### Create a New Tutorial

```bash
# Interactive mode
bun run new:tutorial -- --interactive

# Command line mode (course auto-created if needed)
bun run new:tutorial -- --title "Cómo usar Git" --lang es

# With course, categories, and tags
bun run new:tutorial -- \
  --title "Cómo usar Git" \
  --course "Domina Git desde cero" \
  --categories "Tutoriales,Git" \
  --tags "git,control-versiones"
```

**Options:**

- `--title` (required): Tutorial title
- `--lang` (optional): Language code (`es` | `en`) - default: `es`
- `--course` (optional): Course **name** (will be created if doesn't exist)
- `--categories` (optional): Comma-separated category **names** (will be created if don't exist) - default: `["tutoriales"]` (es) or `["tutorials"]` (en)
- `--tags` (optional): Comma-separated tag names
- `--interactive` (optional): Run in interactive mode

**What gets auto-created:**

- ✨ Course file: `src/content/courses/{course-slug}.json` (if course provided)
- ✨ Category files: `src/content/categories/{category-slug}.json` (for each new category)

**Output:**

- Creates file: `src/content/tutorials/{slug}.mdx`
- Auto-generates slug from title
- Includes step-by-step template structure

---

## ✅ Content Validation Script

Validate all content files for correctness and consistency.

```bash
# Validate all content types
bun run validate

# Validate specific content type
bun run validate:books
bun run validate:posts
bun run validate:tutorials
```

**Checks performed:**

**For all content types:**

- ✅ Required frontmatter fields present
- ✅ Valid date format (YYYY-MM-DD)
- ✅ Valid language codes (`es` | `en`)
- ✅ Excerpts filled (not using template text)

**For books:**

- ✅ Author exists in `src/content/authors/`
- ✅ Publisher exists in `src/content/publishers/` (if specified)
- ✅ Book cover image exists
- ✅ Synopsis filled (not using template text)
- ✅ Valid score format (1-5 | "fav")

**For tutorials:**

- ✅ Course exists in `src/content/courses/` (if specified)

**Exit codes:**

- `0` - Validation passed (may have warnings)
- `1` - Validation failed (has errors)

---

## 📋 Content Structure Reference

### Book Frontmatter

```yaml
---
title: "Book Title"
post_slug: "book-slug"
date: 2025-01-01
excerpt: "Brief summary..."
language: "es"
i18n: "translated-slug" # Optional: slug of translation
synopsis: "Full synopsis..."
score: 5 # 1-5 or "fav"
pages: 300
isbn: "9781234567890"
author: "author-slug"
publisher: "publisher-slug"
buy:
  - type: "paper"
    link: "https://amazon.es/..."
  - type: "ebook"
    link: "https://amazon.es/..."
book_card: "https://megustaleer.com/..." # Optional
genres: ["ficcion", "terror", "suspense"]
challenges: ["reto-lectura-2017"] # Optional
categories: ["libros", "resenas"]
cover: "/images/defaults/book-default-es.jpg" # Listing/social image (horizontal 16:9)
book_cover: "/images/books/book-slug.jpg" # Physical book cover (vertical 2:3, detail page only)
---
```

### Post Frontmatter

```yaml
---
title: "Post Title"
post_slug: "post-slug"
date: 2025-01-01
excerpt: "Brief summary..."
language: "es"
i18n: "translated-slug" # Optional
categories: ["publicaciones"]
cover: "/images/defaults/post-default-es.jpg"
---
```

### Tutorial Frontmatter

```yaml
---
title: "Tutorial Title"
post_slug: "tutorial-slug"
date: 2025-01-01
excerpt: "Brief summary..."
language: "es"
i18n: "translated-slug" # Optional
courses: ["course-slug"] # Optional: link to course
categories: ["tutoriales"]
cover: "/images/defaults/tutorial-default-es.jpg"
---
```

---

## 🚀 Quick Start Guide

### 1. Create Your First Book

```bash
# Start interactive wizard
bun run new:book -- --interactive

# Follow the prompts:
# - Enter book title
# - Enter author slug (e.g., "stephen-king")
# - Choose language (es/en)
# - Add ISBN, pages, etc. (optional)
```

### 2. Fill in the Content

The script creates a template file with placeholders. Edit the file:

1. Replace "Breve resumen..." with actual excerpt
2. Replace "Sinopsis completa..." with actual synopsis
3. Write your review in the content section
4. Add the physical book cover image to `src/assets/books/{slug}.jpg`
5. Verify `cover` uses the default listing image (`/images/defaults/book-default-{lang}.jpg`)
6. Regenerate image imports: `bun run generate:images`

### 3. Validate Your Content

```bash
# Check for errors
bun run validate:books

# Fix any errors or warnings
# Then validate again
```

### 4. Build and Preview

```bash
# Build the site
bun run build

# Preview locally
bun run preview
```

---

## 🎯 Best Practices

### Using Auto-Creation Effectively

**DO:**

- ✅ Use **natural names** (e.g., "Stephen King", not "stephen-king")
- ✅ Let the script generate slugs automatically
- ✅ Review auto-created entities and add more details later
- ✅ Use interactive mode for better UX and prompts
- ✅ Check the output to see what was created vs. found

**DON'T:**

- ❌ Don't manually create slugs in names (e.g., "stephen-king-es")
- ❌ Don't worry about exact slug matching - search is smart
- ❌ Don't create entities manually unless adding extra metadata

**Time Savings:**
Creating a book with auto-creation:

- **Before**: ~15 minutes (create author, publisher, genres, categories, then book)
- **After**: ~2 minutes (just run script with book details)

### Slugs

- **Auto-generated** from title using `slugify()`
- **Lowercase**, **hyphenated**, **no special characters**
- **Consistent** with filename (e.g., `book-title.mdx` → `book-title`)

### Dates

- Always use **YYYY-MM-DD** format
- Use publication date, not creation date
- Keep consistent across translations

### Excerpts & Synopses

- **Excerpt**: 1-2 sentences, appears in lists
- **Synopsis**: 1-3 paragraphs, appears on detail page
- Avoid spoilers in both
- Make them engaging and informative

### Images

**Books have TWO distinct cover images:**

- **`cover`**: Listing/social image (horizontal 16:9) - Appears in:

  - `/es/libros` (books listing)
  - `/es/publicaciones` (posts listing)
  - Social media cards (Open Graph)
  - Always use: `/images/defaults/book-default-es.jpg` or `/images/defaults/book-default-en.jpg`

- **`book_cover`**: Physical book cover (vertical 2:3) - Appears ONLY in:
  - Book detail page sidebar (left of rating)
  - Path format in frontmatter: `/images/books/{slug}.jpg`
  - **Actual file location**: `src/assets/books/{slug}.jpg`

**Posts and Tutorials have ONE cover image:**

- **`cover`**: Listing/social image (horizontal 16:9)
- **Post covers**:
  - Path in frontmatter: `/images/posts/{slug}.jpg`
  - Actual file: `src/assets/posts/{slug}.jpg`
  - Optional, defaults to `/images/defaults/post-default-{lang}.jpg`
- **Tutorial covers**:
  - Path in frontmatter: `/images/tutorials/{slug}.jpg`
  - Actual file: `src/assets/tutorials/{slug}.jpg`
  - Optional, defaults to `/images/defaults/tutorial-default.jpg`

**Adding New Images:**

```bash
# 1. Place image in correct directory
cp new-book-cover.jpg src/assets/books/{slug}.jpg

# 2. Regenerate image imports (auto-detects all images)
bun run generate:images

# 3. Build (Astro optimizes to WebP automatically)
bun run build
```

**Important:**

- Use **JPEG** for photos (recommended)
- Images are automatically converted to **WebP** during build
- Recommended size: **1200x630px** for social cards
- Filename must match slug: `el-hobbit.mdx` → `el-hobbit.jpg`

### Translations

- Use `i18n` field to link translations
- Both files must reference each other
- Keep slugs different but recognizable
- Example:
  - ES: `apocalipsis-stephen-king.mdx` (i18n: "the-stand-stephen-king")
  - EN: `the-stand-stephen-king.mdx` (i18n: "apocalipsis-stephen-king")

---

## 🐛 Troubleshooting

### Entity auto-creation

**The scripts now auto-create missing entities!** You don't need to manually create author, publisher, genre, category, or course files anymore. Just provide the names, and the scripts will:

1. **Search** for existing entities by name (case-insensitive)
2. **Use existing** entity if found
3. **Create new** entity if not found
4. **Report** what was created vs. found

Example output:

```
🔍 Processing entities...

   ℹ️  Author found: Stephen King (stephen-king-es)
   ✨ Created publisher: New Publisher (new-publisher)
   ℹ️  Genre found: Terror (terror)
   ✨ Created genre: Suspense Psicológico (suspense-psicologico)
```

### "Author not found" warning (legacy - now auto-created!)

If you're using an older version or need to manually create an author, create the file in `src/content/authors/{slug}-{lang}.mdx`:

```mdx
---
name: "Stephen King"
author_slug: "stephen-king"
language: "es"
gender: "male"
birth_year: 1947
nationality: "American"
picture: "/images/authors/stephen-king.jpg"
website: "https://stephenking.com"
---

Biografía del autor...
```

### "Publisher not found" warning (legacy - now auto-created!)

If needed, create publisher file in `src/content/publishers/{slug}.json`:

```json
{
  "name": "Plaza & Janés",
  "publisher_slug": "plaza-janes",
  "language": "es",
  "description": "Editorial española de narrativa...",
  "website": "https://www.penguinlibros.com/es/editorial/plaza-janes",
  "country": "Spain"
}
```

### "File already exists" error

**Solution**: The script prevents overwriting. Either:

- Delete the existing file (if it's a mistake)
- Use a different title (generates different slug)
- Manually edit the existing file

### "Invalid date format" error

**Solution**: Use `YYYY-MM-DD` format:

- ✅ Good: `2025-01-15`
- ❌ Bad: `15/01/2025`, `Jan 15, 2025`, `2025-1-15`

---

## 📚 Additional Resources

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [MDX Documentation](https://mdxjs.com/)
- [Project Documentation](/docs/)
- [Content Schema Definitions](/src/content/config.ts)

---

**Need help?** Check the script source code in `/scripts/` for detailed inline documentation.
