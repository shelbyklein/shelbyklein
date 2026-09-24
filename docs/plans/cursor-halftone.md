# Cursor-responsive blue halftone accents

Tracked issue: https://github.com/shelbyklein/shelbyklein/issues/1

<!-- skd-plan:cursor-halftone-v1 -->

## Confirmed outcome
Following the user's “continue”, proceed with blue halftone dots in selected decorative areas throughout the site, keeping text areas clear. Dot centers stay stationary. The cursor controls a roughly 150px soft radial increase in stroke thickness with eased return. Touch and reduced-motion layouts remain static.

## Target and current evidence
- Repository: shelbyklein/shelbyklein.
- Working design: /Users/shelbyklein/Vibes/shelbyklein-comic, branch codex/comic-halftone, baseline 8dba41857cd1c8ad7b06a8b4f4e303cbf0891951.
- app/collage.css:13 currently paints the hero grid with a static radial gradient alongside a conic ray pattern.
- components/print-studio.tsx: PrintStudio owns paused/reduced state and the existing MotionToggle. Integrate with this state rather than adding competing controls.
- app/page.tsx contains work, archive, lab, about and writing sections; components/site-footer.tsx supplies the shared footer.
- Existing untracked public/images/flow PNG files are unrelated and must be preserved.
- This is a React/Vinext site, not a local WordPress installation.

## Implementation direction
Use a reusable decorative canvas layer with aria-hidden and pointer-events:none, a static CSS fallback, and local section placement/masks. Preserve the hero rays while replacing only its static dot grid. Add restrained patches at homepage section edges and in the shared footer so inner pages share the motif. Keep dots aligned to their section while scrolling. Start at the current pale blue resting weight; interpolate stroke thickness with smooth radial falloff instead of moving dot positions.
Share one pointer subscription where practical, cap device-pixel resolution, render only visible regions, stop animation after easing settles and while the document is hidden. ResizeObserver and intersection observation must clean up on unmount. Honor the existing pause toggle, live reduced-motion changes and coarse-pointer devices. No new dependencies are expected.

## Tasks and acceptance
- [x] HALO-01: Build a reusable cursor-responsive halftone layer
  - Pass: Dots remain stationary; stroke weight increases smoothly toward the cursor within a 150px radius and returns to baseline on pointer leave.
- [x] HALO-02: Place blue halftone accents throughout the collage site
  - Pass: Hero, homepage section edges and shared footer use the layer without covering text, intercepting clicks, duplicating the hero dot grid or causing horizontal overflow.
- [x] HALO-03: Integrate motion preferences and rendering lifecycle
  - Pass: Motion toggle, reduced motion and coarse pointers show a static grid; off-screen/hidden/idle layers stop animating; resize and navigation clean up listeners and observers.
- [ ] HALO-04: Verify the effect in the running site and complete delivery checks
  - Pass: Inspect desktop idle/hover and narrow touch screenshots; check radial stroke behavior and motion controls, navigation, resize, console and overflow; pass lint, content check, hero check and build:pages; report source and deployment separately.

## Validation
Run npm run lint, node scripts/check-content.mjs, node scripts/check-hero-scene.mjs, and npm run build:pages. Verify the actual collage homepage and an inner route locally, including idle/hover, pointer leave, scrolling, resize, touch, reduced motion and the existing motion toggle. Capture and inspect screenshots. Use focused interaction assertions for cursor falloff and render lifecycle; screenshots alone do not prove motion behavior.

## Boundaries and rollback
Preserve artwork, content, hero reveal, existing dark ink decorations and unrelated work. Do not deploy or merge the collage branch into main: repository guidance says each main push publishes production and requires go-ahead. Deliver local validation first. Rollback is removal of the new layer and restoration of the original CSS dot backgrounds.

## Work preparation
- Scope: confirmed by “continue”; selected decorative areas is the stated default.
- Plan: ready.
- Mode: solo, authorized by the user: no go ahead.
- Handoff recipient: none chosen.
- Timing: implement now.
- Implementation complete locally. HALO-04 remains blocked only on pre-existing repository-wide validation failures. No production deployment.

## Validation evidence — 2026-09-24
- Chrome passed radial stroke falloff (center/outer/outside alpha sums 19552/1488/0), idle render stop, pointer leave reset, reduced motion, pause toggle, resize, inner route navigation, touch static rendering, and no horizontal overflow or console errors.
- Lifecycle checks passed offscreen stroke suspension, a simulated document-hidden visibility event, and client navigation cleanup.
- Inspected desktop hover, shared footer on the writing route, and mobile hero screenshots.
- Passed: scoped component lint, TypeScript noEmit, hero scene checks, production build:pages (31 content pages, 23 legacy pages, 131 local links/assets verified).
- HALO-04 blocker: full lint already fails on print-studio effect/SVG rules, legacy export JSX and public experiments. HEAD print-studio produces the same three errors. Content check rejects archived steamdeckhq-one-year-later with empty HTML, also confirmed in HEAD. These unrelated files/data were not changed.
- Local preview: http://localhost:4178. Work remains on codex/comic-halftone; no main merge or production deployment.
- Tracker plan: C764600D-E2CD-4997-9DB1-EDFE6497ADB8. Implementation tasks HALO-01 through HALO-03 complete; HALO-04 blocked as above.
