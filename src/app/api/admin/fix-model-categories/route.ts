import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { isKnownModelSlug } from '@/lib/categories';

export const runtime = 'nodejs';

// Repairs products that were imported while the import route read the third
// level of a device path (apple/iphone/iphone-18-pro) as a BRAND instead of a
// MODEL. Those rows ended up as:
//
//   category = 'apple', subcategory = 'iphone', brand = 'iphone-18-pro', model = ''
//
// which matches nothing on the model page in the shop, so the products stayed
// invisible even though the import reported success. This moves the model slug
// from `brand` into `model` and puts the real brand back in `brand`.
//
// Deterministic: only rows whose `brand` value is a real model slug of their
// own category/subcategory in the category tree are touched.

interface Candidate {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  fromBrand: string;
  model: string;
}

async function findCandidates(sql: any, limit: number): Promise<Candidate[]> {
  const rows = await sql`
    SELECT id, name, category, subcategory, brand, model
    FROM products
    WHERE (model IS NULL OR model = '')
      AND brand IS NOT NULL
      AND brand <> ''
    LIMIT ${limit}
  `;

  return (rows as any[])
    .filter((p) => isKnownModelSlug(p.category, p.subcategory, p.brand))
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      fromBrand: p.brand,
      model: p.brand,
    }));
}

// Preview what would change.
export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    const limit = Math.min(50000, parseInt(new URL(request.url).searchParams.get('limit') || '50000'));
    const candidates = await findCandidates(sql, limit);

    return NextResponse.json({
      success: true,
      total: candidates.length,
      sample: candidates.slice(0, 25),
      message: `${candidates.length} producten met een modelslug in het brand-veld gevonden`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Apply the repair. POST { "dryRun": true } to see the plan without writing.
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const { dryRun = false, limit = 50000 } = await request.json().catch(() => ({}));
    const candidates = await findCandidates(sql, limit);

    if (!dryRun) {
      for (const c of candidates) {
        await sql`
          UPDATE products
          SET model = ${c.model}, brand = ${c.category}, updated_at = NOW()
          WHERE id = ${c.id}
        `;
      }
    }

    return NextResponse.json({
      success: true,
      dryRun,
      updated: candidates.length,
      sample: candidates.slice(0, 25),
      message: dryRun
        ? `Dry run: ${candidates.length} producten zouden worden hersteld`
        : `${candidates.length} producten hersteld`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
