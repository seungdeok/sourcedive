import test, { expect } from "@playwright/test";

test("메인 페이지 > 메인 페이지에 접속하면 'Source Dive' 헤더가 보인다", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/");
  await expect(page.locator("h1")).toContainText("Source Dive");
});

test("메인 페이지 > 탭을 클릭하면 해당 섹션이 표시된다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");
  const npmTab = page.getByRole("tab", { name: "🔍 NPM 검색" });
  const githubTab = page.getByRole("tab", { name: "🔍 Github 검색" });
  const externalTab = page.getByRole("tab", { name: "📁 외부파일" });
  await expect(npmTab).toHaveAttribute("aria-selected", "true");
  await expect(githubTab).toHaveAttribute("aria-selected", "false");
  await expect(externalTab).toHaveAttribute("aria-selected", "false");

  // when: npm 검색 탭을 클릭한다
  await npmTab.click();

  // then: npm 검색 탭이 표시된다
  await expect(npmTab).toHaveAttribute("aria-selected", "true");
  await expect(githubTab).toHaveAttribute("aria-selected", "false");
  await expect(externalTab).toHaveAttribute("aria-selected", "false");

  // when: github 검색 탭을 클릭한다
  await githubTab.click();

  // then: github 검색 탭이 표시된다
  await expect(npmTab).toHaveAttribute("aria-selected", "false");
  await expect(githubTab).toHaveAttribute("aria-selected", "true");
  await expect(externalTab).toHaveAttribute("aria-selected", "false");

  // when: 외부파일 탭을 클릭한다
  await externalTab.click();

  // then: 외부파일 탭이 표시된다
  await expect(npmTab).toHaveAttribute("aria-selected", "false");
  await expect(githubTab).toHaveAttribute("aria-selected", "false");
  await expect(externalTab).toHaveAttribute("aria-selected", "true");
});
