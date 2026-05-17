import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Categories that were removed from the system
const REMOVED_CATEGORIES = [
  'apple/apple-watch',
  'apple/airpods',
  'apple/mac-studio',
  'apple/studio-display',
  'apple/mac-pro',
  'apple/mac-mini',
  'apple/imac',
  'apple/ipod',
  'apple-watch',
  'airpods',
  'mac-studio',
  'studio-display',
  'mac-pro',
  'mac-mini',
  'imac',
  'ipod',
];

export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    
    // Build WHERE clause for removed categories
    const categoryChecks = REMOVED_CATEGORIES.map(cat => `category ILIKE '%${cat}%'`).join(' OR ');
    
    // Get count of affected products
    const countResult = await sql.unsafe(`
      SELECT COUNT(*)::int as count 
      FROM products 
      WHERE ${categoryChecks}
    `);
    
    const affectedCount = ((countResult as unknown) as any[])[0]?.count || 0;
    
    // Get sample of affected products
    const affectedProducts = await sql.unsafe(`
      SELECT id, name, category, subcategory, sku
      FROM products 
      WHERE ${categoryChecks}
      LIMIT 50
    `);
    
    return NextResponse.json({
      success: true,
      affectedCount,
      affectedProducts,
      removedCategories: REMOVED_CATEGORIES,
      message: affectedCount === 0 
        ? 'Geen producten gevonden met verwijderde categorieën'
        : `${affectedCount} producten hebben verwijderde categorieën`
    });
  } catch (error) {
    console.error('Cleanup check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const { action, categoryMapping } = await request.json();
    
    if (action === 'delete') {
      // Build WHERE clause for removed categories
      const categoryChecks = REMOVED_CATEGORIES.map(cat => `category ILIKE '%${cat}%'`).join(' OR ');
      
      // Delete products with removed categories
      const result = await sql.unsafe(`
        DELETE FROM products 
        WHERE ${categoryChecks}
        RETURNING id, name, category
      `) as unknown as any[];
      
      return NextResponse.json({
        success: true,
        deletedCount: result.length,
        deletedProducts: result,
        message: `${result.length} producten verwijderd`
      });
    }
    
    if (action === 'reassign' && categoryMapping) {
      // Reassign products to new categories
      const updates = [];
      for (const [oldCat, newCat] of Object.entries(categoryMapping)) {
        const result = await sql`
          UPDATE products 
          SET category = ${newCat},
              updated_at = NOW()
          WHERE category ILIKE ${`%${oldCat}%`}
          RETURNING id, name, category
        `;
        updates.push({ oldCat, newCat, count: result.length });
      }
      
      return NextResponse.json({
        success: true,
        updates,
        message: 'Producten hercategoriseerd'
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cleanup products' },
      { status: 500 }
    );
  }
}
