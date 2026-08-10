import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products, suite } from "../products";
import { useSeo } from "../useSeo";
import { fadeUp, staggerContainer, viewportOnce, expoOut } from "../motion";
import { IconArrowUpRight } from "../components/icons";
import ArcaneNav from "../components/ArcaneNav";

export default function ArcaneSuite() {
  useSeo({
    title: "Arcane Suite — Local-first generative AI tools by Mahir Musleh",
    description: `${suite.tagline} ${products.map((p) => p.name).join(", ")}.`,
    canonical: "https://arcma.dev/arcane",
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Arcane Suite",
      url: "https://arcma.dev/arcane",
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: p.name,
          description: p.tagline,
          applicationCategory: p.category,
          operatingSystem: p.platforms.join(", "),
          url: `https://arcma.dev/arcane/${p.slug}`,
        },
      })),
    },
  });

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <ArcaneNav />

      <section className="relative overflow-hidden px-6 pt-40 pb-16">
        <div
          aria-hidden
          className="glow pointer-events-none absolute left-1/2 top-6 h-72 w-[42rem] -translate-x-1/2 rounded-full"
          style={{ ["--glow-color" as string]: "rgba(99,102,241,0.22)" }}
        />
        <div className="relative mx-auto max-w-container">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: expoOut }}
            className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent"
          >
            <span className="h-px w-8 bg-accent" /> {products.length} products
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.05 }}
            className="max-w-4xl text-4xl font-bold tracking-tighter sm:text-6xl"
          >
            {suite.tagline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.12 }}
            className="mt-5 max-w-2xl text-muted"
          >
            {suite.intro}
          </motion.p>
        </div>
      </section>

      <section className="px-6 pb-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto grid max-w-container gap-5 md:grid-cols-2"
        >
          {products.map((p, i) => (
            <motion.div
              key={p.slug}
              variants={fadeUp}
              className={i === 0 ? "md:col-span-2" : undefined}
            >
              <Link
                to={`/arcane/${p.slug}`}
                data-cursor="Open"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface p-7 transition-colors duration-300 hover:border-white/15"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(600px circle at 50% 0%, ${p.accent}22, transparent 60%)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className="font-mono text-xs uppercase tracking-widest"
                        style={{ color: p.accent }}
                      >
                        {p.category}
                      </span>
                      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                        {p.name}
                      </h2>
                    </div>
                    <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                      {p.status}
                    </span>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{p.blurb}</p>
                </div>
                <div className="relative z-10 mt-7 flex items-center justify-between gap-4">
                  <ul className="flex flex-wrap gap-2">
                    {p.stack.slice(0, 4).map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                  <span className="flex items-center gap-1.5 text-sm text-muted transition-colors group-hover:text-fg">
                    Details <IconArrowUpRight />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
