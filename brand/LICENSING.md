# Arcane Suite — Licensing Position

Written 2026-08-10, after the owner stated the intent that **none of the
products should remain open source**.

This is a summary of what the upstream licences permit. It is not legal advice;
for anything with money attached, have a solicitor confirm it.

## Summary

| Product | Upstream | Upstream licence | Can it be closed-source? |
|---|---|---|---|
| Arcane Agents (`arccode`) | — | original work | **Yes**, unrestricted. It is yours. |
| Arcane Dictate | cjpais/Handy | MIT | **Yes** |
| Arcane Speech | k2-fsa/OmniVoice | Apache-2.0 | **Yes** |
| Arcane Avatar | Caladog/HeyGem | Silicon Intelligence Community | **Yes, with binding conditions** |
| Arcane Canvas | Comfy-Org/ComfyUI | **GPL-3.0** | **No** |

## Dictate — MIT

MIT is permissive. You may distribute modified versions under a proprietary
licence and keep your source closed. The one obligation is to retain the
original copyright and permission notice somewhere in the distribution, which a
third-party credits screen or a `THIRD-PARTY-NOTICES` file satisfies.

Note separately that upstream states its *name and logo* are not covered by the
MIT grant. We already replaced all of that artwork, so this is satisfied.

## Speech — Apache-2.0

Apache-2.0 is permissive and explicitly contemplates proprietary derivatives.
Obligations on distribution: keep the licence text, keep the `NOTICE` file and
its contents, retain attribution notices, and state that files were changed.
Apache-2.0 also grants a patent licence, which is a point in its favour.

## Avatar — Silicon Intelligence Community Licence

Not an OSI-approved licence. Closed-source distribution is permitted, but three
conditions bind you and none of them are optional:

1. **Ship a copy of their agreement** with any distribution of the materials or
   derivative works (§1.b.i).
2. **Display "Built with Silicon Intelligence"** on a related website, user
   interface, blog post, about page, or product documentation (§1.b.i).
3. **The 1,000 MAU ceiling** (§2): above one thousand monthly active users you
   "must request a license from Silicon Intelligence, which Silicon Intelligence
   may grant to you in its sole discretion, and you are not authorized to
   exercise any of the rights under this Agreement unless or until" it is
   granted. Rights *terminate* at that threshold.

Condition 3 is the commercial problem: it caps any consumer product at a
thousand active users unless a separate licence is negotiated.

## Canvas — GPL-3.0, and why this one cannot be closed

ComfyUI is licensed GPL-3.0, a strong copyleft. Relevant consequences:

* A modified ComfyUI is a derivative work. **Distributing** it obliges you to
  license the whole work under GPL-3.0 and to provide complete corresponding
  source to every recipient.
* You cannot relicense someone else's GPL-3.0 code as proprietary. Only the
  copyright holders could do that, and ComfyUI has many contributors.
* Attempting it is copyright infringement, not a technicality.

### What is actually available

1. **Keep it GPL-3.0 and monetise around it.** GPL-3.0 is *not* a network
   copyleft (that is AGPL). Running Arcane Canvas as a **hosted service**
   triggers no obligation to publish source, because you are not distributing
   binaries. Support contracts, hosting, and separately-licensed model weights
   are all viable.
2. **Do not distribute it.** Internal-only use carries no obligation whatsoever.
3. **Replace the engine.** A clean-room node-graph executor, or a fork of a
   permissively licensed project, would be genuinely yours. This is a real
   engineering project, not a rebranding exercise.

## Current state (implemented 2026-08-10)

| Product | Licence now | Verified how |
|---|---|---|
| Arcane Dictate | Proprietary | MIT notice preserved byte-identical in `THIRD-PARTY-NOTICES.md`, diffed against upstream's original |
| Arcane Speech | Proprietary | Built wheel reports `LicenseRef-Proprietary` and ships all three licence files |
| Arcane Avatar | Proprietary | Packaged `app.asar` ships the upstream agreement, NOTICE and model licence PDF |
| Arcane Canvas | **GPL-3.0** | Compliance completed: §5(a) change notices, §5(d) startup notice, source offer in NOTICE and on `/system_stats` |

Canvas has not been relicensed and will not be without a decision from the
owner. Its GPL obligations were instead brought fully up to standard, which is
correct under every option below: even a future clean-room replacement must
ship the current version compliantly until it is retired.

## Sizing the Canvas options (measured 2026-08-10)

Numbers, so option C is a costed decision rather than a guess.

| Component | Size | Notes |
|---|---|---|
| Whole repository | 739 Python files, ~254,000 lines | all GPL-3.0 |
| Execution engine (`execution.py`, `comfy_execution/`, `folder_paths.py`, `nodes.py`) | ~6,900 lines | the part a replacement must genuinely reimplement |
| Model/inference layer (`comfy/`, `comfy_extras/`) | ~150,500 lines | model architectures, samplers, loaders |
| Built-in node classes | ~65 in `nodes.py`, 60 registration points | the ecosystem-facing API surface |
| Web frontend | `comfyui-frontend-package==1.48.7`, ~85 MB | **a prebuilt upstream wheel, not our code** |

Two consequences worth weighing:

1. **A clean-room replacement is more than the 6,900-line engine.** The engine
   is the tractable part. The inference layer is where the real value sits, and
   reimplementing it is a multi-month effort, not a sprint. A pragmatic version
   of option C would keep a permissively licensed inference stack (e.g.
   `diffusers`) and write only a new graph executor and UI.

2. **The frontend is a separate exposure.** It ships as a prebuilt wheel that
   declares **no licence metadata at all** and contains no licence file. We do
   not own it, cannot relicense it, and shipping it under any terms without
   clarifying its licence is its own risk. Any proprietary Canvas would need its
   own UI regardless of what happens to the Python engine.

Taken together: option A (keep GPL-3.0, monetise hosting) is by a wide margin
the best value for effort. Option C only becomes attractive if a closed Canvas
is strategically essential, and it should then be scoped as a new product
rather than a fork.

## A distinction worth holding onto

**"Private repository" and "proprietary licence" are different things.** All
four repositories are already private, so nobody can read or copy the work
today. A licence only governs what happens once you *distribute* binaries or
grant someone access. If the goal is simply that competitors cannot take the
work, that is already true.
