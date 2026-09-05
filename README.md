# Shelby Klein portfolio

A portfolio for Shelby Klein’s design and creative technology practice: 14 project pages, four archived articles, application references for Newton and Current, resumé/contact links, and redirects for the earlier WordPress portfolio URLs.

## Development

- `npm install`
- `npm run dev`
- `npm run build`
- `node scripts/check-content.mjs http://localhost:3001` (use the URL printed by the development server)

Content is in `content/projects.json` and `content/articles.json`. Shared presentation is in `app/globals.css`; project pages use `app/work/[slug]/page.tsx`. No credentials or services are required for the portfolio itself.

Original publicly accessible source data is archived locally in `research/`, with a ZIP in `outputs/`. These folders are excluded from deployment and source publishing. The site uses curated, optimized copies of the relevant images and the original resumé.

Newton, Current, and Arcadia are clearly described as independent work in development or exploration. Original articles retain their dates. Historical audience numbers are not presented as current. No generated project artwork, client testimonials, or invented outcomes were added.

Validation: production build and TypeScript check passed. Content check verifies 14 unique complete projects, four sanitized archived articles, and all referenced images. HTTP checks cover 21 pages/resources, 18 legacy redirects, and a missing-project 404. The site is a reading/navigation portfolio; WebMCP is not applicable. No automated browser interaction or responsive screenshot testing was performed for the rebuilt portfolio.

Project cards, titles, archive rows, and hero project links open a shared accessible side panel. It includes the project image, summary, details, a full-project link, and an external website link when available. Standard modified clicks retain normal link behavior; Escape, the close button, and backdrop dismissal use the installed Base UI dialog primitive. Keyboard focus returns to the opening link. Small screens use the full viewport width.

PlayCase visuals were refreshed from playcase.gg on September 5, 2026. The homepage, project preview, and project page use the current product renders, with a gallery of faceplate variants, storage, rear controls, and assembly. Original-resolution WebP assets and their source URLs are recorded in `content/playcase-visuals.json`; the migration script preserves these selections.
