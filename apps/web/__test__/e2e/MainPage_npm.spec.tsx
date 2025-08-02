import { expect, test } from "@playwright/test";

test("메인 페이지 > npm 검색 탭 > 검색어에 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)만 사용할 수 있습니다.", async ({
  page,
}) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");
  const npmTab = page.getByRole("tab", { name: "🔍 NPM 검색" });
  const githubTab = page.getByRole("tab", { name: "🔍 Github 검색" });
  const externalTab = page.getByRole("tab", { name: "📁 외부파일" });
  await expect(npmTab).toHaveAttribute("aria-selected", "true");
  await expect(githubTab).toHaveAttribute("aria-selected", "false");
  await expect(externalTab).toHaveAttribute("aria-selected", "false");

  // when: npm 검색 탭을 클릭하고 검색어에 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)가 아닌 문자를 입력한다
  await npmTab.click();
  await page.getByPlaceholder("패키지명을 입력해주세요").fill("*react");

  // then: npm 검색 버튼을 클릭하면 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)만 사용할 수 있습니다. 라는 메시지가 표시된다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await expect(
    page.getByText("영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)만 사용할 수 있습니다.")
  ).toBeVisible();

  // when: npm 검색 탭을 클릭하고 검색어에 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)가 포함되는 문자를 입력한다
  await page.getByPlaceholder("패키지명을 입력해주세요").fill("react");

  // then: npm 검색 버튼을 클릭하면 패키지 상세 페이지로 이동한다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await page.waitForURL("/packages/react");
  await expect(page).toHaveURL("/packages/react");
});

test("메인 페이지 > npm 검색 탭 > 존재하지 않는 패키지를 검색하면 404 페이지로 이동한다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");

  const npmTab = page.getByRole("tab", { name: "🔍 NPM 검색" });
  const githubTab = page.getByRole("tab", { name: "🔍 Github 검색" });
  const externalTab = page.getByRole("tab", { name: "📁 외부파일" });
  await expect(npmTab).toHaveAttribute("aria-selected", "true");
  await expect(githubTab).toHaveAttribute("aria-selected", "false");
  await expect(externalTab).toHaveAttribute("aria-selected", "false");

  // when: npm 검색 탭을 클릭하고 존재하지 않는 패키지를 검색한다
  await npmTab.click();
  await page.getByPlaceholder("패키지명을 입력해주세요").fill("aab1bbc2");

  // then: npm 검색 버튼을 클릭하면 404 페이지로 이동한다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await page.waitForURL("/packages/aab1bbc2");
  await expect(page).toHaveURL("/packages/aab1bbc2");
  await expect(page.getByText("NEXT_HTTP_ERROR_FALLBACK;404")).toBeVisible();
});

test("메인 페이지 > npm 검색 탭 > 존재하는 패키지를 검색하면 패키지 상세 페이지로 이동한다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");

  const npmTab = page.getByRole("tab", { name: "🔍 NPM 검색" });
  const githubTab = page.getByRole("tab", { name: "🔍 Github 검색" });
  const externalTab = page.getByRole("tab", { name: "📁 외부파일" });
  await expect(npmTab).toHaveAttribute("aria-selected", "true");
  await expect(githubTab).toHaveAttribute("aria-selected", "false");
  await expect(externalTab).toHaveAttribute("aria-selected", "false");

  // when: npm 검색 탭을 클릭하고 존재하는 패키지를 검색한다
  await npmTab.click();
  await page.getByPlaceholder("패키지명을 입력해주세요").fill("react");

  // then: npm 검색 버튼을 클릭하면 패키지 상세 페이지로 이동한다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await page.waitForURL("/packages/react");
  await expect(page).toHaveURL("/packages/react");

  // then: 패키지 상세 페이지에서 패키지 이름이 표시된다
  await expect(page.getByRole("heading", { name: "react" })).toBeVisible();
});

test("메인 페이지 > npm 검색 탭 > 검색 후 다시 검색 페이지로 이동하면 최근 검색어 목록이 표시된다", async ({
  page,
}) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");

  const npmTab = page.getByRole("tab", { name: "🔍 NPM 검색" });

  // when: npm 검색 탭을 클릭하고 존재하는 패키지를 검색한다
  await npmTab.click();
  await expect(npmTab).toHaveAttribute("aria-selected", "true");
  await page.getByPlaceholder("패키지명을 입력해주세요").fill("react");

  // then: npm 검색 버튼을 클릭하면 패키지 상세 페이지로 이동한다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await page.waitForURL("/packages/react");
  await expect(page).toHaveURL("/packages/react");

  // when: 검색 페이지로 이동한다
  await page.goBack();
  await page.waitForSelector("[role=tablist]");
  await npmTab.click();
  await expect(npmTab).toHaveAttribute("aria-selected", "true");

  // then: Input focus 시 최근 검색어 목록이 표시된다
  await page.getByPlaceholder("패키지명을 입력해주세요").focus();
  await expect(page.getByText("react")).toBeVisible();
});

test("메인 페이지 > npm 검색 탭 > 검색어 입력 시 추천 검색어 목록이 표시된다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");

  const npmTab = page.getByRole("tab", { name: "🔍 NPM 검색" });

  // when: github 검색 탭을 클릭한다.
  await npmTab.click();
  await expect(npmTab).toHaveAttribute("aria-selected", "true");

  // then: 검색어 입력 시 추천 검색어 목록이 표시된다
  await page.getByPlaceholder("패키지명을 입력해주세요").fill("react");
  await page.getByPlaceholder("패키지명을 입력해주세요").focus();
  await expect(page.getByText("react", { exact: true })).toBeVisible();
});
