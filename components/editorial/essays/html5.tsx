'use client';
import { useState } from 'react';
import { Section, Raw } from 'reacticle';
import { sitePath } from '@/lib/site-path';
export const html5Sections = [
  { id: 'drawn-map', title: 'A map drawn more than once' },
  { id: 'newton-branch', title: 'A branch with a little weight' },
  { id: 'moonlit-workshop', title: 'A workshop with depth' },
];
function Experiment({ name, path, poster }: { name: string; path: string; poster: string }) {
  const [playing, setPlaying] = useState(false);
  return <Raw><figure className="html5-demo">
    {playing ? <iframe src={sitePath(path)} title={name} loading="lazy" /> :
      <button className="html5-demo-start" onClick={() => setPlaying(true)} aria-label={`Play ${name}`}>
        <img src={sitePath(poster)} alt={name} loading="lazy" /><span>Play experiment ↗</span>
      </button>}
    <figcaption><a href={sitePath(path)} target="_blank" rel="noreferrer">Open {name} full screen ↗</a>{playing && <button onClick={() => setPlaying(false)}>Stop preview</button>}</figcaption>
  </figure></Raw>;
}
export function Html5Essay() {
  return <>
    <Section id="drawn-map" index="01" title="A map drawn more than once">
      <p>The Geekify map started as a much denser, full-color scene. Simplifying it to dark ink on parchment made it feel closer to a hand-drawn tabletop map, and opened up a different way to animate it.</p>
      <p>This version cycles through six AI-generated drawings at four frames per second. Waves change shape, sails shift, smoke curls, and the dragon moves its wings. Small differences between the drawings give the whole image a flicker. It is an experiment in that handmade feeling; the frames are not perfectly registered, so some stationary details shift too.</p>
      <Experiment name="the hand-drawn map" path="/experiments/duotone-map/" poster="/experiments/duotone-map/assets/duotone/frame-01.png" />
      <p>The playback is a small HTML canvas loop. All six frames load before it starts, and reduced-motion preferences show the original drawing.</p>
    </Section>
    <Section id="newton-branch" index="02" title="A branch with a little weight">
      <p>For Newton, the illustration becomes something you can touch. The branch bends, the fruit hangs from it, and pulling the apple changes the balance of the scene.</p>
      <p>This study uses the homepage’s WebGL mesh and spring motion. The drawing is still the surface; the movement comes from a small rig beneath it. Try dragging the apple and letting go. You can also focus it with the keyboard and use the arrow keys.</p>
      <Experiment name="the Newton branch" path="/experiments/newton-branch/" poster="/experiments/newton-branch/assets/tree/hero-branch-apple-blend-v2.png" />
    </Section>
    <Section id="moonlit-workshop" index="03" title="A workshop with depth">
      <p>The moonlit workshop takes another approach: separate pieces of illustration arranged at different depths. Moving the pointer changes their relationship, making the foreground feel closer and the landscape feel farther away.</p>
      <p>Lighting and small animated details add to the scene. The controls let you switch between moonlit and sunlit rooms, change the depth, or pause the motion. This is a Geekify homepage study, rather than a finished storefront.</p>
      <Experiment name="the moonlit workshop" path="/experiments/moonlit-workshop/" poster="/experiments/moonlit-workshop/assets/01-background-moonlit-landscape.png" />
      <p>I’m interested in how little movement a scene needs before it starts to feel inhabited. Each of these is a working sketch of that question, with a different balance between illustration, code, and interaction.</p>
    </Section>
  </>;
}
