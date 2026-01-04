import en from "./en/common.json";
import es from "./es/common.json";

type Translations = typeof es;

const translations: Record<string, Translations> = {
  es,
  en,
};

/**
 * Gets translations for a given language
 * @param lang - Language code (es/en)
 * @returns Translation object for the specified language, defaults to Spanish if not found
 */
export function getTranslations(lang: string): Translations {
  return translations[lang] || translations.es;
}

/**
 * Translates a key using dot notation for nested keys
 * @param lang - Language code (es/en)
 * @param key - Translation key with dot notation (e.g., "nav.about")
 * @returns Translated string, or original key if translation not found
 * @example
 * t("es", "nav.about") // Returns "Sobre mí"
 * t("en", "nav.about") // Returns "About"
 */
export function t(lang: string, key: string): string {
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

  return typeof value === "string" ? value : key;
}
