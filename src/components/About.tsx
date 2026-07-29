import { motion } from "framer-motion";
import { skillGroups } from "../data";
import { fadeUp, staggerContainer, viewportOnce, expoOut } from "../motion";
import { iconFor } from "./iconMap";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden border-y border-border bg-surface/40">
      <div className="mx-auto max-w-container px-6 py-28">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: expoOut }}
          >
            <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
              <span className="h-px w-8 bg-accent" /> About
            </p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              I turn complex requirements into{" "}
              <span className="accent-gradient animate-gradient-pan">reliable</span>{" "}
              software.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              <p>
                I'm an accomplished software developer and solution architect
                with over a decade of experience, from embedded hardware and
                back-end systems to enterprise architecture and AI platforms.
              </p>
              <p>
                I work across JavaScript, TypeScript, Python and PHP, with
                frameworks like NestJS, Express and Django, and lean on Docker,
                AWS and GCP to ship efficiently. I've led teams, defined
                architecture, and delivered products end to end for companies
                across Bangladesh, Singapore and the US.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-4 sm:grid-cols-2"
          >
            {skillGroups.map((g) => {
              const Icon = iconFor(g.icon);
              return (
                <motion.div
                  key={g.title}
                  variants={fadeUp}
                  className="group rounded-2xl border border-border bg-bg p-6 transition-colors duration-300 hover:border-accent/40"
                >
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{g.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-border bg-elevated px-2 py-0.5 text-xs text-muted transition-colors group-hover:border-accent/20"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Marquee of tools */}
        <div className="relative mt-20 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
          <motion.div
            aria-hidden
            className="flex gap-10 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          >
            {[...Array(2)].map((_, r) => (
              <div key={r} className="flex gap-10">
                {[
                  "TypeScript", "Python", "NestJS", "Express", "Django",
                  "FastAPI", "React", "Next.js", "PostgreSQL", "MongoDB",
                  "Docker", "AWS", "GCP", "LangChain",
                ].map((t) => (
                  <span
                    key={t + r}
                    className="font-display text-2xl font-medium text-border transition-colors hover:text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
