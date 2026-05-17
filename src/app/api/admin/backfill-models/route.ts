import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { brandCategories } from '@/lib/categories';

export const runtime = 'nodejs';

// Build a lookup: model name → model slug, grouped by brand+subcategory
function buildModelLookup() {
  const lookup: Array<{ brand: string; sub: string; slug: string; name: string; lcName: string; tokens: string[] }> = [];
  for (const brand of brandCategories) {
    for (const sub of brand.subcategories) {
      for (const model of sub.models) {
        const lcName = model.name.toLowerCase();
        // tokens: words sorted by length descending for greedy match
        lookup.push({
          brand: brand.slug,
          sub: sub.slug,
          slug: model.slug,
          name: model.name,
          lcName,
          tokens: lcName.split(/[\s/]+/).filter(Boolean),
        });
      }
    }
  }
  // Sort by name length desc so longer/more specific matches first
  lookup.sort((a, b) => b.lcName.length - a.lcName.length);
  return lookup;
}

function detectModel(productName: string, productCategory: string, productSubcategory: string, lookup: ReturnType<typeof buildModelLookup>): string | null {
  const lcProduct = (productName || '').toLowerCase();
  if (!lcProduct) return null;

  // Filter lookup to category+subcategory if available
  const candidates = lookup.filter(l => {
    if (productCategory && l.brand !== productCategory) return false;
    if (productSubcategory && l.sub !== productSubcategory) return false;
    return true;
  });

  // Try direct substring match (longest first)
  for (const m of candidates) {
    if (lcProduct.includes(m.lcName)) return m.slug;
  }
  
  // Fallback: try without parenthesized parts (e.g., "iPhone 13 Mini" vs "iPhone 13")
  for (const m of candidates) {
    const baseName = m.lcName.replace(/\s*\([^)]*\)/g, '').trim();
    if (baseName && lcProduct.includes(baseName)) return m.slug;
  }
  
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    const lookup = buildModelLookup();
    
    // Sample of products without model
    const rows = await sql`
      SELECT id, name, category, subcategory, model 
      FROM products 
      WHERE model IS NULL OR model = ''
      LIMIT 100
    `;
    
    const previews = rows.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      detectedModel: detectModel(p.name, p.category, p.subcategory, lookup),
    }));
    
    const countRows = await sql`SELECT COUNT(*)::int AS count FROM products WHERE model IS NULL OR model = ''`;
    const total = countRows[0]?.count || 0;
    
    return NextResponse.json({
      success: true,
      total,
      sampleSize: previews.length,
      previews,
      message: `${total} producten zonder model gevonden`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const lookup = buildModelLookup();
    const { dryRun = false, limit = 50000 } = await request.json().catch(() => ({}));
    
    // Get all products without model
    const rows = await sql`
      SELECT id, name, category, subcategory 
      FROM products 
      WHERE model IS NULL OR model = ''
      LIMIT ${limit}
    `;
    
    let updated = 0;
    let notDetected = 0;
    const updates: Array<{ id: string; name: string; model: string }> = [];
    
    for (const p of rows as any[]) {
      const detected = detectModel(p.name, p.category, p.subcategory, lookup);
      if (detected) {
        if (!dryRun) {
          await sql`UPDATE products SET model = ${detected}, updated_at = NOW() WHERE id = ${p.id}`;
        }
        updates.push({ id: p.id, name: p.name, model: detected });
        updated++;
      } else {
        notDetected++;
      }
    }
    
    return NextResponse.json({
      success: true,
      dryRun,
      processed: rows.length,
      updated,
      notDetected,
      sampleUpdates: updates.slice(0, 20),
      message: dryRun 
        ? `Dry run: ${updated} producten zouden worden geüpdatet`
        : `${updated} producten geüpdatet met model`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
