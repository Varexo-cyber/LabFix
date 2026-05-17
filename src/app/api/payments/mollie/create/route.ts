import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, description, redirectUrl, orderData } = body;

    if (!orderId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const mollieApiKey = process.env.MOLLIE_API_KEY;
    if (!mollieApiKey) {
      return NextResponse.json({ error: 'Mollie API key not configured' }, { status: 500 });
    }

    const mollie = createMollieClient({ apiKey: mollieApiKey });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stellar-brioche-27fb7f.netlify.app';

    // Store orderData in DB BEFORE creating Mollie payment (avoids 1024 byte metadata limit)
    const sql = getDb();
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        mollie_payment_id TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        amount DECIMAL(10,2) NOT NULL,
        order_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    try { await sql`ALTER TABLE payments ADD COLUMN IF NOT EXISTS order_data JSONB`; } catch {}

    const payId = 'PAY-' + Date.now().toString(36).toUpperCase();
    // Insert pending record with orderData before Mollie call
    await sql`
      INSERT INTO payments (id, order_id, mollie_payment_id, status, amount, order_data)
      VALUES (
        ${payId},
        ${orderId},
        ${'pending-' + payId},
        'open',
        ${parseFloat(amount)},
        ${JSON.stringify(orderData || {})}
      )
    `;

    const payment = await mollie.payments.create({
      amount: {
        currency: 'EUR',
        value: parseFloat(amount).toFixed(2),
      },
      description: description || `LabFix bestelling ${orderId}`,
      redirectUrl: `${baseUrl}/checkout/betaling-voltooid?orderId=${orderId}`,
      webhookUrl: `${baseUrl}/api/payments/mollie/webhook`,
      metadata: { orderId },
    });

    // Update with real Mollie payment ID
    await sql`
      UPDATE payments SET mollie_payment_id = ${payment.id} WHERE id = ${payId}
    `;

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      checkoutUrl: payment.getCheckoutUrl(),
    });
  } catch (error: any) {
    console.error('Mollie create payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
