import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getArticle, articles } from "../content";
import { useSeo } from "../useSeo";
import { expoOut } from "../motion";
import { Magnetic } from "../components/primitives";
import { IconArrowUpRight } from "../components/icons";
import Logo from "../components/Logo";

// Non-secret hint set by the admin panel when signed in (see src/admin/github.ts).
// The token itself lives in sessionStorage and is never read here.
const ADMIN_ACTIVE_KEY = "admin_active";

/* True when an admin session is active in this browser. Reactive to focus and
   storage so the Edit control appears/disappears after signing in or out. */
function useIsAdmin() {
  const read = () => {
    try {
      return !!localStorage.getItem(ADMIN_ACTIVE_KEY);
    } catch {
      return false;
    }
  };
  const [isAdmin, setIsAdmin] = useState(read);
  useEffect(() => {
    const update = () => setIsAdmin(read());
    window.addEventListener("focus", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("focus", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return isAdmin;
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = getArticle(slug || "");
  const index = articles.findIndex((a) => a.slug === slug);
  const next = articles[(index + 1) % articles.length];
  const isAdmin = useIsAdmin();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const canonical = `https://arcma.dev/writing/${slug}`;
  useSeo({
    title: article ? `${article.title} | Mahir Musleh` : "Article not found",
    description: article?.description || "",
    canonical,
    ogType: "article",
    jsonLd: article
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.description,
          datePublished: article.date,
          dateModified: article.date,
          url: canonical,
          image: "https://arcma.dev/og-image.png",
          keywords: article.tags.join(", "),
          author: { "@type": "Person", name: "Md. Mahir Musleh", url: "https://arcma.dev/" },
          publisher: { "@type": "Person", name: "Md. Mahir Musleh" },
          mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        }
      : undefined,
  });

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-display text-2xl font-semibold">Article not found.</p>
        <Link to="/writing" className="rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg">
          All writing
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav className="flex w-full max-w-container items-center justify-between rounded-full glass px-5 py-3">
          <Link to="/" data-cursor="" className="group flex items-center gap-2.5 text-sm font-semibold">
            <Logo size={30} />
            <span className="hidden sm:inline">Mahir Musleh</span>
          </Link>
          <Link
            to="/writing"
            data-cursor=""
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All writing
          </Link>
          {isAdmin && (
            <Link
              to={`/admin?edit=${slug}`}
              data-cursor=""
              className="flex items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1.5 text-sm text-accent-glow transition-colors hover:bg-accent/10"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Edit
            </Link>
          )}
        </nav>
      </header>

      <article className="relative overflow-hidden px-6 pt-40 pb-16">
        <div
          aria-hidden
          className="glow pointer-events-none absolute left-1/2 top-10 h-64 w-[36rem] -translate-x-1/2 rounded-full"
          style={{ ["--glow-color" as string]: "rgba(99,102,241,0.2)" }}
        />
        <div className="relative mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: expoOut }}
            className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted"
          >
            <time className="font-mono text-xs uppercase tracking-widest text-accent">
              {formatDate(article.date)}
            </time>
            <span className="text-border">·</span>
            <span>{article.readingTime} min read</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.05 }}
            className="text-3xl font-bold leading-[1.05] tracking-tighter sm:text-5xl"
          >
            {article.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {article.tags.map((t) => (
              <span key={t} className="rounded-full border border-border bg-elevated px-3 py-1 text-xs text-muted">
                {t}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.2 }}
            className="prose mt-12"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </div>
      </article>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Read next</p>
            <Link
              to={`/writing/${next.slug}`}
              data-cursor="Open"
              className="group mt-3 flex items-center gap-3 font-display text-xl font-semibold tracking-tight transition-colors hover:text-accent-glow sm:text-2xl"
            >
              {next.title}
              <IconArrowUpRight size={22} className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
          <Magnetic strength={0.4}>
            <Link
              to="/#contact"
              data-cursor="Say hi"
              className="shrink-0 rounded-full bg-fg px-7 py-3.5 text-sm font-semibold text-bg transition-transform duration-200 active:scale-[0.97]"
            >
              Work with me
            </Link>
          </Magnetic>
        </div>
      </section>
    </div>
  );
}
