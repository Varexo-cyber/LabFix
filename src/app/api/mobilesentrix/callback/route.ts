import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const oauthToken = searchParams.get('oauth_token');
  const oauthVerifier = searchParams.get('oauth_verifier');

  if (!oauthToken || !oauthVerifier) {
    return new Response(`
      <html>
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:50px auto;padding:20px">
          <h1 style="color:#dc2626">Error</h1>
          <p>Missing oauth_token or oauth_verifier</p>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  return new Response(`
    <html>
      <head>
        <title>Mobilesentrix OAuth Callback</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 700px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
          .container { background: white; padding: 30px; border-radius: 10px; }
          .token-box { background: #f0f9ff; border: 2px solid #0ea5e9; padding: 15px; margin: 10px 0; border-radius: 8px; font-family: monospace; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>OAuth Token & Verifier ontvangen</h1>
          <div><b>oauth_token:</b></div>
          <div class="token-box">${oauthToken}</div>
          <div><b>oauth_verifier:</b></div>
          <div class="token-box">${oauthVerifier}</div>
        </div>
      </body>
    </html>
  `, { headers: { 'Content-Type': 'text/html' } });
}
