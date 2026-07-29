import { motion } from "framer-motion";
import { experience } from "../data";
import { fadeUp, staggerContainer, viewportOnce } from "../motion";

export default function Experience() {
  const notable = experience.filter((job) => job.featured);

  return (
    <section id="experience" className="relative overflow-hidden border-y border-border bg-surface/40">
      <div className="mx-auto max-w-container px-6 py-28">
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
              <span className="h-px w-8 bg-accent" /> Experience
            </p>
            <h2 className="max-w-xl text-4xl font-bold tracking-tighter sm:text-5xl">
              Where I've made an impact.
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted">
            A selection of the roles where I led architecture, teams and delivery.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-5 sm:grid-cols-2"
        >
          {notable.map((job) => (
            <motion.div
              key={job.company}
              variants={fadeUp}
              className="group rounded-3xl border border-border bg-bg p-7 transition-colors duration-300 hover:border-accent/40"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-fg">{job.role}</h3>
                  <p className="mt-1 text-sm font-medium text-accent-glow">{job.company}</p>
                </div>
                <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted">
                  {job.location}
                </span>
              </div>
              <ul className="space-y-2 border-t border-border pt-5">
                {job.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
