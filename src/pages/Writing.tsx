import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { articles } from "../content";
import { useSeo } from "../useSeo";
import { fadeUp, staggerContainer, expoOut } from "../motion";
import { IconArrowUpRight } from "../components/icons";
import Logo from "../components/Logo";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function Writing() {
  useSeo({
    title: "Writing — Mahir Musleh | Notes on Architecture, Backend & AI",
    description:
      "Essays and notes from Mahir Musleh on software architecture, backend engineering, APIs, and building reliable AI systems.",
    canonical: "https://arcma.dev/writing",
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Mahir Musleh — Writing",
      url: "https://arcma.dev/writing",
      author: { "@type": "Person", name: "Md. Mahir Musleh" },
    },
  });

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav className="flex w-full max-w-container items-center justify-between rounded-full glass px-5 py-3">
          <Link to="/" data-cursor="" className="group flex items-center gap-2.5 text-sm font-semibold">
            <Logo size={30} />
            <span className="hidden sm:inline">Mahir Musleh</span>
          </Link>
          <Link
            to="/"
            data-cursor=""
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Home
          </Link>
        </nav>
      </header>

      <section className="relative overflow-hidden px-6 pt-40 pb-10">
        <div
          aria-hidden
          className="glow pointer-events-none absolute left-1/2 top-10 h-64 w-[36rem] -translate-x-1/2 rounded-full"
          style={{ ["--glow-color" as string]: "rgba(99,102,241,0.22)" }}
        />
        <div className="relative mx-auto max-w-container">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: expoOut }}
            className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent"
          >
            <span className="h-px w-8 bg-accent" /> Writing
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.05 }}
            className="max-w-3xl text-4xl font-bold tracking-tighter sm:text-6xl"
          >
            Notes on building software.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.12 }}
            className="mt-5 max-w-xl text-muted"
          >
            Architecture, backend engineering, and the reality of shipping AI. Published regularly.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-container px-6 pb-24">
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="divide-y divide-border border-t border-border"
        >
          {articles.map((a) => (
            <motion.li key={a.slug} variants={fadeUp}>
              <Link
                to={`/writing/${a.slug}`}
                data-cursor="Read"
                className="group flex flex-col gap-3 py-8 transition-colors sm:flex-row sm:items-baseline sm:gap-10"
              >
                <div className="shrink-0 sm:w-40">
                  <time className="font-mono text-xs text-muted">{formatDate(a.date)}</time>
                  <p className="mt-1 text-xs text-border">{a.readingTime} min read</p>
                </div>
                <div className="flex-1">
                  <h2 className="flex items-start gap-2 font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent-glow sm:text-2xl">
                    {a.title}
                    <IconArrowUpRight
                      size={18}
                      className="mt-1 shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{a.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {a.tags.map((t) => (
                      <span key={t} className="rounded-full border border-border bg-elevated px-2.5 py-0.5 text-xs text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </div>
  );
}
