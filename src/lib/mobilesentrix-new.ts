/**
 * Mobile Sentrix API Integration
 * Based on official API documentation
 * API Base: https://www.mobilesentrix.eu/api/rest
 * Authentication: OAuth 1.0a (Consumer Key, Consumer Secret, Access Token, Access Token Secret)
 */

import crypto from 'crypto';

// API Configuration
const API_BASE_URL = process.env.MOBILESENTRIX_API_URL || 'https://www.mobilesentrix.eu';
const CONSUMER_KEY = process.env.MOBILESENTRIX_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MOBILESENTRIX_CONSUMER_SECRET || '';
const ACCESS_TOKEN = process.env.MOBILESENTRIX_ACCESS_TOKEN || '';
const ACCESS_TOKEN_SECRET = process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET || '';

// OAuth 1.0a Helper Functions
function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}

function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

function generateSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  
  return crypto.createHmac('sha1', signingKey).update(signatureBaseString).digest('base64');
}

function generateOAuthHeader(
  method: string,
  endpoint: string,
  additionalParams: Record<string, string> = {}
): string {
  const url = `${API_BASE_URL}/api/rest${endpoint}`;
  const timestamp = generateTimestamp();
  const nonce = generateNonce();
  
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: CONSUMER_KEY,
    oauth_token: ACCESS_TOKEN,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: '1.0',
    ...additionalParams,
  };
  
  const signature = generateSignature(
    method,
    url,
    oauthParams,
    CONSUMER_SECRET,
    ACCESS_TOKEN_SECRET
  );
  
  oauthParams.oauth_signature = signature;
  
  const headerParts = Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');
  
  return `OAuth ${headerParts}`;
}

// Generic API request method
async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  additionalParams: Record<string, string> = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api/rest${endpoint}`;
  const oauthHeader = generateOAuthHeader(method, endpoint, additionalParams);
  
  const headers: Record<string, string> = {
    'Authorization': oauthHeader,
    'Accept': 'application/json',
  };
  
  if (body && method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }
  
  const options: RequestInit = {
    method,
    headers,
  };
  
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mobile Sentrix API Error ${response.status}: ${errorText}`);
  }
  
  return response.json();
}

// ==========================================
// CATEGORIES API
// ==========================================

export interface MSCategory {
  entity_id: string;
  level: number;
  children_count: number;
  meta_keywords: string;
  meta_title: string;
  is_anchor: string;
  is_part: string;
  is_active: string;
  name: string;
  has_children: boolean;
  image_url: string;
}

export async function getCategories(): Promise<MSCategory[]> {
  return apiRequest<MSCategory[]>('/categories', 'GET');
}

export async function getCategoryById(id: string): Promise<MSCategory[]> {
  return apiRequest<MSCategory[]>(`/categories/${id}`, 'GET');
}

// ==========================================
// PRODUCTS API  
// ==========================================

export interface MSProduct {
  entity_id: string;
  sku: string;
  new_sku: string | null;
  name: string;
  description?: string;
  short_description?: string;
  price: string;
  customer_price?: number;
  weight?: string;
  stock_id?: number;
  is_in_stock?: number;
  in_stock_qty?: number;
  is_saleable?: boolean;
  status: string;
  updated_at?: string;
  manufacturer?: string;
  manufacturer_text?: string;
  model?: string;
  model_text?: string | string[] | boolean;
  front_position?: string;
  front_position_text?: string;
  brand?: string | null;
  color?: string | null;
  color_text?: string;
  featured?: string;
  premium?: string;
  end_of_life?: string;
  warranty_period?: string;
  product_badges?: string | null;
  product_badges_text?: string | boolean;
  attribute_set?: string;
  attribute_set_id?: string;
  category_ids?: string[];
  related_product?: string[];
  image_url?: string;
  default_image?: string;
  url?: string;
  // Battery specific
  battery_volt?: string;
  battery_mah?: string;
  battery_wh?: string;
  battery_weight?: string;
  // Device specific
  device_manufacturer?: string;
  device_manufacturer_text?: string;
  device_model_text?: string;
  device_color?: string;
  device_color_text?: string;
  device_grade?: string;
  device_grade_text?: string;
  device_size?: string;
  device_size_text?: string;
  device_carrier?: string;
  device_carrier_text?: string;
}

// Get all products (paginated)
export async function getProducts(
  page: number = 1,
  limit: number = 100,
  load?: string
): Promise<Record<string, MSProduct>> {
  let endpoint = `/products?page=${page}&limit=${limit}`;
  if (load) endpoint += `&load=${encodeURIComponent(load)}`;
  return apiRequest<Record<string, MSProduct>>(endpoint, 'GET');
}

// Get products by category ID
export async function getProductsByCategory(categoryId: string, load?: string): Promise<Record<string, MSProduct>> {
  let endpoint = `/products?category_id=${categoryId}`;
  if (load) endpoint += `&load=${encodeURIComponent(load)}`;
  return apiRequest<Record<string, MSProduct>>(endpoint, 'GET');
}

// Get product by entity_id
export async function getProductById(entityId: string, load?: string): Promise<MSProduct> {
  let endpoint = `/products/${entityId}`;
  if (load) endpoint += `?load=${encodeURIComponent(load)}`;
  return apiRequest<MSProduct>(endpoint, 'GET');
}

// Get products by SKU(s) - supports multiple SKUs
export async function getProductsBySku(
  skus: string[],
  includeDisabled: boolean = false
): Promise<Record<string, MSProduct>> {
  const params = skus.map((sku, i) => `filter[1][attribute]=sku&filter[1][in][${i}]=${encodeURIComponent(sku)}`).join('&');
  let endpoint = `/products?${params}`;
  if (includeDisabled) endpoint += '&disableProducts=true';
  return apiRequest<Record<string, MSProduct>>(endpoint, 'GET');
}

// Get product by SKU (single) - uses filter_by_both_sku to check both sku and new_sku
export async function getProductBySku(sku: string): Promise<MSProduct | null> {
  const result = await apiRequest<Record<string, MSProduct>>(
    `/products?filter[1][attribute]=sku&filter[1][in][0]=${encodeURIComponent(sku)}&filter_by_both_sku=true`,
    'GET'
  );
  const values = Object.values(result);
  return values.length > 0 ? values[0] : null;
}

// Get device products (product_type=devicesystem)
export async function getDeviceProducts(
  page: number = 1,
  limit: number = 20
): Promise<Record<string, MSProduct> & { page_info?: { current_page_number: number; total_records: number; total_pages: number } }> {
  return apiRequest<any>(`/products?limit=${limit}&page=${page}&pageinfo=1&product_type=devicesystem`, 'GET');
}

// Search products (front-end search style)
export async function searchProducts(
  query: string,
  maxResults: number = 10,
  startIndex: number = 0
): Promise<{ categories: { category_id: string; title: string; link: string; image_link: string }[]; items: { product_id: string; title: string; price: string; product_code: string; image_link: string; quantity: string; tags: string }[]; total_items: number }> {
  const result = await apiRequest<{ data: any }>(
    `/searchproduct?q=${encodeURIComponent(query)}&max_results=${maxResults}&start_index=${startIndex}`,
    'GET'
  );
  return result?.data || { categories: [], items: [], total_items: 0 };
}

// Get product tags and compatibility by SKU(s)
export async function getProductTags(skus: string[]): Promise<Record<string, { sku: string; new_sku: string | null; tag: string[]; compatibility?: string[] }>> {
  const params = skus.map((sku, i) => `filter[1][attribute]=sku&filter[1][in][${i}]=${encodeURIComponent(sku)}`).join('&');
  return apiRequest<any>(`/tags?${params}`, 'GET');
}

// ==========================================
// CART API
// ==========================================

export interface MSCartItem {
  product_id: string;
  sku: string;
  qty: number;
  price: string;
  discount_amount: string;
  total: string;
}

export interface MSCart {
  items: MSCartItem[];
  coupon_code: string | null;
  subtotal: string;
}

// Get cart
export async function getCart(): Promise<MSCart> {
  return apiRequest<MSCart>('/cart', 'GET', { customrest: 1 });
}

// Clear cart
export async function clearCart(): Promise<void> {
  return apiRequest<void>('/cart', 'DELETE', { customrest: 1 });
}

// Add to cart
export async function addToCart(products: { sku: string; qty: number; entity_id?: string }[]): Promise<any> {
  return apiRequest<any>('/cart', 'POST', {
    customrest: 1,
    products: products.map(p => ({
      sku: p.sku,
      qty: p.qty,
      ...(p.entity_id && { entity_id: p.entity_id }),
    })),
  });
}

// Remove from cart (set qty to 0)
export async function removeFromCart(sku: string): Promise<any> {
  return apiRequest<any>('/cart', 'POST', {
    customrest: 1,
    products: [{ sku, qty: 0 }],
  });
}

// Update cart quantity
export async function updateCartQuantity(sku: string, qty: number, force: boolean = false): Promise<any> {
  const product: any = { sku, qty };
  if (force) {
    product.update = 1;
  }
  return apiRequest<any>('/cart', 'POST', {
    customrest: 1,
    products: [product],
  });
}

// ==========================================
// ORDERS API
// ==========================================

export interface MSOrderResponse {
  status: number;
  increment_id: string;
  order_id: string;
  battery_order_id?: string;
  battery_increment_id?: string;
}

export interface MSOrderRequest {
  quote_id: number;
  billing_id: number;
  shipping_id: number;
  shipping_method: string;
  payment_method: string;
  po_number?: string;
  ordertype?: number;
  secondary_shipping_method?: string;
}

export interface MSOrderItem {
  item_id: string;
  sku: string;
  name: string;
  qty_ordered: string;
  qty_shipped: string;
  qty_canceled: string;
  qty_refunded: string;
  price: string;
  base_row_total: string;
}

export interface MSOrder {
  entity_id: string;
  status: string;
  increment_id: string;
  customer_id: string;
  grand_total: string;
  subtotal: string;
  shipping_amount: string;
  discount_amount: string;
  created_at: string;
  tracking_number: string | null;
  delivery_date: string | null;
  payment_method: string;
  shipping_description: string;
  order_items: MSOrderItem[];
  addresses: { address_type: 'billing' | 'shipping'; firstname: string; lastname: string; street: string; city: string; region: string; postcode: string; country_id: string; telephone: string; company?: string }[];
}

// Create order
export async function createOrder(orderData: MSOrderRequest): Promise<MSOrderResponse> {
  return apiRequest<MSOrderResponse>('/createorder', 'POST', {
    customrest: 1,
    ordertype: 0,
    ...orderData,
  });
}

// Get all orders (paginated)
export async function getMsOrders(limit: number = 20, page: number = 1): Promise<Record<string, MSOrder>> {
  return apiRequest<Record<string, MSOrder>>(`/orders?limit=${limit}&page=${page}`, 'GET');
}

// Get single order by MS entity_id
export async function getMsOrderById(orderId: string): Promise<MSOrder> {
  return apiRequest<MSOrder>(`/orders/${orderId}`, 'GET');
}

// Get missing items for an order
export async function getMsOrderMissing(orderId: string): Promise<any[]> {
  return apiRequest<any[]>(`/orders/${orderId}/missing`, 'GET');
}

// Add comment to order
export async function addMsOrderComment(orderId: string, comment: string): Promise<void> {
  return apiRequest<void>(`/order/${orderId}/comment`, 'POST', {
    comment,
    customrest: 1,
  });
}

// Shipping methods — keyed by human name, value is the MS shipping code (used as both carrier_code_method_code)
// US methods
export const SHIPPING_METHODS_US = {
  'in_store_pickup':               'flatrate1_flatrate1',
  'fedex_ground':                  'flatrate3_flatrate3',
  'fedex_home_delivery':           'flatrate3hd_flatrate3hd',
  'fedex_standard_overnight':      'flatrate5_flatrate5',
  'fedex_priority_overnight':      'flatrate6_flatrate6',
  'fedex_2day':                    'flatrate4_flatrate4',
  'fedex_2day_one_rate':           'flatrate4pak_flatrate4pak',
  'fedex_saturday':                'flatrate8_flatrate8',
  'fedex_international_priority':  'flatrate10_flatrate10',
  'fedex_international_economy':   'flatrate11_flatrate11',
  'usps_first_class':              'flatrate14_flatrate14',
  'add_to_existing_order':         'flatrate7_flatrate7',
  'add_to_next_order':             'flatrate16_flatrate16',
  'own_shipping':                  'flatrate13_flatrate13',
  'reserve_stock':                 'futureorder_futureorder',
  'ups_ground':                    'flatrate003_flatrate003',
  'ups_standard_overnight':        'flatrate013_flatrate013',
  'ups_2day':                      'flatrate002_flatrate002',
  'ups_priority_overnight':        'flatrate001_flatrate001',
  'ups_saturday':                  'flatrate001s_flatrate001s',
  'ups_international_priority':    'flatrate007_flatrate007',
  'ups_international_economy':     'flatrate008_flatrate008',
  'usps_ground_advantage':         'flatrate0u0_flatrate0u0',
  'usps_priority_mail':            'flatrate0u1_flatrate0u1',
  'usps_priority_mail_express':    'flatrate0u2_flatrate0u2',
} as const;

// Europe (NL/EU) methods — LabFix default
export const SHIPPING_METHODS_EU = {
  'in_store_pickup':               'flatrate1_flatrate1',
  'fedex_priority':                'flatrate17_flatrate17',
  'fedex_priority_express':        'flatrate18_flatrate18',
  'fedex_international_priority':  'flatrate10_flatrate10',
  'fedex_regional_economy':        'flatrate19_flatrate19',
  'fedex_priority_express_intl':   'flatrate20_flatrate20',
  'fedex_economy':                 'flatrate11_flatrate11',
  'add_to_existing_order':         'flatrate7_flatrate7',
  'add_to_next_order':             'flatrate16_flatrate16',
  'own_shipping':                  'flatrate13_flatrate13',
  'reserve_stock':                 'futureorder_futureorder',
  'ups_saturday':                  'flatrate001s_flatrate001s',
  'ups_standard':                  'flatrate011_flatrate011',
  'ups_worldwide_express':         'flatrate007i_flatrate007i',
  'ups_standard_intl':             'flatrate011i_flatrate011i',
  'ups_express_saver':             'flatrate065i_flatrate065i',
  'dhl_domestic_1200':             'flatrate0d0_flatrate0d0',
  'dhl_domestic':                  'flatrate0d1_flatrate0d1',
  'postnl_standard':               'flatrate0p0_flatrate0p0',
  'postnl_before_1200':            'flatrate0p1_flatrate0p1',
  'postnl_collection_point':       'flatrate0p2_flatrate0p2',
  'dhl_express_1200':              'flatrate0d3_flatrate0d3',
  'dhl_express_worldwide':         'flatrate0d4_flatrate0d4',
  'dhl_economy_select':            'flatrate0d5_flatrate0d5',
} as const;

// Default alias — LabFix uses EU store
export const SHIPPING_METHODS = SHIPPING_METHODS_EU;

// ==========================================
// SHIPMENTS API
// ==========================================

export interface MSShipment {
  order_id: string;
  increment_id: string;
  shipping_name: string;
  shipping_company_name: string;
  order_created_date: string;
  tracking_number: string;
  order_shipped_date: string;
  total_quantity: number;
}

// Get all shipments
export async function getShipments(limit: number = 100, page: number = 1): Promise<MSShipment[]> {
  return apiRequest<MSShipment[]>(`/shipments?limit=${limit}&page=${page}`, 'GET');
}

// Get shipments filtered by date range
export async function getShipmentsByDate(
  fromDate: string,
  toDate: string,
  limit: number = 100,
  page: number = 1
): Promise<MSShipment[]> {
  const from = encodeURIComponent(fromDate);
  const to = encodeURIComponent(toDate);
  return apiRequest<MSShipment[]>(
    `/shipments?limit=${limit}&filter[1][attribute]=order_shipped_date&filter[1][from]=${from}&filter[1][to]=${to}&page=${page}`,
    'GET'
  );
}

// Get shipment for a specific MS order (convenience: filter by order_id)
export async function getShipmentByOrderId(msOrderId: string): Promise<MSShipment | null> {
  const results = await apiRequest<MSShipment[]>(
    `/shipments?filter[1][attribute]=order_id&filter[1][eq]=${msOrderId}`,
    'GET'
  );
  return Array.isArray(results) && results.length > 0 ? results[0] : null;
}

// ==========================================
// SHIPPING CUTOFF API
// ==========================================

export interface MSShippingCutoff {
  shipping_method: string;
  shipping_description: string;
  free_shipping_amount: string;
  shipping_cutoff: Record<string, { from_1: string; to_1: string; shipday_1: string; from_2: string; to_2: string; shipday_2: string }>;
  add_to_existing: Record<string, { from: string; to: string }>;
}

export async function getShippingCutoffTimes(): Promise<Record<string, MSShippingCutoff>> {
  return apiRequest<Record<string, MSShippingCutoff>>('/cutofftime', 'GET');
}

// ==========================================
// SPLIT ORDER SHIPPING METHOD API
// ==========================================

export async function getSplitOrderShippingMethod(
  quoteId: string,
  shippingMethod: string
): Promise<{ custom_out: boolean; status: string; data: any[] }> {
  return apiRequest<any>('/splitOrderShippingMethod', 'POST', {
    quote_id: quoteId,
    shipping_method: shippingMethod,
  });
}

// ==========================================
// CUSTOMER API
// ==========================================

export interface MSCustomer {
  entity_id: string;
  email: string;
  firstname: string;
  lastname: string;
  mobile?: string;
  username?: string;
}

export interface MSCreateCustomerInput {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  company: string;
  company_short: string;
  street: string[];
  city: string;
  region: string;
  postcode: string;
  country_id: string;
  telephone: string;
  vat_numbers?: { vat_prefix: string; vat_number: string }[];
  company_website?: string;
}

export interface MSCreateCustomerResponse {
  success: boolean;
  message: string;
}

export interface MSCustomerAddress {
  entity_id: string;
  firstname: string;
  lastname: string;
  company?: string;
  company_short?: string;
  city: string;
  country_id: string;
  region: string;
  postcode: string;
  telephone: string;
  street: string[];
  vat_id?: string;
  is_default_billing?: number;
  is_default_shipping?: number;
}

export interface MSAddCustomerAddressInput {
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  country_id: string;
  region: string;
  postcode: string;
  telephone: string;
  company?: string;
  company_short?: string;
  vat_id?: string;
}

// Get customers (admin only)
export async function getCustomers(): Promise<Record<string, MSCustomer>> {
  return apiRequest<Record<string, MSCustomer>>('/customers', 'GET');
}

// Get customer by ID
export async function getCustomerById(customerId: string): Promise<MSCustomer> {
  return apiRequest<MSCustomer>(`/customers/${customerId}`, 'GET');
}

// Create customer at MobileSentrix
export async function createCustomer(customerData: MSCreateCustomerInput): Promise<MSCreateCustomerResponse> {
  return apiRequest<MSCreateCustomerResponse>('/createcustomer', 'POST', {
    customrest: 1,
    pre_mobile: 1,
    prefix_main_country_id: customerData.country_id,
    prefix: '31',
    prefix_country_id: customerData.country_id,
    vat_numbers: customerData.vat_numbers || [],
    user_code: '',
    describes_business: '',
    company_website: customerData.company_website || '',
    firstname: customerData.firstname,
    lastname: customerData.lastname,
    username: customerData.username,
    email: customerData.email,
    mobile: customerData.mobile,
    password: customerData.password,
    company: customerData.company,
    company_short: customerData.company_short.substring(0, 8),
    street: customerData.street,
    city: customerData.city,
    region: customerData.region,
    postcode: customerData.postcode,
    country_id: customerData.country_id,
    telephone: customerData.telephone,
  });
}

// Get customer default addresses
export async function getCustomerDefaultAddresses(customerId: string): Promise<MSCustomerAddress[]> {
  return apiRequest<MSCustomerAddress[]>(`/customers/${customerId}/addresses?default=1`, 'GET');
}

// Get customer notes
export async function getCustomerNotes(customerId: string, page: number = 1, perPage: number = 20): Promise<any> {
  return apiRequest<any>(`/customer/${customerId}/notes?page=${page}&per_page=${perPage}`, 'GET');
}

// Look up MS customer ID by email via search
export async function findMsCustomerByEmail(email: string): Promise<string | null> {
  try {
    const result = await searchCustomers(email);
    if (result?.success && result.results?.length > 0) {
      return result.results[0].cust_id || null;
    }
  } catch {
    // ignore
  }
  return null;
}

// Get customer addresses
export async function getCustomerAddresses(customerId: string): Promise<MSCustomerAddress[]> {
  return apiRequest<MSCustomerAddress[]>(`/customers/${customerId}/addresses`, 'GET');
}

// Strip leading zero and limit to 9 digits (MS API max length)
function normalizePhone(phone: string): string {
  const digitsOnly = (phone || '').replace(/\D/g, '');
  const stripped = digitsOnly.startsWith('0') ? digitsOnly.slice(1) : digitsOnly;
  return stripped.slice(0, 9) || '600000000';
}

// Add customer address
export async function addCustomerAddress(
  customerId: string,
  address: MSAddCustomerAddressInput
): Promise<MSCustomerAddress> {
  return apiRequest<MSCustomerAddress>(`/customers/${customerId}/addresses`, 'POST', {
    customrest: 1,
    prefix: '+31',
    prefix_country_id: address.country_id,
    company_short: address.company_short || address.company?.substring(0, 8) || 'LF',
    firstname: address.firstname,
    lastname: address.lastname,
    street: address.street,
    city: address.city,
    country_id: address.country_id,
    region: address.region || '0',
    postcode: address.postcode,
    telephone: normalizePhone(address.telephone),
    company: address.company || 'LabFix',
    vat_id: address.vat_id || '',
  });
}

// Update customer address
export async function updateCustomerAddress(
  addressId: string,
  address: Partial<MSAddCustomerAddressInput>
): Promise<MSCustomerAddress> {
  return apiRequest<MSCustomerAddress>(`/customers/addresses/${addressId}`, 'PUT', {
    ...address,
  });
}

// Helper: get existing matching address ID or create a new one
// Matches on FULL address (street + postcode + name) to avoid sending packages
// to the wrong customer who happens to live in the same city/postcode area.
export async function getOrCreateMsAddress(
  customerId: string,
  addressInput: MSAddCustomerAddressInput
): Promise<string> {
  try {
    const addresses = await getCustomerAddresses(customerId);
    const inputStreet = (addressInput.street?.[0] || '').trim().toLowerCase();
    const inputName = `${addressInput.firstname} ${addressInput.lastname}`.trim().toLowerCase();
    const existing = addresses.find((a) => {
      const aStreet = (a.street?.[0] || '').trim().toLowerCase();
      const aName = `${a.firstname || ''} ${a.lastname || ''}`.trim().toLowerCase();
      return (
        aStreet === inputStreet &&
        a.postcode === addressInput.postcode &&
        a.city?.toLowerCase() === addressInput.city?.toLowerCase() &&
        aName === inputName
      );
    });
    if (existing?.entity_id) return existing.entity_id;
  } catch {
    // ignore, create new
  }
  const created = await addCustomerAddress(customerId, addressInput);
  return created.entity_id;
}

// Generate customer login token
export async function generateCustomerToken(email: string): Promise<{ status: boolean; token?: string; message?: string }> {
  return apiRequest<{ status: boolean; token?: string; message?: string }>('/generatetoken', 'POST', {
    customrest: '1',
    email,
  });
}

// Search customers
export async function searchCustomers(query: string): Promise<{ success: boolean; results: { cust_id: string; cust_company: string; cust_name: string }[]; total: number }> {
  return apiRequest<any>(`/searchcustomers?q=${encodeURIComponent(query)}`, 'GET');
}

// ==========================================
// BROKENSCREENS API
// ==========================================

export type BSOrderType = 'rma' | 'dv_rma' | 'consignmentonerma' | 'core';

export interface BSAttachedOrder {
  order_type: BSOrderType;
  increment_id: string;
  entity_id: number | null;
  bs_increment_id: string;
}

export interface BSAttachOrderResponse {
  status: 0 | 1;
  message?: string;
  data?: BSAttachedOrder[];
}

// Attach a sub-order (RMA / Device RMA / IRP-ISP RMA / Core Processing) to a BS order
export async function attachBsOrder(params: {
  order_type: BSOrderType;
  customer_id: number;
  customer_address_id: number;
  bs_increment_id: string;
  label_type?: string;
  store_id?: number;
  bs_order_id?: number;
  order_ship_info?: string;
  admin_id?: number;
}): Promise<BSAttachOrderResponse> {
  return apiRequest<BSAttachOrderResponse>('/brokenscreens/attachorder', 'POST', {
    customrest: 1,
    label_type: 'bs_order',
    store_id: 1,
    bs_order_id: 0,
    ...params,
  });
}

// Record post-label steps after a customer shipping label has been generated
export async function recordBsCustomerShippingLabel(params: {
  tracking_number: string;
  customer_id: number;
  order_id: number;
  is_pre_send_label?: boolean;
  label_type?: string;
  fedex_label_type?: string;
  customer_email?: string;
  customer_name?: string;
  order_increment_id?: string;
  shipping_type_label?: string;
  shipping_type?: string;
  order_company?: string;
  amount_charged?: number;
  admin_name?: string;
}): Promise<{ status: 0 | 1; message: string }> {
  return apiRequest<{ status: 0 | 1; message: string }>('/brokenscreens/customershippinglabel', 'POST', {
    customrest: 1,
    is_pre_send_label: false,
    label_type: 'bs_order',
    fedex_label_type: 'BS',
    ...params,
  });
}

// Record pre-send label history (receive package)
export async function receiveBsPackage(params: {
  tracking_number: string;
  customer_id: number;
  order_id: number;
  label_type?: string;
  customer_name?: string;
  order_company?: string;
  shipping_type_label?: string;
}): Promise<{ status: 0 | 1; message: string }> {
  return apiRequest<{ status: 0 | 1; message: string }>('/brokenscreens/receivepackage', 'POST', {
    customrest: 1,
    label_type: 'bs_order',
    shipping_type_label: 'FedEx Ground',
    ...params,
  });
}

// ==========================================
// DISCONNECT / REVOKE OAUTH
// ==========================================

export function getDisconnectOAuthUrl(callbackUrl: string): string {
  const consumerName = encodeURIComponent(process.env.MOBILESENTRIX_CONSUMER_NAME || 'LabFix');
  const consumerKey = encodeURIComponent(CONSUMER_KEY);
  const consumerSecret = encodeURIComponent(CONSUMER_SECRET);
  const callback = encodeURIComponent(callbackUrl);
  return `${API_BASE_URL}/oauth/authorize/identifier?consumer=${consumerName}&authtype=1&flowentry=SignIn&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&session_revoke=1&callback=${callback}`;
}

// ==========================================
// TEST CONNECTION
// ==========================================

export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Try to get categories as a simple test
    const categories = await getCategories();
    return {
      success: true,
      message: `Verbinding succesvol! ${categories.length} categorieën gevonden.`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Verbinding mislukt: ${error.message}`,
    };
  }
}

// ==========================================
// PRODUCT IMPORT HELPER
// ==========================================

export function mapMobileSentrixToLabFix(
  msProduct: MSProduct,
  priceMarkupPercent: number = 0
) {
  const originalPrice = parseFloat(msProduct.price) || 0;
  const markupMultiplier = 1 + (priceMarkupPercent / 100);
  const price = Math.round(originalPrice * markupMultiplier * 100) / 100;
  
  return {
    name: msProduct.name,
    description: msProduct.description || '',
    price,
    originalPrice,
    sku: msProduct.sku,
    stock: msProduct.in_stock_qty || 0,
    inStock: msProduct.is_in_stock === 1 || msProduct.is_saleable === true,
    image: msProduct.image_url || msProduct.default_image || '',
    brand: msProduct.brand || msProduct.manufacturer_text || 'generic',
    category: (Array.isArray(msProduct.category_ids) ? msProduct.category_ids[0] : undefined) || 'onderdelen',
    condition: 'new',
    compatibleModels: Array.isArray(msProduct.model_text) ? msProduct.model_text : (msProduct.model_text && typeof msProduct.model_text === 'string' ? [msProduct.model_text] : []),
    msEntityId: msProduct.entity_id,
  };
}
