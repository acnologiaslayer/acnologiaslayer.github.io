#!/usr/bin/env node
/*
 * Automated article generator for Mahir Musleh's writing section.
 *
 * - Reads the tone guide and topic backlog.
 * - Picks the first backlog topic not already published (or asks the model
 *   for a fresh on-brand topic if the backlog is exhausted).
 * - Generates a full article in the configured voice via an LLM API.
 * - Writes a markdown file with frontmatter into src/content/articles.
 *
 * Providers (auto-detected from env):
 *   - ANTHROPIC_API_KEY  -> Anthropic Messages API
 *   - OPENAI_API_KEY     -> OpenAI Chat Completions API
 *
 * Env overrides:
 *   MODEL          override the model name
 *   DRY_RUN=1      print the article instead of writing a file
 *
 * Usage: node scripts/generate-article.mjs
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const ARTICLES_DIR = join(root, "src/content/articles");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/['".,:;!?()]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function frontmatter(raw) {
  const m = /^---\s*\n([\s\S]*?)\n---/.exec(raw);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    out[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return out;
}

async function existingArticles() {
  let files = [];
  try {
    files = (await readdir(ARTICLES_DIR)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const out = [];
  for (const f of files) {
    const raw = await readFile(join(ARTICLES_DIR, f), "utf8");
    const fm = frontmatter(raw);
    out.push({ slug: fm.slug || f.replace(/\.md$/, ""), title: fm.title || "" });
  }
  return out;
}

function pickTopic(topicsRaw, existing) {
  // Only lines under the "## Topics" heading are real topics; everything
  // above is documentation prose.
  const markerMatch = /^##\s+Topics\s*$/m.exec(topicsRaw);
  const body = markerMatch
    ? topicsRaw.slice(markerMatch.index + markerMatch[0].length)
    : topicsRaw;
  const topics = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && l.length > 12 && l.includes(" "));
  const existingText = existing
    .map((a) => `${a.slug} ${a.title}`.toLowerCase())
    .join(" | ");
  const words = (s) =>
    s
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 4);
  for (const t of topics) {
    const key = words(t);
    const overlap = key.filter((w) => existingText.includes(w)).length;
    // Consider "already covered" only if most key words appear together.
    if (overlap < Math.max(2, Math.ceil(key.length * 0.5))) return t;
  }
  return null; // exhausted -> caller asks the model for a fresh topic
}

function buildPrompt(toneGuide, topic, existingTitles) {
  return `You are ghost-writing a blog article as Md. Mahir Musleh, a Senior Solution Architect. Follow this tone guide exactly:

${toneGuide}

Already-published titles (do NOT repeat these angles):
${existingTitles.map((t) => `- ${t}`).join("\n") || "- (none yet)"}

Write a complete article on this topic:
"${topic}"

Output STRICT JSON only, no markdown fences, with this exact shape:
{
  "title": "A specific, non-generic title (max 60 chars, no trailing period unless natural)",
  "description": "One-sentence meta description for SEO, 120-155 chars, no em dashes",
  "tags": ["2-3 short tags from: Architecture, Backend, APIs, AI, LLM, Cloud, DevOps, Databases, Distributed Systems, Engineering, Leadership"],
  "body": "The full article in Markdown. Use ## section headings. 700-1100 words. First person. No em dashes. No emojis. No title heading inside the body (the title is separate)."
}`;
}

async function callAnthropic(prompt, model) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model || "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content.map((c) => c.text || "").join("");
}

async function callOpenAI(prompt, model) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model || "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

function extractJson(text) {
  // Tolerate accidental code fences or prose around the JSON.
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in model output");
  return JSON.parse(candidate.slice(start, end + 1));
}

function sanitize(md) {
  // Enforce the no-em-dash rule even if the model slips.
  return md.replace(/\s?—\s?/g, ", ").replace(/\s?–\s?/g, ", ");
}

async function main() {
  const provider = process.env.ANTHROPIC_API_KEY
    ? "anthropic"
    : process.env.OPENAI_API_KEY
      ? "openai"
      : null;
  if (!provider) {
    console.error(
      "No API key found. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in the environment."
    );
    process.exit(1);
  }

  const toneGuide = await readFile(join(__dirname, "tone-guide.md"), "utf8");
  const topicsRaw = await readFile(join(__dirname, "topics.md"), "utf8");
  const existing = await existingArticles();
  const existingTitles = existing.map((a) => a.title).filter(Boolean);

  let topic = pickTopic(topicsRaw, existing);
  if (!topic) {
    topic =
      "Propose and write about a fresh, specific software-architecture or AI-engineering topic not already covered above";
    console.log("Backlog exhausted; asking the model for a fresh topic.");
  } else {
    console.log(`Topic: ${topic}`);
  }

  const prompt = buildPrompt(toneGuide, topic, existingTitles);
  const raw =
    provider === "anthropic"
      ? await callAnthropic(prompt, process.env.MODEL)
      : await callOpenAI(prompt, process.env.MODEL);

  const article = extractJson(raw);
  if (!article.title || !article.body) throw new Error("Model output missing title/body");

  const slug = slugify(article.title);
  if (existing.some((a) => a.slug === slug)) {
    console.log(`Article "${slug}" already exists. Skipping to avoid duplicate.`);
    return;
  }

  const tags = Array.isArray(article.tags) ? article.tags.slice(0, 3) : ["Architecture"];
  const body = sanitize(String(article.body).trim());
  const description = sanitize(String(article.description || "").trim()).replace(/"/g, "'");
  const title = String(article.title).trim().replace(/"/g, "'");

  const md = `---
slug: ${slug}
title: ${title}
description: ${description}
date: ${todayISO()}
tags: ${tags.join(", ")}
---

${body}
`;

  if (process.env.DRY_RUN) {
    console.log("\n----- DRY RUN -----\n");
    console.log(md);
    return;
  }

  const outPath = join(ARTICLES_DIR, `${slug}.md`);
  await writeFile(outPath, md);
  console.log(`Wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
