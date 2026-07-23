import React from 'react';

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://labfix.nl/#business',
  name: 'LabFix',
  legalName: 'LabFix',
  description:
    'LabFix - Leverancier van reparatieonderdelen voor smartphones en tablets. Snelle levering door heel Europa. Ook professionele reparaties in Den Haag en omstreken.',
  url: 'https://labfix.nl',
  logo: 'https://labfix.nl/logo.png',
  image: 'https://labfix.nl/logo.png',
  email: 'info@labfix.nl',
  telephone: '+31 6 5113 1133',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NL',
    addressRegion: 'Zuid-Holland',
    addressLocality: 'Den Haag',
  },
  vatID: 'NL005445900B06',
  kvkID: '42035906',
  priceRange: '€€',
  areaServed: {
    '@type': 'Place',
    name: 'Europa',
  },
  sameAs: [
    'https://labfix.nl',
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '11:00',
      closes: '18:00',
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://labfix.nl/#website',
  name: 'LabFix',
  url: 'https://labfix.nl',
  description:
    'LabFix - Professionele telefoon en tablet onderdelen en reparaties. Levering door heel Europa.',
  publisher: {
    '@type': 'Organization',
    name: 'LabFix',
    logo: {
      '@type': 'ImageObject',
      url: 'https://labfix.nl/logo.png',
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://labfix.nl/products?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hoe lang duurt een reparatie bij LabFix?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'De meeste reparaties worden binnen 30-60 minuten uitgevoerd. Voor complexere reparaties kan dit tot 24 uur duren.',
      },
    },
    {
      '@type': 'Question',
      name: 'Heb ik een afspraak nodig voor een reparatie?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, we werken op afspraak. Dit zorgt voor een snelle en persoonlijke service. Maak gemakkelijk een afspraak via onze website of neem contact met ons op.',
      },
    },
    {
      '@type': 'Question',
      name: 'Wat kost een schermreparatie?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'De prijs is afhankelijk van het merk en model. Bekijk onze reparatie pagina voor actuele prijzen of neem contact op.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is mijn data veilig tijdens reparatie?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, we behandelen je toestel en data met de grootste zorg. We raden wel aan om altijd een backup te maken voor de zekerheid.',
      },
    },
    {
      '@type': 'Question',
      name: 'Leveren jullie ook buiten Nederland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, LabFix levert reparatieonderdelen door heel Europa. Bestellingen boven €150 worden gratis verzonden binnen Nederland.',
      },
    },
  ],
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
