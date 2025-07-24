import { expect, test } from "@playwright/test";

test("메인 페이지 > 메인 페이지에 접속하면 'Source Dive' 헤더가 보인다", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/");
  await expect(page.locator("h1")).toContainText("Source Dive");
});

test("메인 페이지 > 탭을 클릭하면 해당 섹션이 표시된다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");

  await page.waitForSelector("[role=tablist]");

  const searchTab = page.getByRole("tab", { name: "🔍 검색" });
  const uploadTab = page.getByRole("tab", { name: "📁 업로드" });
  await expect(searchTab).toHaveAttribute("aria-selected", "true");
  await expect(uploadTab).toHaveAttribute("aria-selected", "false");

  // when: 검색 탭을 클릭한다
  await searchTab.click();

  // then: 검색 탭이 표시된다
  await expect(uploadTab).toHaveAttribute("aria-selected", "false");
  await expect(searchTab).toHaveAttribute("aria-selected", "true");

  // when: 업로드 탭을 클릭한다
  await uploadTab.click();

  // then: 업로드 탭이 표시된다
  await expect(uploadTab).toHaveAttribute("aria-selected", "true");
  await expect(searchTab).toHaveAttribute("aria-selected", "false");
});

test("메인 페이지 > 검색어에 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)만 사용할 수 있습니다.", async ({
  page,
}) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");

  const searchTab = page.getByRole("tab", { name: "🔍 검색" });
  const uploadTab = page.getByRole("tab", { name: "📁 업로드" });
  await expect(searchTab).toHaveAttribute("aria-selected", "true");
  await expect(uploadTab).toHaveAttribute("aria-selected", "false");

  // when: 검색 탭을 클릭하고 검색어에 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)가 아닌 문자를 입력한다
  await searchTab.click();
  await page.getByPlaceholder("패키지명을 입력해주세요").fill("*react");

  // then: 검색 버튼을 클릭하면 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)만 사용할 수 있습니다. 라는 메시지가 표시된다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await expect(
    page.getByText("영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)만 사용할 수 있습니다.")
  ).toBeVisible();

  // when: 검색 탭을 클릭하고 검색어에 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)가 포함되는 문자를 입력한다
  await page.getByPlaceholder("패키지명을 입력해주세요").fill("react");

  // then: 검색 버튼을 클릭하면 패키지 상세 페이지로 이동한다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await expect(page).toHaveURL("/packages/react");
});
