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
  {
    url: `${BASE_URL}/account/register`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/account/login`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/nieuws`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = [...staticPages];

  // Fetch all active products from DB for dynamic product URLs
  try {
    const sql = getDb();
    const products = await sql`
      SELECT id, name, updated_at, created_at
      FROM products
      WHERE status = 'active' OR status IS NULL
      ORDER BY created_at DESC
    `;

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
