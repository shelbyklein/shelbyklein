import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { articles } from '@/lib/portfolio';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
export const metadata={title:'Writing — Shelby Klein',description:'Notes on websites, analytics, and building creative projects.'};
export default function Writing(){return <div id="top"><SiteHeader/><main id="main" className="wrap writing-index"><span className="eyebrow">THE WRITING ARCHIVE</span><h1>Notes from<br/><span>the process.</span></h1><p>Articles on web development, analytics, and creative projects, preserved from my earlier site.</p><div className="writing-grid">{articles.map(a=><Link className="writing-card" href={`/writing/${a.slug}`} key={a.slug}><time dateTime={a.date}>{a.date}</time><h2>{a.title}</h2><span>Read the article <ArrowUpRight size={18}/></span></Link>)}</div></main><SiteFooter/></div>}
