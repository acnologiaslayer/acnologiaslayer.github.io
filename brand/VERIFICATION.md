# Arcane Suite — Verification Record

Every explicit requirement mapped to the command that checked it and the result
that was actually observed. Written against commit state of 2026-08-10.

**Read the strength of each claim, not just the tick.** Where each product
stands, as of the latest round:

* **Arcane Canvas** — server booted, a workflow executed through the public
  HTTP API, and the full UI loaded in a browser. Runs CPU-only with no model
  weights, so graph execution is proven but image generation is not.
* **Arcane Dictate** — crate compiles (`cargo check` exits 0), 206 crate tests
  pass, the `.deb` builds, and the binary runs and loads its native backends
  from the renamed library directory. The GUI window itself has never been
  observed, and no release can be signed (see gap 1).
* **Arcane Avatar** — packaged **and launched**, which caught a crash on first
  run. A real legacy database was migrated by the running app. The GUI has not
  been driven interactively.
* **Arcane Speech** — wheel built, package installed, all console scripts run.
  Generation itself was never run: it needs a multi-gigabyte checkpoint and a
  GPU, neither available here.

No release has been published, and nothing has been installed by an end user.

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

## R10. End-user acceptance: the apps were actually launched

Earlier rounds verified artefacts without ever running them. This round did.

### Arcane Avatar — launched under Xvfb

| Check | Observed |
|---|---|
| Packaged app launched | **crashed on first attempt**: `initDB` failed, "Could not locate the bindings file" |
| Cause | packaging runs `npmRebuild: false`, so `better-sqlite3` was never built for this Electron ABI |
| After `npx @electron/rebuild -f -w better-sqlite3` | app runs for the full session with no errors |
| App data directory created by the running app | `~/.config/arcane-avatar/biz.db` — the rebranded identity holds end to end |
| **Real upgrade test**: seeded `~/.config/HeyGem/biz.db` with a row, then launched the packaged app | migrated: `[('legacy-presenter-take',)]` readable under the new name, legacy directory retained |

The rebuild requirement is now documented in the README and beside the setting.

### Arcane Canvas — served UI loaded in a browser

| Check | Observed |
|---|---|
| `GET /` | HTTP 200, `<title>Arcane Canvas</title>` |
| Workflow of built-in nodes via `POST /api/prompt` | `status: success`, output `{"2": {"text": ["arcane canvas works"]}}` |
| Full UI rendered in a headless browser | loads and paints: node graph, templates browser, run controls |
| Upstream branding in the served shell | **defect found**: `Loading ComfyUI` on the boot screen |
| After fix, re-verified on a running server | `Loading Arcane Canvas`, zero `ComfyUI` in the served HTML |

Note the UI still carries the upstream logo in its top-left, because the
frontend is a prebuilt upstream wheel we do not build. Replacing that requires
owning the frontend, which is the same conclusion the licensing analysis reached.

### Arcane Speech — package boundary

| Check | Observed |
|---|---|
| Installed metadata | `arcane-speech 0.2.1`, `LicenseRef-Proprietary` |
| All 4 console scripts registered and targeting `arcane_speech` | confirmed |
| Old `import omnivoice` | correctly `ModuleNotFoundError` — no stale module shadowing |
| Upstream HF model ids | 8 references preserved, `model_type="omnivoice"` intact, so downloads still resolve |

## R11. Arcane Dictate integration boundaries

The Rust crate cannot be compiled here, so its boundaries were checked where
they are actually observable: the manifest, the IPC contract, and packaging.

| Boundary | Check | Observed |
|---|---|---|
| Crate identity | `cargo metadata` | name `arcane-dictate`, lib `arcane_dictate_lib`, bin `arcane-dictate`, default-run set |
| Rust internal refs | grep for the old lib name | none; `main.rs` and the audio CLI both call `arcane_dictate_lib` |
| **Frontend ↔ Rust IPC** | every `TAURI_INVOKE` name vs every `#[tauri::command]` | **113 invoked, 113 defined, 0 missing** |
| Tauri capabilities | window labels granted vs used at runtime | `main`, `recording_overlay` on both sides, none ungranted |
| Bundle inputs | resources glob, all 5 icons, `frontendDist` | all resolve |
| Portable-installer resolver | ran the test suite | passes, plus a new case using our repo slug and rebranded asset names |
| Updater endpoint | HTTP probe | 404, correct: no release has been published yet |

Remaining `handy` strings in the generated bindings are all the third-party
`handy-keys` crate and the upstream model CDN, both deliberately preserved.

## R12. Arcane Dictate: the crate compiled, the app built, the binary ran

The gap flagged in every earlier round is now closed. Constraining the build to
`-j2` at `nice 15` kept peak memory around 2 GB, well inside this machine.

| Check | Observed |
|---|---|
| `cargo check --lib` | **EXIT=0** in 11m57s. Two warnings, both pre-existing and unrelated to the rebrand |
| `cargo test --lib` **in the real crate** | **206 passed, 0 failed** |
| The migration tests, run from the shipping crate | all 7 pass, including `imports_a_realistic_upstream_install` |
| The portable-mode tests | all 6 pass |
| `tauri build --bundles deb` | binary and `.deb` produced; the run then stopped at signing (see below) |

### The built package

| Check | Observed |
|---|---|
| Binary | `arcane-dictate`, 46 MB ELF executable |
| Package metadata | `Package: arcane-dictate`, `Maintainer: Mahir Musleh` |
| Installed binary path | `/usr/bin/arcane-dictate` |
| Icons | `usr/share/icons/hicolor/*/apps/arcane-dictate.png` |
| Desktop entry | `Name=Arcane Dictate`, `Exec=arcane-dictate`, `Icon=arcane-dictate`, `StartupWMClass=arcane-dictate` — no unexpanded placeholders |
| **The `/usr/lib` three-way contract** | binary `RUNPATH` is `$ORIGIN/../lib/arcane-dictate`, and the deb installs 18 `.so` files to `usr/lib/arcane-dictate`. **They match.** |

### Running the built binary

Launched from the extracted package under Xvfb:

* `--help` prints **"Arcane Dictate - Speech to Text"**.
* `--list-devices` initialises the native backend and logs
  `transcribe_init_backends: ... after scanning /tmp/debx/usr/lib/arcane-dictate: CPU`,
  loading `libggml-vulkan.so` and `libggml-cpu-alderlake.so` **from the renamed
  directory**. This is the rename proven at runtime, not in configuration.
* Log lines are emitted under the `arcane_dictate_lib` target.
* `--list-models --json` returns **83 models**, with upstream HuggingFace repo
  ids preserved so downloads still resolve.


### What the GUI itself was, and was not, shown to do

The Rust window builder sets `.title("Arcane Dictate")`, the built web bundle
contains the product name, and the served `index.html` carries
`<title>Arcane Dictate</title>`. Serving that bundle in a plain browser renders
an **empty** `<div id="root">`, which is expected: the React app calls Tauri IPC
that only exists inside the desktop shell, so a browser cannot stand in for it.

**Nobody has driven the running GUI interactively.** Doing so needs a desktop
session with a real user, or an automated Tauri WebDriver harness. The CLI
surface of the same binary was exercised and is branded correctly, and the
window title is set in code, but that is weaker evidence than a screenshot of
the running window and should not be read as more.

### One genuine blocker, now proven rather than predicted

The bundle run ended with:

```
A public key has been found, but no private key.
Make sure to set `TAURI_SIGNING_PRIVATE_KEY` environment variable.
```

This is the updater-key problem, confirmed empirically: the config still carries
upstream's public key and we hold no matching private key, so a release cannot
be signed. Generating a keypair and replacing `plugins.updater.pubkey` is a
prerequisite for shipping, and it is the owner's decision to make.

## R13. Consolidated audit over the whole result (final sweep)

Everything above was verified as it was built. This section re-verifies the
finished result in one pass, from **freshly cloned remotes** rather than local
working copies, so it reflects what is actually published.

### Licensing, all four products — 25/25 obligations satisfied

Each product was asserted against the obligations its upstream licence actually
imposes, not merely that a licence file exists.

| Product | Verified |
|---|---|
| Dictate | own licence proprietary; upstream MIT notice preserved verbatim; no stale open-source claim |
| Speech | own licence proprietary; Apache text retained in full; NOTICE credits upstream; packaging ships all three files |
| Avatar | own licence proprietary; upstream agreement retained; **MAU ceiling surfaced in our LICENSE**; required credit displayed |
| Canvas | **still GPL-3.0 and not falsely marked proprietary**; §5(a) change notices; §5(d) interactive notice; route to source; licence exposed over the API |
| All four | NOTICE.md present; our copyright asserted |

Two of these were proven by **running the software**, not reading it:

* The Speech **wheel** reports `License-Expression: LicenseRef-Proprietary` and
  ships `LICENSE`, `LICENSE-APACHE-2.0-OmniVoice` and `NOTICE.md` — the
  Apache-2.0 obligations hold in the artefact a user receives.
* The Canvas **server**, booted from the clean clone, logs
  `Free software under GPL-3.0, with ABSOLUTELY NO WARRANTY … source: …`,
  returns `app_license: GPL-3.0-or-later` from `/api/system_stats`, serves
  `<title>Arcane Canvas</title>`, and contains **zero** occurrences of the
  upstream name in the served shell.

### Arcane Dictate, whole-result sweep — 14/14 checks passed

| Boundary | Result |
|---|---|
| Identity | productName, bundle identifier, crate and lib all ours; no stale `handy_app_lib` |
| **IPC contract** | 113 commands invoked from the frontend, every one defined in Rust |
| i18n | 24/24 locales key-identical to English, zero upstream naming, new name in every one |
| Packaging | all bundle icons and the resources glob resolve |
| **Library path** | the deb install path, the `build.rs` rpath and the CI assertions all agree, with no `/usr/lib/Handy` left |
| Endpoints | updater points at our releases |

### The test suite, re-run from the clean clone

`cargo test --lib` → **206 passed, 0 failed, EXIT=0**, including all 7 migration
tests and all 6 portable-mode tests. The full log is kept at
`brand/audit/dictate-cargo-test.txt`.

---

## Known gaps, stated honestly

1. **Dictate's updater public key is still upstream's.** Verified independently
   by fetching `cjpais/Handy`'s own `tauri.conf.json`: the key is byte-identical
   to ours. The matching private half belongs to upstream, so no release of ours
   can be signed until a new keypair is generated. Owner's decision.
2. **Only Linux artefacts were produced.** Avatar built an AppImage and an
   unpacked build (both launched); Dictate built a `.deb` (binary run). No
   Windows or macOS artefact exists, and neither GUI window has been driven
   interactively.
3. **Speech generation was never run.** The tests skip without a multi-GB model
   checkpoint and there is no GPU on this machine.
4. **Canvas ran on CPU with no model weights.** Graph execution is proven;
   image generation is not.
5. ~~Dictate's Rust crate is not type-checked.~~ **Resolved.** Constraining the
   build to `-j2` at `nice 15` kept peak memory near 2 GB: `cargo check` exits
   0 and `cargo test --lib` passes 206 tests. See R12. CI remains the right
   home for this, but it is no longer unverified.

## Reproducing the environment

`~/arcane-verify/rust-env.sh` records the rootless prefix that unblocks the
Rust build on a machine without sudo. The system libraries live in
`~/localdeps/root`, unpacked from `.deb` files with `dpkg-deb -x`. The build
artefacts and Python virtualenvs created during verification were deleted
afterwards; only logs and this record were kept.
