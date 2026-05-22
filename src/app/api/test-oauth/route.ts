import { NextResponse } from 'next/server';

// Test OAuth signature generation
export async function GET() {
  const MS_CONSUMER_KEY = process.env.MOBILESENTRIX_CONSUMER_KEY || '';
  const MS_CONSUMER_SECRET = process.env.MOBILESENTRIX_CONSUMER_SECRET || '';
  const MS_ACCESS_TOKEN = process.env.MOBILESENTRIX_ACCESS_TOKEN || '';
  const MS_ACCESS_TOKEN_SECRET = process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET || '';
  
  // Test with a simple GET request
  const method = 'GET';
  const baseUrl = 'https://www.mobilesentrix.eu/api/rest/categories';
  
  // OAuth params (sorted alphabetically)
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: MS_CONSUMER_KEY,
    oauth_nonce: Math.random().toString(36).substring(2, 15),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: MS_ACCESS_TOKEN,
    oauth_version: '1.0'
  };
  
  // Sort keys alphabetically
  const sortedKeys = Object.keys(oauthParams).sort();
  const sortedParams = sortedKeys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
    .join('&');
  
  // Create signature base (IMPORTANT: double-encode the sorted params)
  const signatureBase = `${method}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(sortedParams)}`;
  
  // Signing key (IMPORTANT: secrets should NOT be double-encoded in the key itself)
  const signingKey = `${MS_CONSUMER_SECRET}&${MS_ACCESS_TOKEN_SECRET}`;
  
  const crypto = await import('crypto');
  const signature = crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');
  
  // Build auth header (params in alphabetical order)
  oauthParams.oauth_signature = signature;
  const authHeader = 'OAuth ' + sortedKeys
    .map(key => `${key}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');
  
  return NextResponse.json({
    debug: {
      consumerKey: MS_CONSUMER_KEY.substring(0, 10) + '...',
      consumerSecret: MS_CONSUMER_SECRET.substring(0, 10) + '...',
      accessToken: MS_ACCESS_TOKEN.substring(0, 10) + '...',
      accessTokenSecret: MS_ACCESS_TOKEN_SECRET.substring(0, 10) + '...',
      signatureBase: signatureBase.substring(0, 100) + '...',
      signingKey: signingKey.substring(0, 20) + '...',
      sortedParams: sortedParams.substring(0, 100) + '...',
      signature: signature,
      authHeader: authHeader.substring(0, 150) + '...'
    },
    curlCommand: `curl -X GET "https://www.mobilesentrix.eu/api/rest/categories" -H "Authorization: ${authHeader}" -H "Accept: application/json"`
  });
}
