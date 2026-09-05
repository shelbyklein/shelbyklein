import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { projects, getProject } from '@/lib/portfolio';
import { caseStudies } from '@/lib/case-studies';
import { projectLinkLabel } from '@/lib/project-links';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProjectArt } from '@/components/project-art';

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return {
    title: project ? `${project.originalTitle} — Shelby Klein` : 'Project not found — Shelby Klein',
    description: project?.summary,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const study = caseStudies[project.id];
  const images = project.images.filter(image => image.src !== project.cover);
  const related = study.related.map(getProject).filter(item => item !== undefined);

  return <div id="top">
    <SiteHeader />
    <main id="main" className={`case-main case-detail wrap case-${project.id}`}>
      <Link className="back-link" href="/#work"><ArrowLeft size={16} aria-hidden="true" /> All work</Link>

      <header className="case-heading">
        <span className="eyebrow">{project.label}</span>
        <h1>{project.originalTitle}</h1>
        <p>{project.summary}</p>
        {project.url && <a className="case-visit" href={project.url} target="_blank" rel="noreferrer">
          {projectLinkLabel(project)} <ArrowUpRight size={18} aria-hidden="true" />
        </a>}
      </header>

      <dl className="case-facts">
        <div><dt>Project</dt><dd>{project.client}</dd></div>
        <div><dt>My role</dt><dd>{study.role}</dd></div>
        <div><dt>Format</dt><dd>{study.format}{study.period && <span>{study.period}</span>}</dd></div>
      </dl>

      {project.cover && <figure className="case-hero">
        <div className={`case-cover ${project.id}-cover`}><ProjectArt project={project} detail /></div>
        <figcaption>
          <span>{study.coverCaption}</span>
          {project.id !== 'vispix' && <a href={project.cover} target="_blank" rel="noreferrer">View image <ArrowUpRight size={15} aria-hidden="true" /></a>}
        </figcaption>
      </figure>}

      <nav className="case-navigation" aria-label="On this project page">
        <a href="#overview">Overview</a>
        <a href="#contribution">My contribution</a>
        <a href="#approach">Inside the project</a>
        {images.length > 0 && <a href="#gallery">Images <span>{String(images.length).padStart(2, '0')}</span></a>}
        {project.videos.length > 0 && <a href="#video">Video <span>{String(project.videos.length).padStart(2, '0')}</span></a>}
      </nav>

      <section id="overview" className="case-overview" aria-labelledby="overview-title">
        <span className="eyebrow">THE PROJECT</span>
        <div><h2 id="overview-title">{study.headline}</h2><p>{study.intro}</p></div>
      </section>

      <section id="contribution" className="case-contribution" aria-labelledby="contribution-title">
        <div className="case-section-heading"><h2 id="contribution-title">My contribution</h2><span className="eyebrow">SCOPE OF WORK</span></div>
        <ol className="case-scope">
          {study.scope.map((item, index) => <li key={item.title}>
            <span className="case-item-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3><p>{item.body}</p>
          </li>)}
        </ol>
      </section>

      <section id="approach" className="case-approach" aria-label="Inside the project">
        {study.sections.map((section, index) => <div className="case-chapter" key={section.title}>
          <span className="eyebrow">{index === 0 ? 'DESIGN & INTENT' : 'BUILD & CONTEXT'}</span>
          <h2>{section.title}</h2><p>{section.body}</p>
        </div>)}
      </section>

      {images.length > 0 && <section id="gallery" className="case-media" aria-labelledby="gallery-title">
        <div className="case-section-heading"><h2 id="gallery-title">{study.galleryTitle ?? 'Project images'}</h2><span className="eyebrow">{String(images.length).padStart(2, '0')} IMAGES</span></div>
        {study.galleryIntro && <p className="case-section-intro">{study.galleryIntro}</p>}
        <div className={`case-gallery ${project.id}-gallery ${project.galleryLayout === 'website' ? 'website-gallery' : ''}`}>
          {images.map((image, index) => <figure key={image.src}>
            <a href={image.src} target="_blank" rel="noreferrer" aria-label={`Open full image: ${image.alt}`}>
              <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
            </a>
            <figcaption><span>{image.caption ?? (project.id === 'playcase' ? image.alt : project.galleryLayout === 'website' ? 'Original portfolio example' : project.originalTitle)}</span><span>{String(index + 1).padStart(2, '0')}</span></figcaption>
          </figure>)}
        </div>
      </section>}

      {project.videos.length > 0 && <section id="video" className="case-videos" aria-labelledby="video-title">
        <div className="case-section-heading"><h2 id="video-title">{study.videoTitle ?? 'See it in motion'}</h2><span className="eyebrow">VIDEO</span></div>
        {study.videoIntro && <p className="case-section-intro">{study.videoIntro}</p>}
        {project.videos.map((src, index) => <figure className="case-video" key={src}>
          <div className="video-frame"><iframe src={src} title={`${project.originalTitle} — video ${index + 1}`} loading="lazy" allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
          <figcaption>{project.originalTitle}{project.videos.length > 1 && ` · ${String(index + 1).padStart(2, '0')}`}</figcaption>
        </figure>)}
      </section>}

      {study.article && <aside className="case-reading">
        <div><span className="eyebrow">FROM THE NOTEBOOK</span><h2>Creative work, fewer tools</h2><p>How these projects connect to a broader interest in making useful tools.</p></div>
        <Link href="/writing/creative-work-fewer-tools">Read the article <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </aside>}

      <section className="case-related" aria-labelledby="related-title">
        <div className="case-section-heading"><h2 id="related-title">Keep exploring</h2><Link className="text-link" href="/#work">All work <ArrowRight size={17} aria-hidden="true" /></Link></div>
        <div className="case-related-grid">{related.map(item => <Link className="case-related-item" href={`/work/${item.id}`} key={item.id}>
          <span className="eyebrow">{item.tags.join(' · ')}</span>
          <div><h3>{item.title}</h3><ArrowUpRight size={25} aria-hidden="true" /></div>
          <p>{item.summary}</p>
        </Link>)}</div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
