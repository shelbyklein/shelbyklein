import { EditorialArticle } from '@/components/editorial/editorial-article';
import { ArrowUpRight } from 'lucide-react';
import { sitePath } from '@/lib/site-path';
import { notFound } from 'next/navigation';
import { articles } from '@/lib/portfolio';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return {
    title: article
      ? `${article.title} — Shelby Klein`
      : 'Article not found — Shelby Klein',
    description: article?.excerpt,
  };
}

export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const nextArticle = articles.find((item) => item.slug !== article.slug);

  return (
    <div id="top">
      <SiteHeader />
      <main id="main" className="wrap article-main editorial-main">
        <a className="back-link" href={sitePath('/writing')}>
          ← All writing
        </a>
        {article.archived ? (
          <article className="archive-record">
            <span className="eyebrow">ARCHIVE RECORD · {article.date}</span>
            <h1>{article.title}</h1>
            <p>
              The original article text isn’t available in this archive. This
              record preserves its title and publication date.
            </p>
            <a href={sitePath('/writing')}>Explore current essays →</a>
          </article>
        ) : (
          <EditorialArticle
            slug={slug}
            title={article.title}
            date={article.date}
          />
        )}
        <section className="article-next-steps" aria-label="Keep exploring">
          <span className="eyebrow">KEEP EXPLORING</span>
          <div>
            <a href={sitePath('/#work')}>
              <span>View work</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a href="mailto:shelbykleindesign@gmail.com">
              <span>Start a conversation</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            {nextArticle && (
              <a href={sitePath(`/writing/${nextArticle.slug}`)}>
                <span>Read: {nextArticle.title}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
