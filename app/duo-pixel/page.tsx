import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { Hang, PegBand } from '@/components/peg-band';
import { sitePath } from '@/lib/site-path';

export const metadata: Metadata = {
  title: 'Duo Pixel — Pixel art & sprite animation',
  description: 'A pixel art and animation studio for iPhone. Draw with layers, animate frame by frame, and export GIFs, sprite sheets, and PNGs.',
};

export default function DuoPixelPage() {
  return <>
    <section className="duo-hero" aria-labelledby="duo-title">
      <div className="duo-intro">
        <h1 id="duo-title">Little pixels.<br />Big possibilities.</h1>
        <p className="duo-subtitle">Duo Pixel is a pixel art &amp; animation studio for your iPhone.</p>
        <p>Draw a character, bring it to life frame by frame, and take it into your next game or share it as a GIF. Your tools, layers, and timeline are right there with you.</p>
        <p className="duo-release">Coming to the App Store.</p>
        <a className="peg-btn" href="#inside">Take a look inside <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      <PegBand className="duo-hero-board" label="Duo Pixel drawing workspace">
        <Hang tag="Duo Pixel · Draw & animate" tagColor="blue" pivot={0} k={30}>
          <img className="duo-phone" src={sitePath('/images/duo-pixel/editor.webp')} alt="Duo Pixel editor showing a colourful pixel character, drawing tools, and a frame-by-frame animation timeline." width="660" height="1434" fetchPriority="high" />
        </Hang>
      </PegBand>
    </section>

    <section id="inside" className="duo-inside" aria-labelledby="duo-inside-title">
      <h2 id="duo-inside-title">From the first pixel<br />to the last frame.</h2>
      <div className="duo-feature-list">
        <div><h3>Make your mark.</h3><p>Pencil, eraser, fill, colour picker, shapes, and selection tools. Work in layers on canvases up to 256 × 256 pixels, with a starter palette and any colours you add.</p></div>
        <div><h3>Give it a little life.</h3><p>Add, duplicate, and reorder frames. Adjust playback speed and use tinted onion skinning to see the frames around the one you’re drawing.</p></div>
        <div><h3>Take it with you.</h3><p>Export an animated GIF, a sprite sheet for a game engine, or a PNG. Keep transparent backgrounds and export at actual pixel size or enlarged.</p></div>
      </div>
      <div className="duo-screens">
        <figure><img src={sitePath('/images/duo-pixel/onion.webp')} alt="Duo Pixel animation editor with onion skinning enabled to compare neighbouring frames." width="660" height="1434" loading="lazy" /><figcaption>See the frames around your drawing with onion skinning.</figcaption></figure>
        <figure><img src={sitePath('/images/duo-pixel/library.webp')} alt="Duo Pixel project library showing saved pixel art projects." width="660" height="1434" loading="lazy" /><figcaption>Pick up where you left off. Projects save automatically on your phone.</figcaption></figure>
      </div>
    </section>

    <section className="duo-details" aria-label="More about Duo Pixel">
      <div><h2>Your drawings stay yours.</h2><p>No account, ads, analytics, or tracking in the app. Projects stay on your phone. The drawing and animation tools work offline.</p><a href={sitePath('/duo-pixel/privacy')}>Read the privacy policy <ArrowUpRight size={16} aria-hidden="true" /></a></div>
      <div><h2>A little help, if you want it.</h2><p>PixelLab is an optional, separate paid service. Add your own API key to generate a sprite from a description or animate a layer. Your prompt and chosen layer go directly to PixelLab.</p><a href={sitePath('/duo-pixel/support')}>Get help with Duo Pixel <ArrowUpRight size={16} aria-hidden="true" /></a></div>
    </section>
  </>;
}
