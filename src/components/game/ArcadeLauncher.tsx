import { lazy, Suspense, useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

// Code-split: the game bundle only downloads once a visitor triggers it.
const ArcadeGame = lazy(() => import("./ArcadeGame"));

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

/*
 * ArcadeLauncher: mounts nothing visible until the visitor discovers it.
 * Triggers:
 *   1. Konami code (classic, invisible to clients skimming the site).
 *   2. Custom "arcade:open" event, so any element (e.g. a footer dot) can
 *      open it without importing the game.
 * Kept out of the main render path; the heavy canvas game is lazy-loaded.
 */
export default function ArcadeLauncher() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const want = KONAMI[idx];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === want) {
        idx += 1;
        if (idx === KONAMI.length) {
          idx = 0;
          setOpen(true);
        }
      } else {
        // allow restart if the mismatch is itself the first key
        idx = key === KONAMI[0] ? 1 : 0;
      }
    };
    const onEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("arcade:open", onEvent as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("arcade:open", onEvent as EventListener);
    };
  }, []);

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <Suspense fallback={null}>
          <ArcadeGame onClose={close} />
        </Suspense>
      )}
    </AnimatePresence>
  );
}
