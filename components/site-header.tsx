import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SiteLogo } from '@/components/site-logo';
export function SiteHeader(){return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header wrap"><Link className="site-brand" href="/" aria-label="Shelby Klein home"><SiteLogo/><span className="brand-name">Shelby Klein</span></Link><nav aria-label="Main navigation"><Link href="/#work">Work</Link><Link href="/#about">About</Link><a className="contact-link" href="mailto:sklein91@gmail.com">Let’s talk <ArrowUpRight size={17}/></a></nav></header></>}
