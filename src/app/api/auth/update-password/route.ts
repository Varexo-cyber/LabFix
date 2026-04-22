import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

// Ensure tables exist
async function ensureTables(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      customer_type TEXT DEFAULT 'individual',
      company_name TEXT DEFAULT '',
      kvk_number TEXT DEFAULT '',
      contact_person TEXT DEFAULT '',
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '',
      city TEXT DEFAULT '',
      postal_code TEXT DEFAULT '',
      country TEXT DEFAULT 'Nederland',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  // Add billing columns if they don't exist
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_address TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_city TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_postal_code TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_country TEXT DEFAULT 'Nederland'`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_same_as_shipping BOOLEAN DEFAULT true`;
  } catch {
    // Ignore if columns already exist
  }
  
  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTables(sql);
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
