import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",

  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  webServer: {
    command: "node scripts/serve-static-export.mjs",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 120_000,
  },

  projects: [
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        viewport: {
          width: 390,
          height: 844,
        },
      },
    },
    {
      name: "tablet",
      use: {
        ...devices["iPad Mini"],
        viewport: {
          width: 768,
          height: 1024,
        },
      },
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: {
          width: 1440,
          height: 900,
        },
      },
    },
  ],
});
