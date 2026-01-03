/**
 * ESLint Plugin: astro-script-safety
 *
 * Custom ESLint rules for preventing common Astro script pitfalls
 */

import noInlineDefineVars from "./no-inline-define-vars.js";

export default {
  rules: {
    "no-inline-define-vars": noInlineDefineVars,
  },
  configs: {
    recommended: {
      plugins: ["astro-script-safety"],
      rules: {
        "astro-script-safety/no-inline-define-vars": "error",
      },
    },
  },
};
