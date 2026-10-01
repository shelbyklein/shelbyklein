import { sitePath } from '@/lib/site-path';
import { ArrowUpRight } from 'lucide-react';
import { SiteLogo } from '@/components/site-logo';
export function SiteFooter() {
  return <footer id="contact" className="shop-footer"><div className="shop-footer-inner">
    <span className="peg-label">HAVE A PROJECT, OR A ROLE TO FILL?</span>
    <a className="shop-invitation" href="mailto:shelbykleindesign@gmail.com">Let’s build<br/>something.<ArrowUpRight aria-hidden="true"/></a>
    <div className="shop-contact"><a href="mailto:shelbykleindesign@gmail.com">shelbykleindesign@gmail.com <ArrowUpRight size={16}/></a><a href="https://fantastical.app/shelbyklein/skd-meeting" target="_blank" rel="noreferrer">Schedule a conversation <ArrowUpRight size={16}/></a></div>
    <div className="shop-footer-bottom"><a className="site-brand" href={sitePath('/')} aria-label="Shelby Klein home"><SiteLogo/><span>© {new Date().getFullYear()} Shelby Klein · Atlanta</span></a>
      <nav aria-label="Footer navigation"><a href={sitePath('/writing')}>Writing</a><a href={sitePath('/apps')}>Apps</a><a href={sitePath('/clients')}>Clients</a><a href={sitePath('/Shelby-Klein-Resume.pdf')} target="_blank" rel="noreferrer">Resumé ↗</a><a href="https://www.linkedin.com/in/shelbyklein/" target="_blank" rel="noreferrer">LinkedIn ↗</a></nav></div>
  </div></footer>;
}
