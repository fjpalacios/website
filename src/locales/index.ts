import en from "./en/common.json";
import es from "./es/common.json";

type Translations = typeof es;

const translations: Record<string, Translations> = {
  es,
  en,
};

export function getTranslations(lang: string): Translations {
  return translations[lang] || translations.es;
}

export function t(lang: string, key: string): string {
  const trans = getTranslations(lang);
  const keys = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = trans;

  for (const k of keys) {
    if (value && typeof value === "object") {
      value = value[k];
    } else {
      return key; // Path not found, return original key
    }
  }

  return typeof value === "string" ? value : key;
}
