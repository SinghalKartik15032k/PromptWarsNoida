// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EthnoVibe | Gen AI Cultural Travel Discovery',
  description:
    'Discover hidden heritage, immersive lore, and live cultural events powered by Generative AI. EthnoVibe connects modern travelers with authentic local experiences.',
  keywords: ['cultural travel', 'AI travel', 'heritage discovery', 'hidden gems', 'cultural events', 'generative AI'],
  openGraph: {
    title: 'EthnoVibe | Gen AI Cultural Travel Discovery',
    description: 'AI-powered cultural travel platform for authentic heritage experiences.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
