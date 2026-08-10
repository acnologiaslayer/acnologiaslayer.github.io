import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

/*
 * Arcane Suite product marks.
 *
 * Each mark shares the house emblem system established by the Mahir Musleh
 * logo: a 48x48 field, a rounded container at rx 13 stroked at 30% opacity,
 * a two-to-three stop gradient in the product's accent, 2px round-capped
 * geometry, and node dots for emphasis. Only the interior glyph changes, so
 * the five marks read as one family in a row.
 *
 * Glyphs:
 *   agents   two nodes fanning into three, a router splitting work
 *   dictate  a waveform collapsing into a single typed caret
 *   canvas   four nodes wired on a graph, one branch highlighted
 *   speech   concentric arcs radiating from a source point
 *   avatar   a bust silhouette rebuilt as a scan of horizontal strata
 */

export type ProductMark = "agents" | "dictate" | "canvas" | "speech" | "avatar";

type Props = {
  mark: ProductMark;
  size?: number;
  className?: string;
  withGlow?: boolean;
  animated?: boolean;
};

/* Accent ramps, tuned per product but built the same way: a light tint, the
 * product accent, then a deeper neighbouring hue. */
const RAMPS: Record<ProductMark, [string, string, string]> = {
  agents: ["#A5B4FC", "#6366F1", "#A855F7"],
  dictate: ["#A5F3FC", "#22D3EE", "#6366F1"],
  canvas: ["#E9D5FF", "#A855F7", "#6366F1"],
  speech: ["#FDE68A", "#F59E0B", "#EC4899"],
  avatar: ["#FBCFE8", "#EC4899", "#A855F7"],
};

const GLOW: Record<ProductMark, string> = {
  agents: "rgba(99,102,241,0.55)",
  dictate: "rgba(34,211,238,0.55)",
  canvas: "rgba(168,85,247,0.55)",
  speech: "rgba(245,158,11,0.5)",
  avatar: "rgba(236,72,153,0.5)",
};

const LABELS: Record<ProductMark, string> = {
  agents: "Arcane Agents emblem",
  dictate: "Arcane Dictate emblem",
  canvas: "Arcane Canvas emblem",
  speech: "Arcane Speech emblem",
  avatar: "Arcane Avatar emblem",
};

/* Stroked geometry per mark, drawn in order so animation reads as assembly. */
const EDGES: Record<ProductMark, string[]> = {
  // Router: a trunk that fans out into three destinations.
  agents: ["M13 24 H22", "M22 24 L34 14", "M22 24 H35", "M22 24 L34 34"],
  // Waveform stepping down into a caret: speech resolving into text.
  dictate: [
    "M14 21 V27",
    "M19 16 V32",
    "M24 12 V30",
    "M29 17 V31",
    "M34 21 V27",
    "M17 37 H31",
  ],
  // Node graph: a square circuit with one diagonal branch.
  canvas: ["M15 15 H33", "M33 15 V33", "M33 33 H15", "M15 33 V15", "M15 15 L33 33"],
  // Radiating arcs from a source at the left.
  speech: [
    "M17 19 A8 8 0 0 1 17 29",
    "M23 15 A13 13 0 0 1 23 33",
    "M29 11 A18 18 0 0 1 29 37",
  ],
  // Bust rebuilt from scan lines: head arc, shoulders, strata.
  avatar: [
    "M18 20 A6 6 0 0 1 30 20 A6 6 0 0 1 18 20",
    "M13 36 A11 9 0 0 1 35 36",
    "M20 30 H28",
    "M16 33 H32",
  ],
};

/* Emphasis dots, positioned per mark. The last entry of each set is the
 * "live" node and renders in the lightest tint. */
const NODES: Record<ProductMark, { cx: number; cy: number; r?: number }[]> = {
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

export default function ProductLogo({
  mark,
  size = 40,
  className = "",
  withGlow = false,
  animated = false,
}: Props) {
  const ramp = RAMPS[mark];
  const edges = EDGES[mark];
  const nodes = NODES[mark];
  const gid = `arcane-${mark}`;

  const EDGE_DUR = 0.32;
  const EDGE_GAP = 0.16;
  const edgeVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: EDGE_DUR,
          ease: [0.16, 1, 0.3, 1] as const,
          delay: 0.15 + i * EDGE_GAP,
        },
        opacity: { duration: 0.12, delay: 0.15 + i * EDGE_GAP },
      },
    }),
  };
  const nodeStart = 0.15 + edges.length * EDGE_GAP + EDGE_DUR;
  const dotVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    show: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: nodeStart + i * 0.1, type: "spring", stiffness: 320, damping: 15 },
    }),
  };

  const PathTag = animated ? motion.path : "path";
  const Dot = animated ? motion.circle : "circle";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label={LABELS[mark]}
      style={withGlow ? { filter: `drop-shadow(0 0 15px ${GLOW[mark]})` } : undefined}
    >
      <defs>
        <linearGradient id={gid} x1="10" y1="12" x2="38" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor={ramp[0]} />
          <stop offset="0.55" stopColor={ramp[1]} />
          <stop offset="1" stopColor={ramp[2]} />
        </linearGradient>
      </defs>

      {/* Shared container: identical on every product mark. */}
      <rect
        x="1.25"
        y="1.25"
        width="45.5"
        height="45.5"
        rx="13"
        stroke={`url(#${gid})`}
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />

      {edges.map((d, i) =>
        animated ? (
          <PathTag
            key={i}
            variants={edgeVariants}
            custom={i}
            initial="hidden"
            animate="show"
            d={d}
            stroke={`url(#${gid})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.9"
          />
        ) : (
          <path
            key={i}
            d={d}
            stroke={`url(#${gid})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.9"
          />
        )
      )}

      {nodes.map((n, i) => (
        <Dot
          key={i}
          cx={n.cx}
          cy={n.cy}
          r={n.r ?? 3.2}
          fill={i === nodes.length - 1 && nodes.length > 1 ? ramp[0] : `url(#${gid})`}
          {...(animated ? { variants: dotVariants, custom: i, initial: "hidden", animate: "show" } : {})}
        />
      ))}
    </svg>
  );
}
