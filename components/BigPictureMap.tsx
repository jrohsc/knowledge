"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";
import type { TopicSummary } from "@/lib/schema";
import { readingConnections } from "@/content/learning-paths";
import { subjects, subjectById } from "@/content/subjects";
import { SketchDrawing } from "./visuals/SketchDrawing";
const fields = [
  { id: "역사", question: "무엇이 달라졌는가", scene: "roman-empire" },
  { id: "철학", question: "무엇이 옳고 참인가", scene: "socrates" },
  { id: "과학", question: "어떻게 작동하는가", scene: "newton-laws" },
  { id: "수학", question: "어떤 규칙이 있는가", scene: "derivative" },
];
export function BigPictureMap({ topics }: { topics: TopicSummary[] }) {
  const [selected, setSelected] = useState("역사"),
    [pathId, setPathId] = useState<string | null>(null),
    [step, setStep] = useState(0),
    [playing, setPlaying] = useState(false);
  const path = readingConnections.find((p) => p.id === pathId);
  useEffect(() => {
    if (!playing || !path) return;
    if (step >= path.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 2600);
    return () => clearTimeout(timer);
  }, [playing, step, path]);
  function choosePath(id: string | null) {
    setPlaying(false);
    setStep(0);
    setPathId(id);
  }
  const linkedTopics = topics.filter(
    (t) => subjects.find((s) => s.id === t.subject)?.group === selected,
  );
  return (
    <div className="big-picture">
      <div className="picture-switcher" aria-label="큰 그림의 관점">
        <button aria-pressed={!path} onClick={() => choosePath(null)}>
          네 가지 시선
        </button>
        {readingConnections.map((p) => (
          <button
            key={p.id}
            aria-pressed={pathId === p.id}
            onClick={() => choosePath(p.id)}
          >
            {p.title}
          </button>
        ))}
      </div>
      {!path ? (
        <>
          <div
            className="world-map"
            role="group"
            aria-label="역사·철학·과학·수학의 관계 지도"
          >
            <svg
              className="world-map-lines"
              viewBox="0 0 1000 340"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M150 80H850M150 80V260M850 80V260M150 260H850"
                fill="none"
                stroke="var(--line-strong)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M150 80 500 170 850 80M150 260 500 170 850 260"
                fill="none"
                stroke="var(--green)"
                strokeDasharray="3 6"
                opacity=".3"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="world-map-center">
              <span>하나의 세계</span>
              <small>서로 다른 네 가지 질문</small>
            </div>
            <span className="world-relation world-relation-top">
              권리와 정당성
            </span>
            <span className="world-relation world-relation-bottom">
              변화와 패턴의 언어
            </span>
            {fields.map((f, i) => (
              <button
                key={f.id}
                className={`world-field world-field-${i}`}
                aria-pressed={selected === f.id}
                onClick={() => setSelected(f.id)}
              >
                <SketchDrawing
                  topic={f.scene}
                  stage={f.id === "철학" ? 2 : 0}
                />
                <span>
                  <strong>{f.id}</strong>
                  <small>{f.question}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="field-inspector">
            <div>
              <span className="eyebrow">{selected}에서 시작하기</span>
              <p>
                {
                  {
                    역사: "시간 속의 변화는 철학의 질문과 과학의 발견을 만납니다.",
                    철학: "지식의 근거와 좋은 삶의 기준은 모든 분야를 가로지릅니다.",
                    과학: "자연의 작동 원리는 수학으로 표현되고 역사를 바꿉니다.",
                    수학: "변화와 우연을 표현하는 언어로 과학의 설명을 더 정확하게 만듭니다.",
                  }[selected]
                }
              </p>
            </div>
            <div className="field-topic-links">
              {linkedTopics.map((t) => (
                <Link key={t.id} href={`/topic/${t.id}/`}>
                  {t.title}
                  <ArrowUpRight size={13} />
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="animated-reading-path">
          <div className="path-intro">
            <span className="eyebrow">분야를 건너 읽는 방법</span>
            <h3>{path.introduction}</h3>
            <p>
              노드를 누르면 글로 이동합니다. 재생하면 연결의 이유를 차례로 볼 수
              있어요.
            </p>
          </div>
          <ol
            className="reading-path-steps"
            style={{ "--step-count": path.steps.length } as React.CSSProperties}
          >
            {path.steps.map((s, i) => {
              const t = topics.find((t) => t.id === s.topic)!;
              return (
                <li
                  className={`${i <= step ? "is-revealed" : ""} ${i === step ? "is-current" : ""}`}
                  key={s.topic}
                >
                  {i > 0 && (
                    <span className="path-bridge">
                      {s.bridge}
                      <ArrowRight size={15} />
                    </span>
                  )}
                  <Link
                    href={`/topic/${t.id}/`}
                    aria-current={i === step ? "step" : undefined}
                  >
                    <SketchDrawing topic={t.id} stage={i === step ? 1 : 0} />
                    <span
                      className="subject-label"
                      style={{ color: subjectById[t.subject].color }}
                    >
                      {subjectById[t.subject].title}
                    </span>
                    <h4>
                      {t.title}
                      <ArrowUpRight size={14} />
                    </h4>
                  </Link>
                </li>
              );
            })}
          </ol>
          <div className="path-explanation" aria-live="polite">
            <span className="path-step-count">
              0{step + 1} / 0{path.steps.length}
            </span>
            <div>
              <h4>{path.steps[step].heading}</h4>
              <p>{path.steps[step].explanation}</p>
            </div>
          </div>
          <div className="path-controls">
            <button
              className="button secondary"
              onClick={() => {
                if (step === path.steps.length - 1) setStep(0);
                setPlaying((p) => !p);
              }}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}{" "}
              {playing
                ? "일시 정지"
                : step === path.steps.length - 1
                  ? "처음부터 재생"
                  : "흐름 재생"}
            </button>
            <button
              className="icon-button"
              aria-label="이전 연결"
              disabled={step === 0}
              onClick={() => {
                setPlaying(false);
                setStep((s) => s - 1);
              }}
            >
              <ArrowLeft size={17} />
            </button>
            <button
              className="icon-button"
              aria-label="다음 연결"
              disabled={step === path.steps.length - 1}
              onClick={() => {
                setPlaying(false);
                setStep((s) => s + 1);
              }}
            >
              <ArrowRight size={17} />
            </button>
            <button className="text-button" onClick={() => choosePath(null)}>
              <RotateCcw size={13} />
              전체 그림
            </button>
          </div>
          <p className="path-clarification">
            화살표는 이해를 넓히는 읽기 순서입니다. 모든 연결이 역사적
            인과관계를 뜻하지는 않습니다.
          </p>
        </div>
      )}
    </div>
  );
}
