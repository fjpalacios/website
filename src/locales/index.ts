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
