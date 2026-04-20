import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LabFix - Professionele Telefoon & Tablet Onderdelen | Europa',
  description: 'LabFix - Leverancier van reparatieonderdelen voor smartphones en tablets. Levering door heel Europa.',
  keywords: 'telefoon onderdelen, iPhone scherm, Samsung onderdelen, iPad reparatie, MacBook onderdelen, Europa',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={`${inter.className} bg-gray-50 pt-32`}>
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
