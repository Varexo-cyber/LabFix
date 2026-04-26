import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const sql = getDb();
  try {
    const config = await sql`SELECT * FROM website_config`;
    const navItems = await sql`SELECT * FROM website_config WHERE type = 'nav' ORDER BY (value->>'position')::int`;
    
    return NextResponse.json({
      success: true,
      config: config.reduce((acc: Record<string, any>, item: any) => {
        acc[item.key] = item.value;
        return acc;
      }, {}),
      navItems: navItems.map((item: any) => ({
        id: item.id,
        ...item.value
      }))
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to load configuration',
      config: {},
      navItems: [],
      subcategories: []
    });
  }
}
