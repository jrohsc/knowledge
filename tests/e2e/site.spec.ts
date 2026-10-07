import { test, expect } from "@playwright/test";
const articles = [
  "french-revolution",
  "roman-empire",
  "industrial-revolution",
  "joseon",
  "korean-war",
  "socrates",
  "plato-cave",
  "newton-laws",
  "entropy",
  "evolution",
  "dna",
  "periodic-table",
  "derivative",
  "probability",
];
test("정적 자원과 모든 직접 기사 URL을 /knowledge/ 아래에서 제공한다", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const bad: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400) bad.push(r.url());
  });
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "오늘의 지식", exact: true }),
  ).toBeVisible();
  for (const id of articles) {
    const response = await request.get(`topic/${id}/`);
    expect(response.status(), id).toBe(200);
  }
  await page.goto("topic/entropy/");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "엔트로피", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await page.goto("timeline/");
  await page.reload();
  await page.getByRole("slider").fill("-300");
  await expect(page.locator(".simultaneous")).toContainText("로마 공화정");
  expect(errors).toEqual([]);
  expect(bad).toEqual([]);
});
test("주 메뉴 탐색과 검색 단축키·검색 결과·Escape", async ({ page }) => {
  await page.goto("./");
  await page.keyboard.press(
    process.platform === "darwin" ? "Meta+k" : "Control+k",
  );
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByPlaceholder("어떤 지식이 궁금한가요?").fill("gravity");
  await page
    .getByRole("dialog")
    .getByRole("link")
    .filter({ hasText: "뉴턴의 운동 법칙" })
    .click();
  await expect(page).toHaveURL(/\/knowledge\/topic\/newton-laws\//);
  await page.getByRole("button", { name: "지식 검색" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  for (const [label, path] of [
    ["탐색", "explore"],
    ["타임라인", "timeline"],
    ["지식 지도", "map"],
    ["복습", "review"],
  ]) {
    await page
      .getByRole("navigation", { name: "주 메뉴" })
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp("/knowledge/" + path + "/"));
  }
});
test("미분 interaction, 질문 응답, 완료, 예약 복습이 새로고침 뒤 유지된다", async ({
  page,
}) => {
  await page.goto("topic/derivative/");
  await expect(page.locator(".katex-error")).toHaveCount(0);
  await expect(page.locator("math mfrac").first()).toBeAttached();
  await page.getByLabel("두 점 사이 간격 Δx").fill("0.01");
  await expect(page.locator(".control-readout")).toContainText("2.01");
  await page
    .locator(".answer-options")
    .first()
    .getByRole("button")
    .nth(1)
    .click();
  await expect(page.locator(".answer-explanation").first()).toContainText(
    "잘 이해했어요",
  );
  await page.getByRole("button", { name: "오늘의 읽기 마치기" }).click();
  await page.getByRole("button", { name: "1주 후", exact: true }).click();
  await page.getByRole("button", { name: "익숙함", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "읽기 완료", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "익숙함", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("knowledge.progress.v1")!),
  );
  expect(saved.topics.derivative.quiz["0"]).toBe(1);
  expect(saved.topics.derivative.due).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(saved.topics.derivative.readPercent).toBe(100);
});
test("복습 세션 평가로 due 목록에서 이동하고 이력이 저장된다", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "knowledge.progress.v1",
      JSON.stringify({
        version: 1,
        topics: {
          entropy: {
            status: "learning",
            readPercent: 100,
            interval: 0,
            reviews: [],
            quiz: {},
            due: "2020-01-01",
            lastViewed: "2020-01-01T12:00:00Z",
          },
        },
        activeDays: [],
      }),
    ),
  );
  await page.goto("review/");
  await page.getByRole("button", { name: "1분 복습 →" }).click();
  await expect(page.locator(".review-session")).toContainText("엔트로피");
  await page.getByRole("button", { name: "기억했어요", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "오늘 예정된 복습을 모두 마쳤어요." }),
  ).toBeVisible();
  await expect(page.locator(".review-history")).toContainText("엔트로피");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("knowledge.progress.v1")!),
  );
  expect(saved.topics.entropy.reviews).toHaveLength(1);
  expect(saved.topics.entropy.interval).toBe(3);
});
test("평행 타임라인의 동시대·확대·지역 필터", async ({ page }) => {
  await page.goto("timeline/");
  await expect(page.locator(".simultaneous")).toContainText("로마 공화정");
  await expect(page.locator(".simultaneous")).toContainText("마우리아 제국");
  await expect(page.locator(".simultaneous")).toContainText("고조선");
  await page.getByLabel("비교할 지역").selectOption("한국사");
  await expect(page.locator(".simultaneous")).not.toContainText("마우리아");
  await page.getByRole("button", { name: "근현대", exact: true }).click();
  await page.getByLabel("같은 순간을 비교하기").fill("1951");
  await expect(page.locator(".simultaneous")).toContainText("한국 전쟁");
  await page
    .locator(".simultaneous")
    .getByRole("button")
    .filter({ hasText: "한국 전쟁" })
    .click();
  await expect(page.locator(".timeline-detail")).toContainText("북한의 남침");
  await page
    .getByRole("button", { name: "타임라인 확대", exact: true })
    .click();
  await expect(page.getByLabel("같은 순간을 비교하기")).toHaveValue("1951");
});
test("지식 지도는 관계를 설명하고 중심을 전환한다", async ({ page }) => {
  await page.goto("map/");
  await expect(page.locator(".map-neighbors")).toContainText("순간 변화율");
  await page.getByLabel("연결 분야").selectOption("mathematics");
  await expect(page.locator(".map-neighbors")).toContainText("미분");
  await page.getByRole("button", { name: "이 지식을 중심으로" }).click();
  await expect(page.locator(".map-center")).toContainText("미분");
  await expect(page.locator(".map-neighbors")).toContainText(
    "선택한 필터에 맞는 연결이 없습니다",
  );
  await page.getByRole("button", { name: "필터 초기화" }).click();
  await expect(page.locator(".map-neighbors")).toContainText(
    "뉴턴의 운동 법칙",
  );
});
test("테마는 브라우저에 저장된다", async ({ page }) => {
  await page.goto("./");
  const before = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("button", { name: /화면으로 전환/ }).click();
  const after = await page.locator("html").getAttribute("data-theme");
  expect(after).not.toBe(before);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", after!);
});
test("백업을 검증하고 사용자의 명시적 교체로 복원한다", async ({ page }) => {
  await page.goto("review/");
  const raw = {
    version: 1,
    topics: {
      dna: {
        status: "mastered",
        readPercent: 100,
        interval: 30,
        reviews: [],
        quiz: {},
        due: "2030-01-01",
        lastViewed: "2026-10-07T12:00:00Z",
      },
    },
    activeDays: ["2026-10-07"],
  };
  await page.getByLabel("학습 기록 백업 파일").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(raw)),
  });
  await expect(
    page.getByRole("button", { name: "기록 교체하기" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "기록 교체하기" }).click();
  await expect(page.locator(".feedback")).toContainText("복원");
  await expect(page.getByRole("main")).toContainText("DNA와 유전 정보");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "백업 내보내기" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/knowledge-backup-/);
});
test("손상된 저장 기록을 덮어쓰지 않고 안내한다", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("knowledge.progress.v1", "{bad json"),
  );
  await page.goto("topic/entropy/");
  await expect(page.locator(".storage-warning")).toContainText(
    "자동 저장을 멈췄습니다",
  );
  await page.getByRole("button", { name: "내일", exact: true }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("knowledge.progress.v1")),
  ).toBe("{bad json");
});
test("모바일의 핵심 페이지는 가로로 넘치지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    "./",
    "explore/",
    "topic/derivative/",
    "topic/periodic-table/",
    "map/",
    "timeline/",
    "review/",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      path,
    ).toBe(true);
  }
  await page.goto("./");
  await page.screenshot({
    path: "test-results/mobile-today.png",
    fullPage: true,
  });
});
test("과학 설명의 각 조작이 그림과 설명에 반영된다", async ({ page }) => {
  await page.goto("topic/newton-laws/");
  await page.getByLabel("질량 1").fill("6");
  await expect(page.locator(".control-readout")).toContainText("2.00");
  await page.goto("topic/entropy/");
  await page.getByLabel("분포 살펴보기").fill("100");
  await expect(page.locator(".visual-controls")).toContainText(
    "전체에 퍼진 상태",
  );
  await page.goto("topic/probability/");
  await page.getByRole("button", { name: "100회 던지기" }).click();
  await expect(page.locator(".visual-controls")).toContainText("100회");
  await page.getByRole("button", { name: "다시 시작", exact: true }).click();
  await expect(page.locator(".visual-controls")).toContainText("0회");
  await page.goto("topic/evolution/");
  await page.getByRole("slider", { name: /세대/ }).fill("8");
  await expect(page.locator(".visual-canvas svg")).toHaveAttribute(
    "aria-label",
    /97퍼센트/,
  );
  await page.getByRole("button", { name: "초록 환경", exact: true }).click();
  await page.getByRole("slider", { name: /세대/ }).fill("8");
  await expect(page.locator(".visual-canvas svg")).toHaveAttribute(
    "aria-label",
    /3퍼센트/,
  );
  await page.goto("topic/periodic-table/");
  await page.getByRole("button", { name: "11번 나트륨" }).click();
  await expect(page.locator(".atom-detail")).toContainText("바깥 전자 1개");
  await page.goto("topic/dna/");
  await page.getByRole("button", { name: "3 번역" }).click();
  await expect(page.locator(".visual-frame figcaption")).toContainText("코돈");
  await page.goto("topic/plato-cave/");
  await page.getByRole("button", { name: "3 동굴 밖" }).click();
  await expect(page.locator(".visual-frame figcaption")).toContainText(
    "공동체로 돌아갈 책임",
  );
});

test("큰 그림에서 분야·읽기 경로·전체 목차를 통해 글을 연다", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await page
    .getByRole("group", { name: "역사·철학·과학·수학의 관계 지도" })
    .getByRole("button", { name: /과학/ })
    .click();
  await expect(page.locator(".field-topic-links")).toContainText("DNA");
  await page
    .getByRole("button", { name: "기계에서 확률까지", exact: true })
    .click();
  await expect(page.locator(".path-step-count")).toHaveText("01 / 03");
  await page.getByRole("button", { name: "다음 연결", exact: true }).click();
  await expect(page.locator(".path-step-count")).toHaveText("02 / 03");
  await page.getByRole("button", { name: "흐름 재생", exact: true }).click();
  await expect(page.locator(".path-step-count")).toHaveText("03 / 03", {
    timeout: 6000,
  });
  await expect(
    page.getByRole("button", { name: "처음부터 재생" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /전체 목차 ·/ }).click();
  await expect(
    page.locator('.overview-catalog a[href*="/topic/"]'),
  ).toHaveCount(14);
  await page.locator('.overview-catalog a[href*="/topic/joseon/"]').click();
  await expect(page).toHaveURL(/topic\/joseon\//);
  await expect(page.locator(".concept-sketch li")).toHaveCount(3);
  await page.reload();
  await expect(page.locator(".concept-sketch li")).toHaveCount(3);
  expect(errors).toEqual([]);
});
