import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email';

export const runtime = 'nodejs';

// Ensure table exists
async function ensureTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_email TEXT NOT NULL,
      customer_type TEXT DEFAULT 'individual',
      company_name TEXT DEFAULT '',
      kvk_number TEXT DEFAULT '',
      vat_number TEXT DEFAULT '',
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT DEFAULT '',
      shipping_address TEXT DEFAULT '',
      shipping_city TEXT DEFAULT '',
      shipping_postal_code TEXT DEFAULT '',
      shipping_country TEXT DEFAULT '',
      billing_address TEXT DEFAULT '',
      billing_city TEXT DEFAULT '',
      billing_postal_code TEXT DEFAULT '',
      billing_country TEXT DEFAULT '',
      items JSONB NOT NULL DEFAULT '[]',
      subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
      shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
      total DECIMAL(10,2) NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      notes TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let orders;
    if (userId) {
      orders = await sql`SELECT * FROM orders WHERE user_id = ${userId} ORDER BY created_at DESC`;
    } else {
      orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
    }

    const mapped = orders.map((o: any) => ({
      id: o.id,
      userId: o.user_id,
      userEmail: o.user_email,
      companyName: o.company_name,
      kvkNumber: o.kvk_number,
      contactPerson: o.contact_person,
      phone: o.phone,
      shippingAddress: o.shipping_address,
      shippingCity: o.shipping_city,
      shippingPostalCode: o.shipping_postal_code,
      shippingCountry: o.shipping_country,
      items: o.items,
      subtotal: parseFloat(o.subtotal),
      shippingCost: parseFloat(o.shipping_cost),
      total: parseFloat(o.total),
      status: o.status,
      notes: o.notes,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    
    const body = await request.json();
    const id = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();

    await sql`
      INSERT INTO orders (id, user_id, user_email, company_name, kvk_number, vat_number, contact_person, phone, shipping_address, shipping_city, shipping_postal_code, shipping_country, billing_address, billing_city, billing_postal_code, billing_country, items, subtotal, shipping_cost, total, status, notes)
      VALUES (${id}, ${body.userId}, ${body.userEmail}, ${body.companyName || ''}, ${body.kvkNumber || ''}, ${body.vatNumber || ''}, ${body.contactPerson || ''}, ${body.phone || ''}, ${body.shippingAddress || ''}, ${body.shippingCity || ''}, ${body.shippingPostalCode || ''}, ${body.shippingCountry || ''}, ${body.billingAddress || body.shippingAddress || ''}, ${body.billingCity || body.shippingCity || ''}, ${body.billingPostalCode || body.shippingPostalCode || ''}, ${body.billingCountry || body.shippingCountry || ''}, ${JSON.stringify(body.items)}, ${body.subtotal}, ${body.shippingCost}, ${body.total}, 'pending', ${body.notes || ''})
    `;

    // Send confirmation email
    try {
      await sendOrderConfirmation({
        to: body.userEmail,
        orderId: id,
        companyName: body.companyName,
        contactPerson: body.contactPerson,
        items: body.items.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.priceAtPurchase,
        })),
        subtotal: body.subtotal,
        shippingCost: body.shippingCost,
        total: body.total,
        shippingAddress: body.shippingAddress,
        shippingCity: body.shippingCity,
        shippingPostalCode: body.shippingPostalCode,
        shippingCountry: body.shippingCountry,
      });
    } catch (emailErr) {
      console.error('Email send failed (order still created):', emailErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();

    await sql`
      UPDATE orders SET status = ${body.status}, updated_at = NOW() WHERE id = ${body.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
