import { sitePath } from '@/lib/site-path';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PegBand, Hang, PageHead } from '@/components/peg-band';
export default function NotFound() {
  return <div id="top"><SiteHeader/>
    <main id="main" className="page-main">
      <div className="page-intro">
        <PageHead label="404" title={<>Nothing on<br/>this hook.</>}><p>The page you’re looking for isn’t here. It may have moved, or the link might be off by a character.</p><div className="peg-actions"><a className="peg-btn" href={sitePath('/')}>Back to the wall</a><a className="peg-btn ghost" href={sitePath('/writing')}>Read the writing</a></div></PageHead>
        <PegBand className="empty-board" label="An empty pegboard hook"><Hang pivot={2} k={20} tag="Page not found"><span className="empty-hook-space" aria-hidden="true"/></Hang></PegBand>
      </div>
    </main><SiteFooter/></div>;
}
