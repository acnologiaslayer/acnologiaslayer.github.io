export type ArticleFields = {
  slug: string;
  title: string;
  description: string;
  date: string; // yyyy-mm-dd
  tags: string; // comma-separated
  body: string;
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['".,:;!?()]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/* Parse a markdown file (frontmatter + body) into editable fields. */
export function parseArticle(raw: string, fallbackSlug = ""): ArticleFields {
  const m = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  const data: Record<string, string> = {};
  let body = raw;
  if (m) {
    body = m[2];
    for (const line of m[1].split("\n")) {
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
  }
  return {
    slug: data.slug || fallbackSlug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || todayISO(),
    tags: data.tags || "",
    body: body.trim(),
  };
}

/* Serialise editable fields back into a markdown file with frontmatter. */
export function buildArticle(f: ArticleFields): string {
  const clean = (s: string) => s.replace(/\s?—\s?/g, ", ").replace(/\s?–\s?/g, ", ");
  return `---
slug: ${f.slug}
title: ${clean(f.title.replace(/"/g, "'"))}
description: ${clean(f.description.replace(/"/g, "'"))}
date: ${f.date}
tags: ${f.tags}
---

${clean(f.body).trim()}
`;
}
