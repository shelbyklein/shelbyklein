import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy policy — Duo Pixel', description: 'How Duo Pixel handles projects, optional PixelLab requests, and your privacy.' };

export default function Page() {
  return <article className="duo-document"><h1>Duo Pixel Privacy Policy</h1>
<p className="duo-document-subtitle">Effective 13 November 2026</p>
<p>Duo Pixel is a pixel art and animation app made by Shelby Klein. This policy explains what happens to your information when you use it.</p>
<h2>What we collect</h2>
<p>Nothing. Duo Pixel has no accounts, no analytics, no advertising and no tracking. We do not receive your drawings or any information about you or your device.</p>
<h2>Your projects</h2>
<p>Everything you draw is saved on your phone, inside the app. It leaves your phone only when you export a file and choose where to send it, or when it is included in a device backup you have turned on with Apple.</p>
<h2>PixelLab (optional)</h2>
<p>Duo Pixel can connect to PixelLab, a separate service at pixellab.ai that generates pixel art. This is off unless you add your own PixelLab API key. When you use it:</p>
<ul>
<li>The description you type is sent to PixelLab.</li>
<li>For “Animate layer”, the image of the layer you chose is sent to PixelLab. For “Create image”, your palette colours are sent if you turn that option on.</li>
<li>Your API key is stored in your phone’s Keychain and is sent only to PixelLab.</li>
</ul>
<p>These requests go straight from your phone to PixelLab and are handled under PixelLab’s own terms and privacy policy. We never see them.</p>
<h2>Children</h2>
<p>Duo Pixel does not collect information from anyone, including children.</p>
<h2>Changes</h2>
<p>If this policy changes, the new version will be posted on this page with a new date.</p>
<h2>Contact</h2>
<p>Questions? Email <a href="mailto:shelbykleindesign@gmail.com">shelbykleindesign@gmail.com</a>.</p></article>;
}
