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

    console.log('🔔 Mollie webhook received:', { molliePaymentId, timestamp: new Date().toISOString() });

    if (!molliePaymentId) {
      console.error('❌ Webhook: No payment ID provided');
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    const mollieApiKey = process.env.MOLLIE_API_KEY;
    if (!mollieApiKey) {
      console.error('❌ Webhook: Mollie API key not configured');
      return NextResponse.json({ error: 'Mollie API key not configured' }, { status: 500 });
    }

    const mollie = createMollieClient({ apiKey: mollieApiKey });
    const payment = await mollie.payments.get(molliePaymentId);
    
    console.log('💰 Payment status:', payment.status, 'Order ID:', (payment.metadata as any)?.orderId);

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
        console.error('❌ Webhook: missing orderId in metadata');
        return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
      }

      // Fetch orderData from DB (stored before payment was created to avoid Mollie 1024 byte metadata limit)
      const paymentRow = await sql`SELECT order_data FROM payments WHERE mollie_payment_id = ${molliePaymentId} LIMIT 1`;
      const orderData = paymentRow[0]?.order_data || null;

      console.log('📦 Order data found:', orderData ? 'YES' : 'NO', 'OrderId:', orderId);

      if (!orderData) {
        console.error('❌ Webhook: orderData not found in DB for payment', molliePaymentId);
        // Return 500 so Mollie will retry
        return NextResponse.json({ error: 'Order data not found' }, { status: 500 });
      }

      // Check if order already exists (idempotency)
      // BUT: if MS sync failed previously (ms_order_id empty), allow retry
      const existing = await sql`SELECT id, ms_order_id FROM orders WHERE id = ${orderId}`;
      const orderAlreadyExists = existing.length > 0;
      const needsMsRetry = orderAlreadyExists && !existing[0].ms_order_id;

      if (orderAlreadyExists && !needsMsRetry) {
        console.log('✅ Order already exists with MS sync:', orderId, 'ms_order_id:', existing[0].ms_order_id);
        return NextResponse.json({ received: true, orderId, alreadyExists: true });
      }

      if (needsMsRetry) {
        console.log('🔁 Order exists but MS sync missing, retrying MS sync only:', orderId);
      } else {
        console.log('🚀 Starting order creation for:', orderId);
      }

      // ── MobileSentrix order sync ──────────────────────────────────────────
      let msOrderId = '';
      let msIncrementId = '';

      try {
        const nameParts = (orderData.contactPerson || '').trim().split(' ');
        const firstname = nameParts[0] || orderData.companyName || 'LabFix';
        const lastname = nameParts.slice(1).join(' ') || 'Klant';

        // LabFix consumer can't search/create MS customers — use fixed customer ID
        // (Labfix MS account; addresses get added per order)
        const msCustomerId = process.env.MOBILESENTRIX_CUSTOMER_ID || '60012677';
        console.log('👤 Using fixed MS customer ID:', msCustomerId);

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

          console.log('📍 Getting/creating MS addresses...');
          const [msShippingAddressId, msBillingAddressId] = await Promise.all([
            getOrCreateMsAddress(msCustomerId, shippingAddrInput),
            getOrCreateMsAddress(msCustomerId, billingAddrInput),
          ]);
          console.log('📍 MS Addresses:', { msShippingAddressId, msBillingAddressId });

          await msClearCart();
          console.log('🛒 MS Cart cleared');
          
          const msProducts = orderData.items.map((item: any) => ({
            sku: item.product.sku,
            qty: item.quantity,
          }));
          console.log('🛒 Adding to MS cart:', msProducts);
          
          const cartResponse = await msAddToCart(msProducts);
          const msQuoteId = cartResponse?.quote_id || '';
          console.log('🛒 MS Quote ID:', msQuoteId);

          if (msQuoteId && msShippingAddressId && msBillingAddressId) {
            console.log('📦 Creating MS order...');
            const msOrder = await msCreateOrder({
              quote_id: parseInt(msQuoteId),
              billing_id: parseInt(msBillingAddressId),
              shipping_id: parseInt(msShippingAddressId),
              shipping_method: orderData.msShippingMethod || SHIPPING_METHODS['postnl_standard'],
              payment_method: 'ideal',
              po_number: orderId,
            });
            msOrderId = msOrder?.order_id || '';
            msIncrementId = msOrder?.increment_id || '';
            console.log(`✅ MS order created: ${msOrderId} / ${msIncrementId} for LabFix order ${orderId}`);
          } else {
            console.error('❌ Cannot create MS order - missing quote or address IDs');
          }
        } else {
          console.error('❌ Webhook: could not resolve MS customer for order', orderId, orderData.userEmail);
        }
      } catch (msErr: any) {
        console.error('❌ MS order sync failed in webhook:', msErr.message, msErr.stack);
        // Continue - don't fail the whole webhook, just log the error
      }
      // ─────────────────────────────────────────────────────────────────────

      // Create or UPDATE order in LabFix DB
      console.log('💾 Saving LabFix order in database (insert or update)...');
      try {
        if (needsMsRetry) {
          // Order exists, just update MS fields
          await sql`
            UPDATE orders SET ms_order_id = ${msOrderId}, ms_increment_id = ${msIncrementId}
            WHERE id = ${orderId}
          `;
          console.log('✅ LabFix order MS fields updated:', orderId);
        } else {
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
          console.log('✅ LabFix order created in database:', orderId);
        }
      } catch (dbErr: any) {
        console.error('❌ Database error saving order:', dbErr.message, dbErr.stack);
        throw dbErr; // Re-throw so Mollie will retry
      }

      // Update payment with orderId link
      await sql`UPDATE payments SET status = 'paid', order_id = ${orderId} WHERE mollie_payment_id = ${molliePaymentId}`;
      console.log('💾 Payment record updated');

      // Skip email if this was just an MS sync retry (email was already sent before)
      if (needsMsRetry) {
        console.log('⏩ Skipping email send (this was MS-only retry)');
        return NextResponse.json({ received: true, orderId, msRetry: true, msOrderId, msIncrementId });
      }

      // Fetch invoice PDF for email attachment
      let invoiceBuffer: Buffer | undefined;
      try {
        const baseUrl = process.env.URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://labfix.nl';
        const pdfRes = await fetch(`${baseUrl}/api/orders/${encodeURIComponent(orderId)}/invoice?download=1`);
        if (pdfRes.ok) {
          const arrayBuf = await pdfRes.arrayBuffer();
          invoiceBuffer = Buffer.from(arrayBuf);
          console.log('📎 Invoice PDF fetched:', invoiceBuffer.length, 'bytes');
        } else {
          console.warn('⚠️ Could not fetch invoice PDF, status:', pdfRes.status);
        }
      } catch (pdfErr: any) {
        console.error('⚠️ Failed to fetch invoice PDF:', pdfErr.message);
      }

      // Send confirmation email
      console.log('📧 Sending order confirmation email to:', orderData.userEmail);
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
          invoiceBuffer,
        });
        console.log('✅ Order confirmation email sent');
      } catch (emailErr: any) {
        console.error('❌ Email send failed:', emailErr.message, emailErr.stack);
        // Don't fail the webhook if email fails - order is already created
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Mollie webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
