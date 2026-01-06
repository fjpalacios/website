import { describe, it, expect } from "vitest";

import { getTranslations, t } from "@/locales";

describe("Locales utilities", () => {
  describe("getTranslations", () => {
    it("should return Spanish translations for 'es'", () => {
      const trans = getTranslations("es");
      expect(trans).toBeDefined();
      expect(trans.title).toBe("Francisco Javier Palacios Pérez");
    });

    it("should return English translations for 'en'", () => {
      const trans = getTranslations("en");
      expect(trans).toBeDefined();
      expect(trans.title).toBe("Francisco Javier Palacios Pérez");
    });

    it("should fallback to Spanish for unknown language", () => {
      const trans = getTranslations("fr");
      expect(trans).toBeDefined();
      expect(trans.title).toBe("Francisco Javier Palacios Pérez");
    });
  });

  describe("t (translation function)", () => {
    it("should return translated string for valid key in Spanish", () => {
      expect(t("es", "title")).toBe("Francisco Javier Palacios Pérez");
      expect(t("es", "subtitle")).toBe("Desarrollador de software");
    });

    it("should return translated string for valid key in English", () => {
      expect(t("en", "title")).toBe("Francisco Javier Palacios Pérez");
      expect(t("en", "subtitle")).toBe("Software Developer");
    });

    it("should return nested translation using dot notation", () => {
      expect(t("es", "pages.home")).toBe("Inicio");
      expect(t("en", "pages.home")).toBe("Home");
    });

    it("should return deeply nested translation", () => {
      expect(t("es", "metaData.description")).toBe(
        "Página web personal de Francisco Javier Palacios Pérez, desarrollador de software de Valencia (España)",
      );
    });

    it("should return key when translation is not found", () => {
      expect(t("es", "nonexistent.key")).toBe("nonexistent.key");
    });

    it("should handle invalid nested keys gracefully", () => {
      expect(t("es", "title.nested.invalid")).toBe("title.nested.invalid");
    });
  });
});
