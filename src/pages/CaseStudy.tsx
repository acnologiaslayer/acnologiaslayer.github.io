import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "../data";
import { useSeo } from "../useSeo";
import { expoOut } from "../motion";
import { Magnetic } from "../components/primitives";
import { IconArrowUpRight, IconCheck } from "../components/icons";
import Logo from "../components/Logo";

export default function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-display text-2xl font-semibold">Case study not found.</p>
        <Link
          to="/"
          className="rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
        >
          Back home
        </Link>
      </div>
    );
  }

  const meta = [
    { label: "Client", value: project.client },
    { label: "Role", value: project.role },
    { label: "Timeline", value: project.timeline },
    { label: "Domain", value: project.category },
  ].filter((m) => m.value);

  const canonical = `https://arcma.dev/work/${project.slug}`;
  const seoTitle = `${project.title} — Case Study | Mahir Musleh`;
  const seoDesc = project.summary;
  useSeo({
    title: seoTitle,
    description: seoDesc,
    canonical,
    ogType: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      headline: seoTitle,
      description: seoDesc,
      url: canonical,
      image: "https://arcma.dev/og-image.png",
      dateCreated: project.year,
      keywords: project.tags.join(", "),
      about: project.category,
      author: { "@type": "Person", name: "Md. Mahir Musleh" },
      creator: { "@type": "Person", name: "Md. Mahir Musleh" },
    },
  });

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      {/* top bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav className="flex w-full max-w-container items-center justify-between rounded-full glass px-5 py-3">
          <Link to="/" data-cursor="" className="group flex items-center gap-2.5 text-sm font-semibold">
            <Logo size={30} />
            <span className="hidden sm:inline">Mahir Musleh</span>
          </Link>
          <Link
            to="/#work"
            data-cursor=""
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All work
          </Link>
        </nav>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden px-6 pt-40 pb-16">
        <div
          aria-hidden
          className="glow pointer-events-none absolute left-1/2 top-10 h-72 w-[40rem] -translate-x-1/2 rounded-full"
          style={{ ["--glow-color" as string]: `${project.accent}33` }}
        />
        <div className="relative mx-auto max-w-container">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: expoOut }}
            className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
            style={{ color: project.accent }}
          >
            <span className="h-px w-8" style={{ backgroundColor: project.accent }} />
            {project.category} · {project.year}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.05 }}
            className="max-w-4xl text-4xl font-bold tracking-tighter sm:text-6xl"
          >
            {project.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.12 }}
            className="mt-6 max-w-2xl text-lg text-muted"
          >
            {project.summary}
          </motion.p>

          {/* meta grid */}
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.2 }}
            className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border/50 sm:grid-cols-4"
          >
            {meta.map((m) => (
              <div key={m.label} className="bg-bg px-5 py-5">
                <dt className="text-xs uppercase tracking-wider text-muted">{m.label}</dt>
                <dd className="mt-1.5 text-sm font-medium text-fg">{m.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* body */}
      <section className="mx-auto max-w-container px-6 pb-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          {/* stack / tags */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">Stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-elevated px-3 py-1 text-sm text-fg/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-14">
            <div>
              <h2 className="font-display text-2xl font-semibold">The challenge</h2>
              <p className="mt-4 leading-relaxed text-muted">{project.challenge}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold">The approach</h2>
              <ul className="mt-5 space-y-3">
                {project.approach.map((a) => (
                  <li key={a} className="flex gap-3 leading-relaxed text-muted">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: project.accent }}
                    />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {project.sections?.map((s) => (
              <div key={s.heading}>
                <h2 className="font-display text-2xl font-semibold">{s.heading}</h2>
                <p className="mt-4 leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}

            <div>
              <h2 className="font-display text-2xl font-semibold">Outcomes</h2>
              <ul className="mt-5 space-y-3">
                {project.outcomes.map((o) => (
                  <li key={o} className="flex gap-3 leading-relaxed text-fg/90">
                    <IconCheck size={18} className="mt-0.5 shrink-0" style={{ color: project.accent }} />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* next + CTA */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-container flex-col gap-8 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Next case study</p>
            <Link
              to={`/work/${next.slug}`}
              data-cursor="Open"
              className="group mt-3 flex items-center gap-3 font-display text-2xl font-semibold tracking-tight transition-colors hover:text-accent-glow sm:text-3xl"
            >
              {next.title}
              <IconArrowUpRight
                size={24}
                className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
          <Magnetic strength={0.4}>
            <Link
              to="/#contact"
              data-cursor="Say hi"
              className="rounded-full bg-fg px-7 py-3.5 text-sm font-semibold text-bg transition-transform duration-200 active:scale-[0.97]"
            >
              Start a project
            </Link>
          </Magnetic>
        </div>
      </section>
    </div>
  );
}
