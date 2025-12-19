import {
  THEME_KEY,
  DEFAULT_THEME,
  getTheme,
  invertTheme,
  saveTheme,
  getSavedTheme,
  applyTheme,
  switchTheme,
  initTheme,
} from "@scripts/theme";
import { describe, it, expect, beforeEach } from "vitest";

describe("Theme utilities", () => {
  beforeEach(() => {
    // Clear localStorage and reset DOM
    localStorage.clear();
    document.body.className = "";
  });

  describe("getTheme", () => {
    it("should return 'dark' when body has dark class", () => {
      document.body.classList.add("dark");
      expect(getTheme()).toBe("dark");
    });

    it("should return 'light' when body has light class", () => {
      document.body.classList.add("light");
      expect(getTheme()).toBe("light");
    });

    it("should return 'light' when body has no theme class", () => {
      expect(getTheme()).toBe("light");
    });
  });

  describe("invertTheme", () => {
    it("should invert dark to light", () => {
      expect(invertTheme("dark")).toBe("light");
    });

    it("should invert light to dark", () => {
      expect(invertTheme("light")).toBe("dark");
    });
  });

  describe("saveTheme", () => {
    it("should save theme to localStorage", () => {
      saveTheme("dark");
      expect(localStorage.getItem(THEME_KEY)).toBe("dark");
    });

    it("should update theme in localStorage", () => {
      saveTheme("dark");
      saveTheme("light");
      expect(localStorage.getItem(THEME_KEY)).toBe("light");
    });
  });

  describe("getSavedTheme", () => {
    it("should return saved theme from localStorage", () => {
      localStorage.setItem(THEME_KEY, "light");
      expect(getSavedTheme()).toBe("light");
    });

    it("should return default theme when nothing is saved", () => {
      expect(getSavedTheme()).toBe(DEFAULT_THEME);
    });
  });

  describe("applyTheme", () => {
    it("should apply dark theme to body", () => {
      applyTheme("dark");
      expect(document.body.classList.contains("dark")).toBe(true);
      expect(document.body.classList.contains("light")).toBe(false);
    });

    it("should apply light theme to body", () => {
      applyTheme("light");
      expect(document.body.classList.contains("light")).toBe(true);
      expect(document.body.classList.contains("dark")).toBe(false);
    });

    it("should remove old theme when applying new theme", () => {
      document.body.classList.add("dark");
      applyTheme("light");
      expect(document.body.classList.contains("dark")).toBe(false);
      expect(document.body.classList.contains("light")).toBe(true);
    });
  });

  describe("switchTheme", () => {
    it("should switch from dark to light", () => {
      document.body.classList.add("dark");
      switchTheme();
      expect(document.body.classList.contains("light")).toBe(true);
      expect(localStorage.getItem(THEME_KEY)).toBe("light");
    });

    it("should switch from light to dark", () => {
      document.body.classList.add("light");
      switchTheme();
      expect(document.body.classList.contains("dark")).toBe(true);
      expect(localStorage.getItem(THEME_KEY)).toBe("dark");
    });
  });

  describe("initTheme", () => {
    it("should initialize theme from localStorage", () => {
      localStorage.setItem(THEME_KEY, "light");
      const selector = document.createElement("input");
      selector.type = "checkbox";
      selector.id = "selector";
      document.body.appendChild(selector);

      initTheme();

      expect(document.body.classList.contains("light")).toBe(true);
      expect(selector.checked).toBe(false);

      document.body.removeChild(selector);
    });

    it("should initialize with default theme when no saved theme exists", () => {
      const selector = document.createElement("input");
      selector.type = "checkbox";
      selector.id = "selector";
      document.body.appendChild(selector);

      initTheme();

      expect(document.body.classList.contains(DEFAULT_THEME)).toBe(true);
      expect(selector.checked).toBe(DEFAULT_THEME === "dark");

      document.body.removeChild(selector);
    });

    it("should work when selector element doesn't exist", () => {
      localStorage.setItem(THEME_KEY, "light");

      // Should not throw
      expect(() => initTheme()).not.toThrow();
      expect(document.body.classList.contains("light")).toBe(true);
    });

    it("should attach click event listener to selector", () => {
      localStorage.setItem(THEME_KEY, "dark");
      const selector = document.createElement("input");
      selector.type = "checkbox";
      selector.id = "selector";
      document.body.appendChild(selector);

      initTheme();

      // Simulate click
      selector.click();

      // Theme should have switched
      expect(document.body.classList.contains("light")).toBe(true);
      expect(localStorage.getItem(THEME_KEY)).toBe("light");

      document.body.removeChild(selector);
    });
  });
});
