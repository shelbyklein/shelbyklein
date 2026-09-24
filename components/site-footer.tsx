import { sitePath } from '@/lib/site-path';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { SiteLogo } from '@/components/site-logo';
import { MotionToggle } from '@/components/print-studio';
export function SiteFooter() {
  return <footer id="contact" className="print-footer"><div className="wrap">
    <div className="footer-opening"><span className="print-caption">THE NEXT CHAPTER</span><span>YOUR IDEA + MY CURIOSITY</span></div>
    <a className="print-invitation" href="mailto:shelbykleindesign@gmail.com">Let’s make<br/><em>something matter.</em><ArrowUpRight aria-hidden="true"/></a>
    <div className="contact-options"><a href="mailto:shelbykleindesign@gmail.com">shelbykleindesign@gmail.com <ArrowUpRight size={17}/></a><a href="https://fantastical.app/shelbyklein/skd-meeting" target="_blank" rel="noreferrer">Schedule a conversation <ArrowUpRight size={17}/></a></div>
    <div className="print-footer-bottom"><a className="footer-brand" href={sitePath('/')} aria-label="Shelby Klein home"><SiteLogo/><span>© {new Date().getFullYear()} SHELBY KLEIN<br/>INDEPENDENT BY DESIGN.</span></a><nav aria-label="Footer navigation"><a href={sitePath('/writing')}>Writing</a><a href={sitePath('/Shelby-Klein-Resume.pdf')} target="_blank" rel="noreferrer">Resumé ↗</a><a href="https://www.linkedin.com/in/shelbyklein/" target="_blank" rel="noreferrer">LinkedIn ↗</a></nav><MotionToggle/><a className="back-top" href="#top" aria-label="Back to top"><ArrowUp size={21}/></a></div>
  </div></footer>;
}
