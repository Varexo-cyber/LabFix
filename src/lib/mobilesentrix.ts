/**
 * Mobile Sentrix API Integration
 * OAuth 1.0a Authentication Implementation
 * API Base: https://www.mobilesentrix.eu/api/rest/
 * 
 * REQUIRED ENVIRONMENT VARIABLES:
 * - MOBILESENTRIX_API_URL (default: https://www.mobilesentrix.eu)
 * - MOBILESENTRIX_CONSUMER_KEY
 * - MOBILESENTRIX_CONSUMER_SECRET  
 * - MOBILESENTRIX_ACCESS_TOKEN
 * - MOBILESENTRIX_ACCESS_TOKEN_SECRET
 */

import crypto from 'crypto';

// API Configuration
const API_BASE_URL = process.env.MOBILESENTRIX_API_URL || 'https://www.mobilesentrix.eu';
const CONSUMER_KEY = process.env.MOBILESENTRIX_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MOBILESENTRIX_CONSUMER_SECRET || '';
const ACCESS_TOKEN = process.env.MOBILESENTRIX_ACCESS_TOKEN || '';
const ACCESS_TOKEN_SECRET = process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET || '';

// ==========================================
// OAUTH 1.0a HELPER FUNCTIONS
// ==========================================

function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}

function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  // Mobilesentrix only supports PLAINTEXT signature method
  // Format: consumer_secret&token_secret
  return `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
}

function createOAuthHeader(
  method: string,
  endpoint: string
): string {
  const url = `${API_BASE_URL}/api/rest${endpoint}`;
  const timestamp = generateTimestamp();
  const nonce = generateNonce();
  
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: CONSUMER_KEY,
    oauth_token: ACCESS_TOKEN,
    oauth_signature_method: 'PLAINTEXT',
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: '1.0',
  };
  
  const signature = generateOAuthSignature(
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

// ==========================================
// CORE API REQUEST FUNCTION
// ==========================================

async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  queryParams: Record<string, string> = {}
): Promise<T> {
  // Build URL with query params
  let url = `${API_BASE_URL}/api/rest${endpoint}`;
  if (Object.keys(queryParams).length > 0) {
    const qs = Object.entries(queryParams)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    url += (url.includes('?') ? '&' : '?') + qs;
  }
  
  const oauthHeader = createOAuthHeader(method, endpoint);
  
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

  console.log(`[MS API] ${method} ${url}`);
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[MS API] Error ${response.status}:`, errorText.substring(0, 200));
    throw new Error(`Mobile Sentrix API Error ${response.status}: ${errorText.substring(0, 200)}`);
  }
  
  return response.json();
}

// ==========================================
// INTERFACE DEFINITIONS
// ==========================================

export interface MSProduct {
  entity_id: string;
  sku: string;
  name: string;
  description?: string;
  price: string;
  special_price?: string;
  stock_qty: number;
  is_in_stock: boolean;
  image_url: string;
  brand?: string;
  category?: string;
  condition?: string;
  warranty?: string;
  weight?: string;
  compatible_models?: string[];
}

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

export interface MSOrderResponse {
  status: number;
  increment_id: string;
  order_id: string;
}

export interface MSOrder {
  entity_id: string;
  status: string;
  shipping_description: string;
  customer_id: string | null;
  discount_amount: string;
  grand_total: string;
  shipping_amount: string;
  shipping_tax_amount: string;
  subtotal: string;
  tax_amount: string;
  increment_id: string;
  customer_email: string;
  store_currency_code: string;
  created_at: string;
  updated_at: string;
  store_location_id: string | null;
  delivery_date: string | null;
  payment_method: string;
  tracking_number: string | null;
  tax_name: string | null;
  tax_rate: string | null;
  addresses: MSOrderAddress[];
  order_items: MSOrderItem[];
}

export interface MSOrderAddress {
  region: string;
  postcode: string;
  lastname: string;
  street: string;
  city: string;
  email?: string;
  telephone: string;
  country_id: string;
  firstname: string;
  address_type: 'billing' | 'shipping';
  company?: string;
}

export interface MSOrderItem {
  item_id: string;
  sku: string;
  name: string;
  qty_canceled: string;
  qty_invoiced: string;
  qty_ordered: string;
  qty_refunded: string;
  qty_shipped: string;
  price: string;
  base_original_price: string;
  tax_percent: string;
  tax_amount: string;
  discount_amount: string;
  base_row_total: string;
  product_attribute_setid: string;
  imei?: string[];
}

export interface MSCustomer {
  entity_id: string;
  email: string;
  firstname: string;
  lastname: string;
  mobile?: string;
  username?: string;
}

export interface MSCustomerAddress {
  entity_id: string;
  firstname: string;
  lastname: string;
  company?: string;
  city: string;
  country_id: string;
  region: string;
  postcode: string;
  telephone: string;
  street: string[];
  is_default_billing?: number;
  is_default_shipping?: number;
  vat_numbers?: Array<{vat_prefix: string; vat_number: string}>;
  prefix?: string;
  prefix_country_id?: string;
  company_short?: string;
}

// ==========================================
// API FUNCTIONS - CATEGORIES
// ==========================================

export async function getCategories(): Promise<MSCategory[]> {
  return apiRequest<MSCategory[]>('/categories', 'GET');
}

export async function getCategoryById(id: string): Promise<MSCategory> {
  return apiRequest<MSCategory>(`/categories/${id}`, 'GET');
}

// ==========================================
// API FUNCTIONS - PRODUCTS
// ==========================================

export async function getProducts(
  page: number = 1,
  pageSize: number = 100
): Promise<MSProduct[]> {
  const params: Record<string, string> = {
    'limit': pageSize.toString(),
    'page': page.toString(),
  };
  return apiRequest<MSProduct[]>('/products', 'GET', undefined, params);
}

export async function getProductBySku(sku: string): Promise<MSProduct> {
  return apiRequest<MSProduct>(`/products/${sku}`, 'GET');
}

export async function searchProducts(query: string, pageSize: number = 100): Promise<MSProduct[]> {
  // Magento 1.x REST filter format
  const params: Record<string, string> = {
    'limit': pageSize.toString(),
    'page': '1',
    'filter[0][attribute]': 'name',
    'filter[0][like]': `%${query}%`,
  };
  return apiRequest<MSProduct[]>('/products', 'GET', undefined, params);
}

export async function getProductsByBrand(brand: string): Promise<MSProduct[]> {
  const params: Record<string, string> = {
    'limit': '100',
    'page': '1',
    'filter[0][attribute]': 'manufacturer',
    'filter[0][eq]': brand,
  };
  return apiRequest<MSProduct[]>('/products', 'GET', undefined, params);
}

export async function getProductsByCategory(categoryId: string, page: number = 1, pageSize: number = 100): Promise<MSProduct[]> {
  // Magento 1.x REST format: /products with limit, page, and category_id
  const params: Record<string, string> = {
    'limit': pageSize.toString(),
    'page': page.toString(),
    'category_id': categoryId,
  };
  return apiRequest<MSProduct[]>('/products', 'GET', undefined, params);
}

function toProductArray(result: any): any[] {
  let products: any[] = [];
  if (Array.isArray(result)) {
    products = result;
  } else if (result && typeof result === 'object') {
    products = Object.values(result);
  }
  return products.filter((p: any) => p && typeof p === 'object' && (p.sku || p.entity_id || p.name));
}

// Fetch ALL products across all pages (up to maxPages)
export async function getAllProducts(maxPages: number = 100, pageSize: number = 100): Promise<any[]> {
  const allProducts: any[] = [];
  
  for (let page = 1; page <= maxPages; page++) {
    console.log(`[MS API] Fetching all products page ${page}...`);
    try {
      const result = await getProducts(page, pageSize);
      const filtered = toProductArray(result);
      
      console.log(`[MS API] Page ${page}: got ${filtered.length} products`);
      if (filtered.length === 0) break;
      allProducts.push(...filtered);
      
      if (filtered.length < pageSize) break;
    } catch (error: any) {
      console.error(`[MS API] Error on page ${page}:`, error?.message);
      break;
    }
  }
  
  console.log(`[MS API] Total products fetched: ${allProducts.length}`);
  return allProducts;
}

// Fetch ALL products from a category across all pages
export async function getAllProductsByCategory(categoryId: string, maxPages: number = 100, pageSize: number = 100): Promise<any[]> {
  const allProducts: any[] = [];
  
  for (let page = 1; page <= maxPages; page++) {
    console.log(`[MS API] Fetching category ${categoryId} page ${page}...`);
    try {
      const result = await getProductsByCategory(categoryId, page, pageSize);
      const filtered = toProductArray(result);
      
      console.log(`[MS API] Category ${categoryId} page ${page}: got ${filtered.length} products`);
      if (filtered.length === 0) break;
      allProducts.push(...filtered);
      
      if (filtered.length < pageSize) break;
    } catch (error: any) {
      console.error(`[MS API] Error on category page ${page}:`, error?.message);
      // If first page fails, try without category filter
      if (page === 1) {
        console.log(`[MS API] Category filter might not be supported, try without`);
      }
      break;
    }
  }
  
  console.log(`[MS API] Total category products fetched: ${allProducts.length}`);
  return allProducts;
}

// ==========================================
// API FUNCTIONS - CART
// ==========================================

export async function getCart(): Promise<MSCart> {
  return apiRequest<MSCart>('/cart', 'POST', { customrest: 1 });
}

export async function clearCart(): Promise<void> {
  return apiRequest<void>('/cart', 'DELETE', { customrest: 1 });
}

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

export async function removeFromCart(sku: string): Promise<any> {
  return apiRequest<any>('/cart', 'POST', {
    customrest: 1,
    products: [{ sku, qty: 0 }],
  });
}

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
// API FUNCTIONS - ORDERS
// ==========================================

export async function createOrder(orderData: {
  quote_id: string;
  billing_id: string;
  shipping_id: string;
  shipping_method: string;
  payment_method: string;
  po_number?: string;
}): Promise<MSOrderResponse> {
  return apiRequest<MSOrderResponse>('/createorder', 'POST', {
    customrest: '1',
    ...orderData,
  });
}

export async function getOrders(
  limit?: number,
  page?: number,
  includeChild?: 'with' | 'only',
  childIds?: string[]
): Promise<Record<string, MSOrder>> {
  const params: Record<string, string> = {};
  if (limit) params['limit'] = limit.toString();
  if (page) params['page'] = page.toString();
  if (includeChild) params['include_child'] = includeChild;
  if (childIds) params['child_id'] = childIds.join(',');
  
  return apiRequest<Record<string, MSOrder>>('/orders', 'GET', undefined, params);
}

export async function getOrderById(id: string): Promise<MSOrder> {
  return apiRequest<MSOrder>(`/orders/${id}`, 'GET');
}

export async function getOrderMissingItems(id: string): Promise<any[]> {
  return apiRequest<any[]>(`/orders/${id}/missing`, 'GET');
}

export async function addOrderComment(id: string, comment: string): Promise<any> {
  return apiRequest<any>(`/order/${id}/comment`, 'POST', { comment });
}

// ==========================================
// API FUNCTIONS - SHIPPING CUTOFF
// ==========================================

export async function getShippingCutoff(): Promise<any> {
  return apiRequest<any>('/cutofftime', 'GET');
}

// ==========================================
// API FUNCTIONS - SHIPMENTS
// ==========================================

export async function getShipments(
  limit?: number,
  page?: number,
  fromDate?: string,
  toDate?: string
): Promise<any> {
  const params: Record<string, string> = {};
  if (limit) params['limit'] = limit.toString();
  if (page) params['page'] = page.toString();
  if (fromDate && toDate) {
    params['filter[1][attribute]'] = 'order_shipped_date';
    params['filter[1][from]'] = `${fromDate} 00:00:00`;
    params['filter[1][to]'] = `${toDate} 23:59:59`;
  }
  
  return apiRequest<any>('/shipments', 'GET', undefined, params);
}

// ==========================================
// API FUNCTIONS - BROKENSCREENS (ATTACHED ORDERS)
// ==========================================

export async function attachOrder(data: {
  order_type: 'rma' | 'dv_rma' | 'consignmentonerma' | 'core';
  customer_id: number;
  customer_address_id: number;
  bs_increment_id: string;
  bs_order_id?: number;
  store_id?: number;
  order_ship_info?: string;
  admin_id?: number;
  label_type?: string;
}): Promise<any> {
  return apiRequest<any>('/brokenscreens/attachorder', 'POST', {
    customrest: '1',
    store_id: 1,
    bs_order_id: 0,
    ...data,
  });
}

export async function customerShippingLabel(data: {
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
}): Promise<any> {
  return apiRequest<any>('/brokenscreens/customershippinglabel', 'POST', {
    customrest: '1',
    is_pre_send_label: false,
    label_type: 'bs_order',
    fedex_label_type: 'BS',
    ...data,
  });
}

export async function receivePackage(data: {
  tracking_number: string;
  customer_id: number;
  order_id: number;
  label_type?: string;
  customer_name?: string;
  order_company?: string;
  shipping_type_label?: string;
}): Promise<any> {
  return apiRequest<any>('/brokenscreens/receivepackage', 'POST', {
    customrest: '1',
    label_type: 'bs_order',
    shipping_type_label: 'FedEx Ground',
    ...data,
  });
}

// ==========================================
// API FUNCTIONS - CUSTOMERS
// ==========================================

export async function getCustomers(): Promise<Record<string, MSCustomer>> {
  return apiRequest<Record<string, MSCustomer>>('/customers', 'GET');
}

export async function getCustomersByStoreLocationId(storeLocationId: string): Promise<Record<string, MSCustomer>> {
  const params = {
    'filter[1][attribute]': 'store_location_id',
    'filter[1][eq]': storeLocationId,
  };
  return apiRequest<Record<string, MSCustomer>>('/customers', 'GET', undefined, params);
}

export async function getCustomerById(customerId: string): Promise<MSCustomer> {
  return apiRequest<MSCustomer>(`/customers/${customerId}`, 'GET');
}

export async function updateCustomer(
  customerId: string,
  customerData: Partial<MSCustomer>
): Promise<MSCustomer> {
  return apiRequest<MSCustomer>(`/customers/${customerId}`, 'PUT', customerData);
}

export async function getCustomerNotes(
  customerId: string,
  page?: number,
  perPage?: number
): Promise<{ success: boolean; total: number; page: number; per_page: number; notes: any[] }> {
  const params: Record<string, string> = {};
  if (page) params['page'] = page.toString();
  if (perPage) params['per_page'] = perPage.toString();
  
  return apiRequest<any>(`/customers/${customerId}/notes`, 'GET', undefined, params);
}

export async function createCustomerNote(
  customerId: string,
  text: string,
  authorEmail: string
): Promise<any> {
  return apiRequest<any>(`/customers/${customerId}/notes`, 'POST', {
    customrest: 1,
    text,
    author_email: authorEmail,
  });
}

export async function createCustomer(customerData: {
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
}): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>('/createcustomer', 'POST', {
    customrest: '1',
    pre_mobile: '1',
    prefix_main_country_id: customerData.country_id,
    prefix: '1',
    prefix_country_id: customerData.country_id,
    vat_numbers: [],
    user_code: '',
    describes_business: '',
    ...customerData,
  });
}

export async function getCustomerAddresses(customerId: string): Promise<MSCustomerAddress[]> {
  return apiRequest<MSCustomerAddress[]>(`/customers/${customerId}/addresses`, 'GET');
}

export async function getCustomerDefaultAddresses(customerId: string): Promise<MSCustomerAddress[]> {
  return apiRequest<MSCustomerAddress[]>(`/customers/${customerId}/addresses?default=1`, 'GET');
}

export async function getCustomerAddressById(addressId: string): Promise<MSCustomerAddress> {
  return apiRequest<MSCustomerAddress>(`/customers/addresses/${addressId}`, 'GET');
}

export async function addCustomerAddress(
  customerId: string,
  address: {
    firstname: string;
    lastname: string;
    country_id: string;
    city: string;
    postcode: string;
    telephone: string;
    region: string;
    company: string;
    street: string[];
    company_short?: string;
    prefix?: string;
    prefix_country_id?: string;
    vat_numbers?: Array<{vat_prefix: string; vat_number: string}>;
  }
): Promise<MSCustomerAddress> {
  return apiRequest<MSCustomerAddress>(`/customers/${customerId}/addresses`, 'POST', {
    customrest: 1,
    prefix: address.prefix || '1',
    prefix_country_id: address.prefix_country_id || address.country_id,
    company_short: address.company_short || address.company || 'MS',
    firstname: address.firstname,
    lastname: address.lastname,
    country_id: address.country_id,
    city: address.city,
    postcode: address.postcode,
    telephone: address.telephone,
    region: address.region,
    company: address.company,
    street: address.street,
    ...(address.vat_numbers && { vat_numbers: address.vat_numbers }),
  });
}

export async function updateCustomerAddress(
  addressId: string,
  address: {
    firstname?: string;
    lastname?: string;
    country_id?: string;
    city?: string;
    postcode?: string;
    telephone?: string;
    region?: string;
    company?: string;
    street?: string[];
    company_short?: string;
    prefix?: string;
    prefix_country_id?: string;
    vat_numbers?: Array<{vat_prefix: string; vat_number: string}>;
  }
): Promise<MSCustomerAddress> {
  return apiRequest<MSCustomerAddress>(`/customers/addresses/${addressId}`, 'PUT', {
    customrest: 1,
    prefix: address.prefix || '1',
    prefix_country_id: address.prefix_country_id || address.country_id,
    company_short: address.company_short || address.company || 'MS',
    ...address,
  });
}

export async function generateCustomerToken(email: string): Promise<{ status: boolean; token?: string; message?: string }> {
  return apiRequest<{ status: boolean; token?: string; message?: string }>('/generatetoken', 'POST', {
    customrest: '1',
    email,
  });
}

export async function forgotPassword(emailOrUsername: string): Promise<any> {
  return apiRequest<any>(`/forgotpassword?email=${encodeURIComponent(emailOrUsername)}`, 'GET');
}

export async function searchCustomers(query: string): Promise<any> {
  return apiRequest<any>(`/searchcustomers?q=${encodeURIComponent(query)}`, 'GET');
}

// ==========================================
// SHIPPING METHODS CONSTANTS
// ==========================================
// Format for createOrder: flatrate5_flatrate5 (double code)
// Format for cutofftime: flatrate5 (single code)

export const SHIPPING_METHODS = {
  // FedEx - Format: flatrate5_flatrate5 for createOrder
  FEDEX_STANDARD_OVERNIGHT: 'flatrate5_flatrate5',
  FEDEX_PRIORITY_OVERNIGHT: 'flatrate6_flatrate6',
  FEDEX_SATURDAY: 'flatrate8_flatrate8',
  FEDEX_GROUND: 'flatrate3_flatrate3',
  FEDEX_2DAY: 'flatrate4_flatrate4',
  FEDEX_INTERNATIONAL_PRIORITY: 'flatrate10_flatrate10',
  FEDEX_INTERNATIONAL_ECONOMY: 'flatrate11_flatrate11',
  
  // UPS - Format: flatrate013_flatrate013 for createOrder
  UPS_STANDARD_OVERNIGHT: 'flatrate013_flatrate013',
  UPS_GROUND: 'flatrate003_flatrate003',
  UPS_PRIORITY_OVERNIGHT: 'flatrate001_flatrate001',
  UPS_2ND_DAY: 'flatrate002_flatrate002',
  UPS_SATURDAY: 'flatrate001s_flatrate001s',
  
  // USPS - Format: flatrate14_flatrate14 for createOrder
  USPS_FIRST_CLASS: 'flatrate14_flatrate14',
  
  // Other
  IN_STORE_PICKUP: 'flatrate1_flatrate1',
  ADD_TO_EXISTING: 'flatrate7_flatrate7',
  OWN_SHIPPING: 'flatrate13_flatrate13',
} as const;

// Shipping method codes for cutofftime API (single code format)
export const SHIPPING_METHOD_CODES = {
  FEDEX_STANDARD_OVERNIGHT: 'flatrate5',
  FEDEX_PRIORITY_OVERNIGHT: 'flatrate6',
  FEDEX_SATURDAY: 'flatrate8',
  FEDEX_GROUND: 'flatrate3',
  FEDEX_2DAY: 'flatrate4',
  UPS_STANDARD_OVERNIGHT: 'flatrate013',
  UPS_GROUND: 'flatrate003',
  UPS_PRIORITY_OVERNIGHT: 'flatrate001',
  USPS_FIRST_CLASS: 'flatrate14',
} as const;

// ==========================================
// TEST CONNECTION
// ==========================================

export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Check if all required credentials are present
    if (!CONSUMER_KEY || !CONSUMER_SECRET || !ACCESS_TOKEN || !ACCESS_TOKEN_SECRET) {
      return {
        success: false,
        message: 'Ontbrekende API credentials. Controleer environment variables.',
      };
    }
    
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
    stock: msProduct.stock_qty || 0,
    inStock: msProduct.is_in_stock,
    image: msProduct.image_url,
    brand: msProduct.brand || 'generic',
    category: mapCategory(msProduct.category || 'parts'),
    condition: msProduct.condition || 'new',
    compatibleModels: msProduct.compatible_models || [],
    msEntityId: msProduct.entity_id,
  };
}

function mapCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'screens': 'schermen',
    'batteries': 'batterijen',
    'charging': 'oplaad',
    'cameras': 'cameras',
    'housing': 'behuizing',
    'tools': 'gereedschap',
    'accessories': 'accessoires',
    'parts': 'onderdelen',
    'devices': 'devices',
    '4': 'onderdelen',      // Parts
    '10': 'devices',        // Devices
    '12': 'macbook',        // Macbook Parts
    '13': 'gameconsole',     // Game Console
    '14': 'batterijen',     // Battery
    '17': 'gereedschap',    // Tools
    '20': 'accessoires',    // Accessories
  };

  return categoryMap[category.toLowerCase()] || category.toLowerCase();
}

// ==========================================
// LEGACY CLASS EXPORT (for backwards compatibility)
// ==========================================

class MobileSentrixApi {
  async getProducts(page = 1, pageSize = 100): Promise<MSProduct[]> {
    return getProducts(page, pageSize);
  }
  
  async getProductBySku(sku: string): Promise<MSProduct> {
    return getProductBySku(sku);
  }
  
  async getProductsByCategory(category: string): Promise<MSProduct[]> {
    return getProductsByCategory(category);
  }
  
  async getProductsByBrand(brand: string): Promise<MSProduct[]> {
    return getProductsByBrand(brand);
  }
  
  async getCategories(): Promise<MSCategory[]> {
    return getCategories();
  }
  
  async searchProducts(query: string): Promise<MSProduct[]> {
    return searchProducts(query);
  }
  
  async testConnection(): Promise<boolean> {
    const result = await testConnection();
    return result.success;
  }
}

export const mobileSentrixApi = new MobileSentrixApi();
export { MobileSentrixApi };
