import type { Metadata } from 'next';
import { sitePath } from '@/lib/site-path';

export const metadata: Metadata = { title: 'Support — Duo Pixel', description: 'Help with drawing, animation, exports, and optional PixelLab features in Duo Pixel.' };

export default function Page() {
  return <article className="duo-document"><h1>Duo Pixel Support</h1>
<p className="duo-document-subtitle">Pixel art and sprite animation for iPhone</p>
<h2>Get help</h2>
<p>Email <a href="mailto:shelbykleindesign@gmail.com">shelbykleindesign@gmail.com</a> with what you were doing and what happened, and which iPhone you use.</p>
<h2>Common questions</h2>
<p><strong>How do I zoom and pan?</strong> Pinch with two fingers to zoom and drag with two fingers to pan. A quick two-finger tap undoes the last stroke.</p>
<p><strong>Where is the timeline on the closed iPhone Duo?</strong> The cover screen shows the drawing tools only. Open the phone for frames, layers, playback and export.</p>
<p><strong>How do I export?</strong> Tap Export at the right end of the timeline bar and choose GIF, sprite sheet or PNG.</p>
<p><strong>Why can’t I see onion skinning?</strong> It shows the previous and next frame of the layer you are drawing on. Check that the layer has artwork on those frames and that playback is stopped.</p>
<p><strong>What is the sparkle button?</strong> It opens PixelLab, an optional third-party service that generates pixel art. It needs your own API key from pixellab.ai, and each use is charged to your PixelLab account.</p>
<p><strong>Where are my projects stored?</strong> On your phone, inside the app. Deleting the app deletes them, so export anything you want to keep.</p>
<p><a href={sitePath('/duo-pixel/privacy')}>Privacy policy</a></p></article>;
}
