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
        <Link to="/arcane" data-cursor="" className="flex items-center gap-2.5 text-sm font-semibold">
          <Logo size={30} />
          <span>
            Arcane
            {current ? <span className="text-muted"> / {current}</span> : null}
          </span>
        </Link>
        <div className="flex items-center gap-5 text-sm text-muted">
          <Link to="/arcane" data-cursor="" className="transition-colors hover:text-fg">
            Case studies
          </Link>
          <Link to="/" data-cursor="" className="transition-colors hover:text-fg">
            Mahir Musleh
          </Link>
        </div>
      </nav>
    </header>
  );
}
