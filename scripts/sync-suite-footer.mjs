#!/usr/bin/env node
/*
 * Appends (or refreshes) the shared "Arcane Suite" footer in each product
 * README, so every repository cross-links to its siblings.
 *
 * The block is delimited by HTML comments and rewritten in place on re-runs,
 * which keeps the suite list consistent when a product is added or renamed.
 * The product list is kept in sync with src/products.ts by hand; that file
 * drives the website, this one drives the repositories.
 *
 * Usage: node scripts/sync-suite-footer.mjs <reposRoot>
 *        where reposRoot contains the product checkouts.
 */
import { readFile, writeFile, access } from "node:fs/promises";
import { join, resolve } from "node:path";

const START = "<!-- arcane-suite:start -->";
const END = "<!-- arcane-suite:end -->";

const PRODUCTS = [
  {
    repo: "arccode",
    name: "Arcane Agents",
    line: "Route every task to the right model, from one CLI.",
  },
  {
    repo: "arcane-dictate",
    name: "Arcane Dictate",
    line: "Press to talk, get text anywhere, fully on-device.",
  },
  {
    repo: "arcane-canvas",
    name: "Arcane Canvas",
    line: "Compose generative pipelines on an infinite node graph.",
  },
  {
    repo: "arcane-speech",
    name: "Arcane Speech",
    line: "Zero-shot multilingual speech synthesis.",
  },
  {
    repo: "arcane-avatar",
    name: "Arcane Avatar",
    line: "Turn one take of footage into a presenter who says anything.",
  },
];

function footer(currentRepo) {
  const rows = PRODUCTS.map((p) => {
    const label =
      p.repo === currentRepo
        ? `**${p.name}** (this repository)`
        : `[${p.name}](https://github.com/acnologiaslayer/${p.repo})`;
    return `| ${label} | ${p.line} |`;
  }).join("\n");

  return `${START}

## The Arcane Suite

Local-first tools for building with generative AI. Every product runs on your own
hardware and shares a common design language.

| Product | |
|---|---|
${rows}

Full details at [arcma.dev/arcane](https://arcma.dev/arcane).

${END}`;
}

async function main() {
  const root = resolve(process.argv[2] || ".");
  let changed = 0;
  for (const p of PRODUCTS) {
    const path = join(root, p.repo, "README.md");
    try {
      await access(path);
    } catch {
      console.log(`skip ${p.repo} (no README at ${path})`);
      continue;
    }
    const raw = await readFile(path, "utf8");
    const block = footer(p.repo);
    const next =
      raw.includes(START) && raw.includes(END)
        ? raw.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block)
        : `${raw.replace(/\s*$/, "")}\n\n${block}\n`;
    if (next !== raw) {
      await writeFile(path, next);
      changed++;
      console.log(`updated ${p.repo}/README.md`);
    } else {
      console.log(`unchanged ${p.repo}/README.md`);
    }
  }
  console.log(`${changed} README(s) updated`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
