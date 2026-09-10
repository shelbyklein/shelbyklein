import { sitePath } from '@/lib/site-path';
import { ArrowUpRight } from 'lucide-react';
import { SiteLogo } from '@/components/site-logo';
import { PlanetScene } from '@/components/planet-scene';

export function SiteFooter() {
  return <footer id="contact" className="footer--space">
    <PlanetScene/>
    <div className="wrap footer footer-content">
      <span className="eyebrow">HAVE A PROJECT IN MIND?</span>
      <a className="footer-invitation" href="mailto:shelbykleindesign@gmail.com">
        Let’s work<br/><span>together.</span><ArrowUpRight/>
      </a>
      <div className="contact-options">
        <a href="mailto:shelbykleindesign@gmail.com">shelbykleindesign@gmail.com <ArrowUpRight size={16}/></a>
        <a href="https://fantastical.app/shelbyklein/skd-meeting" target="_blank" rel="noreferrer">Schedule a conversation <ArrowUpRight size={16}/></a>
      </div>
      <div className="footer-bottom">
        <a className="footer-brand" href={sitePath('/')} aria-label="Shelby Klein home">
          <SiteLogo/><span>© {new Date().getFullYear()}<br/>SHELBY KLEIN</span>
        </a>
        <nav aria-label="Footer navigation">
          <a href={sitePath('/writing')}>Writing</a>
          <a href={sitePath('/Shelby-Klein-Resume.pdf')} target="_blank" rel="noreferrer">Resumé ↗</a>
          <a href="https://www.linkedin.com/in/shelbyklein/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href="#top">Back to top ↑</a>
        </nav>
      </div>
    </div>
  </footer>;
}
