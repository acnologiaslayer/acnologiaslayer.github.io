import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { productBySlug, products } from "../products";
import { useSeo } from "../useSeo";
import { fadeUp, staggerContainer, viewportOnce, expoOut } from "../motion";
import { IconArrowUpRight } from "../components/icons";
import ArcaneNav from "../components/ArcaneNav";
import ProductLogo, { type ProductMark } from "../components/ProductLogo";

export default function ArcaneProduct() {
  const { slug } = useParams();
  const product = productBySlug(slug);

  useSeo({
    title: product
      ? `${product.name} — ${product.tagline} | Arcane Suite`
      : "Not found — Arcane Suite",
    description: product ? product.blurb : "This product does not exist.",
    canonical: `https://arcma.dev/arcane/${slug ?? ""}`,
    ogType: "website",
    noindex: !product,
    jsonLd: product
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: product.name,
          description: product.blurb,
          applicationCategory: product.category,
          operatingSystem: product.platforms.join(", "),
          url: `https://arcma.dev/arcane/${product.slug}`,
          author: { "@type": "Person", name: "Md. Mahir Musleh" },
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }
      : undefined,
  });

  if (!product) return <Navigate to="/arcane" replace />;

  const others = products.filter((p) => p.slug !== product.slug);

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <ArcaneNav current={product.shortName} />

      <section className="relative overflow-hidden px-6 pt-40 pb-14">
        <div
          aria-hidden
          className="glow pointer-events-none absolute left-1/2 top-6 h-72 w-[42rem] -translate-x-1/2 rounded-full"
          style={{ ["--glow-color" as string]: `${product.accent}38` }}
        />
        <div className="relative mx-auto max-w-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: expoOut }}
            className="mb-6"
          >
            <ProductLogo mark={product.slug as ProductMark} size={72} withGlow animated />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: expoOut }}
            className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
            style={{ color: product.accent }}
          >
            <span className="h-px w-8" style={{ background: product.accent }} />
            {product.category} · {product.status}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.05 }}
            className="text-4xl font-bold tracking-tighter sm:text-6xl"
          >
            {product.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.1 }}
            className="mt-4 max-w-2xl text-xl text-fg/80"
          >
            {product.tagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.16 }}
            className="mt-5 max-w-2xl leading-relaxed text-muted"
          >
            {product.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: expoOut, delay: 0.22 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href={product.repo}
              target="_blank"
              rel="noreferrer"
              data-cursor="Open"
              className="flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
              style={{ background: product.accent }}
            >
              View source <IconArrowUpRight />
            </a>
            <Link
              to="/arcane"
              data-cursor=""
              className="rounded-full border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:border-white/15 hover:text-fg"
            >
              All products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto grid max-w-container gap-5 sm:grid-cols-2"
        >
          {product.features.map((f) => (
            <motion.article
              key={f.title}
              variants={fadeUp}
              className="rounded-3xl border border-border bg-surface p-7"
            >
              <h2 className="text-lg font-semibold tracking-tight">{f.title}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{f.body}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Meta */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-container gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-border bg-surface p-7">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted">Built with</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.stack.map((s) => (
                <li key={s} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-7">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted">Platforms</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.platforms.map((s) => (
                <li key={s} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-7">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted">Licensing</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {product.licensing === "gpl-3.0"
                ? "Released under GPL-3.0. Source is available to everyone who receives a build."
                : "Proprietary. Source is not distributed; licensed per agreement."}
            </p>
            {product.builtOn ? (
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Built on{" "}
                <a
                  href={product.builtOn.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg underline decoration-border underline-offset-4 hover:decoration-fg"
                >
                  {product.builtOn.name}
                </a>
                , used under {product.builtOn.license}, whose terms are carried in the product's
                third-party notices.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Rest of the suite */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-container">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Rest of the suite</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((p) => (
              <Link
                key={p.slug}
                to={`/arcane/${p.slug}`}
                data-cursor="Open"
                className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-white/15"
              >
                <span
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: p.accent }}
                >
                  {p.category}
                </span>
                <h3 className="mt-1.5 font-semibold tracking-tight">{p.name}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{p.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
