import { notFound } from 'next/navigation';
import { LegacyRedirect } from '@/components/legacy-redirect';
import { articles } from '@/lib/portfolio';
export function generateStaticParams(){return articles.map(article=>({slug:article.slug}));}
export default async function LegacyArticle({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!articles.some(a=>a.slug===slug))notFound();return <LegacyRedirect href={`/writing/${slug}`}/>}
