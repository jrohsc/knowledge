import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("핵심 페이지의 WCAG A·AA 접근성 검사", async ({ page }) => {
  for (const route of [
    "./",
    "topic/derivative/",
    "topic/periodic-table/",
    "explore/",
    "review/",
    "map/",
    "timeline/",
  ]) {
    await page.goto(route);
    await page.locator("h1").waitFor();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map((n) => n.target),
      })),
      route,
    ).toEqual([]);
  }
});
test("어두운 화면과 검색창의 접근성 검사", async ({ page }) => {
  await page.goto("./");
  if ((await page.locator("html").getAttribute("data-theme")) !== "dark")
    await page.getByRole("button", { name: "어두운 화면으로 전환" }).click();
  let result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.getByRole("button", { name: "지식 검색" }).click();
  result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
