import { motion } from "framer-motion";
import { profile } from "../data";
import { socialIcon, IconGlobe } from "./icons";

export default function SocialRail() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1.4 }}
      className="fixed bottom-0 left-6 z-40 hidden flex-col items-center gap-4 lg:flex"
    >
      <div className="flex flex-col gap-2">
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
              className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/60 text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-fg"
            >
              <Icon size={16} />
            </a>
          );
        })}
      </div>
      <span className="h-24 w-px bg-border" />
    </motion.div>
  );
}
