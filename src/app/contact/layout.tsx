import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - LabFix | Telefoon & Tablet Onderdelen',
  description:
    'Neem contact op met LabFix voor vragen over onderdelen, reparaties of bestellingen. Bel +31 6 5113 1133 of stuur een bericht via ons contactformulier.',
  alternates: {
    canonical: 'https://labfix.nl/contact',
  },
  openGraph: {
    title: 'Contact - LabFix',
    description:
      'Neem contact op met LabFix voor vragen over onderdelen, reparaties of bestellingen.',
    url: 'https://labfix.nl/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
