#!/usr/bin/env node
/*
 * Renders the Arcane product marks to standalone SVG files.
 *
 * The geometry mirrors src/components/ProductLogo.tsx so the static assets
 * that ship inside each product repository stay identical to the marks used
 * on the website. Outputs an icon and a horizontal wordmark per product.
 *
 * Usage: node scripts/generate-product-logos.mjs [outDir]
 *        Defaults to public/brand/.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const RAMPS = {
  agents: ["#A5B4FC", "#6366F1", "#A855F7"],
  dictate: ["#A5F3FC", "#22D3EE", "#6366F1"],
  canvas: ["#E9D5FF", "#A855F7", "#6366F1"],
  speech: ["#FDE68A", "#F59E0B", "#EC4899"],
  avatar: ["#FBCFE8", "#EC4899", "#A855F7"],
};

const EDGES = {
  agents: ["M13 24 H22", "M22 24 L34 14", "M22 24 H35", "M22 24 L34 34"],
  dictate: ["M14 21 V27", "M19 16 V32", "M24 12 V30", "M29 17 V31", "M34 21 V27", "M17 37 H31"],
  canvas: ["M15 15 H33", "M33 15 V33", "M33 33 H15", "M15 33 V15", "M15 15 L33 33"],
  speech: [
    "M17 19 A8 8 0 0 1 17 29",
    "M23 15 A13 13 0 0 1 23 33",
    "M29 11 A18 18 0 0 1 29 37",
  ],
  avatar: [
    "M18 20 A6 6 0 0 1 30 20 A6 6 0 0 1 18 20",
    "M13 36 A11 9 0 0 1 35 36",
    "M20 30 H28",
    "M16 33 H32",
  ],
};

const NODES = {
  agents: [
    { cx: 12, cy: 24 },
    { cx: 34, cy: 14 },
    { cx: 36, cy: 24 },
    { cx: 34, cy: 34, r: 3.6 },
  ],
  dictate: [{ cx: 24, cy: 34, r: 2.2 }],
  canvas: [
    { cx: 15, cy: 15 },
    { cx: 33, cy: 15 },
    { cx: 15, cy: 33 },
    { cx: 33, cy: 33, r: 3.6 },
  ],
  speech: [{ cx: 13, cy: 24, r: 3.6 }],
  avatar: [{ cx: 24, cy: 20, r: 2.4 }],
};

const NAMES = {
  agents: "Arcane Agents",
  dictate: "Arcane Dictate",
  canvas: "Arcane Canvas",
  speech: "Arcane Speech",
  avatar: "Arcane Avatar",
};

function glyph(mark, { x = 0, y = 0 } = {}) {
  const gid = `arcane-${mark}`;
  const ramp = RAMPS[mark];
  const t = x || y ? ` transform="translate(${x} ${y})"` : "";
  const paths = EDGES[mark]
    .map(
      (d) =>
        `    <path d="${d}" stroke="url(#${gid})" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.9"/>`
    )
    .join("\n");
  const nodes = NODES[mark]
    .map((n, i, arr) => {
      const fill = i === arr.length - 1 && arr.length > 1 ? ramp[0] : `url(#${gid})`;
      return `    <circle cx="${n.cx}" cy="${n.cy}" r="${n.r ?? 3.2}" fill="${fill}"/>`;
    })
    .join("\n");
  return `  <g${t}>
    <rect x="1.25" y="1.25" width="45.5" height="45.5" rx="13" stroke="url(#${gid})" stroke-opacity="0.3" stroke-width="1.5"/>
${paths}
${nodes}
  </g>`;
}

function defs(mark) {
  const ramp = RAMPS[mark];
  return `  <defs>
    <linearGradient id="arcane-${mark}" x1="10" y1="12" x2="38" y2="36" gradientUnits="userSpaceOnUse">
      <stop stop-color="${ramp[0]}"/>
      <stop offset="0.55" stop-color="${ramp[1]}"/>
      <stop offset="1" stop-color="${ramp[2]}"/>
    </linearGradient>
  </defs>`;
}

function icon(mark) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" role="img" aria-label="${NAMES[mark]} emblem">
${defs(mark)}
${glyph(mark)}
</svg>
`;
}

function wordmark(mark) {
  const ramp = RAMPS[mark];
  const [, product] = NAMES[mark].split(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="48" viewBox="0 0 260 48" fill="none" role="img" aria-label="${NAMES[mark]}">
${defs(mark)}
${glyph(mark)}
  <text x="62" y="30" font-family="Space Grotesk, Archivo, ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.4" fill="#F4F4F6">Arcane<tspan dx="6" fill="${ramp[1]}">${product}</tspan></text>
</svg>
`;
}

async function main() {
  const outDir = resolve(process.argv[2] || join(root, "public/brand"));
  await mkdir(outDir, { recursive: true });
  for (const mark of Object.keys(NAMES)) {
    await writeFile(join(outDir, `arcane-${mark}.svg`), icon(mark));
    await writeFile(join(outDir, `arcane-${mark}-wordmark.svg`), wordmark(mark));
  }
  console.log(`wrote ${Object.keys(NAMES).length * 2} SVGs to ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
