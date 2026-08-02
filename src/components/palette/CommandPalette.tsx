import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { profile } from "../../data";
import { scrollToId } from "../../scrollTo";

/*
 * CommandPalette — the "power user" hub (Cmd/Ctrl+K).
 * Doubles as the discoverable home for easter eggs: a "Secrets" group
 * surfaces the arcade and the Konami hint so visitors know there's more.
 * Real, useful actions keep it from feeling gimmicky to serious clients.
 */

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Connect" | "Secrets";
  keywords?: string;
  icon: ReactElement;
  run: (ctx: { navigate: (p: string) => void; onHome: boolean; close: () => void }) => void;
  keep?: boolean; // keep palette open after running
};

const I = {
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  ),
  copy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>
  ),
  doc: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v5h5" /><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg>
  ),
  game: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="12" r="1.3" fill="currentColor" /><circle cx="12" cy="8" r="1.3" fill="currentColor" /><circle cx="17" cy="13" r="1.3" fill="currentColor" /><path d="M7 12l5-4 5 5" /></svg>
  ),
  spark: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></svg>
  ),
};

function goSection(id: string, ctx: { navigate: (p: string) => void; onHome: boolean; close: () => void }) {
  ctx.close();
  if (ctx.onHome) {
    history.replaceState(null, "", `#${id}`);
    setTimeout(() => scrollToId(id), 60);
  } else {
    ctx.navigate("/");
    setTimeout(() => scrollToId(id), 420);
  }
}

const COMMANDS: Cmd[] = [
  { id: "work", label: "Go to Work", group: "Navigate", keywords: "projects case study portfolio", icon: I.arrow, run: (c) => goSection("work", c) },
  { id: "services", label: "Go to Services", group: "Navigate", keywords: "offer help", icon: I.arrow, run: (c) => goSection("services", c) },
  { id: "experience", label: "Go to Experience", group: "Navigate", keywords: "career roles history", icon: I.arrow, run: (c) => goSection("experience", c) },
  { id: "writing", label: "Go to Writing", group: "Navigate", keywords: "blog articles posts", icon: I.arrow, run: (c) => { c.close(); c.navigate("/writing"); } },
  { id: "contact", label: "Go to Contact", group: "Navigate", keywords: "hire talk reach", icon: I.arrow, run: (c) => goSection("contact", c) },
  {
    id: "email", label: "Email Mahir", hint: profile.email, group: "Connect", keywords: "mail hire contact reach",
    icon: I.mail, run: (c) => { c.close(); window.location.href = `mailto:${profile.email}`; },
  },
  {
    id: "copy-email", label: "Copy email address", hint: profile.email, group: "Connect", keywords: "clipboard",
    icon: I.copy, keep: true,
    run: () => { navigator.clipboard?.writeText(profile.email).catch(() => {}); },
  },
  {
    id: "linkedin", label: "Open LinkedIn", group: "Connect", keywords: "social profile",
    icon: I.link, run: (c) => { c.close(); window.open("https://linkedin.com/in/mahir009", "_blank", "noreferrer"); },
  },
  {
    id: "github", label: "Open GitHub", group: "Connect", keywords: "code repos source",
    icon: I.link, run: (c) => { c.close(); window.open("https://github.com/acnologiaslayer", "_blank", "noreferrer"); },
  },
  {
    id: "arcade", label: "Play Uplink", hint: "hidden arcade game", group: "Secrets", keywords: "game snake easter egg fun play arcade",
    icon: I.game, run: (c) => { c.close(); window.dispatchEvent(new Event("arcade:open")); },
  },
  {
    id: "konami", label: "Reveal the Konami code", hint: "↑ ↑ ↓ ↓ ← → ← → B A", group: "Secrets", keywords: "cheat secret code easter egg",
    icon: I.spark, keep: true, run: () => { window.dispatchEvent(new Event("konami:hint")); },
  },
];

const GROUP_ORDER = ["Navigate", "Connect", "Secrets"] as const;

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const match = (c: Cmd) =>
      !term ||
      c.label.toLowerCase().includes(term) ||
      c.group.toLowerCase().includes(term) ||
      (c.keywords ?? "").toLowerCase().includes(term) ||
      (c.hint ?? "").toLowerCase().includes(term);
    return COMMANDS.filter(match);
  }, [q]);

  // reset selection when the filtered set changes
  useEffect(() => { setActive(0); }, [q]);

  const grouped = useMemo(() => {
    const flat: Cmd[] = [];
    for (const g of GROUP_ORDER) for (const c of results) if (c.group === g) flat.push(c);
    return flat;
  }, [results]);

  const close = useCallback(() => onClose(), [onClose]);

  const runAt = useCallback((idx: number) => {
    const cmd = grouped[idx];
    if (!cmd) return;
    cmd.run({ navigate, onHome, close });
    if (cmd.id === "copy-email") { setCopied(true); setTimeout(() => setCopied(false), 1400); }
  }, [grouped, navigate, onHome, close]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, grouped.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); runAt(active); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [grouped.length, active, runAt, close]);

  // keep active row in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let renderIdx = -1;

  return (
    <motion.div
      className="fixed inset-0 z-[190] flex items-start justify-center px-4 pt-[12vh] bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <motion.div
        initial={{ scale: 0.97, y: -8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface/95 shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="text-muted"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search or jump to..."
            className="w-full bg-transparent py-4 text-[15px] text-fg outline-none placeholder:text-muted"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted sm:inline">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {grouped.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-muted">No matches.</div>
          )}
          {GROUP_ORDER.map((g) => {
            const items = results.filter((c) => c.group === g);
            if (!items.length) return null;
            return (
              <div key={g} className="mb-1">
                <div className="flex items-center gap-2 px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted">
                  {g === "Secrets" && <span className="text-accent-glow">✦</span>}
                  {g}
                </div>
                {items.map((c) => {
                  renderIdx += 1;
                  const idx = renderIdx;
                  const isActive = idx === active;
                  const isSecret = c.group === "Secrets";
                  return (
                    <button
                      key={c.id}
                      data-idx={idx}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => runAt(idx)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        isActive ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${
                        isSecret ? "border-accent/40 text-accent-glow" : "border-border text-muted"
                      } ${isActive ? "bg-white/5" : ""}`}>
                        {c.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-fg">
                          {c.id === "copy-email" && copied ? "Copied to clipboard" : c.label}
                        </span>
                        {c.hint && (
                          <span className={`block truncate text-xs ${isSecret ? "text-accent-glow/70" : "text-muted"}`}>{c.hint}</span>
                        )}
                      </span>
                      {isActive && (
                        <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted sm:inline">↵</kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1 py-0.5">↑</kbd><kbd className="rounded border border-border px-1 py-0.5">↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1 py-0.5">↵</kbd> select</span>
          </span>
          <span className="flex items-center gap-1 text-accent-glow/80">✦ secrets inside</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
