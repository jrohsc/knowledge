import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addDays,
  scheduleDate,
  reviewed,
  freshProgress,
  freshData,
  streak,
  dailyTopics,
  searchTopics,
  dueTopics,
} from "../lib/learning";
import { parseProgress } from "../lib/storage";
import { getTopics } from "../lib/content";
const topics = getTopics();
test("월말·윤년 복습일을 다음 달 말일로 보정한다", () => {
  assert.equal(scheduleDate(new Date(2024, 0, 31), "month"), "2024-02-29");
  assert.equal(scheduleDate(new Date(2025, 0, 31), "month"), "2025-02-28");
  assert.equal(scheduleDate(new Date(2026, 11, 31), "day"), "2027-01-01");
  assert.equal(addDays(new Date(2026, 2, 7), 7), "2026-03-14");
});
test("복습 결과에 따라 다음 간격과 이력이 달라진다", () => {
  const d = new Date(2026, 9, 7);
  const good = reviewed(freshProgress(), "good", d);
  assert.equal(good.due, "2026-10-10");
  assert.equal(good.status, "familiar");
  const next = reviewed(good, "good", d);
  assert.equal(next.interval, 6);
  const again = reviewed(next, "again", d);
  assert.equal(again.interval, 1);
  assert.equal(again.status, "learning");
  assert.equal(again.reviews.length, 3);
});
test("오늘 또는 어제까지 이어진 실제 활동만 연속일로 센다", () => {
  assert.equal(streak(["2026-10-05", "2026-10-06"], new Date(2026, 9, 7)), 2);
  assert.equal(streak(["2026-10-05"], new Date(2026, 9, 7)), 0);
  assert.equal(
    streak(["2026-10-07", "2026-10-06", "2026-10-06"], new Date(2026, 9, 7)),
    2,
  );
});
test("일일 추천은 결정론적이며 서로 다른 영역을 포함한다", () => {
  const a = dailyTopics(topics, "2026-10-07");
  assert.deepEqual(a, dailyTopics(topics, "2026-10-07"));
  assert.equal(a.length, 4);
  assert.equal(new Set(a.map((t) => t.id)).size, 4);
  assert.ok(a.some((t) => t.subject === "philosophy"));
  assert.ok(a.some((t) => t.subject === "mathematics"));
  assert.notDeepEqual(
    a.map((t) => t.id),
    dailyTopics(topics, "2026-10-08").map((t) => t.id),
  );
  assert.deepEqual(dailyTopics([], "2026-10-07"), []);
});
test("한국어·영어·별칭 검색과 복수 단어 검색", () => {
  for (const query of ["중력", "gravity", "Newton", "만유인력"])
    assert.ok(searchTopics(topics, query).some((t) => t.id === "newton-laws"));
  assert.equal(searchTopics(topics, "Plato cave")[0].id, "plato-cave");
  assert.equal(searchTopics(topics, "xyznotfound").length, 0);
});
test("복습 예정일이 오늘 또는 과거인 글만 due 목록에 포함", () => {
  const d = freshData();
  d.topics.entropy = { ...freshProgress(), due: "2026-10-07" };
  d.topics.dna = { ...freshProgress(), due: "2026-10-08" };
  assert.deepEqual(
    dueTopics(topics, d, "2026-10-07").map((t) => t.id),
    ["entropy"],
  );
});
test("정상 백업은 복원하고 손상된 백업은 거부한다", () => {
  const d = freshData();
  d.topics.entropy = { ...freshProgress(), due: "2026-10-08" };
  assert.deepEqual(parseProgress(JSON.stringify(d)), d);
  assert.throws(() => parseProgress("{"));
  assert.throws(() => parseProgress(JSON.stringify({ ...d, version: 2 })));
  assert.throws(() =>
    parseProgress(
      JSON.stringify({
        ...d,
        topics: { entropy: { ...freshProgress(), status: "invalid" } },
      }),
    ),
  );
  assert.throws(() =>
    parseProgress(
      JSON.stringify({
        ...d,
        topics: { entropy: { ...freshProgress(), readPercent: 101 } },
      }),
    ),
  );
});
