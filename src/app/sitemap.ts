import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';
export const revalidate = 3600; // Regenerate every hour

const BASE_URL = 'https://labfix.nl';

// All static pages with their priority and change frequency
const staticPages: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/products`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/repair`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/faq`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/shipping`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/returns`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/garantie`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/privacy-policy`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.2,
  },
  {
    url: `${BASE_URL}/algemene-voorwaarden`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.2,
  },
  // Inloggen en registreren staan bewust NIET in de sitemap: robots.txt
  // verbiedt /account/* al, dus Google kreeg hier twee tegenstrijdige
  // signalen en meldde ze als gevonden maar niet gecrawld.
  {
    url: `${BASE_URL}/nieuws`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = [...staticPages];

  // Productpagina's uit de database.
  //
  // Dit ging fout: de query filterde op products.status, maar die kolom bestaat
  // niet in databases die door /api/init-db zijn aangemaakt. De query gooide dan
  // "column status does not exist", de catch hieronder slikte dat, en de sitemap
  // bevatte stilletjes alleen de vaste pagina's. Google zag daardoor geen enkele
  // productpagina. Daarom eerst met status proberen en anders zonder, en het
  // filteren in JavaScript doen.
  try {
    const sql = getDb();
    let products: any[];
    try {
      products = await sql`
        SELECT id, updated_at, created_at, status
        FROM products
        ORDER BY created_at DESC
        LIMIT 45000
      `;
    } catch {
      products = await sql`
        SELECT id, updated_at, created_at
        FROM products
        ORDER BY created_at DESC
        LIMIT 45000
      `;
    }

    // Zonder status-kolom telt elk product als actief.
    products = products.filter((p: any) => !p.status || p.status === 'active');

    for (const p of products) {
      entries.push({
        url: `${BASE_URL}/products/${p.id}`,
        lastModified: new Date(p.updated_at || p.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error('Sitemap: failed to fetch products', error);
  }

  return entries;
}
