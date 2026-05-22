import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// MobileSentrix API Config (OAuth 1.0a)
// Use proxy URL if available, otherwise fall back to direct API URL
const MS_API_URL = process.env.MOBILESENTRIX_PROXY_URL || process.env.MOBILESENTRIX_API_URL || 'https://www.mobilesentrix.eu/api/rest';
const MS_CONSUMER_KEY = process.env.MOBILESENTRIX_CONSUMER_KEY || '';
const MS_CONSUMER_SECRET = process.env.MOBILESENTRIX_CONSUMER_SECRET || '';
const MS_ACCESS_TOKEN = process.env.MOBILESENTRIX_ACCESS_TOKEN || '';
const MS_ACCESS_TOKEN_SECRET = process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET || '';

const SHIPPING_METHODS: Record<string, string> = {
  'postnl_standard': 'flatrate0p0',
  'postnl_12': 'flatrate0p1',
  'postnl_pickup': 'flatrate0p2',
  'dhl_express': 'flatrate0d4',
  'ups_standard': 'flatrate011',
  'pickup': 'flatrate1'
};

// OAuth 1.0a signature helper with debug logging
async function generateOAuthSignature(method: string, urlString: string, queryData: any = null) {
  console.log('🔐 OAuth Debug - Starting signature generation');
  console.log('🔐 Consumer Key:', MS_CONSUMER_KEY.substring(0, 10) + '...');
  console.log('🔐 Access Token:', MS_ACCESS_TOKEN.substring(0, 10) + '...');
  console.log('🔐 URL:', urlString);
  console.log('🔐 Method:', method);
  
  // Parse URL to separate base URL from query params
  const urlObj = new URL(urlString);
  const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
  
  // OAuth params
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: MS_CONSUMER_KEY,
    oauth_token: MS_ACCESS_TOKEN,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: Math.random().toString(36).substring(2, 15),
    oauth_version: '1.0'
  };
  
  // Add URL query params to the parameters for signing
  urlObj.searchParams.forEach((value, key) => {
    oauthParams[key] = value;
  });
  
  // Add any additional query data
  if (queryData) {
    Object.entries(queryData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        oauthParams[key] = String(value);
      }
    });
  }
  
  // Sort all params alphabetically by key
  const sortedKeys = Object.keys(oauthParams).sort();
  const sortedParams = sortedKeys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
    .join('&');
  
  console.log('🔐 Sorted params:', sortedParams.substring(0, 150) + '...');
  
  // Create signature base string
  const signatureBase = `${method.toUpperCase()}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(sortedParams)}`;
  // OAuth 1.0a spec: secrets MUST be URL-encoded in signing key
  const signingKey = `${encodeURIComponent(MS_CONSUMER_SECRET)}&${encodeURIComponent(MS_ACCESS_TOKEN_SECRET)}`;
  
  console.log('🔐 Base URL for signing:', baseUrl);
  console.log('🔐 Signature base (first 150 chars):', signatureBase.substring(0, 150) + '...');
  console.log('🔐 Signing key (first 20 chars):', signingKey.substring(0, 20) + '...');
  
  const crypto = await import('crypto');
  const signature = crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');
  
  console.log('🔐 Generated signature:', signature);
  
  // Build auth header (oauth params only, not the query params)
  const authParams = {
    oauth_consumer_key: MS_CONSUMER_KEY,
    oauth_token: MS_ACCESS_TOKEN,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: oauthParams.oauth_timestamp,
    oauth_nonce: oauthParams.oauth_nonce,
    oauth_version: '1.0',
    oauth_signature: signature
  };
  
  const authHeader = 'OAuth ' + Object.entries(authParams)
    .map(([k, v]) => `${k}="${encodeURIComponent(v)}"`)
    .join(', ');
  
  console.log('🔐 Final auth header:', authHeader.substring(0, 200) + '...');
  
  return authHeader;
}

// MobileSentrix API helper - using proxy
async function msApiCall(endpoint: string, method: string = 'GET', data: any = null) {
  // Build the EXACT URL that MobileSentrix will see
  const baseUrl = 'https://www.mobilesentrix.eu/api/rest';
  let fullUrl = baseUrl + endpoint;
  
  // For GET requests, add query params to URL
  if (method === 'GET' && data) {
    const qs = new URLSearchParams(data).toString();
    fullUrl += (fullUrl.includes('?') ? '&' : '?') + qs;
  }
  
  console.log('🔧 Target URL for signature:', fullUrl);
  
  // Generate OAuth signature for the EXACT URL
  const authHeader = await generateOAuthSignature(method, fullUrl, null);
  
  // Send to proxy - proxy will forward exact request
  const proxyUrl = MS_API_URL;
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: endpoint.startsWith('/') ? endpoint : '/' + endpoint,
      oauthHeader: authHeader,
      method,
      queryParams: method === 'GET' ? (data || {}) : {},
      data: method !== 'GET' ? data : null,
      fullUrl
    })
  };
  
  console.log('========================================');
  console.log('🔧 MS API Request Details:');
  console.log('   Method:', method);
  console.log('   Endpoint:', endpoint);
  console.log('   Full URL for signature:', fullUrl);
  console.log('   Auth Header (first 100 chars):', authHeader.substring(0, 100));
  console.log('   Proxy URL:', proxyUrl);
  console.log('========================================');
  
  const res = await fetch(proxyUrl, options);
  
  console.log('🔧 Response status:', res.status);
  
  const responseText = await res.text();
  console.log('🔧 Response body:', responseText.substring(0, 500));
  
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch {
    responseData = responseText;
  }
  
  if (!res.ok) {
    throw new Error(`MS API ${endpoint} failed: ${res.status} - ${responseText}`);
  }
  
  return responseData;
}

// Find or create MS customer
async function findOrCreateMsCustomer(email: string, orderData: any) {
  try {
    console.log('🔍 Looking up MS customer by email:', email);
    try {
      const customers = await msApiCall('/customers', 'GET', { search: email });
      if (customers?.data?.length > 0) {
        console.log('✅ Found existing MS customer:', customers.data[0].customer_id);
        return customers.data[0].customer_id;
      }
    } catch (lookupErr: any) {
      // 403 = no permission to search, just try to create
      if (lookupErr.message.includes('403')) {
        console.log('⚠️ No permission to search customers, will try to create directly');
      } else {
        throw lookupErr;
      }
    }
    
    // Create new customer
    console.log('➕ Creating new MS customer for:', email);
    const nameParts = (orderData.contact_person || '').trim().split(' ');
    const firstname = nameParts[0] || orderData.company_name || 'LabFix';
    const lastname = nameParts.slice(1).join(' ') || 'Klant';
    const company = orderData.company_name || `${firstname} ${lastname}`;
    
    const newCustomer = await msApiCall('/customers', 'POST', {
      firstname,
      lastname,
      username: email,
      email,
      mobile: orderData.phone || '0000000000',
      password: Math.random().toString(36).slice(2, 12) + 'A1!',
      company,
      company_short: company.substring(0, 8),
      street: [orderData.shipping_address || ''],
      city: orderData.shipping_city || '',
      region: '',
      postcode: orderData.shipping_postal_code || '',
      country_id: 'NL',
      telephone: orderData.phone || '0000000000',
    });
    
    console.log('✅ New MS customer created:', newCustomer?.customer_id);
    return newCustomer?.customer_id;
  } catch (err: any) {
    console.error('❌ MS customer lookup/creation failed:', err.message);
    throw err;
  }
}

// Get or create MS address
async function getOrCreateMsAddress(customerId: string, addressData: any) {
  try {
    const addresses = await msApiCall(`/customers/${customerId}/addresses`);
    const existing = addresses?.data?.find((a: any) => 
      a.street?.[0] === addressData.street[0] && 
      a.postcode === addressData.postcode
    );
    if (existing) return existing.address_id;
    
    const newAddr = await msApiCall(`/customers/${customerId}/addresses`, 'POST', addressData);
    return newAddr?.address_id;
  } catch (err: any) {
    console.error('❌ MS address creation failed:', err.message);
    throw err;
  }
}

// Sync order to MobileSentrix
async function syncToMobileSentrix(orderData: any, orderId: string) {
  let msOrderId = '';
  let msIncrementId = '';
  
  try {
    console.log('🚀 Starting MobileSentrix sync for order:', orderId);
    
    // 1. Get or create customer
    const msCustomerId = await findOrCreateMsCustomer(orderData.user_email, orderData);
    if (!msCustomerId) {
      throw new Error('Could not resolve MS customer');
    }
    
    // 2. Prepare addresses
    const nameParts = (orderData.contact_person || '').trim().split(' ');
    const firstname = nameParts[0] || orderData.company_name || 'LabFix';
    const lastname = nameParts.slice(1).join(' ') || 'Klant';
    
    const shippingAddr = {
      firstname,
      lastname,
      street: [orderData.shipping_address || ''],
      city: orderData.shipping_city || '',
      country_id: 'NL',
      region: '',
      postcode: orderData.shipping_postal_code || '',
      telephone: orderData.phone || '0000000000',
      company: orderData.company_name || '',
      vat_id: orderData.vat_number || '',
    };
    
    const billingAddr = {
      firstname,
      lastname,
      street: [orderData.billing_address || orderData.shipping_address || ''],
      city: orderData.billing_city || orderData.shipping_city || '',
      country_id: 'NL',
      region: '',
      postcode: orderData.billing_postal_code || orderData.shipping_postal_code || '',
      telephone: orderData.phone || '0000000000',
      company: orderData.company_name || '',
      vat_id: orderData.vat_number || '',
    };
    
    // 3. Get/create addresses
    console.log('📍 Getting/creating MS addresses...');
    const [shippingId, billingId] = await Promise.all([
      getOrCreateMsAddress(msCustomerId, shippingAddr),
      getOrCreateMsAddress(msCustomerId, billingAddr),
    ]);
    console.log('📍 MS Addresses:', { shippingId, billingId });
    
    if (!shippingId || !billingId) {
      throw new Error('Missing MS address IDs');
    }
    
    // 4. Clear cart and add items
    console.log('🛒 Clearing MS cart...');
    await msApiCall('/cart', 'DELETE', { customrest: 1 });
    
    const items = Array.isArray(orderData.items) ? orderData.items : JSON.parse(orderData.items || '[]');
    const msProducts = items.map((item: any) => ({
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
      throw new Error('No quote ID from cart');
    }
    
    // 5. Create order
    console.log('📦 Creating MS order via /createorder...');
    const msOrder = await msApiCall('/createorder', 'POST', {
      customrest: 1,
      ordertype: 0,
      quote_id: parseInt(quoteId),
      billing_id: parseInt(billingId),
      shipping_id: parseInt(shippingId),
      shipping_method: SHIPPING_METHODS['postnl_standard'] || 'flatrate0p0',
      payment_method: 'mygateway',
      po_number: orderId,
    });
    
    msOrderId = msOrder?.order_id || '';
    msIncrementId = msOrder?.increment_id || '';
    
    if (msOrderId) {
      console.log(`✅ MobileSentrix order created: ${msOrderId} / ${msIncrementId}`);
      return { msOrderId, msIncrementId, success: true };
    } else {
      throw new Error('MS order creation returned no order ID');
    }
    
  } catch (err: any) {
    console.error('❌ MobileSentrix sync failed:', err.message);
    throw err;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }
    
    const sql = getDb();
    
    // Get order from database
    const orders = await sql`SELECT * FROM orders WHERE id = ${orderId}`;
    if (orders.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    const order = orders[0];
    
    // Check if already synced
    if (order.ms_order_id) {
      return NextResponse.json({ 
        error: 'Order already synced to MobileSentrix',
        msOrderId: order.ms_order_id,
        msIncrementId: order.ms_increment_id 
      }, { status: 400 });
    }
    
    // Sync to MobileSentrix
    const result = await syncToMobileSentrix(order, orderId);
    
    // Update order with MS IDs
    await sql`
      UPDATE orders 
      SET ms_order_id = ${result.msOrderId}, 
          ms_increment_id = ${result.msIncrementId},
          updated_at = NOW()
      WHERE id = ${orderId}
    `;
    
    return NextResponse.json({ 
      success: true, 
      msOrderId: result.msOrderId, 
      msIncrementId: result.msIncrementId 
    });
    
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
