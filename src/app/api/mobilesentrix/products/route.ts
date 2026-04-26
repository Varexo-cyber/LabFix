import { NextRequest, NextResponse } from 'next/server';
import { getProductsByCategory, searchProducts } from '@/lib/mobilesentrix';

export async function GET(request: NextRequest) {
  // Check if OAuth credentials are configured
  const hasAccessToken = process.env.MOBILESENTRIX_ACCESS_TOKEN && process.env.MOBILESENTRIX_ACCESS_TOKEN !== 'your_access_token_here';
  const hasAccessTokenSecret = process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET && process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET !== 'your_access_token_secret_here';
  
  if (!hasAccessToken || !hasAccessTokenSecret) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'MobileSentrix API credentials incompleet. Access Token en Access Token Secret zijn vereist (beschikbaar vanaf maandag).',
        products: [],
        mock: true
      },
      { status: 503 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    
    let products = [];
    
    if (search) {
      // Search products
      products = await searchProducts(search);
    } else if (categoryId) {
      // Get products by category
      products = await getProductsByCategory(categoryId);
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please provide categoryId or search parameter',
          products: [],
          mock: true
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      products: products || [],
      page,
      pageSize,
    });
  } catch (error: any) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch products',
        products: [],
        mock: true
      },
      { status: 500 }
    );
  }
}
