import { Routes, Route } from "react-router-dom";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";
import Writing from "./pages/Writing";
import ArticlePage from "./pages/ArticlePage";

export default function App() {
  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <Cursor />
      <ScrollProgress />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/writing/:slug" element={<ArticlePage />} />
      </Routes>
    </div>
  );
}
