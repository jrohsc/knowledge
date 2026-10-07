"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  freshData,
  freshProgress,
  localDay,
  type ProgressData,
  type TopicProgress,
} from "@/lib/learning";
import {
  localProgressRepository,
  parseProgress,
  type ProgressRepository,
} from "@/lib/storage";
type Context = {
  data: ProgressData;
  ready: boolean;
  error: string;
  update: (
    id: string,
    fn: (p: TopicProgress) => TopicProgress,
    active?: boolean,
  ) => void;
  restore: (raw: string) => void;
};
const ProgressContext = createContext<Context | null>(null);
export function ProgressProvider({
  children,
  repository = localProgressRepository,
}: {
  children: ReactNode;
  repository?: ProgressRepository;
}) {
  const [data, setData] = useState<ProgressData>(freshData);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const current = useRef(data);
  const corrupted = useRef(false);
  useEffect(() => {
    function read() {
      try {
        const d = repository.load();
        current.current = d;
        setData(d);
        corrupted.current = false;
        setError("");
      } catch {
        corrupted.current = true;
        setError(
          "학습 기록을 불러오지 못했습니다. 기존 데이터 보호를 위해 자동 저장을 멈췄습니다. 복습 페이지에서 백업을 복원할 수 있습니다.",
        );
      }
      setReady(true);
    }
    read();
    return repository.subscribe(read);
  }, [repository]);
  const persist = useCallback(
    (d: ProgressData) => {
      current.current = d;
      setData(d);
      if (corrupted.current) return;
      try {
        repository.save(d);
        setError("");
      } catch {
        setError(
          "브라우저 저장 공간에 기록하지 못했습니다. 현재 기록은 이 화면에만 유지됩니다. 복습 페이지에서 백업을 내려받아 주세요.",
        );
      }
    },
    [repository],
  );
  const update = useCallback(
    (id: string, fn: (p: TopicProgress) => TopicProgress, active = false) => {
      const d = current.current;
      const day = localDay();
      persist({
        ...d,
        topics: { ...d.topics, [id]: fn(d.topics[id] ?? freshProgress()) },
        activeDays:
          active && !d.activeDays.includes(day)
            ? [...d.activeDays, day]
            : d.activeDays,
      });
    },
    [persist],
  );
  const restore = useCallback(
    (raw: string) => {
      const d = parseProgress(raw);
      repository.save(d);
      corrupted.current = false;
      current.current = d;
      setData(d);
      setError("");
    },
    [repository],
  );
  return (
    <ProgressContext.Provider value={{ data, ready, error, update, restore }}>
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("ProgressProvider is required");
  return value;
}
