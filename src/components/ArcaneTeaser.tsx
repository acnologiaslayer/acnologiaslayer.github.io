import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products, suite } from "../products";
import { fadeUp, staggerContainer, viewportOnce } from "../motion";
import { IconArrowUpRight } from "./icons";
import { AnimatedText } from "./primitives";

/*
 * Home-page teaser for the Arcane Suite. Links through to /arcane rather than
 * duplicating the full product copy.
 */
export default function ArcaneTeaser() {
  return (
    <section id="arcane" className="relative px-6 py-28">
      <div className="mx-auto max-w-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.p
            variants={fadeUp}
            className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent"
          >
            <span className="h-px w-8 bg-accent" /> Products
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="max-w-3xl text-3xl font-bold tracking-tighter sm:text-5xl"
          >
            <AnimatedText text={suite.name} />
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-muted">
            {suite.tagline} {suite.intro}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {products.map((p) => (
              <Link
                key={p.slug}
                to={`/arcane/${p.slug}`}
                data-cursor="Open"
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-white/15"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(400px circle at 50% 0%, ${p.accent}22, transparent 60%)`,
                  }}
                />
                <div className="relative z-10">
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: p.accent }}
                  >
                    {p.category}
                  </span>
                  <h3 className="mt-1.5 font-semibold tracking-tight">{p.shortName}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{p.tagline}</p>
                </div>
              </Link>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8">
            <Link
              to="/arcane"
              data-cursor="Open"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:border-white/15 hover:text-fg"
            >
              Explore the suite <IconArrowUpRight />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
