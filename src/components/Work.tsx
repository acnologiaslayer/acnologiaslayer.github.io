import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import type { Project } from "../data";
import { projects } from "../data";
import { fadeUp, staggerContainer, viewportOnce, expoOut } from "../motion";
import { AnimatedText } from "./primitives";

const MotionLink = motion(Link);

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const rotateX = useTransform(srx, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(sry, [-0.5, 0.5], ["-6deg", "6deg"]);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rx.set((e.clientY - r.top) / r.height - 0.5);
    ry.set((e.clientX - r.left) / r.width - 0.5);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div variants={fadeUp} className={project.featured ? "md:col-span-3" : "md:col-span-2"}>
      <MotionLink
        to={`/work/${project.slug}`}
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        data-cursor="View case"
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface p-7 transition-colors duration-300 hover:border-white/15"
      >
        {/* Glow following accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at 50% 0%, ${project.accent}22, transparent 60%)`,
          }}
        />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: `${project.accent}1a`, color: project.accent }}
            >
              {project.category}
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {project.title}
            </h3>
          </div>
          <span className="shrink-0 font-mono text-xs text-muted">{project.year}</span>
        </div>

        <p className="relative z-10 mt-3 max-w-lg text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-elevated px-3 py-1 text-xs text-muted"
            >
              {t}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-1 text-sm font-medium text-fg opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
            View
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <span className="pointer-events-none absolute right-6 top-6 z-10 font-mono text-xs text-border">
          0{index + 1}
        </span>
      </MotionLink>
    </motion.div>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative mx-auto max-w-container px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: expoOut }}
        className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
      >
        <div>
          <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-px w-8 bg-accent" /> Selected Work
          </p>
          <AnimatedText
            as="h2"
            text="Things I've architected and shipped."
            className="block max-w-xl text-4xl font-bold tracking-tighter sm:text-5xl"
          />
        </div>
        <p className="max-w-xs text-sm text-muted">
          A selection of recent work. Each one blends system design, careful engineering and reliable delivery.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid grid-cols-1 gap-5 md:grid-cols-6"
      >
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
