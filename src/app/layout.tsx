import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HelpWidget from '@/components/HelpWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LabFix - Professionele Telefoon & Tablet Onderdelen | Europa',
  description: 'LabFix - Leverancier van reparatieonderdelen voor smartphones en tablets. Levering door heel Europa.',
  keywords: 'telefoon onderdelen, iPhone scherm, Samsung onderdelen, iPad reparatie, MacBook onderdelen, Europa',
  icons: {
    icon: [
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
      <body className={`${inter.className} bg-gray-50`}>
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <HelpWidget />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
