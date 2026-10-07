"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { TopicSummary as Topic } from "@/lib/schema";
import { relationships } from "@/content/relationships";
import { subjects, subjectById } from "@/content/subjects";
export function KnowledgeMap({ topics }: { topics: Topic[] }) {
  const [focus, setFocus] = useState("newton-laws"),
    [subject, setSubject] = useState("all"),
    [period, setPeriod] = useState("all"),
    [kind, setKind] = useState("all");
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("focus");
    if (id && topics.some((t) => t.id === id)) setFocus(id);
  }, [topics]);
  const topic = topics.find((t) => t.id === focus)!;
  const visible = topics.filter(
    (t) =>
      (subject === "all" || t.subject === subject) &&
      (period === "all" || t.period === period) &&
      (kind === "all" || t.kind === kind),
  );
  const ids = new Set(visible.map((t) => t.id));
  const edges = relationships.filter(
    (r) =>
      (r.from === focus || r.to === focus) &&
      ids.has(r.from === focus ? r.to : r.from),
  );
  const neighbors = edges.map((r) => ({
    edge: r,
    t: topics.find((t) => t.id === (r.from === focus ? r.to : r.from))!,
  }));
  return (
    <div className="page map-page">
      <header className="page-intro">
        <span className="eyebrow">단편에서 연결로</span>
        <h1>
          하나의 지식은
          <br />
          <em>다른 세계로 이어집니다.</em>
        </h1>
        <p>연결선을 따라가며 두 생각 사이의 이유를 읽어보세요.</p>
      </header>
      <div className="map-filters">
        <label>
          중심 지식
          <select value={focus} onChange={(e) => setFocus(e.target.value)}>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          연결 분야
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="all">모든 분야</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          시대
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="all">모든 시대</option>
            {["고대", "근세", "근현대", "시대 없음"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label>
          유형
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="all">모든 유형</option>
            {["사람", "개념", "사건"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="knowledge-neighborhood">
        <div className="map-center">
          <span className="eyebrow">지금 바라보는 생각</span>
          <span
            className="subject-label"
            style={{ color: subjectById[topic.subject].color }}
          >
            {subjectById[topic.subject].title}
          </span>
          <Link href={`/topic/${topic.id}/`}>
            <h2>
              {topic.title}
              <ArrowUpRight size={22} />
            </h2>
          </Link>
          <p>{topic.summary}</p>
          <div className="map-node-dot" />
        </div>
        <div className="map-neighbors">
          {neighbors.length ? (
            neighbors.map(({ edge, t }) => (
              <div className="map-connection" key={t.id}>
                <div className="connection-label">
                  <span className="eyebrow">{edge.type}</span>
                  <p>{edge.label}</p>
                  <span className="connection-direction">
                    {edge.from === focus
                      ? "중심에서 이어지는 연결 →"
                      : "← 중심으로 향하는 연결"}
                  </span>
                </div>
                <div
                  className="map-node"
                  style={
                    {
                      "--subject": subjectById[t.subject].color,
                    } as React.CSSProperties
                  }
                >
                  <span className="subject-label">
                    {subjectById[t.subject].title}
                  </span>
                  <Link href={`/topic/${t.id}/`}>
                    <h3>
                      {t.title} <ArrowUpRight size={17} />
                    </h3>
                  </Link>
                  <p>{t.summary}</p>
                  <button
                    className="text-button"
                    onClick={() => setFocus(t.id)}
                  >
                    이 지식을 중심으로 <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">
              선택한 필터에 맞는 연결이 없습니다.
              <button
                className="text-button"
                onClick={() => {
                  setSubject("all");
                  setPeriod("all");
                  setKind("all");
                }}
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="map-legend">
        <span>연결은 직접적인 영향만을 뜻하지 않습니다.</span>
        <p>
          배경 · 확장 · 대조 · 도구의 관계로 큐레이션했습니다. 중심 지식은
          필터와 관계없이 유지됩니다.
        </p>
      </div>
      <section className="learning-paths">
        <div className="section-heading">
          <h2>이렇게 이어 읽어보세요</h2>
          <span>세 가지 생각의 길</span>
        </div>
        {[
          { title: "운동에서 변화율로", ids: ["newton-laws", "derivative"] },
          {
            title: "분자에서 생명의 변화로",
            ids: ["periodic-table", "dna", "evolution"],
          },
          {
            title: "기계에서 확률의 세계로",
            ids: ["industrial-revolution", "entropy", "probability"],
          },
        ].map((path) => (
          <div className="learning-path" key={path.title}>
            <h3>{path.title}</h3>
            <div>
              {path.ids.map((id, i) => (
                <span key={id}>
                  {i > 0 && <ArrowRight size={15} />}
                  <Link href={`/topic/${id}/`}>
                    {topics.find((t) => t.id === id)?.title}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
