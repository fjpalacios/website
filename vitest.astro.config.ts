import { getViteConfig } from "astro/config";
import { defineConfig } from "vitest/config";

export default defineConfig(
  getViteConfig({
    test: {
      environment: "node",
      globals: true,
      include: ["src/__tests__/**/*.integration.test.ts"],
      pool: "forks",
      setupFiles: ["./src/__tests__/setup.ts"],
    },
  }),
);
