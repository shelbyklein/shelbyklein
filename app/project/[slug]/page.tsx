import { notFound } from 'next/navigation';
import { LegacyRedirect } from '@/components/legacy-redirect';
import { projects } from '@/lib/portfolio';
export function generateStaticParams(){return [...projects.filter(project=>project.legacySlug).map(project=>({slug:project.legacySlug!})),{slug:'sfs-recruitment-brochure'}];}
export default async function LegacyProject({params}:{params:Promise<{slug:string}>}){let {slug}=await params;if(slug==='sfs-recruitment-brochure')slug='school-for-field-studies';const p=projects.find(p=>p.legacySlug===slug);if(!p)notFound();return <LegacyRedirect href={`/work/${p.id}`}/>}
