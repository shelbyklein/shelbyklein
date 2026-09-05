import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProjectArt } from '@/components/project-art';
import { featuredProjects, archiveProjects, articles } from '@/lib/portfolio';

export default function Home() {
  return <div id="top">
    <SiteHeader/>
    <main id="main">
      <section className="hero wrap" aria-labelledby="intro-title">
        <div className="eyebrow"><span className="status-dot"/> SHELBY KLEIN · DESIGNER & CREATIVE TECHNOLOGIST</div>
        <div className="hero-composition"><h1 id="intro-title">A little art.<br/>A little code.<br/><span>A lot of curiosity.</span></h1><aside className="hero-aside"><span className="studio-note">One idea tends<br/>to lead to another.</span><div className="hero-objects"><Link href="/work/playcase" className="object-card"><img src="/images/playcase-card.png" alt="Explore PlayCase, my physical gaming product" width="600" height="600"/><span>MAKE IT TANGIBLE ↗</span></Link><Link href="/work/newton" className="object-mascot" aria-label="Explore Newton"><img src="/images/newton-logo.png" alt="Newton’s apple mascot" width="130" height="130"/></Link><span className="object-caption">AND SOMETIMES,<br/>GIVE IT A PERSONALITY.</span></div></aside></div>
        <div className="hero-bottom"><p>I’m Shelby. I design brands, build software, and occasionally turn a phone into a game console. I like an idea I can get my hands on.</p><a className="round-link" href="#work"><span>Explore my work</span><span className="circle"><ArrowDown size={23}/></span></a></div>
        <div className="hero-foot"><span>BASED IN ORLANDO, FL</span><span>DESIGN ↔ TECHNOLOGY ↔ PLAY</span></div>
      </section>
      <section id="work" className="work-section wrap" aria-labelledby="work-title">
        <div className="section-heading"><h2 id="work-title">Selected work<span>01 — 06</span></h2><span>IDEAS THAT MADE IT OFF THE SKETCHPAD</span></div>
        <div className="project-grid">{featuredProjects.map((project,i)=><article className={`project-card project-position-${i+1}`} key={project.id}>
          <Link className={`project-visual ${project.id}-visual`} href={`/work/${project.id}`} aria-label={`View ${project.originalTitle}`}><ProjectArt project={project}/><span className="image-badge">{project.label.split(' · ')[0]}</span><span className="project-arrow"><ArrowUpRight size={21}/></span></Link>
          <div className="project-info"><h3><Link href={`/work/${project.id}`}>{project.title}</Link></h3><span>{project.tags.slice(0,2).join(' · ')}</span></div><p>{project.summary}</p>
        </article>)}</div>
      </section>
      <section className="archive-section wrap" aria-labelledby="archive-title"><div className="section-heading"><h2 id="archive-title">The plot thickens<span>07 — 14</span></h2><span>A FEW MORE THINGS I’VE HAD A HAND IN</span></div>
        <div className="archive-list">{archiveProjects.map((project,i)=><Link href={`/work/${project.id}`} className="archive-row" key={project.id}><span className="archive-number">{String(i+7).padStart(2,'0')}</span><div className="archive-name"><h3>{project.originalTitle}</h3><p>{project.summary}</p></div><span className="archive-discipline">{project.tags.join(' / ')}</span><ArrowUpRight size={25}/></Link>)}</div>
      </section>
      <section id="about" className="about-section wrap" aria-labelledby="about-title"><div className="about-copy"><span className="eyebrow">A LITTLE ABOUT ME</span><h2 id="about-title">I tend to follow<br/>the “what if?”</h2><p>I’m a designer, developer, and dad in Orlando. I’m happiest when I can follow an idea from the first sketch into something that actually works.</p><p>Sometimes that means an Olympic jersey. Sometimes it’s a live broadcast, a game controller, or an app that helps you find your next rhyme. The medium changes; getting the details right is always part of it.</p><p>Lately, I’ve been following that curiosity into creative tools, AI teammates, and the space between pixels and physical things.</p><div className="about-links"><a href="/Shelby-Klein-Resume.pdf" target="_blank" rel="noreferrer">View my resumé <ArrowUpRight size={18}/></a><a href="https://www.linkedin.com/in/shelbyklein/" target="_blank" rel="noreferrer">More about my background <ArrowUpRight size={18}/></a></div></div><figure className="portrait"><div className="portrait-photo"><img src="/images/shelby.webp" alt="Shelby Klein" width="800" height="1122" loading="lazy"/></div><figcaption>Hi, I’m Shelby.<span>DESIGNER / DEVELOPER / DAD</span></figcaption></figure></section>
      <section className="practice-section wrap" aria-label="Areas of practice">{[
        ['01','Identity & communication','Brand systems, campaigns, editorial design, and apparel.'],
        ['02','Products & platforms','Websites, desktop applications, and physical products.'],
        ['03','Motion & experiences','Video, live broadcasts, and interactive installations.'],
        ['04','Tools & experiments','AI workspaces, creative software, and playful systems.'],
      ].map(([n,title,body])=><div key={n}><span className="eyebrow">{n}</span><h3>{title}</h3><p>{body}</p></div>)}</section>
      <section className="writing-section wrap" aria-labelledby="writing-title"><div className="section-heading"><h2 id="writing-title">Things I’ve figured out</h2><Link className="text-link" href="/writing">All writing <ArrowUpRight size={17}/></Link></div><div className="writing-grid">{articles.slice(0,2).map(article=><Link className="writing-card" href={`/writing/${article.slug}`} key={article.slug}><time dateTime={article.date}>{new Date(article.date+'T12:00:00Z').toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'})}</time><h3>{article.title}</h3><span>Read the article <ArrowUpRight size={17}/></span></Link>)}</div></section>
    </main><SiteFooter/>
  </div>;
}
