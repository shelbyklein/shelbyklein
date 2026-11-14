# Duo Pixel public app pages

Duo Pixel needs public app, privacy, and support pages before App Store submission. The site currently has an Apps directory (`app/apps/page.tsx`) but no Duo Pixel routes; existing pages use the header/footer, Bricolage/Geist typography and orange pegboard in `app/workshop.css`.

## Confirmed scope and design
User explicitly requested building all three pages with the site's contact email. Extend the incumbent visual system. Landing mode: Persuade, with actual app screenshots as proof, clear unreleased status and links to support/privacy. Support/privacy mode: Read, readable prose, shared local app navigation. Source facts: `/Users/shelbyklein/Vibes/sandbox/duo-pixel/store/` privacy.html, support.html, listing.md. Use shelbykleindesign@gmail.com, verified in site footer. Preserve privacy facts verbatim except replacing the placeholder and local link. No price, download badge, or App Store link before release.

Current visual reference: [existing homepage](../work/sdhq-refresh/home-1440.png). Target structure: [layout](assets/duo-pixel/layout.svg). App screenshots are supplied in the source store/screenshots folder.

## Success criteria / deliverables
- `/duo-pixel/`, `/duo-pixel/privacy/`, `/duo-pixel/support/` render publicly with metadata, real imagery and working navigation.
- Apps directory links to the landing page; no placeholder email, price or invented release claim.
- Privacy preserves on-device projects, no app collection/tracking, optional direct PixelLab requests and user-owned API key handling.
- Desktop 1440 and phone 390 captures: no broken images, overflow or browser errors; support email and route links verified.
- Scoped code/assets/docs committed to main, build deployed and live routes verified. Screenshot proofs remain in ignored work/.

## Tasks
- [x] DP1: Create app pages/assets/directory entry; verify copy, navigation and export route inventory.
- [x] DP2: Run lint, content, hero-scene and build:pages; capture/inspect all three routes desktop/mobile and Apps discovery.
- [ ] DP3: Commit/push scoped files, verify Pages deployment/live content, send final URLs to Sprite Drawing App at user's relayed request.

## Work preparation
Mode: linear, because three related pages share code and styles. Model: current session; exact model/effort unavailable. User said build now; standing approval authorizes ordinary main publication. No open decisions. Readiness R1–R13 pass: summary/problem above; visual references and sketch exist; acceptance and tasks align; scope/test/deploy boundaries below. Tracking: local:instructions/duo-pixel-pages.md · https://github.com/shelbyklein/shelbyklein/issues/6.

## Boundaries and rollback
Do not edit the native app, its store sources, other portfolio work, billing, unrelated untracked .claude/.impeccable, or global visual identity. No site-wide redesign. The website's existing analytics are separate from the native app privacy facts. No external account setup. Before publishing, retain baseline git commit 0871abf. Roll back with a scoped git revert of this task's commit and redeploy. Tests: npm run lint; node scripts/check-content.mjs; node scripts/check-hero-scene.mjs; npm run build:pages; isolated headless browser at /apps/ and three new routes, desktop/phone, including local navigation, email link, reduced-motion and default-motion render checks.

## Validation evidence
Lint, content validation (17 case studies / 9 articles / 44 images), hero-scene check and build:pages passed. Static export includes all three routes: 33 content pages and 130 verified links/assets. Isolated headless Chrome verified /apps/ and the three new routes at 1440 and 390px: no broken images, horizontal overflow or page errors; local app navigation, contact email, unreleased status and default-motion phone rendering pass. Inspected landing desktop/mobile, privacy phone and support desktop screenshots in work/duo-pixel/. Mechanical detector returned no findings.
