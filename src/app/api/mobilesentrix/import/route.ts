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

// Product type priority: determines display order in the shop
// Lower number = shown first (most important repair parts first)
function getProductSortOrder(name: string): number {
  const n = name.toLowerCase();
  // Tier 1: Screens / Displays (most important)
  if (n.includes('lcd') || n.includes('oled') || n.includes('screen') || n.includes('display') || n.includes('digitizer') || n.includes('touch screen')) return 10;
  // Tier 2: Batteries
  if (n.includes('battery') || n.includes('batterij')) return 20;
  // Tier 3: Charging ports / Flex cables
  if (n.includes('charging port') || n.includes('charge port') || n.includes('dock connector') || n.includes('usb port')) return 30;
  if (n.includes('flex cable') || n.includes('flex kabel')) return 35;
  // Tier 4: Cameras
  if (n.includes('front camera') || n.includes('rear camera') || n.includes('back camera') || n.includes('camera lens') || n.includes('camera module')) return 40;
  // Tier 5: Speakers & Microphones
  if (n.includes('speaker') || n.includes('earpiece') || n.includes('loudspeaker') || n.includes('microphone') || n.includes('ear speaker')) return 50;
  // Tier 6: Back glass / Housing
  if (n.includes('back glass') || n.includes('back cover') || n.includes('rear glass') || n.includes('housing') || n.includes('frame') || n.includes('middle frame')) return 60;
  // Tier 7: Buttons / Small parts
  if (n.includes('power button') || n.includes('volume button') || n.includes('home button') || n.includes('side button') || n.includes('mute switch')) return 70;
  // Tier 8: Connectors / Antennas / Sensors
  if (n.includes('antenna') || n.includes('sensor') || n.includes('proximity') || n.includes('nfc') || n.includes('wireless charging')) return 80;
  // Tier 9: Adhesive / Tape / Screws
  if (n.includes('adhesive') || n.includes('tape') || n.includes('screw') || n.includes('sticker') || n.includes('gasket')) return 90;
  // Tier 10: Everything else
  return 100;
}

// Auto-translate English to Dutch using free MyMemory API (no key needed)
async function translateToNL(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return '';
  // Skip translation for very short strings (SKU-like, model numbers)
  if (text.length < 5) return text;
  try {
    const encoded = encodeURIComponent(text.substring(0, 500)); // MyMemory limit
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|nl`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return text;
    const data = await res.json();
    if (data?.responseStatus === 200 && data?.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      // MyMemory returns uppercase warning if quota exceeded
      if (translated.includes('MYMEMORY WARNING')) return text;
      return translated;
    }
    return text;
  } catch {
    return text; // Fallback to English on any error
  }
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
        const nameEn = product.customName || product.name || '';
        const descriptionEn = stripHtml(product.description || '');
        const originalPrice = parseFloat(product.price) || 0;
        const markupMultiplier = 1 + (priceMarkup / 100);
        const price = Math.round(originalPrice * markupMultiplier * 100) / 100;
        const stockQty = parseInt(product.stock_qty) || 0;
        const inStock = stockQty > 0 || product.is_in_stock === true;
        const image = product.image_url || '';
        const category = product.targetCategory || targetCategory || 'onderdelen';
        const brand = product.brand || '';
        const entityId = product.entity_id || '';

        // Auto-translate English name and description to Dutch
        const nameNL = await translateToNL(nameEn);
        const descriptionNL = descriptionEn ? await translateToNL(descriptionEn) : '';

        // Determine sort priority based on product type
        const sortOrder = getProductSortOrder(nameEn);

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
              name = ${nameNL},
              name_en = ${nameEn},
              description = ${descriptionNL},
              description_en = ${descriptionEn},
              price = ${price},
              compare_price = ${null},
              in_stock = ${inStock},
              image = ${image},
              category = ${category},
              sort_order = ${sortOrder},
              updated_at = ${now}
            WHERE id = ${productId}
          `;
        } else {
          // Insert new product with both NL and EN names/descriptions
          await sql`
            INSERT INTO products (
              id, name, name_en, description, description_en, price, compare_price,
              category, sku, in_stock, image, sort_order, created_at
            ) VALUES (
              ${productId}, ${nameNL}, ${nameEn}, ${descriptionNL}, ${descriptionEn}, ${price}, ${null},
              ${category}, ${sku}, ${inStock}, ${image}, ${sortOrder}, ${now}
            )
          `;
        }

        importedProducts.push({
          id: productId,
          name: nameNL,
          nameEn,
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
