import { expect, test } from "@playwright/test";

test("메인 페이지 > github 검색 탭 > owner/repository 형태로 입력해주세요.", async ({ page }) => {
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
  await page.getByPlaceholder("repository 이름을 입력해주세요").fill("*react");

  // then: github 검색 버튼을 클릭하면 owner/repository 형태로 입력해주세요. 라는 메시지가 표시된다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await expect(page.getByText("owner/repository 형태로 입력해주세요.")).toBeVisible();

  // when: github 검색 탭을 클릭하고 검색어에 owner/repository 형태로 입력한다
  await page.getByPlaceholder("repository 이름을 입력해주세요").fill("seungdeok/sourcedive");

  // then: github 검색 버튼을 클릭하면 패키지 상세 페이지로 이동한다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await page.waitForURL("/github/seungdeok/sourcedive");
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
  await page.waitForURL("/github/seungdeok/test");
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
  await page.waitForURL("/github/seungdeok/seungdeok");
  await expect(page).toHaveURL("/github/seungdeok/seungdeok");

  // then: github 상세 페이지에서 repository 이름이 표시된다
  await expect(page.getByRole("heading", { name: "seungdeok/seungdeok" })).toBeVisible();
});

test("메인 페이지 > github 검색 탭 > 검색 후 다시 검색 페이지로 이동하면 최근 검색어 목록이 표시된다", async ({
  page,
}) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");

  const githubTab = page.getByRole("tab", { name: "🔍 Github 검색" });

  // when: github 검색 탭을 클릭하고 존재하는 repository를 검색한다
  await githubTab.click();
  await expect(githubTab).toHaveAttribute("aria-selected", "true");
  await page.getByPlaceholder("repository 이름을 입력해주세요").fill("seungdeok/seungdeok");

  // then: github 검색 버튼을 클릭하면 repository 상세 페이지로 이동한다
  await page.getByRole("button", { name: "🔍 검색" }).click();
  await page.waitForURL("/github/seungdeok/seungdeok");
  await expect(page).toHaveURL("/github/seungdeok/seungdeok");

  // when: 검색 페이지로 이동한다
  await page.goBack();
  await page.waitForSelector("[role=tablist]");
  await githubTab.click();
  await expect(githubTab).toHaveAttribute("aria-selected", "true");

  // then: Input focus 시 최근 검색어 목록이 표시된다
  await page.getByPlaceholder("repository 이름을 입력해주세요").focus();
  await expect(page.getByTestId("github-repo-search-suggestions").getByText("seungdeok/seungdeok")).toBeVisible();
});

test("메인 페이지 > github 검색 탭 > 검색어 입력 시 추천 검색어 목록이 표시된다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");

  const githubTab = page.getByRole("tab", { name: "🔍 Github 검색" });

  // when: github 검색 탭을 클릭한다.
  await githubTab.click();
  await expect(githubTab).toHaveAttribute("aria-selected", "true");

  // then: 검색어 입력 시 추천 검색어 목록이 표시된다
  await page.getByPlaceholder("repository 이름을 입력해주세요").fill("react");
  await page.getByPlaceholder("repository 이름을 입력해주세요").focus();
  await expect(page.getByText("reactjs/react.dev")).toBeVisible();
});

test("메인 페이지 > github 검색 탭 > 키보드 ArrowUp/ArrowDown으로 추천 검색어를 선택할 수 있다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");

  const githubTab = page.getByRole("tab", { name: "🔍 Github 검색" });
  const searchInput = page.getByPlaceholder("repository 이름을 입력해주세요");

  // given: Github API mocking
  await page.route("**/api.github.com/search/repositories?q=react", async route => {
    const json = {
      items: [{ full_name: "facebook/react" }, { full_name: "vercel/next.js" }],
    };
    await route.fulfill({ json });
  });

  // when: github 검색 탭을 클릭한다.
  await githubTab.click();

  // when: 검색어를 입력하고 추천 검색어를 조회한다.
  await searchInput.fill("react");
  await searchInput.focus();

  // when: 추천 검색어가 표시될 때까지 기다린다
  await expect(page.getByText("추천 검색어")).toBeVisible();

  // when: ArrowDown 키를 눌러 마지막 추천 검색어를 선택한다
  await searchInput.press("ArrowDown");
  await searchInput.press("ArrowDown");

  // then: 마지막 추천 검색어가 선택되고 input 값이 변경된다
  const lastSuggestion = page.locator('[data-testid="github-repo-search-suggestions"] [aria-selected="true"]').last();
  await expect(lastSuggestion).toBeVisible();
  await expect(lastSuggestion).toHaveAttribute("aria-label", "vercel/next.js");
  await expect(searchInput).toHaveValue("vercel/next.js");

  // when: ArrowUp 키를 눌러 첫 번째 추천 검색어를 선택한다
  await searchInput.press("ArrowUp");

  // then: 첫 번째 추천 검색어가 선택되고 input 값이 변경된다
  const firstSuggestion = page.locator('[data-testid="github-repo-search-suggestions"] [aria-selected="true"]').first();
  await expect(firstSuggestion).toBeVisible();
  await expect(firstSuggestion).toHaveAttribute("aria-label", "facebook/react");
  await expect(searchInput).toHaveValue("facebook/react");
});

test("메인 페이지 > github 검색 탭 > 키보드 Enter로 입력된 검색어로 검색할 수 있다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");

  const githubTab = page.getByRole("tab", { name: "🔍 Github 검색" });
  const searchInput = page.getByPlaceholder("repository 이름을 입력해주세요");

  // when: github 검색 탭을 클릭한다.
  await githubTab.click();

  // when: 검색어를 입력한다.
  await searchInput.fill("facebook/react");
  await searchInput.focus();

  // then: Enter 키를 누르면 상세 페이지로 이동한다
  await searchInput.press("Enter");
  await page.waitForURL("/github/facebook/react");
  await expect(page).toHaveURL("/github/facebook/react");
});

test("메인 페이지 > github 검색 탭 > 키보드 Escape로 원본 입력값으로 복원할 수 있다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");
  await page.waitForSelector("[role=tablist]");

  const githubTab = page.getByRole("tab", { name: "🔍 Github 검색" });
  const searchInput = page.getByPlaceholder("repository 이름을 입력해주세요");

  // given: Github API mocking
  await page.route("**/api.github.com/search/repositories?q=react", async route => {
    const json = {
      items: [{ full_name: "facebook/react" }, { full_name: "vercel/next.js" }],
    };
    await route.fulfill({ json });
  });

  // when: github 검색 탭을 클릭한다.
  await githubTab.click();

  // when: 검색어를 입력하고 추천 검색어를 조회한다.
  await searchInput.fill("react");
  await searchInput.focus();

  // when: 추천 검색어가 표시될 때까지 기다린다
  await expect(page.getByText("추천 검색어")).toBeVisible();

  // when: ArrowDown 키를 눌러 추천 검색어를 선택한다
  await searchInput.press("ArrowDown");

  // then: 추천 검색어가 선택되고 input 값이 변경된다
  const suggestion = page.locator('[data-testid="github-repo-search-suggestions"] [aria-selected="true"]').first();
  await expect(suggestion).toBeVisible();
  await expect(suggestion).toHaveAttribute("aria-label", "facebook/react");
  await expect(searchInput).toHaveValue("facebook/react");

  // when: Escape 키를 눌러 원본 입력값으로 복원한다
  await searchInput.press("Escape");

  // then: 원본 입력값으로 복원된다
  await expect(searchInput).toHaveValue("react");
});
