import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getProject, type Project } from '@/lib/portfolio';
import { sitePath } from '@/lib/site-path';

export const metadata: Metadata = {
  title: 'Apps — Shelby Klein',
  description: 'A directory of independent apps and focused tools built by Shelby Klein.',
};

const appIds = ['newton', 'current', 'vispix', 'flogg', 'playcase-editor'];
const appNames: Record<string, string> = {
  'playcase-editor': 'PlayCase Editor',
};
const appIcons: Record<string, string> = {
  newton: '/images/newton-logo.png',
  current: '/images/apps/current-icon.png',
  vispix: '/images/vispix-logo.png',
  flogg: '/images/apps/flogg-icon.png',
  'playcase-editor': '/images/apps/playcase-editor-icon.png',
};

export default function AppsPage() {
  const apps = appIds
    .map(getProject)
    .filter((project): project is Project => project !== undefined);

  return (
    <div id="top">
      <SiteHeader />
      <main id="main" className="apps-main wrap">
        <header className="apps-heading">
          <span className="eyebrow">APPS</span>
          <h1>Tools I build<br />for the work.</h1>
          <p>
            A directory of independent applications and focused tools: workspaces for ongoing
            projects, creative utilities, and small interfaces made to solve a specific problem.
          </p>
        </header>

        <section className="apps-directory" aria-label="App directory">
          {apps.map((app) => {
            const name = appNames[app.id] ?? app.title;
            return (
              <a className="apps-card" href={sitePath('/work/' + app.id)} key={app.id}>
                <img className="apps-icon" src={sitePath(appIcons[app.id])} alt="" width="512" height="512" />
                <span className="apps-card-content">
                  <span className="eyebrow">{app.label}</span>
                  <strong>{name}</strong>
                  <span>{app.summary}</span>
                </span>
              </a>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
