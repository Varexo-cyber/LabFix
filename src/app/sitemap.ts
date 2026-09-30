import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';
import { brandCategories, accessoryCategories, standaloneCategories } from '@/lib/categories';

export const runtime = 'nodejs';
export const revalidate = 3600; // Regenerate every hour

const BASE_URL = 'https://labfix.nl';

// Bewust NIET in de sitemap: inloggen, registreren, winkelwagen, afrekenen,
// het adminpaneel en de onderhoudspagina. Die staan in robots.txt of op
// noindex; ze hier toch aanbieden geeft Google tegenstrijdige signalen en
// levert niets op in de zoekresultaten.

const staticPages: Array<{
  path: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}> = [
  { path: '', changeFrequency: 'daily', priority: 1.0 },
  { path: '/products', changeFrequency: 'daily', priority: 0.9 },
  { path: '/repair', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/nieuws', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/shipping', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/returns', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/garantie', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/algemene-voorwaarden', changeFrequency: 'yearly', priority: 0.2 },
];

type Entry = MetadataRoute.Sitemap[number];

// Dezelfde URL kan uit twee bronnen komen: de categorieboom en de database.
// Deze verzameling houdt per URL de nieuwste datum en de hoogste prioriteit,
// zodat er geen dubbele regels in de sitemap belanden.
class UrlSet {
  private map = new Map<string, Entry>();

  add(url: string, lastModified: Date, changeFrequency: Entry['changeFrequency'], priority: number) {
    const existing = this.map.get(url);
    if (existing) {
      const existingDate = existing.lastModified ? new Date(existing.lastModified as Date) : new Date(0);
      if (lastModified > existingDate) existing.lastModified = lastModified;
      if ((existing.priority ?? 0) < priority) existing.priority = priority;
      return;
    }
    this.map.set(url, { url, lastModified, changeFrequency, priority });
  }

  toArray(): MetadataRoute.Sitemap {
    return Array.from(this.map.values()).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }
}

// De shop filtert via queryparameters. Hier worden exact dezelfde URL's
// gebouwd als die het menu en de sidebar gebruiken, zodat Google op precies
// dezelfde pagina uitkomt als een bezoeker.
function brandUrl(brand: string, sub?: string, model?: string): string {
  const params = new URLSearchParams({ brand });
  if (sub) params.set('sub', sub);
  if (model) params.set('model', model);
  return `${BASE_URL}/products?${params.toString()}`;
}

function accessoryUrl(accessory: string, sub?: string): string {
  const params = new URLSearchParams({ accessory });
  if (sub) params.set('sub', sub);
  return `${BASE_URL}/products?${params.toString()}`;
}

interface ProductGroup {
  brand: string;
  sub: string;
  model: string;
  last: Date;
}

// Producten staan in twee vormen in de database: oudere rijen hebben het hele
// pad in category ("apple/iphone/iphone-17-pro"), nieuwere hebben category,
// subcategory en model als losse kolommen. Beide vormen worden hier gelezen.
function normaliseGroup(row: any, fallback: Date): ProductGroup | null {
  const rawCategory = String(row.category || '');
  if (!rawCategory) return null;

  const parts = rawCategory.split('/').filter(Boolean);
  const brand = parts[0] || '';
  if (!brand) return null;

  const sub = parts[1] || String(row.subcategory || '');
  const model = parts[2] || String(row.model || '');

  const parsed = row.last ? new Date(row.last) : fallback;
  return { brand, sub, model, last: isNaN(parsed.getTime()) ? fallback : parsed };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const urls = new UrlSet();

  for (const page of staticPages) {
    urls.add(`${BASE_URL}${page.path}`, now, page.changeFrequency, page.priority);
  }

  // Repair Tools en andere losse top-level categorieën
  for (const cat of standaloneCategories) {
    urls.add(`${BASE_URL}/products?category=${cat.slug}`, now, 'weekly', 0.7);
  }

  // Merken en productlijnen uit de categorieboom. Dit zijn echte
  // landingspagina's, ook als de voorraad daarin wisselt.
  for (const brand of brandCategories) {
    urls.add(brandUrl(brand.slug), now, 'weekly', 0.8);
    for (const sub of brand.subcategories) {
      urls.add(brandUrl(brand.slug, sub.slug), now, 'weekly', 0.7);
    }
  }

  for (const acc of accessoryCategories) {
    urls.add(accessoryUrl(acc.slug), now, 'weekly', 0.7);
    for (const sub of acc.subcategories) {
      urls.add(accessoryUrl(acc.slug, sub.slug), now, 'weekly', 0.6);
    }
  }

  try {
    const sql = getDb();

    // Losse productpagina's. De status-kolom ontbreekt in databases die via
    // /api/init-db zijn aangemaakt, dus eerst mét en anders zonder, en het
    // filteren in JavaScript. Zonder die terugval bleef de sitemap leeg.
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

    for (const p of products as any[]) {
      if (p.status && p.status !== 'active') continue;
      const last = new Date(p.updated_at || p.created_at || now);
      urls.add(`${BASE_URL}/products/${p.id}`, isNaN(last.getTime()) ? now : last, 'weekly', 0.7);
    }

    // Modelpagina's alleen aanbieden als er ook echt producten op staan. Een
    // lege modelpagina is een dunne pagina en kost alleen crawlbudget; er zijn
    // ruim 700 modellen in de boom en die wil je niet allemaal blind opvoeren.
    const groups = await sql`
      SELECT category, subcategory, model, MAX(COALESCE(updated_at, created_at)) AS last
      FROM products
      WHERE category IS NOT NULL AND category <> ''
      GROUP BY category, subcategory, model
    `;

    for (const row of groups as any[]) {
      const g = normaliseGroup(row, now);
      if (!g) continue;

      if (g.brand.startsWith('acc-')) {
        urls.add(accessoryUrl(g.brand.slice(4), g.sub || undefined), g.last, 'weekly', 0.6);
        continue;
      }

      urls.add(brandUrl(g.brand), g.last, 'weekly', 0.8);
      if (g.sub) urls.add(brandUrl(g.brand, g.sub), g.last, 'weekly', 0.7);
      if (g.sub && g.model) urls.add(brandUrl(g.brand, g.sub, g.model), g.last, 'weekly', 0.75);
    }
  } catch (error) {
    // Zonder database blijft de sitemap met de vaste pagina's en de
    // categorieboom overeind, in plaats van helemaal leeg te raken.
    console.error('Sitemap: kon producten niet ophalen', error);
  }

  return urls.toArray();
}
