import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductsByCategory, searchProducts, getAllProducts, getAllProductsByCategory } from '@/lib/mobilesentrix';

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

function findPrice(p: any): number {
  // MobileSentrix EU API actual fields (from debug)
  const candidates = [
    p.customer_price,
    p.final_price_with_tax,
    p.final_price_without_tax,
    p.regular_price_with_tax,
    p.regular_price_without_tax,
    p.price,
    p.regular_price,
    p.final_price,
    p.special_price,
  ];
  for (const c of candidates) {
    const num = parseFloat(c);
    if (!isNaN(num) && num > 0) return num;
  }
  return 0;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '100');
    const debug = searchParams.get('debug') === '1';
    
    let rawResult: any;
    const fetchAll = searchParams.get('all') === '1';
    
    if (search) {
      rawResult = await searchProducts(search);
    } else if (categoryId && categoryId !== 'all') {
      if (fetchAll) {
        // Try fetching from category first
        rawResult = await getAllProductsByCategory(categoryId);
        
        // If category filter returned 0 products, fallback to all products
        const test = Array.isArray(rawResult) ? rawResult : Object.values(rawResult || {});
        if (test.filter((p: any) => p && typeof p === 'object' && (p.sku || p.entity_id)).length === 0) {
          console.log('[Products API] Category filter returned 0, falling back to all products');
          rawResult = await getAllProducts();
        }
      } else {
        rawResult = await getProductsByCategory(categoryId, page, pageSize);
      }
    } else {
      // No category or "all" selected: fetch ALL products
      if (fetchAll) {
        rawResult = await getAllProducts();
      } else {
        rawResult = await getProducts(page, pageSize);
      }
    }

    // Debug mode: return raw API response structure
    if (debug) {
      const sample = rawResult && typeof rawResult === 'object' 
        ? (Array.isArray(rawResult) ? rawResult[0] : Object.values(rawResult)[0])
        : rawResult;
      return NextResponse.json({ 
        raw_type: typeof rawResult, 
        is_array: Array.isArray(rawResult),
        raw_keys: rawResult && typeof rawResult === 'object' ? Object.keys(rawResult).slice(0, 10) : null,
        sample_keys: sample && typeof sample === 'object' ? Object.keys(sample) : null,
        sample,
        total_entries: rawResult && typeof rawResult === 'object' 
          ? (Array.isArray(rawResult) ? rawResult.length : Object.keys(rawResult).length) : 0,
      });
    }

    // Convert to array
    let products: any[] = [];
    if (Array.isArray(rawResult)) {
      products = rawResult;
    } else if (rawResult && typeof rawResult === 'object') {
      products = Object.values(rawResult);
    }

    // Filter out non-product entries
    products = products.filter((p: any) => p && typeof p === 'object' && (p.sku || p.entity_id || p.name));

    // Normalize product fields using actual MobileSentrix EU API field names
    products = products.map((p: any) => ({
      entity_id: p.entity_id || p.product_id || p.id || '',
      sku: p.sku || '',
      name: p.name || p.title || '',
      description: stripHtml(p.description || p.short_description || ''),
      price: findPrice(p),
      special_price: p.final_price_with_tax !== p.regular_price_with_tax ? parseFloat(p.final_price_with_tax) : null,
      stock_qty: parseInt(p.in_stock_qty || p.stock_qty || p.qty || '0') || 0,
      is_in_stock: p.is_in_stock === true || p.is_in_stock === '1' || p.is_in_stock === 1 || p.is_saleable === true,
      image_url: p.image_url || p.image || p.thumbnail || '',
      brand: p.manufacturer_text || p.brand_text || p.brand || p.manufacturer || '',
      category: p.category || p.category_id || '',
      model: p.model_text || p.model || '',
      url: p.url || '',
      warranty: p.warranty_period_text || '',
      currency: p.display_currency || 'EUR',
    }));
    
    return NextResponse.json({
      success: true,
      products,
      total: products.length,
      page,
      pageSize,
    });
  } catch (error: any) {
    console.error('Products API Error:', error.message);
    return NextResponse.json({ success: false, error: error.message, products: [] }, { status: 500 });
  }
}
