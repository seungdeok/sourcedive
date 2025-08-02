import { expect, test } from "@playwright/test";

test("메인 페이지 > 외부 파일 > 외부 파일 사용 가이드가 표시된다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");
  const npmTab = page.getByRole("tab", { name: "🔍 NPM 검색" });
  const githubTab = page.getByRole("tab", { name: "🔍 Github 검색" });
  const externalTab = page.getByRole("tab", { name: "📁 외부파일" });
  await expect(npmTab).toHaveAttribute("aria-selected", "true");
  await expect(githubTab).toHaveAttribute("aria-selected", "false");
  await expect(externalTab).toHaveAttribute("aria-selected", "false");

  // when: 외부파일 탭을 클릭한다
  await externalTab.click();

  // then: CLI 가이드가(제목, 링크) 표시된다
  await expect(page.getByText("외부 파일 사용 가이드")).toBeVisible();
  await expect(page.getByText("CLI 사용 가이드")).toBeVisible();
  await expect(page.getByText("npx sourcedive -o {outputDirectory} -f {entryFile}")).toBeVisible();
  await expect(page.getByRole("link", { name: "문서 보기" })).toBeVisible();
});
