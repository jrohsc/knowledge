import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/content";
import { Explore } from "@/components/Explore";
import { Review } from "@/components/Review";
import { KnowledgeMap } from "@/components/KnowledgeMap";
import { ParallelTimeline } from "@/components/visuals/ParallelTimeline";
const titles: Record<string, string> = {
  explore: "탐색",
  review: "복습",
  map: "지식 지도",
  timeline: "타임라인",
};
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(titles).map((page) => ({ page }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return { title: titles[page] ?? "페이지 없음" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const topics = getCatalog();
  switch (page) {
    case "explore":
      return <Explore topics={topics} />;
    case "review":
      return <Review topics={topics} />;
    case "map":
      return <KnowledgeMap topics={topics} />;
    case "timeline":
      return (
        <div className="page timeline-page">
          <header className="page-intro">
            <span className="eyebrow">같은 시간, 다른 세계</span>
            <h1>
              그때, 다른 곳에서는
              <br />
              <em>무슨 일이 있었을까요?</em>
            </h1>
            <p>왕조와 문명, 사상과 발견을 하나의 시간축에 놓아보세요.</p>
          </header>
          <ParallelTimeline />
          <div className="source-note">
            연대표는 학습을 위한 개략 구간입니다. 개별 사건의 출처는 연결된
            기사에서 확인할 수 있습니다. 세계사의 기준 연대는{" "}
            <a
              href="https://www.britannica.com/topic/history-of-the-world"
              target="_blank"
              rel="noreferrer"
            >
              브리태니커 세계사
            </a>
            , 한국사는{" "}
            <a
              href="https://contents.history.go.kr/"
              target="_blank"
              rel="noreferrer"
            >
              국사편찬위원회 우리역사넷
            </a>
            을 참고합니다.
          </div>
        </div>
      );
    default:
      notFound();
  }
}
