import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"default" | "hover">("default");
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 900, damping: 40 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40 });
  const ringX = useSpring(x, { stiffness: 180, damping: 22 });
  const ringY = useSpring(y, { stiffness: 180, damping: 22 });

  useEffect(() => {
    // Only enable on devices with a fine pointer
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor]"
      );
      if (el) {
        setVariant("hover");
        setLabel(el.getAttribute("data-cursor") || "");
      } else {
        setVariant("default");
        setLabel("");
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y, reduce]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-fg mix-blend-difference"
      />
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{
          width: variant === "hover" ? 64 : 34,
          height: variant === "hover" ? 64 : 34,
          opacity: variant === "hover" ? 1 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-white/60 mix-blend-difference"
      >
        {label && (
          <span className="text-[9px] font-medium uppercase tracking-wider text-fg">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
