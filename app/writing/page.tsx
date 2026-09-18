import { essayMeta } from '@/components/editorial/essay-meta';
import { sitePath } from '@/lib/site-path';
import { ArrowUpRight } from 'lucide-react';
import { articles } from '@/lib/portfolio';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
export const metadata = {
  title: 'Writing — Shelby Klein',
  description: 'Notes on creative work, technology, and building useful tools.',
};
export default function Writing() {
  return (
    <div id="top">
      <SiteHeader />
      <main id="main" className="wrap writing-index">
        <span className="eyebrow">WRITING</span>
        <h1>
          Notes from
          <br />
          <span>the process.</span>
        </h1>
        <p>
          Thoughts on creative work, technology, and building useful tools,
          alongside articles from my earlier site.
        </p>
        <div className="writing-grid">
          {articles
            .filter((a) => !a.archived)
            .map((a) => (
              <a
                className="writing-card"
                href={sitePath(`/writing/${a.slug}`)}
                key={a.slug}
              >
                {essayMeta[a.slug] && (
                  <img
                    className="writing-card-cover"
                    src={sitePath(essayMeta[a.slug].image)}
                    alt={essayMeta[a.slug].alt}
                    loading="lazy"
                  />
                )}
                <time dateTime={a.date}>
                  {new Date(a.date + 'T12:00:00Z').toLocaleDateString('en-US', {
                    dateStyle: 'long',
                    timeZone: 'UTC',
                  })}
                </time>
                <h2>{a.title}</h2>
                {!a.archived && a.excerpt && <p>{a.excerpt}</p>}
                <span>
                  Read the article <ArrowUpRight size={18} />
                </span>
              </a>
            ))}
        </div>
        <section className="writing-archive">
          <h2>Archive records</h2>
          <p>
            Titles and dates from my earlier site. The original article text is
            not available in this archive.
          </p>
          {articles
            .filter((a) => a.archived)
            .map((a) => (
              <a key={a.slug} href={sitePath(`/writing/${a.slug}`)}>
                {a.title} <span>· {a.date}</span>
              </a>
            ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
