'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { sitePath } from '@/lib/site-path';

export function PlanetScene() {
  const frame = useRef<HTMLIFrameElement>(null);
  const visible = useRef(false);
  const pausedRef = useRef(true);
  const [paused, setPaused] = useState(true);

  function syncPlayback() {
    frame.current?.contentWindow?.postMessage({
      type: 'hero-scene-playback',
      paused: pausedRef.current || !visible.current || document.hidden,
    }, '*'); // The script-only sandbox intentionally has an opaque origin.
  }

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    function applyPreference() {
      pausedRef.current = preference.matches;
      setPaused(preference.matches);
      syncPlayback();
    }
    function onReady(event: MessageEvent) {
      if (event.source === frame.current?.contentWindow && event.data?.type === 'hero-scene-ready') syncPlayback();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      syncPlayback();
    });
    if (frame.current) observer.observe(frame.current);
    preference.addEventListener('change', applyPreference);
    document.addEventListener('visibilitychange', syncPlayback);
    window.addEventListener('message', onReady);
    applyPreference();
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', applyPreference);
      document.removeEventListener('visibilitychange', syncPlayback);
      window.removeEventListener('message', onReady);
    };
  }, []);

  function togglePlayback() {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    syncPlayback();
  }

  return <>
    <div className="planet-scene" aria-hidden="true">
      <iframe ref={frame} src={sitePath('/scenes/alien-planet.html')} title="Animated planet background"
        loading="lazy" tabIndex={-1} sandbox="allow-scripts" onLoad={syncPlayback}/>
    </div>
    <button type="button" className="planet-scene-toggle" onClick={togglePlayback}
      aria-label={paused ? 'Play background animation' : 'Pause background animation'}>
      {paused ? <Play size={14} aria-hidden="true"/> : <Pause size={14} aria-hidden="true"/>}
      <span>{paused ? 'Play animation' : 'Pause animation'}</span>
    </button>
  </>;
}
