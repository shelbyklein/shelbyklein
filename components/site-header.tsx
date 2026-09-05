import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export function SiteHeader(){return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header wrap"><Link className="wordmark" href="/" aria-label="Shelby Klein home">shelby klein<span aria-hidden="true">✳</span></Link><nav aria-label="Main navigation"><Link href="/#work">Work</Link><Link href="/#about">About</Link><a className="contact-link" href="mailto:sklein91@gmail.com">Let’s talk <ArrowUpRight size={17}/></a></nav></header></>}
