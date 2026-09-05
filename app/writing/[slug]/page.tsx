import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles } from '@/lib/portfolio';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
export function generateStaticParams(){return articles.map(a=>({slug:a.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=articles.find(a=>a.slug===slug);return {title:article?`${article.title} — Shelby Klein`:'Article not found — Shelby Klein',description:article?.excerpt}}
export default async function Article({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=articles.find(a=>a.slug===slug);if(!article)notFound();return <div id="top"><SiteHeader/><main id="main" className="wrap article-main"><Link className="back-link" href="/writing">← All writing</Link><article><header><time className="eyebrow" dateTime={article.date}>{new Date(article.date+'T12:00:00Z').toLocaleDateString('en-US',{dateStyle:'long',timeZone:'UTC'})}</time><h1>{article.title}</h1>{article.archived&&<p className="archive-notice">From the archive. This article reflects the tools, experiences, and figures at the time it was written.</p>}</header><div className="article-body" dangerouslySetInnerHTML={{__html:article.html}}/></article></main><SiteFooter/></div>}
