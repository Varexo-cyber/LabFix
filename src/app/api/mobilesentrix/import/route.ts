import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { mobileSentrixApi, mapMobileSentrixToLabFix, MSProduct } from '@/lib/mobilesentrix';

export const runtime = 'nodejs';

// Import products from Mobile Sentrix
export async function POST(request: NextRequest) {
  // Check if OAuth credentials are configured
  const hasAccessToken = process.env.MOBILESENTRIX_ACCESS_TOKEN && process.env.MOBILESENTRIX_ACCESS_TOKEN !== 'your_access_token_here';
  const hasAccessTokenSecret = process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET && process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET !== 'your_access_token_secret_here';
  
  if (!hasAccessToken || !hasAccessTokenSecret) {
    return NextResponse.json(
      { 
        error: 'MobileSentrix API credentials incompleet. Access Token en Access Token Secret zijn vereist (beschikbaar vanaf maandag).',
        imported: 0,
        products: [],
        errors: ['API niet geconfigureerd']
      },
      { status: 503 }
    );
  }
  
  try {
    const sql = getDb();
    const body = await request.json();
    
    const {
      filters = {}, // brand, category, etc.
      priceMarkup = 0, // Percentage markup (e.g., 20 for 20%)
      autoPublish = false, // Whether to publish immediately
      limit = 50, // Max products to import
      products: productsToImport, // Array of specific products to import (new format)
    } = body;

    // NEW: Import specific products one by one (from selection UI)
    if (productsToImport && Array.isArray(productsToImport)) {
      const importedProducts = [];
      const errors = [];

      for (const product of productsToImport) {
        try {
          // Map to LabFix format with price markup
          const mapped = mapMobileSentrixToLabFix(product, priceMarkup);

          // Check if product already exists
          const existing = await sql`
            SELECT id FROM products WHERE sku = ${mapped.sku}
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
                price = ${mapped.price},
                stock = ${mapped.stock},
                in_stock = ${mapped.inStock},
                ms_sku = ${mapped.sku},
                ms_entity_id = ${mapped.msEntityId},
                ms_last_sync = ${now},
                updated_at = ${now}
              WHERE id = ${productId}
            `;
          } else {
            // Insert new product
            await sql`
              INSERT INTO products (
                id, 
                name, 
                description, 
                price, 
                compare_price,
                category, 
                brand, 
                sku,
                in_stock,
                image,
                ms_sku,
                ms_source,
                ms_entity_id,
                ms_last_sync,
                status,
                created_at
              ) VALUES (
                ${productId},
                ${mapped.name},
                ${mapped.description},
                ${mapped.price},
                ${mapped.originalPrice},
                ${mapped.category},
                ${mapped.brand},
                ${mapped.sku},
                ${mapped.inStock},
                ${mapped.image},
                ${mapped.sku},
                ${'mobile_sentrix'},
                ${mapped.msEntityId},
                ${now},
                ${autoPublish ? 'active' : 'draft'},
                ${now}
              )
            `;
          }

          importedProducts.push({
            id: productId,
            name: mapped.name,
            sku: mapped.sku,
            price: mapped.price,
            stock: mapped.stock,
            status: existing.length > 0 ? 'updated' : 'created',
          });

        } catch (error: any) {
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
    }

    // LEGACY: Import from filters (batch import)
    // Test API connection first
    const isConnected = await mobileSentrixApi.testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Kan geen verbinding maken met Mobile Sentrix API. Controleer je API credentials.' },
        { status: 500 }
      );
    }

    // Fetch products from Mobile Sentrix
    let msProducts: MSProduct[] = [];
    
    try {
      if (filters.brand) {
        msProducts = await mobileSentrixApi.getProductsByBrand(filters.brand);
      } else if (filters.category) {
        msProducts = await mobileSentrixApi.getProductsByCategory(filters.category);
      } else {
        // Get all products (paginated)
        msProducts = await mobileSentrixApi.getProducts(1, limit);
      }
    } catch (apiError: any) {
      return NextResponse.json(
        { error: `API Error: ${apiError.message}` },
        { status: 500 }
      );
    }

    if (!msProducts || msProducts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Geen producten gevonden om te importeren',
        imported: 0,
        products: [],
      });
    }

    // Limit products
    msProducts = msProducts.slice(0, limit);

    // Import each product
    const importedProducts = [];
    const errors = [];

    for (const msProduct of msProducts) {
      try {
        // Map to LabFix format with price markup
        const mapped = mapMobileSentrixToLabFix(msProduct, priceMarkup);

        // Check if product already exists
        const existing = await sql`
          SELECT id FROM products WHERE sku = ${mapped.sku}
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
              price = ${mapped.price},
              stock = ${mapped.stock},
              in_stock = ${mapped.inStock},
              ms_sku = ${mapped.sku},
              ms_entity_id = ${mapped.msEntityId},
              ms_last_sync = ${now},
              updated_at = ${now}
            WHERE id = ${productId}
          `;
        } else {
          // Insert new product
          await sql`
            INSERT INTO products (
              id, 
              name, 
              description, 
              price, 
              compare_price,
              category, 
              brand, 
              sku,
              in_stock,
              image,
              ms_sku,
              ms_source,
              ms_entity_id,
              ms_last_sync,
              status,
              created_at
            ) VALUES (
              ${productId},
              ${mapped.name},
              ${mapped.description},
              ${mapped.price},
              ${mapped.originalPrice},
              ${mapped.category},
              ${mapped.brand},
              ${mapped.sku},
              ${mapped.inStock},
              ${mapped.image},
              ${mapped.sku},
              ${'mobile_sentrix'},
              ${mapped.msEntityId},
              ${now},
              ${autoPublish ? 'active' : 'draft'},
              ${now}
            )
          `;
        }

        importedProducts.push({
          id: productId,
          name: mapped.name,
          sku: mapped.sku,
          price: mapped.price,
          stock: mapped.stock,
          status: existing.length > 0 ? 'updated' : 'created',
        });

      } catch (error: any) {
        errors.push({
          sku: msProduct.sku,
          name: msProduct.name,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${importedProducts.length} producten geïmporteerd`,
      imported: importedProducts.length,
      errors: errors.length,
      products: importedProducts,
      errorDetails: errors,
    });

  } catch (error: any) {
    console.error('Mobile Sentrix import error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Get import status/stats
export async function GET(request: NextRequest) {
  try {
    const sql = getDb();

    // Get stats about imported products
    const stats = await sql`
      SELECT 
        COUNT(*) as total_imported,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as published,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as drafts,
        COUNT(CASE WHEN ms_last_sync > NOW() - INTERVAL '24 hours' THEN 1 END) as synced_last_24h
      FROM products 
      WHERE ms_source = 'mobile_sentrix'
    `;

    // Get recent imports
    const recentImports = await sql`
      SELECT 
        id, name, sku, price, stock, status, ms_last_sync, created_at
      FROM products 
      WHERE ms_source = 'mobile_sentrix'
      ORDER BY ms_last_sync DESC
      LIMIT 20
    `;

    return NextResponse.json({
      stats: stats[0],
      recentImports,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
