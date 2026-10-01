'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';

export type WorkRow = { id: string; title: string; label: string; href: string; cover: string | null };

// A plain list of every project; hovering a row floats its cover beside the cursor.
export function WorkIndex({ rows }: { rows: WorkRow[] }) {
  const list = useRef<HTMLDivElement>(null), peek = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = list.current!, p = peek.current!, img = p.querySelector('img')!;
    if (!matchMedia('(hover: hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const qx = gsap.quickTo(p, 'x', { duration: 0.5, ease: 'power3' }), qy = gsap.quickTo(p, 'y', { duration: 0.5, ease: 'power3' });
    const move = (e: PointerEvent) => { qx(e.clientX + 36); qy(e.clientY - 236); };
    const enter = (e: Event) => { const src = (e.currentTarget as HTMLElement).dataset.cover; if (!src) return; img.src = src; gsap.to(p, { autoAlpha: 1, scale: 1, rotation: gsap.utils.random(-3, 3), duration: 0.3 }); };
    const leave = () => gsap.to(p, { autoAlpha: 0, scale: 0.9, duration: 0.25 });
    const rowsEls = [...el.querySelectorAll<HTMLElement>('.work-row')];
    el.addEventListener('pointermove', move);
    rowsEls.forEach((r) => { r.addEventListener('pointerenter', enter); r.addEventListener('pointerleave', leave); });
    return () => { el.removeEventListener('pointermove', move); rowsEls.forEach((r) => { r.removeEventListener('pointerenter', enter); r.removeEventListener('pointerleave', leave); }); };
  }, []);
  return <>
    <div className="work-rows" ref={list}>{rows.map((row) => <a key={row.id} className="work-row" href={row.href} data-cover={row.cover ?? undefined}>
      <span className="work-row-title">{row.title}</span><span className="work-row-label">{row.label}</span><ArrowRight size={18} aria-hidden="true"/></a>)}</div>
    <div className="work-peek" ref={peek} aria-hidden="true"><img alt="" /></div>
  </>;
}
