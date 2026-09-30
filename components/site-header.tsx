import { sitePath } from '@/lib/site-path';
import { ArrowUpRight } from 'lucide-react';
import { SiteLogo } from '@/components/site-logo';
import { MotionToggle } from '@/components/print-studio';
export function SiteHeader() {
  return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header wrap">
    <a className="site-brand" href={sitePath('/')} aria-label="Shelby Klein home"><SiteLogo/><span className="brand-name">Shelby Klein<span>DESIGN & CREATIVE TECHNOLOGY</span></span></a>
    <nav aria-label="Main navigation"><a href={sitePath('/#work')}>Work</a><a href={sitePath('/apps')}>Apps</a><a href={sitePath('/#about')}>About</a><a href={sitePath('/writing')}>Writing</a><a className="contact-link" href="mailto:shelbykleindesign@gmail.com">Let’s talk <ArrowUpRight size={16}/></a></nav><MotionToggle/>
  </header></>;
}
