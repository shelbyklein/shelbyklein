'use client';

import { useEffect, useRef } from 'react';

type Pointer = { x: number; y: number; active: boolean };
const pointer: Pointer = { x: 0, y: 0, active: false };
const subscribers = new Set<() => void>();
function publish(event?: PointerEvent) {
  pointer.active = !!event && event.pointerType !== 'touch';
  if (event) { pointer.x = event.clientX; pointer.y = event.clientY; }
  subscribers.forEach(notify => notify());
}
const leave = () => publish();
function subscribe(notify: () => void) {
  if (!subscribers.size) {
    window.addEventListener('pointermove', publish, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
  }
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
    if (!subscribers.size) {
      window.removeEventListener('pointermove', publish);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      pointer.active = false;
    }
  };
}

/** CSS supplies the resting screen; canvas adds only the nearby ink strokes. */
export function HalftoneField({ variant = 'edge' }: { variant?: 'hero' | 'edge' | 'footer' }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    const canvas = host?.querySelector('canvas');
    const ctx = canvas?.getContext('2d');
    if (!host || !canvas || !ctx) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let frame = 0;
    let previous = 0;
    let width = 0;
    let height = 0;
    let x = 0;
    let y = 0;
    let strength = 0;
    let color = '';
    const enabled = () => fine.matches && !reduced.matches && document.documentElement.dataset.motion === 'on';
    const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; };
    const clear = () => { stop(); strength = 0; ctx.clearRect(0, 0, width, height); };
    function draw(time: number) {
      frame = 0;
      if (!visible || document.hidden || !enabled()) { clear(); return; }
      const rect = host!.getBoundingClientRect();
      const tx = pointer.x - rect.left;
      const ty = pointer.y - rect.top;
      const target = pointer.active && tx > -150 && tx < width + 150 && ty > -150 && ty < height + 150 ? 1 : 0;
      const ease = 1 - Math.exp(-Math.min(previous ? time - previous : 16, 64) / 65);
      previous = time;
      if (strength < .001) { x = tx; y = ty; }
      x += (tx - x) * ease; y += (ty - y) * ease;
      strength += (target - strength) * ease;
      ctx!.clearRect(0, 0, width, height);
      ctx!.strokeStyle = color;
      // Only visit dots inside the influence radius, not the whole section.
      for (let cy = Math.max(2.5, Math.ceil((y - 150 - 2.5) / 5) * 5 + 2.5); cy < Math.min(height, y + 150); cy += 5) {
        for (let cx = Math.max(2.5, Math.ceil((x - 150 - 2.5) / 5) * 5 + 2.5); cx < Math.min(width, x + 150); cx += 5) {
          const t = Math.max(0, 1 - Math.hypot(cx - x, cy - y) / 150);
          const weight = t * t * (3 - 2 * t) * strength;
          if (weight < .002) continue;
          ctx!.lineWidth = 2.2 * weight;
          ctx!.beginPath(); ctx!.arc(cx, cy, .8, 0, Math.PI * 2); ctx!.stroke();
        }
      }
      const settling = Math.abs(target - strength) > .001 || (target > 0 && Math.hypot(tx - x, ty - y) > .1);
      if (settling) frame = requestAnimationFrame(draw);
      else { previous = 0; if (!target) ctx!.clearRect(0, 0, width, height); }
    }
    function wake() {
      if (!enabled() || !visible || document.hidden) { clear(); return; }
      if (!frame) frame = requestAnimationFrame(draw);
    }
    function resize() {
      const rect = host!.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      color = getComputedStyle(host!).getPropertyValue('--halftone-ink').trim();
      wake();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); });
    intersection.observe(host);
    const motion = new MutationObserver(wake);
    motion.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    const unsubscribe = subscribe(wake);
    fine.addEventListener('change', wake); reduced.addEventListener('change', wake);
    window.addEventListener('scroll', wake, { passive: true, capture: true });
    document.addEventListener('visibilitychange', wake);
    resize();
    return () => {
      stop(); unsubscribe(); resizeObserver.disconnect(); intersection.disconnect(); motion.disconnect();
      fine.removeEventListener('change', wake); reduced.removeEventListener('change', wake);
      window.removeEventListener('scroll', wake, true);
      document.removeEventListener('visibilitychange', wake);
    };
  }, []);
  return <div ref={ref} className={`halftone-field halftone-field--${variant}`} aria-hidden="true"><canvas /></div>;
}
