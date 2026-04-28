import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Import products from Mobile Sentrix
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();
    
    const {
      priceMarkup = 0,
      autoPublish = false,
      targetCategory = '',
      products: productsToImport,
    } = body;

    if (!productsToImport || !Array.isArray(productsToImport) || productsToImport.length === 0) {
      return NextResponse.json({ success: false, error: 'Geen producten opgegeven', imported: 0, errors: 0 }, { status: 400 });
    }

    const importedProducts = [];
    const errors = [];

    for (const product of productsToImport) {
      try {
        const sku = product.sku || '';
        const name = product.customName || product.name || '';
        const description = stripHtml(product.description || '');
        const originalPrice = parseFloat(product.price) || 0;
        const markupMultiplier = 1 + (priceMarkup / 100);
        const price = Math.round(originalPrice * markupMultiplier * 100) / 100;
        const stockQty = parseInt(product.stock_qty) || 0;
        const inStock = stockQty > 0 || product.is_in_stock === true;
        const image = product.image_url || '';
        const category = product.targetCategory || targetCategory || 'onderdelen';
        const brand = product.brand || '';
        const entityId = product.entity_id || '';

        // Check if product already exists by SKU
        const existing = await sql`
          SELECT id FROM products WHERE sku = ${sku}
        `;

        const productId = existing.length > 0 
          ? existing[0].id 
          : crypto.randomUUID();

        const now = new Date().toISOString();

        if (existing.length > 0) {
          // Update existing product
          await sql`
            UPDATE products 
            SET 
              name = ${name},
              price = ${price},
              compare_price = ${null},
              in_stock = ${inStock},
              image = ${image},
              category = ${category},
              updated_at = ${now}
            WHERE id = ${productId}
          `;
        } else {
          // Insert new product - only use columns that exist in the DB
          await sql`
            INSERT INTO products (
              id, name, description, price, compare_price,
              category, sku, in_stock, image, created_at
            ) VALUES (
              ${productId}, ${name}, ${description}, ${price}, ${null},
              ${category}, ${sku}, ${inStock}, ${image}, ${now}
            )
          `;
        }

        importedProducts.push({
          id: productId,
          name,
          sku,
          price,
          stock: stockQty,
          status: existing.length > 0 ? 'updated' : 'created',
        });

      } catch (error: any) {
        console.error('Import product error:', error.message);
        errors.push({
          sku: product.sku,
          name: product.name,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      message: `${importedProducts.length} producten geïmporteerd`,
      imported: importedProducts.length,
      errors: errors.length,
      products: importedProducts,
      errorDetails: errors,
    });

  } catch (error: any) {
    console.error('Mobile Sentrix import error:', error);
    return NextResponse.json({ success: false, error: error.message, imported: 0, errors: 1 }, { status: 500 });
  }
}

// Get import status/stats
export async function GET(request: NextRequest) {
  try {
    const sql = getDb();

    const totalProducts = await sql`SELECT COUNT(*) as count FROM products`;

    const recentImports = await sql`
      SELECT id, name, sku, price, in_stock, category, created_at
      FROM products 
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return NextResponse.json({
      stats: {
        total_imported: Number(totalProducts[0].count),
        published: Number(totalProducts[0].count),
        drafts: 0,
        synced_last_24h: 0,
      },
      recentImports,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, stats: { total_imported: 0, published: 0, drafts: 0, synced_last_24h: 0 }, recentImports: [] }, { status: 500 });
  }
}
