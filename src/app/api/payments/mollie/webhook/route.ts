import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';
import { getDb } from '@/lib/db';
import { addToCart as msAddToCart, clearCart as msClearCart, createOrder as msCreateOrder, getOrCreateMsAddress, findMsCustomerByEmail, createCustomer as msCreateCustomer, SHIPPING_METHODS } from '@/lib/mobilesentrix-new';
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

      if (!orderId) {
        console.error('Webhook: missing orderId in metadata');
        return NextResponse.json({ received: true });
      }

      // Fetch orderData from DB (stored before payment was created to avoid Mollie 1024 byte metadata limit)
      const paymentRow = await sql`SELECT order_data FROM payments WHERE mollie_payment_id = ${molliePaymentId} LIMIT 1`;
      const orderData = paymentRow[0]?.order_data || null;

      if (!orderData) {
        console.error('Webhook: orderData not found in DB for payment', molliePaymentId);
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
        const nameParts = (orderData.contactPerson || '').trim().split(' ');
        const firstname = nameParts[0] || orderData.companyName || 'LabFix';
        const lastname = nameParts.slice(1).join(' ') || 'Klant';

        // Resolve MS customer ID — use stored one, else look up by email, else create new
        let msCustomerId = orderData.msCustomerId || '';

        if (!msCustomerId && orderData.userEmail) {
          msCustomerId = (await findMsCustomerByEmail(orderData.userEmail)) || '';
        }

        if (!msCustomerId && orderData.userEmail) {
          // Create new MS customer for guest/new user
          const company = orderData.companyName || `${firstname} ${lastname}`;
          await msCreateCustomer({
            firstname,
            lastname,
            username: orderData.userEmail,
            email: orderData.userEmail,
            mobile: orderData.phone || '0000000000',
            password: Math.random().toString(36).slice(2, 12) + 'A1!',
            company,
            company_short: company.substring(0, 8),
            street: [orderData.shippingAddress || ''],
            city: orderData.shippingCity || '',
            region: '',
            postcode: orderData.shippingPostalCode || '',
            country_id: orderData.shippingCountryCode || 'NL',
            telephone: orderData.phone || '0000000000',
          });
          msCustomerId = (await findMsCustomerByEmail(orderData.userEmail)) || '';
        }

        if (msCustomerId) {
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
            console.log(`MS order created: ${msOrderId} / ${msIncrementId} for LabFix order ${orderId}`);
          }
        } else {
          console.error('Webhook: could not resolve MS customer for order', orderId, orderData.userEmail);
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
