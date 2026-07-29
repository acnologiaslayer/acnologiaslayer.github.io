import { marked } from "marked";

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  tags: string[];
  readingTime: number; // minutes
  html: string;
  body: string;
};

// Minimal YAML frontmatter parser (no Node Buffer dependency).
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    data[key] = val;
  }
  return { data, body: match[2] };
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

marked.setOptions({ gfm: true, breaks: false });

// Eagerly import every markdown file in content/articles as a raw string.
const files = import.meta.glob("./articles/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const articles: Article[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    const slug = data.slug || path.split("/").pop()!.replace(/\.md$/, "");
    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date || "1970-01-01",
      tags: (data.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      readingTime: estimateReadingTime(body),
      html: marked.parse(body) as string,
      body,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
