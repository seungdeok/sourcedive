import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Opt out of parallel tests on CI.
  testDir: "__test__/e2e",
  workers: process.env.CI ? 1 : undefined,
});
