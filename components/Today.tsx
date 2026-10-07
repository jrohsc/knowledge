"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Shuffle,
  MoveUpRight,
  Leaf,
} from "lucide-react";
import { subjects, subjectById } from "@/content/subjects";
import type { TopicSummary as Topic } from "@/lib/schema";
import { dailyTopics, dueTopics, localDay, streak } from "@/lib/learning";
import { useProgress } from "./ProgressProvider";
import { TopicList } from "./TopicList";
import { HomeOverview } from "./HomeOverview";
const prompts: Record<string, string> = {
  "french-revolution": "왜 오래된 정치 질서는 무너졌을까?",
  "roman-empire": "무엇이 거대한 제국을 하나로 묶었을까?",
  "industrial-revolution": "기계는 어떻게 삶의 방식을 바꾸었을까?",
  joseon: "500년의 왕조는 어떻게 변화했을까?",
  "korean-war": "전투가 멈춘 뒤에도 남은 것은 무엇일까?",
  socrates: "우리가 안다고 믿는 것을 어떻게 검토할까?",
  "plato-cave": "우리가 보고 있는 것이 정말 현실일까?",
  entropy: "왜 시간은 한 방향으로 흐르는 듯할까?",
  "newton-laws": "움직이는 데 힘이 필요한 걸까?",
  evolution: "목적 없이도 적응이 생길 수 있을까?",
  dna: "생명의 정보는 어떻게 기능이 될까?",
  "periodic-table": "원소의 성질에는 어떤 패턴이 있을까?",
  derivative: "바로 지금의 변화를 어떻게 측정할까?",
  probability: "우연 속에서도 규칙을 찾을 수 있을까?",
};
function EditorialOrbit() {
  return (
    <svg className="editorial-orbit" viewBox="0 0 320 280" aria-hidden="true">
      <circle
        cx="160"
        cy="135"
        r="96"
        stroke="currentColor"
        fill="none"
        opacity=".15"
      />
      <ellipse
        cx="160"
        cy="135"
        rx="122"
        ry="45"
        transform="rotate(-32 160 135)"
        stroke="currentColor"
        fill="none"
        opacity=".35"
      />
      <ellipse
        cx="160"
        cy="135"
        rx="122"
        ry="45"
        transform="rotate(42 160 135)"
        stroke="currentColor"
        fill="none"
        opacity=".35"
      />
      <path d="M160 30v210M55 135h210" stroke="currentColor" opacity=".12" />
      <circle cx="160" cy="135" r="6" fill="var(--gold)" />
      <circle cx="75" cy="196" r="5" fill="var(--green)" />
      <circle cx="246" cy="80" r="4" fill="var(--blue)" />
      <text x="160" y="270" textAnchor="middle">
        하나의 생각에서, 더 넓은 세계로
      </text>
    </svg>
  );
}
export function Today({ topics }: { topics: Topic[] }) {
  const { data, ready } = useProgress();
  const [day, setDay] = useState(""),
    [random, setRandom] = useState<Topic | null>(null);
  useEffect(() => {
    setDay(localDay());
    const tick = setInterval(() => setDay(localDay()), 60000);
    return () => clearInterval(tick);
  }, []);
  const initial = [
    "french-revolution",
    "plato-cave",
    "entropy",
    "derivative",
  ].map((id) => topics.find((t) => t.id === id)!);
  const daily = day ? dailyTopics(topics, day) : initial;
  const minutes = daily.reduce((sum, t) => sum + t.estimatedReadingTime, 0);
  const recent = topics
    .filter((t) => data.topics[t.id]?.lastViewed)
    .sort((a, b) =>
      data.topics[b.id].lastViewed!.localeCompare(
        data.topics[a.id].lastViewed!,
      ),
    );
  const continuing = recent
    .filter(
      (t) =>
        data.topics[t.id].status === "learning" &&
        !data.topics[t.id].completedAt,
    )
    .slice(0, 3);
  const due = dueTopics(topics, data);
  const learned = topics.filter((t) =>
    ["familiar", "mastered"].includes(data.topics[t.id]?.status),
  ).length;
  const featured = random ?? topics.find((t) => t.id === "dna")!;
  return (
    <div className="page today-page">
      <section className="today-intro">
        <div>
          <div className="eyebrow intro-date">
            <span className="little-dot" />
            매일 조금 더 선명한 세계{" "}
            <span>
              {day
                ? new Date(`${day}T12:00:00`).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })
                : "오늘의 작은 배움"}
            </span>
          </div>
          <h1>
            오늘은 무엇을
            <br />
            다시 <em>알아볼까요?</em>
          </h1>
          <p>
            잊었던 생각을 되찾고, 새로운 연결을 발견하는 시간.
            <br />
            오늘 {minutes}분이면 네 가지 지식을 다시 만날 수 있습니다.
          </p>
        </div>
        <EditorialOrbit />
      </section>
      <HomeOverview topics={topics} />
      <div className="today-columns" id="today-reading">
        <section className="daily-selection">
          <div className="section-heading">
            <h2>오늘의 지식</h2>
            <span className="eyebrow">네 가지 시선, 하나의 세계</span>
          </div>
          <ol className="editorial-list">
            {daily.map((t, i) => (
              <li key={t.id}>
                <Link href={`/topic/${t.id}/`}>
                  <span className="article-number">0{i + 1}</span>
                  <div className="daily-topic">
                    <span
                      className="subject-label"
                      style={{ color: subjectById[t.subject].color }}
                    >
                      {subjectById[t.subject].title}
                    </span>
                    <h3>{t.title}</h3>
                    <p>{prompts[t.id] ?? t.summary}</p>
                  </div>
                  <span className="daily-time">
                    {t.estimatedReadingTime}분 <ArrowUpRight size={19} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="daily-note">
            <Leaf size={15} />
            <span>
              다 읽지 않아도 괜찮습니다. 하나의 생각이 남으면 충분해요.
            </span>
          </div>
        </section>
        <aside className="today-aside">
          <div className="margin-note">
            <span className="eyebrow">오늘의 질문</span>
            <blockquote>
              아는 것이 많아지는 것과
              <br />
              이해가 깊어지는 것은
              <br />
              어떻게 다를까요?
            </blockquote>
            <p>지식과 지식 사이의 연결을 찾아보세요.</p>
            <Link href="/map/" className="inline-link">
              지식 지도 펼치기 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="quiet-progress">
            <span className="eyebrow">나의 지식 현황</span>
            <div className="progress-numbers">
              <div>
                <strong>
                  {ready ? learned : "—"}
                  <small> / {topics.length}</small>
                </strong>
                <span>익숙해진 지식</span>
              </div>
              <div>
                <strong>
                  {ready ? streak(data.activeDays) : "—"}
                  <small>일</small>
                </strong>
                <span>이어 온 배움</span>
              </div>
            </div>
            <div className="progress-rule">
              <span style={{ width: `${(learned / topics.length) * 100}%` }} />
            </div>
            <p>기록은 이 브라우저에 보관됩니다.</p>
          </div>
          <Link href="/timeline/" className="timeline-teaser">
            <span className="eyebrow">시간 속에서 만나기</span>
            <h3>그때, 다른 곳에서는?</h3>
            <div className="mini-timeline">
              <span>유럽</span>
              <i />
              <span>한국</span>
              <i />
              <span>중국</span>
              <i />
            </div>
            <p>같은 시대의 다른 세계를 나란히.</p>
            <MoveUpRight size={18} />
          </Link>
        </aside>
      </div>
      <div className="two-columns lower-section">
        <section>
          <div className="section-heading">
            <h2>이어서 읽기</h2>
            <span>생각이 멈춘 자리에서</span>
          </div>
          <TopicList
            topics={continuing}
            empty="읽기 시작한 글이 여기에 이어집니다. 오늘의 지식에서 한 편을 골라보세요."
          />
        </section>
        <section>
          <div className="section-heading">
            <h2>
              복습할 지식 <small>{due.length}</small>
            </h2>
            <Link href="/review/">모두 보기 →</Link>
          </div>
          <TopicList
            topics={due.slice(0, 3)}
            empty="오늘 예정된 복습이 없습니다. 글을 읽은 뒤 다음 만날 날짜를 정해보세요."
          />
        </section>
      </div>
      <section className="random-feature">
        <div>
          <span className="eyebrow">우연히 만나는 지식</span>
          <h2>
            <Link href={`/topic/${featured.id}/`}>
              {featured.title} <ArrowUpRight size={24} />
            </Link>
          </h2>
          <p>{featured.summary}</p>
        </div>
        <button
          className="text-button"
          onClick={() => {
            const pool = topics.filter((t) => t.id !== featured.id);
            setRandom(pool[Math.floor(Math.random() * pool.length)]);
          }}
        >
          <Shuffle size={16} />
          다른 지식 만나기
        </button>
      </section>
      <section className="explore-home">
        <div className="section-heading">
          <h2>어떤 세계가 궁금한가요?</h2>
          <Link href="/explore/">분야별 탐색 →</Link>
        </div>
        <div className="subject-grid">
          {subjects.map((s, i) => (
            <Link
              key={s.id}
              href={`/explore/?subject=${s.id}`}
              style={{ "--subject": s.color } as React.CSSProperties}
            >
              <span className="subject-index">0{i + 1}</span>
              <h3>
                {s.title}
                <ArrowUpRight size={17} />
              </h3>
              <p>{s.description}</p>
              <small>
                {topics.filter((t) => t.subject === s.id).length}편의 지식
              </small>
            </Link>
          ))}
        </div>
      </section>
      {recent.length > 0 && (
        <section className="recent-section">
          <div className="section-heading">
            <h2>최근 읽은 글</h2>
            <span>다시 펼쳐 보기</span>
          </div>
          <TopicList topics={recent.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
