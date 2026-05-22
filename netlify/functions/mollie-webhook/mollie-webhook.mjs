import { createMollieClient } from '@mollie/api-client';
import { neon } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';

// MobileSentrix API Config
const MS_API_URL = process.env.MS_API_URL || 'https://www.mobilesentrix.eu/api/v1';
const MS_USERNAME = process.env.MS_USERNAME || 'info@labfix.nl';
const MS_PASSWORD = process.env.MS_PASSWORD || '';
const SHIPPING_METHODS = {
  'postnl_standard': 'flatrate0p0',  // PostNL Standard Delivery (Europe/NL)
  'postnl_12': 'flatrate0p1',         // PostNL before 12:00
  'postnl_pickup': 'flatrate0p2',     // PostNL pickup point
  'dhl_express': 'flatrate0d4',       // DHL Express Worldwide
  'ups_standard': 'flatrate011',      // UPS Standard
  'pickup': 'flatrate1'               // In Store Pick Up
};

// MobileSentrix API helper
async function msApiCall(endpoint, method = 'GET', data = null) {
  const url = `${MS_API_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${MS_USERNAME}:${MS_PASSWORD}`).toString('base64')
    }
  };
  if (data) options.body = JSON.stringify(data);
  
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`MS API ${endpoint} failed: ${res.status}`);
  return res.json();
}

// Find or create MS customer
async function findOrCreateMsCustomer(email, orderData) {
  try {
    console.log('🔍 Looking up MS customer by email:', email);
    const customers = await msApiCall(`/customers?search=${encodeURIComponent(email)}`);
    if (customers?.data?.length > 0) {
      console.log('✅ Found existing MS customer:', customers.data[0].customer_id);
      return customers.data[0].customer_id;
    }
    
    // Create new customer
    console.log('➕ Creating new MS customer for:', email);
    const nameParts = (orderData.contactPerson || '').trim().split(' ');
    const firstname = nameParts[0] || orderData.companyName || 'LabFix';
    const lastname = nameParts.slice(1).join(' ') || 'Klant';
    const company = orderData.companyName || `${firstname} ${lastname}`;
    
    const newCustomer = await msApiCall('/customers', 'POST', {
      firstname,
      lastname,
      username: email,
      email,
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
    
    console.log('✅ New MS customer created:', newCustomer?.customer_id);
    return newCustomer?.customer_id;
  } catch (err) {
    console.error('❌ MS customer lookup/creation failed:', err.message);
    return null;
  }
}

// Get or create MS address
async function getOrCreateMsAddress(customerId, addressData) {
  try {
    const addresses = await msApiCall(`/customers/${customerId}/addresses`);
    const existing = addresses?.data?.find(a => 
      a.street?.[0] === addressData.street[0] && 
      a.postcode === addressData.postcode
    );
    if (existing) return existing.address_id;
    
    const newAddr = await msApiCall(`/customers/${customerId}/addresses`, 'POST', addressData);
    return newAddr?.address_id;
  } catch (err) {
    console.error('❌ MS address creation failed:', err.message);
    return null;
  }
}

// Sync order to MobileSentrix
async function syncToMobileSentrix(orderData, orderId) {
  let msOrderId = '';
  let msIncrementId = '';
  
  try {
    console.log('🚀 Starting MobileSentrix sync for order:', orderId);
    
    // 1. Get or create customer
    const msCustomerId = await findOrCreateMsCustomer(orderData.userEmail, orderData);
    if (!msCustomerId) {
      console.error('❌ Could not resolve MS customer');
      return { msOrderId, msIncrementId, success: false };
    }
    
    // 2. Prepare addresses
    const nameParts = (orderData.contactPerson || '').trim().split(' ');
    const firstname = nameParts[0] || orderData.companyName || 'LabFix';
    const lastname = nameParts.slice(1).join(' ') || 'Klant';
    
    const shippingAddr = {
      firstname,
      lastname,
      street: [orderData.shippingAddress || ''],
      city: orderData.shippingCity || '',
      country_id: orderData.shippingCountryCode || 'NL',
      region: '',
      postcode: orderData.shippingPostalCode || '',
      telephone: orderData.phone || '0000000000',
      company: orderData.companyName || '',
      vat_id: orderData.vatNumber || '',
    };
    
    const billingAddr = orderData.billingSameAsShipping ? shippingAddr : {
      firstname,
      lastname,
      street: [orderData.billingAddress || ''],
      city: orderData.billingCity || '',
      country_id: orderData.billingCountryCode || 'NL',
      region: '',
      postcode: orderData.billingPostalCode || '',
      telephone: orderData.phone || '0000000000',
      company: orderData.companyName || '',
      vat_id: orderData.vatNumber || '',
    };
    
    // 3. Get/create addresses
    console.log('📍 Getting/creating MS addresses...');
    const [shippingId, billingId] = await Promise.all([
      getOrCreateMsAddress(msCustomerId, shippingAddr),
      getOrCreateMsAddress(msCustomerId, billingAddr),
    ]);
    console.log('📍 MS Addresses:', { shippingId, billingId });
    
    if (!shippingId || !billingId) {
      console.error('❌ Missing MS address IDs');
      return { msOrderId, msIncrementId, success: false };
    }
    
    // 4. Clear cart and add items
    console.log('🛒 Clearing MS cart...');
    await msApiCall('/cart', 'DELETE', { customrest: 1 });
    
    const msProducts = orderData.items.map(item => ({
      sku: item.product?.sku || item.sku,
      qty: item.quantity,
    }));
    console.log('🛒 Adding to MS cart:', msProducts);
    
    const cartRes = await msApiCall('/cart', 'POST', { 
      customrest: 1, 
      products: msProducts 
    });
    const quoteId = cartRes?.quote_id;
    console.log('🛒 MS Quote ID:', quoteId);
    
    if (!quoteId) {
      console.error('❌ No quote ID from cart');
      return { msOrderId, msIncrementId, success: false };
    }
    
    // 5. Create order (using correct endpoint /createorder)
    console.log('📦 Creating MS order via /createorder...');
    const msOrder = await msApiCall('/createorder', 'POST', {
      customrest: 1,
      ordertype: 0,
      quote_id: parseInt(quoteId),
      billing_id: parseInt(billingId),
      shipping_id: parseInt(shippingId),
      shipping_method: orderData.msShippingMethod || SHIPPING_METHODS['postnl_standard'] || 'flatrate0p0',
      payment_method: 'mygateway',
      po_number: orderId,
    });
    
    msOrderId = msOrder?.order_id || '';
    msIncrementId = msOrder?.increment_id || '';
    
    if (msOrderId) {
      console.log(`✅ MobileSentrix order created: ${msOrderId} / ${msIncrementId}`);
      return { msOrderId, msIncrementId, success: true };
    } else {
      console.error('❌ MS order creation returned no order ID');
      return { msOrderId, msIncrementId, success: false };
    }
    
  } catch (err) {
    console.error('❌ MobileSentrix sync failed:', err.message);
    return { msOrderId, msIncrementId, success: false, error: err.message };
  }
}

// Email transporter (using same config as Geheim Admin)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_LABFIX || 'smtp.zoho.eu',
  port: parseInt(process.env.SMTP_PORT_LABFIX || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER_LABFIX || 'info@labfix.nl',
    pass: process.env.SMTP_PASS_LABFIX,
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

      // Sync to MobileSentrix FIRST (before creating local order)
      console.log('🔄 Starting MobileSentrix sync...');
      const msResult = await syncToMobileSentrix(orderData, orderId);
      
      if (msResult.success) {
        console.log(`✅ MobileSentrix sync successful: ${msResult.msOrderId} / ${msResult.msIncrementId}`);
      } else {
        console.error('❌ MobileSentrix sync failed, but continuing with local order creation');
      }

      // Create order with all columns (including MS order IDs)
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
          ${orderData.notes || ''},
          ${msResult.msOrderId || ''},
          ${msResult.msIncrementId || ''}
        )
      `;

      console.log('✅ Order created:', orderId, 'MS Order:', msResult.msOrderId || 'N/A');

      // Send order confirmation email (don't fail if email fails)
      try {
        await sendOrderConfirmationEmail(orderData, orderId);
      } catch (emailErr) {
        console.error('❌ Email failed but order was created:', emailErr.message);
      }

      await sql`UPDATE payments SET status = 'paid', order_id = ${orderId} WHERE mollie_payment_id = ${molliePaymentId}`;
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
    
  } catch (error) {
    console.error('❌ Webhook error:', error.message, error.stack);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
