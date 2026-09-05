import { sitePath } from '@/lib/site-path';
export function SiteLogo() {
  return <span className="brand-mark" aria-hidden="true">
    <img src={sitePath('/images/shelby-klein-design-white-logo.svg')} alt="" width="618.2" height="407.04"/>
  </span>;
}
