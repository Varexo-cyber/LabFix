import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

// Ensure table exists
async function ensureTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT DEFAULT '',
      description TEXT DEFAULT '',
      description_en TEXT DEFAULT '',
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      compare_price DECIMAL(10,2),
      category TEXT NOT NULL,
      subcategory TEXT DEFAULT '',
      sku TEXT UNIQUE NOT NULL,
      image TEXT DEFAULT '',
      images TEXT[] DEFAULT '{}',
      in_stock BOOLEAN DEFAULT true,
      featured BOOLEAN DEFAULT false,
      is_new BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const isNew = searchParams.get('isNew');

    let products;
    if (category) {
      products = await sql`SELECT * FROM products WHERE category = ${category} ORDER BY created_at DESC`;
    } else if (search) {
      products = await sql`SELECT * FROM products WHERE LOWER(name) LIKE ${'%' + search.toLowerCase() + '%'} OR LOWER(sku) LIKE ${'%' + search.toLowerCase() + '%'} ORDER BY created_at DESC`;
    } else if (featured === 'true') {
      products = await sql`SELECT * FROM products WHERE featured = true ORDER BY created_at DESC`;
    } else if (isNew === 'true') {
      products = await sql`SELECT * FROM products WHERE is_new = true ORDER BY created_at DESC`;
    } else {
      products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    }

    const mapped = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      nameEn: p.name_en,
      description: p.description,
      descriptionEn: p.description_en,
      price: parseFloat(p.price),
      comparePrice: p.compare_price ? parseFloat(p.compare_price) : undefined,
      category: p.category,
      subcategory: p.subcategory || '',
      sku: p.sku,
      image: p.image,
      images: p.images || [],
      inStock: p.in_stock,
      featured: p.featured,
      isNew: p.is_new,
      createdAt: p.created_at,
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const body = await request.json();
    const id = randomUUID();

    await sql`
      INSERT INTO products (id, name, name_en, description, description_en, price, compare_price, category, subcategory, sku, image, images, in_stock, featured, is_new)
      VALUES (${id}, ${body.name}, ${body.nameEn || ''}, ${body.description || ''}, ${body.descriptionEn || ''}, ${body.price}, ${body.comparePrice || null}, ${body.category}, ${body.subcategory || ''}, ${body.sku}, ${body.image || ''}, ${body.images || []}, ${body.inStock ?? true}, ${body.featured ?? false}, ${body.isNew ?? false})
    `;

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const body = await request.json();

    await sql`
      UPDATE products SET
        name = ${body.name},
        name_en = ${body.nameEn || ''},
        description = ${body.description || ''},
        description_en = ${body.descriptionEn || ''},
        price = ${body.price},
        compare_price = ${body.comparePrice || null},
        category = ${body.category},
        subcategory = ${body.subcategory || ''},
        sku = ${body.sku},
        image = ${body.image || ''},
        images = ${body.images || []},
        in_stock = ${body.inStock ?? true},
        featured = ${body.featured ?? false},
        is_new = ${body.isNew ?? false}
      WHERE id = ${body.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await sql`DELETE FROM products WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
