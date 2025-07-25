import { expect, test } from "@playwright/test";

test("Github Repository 상세 페이지 > 필수 meta 정보를 표시합니다.", async ({ page }) => {
  // given: github repository 상세 페이지에 접속한다
  await page.goto("/github/facebook/react");

  // then: github repository 이름이 표시된다
  await expect(page.getByRole("heading", { name: "facebook/react" })).toBeVisible();

  // then: github 링크가 표시된다
  await expect(page.getByRole("link", { name: "Repository" })).toHaveAttribute(
    "href",
    "https://github.com/facebook/react"
  );

  // then: Owner 정보가 표시된다
  await expect(page.getByTestId("github-repo-owner")).toHaveText("facebook");

  // then: License 정보가 표시된다
  await expect(page.getByTestId("github-repo-license")).toHaveText("MIT");
});
