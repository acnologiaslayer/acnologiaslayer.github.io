# Mahir Musleh — Portfolio

Personal portfolio and writing site. React + Vite + TypeScript + Tailwind,
deployed to GitHub Pages via GitHub Actions.

Live: https://arcma.dev/

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # regenerates sitemap.xml, then builds to dist/
```

Deployment is automatic: pushing to `master` runs `.github/workflows/deploy.yml`,
which builds and publishes to GitHub Pages.

## Content

- Case studies: `src/data.ts` (`projects`)
- Experience / skills: `src/data.ts`
- Articles: markdown files in `src/content/articles/*.md`

Each article has YAML frontmatter:

```md
---
slug: my-article
title: My Article Title
description: One-sentence SEO description.
date: 2026-07-29
tags: Architecture, Backend
---

Body in Markdown...
```

## Automated writing (twice a week)

`.github/workflows/publish-article.yml` runs every Tuesday and Friday at 09:00
UTC. It generates a new article in the site's voice and commits it, which
triggers a redeploy.

### AI provider (no key required)

The generator uses a provider chain:

1. **Anthropic** or **OpenAI**, if you set an API key (best quality).
2. **Pollinations** (free, no auth) as an automatic fallback.

If no provider returns a usable article, the run **skips cleanly** (stays
green) instead of failing. So the automation works out of the box with no
secret at all.

To get consistently high-quality posts, add a key (optional):

1. Get an API key from **Anthropic** (recommended) or **OpenAI**.
2. In the GitHub repo: **Settings -> Secrets and variables -> Actions -> New
   repository secret**.
3. Add `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`) with your key as the value.

The generator auto-detects which provider to use. Set `FREE_ONLY=1` to force
the free provider even when a key is present.

### Manual controls

- Run now: **Actions -> Publish article -> Run workflow**.
- Preview without committing: run the workflow with `dry_run = true`.
- Locally: `npm run generate-article` (free provider), or
  `ANTHROPIC_API_KEY=... npm run generate-article` (add `DRY_RUN=1` to print
  instead of writing a file).

### Tuning

- Voice: `scripts/tone-guide.md`
- Topics: `scripts/topics.md` (lines under `## Topics`)
- Schedule / cadence: the `cron` in `publish-article.yml`
- Model: set a `MODEL` env var (defaults: `claude-3-5-sonnet` / `gpt-4o`)

### Review-before-publish (optional)

To review articles before they go live instead of auto-publishing, change the
final step of `publish-article.yml` to open a pull request (e.g. with
`peter-evans/create-pull-request`) rather than pushing to `master`.
