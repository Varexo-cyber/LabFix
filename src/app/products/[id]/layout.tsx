import { Metadata } from 'next';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  let name = 'Product';
  let description = 'Bekijk dit reparatieonderdeel bij LabFix - telefoon en tablet onderdelen met snelle levering door heel Europa.';

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT name, name_en, description, description_en, brand, model, category
      FROM products
      WHERE id = ${id}
      LIMIT 1
    `;
    if (rows.length > 0) {
      const p = rows[0];
      name = p.name || p.name_en || 'Product';
      description = p.description || p.description_en || description;
      if (p.brand) name = `${p.brand} ${name}`;
    }
  } catch {
    // Fallback to defaults
  }

  const title = `${name} Kopen? - LabFix Onderdelen`;
  const url = `https://labfix.nl/products/${id}`;

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
    },
    twitter: {
      card: 'summary',
      title,
      description: description.slice(0, 160),
    },
  };
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
