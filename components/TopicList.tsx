import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { TopicSummary as Topic } from "@/lib/schema";
import { subjectById } from "@/content/subjects";
export function TopicList({
  topics,
  empty = "아직 기록이 없습니다. 관심 있는 글부터 읽어보세요.",
}: {
  topics: Topic[];
  empty?: string;
}) {
  return topics.length ? (
    <div className="topic-list">
      {topics.map((t) => (
        <Link href={`/topic/${t.id}/`} key={t.id}>
          <div>
            <span
              className="subject-label"
              style={{ color: subjectById[t.subject].color }}
            >
              {subjectById[t.subject].title}
            </span>
            <h3>{t.title}</h3>
          </div>
          <span className="reading-time">
            {t.estimatedReadingTime}분 <ArrowUpRight size={16} />
          </span>
        </Link>
      ))}
    </div>
  ) : (
    <p className="empty">{empty}</p>
  );
}
