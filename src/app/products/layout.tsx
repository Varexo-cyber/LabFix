import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onderdelen Catalogus - iPhone, Samsung, iPad & Meer | LabFix',
  description:
    'Bekijk ons grote aanbod reparatieonderdelen voor iPhone, Samsung, iPad, MacBook en meer. Schermen, batterijen, beschermglas en accessoires. Snelle levering door heel Europa.',
  alternates: {
    canonical: 'https://labfix.nl/products',
  },
  openGraph: {
    title: 'Onderdelen Catalogus | LabFix',
    description:
      'Groot aanbod reparatieonderdelen voor iPhone, Samsung, iPad, MacBook en meer. Snelle levering door heel Europa.',
    url: 'https://labfix.nl/products',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
