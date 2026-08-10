/*
 * Arcane Suite — product catalogue.
 *
 * One entry per product. Drives /arcane (suite page) and /arcane/:slug
 * (individual product pages), plus the sitemap.
 *
 * Everything here must stay factual: features describe what the code in the
 * corresponding repository actually does today.
 */

export type ProductFeature = { title: string; body: string };

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  category: string;
  status: "alpha" | "beta" | "stable";
  accent: string;
  /** One-paragraph positioning used on the suite grid. */
  blurb: string;
  /** Longer intro used at the top of the product page. */
  intro: string;
  features: ProductFeature[];
  stack: string[];
  platforms: string[];
  repo: string;
  /** How this product itself is licensed to customers. */
  licensing: "proprietary" | "gpl-3.0" | "open-source";
  /** Upstream project this builds on, when applicable. */
  builtOn?: { name: string; href: string; license: string };
};

export const suite = {
  name: "Arcane Suite",
  tagline: "A local-first toolkit for building with generative AI.",
  intro:
    "Arcane is a suite of tools for people who want to generate, transcribe and compose with AI on their own hardware. Each product stands on its own, runs on your machine, and shares a common design language.",
};

export const products: Product[] = [
  {
    slug: "agents",
    name: "Arcane Agents",
    shortName: "Agents",
    tagline: "Route every task to the right model, from one CLI.",
    category: "Developer tooling",
    status: "beta",
    accent: "#6366F1",
    blurb:
      "A multi-provider agent harness for the terminal. Arcane Agents scores each task on complexity, cost, performance and intent, then routes it to the model that fits, spawning specialist sub-agents when the work calls for it.",
    intro:
      "Arcane Agents is a command-line harness for working with many model providers at once. Rather than pinning yourself to a single model, you describe the task and the router picks the model that matches its complexity, budget and latency profile. It can load and author skills, and spawn specialist agents at runtime.",
    features: [
      {
        title: "Intent-aware routing",
        body: "Tasks are scored on complexity, cost, performance and intent, then dispatched to the provider that fits the profile instead of a hardcoded default.",
      },
      {
        title: "Spawnable specialists",
        body: "Long or branching work is delegated to sub-agents that run with their own context and report back.",
      },
      {
        title: "Skills, imported and authored",
        body: "File-based skills can be loaded from disk, imported from other ecosystems, or generated at runtime.",
      },
      {
        title: "Provider agnostic",
        body: "Bring your own keys. Swap providers without rewriting your workflows.",
      },
    ],
    stack: ["Python 3.10+", "CLI"],
    platforms: ["macOS", "Linux", "Windows"],
    licensing: "proprietary",
    repo: "https://github.com/acnologiaslayer/arccode",
  },
  {
    slug: "dictate",
    name: "Arcane Dictate",
    shortName: "Dictate",
    tagline: "Press to talk. Get text anywhere. Nothing leaves your machine.",
    category: "Speech to text",
    status: "beta",
    accent: "#22D3EE",
    blurb:
      "A push-to-talk desktop dictation app. Hold a shortcut, speak, release, and the transcript is typed into whatever app has focus. Transcription runs entirely on-device.",
    intro:
      "Arcane Dictate turns any text field into a microphone. Hold your shortcut, speak, and release; the transcript is inserted into the focused application. Models run locally, so recordings and transcripts never leave your computer.",
    features: [
      {
        title: "Global push-to-talk",
        body: "A system-wide shortcut works in any application, with no per-app integration required.",
      },
      {
        title: "On-device transcription",
        body: "Speech recognition models run locally. No audio is uploaded and no account is required.",
      },
      {
        title: "Multilingual interface",
        body: "The app ships translated into more than twenty languages.",
      },
      {
        title: "Small footprint",
        body: "A native Tauri shell keeps memory use and install size far below an Electron equivalent.",
      },
    ],
    stack: ["Rust", "Tauri 2", "React", "TypeScript"],
    platforms: ["macOS", "Windows", "Linux"],
    licensing: "proprietary",
    repo: "https://github.com/acnologiaslayer/arcane-dictate",
    builtOn: {
      name: "Handy",
      href: "https://github.com/cjpais/Handy",
      license: "MIT",
    },
  },
  {
    slug: "canvas",
    name: "Arcane Canvas",
    shortName: "Canvas",
    tagline: "Compose generative pipelines on an infinite node graph.",
    category: "Generative pipelines",
    status: "beta",
    accent: "#A855F7",
    blurb:
      "A node-based workspace for image, video and audio generation. Wire models, conditioning and post-processing into a graph you can inspect, version and re-run, with a large ecosystem of community nodes.",
    intro:
      "Arcane Canvas is a visual programming environment for generative models. Every step, from loading a checkpoint to sampling to post-processing, is a node on a graph you can rewire, save and share. Results are reproducible because the graph is the program.",
    features: [
      {
        title: "Graph as program",
        body: "Pipelines are explicit graphs, so a result can be traced back to the exact nodes and parameters that produced it.",
      },
      {
        title: "Only recomputes what changed",
        body: "Re-running a graph reuses cached branches and executes only the nodes affected by your edit.",
      },
      {
        title: "Broad model support",
        body: "Runs current image, video and audio model families locally on consumer GPUs, with quantization options for tighter memory budgets.",
      },
      {
        title: "Extensible by design",
        body: "Custom nodes are Python classes, and the existing ComfyUI node ecosystem is compatible.",
      },
    ],
    stack: ["Python", "PyTorch", "Web frontend"],
    platforms: ["Linux", "Windows", "macOS"],
    licensing: "gpl-3.0",
    repo: "https://github.com/acnologiaslayer/arcane-canvas",
    builtOn: {
      name: "ComfyUI",
      href: "https://github.com/Comfy-Org/ComfyUI",
      license: "GPL-3.0",
    },
  },
  {
    slug: "speech",
    name: "Arcane Speech",
    shortName: "Speech",
    tagline: "Zero-shot multilingual speech synthesis from a short reference.",
    category: "Text to speech",
    status: "alpha",
    accent: "#F59E0B",
    blurb:
      "A text-to-speech engine that clones a voice from a short reference clip and speaks in languages it was never explicitly trained to pair with that voice.",
    intro:
      "Arcane Speech is a diffusion language model for text to speech. Give it a few seconds of reference audio and it synthesises new speech in that voice, across a wide range of languages, without per-speaker fine-tuning.",
    features: [
      {
        title: "Zero-shot voice cloning",
        body: "A short reference clip is enough. There is no per-voice training step.",
      },
      {
        title: "Broad language coverage",
        body: "Synthesis works across a wide set of languages from a single model.",
      },
      {
        title: "Library or service",
        body: "Use it as a Python package inside your own pipeline, or run it behind an API.",
      },
      {
        title: "Runs on your hardware",
        body: "Inference is local, so scripts and reference voices stay private.",
      },
    ],
    stack: ["Python 3.10+", "PyTorch"],
    platforms: ["Linux", "macOS", "Windows"],
    licensing: "proprietary",
    repo: "https://github.com/acnologiaslayer/arcane-speech",
    builtOn: {
      name: "OmniVoice",
      href: "https://github.com/k2-fsa/OmniVoice",
      license: "Apache-2.0",
    },
  },
  {
    slug: "avatar",
    name: "Arcane Avatar",
    shortName: "Avatar",
    tagline: "Turn one take of footage into a presenter who says anything.",
    category: "Digital humans",
    status: "alpha",
    accent: "#EC4899",
    blurb:
      "A desktop app for digital-human video. Record a person once, then drive that likeness with new audio or text to produce lip-synced presenter footage without another shoot.",
    intro:
      "Arcane Avatar builds a reusable digital presenter from a single recording. Once the likeness is captured, new videos are produced by supplying audio or text, with generation running on your own machine rather than a per-minute cloud service.",
    features: [
      {
        title: "One recording, many videos",
        body: "Capture a subject once, then reuse that likeness for every subsequent script.",
      },
      {
        title: "Audio or text driven",
        body: "Drive the avatar with a recorded voice track, or synthesise the voice and lip-sync to it.",
      },
      {
        title: "Runs on your own hardware",
        body: "Generation happens locally through containerised services instead of a metered cloud API.",
      },
      {
        title: "Desktop workflow",
        body: "A native app handles projects, assets and rendering queues.",
      },
    ],
    stack: ["Electron", "Vue 3", "Docker"],
    platforms: ["Windows", "Linux"],
    licensing: "proprietary",
    repo: "https://github.com/acnologiaslayer/arcane-avatar",
    builtOn: {
      name: "HeyGem",
      href: "https://github.com/Caladog/HeyGem",
      license: "Community license",
    },
  },
];

export function productBySlug(slug: string | undefined) {
  return products.find((p) => p.slug === slug);
}
