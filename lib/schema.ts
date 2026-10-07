export type SubjectId = string;
export type Mastery = "new" | "learning" | "familiar" | "mastered";
export type VisualKind =
  | "revolution"
  | "cave"
  | "entropy"
  | "derivative"
  | "dna"
  | "probability"
  | "evolution"
  | "newton"
  | "periodic"
  | "history"
  | "argument"
  | "industry";
export interface Question {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}
export interface Topic {
  id: string;
  title: string;
  englishTitle: string;
  subtitle: string;
  subject: SubjectId;
  subcategory: string;
  period: "고대" | "근세" | "근현대" | "시대 없음";
  estimatedReadingTime: number;
  kind: "개념" | "사람" | "사건";
  difficulty: "기초" | "심화";
  prerequisites: string[];
  relatedTopics: string[];
  keywords: string[];
  summary: string;
  overview: string;
  whyItMatters: string;
  takeaways: string[];
  timelineEvents: { year: number; label: string }[];
  reviewQuestions: Question[];
  sources: { title: string; url: string }[];
  visual: VisualKind;
  updatedAt: string;
}
export interface Subject {
  id: SubjectId;
  title: string;
  group: string;
  color: string;
  description: string;
  categories: string[];
}
export interface Relationship {
  from: string;
  to: string;
  label: string;
  type: "배경" | "확장" | "대조" | "도구";
}
/** Lightweight catalog shipped to discovery/search pages. Full prose stays in MDX. */
export type TopicSummary = Pick<
  Topic,
  | "id"
  | "title"
  | "englishTitle"
  | "subtitle"
  | "subject"
  | "subcategory"
  | "period"
  | "estimatedReadingTime"
  | "kind"
  | "difficulty"
  | "prerequisites"
  | "relatedTopics"
  | "keywords"
  | "summary"
>;
