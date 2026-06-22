import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';

import { Providers } from '@/lib/providers';

import './globals.css';
import { cn } from '@/lib/utils';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GaneshaGoods',
  description: 'OSKM ITB 2026',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('h-full', 'antialiased', geistMono.variable)}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
