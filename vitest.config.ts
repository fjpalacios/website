import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    pool: "forks",
    setupFiles: ["./src/__tests__/setup.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/*.config.*", "**/__tests__/archived/**"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "node_modules/",
        "dist/",
        "e2e/",
        "**/*.config.*",
        "**/*.d.ts",
        "**/__tests__/**",
        "**/utils/routes.ts", // Route definitions are tested via E2E, not unit tests
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@content": path.resolve(__dirname, "./src/content"),
      "@locales": path.resolve(__dirname, "./src/locales"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@scripts": path.resolve(__dirname, "./src/scripts"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "astro:content": path.resolve(__dirname, "./src/__mocks__/astro-content.ts"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});
