import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { ensureImagesTable, parseDataUrl } from '@/lib/product-images';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Zet bestaande data:-afbeeldingen om naar een echte URL op /api/images/<id>.
//
// Niets wordt weggegooid: de bytes gaan ongewijzigd naar product_images en
// products.image gaat van de data:-URL naar de nieuwe URL. Hetzelfde plaatje,
// alleen nu op een adres dat Google kan ophalen. Draai je hem twee keer, dan
// vindt de tweede run niets meer — alleen rijen die nog met "data:" beginnen
// worden aangeraakt.

interface Converted {
  id: string;
  name: string;
  url: string;
}

async function convert(sql: any, limit: number, dryRun: boolean) {
  await ensureImagesTable(sql);

  const rows = await sql`
    SELECT id, name, image
    FROM products
    WHERE image LIKE 'data:%'
    LIMIT ${limit}
  `;

  const converted: Converted[] = [];
  const failed: Array<{ id: string; reason: string }> = [];

  for (const p of rows as any[]) {
    const parsed = parseDataUrl(p.image);
    if (!parsed) {
      failed.push({ id: p.id, reason: 'geen geldige data-URL' });
      continue;
    }

    const imageId = crypto.randomUUID();
    const url = `/api/images/${imageId}`;

    if (!dryRun) {
      await sql`INSERT INTO product_images (id, mime, data) VALUES (${imageId}, ${parsed.mime}, ${parsed.data})`;
      await sql`UPDATE products SET image = ${url}, updated_at = NOW() WHERE id = ${p.id}`;
    }

    converted.push({ id: p.id, name: p.name, url });
  }

  return { converted, failed };
}

// Preview: hoeveel producten hebben nog een data:-afbeelding?
export async function GET() {
  try {
    const sql = getDb();
    const countRows = await sql`SELECT COUNT(*)::int AS count FROM products WHERE image LIKE 'data:%'`;
    const total = countRows[0]?.count || 0;

    const sample = await sql`
      SELECT id, name, LENGTH(image) AS bytes
      FROM products
      WHERE image LIKE 'data:%'
      LIMIT 25
    `;

    return NextResponse.json({
      success: true,
      total,
      sample,
      message: `${total} producten hebben nog een ingebakken afbeelding`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Uitvoeren. POST { "dryRun": true } om eerst te kijken zonder te schrijven.
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const { dryRun = false, limit = 500 } = await request.json().catch(() => ({}));

    const { converted, failed } = await convert(sql, limit, dryRun);

    const remainingRows = await sql`SELECT COUNT(*)::int AS count FROM products WHERE image LIKE 'data:%'`;

    return NextResponse.json({
      success: true,
      dryRun,
      converted: converted.length,
      failed: failed.length,
      failedDetails: failed.slice(0, 20),
      remaining: remainingRows[0]?.count ?? 0,
      sample: converted.slice(0, 20),
      message: dryRun
        ? `Dry run: ${converted.length} afbeeldingen zouden worden omgezet`
        : `${converted.length} afbeeldingen omgezet naar een echte URL`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
