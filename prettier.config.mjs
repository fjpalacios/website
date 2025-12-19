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
  plugins: ["prettier-plugin-astro"],
  overrides: [{ files: "*.astro", options: { parser: "astro" } }],
};

export default config;
