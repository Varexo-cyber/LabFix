import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/mobilesentrix';

export async function GET() {
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
