import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Opt out of parallel tests on CI.
  use: {
    baseURL: "http://localhost:3000",
  },
  testDir: "__test__/e2e",
  workers: process.env.CI ? 1 : undefined,
  webServer: {
    command: "pnpm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 120000,
  },
});
