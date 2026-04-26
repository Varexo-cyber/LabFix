import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Webhook events log table
async function ensureWebhookTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS webhook_logs (
      id SERIAL PRIMARY KEY,
      source TEXT NOT NULL DEFAULT 'mobilesentrix',
      event_type TEXT NOT NULL,
      payload JSONB,
      headers JSONB,
      status TEXT DEFAULT 'pending',
      processed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

// Verify the webhook signature (if Mobile Sentrix provides one)
function verifySignature(request: NextRequest, body: string): boolean {
  // TODO: Add signature verification if Mobile Sentrix provides a secret
  // For now, we accept all requests but log them
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureWebhookTable(sql);

    const body = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Log the webhook for debugging
    console.log('Webhook received from Mobile Sentrix:', {
      headers,
      body: body.substring(0, 1000) // Log first 1000 chars
    });

    // Parse the payload
    let payload: any;
    try {
      payload = JSON.parse(body);
    } catch (e) {
      payload = { raw: body };
    }

    // Determine event type from payload or headers
    const eventType = payload?.event || payload?.type || headers['x-event-type'] || 'unknown';

    // Log to database
    await sql`
      INSERT INTO webhook_logs (source, event_type, payload, headers, status)
      VALUES ('mobilesentrix', ${eventType}, ${JSON.stringify(payload)}, ${JSON.stringify(headers)}, 'received')
    `;

    // Process different event types
    switch (eventType) {
      case 'product.updated':
      case 'product.created':
        await handleProductUpdate(sql, payload);
        break;
      case 'inventory.updated':
        await handleInventoryUpdate(sql, payload);
        break;
      case 'price.updated':
        await handlePriceUpdate(sql, payload);
        break;
      case 'order.shipped':
      case 'order.status_changed':
        await handleOrderUpdate(sql, payload);
        break;
      default:
        // Unknown event type - just log it
        console.log('Unknown webhook event type:', eventType);
    }

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received and processed',
      eventType 
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// GET endpoint to check webhook status/logs (admin only)
export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureWebhookTable(sql);

    // Get recent webhook logs
    const logs = await sql`
      SELECT * FROM webhook_logs 
      ORDER BY created_at DESC 
      LIMIT 50
    `;

    return NextResponse.json({ 
      status: 'webhook endpoint active',
      recentLogs: logs 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handlers for different event types
async function handleProductUpdate(sql: any, payload: any) {
  console.log('Processing product update:', payload);
  
  // TODO: Implement product sync logic
  // This will sync products from Mobile Sentrix to your database
  
  await sql`
    UPDATE webhook_logs 
    SET status = 'processed', processed_at = NOW()
    WHERE payload->>'id' = ${payload?.id || payload?.product_id || ''}
    AND event_type IN ('product.updated', 'product.created')
    ORDER BY created_at DESC
    LIMIT 1
  `;
}

async function handleInventoryUpdate(sql: any, payload: any) {
  console.log('Processing inventory update:', payload);
  
  // TODO: Implement inventory sync
  // Update stock levels in your database
  
  await sql`
    UPDATE webhook_logs 
    SET status = 'processed', processed_at = NOW()
    WHERE event_type = 'inventory.updated'
    ORDER BY created_at DESC
    LIMIT 1
  `;
}

async function handlePriceUpdate(sql: any, payload: any) {
  console.log('Processing price update:', payload);
  
  // TODO: Implement price sync
  
  await sql`
    UPDATE webhook_logs 
    SET status = 'processed', processed_at = NOW()
    WHERE event_type = 'price.updated'
    ORDER BY created_at DESC
    LIMIT 1
  `;
}

async function handleOrderUpdate(sql: any, payload: any) {
  console.log('Processing order update:', payload);
  
  // TODO: Update order status when Mobile Sentrix ships
  
  await sql`
    UPDATE webhook_logs 
    SET status = 'processed', processed_at = NOW()
    WHERE event_type IN ('order.shipped', 'order.status_changed')
    ORDER BY created_at DESC
    LIMIT 1
  `;
}
