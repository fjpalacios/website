import { defineConfig, devices } from "@playwright/test";

const DEV_SERVER_PORT = 4322;
const DEV_SERVER_URL = `http://127.0.0.1:${DEV_SERVER_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: ["**/dev-server-routing.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: DEV_SERVER_URL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "dev-server",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: `bun x astro dev --host 127.0.0.1 --port ${DEV_SERVER_PORT}`,
    url: DEV_SERVER_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
