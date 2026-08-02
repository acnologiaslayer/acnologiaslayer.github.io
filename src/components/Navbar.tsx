import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { profile } from "../data";
import Logo from "./Logo";
import { scrollToId } from "../scrollTo";

const links = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === "/";

  // Hash links must return home first when viewed from another route.
  const resolveHref = (href: string) =>
    href.startsWith("#") ? (onHome ? href : `/${href}`) : href;
  const isRoute = (href: string) => href.startsWith("/");

  // Handle in-page hash navigation ourselves for reliable scrolling with
  // content-visibility sections (native anchor jumps mis-land on far sections).
  const onHashClick = (e: React.MouseEvent, href: string) => {
    const id = href.replace(/^#/, "");
    setOpen(false);
    if (onHome) {
      e.preventDefault();
      history.replaceState(null, "", `#${id}`);
      scrollToId(id);
    } else {
      // On another route: navigate home, then scroll after render.
      e.preventDefault();
      navigate("/");
      setTimeout(() => scrollToId(id), 400);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-container items-center justify-between rounded-full px-5 py-3 transition-all duration-300 ${
          scrolled ? "glass shadow-lg shadow-black/40" : "bg-transparent"
        }`}
      >
        <a
          href="#top"
          data-cursor=""
          className="group flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight"
        >
          <Logo size={34} className="transition-transform duration-300 group-hover:rotate-[8deg]" />
          <span className="hidden sm:inline">{profile.displayName}</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) =>
            isRoute(l.href) ? (
              <Link
                key={l.href}
                to={l.href}
                className="relative rounded-full px-4 py-2 text-sm text-muted transition-colors duration-200 hover:text-fg"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={resolveHref(l.href)}
                onClick={(e) => onHashClick(e, l.href)}
                className="relative rounded-full px-4 py-2 text-sm text-muted transition-colors duration-200 hover:text-fg"
              >
                {l.label}
              </a>
            )
          )}
          <a
            href={resolveHref("#contact")}
            onClick={(e) => onHashClick(e, "#contact")}
            className="ml-2 rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            Let's talk
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-full text-fg md:hidden"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`h-0.5 w-5 bg-fg transition-transform duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-fg transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-fg transition-transform duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-4 top-20 z-50 flex flex-col gap-1 rounded-2xl glass p-3 md:hidden"
          >
            {links.map((l) =>
              isRoute(l.href) ? (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-muted transition-colors hover:bg-white/5 hover:text-fg"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={resolveHref(l.href)}
                  onClick={(e) => onHashClick(e, l.href)}
                  className="rounded-xl px-4 py-3 text-sm text-muted transition-colors hover:bg-white/5 hover:text-fg"
                >
                  {l.label}
                </a>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
