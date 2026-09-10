import { Fragment } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { sitePath } from '@/lib/site-path';
import { notFound } from 'next/navigation';
import { articles } from '@/lib/portfolio';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

type ProjectVisual = {
  href: string;
  src: string;
  alt: string;
  title: string;
  label: string;
  style?: 'logo';
};

const creativeWorkVisuals: Record<number, ProjectVisual[]> = {
  4: [{
    href: '/work/newton',
    src: '/images/newton.webp',
    alt: 'Newton desktop workspace showing projects, conversations, and assistant activity.',
    title: 'Newton',
    label: 'Desktop workspace for AI teammates',
  }],
  6: [
    {
      href: '/work/current',
      src: '/images/current.webp',
      alt: 'Current live rhyme studio with spoken-word tools and rhyme suggestions.',
      title: 'Current',
      label: 'Live rhyme studio',
    },
    {
      href: '/work/vispix',
      src: '/images/vispix-logo.png',
      alt: 'Vispix mark: a blue square containing a white search lens.',
      title: 'Vispix',
      label: 'Photo-library workspace',
      style: 'logo',
    },
  ],
  8: [{
    href: '/work/usa-archery-broadcast',
    src: '/images/usaa-livestream-screenshot.webp',
    alt: 'USA Archery live broadcast graphic showing an archer and event scoring.',
    title: 'USA Archery',
    label: 'Live broadcast systems',
  }],
  9: [{
    href: '/work/playcase',
    src: '/images/playcase/handheld-blue.webp',
    alt: 'Blue PlayCase iPhone gaming case with physical controls.',
    title: 'PlayCase',
    label: 'Physical controls for classic games',
  }],
};

function ProjectVisuals({ items }: { items: ProjectVisual[] }) {
  return <div className="article-project-visuals" data-count={items.length}>
    {items.map((item) => <a className={`article-project-visual${item.style === 'logo' ? ' article-project-visual--logo' : ''}`} href={sitePath(item.href)} key={item.href}>
      <span className="article-project-visual-frame"><img src={sitePath(item.src)} alt={item.alt} /></span>
      <span className="article-project-visual-caption"><strong>{item.title}</strong><span>{item.label}</span></span>
    </a>)}
  </div>;
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return {
    title: article ? `${article.title} — Shelby Klein` : 'Article not found — Shelby Klein',
    description: article?.excerpt,
  };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const paragraphs = article.html.split('\n\n');
  const visuals: Record<number, ProjectVisual[]> = slug === 'creative-work-fewer-tools' ? creativeWorkVisuals : {};
  const nextArticle = articles.find((item) => item.slug !== article.slug);

  return <div id="top">
    <SiteHeader />
    <main id="main" className="wrap article-main">
      <a className="back-link" href={sitePath('/writing')}>← All writing</a>
      <article>
        <header>
          <time className="eyebrow" dateTime={article.date}>{new Date(`${article.date}T12:00:00Z`).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' })}</time>
          <h1>{article.title}</h1>
          {article.archived && <p className="archive-notice">From the archive. This article reflects the tools, experiences, and figures at the time it was written.</p>}
        </header>
        <div className="article-body">
          {paragraphs.map((paragraph, index) => <Fragment key={paragraph}>
            <div dangerouslySetInnerHTML={{ __html: paragraph }} />
            {visuals[index] && <ProjectVisuals items={visuals[index]} />}
          </Fragment>)}
        </div>
      </article>
      <section className="article-next-steps" aria-label="Keep exploring">
        <span className="eyebrow">KEEP EXPLORING</span>
        <div>
          <a href={sitePath('/#work')}><span>View work</span><ArrowUpRight aria-hidden="true" /></a>
          <a href="mailto:shelbykleindesign@gmail.com"><span>Start a conversation</span><ArrowUpRight aria-hidden="true" /></a>
          {nextArticle && <a href={sitePath(`/writing/${nextArticle.slug}`)}><span>Read: {nextArticle.title}</span><ArrowUpRight aria-hidden="true" /></a>}
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
