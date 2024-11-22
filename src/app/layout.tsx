import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import './marae.scss';
import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Punahiko Marae: Energy Independence Game',
  description:
    'Punahiko Marae is an interactive educational game that challenges players to meet the energy needs of a fictional Māori community. Explore renewable energy options like hydroelectric, wind, solar, and geothermal, and learn about energy independence in Aotearoa New Zealand.',
  viewport: 'width=device-width, initial-scale=1.0',
  keywords:
    'Punahiko Marae, educational game, renewable energy, Māori community, energy independence, hydroelectric, solar, wind, geothermal',
  authors: [
    { name: 'Galactic Polymath', url: 'https://www.galacticpolymath.com/' },
    { name: 'MonkeyJump Labs', url: 'https://www.monkeyjumplabs.com/' },
  ],
  alternates: {
    canonical: 'https://energy-app.galacticpolymath.com/',
  },
  openGraph: {
    locale: 'en_US',
    siteName: 'Punahiko Marae',
  },
  twitter: {
    title: 'Punahiko Marae: Energy Independence Game',
    description:
      'Explore renewable energy options and help a Māori community achieve energy independence in this educational game.',
    card: 'summary_large_image',
    images: ['https://energy-app.galacticpolymath.com/meta.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="text-foreground bg-gray-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Game',
              name: 'Punahiko Marae',
              description:
                'An interactive game exploring energy independence through renewable and fossil fuel options, inspired by Māori communities in New Zealand.',
              url: 'https://energy-app.galacticpolymath.com/',
              image: 'https://energy-app.galacticpolymath.com/meta.png',
              publisher: {
                '@type': 'Organization',
                name: 'Galactic Polymath',
                url: 'https://www.galacticpolymath.com',
              },
              educationalUse: 'Game-based Learning',
              inLanguage: 'en-US',
            }),
          }}
        ></script>
        {children}
      </body>

      <GoogleAnalytics gaId="G-39WEKS8LXC" />
    </html>
  );
}
