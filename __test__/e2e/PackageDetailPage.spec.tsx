import { expect, test } from "@playwright/test";

test("패키지 상세 페이지 > 필수 meta 정보를 표시합니다.", async ({ page }) => {
  // given: package 상세 페이지에 접속한다
  await page.goto("/packages/react");

  // then: package 이름이 표시된다
  await expect(page.getByRole("heading", { name: "react" })).toBeVisible();

  // then: github 링크가 표시된다
  await expect(page.getByRole("link", { name: "Repository" })).toHaveAttribute(
    "href",
    "https://github.com/facebook/react"
  );

  // then:npm 링크가 표시된다
  await expect(page.getByRole("link", { name: "NPM" })).toHaveAttribute("href", "https://www.npmjs.com/package/react");

  // then: package 버전이 표시된다
  await expect(page.getByTestId("package-version")).toHaveText(/v\d+\.\d+\.\d+/);

  // then: License 정보가 표시된다
  await expect(page.getByTestId("package-license")).toHaveText("MIT");

  // then: Author 정보가 표시된다
  await expect(page.getByTestId("package-author")).toHaveText("react-bot");
});
