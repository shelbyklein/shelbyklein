import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getProject, type Project } from '@/lib/portfolio';
import { projectLinkLabel } from '@/lib/project-links';
import { sitePath } from '@/lib/site-path';

export const metadata: Metadata = {
  title: 'Apps — Shelby Klein',
  description: 'A directory of independent apps and focused tools built by Shelby Klein.',
};

const appIds = ['newton', 'current', 'vispix', 'flogg', 'playcase-editor'];
const appNames: Record<string, string> = {
  'playcase-editor': 'PlayCase Editor',
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
          {apps.map((app, index) => {
            const name = appNames[app.id] ?? app.title;
            return (
              <article className={'apps-card apps-card--' + app.id} key={app.id}>
                <a
                  className="apps-preview"
                  href={sitePath('/work/' + app.id)}
                  aria-label={'View ' + name + ' project'}
                >
                  {app.cover && (
                    <img
                      src={app.cover}
                      alt={name + ' interface'}
                      width="1440"
                      height="1000"
                      loading={index < 2 ? 'eager' : 'lazy'}
                    />
                  )}
                </a>
                <div className="apps-card-content">
                  <span className="eyebrow">APP {String(index + 1).padStart(2, '0')}</span>
                  <h2><a href={sitePath('/work/' + app.id)}>{name}</a></h2>
                  <p>{app.summary}</p>
                  <div className="apps-card-actions">
                    <a href={sitePath('/work/' + app.id)}>
                      View project <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                    {app.url && (
                      <a href={app.url} target="_blank" rel="noreferrer">
                        {projectLinkLabel(app)} <ArrowUpRight size={17} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
