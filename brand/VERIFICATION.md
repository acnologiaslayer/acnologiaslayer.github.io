# Arcane Suite — Verification Record

Every explicit requirement mapped to the command that checked it and the result
that was actually observed. Written against commit state of 2026-08-10.

**Read the strength of each claim, not just the tick.** The evidence here is
uneven by design of the environment, not by choice:

* **Arcane Canvas** was verified on its real acceptance path — the server was
  booted and a workflow was executed through the public HTTP API.
* **Arcane Speech** was verified on its real packaging path — installed,
  imported, console scripts run.
* **Arcane Avatar's** migration was exercised against a real SQLite database,
  but Electron's `app.getPath` was stubbed and **the app itself was never
  launched**.
* **Arcane Dictate's** web bundle was built and audited, but **the Rust crate
  was never type-checked and the desktop app was never launched.**

Avatar has since been packaged into a real AppImage and its contents verified
(this caught a launcher-name defect). Neither desktop app has been *launched*,
and Dictate still has no installer. That remains the largest untested surface.

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

## R7. CI integrity after the rebrand (static checks, no runs)

| Check | Observed |
|---|---|
| YAML parse of every workflow in all four repos | 28 files, 0 failures |
| `working-directory:` paths resolve (accounting for `actions/checkout` `path:`) | all resolve |
| Scripts invoked by workflows exist on disk | all present in all four repos |
| Dictate's `/usr/lib/arcane-dictate` three-way contract: `tauri.conf.json`, `build.rs` rpath, CI assertions | consistent; 0 stale `/usr/lib/Handy` references |
| Stale renamed paths (`omnivoice/`, old icon names) referenced by CI | none |

One real defect found and fixed: Canvas's `test-launch.yml` checked out into a
directory named `ComfyUI`.

## R8. Packaging and icon containers (end-user artefacts)

Icons were previously only checked as loose files. These checks read the
containers the way the OS does, and build a real installer.

| Check | Observed |
|---|---|
| `.icns` structure walk (magic, declared length, chunk table) | both valid, walk to EOF exactly |
| Each `.icns` chunk decodes as PNG at the size its type declares | dictate and avatar: all 7 chunks correct (16/32/64/128/256/512/1024) |
| `.ico` frames decode | all three `.ico` files carry 16/32/48/64/128/256 and decode |
| Icon paths declared in `tauri.conf.json` and `electron-builder.yml` exist | all resolve |
| **Built a real Linux AppImage for Avatar** | `ArcaneAvatar-1.0.4.AppImage`, 254 MB |
| Packaged `package.json` read out of `app.asar` | `arcane-avatar`, author `Mahir Musleh`, Arcane description |
| Icon shipped inside the AppImage | 512x512, accent `#EC4899`, transparent corners |
| `.desktop` entry generated by the build | **defect found**: `Name=${productName}` shipped literally |

The desktop-entry defect was fixed and re-verified by rebuilding the AppImage
and re-extracting the entry: it now reads `Name=Arcane Avatar` with a
resolvable `Icon=arcane-avatar`. This class of bug is invisible in source and
only appears in a packaged build.

The `dist/` output (1.6 GB) was deleted after verification.

## R9. Arcane Dictate, deep validation

Dictate was the least-verified product, so its rebrand-critical surfaces were
exercised individually.

| Check | Observed |
|---|---|
| 24 locale files parse as JSON | all valid |
| Locale key sets vs English source | structurally identical, 0 missing/extra keys |
| Locale strings naming the upstream product | **none** |
| Locales carrying the new product name | 24/24 |
| Migration module compiled and its tests run | 7 passed |
| Added test: realistic upstream install (settings, a model blob, history) | passed: settings byte-identical, model and history preserved, marker written, legacy retained, idempotent on second run |
| Portable-marker contract | upstream's own tests already cover the magic string, empty file, wrong content and whitespace cases |

**Caveat on how these were run.** The full `src-tauri` crate could not be
compiled here: it builds whisper.cpp with Vulkan shaders and produced 2.9 GB of
artefacts on a 7.6 GB machine before being stopped. The tests were therefore
executed against the module extracted into a standalone crate. That proves the
logic is correct, but **not** that it is wired into the shipping binary. The new
test was written into `src-tauri/src/legacy_migration.rs` itself, so CI's
existing `cargo test` job closes that gap on a runner with the system packages
installed.
| macOS autostart | removes both the current and the legacy `Handy.plist`, so an upgraded machine will not launch the app twice at login |
| Updater endpoint | points at `acnologiaslayer/arcane-dictate` releases |

### Two concrete release blockers confirmed

1. **The updater public key is still upstream's.** Decoded, it reads
   `minisign public key: BAB72095206601F9`, which belongs to upstream Handy.
   Updates signed with our own key would be rejected by shipped clients.
2. **17 model downloads point at `blob.handy.computer`**, upstream's CDN. It
   currently returns HTTP 200, but this is third-party infrastructure we do not
   control and it can disappear without notice. Mirroring these to our own
   storage is a prerequisite for treating Dictate as an independent product.

---

## Known gaps, stated honestly

1. **Dictate's updater public key is still upstream's.** Signed updates will
   fail verification until a new keypair is generated. Not fixable without a
   decision from the owner.
2. **Avatar: an AppImage was built and inspected, but never launched.** The
   package contents, identity, icon and desktop entry are verified; the app
   has not been run, and no Windows or macOS artefact was produced.
   **Dictate: still no installer at all**, since bundling requires the Rust
   build below.
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
