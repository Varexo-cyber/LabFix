import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';
import { getDb } from '@/lib/db';
import { addToCart as msAddToCart, clearCart as msClearCart, createOrder as msCreateOrder, getOrCreateMsAddress, SHIPPING_METHODS } from '@/lib/mobilesentrix-new';
import { sendOrderConfirmation } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const molliePaymentId = formData.get('id') as string;

    if (!molliePaymentId) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    const mollieApiKey = process.env.MOLLIE_API_KEY;
    if (!mollieApiKey) {
      return NextResponse.json({ error: 'Mollie API key not configured' }, { status: 500 });
    }

    const mollie = createMollieClient({ apiKey: mollieApiKey });
    const payment = await mollie.payments.get(molliePaymentId);

    const sql = getDb();

    // Update payment status in DB
    await sql`
      UPDATE payments SET status = ${payment.status}, updated_at = NOW()
      WHERE mollie_payment_id = ${molliePaymentId}
    `;

    if (payment.status === 'paid') {
      const metadata = payment.metadata as any;
      const orderId = metadata?.orderId;
      const orderData = metadata?.orderData ? JSON.parse(metadata.orderData) : null;

      if (!orderId || !orderData) {
        console.error('Webhook: missing orderId or orderData in metadata');
        return NextResponse.json({ received: true });
      }

      // Check if order already exists (idempotency)
      const existing = await sql`SELECT id FROM orders WHERE id = ${orderId}`;
      if (existing.length > 0) {
        return NextResponse.json({ received: true });
      }

      // ── MobileSentrix order sync ──────────────────────────────────────────
      let msOrderId = '';
      let msIncrementId = '';

      try {
        const msCustomerId = orderData.msCustomerId || '';
        if (msCustomerId) {
          const nameParts = (orderData.contactPerson || '').trim().split(' ');
          const firstname = nameParts[0] || orderData.companyName || 'LabFix';
          const lastname = nameParts.slice(1).join(' ') || 'Klant';

          const shippingAddrInput = {
            firstname,
            lastname,
            street: [orderData.shippingAddress],
            city: orderData.shippingCity,
            country_id: orderData.shippingCountryCode || 'NL',
            region: '',
            postcode: orderData.shippingPostalCode,
            telephone: orderData.phone || '0000000000',
            company: orderData.companyName || '',
            vat_id: orderData.vatNumber || '',
          };

          const billingAddrInput = orderData.billingSameAsShipping
            ? shippingAddrInput
            : {
                firstname,
                lastname,
                street: [orderData.billingAddress],
                city: orderData.billingCity,
                country_id: orderData.billingCountryCode || 'NL',
                region: '',
                postcode: orderData.billingPostalCode,
                telephone: orderData.phone || '0000000000',
                company: orderData.companyName || '',
                vat_id: orderData.vatNumber || '',
              };

          const [msShippingAddressId, msBillingAddressId] = await Promise.all([
            getOrCreateMsAddress(msCustomerId, shippingAddrInput),
            getOrCreateMsAddress(msCustomerId, billingAddrInput),
          ]);

          await msClearCart();
          const msProducts = orderData.items.map((item: any) => ({
            sku: item.product.sku,
            qty: item.quantity,
          }));
          const cartResponse = await msAddToCart(msProducts);
          const msQuoteId = cartResponse?.quote_id || '';

          if (msQuoteId && msShippingAddressId && msBillingAddressId) {
            const msOrder = await msCreateOrder({
              quote_id: parseInt(msQuoteId),
              billing_id: parseInt(msBillingAddressId),
              shipping_id: parseInt(msShippingAddressId),
              shipping_method: orderData.msShippingMethod || SHIPPING_METHODS['postnl_standard'],
              payment_method: 'mygateway',
              po_number: orderId,
            });
            msOrderId = msOrder?.order_id || '';
            msIncrementId = msOrder?.increment_id || '';
          }
        }
      } catch (msErr: any) {
        console.error('MS order sync failed in webhook:', msErr.message);
      }
      // ─────────────────────────────────────────────────────────────────────

      // Create order in LabFix DB
      await sql`
        INSERT INTO orders (
          id, user_id, user_email, company_name, kvk_number, vat_number,
          contact_person, phone,
          shipping_address, shipping_city, shipping_postal_code, shipping_country,
          billing_address, billing_city, billing_postal_code, billing_country,
          items, subtotal, shipping_cost, total, status, notes,
          ms_order_id, ms_increment_id
        ) VALUES (
          ${orderId},
          ${orderData.userId},
          ${orderData.userEmail},
          ${orderData.companyName || ''},
          ${orderData.kvkNumber || ''},
          ${orderData.vatNumber || ''},
          ${orderData.contactPerson || ''},
          ${orderData.phone || ''},
          ${orderData.shippingAddress || ''},
          ${orderData.shippingCity || ''},
          ${orderData.shippingPostalCode || ''},
          ${orderData.shippingCountry || ''},
          ${orderData.billingAddress || orderData.shippingAddress || ''},
          ${orderData.billingCity || orderData.shippingCity || ''},
          ${orderData.billingPostalCode || orderData.shippingPostalCode || ''},
          ${orderData.billingCountry || orderData.shippingCountry || ''},
          ${JSON.stringify(orderData.items)},
          ${orderData.subtotal},
          ${orderData.shippingCost},
          ${orderData.total},
          'paid',
          ${orderData.notes || ''},
          ${msOrderId},
          ${msIncrementId}
        )
      `;

      // Update payment with orderId link
      await sql`UPDATE payments SET status = 'paid' WHERE mollie_payment_id = ${molliePaymentId}`;

      // Send confirmation email
      try {
        await sendOrderConfirmation({
          to: orderData.userEmail,
          orderId,
          companyName: orderData.companyName,
          contactPerson: orderData.contactPerson,
          items: orderData.items.map((item: any) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.priceAtPurchase,
          })),
          subtotal: orderData.subtotal,
          shippingCost: orderData.shippingCost,
          total: orderData.total,
          shippingAddress: orderData.shippingAddress,
          shippingCity: orderData.shippingCity,
          shippingPostalCode: orderData.shippingPostalCode,
          shippingCountry: orderData.shippingCountry,
        });
      } catch (emailErr) {
        console.error('Email send failed:', emailErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Mollie webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
