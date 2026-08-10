import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSeo } from "../useSeo";
import { scrollToId } from "../scrollTo";
import Preloader from "../components/Preloader";
import SocialRail from "../components/SocialRail";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Work from "../components/Work";
import ArcaneTeaser from "../components/ArcaneTeaser";
import Services from "../components/Services";
import About from "../components/About";
import Experience from "../components/Experience";
import LatestWriting from "../components/LatestWriting";
import Contact from "../components/Contact";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();

  useSeo({
    title: "Mahir Musleh — Senior Solution Architect | Backend, Cloud & AI",
    description:
      "Mahir Musleh is a Senior Solution Architect with 12+ years building scalable backend systems, cloud infrastructure and AI/LLM platforms. Available for select projects and roles.",
    canonical: "https://arcma.dev/",
    ogType: "website",
  });

  // Lock scroll while the preloader is up
  useEffect(() => {
    document.body.style.overflow = loaded ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loaded]);

  // Absolute safety net: never leave the page scroll-locked. Even if the
  // preloader's onDone is somehow missed, unlock the body after 5s.
  useEffect(() => {
    const t = setTimeout(() => {
      setLoaded(true);
      document.body.style.overflow = "";
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  // When arriving with a hash (e.g. /#work from a case study), scroll to it
  useEffect(() => {
    if (!loaded) return;
    if (location.hash) {
      const id = location.hash.replace(/^#/, "");
      requestAnimationFrame(() => scrollToId(id));
    }
  }, [loaded, location.hash]);

  return (
    <>
      <Preloader onDone={() => setLoaded(true)} />
      <SocialRail />
      <Navbar />
      <main>
        <Hero />
        <Work />
        <ArcaneTeaser />
        <Services />
        <About />
        <Experience />
        <LatestWriting />
        <Contact />
      </main>
    </>
  );
}
