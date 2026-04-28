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

  // Show the tokens in a nice HTML page
  return new Response(`
    <html>
      <head>
        <title>Mobilesentrix OAuth - Step 1 Complete</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 700px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
          .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          h1 { color: #1e40af; margin-bottom: 10px; }
          .success { color: #16a34a; font-weight: bold; font-size: 18px; margin: 20px 0; }
          .token-box { background: #f0f9ff; border: 2px solid #0ea5e9; padding: 15px; margin: 10px 0; border-radius: 8px; font-family: monospace; word-break: break-all; }
          .label { font-weight: bold; color: #374151; margin-bottom: 5px; }
          .next-steps { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 20px; border-radius: 4px; }
          .next-steps h3 { margin-top: 0; color: #92400e; }
          .next-steps ol { margin: 10px 0; padding-left: 20px; }
          .next-steps li { margin: 8px 0; }
          code { background: #e5e7eb; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Mobilesentrix Authenticatie</h1>
          <div class="success">Stap 1 voltooid! Je hebt de OAuth Token en Verifier ontvangen.</div>
          
          <div class="label">OAuth Token:</div>
          <div class="token-box">${oauthToken}</div>
          
          <div class="label">OAuth Verifier:</div>
          <div class="token-box">${oauthVerifier}</div>
          
          <div class="next-steps">
            <h3>Volgende stap: Haal de Access Token op</h3>
            <ol>
              <li>Open Postman of een API tool</li>
              <li>Maak een <code>POST</code> request naar:<br><code>https://www.mobilesentrix.eu/oauth/authorize/identifiercallback</code></li>
              <li>Header: <code>Content-Type: application/json</code></li>
              <li>Body (JSON):
<pre style="background:#1e293b;color:#e2e8f0;padding:15px;border-radius:8px;overflow-x:auto;">
{
  "consumer_key": "fb48dafbc3103b60a27bef006d1de2c7",
  "consumer_secret": "03fdddc63bfb5e1978dc37c1eb86c20b",
  "oauth_token": "${oauthToken}",
  "oauth_verifier": "${oauthVerifier}"
}</pre>
              </li>
              <li>Je krijgt terug: <code>access_token</code> en <code>access_token_secret</code></li>
              <li>Zet die in je <code>.env.local</code> bestand</li>
            </ol>
          </div>
        </div>
      </body>
    </html>
  `, { headers: { 'Content-Type': 'text/html' } });
}
