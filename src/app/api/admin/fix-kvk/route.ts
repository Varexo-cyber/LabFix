import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`UPDATE users SET kvk_number = NULL WHERE kvk_number = '' OR TRIM(kvk_number) = ''`;
    return NextResponse.json({ success: true, message: 'KVK velden gefixed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
