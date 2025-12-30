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

  // Icons are toggled via CSS based on html[data-theme] attribute
  // No JavaScript manipulation needed, but we keep this function
  // for potential future icon updates or animations
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;

  const oldTheme = invertTheme(theme);

  // Apply to both html and body to prevent FOUC
  document.documentElement.classList.remove(oldTheme);
  document.documentElement.classList.add(theme);

  // Update data-theme attribute on html for CSS selectors
  document.documentElement.setAttribute("data-theme", theme);

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

  // Check if theme class is explicitly set on body
  const hasThemeClass = document.body.classList.contains("dark") || document.body.classList.contains("light");

  // Apply theme if not explicitly set, or if it differs from saved theme
  if (!hasThemeClass || getTheme() !== theme) {
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
