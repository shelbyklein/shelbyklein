import { sitePath } from '@/lib/site-path';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Bricolage_Grotesque } from 'next/font/google';
import 'reacticle/styles.css';
import './globals.css';
import './editorial.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const displayFont = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Shelby Klein — Design & Creative Technology',
  description:
    'Independent designer and creative technologist in Atlanta, Georgia. Product design, software, brand identities, Olympic apparel, broadcast, and interactive experiences.',
  icons: { icon: sitePath('/favicon.svg') },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Self-hosted Umami analytics */}
        <script
          defer
          src="https://analytics.shelbyklein.com/script.js"
          data-website-id="2216e34c-d685-48de-996c-b19e4c9d0df7"
          data-domains="shelbyklein.com"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
