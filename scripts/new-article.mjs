#!/usr/bin/env node
/*
 * Scaffold a new article you write yourself.
 *
 * Usage:
 *   npm run new-article "My Article Title"
 *   npm run new-article "My Title" -- --tags "Architecture, Backend"
 *
 * Creates src/content/articles/<slug>.md with today's date and a template
 * body, then prints the path. Edit the file, then commit and push (or use
 * the GitHub web editor). The writing section and sitemap pick it up on the
 * next build automatically.
 */
import { writeFile, readdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, "..", "src", "content", "articles");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/['".,:;!?()]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

const args = process.argv.slice(2);
const title = args.find((a) => !a.startsWith("--"));
if (!title) {
  console.error('Usage: npm run new-article "My Article Title" [-- --tags "Architecture, Backend"]');
  process.exit(1);
}
const tagsIdx = args.indexOf("--tags");
const tags = tagsIdx !== -1 ? args[tagsIdx + 1] : "Architecture";
const slug = slugify(title);
const date = new Date().toISOString().slice(0, 10);
const path = join(ARTICLES_DIR, `${slug}.md`);

async function main() {
  try {
    await access(path);
    console.error(`Already exists: ${path}`);
    process.exit(1);
  } catch {
    /* good, does not exist */
  }

  const template = `---
slug: ${slug}
title: ${title}
description: One clear sentence describing this article for search results and social shares.
date: ${date}
tags: ${tags}
---

Write your opening hook here. Two to four sentences that frame the problem.

## A section heading

Your content in Markdown. Use ## for sections, **bold**, \`code\`, lists, and
links. Keep paragraphs short.

## Another section

More content.

## Closing thought

End with a short, memorable line.
`;

  await writeFile(path, template);
  const count = (await readdir(ARTICLES_DIR)).filter((f) => f.endsWith(".md")).length;
  console.log(`Created ${path}`);
  console.log(`You now have ${count} articles. Edit the file, then commit & push (or use the GitHub web editor).`);
}

main();
