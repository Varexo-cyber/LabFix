'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HelpWidget from '@/components/HelpWidget';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMaintenancePage = pathname === '/onderhoud';

  if (isMaintenancePage) {
    // Maintenance page - render children only (no header/footer/helpwidget)
    return (
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    );
  }

  // Normal pages - with header, footer, and helpwidget
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <HelpWidget />
    </div>
  );
}
