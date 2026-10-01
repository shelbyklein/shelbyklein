<!-- pegboard-redesign-2026-10-01 -->
# Redesign, second attempt: the pegboard wall

**Issue:** https://github.com/shelbyklein/shelbyklein/issues/4 · **Tracker Trapper:** 4A0774D8-6659-4A29-B004-A6F4368F5B00 (RD-05 to RD-10; RD-01 to RD-04 belong to the abandoned first attempt)
**Branch:** `redesign/pegboard` from `origin/main` 4f8cb20. The first attempt, on `redesign/taste-impeccable`, isn't used.

## Summary
Replace the cut-paper collage homepage with an interactive pegboard wall. Shelby's real work hangs on hooks and clips and sits on shelves, and scrolling down slides the wall sideways. Each object can be nudged, swung, or taken down to open its project. The rest of the site picks up the same palette, type, header, footer, and new bent-wire SK mark.

## Problem
The live homepage (`app/page.tsx`, `components/print-studio.tsx`, `app/collage.css`) leads with collage decoration and slogans ("Different worlds. Same curious streak."), and the work comes later. The first redesign attempt replaced it with a generic grey layout that had no character (Shelby: "it looks horrible"). The research (`instructions/redesign-research.md`) found that the best-known personal sites state who the person is plainly, commit to one signature idea, and get their character from interaction.

## Visuals
- Before: `assets/redesign/before.png` (on the first-attempt branch). Research contact sheets: `assets/research/sheet1-5.png`.
- Approved direction (Shelby, 2026-10-01): `assets/redesign-v2/comp-b-scroll.html`, with frames in `assets/redesign-v2/scroll-*.png` and `m/scroll-*.png`.
- Flow: scroll → pinned wall translates on x (ScrollTrigger scrub) → hanging objects sway from the motion → click lifts the object into a detail card → "Open the case study" goes to `/work/<id>/`, and "Hang it back" or Escape returns it.

## Decisions (Shelby)
Audience: clients and employers. Direction: the workbench, as a pegboard wall (B), scrolling sideways with natural vertical scroll. Personal: light touch. Writing: supporting. Headline: "I design and build things for screens and hands." Mark: a simple new mark (the bent-wire SK hanging on a peg). GSAP motion is wanted.

## Success criteria
1. The homepage at 1440×900 and 390×844 matches the approved prototype. Verified with headless Chrome captures, inspected by eye.
2. The wall pins and translates with scroll. Objects drop, swing, take nudges, drag, and open and close the detail card, with reduced motion respected. Verified by a CDP-driven run on the local static export with zero console errors.
3. Every object and index row links to an existing `/work/<id>/` route. Verified because `npm run build:pages` link verification passes.
4. Apps, writing index, an article, a case study, and clients render with the new header, footer, and palette, with no horizontal overflow at 390 or 1440. Verified with captures.
5. `npm run lint`, `node scripts/check-content.mjs <url>`, `node scripts/check-hero-scene.mjs`, and `npm run build:pages` all pass.

## Deliverables
Source committed on `redesign/pegboard`, a local preview, and screenshots in `assets/redesign-v2/`. The push to `main`, which deploys, waits for Shelby's go-ahead.

## Tasks
| ID | Task | Acceptance |
|---|---|---|
| RD-05 | Record the new direction, plan, issue section, and tracker todos | The issue #4 body has this checklist and the tracker lists RD-05 to RD-10 |
| RD-06 | Build the pegboard wall as a client component (`components/pegboard.tsx`, layout data in `lib/pegboard.ts`) using installed GSAP, ScrollTrigger, and SplitText | The CDP run on the dev server shows the intro drop, a scroll sway of 5° or more, take-down and hang-back, and zero errors |
| RD-07 | New header, footer, and wire SK mark (`components/site-logo.tsx`), plus favicon | The header and footer render on every route, and the mark sways on hover |
| RD-08 | Rest of the homepage: selected-work index with a cursor preview, a short About section, and the latest writing | The section renders at both sizes, and all links resolve in the build check |
| RD-09 | Workshop tokens (`app/workshop.css`) applied to the secondary pages, and the collage chrome retired from the layout | Captures of apps, writing, an article, a case study, and clients at 1440 and 390 show no overflow |
| RD-10 | Run all checks and commit on the branch | Lint, content, hero, and build all exit 0, and the commit exists |
| Gate | Shelby reviews the local preview and approves the push | Shelby says so explicitly |

## Boundaries
- **Keep:** routes, redirects, `content/`, project images, analytics, Stripe and Drive links on `/clients`, `public/scenes/alien-planet.html` and its CI check, and the article renderers.
- **Out of scope:** new photography, case-study page redesigns beyond tokens and chrome, and deploying.
- **Collage components:** these are left in the repo, unused on the homepage. Removing them is a follow-up.

## Rollback
The work is a single branch, and nothing is deployed until Shelby approves. If needed after a deploy, revert the merge commit on `main` and push. That needs Shelby's go-ahead.

## Test plan
`npm run lint` · `node scripts/check-content.mjs http://localhost:<port>` · `node scripts/check-hero-scene.mjs` · `npm run build:pages` · a CDP script covering the scroll, nudge, take-down, and reduced-motion paths on the static export · captures at 1440×900 and 390×844 of `/`, `/apps`, `/writing`, one article, `/work/playcase`, and `/clients`.

## Open questions (non-blocking)
The copy beyond the headline is a draft for Shelby to edit.

## Work preparation
Scope confirmed by Shelby in chat on 2026-10-01 ("yes" to building it into the real site). Mode: **linear**, because the work is one tightly coupled visual system. Model: Opus 5.5 (`claude-opus-5-5`), this session's effort. Readiness: pass · 2026-10-01 · R12 is the branch-only rollback above.
