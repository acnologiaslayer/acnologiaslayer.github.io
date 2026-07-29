import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Logo from "./Logo";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);
  const doneCalled = useRef(false);

  // Guarantee onDone runs exactly once, even if the exit animation's
  // onExitComplete never fires (a known issue on some mobile browsers).
  const finish = () => {
    if (doneCalled.current) return;
    doneCalled.current = true;
    onDone();
  };

  useEffect(() => {
    // Hard safety net: no matter what happens with rAF throttling or
    // stalled exit callbacks, release the app within 4s.
    const hardStop = setTimeout(() => {
      setCount(100);
      setGone(true);
      finish();
    }, 4000);

    if (reduce) {
      setCount(100);
      const t = setTimeout(() => setGone(true), 200);
      return () => {
        clearTimeout(t);
        clearTimeout(hardStop);
      };
    }

    let raf = 0;
    const start = performance.now();
    const dur = 1800;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setGone(true), 450);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hardStop);
    };
  }, [reduce]);

  // Once the panel is marked gone, ensure onDone fires even if the exit
  // animation's onExitComplete is delayed or skipped.
  useEffect(() => {
    if (!gone) return;
    const t = setTimeout(finish, 1000);
    return () => clearTimeout(t);
  }, [gone]);

  return (
    <AnimatePresence onExitComplete={finish}>
      {!gone && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-bg px-6 py-8 sm:px-10 sm:py-10"
        >
          {/* Centerpiece logo */}
          <div className="flex flex-1 items-center justify-center">
            <div className="relative flex flex-col items-center">
              {/* radial glow behind the mark */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute h-64 w-64 rounded-full bg-accent/20 blur-[90px]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* subtle breathing float */}
                <motion.div
                  animate={reduce ? {} : { y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <Logo size={132} animated withGlow />
                </motion.div>
              </motion.div>

              {/* thin reveal bar under the mark, driven by the counter */}
              <div className="mt-10 h-px w-40 overflow-hidden bg-border/60">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent via-accent-glow to-[#A855F7]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: count / 100 }}
                  style={{ originX: 0 }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted"
              >
                Loading portfolio
              </motion.p>
            </div>
          </div>

          {/* Bottom row: name + counter */}
          <div className="flex items-end justify-between">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-sm uppercase tracking-widest text-muted"
            >
              <span className="text-fg">Mahir Musleh</span>
              <br />
              Senior Solution Architect
            </motion.div>

            <div className="flex items-end gap-4">
              <span className="mb-3 hidden font-mono text-xs text-muted sm:block">
                {count < 100 ? "Assembling" : "Ready"}
              </span>
              <span className="font-display text-[18vw] font-bold leading-[0.8] tracking-tighter text-fg sm:text-[10rem]">
                {count}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
