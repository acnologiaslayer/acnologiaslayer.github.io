/*
 * A small styled console greeting for the curious who open devtools.
 * Architects and engineers poke around; this rewards them and nudges
 * them toward the site's hidden command palette + arcade.
 */
export function consoleTeaser() {
  if (typeof console === "undefined") return;
  const brand = "color:#818CF8;font-weight:700;font-size:13px";
  const dim = "color:#8A8A94;font-size:12px";
  const accent = "color:#C4B5FD;font-weight:600;font-size:12px";
  try {
    console.log("%c✦ Mahir Musleh, Senior Solution Architect", brand);
    console.log("%cPoking around? Good instinct.", dim);
    console.log("%cPress %c⌘K / Ctrl+K%c for the command palette.", dim, accent, dim);
    console.log("%cOr the Konami code: %c↑↑↓↓←→←→ B A", dim, accent);
    console.log("%cBuilding something? Let's talk: arc.mahir@gmail.com", dim);
  } catch {
    /* noop */
  }
}
