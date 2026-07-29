import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { profile, stats } from "../data";
import { expoOut } from "../motion";
import { Magnetic, Counter } from "./primitives";
import Logo from "./Logo";

const headline = ["Architect.", "Build.", "Scale."];
const roles = ["Solution Architecture", "Backend Systems", "AI & LLM Platforms", "Cloud & DevOps"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Rotating role word ticker
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yContent = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Pointer-reactive ambient light
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const bx = useSpring(mx, { stiffness: 60, damping: 20 });
  const by = useSpring(my, { stiffness: 60, damping: 20 });
  const blobX = useTransform(bx, [0, 1], ["-12%", "12%"]);
  const blobY = useTransform(by, [0, 1], ["-12%", "12%"]);
  const blob2X = useTransform(bx, [0, 1], ["10%", "-10%"]);
  const blob2Y = useTransform(by, [0, 1], ["8%", "-8%"]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pt-28"
    >
      {/* Aurora sweep (desktop only: constant rotation is costly on mobile) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 opacity-40 md:block"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent, rgba(99,102,241,0.18), transparent 40%, rgba(168,85,247,0.16), transparent 75%)",
          borderRadius: "9999px",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 70%)",
        }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      />
      {/* Ambient light glows (gradient, not blur filter, for mobile perf) */}
      <motion.div
        aria-hidden
        style={{ x: blobX, y: blobY, ["--glow-color" as string]: "rgba(99,102,241,0.30)" }}
        className="glow pointer-events-none absolute -left-24 top-1/4 h-[38rem] w-[38rem] rounded-full"
      />
      <motion.div
        aria-hidden
        style={{ x: blob2X, y: blob2Y, ["--glow-color" as string]: "rgba(168,85,247,0.24)" }}
        className="glow pointer-events-none absolute -right-24 bottom-0 h-[34rem] w-[34rem] rounded-full"
      />
      {/* Giant floating logo watermark */}
      <motion.div
        aria-hidden
        style={{ x: blob2X, y: blobY }}
        className="pointer-events-none absolute right-[6%] top-[16%] hidden opacity-[0.04] lg:block"
        animate={reduce ? {} : { rotate: [0, 6, 0], y: [0, -18, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      >
        <Logo size={300} />
      </motion.div>
      {/* Grid + noise overlays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 noise opacity-[0.03]" />

      <motion.div
        style={{ y: yContent, opacity }}
        className="relative z-10 mx-auto max-w-container text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: expoOut, delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Available for select projects
        </motion.div>

        {/* Headline with per-word reveal */}
        <h1 className="relative font-display text-[15vw] font-bold leading-[0.9] tracking-tighter sm:text-[11vw] md:text-[9rem]">
          <span
            aria-hidden
            style={{ ["--glow-color" as string]: "rgba(99,102,241,0.28)" }}
            className="glow pointer-events-none absolute left-1/2 top-1/2 -z-10 h-40 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          />          {headline.map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  ease: expoOut,
                  delay: 0.25 + i * 0.12,
                }}
                className={`inline-block ${
                  i === 1 ? "accent-gradient animate-gradient-pan" : "text-gradient"
                }`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: expoOut, delay: 0.7 }}
          className="mx-auto mt-8 max-w-xl text-balance text-base text-muted sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        {/* Rotating specialty ticker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: expoOut, delay: 0.78 }}
          className="mt-7 flex items-center justify-center gap-2 text-sm text-muted"
        >
          <span className="font-mono text-xs uppercase tracking-widest">Focused on</span>
          <span className="relative inline-flex h-6 min-w-[13rem] items-center justify-start overflow-hidden text-left sm:min-w-[15rem]">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIdx}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.45, ease: expoOut }}
                className="absolute font-display font-semibold text-fg"
              >
                {roles[roleIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: expoOut, delay: 0.82 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Magnetic strength={0.5}>
            <a
              href="#work"
              data-cursor="See work"
              className="group relative block w-full overflow-hidden rounded-full bg-fg px-7 py-3.5 text-center text-sm font-semibold text-bg transition-transform duration-200 active:scale-[0.97] sm:w-auto"
            >
              <span className="relative z-10">View selected work</span>
            </a>
          </Magnetic>
          <Magnetic strength={0.5}>
            <a
              href="#contact"
              data-cursor="Say hi"
              className="block w-full rounded-full border border-border bg-white/[0.02] px-7 py-3.5 text-center text-sm font-semibold text-fg backdrop-blur transition-colors duration-200 hover:border-accent/50 hover:bg-accent/10 sm:w-auto"
            >
              Start a conversation
            </a>
          </Magnetic>
        </motion.div>

        {/* Stats row */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border/50 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-bg/80 px-4 py-5 backdrop-blur">
              <dt className="font-display text-2xl font-bold text-fg sm:text-3xl">
                <Counter value={s.value} />
              </dt>
              <dd className="mt-1 text-xs text-muted">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-border p-1">
          <motion.span
            animate={reduce ? {} : { y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-muted"
          />
        </div>
      </motion.div>
    </section>
  );
}
