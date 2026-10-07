"use client";
import { useState } from "react";
import { BigPictureMap } from "./BigPictureMap";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Network,
  History,
  Bookmark,
  Library,
} from "lucide-react";
import type { TopicSummary } from "@/lib/schema";
import { subjects } from "@/content/subjects";
import { SketchDrawing } from "./visuals/SketchDrawing";
const sections = [
  {
    group: "역사",
    scene: "roman-empire",
    question: "세상은 어떻게 달라졌을까?",
  },
  { group: "철학", scene: "socrates", question: "당연한 것을 다시 묻는다면?" },
  {
    group: "과학",
    scene: "newton-laws",
    question: "보이는 현상 뒤에는 무엇이 있을까?",
  },
  {
    group: "수학",
    scene: "derivative",
    question: "변화와 우연에도 규칙이 있을까?",
  },
];
export function HomeOverview({ topics }: { topics: TopicSummary[] }) {
  const [view, setView] = useState<"map" | "contents">("map");
  return (
    <section
      id="knowledge-overview"
      className="knowledge-overview"
      aria-labelledby="overview-heading"
    >
      <div className="overview-heading">
        <div>
          <span className="eyebrow">백과사전 펼쳐보기</span>
          <h2 id="overview-heading">한눈에 보는 지식</h2>
        </div>
        <p>궁금한 곳부터, 한 번에 들어가세요.</p>
      </div>
      <nav className="overview-shortcuts" aria-label="학습 바로가기">
        <a href="#today-reading">
          <ArrowDown size={15} />
          오늘의 읽기
        </a>
        <Link href="/explore/">
          <Library size={15} />
          전체 탐색
        </Link>
        <Link href="/timeline/">
          <History size={15} />
          평행 타임라인
        </Link>
        <Link href="/map/">
          <Network size={15} />
          지식 지도
        </Link>
        <Link href="/review/">
          <Bookmark size={15} />
          나의 복습
        </Link>
      </nav>
      <div className="overview-view-switch" aria-label="지식 안내 보기 방식">
        <button aria-pressed={view === "map"} onClick={() => setView("map")}>
          큰 그림으로 보기
        </button>
        <button
          aria-pressed={view === "contents"}
          onClick={() => setView("contents")}
        >
          전체 목차 · {topics.length}편
        </button>
      </div>
      {view === "map" ? (
        <BigPictureMap topics={topics} />
      ) : (
        <nav className="overview-catalog" aria-label="지식 전체 목차">
          {sections.map(({ group, scene, question }) => (
            <section key={group} className="overview-column">
              <div className="overview-category">
                <div>
                  <h3>{group}</h3>
                  <p>{question}</p>
                </div>
                <SketchDrawing topic={scene} stage={group === "철학" ? 2 : 0} />
              </div>
              {subjects
                .filter((s) => s.group === group)
                .map((s) => (
                  <div key={s.id} className="overview-subject">
                    <Link
                      className="overview-subject-link"
                      href={`/explore/?subject=${s.id}`}
                      style={{ color: s.color }}
                    >
                      {s.title}
                      <ArrowUpRight size={12} />
                    </Link>
                    <ul>
                      {topics
                        .filter((t) => t.subject === s.id)
                        .map((t) => (
                          <li key={t.id}>
                            <Link href={`/topic/${t.id}/`}>
                              <span>{t.title}</span>
                              <small>{t.estimatedReadingTime}분</small>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </section>
          ))}
        </nav>
      )}
      <div className="overview-footnote">
        <span>
          {subjects.length}개 분야 · {topics.length}편의 지식
        </span>
        <a href="#today-reading">
          어디서 시작할지 고민된다면, 오늘의 추천으로 <ArrowDown size={13} />
        </a>
      </div>
    </section>
  );
}
