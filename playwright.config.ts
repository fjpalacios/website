import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: ["**/responsive.spec.ts", "**/visual-regression.spec.ts", "**/bookshelf.spec.ts"],
    },
    {
      name: "visual-regression",
      use: { ...devices["Desktop Chrome"] },
      testMatch: ["**/visual-regression.spec.ts", "**/bookshelf.spec.ts"],
    },
    {
      name: "mobile-iphone12",
      use: { ...devices["iPhone 12"] },
      testMatch: "**/responsive.spec.ts",
    },
    {
      name: "mobile-iphoneSE",
      use: { ...devices["iPhone SE"] },
      testMatch: "**/responsive.spec.ts",
    },
    {
      name: "tablet-ipad",
      use: { ...devices["iPad (gen 7)"] },
      testMatch: "**/responsive.spec.ts",
    },
    {
      name: "desktop-large",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: "**/responsive.spec.ts",
    },
  ],

  webServer: {
    command: "bun run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
  },
});
