import { useEffect } from "react";

type SeoInput = {
  title: string;
  description: string;
  canonical: string;
  ogType?: "website" | "article";
  image?: string;
  jsonLd?: Record<string, unknown>;
};

const OG_IMAGE_DEFAULT = "https://acnologiaslayer.github.io/og-image.png";

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/*
 * Imperatively updates the document's SEO tags in place so there is always
 * exactly one of each (no duplicates when navigating between routes in the SPA).
 * A route-scoped JSON-LD block is injected and cleaned up on unmount.
 */
export function useSeo({
  title,
  description,
  canonical,
  ogType = "website",
  image = OG_IMAGE_DEFAULT,
  jsonLd,
}: SeoInput) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setLink("canonical", canonical);

    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    let script: HTMLScriptElement | null = null;
    if (jsonLdKey) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-route-ld", "true");
      script.textContent = jsonLdKey;
      document.head.appendChild(script);
    }

    return () => {
      if (script) script.remove();
    };
  }, [title, description, canonical, ogType, image, jsonLdKey]);
}
