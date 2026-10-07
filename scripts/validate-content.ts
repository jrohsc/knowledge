import assert from "node:assert/strict";
import katex from "katex";
import fs from "node:fs";
import path from "node:path";
import { parseArticle as matter } from "../lib/frontmatter";
import { subjects } from "../content/subjects";
import { relationships } from "../content/relationships";
import { timelineBands } from "../content/timeline";
import { illustrations } from "../content/illustrations";
import { readingConnections } from "../content/learning-paths";
const dir = path.resolve("content/articles");
const articles = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".mdx"))
  .map((file) => ({
    file,
    ...matter(fs.readFileSync(path.join(dir, file), "utf8")),
  }));
const ids = new Set(articles.map((a) => a.data.id));
assert.equal(ids.size, articles.length, "글 ID는 중복될 수 없습니다.");
const visuals = [
  "revolution",
  "cave",
  "entropy",
  "derivative",
  "dna",
  "probability",
  "evolution",
  "newton",
  "periodic",
  "history",
  "argument",
  "industry",
];
for (const { file, data: d, content } of articles) {
  const prefix = `${file}: `;
  assert.match(d.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.equal(file, `${d.id}.mdx`);
  for (const k of [
    "title",
    "englishTitle",
    "subtitle",
    "summary",
    "overview",
    "whyItMatters",
  ])
    assert.ok(typeof d[k] === "string" && d[k].length > 0, prefix + k);
  assert.ok(
    subjects.some(
      (s) => s.id === d.subject && s.categories.includes(d.subcategory),
    ),
    prefix + "분류",
  );
  assert.ok(["고대", "근세", "근현대", "시대 없음"].includes(d.period));
  assert.ok(["개념", "사람", "사건"].includes(d.kind));
  assert.ok(["기초", "심화"].includes(d.difficulty));
  assert.ok(visuals.includes(d.visual));
  assert.ok(
    Number.isInteger(d.estimatedReadingTime) && d.estimatedReadingTime > 0,
  );
  assert.match(d.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(d.takeaways.length, 5, prefix + "기억할 5가지");
  assert.ok(
    d.reviewQuestions.length >= 3 && d.reviewQuestions.length <= 5,
    prefix + "질문 수",
  );
  for (const q of d.reviewQuestions) {
    assert.ok(q.prompt && q.explanation);
    assert.ok(q.options.length >= 2);
    assert.ok(
      Number.isInteger(q.answer) &&
        q.answer >= 0 &&
        q.answer < q.options.length,
    );
  }
  for (const k of ["prerequisites", "relatedTopics"]) {
    assert.ok(Array.isArray(d[k]));
    assert.equal(new Set(d[k]).size, d[k].length);
    for (const id of d[k])
      assert.ok(ids.has(id) && id !== d.id, prefix + `잘못된 참조 ${id}`);
  }
  assert.ok(d.keywords.length > 0);
  assert.ok(d.sources.length > 0);
  for (const s of d.sources)
    assert.ok(s.title && new URL(s.url).protocol === "https:");
  for (const e of d.timelineEvents)
    assert.ok(Number.isFinite(e.year) && e.label);
  assert.ok(content.length > 800, prefix + "본문 분량");
  assert.ok(content.includes("## "), prefix + "본문 구조");
}
for (const edge of relationships)
  assert.ok(
    ids.has(edge.from) && ids.has(edge.to) && edge.label,
    "잘못된 지식 관계",
  );
for (const b of timelineBands) {
  assert.ok(b.start < b.end, `잘못된 시간 구간 ${b.id}`);
  if (b.topic) assert.ok(ids.has(b.topic));
}
console.log(
  `검증 완료: ${articles.length}편 · ${subjects.length}개 분야 · ${relationships.length}개 관계 · ${timelineBands.length}개 역사 구간`,
);

const output = path.resolve("public/data/topics");
fs.mkdirSync(output, { recursive: true });
for (const file of fs.readdirSync(output))
  if (file.endsWith(".json")) fs.unlinkSync(path.join(output, file));
for (const { data } of articles)
  fs.writeFileSync(path.join(output, `${data.id}.json`), JSON.stringify(data));

for (const { file, content } of articles) {
  assert.ok(
    !/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(content),
    `${file}: 제어 문자`,
  );
  for (const match of content.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g)) {
    katex.renderToString(match[1] ?? match[2], {
      throwOnError: true,
      strict: "error",
    });
  }
}

for (const [id, illustration] of Object.entries(illustrations)) {
  assert.ok(ids.has(id), `삽화의 글 참조: ${id}`);
  assert.equal(illustration.beats.length, 3);
}
for (const connection of readingConnections) {
  assert.ok(connection.steps.length >= 2);
  for (const step of connection.steps)
    assert.ok(ids.has(step.topic), `읽기 경로의 글 참조: ${step.topic}`);
}
