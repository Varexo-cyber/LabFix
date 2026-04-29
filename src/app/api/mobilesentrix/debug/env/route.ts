import { NextResponse } from 'next/server';

export async function GET() {
  // Check which env vars are present (without exposing full values)
  const envStatus = {
    CONSUMER_KEY: {
      present: !!process.env.MOBILESENTRIX_CONSUMER_KEY,
      length: process.env.MOBILESENTRIX_CONSUMER_KEY?.length || 0,
      first4: process.env.MOBILESENTRIX_CONSUMER_KEY?.substring(0, 4) || 'N/A',
    },
    CONSUMER_SECRET: {
      present: !!process.env.MOBILESENTRIX_CONSUMER_SECRET,
      length: process.env.MOBILESENTRIX_CONSUMER_SECRET?.length || 0,
    },
    ACCESS_TOKEN: {
      present: !!process.env.MOBILESENTRIX_ACCESS_TOKEN,
      length: process.env.MOBILESENTRIX_ACCESS_TOKEN?.length || 0,
    },
    ACCESS_TOKEN_SECRET: {
      present: !!process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET,
      length: process.env.MOBILESENTRIX_ACCESS_TOKEN_SECRET?.length || 0,
    },
    API_URL: process.env.MOBILESENTRIX_API_URL || 'default (https://www.mobilesentrix.com)',
  };

  const allPresent = 
    envStatus.CONSUMER_KEY.present &&
    envStatus.CONSUMER_SECRET.present &&
    envStatus.ACCESS_TOKEN.present &&
    envStatus.ACCESS_TOKEN_SECRET.present;

  return NextResponse.json({
    allPresent,
    envStatus,
    node_env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
