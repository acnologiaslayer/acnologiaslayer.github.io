/*
 * Reliable in-page scrolling to a section by id.
 *
 * Sections use `content-visibility: auto` for performance. Off-screen sections
 * report an *estimated* height until they render, so a single jump to a far
 * section lands short: the document keeps growing as intervening sections
 * render mid-scroll, and the target moves out from under the scroll position.
 *
 * Fix: before scrolling, force every section to fully render by removing
 * content-visibility, which resolves all real heights immediately. Scroll to
 * the now-accurate position, then restore content-visibility on the sections
 * that are off-screen so performance is unaffected.
 */

const NAV_OFFSET = 96; // fixed header height + breathing room

export function scrollToId(id: string, smooth = true) {
  const target = id.replace(/^#/, "");
  const el = document.getElementById(target);
  if (!el) return;

  const sections = Array.from(document.querySelectorAll<HTMLElement>("section"));

  // 1. Force full layout: make every section render its real height now.
  for (const s of sections) s.style.contentVisibility = "visible";

  // 2. Reading a layout property flushes the pending layout synchronously.
  void document.body.offsetHeight;

  // 3. Scroll to the now-accurate target.
  const y = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET));
  window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });

  // 4. Restore content-visibility after the scroll settles. The browser
  //    re-virtualizes off-screen sections; on-screen ones stay rendered.
  const restore = () => {
    for (const s of sections) s.style.contentVisibility = "";
  };
  // Smooth scrolls take a moment; wait past them before restoring so the
  // heights don't change mid-animation and shift the destination.
  window.setTimeout(restore, smooth ? 700 : 50);
}
