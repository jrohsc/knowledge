import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { getArticles, getArticle, getTopics } from "@/lib/content";
import { subjectById } from "@/content/subjects";
import { relationships } from "@/content/relationships";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { ConceptSketch } from "@/components/visuals/ConceptSketch";
import * as visuals from "@/components/visuals";
import { ParallelTimeline } from "@/components/visuals/ParallelTimeline";
import {
  ReadingTracker,
  LearningControls,
  QuickCheck,
} from "@/components/ArticleLearning";
export const dynamicParams = false;
export function generateStaticParams() {
  return getArticles().map((a) => ({ id: a.meta.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticle(id);
  return { title: article?.meta.title, description: article?.meta.summary };
}
export default async function Article({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticle(id);
  if (!article) notFound();
  const t = article.meta,
    s = subjectById[t.subject];
  const topics = getTopics();
  const related = t.relatedTopics
    .map((id) => topics.find((t) => t.id === id))
    .filter((t) => !!t);
  return (
    <div className="article-page page">
      <nav className="breadcrumbs" aria-label="현재 위치">
        <Link href="/explore/">탐색</Link>
        <span>/</span>
        <Link href={`/explore/?subject=${s.id}`}>{s.title}</Link>
        <span>/</span>
        <span>{t.subcategory}</span>
      </nav>
      <header className="article-header">
        <span className="subject-label" style={{ color: s.color }}>
          {s.title} · {t.subcategory}
        </span>
        <h1>{t.title}</h1>
        <p className="english-title">{t.englishTitle}</p>
        <div className="article-meta">
          <span>{t.subtitle}</span>
          <span>
            <Clock3 size={14} />
            {t.estimatedReadingTime}분 · {t.difficulty}
          </span>
        </div>
        <p className="article-deck">{t.summary}</p>
        {t.prerequisites.length > 0 && (
          <p className="prerequisites">
            먼저 읽으면 좋은 글{" "}
            {t.prerequisites.map((id) => (
              <Link key={id} href={`/topic/${id}/`}>
                {topics.find((t) => t.id === id)?.title}
              </Link>
            ))}
          </p>
        )}
        <ReadingTracker id={t.id} />
      </header>
      <HeroVisual topic={t} />
      <div className="reading-layout">
        <aside className="article-toc">
          <span className="eyebrow">이 글의 흐름</span>
          <Link href="/#knowledge-overview">전체 지식 목차 ↗</Link>
          <a href="#overview">한눈에 보기</a>
          <a href="#why">왜 알아야 할까?</a>
          <a href="#body">배경과 핵심 내용</a>
          <a href="#takeaways">기억할 5가지</a>
          <a href="#connections">연결되는 지식</a>
          <a href="#quick-check">1분 복습</a>
          <Link href={`/map/?focus=${t.id}`}>지식 지도에서 보기 ↗</Link>
        </aside>
        <div className="article-reading">
          <section id="overview" className="article-section">
            <h2>한눈에 보기</h2>
            <p>{t.overview}</p>
          </section>
          <section id="why" className="why-section">
            <span className="eyebrow">왜 알아야 할까?</span>
            <p>{t.whyItMatters}</p>
          </section>
          {t.visual !== "history" && <ConceptSketch topic={t.id} />}
          <div id="body" className="prose">
            <MDXRemote
              source={article.content}
              components={{ ...visuals, ParallelTimeline }}
              options={{
                blockJS: false,
                blockDangerousJS: true,
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkMath],
                  rehypePlugins: [rehypeKatex],
                },
              }}
            />
          </div>
          {t.timelineEvents.length > 0 && (
            <section className="article-section">
              <h2>시간의 흐름</h2>
              <visuals.HistoricalTimeline events={t.timelineEvents} />
            </section>
          )}
          <section id="takeaways" className="takeaways">
            <span className="eyebrow">이 다섯 가지만 남아도 좋아요</span>
            <h2>꼭 기억할 5가지</h2>
            <ol>
              {t.takeaways.map((text, i) => (
                <li key={text}>
                  <span>0{i + 1}</span>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </section>
          <section id="connections" className="article-connections">
            <div className="section-heading">
              <h2>연결되는 지식</h2>
              <Link href={`/map/?focus=${t.id}`}>지도 펼치기 ↗</Link>
            </div>
            {related.map((other) => {
              const relation = relationships.find(
                (r) =>
                  (r.from === t.id && r.to === other.id) ||
                  (r.to === t.id && r.from === other.id),
              );
              return (
                <Link key={other.id} href={`/topic/${other.id}/`}>
                  <div>
                    <span
                      className="subject-label"
                      style={{ color: subjectById[other.subject].color }}
                    >
                      {subjectById[other.subject].title}
                    </span>
                    <h3>{other.title}</h3>
                    <p>{relation?.label ?? other.summary}</p>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
              );
            })}
          </section>
          <QuickCheck topic={t} />
          <LearningControls topic={t} />
          <details className="article-sources">
            <summary>참고 자료와 편집 정보</summary>
            <p>
              핵심 개념을 다시 이해하기 위한 설명입니다. 더 자세한 논의는 아래
              자료에서 이어 읽을 수 있습니다.
            </p>
            <ul>
              {t.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title} ↗
                  </a>
                </li>
              ))}
            </ul>
            <p>
              최근 편집: {t.updatedAt} · 읽기 시간에는 그림 탐색과 짧은 복습이
              포함됩니다.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
