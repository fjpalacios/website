/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: true,
  trailingComma: "all",
  singleQuote: false,
  arrowParens: "always",
  jsxSingleQuote: false,
  printWidth: 120,
  tailwindStylesheet: "./src/styles/global.css",
  tailwindFunctions: ["class", "class:list"],
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [{ files: "*.astro", options: { parser: "astro" } }],
};

export default config;
