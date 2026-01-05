# Internationalization (i18n) System

Technical documentation for the website's internationalization system.

## Overview

The i18n system is built on a **centralized configuration** approach where:

- Languages are defined once in `src/config/languages.ts`
- TypeScript types are auto-generated
- Schema validators are created dynamically
- URL segments are managed centrally
- Scaffolding script automates file/folder creation

**Adding a new language:** ~10-15 minutes with `bun run new:language`

## Architecture

### Core Components

```
src/
├── config/
│   ├── languages.ts          # Central language config (SOURCE OF TRUTH)
│   ├── routeSegments.ts       # Backwards compatibility proxy
│   └── navigation.ts          # Navigation with language support
├── locales/
│   ├── {lang}/common.json    # Translations per language
│   └── index.ts              # Translation utilities (t(), getTranslations())
├── schemas/
│   └── blog.ts               # Dynamic language validation
├── types/
│   └── content.ts            # Re-exports auto-generated types
├── pages/
│   └── {lang}/               # Static pages per language
└── scripts/
    ├── new-language.ts       # Scaffolding script
    └── validate-languages.ts # Validation script
```

### Data Flow

```
Language Config (languages.ts)
    ↓
Auto-generated Types (LanguageKey)
    ↓
Schema Validators (Zod enums)
    ↓
Translation Loader (dynamic imports)
    ↓
Components & Pages
```

## Language Configuration

### Structure

```typescript
// src/config/languages.ts
export interface LanguageConfig {
  code: string;              // ISO 639-1 code (2 letters)
  label: string;             // Native name
  isDefault: boolean;        // Fallback language
  urlSegments: {            // Localized URL segments
    books: string;
    tutorials: string;
    // ... all content types
  };
}

const LANGUAGE_CONFIG = {
  es: { ... },
  en: { ... },
} as const satisfies Record<string, LanguageConfig>;

// Auto-generated type
export type LanguageKey = keyof typeof LANGUAGE_CONFIG;
```

### Key Functions

```typescript
// Get all language codes
getLanguageCodes(): LanguageKey[]

// Get config for a language
getLanguageConfig(lang: LanguageKey): LanguageConfig

// Get default language
getDefaultLanguage(): LanguageConfig

// Check if language is valid
isValidLanguage(lang: string): lang is LanguageKey

// Get URL segment
getUrlSegment(lang: LanguageKey, key: string): string
```

## Translation System

### File Structure

```json
// src/locales/{lang}/common.json
{
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "pages": {
    "home": "Home",
    "books": "Books"
  },
  "search": {
    "placeholder": "Search...",
    "noResults": "No results for {{query}}"
  }
}
```

### Usage

```typescript
import { t, getTranslations } from "@/locales";

// Simple translation
t("en", "nav.home"); // => "Home"

// With parameters
t("en", "search.noResults", { query: "test" });
// => "No results for test"

// Get all translations
const trans = getTranslations("en");
```

### Dynamic Loading

Translations are loaded dynamically using Vite's `import.meta.glob`:

```typescript
const translationsModules = import.meta.glob("./**/common.json", { eager: true });

// Auto-loads all configured languages
// Warns if language config exists but translation file doesn't
```

## Schema Validation

### Dynamic Language Enum

```typescript
// src/schemas/blog.ts
import { getLanguageCodes } from "@/config/languages";

function createLanguageEnum() {
  const languages = getLanguageCodes();
  return languages.length === 1 ? z.literal(languages[0]) : z.enum(languages as [string, string, ...string[]]);
}

const languageSchema = createLanguageEnum();

// Use in schemas
export const booksSchema = z.object({
  language: languageSchema, // Validates any configured language
  // ...
});
```

**Benefits:**

- No manual enum updates
- Compile-time and runtime validation
- Works with any number of languages

## Routing

### URL Structure

```
/{lang}/{content-type}/{slug}
/{lang}/{content-type}/page/{num}
/{lang}/{taxonomy}/{slug}
/{lang}/{static-page}
```

**Examples:**

```
/es/libros/1984                    # Spanish book
/en/books/1984                     # English book
/es/libros/pagina/2                # Spanish pagination
/fr/livres/page/2                  # French pagination (if added)
/es/autores/stephen-king           # Spanish author
/en/about                          # Static page
```

### Segment Resolution

```typescript
import { getUrlSegment } from "@/config/languages";

// Build localized URL
const bookSegment = getUrlSegment(lang, "books");
const pageSegment = getUrlSegment(lang, "page");
const url = `/${lang}/${bookSegment}/${pageSegment}/${num}`;
```

## Navigation System

### Content Availability

Navigation items are filtered based on:

1. **Visibility config** (`visibleIn`)
2. **Content existence** (checks collections)

```typescript
// Static pages (always available)
const STATIC_PAGES = {
  home: getLanguageCodes(), // All languages
  about: getLanguageCodes(), // All languages
};

// Dynamic content (checks at runtime)
await hasContentInLanguage("books", "en"); // true if books exist in EN
await hasContentInLanguage("posts", "fr"); // false if no French posts
```

### Usage

```typescript
import { getMenuItems, getFooterItems } from "@/config/navigation";

// Menu items (all configured items)
const menuItems = getMenuItems("en");

// Footer items (only sections with content)
const footerItems = await getFooterItems("en");
```

## Type Safety

### Auto-Generated Types

```typescript
// ✅ BEFORE (manual)
export type LanguageKey = "en" | "es"; // Had to update manually

// ✅ AFTER (automatic)
export type { LanguageKey } from "@/config/languages";
// Auto-includes any language in LANGUAGE_CONFIG
```

### Type Inference

```typescript
import type { LanguageKey } from "@/types";

// TypeScript knows all valid languages
function buildUrl(lang: LanguageKey, slug: string) {
  // Autocomplete works for lang parameter
  // Only accepts configured languages
}

buildUrl("en", "test"); // ✅ OK
buildUrl("es", "test"); // ✅ OK
buildUrl("fr", "test"); // ❌ Error (unless FR configured)
```

## Testing

### Unit Tests

Tests automatically adapt to configured languages:

```typescript
import { getLanguageCodes } from "@/config/languages";

test("works for all languages", () => {
  const languages = getLanguageCodes();

  for (const lang of languages) {
    const result = myFunction(lang);
    expect(result).toBeDefined();
  }
});
```

### Validation Script

```bash
bun run validate:languages
```

Checks:

- Translation files exist
- Static pages exist
- Content folders present (optional)

## Performance

### Build Time

- Language config loaded once at build
- Types generated at compile time
- Zero runtime overhead for type checking

### Runtime

- Translations loaded via static imports (bundled)
- URL segments resolved from pre-built config object
- No database queries or file reads

## Migration Guide

### From Old System

**Before:**

```typescript
// Had to update in multiple places:
// 1. src/types/content.ts
export type LanguageKey = "en" | "es" | "fr";

// 2. src/config/routeSegments.ts
export const ROUTE_SEGMENTS = {
  books: { en: "books", es: "libros", fr: "livres" },
  // ...
};

// 3. src/schemas/blog.ts
language: z.enum(["es", "en", "fr"]),

// 4. src/locales/index.ts
import fr from "./fr/common.json";
const translations = { es, en, fr };
```

**After:**

```typescript
// Single update in languages.ts
const LANGUAGE_CONFIG = {
  es: {
    /* config */
  },
  en: {
    /* config */
  },
  fr: {
    /* config */
  }, // Just add this!
};
// Everything else auto-updates
```

## Best Practices

### 1. Always Use Central Config

```typescript
// ❌ BAD
const languages = ["es", "en"];

// ✅ GOOD
import { getLanguageCodes } from "@/config/languages";
const languages = getLanguageCodes();
```

### 2. Use Type-Safe Language Keys

```typescript
// ❌ BAD
function myFunc(lang: string) { ... }

// ✅ GOOD
import type { LanguageKey } from "@/types";
function myFunc(lang: LanguageKey) { ... }
```

### 3. Dynamic URL Segments

```typescript
// ❌ BAD
const url = lang === "es" ? "/libros" : "/books";

// ✅ GOOD
import { getUrlSegment } from "@/config/languages";
const url = `/${getUrlSegment(lang, "books")}`;
```

### 4. Validate Early

Run validation after any language changes:

```bash
bun run validate:languages
bun run test:unit
```

## Backwards Compatibility

### routeSegments.ts Proxy

The old `routeSegments.ts` API is maintained for compatibility:

```typescript
// Still works (proxies to new system)
import { getRouteSegment } from "@/config/routeSegments";
getRouteSegment("books", "es"); // => "libros"

// New API (recommended)
import { getUrlSegment } from "@/config/languages";
getUrlSegment("es", "books"); // => "libros"
```

**Note:** Parameters are swapped (lang comes first in new API).

## Future Enhancements

Potential improvements:

1. **Content folder auto-creation**

   - Script to scaffold all folders for new language

2. **Translation validation**

   - Check that all keys exist in all languages
   - Warn about missing translations

3. **Language detection**

   - Browser language detection
   - Automatic redirect to preferred language

4. **Pluralization support**

   - `t("items.count", { count: 5 })` => "5 items" or "5 éléments"

5. **Date/number formatting**
   - Locale-aware formatting
   - Currency symbols

## Troubleshooting

### TypeScript not recognizing new language

**Problem:** Added language but TS still complains.

**Solution:** Restart TS server (Cmd+Shift+P → "Restart TS Server")

### Translation not loading

**Problem:** Translation file exists but not loading.

**Solution:**

1. Check file is at `src/locales/{lang}/common.json`
2. Check console for warnings
3. Rebuild: `bun run build`

### URL segments not working

**Problem:** 404 errors for localized URLs.

**Solution:**

1. Check language config has all required segments
2. Verify `urlSegments` object is complete
3. Check static pages exist

## See Also

- [Adding Languages Guide](./ADDING_LANGUAGES.md) - Step-by-step guide
- [Development Guidelines](./DEVELOPMENT_GUIDELINES.md) - General dev practices
- [Routing Documentation](./ROUTING.md) - URL structure and routing
