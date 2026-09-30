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

## Follow-up: section backgrounds and density — 2026-09-24
The user requested expanding the effect into section backgrounds with varying densities. Current fields cover only small work/writing edges and use fixed 5px spacing. Extend the same effect across section interiors with dense (5px), medium (9px), and sparse (14px) dot grids, using lower ink strength behind text.

Before: [current hero](assets/halftone-before.png). Target: [section layout sketch](assets/halftone-layout.txt).

- [x] HALO-05: Expand responsive section backgrounds with three dot densities
  - Pass: Homepage sections have full-area blue dot backgrounds with 5px, 9px and 14px spacing; CSS resting dots and cursor strokes share the same grid; cursor canvas allocation stays bounded independent of section height.
- [x] HALO-06: Verify varied densities and section-wide behavior
  - Pass: Inspect desktop/mobile section renders; verify cursor ink aligns with each density, changes across section interiors, resets, respects touch/reduced-motion/pause and introduces no overflow; TypeScript, scoped lint and build pass with earlier unrelated failures recorded separately.

Success criteria: (1) visible section-wide density variation in inspected local desktop/mobile screenshots; (2) canvas pixel checks confirm resting/hover alignment for each density; (3) preference and overflow browser assertions pass; (4) production build, TypeScript and scoped lint pass. Existing HALO-04 baseline blockers remain separate.
Deliverables: committed component/CSS/section integration, updated plan and tracker, local rendered evidence; production deployment remains excluded. Preserve content/artwork and all unrelated untracked assets. No blocking design questions.
Execution: linear, gpt-6-astra, medium effort (verified from this session turn_context); no delegation. Readiness: R1–R11 and R13 pass with this addendum; R12 n/a, no stored data/deployment change. Scope authorized directly by the user's follow-up. Test entry: http://localhost:4178; browser density/section checks, npx tsc --noEmit, scoped oxlint, npm run build:pages. Existing HALO-04 failures are not waived or marked complete.

Follow-up Tracker plan: local:6D11DABD-3F94-4581-ADF7-BED7D84D65D3, todos HALO-05/HALO-06. The original Tracker plan rejects appended todo IDs, so this linked extension retains the completed original tasks and HALO-04 blocker unchanged. GitHub issue #1 contains both checklists.

### Density follow-up results
HALO-05 and HALO-06 complete. Nine layers now cover hero, atelier, work, archive, lab, about, practice, writing and shared footer. Three spacings (5/9/14px) share exact CSS/canvas alignment. Cursor canvases remain 300 CSS pixels square rather than growing with sections. Chrome pixel assertions found no off-grid strokes in six section interiors; coverage, pointer reset, motion preferences, touch and overflow checks pass. Desktop work/about/lab and mobile about screenshots inspected. TypeScript, scoped lint, diff check and production export pass; HALO-04 baseline blockers remain unchanged. No deployment or push.
