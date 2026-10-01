'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

type Swing = { el: HTMLElement; pivotY: number; theta: number; omega: number; k: number; live: boolean };

/**
 * A pegboard surface whose [data-swing] children hang from hooks: they drop in when first seen,
 * sway when the cursor brushes past, and settle. Markup stays server-rendered; this only adds motion.
 */
export function PegBand({ className = '', label, children }: { className?: string; label?: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const swings: Swing[] = [...el.querySelectorAll<HTMLElement>('[data-swing]')].map((node) => {
      const pivotY = Number(node.dataset.swing || 0);
      gsap.set(node, { transformOrigin: `50% ${pivotY}px` });
      return { el: node, pivotY, theta: 0, omega: 0, k: Number(node.dataset.k || 24), live: false };
    });
    let last: number | null = null;
    const tick = (_t: number, dms: number) => {
      const dt = Math.min(dms / 1000, 1 / 30);
      for (const s of swings) {
        if (!s.live || (Math.abs(s.theta) < 0.0004 && Math.abs(s.omega) < 0.0004)) continue;
        s.omega += (-s.k * Math.sin(s.theta) - 2.4 * s.omega) * dt;
        s.theta += s.omega * dt;
        gsap.set(s.el, { rotation: s.theta * 57.2958 });
      }
    };
    gsap.ticker.add(tick);
    const move = (e: PointerEvent) => {
      if (last !== null) {
        const dx = e.clientX - last;
        for (const s of swings) {
          const r = s.el.getBoundingClientRect();
          if (!s.live || e.clientX < r.left || e.clientX > r.right || e.clientY < r.top + Math.min(0, s.pivotY) || e.clientY > r.bottom) continue;
          const reach = Math.max(0.25, Math.min(1.2, (e.clientY - r.top - s.pivotY) / r.height));
          s.omega = Math.max(-3, Math.min(3, s.omega - (dx / r.height) * 3.6 * reach));
        }
      }
      last = e.clientX;
    };
    const leave = () => { last = null; };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    // Drop everything onto its hook the first time the band scrolls into view.
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const tl = gsap.timeline();
      el.querySelectorAll('.peg-hook').forEach((h, i) => tl.from(h, { scaleY: 0, duration: 0.3, ease: 'back.out(3)' }, i * 0.04));
      swings.forEach((s, i) => tl.from(s.el, { y: -window.innerHeight * 0.6, duration: 0.5, ease: 'power2.in', onComplete: () => { s.live = true; s.omega = (i % 2 ? 1 : -1) * gsap.utils.random(1.8, 2.8); } }, 0.15 + i * 0.07));
      el.querySelectorAll<HTMLElement>('.peg-tag').forEach((t, i) => { const n = t.textContent?.length ?? 8; tl.fromTo(t, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: n * 0.03, ease: `steps(${n})` }, 0.6 + i * 0.05); });
    }, { threshold: 0.2 });
    io.observe(el);
    return () => { gsap.ticker.remove(tick); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); io.disconnect(); swings.forEach((s) => gsap.set(s.el, { clearProps: 'transform' })); };
  }, []);
  return <div ref={root} className={`peg-band ${className}`} aria-label={label}>{children}</div>;
}

/** One thing on a hook: the hook stays put, the object swings, the label-maker tag stays on the board. */
export function Hang({ href, tag, tagColor, pivot = 0, k, external, children }: { href?: string; tag?: string; tagColor?: 'blue' | 'white'; pivot?: number; k?: number; external?: boolean; children: ReactNode }) {
  const body = href
    ? <a className="hang-swing" style={{ marginTop: 32 - pivot }} data-swing={pivot} data-k={k} href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
    : <div className="hang-swing" style={{ marginTop: 32 - pivot }} data-swing={pivot} data-k={k}>{children}</div>;
  return <div className="hang"><span className="peg-hook" aria-hidden="true" />{body}{tag && <span className={`peg-tag ${tagColor ?? ''}`} aria-hidden="true">{tag}</span>}</div>;
}

export function PageHead({ label, title, children }: { label: string; title: ReactNode; children?: ReactNode }) {
  return <header className="page-head"><span className="peg-tag page-tag">{label}</span><h1>{title}</h1>{children}</header>;
}
