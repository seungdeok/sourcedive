import { expect, test } from "@playwright/test";

test("메인 페이지 > github 검색 탭 > 검색어에 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)만 사용할 수 있습니다.", async ({
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

  // when: github 검색 탭을 클릭하고 검색어에 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)가 아닌 문자를 입력한다
  await githubTab.click();
  await page.getByPlaceholder("repository 이름을 입력해주세요").clear();
  await page.getByPlaceholder("repository 이름을 입력해주세요").fill("*react");

  // then: github 검색 버튼을 클릭하면 owner/repository 형태로 입력해주세요. 라는 메시지가 표시된다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await expect(page.getByText("owner/repository 형태로 입력해주세요.")).toBeVisible();

  // when: github 검색 탭을 클릭하고 검색어에 owner/repository 형태로 입력한다
  await page.getByPlaceholder("repository 이름을 입력해주세요").clear();
  await page.getByPlaceholder("repository 이름을 입력해주세요").fill("seungdeok/sourcedive");

  // then: github 검색 버튼을 클릭하면 패키지 상세 페이지로 이동한다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await expect(page).toHaveURL("/github/seungdeok/sourcedive");
});

test("메인 페이지 > github 검색 탭 > 존재하지 않는 repository를 검색하면 404 페이지로 이동한다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");

  const npmTab = page.getByRole("tab", { name: "🔍 NPM 검색" });
  const githubTab = page.getByRole("tab", { name: "🔍 Github 검색" });
  const externalTab = page.getByRole("tab", { name: "📁 외부파일" });
  await expect(npmTab).toHaveAttribute("aria-selected", "true");
  await expect(githubTab).toHaveAttribute("aria-selected", "false");
  await expect(externalTab).toHaveAttribute("aria-selected", "false");

  // when: github 검색 탭을 클릭하고 존재하지 않는 repository를 검색한다
  await githubTab.click();
  await page.getByPlaceholder("repository 이름을 입력해주세요").fill("seungdeok/test");

  // then: github 검색 버튼을 클릭하면 404 페이지로 이동한다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await expect(page).toHaveURL("/github/seungdeok/test");
  await expect(page.getByText("NEXT_HTTP_ERROR_FALLBACK;404")).toBeVisible();
});

test("메인 페이지 > github 검색 탭 > 존재하는 repository를 검색하면 패키지 상세 페이지로 이동한다", async ({
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

  // when: github 검색 탭을 클릭하고 존재하는 repository를 검색한다
  await githubTab.click();
  await page.getByPlaceholder("repository 이름을 입력해주세요").fill("seungdeok/seungdeok");

  // then: github 검색 버튼을 클릭하면 repository 상세 페이지로 이동한다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await expect(page).toHaveURL("/github/seungdeok/seungdeok");

  // then: github 상세 페이지에서 repository 이름이 표시된다
  await expect(page.getByRole("heading", { name: "seungdeok/seungdeok" })).toBeVisible();
});
