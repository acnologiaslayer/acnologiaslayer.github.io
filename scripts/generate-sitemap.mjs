#!/usr/bin/env node
/*
 * Generates public/sitemap.xml from static routes, project case studies, and
 * every markdown article in src/content/articles. Runs before each build so
 * the sitemap always reflects newly published articles (incl. automated ones).
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const BASE = "https://arcma.dev";

function frontmatter(raw) {
  const m = /^---\s*\n([\s\S]*?)\n---/.exec(raw);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

async function main() {
  // Project slugs from data.ts
  const dataTs = await readFile(join(root, "src/data.ts"), "utf8");
  const projectSlugs = [...dataTs.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);

  // Arcane product slugs from products.ts
  const productsTs = await readFile(join(root, "src/products.ts"), "utf8");
  const productSlugs = [
    ...productsTs.matchAll(/^\s{4}slug:\s*"([a-z0-9-]+)",/gm),
  ].map((m) => m[1]);

  // Article slugs + dates from markdown
  const articlesDir = join(root, "src/content/articles");
  let articles = [];
  try {
    const files = (await readdir(articlesDir)).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      const raw = await readFile(join(articlesDir, f), "utf8");
      const fm = frontmatter(raw);
      articles.push({ slug: fm.slug || f.replace(/\.md$/, ""), date: fm.date || "" });
    }
    articles.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    /* no articles yet */
  }

  const urls = [
    { loc: `${BASE}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${BASE}/writing`, priority: "0.9", changefreq: "weekly" },
    { loc: `${BASE}/arcane`, priority: "0.9", changefreq: "weekly" },
    ...productSlugs.map((s) => ({
      loc: `${BASE}/arcane/${s}`,
      priority: "0.8",
      changefreq: "monthly",
    })),
    ...projectSlugs.map((s) => ({
      loc: `${BASE}/work/${s}`,
      priority: "0.8",
      changefreq: "yearly",
    })),
    ...articles.map((a) => ({
      loc: `${BASE}/writing/${a.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: a.date || undefined,
    })),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n` +
          (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : "") +
          `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  await writeFile(join(root, "public/sitemap.xml"), xml);
  console.log(`sitemap.xml written with ${urls.length} URLs`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
