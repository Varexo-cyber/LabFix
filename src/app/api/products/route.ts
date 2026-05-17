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
      original_price DECIMAL(10,2),
      compare_price DECIMAL(10,2),
      category TEXT NOT NULL,
      subcategory TEXT DEFAULT '',
      model TEXT DEFAULT '',
      brand TEXT DEFAULT '',
      sku TEXT UNIQUE NOT NULL,
      image TEXT DEFAULT '',
      images TEXT[] DEFAULT '{}',
      in_stock BOOLEAN DEFAULT true,
      stock INTEGER DEFAULT 0,
      featured BOOLEAN DEFAULT false,
      is_new BOOLEAN DEFAULT false,
      status TEXT DEFAULT 'active',
      condition TEXT DEFAULT 'new',
      compatible_models TEXT[] DEFAULT '{}',
      ms_sku TEXT,
      ms_source TEXT,
      ms_last_sync TIMESTAMP,
      sort_order INTEGER DEFAULT 100,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  try { await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 100`; } catch {}
  try { await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS model TEXT DEFAULT ''`; } catch {}
  // Indexes for fast filtering
  try { await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products (category)`; } catch {}
  try { await sql`CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products (subcategory)`; } catch {}
  try { await sql`CREATE INDEX IF NOT EXISTS idx_products_model ON products (model)`; } catch {}
  try { await sql`CREATE INDEX IF NOT EXISTS idx_products_featured ON products (featured) WHERE featured = true`; } catch {}
  try { await sql`CREATE INDEX IF NOT EXISTS idx_products_is_new ON products (is_new) WHERE is_new = true`; } catch {}
  try { await sql`CREATE INDEX IF NOT EXISTS idx_products_sort ON products (sort_order ASC, created_at DESC)`; } catch {}
}

export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const { searchParams } = new URL(request.url);

    // Single product by ID — fast path for detail page
    const singleId = searchParams.get('id');
    if (singleId) {
      const rows = await sql`SELECT * FROM products WHERE id = ${singleId} LIMIT 1`;
      if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const p = rows[0];
      return NextResponse.json({
        id: p.id, name: p.name, nameEn: p.name_en, description: p.description, descriptionEn: p.description_en,
        price: parseFloat(p.price), comparePrice: p.compare_price ? parseFloat(p.compare_price) : undefined,
        category: p.category, subcategory: p.subcategory || '', model: p.model || '',
        sku: p.sku, image: p.image, images: p.images || [], inStock: p.in_stock,
        featured: p.featured, isNew: p.is_new, createdAt: p.created_at,
      });
    }

    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const model = searchParams.get('model');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const isNew = searchParams.get('isNew');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '24')));
    const offset = (page - 1) * limit;

    let rows: any[];
    let totalRows: any[];

    if (model) {
      const subFilter = subcategory || '';
      const catFilter = category || '';
      // Full category path: e.g. "apple/iphone/iphone-17-pro-max"
      const fullPath = catFilter && subFilter ? `${catFilter}/${subFilter}/${model}` : model;
      const fullPathLike = fullPath + '%';
      // Also try name search as fallback
      const modelNameSearch = '%' + model.replace(/-/g, ' ') + '%';
      [rows, totalRows] = await Promise.all([
        sql`SELECT * FROM products WHERE category = ${fullPath} OR category LIKE ${fullPathLike} OR model = ${model} OR LOWER(name) LIKE ${modelNameSearch} OR LOWER(name_en) LIKE ${modelNameSearch} ORDER BY sort_order ASC, created_at DESC LIMIT ${limit} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS count FROM products WHERE category = ${fullPath} OR category LIKE ${fullPathLike} OR model = ${model} OR LOWER(name) LIKE ${modelNameSearch} OR LOWER(name_en) LIKE ${modelNameSearch}`,
      ]);
    } else if (subcategory) {
      // Match on full path "apple/iphone" OR "apple/iphone/..." OR subcategory field
      const subPath = category ? `${category}/${subcategory}` : subcategory;
      const subPathLike = subPath + '/%';
      if (category) {
        [rows, totalRows] = await Promise.all([
          sql`SELECT * FROM products WHERE category = ${subPath} OR category LIKE ${subPathLike} OR (category = ${category} AND subcategory = ${subcategory}) ORDER BY sort_order ASC, created_at DESC LIMIT ${limit} OFFSET ${offset}`,
          sql`SELECT COUNT(*)::int AS count FROM products WHERE category = ${subPath} OR category LIKE ${subPathLike} OR (category = ${category} AND subcategory = ${subcategory})`,
        ]);
      } else {
        const subPathLike2 = '%/' + subcategory + '/%';
        [rows, totalRows] = await Promise.all([
          sql`SELECT * FROM products WHERE subcategory = ${subcategory} OR category LIKE ${subPathLike2} ORDER BY sort_order ASC, created_at DESC LIMIT ${limit} OFFSET ${offset}`,
          sql`SELECT COUNT(*)::int AS count FROM products WHERE subcategory = ${subcategory} OR category LIKE ${subPathLike2}`,
        ]);
      }
    } else if (category) {
      // Support hierarchical categories: exact match OR starts with category/
      const likePattern = category + '/%';
      [rows, totalRows] = await Promise.all([
        sql`SELECT * FROM products WHERE category = ${category} OR category LIKE ${likePattern} ORDER BY sort_order ASC, created_at DESC LIMIT ${limit} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS count FROM products WHERE category = ${category} OR category LIKE ${likePattern}`,
      ]);
    } else if (search) {
      const q = '%' + search.toLowerCase() + '%';
      [rows, totalRows] = await Promise.all([
        sql`SELECT * FROM products WHERE LOWER(name) LIKE ${q} OR LOWER(sku) LIKE ${q} OR LOWER(description) LIKE ${q} ORDER BY sort_order ASC, created_at DESC LIMIT ${limit} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS count FROM products WHERE LOWER(name) LIKE ${q} OR LOWER(sku) LIKE ${q} OR LOWER(description) LIKE ${q}`,
      ]);
    } else if (featured === 'true') {
      [rows, totalRows] = await Promise.all([
        sql`SELECT * FROM products WHERE featured = true ORDER BY sort_order ASC, created_at DESC LIMIT ${limit} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS count FROM products WHERE featured = true`,
      ]);
    } else if (isNew === 'true') {
      [rows, totalRows] = await Promise.all([
        sql`SELECT * FROM products WHERE is_new = true ORDER BY sort_order ASC, created_at DESC LIMIT ${limit} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS count FROM products WHERE is_new = true`,
      ]);
    } else {
      [rows, totalRows] = await Promise.all([
        sql`SELECT * FROM products ORDER BY sort_order ASC, created_at DESC LIMIT ${limit} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS count FROM products`,
      ]);
    }

    const total: number = totalRows[0]?.count ?? rows.length;

    const mapped = rows.map((p: any) => ({
      id: p.id,
      name: p.name,
      nameEn: p.name_en,
      description: p.description,
      descriptionEn: p.description_en,
      price: parseFloat(p.price),
      comparePrice: p.compare_price ? parseFloat(p.compare_price) : undefined,
      category: p.category,
      subcategory: p.subcategory || '',
      model: p.model || '',
      sku: p.sku,
      image: p.image,
      images: p.images || [],
      inStock: p.in_stock,
      featured: p.featured,
      isNew: p.is_new,
      createdAt: p.created_at,
    }));

    return NextResponse.json({
      products: mapped,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
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
      INSERT INTO products (id, name, name_en, description, description_en, price, compare_price, category, subcategory, model, sku, image, images, in_stock, featured, is_new)
      VALUES (${id}, ${body.name}, ${body.nameEn || ''}, ${body.description || ''}, ${body.descriptionEn || ''}, ${body.price}, ${body.comparePrice || null}, ${body.category}, ${body.subcategory || ''}, ${body.model || ''}, ${body.sku}, ${body.image || ''}, ${body.images || []}, ${body.inStock ?? true}, ${body.featured ?? false}, ${body.isNew ?? false})
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
        model = ${body.model || ''},
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
