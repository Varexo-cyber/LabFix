import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const { token, password } = await request.json();

    // Verify token
    const tokens = await sql`
      SELECT * FROM password_reset_tokens 
      WHERE token = ${token} AND used = false AND expires_at > NOW()
    `;

    if (tokens.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
    }

    const resetToken = tokens[0];
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user password
    await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${resetToken.user_id}`;
    
    // Mark token as used
    await sql`UPDATE password_reset_tokens SET used = true WHERE id = ${resetToken.id}`;

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Update password error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
