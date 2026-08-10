# Arcane Suite — Verification Record

Every explicit requirement mapped to the command that checked it and the result
that was actually observed. Written against commit state of 2026-08-10.

The environment needed to run these is reproducible: system libraries were
installed rootless into `~/localdeps/root` (see `~/arcane-verify/rust-env.sh`),
because this machine has no passwordless sudo.

---

## R1. Each repo is a private, fully-mirrored copy under my account

| Check | Result |
|---|---|
| `git ls-remote --heads` per repo | dictate 147, canvas 349, speech 3, avatar 2 branches |
| `gh repo view` visibility | all four private |

## R2. Products are renamed and branded as Arcane, not upstream

### Arcane Canvas — verified by running the server

| Check | Observed |
|---|---|
| `python main.py --cpu --port 8199` | server booted, `Starting server` |
| `curl /` then grep `<title>` | `<title>Arcane Canvas</title>` |
| `curl /api/system_stats` | `app_name: Arcane Canvas` |
| startup banner in log | `Arcane Canvas (built on ComfyUI)` |
| `main.py --help` | `usage: arcane-canvas ...` |

### Arcane Speech — verified by installing and running the package

| Check | Observed |
|---|---|
| `pip install -e .` then read metadata | `Name: arcane-speech`, `Author: Mahir Musleh`, `0.2.1` |
| `import arcane_speech` | imports from `arcane_speech/__init__.py` |
| Project-URLs in metadata | all three point at `acnologiaslayer/arcane-speech` |
| `ls venv/bin \| grep arcane` | 4 console scripts installed |
| `arcane-speech-infer --help` | runs, prints `usage: arcane-speech-infer` |
| `pytest -q` | 7 skipped — each skip requires a local model checkpoint |

### Arcane Dictate — verified against the production bundle

| Check | Observed |
|---|---|
| `npm run build` | succeeded |
| `grep '<title>' dist/index.html` | `Arcane Dictate` |
| grep the built JS for user-facing `Handy` | none; only `handy-keys` (3rd-party crate) and internal storage keys |
| `npx tsc --noEmit` | clean |
| `prettier --check` | clean |
| icon audit: alpha at centre of all 49 PNGs | all opaque, none blank |

### Arcane Avatar — verified against the production bundle

| Check | Observed |
|---|---|
| `npm run build` | succeeded |
| grep built `out/main/index.js` | contains `dev.arcma.arcane.avatar` and `migrateUserData` |
| renderer source grep for upstream names | none |
| compose service names | `arcane-avatar-tts`, `-asr`, `-gen-video` |
| `image:` lines | still `guiji2025/*`, intentionally — we do not control that registry |

## R3. Rebranding must not destroy existing users' data

The identifier change moves the app-data directory in both desktop apps. Both
migrations were exercised against **real data**, not mocks.

### Arcane Avatar (real SQLite database, real fs)

| Scenario | Command | Observed |
|---|---|---|
| Upgrade from legacy install | seeded `HeyGem/biz.db` with real `video`/`voice` rows, ran the real module | `migrated from: .../HeyGem`; rows readable at the new path |
| Nested files preserved | same run | `logs/main.log` copied |
| Downgrade still possible | same run | legacy dir retained |
| Newer data must not be clobbered | seeded new dir, re-ran | returned `null`, `NEWER-work-do-not-lose` intact |
| Fresh install | empty parent dir | returned `null`, no crash |
| Alternate legacy name | seeded `heygem.ai/biz.db` | migrated, `variant-take` readable |

Only `electron.app.getPath` was stubbed, via an ESM loader hook. The migration
logic, the filesystem operations and the SQLite database were all real.

## R4. Canvas must not break the third-party custom-node ecosystem

This is the highest-risk claim, so it was tested by execution, not inspection.

| Check | Observed |
|---|---|
| `git diff <upstream-base>..HEAD` on `comfy/`, `nodes.py`, `folder_paths.py`, `execution.py`, `comfy_extras/`, `comfy_api/`, `api_server/` | only `comfy/cli_args.py`, help text strings alone |
| `/api/object_info` | 832 nodes registered, incl. `CheckpointLoaderSimple`, `KSampler` |
| Wrote a probe custom node importing `comfy.model_management`, `comfy.utils`, `comfy.samplers`, `folder_paths`, `nodes` | loaded: 834 nodes, `Arcane Compat Probe` present |
| **Executed a real workflow** via `POST /api/prompt` + `/api/history` | `status: success`, output `{"2": {"text": ["ARCANE"]}}` |

The probe node was a test fixture and was removed afterwards.

## R5. Attribution, licensing, sole authorship

| Check | Result |
|---|---|
| upstream LICENSE retained in all four | yes, unmodified |
| `NOTICE.md` present in all four | yes |
| `git log --format=%an` on new commits | `Mahir Musleh` only |
| `git remote -v` | `upstream` points at the original project in each |

Licence constraints found and reported rather than hidden:
- **Avatar**: rights terminate above 1,000 MAU (Silicon Intelligence §2).
- **Canvas**: GPL-3.0, so any distributed derivative ships with source.

## R6. Product identity on the website

| Check | Observed |
|---|---|
| `npm run build` | succeeded |
| `curl https://arcma.dev/arcane` (SPA, served via 404 fallback like `/writing`) | renders |
| browser screenshot of `/arcane` and `/arcane/{dictate,canvas}` | correct copy, marks, accents |
| `curl https://arcma.dev/brand/arcane-dictate.svg` | served |
| sitemap | 6 arcane URLs |

---

## Known gaps, stated honestly

1. **Dictate's updater public key is still upstream's.** Signed updates will
   fail verification until a new keypair is generated. Not fixable without a
   decision from the owner.
2. **No installer was packaged for either desktop app.** Electron's binary
   download and Tauri's bundler both need network access that timed out here.
   Config is verified; the produced artefacts are not.
3. **Speech generation was never run.** The tests skip without a multi-GB model
   checkpoint and there is no GPU on this machine.
4. **Canvas ran on CPU with no model weights.** Graph execution is proven;
   image generation is not.
5. **Dictate's Rust crate is still not fully type-checked.** Every *system
   dependency* blocker was solved rootless (pkg-config, GTK, WebKit, OpenSSL,
   Vulkan, SPIRV-Headers, glslc, gtk-layer-shell), and compilation reached the
   crate graph, but a full `cargo check` needs to compile `transcribe-cpp-sys`
   (whisper.cpp + ggml + Vulkan shaders) and exceeded this machine's practical
   budget — it produced 2.9 GB of artefacts on a 7.6 GB box before being
   stopped deliberately to keep the machine usable. **This belongs in CI**, on
   a runner with the system packages preinstalled, not on the dev laptop.

## Reproducing the environment

`~/arcane-verify/rust-env.sh` records the rootless prefix that unblocks the
Rust build on a machine without sudo. The system libraries live in
`~/localdeps/root`, unpacked from `.deb` files with `dpkg-deb -x`. The build
artefacts and Python virtualenvs created during verification were deleted
afterwards; only logs and this record were kept.
