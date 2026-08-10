import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import ArcadeLauncher from "./components/game/ArcadeLauncher";
import PaletteLauncher from "./components/palette/PaletteLauncher";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";
import Writing from "./pages/Writing";
import ArticlePage from "./pages/ArticlePage";
import ArcaneSuite from "./pages/ArcaneSuite";
import ArcaneProduct from "./pages/ArcaneProduct";

// Admin is code-split so its GitHub client + editor never load for visitors.
const Admin = lazy(() => import("./pages/Admin"));

export default function App() {
  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <Cursor />
      <ScrollProgress />
      <ArcadeLauncher />
      <PaletteLauncher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/writing/:slug" element={<ArticlePage />} />
        <Route path="/arcane" element={<ArcaneSuite />} />
        <Route path="/arcane/:slug" element={<ArcaneProduct />} />
        <Route
          path="/admin"
          element={
            <Suspense
              fallback={<div className="grid min-h-screen place-items-center text-muted">Loading admin...</div>}
            >
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}
