import { sitePath } from '@/lib/site-path';

// Original Shelby Klein Design artwork in the shared orange squircle.
export function SiteLogo() {
  return <img className="brand-mark" src={sitePath('/favicon.svg')} alt="" width="40" height="40" aria-hidden="true" />;
}
