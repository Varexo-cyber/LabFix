import { Metadata } from 'next';
import { cache } from 'react';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';

type Props = { params: { id: string } };

const SITE_URL = 'https://labfix.nl';

interface ProductRow {
  name: string | null;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  brand: string | null;
  model: string | null;
  category: string | null;
  sku: string | null;
  price: string | number | null;
  image: string | null;
  in_stock: boolean | null;
}

// generateMetadata en de layout hebben allebei hetzelfde product nodig.
// cache() zorgt dat de query per render maar één keer draait.
const getProduct = cache(async (id: string): Promise<ProductRow | null> => {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT name, name_en, description, description_en, brand, model, category,
             sku, price, image, in_stock
      FROM products
      WHERE id = ${id}
      LIMIT 1
    `;
    return (rows[0] as ProductRow) || null;
  } catch {
    return null;
  }
});

function stripHtml(value: string): string {
  return String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function absoluteUrl(path: string): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const p = await getProduct(id);

  let name = 'Product';
  let description = 'Bekijk dit reparatieonderdeel bij LabFix - telefoon en tablet onderdelen met snelle levering door heel Europa.';

  if (p) {
    name = p.name || p.name_en || 'Product';
    description = stripHtml(p.description || p.description_en || '') || description;
    if (p.brand) name = `${p.brand} ${name}`;
  }

  const title = `${name} Kopen? - LabFix Onderdelen`;
  const url = `${SITE_URL}/products/${id}`;
  const image = p?.image ? absoluteUrl(p.image) : '';

  return {
    title,
    description: description.slice(0, 160),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      title,
      description: description.slice(0, 160),
      url,
      siteName: 'LabFix',
      ...(image && !image.startsWith('data:') ? { images: [image] } : {}),
    },
    twitter: {
      card: 'summary',
      title,
      description: description.slice(0, 160),
    },
  };
}

export default async function ProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const p = await getProduct(params.id);

  // Product-schema in de HTML die de server verstuurt. De pagina zelf haalt
  // zijn gegevens pas in de browser op, dus zonder dit blok staat er bij een
  // crawl geen enkel hard feit over het product in de bron: geen naam, geen
  // prijs, geen voorraad. Dat is precies wat Google nodig heeft om een
  // productpagina de moeite van het indexeren waard te vinden, en om prijs en
  // voorraad in de zoekresultaten te kunnen tonen.
  //
  // De prijs is dezelfde waarde als in de Merchant-feed. Wijken die twee van
  // elkaar af, dan keurt Merchant Center het product af.
  let jsonLd: string | null = null;

  if (p) {
    const name = p.name || p.name_en || 'Product';
    const description = stripHtml(p.description || p.description_en || '') || name;
    const image = p.image ? absoluteUrl(p.image) : '';
    const price = p.price != null ? Number(p.price) : null;

    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description: description.slice(0, 500),
      url: `${SITE_URL}/products/${params.id}`,
      ...(image && !image.startsWith('data:') ? { image: [image] } : {}),
      ...(p.sku ? { sku: p.sku, mpn: p.sku } : {}),
      ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
    };

    if (price != null && !Number.isNaN(price) && price > 0) {
      data.offers = {
        '@type': 'Offer',
        url: `${SITE_URL}/products/${params.id}`,
        price: price.toFixed(2),
        priceCurrency: 'EUR',
        itemCondition: 'https://schema.org/NewCondition',
        availability: p.in_stock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: 'LabFix' },
      };
    }

    jsonLd = JSON.stringify(data);
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      {children}
    </>
  );
}
