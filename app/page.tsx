import { ArrowUpRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Pegboard, type PegProject } from '@/components/pegboard';
import { WorkIndex } from '@/components/work-index';
import { pegItems } from '@/lib/pegboard';
import { projects, articles, getProject } from '@/lib/portfolio';
import { sitePath } from '@/lib/site-path';

// Client and Team USA work leads the index; independent products and software follow.
const indexOrder = ['playcase', 'olympic-jerseys', 'sea-education', 'usa-archery-broadcast', 'steam-deck-hq', 'field-studies', 'archery-is-for-everyone', 'national-event-identities', 'workplace-solutions', 'us-open', 'sfs-brochure', 'newton', 'vispix', 'tracker-trapper', 'current', 'flogg', 'playcase-editor', 'playpad', 'arcadia'];

export default function Home() {
  const pegProjects: Record<string, PegProject> = Object.fromEntries([...new Set(pegItems.map((item) => item.projectId))].map((id) => {
    const p = getProject(id)!;
    return [id, { title: p.title, label: p.label, summary: p.summary, href: sitePath(`/work/${id}`) }];
  }));
  const rows = [...indexOrder.map((id) => getProject(id)!), ...projects.filter((p) => !indexOrder.includes(p.id))]
    .map((p) => ({ id: p.id, title: p.title, label: p.label, href: sitePath(`/work/${p.id}`), cover: p.cover }));
  const writing = articles.filter((a) => !a.archived).slice(0, 3);

  return <div id="top" className="shop-home">
    <Pegboard header={<SiteHeader/>} items={pegItems} projects={pegProjects} intro={<>
      <span className="peg-label" data-in>DESIGNER · DEVELOPER · ATLANTA</span>
      <h1 className="peg-headline" id="main">I design and build things for screens and hands.</h1>
      <p data-in>Websites, software, live broadcast graphics, and physical products, from Team USA’s Olympic archery jerseys to a gaming case for the iPhone.</p>
      <div className="peg-actions" data-in><a className="peg-btn" href="#work">See selected work</a><a className="peg-btn ghost" href="mailto:shelbykleindesign@gmail.com">Let’s talk</a></div>
      <p className="peg-hint" data-in>Everything on the wall is a project. Give one a nudge, or take it down.<br/><b aria-hidden="true">↓</b> Scroll to walk the wall</p>
    </>}/>

    <section id="work" className="shop-section shop-work" aria-labelledby="work-title">
      <div><h2 id="work-title">Selected work</h2><p className="shop-sub">Client websites, Team USA, products I’ve shipped, and the software I’m building now.</p></div>
      <WorkIndex rows={rows}/>
    </section>

    <section id="about" className="shop-section shop-about" aria-labelledby="about-title">
      <figure className="shop-portrait"><img src={sitePath('/images/shelby.webp')} alt="Shelby Klein" width="800" height="1122" loading="lazy"/></figure>
      <div>
        <h2 id="about-title">A designer, a developer, and a dad.</h2>
        <p>I’m Shelby Klein, based in Atlanta, Georgia. I take projects from the first sketch through the last detail, and I build the thing myself, whether it’s a website, a desktop app, or a 3D-printed case.</p>
        <p>My work spans national campaigns, Olympic competition apparel, live broadcast systems, and independent hardware and software products.</p>
        <div className="peg-actions"><a className="peg-btn ghost" href={sitePath('/Shelby-Klein-Resume.pdf')} target="_blank" rel="noreferrer">Resumé <ArrowUpRight size={16}/></a><a className="peg-btn ghost" href="https://www.linkedin.com/in/shelbyklein/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={16}/></a></div>
      </div>
    </section>

    <section className="shop-section shop-writing" aria-labelledby="writing-title">
      <div><h2 id="writing-title">Writing</h2><a className="shop-more" href={sitePath('/writing')}>All writing <ArrowUpRight size={16}/></a></div>
      <div className="shop-notes">{writing.map((a) => <a key={a.slug} className="shop-note" href={sitePath(`/writing/${a.slug}`)}>
        <time dateTime={a.date}>{new Date(a.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
        <h3>{a.title}</h3><span>Read <ArrowUpRight size={15}/></span></a>)}</div>
    </section>
    <SiteFooter/>
  </div>;
}
