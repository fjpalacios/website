/**
 * Language Configuration System
 *
 * Central source of truth for all language-related configuration.
 * This file defines available languages, URL segments, and provides type-safe utilities.
 *
 * **Benefits:**
 * - Single place to add/remove languages
 * - Auto-generated TypeScript types
 * - Type-safe language operations
 * - Centralized URL segment translations
 *
 * **To add a new language:**
 * 1. Add entry to LANGUAGE_CONFIG below
 * 2. Add translation files in src/locales/{lang}/
 * 3. Create content folders in src/content/ if needed
 * 4. Run validation: npm run validate-languages (when implemented)
 *
 * @module config/languages
 */

/**
 * Language configuration definition
 */
export interface LanguageConfig {
  /** ISO 639-1 language code (2 letters) */
  code: string;
  /** Human-readable language name (native) */
  label: string;
  /** Whether this is the default/fallback language */
  isDefault: boolean;
  /** URL segment translations for this language */
  urlSegments: {
    // Content types
    books: string;
    tutorials: string;
    posts: string;

    // Taxonomies
    authors: string;
    publishers: string;
    genres: string;
    categories: string;
    series: string;
    challenges: string;
    courses: string;

    // Static pages
    about: string;
    contact: string;
    feeds: string;

    // Pagination
    page: string;
  };
}

/**
 * Language configuration registry
 *
 * Add new languages here. The first language with isDefault=true is the fallback.
 */
const LANGUAGE_CONFIG = {
  es: {
    code: "es",
    label: "Español",
    isDefault: true,
    urlSegments: {
      books: "libros",
      tutorials: "tutoriales",
      posts: "publicaciones",
      authors: "autores",
      publishers: "editoriales",
      genres: "generos",
      categories: "categorias",
      series: "series",
      challenges: "retos",
      courses: "cursos",
      about: "acerca-de",
      contact: "contacto",
      feeds: "feeds",
      page: "pagina",
    },
  },
  en: {
    code: "en",
    label: "English",
    isDefault: false,
    urlSegments: {
      books: "books",
      tutorials: "tutorials",
      posts: "posts",
      authors: "authors",
      publishers: "publishers",
      genres: "genres",
      categories: "categories",
      series: "series",
      challenges: "challenges",
      courses: "courses",
      about: "about",
      contact: "contact",
      feeds: "feeds",
      page: "page",
    },
  },
  // To add French:
  // fr: {
  //   code: "fr",
  //   label: "Français",
  //   isDefault: false,
  //   urlSegments: {
  //     books: "livres",
  //     tutorials: "tutoriels",
  //     posts: "articles",
  //     // ... rest of translations
  //   },
  // },
} as const satisfies Record<string, LanguageConfig>;

/**
 * Auto-generated type for language keys
 * This eliminates the need to manually update type definitions
 */
export type LanguageKey = keyof typeof LANGUAGE_CONFIG;

/**
 * Get all available language codes
 * @returns Array of language codes (e.g., ["es", "en"])
 */
export function getLanguageCodes(): LanguageKey[] {
  return Object.keys(LANGUAGE_CONFIG) as LanguageKey[];
}

/**
 * Get configuration for a specific language
 * @param lang - Language code
 * @returns Language configuration object
 * @throws Error if language not found
 */
export function getLanguageConfig(lang: LanguageKey): LanguageConfig {
  const config = LANGUAGE_CONFIG[lang];
  if (!config) {
    throw new Error(`Language "${lang}" not found. Available: ${getLanguageCodes().join(", ")}`);
  }
  return config;
}

/**
 * Get the default language configuration
 * @returns Default language configuration (first with isDefault=true)
 */
export function getDefaultLanguage(): LanguageConfig {
  const defaultLang = Object.values(LANGUAGE_CONFIG).find((config) => config.isDefault);
  if (!defaultLang) {
    throw new Error("No default language configured. Set isDefault=true for one language.");
  }
  return defaultLang;
}

/**
 * Get the default language code
 * @returns Default language code (e.g., "es")
 */
export function getDefaultLanguageCode(): LanguageKey {
  return getDefaultLanguage().code as LanguageKey;
}

/**
 * Check if a language code is valid
 * @param lang - Language code to check
 * @returns true if language exists
 */
export function isValidLanguage(lang: string): lang is LanguageKey {
  return lang in LANGUAGE_CONFIG;
}

/**
 * Get all language configurations as array
 * @returns Array of language configurations
 */
export function getAllLanguages(): LanguageConfig[] {
  return Object.values(LANGUAGE_CONFIG);
}

/**
 * Get URL segment for a specific route in a language
 * @param lang - Language code
 * @param segmentKey - Route segment key (e.g., "books", "page")
 * @returns Localized URL segment
 * @throws Error if segment not found
 *
 * @example
 * getUrlSegment("es", "books") // => "libros"
 * getUrlSegment("en", "books") // => "books"
 */
export function getUrlSegment(lang: LanguageKey, segmentKey: keyof LanguageConfig["urlSegments"]): string {
  const config = getLanguageConfig(lang);
  const segment = config.urlSegments[segmentKey];

  if (!segment) {
    throw new Error(
      `Route segment not found for key "${segmentKey}" and language "${lang}". ` +
        `Available keys: ${Object.keys(config.urlSegments).join(", ")}`,
    );
  }

  return segment;
}

/**
 * Get all URL segments for a language
 * @param lang - Language code
 * @returns Object with all URL segments for the language
 */
export function getAllUrlSegments(lang: LanguageKey): LanguageConfig["urlSegments"] {
  const config = getLanguageConfig(lang);
  return config.urlSegments;
}

// Export the configuration for direct access (read-only)
export { LANGUAGE_CONFIG };
