import { sitePath } from '@/lib/site-path';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

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
  description: 'Independent designer and creative technologist in Atlanta, Georgia. Product design, software, brand identities, Olympic apparel, broadcast, and interactive experiences.',
  icons: { icon: sitePath('/favicon.svg') },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
