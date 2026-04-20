import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = getDb();
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
