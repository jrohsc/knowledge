import fs from "node:fs";
import path from "node:path";
import { parseArticle as matter } from "./frontmatter";
import type { Topic, TopicSummary } from "./schema";
const directory = path.join(process.cwd(), "content/articles");
let cached: ReturnType<typeof readAll> | undefined;
function readAll() {
  return fs
    .readdirSync(directory)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(directory, file), "utf8"),
      );
      return { meta: data as Topic, content };
    })
    .sort((a, b) => a.meta.title.localeCompare(b.meta.title, "ko"));
}
export function getArticles() {
  if (process.env.NODE_ENV === "production")
    return cached ?? (cached = readAll());
  return readAll();
}
export function getTopics(): Topic[] {
  return getArticles().map((a) => a.meta);
}
export function getCatalog(): TopicSummary[] {
  return getTopics().map(
    ({
      id,
      title,
      englishTitle,
      subtitle,
      subject,
      subcategory,
      period,
      estimatedReadingTime,
      kind,
      difficulty,
      prerequisites,
      relatedTopics,
      keywords,
      summary,
    }) => ({
      id,
      title,
      englishTitle,
      subtitle,
      subject,
      subcategory,
      period,
      estimatedReadingTime,
      kind,
      difficulty,
      prerequisites,
      relatedTopics,
      keywords,
      summary,
    }),
  );
}
export function getArticle(id: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) return undefined;
  const file = path.join(directory, `${id}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { meta: data as Topic, content };
}
