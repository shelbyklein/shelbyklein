'use client';
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, Pause, Play, RotateCcw, Eye, Brain, Bot, Code2, Cpu } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HalftoneField } from '@/components/halftone-field';
import { sitePath } from '@/lib/site-path';
const PrintContext = createContext({ paused: false, reduced: false, toggleMotion: () => {} });
export function PrintStudio({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.edition = 'collage';
    try { setPaused(localStorage.getItem('skd-motion-paused') === 'true'); } catch {}
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync(); mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  useEffect(() => { document.documentElement.dataset.motion = paused || reduced ? 'paused' : 'on'; }, [paused, reduced]);
  function toggleMotion() { setPaused(value => { try { localStorage.setItem('skd-motion-paused', String(!value)); } catch {} return !value; }); }
  return <PrintContext.Provider value={{ paused: paused || reduced, reduced, toggleMotion }}>{children}</PrintContext.Provider>;
}
export function MotionToggle() {
  const { paused, reduced, toggleMotion } = useContext(PrintContext);
  return <button className="motion-toggle" disabled={reduced} onClick={toggleMotion} aria-pressed={paused} aria-label={reduced ? 'Reduced motion follows system preference' : paused ? 'Enable decorative motion' : 'Pause decorative motion'}>{paused ? <Play size={14}/> : <Pause size={14}/>}<span>{reduced ? 'Reduced motion' : `Motion ${paused ? 'off' : 'on'}`}</span></button>;
}
export function FlowMark() { return <img src={sitePath('/images/flow/collage.jpg')} alt="" width="1254" height="1254"/>; }

export function MaskedCollage({ src, alt, variant = 'organic', className = '' }: { src: string; alt: string; variant?: 'organic' | 'torn' | 'poster'; className?: string }) {
  const id = useId().replace(/:/g, '');
  const path = variant === 'poster' ? 'M0 0H600V530H0Z' : variant === 'organic'
    ? 'M80 65 C180 2 390 25 478 67 C556 110 544 203 576 260 C624 352 551 458 463 482 C373 510 316 472 233 505 C117 544 25 473 36 370 C46 287 3 237 25 163 C38 113 42 88 80 65Z'
    : 'M15 35 L80 26 L126 38 L190 19 L254 35 L315 22 L373 33 L450 13 L509 30 L588 20 L579 93 L592 149 L580 215 L591 269 L578 328 L588 389 L576 445 L584 498 L519 488 L465 508 L401 489 L340 503 L278 488 L210 506 L148 491 L84 510 L17 488 L26 420 L12 363 L24 301 L11 245 L24 186 L12 119Z';
  return <svg className={`masked-collage ${className}`} viewBox="0 0 600 530" role="img" aria-label={alt}>
    <defs><mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="530"><path d={path} fill="white"/></mask></defs>
    <image href={sitePath(src)} x="0" y="0" width="600" height="530" preserveAspectRatio={variant === 'poster' ? 'xMidYMid meet' : 'xMidYMid slice'} mask={`url(#${id})`}/>
  </svg>;
}

export function CollageMotion() {
  const { paused } = useContext(PrintContext);
  useEffect(() => {
    if (paused) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
        gsap.from(element, { y: 45, rotation: element.matches('.project-card') ? -1.2 : 0, opacity: .25, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
      });
      gsap.to('.atelier-image', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.atelier-band', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
    return () => mm.revert();
  }, [paused]);
  return null;
}

export function PrintHero() {
  const { paused } = useContext(PrintContext);
  const root = useRef<HTMLElement>(null);
  const [replay, setReplay] = useState(0);
  const maskId = useId().replace(/:/g, '');
  useEffect(() => {
    if (!root.current || paused) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.collage-title-line', { y: 65, rotation: 3, opacity: 0, duration: 1, stagger: .12 })
        .from('.logo-mask-strip', { attr: { x: -1400 }, stagger: .12, duration: 1.1, ease: 'power2.inOut' }, .4)
        .from('.cut-note', { y: 30, rotation: 8, opacity: 0, duration: .8 }, .8);

    }, root);
    return () => mm.revert();
  }, [paused, replay]);
  return <section ref={root} className="collage-hero" aria-labelledby="intro-title">
    <div className="collage-register wrap"><span>INDEPENDENT DESIGNER & CREATIVE TECHNOLOGIST</span><span>ATLANTA, GEORGIA / OPEN TO THE UNEXPECTED</span></div>
    <div className="collage-hero-grid wrap"><HalftoneField variant="hero"/>
      <div className="collage-copy"><span className="cut-label">SHELBY KLEIN / DESIGN & DEVELOPMENT</span>
        <h1 id="intro-title"><span className="collage-title-line">Good things.</span><span className="collage-title-line curiosity">Made together.</span></h1>
        <p>The best ideas grow when we build on each other’s. I’m Shelby—a designer and developer bringing curious people, thoughtful design, and useful technology together.</p>
        <div className="collage-actions"><a href="#work" className="print-button">See what I make <ArrowDown size={19}/></a><a href="#about" className="collage-about-link">Meet the maker <ArrowUpRight size={18}/></a></div>
        <div className="cut-note"><span>↳</span> Many perspectives.<br/>One shared possibility.<br/><strong>Let’s make it real.</strong></div>
      </div>
      <div className="collage-stage">
        <NetworkBackdrop/>
        <div className="collage-logo-sheet"><svg className="collage-logo" viewBox="70 330 1120 580" role="img" aria-label="SKD, Shelby Klein’s cut-paper ribbon monogram"><defs><mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254">{[0,1,2].map(i => <rect className="logo-mask-strip" key={i} x="0" y={i * 418} width="1400" height="420" fill="white"/>)}</mask></defs><image href={sitePath('/images/flow/collage.jpg')} width="1254" height="1254" mask={`url(#${maskId})`}/></svg><span className="logo-sheet-caption">INDEPENDENT SPIRIT. SHARED PURPOSE.</span></div>
        <button className="collage-replay" onClick={() => setReplay(n => n + 1)}><RotateCcw size={14}/> Replay the reveal</button>
        <span className="collage-impression" aria-live="polite">{replay ? `Take ${replay + 1}` : 'CREATE SOMETHING TOGETHER.'}</span>
      </div>
    </div>
    <div className="collage-ticker" aria-label="Brand, digital, product, motion"><div><span>BRAND</span><i>✳</i><span>DIGITAL</span><i>✳</i><span>PRODUCT</span><i>✳</i><span>MOTION</span><i>✳</i><span>WHAT’S NEXT?</span></div></div>
  </section>;
}
export function AtelierBand() {
  return <section className="atelier-band wrap" aria-labelledby="atelier-title"><div className="atelier-image"><MaskedCollage variant="poster" src="/images/flow/imagination-machine-code.png" alt="Brain, robot and code emblems linked by ribbons, gears and circuit traces"/></div><div className="atelier-copy" data-reveal><span className="cut-label">THE THREAD THROUGH IT ALL</span><h2 id="atelier-title">Different perspectives.<br/><em>Shared possibilities.</em></h2><p>Design gets more interesting when different minds meet. I bring the craft, curiosity, and technical know-how; you bring your world. Together, we can make something neither of us would have made alone.</p><a href="#work">Follow the thread <ArrowDown size={17}/></a></div></section>;
}

const circuitNodes = [
  { x: 105, y: 100, Icon: Eye }, { x: 450, y: 90, Icon: Brain },
  { x: 285, y: 275, Icon: Cpu }, { x: 95, y: 435, Icon: Code2 },
  { x: 475, y: 430, Icon: Bot },
];
const circuitEdges = [
  'M105 100H285V275', 'M450 90V180H285V275',
  'M285 275H190V435H95', 'M285 275H380V430H475',
  'M105 100V40H555V430H475', 'M95 435V525H340V465H475V430',
  'M105 100H40V330H95V435', 'M450 90H365V40',
];
export function NetworkBackdrop() {
  const root = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, '');
  const { paused } = useContext(PrintContext);
  useEffect(() => {
    if (paused || !root.current) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const packets = gsap.utils.toArray<SVGPathElement>('.circuit-packet', root.current);
      packets.forEach((packet, i) => {
        gsap.fromTo(packet, { attr: { 'stroke-dashoffset': 160 } }, {
          attr: { 'stroke-dashoffset': -1000 }, duration: 7 + (i % 3) * 1.5,
          delay: i * .65, repeat: -1, repeatDelay: 1.2, ease: 'none',
        });
      });
      gsap.to('.circuit-node-halo', { opacity: .5, scale: 1.2, transformOrigin: 'center', duration: 2.5, stagger: .6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, root);
    return () => mm.revert();
  }, [paused]);
  return <svg ref={root} className="circuit-background" viewBox="0 0 600 570" aria-hidden="true" focusable="false">
    <defs>
      <pattern id={`${id}-dots`} width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.65" fill="currentColor"/></pattern>
      {circuitEdges.map((d, i) => <mask key={i} id={`${id}-packet-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="570"><path className="circuit-packet" d={d} pathLength="1000" fill="none" stroke="white" strokeWidth="26" strokeLinejoin="miter" strokeDasharray="160 1840" strokeDashoffset={-i * 110}/></mask>)}
    </defs>
    <g className="circuit-edges" fill="none" strokeWidth="1.5" strokeLinejoin="miter">{circuitEdges.map((d, i) => <path key={i} d={d}/>)}</g>
    {circuitEdges.map((d, i) => <rect key={i} className={`circuit-ink circuit-ink-${i % 2}`} width="600" height="570" fill={`url(#${id}-dots)`} mask={`url(#${id}-packet-${i})`}/>)}
    {[[285,180],[190,275],[380,275],[340,525],[40,330],[555,180],[365,40]].map(([x,y],i)=><circle key={i} className="circuit-junction" cx={x} cy={y} r="4"/>)}
    {circuitNodes.map(({x,y,Icon},i)=><g key={i} className="circuit-node" transform={`translate(${x} ${y})`}>
      <circle className="circuit-node-halo" r="40" fill={`url(#${id}-dots)`}/>
      <circle className="circuit-node-disc" r="28"/>
      <Icon x="-13" y="-13" width="26" height="26" strokeWidth="1.5"/>
      <circle className="circuit-node-terminal" cx="28" cy="0" r="4"/>
    </g>)}
  </svg>;
}
