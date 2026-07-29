import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { articles } from "../content";
import { fadeUp, staggerContainer, viewportOnce } from "../motion";
import { IconArrowUpRight, IconArrowRight } from "./icons";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function LatestWriting() {
  const latest = articles.slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section id="writing" className="relative mx-auto max-w-container px-6 py-28">
      <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-px w-8 bg-accent" /> Writing
          </p>
          <h2 className="max-w-xl text-4xl font-bold tracking-tighter sm:text-5xl">
            Notes on building software.
          </h2>
        </div>
        <Link
          to="/writing"
          data-cursor=""
          className="group flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          All articles
          <IconArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 md:grid-cols-3"
      >
        {latest.map((a) => (
          <motion.div key={a.slug} variants={fadeUp}>
            <Link
              to={`/writing/${a.slug}`}
              data-cursor="Read"
              className="group flex h-full flex-col rounded-3xl border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/40"
            >
              <div className="flex items-center gap-3 text-xs text-muted">
                <time className="font-mono">{formatDate(a.date)}</time>
                <span className="text-border">·</span>
                <span>{a.readingTime} min</span>
              </div>
              <h3 className="mt-4 flex items-start gap-2 font-display text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent-glow">
                {a.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{a.description}</p>
              <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-fg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Read article
                <IconArrowUpRight size={16} />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
