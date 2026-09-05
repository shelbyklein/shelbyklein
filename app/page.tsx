import { sitePath } from '@/lib/site-path';
import playcaseVisuals from '@/content/playcase-visuals.json';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { HeroPlanet } from '@/components/hero-planet';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProjectArt } from '@/components/project-art';
import { ProjectPanelProvider, ProjectLink } from '@/components/project-panel';
import { projects, featuredProjects, archiveProjects, articles } from '@/lib/portfolio';

export default function Home() {
  return <ProjectPanelProvider projects={projects}><div id="top">
    <SiteHeader/>
    <main id="main">
      <section className="hero hero--space" aria-labelledby="intro-title">
        <HeroPlanet/>
        <div className="wrap hero-content">
        <div className="eyebrow"><span className="status-dot"/> SHELBY KLEIN · DESIGNER & CREATIVE TECHNOLOGIST</div>
        <div className="hero-composition"><h1 id="intro-title" className="hero-title"><span className="hero-line hero-line--design">Design &</span>{' '}<span className="hero-line hero-line--creative">creative</span>{' '}<span className="hero-line hero-line--technology">technology.</span><span className="hero-shapes" aria-hidden="true"><i className="hero-shape hero-shape--disc"/><i className="hero-shape hero-shape--ring"/><i className="hero-shape hero-shape--bar"/></span></h1><aside className="hero-aside"><span className="studio-note">Independent products<br/>& applications</span><div className="hero-objects"><ProjectLink projectId="playcase" className="object-card"><img src={sitePath(playcaseVisuals.hero.src)} alt={playcaseVisuals.hero.alt} width={playcaseVisuals.hero.width} height={playcaseVisuals.hero.height}/><span>PLAYCASE · PRODUCT DESIGN ↗</span></ProjectLink><ProjectLink projectId="newton" className="object-mascot" aria-label="Explore Newton"><img src={sitePath('/images/newton-logo.png')} alt="Newton’s apple mascot" width="130" height="130"/></ProjectLink><span className="object-caption">NEWTON<br/>AI TEAM WORKSPACE</span></div></aside></div>
        <div className="hero-bottom"><p>I’m Shelby Klein, a designer and developer based in Atlanta, Georgia. My work spans brand identities, digital tools, physical products, and live experiences.</p><a className="round-link" href="#work"><span>Explore my work</span><span className="circle"><ArrowDown size={23}/></span></a></div>
        <div className="hero-foot"><span>BASED IN ATLANTA, GA</span><span>BRAND · DIGITAL · PRODUCT · MOTION</span></div>
        </div>
      </section>
      <section id="work" className="work-section wrap" aria-labelledby="work-title">
        <div className="section-heading"><h2 id="work-title">Selected work<span>01 — {String(featuredProjects.length).padStart(2,'0')}</span></h2><span>DESIGN, DEVELOPMENT & CREATIVE DIRECTION</span></div>
        <div className="project-grid">{featuredProjects.map((project,i)=><article className={`project-card project-position-${i+1}`} key={project.id}>
          <ProjectLink className={`project-visual ${project.id}-visual`} projectId={project.id} aria-label={`View ${project.originalTitle}`}><ProjectArt project={project}/><span className="image-badge">{project.label.split(' · ')[0]}</span><span className="project-arrow"><ArrowUpRight size={21}/></span></ProjectLink>
          <div className="project-info"><h3><ProjectLink projectId={project.id}>{project.title}</ProjectLink></h3><span>{project.tags.slice(0,2).join(' · ')}</span></div><p>{project.summary}</p>
        </article>)}</div>
      </section>
      <section className="archive-section wrap" aria-labelledby="archive-title"><div className="section-heading"><h2 id="archive-title">More projects<span>{String(featuredProjects.length+1).padStart(2,'0')} — {String(projects.length).padStart(2,'0')}</span></h2><span>CLIENT WORK & INDEPENDENT PROJECTS</span></div>
        <div className="archive-list">{archiveProjects.map((project,i)=><ProjectLink projectId={project.id} className="archive-row" key={project.id}><span className="archive-number">{String(i+featuredProjects.length+1).padStart(2,'0')}</span><div className="archive-name"><h3>{project.originalTitle}</h3><p>{project.summary}</p></div><span className="archive-discipline">{project.tags.join(' / ')}</span><ArrowUpRight size={25}/></ProjectLink>)}</div>
      </section>
      <section id="about" className="about-section wrap" aria-labelledby="about-title"><div className="about-copy"><span className="eyebrow">ABOUT ME</span><h2 id="about-title">From concept<br/>to completion.</h2><p>I’m a designer, developer, and father based in Atlanta, Georgia. I work across visual design and technology, taking projects from initial concepts through production.</p><p>My experience includes national campaigns, Olympic competition apparel, live broadcast systems, and independent hardware and software products.</p><p>I’m particularly interested in creative tools, human–AI interaction, and projects that connect physical and digital experiences.</p><div className="about-links"><a href={sitePath('/Shelby-Klein-Resume.pdf')} target="_blank" rel="noreferrer">View my resumé <ArrowUpRight size={18}/></a><a href="https://www.linkedin.com/in/shelbyklein/" target="_blank" rel="noreferrer">More about my background <ArrowUpRight size={18}/></a></div></div><figure className="portrait"><div className="portrait-photo"><img src={sitePath('/images/shelby.webp')} alt="Shelby Klein" width="800" height="1122" loading="lazy"/></div><figcaption>Hi, I’m Shelby.<span>DESIGNER / DEVELOPER / DAD</span></figcaption></figure></section>
      <section className="practice-section wrap" aria-label="Areas of practice">{[
        ['01','Identity & communication','Brand systems, campaigns, editorial design, and apparel.'],
        ['02','Products & platforms','Websites, desktop applications, and physical products.'],
        ['03','Motion & experiences','Video, live broadcasts, and interactive installations.'],
        ['04','Tools & experiments','AI workspaces, creative software, and interactive systems.'],
      ].map(([n,title,body])=><div key={n}><span className="eyebrow">{n}</span><h3>{title}</h3><p>{body}</p></div>)}</section>
      <section className="writing-section wrap" aria-labelledby="writing-title"><div className="section-heading"><h2 id="writing-title">Writing & insights</h2><a className="text-link" href={sitePath('/writing')}>All writing <ArrowUpRight size={17}/></a></div><div className="writing-grid">{articles.slice(0,2).map(article=><a className="writing-card" href={sitePath(`/writing/${article.slug}`)} key={article.slug}><time dateTime={article.date}>{new Date(article.date+'T12:00:00Z').toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'})}</time><h3>{article.title}</h3><span>Read the article <ArrowUpRight size={17}/></span></a>)}</div></section>
    </main><SiteFooter/>
  </div></ProjectPanelProvider>;
}
