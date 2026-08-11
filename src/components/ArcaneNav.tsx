import { Link } from "react-router-dom";
import Logo from "./Logo";

/*
 * Slim header shared by the Arcane suite and product pages. Keeps the same
 * glass treatment as the site nav without the section-anchor logic that only
 * makes sense on the home page.
 */
export default function ArcaneNav({ current }: { current?: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex w-full max-w-container items-center justify-between rounded-full glass px-5 py-3">
        <Link
          to="/arcane"
          data-cursor=""
          className="flex min-w-0 items-center gap-2.5 text-sm font-semibold"
        >
          <Logo size={30} />
          {/* The bar is a fixed-height pill, so nothing in it may wrap. */}
          <span className="truncate whitespace-nowrap">
            Arcane
            {current ? <span className="text-muted"> / {current}</span> : null}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-4 text-sm text-muted sm:gap-5">
          <Link
            to="/arcane"
            data-cursor=""
            className="whitespace-nowrap transition-colors hover:text-fg"
          >
            {/* "Case studies" is too wide next to the crumb on a phone. */}
            <span className="sm:hidden">All</span>
            <span className="hidden sm:inline">Case studies</span>
          </Link>
          <Link
            to="/"
            data-cursor=""
            className="whitespace-nowrap transition-colors hover:text-fg"
          >
            <span className="sm:hidden">Mahir</span>
            <span className="hidden sm:inline">Mahir Musleh</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
