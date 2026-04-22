import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

// Ensure table exists with all columns
async function ensureTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      customer_type TEXT DEFAULT 'individual',
      company_name TEXT DEFAULT '',
      kvk_number TEXT DEFAULT '',
      btw_number TEXT DEFAULT '',
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
  
  // Add missing columns if they don't exist
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS btw_number TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_address TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_city TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_postal_code TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_country TEXT DEFAULT 'Nederland'`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_same_as_shipping BOOLEAN DEFAULT true`;
  } catch {
    // Ignore if columns already exist
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const { email, password } = await request.json();

    const users = await sql`SELECT * FROM users WHERE LOWER(email) = ${email.toLowerCase()}`;
    if (users.length === 0) {
      return NextResponse.json({ success: false, message: 'Email niet gevonden' }, { status: 401 });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Verkeerd wachtwoord' }, { status: 401 });
    }

    const userData = {
      id: user.id,
      email: user.email,
      customerType: user.customer_type || 'individual',
      companyName: user.company_name || '',
      kvkNumber: user.kvk_number || '',
      btwNumber: user.btw_number || '',
      contactPerson: user.contact_person || '',
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      postalCode: user.postal_code || '',
      country: user.country || 'Nederland',
      createdAt: user.created_at,
    };

    return NextResponse.json({ success: true, user: userData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
