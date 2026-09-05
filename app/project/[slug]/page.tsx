import { redirect, notFound } from 'next/navigation';
import { projects } from '@/lib/portfolio';
export default async function LegacyProject({params}:{params:Promise<{slug:string}>}){let {slug}=await params;if(slug==='sfs-recruitment-brochure')slug='school-for-field-studies';const p=projects.find(p=>p.legacySlug===slug);if(!p)notFound();redirect(`/work/${p.id}`)}
