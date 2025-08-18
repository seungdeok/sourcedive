import test, { expect } from "@playwright/test";

test("메인 페이지 > FAQ > 섹션이 렌더링된다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");

  // then: FAQ 제목이 표시된다
  await expect(page.locator("h2", { hasText: "자주 묻는 질문" })).toBeVisible();

  // then: FAQ 아코디언이 표시된다
  await expect(page.locator("[data-slot='accordion-item']")).toHaveCount(3);
});

test("메인 페이지 > FAQ > 아코디언은 단일 선택으로 동작한다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");

  const firstQuestion = page.getByRole("button", { name: "Source Dive의 데이터는 어디서 가져오나요?" });
  const secondQuestion = page.getByRole("button", { name: "분석할 수 있는 파일 형식은 무엇인가요?" });

  // when: 첫 번째 질문을 클릭한다
  await firstQuestion.click();

  // then: 첫 번째 답변이 열린다
  await expect(page.locator("[data-slot='accordion-item'][data-state='open']")).toHaveCount(1);

  // when: 두 번째 질문을 클릭한다
  await secondQuestion.click();

  // then: 두 번째 답변만 열리고 첫 번째는 닫힌다 (단일 선택 모드)
  await expect(page.locator("[data-slot='accordion-item'][data-state='open']")).toHaveCount(1);
  await expect(page.locator("[data-slot='accordion-item']").nth(1)).toHaveAttribute("data-state", "open");
  await expect(page.getByText("JavaScript/Node.js")).toBeVisible();
});

test("메인 페이지 > FAQ > 열린 질문을 다시 클릭하면 답변이 닫힌다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");

  const firstQuestion = page.getByRole("button", { name: "Source Dive의 데이터는 어디서 가져오나요?" });

  // when: 첫 번째 질문을 클릭한다
  await firstQuestion.click();

  // then: 답변이 열린다
  await expect(page.locator("[data-slot='accordion-item'][data-state='open']")).toHaveCount(1);
  await expect(page.locator("[data-slot='accordion-item'][data-state='closed']")).toHaveCount(2);

  // when: 같은 질문을 다시 클릭한다
  await firstQuestion.click();

  // then: 답변이 닫힌다
  await expect(page.locator("[data-slot='accordion-item'][data-state='open']")).toHaveCount(0);
  await expect(page.locator("[data-slot='accordion-item'][data-state='closed']")).toHaveCount(3);
});

test("메인 페이지 > FAQ > 첫 번째 질문을 클릭하면 답변이 표시된다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");

  const firstQuestion = page.getByRole("button", { name: "Source Dive의 데이터는 어디서 가져오나요?" });
  const firstItem = page.locator("[data-slot='accordion-item']").first();

  // then: 처음에는 답변이 닫혀있다
  await expect(firstItem).toHaveAttribute("data-state", "closed");

  // when: 첫 번째 질문을 클릭한다
  await firstQuestion.click();

  // then: 답변이 열린다
  await expect(firstItem).toHaveAttribute("data-state", "open");

  // then: 답변 내용이 표시된다
  const firstContent = page.locator("[data-slot='accordion-content']").first();
  await expect(firstContent).not.toHaveAttribute("hidden");

  // then: npm registry와 github 뱃지가 표시된다
  await expect(page.getByText("npm registry", { exact: true })).toBeVisible();
  await expect(page.getByText("github", { exact: true })).toBeVisible();
});

test("메인 페이지 > FAQ > 두 번째 질문을 클릭하면 파일 형식 정보가 표시된다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");

  const secondQuestion = page.getByRole("button", { name: "분석할 수 있는 파일 형식은 무엇인가요?" });

  // when: 두 번째 질문을 클릭한다
  await secondQuestion.click();

  // then: JavaScript/Node.js 카드가 표시된다
  await expect(page.getByText("JavaScript/Node.js")).toBeVisible();

  // then: 지원 파일 확장자가 표시된다
  await expect(page.getByText("• *.ts, *.tsx, *.js, *.jsx, *.json, *.mjs, *.cjs")).toBeVisible();
});

test("메인 페이지 > FAQ > 세 번째 질문을 클릭하면 가격 정보가 표시된다", async ({ page }) => {
  // given: 메인 페이지에 접속한다
  await page.goto("/");

  const thirdQuestion = page.getByRole("button", { name: "Source Dive는 무료로 사용할 수 있나요?" });

  // when: 세 번째 질문을 클릭한다
  await thirdQuestion.click();

  // then: 무료 서비스 설명이 표시된다
  await expect(page.getByText("기본 서비스는 완전 무료로 제공됩니다")).toBeVisible();
});
