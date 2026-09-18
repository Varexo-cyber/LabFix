import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Google haalt de feed hooguit een paar keer per dag op; een uur cache scheelt
// een volledige tabelscan bij elke crawl.
export const revalidate = 3600;

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://labfix.nl').replace(/\/$/, '');

// Google Shopping eist geldige XML: deze vijf tekens moeten ge-escaped worden.
function xmlEscape(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(value: string): string {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Absolute URL — Google weigert relatieve paden voor link en image_link.
function absoluteUrl(path: string): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function GET() {
  try {
    const sql = getDb();

    // Alleen producten die Google kan tonen: een naam, een prijs boven nul en
    // een afbeelding. Base64 data-URLs kan Google niet ophalen, dus die vallen af.
    const rows = await sql`
      SELECT id, name, name_en, description, description_en, price, category,
             subcategory, model, brand, sku, image, in_stock
      FROM products
      WHERE name IS NOT NULL AND name <> ''
        AND price > 0
      ORDER BY sort_order ASC, created_at DESC
    `;

    const items: string[] = [];

    for (const p of rows as any[]) {
      const image = absoluteUrl(p.image || '');
      // Google haalt de afbeelding zelf op; een data-URL werkt daar niet.
      if (!image || image.startsWith('data:')) continue;

      const title = stripHtml(p.name).slice(0, 150);
      const description = stripHtml(p.description || p.description_en || p.name).slice(0, 5000);
      const price = Number(p.price).toFixed(2);
      const availability = p.in_stock ? 'in_stock' : 'out_of_stock';
      const brand = stripHtml(p.brand || 'LabFix');
      const link = `${BASE_URL}/products/${p.id}`;

      items.push(`    <item>
      <g:id>${xmlEscape(p.sku || p.id)}</g:id>
      <g:title>${xmlEscape(title)}</g:title>
      <g:description>${xmlEscape(description)}</g:description>
      <g:link>${xmlEscape(link)}</g:link>
      <g:image_link>${xmlEscape(image)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${price} EUR</g:price>
      <g:brand>${xmlEscape(brand)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:mpn>${xmlEscape(p.sku || p.id)}</g:mpn>
      <g:product_type>${xmlEscape([p.category, p.subcategory, p.model].filter(Boolean).join(' &gt; '))}</g:product_type>
    </item>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>LabFix</title>
    <link>${xmlEscape(BASE_URL)}</link>
    <description>Telefoon-, tablet- en laptoponderdelen van LabFix</description>
${items.join('\n')}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
