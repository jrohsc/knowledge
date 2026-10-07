"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { subjects, subjectById } from "@/content/subjects";
import { searchTopics, statusLabels } from "@/lib/learning";
import type { TopicSummary as Topic } from "@/lib/schema";
import { useProgress } from "./ProgressProvider";
export function Explore({ topics }: { topics: Topic[] }) {
  const [selected, setSelected] = useState("all"),
    [query, setQuery] = useState("");
  const { data } = useProgress();
  useEffect(() => {
    const value = new URLSearchParams(location.search).get("subject");
    if (value && subjects.some((s) => s.id === value)) setSelected(value);
  }, []);
  function choose(id: string) {
    setSelected(id);
    const url = new URL(location.href);
    if (id === "all") url.searchParams.delete("subject");
    else url.searchParams.set("subject", id);
    history.replaceState(null, "", url);
  }
  const matches = new Set(searchTopics(topics, query).map((t) => t.id));
  const filtered = topics.filter(
    (t) =>
      (selected === "all" || selected === t.subject) &&
      (!query || matches.has(t.id)),
  );
  return (
    <div className="page">
      <header className="page-intro">
        <span className="eyebrow">지식의 서가</span>
        <h1>
          넓게 둘러보고,
          <br />
          <em>깊이 이해하기.</em>
        </h1>
        <p>서로 다른 분야를 한 장의 목차처럼 펼쳐보세요.</p>
      </header>
      <div className="explore-layout">
        <aside className="subject-sidebar">
          <h2 className="eyebrow">분야</h2>
          <button
            aria-pressed={selected === "all"}
            onClick={() => choose("all")}
          >
            전체 지식 <span>{topics.length}</span>
          </button>
          {["역사", "철학", "과학", "수학"].map((group) => (
            <div key={group}>
              <h3>{group}</h3>
              {subjects
                .filter((s) => s.group === group)
                .map((s) => (
                  <button
                    key={s.id}
                    aria-pressed={selected === s.id}
                    onClick={() => choose(s.id)}
                  >
                    <i style={{ background: s.color }} />
                    {s.title}
                    <span>
                      {topics.filter((t) => t.subject === s.id).length}
                    </span>
                  </button>
                ))}
            </div>
          ))}
        </aside>
        <div>
          <label className="inline-search">
            <Search size={18} />
            <span className="sr-only">분야 안에서 검색</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="제목, 영문 이름, 관련 개념으로 찾기"
            />
          </label>
          <p className="result-count" role="status">
            {filtered.length}편의 지식
          </p>
          {subjects
            .filter((s) => selected === "all" || s.id === selected)
            .map((s) => {
              const entries = filtered.filter((t) => t.subject === s.id);
              if (!entries.length && query) return null;
              return (
                <section
                  key={s.id}
                  className="subject-section"
                  style={{ "--subject": s.color } as React.CSSProperties}
                >
                  <header>
                    <div>
                      <span className="subject-label">{s.group}</span>
                      <h2>{s.title}</h2>
                    </div>
                    <p>{s.description}</p>
                  </header>
                  <div className="category-index">
                    {s.categories.map((c) => {
                      const count = topics.filter(
                        (t) => t.subject === s.id && t.subcategory === c,
                      ).length;
                      return (
                        <span key={c} className={count ? "has-content" : ""}>
                          {c}
                          {count > 0 && <small>{count}</small>}
                        </span>
                      );
                    })}
                  </div>
                  {entries.length ? (
                    entries.map((t) => (
                      <Link
                        className="explore-topic"
                        href={`/topic/${t.id}/`}
                        key={t.id}
                      >
                        <div>
                          <span className="eyebrow">
                            {t.subcategory} · {t.estimatedReadingTime}분
                          </span>
                          <h3>
                            {t.title}
                            <small>{t.englishTitle}</small>
                          </h3>
                          <p>{t.summary}</p>
                        </div>
                        <span className="topic-status">
                          {statusLabels[data.topics[t.id]?.status ?? "new"]}
                          <ArrowUpRight size={18} />
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="empty">
                      현재 이 분야에 등록된 글이 없습니다.
                    </p>
                  )}
                </section>
              );
            })}
          {!filtered.length && query && (
            <p className="empty">
              찾는 지식이 없습니다. 검색어를 바꾸거나 전체 분야를 선택해보세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
