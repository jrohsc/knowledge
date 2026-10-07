import { parse } from "yaml";
/** Parse only declarative YAML/JSON metadata; no executable frontmatter engines. */
export function parseArticle(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error("기사의 YAML frontmatter가 필요합니다.");
  const data = parse(match[1], { uniqueKeys: true, maxAliasCount: 50 });
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new Error("기사 메타데이터는 객체여야 합니다.");
  return { data, content: source.slice(match[0].length) };
}
