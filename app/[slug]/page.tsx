import { redirect, notFound } from 'next/navigation';
import { articles } from '@/lib/portfolio';
export default async function LegacyArticle({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!articles.some(a=>a.slug===slug))notFound();redirect(`/writing/${slug}`)}
