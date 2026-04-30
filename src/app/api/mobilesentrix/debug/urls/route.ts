import { NextResponse } from 'next/server';

// Test BOTH URLs to see if dev1 works without Cloudflare

export async function GET() {
  const urls = [
    'https://www.mobilesentrix.com',
    'https://dev1.mobilesentrix.com',
  ];
  
  const results = [];
  
  for (const baseUrl of urls) {
    try {
      const resp = await fetch(`${baseUrl}/api/rest/categories`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      });
      
      const text = await resp.text();
      const isCloudflare = text.includes('Just a moment') || text.includes('challenge');
      const isHtml = text.includes('<!DOCTYPE');
      
      results.push({
        url: baseUrl,
        status: resp.status,
        contentType: resp.headers.get('content-type'),
        isCloudflare,
        isHtml,
        preview: text.substring(0, 100).replace(/\n/g, ' '),
        works: !isCloudflare && !isHtml && resp.status === 200,
      });
    } catch (e: any) {
      results.push({
        url: baseUrl,
        error: e.message,
        works: false,
      });
    }
  }
  
  return NextResponse.json({
    results,
    anyWorks: results.some((r: any) => r.works),
    recommendation: results.find((r: any) => r.works)?.url || 'None work - need proxy',
  });
}
