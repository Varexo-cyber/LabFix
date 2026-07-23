import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reparatie Aanvragen - Telefoon & Tablet Reparatie Den Haag',
  description:
    'Reparatie aanvragen bij LabFix. Wij repareren iPhones, Samsung, iPads en meer. Ophalen in Den Haag en omstreken of opsturen. Snelle en professionele service.',
  alternates: {
    canonical: 'https://labfix.nl/repair',
  },
  openGraph: {
    title: 'Reparatie Aanvragen - LabFix',
    description:
      'Reparatie aanvragen bij LabFix. Ophalen in Den Haag of opsturen. Snelle en professionele service.',
    url: 'https://labfix.nl/repair',
  },
};

export default function RepairLayout({ children }: { children: React.ReactNode }) {
  return children;
}
