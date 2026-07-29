import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

/*
 * Logo concept: "Node Mesh" — an abstract emblem for Mahir Musleh.
 * Four nodes connected by a cross-linked mesh whose interior edges trace
 * an implied "M", a quiet tie to the name, while the connected-graph form
 * speaks to systems architecture and integration. Abstract, not a letter.
 */

type Props = {
  size?: number;
  className?: string;
  withGlow?: boolean;
  animated?: boolean;
};

const NODES = [
  { cx: 14, cy: 16 },
  { cx: 34, cy: 16 },
  { cx: 14, cy: 32 },
  { cx: 34, cy: 32, accent: true },
];

// Mesh edges drawn one-by-one to look like the graph is being assembled.
const EDGES = [
  "M14 16 V32",          // left vertical
  "M34 16 V32",          // right vertical
  "M14 16 L24 26 L34 16", // top -> centre -> top (the implied M peak)
  "M14 32 L34 16",       // cross diagonal
  "M34 32 L14 16",       // cross diagonal
];

export default function Logo({
  size = 36,
  className = "",
  withGlow = false,
  animated = false,
}: Props) {
  const EDGE_DUR = 0.32;
  const EDGE_GAP = 0.16;
  const edge: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: EDGE_DUR, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 + i * EDGE_GAP },
        opacity: { duration: 0.12, delay: 0.15 + i * EDGE_GAP },
      },
    }),
  };
  // Nodes pop in after the edges have finished drawing.
  const nodeStart = 0.15 + EDGES.length * EDGE_GAP + EDGE_DUR;
  const dot: Variants = {
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
      aria-label="Mahir Musleh emblem"
      style={withGlow ? { filter: "drop-shadow(0 0 15px rgba(99,102,241,0.55))" } : undefined}
    >
      <defs>
        <linearGradient id="mm-mesh" x1="10" y1="12" x2="38" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A5B4FC" />
          <stop offset="0.55" stopColor="#6366F1" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>

      {/* rounded container */}
      <rect
        x="1.25" y="1.25" width="45.5" height="45.5" rx="13"
        stroke="url(#mm-mesh)" strokeOpacity="0.3" strokeWidth="1.5"
      />

      {/* mesh edges: drawn one-by-one so the graph appears to assemble */}
      {animated ? (
        EDGES.map((d, i) => (
          <PathTag
            key={i}
            variants={edge}
            custom={i}
            initial="hidden"
            animate="show"
            d={d}
            stroke="url(#mm-mesh)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.9"
          />
        ))
      ) : (
        <path
          d="M14 16 V32 M34 16 V32 M14 16 L24 26 L34 16 M14 32 L34 16 M34 32 L14 16"
          stroke="url(#mm-mesh)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.9"
        />
      )}

      {/* nodes */}
      {NODES.map((n, i) => (
        <Dot
          key={i}
          cx={n.cx}
          cy={n.cy}
          r={n.accent ? 3.6 : 3.2}
          fill={n.accent ? "#C4B5FD" : "url(#mm-mesh)"}
          {...(animated ? { variants: dot, custom: i, initial: "hidden", animate: "show" } : {})}
        />
      ))}
    </svg>
  );
}
