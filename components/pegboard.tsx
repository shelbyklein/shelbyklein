'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { sitePath } from '@/lib/site-path';
import { PEGBOARD_CANVAS, pegBoardTags, pegNote, pegShelves, pegStands, type PegItem, type PegTag } from '@/lib/pegboard';

gsap.registerPlugin(ScrollTrigger, SplitText);

export type PegProject = { title: string; label: string; summary: string; href: string };
type Detail = { title: string; label: string; summary: string; href: string };
type Body = { item: PegItem | null; el: HTMLElement; swing: HTMLElement; hook?: HTMLElement; theta: number; omega: number; live: boolean; held: boolean; moved: boolean; w: number; h: number; x: number; y: number; pivot?: [number, number]; k: number };

const DEG = 57.2958;
const clamp = (v: number, a: number) => Math.max(-a, Math.min(a, v));

function Fixture({ item }: { item: PegItem }) {
  const src = sitePath(item.src);
  const img = <img src={src} alt={item.alt} width={item.w} height={item.h} draggable={false} />;
  switch (item.fixture) {
    case 'stand': return <img className="peg-cut peg-standing" src={src} alt={item.alt} width={item.w} height={item.h} draggable={false} />;
    case 'cut': return <img className="peg-cut" src={src} alt={item.alt} width={item.w} height={item.h} draggable={false} />;
    case 'clip': return <><span className="peg-clip" /><div className="peg-print" style={{ width: item.w, height: item.h }}>{img}</div></>;
    case 'print': return <div className="peg-print" style={{ width: item.w, height: item.h }}>{img}</div>;
    case 'sticker': return <div className="peg-print peg-sticker" style={{ width: item.w, height: item.h }}>{img}</div>;
    case 'phone': return <div className="peg-phone">{img}</div>;
    case 'tv': return <div className="peg-tv">{img}</div>;
    case 'laptop': return <div className="peg-laptop"><div className="peg-screen">{img}</div><div className="peg-base" /></div>;
  }
}

function Tag({ tag }: { tag: PegTag }) {
  return <span className={`peg-tag ${tag.color ?? ''}`} style={{ left: tag.x, top: tag.y }} aria-hidden="true">{tag.text}</span>;
}

export function Pegboard({ header, intro, items, projects }: { header: ReactNode; intro: ReactNode; items: PegItem[]; projects: Record<string, PegProject> }) {
  const root = useRef<HTMLDivElement>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const closeRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = root.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const board = el.querySelector<HTMLElement>('.peg-board')!, stage = el.querySelector<HTMLElement>('.peg-stage')!, track = el.querySelector<HTMLElement>('.peg-track')!;
    const bodies: Body[] = [...stage.querySelectorAll<HTMLElement>('[data-peg]')].map((node) => {
      const i = Number(node.dataset.peg), item = i >= 0 ? items[i] : null, spec = item ?? pegNote;
      return { item, el: node, swing: node.firstElementChild as HTMLElement, hook: stage.querySelector<HTMLElement>(`[data-hook="${i}"]`) ?? undefined,
        theta: 0, omega: 0, live: false, held: false, moved: false, w: spec.w, h: spec.h, x: spec.x, y: spec.y, pivot: spec.pivot, k: spec.k ?? 24 };
    });
    const hanging = bodies.filter((b) => b.pivot);
    let scale = 1, lastX = 0, lastPointer: [number, number] | null = null, dragging = false, open: { b: Body; clone: HTMLElement; tl: gsap.core.Timeline } | null = null;

    const ctx = gsap.context(() => {
      hanging.forEach((b) => gsap.set(b.swing, { transformOrigin: `${b.pivot![0]}px ${b.pivot![1]}px` }));
      const layout = () => {
        const headerH = el.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 76;
        scale = Math.min(1.05, (innerHeight - headerH - 24) / PEGBOARD_CANVAS.h);
        gsap.set(board, { width: PEGBOARD_CANVAS.w * scale, height: PEGBOARD_CANVAS.h * scale });
        gsap.set(stage, { scale });
      };
      layout();
      const travel = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, { x: () => -travel(), ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => '+=' + travel(), pin: true, scrub: 0.8, invalidateOnRefresh: true, onRefreshInit: layout,
        onUpdate: (self) => gsap.set(el.querySelector('.peg-progress'), { scaleX: self.progress }) } });

      gsap.ticker.add(tick);
      function tick(_t: number, dms: number) {
        const dt = Math.min(dms / 1000, 1 / 30), x = Number(gsap.getProperty(track, 'x')), dx = (x - lastX) / scale;
        lastX = x;
        for (const b of hanging) {
          if (!b.live || b.held) continue;
          if (!reduce && dx) b.omega = clamp(b.omega + (dx / b.h) * 0.5, 3);
          b.omega += (-b.k * Math.sin(b.theta) - 2.4 * b.omega) * dt;
          b.theta += b.omega * dt;
          gsap.set(b.swing, { rotation: b.theta * DEG });
        }
      }

      if (reduce) { hanging.forEach((b) => { b.live = true; }); return; }
      void document.fonts.ready.then(() => {
        const split = SplitText.create(el.querySelector('.peg-headline'), { type: 'words,lines', mask: 'lines' });
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from(split.words, { yPercent: 110, duration: 0.8, stagger: 0.045, ease: 'power4.out' })
          .from(el.querySelectorAll('[data-in]'), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.07 }, '-=.55')
          .from(board, { autoAlpha: 0, y: 24, duration: 0.6 }, 0.1)
          .from(stage.querySelectorAll('.peg-hook'), { scaleY: 0, duration: 0.35, stagger: 0.04, ease: 'back.out(3)' }, 0.45)
          .from(stage.querySelectorAll('.peg-shelf'), { scaleX: 0, transformOrigin: 'left center', duration: 0.5, stagger: 0.1 }, 0.5);
        hanging.forEach((b, i) => tl.from(b.el, { y: -1100, duration: 0.55, ease: 'power2.in', onComplete: () => { b.live = true; b.omega = (i % 2 ? 1 : -1) * gsap.utils.random(2, 3.2); } }, 0.6 + i * 0.08));
        bodies.filter((b) => !b.pivot).forEach((b, i) => tl.from(b.el, { y: -320, autoAlpha: 0, duration: 0.9, ease: 'bounce.out' }, 1.1 + i * 0.06));
        stage.querySelectorAll<HTMLElement>('.peg-tag').forEach((t, i) => {
          const n = t.textContent?.length ?? 8;
          tl.fromTo(t, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: n * 0.035, ease: `steps(${n})` }, 1.5 + i * 0.06);
        });
      });
    }, el);

    const stagePoint = (e: PointerEvent): [number, number] => { const r = board.getBoundingClientRect(); return [(e.clientX - r.left) / scale, (e.clientY - r.top) / scale]; };
    const onMove = (e: PointerEvent) => {
      if (reduce || dragging) return;
      const [x, y] = stagePoint(e);
      if (lastPointer) {
        const dx = x - lastPointer[0];
        for (const b of hanging) {
          if (!b.live || x < b.x || x > b.x + b.w || y < b.y + Math.min(0, b.pivot![1]) || y > b.y + b.h) continue;
          const reach = Math.max(0.25, Math.min(1.2, (y - (b.y + b.pivot![1])) / b.h));
          b.omega = clamp(b.omega - (dx / b.h) * 3.6 * reach, 3);
        }
      }
      lastPointer = [x, y];
    };
    const onLeave = () => { lastPointer = null; };
    board.addEventListener('pointermove', onMove);
    board.addEventListener('pointerleave', onLeave);

    const takeDown = (b: Body) => {
      if (open || !b.item) return;
      const p = projects[b.item.projectId];
      b.held = true; b.theta = 0; b.omega = 0; gsap.set(b.swing, { rotation: 0 });
      const r = b.swing.getBoundingClientRect();
      const clone = b.swing.cloneNode(true) as HTMLElement;
      clone.className = 'peg-lift'; clone.style.width = b.w + 'px'; clone.removeAttribute('style'); clone.style.width = b.w + 'px';
      document.body.appendChild(clone);
      gsap.set(clone, { x: r.left, y: r.top, scale, rotation: 0 });
      b.el.style.visibility = 'hidden';
      const vw = innerWidth, vh = innerHeight, narrow = vw <= 860;
      const S = narrow ? Math.min((0.8 * vw) / b.w, (0.38 * vh) / b.h) : Math.min((0.42 * vw) / b.w, (0.66 * vh) / b.h, 2.4);
      const cx = narrow ? vw / 2 : vw * 0.3, cy = narrow ? vh * 0.3 : vh / 2;
      setDetail({ title: p.title, label: p.label, summary: p.summary, href: p.href });
      document.documentElement.style.overflow = 'hidden';
      const veil = el.querySelector('.peg-veil'), card = el.querySelector('.peg-detail');
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
      if (reduce) { gsap.set(clone, { x: cx - (b.w * S) / 2, y: cy - (b.h * S) / 2, scale: S }); tl.to([veil, card], { autoAlpha: 1, duration: 0.2 }); }
      else tl.to(clone, { y: r.top - 30, duration: 0.22, ease: 'power2.out' })
        .to(veil, { autoAlpha: 0.97, duration: 0.45 }, '<.05')
        .to(clone, { x: cx - (b.w * S) / 2, y: cy - (b.h * S) / 2, scale: S, duration: 0.7 }, '<')
        .fromTo(card, { autoAlpha: 0, y: narrow ? 30 : 0, x: narrow ? 0 : 40 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.5, ease: 'power3.out' }, '-=.3');
      open = { b, clone, tl };
      tl.eventCallback('onComplete', () => el.querySelector<HTMLElement>('.peg-detail-close')?.focus({ preventScroll: true }));
    };
    const hangBack = () => {
      if (!open) return;
      const { b, clone, tl } = open;
      tl.timeScale(1.4).reverse().eventCallback('onReverseComplete', () => {
        clone.remove(); b.el.style.visibility = ''; b.held = false; b.omega = reduce ? 0 : 2.2; open = null;
        document.documentElement.style.overflow = ''; setDetail(null); b.el.focus({ preventScroll: true });
      });
    };
    closeRef.current = hangBack;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') hangBack(); };
    addEventListener('keydown', onKey);

    const cleanups = bodies.map((b) => {
      const click = (e: MouseEvent) => { if (!b.item) return; e.preventDefault(); if (b.moved) return; takeDown(b); };
      const down = (e: PointerEvent) => {
        b.moved = false;
        if (!b.pivot || reduce || !b.item) return;
        const start = stagePoint(e), px = b.x + b.pivot[0], py = b.y + b.pivot[1];
        const a0 = Math.atan2(start[0] - px, start[1] - py) + b.theta;
        let prevT = performance.now();
        const move = (ev: PointerEvent) => {
          const [x, y] = stagePoint(ev);
          if (!b.moved && Math.hypot(x - start[0], y - start[1]) < 6) return;
          if (!b.moved) { b.moved = true; b.held = true; dragging = true; b.el.classList.add('dragging'); }
          const th = clamp(a0 - Math.atan2(x - px, y - py), 1.1), now = performance.now();
          b.omega = ((th - b.theta) / Math.max(0.008, (now - prevT) / 1000)) * 0.6; prevT = now;
          b.theta = th; gsap.set(b.swing, { rotation: th * DEG });
        };
        const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); b.held = false; dragging = false; b.el.classList.remove('dragging'); b.omega = clamp(b.omega, 6); };
        addEventListener('pointermove', move); addEventListener('pointerup', up);
      };
      const hop = () => { if (b.pivot || reduce || gsap.isTweening(b.swing)) return; gsap.timeline().to(b.swing, { y: -12, rotation: gsap.utils.random(-5, 5), duration: 0.18, ease: 'power2.out' }).to(b.swing, { y: 0, rotation: 0, duration: 0.6, ease: 'bounce.out' }); };
      b.el.addEventListener('click', click); b.el.addEventListener('pointerdown', down); b.el.addEventListener('pointerenter', hop);
      return () => { b.el.removeEventListener('click', click); b.el.removeEventListener('pointerdown', down); b.el.removeEventListener('pointerenter', hop); };
    });

    return () => {
      cleanups.forEach((c) => c()); board.removeEventListener('pointermove', onMove); board.removeEventListener('pointerleave', onLeave); removeEventListener('keydown', onKey);
      open?.clone.remove(); document.documentElement.style.overflow = ''; ctx.revert();
    };
  }, [items, projects]);

  return (
    <div className="peg-pin" ref={root}>
      {header}
      <div className="peg-track">
        <div className="peg-intro">{intro}</div>
        <div className="peg-board-wrap">
          <div className="peg-board" aria-label="Pegboard of projects. Select an object to open its project.">
            <div className="peg-stage" style={{ width: PEGBOARD_CANVAS.w, height: PEGBOARD_CANVAS.h }}>
              {pegShelves.map(([x, y, w]) => <span key={`${x}-${y}`} className="peg-shelf" style={{ left: x, top: y, width: w }} />)}
              {pegStands.map(([x, y, w]) => <span key={`s${x}-${y}`} className="peg-stand" style={{ left: x, top: y, width: w }} aria-hidden="true"><span className="peg-stand-back" /></span>)}
              {items.map((item, i) => item.pivot && <span key={`h${item.key}`} className="peg-hook" data-hook={i} style={{ left: item.x + item.pivot[0] - 2, top: item.y + item.pivot[1] - 30 }} />)}
              <span className="peg-hook" data-hook={-1} style={{ left: pegNote.x + pegNote.pivot[0] - 2, top: pegNote.y + pegNote.pivot[1] - 30 }} />
              {items.map((item, i) => (
                <a key={item.key} className="peg-item" data-peg={i} href={projects[item.projectId].href} aria-label={`${projects[item.projectId].title}: ${item.alt}`} style={{ left: item.x, top: item.y, width: item.w, height: item.h }}>
                  <div className="peg-swing"><Fixture item={item} /></div>
                </a>
              ))}
              <div className="peg-item peg-note-item" data-peg={-1} style={{ left: pegNote.x, top: pegNote.y, width: pegNote.w }}>
                <div className="peg-swing"><span className="peg-clip" /><div className="peg-note">
                  <span className="peg-label">END OF THE WALL</span>
                  <h2>Got something to build?</h2>
                  <p>Have a project, or a role to fill? I’d love to hear about it.</p>
                  <div className="peg-actions"><a className="peg-btn" href="mailto:shelbykleindesign@gmail.com">Let’s talk</a><a className="peg-btn ghost" href={sitePath('/Shelby-Klein-Resume.pdf')} target="_blank" rel="noreferrer">Resumé</a></div>
                </div></div>
              </div>
              {items.map((item) => item.tag && <Tag key={`t${item.key}`} tag={item.tag} />)}
              {pegBoardTags.map((tag) => <Tag key={tag.text} tag={tag} />)}
            </div>
          </div>
        </div>
      </div>
      <div className="peg-progress" aria-hidden="true" />
      <button className="peg-veil" type="button" tabIndex={-1} aria-label="Hang it back" onClick={() => closeRef.current()} />
      <dialog className="peg-detail" aria-labelledby="peg-detail-title" open={!!detail}>
        <span className="peg-label">{detail?.label}</span>
        <h2 id="peg-detail-title">{detail?.title}</h2>
        <p>{detail?.summary}</p>
        <div className="peg-actions"><a className="peg-btn" href={detail?.href}>Open the case study</a><button className="peg-btn ghost peg-detail-close" type="button" onClick={() => closeRef.current()}>Hang it back</button></div>
      </dialog>
    </div>
  );
}
