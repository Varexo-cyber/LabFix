import { NextResponse } from 'next/server';

// Try MULTIPLE approaches to bypass Cloudflare and find what works

export async function GET() {
  const results: any[] = [];
  const API_BASE = 'https://www.mobilesentrix.com';
  const endpoint = '/api/rest/categories';
  
  const CK = process.env.MOBILESENTRIX_CONSUMER_KEY;
  const CS = process.env.MOBILESENTRIX_CONSUMER_SECRET;
  const AT = process.env.MOBILESENTRIX_ACCESS_TOKEN;
  const ATS = process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET;
  
  if (!CK || !CS || !AT || !ATS) {
    return NextResponse.json({ error: 'Missing credentials' });
  }

  // Build OAuth signature (PLAINTEXT)
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = Math.random().toString(36).substring(2, 18);
  const signature = `${encodeURIComponent(CS)}&${encodeURIComponent(ATS)}`;

  // OAuth params
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: CK,
    oauth_token: AT,
    oauth_signature_method: 'PLAINTEXT',
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: '1.0',
    oauth_signature: signature,
  };

  // Build query string with OAuth params
  const qs = Object.entries(oauthParams)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  // === ATTEMPT 1: OAuth in Authorization header (current approach) ===
  try {
    const headerParts = Object.keys(oauthParams)
      .sort()
      .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
      .join(', ');
    
    const resp1 = await fetch(`${API_BASE}/api/rest${endpoint}`, {
      headers: {
        'Authorization': `OAuth ${headerParts}`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    const text1 = await resp1.text();
    results.push({
      attempt: 'OAuth Header',
      status: resp1.status,
      isCloudflare: text1.includes('Just a moment'),
      preview: text1.substring(0, 100),
    });
  } catch (e: any) {
    results.push({ attempt: 'OAuth Header', error: e.message });
  }

  // === ATTEMPT 2: OAuth in query string ===
  try {
    const resp2 = await fetch(`${API_BASE}/api/rest${endpoint}?${qs}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    const text2 = await resp2.text();
    results.push({
      attempt: 'OAuth in URL',
      status: resp2.status,
      isCloudflare: text2.includes('Just a moment'),
      preview: text2.substring(0, 100),
    });
  } catch (e: any) {
    results.push({ attempt: 'OAuth in URL', error: e.message });
  }

  // === ATTEMPT 3: HTTPS + exact magento format ===
  try {
    const resp3 = await fetch(`${API_BASE}/api/rest${endpoint}`, {
      headers: {
        'Authorization': `OAuth oauth_consumer_key="${CK}",oauth_token="${AT}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${timestamp}",oauth_nonce="${nonce}",oauth_version="1.0",oauth_signature="${signature}"`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    });
    
    const text3 = await resp3.text();
    results.push({
      attempt: 'No spaces in OAuth',
      status: resp3.status,
      isCloudflare: text3.includes('Just a moment'),
      preview: text3.substring(0, 100),
    });
  } catch (e: any) {
    results.push({ attempt: 'No spaces in OAuth', error: e.message });
  }

  // === ATTEMPT 4: Try api subdomain ===
  try {
    const resp4 = await fetch(`https://api.mobilesentrix.com/api/rest${endpoint}`, {
      headers: {
        'Authorization': `OAuth ${Object.keys(oauthParams).sort().map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`).join(', ')}`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    });
    
    const text4 = await resp4.text();
    results.push({
      attempt: 'api.mobilesentrix.com subdomain',
      status: resp4.status,
      isCloudflare: text4.includes('Just a moment'),
      preview: text4.substring(0, 100),
    });
  } catch (e: any) {
    results.push({ attempt: 'api.mobilesentrix.com subdomain', error: e.message });
  }

  // === ATTEMPT 5: Try with cookies/session simulation ===
  try {
    const resp5 = await fetch(`${API_BASE}/api/rest${endpoint}`, {
      headers: {
        'Authorization': `OAuth ${Object.keys(oauthParams).sort().map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`).join(', ')}`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.mobilesentrix.com/',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      },
    });
    
    const text5 = await resp5.text();
    results.push({
      attempt: 'Full browser headers',
      status: resp5.status,
      isCloudflare: text5.includes('Just a moment'),
      preview: text5.substring(0, 100),
    });
  } catch (e: any) {
    results.push({ attempt: 'Full browser headers', error: e.message });
  }

  return NextResponse.json({
    tested: results.length,
    results,
    anySuccess: results.some((r: any) => r.status === 200 && !r.isCloudflare),
  });
}
