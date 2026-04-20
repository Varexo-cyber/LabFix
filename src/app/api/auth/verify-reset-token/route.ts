import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false, message: 'No token provided' }, { status: 400 });
    }

    const tokens = await sql`
      SELECT * FROM password_reset_tokens 
      WHERE token = ${token} AND used = false AND expires_at > NOW()
    `;

    if (tokens.length === 0) {
      return NextResponse.json({ valid: false, message: 'Invalid or expired token' }, { status: 400 });
    }

    return NextResponse.json({ valid: true });
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }
}
