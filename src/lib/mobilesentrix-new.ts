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

// Get all products with pagination
export async function getProducts(
  page: number = 1,
  pageSize: number = 100,
  filters?: Record<string, string>
): Promise<MSProduct[]> {
  const params: Record<string, string> = {
    'searchCriteria[currentPage]': page.toString(),
    'searchCriteria[pageSize]': pageSize.toString(),
  };
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      params[`searchCriteria[filterGroups][0][filters][0][${key}]`] = value;
    });
  }
  
  return apiRequest<MSProduct[]>('/products', 'GET', undefined, params);
}

// Get product by SKU
export async function getProductBySku(sku: string): Promise<MSProduct> {
  return apiRequest<MSProduct>(`/products/${sku}`, 'GET');
}

// Search products
export async function searchProducts(query: string): Promise<MSProduct[]> {
  const params = {
    'searchCriteria[filterGroups][0][filters][0][field]': 'name',
    'searchCriteria[filterGroups][0][filters][0][value]': `%${query}%`,
    'searchCriteria[filterGroups][0][filters][0][conditionType]': 'like',
  };
  return apiRequest<MSProduct[]>('/products', 'GET', undefined, params);
}

// Get products by brand
export async function getProductsByBrand(brand: string): Promise<MSProduct[]> {
  const params = {
    'searchCriteria[filterGroups][0][filters][0][field]': 'brand',
    'searchCriteria[filterGroups][0][filters][0][value]': brand,
  };
  return apiRequest<MSProduct[]>('/products', 'GET', undefined, params);
}

// Get products by category
export async function getProductsByCategory(categoryId: string): Promise<MSProduct[]> {
  const params = {
    'searchCriteria[filterGroups][0][filters][0][field]': 'category_id',
    'searchCriteria[filterGroups][0][filters][0][value]': categoryId,
  };
  return apiRequest<MSProduct[]>('/products', 'GET', undefined, params);
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
  return apiRequest<MSCart>('/cart', 'POST', { customrest: 1 });
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
}

export interface MSOrderRequest {
  quote_id: string;
  billing_id: string;
  shipping_id: string;
  shipping_method: string;
  payment_method: string;
  po_number?: string;
}

// Create order
export async function createOrder(orderData: MSOrderRequest): Promise<MSOrderResponse> {
  return apiRequest<MSOrderResponse>('/createorder', 'POST', {
    customrest: '1',
    ...orderData,
  });
}

// Shipping methods mapping
export const SHIPPING_METHODS = {
  'fedex_standard_overnight': 'flatrate5_flatrate5',
  'fedex_priority_overnight': 'flatrate6_flatrate6',
  'fedex_saturday': 'flatrate8_flatrate8',
  'fedex_ground': 'flatrate3_flatrate3',
  'fedex_2day': 'flatrate4_flatrate4',
  'ups_standard_overnight': 'flatrate013_flatrate013',
  'ups_ground': 'flatrate003_flatrate003',
  'ups_priority_overnight': 'flatrate001_flatrate001',
  'ups_2nd_day': 'flatrate002_flatrate002',
  'ups_saturday': 'flatrate001s_flatrate001s',
  'usps_first_class': 'flatrate14_flatrate14',
} as const;

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
}

// Get customers (admin only)
export async function getCustomers(): Promise<Record<string, MSCustomer>> {
  return apiRequest<Record<string, MSCustomer>>('/customers', 'GET');
}

// Get customer by ID
export async function getCustomerById(customerId: string): Promise<MSCustomer> {
  return apiRequest<MSCustomer>(`/customers/${customerId}`, 'GET');
}

// Create customer
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

// Get customer addresses
export async function getCustomerAddresses(customerId: string): Promise<MSCustomerAddress[]> {
  return apiRequest<MSCustomerAddress[]>(`/customers/${customerId}/addresses`, 'GET');
}

// Add customer address
export async function addCustomerAddress(
  customerId: string,
  address: Omit<MSCustomerAddress, 'entity_id'>
): Promise<MSCustomerAddress> {
  return apiRequest<MSCustomerAddress>(`/customers/${customerId}/addresses`, 'POST', {
    customrest: 1,
    prefix: '1',
    prefix_country_id: address.country_id,
    company_short: address.company || 'MS',
    ...address,
  });
}

// Update customer address
export async function updateCustomerAddress(
  addressId: string,
  address: Partial<MSCustomerAddress>
): Promise<MSCustomerAddress> {
  return apiRequest<MSCustomerAddress>(`/customers/addresses/${addressId}`, 'PUT', {
    customrest: 1,
    ...address,
  });
}

// Generate customer login token
export async function generateCustomerToken(email: string): Promise<{ status: boolean; token?: string; message?: string }> {
  return apiRequest<{ status: boolean; token?: string; message?: string }>('/generatetoken', 'POST', {
    customrest: '1',
    email,
  });
}

// Search customers
export async function searchCustomers(query: string): Promise<any> {
  return apiRequest<any>(`/searchcustomers?q=${encodeURIComponent(query)}`, 'GET');
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
    stock: msProduct.stock_qty || 0,
    inStock: msProduct.is_in_stock,
    image: msProduct.image_url,
    brand: msProduct.brand || 'generic',
    category: msProduct.category || 'onderdelen',
    condition: msProduct.condition || 'new',
    compatibleModels: msProduct.compatible_models || [],
    msEntityId: msProduct.entity_id,
  };
}
