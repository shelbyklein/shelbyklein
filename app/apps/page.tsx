import type { Metadata } from 'next';
import { chatterbox } from '@/lib/chatterbox';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getProject, type Project } from '@/lib/portfolio';
import { sitePath } from '@/lib/site-path';
import { ArrowUpRight } from 'lucide-react';
import { PegBand, Hang, PageHead } from '@/components/peg-band';

export const metadata: Metadata = {
  title: 'Apps — Shelby Klein',
  description: 'A directory of independent apps and focused tools built by Shelby Klein.',
};

const appIds = ['newton', 'spoolside', 'current', 'vispix', 'flogg', 'playcase-editor'];
const appNames: Record<string, string> = {
  'playcase-editor': 'PlayCase Editor',
};
const appIcons: Record<string, string> = {
  chatterbox: chatterbox.icon,
  spoolside: '/images/apps/spoolside-icon.webp',
  newton: '/images/newton-logo.png',
  current: '/images/apps/current-icon.png',
  vispix: '/images/vispix-logo.png',
  flogg: '/images/apps/flogg-icon.png',
  'playcase-editor': '/images/apps/playcase-editor-icon.svg',
  appleseed: '/images/apps/appleseed-icon.png',
  'tracker-trapper': '/images/apps/tracker-trapper-icon.webp',
};

type AppDirectoryEntry = {
  id: string;
  label: string;
  name: string;
  summary: string;
  href: string;
  linkLabel?: string;
};

export default function AppsPage() {
  const apps: AppDirectoryEntry[] = appIds
    .map(getProject)
    .filter((project): project is Project => project !== undefined)
    .map((project) => ({
      id: project.id,
      label: project.label,
      name: appNames[project.id] ?? project.title,
      summary: project.summary,
      href: sitePath('/work/' + project.id),
    }));
  apps.splice(1, 0, {
    id: 'appleseed',
    label: 'Newton mobile companion · In development',
    name: 'Appleseed',
    summary: 'A focused mobile companion that keeps Newton projects and work close at hand.',
    href: sitePath('/work/newton'),
  });

  apps.splice(2, 0, {
    id: 'tracker-trapper',
    label: 'macOS · Agent progress tracker',
    name: 'Tracker Trapper',
    summary: 'A menu-bar companion that keeps local plans, GitHub checklists, and coding-agent progress in view—so you can see what’s done, blocked, and next.',
    href: sitePath('/work/tracker-trapper'),
  });

  apps.unshift({ ...chatterbox, href: sitePath(chatterbox.href) });

  return (
    <div id="top">
      <SiteHeader />
      <main id="main" className="page-main">
        <div className="page-intro">
          <PageHead label="Apps" title={<>Tools I build<br />for the work.</>}>
            <p>Independent applications and focused tools: workspaces for ongoing projects, creative utilities, and small interfaces made to solve one problem well.</p>
          </PageHead>
          <PegBand className="apps-band" label="App icons on a pegboard">
            {apps.map((app, i) => <Hang key={app.id} href={app.href} tag={app.name} tagColor={i % 3 === 1 ? 'blue' : undefined} pivot={2} k={30 + (i % 3) * 4}>
              <span className="peg-print peg-sticker app-sticker"><img src={sitePath(appIcons[app.id])} alt={app.name} width="96" height="96" /></span>
            </Hang>)}
          </PegBand>
        </div>

        <section className="shelf" aria-label="App directory">
          {apps.map((app) => (
            <a className="shelf-card" href={app.href} key={app.id}>
              <img className="shelf-icon" src={sitePath(appIcons[app.id])} alt="" width="512" height="512" />
              <span className="peg-label">{app.label}</span>
              <strong>{app.name}</strong>
              <span className="shelf-summary">{app.summary}</span>
              <span className="shelf-go">{app.linkLabel ?? 'Open'} <ArrowUpRight size={16} aria-hidden="true" /></span>
            </a>
          ))}
        </section>
        <section id="experiments" className="experiments-section" aria-labelledby="experiments-title">
          <div className="case-section-heading"><h2 id="experiments-title">Experiments</h2></div>
          <p className="case-section-intro">Small, playable studies in how a website can feel. These are concepts, with room to try things before they become production work.</p>
          <div className="experiments-grid">
            <article className="experiment-note">
              <span className="peg-clip" aria-hidden="true" />
              <h3>An office you can walk through.</h3>
              <p>A Three.js spatial-navigation concept for Workplace Solutions. Scroll between rooms, or inspect the furniture. The architecture and most furnishings are illustrative, not completed client interiors.</p>
              <p className="experiment-status">Interactive concept · WebGL</p>
              <a className="peg-btn" href={sitePath('/experiments/office-walkthrough/index.html')} target="_blank" rel="noreferrer">Open the walkthrough <ArrowUpRight size={17} aria-hidden="true" /></a>
              <a className="text-link" href={sitePath('/work/workplace-solutions')}>See the WPS project <ArrowUpRight size={16} aria-hidden="true" /></a>
            </article>
            <article className="experiment-note">
              <span className="peg-clip" aria-hidden="true" />
              <h3>A little trip to Camp Hollow Pine.</h3>
              <p>A fictional camp website exploring a scroll-driven 3D scene and an outdoor visual identity. An independent design study, rather than a launched client website.</p>
              <p className="experiment-status">Fictional website · Interactive concept</p>
              <a className="peg-btn" href={sitePath('/experiments/camp-hollow-pine/index.html')} target="_blank" rel="noreferrer">Explore the camp <ArrowUpRight size={17} aria-hidden="true" /></a>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
      {/* Buy Me a Coffee floating button */}
      <script
        defer
        data-name="BMC-Widget"
        data-cfasync="false"
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        data-id="shelbynomustang"
        data-description="Support me on Buy me a coffee!"
        data-message=""
        data-color="#FFDD00"
        data-position="Right"
        data-x_margin="18"
        data-y_margin="18"
      />
    </div>
  );
}
