import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useInView,
  animate,
} from "framer-motion";
import { expoOut } from "../motion";

/* Magnetic wrapper: element drifts toward the cursor while hovered. */
export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Character-by-character reveal on scroll into view. */
export function AnimatedText({
  text,
  className,
  delay = 0,
  as = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");
  const MotionTag = motion(as);

  return (
    <MotionTag ref={ref as never} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden align-bottom">
          <span className="inline-block">
            {word.split("").map((ch, ci) => (
              <motion.span
                key={ci}
                aria-hidden
                className="inline-block"
                initial={{ y: "110%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: expoOut,
                  delay: delay + wi * 0.04 + ci * 0.014,
                }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}

/* Count-up number when scrolled into view. */
export function Counter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  // Parse once per distinct value, not on every render.
  const { hasNumber, target, suffix } = useMemo(() => {
    const m = value.match(/^(\d+)(.*)$/);
    return {
      hasNumber: !!m,
      target: m ? parseInt(m[1], 10) : 0,
      suffix: m ? m[2] : "",
    };
  }, [value]);

  const [display, setDisplay] = useState(hasNumber ? 0 : value);

  useEffect(() => {
    if (!hasNumber) return;
    if (!inView || reduce) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: expoOut,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, hasNumber, reduce]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {hasNumber ? `${display}${suffix}` : value}
    </span>
  );
}
