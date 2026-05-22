import { createMollieClient } from '@mollie/api-client';
import { neon } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zoho.eu',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'info@labfix.nl',
    pass: process.env.SMTP_PASS,
  },
});

// Send order confirmation email
async function sendOrderConfirmationEmail(orderData, orderId) {
  try {
    const itemRows = orderData.items
      .map(item => `
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;font-size:14px">${item.name}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:14px;color:#64748b">${item.quantity}x</td>
          <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:14px;font-weight:600">€${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
      ).join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8fafc; padding: 40px 20px; text-align: center;">
          <h1 style="color: #1e293b; margin: 0 0 10px 0; font-size: 28px;">Bedankt voor je bestelling!</h1>
          <p style="color: #64748b; margin: 0; font-size: 16px;">We hebben je bestelling succesvol ontvangen</p>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Bestelnummer</p>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1e293b;">${orderId}</p>
          </div>
          
          <h2 style="color: #1e293b; font-size: 18px; margin: 0 0 20px 0;">Bestelgegevens</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 12px 8px; text-align: left; font-size: 14px; color: #64748b; font-weight: 600;">Product</th>
                <th style="padding: 12px 8px; text-align: center; font-size: 14px; color: #64748b; font-weight: 600;">Aantal</th>
                <th style="padding: 12px 8px; text-align: right; font-size: 14px; color: #64748b; font-weight: 600;">Prijs</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #64748b;">Subtotaal</span>
              <span style="font-weight: 600;">€${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #64748b;">Verzendkosten</span>
              <span style="font-weight: 600;">€${orderData.shippingCost.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #e2e8f0;">
              <span style="font-weight: 600; font-size: 18px;">Totaal</span>
              <span style="font-weight: 700; font-size: 18px; color: #dc2626;">€${orderData.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1e293b;">Afleveradres</h3>
            <p style="margin: 0; color: #475569; line-height: 1.6;">
              ${orderData.contactPerson || ''}<br>
              ${orderData.shippingAddress || ''}<br>
              ${orderData.shippingPostalCode || ''} ${orderData.shippingCity || ''}<br>
              ${orderData.shippingCountry || ''}
            </p>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 30px 20px; text-align: center;">
          <p style="color: #64748b; margin: 0 0 10px 0;">Vragen over je bestelling?</p>
          <p style="color: #1e293b; margin: 0; font-weight: 600;">info@labfix.nl</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"LabFix" <info@labfix.nl>',
      to: orderData.userEmail,
      subject: `Bedankt voor je bestelling #${orderId}`,
      html: emailHtml,
    });

    console.log('✅ Order confirmation email sent to:', orderData.userEmail);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
}

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

      // Send order confirmation email
      await sendOrderConfirmationEmail(orderData, orderId);

      await sql`UPDATE payments SET status = 'paid', order_id = ${orderId} WHERE mollie_payment_id = ${molliePaymentId}`;
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
    
  } catch (error) {
    console.error('❌ Webhook error:', error.message, error.stack);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
