# Portfolio content refresh

The website has 19 case studies, but Chatterbox is only an Apps/GitHub link and Spoolside is absent. Add evidence-backed project pages and surface two existing published concepts so clients and employers can explore recent software and interactive web work.

## Confirmed scope
User requested project research and then "Update as needed" on 2026-10-10. Implement the recommended first batch: Chatterbox and Spoolside case studies, Spoolside Apps listing, an Experiments section on the existing Apps page, and refresh the tools log with current tools. Use existing authentic icons and a clearly captioned historical Spoolside demo screenshot; no fabricated product screenshots or results. Existing data models live in content/projects.json and content/case-studies.json; Apps lives in app/apps/page.tsx; shared Chatterbox details live in lib/chatterbox.ts.

## Visual evidence
[Before](assets/content-refresh/before-apps.png) · [Target sketch](assets/content-refresh/target.svg). Reuse existing PageHead, PegBand, Hang, shelf cards, and case-study templates. Experiments is a section of Apps, not a new visual identity or route.

## Success criteria and deliverables
1. Both new /work pages are statically exported, complete, linked from Apps and the homepage work index, and use verified factual copy.
2. Apps exposes two clearly labeled concepts with local copies of the existing published concepts; footer links to that section.
3. Inspected 1440px/390px renders have no overflow, broken images, or application errors; reduced motion remains usable.
4. Lint, content, hero-scene and static build pass; scoped commit pushed to main and Pages deployment verified.
Deliver committed source/content/media, this plan, published pages, and local proof screenshots.

## Tasks
- [x] REF-01: Add project records, case studies and authentic assets. Check: content validator covers all 21 projects and every image exists.
- [x] REF-02: Integrate Apps, Experiments, shared Chatterbox link and tools-log refresh. Check: exported links target correct pages, concept labels visible, existing app entries retained.
- [x] REF-03: Verify desktop/mobile and required checks. Check: screenshots inspected, assets/overflow/errors asserted; all four checks pass.
- [ ] REF-04: Commit, push and verify deployment. Check: successful Pages run at committed SHA and live new content observed.

## Work preparation
Execution: linear, current session; exact model/effort unavailable. One small shared content change, no delegation. Authorization: implement now and standing authorization to push normal website changes to main. Readiness: R1–R13 pass; tasks and issue checklist aligned after issue creation. No blocking questions. Existing pegboard aesthetics are fixed by prior user direction.

## Boundaries and verification
Preserve existing pages, homepage wall interactions, Stripe/Drive links, untracked .claude/.impeccable, and other worktrees. No client draft publication, new snippet upload, account changes, blog claims about unverified results, or product deployment.
Commands: npm run lint; node scripts/check-content.mjs; node scripts/check-hero-scene.mjs; npm run build:pages. Browser entry: static export at http://127.0.0.1:4738, Apps/new case studies/tools article plus homepage and Clients smoke checks. Capture desktop/mobile, check keyboard access and reduced motion. Live verification after Pages deployment.
Rollback: revert only this scoped commit on main and push; the prior Git revision is the source backup. No stored-data migration.

Issue: https://github.com/shelbyklein/shelbyklein/issues/5

## Verification findings
The snippets host returned Cloudflare Tunnel error 530 in Chrome on 2026-10-10. Host existing self-contained WPS and Camp concepts under public/experiments instead; no snippet service settings changed. Copies preserve source licenses and concept labels. WPS source: Studios/WPS/office-walkthrough/published/index.html; Camp source: Vibes/sandbox/camp-hollow-pine/index.html and camp.js. Their original files remain untouched.
The tools article renders a custom React essay; update that component as well as its source/revision records. One detector warning at workshop.css:94 belongs to the existing header padding transition; no new findings in added styles.

## Implementation evidence
REF-01–03 complete: 21 project/case-study records; 9 articles; content assets validated. Required lint, hero-scene and build pass. Static export: 34 content pages, 6 embedded scenes, 138 local links/assets. Chrome checks: 12 desktop/mobile route states at 1440/390, reduced motion, app-directory navigation, keyboard focus, no broken local images/overflow/application errors. Both local concept pages render WebGL at both widths without page errors. Screenshots in work/content-refresh/. App icon and early demo carry source sidecars. Footer preserves Clients entry; browser check confirms Stripe billing link retained. Source baseline 9b73a00422a55f1c3563e00692dd18391a0ecb81.

Finish review: ship at scoped level; all six Apps/case-study captures valid, no material fixes. Existing templates remain authoritative. Documentation consistency review pending.
