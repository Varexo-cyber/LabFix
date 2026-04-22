import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Ensure table exists
async function ensureTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image TEXT DEFAULT '',
      description TEXT DEFAULT '',
      description_en TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const categories = await sql`SELECT * FROM categories ORDER BY name`;

    const mapped = categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      nameEn: c.name_en,
      slug: c.slug,
      image: c.image,
      description: c.description,
      descriptionEn: c.description_en,
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
