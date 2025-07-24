import { expect, test } from "@playwright/test";

test("should navigate to the about page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/");
  await expect(page.locator("h1")).toContainText("Source Dive");
});
