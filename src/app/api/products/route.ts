import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// NL ↔ EN keyword translation for search
const KEYWORD_TRANSLATIONS: Record<string, string[]> = {
  'batterij': ['battery'], 'accu': ['battery'], 'battery': ['batterij', 'accu'],
  'scherm': ['screen', 'display', 'lcd', 'oled'], 'beeldscherm': ['screen', 'display'],
  'screen': ['scherm', 'beeldscherm'], 'display': ['scherm', 'beeldscherm'],
  'lcd': ['scherm'], 'oled': ['scherm'],
  'glas': ['glass'], 'glass': ['glas'],
  'achterkant': ['back cover', 'rear cover'], 'achterglas': ['back glass', 'rear glass'],
  'lader': ['charger'], 'oplader': ['charger'], 'charger': ['lader', 'oplader'],
  'kabel': ['cable'], 'cable': ['kabel'],
  'laadpoort': ['charging port'], 'oplaadpoort': ['charging port'],
  'charging port': ['laadpoort', 'oplaadpoort'],
  'speaker': ['luidspreker'], 'luidspreker': ['speaker'],
  'microfoon': ['microphone', 'mic'], 'microphone': ['microfoon'],
  'camera': ['camera'],
  'knop': ['button'], 'button': ['knop'],
  'moederbord': ['motherboard'], 'motherboard': ['moederbord'],
  'toetsenbord': ['keyboard'], 'keyboard': ['toetsenbord'],
  'hoesje': ['case', 'cover'], 'case': ['hoesje'],
  'beschermglas': ['tempered glass', 'screen protector'],
  'screenprotector': ['screen protector', 'tempered glass'],
  'koptelefoon': ['headphones', 'headset'], 'headphones': ['koptelefoon', 'oortjes'],
  'oortjes': ['earphones', 'earbuds'], 'earphones': ['oortjes'],
  'behuizing': ['housing', 'frame'], 'housing': ['behuizing'],
  'frame': ['behuizing', 'housing'],
};

function translateSearchWords(words: string[]): string[][] {
  return words.map(w => {
    const variants = new Set<string>([w]);
    if (KEYWORD_TRANSLATIONS[w]) KEYWORD_TRANSLATIONS[w].forEach(v => variants.add(v));
    return Array.from(variants);
  });
}

// Score a product for word-boundary relevance.
// Returns lower number = more relevant (0 = perfect).
// Penalises results where a model-like term (alphanumeric, e.g. "s22") appears as a prefix
// of a longer word in the product name (e.g. "s22ultra", "s22plus"), pushing exact matches up.
function wordBoundaryScore(name: string, nameEn: string, words: string[]): number {
  const combined = (name + ' ' + nameEn).toLowerCase();
  let penalty = 0;
  for (const word of words) {
    // Only apply boundary logic for model-like terms (letters+digits, no spaces, len >= 2)
    if (!/^[a-z0-9]+$/.test(word) || word.length < 2) continue;
    // Build a word-boundary regex: the term must be followed by space, punctuation, or end
    const exactBoundary = new RegExp(`(?<![a-z0-9])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`, 'i');
    const looseMatch = combined.includes(word);
    const exactMatch = exactBoundary.test(combined);
    if (looseMatch && !exactMatch) {
      // Term exists but NOT at a word boundary → strong penalty (substring of longer word)
      penalty += 100;
    }
  }
  return penalty;
}

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
  // VAT-applied flag: marks whether 21% BTW has already been added to the stored price (idempotent bulk action)
  try { await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS vat_applied BOOLEAN DEFAULT false`; } catch {}
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
        featured: p.featured, isNew: p.is_new, vatApplied: !!p.vat_applied, createdAt: p.created_at,
      });
    }

    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const model = searchParams.get('model');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const isNew = searchParams.get('isNew');
    const sort = searchParams.get('sort') || 'newest';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '24')));
    const offset = (page - 1) * limit;

    // Build ORDER BY clause based on sort parameter
    let orderBy: any;
    switch (sort) {
      case 'price-asc':
        orderBy = sql`price ASC`;
        break;
      case 'price-desc':
        orderBy = sql`price DESC`;
        break;
      case 'name':
        orderBy = sql`name ASC`;
        break;
      case 'newest':
      default:
        orderBy = sql`sort_order ASC, created_at DESC`;
        break;
    }

    let rows: any[];
    let totalRows: any[];

    if (model) {
      const subFilter = subcategory || '';
      const catFilter = category || '';
      // Full category path: e.g. "apple/iphone/iphone-17-pro-max"
      const fullPath = catFilter && subFilter ? `${catFilter}/${subFilter}/${model}` : model;
      // Laptops use the flat fields category=laptop-{brand}, subcategory={model}, model={part}.
      // Part slugs (e.g. "laptop-screens") are NOT unique per brand, so we must match
      // brand+model+part together — never a bare `model = ...` which would span all brands.
      if (catFilter.startsWith('laptop-')) {
        [rows, totalRows] = await Promise.all([
          sql`SELECT * FROM products WHERE category = ${fullPath} OR (category = ${catFilter} AND subcategory = ${subFilter} AND model = ${model}) ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
          sql`SELECT COUNT(*)::int AS count FROM products WHERE category = ${fullPath} OR (category = ${catFilter} AND subcategory = ${subFilter} AND model = ${model})`,
        ]);
      } else {
        // STRICT matching: only exact matches on category path OR exact model match
        // No LIKE patterns to avoid matching "s26" with "s26-plus" or "s26-ultra"
        [rows, totalRows] = await Promise.all([
          sql`SELECT * FROM products WHERE category = ${fullPath} OR model = ${model} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
          sql`SELECT COUNT(*)::int AS count FROM products WHERE category = ${fullPath} OR model = ${model}`,
        ]);
      }
    } else if (subcategory) {
      // Match on full path "apple/iphone" OR "apple/iphone/..." OR subcategory field
      const subPath = category ? `${category}/${subcategory}` : subcategory;
      const subPathLike = subPath + '/%';
      if (category) {
        [rows, totalRows] = await Promise.all([
          sql`SELECT * FROM products WHERE category = ${subPath} OR category LIKE ${subPathLike} OR (category = ${category} AND subcategory = ${subcategory}) ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
          sql`SELECT COUNT(*)::int AS count FROM products WHERE category = ${subPath} OR category LIKE ${subPathLike} OR (category = ${category} AND subcategory = ${subcategory})`,
        ]);
      } else {
        const subPathLike2 = '%/' + subcategory + '/%';
        [rows, totalRows] = await Promise.all([
          sql`SELECT * FROM products WHERE subcategory = ${subcategory} OR category LIKE ${subPathLike2} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
          sql`SELECT COUNT(*)::int AS count FROM products WHERE subcategory = ${subcategory} OR category LIKE ${subPathLike2}`,
        ]);
      }
    } else if (category) {
      // Support hierarchical categories: exact match OR starts with category/
      const likePattern = category + '/%';
      [rows, totalRows] = await Promise.all([
        sql`SELECT * FROM products WHERE category = ${category} OR category LIKE ${likePattern} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS count FROM products WHERE category = ${category} OR category LIKE ${likePattern}`,
      ]);
    } else if (search) {
      const words = search.toLowerCase().split(/\s+/).filter((w: string) => w.length > 1);
      if (words.length === 0) {
        rows = [];
        totalRows = [{ count: 0 }];
      } else {
        // Translate each word to NL+EN variants, build per-term ANY patterns
        const termVariantGroups = translateSearchWords(words);
        // For ILIKE ALL, we need one pattern per term that covers all its variants.
        // Strategy: for each term group, use ILIKE ANY(variants) joined with AND in SQL.
        // Since we can't dynamically build N AND clauses, we fetch candidates matching
        // the original terms (strict), then use JS scoring for translated variants.
        const originalPatterns = words.map((w: string) => `%${w}%`);
        const allVariantPatterns = termVariantGroups.flat().map(v => `%${v}%`);

        // Primary: AND on original words against combined name+name_en
        [rows, totalRows] = await Promise.all([
          sql`SELECT * FROM products WHERE (LOWER(name) || ' ' || LOWER(name_en)) ILIKE ALL(${originalPatterns}) ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
          sql`SELECT COUNT(*)::int AS count FROM products WHERE (LOWER(name) || ' ' || LOWER(name_en)) ILIKE ALL(${originalPatterns})`,
        ]);

        // If zero results: try AND of original words except the last one + ANY of last term's variants
        // (handles "iphone 17 pro max battery" when product has "batterij")
        if ((totalRows[0]?.count ?? 0) === 0 && words.length > 1) {
          const withoutLastPatterns = words.slice(0, -1).map((w: string) => `%${w}%`);
          const lastVariantPatterns = termVariantGroups[termVariantGroups.length - 1].map(v => `%${v}%`);
          [rows, totalRows] = await Promise.all([
            sql`SELECT * FROM products WHERE (LOWER(name) || ' ' || LOWER(name_en)) ILIKE ALL(${withoutLastPatterns}) AND (LOWER(name) || ' ' || LOWER(name_en)) ILIKE ANY(${lastVariantPatterns}) ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
            sql`SELECT COUNT(*)::int AS count FROM products WHERE (LOWER(name) || ' ' || LOWER(name_en)) ILIKE ALL(${withoutLastPatterns}) AND (LOWER(name) || ' ' || LOWER(name_en)) ILIKE ANY(${lastVariantPatterns})`,
          ]);
        }

        // Final fallback: any variant matches (original OR approach)
        if ((totalRows[0]?.count ?? 0) === 0) {
          [rows, totalRows] = await Promise.all([
            sql`SELECT * FROM products WHERE (LOWER(name) || ' ' || LOWER(name_en)) ILIKE ANY(${allVariantPatterns}) ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
            sql`SELECT COUNT(*)::int AS count FROM products WHERE (LOWER(name) || ' ' || LOWER(name_en)) ILIKE ANY(${allVariantPatterns})`,
          ]);
        }

        // Re-sort by word-boundary score: exact model matches (e.g. "S22") rank above
        // substring matches (e.g. "S22 Ultra", "S22+"). Lower score = more relevant.
        if (rows.length > 1) {
          rows = rows
            .map((r: any) => ({ r, wbScore: wordBoundaryScore(r.name || '', r.name_en || '', words) }))
            .sort((a: any, b: any) => a.wbScore - b.wbScore)
            .map(({ r }: any) => r);
        }
      }
    } else if (featured === 'true') {
      [rows, totalRows] = await Promise.all([
        sql`SELECT * FROM products WHERE featured = true ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS count FROM products WHERE featured = true`,
      ]);
    } else if (isNew === 'true') {
      [rows, totalRows] = await Promise.all([
        sql`SELECT * FROM products WHERE is_new = true ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
        sql`SELECT COUNT(*)::int AS count FROM products WHERE is_new = true`,
      ]);
    } else {
      [rows, totalRows] = await Promise.all([
        sql`SELECT * FROM products ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
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
      vatApplied: !!p.vat_applied,
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
