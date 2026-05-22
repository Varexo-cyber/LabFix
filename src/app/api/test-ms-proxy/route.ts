import { NextResponse } from 'next/server';

// Test: Call MobileSentrix /categories (NO query params) via proxy
export async function GET() {
  const MS_CONSUMER_KEY = process.env.MOBILESENTRIX_CONSUMER_KEY || '';
  const MS_CONSUMER_SECRET = process.env.MOBILESENTRIX_CONSUMER_SECRET || '';
  const MS_ACCESS_TOKEN = process.env.MOBILESENTRIX_ACCESS_TOKEN || '';
  const MS_ACCESS_TOKEN_SECRET = process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET || '';
  const MS_PROXY_URL = process.env.MOBILESENTRIX_PROXY_URL || '';
  
  const method = 'GET';
  const endpoint = '/categories';
  const url = `https://www.mobilesentrix.eu/api/rest${endpoint}`;
  
  // Build OAuth params
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: MS_CONSUMER_KEY,
    oauth_nonce: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: MS_ACCESS_TOKEN,
    oauth_version: '1.0'
  };
  
  // Sort and create base string
  const sortedKeys = Object.keys(oauthParams).sort();
  const sortedParams = sortedKeys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
    .join('&');
  
  const signatureBase = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
  
  // Per OAuth 1.0a spec - encoded secrets in signing key
  const signingKey = `${encodeURIComponent(MS_CONSUMER_SECRET)}&${encodeURIComponent(MS_ACCESS_TOKEN_SECRET)}`;
  
  const crypto = await import('crypto');
  const signature = crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');
  
  oauthParams.oauth_signature = signature;
  
  const authHeader = 'OAuth ' + Object.keys(oauthParams).sort()
    .map(key => `${key}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');
  
  // Call proxy
  const proxyResponse = await fetch(MS_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint,
      oauthHeader: authHeader,
      method: 'GET',
      queryParams: {}
    })
  });
  
  const responseText = await proxyResponse.text();
  
  return NextResponse.json({
    status: proxyResponse.status,
    signatureBase: signatureBase,
    signingKeyPreview: signingKey.substring(0, 20) + '...',
    signature: signature,
    authHeader: authHeader,
    proxyUrl: MS_PROXY_URL,
    responseStatus: proxyResponse.status,
    responsePreview: responseText.substring(0, 500),
    success: proxyResponse.ok
  });
}
