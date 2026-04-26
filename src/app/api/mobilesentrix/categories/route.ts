import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/lib/mobilesentrix';

export async function GET(request: NextRequest) {
  // Check if OAuth credentials are configured
  const hasAccessToken = process.env.MOBILESENTRIX_ACCESS_TOKEN && process.env.MOBILESENTRIX_ACCESS_TOKEN !== 'your_access_token_here';
  const hasAccessTokenSecret = process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET && process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET !== 'your_access_token_secret_here';
  
  if (!hasAccessToken || !hasAccessTokenSecret) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'MobileSentrix API credentials incompleet. Access Token en Access Token Secret zijn vereist (beschikbaar vanaf maandag).',
        categories: [],
        mock: true
      },
      { status: 503 }
    );
  }
  
  try {
    const categories = await getCategories();
    
    return NextResponse.json({
      success: true,
      categories: categories || [],
    });
  } catch (error: any) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch categories',
        categories: [],
        mock: true
      },
      { status: 500 }
    );
  }
}
