import { freshData, type ProgressData, type TopicProgress } from "./learning";
export const STORAGE_KEY = "knowledge.progress.v1";
export interface ProgressRepository {
  load(): ProgressData;
  save(data: ProgressData): void;
  subscribe(listener: () => void): () => void;
}
export function parseProgress(raw: string): ProgressData {
  const d = JSON.parse(raw);
  if (
    d?.version !== 1 ||
    !d.topics ||
    typeof d.topics !== "object" ||
    Array.isArray(d.topics) ||
    !Array.isArray(d.activeDays)
  )
    throw new Error("지원하지 않는 백업 형식입니다.");
  const topics: Record<string, TopicProgress> = {};
  for (const [id, p] of Object.entries(d.topics) as [string, TopicProgress][]) {
    if (
      !/^[a-z0-9-]+$/.test(id) ||
      !p ||
      !["new", "learning", "familiar", "mastered"].includes(p.status) ||
      !Number.isFinite(p.readPercent) ||
      p.readPercent < 0 ||
      p.readPercent > 100 ||
      !Number.isFinite(p.interval) ||
      p.interval < 0 ||
      !Array.isArray(p.reviews) ||
      !p.quiz ||
      typeof p.quiz !== "object"
    )
      throw new Error("학습 기록 형식이 올바르지 않습니다.");
    if (p.due && !/^\d{4}-\d{2}-\d{2}$/.test(p.due))
      throw new Error("복습 날짜 형식이 올바르지 않습니다.");
    if (p.lastViewed && isNaN(Date.parse(p.lastViewed)))
      throw new Error("읽은 날짜 형식이 올바르지 않습니다.");
    if (
      p.reviews.some(
        (r) =>
          !r ||
          !["again", "good", "easy"].includes(r.rating) ||
          isNaN(Date.parse(r.at)),
      )
    )
      throw new Error("복습 이력 형식이 올바르지 않습니다.");
    if (
      Object.entries(p.quiz).some(
        ([k, v]) => !/^\d+$/.test(k) || !Number.isInteger(v) || v < 0 || v > 20,
      )
    )
      throw new Error("질문 기록 형식이 올바르지 않습니다.");
    topics[id] = { ...p, reviews: p.reviews.slice(-200) };
  }
  if (
    d.activeDays.some(
      (day: unknown) =>
        typeof day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day),
    )
  )
    throw new Error("활동 날짜 형식이 올바르지 않습니다.");
  return {
    version: 1,
    topics,
    activeDays: [...new Set(d.activeDays)] as string[],
  };
}
export const localProgressRepository: ProgressRepository = {
  load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? parseProgress(raw) : freshData();
  },
  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  subscribe(listener) {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  },
};
