# Arcane Suite — Brand Spec (authoritative)

Owner: Mahir Musleh (GitHub `acnologiaslayer`)
Umbrella: **Arcane Suite** — https://arcma.dev/arcane
Org/namespace prefix: `arcane`
Reverse-DNS prefix: `dev.arcma.arcane.*`
Copyright line: `Copyright (c) 2026 Mahir Musleh`

## Products

| Product | Repo | Slug | Binary / package id | Upstream (attribute, do not hide) |
|---|---|---|---|---|
| Arcane Agents | arccode | `agents` | `arccode` | original work |
| Arcane Avatar | arcane-avatar | `avatar` | `arcane-avatar`, `dev.arcma.arcane.avatar` | Caladog/HeyGem |
| Arcane Dictate | arcane-dictate | `dictate` | `arcane-dictate`, `dev.arcma.arcane.dictate` | cjpais/Handy (MIT) |
| Arcane Canvas | arcane-canvas | `canvas` | `arcane-canvas`, `dev.arcma.arcane.canvas` | Comfy-Org/ComfyUI (GPL-3.0) |
| Arcane Speech | arcane-speech | `speech` | `arcane-speech` (PyPI), module `arcane_speech` | k2-fsa/OmniVoice (Apache-2.0) |

## Voice

- Product names always two words, title case: "Arcane Dictate".
- Never abbreviate to "AD"/"AC". Short form in code = the slug (`dictate`).
- Tagline pattern: "Arcane <X> — <verb phrase>, local-first."

Taglines:
- Arcane Avatar — generate lifelike presenter video from a single take.
- Arcane Dictate — press to talk, get text anywhere, fully on-device.
- Arcane Canvas — compose generative pipelines on an infinite node graph.
- Arcane Speech — multilingual zero-shot speech synthesis and recognition.

## Rebranding rules (apply per repo)

1. **User-facing first**: app/product name, window titles, installer names, UI copy,
   i18n strings, README, docs site, screenshots' alt text, package descriptions,
   homepage/repository URLs -> `https://github.com/acnologiaslayer/<repo>`.
2. **Identifiers**: bundle identifier, package name, crate/module/dist name,
   config directory, log names, updater endpoints (point at our releases URL).
3. **Do NOT rename** third-party crates/packages we merely depend on
   (e.g. `handy-keys`), upstream git branch/fork refs in dependency pins, or
   vendored code copyright headers.
4. **Do NOT delete upstream LICENSE.** Keep it. Add our copyright as an
   additional line only where we are the author (new files). Add `NOTICE.md`
   crediting upstream with a link and its license.
5. Keep migration compat where a rename would break existing user data:
   if a config/appdata dir is renamed, add a one-time migration that moves the
   old directory to the new one, or at minimum read the old path as fallback.
6. Preserve public API/plugin-ecosystem compatibility (critical for Canvas:
   custom nodes import `comfy.*`). Rebrand the shell/UI/docs, not the import paths.
7. Every repo gets: rebranded `README.md`, `NOTICE.md`, `git remote add upstream <original>`,
   and a `docs/PRODUCT.md` one-pager feeding its product page.
8. Replace upstream funding/sponsor/support links (Discord, Patreon, sponsors,
   telemetry endpoints, analytics keys) — remove them rather than point them at us,
   unless it's a link we own. Delete `.github/FUNDING.yml`.
9. CI: keep workflows working; update names/artifact names to the new brand.
   Disable workflows that publish to upstream-owned registries/accounts.
10. Do not fabricate URLs that don't exist yet other than the ones listed above.
