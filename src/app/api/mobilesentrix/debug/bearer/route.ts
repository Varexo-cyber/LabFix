import { NextResponse } from 'next/server';

const BEARER_TOKEN = process.env.MOBILESENTRIX_ACCESS_TOKEN || '';
const PROXY_URL = process.env.MOBILESENTRIX_PROXY_URL || 'https://mobilesentrix-proxy.lucky-bread-36a0.workers.dev';
const API_BASE_URL = process.env.MOBILESENTRIX_API_URL || 'https://www.mobilesentrix.com';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    env: {
      token_present: !!BEARER_TOKEN,
      token_length: BEARER_TOKEN.length,
      token_preview: BEARER_TOKEN.substring(0, 8) + '...',
      proxy_url: PROXY_URL,
      api_base: API_BASE_URL,
    },
    tests: [],
  };

  // Test 1: Proxy + adminuser (from docs)
  try {
    const proxyBody = {
      endpoint: '/adminuser',
      bearerHeader: `Bearer ${BEARER_TOKEN}`,
      method: 'GET',
      queryParams: {},
      apiBaseUrl: API_BASE_URL,
    };

    const proxyResponse = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proxyBody),
    });

    const proxyText = await proxyResponse.text();

    results.tests.push({
      name: 'Proxy → adminuser (from docs)',
      status: proxyResponse.status,
      preview: proxyText.substring(0, 300),
    });
  } catch (e: any) {
    results.tests.push({
      name: 'Proxy → adminuser',
      error: e.message,
    });
  }

  // Test 2: Proxy + categories
  try {
    const proxyBody = {
      endpoint: '/categories',
      bearerHeader: `Bearer ${BEARER_TOKEN}`,
      method: 'GET',
      queryParams: {},
      apiBaseUrl: API_BASE_URL,
    };

    const proxyResponse = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proxyBody),
    });

    const proxyText = await proxyResponse.text();

    results.tests.push({
      name: 'Proxy → categories',
      status: proxyResponse.status,
      preview: proxyText.substring(0, 300),
    });
  } catch (e: any) {
    results.tests.push({
      name: 'Proxy → categories',
      error: e.message,
    });
  }

  // Test 3: Direct (localhost only) → adminuser
  try {
    const directResponse = await fetch(`${API_BASE_URL}/api/rest/adminuser`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    const directText = await directResponse.text();

    results.tests.push({
      name: 'Direct → adminuser (no proxy)',
      status: directResponse.status,
      preview: directText.substring(0, 300),
    });
  } catch (e: any) {
    results.tests.push({
      name: 'Direct → adminuser',
      error: e.message,
    });
  }

  // Test 4: Direct (localhost only) → categories
  try {
    const directResponse = await fetch(`${API_BASE_URL}/api/rest/categories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    const directText = await directResponse.text();

    results.tests.push({
      name: 'Direct → categories (no proxy)',
      status: directResponse.status,
      preview: directText.substring(0, 300),
    });
  } catch (e: any) {
    results.tests.push({
      name: 'Direct → categories',
      error: e.message,
    });
  }

  // Test 5: Try .eu domain via proxy
  try {
    const proxyBody = {
      endpoint: '/categories',
      bearerHeader: `Bearer ${BEARER_TOKEN}`,
      method: 'GET',
      queryParams: {},
      apiBaseUrl: 'https://www.mobilesentrix.eu',
    };

    const proxyResponse = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proxyBody),
    });

    const proxyText = await proxyResponse.text();

    results.tests.push({
      name: 'Proxy → .eu/categories',
      status: proxyResponse.status,
      preview: proxyText.substring(0, 300),
    });
  } catch (e: any) {
    results.tests.push({
      name: 'Proxy → .eu/categories',
      error: e.message,
    });
  }

  return NextResponse.json(results);
}
