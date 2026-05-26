import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { addToCart, clearCart, createOrder, getOrCreateMsAddress, SHIPPING_METHODS } from '@/lib/mobilesentrix-new';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId');
  if (!orderId) return NextResponse.json({ error: 'pass ?orderId=ORD-XXX' }, { status: 400 });

  const steps: any[] = [];
  const log = (step: string, data: any) => { steps.push({ step, data, ts: new Date().toISOString() }); };

  try {
    const sql = getDb();
    log('1. fetch order from DB', { orderId });
    const rows = await sql`SELECT * FROM orders WHERE id = ${orderId}`;
    if (rows.length === 0) return NextResponse.json({ error: 'order not found', steps });
    const order = rows[0];
    log('1. order found', {
      shipping_address: order.shipping_address,
      shipping_city: order.shipping_city,
      shipping_postal_code: order.shipping_postal_code,
      contact_person: order.contact_person,
      phone: order.phone,
      items_count: (typeof order.items === 'string' ? JSON.parse(order.items) : order.items)?.length,
      ms_order_id: order.ms_order_id,
    });

    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    const msCustomerId = process.env.MOBILESENTRIX_CUSTOMER_ID || '60012677';
    log('2. customer id', { msCustomerId });

    const nameParts = (order.contact_person || '').trim().split(' ');
    const firstname = nameParts[0] || order.company_name || 'LabFix';
    const lastname = nameParts.slice(1).join(' ') || 'Klant';

    const shippingAddrInput = {
      firstname, lastname,
      street: [order.shipping_address],
      city: order.shipping_city,
      country_id: 'NL',
      region: '0',
      postcode: order.shipping_postal_code,
      telephone: order.phone || '0000000000',
      company: order.company_name || 'LabFix',
      vat_id: order.vat_number || '',
    };
    log('3. shipping address input', shippingAddrInput);

    let shippingId: string;
    try {
      shippingId = await getOrCreateMsAddress(msCustomerId, shippingAddrInput);
      log('4. ✅ shipping address created/found', { shippingId });
    } catch (err: any) {
      log('4. ❌ shipping address FAILED', { error: err.message, stack: err.stack });
      return NextResponse.json({ ok: false, failedAt: 'address', steps });
    }

    try {
      await clearCart();
      log('5. ✅ cart cleared', {});
    } catch (err: any) {
      log('5. ❌ cart clear failed (continuing)', { error: err.message });
    }

    const msProducts = items.map((item: any) => ({
      sku: item.product?.sku || item.sku,
      qty: item.quantity,
    }));
    log('6. cart products', msProducts);

    let quoteId: string;
    try {
      const cartRes = await addToCart(msProducts);
      quoteId = cartRes?.quote_id || '';
      log('6. cart response', cartRes);
      if (!quoteId) {
        return NextResponse.json({ ok: false, failedAt: 'cart - no quote_id', steps });
      }
    } catch (err: any) {
      log('6. ❌ cart add FAILED', { error: err.message, stack: err.stack });
      return NextResponse.json({ ok: false, failedAt: 'cart', steps });
    }

    try {
      const msOrder = await createOrder({
        quote_id: parseInt(quoteId),
        billing_id: parseInt(shippingId),
        shipping_id: parseInt(shippingId),
        shipping_method: SHIPPING_METHODS['postnl_standard'],
        payment_method: 'ideal',
        po_number: orderId,
      });
      log('7. ✅ MS order created', msOrder);
      return NextResponse.json({ ok: true, msOrder, steps });
    } catch (err: any) {
      log('7. ❌ createOrder FAILED', { error: err.message, stack: err.stack });
      return NextResponse.json({ ok: false, failedAt: 'createOrder', steps });
    }
  } catch (err: any) {
    log('FATAL', { error: err.message, stack: err.stack });
    return NextResponse.json({ ok: false, fatal: err.message, steps });
  }
}
