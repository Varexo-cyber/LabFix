import type { Metadata } from 'next';

// De onderhoudspagina mag nooit in Google komen. Toen de onderhoudsmodus
// hardcoded aanstond wees elke URL hierheen; zonder deze regel kan die ene
// pagina in de index belanden namens de hele site.
export const metadata: Metadata = {
  title: 'Onderhoud - LabFix',
  robots: { index: false, follow: false },
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
