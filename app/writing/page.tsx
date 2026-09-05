import { ArrowUpRight } from 'lucide-react';
import { articles } from '@/lib/portfolio';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
export const metadata={title:'Writing — Shelby Klein',description:'Notes on creative work, technology, and building useful tools.'};
export default function Writing(){return <div id="top"><SiteHeader/><main id="main" className="wrap writing-index"><span className="eyebrow">WRITING</span><h1>Notes from<br/><span>the process.</span></h1><p>Thoughts on creative work, technology, and building useful tools, alongside articles from my earlier site.</p><div className="writing-grid">{articles.map(a=><a className="writing-card" href={`/writing/${a.slug}`} key={a.slug}><time dateTime={a.date}>{new Date(a.date+'T12:00:00Z').toLocaleDateString('en-US',{dateStyle:'long',timeZone:'UTC'})}</time><h2>{a.title}</h2>{!a.archived&&a.excerpt&&<p>{a.excerpt}</p>}<span>Read the article <ArrowUpRight size={18}/></span></a>)}</div></main><SiteFooter/></div>}
