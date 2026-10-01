import { essayMeta } from '@/components/editorial/essay-meta';
import { sitePath } from '@/lib/site-path';
import { ArrowUpRight } from 'lucide-react';
import { articles } from '@/lib/portfolio';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PegBand, Hang, PageHead } from '@/components/peg-band';

const shortDate = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const longDate = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' });
export const metadata = {
  title: 'Writing — Shelby Klein',
  description: 'Notes on creative work, technology, and building useful tools.',
};
export default function Writing() {
  const current = articles.filter((a) => !a.archived), archived = articles.filter((a) => a.archived);
  return (
    <div id="top">
      <SiteHeader />
      <main id="main" className="page-main">
        <div className="page-intro">
          <PageHead label="Writing" title={<>Notes from<br />the process.</>}>
            <p>Thoughts on creative work, technology, and building useful tools, alongside articles from my earlier site.</p>
          </PageHead>
          <PegBand className="writing-band" label="Recent essays pinned to a pegboard">
            {current.filter((a) => essayMeta[a.slug]).slice(0, 5).map((a, i) => <Hang key={a.slug} href={sitePath(`/writing/${a.slug}`)} tag={shortDate(a.date)} tagColor={i === 0 ? 'blue' : undefined} pivot={-26} k={22 + i * 2}>
              <span className="peg-clip" /><span className="peg-print essay-print"><img src={sitePath(essayMeta[a.slug].image)} alt={a.title} width="180" height="124" /></span>
            </Hang>)}
          </PegBand>
        </div>

        <section className="notes-grid" aria-label="Essays">
          {current.map((a) => (
            <a className="note-card" href={sitePath(`/writing/${a.slug}`)} key={a.slug}>
              {essayMeta[a.slug] && <img className="note-cover" src={sitePath(essayMeta[a.slug].image)} alt={essayMeta[a.slug].alt} loading="lazy" />}
              <time className="peg-label" dateTime={a.date}>{longDate(a.date)}</time>
              <h2>{a.title}</h2>
              {a.excerpt && <p>{a.excerpt}</p>}
              <span className="shelf-go">Read the article <ArrowUpRight size={16} aria-hidden="true" /></span>
            </a>
          ))}
        </section>

        <section className="archive-list" aria-labelledby="archive-title">
          <div><h2 id="archive-title">Archive records</h2><p>Titles and dates from my earlier site. The original article text isn’t available in this archive.</p></div>
          <div className="work-rows">{archived.map((a) => <a className="work-row" key={a.slug} href={sitePath(`/writing/${a.slug}`)}><span className="work-row-title">{a.title}</span><span className="work-row-label">{longDate(a.date)}</span><ArrowUpRight size={18} aria-hidden="true" /></a>)}</div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
