import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import LayoutWrapper from '@/components/LayoutWrapper';
import StructuredData from '@/components/StructuredData';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = 'https://labfix.nl';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'LabFix - Telefoon & Tablet Onderdelen | Reparatie | Europa',
    template: '%s | LabFix',
  },
  description:
    'LabFix - Jouw betrouwbare leverancier van smartphone en tablet reparatieonderdelen. iPhone schermen, Samsung onderdelen, iPad delen en meer. Snelle levering door heel Europa. Ook professionele reparaties in Den Haag.',
  keywords: [
    'telefoon onderdelen',
    'iPhone scherm',
    'iPhone reparatie',
    'Samsung onderdelen',
    'Samsung scherm',
    'iPad reparatie',
    'iPad onderdelen',
    'MacBook onderdelen',
    'telefoon reparatie',
    'tablet reparatie',
    'scherm vervangen',
    'batterij vervangen',
    'beschermglas',
    'screen protector',
    'telefoon accessoires',
    'reparatie onderdelen',
    'LabFix',
    'mobiele reparatie',
    'smartphone reparatie',
    'Den Haag reparatie',
  ],
  authors: [{ name: 'LabFix' }],
  creator: 'LabFix',
  publisher: 'LabFix',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'nl-NL': SITE_URL,
      'x-default': SITE_URL,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: SITE_URL,
    siteName: 'LabFix',
    title: 'LabFix - Telefoon & Tablet Onderdelen | Reparatie | Europa',
    description:
      'Jouw betrouwbare leverancier van smartphone en tablet reparatieonderdelen. Snelle levering door heel Europa. Professionele reparaties in Den Haag.',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'LabFix Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LabFix - Telefoon & Tablet Onderdelen | Reparatie',
    description:
      'Jouw betrouwbare leverancier van smartphone en tablet reparatieonderdelen. Snelle levering door heel Europa.',
    images: ['/logo.png'],
  },
  category: 'technology',
  icons: {
    icon: [
      { url: '/logo.png', sizes: '64x64', type: 'image/png' },
      { url: '/logo.png', sizes: '48x48', type: 'image/png' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
      { url: '/logo.png', sizes: '152x152', type: 'image/png' },
      { url: '/logo.png', sizes: '120x120', type: 'image/png' },
    ],
    shortcut: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
      </head>
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        <StructuredData />
        <AppProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
