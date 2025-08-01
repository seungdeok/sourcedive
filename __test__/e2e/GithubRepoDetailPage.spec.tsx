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

test("Github Repository 상세 페이지 > 탭 메뉴를 클릭하면 해당 탭 내용이 표시됩니다.", async ({ page }) => {
  // given: github repository 상세 페이지에 접속한다
  await page.goto("/github/facebook/react");
  await page.waitForSelector("[role=tablist]");

  const filesTab = page.getByRole("tab", { name: "Files", exact: true });
  const dependenciesTab = page.getByRole("tab", { name: "Dependencies", exact: true });
  const fileDependenciesTab = page.getByRole("tab", { name: "File Dependencies", exact: true });
  await expect(filesTab).toHaveAttribute("aria-selected", "false");
  await expect(dependenciesTab).toHaveAttribute("aria-selected", "false");
  await expect(fileDependenciesTab).toHaveAttribute("aria-selected", "false");

  // when: 탭 메뉴를 클릭하면 해당 탭 내용이 표시된다
  await filesTab.click();

  // then: 파일 뷰어가 표시된다
  await expect(page.getByText("파일 뷰어")).toBeVisible();

  // when: 탭 메뉴를 클릭하면 해당 탭 내용이 표시된다
  await dependenciesTab.click();
  await expect(dependenciesTab).toHaveAttribute("aria-selected", "true");

  // then: package.json 기준 의존성 그래프가 표시된다
  await expect(page.getByText("Dependency 조합")).toBeVisible();

  // when: 탭 메뉴를 클릭하면 해당 탭 내용이 표시된다
  await fileDependenciesTab.click();
  await expect(fileDependenciesTab).toHaveAttribute("aria-selected", "true");

  // then: 파일 의존성 그래프가 표시된다
  await expect(page.getByText("파일 의존성 그래프")).toBeVisible();
});

test("Github Repository 상세 페이지 > 파일 뷰어의 파일 목록을 표시합니다.", async ({ page }) => {
  // given: github repository 상세 페이지에 접속한다
  await page.goto("/github/facebook/react?tab=files");
  await page.waitForSelector("[role=tablist]");

  const filesTab = page.getByRole("tab", { name: "Files", exact: true });
  await expect(filesTab).toHaveAttribute("aria-selected", "true");

  // then: 파일 목록이 표시된다
  await expect(page.getByText("파일 뷰어")).toBeVisible();
  await expect(page.getByText("README.md")).toBeVisible();
  await expect(page.getByText("package.json")).toBeVisible();
});

test("Github Repository 상세 페이지 > 의존성 패키지 목록을 표시합니다.", async ({ page }) => {
  // given: github repository 상세 페이지에 접속한다
  await page.goto("/github/facebook/react?tab=dependencies");
  await page.waitForSelector("[role=tablist]");

  const dependenciesTab = page.getByRole("tab", { name: "Dependencies", exact: true });
  await expect(dependenciesTab).toHaveAttribute("aria-selected", "true");

  // then: package.json 기준 의존성 그래프가 표시된다
  await expect(page.getByText("Dependency 조합")).toBeVisible();

  // then: 의존성 패키지가 표시된다
  const chartTexts = page.locator("text.bb-text");
  await expect(chartTexts.filter({ hasText: /^react \d+\.\d+%$/ })).toBeVisible();
});

test("Github Repository 상세 페이지 > 파일 의존성 분석은 지원하는 파일(.ts, .tsx, .js, .jsx, .json, .mjs)만 분석합니다.", async ({
  page,
}) => {
  // given: github repository 상세 페이지에 접속한다
  await page.goto("/github/facebook/react?tab=file-dependencies");
  await page.waitForSelector("[role=tablist]");

  const fileDependenciesTab = page.getByRole("tab", { name: "File Dependencies", exact: true });
  await expect(fileDependenciesTab).toHaveAttribute("aria-selected", "true");

  // then: 파일 의존성 그래프가 표시된다
  await expect(page.getByText("파일 의존성 그래프")).toBeVisible();
  // then: TreeFilesViewer가 렌더링됩니다.
  await expect(page.getByTestId("tree-files-viewer")).toBeVisible();

  let alertMessage = "";
  page.on("dialog", async dialog => {
    expect(dialog.type()).toBe("alert");
    alertMessage = dialog.message();
    await dialog.accept();
  });

  // when: 파일 클릭
  await page.getByText("README.md").click();
  // then: Alert 메시지가 올바른지 검증
  expect(alertMessage).toBe("파일 의존성 분석은 .ts, .tsx, .js, .jsx, .json, .mjs 파일만 지원합니다.");
});

test("Github Repository 상세 페이지 > 파일 의존성 그래프를 표시합니다.", async ({ page }) => {
  // given: github repository 상세 페이지에 접속한다
  await page.goto("/github/facebook/react?tab=file-dependencies");
  await page.waitForSelector("[role=tablist]");

  const fileDependenciesTab = page.getByRole("tab", { name: "File Dependencies", exact: true });
  await expect(fileDependenciesTab).toHaveAttribute("aria-selected", "true");

  // then: 파일 의존성 그래프가 표시된다
  await expect(page.getByText("파일 의존성 그래프")).toBeVisible();
  // then: TreeFilesViewer가 렌더링됩니다.
  await expect(page.getByTestId("tree-files-viewer")).toBeVisible();

  await page.route("*/**/api/github/react/dependency", async route => {
    const json = {
      success: true,
      repository: "facebook/react@main",
      entryFile: "ReactVersions.js",
      dependencies: {
        "./ReactVersions.js": [
          { id: "./src/index.ts", issuer: "", request: "", kind: "static" },
          { id: "./src/utils.ts", issuer: "", request: "", kind: "static" },
          { id: "./src/types.ts", issuer: "", request: "", kind: "static" },
          { id: "./src/helpers.ts", issuer: "", request: "", kind: "static" },
        ],
      },
    };
    await route.fulfill({ json });
  });

  // when: 파일 클릭
  await page.getByText("ReactVersions.js").click();
  // then: Entry File 정보가 표시됩니다.
  await expect(page.getByText("https://raw.githubusercontent.com/facebook/react/main/ReactVersions.js")).toBeVisible();
  // then: 파일 의존성 그래프가 표시됩니다.
  await expect(page.getByTestId("dependency-graph")).toBeVisible();
});
