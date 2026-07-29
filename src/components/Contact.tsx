import { motion } from "framer-motion";
import { profile } from "../data";
import { viewportOnce, expoOut } from "../motion";
import { Magnetic } from "./primitives";
import { socialIcon, IconGlobe, IconArrowUpRight, IconMail, IconPhone, IconMapPin } from "./icons";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-28">
      {/* Marquee headline */}
      <div className="relative flex flex-col gap-2 py-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {[0, 1].map((row) => (
          <motion.div
            key={row}
            aria-hidden
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: row % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
            transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          >
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex items-center gap-8">
                {["Let's build something", "Available for work", "Say hello"].map((t) => (
                  <span
                    key={t + k}
                    className="font-display text-6xl font-bold tracking-tighter text-transparent sm:text-8xl"
                    style={{ WebkitTextStroke: "1px #2a2a30" }}
                  >
                    {t} <span className="text-accent" style={{ WebkitTextStroke: "0" }}>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="mx-auto max-w-container px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: expoOut }}
          className="relative -mt-2 overflow-hidden rounded-[2rem] border border-border bg-surface p-10 text-center sm:p-16"
        >
          <div
            aria-hidden
            style={{ ["--glow-color" as string]: "rgba(99,102,241,0.30)" }}
            className="glow pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full"
          />
          <p className="relative z-10 mb-4 font-mono text-xs uppercase tracking-widest text-accent">
            Currently taking new projects
          </p>
          <h2 className="relative z-10 mx-auto max-w-2xl text-4xl font-bold tracking-tighter sm:text-6xl">
            Let's architect your next product together.
          </h2>
          <p className="relative z-10 mx-auto mt-5 max-w-md text-muted">
            Tell me what you're building. I reply to every serious enquiry within 24 hours.
          </p>
          <div className="relative z-10 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic strength={0.5}>
              <a
                href={`mailto:${profile.email}`}
                data-cursor="Email me"
                className="group flex items-center gap-2 rounded-full bg-fg px-7 py-3.5 text-sm font-semibold text-bg transition-transform duration-200 active:scale-[0.97]"
              >
                {profile.email}
                <IconArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Magnetic>
            <a
              href="#work"
              data-cursor=""
              className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-fg transition-colors duration-200 hover:border-accent/50 hover:bg-accent/10"
            >
              See the work first
            </a>
          </div>

          {/* Direct contact details */}
          <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 transition-colors hover:text-fg" data-cursor="">
              <IconMail size={16} className="text-accent" /> {profile.email}
            </a>
            <a href={`tel:${profile.phone}`} className="flex items-center gap-2 transition-colors hover:text-fg" data-cursor="">
              <IconPhone size={16} className="text-accent" /> {profile.phone}
            </a>
            <span className="flex items-center gap-2">
              <IconMapPin size={16} className="text-accent" /> {profile.location}
            </span>
          </div>
        </motion.div>

        <footer className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {profile.displayName}. Built with React & Framer Motion.
          </p>
          <div className="flex items-center gap-2">
            {profile.socials.map((s) => {
              const Icon = socialIcon[s.label] ?? IconGlobe;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor=""
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-fg"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </footer>
      </div>
    </section>
  );
}
