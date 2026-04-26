'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HelpWidget from '@/components/HelpWidget';
import CookieConsent from '@/components/CookieConsent';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMaintenancePage = pathname === '/onderhoud';
  const isAdminPage = pathname === '/geheim-admin';

  if (isMaintenancePage) {
    // Maintenance page - render children only (no header/footer/helpwidget)
    return (
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    );
  }

  if (isAdminPage) {
    // Admin page - no header (no logo, search, nav), but keep footer and help widget
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <Footer />
        <HelpWidget />
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
      <CookieConsent />
    </div>
  );
}
