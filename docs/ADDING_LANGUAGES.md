# Adding a New Language

Quick guide to add a new language to the site.

---

## Automated Setup (Recommended)

Use the scaffolding script:

```bash
# Basic
bun run new:language <code> "<label>"

# With content folders
bun run new:language <code> "<label>" --with-content

# Set as default
bun run new:language <code> "<label>" --default
```

**Examples:**

```bash
bun run new:language fr "Français"
bun run new:language pt "Português" --with-content
bun run new:language ca "Català" --default
```

**What it does:**

- ✅ Creates translation file (from English template)
- ✅ Creates static pages with language code
- ✅ Creates content folders (optional)
- ✅ Shows manual steps needed

**Time:** ~15 minutes total

---

## Manual Steps After Script

### 1. Add Language Config

Edit `src/config/languages.ts`:

```typescript
export const LANGUAGE_CONFIG = {
  es: {
    /* ... */
  },
  en: {
    /* ... */
  },
  fr: {
    // Add your language
    code: "fr",
    label: "Français",
    isDefault: false,
    urlSegments: {
      posts: "publications",
      books: "livres",
      // ... translate all segments
    },
  },
} as const satisfies Record<string, LanguageConfig>;
```

### 2. Translate Strings

Edit `src/locales/fr/common.json`:

```json
{
  "nav": {
    "home": "Accueil",
    "about": "À propos"
  }
}
```

The script creates this file from English. Translate ~50-80 strings.

### 3. Validate Setup

```bash
bun run validate:languages
```

Checks:

- Translation files exist
- All keys present
- No missing translations

---

## That's It!

Build and test:

```bash
bun run build
bun run dev
```

Visit `http://localhost:4321/fr/` to see your new language.

---

## Technical Details

The system auto-generates:

- TypeScript types (`LanguageKey`)
- Schema validators (Zod enums)
- Dynamic imports for translations

All from the single config in `languages.ts`. No manual updates needed in schemas, types, or imports.
