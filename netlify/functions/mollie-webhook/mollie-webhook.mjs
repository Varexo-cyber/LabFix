import { createMollieClient } from '@mollie/api-client';
import { neon } from '@neondatabase/serverless';

export const handler = async (event, context) => {
  console.log('🔔 Mollie webhook received:', { timestamp: new Date().toISOString() });
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const params = new URLSearchParams(event.body);
    const molliePaymentId = params.get('id');

    console.log('💳 Payment ID:', molliePaymentId);

    if (!molliePaymentId) {
      console.error('❌ No payment ID provided');
      return { statusCode: 400, body: 'No payment ID' };
    }

    const mollieApiKey = process.env.MOLLIE_API_KEY;
    if (!mollieApiKey) {
      console.error('❌ Mollie API key not configured');
      return { statusCode: 500, body: 'Mollie API key not configured' };
    }

    const mollie = createMollieClient({ apiKey: mollieApiKey });
    const payment = await mollie.payments.get(molliePaymentId);
    
    console.log('💰 Payment status:', payment.status, 'Order ID:', payment.metadata?.orderId);

    const sql = neon(process.env.DATABASE_URL);

    await sql`UPDATE payments SET status = ${payment.status}, updated_at = NOW() WHERE mollie_payment_id = ${molliePaymentId}`;

    if (payment.status === 'paid') {
      const orderId = payment.metadata?.orderId;
      
      if (!orderId) {
        console.error('❌ Missing orderId in metadata');
        return { statusCode: 400, body: 'Missing orderId' };
      }

      const paymentRows = await sql`SELECT order_data FROM payments WHERE mollie_payment_id = ${molliePaymentId} LIMIT 1`;
      const orderData = paymentRows[0]?.order_data;

      if (!orderData) {
        console.error('❌ Order data not found for payment:', molliePaymentId);
        return { statusCode: 500, body: 'Order data not found' };
      }

      console.log('📦 Creating order:', orderId);

      const existing = await sql`SELECT id FROM orders WHERE id = ${orderId}`;
      if (existing.length > 0) {
        console.log('✅ Order already exists:', orderId);
        return { statusCode: 200, body: JSON.stringify({ received: true, orderId, alreadyExists: true }) };
      }

      // Create order with all columns
      await sql`
        INSERT INTO orders (
          id, user_id, user_email, company_name, kvk_number, vat_number,
          contact_person, phone,
          shipping_address, shipping_city, shipping_postal_code, shipping_country,
          billing_address, billing_city, billing_postal_code, billing_country,
          items, subtotal, shipping_cost, total, status, notes
        ) VALUES (
          ${orderId},
          ${orderData.userId || null},
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
          ${orderData.notes || ''}
        )
      `;

      console.log('✅ Order created:', orderId);

      await sql`UPDATE payments SET status = 'paid', order_id = ${orderId} WHERE mollie_payment_id = ${molliePaymentId}`;
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
    
  } catch (error) {
    console.error('❌ Webhook error:', error.message, error.stack);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
