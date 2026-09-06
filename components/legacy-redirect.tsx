import { redirect } from 'next/navigation';
import { staticExport, sitePath } from '@/lib/site-path';

export function LegacyRedirect({ href }: { href: string }) {
  if (!staticExport) redirect(href);
  const destination = sitePath(href);
  return <main className="wrap article-main">
    <meta httpEquiv="refresh" content={`0;url=${destination}`} />
    <p>This page has moved. <a href={destination}>Continue to the portfolio.</a></p>
  </main>;
}
