import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/mobilesentrix';

export async function GET() {
  // Check if OAuth credentials are configured
  const hasAccessToken = process.env.MOBILESENTRIX_ACCESS_TOKEN && process.env.MOBILESENTRIX_ACCESS_TOKEN !== 'your_access_token_here';
  const hasAccessTokenSecret = process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET && process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET !== 'your_access_token_secret_here';
  
  if (!hasAccessToken || !hasAccessTokenSecret) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'MobileSentrix API credentials incompleet. Access Token en Access Token Secret zijn vereist (beschikbaar vanaf maandag).',
        configured: false,
        mock: true
      },
      { status: 503 }
    );
  }
  
  try {
    const result = await testConnection();
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Test API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Connection test failed',
        configured: true,
        mock: true
      },
      { status: 500 }
    );
  }
}
