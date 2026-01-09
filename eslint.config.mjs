import eslint from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

// Custom rules for Astro script safety
import astroScriptSafety from "./eslint-rules/index.js";

export default tseslint.config(
  {
    ignores: [
      "**/public",
      "**/dist",
      "**/dist/*",
      "**/tests/*",
      "coverage",
      ".astro/*",
      "node_modules/*",
      // Temporary migration scripts (to be removed)
      "scripts/migrate-from-mysql.ts",
      "scripts/migrate-wordpress-content.ts",
      "scripts/generate-redirects.ts",
      "scripts/explore-wp-db.ts",
      "scripts/fix-missing-content.ts",
      "scripts/normalize-book-slugs.ts",
      "scripts/generate-author-bios.ts",
      "scripts/rename-book-images.ts",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.{mjs,cjs,js,ts,astro}"],
    languageOptions: { ecmaVersion: "latest", globals: globals.browser },
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
      "astro-script-safety": astroScriptSafety,
    },
    rules: {
      // Custom Astro script safety rules
      "astro-script-safety/no-inline-define-vars": "error",

      // Unused imports
      "no-unused-vars": "off", // Disable the base rule, redundant with unused-imports plugin
      "@typescript-eslint/no-unused-vars": "off", // Disable the base rule, redundant with unused-imports plugin
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "import/order": [
        "warn",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },
          groups: ["builtin", "external", "sibling", "parent"],
          "newlines-between": "always",
          pathGroupsExcludedImportTypes: ["builtin"],
          pathGroups: [
            {
              group: "external",
              pattern: "@/**",
              position: "after",
            },
          ],
        },
      ],
    },
  },
  // Configuration for Node.js scripts
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: { ...globals.node },
    },
    rules: {
      "no-console": "off", // Allow console in CLI scripts
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_|^e$", // Also ignore 'e' in catch blocks
        },
      ],
    },
  },
);
