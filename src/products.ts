/*
 * Arcane Suite — engineering case studies.
 *
 * One entry per project. Drives /arcane (index) and /arcane/:slug (the
 * individual write-ups), plus the sitemap.
 *
 * These are presented as case studies, not as things for sale: what the
 * problem was, what was actually built, and what it cost or constrained.
 * Everything here must stay factual, including the limitations — an honest
 * "what I would not claim" section is worth more than a feature list.
 */

export type ProductFeature = { title: string; body: string };

/** A concrete engineering decision and the reason behind it. */
export type Decision = { title: string; body: string };

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  category: string;
  status: "alpha" | "beta" | "stable";
  accent: string;
  /** One-paragraph summary used on the index grid. */
  blurb: string;
  /** Longer framing used at the top of the case study. */
  intro: string;
  /** The problem this work set out to solve. */
  challenge: string;
  /** What was actually built, in engineering terms. */
  features: ProductFeature[];
  /** Decisions worth defending, and the trade-off each one made. */
  decisions: Decision[];
  /** Verified results, phrased as observations rather than promises. */
  outcomes: string[];
  /** Honest limits: what this does not do, or has not been proven to do. */
  limitations: string[];
  /** My role on this piece of work. */
  role: string;
  /** Rough period the work covers. */
  timeline: string;
  stack: string[];
  platforms: string[];
  repo: string;
  /** How this product itself is licensed to customers. */
  licensing: "proprietary" | "gpl-3.0" | "open-source";
  /**
   * Prior art that informed this work. Named because the licence obligations
   * are real and the credit is owed, not because the work is a repackaging.
   */
  builtOn?: { name: string; href: string; license: string };
};

export const suite = {
  name: "Arcane Suite",
  tagline: "Four local-first AI products, engineered end to end.",
  intro:
    "Four generative-AI products taken from prototype to shippable: data migrations that protect existing users through an identity change, compatibility contracts held intact under it, packaging and release engineering across desktop and Python, and a licensing position worked out from primary sources. Each was developed with inspiration from prior art in its field, credited on its page.",
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
    role: "Engineering lead, sole author",
    timeline: "2026",
    challenge:
      "Every model provider is a moving target: pricing changes, capabilities differ, and a harness pinned to one ages badly. I wanted a terminal workflow where the routing decision is explicit and reversible rather than baked into the tool.",
    decisions: [
      {
        title: "Route on task shape, not on a hardcoded default",
        body: "Each task is scored on complexity, cost, performance and intent, so swapping providers is a configuration change rather than a rewrite. The cost is a scoring layer to maintain; the benefit is that provider churn stops being a migration.",
      },
      {
        title: "Delegate long work to sub-agents",
        body: "Branching work runs in its own context and reports back, which keeps the parent context clean on tasks that would otherwise exhaust it.",
      },
      {
        title: "Skills as files",
        body: "Capabilities live on disk rather than in code, so they can be imported from other ecosystems or written at runtime without a release.",
      },
    ],
    outcomes: [
      "Provider durability became the design centre: a bug in one provider's token handling was caught by the harness rather than by a user.",
      "Runs against multiple providers from one interface, with per-task routing rather than a global model setting.",
    ],
    limitations: [
      "Routing quality depends on the scoring heuristics, which are tuned by hand rather than learned.",
      "Entirely original, so there is no wider community fixing bugs alongside me.",
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
    role: "Engineering lead, sole author",
    timeline: "2026",
    challenge:
      "Shipping a desktop app under a new identity is deceptively dangerous: on Tauri every data path derives from the bundle identifier, so changing it silently orphans each existing install's settings, downloaded models and transcription history. The engineering problem was moving the identity without moving the user's data out from under them.",
    decisions: [
      {
        title: "Copy the old data directory, never move it",
        body: "First launch after the upgrade copies the legacy directory across, refuses to overwrite a populated one, and writes a marker so a multi-gigabyte copy is attempted only once. The legacy directory is left in place, so downgrading still works.",
      },
      {
        title: "Rename what users see, not what the ecosystem depends on",
        body: "The third-party keyboard crate and the model CDN keep their published names. Renaming them would have looked tidier and broken model downloads.",
      },
      {
        title: "Treat the library path as a three-way contract",
        body: "The install path appears in the bundler config, in the linker rpath, and in eight CI assertions. All three were changed together, and a built package was inspected to confirm the binary's RUNPATH matches where the libraries actually land.",
      },
    ],
    outcomes: [
      "206 crate tests pass, including a migration test that carries real settings, a model blob and transcription history through an upgrade.",
      "A built .deb installs 18 shared libraries into the renamed directory, and the running binary loads them from there.",
      "All 24 translations were verified structurally identical to the English source, and carry the product name consistently.",
    ],
    limitations: [
      "The GUI window itself has not been observed running; only the command-line surface of the same binary.",
      "Release signing needs its own keypair before anything can ship; the inherited key is not mine to sign with.",
      "Speech models are still downloaded from infrastructure I do not control.",
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
    role: "Engineering lead, sole author",
    timeline: "2026",
    challenge:
      "A node-graph engine's value is its ecosystem: thousands of third-party nodes import its internal modules by name. Giving it a distinct identity meant drawing a precise line between the presentation layer, which was mine to shape, and the load-bearing interfaces that thousands of extensions depend on.",
    decisions: [
      {
        title: "Change the shell, never the import paths",
        body: "Module names, API routes, node names and the model directory layout are untouched by design. A diff against the base revision shows the only Python change is argument help text.",
      },
      {
        title: "Rewrite the served shell, not the vendored asset",
        body: "The web frontend arrives as a prebuilt package, so its title and loading screen are rewritten as the page is served. It is a workaround, and it is documented as one.",
      },
      {
        title: "Meet the copyleft obligations properly",
        body: "Modified files carry change notices, startup states the licence and warranty position, and recipients are told how to obtain the source. Compliance was treated as engineering work rather than paperwork.",
      },
    ],
    outcomes: [
      "A workflow submitted over the HTTP API executed successfully with a third-party custom node loaded alongside 833 built-in nodes.",
      "The compatibility claim was tested rather than asserted: a probe node importing the engine's internal modules loaded and ran.",
    ],
    limitations: [
      "This one cannot be made proprietary. Its copyleft licence permits hosting a service, but not closed-source distribution, and only the original copyright holders could change that.",
      "Verified on CPU with no model weights, so graph execution is proven and image generation is not.",
      "The bundled frontend still carries its original logo, because it is not built from source here.",
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
    role: "Engineering lead, sole author",
    timeline: "2026",
    challenge:
      "A speech stack carries two kinds of name: presentation, and load-bearing identifiers that resolve published model weights. Turning research code into a distributable package meant changing the first kind completely while leaving the second untouched, because renaming an identifier silently breaks every model download.",
    decisions: [
      {
        title: "Rename the distribution, preserve the model identifiers",
        body: "The package, module and console scripts are mine. The published model repository ids and the internal model type string were left exactly as-is, so checkpoints still resolve.",
      },
      {
        title: "No compatibility shim for the old module name",
        body: "The previous import now fails cleanly rather than resolving to something half-renamed. A silent shim would have hidden breakage until it mattered.",
      },
      {
        title: "Keep the research lineage visible",
        body: "The originating paper, citation and benchmark numbers are credited to their authors rather than absorbed. No research result is restated as mine.",
      },
    ],
    outcomes: [
      "Installs and imports under the new name with correct authorship metadata, and all four console scripts run.",
      "The built wheel declares its licence and ships the originating licence and notice alongside it.",
    ],
    limitations: [
      "Speech was never actually generated here: that needs a multi-gigabyte checkpoint and a GPU.",
      "Anyone with the old import will break, deliberately and visibly.",
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
    role: "Engineering lead, sole author",
    timeline: "2026",
    challenge:
      "The generation pipeline runs in containers, but the user's entire library — enrolled faces, cloned voices, rendered videos — lives in a local database keyed to the application name. Establishing a distinct identity meant carrying that library across intact, while leaving untouched the container contracts the pipeline depends on.",
    decisions: [
      {
        title: "Migrate the library before opening it",
        body: "The migration runs before the database is initialised, handles three historical directory names, and refuses to overwrite newer data. Tested by seeding a real legacy database and launching the packaged app.",
      },
      {
        title: "Leave the container contracts alone",
        body: "Service names were rebranded, but image references and the bind-mounted data directory were not: they are contracts with infrastructure I do not control, and renaming either breaks generation on every existing install.",
      },
      {
        title: "Read the licence before planning the business",
        body: "The model licence terminates your rights above one thousand monthly active users unless a separate agreement is granted. That is a commercial ceiling, so it is stated at the top of the licence file rather than buried.",
      },
    ],
    outcomes: [
      "A seeded legacy install was migrated by the running packaged application, with the original records readable under the new name and the old directory retained.",
      "Building and launching the package caught a first-run crash and a launcher entry showing an unexpanded template variable — neither visible in the source.",
    ],
    limitations: [
      "The monthly-active-user ceiling makes a consumer product impractical without a negotiated licence.",
      "Only a Linux build exists, and the interface has not been driven interactively.",
      "Generation depends on container images published by a third-party vendor.",
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
