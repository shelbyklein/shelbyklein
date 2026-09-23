import { sitePath } from '@/lib/site-path';
export function TrackerTrapperArt() {
  return <div className="tt-art" style={{backgroundImage:`url(${sitePath('/images/tracker-trapper/cobalt-background.webp')})`}}>
    <div className="tt-copy">
      <img src={sitePath('/images/apps/tracker-trapper-icon.webp')} alt="Tracker Trapper app icon" width="192" height="192" loading="lazy"/>
      <span className="tt-name">Tracker Trapper</span>
      <span className="tt-purpose">Keep the vibe. Track the work.</span>
    </div>
    <div className="tt-phones" aria-hidden="true">
      <img src={sitePath('/images/tracker-trapper/ios-plans-light.webp')} alt="" width="603" height="1311" loading="lazy"/>
      <img src={sitePath('/images/tracker-trapper/ios-needs-you-light.webp')} alt="" width="603" height="1311" loading="lazy"/>
    </div>
  </div>;
}
