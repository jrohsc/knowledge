"use client";
import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight, CalendarDays } from "lucide-react";
import type { Topic, Mastery } from "@/lib/schema";
import {
  freshProgress,
  statusLabels,
  scheduleDate,
  reviewed,
} from "@/lib/learning";
import { useProgress } from "./ProgressProvider";
export function ReadingTracker({ id }: { id: string }) {
  const { data, ready, update } = useProgress();
  const visited = useRef("");
  const [resume, setResume] = useState(0);
  useEffect(() => {
    if (!ready || visited.current === id) return;
    visited.current = id;
    setResume(data.topics[id]?.readPercent ?? 0);
    update(id, (p) => ({
      ...p,
      lastViewed: new Date().toISOString(),
      status: p.status === "new" ? "learning" : p.status,
    }));
    let timer: ReturnType<typeof setTimeout> | undefined;
    const save = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const percent = Math.min(
        100,
        Math.max(0, Math.round((window.scrollY / Math.max(1, total)) * 100)),
      );
      update(id, (p) => ({
        ...p,
        readPercent: Math.max(p.readPercent, percent),
      }));
    };
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(save, 400);
    };
    const activity = setTimeout(() => update(id, (p) => p, true), 15000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      clearTimeout(activity);
      window.removeEventListener("scroll", onScroll);
    };
  }, [id, ready, update]);
  return resume > 5 && resume < 95 ? (
    <button
      className="resume-button"
      onClick={() => {
        window.scrollTo({
          top:
            ((document.documentElement.scrollHeight - innerHeight) * resume) /
            100,
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        });
        setResume(0);
      }}
    >
      지난번 읽던 곳으로 · {resume}% <ArrowRight size={15} />
    </button>
  ) : null;
}
export function LearningControls({ topic }: { topic: Topic }) {
  const { data, update, ready } = useProgress();
  const p = data.topics[topic.id] ?? freshProgress();
  const [notice, setNotice] = useState("");
  return (
    <section className="learning-controls" aria-labelledby="learning-title">
      <div>
        <span className="eyebrow">다음 만남을 남겨두세요</span>
        <h2 id="learning-title">이 지식, 얼마나 익숙한가요?</h2>
      </div>
      <div className="status-buttons" aria-label="학습 상태">
        {(Object.keys(statusLabels) as Mastery[]).map((status) => (
          <button
            key={status}
            disabled={!ready}
            aria-pressed={p.status === status}
            onClick={() =>
              update(topic.id, (prev) => ({ ...prev, status }), true)
            }
          >
            {p.status === status && <Check size={14} />} {statusLabels[status]}
          </button>
        ))}
      </div>
      <div className="review-schedule">
        <CalendarDays size={17} />
        <span>다시 만날 날짜</span>
        {(["day", "week", "month"] as const).map((period, i) => (
          <button
            key={period}
            disabled={!ready}
            onClick={() => {
              const due = scheduleDate(new Date(), period);
              update(topic.id, (prev) => ({ ...prev, due }), true);
              setNotice(`${due.replaceAll("-", ".")}에 다시 만나요.`);
            }}
          >
            {["내일", "1주 후", "1개월 후"][i]}
          </button>
        ))}
      </div>
      <div className="completion-row">
        <button
          className="button"
          disabled={!ready}
          onClick={() => {
            update(
              topic.id,
              (prev) => ({
                ...prev,
                completedAt: new Date().toISOString(),
                readPercent: 100,
                status: prev.status === "new" ? "learning" : prev.status,
                due: prev.due ?? scheduleDate(new Date(), "day"),
              }),
              true,
            );
            setNotice("읽기를 기록했습니다. 다음 복습도 준비했어요.");
          }}
        >
          {p.completedAt ? (
            <>
              <Check size={16} /> 읽기 완료
            </>
          ) : (
            "오늘의 읽기 마치기"
          )}
        </button>
        <span role="status">
          {notice ||
            (p.due
              ? `다음 복습: ${p.due.replaceAll("-", ".")}`
              : "이해는 반복해서 만날 때 깊어집니다.")}
        </span>
      </div>
    </section>
  );
}
export function QuickCheck({
  topic,
  reviewMode = false,
}: {
  topic: Topic;
  reviewMode?: boolean;
}) {
  const { data, update } = useProgress();
  const stored = data.topics[topic.id]?.quiz ?? {};
  const [answers, setAnswers] = useState<Record<string, number>>(
    reviewMode ? {} : stored,
  );
  useEffect(() => {
    if (!reviewMode) setAnswers(stored);
  }, [JSON.stringify(stored), reviewMode]);
  return (
    <section className="quick-check" id="quick-check">
      <div className="section-heading">
        <h2>1분 복습</h2>
        <span>책을 덮기 전에, 스스로에게</span>
      </div>
      {topic.reviewQuestions.map((q, i) => {
        const selected = answers[i];
        return (
          <fieldset key={i}>
            <legend>
              <span className="question-number">0{i + 1}</span>
              {q.prompt}
            </legend>
            <div className="answer-options">
              {q.options.map((option, j) => (
                <button
                  key={option}
                  aria-pressed={selected === j}
                  className={
                    selected !== undefined
                      ? j === q.answer
                        ? "correct"
                        : j === selected
                          ? "incorrect"
                          : ""
                      : ""
                  }
                  onClick={() => {
                    setAnswers((a) => ({ ...a, [i]: j }));
                    if (!reviewMode)
                      update(
                        topic.id,
                        (p) => ({ ...p, quiz: { ...p.quiz, [i]: j } }),
                        true,
                      );
                  }}
                >
                  <span>{String.fromCharCode(65 + j)}</span>
                  {option}
                  {selected !== undefined && j === q.answer && (
                    <Check size={16} />
                  )}
                </button>
              ))}
            </div>
            {selected !== undefined && (
              <p className="answer-explanation" role="status">
                <strong>
                  {selected === q.answer
                    ? "잘 이해했어요."
                    : "이렇게 생각해볼까요?"}
                </strong>{" "}
                {q.explanation}
              </p>
            )}
          </fieldset>
        );
      })}
    </section>
  );
}
export function ReviewRating({
  id,
  onDone,
}: {
  id: string;
  onDone: () => void;
}) {
  const { update } = useProgress();
  return (
    <div className="review-rating">
      <h3>답을 떠올리기는 어땠나요?</h3>
      <p>느낌에 맞게 고르면 다음 복습 간격을 조정합니다.</p>
      <div className="button-row">
        {(["again", "good", "easy"] as const).map((rating, i) => (
          <button
            key={rating}
            className={i === 1 ? "button" : "button secondary"}
            onClick={() => {
              update(id, (p) => reviewed(p, rating), true);
              onDone();
            }}
          >
            {["다시 볼래요", "기억했어요", "쉽게 설명할 수 있어요"][i]}
          </button>
        ))}
      </div>
    </div>
  );
}
