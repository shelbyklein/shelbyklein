# Shelby Klein portfolio

A portfolio for Shelby Klein’s design and creative technology practice: 15 project pages, five articles including four from the archive, application references for Newton and Current, resumé/contact links, and redirects for the earlier WordPress portfolio URLs.

## GitHub Pages

Public site: [shelbyklein.github.io/shelbyklein](https://shelbyklein.github.io/shelbyklein/).

Pushing to `main` runs `.github/workflows/pages.yml`, builds the static portfolio, and publishes `out/` to GitHub Pages. Run `npm ci` and `npm run build:pages` to create the same export locally. The export validates every content page and local link/asset, includes directory indexes for direct project and article URLs, and supplies a custom 404 page. Earlier portfolio URLs use small HTML redirect pages on this static host.

The Pages build prefixes links and assets with `/shelbyklein`. `scripts/prepare-pages.mjs` arranges Vinext’s HTML and asset output for that GitHub mount. For browser verification, serve `out/` at `/shelbyklein/` and pass that complete base URL to `scripts/check-navigation.mjs`. The default `npm run build` retains the existing Sites/Cloudflare build and root-relative URLs.

The homepage uses the supplied alien-planet scene as a local, script-only sandboxed background. Its eight canvas layers, procedural terrain, moon, and stars are retained in `public/scenes/alien-planet.html`. The adaptation draws at up to 20 fps, yields during terrain generation, and reuses textures on resize. `components/hero-planet.tsx` provides a pause/play control, follows reduced-motion preferences, and suspends playback outside the viewport or in a hidden tab. `node scripts/check-hero-scene.mjs` checks drawing and playback lifecycle without external services; it also runs before Pages deployment.

## Development

- `npm install`
- `npm run dev`
- `npm run build`
- `node scripts/check-content.mjs http://localhost:3001` (use the URL printed by the development server)
- With Playwright and Chrome available: after building, start `npm run start -- --port 8787`, then run `node scripts/check-navigation.mjs http://localhost:8787` to verify the production navigation paths.

Content is in `content/projects.json` and `content/articles.json`. New articles are also retained in `content/authored-articles.json` so the WordPress migration preserves them; update both JSON files when editing a published article. The original Markdown draft is retained in `content/drafts/` as an editorial reference. Shared presentation is in `app/globals.css`; project pages use `app/work/[slug]/page.tsx`. No credentials or services are required for the portfolio itself.

Original publicly accessible source data is archived locally in `research/`, with a ZIP in `outputs/`. These folders are excluded from deployment and source publishing. The site uses curated, optimized copies of the relevant images and the original resumé.

Newton, Current, and Arcadia are clearly described as independent work in development or exploration. Original articles retain their dates. Historical audience numbers are not presented as current. No generated project artwork, client testimonials, or invented outcomes were added.

Validation: production build and TypeScript check passed. Content check verifies 15 unique complete projects, five articles (including four sanitized archived articles), and all referenced images. HTTP checks cover 23 pages/resources, 19 redirects, and a missing-project 404. Production browser checks cover all 15 project-preview-to-page paths, return links, keyboard activation, related projects, writing links, browser Back, and the mobile full-project action. No JavaScript errors occurred in the navigation checks. The site is a reading/navigation portfolio; WebMCP is not applicable.

“Creative work, fewer tools” appears first on the homepage and Writing index, with a dedicated article page and links to its six referenced projects. New writing does not display the historical archive notice.

Project cards, titles, archive rows, and hero project links open a shared accessible side panel. It includes the project image, summary, details, a full-project link, and an external website link when available. Standard modified clicks retain normal link behavior; Escape, the close button, and backdrop dismissal use the installed Base UI dialog primitive. Keyboard focus returns to the opening link. Small screens use the full viewport width.

Full project pages use `content/case-studies.json` for project-specific introductions, roles, scope, design and development context, media headings, and related projects. This editorial content is separate from the WordPress migration, which leaves it intact. Every project has a complete case study; image and video sections appear only where media is available. Website galleries distinguish original portfolio images from dated captures of the live sites. App and experiment copy retains its development status. The source material is the original project archive, public resume, existing product records, and Newton/Arcadia project documentation; no new performance metrics are asserted.

Page navigation uses native anchors. The installed Vinext production Link bundle throws before requesting a destination because its dynamically loaded `navigateClientSide` export is unavailable, even though development navigation works. Native page loads avoid that failing path, preserve ordinary browser navigation, and close a project panel when its full-project link is followed. Project preview triggers continue to open the side panel.

PlayCase visuals were refreshed from playcase.gg on September 5, 2026. The homepage, project preview, and project page use the current product renders, with a gallery of faceplate variants, storage, rear controls, and assembly. Original-resolution WebP assets and their source URLs are recorded in `content/playcase-visuals.json`; the migration script preserves these selections.

Vispix is included in Selected Work with its public product description, original logo from vispix.dev, project sidebar, and external link. Its source record is in `content/vispix-project.json` and is preserved by the migration script.

Website project galleries include current desktop and mobile captures from Sea Education Association, The School for Field Studies, Steam Deck HQ, and Workplace Solutions, dated September 2026. Source URLs and curated project updates are retained in `content/project-overrides.json` and applied by the migration script. External actions use destination-specific labels, including Watch on Vimeo.
