import { NextResponse } from 'next/server';

// This endpoint performs a complete diagnostic of the Mobile Sentrix connection
// It shows every step so we can pinpoint exactly where it fails

export async function GET() {
  const logs: string[] = [];
  const addLog = (msg: string) => {
    const time = new Date().toISOString().split('T')[1].split('.')[0];
    logs.push(`[${time}] ${msg}`);
    console.log(`[MS DEBUG] ${msg}`);
  };

  addLog('=== STARTING FULL DIAGNOSTIC ===');

  // Step 1: Check environment variables
  addLog('Step 1: Checking environment variables...');
  const envStatus = {
    CONSUMER_KEY: {
      present: !!process.env.MOBILESENTRIX_CONSUMER_KEY,
      length: process.env.MOBILESENTRIX_CONSUMER_KEY?.length || 0,
      preview: process.env.MOBILESENTRIX_CONSUMER_KEY?.substring(0, 8) + '...' || 'MISSING',
    },
    CONSUMER_SECRET: {
      present: !!process.env.MOBILESENTRIX_CONSUMER_SECRET,
      length: process.env.MOBILESENTRIX_CONSUMER_SECRET?.length || 0,
      preview: process.env.MOBILESENTRIX_CONSUMER_SECRET ? '****' + process.env.MOBILESENTRIX_CONSUMER_SECRET?.slice(-4) : 'MISSING',
    },
    ACCESS_TOKEN: {
      present: !!process.env.MOBILESENTRIX_ACCESS_TOKEN,
      length: process.env.MOBILESENTRIX_ACCESS_TOKEN?.length || 0,
      preview: process.env.MOBILESENTRIX_ACCESS_TOKEN ? '****' + process.env.MOBILESENTRIX_ACCESS_TOKEN?.slice(-4) : 'MISSING',
    },
    ACCESS_TOKEN_SECRET: {
      present: !!process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET,
      length: process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET?.length || 0,
      preview: process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET ? '****' + process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET?.slice(-4) : 'MISSING',
    },
    API_URL: process.env.MOBILESENTRIX_API_URL || 'https://www.mobilesentrix.com (default)',
  };

  const allPresent = envStatus.CONSUMER_KEY.present && envStatus.CONSUMER_SECRET.present && 
                     envStatus.ACCESS_TOKEN.present && envStatus.ACCESS_TOKEN_SECRET.present;
  
  addLog(`Env vars complete: ${allPresent ? 'YES' : 'NO - MISSING SOME!'}`);
  
  if (!allPresent) {
    return NextResponse.json({
      success: false,
      step: 'env_check',
      message: 'Missing environment variables',
      envStatus,
      logs,
    });
  }

  // Step 2: Build OAuth header
  addLog('Step 2: Building OAuth header...');
  const API_URL = process.env.MOBILESENTRIX_API_URL || 'https://www.mobilesentrix.com';
  const endpoint = '/categories';
  const url = `${API_URL}/api/rest${endpoint}`;
  
  addLog(`Target URL: ${url}`);

  // Generate OAuth header (inline for visibility)
  const crypto = await import('crypto');
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: process.env.MOBILESENTRIX_CONSUMER_KEY!,
    oauth_token: process.env.MOBILESENTRIX_ACCESS_TOKEN!,
    oauth_signature_method: 'PLAINTEXT',
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: '1.0',
  };
  
  const signature = `${encodeURIComponent(process.env.MOBILESENTRIX_CONSUMER_SECRET!)}&${encodeURIComponent(process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET!)}`;
  oauthParams.oauth_signature = signature;
  
  const headerParts = Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');
  
  const oauthHeader = `OAuth ${headerParts}`;
  
  addLog(`OAuth header built (length: ${oauthHeader.length})`);
  addLog(`Signature: ${signature.substring(0, 20)}...`);

  // Step 3: Make the request
  addLog('Step 3: Sending request to Mobile Sentrix...');
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': oauthHeader,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    addLog(`Response status: ${response.status} ${response.statusText}`);
    
    // Log response headers
    const respHeaders = Object.fromEntries(response.headers.entries());
    addLog(`Response headers: ${JSON.stringify(respHeaders, null, 2).substring(0, 300)}`);

    // Step 4: Check response
    if (!response.ok) {
      const errorText = await response.text();
      addLog(`ERROR! Status ${response.status}`);
      addLog(`Response body (first 300 chars): ${errorText.substring(0, 300)}`);
      
      // Check for Cloudflare
      const isCloudflare = errorText.includes('Just a moment') || errorText.includes('cloudflare') || response.headers.get('server')?.includes('cloudflare');
      
      return NextResponse.json({
        success: false,
        step: 'api_request',
        message: `API returned ${response.status}`,
        isCloudflare,
        responseStatus: response.status,
        responseStatusText: response.statusText,
        responseServer: response.headers.get('server'),
        responsePreview: errorText.substring(0, 500),
        envStatus,
        requestUrl: url,
        oauthHeaderPreview: oauthHeader.substring(0, 100) + '...',
        logs,
      });
    }

    // Success!
    const data = await response.json();
    addLog('SUCCESS! API responded with data');
    addLog(`Data type: ${Array.isArray(data) ? 'array' : typeof data}`);
    addLog(`Data length/keys: ${Array.isArray(data) ? data.length : Object.keys(data).length}`);

    return NextResponse.json({
      success: true,
      message: 'Connection successful!',
      step: 'complete',
      dataPreview: Array.isArray(data) ? `Array with ${data.length} items` : `Object with keys: ${Object.keys(data).slice(0, 10).join(', ')}`,
      envStatus,
      requestUrl: url,
      logs,
    });

  } catch (error: any) {
    addLog(`EXCEPTION: ${error.message}`);
    
    return NextResponse.json({
      success: false,
      step: 'exception',
      message: error.message,
      envStatus,
      requestUrl: url,
      error: error.stack,
      logs,
    });
  }
}
