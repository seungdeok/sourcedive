import { expect, test } from "@playwright/test";

test("랭킹 컴포넌트 > 랭킹 데이터를 표시합니다.", async ({ page }) => {
  // when: 메인 페이지에 접속
  await page.goto("/");

  // then: 랭킹 제목이 표시된다
  await expect(page.getByText("인기 검색어")).toBeVisible();

  // then: Package Rankings 섹션이 표시된다
  await expect(page.getByText("Package Rankings")).toBeVisible();

  await expect(page.getByText("react")).toBeVisible();

  // then: GitHub Rankings 섹션이 표시된다
  await expect(page.getByText("GitHub Rankings")).toBeVisible();
  await expect(page.getByText("microsoft/vscode")).toBeVisible();
});

test("랭킹 컴포넌트 > 랭킹 항목 클릭 시 해당 항목 페이지로 이동합니다.", async ({ page }) => {
  await page.goto("/");

  // when: 패키지 랭킹 항목 클릭
  const packageLink = page.getByRole("link").filter({ hasText: "react" }).first();
  await expect(packageLink).toHaveAttribute("href", "/packages/react");

  // when: GitHub 랭킹 항목 클릭
  const githubLink = page.getByRole("link").filter({ hasText: "microsoft/vscode" });
  await expect(githubLink).toHaveAttribute("href", "/github/microsoft/vscode");
});
