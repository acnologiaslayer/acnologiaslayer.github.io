#!/usr/bin/env node
/*
 * Renders Arcane app icons.
 *
 * The website marks are outlines on a transparent field, which disappear on a
 * light dock or taskbar. Desktop icons therefore use a filled variant: the
 * product gradient fills the rounded container and the glyph is knocked out in
 * near-white, so the icon stays legible on any background at any size.
 *
 * Geometry is the same 48x48 grid as scripts/generate-product-logos.mjs.
 *
 * Usage: node scripts/generate-app-icon.mjs <mark> <outFile.svg>
 */
import { writeFile } from "node:fs/promises";

const RAMPS = {
  agents: ["#818CF8", "#6366F1", "#7C3AED"],
  dictate: ["#22D3EE", "#0EA5E9", "#4F46E5"],
  canvas: ["#C084FC", "#A855F7", "#6366F1"],
  speech: ["#FBBF24", "#F59E0B", "#DB2777"],
  avatar: ["#F472B6", "#EC4899", "#A855F7"],
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

const FG = "#FFFFFF";

function appIcon(mark) {
  const ramp = RAMPS[mark];
  const paths = EDGES[mark]
    .map(
      (d) =>
        `  <path d="${d}" stroke="${FG}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
    )
    .join("\n");
  const nodes = NODES[mark]
    .map((n) => `  <circle cx="${n.cx}" cy="${n.cy}" r="${n.r ?? 3.2}" fill="${FG}"/>`)
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop stop-color="${ramp[0]}"/>
      <stop offset="0.5" stop-color="${ramp[1]}"/>
      <stop offset="1" stop-color="${ramp[2]}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="48" height="48" rx="11" fill="url(#bg)"/>
${paths}
${nodes}
</svg>
`;
}

const [mark, out] = process.argv.slice(2);
if (!mark || !RAMPS[mark]) {
  console.error(`usage: generate-app-icon.mjs <${Object.keys(RAMPS).join("|")}> <out.svg>`);
  process.exit(1);
}
await writeFile(out, appIcon(mark));
console.log(`wrote ${out}`);
