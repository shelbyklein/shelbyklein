# Homepage paper collage parallax
Use the ten approved transparent assets across the homepage with restrained scroll parallax. The page currently has responsive blue dot grids but lacks the standalone collage accents. Add depth with different layer speeds while retaining readable content, the existing cursor effect and motion controls.

## Scope and visual direction
Before: [current section](assets/halftone-before.png). Target sketch: [layer placement](assets/paper-layout.txt).
Place blue/red paper circles near section boundaries, small gold/red dots near headings, all five halftone shapes around artwork or in section gutters, and angled charcoal strokes as directional accents. Text always stays above low-opacity decoration; no new copy or interaction.
Scroll travel: circles about 30px, dots up to 45px, halftones about 15px, strokes about 22px in either direction. Touch travel is reduced. No continuous idle animation.

## Success criteria and deliverables
All ten assets present in actual local DOM and load successfully; inspected desktop/mobile screenshots show balanced accents and readable content. Browser assertions prove distinct parallax rates, static pause/reduced-motion states and no overflow. Scoped lint, TypeScript and production export pass.
Deliver committed source/WebP derivatives and this plan; local preview and evidence screenshots. No push, merge, deployment or issue closure. Originals retained in the generated output folder.

## Tasks
- [x] PAPER-01: Place all ten supplied collage assets across the homepage
  - Pass: All ten supplied images appear as decorative, non-interactive section accents; desktop/mobile screenshots show readable text and no horizontal overflow.
- [x] PAPER-02: Add and verify restrained parallax with motion controls
  - Pass: Visible layers translate at distinct scroll speeds; pause/reduced-motion render static compositions; touch has reduced travel; listeners clean up and hidden/offscreen work is suspended. Browser assertions, scoped lint, TypeScript and production export pass.

## Work preparation
User directly authorized this follow-up. Linear execution: gpt-6-astra, medium effort, no delegation. Tracker plan local:AADA9E02-8FA9-454D-BD9A-DF34A9AD0DB8. Related GitHub issue: https://github.com/shelbyklein/shelbyklein/issues/1 (existing validation blocker remains unrelated).
Readiness R1-R11/R13 pass; R12 n/a (no data migration or deployment). No open questions.
Preserve unrelated assets/content and existing reveal/halftone behavior. Use bounded decorative layers with pointer-events:none and aria-hidden. Rollback by reverting this scoped commit.
Checks: local Chrome homepage at http://localhost:4178; desktop/mobile captures and parallax/preference assertions; npx oxlint components/paper-collage.tsx; npx tsc --noEmit; npm run build:pages.


## Results
Both tasks complete. Ten optimized assets (496808 bytes total) in seven section compositions. Browser suite verified asset loading, distinct/opposing scroll deltas, static pause/reduced/hidden states, reduced touch travel, no overflow or console errors, decorative semantics, and route unmount. Inspected desktop hero/atelier/lab/about and mobile atelier captures; moved lab circle away from copy. Scoped lint, TypeScript and production export pass (142 verified local links/assets). Existing issue #1 baseline lint/content failures remain separate. No push or deployment.
