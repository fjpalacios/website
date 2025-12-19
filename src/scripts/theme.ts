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

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;

  const oldTheme = invertTheme(theme);
  document.body.classList.remove(oldTheme);
  document.body.classList.add(theme);
}

export function switchTheme(): void {
  const currentTheme = getTheme();
  const newTheme = invertTheme(currentTheme);

  applyTheme(newTheme);
  saveTheme(newTheme);
}

export function initTheme(): void {
  const theme = getSavedTheme();
  applyTheme(theme);

  // Save default theme if not already saved
  if (typeof localStorage !== "undefined" && !localStorage.getItem(THEME_KEY)) {
    saveTheme(theme);
  }

  const selector = document.getElementById("selector") as HTMLInputElement;
  if (selector) {
    selector.checked = theme === "dark";
    selector.addEventListener("click", switchTheme);
  }
}
