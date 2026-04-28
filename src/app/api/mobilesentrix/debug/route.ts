import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.MOBILESENTRIX_API_URL || 'https://www.mobilesentrix.com';
const CONSUMER_KEY = process.env.MOBILESENTRIX_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MOBILESENTRIX_CONSUMER_SECRET || '';
const ACCESS_TOKEN = process.env.MOBILESENTRIX_ACCESS_TOKEN || '';
const ACCESS_TOKEN_SECRET = process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET || '';

function createOAuthHeader(method: string, endpoint: string): string {
  const crypto = require('crypto');
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  
  const signature = `${encodeURIComponent(CONSUMER_SECRET)}&${encodeURIComponent(ACCESS_TOKEN_SECRET)}`;
  
  const params: Record<string, string> = {
    oauth_consumer_key: CONSUMER_KEY,
    oauth_token: ACCESS_TOKEN,
    oauth_signature_method: 'PLAINTEXT',
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: '1.0',
    oauth_signature: signature,
  };
  
  const headerParts = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(params[key])}"`)
    .join(', ');
  
  return `OAuth ${headerParts}`;
}

async function tryFetch(url: string, method: string = 'GET'): Promise<any> {
  const endpoint = url.replace(`${API_BASE_URL}/api/rest`, '').split('?')[0];
  const oauthHeader = createOAuthHeader(method, endpoint);
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': oauthHeader,
        'Accept': 'application/json',
      },
    });
    
    const text = await response.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    
    return {
      url,
      status: response.status,
      statusText: response.statusText,
      isJson: json !== null,
      dataType: json ? (Array.isArray(json) ? 'array' : typeof json) : 'not-json',
      itemCount: json ? (Array.isArray(json) ? json.length : (typeof json === 'object' ? Object.keys(json).length : 0)) : 0,
      sampleKeys: json && typeof json === 'object' && !Array.isArray(json) ? Object.keys(json).slice(0, 10) : null,
      firstItem: json ? (Array.isArray(json) ? json[0] : Object.values(json)[0]) : null,
      rawPreview: text.substring(0, 500),
    };
  } catch (error: any) {
    return {
      url,
      error: error.message,
    };
  }
}

export async function GET(request: NextRequest) {
  const base = `${API_BASE_URL}/api/rest`;
  
  const results: Record<string, any> = {};
  
  // Test 1: Basic /products (no params)
  results['products_no_params'] = await tryFetch(`${base}/products`);
  
  // Test 2: /products with limit
  results['products_limit_50'] = await tryFetch(`${base}/products?limit=50`);
  
  // Test 3: /products with limit and page
  results['products_limit_50_page_1'] = await tryFetch(`${base}/products?limit=50&page=1`);
  
  // Test 4: /products with Magento 2 searchCriteria
  results['products_searchCriteria'] = await tryFetch(`${base}/products?searchCriteria[pageSize]=50&searchCriteria[currentPage]=1`);
  
  // Test 5: /products with category_id
  results['products_category_id'] = await tryFetch(`${base}/products?category_id=1&limit=50`);
  
  // Test 6: categories
  results['categories'] = await tryFetch(`${base}/categories`);
  
  return NextResponse.json({
    api_base: base,
    tests: results,
  });
}
