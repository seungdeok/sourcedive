import { expect, test } from "@playwright/test";

test("should navigate to the about page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page).toHaveURL("http://localhost:3000");
  await expect(page.locator("h1")).toContainText("Source Dive");
});
