import { lazy, Suspense, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CommandPalette = lazy(() => import("./CommandPalette"));

/*
 * PaletteLauncher: opens the command palette on Cmd/Ctrl+K (and a custom
 * "palette:open" event so the nav hint pill can trigger it). Code-split so
 * the palette only downloads on first use.
 *
 * Also renders the Konami-hint toast, fired from inside the palette's
 * "Reveal the Konami code" secret.
 */
export default function PaletteLauncher() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    const onHint = () => {
      setHint(true);
      window.setTimeout(() => setHint(false), 4200);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen as EventListener);
    window.addEventListener("konami:hint", onHint as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen as EventListener);
      window.removeEventListener("konami:hint", onHint as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <Suspense fallback={null}>
            <CommandPalette onClose={close} />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed bottom-6 left-1/2 z-[210] -translate-x-1/2 rounded-full border border-accent/40 bg-surface/95 px-5 py-3 shadow-2xl backdrop-blur"
          >
            <div className="flex items-center gap-3 text-sm">
              <span className="text-accent-glow">✦</span>
              <span className="text-muted">Try the Konami code:</span>
              <span className="font-mono font-semibold tracking-wider text-fg">↑↑↓↓←→←→ B A</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
