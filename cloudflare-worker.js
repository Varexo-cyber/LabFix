// Cloudflare Worker - Mobile Sentrix Proxy
// This worker acts as a bridge between Netlify and Mobile Sentrix API
// Because Cloudflare doesn't block its own network traffic!

export default {
  async fetch(request, env, ctx) {
    // Only allow POST requests from your Netlify domain
    // Change 'labfix.eu' to your actual domain!
    const allowedOrigin = env.ALLOWED_ORIGIN || 'https://labfix.eu';
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      // Get the request body (contains endpoint and auth info)
      const body = await request.json();
      
      const {
        endpoint,           // e.g. "/categories" or "/products"
        oauthHeader,        // The full OAuth Authorization header
        method = 'GET',
        queryParams = {},
        apiBaseUrl = 'https://www.mobilesentrix.eu'  // Default to .eu
      } = body;

      if (!endpoint || !oauthHeader) {
        return new Response(JSON.stringify({ error: 'Missing endpoint or oauthHeader' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Build target URL (use provided base URL or default)
      let targetUrl = `${apiBaseUrl}/api/rest${endpoint}`;
      
      // Add query params if any
      if (Object.keys(queryParams).length > 0) {
        const qs = Object.entries(queryParams)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&');
        targetUrl += (targetUrl.includes('?') ? '&' : '?') + qs;
      }

      // Forward the request to Mobile Sentrix
      const msResponse = await fetch(targetUrl, {
        method,
        headers: {
          'Authorization': oauthHeader,
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      // Get the response body
      const responseBody = await msResponse.text();
      
      // Return to client
      return new Response(responseBody, {
        status: msResponse.status,
        headers: {
          ...corsHeaders,
          'Content-Type': msResponse.headers.get('content-type') || 'application/json',
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
