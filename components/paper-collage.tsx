'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sitePath } from '@/lib/site-path';

type Piece = { asset: string; x: string; y: string; size: string; angle: number; travel: number; opacity?: number };
const scenes: Record<string, Piece[]> = {
  hero: [
    { asset: 'blue-torn-circle', x: '77%', y: '3%', size: 'clamp(150px,19vw,270px)', angle: -18, travel: 28 },
    { asset: 'halftone-organic', x: '63%', y: '7%', size: '180px', angle: 12, travel: -14, opacity: .35 },
    { asset: 'gold-dot', x: '94%', y: '65%', size: '36px', angle: 0, travel: 43 },
  ],
  atelier: [
    { asset: 'red-torn-circle', x: '-7%', y: '8%', size: 'clamp(170px,22vw,300px)', angle: 24, travel: 30 },
    { asset: 'halftone-round', x: '83%', y: '65%', size: '210px', angle: -12, travel: -15, opacity: .25 },
    { asset: 'charcoal-stroke', x: '42%', y: '5%', size: '170px', angle: -32, travel: 22, opacity: .75 },
  ],
  work: [
    { asset: 'halftone-triangle', x: '77%', y: '0%', size: '220px', angle: 15, travel: -18, opacity: .24 },
    { asset: 'red-dot', x: '48%', y: '2%', size: '32px', angle: 0, travel: 42 },
    { asset: 'gold-dot', x: '94%', y: '44%', size: '27px', angle: 0, travel: -36 },
  ],
  archive: [
    { asset: 'halftone-oval', x: '83%', y: '52%', size: '210px', angle: -20, travel: 17, opacity: .18 },
    { asset: 'charcoal-stroke', x: '69%', y: '0%', size: '160px', angle: 22, travel: -22, opacity: .55 },
  ],
  lab: [
    { asset: 'blue-torn-circle', x: '94%', y: '34%', size: 'clamp(170px,23vw,330px)', angle: 40, travel: 30 },
    { asset: 'halftone-arch', x: '-7%', y: '67%', size: '230px', angle: 20, travel: -16, opacity: .22 },
    { asset: 'gold-dot', x: '48%', y: '4%', size: '34px', angle: 0, travel: 44 },
  ],
  about: [
    { asset: 'red-torn-circle', x: '85%', y: '58%', size: 'clamp(140px,19vw,260px)', angle: -25, travel: -30 },
    { asset: 'gold-dot', x: '54%', y: '87%', size: '34px', angle: 0, travel: 42 },
    { asset: 'charcoal-stroke', x: '79%', y: '2%', size: '155px', angle: -35, travel: 22, opacity: .6 },
  ],
  writing: [
    { asset: 'halftone-organic', x: '-5%', y: '64%', size: '230px', angle: 25, travel: -15, opacity: .3 },
    { asset: 'red-dot', x: '94%', y: '3%', size: '35px', angle: 0, travel: 40 },
  ],
};

export function PaperCollage({ scene }: { scene: keyof typeof scenes }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const touch = matchMedia('(pointer: coarse)');
    let context: gsap.Context | undefined;
    function sync() {
      context?.revert(); context = undefined;
      if (reduced.matches || document.hidden || document.documentElement.dataset.motion !== 'on') return;
      context = gsap.context(() => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: root!.parentElement, start: 'top bottom', end: 'bottom top', scrub: .65, invalidateOnRefresh: true } });
        root!.querySelectorAll<HTMLElement>('.paper-piece').forEach(piece => {
          const travel = Number(piece.dataset.travel) * (touch.matches ? .35 : 1);
          timeline.fromTo(piece, { y: -travel }, { y: travel, duration: 1, ease: 'none' }, 0);
        });
      }, root!);
    }
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    reduced.addEventListener('change', sync); touch.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      context?.revert(); observer.disconnect();
      reduced.removeEventListener('change', sync); touch.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [scene]);
  return <span ref={ref} className={`paper-collage paper-collage--${scene}`} aria-hidden="true">
    {scenes[scene].map((piece, index) => <span className="paper-piece" data-travel={piece.travel} key={`${piece.asset}-${index}`} style={{ left: piece.x, top: piece.y, width: piece.size, opacity: piece.opacity ?? 1 } as CSSProperties}>
      <img src={sitePath(`/images/collage-elements/${piece.asset}.webp`)} alt="" loading={scene === 'hero' ? 'eager' : 'lazy'} decoding="async" style={{ transform: `rotate(${piece.angle}deg)` }}/>
    </span>)}
  </span>;
}
