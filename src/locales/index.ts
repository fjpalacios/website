import { getLanguageCodes, isValidLanguage, getDefaultLanguage } from "@/config/languages";

// Dynamically import translations for all configured languages
const translationsModules = import.meta.glob<{ default: Record<string, unknown> }>("./**/common.json", { eager: true });

// Build translations object from imported modules
const translations: Record<string, Record<string, unknown>> = {};
const languageCodes = getLanguageCodes();

for (const [path, module] of Object.entries(translationsModules)) {
  // Extract language code from path: ./es/common.json -> es
  const match = path.match(/\/([^/]+)\/common\.json$/);
  if (match) {
    const lang = match[1];
    if (isValidLanguage(lang)) {
      translations[lang] = module.default;
    }
  }
}

// Validate that all configured languages have translation files
for (const lang of languageCodes) {
  if (!translations[lang]) {
    console.warn(
      `Warning: Language "${lang}" is configured but has no translation file at src/locales/${lang}/common.json`,
    );
  }
}

type Translations = (typeof translations)[keyof typeof translations];

/**
 * Gets translations for a given language
 * @param lang - Language code (es/en/...)
 * @returns Translation object for the specified language, defaults to default language if not found
 */
export function getTranslations(lang: string): Translations {
  const defaultLang = getDefaultLanguage().code;
  return (translations[lang] as Translations) || (translations[defaultLang] as Translations);
}

/**
 * Translates a key using dot notation for nested keys
 * @param lang - Language code (es/en)
 * @param key - Translation key with dot notation (e.g., "nav.about")
 * @param params - Optional parameters for string interpolation (e.g., { name: "John" })
 * @returns Translated string, or original key if translation not found
 * @example
 * t("es", "nav.about") // Returns "Sobre mí"
 * t("en", "nav.about") // Returns "About"
 * t("en", "badges.course", { name: "Git Basics" }) // Returns "Course: Git Basics"
 */
export function t(lang: string, key: string, params?: Record<string, string>): string {
  const trans = getTranslations(lang);
  const keys = key.split(".");
  let value: Translations | string | Record<string, unknown> = trans;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k] as Translations | string | Record<string, unknown>;
    } else {
      return key; // Path not found, return original key
    }
  }

  let result = typeof value === "string" ? value : key;

  // Apply parameter interpolation if params provided
  if (params && typeof result === "string") {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.replace(new RegExp(`{{${paramKey}}}`, "g"), paramValue);
    });
  }

  return result;
}
