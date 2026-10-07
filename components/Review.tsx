"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Download, Upload, Check, ArrowUpRight } from "lucide-react";
import type { Topic, TopicSummary } from "@/lib/schema";
import { dueTopics, localDay, statusLabels, streak } from "@/lib/learning";
import { parseProgress } from "@/lib/storage";
import { assetPath } from "@/lib/paths";
import { useProgress } from "./ProgressProvider";
import { QuickCheck, ReviewRating } from "./ArticleLearning";
export function Review({ topics }: { topics: TopicSummary[] }) {
  const { data, ready, restore } = useProgress();
  const [active, setActive] = useState<string | null>(null),
    [feedback, setFeedback] = useState(""),
    [pending, setPending] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const due = dueTopics(topics, data);
  const scheduled = topics
    .filter(
      (t) => data.topics[t.id]?.due && data.topics[t.id].due! > localDay(),
    )
    .sort((a, b) =>
      data.topics[a.id].due!.localeCompare(data.topics[b.id].due!),
    );
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  useEffect(() => {
    setActiveTopic(null);
    if (!active) return;
    const controller = new AbortController();
    fetch(assetPath(`data/topics/${active}.json`), {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setActiveTopic)
      .catch((e) => {
        if (e.name !== "AbortError") {
          setActive(null);
          setFeedback(
            "복습 내용을 불러오지 못했습니다. 연결을 확인하고 다시 시도해 주세요.",
          );
        }
      });
    return () => controller.abort();
  }, [active]);
  const read = topics.filter((t) => data.topics[t.id]?.lastViewed);
  const events = topics
    .flatMap((t) =>
      (data.topics[t.id]?.reviews ?? []).map((r) => ({ ...r, topic: t })),
    )
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 15);
  function backup() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `knowledge-backup-${localDay()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback("학습 기록 백업을 내려받았습니다.");
  }
  return (
    <div className="page review-page">
      <header className="page-intro">
        <span className="eyebrow">기억을 돌보는 시간</span>
        <h1>
          다시 만나면,
          <br />
          <em>조금 더 오래 남습니다.</em>
        </h1>
        <p>기억을 시험하기보다, 익숙한 생각을 다시 연결해보세요.</p>
      </header>
      <div className="review-stats">
        <div>
          <strong>{due.length}</strong>
          <span>오늘 복습할 지식</span>
        </div>
        <div>
          <strong>{read.length}</strong>
          <span>펼쳐 본 지식</span>
        </div>
        <div>
          <strong>
            {streak(data.activeDays)}
            <small>일</small>
          </strong>
          <span>이어 온 배움</span>
        </div>
      </div>
      {active && !activeTopic && (
        <p className="empty" role="status">
          복습 내용을 불러오는 중입니다.
        </p>
      )}
      {activeTopic ? (
        <section className="review-session">
          <button className="text-button" onClick={() => setActive(null)}>
            ← 복습 목록
          </button>
          <div className="section-heading">
            <h2>{activeTopic.title}</h2>
            <Link href={`/topic/${activeTopic.id}/`}>
              본문 다시 읽기 <ArrowUpRight size={16} />
            </Link>
          </div>
          <p className="session-instruction">
            먼저 답을 떠올려보세요. 선택하면 설명을 확인할 수 있습니다.
          </p>
          <QuickCheck key={activeTopic.id} topic={activeTopic} reviewMode />
          <ReviewRating
            id={activeTopic.id}
            onDone={() => {
              setActive(null);
              setFeedback("복습을 기록하고 다음 만날 날짜를 조정했습니다.");
            }}
          />
        </section>
      ) : (
        <section>
          <div className="section-heading">
            <h2>오늘 다시 만날 지식</h2>
            <span>{ready ? `${due.length}편` : "기록을 불러오는 중"}</span>
          </div>
          {due.length ? (
            <div className="review-list">
              {due.map((t) => (
                <div key={t.id}>
                  <div>
                    <span className="eyebrow">
                      {data.topics[t.id].due} ·{" "}
                      {statusLabels[data.topics[t.id].status]}
                    </span>
                    <h3>
                      <Link href={`/topic/${t.id}/`}>{t.title}</Link>
                    </h3>
                  </div>
                  <button
                    className="button secondary"
                    onClick={() => setActive(t.id)}
                  >
                    1분 복습 →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="review-empty">
              <Check size={28} strokeWidth={1} />
              <h3>오늘 예정된 복습을 모두 마쳤어요.</h3>
              <p>
                읽은 글에서 다음 복습일을 정하거나, 아래에서 원하는 지식을 다시
                만날 수 있습니다.
              </p>
              <Link href="/" className="inline-link">
                오늘의 지식 읽기 →
              </Link>
            </div>
          )}
        </section>
      )}
      <p className="feedback" role="status">
        {feedback}
      </p>
      <div className="two-columns">
        <section>
          <div className="section-heading">
            <h2>다가오는 복습</h2>
          </div>
          {scheduled.length ? (
            scheduled.map((t) => (
              <div className="scheduled-row" key={t.id}>
                <Link href={`/topic/${t.id}/`}>{t.title}</Link>
                <time>{data.topics[t.id].due}</time>
              </div>
            ))
          ) : (
            <p className="empty">예정된 복습이 없습니다.</p>
          )}
        </section>
        <section>
          <div className="section-heading">
            <h2>나의 지식</h2>
          </div>
          {read.length ? (
            read.map((t) => (
              <div className="scheduled-row" key={t.id}>
                <button className="text-button" onClick={() => setActive(t.id)}>
                  {t.title}
                </button>
                <span>{statusLabels[data.topics[t.id].status]}</span>
              </div>
            ))
          ) : (
            <p className="empty">처음 읽은 글부터 기록이 쌓입니다.</p>
          )}
        </section>
      </div>
      {events.length > 0 && (
        <section className="review-history">
          <div className="section-heading">
            <h2>최근 복습 기록</h2>
          </div>
          {events.map((e, i) => (
            <div className="scheduled-row" key={`${e.at}-${i}`}>
              <span>{e.topic.title}</span>
              <span>
                {
                  {
                    again: "다시 볼래요",
                    good: "기억했어요",
                    easy: "쉽게 설명했어요",
                  }[e.rating]
                }{" "}
                · {new Date(e.at).toLocaleDateString("ko-KR")}
              </span>
            </div>
          ))}
        </section>
      )}
      <section className="backup-section">
        <div>
          <span className="eyebrow">나의 기록 보관하기</span>
          <h2>배움은 쌓이고, 기록은 내 곁에.</h2>
          <p>
            학습 기록은 이 브라우저에 저장됩니다. 기기를 바꾸거나 브라우저
            데이터를 지우기 전 백업해두세요.
          </p>
        </div>
        <div className="button-row">
          <button className="button secondary" onClick={backup}>
            <Download size={16} />
            백업 내보내기
          </button>
          <button
            className="text-button"
            onClick={() => input.current?.click()}
          >
            <Upload size={16} />
            백업 가져오기
          </button>
          <input
            ref={input}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="학습 기록 백업 파일"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 5_000_000) {
                setFeedback("백업 파일은 5MB 이하여야 합니다.");
                return;
              }
              try {
                const raw = await file.text();
                parseProgress(raw);
                setPending(raw);
              } catch (err) {
                setFeedback(
                  err instanceof Error
                    ? err.message
                    : "백업을 읽지 못했습니다.",
                );
              }
              e.target.value = "";
            }}
          />
        </div>
        {pending && (
          <div className="restore-confirm" role="alert">
            <p>
              가져온 백업으로 현재 학습 기록을 교체합니다. 필요한 경우 먼저 현재
              기록을 내보내세요.
            </p>
            <div className="button-row">
              <button
                className="button"
                onClick={() => {
                  try {
                    restore(pending);
                    setPending(null);
                    setFeedback("백업을 복원했습니다.");
                  } catch {
                    setFeedback("저장 공간에 백업을 기록하지 못했습니다.");
                  }
                }}
              >
                기록 교체하기
              </button>
              <button className="text-button" onClick={() => setPending(null)}>
                취소
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
