import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Over LabFix - Professionele Reparatie & Onderdelen',
  description:
    'LabFix is jouw betrouwbare partner voor telefoon en tablet onderdelen en reparaties. Met jaren ervaring leveren we kwaliteit door heel Europa.',
  alternates: {
    canonical: 'https://labfix.nl/about',
  },
  openGraph: {
    title: 'Over LabFix',
    description:
      'LabFix - jouw betrouwbare partner voor telefoon en tablet onderdelen en reparaties.',
    url: 'https://labfix.nl/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
