import { ArrowUpRight } from 'lucide-react';
import { SiteLogo } from '@/components/site-logo';
export function SiteHeader(){return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header wrap"><a className="site-brand" href="/" aria-label="Shelby Klein home"><SiteLogo/><span className="brand-name">Shelby Klein</span></a><nav aria-label="Main navigation"><a href="/#work">Work</a><a href="/#about">About</a><a className="contact-link" href="mailto:sklein91@gmail.com">Let’s talk <ArrowUpRight size={17}/></a></nav></header></>}
