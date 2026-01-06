# Adding a New Language

This guide explains how to add a new language to the website.

## Quick Start (Automated)

Use the scaffolding script to automatically create files and folders:

```bash
# Basic (no content folders)
bun run new:language <code> "<label>"

# With content folders
bun run new:language <code> "<label>" --with-content

# Set as default language
bun run new:language <code> "<label>" --default
```

**Examples:**

```bash
bun run new:language fr "Français"
bun run new:language pt "Português" --with-content
bun run new:language ca "Català" --default
```

The script will:

- ✅ Create translation file (copied from English)
- ✅ Create static pages with correct language code
- ✅ Create content folders (if `--with-content` flag)
- ✅ Show instructions for manual steps

**Time required:** ~10-15 minutes after scaffolding

## Quick Start (Manual)

If you prefer manual setup, adding a new language requires approximately **30-60 minutes** and involves these steps:

1. Add language configuration
2. Create translation files
3. Create static pages
4. Validate setup
5. Test and deploy

## Step-by-Step Guide (Automated)

### Using the Scaffolding Script

The easiest way to add a new language is using the `new:language` script:

```bash
bun run new:language fr "Français" --with-content
```

This will automatically:

1. Create `src/locales/fr/common.json` (copied from English as template)
2. Create `src/pages/fr/*.astro` with correct language code
3. Create content folders if `--with-content` flag is used
4. Show you exactly what to do next

After running the script, you only need to:

1. **Add language to config** (5 min)

   Edit `src/config/languages.ts` and add the configuration shown in the script output.

2. **Translate strings** (15-30 min)

   Edit `src/locales/fr/common.json` and translate all UI strings.

3. **Validate** (1 min)

   ```bash
   bun run validate:languages
   ```

4. **Test** (5 min)

   ```bash
   bun run build && bun run preview
   ```

That's it! The script handles all file/folder creation.

### Script Options

```bash
bun run new:language <code> "<label>" [options]
```

**Arguments:**

- `<code>` - ISO 639-1 language code (2 letters): `fr`, `pt`, `ca`, etc.
- `<label>` - Native language name: `"Français"`, `"Português"`, `"Català"`

**Options:**

- `--with-content` - Create content folders for books, posts, tutorials, etc.
- `--default` - Set as the default/fallback language

**Examples:**

```bash
# French without content folders
bun run new:language fr "Français"

# Portuguese with content folders
bun run new:language pt "Português" --with-content

# Catalan as default language
bun run new:language ca "Català" --default --with-content
```

## Step-by-Step Guide (Manual)

### 1. Add Language Configuration

Edit `src/config/languages.ts` and add your language to `LANGUAGE_CONFIG`:

```typescript
const LANGUAGE_CONFIG = {
  es: {
    /* existing */
  },
  en: {
    /* existing */
  },

  // Add your new language here
  fr: {
    code: "fr",
    label: "Français",
    isDefault: false,
    urlSegments: {
      books: "livres",
      tutorials: "tutoriels",
      posts: "articles",
      authors: "auteurs",
      publishers: "editeurs",
      genres: "genres",
      categories: "categories",
      series: "series",
      challenges: "defis",
      courses: "cours",
      about: "a-propos",
      contact: "contact",
      feeds: "flux",
      page: "page",
    },
  },
};
```

**That's it!** TypeScript types and validators are auto-generated from this config.

### 2. Create Translation Files

Create translation file at `src/locales/{lang}/common.json`:

```bash
mkdir -p src/locales/fr
cp src/locales/en/common.json src/locales/fr/common.json
```

Edit `src/locales/fr/common.json` and translate all strings:

```json
{
  "nav": {
    "home": "Accueil",
    "about": "À propos",
    ...
  },
  "pages": {
    "home": "Accueil",
    ...
  }
}
```

### 3. Create Static Pages

Create the static pages folder:

```bash
mkdir -p src/pages/fr
```

Create index page at `src/pages/fr/index.astro`:

```astro
---
import Layout from "@/layouts/Layout.astro";
import { t } from "@/locales";

const lang = "fr";
---

<Layout lang={lang} title={t(lang, "pages.home")}>
  <h1>{t(lang, "pages.home")}</h1>
  <!-- Your content here -->
</Layout>
```

Create other static pages:

- `src/pages/fr/about.astro`
- `src/pages/fr/contact.astro`
- `src/pages/fr/feeds.astro`

Use existing English/Spanish pages as templates.

### 4. Create Content Folders (Optional)

If you plan to add content (books, posts, tutorials), create folders:

```bash
# Content collections
mkdir -p src/content/books/fr
mkdir -p src/content/posts/fr
mkdir -p src/content/tutorials/fr

# Taxonomies
mkdir -p src/content/authors/fr
mkdir -p src/content/categories/fr
mkdir -p src/content/genres/fr
mkdir -p src/content/publishers/fr
mkdir -p src/content/series/fr
mkdir -p src/content/challenges/fr
mkdir -p src/content/courses/fr
```

**Note:** These folders are optional. Create them only when you have content to add.

### 5. Validate Setup

Run the validation script:

```bash
bun run validate:languages
```

This checks:

- ✅ Translation files exist
- ✅ Static pages exist
- ⚠️ Content folders exist (warnings only)

Fix any errors before proceeding.

### 6. Test Locally

Build and test the site:

```bash
bun run build
bun run preview
```

Visit `http://localhost:4321/fr` and verify:

- ✅ Page loads without errors
- ✅ Navigation works
- ✅ Translations display correctly
- ✅ Language switcher includes new language

### 7. Run Tests

```bash
# Unit tests
bun run test:unit

# E2E tests
bun run test:e2e
```

All tests should pass. If not, check console for errors.

### 8. Update Content Availability (Optional)

If you added content in the new language, update the fallback configuration in `src/config/navigation.ts`:

```typescript
const CONTENT_AVAILABILITY_FALLBACK = {
  posts: ["es", "fr"], // Added French
  tutorials: ["es"],
  books: ["es", "en", "fr"], // Added French
  // ...
};
```

This is used for test environments and fallback scenarios.

## What Gets Auto-Generated

When you add a language to `src/config/languages.ts`, the following are automatically handled:

✅ **TypeScript Types**

- `LanguageKey` type includes your language
- Autocomplete works in IDE

✅ **URL Segments**

- All route segments available via `getUrlSegment()`
- No need to update `routeSegments.ts`

✅ **Schema Validation**

- Zod schemas accept your language
- Content validation works automatically

✅ **Navigation**

- Language available in menus/footer (if content exists)
- Language switcher includes new language

## What You Must Do Manually

❌ **Translation Files**

- Create `src/locales/{lang}/common.json`
- Translate all UI strings

❌ **Static Pages**

- Create `src/pages/{lang}/` folder
- Create index, about, contact, feeds pages

❌ **Content** (Optional)

- Create content folders if needed
- Add actual content (books, posts, etc.)

## Troubleshooting

### "Translation file not found" Warning

**Problem:** Language configured but no translation file exists.

**Solution:**

```bash
mkdir -p src/locales/{lang}
cp src/locales/en/common.json src/locales/{lang}/common.json
# Edit and translate
```

### "Missing static pages folder" Error

**Problem:** No `src/pages/{lang}/` folder.

**Solution:**

```bash
mkdir -p src/pages/{lang}
# Copy and adapt existing pages
```

### Build Fails with Type Errors

**Problem:** TypeScript can't find language code.

**Solution:** Restart your IDE/TypeScript server after modifying `languages.ts`.

### Content Not Showing in Navigation

**Problem:** Added content but it doesn't appear in footer.

**Solution:**

1. Ensure content has correct `language` field in frontmatter
2. Update `CONTENT_AVAILABILITY_FALLBACK` in `navigation.ts`
3. Rebuild site

## Example: Adding Portuguese

### Using the Script (Recommended)

```bash
# 1. Run scaffolding script
bun run new:language pt "Português" --with-content

# 2. Add config to src/config/languages.ts (copy from script output)
pt: {
  code: "pt",
  label: "Português",
  isDefault: false,
  urlSegments: {
    books: "livros",
    tutorials: "tutoriais",
    posts: "publicacoes",
    authors: "autores",
    publishers: "editoras",
    genres: "generos",
    categories: "categorias",
    series: "series",
    challenges: "desafios",
    courses: "cursos",
    about: "sobre",
    contact: "contato",
    feeds: "feeds",
    page: "pagina",
  },
}

# 3. Translate src/locales/pt/common.json

# 4. Validate
bun run validate:languages

# 5. Test
bun run build && bun run preview
```

### Manual Setup

Complete example of adding Portuguese (pt) manually:

```typescript
// 1. src/config/languages.ts
pt: {
  code: "pt",
  label: "Português",
  isDefault: false,
  urlSegments: {
    books: "livros",
    tutorials: "tutoriais",
    posts: "publicacoes",
    // ... rest of segments
  },
}

// 2. Create files
// src/locales/pt/common.json
// src/pages/pt/index.astro
// src/pages/pt/about.astro
// (optional) src/content/books/pt/
// (optional) src/content/posts/pt/

// 3. Validate
bun run validate:languages

// 4. Test
bun run build && bun run preview
```

## Migration Notes

This simplified system replaces the old manual approach where you had to:

- ❌ Manually update `LanguageKey` type definition
- ❌ Manually add entries to `ROUTE_SEGMENTS`
- ❌ Manually update schema enums
- ❌ Update multiple config files

Now it's **one config file** + **translation files** + **static pages**.

## Need Help?

- Check validation output: `bun run validate:languages`
- Review existing languages in `src/config/languages.ts`
- Look at existing pages in `src/pages/en/` or `src/pages/es/`
- Check the main docs: `docs/i18n-system.md`
