import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Ensure tables exist
async function ensureTables(sql: any) {
  // Brands table
  await sql`
    CREATE TABLE IF NOT EXISTS brands (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      name_en VARCHAR(100),
      description TEXT,
      icon VARCHAR(50),
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Subcategories table
  await sql`
    CREATE TABLE IF NOT EXISTS subcategories (
      id SERIAL PRIMARY KEY,
      brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
      slug VARCHAR(50) NOT NULL,
      name VARCHAR(100) NOT NULL,
      name_en VARCHAR(100),
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(brand_id, slug)
    )
  `;

  // Models table
  await sql`
    CREATE TABLE IF NOT EXISTS models (
      id SERIAL PRIMARY KEY,
      subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE CASCADE,
      slug VARCHAR(50) NOT NULL,
      name VARCHAR(100) NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(subcategory_id, slug)
    )
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_subcategories_brand ON subcategories(brand_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_subcategories_active ON subcategories(is_active)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_models_subcategory ON models(subcategory_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_models_active ON models(is_active)`;
}

// GET all brands with their subcategories and models
export async function GET() {
  try {
    const sql = getDb();
    await ensureTables(sql);

    // Get all active brands
    const brands = await sql`
      SELECT * FROM brands 
      WHERE is_active = true 
      ORDER BY sort_order, name
    `;

    // Get all subcategories
    const subcategories = await sql`
      SELECT s.*, b.slug as brand_slug 
      FROM subcategories s 
      JOIN brands b ON s.brand_id = b.id
      WHERE s.is_active = true 
      ORDER BY s.sort_order, s.name
    `;

    // Get all models
    const models = await sql`
      SELECT m.*, s.slug as subcategory_slug, b.slug as brand_slug
      FROM models m
      JOIN subcategories s ON m.subcategory_id = s.id
      JOIN brands b ON s.brand_id = b.id
      WHERE m.is_active = true
      ORDER BY m.sort_order, m.name
    `;

    // Build the hierarchical structure
    const result = brands.map((brand: any) => ({
      id: brand.id,
      slug: brand.slug,
      name: brand.name,
      nameEn: brand.name_en || brand.name,
      description: brand.description || '',
      icon: brand.icon || '',
      sortOrder: brand.sort_order,
      subcategories: subcategories
        .filter((sub: any) => sub.brand_slug === brand.slug)
        .map((sub: any) => ({
          id: sub.id,
          slug: sub.slug,
          name: sub.name,
          nameEn: sub.name_en || sub.name,
          sortOrder: sub.sort_order,
          models: models
            .filter((m: any) => m.subcategory_slug === sub.slug && m.brand_slug === brand.slug)
            .map((m: any) => ({
              id: m.id,
              slug: m.slug,
              name: m.name,
              sortOrder: m.sort_order,
            })),
        })),
    }));

    return NextResponse.json({ 
      success: true, 
      brands: result,
      count: brands.length 
    });
  } catch (error: any) {
    console.error('Brands API error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// POST - Create new brand/subcategory/model
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTables(sql);

    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type and data are required' 
      }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'brand':
        result = await sql`
          INSERT INTO brands (slug, name, name_en, description, sort_order)
          VALUES (${data.slug}, ${data.name}, ${data.nameEn || data.name}, ${data.description || ''}, ${data.sortOrder || 0})
          RETURNING *
        `;
        break;

      case 'subcategory':
        // Get brand_id from slug
        const brand = await sql`SELECT id FROM brands WHERE slug = ${data.brandSlug}`;
        if (!brand.length) {
          return NextResponse.json({ 
            success: false, 
            error: 'Brand not found' 
          }, { status: 404 });
        }
        result = await sql`
          INSERT INTO subcategories (brand_id, slug, name, name_en, sort_order)
          VALUES (${brand[0].id}, ${data.slug}, ${data.name}, ${data.nameEn || data.name}, ${data.sortOrder || 0})
          RETURNING *
        `;
        break;

      case 'model':
        // Get subcategory_id from slug
        const subcategory = await sql`
          SELECT id FROM subcategories WHERE slug = ${data.subcategorySlug}
        `;
        if (!subcategory.length) {
          return NextResponse.json({ 
            success: false, 
            error: 'Subcategory not found' 
          }, { status: 404 });
        }
        result = await sql`
          INSERT INTO models (subcategory_id, slug, name, sort_order)
          VALUES (${subcategory[0].id}, ${data.slug}, ${data.name}, ${data.sortOrder || 0})
          RETURNING *
        `;
        break;

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid type. Must be brand, subcategory, or model' 
        }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      data: result[0] 
    });
  } catch (error: any) {
    console.error('Create error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE - Remove brand/subcategory/model
export async function DELETE(request: NextRequest) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const slug = searchParams.get('slug');

    if (!type || !slug) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type and slug are required' 
      }, { status: 400 });
    }

    switch (type) {
      case 'brand':
        await sql`DELETE FROM brands WHERE slug = ${slug}`;
        break;
      case 'subcategory':
        await sql`DELETE FROM subcategories WHERE slug = ${slug}`;
        break;
      case 'model':
        await sql`DELETE FROM models WHERE slug = ${slug}`;
        break;
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid type' 
        }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `${type} deleted successfully` 
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
