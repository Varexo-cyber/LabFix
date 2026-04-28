import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/lib/mobilesentrix';

export async function GET(request: NextRequest) {
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
      },
      { status: 500 }
    );
  }
}
