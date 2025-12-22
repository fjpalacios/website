export type Theme = "dark" | "light";

export const THEME_KEY = "theme";
export const DEFAULT_THEME: Theme = "dark";

export function getTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.body.classList.contains("dark") ? "dark" : "light";
}

export function invertTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

export function saveTheme(theme: Theme): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(THEME_KEY, theme);
  }
}

export function getSavedTheme(): Theme {
  if (typeof localStorage !== "undefined") {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return (savedTheme as Theme) || DEFAULT_THEME;
  }
  return DEFAULT_THEME;
}

export function updateThemeIcon(): void {
  if (typeof document === "undefined") return;

  const icon = document.querySelector(".theme-switcher__icon");
  if (!icon) return;

  const currentTheme = getTheme();
  // Show sun emoji when in dark mode (clicking will switch to light)
  // Show moon emoji when in light mode (clicking will switch to dark)
  // Using specific emojis for better contrast:
  // - ☀️ sun (yellow) shows well on dark backgrounds
  // - 🌑 new moon (dark) shows well on light backgrounds
  icon.textContent = currentTheme === "dark" ? "☀️" : "🌑";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;

  const oldTheme = invertTheme(theme);

  // Apply to both html and body to prevent FOUC
  document.documentElement.classList.remove(oldTheme);
  document.documentElement.classList.add(theme);

  document.body.classList.remove(oldTheme);
  document.body.classList.add(theme);

  updateThemeIcon();
}

export function switchTheme(): void {
  const currentTheme = getTheme();
  const newTheme = invertTheme(currentTheme);

  applyTheme(newTheme);
  saveTheme(newTheme);
}

export function initTheme(): void {
  const theme = getSavedTheme();

  // Only apply theme if it's not already applied (prevents unnecessary DOM manipulation)
  const currentTheme = getTheme();
  if (currentTheme !== theme) {
    applyTheme(theme);
  } else {
    // Theme is already applied, just update icon
    updateThemeIcon();
  }

  // Save default theme if not already saved
  if (typeof localStorage !== "undefined" && !localStorage.getItem(THEME_KEY)) {
    saveTheme(theme);
  }

  const button = document.getElementById("theme-toggle");
  if (button) {
    button.addEventListener("click", switchTheme);
  }
}
