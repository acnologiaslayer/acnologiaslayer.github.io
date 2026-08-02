import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
 * "Uplink" — an on-brand retro arcade demo.
 * A packet traverses a network grid, linking nodes into a growing mesh
 * (a nod to the Mahir Musleh node-mesh emblem). Snake mechanics, but the
 * body renders as connected graph nodes + edges using the brand gradient.
 *
 * Self-contained + code-split: this only loads when a visitor triggers it,
 * so it adds zero weight to the main bundle.
 */

type Vec = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";
type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: string };

const GRID = 17; // cells per side
const TICK_START = 140; // ms per step
const TICK_MIN = 70;
const HS_KEY = "uplink_highscore";
const COMBO_WINDOW = 2600; // ms to chain captures for a multiplier

const DIRS: Record<Dir, Vec> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const OPPOSITE: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };

function randCell(exclude: Vec[]): Vec {
  while (true) {
    const c = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    if (!exclude.some((e) => e.x === c.x && e.y === c.y)) return c;
  }
}

export default function ArcadeGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [high, setHigh] = useState(() => {
    const v = typeof localStorage !== "undefined" ? Number(localStorage.getItem(HS_KEY)) : 0;
    return Number.isFinite(v) ? v : 0;
  });

  // Mutable game state kept in refs so the loop never restarts on re-render.
  const snake = useRef<Vec[]>([]);
  const dir = useRef<Dir>("right");
  const queued = useRef<Dir[]>([]);
  const node = useRef<Vec>({ x: 0, y: 0 });
  const tick = useRef(TICK_START);
  const acc = useRef(0);
  const last = useRef(0);
  const raf = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const scoreRef = useRef(0);
  const pulse = useRef(0);
  const particles = useRef<Particle[]>([]);
  const shake = useRef(0);
  const comboRef = useRef(1);
  const lastEat = useRef(0);
  const flash = useRef(0);

  const reset = useCallback(() => {
    const mid = Math.floor(GRID / 2);
    snake.current = [
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
      { x: mid - 3, y: mid },
    ];
    dir.current = "right";
    queued.current = [];
    node.current = randCell(snake.current);
    tick.current = TICK_START;
    acc.current = 0;
    scoreRef.current = 0;
    setScore(0);
    comboRef.current = 1;
    setCombo(1);
    particles.current = [];
    shake.current = 0;
    flash.current = 0;
    lastEat.current = 0;
  }, []);

  const start = useCallback(() => {
    reset();
    setPhase("playing");
  }, [reset]);

  const turn = useCallback((d: Dir) => {
    const base = queued.current.length ? queued.current[queued.current.length - 1] : dir.current;
    if (d === base || d === OPPOSITE[base]) return;
    if (queued.current.length < 2) queued.current.push(d);
  }, []);

  // Input: keyboard (game + global controls)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      const map: Record<string, Dir> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right",
      };
      if (map[e.key]) {
        e.preventDefault();
        if (phaseRef.current === "playing") turn(map[e.key]);
        return;
      }
      if ((e.key === "Enter" || e.key === " ") && phaseRef.current !== "playing") {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, turn, start]);

  // Input: touch swipe
  useEffect(() => {
    let sx = 0, sy = 0, active = false;
    const el = canvasRef.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; active = true; };
    const onMove = (e: TouchEvent) => {
      if (!active) return;
      const t = e.touches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (phaseRef.current === "playing") {
        if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? "right" : "left");
        else turn(dy > 0 ? "down" : "up");
      }
      active = false;
      e.preventDefault();
    };
    const onEnd = () => { active = false; };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [turn]);

  // Game loop + renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const SIZE = 476; // css px, square
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    ctx.scale(DPR, DPR);
    const cell = SIZE / GRID;

    const step = () => {
      const nextDir = queued.current.shift() ?? dir.current;
      dir.current = nextDir;
      const head = snake.current[0];
      const nh = { x: head.x + DIRS[nextDir].x, y: head.y + DIRS[nextDir].y };
      // wall or self collision -> game over
      if (nh.x < 0 || nh.y < 0 || nh.x >= GRID || nh.y >= GRID ||
          snake.current.some((s) => s.x === nh.x && s.y === nh.y)) {
        setPhase("over");
        shake.current = 14;
        const hs = Math.max(high, scoreRef.current);
        if (hs !== high) { setHigh(hs); try { localStorage.setItem(HS_KEY, String(hs)); } catch { /* noop */ } }
        return;
      }
      snake.current.unshift(nh);
      if (nh.x === node.current.x && nh.y === node.current.y) {
        // combo: chain captures within COMBO_WINDOW to raise the multiplier
        const now = performance.now();
        if (now - lastEat.current < COMBO_WINDOW) comboRef.current = Math.min(comboRef.current + 1, 9);
        else comboRef.current = 1;
        lastEat.current = now;
        setCombo(comboRef.current);
        scoreRef.current += comboRef.current;
        setScore(scoreRef.current);
        // burst particles at the captured node
        const cx = node.current.x * (SIZE / GRID) + (SIZE / GRID) / 2;
        const cy = node.current.y * (SIZE / GRID) + (SIZE / GRID) / 2;
        const n = 10 + comboRef.current * 2;
        for (let i = 0; i < n; i++) {
          const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
          const spd = 1.5 + Math.random() * 2.5;
          particles.current.push({
            x: cx, y: cy, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
            life: 1, max: 1, hue: Math.random() > 0.5 ? "#C4B5FD" : "#818CF8",
          });
        }
        shake.current = Math.min(3 + comboRef.current, 9);
        flash.current = 1;
        node.current = randCell(snake.current);
        tick.current = Math.max(TICK_MIN, TICK_START - scoreRef.current * 2);
      } else {
        snake.current.pop();
      }
    };

    const draw = (t: number) => {
      pulse.current = t;
      // background
      ctx.clearRect(0, 0, SIZE, SIZE);

      // screen shake: translate the whole board by a decaying random offset
      ctx.save();
      if (shake.current > 0.2) {
        const s = shake.current;
        ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
        shake.current *= 0.85;
      } else {
        shake.current = 0;
      }

      ctx.fillStyle = "#0B0B0F";
      ctx.fillRect(-20, -20, SIZE + 40, SIZE + 40);

      // capture flash: brief accent wash that fades fast
      if (flash.current > 0.02) {
        ctx.fillStyle = `rgba(129,140,248,${flash.current * 0.10})`;
        ctx.fillRect(-20, -20, SIZE + 40, SIZE + 40);
        flash.current *= 0.82;
      } else {
        flash.current = 0;
      }
      // grid dots
      ctx.fillStyle = "rgba(99,102,241,0.10)";
      for (let x = 0; x < GRID; x++) {
        for (let y = 0; y < GRID; y++) {
          ctx.beginPath();
          ctx.arc(x * cell + cell / 2, y * cell + cell / 2, 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // target node (pulsing)
      const p = (Math.sin(t / 260) + 1) / 2;
      const ncx = node.current.x * cell + cell / 2;
      const ncy = node.current.y * cell + cell / 2;
      const glow = ctx.createRadialGradient(ncx, ncy, 0, ncx, ncy, cell * (1.4 + p * 0.5));
      glow.addColorStop(0, "rgba(168,85,247,0.55)");
      glow.addColorStop(1, "rgba(168,85,247,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ncx, ncy, cell * (1.4 + p * 0.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#C4B5FD";
      ctx.beginPath();
      ctx.arc(ncx, ncy, cell * 0.26, 0, Math.PI * 2);
      ctx.fill();

      // snake as connected mesh: edges then nodes
      const seg = snake.current;
      if (seg.length) {
        // edges
        ctx.lineWidth = Math.max(2, cell * 0.16);
        ctx.lineCap = "round";
        for (let i = 0; i < seg.length - 1; i++) {
          const a = seg[i], b = seg[i + 1];
          // don't draw a line across a wrap (adjacent only)
          if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) !== 1) continue;
          const grad = ctx.createLinearGradient(
            a.x * cell + cell / 2, a.y * cell + cell / 2,
            b.x * cell + cell / 2, b.y * cell + cell / 2
          );
          grad.addColorStop(0, "#A5B4FC");
          grad.addColorStop(1, "#6366F1");
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(a.x * cell + cell / 2, a.y * cell + cell / 2);
          ctx.lineTo(b.x * cell + cell / 2, b.y * cell + cell / 2);
          ctx.stroke();
        }
        // nodes
        for (let i = 0; i < seg.length; i++) {
          const s = seg[i];
          const cx = s.x * cell + cell / 2;
          const cy = s.y * cell + cell / 2;
          const isHead = i === 0;
          if (isHead) {
            const hg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cell * 1.1);
            hg.addColorStop(0, "rgba(129,140,248,0.6)");
            hg.addColorStop(1, "rgba(129,140,248,0)");
            ctx.fillStyle = hg;
            ctx.beginPath();
            ctx.arc(cx, cy, cell * 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = isHead ? "#C4B5FD" : "#818CF8";
          ctx.beginPath();
          ctx.arc(cx, cy, cell * (isHead ? 0.3 : 0.22), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // particles: capture bursts that fade + drift
      const ps = particles.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const pt = ps[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vx *= 0.92;
        pt.vy *= 0.92;
        pt.life -= 0.035;
        if (pt.life <= 0) { ps.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.hue;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, cell * 0.12 * pt.life + 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.restore();
    };

    const frame = (t: number) => {
      if (!last.current) last.current = t;
      const dt = t - last.current;
      last.current = t;
      if (phaseRef.current === "playing") {
        acc.current += dt;
        // combo lapses if the player waits too long between captures
        if (comboRef.current > 1 && performance.now() - lastEat.current > COMBO_WINDOW) {
          comboRef.current = 1;
          setCombo(1);
        }
        while (acc.current >= tick.current) {
          acc.current -= tick.current;
          step();
          if (phaseRef.current !== "playing") break;
        }
      }
      draw(t);
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, [high]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.94, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="relative w-[min(92vw,520px)] rounded-3xl border border-border bg-surface/95 p-5 shadow-2xl"
      >
        {/* header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-semibold tracking-tight text-fg">Uplink</span>
            <AnimatePresence>
              {combo > 1 && phase === "playing" && (
                <motion.span
                  key={combo}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="rounded-full border border-accent/50 bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent-glow"
                >
                  ×{combo} combo
                </motion.span>
              )}
            </AnimatePresence>
            {(phase !== "playing" || combo <= 1) && (
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted">
                easter egg
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted">score <span className="font-semibold text-fg">{score}</span></span>
            <span className="text-muted">best <span className="font-semibold text-accent-glow">{high}</span></span>
            <button
              onClick={onClose}
              aria-label="Close game"
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted transition hover:border-accent hover:text-fg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* board */}
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <canvas
            ref={canvasRef}
            style={{ width: "100%", aspectRatio: "1 / 1", display: "block", touchAction: "none" }}
          />
          <AnimatePresence>
            {phase !== "playing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 grid place-items-center bg-bg/70 backdrop-blur-[2px]"
              >
                <div className="text-center">
                  {phase === "over" ? (
                    <>
                      <div className="font-display text-2xl font-bold text-fg">Link severed</div>
                      <div className="mt-1 text-sm text-muted">
                        {score} node{score === 1 ? "" : "s"} routed
                        {score > 0 && score >= high ? " · new best" : ""}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-display text-2xl font-bold text-fg">Uplink</div>
                      <div className="mt-1 max-w-[20rem] text-sm text-muted">
                        Route the packet through nodes to grow the mesh. Chain captures fast for a combo multiplier. Do not cross your own links or hit the edge.
                      </div>
                    </>
                  )}
                  <button
                    onClick={start}
                    className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-glow"
                  >
                    {phase === "over" ? "Reconnect" : "Start"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* footer controls hint */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-xs text-muted">
          <span>arrows / WASD to steer</span>
          <span className="hidden sm:inline">·</span>
          <span>swipe on mobile</span>
          <span className="hidden sm:inline">·</span>
          <span>Esc to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
