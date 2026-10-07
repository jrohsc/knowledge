import type { Mastery, TopicSummary as Topic } from "./schema";
export interface ReviewEvent {
  at: string;
  rating: "again" | "good" | "easy";
}
export interface TopicProgress {
  status: Mastery;
  lastViewed?: string;
  readPercent: number;
  due?: string;
  interval: number;
  reviews: ReviewEvent[];
  quiz: Record<string, number>;
  completedAt?: string;
}
export interface ProgressData {
  version: 1;
  topics: Record<string, TopicProgress>;
  activeDays: string[];
}
export const freshData = (): ProgressData => ({
  version: 1,
  topics: {},
  activeDays: [],
});
export const freshProgress = (): TopicProgress => ({
  status: "new",
  readPercent: 0,
  interval: 0,
  reviews: [],
  quiz: {},
});
export const statusLabels: Record<Mastery, string> = {
  new: "처음 봄",
  learning: "학습 중",
  familiar: "익숙함",
  mastered: "잘 알고 있음",
};
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return localDay(next);
}
export function scheduleDate(date: Date, period: "day" | "week" | "month") {
  if (period === "month") {
    const next = new Date(date);
    const d = next.getDate();
    next.setDate(1);
    next.setMonth(next.getMonth() + 1);
    const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    next.setDate(Math.min(d, last));
    return localDay(next);
  }
  return addDays(date, period === "day" ? 1 : 7);
}
export function reviewed(
  p: TopicProgress,
  rating: ReviewEvent["rating"],
  date = new Date(),
): TopicProgress {
  const interval =
    rating === "again"
      ? 1
      : rating === "easy"
        ? Math.max(14, Math.round(p.interval * 2.5))
        : Math.max(3, Math.round(p.interval * 2));
  return {
    ...p,
    status:
      rating === "again"
        ? "learning"
        : rating === "easy"
          ? "mastered"
          : "familiar",
    interval,
    due: addDays(date, interval),
    reviews: [...p.reviews, { at: date.toISOString(), rating }].slice(-200),
  };
}
export function dueTopics(
  topics: Topic[],
  data: ProgressData,
  day = localDay(),
) {
  return topics
    .filter((t) => data.topics[t.id]?.due && data.topics[t.id].due! <= day)
    .sort((a, b) =>
      data.topics[a.id].due!.localeCompare(data.topics[b.id].due!),
    );
}
export function dailyTopics(topics: Topic[], day = localDay()): Topic[] {
  const seed = Array.from(day).reduce(
    (n, c) => (n * 31 + c.charCodeAt(0)) >>> 0,
    0,
  );
  const groups = [
    ["world-history", "korean-history"],
    ["philosophy"],
    ["physics", "chemistry", "biology"],
    ["mathematics"],
  ];
  return groups
    .map((group, i) => {
      const pool = topics.filter((t) => group.includes(t.subject));
      return pool.length ? pool[(seed + i * 7) % pool.length] : undefined;
    })
    .filter((t): t is Topic => !!t);
}
export function streak(days: string[], now = new Date()) {
  const set = new Set(days);
  const date = new Date(now);
  if (!set.has(localDay(date))) date.setDate(date.getDate() - 1);
  let result = 0;
  while (set.has(localDay(date))) {
    result++;
    date.setDate(date.getDate() - 1);
  }
  return result;
}
export function searchTopics(topics: Topic[], query: string) {
  const words = query
    .normalize("NFKC")
    .toLocaleLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return topics.slice(0, 6);
  return topics
    .map((t) => {
      const title = `${t.title} ${t.englishTitle}`.toLowerCase();
      const aliases = t.keywords.join(" ").toLowerCase();
      const all = `${title} ${aliases} ${t.summary} ${t.subcategory}`;
      const score = words.every((w) => all.includes(w))
        ? words.reduce(
            (s, w) =>
              s + (title.includes(w) ? 10 : aliases.includes(w) ? 5 : 1),
            0,
          )
        : 0;
      return { t, score };
    })
    .filter((x) => x.score)
    .sort(
      (a, b) => b.score - a.score || a.t.title.localeCompare(b.t.title, "ko"),
    )
    .map((x) => x.t);
}
