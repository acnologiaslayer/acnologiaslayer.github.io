import { motion } from "framer-motion";
import { services, process } from "../data";
import { fadeUp, staggerContainer, viewportOnce, expoOut } from "../motion";
import { AnimatedText } from "./primitives";
import { iconFor } from "./iconMap";
import { IconCheck } from "./icons";

export default function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-container px-6 py-28">
      <div className="mb-16">
        <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
          <span className="h-px w-8 bg-accent" /> What I do
        </p>
        <AnimatedText
          as="h2"
          text="Services built to move your business."
          className="block max-w-2xl text-4xl font-bold tracking-tighter sm:text-5xl"
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 md:grid-cols-3"
      >
        {services.map((s) => {
          const Icon = iconFor(s.icon);
          return (
          <motion.div
            key={s.no}
            variants={fadeUp}
            data-cursor=""
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface p-8 transition-colors duration-300 hover:border-accent/40"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/[0.07] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20 transition-transform duration-300 group-hover:scale-110">
                <Icon size={24} />
              </div>
              <span className="font-mono text-sm text-border">{s.no}</span>
            </div>
            <h3 className="relative mt-5 font-display text-2xl font-semibold">{s.title}</h3>
            <p className="relative mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
            <ul className="relative mt-6 flex flex-col gap-2 border-t border-border pt-5">
              {s.deliverables.map((d) => (
                <li key={d} className="flex items-center gap-2 text-sm text-fg/80">
                  <IconCheck size={14} className="text-accent" />
                  {d}
                </li>
              ))}
            </ul>
          </motion.div>
          );
        })}
      </motion.div>

      {/* Process timeline */}
      <div className="mt-24">
        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: expoOut }}
          className="mb-10 font-mono text-xs uppercase tracking-widest text-muted"
        >
          How we'll work together
        </motion.h3>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {process.map((p) => {
            const Icon = iconFor(p.icon);
            return (
            <motion.div key={p.step} variants={fadeUp} className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-accent">
                  <Icon size={20} />
                </div>
                <span className="font-display text-4xl font-bold text-border">{p.step}</span>
              </div>
              <h4 className="mt-1 font-display text-lg font-semibold">{p.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
