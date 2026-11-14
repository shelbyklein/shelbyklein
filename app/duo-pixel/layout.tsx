import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { sitePath } from '@/lib/site-path';
import './duo-pixel.css';

export default function DuoPixelLayout({ children }: { children: ReactNode }) {
  return <div id="top">
    <SiteHeader />
    <main id="main" className="page-main duo-page">
      <nav className="duo-nav" aria-label="Duo Pixel">
        <a className="duo-nav-brand" href={sitePath('/duo-pixel')}><img src={sitePath('/images/duo-pixel/icon.webp')} alt="" width="40" height="40" />Duo Pixel</a>
        <div><a href={sitePath('/duo-pixel/support')}>Support</a><a href={sitePath('/duo-pixel/privacy')}>Privacy policy</a></div>
      </nav>
      {children}
    </main>
    <SiteFooter />
  </div>;
}
