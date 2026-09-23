# shelbyklein.com

Shelby Klein's portfolio and writing site. Vinext (the Next.js App Router API on Vite), React 19, and Tailwind 4, exported as static HTML to GitHub Pages.

## Deploying

- Every push to `main` builds and publishes the live site (`.github/workflows/pages.yml`). Don't push without the go-ahead.
- CI runs only `scripts/check-hero-scene.mjs` and `npm run build:pages`. Lint and the content check are local — run them before pushing.
- Commit subjects are short and imperative, e.g. "Add Mobbin to tools log".

## Commands

- `npm run dev` — local dev server.
- `npm run build:pages` — production static export into `out/`; `scripts/prepare-pages.mjs` then verifies routes and internal links in the output.
- `npm run lint` — oxlint, type-aware.
- `node scripts/check-content.mjs [baseURL]` — validates content and image references; pass a running server's base URL to also check routes and legacy redirects.

## Content

Everything the site renders comes from `content/` via `lib/portfolio.ts`.

**Articles**
- `content/articles.json` is what renders, kept newest first by `date` (the writing index and "Keep exploring" link rely on that order). To publish a new article, add the same entry to both `authored-articles.json` and `articles.json`.
- To edit a published article, add or update its entry in `content/article-revisions.ts`. A revision's `html`/`excerpt` replaces the stored one at render time.
- Article HTML is split on blank lines (`\n\n`) into separately rendered blocks. Keep each block well-formed — no blank lines inside a list or other multi-line element.
- `creative-work-fewer-tools` inserts project visuals after specific blocks by index (`creativeWorkVisuals` in `app/writing/[slug]/page.tsx`). Adding or removing blocks in that article shifts them.
- Root-relative `href`/`src` in article HTML get the Pages base path automatically. Images live in `public/images/`.
- `content/drafts/` is unpublished working copy; nothing there renders.

**Projects**
- `content/projects.json` renders at `/work/[id]`; `content/case-studies.json` needs an entry for every project. `featuredIds` in `lib/portfolio.ts` sets the homepage selection and order.

Don't re-run `scripts/build-content.py`. It was the one-time WordPress migration: it re-downloads from the live domain and regenerates `projects.json` and `articles.json` from scratch, discarding hand edits. Edit the JSON directly.

## Code

- Wrap every internal link and asset path in components with `sitePath()` (`lib/site-path.ts`) so the export works under a Pages base path.
- Plain `<img>` is intentional (static export, no image optimizer); `nextjs/no-img-element` is off.
- `components/ui/` and `hooks/` are stock shadcn scaffolding; only `sheet` is used. The lint rules they trip are disabled for those paths in `.oxlintrc.json` — don't hand-edit them to satisfy lint.
- `app/[slug]`, `app/project`, `app/projects`, and `app/blog` redirect old WordPress URLs.
- The homepage hero is a standalone canvas scene at `public/scenes/alien-planet.html`, checked in CI by `scripts/check-hero-scene.mjs`.

## Other directories

- `research/` — archive of the original WordPress site (source JSON, page captures, original assets). Reference only.
- `work/` — one-off scripts and logs from past sessions. Not part of the build.
