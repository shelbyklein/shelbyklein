import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projects, getProject } from '@/lib/portfolio';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProjectArt } from '@/components/project-art';
export function generateStaticParams(){return projects.map(p=>({slug:p.id}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const p=getProject((await params).slug);return {title:p?`${p.originalTitle} — Shelby Klein`:'Project not found — Shelby Klein',description:p?.summary}}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
 const project=getProject((await params).slug);if(!project)notFound();
 const next=projects[(projects.findIndex(p=>p.id===project.id)+1)%projects.length];
 return <div id="top"><SiteHeader/><main id="main" className="case-main wrap"><Link className="back-link" href="/#work"><ArrowLeft size={16}/> All work</Link><header className="case-heading"><span className="eyebrow">{project.label}</span><h1>{project.originalTitle}</h1><p>{project.summary}</p></header>{project.cover&&<div className={`case-cover ${project.id}-cover`}><ProjectArt project={project} detail/></div>}<section className="case-story" aria-label="Project details"><aside><div><span className="eyebrow">PROJECT</span><p>{project.client}</p></div><div><span className="eyebrow">DISCIPLINES</span><ul>{project.tags.map(t=><li key={t}>{t}</li>)}</ul></div>{project.url&&<a className="text-link" href={project.url} target="_blank" rel="noreferrer">Visit the website <ArrowUpRight size={17}/></a>}</aside><div className="case-narrative"><h2>{project.id==='arcadia'?'An ongoing exploration':'About the work'}</h2>{project.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</div></section>
 <div className={`case-gallery ${project.id}-gallery`}>{project.images.filter(img=>img.src!==project.cover).map((img,i)=><figure key={img.src}><a href={img.src} target="_blank" rel="noreferrer" aria-label={`Open full image: ${img.alt}`}><img src={img.src} alt={img.alt} loading="lazy"/></a><figcaption>{project.id==='playcase'?img.alt:project.originalTitle} <span>{String(i+1).padStart(2,'0')}</span></figcaption></figure>)}</div>
 {project.videos.length>0&&<section className="case-videos" aria-label="Project videos"><h2>See it in motion</h2>{project.videos.map((src,i)=><div className="video-frame" key={src}><iframe src={src} title={`${project.originalTitle} — video ${i+1}`} loading="lazy" allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div>)}</section>}
 <Link className="next-project" href={`/work/${next.id}`}><span className="eyebrow">NEXT PROJECT</span><span>{next.originalTitle}<ArrowUpRight/></span></Link></main><SiteFooter/></div>
}
