import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Ensure table exists with all columns
async function ensureTable(sql: any) {
  // Create base table
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
  
  // Add missing columns if they don't exist (migration for existing tables)
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS btw_number TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_address TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_city TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_postal_code TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_country TEXT DEFAULT 'Nederland'`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_same_as_shipping BOOLEAN DEFAULT true`;
  } catch {
    // Columns might already exist, ignore error
  }
}

export async function GET() {
  try {
    const sql = getDb();
    await ensureTable(sql);
    
    // Try with billing columns, fallback to basic columns if they don't exist yet
    let users;
    try {
      users = await sql`SELECT id, email, customer_type, company_name, kvk_number, btw_number, contact_person, first_name, last_name, phone, address, city, postal_code, country, billing_address, billing_city, billing_postal_code, billing_country, billing_same_as_shipping, created_at FROM users ORDER BY created_at DESC`;
    } catch {
      // Fallback without billing columns
      users = await sql`SELECT id, email, customer_type, company_name, kvk_number, btw_number, contact_person, first_name, last_name, phone, address, city, postal_code, country, created_at FROM users ORDER BY created_at DESC`;
    }

    const mapped = users.map((u: any) => ({
      id: u.id,
      email: u.email,
      customerType: u.customer_type || 'individual',
      companyName: u.company_name,
      kvkNumber: u.kvk_number,
      btwNumber: u.btw_number || '',
      contactPerson: u.contact_person,
      firstName: u.first_name,
      lastName: u.last_name,
      phone: u.phone,
      address: u.address,
      city: u.city,
      postalCode: u.postal_code,
      country: u.country,
      billingAddress: u.billing_address || '',
      billingCity: u.billing_city || '',
      billingPostalCode: u.billing_postal_code || '',
      billingCountry: u.billing_country || 'Nederland',
      billingSameAsShipping: u.billing_same_as_shipping !== false,
      createdAt: u.created_at,
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error('GET users error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
    }

    // Delete user's orders first (cascade would handle this but let's be explicit)
    await sql`DELETE FROM orders WHERE user_id = ${id}`;
    
    // Delete user
    await sql`DELETE FROM users WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update user profile
export async function PUT(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
    }

    // Build update query dynamically
    const allowedFields = [
      'firstName', 'lastName', 'companyName', 'kvkNumber', 'btwNumber', 'contactPerson',
      'phone', 'address', 'city', 'postalCode', 'country',
      'billingAddress', 'billingCity', 'billingPostalCode', 'billingCountry', 'billingSameAsShipping'
    ];
    
    const updatesToApply: Record<string, any> = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        updatesToApply[key] = updates[key];
      }
    }

    if (Object.keys(updatesToApply).length === 0) {
      return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 });
    }

    // Convert camelCase to snake_case for SQL
    const fieldMapping: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      companyName: 'company_name',
      kvkNumber: 'kvk_number',
      btwNumber: 'btw_number',
      contactPerson: 'contact_person',
      phone: 'phone',
      address: 'address',
      city: 'city',
      postalCode: 'postal_code',
      country: 'country',
      billingAddress: 'billing_address',
      billingCity: 'billing_city',
      billingPostalCode: 'billing_postal_code',
      billingCountry: 'billing_country',
      billingSameAsShipping: 'billing_same_as_shipping',
    };

    // Execute updates one field at a time (neon doesn't support dynamic column names in tagged templates)
    for (const [key, value] of Object.entries(updatesToApply)) {
      const column = fieldMapping[key];
      if (column === 'first_name') {
        await sql`UPDATE users SET first_name = ${value} WHERE id = ${id}`;
      } else if (column === 'last_name') {
        await sql`UPDATE users SET last_name = ${value} WHERE id = ${id}`;
      } else if (column === 'company_name') {
        await sql`UPDATE users SET company_name = ${value} WHERE id = ${id}`;
      } else if (column === 'kvk_number') {
        await sql`UPDATE users SET kvk_number = ${value} WHERE id = ${id}`;
      } else if (column === 'btw_number') {
        await sql`UPDATE users SET btw_number = ${value} WHERE id = ${id}`;
      } else if (column === 'contact_person') {
        await sql`UPDATE users SET contact_person = ${value} WHERE id = ${id}`;
      } else if (column === 'phone') {
        await sql`UPDATE users SET phone = ${value} WHERE id = ${id}`;
      } else if (column === 'address') {
        await sql`UPDATE users SET address = ${value} WHERE id = ${id}`;
      } else if (column === 'city') {
        await sql`UPDATE users SET city = ${value} WHERE id = ${id}`;
      } else if (column === 'postal_code') {
        await sql`UPDATE users SET postal_code = ${value} WHERE id = ${id}`;
      } else if (column === 'country') {
        await sql`UPDATE users SET country = ${value} WHERE id = ${id}`;
      } else if (column === 'billing_address') {
        await sql`UPDATE users SET billing_address = ${value} WHERE id = ${id}`;
      } else if (column === 'billing_city') {
        await sql`UPDATE users SET billing_city = ${value} WHERE id = ${id}`;
      } else if (column === 'billing_postal_code') {
        await sql`UPDATE users SET billing_postal_code = ${value} WHERE id = ${id}`;
      } else if (column === 'billing_country') {
        await sql`UPDATE users SET billing_country = ${value} WHERE id = ${id}`;
      } else if (column === 'billing_same_as_shipping') {
        await sql`UPDATE users SET billing_same_as_shipping = ${value} WHERE id = ${id}`;
      }
    }

    // Fetch updated user
    const updated = await sql`SELECT * FROM users WHERE id = ${id}`;
    if (updated.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const user = updated[0];
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        customerType: user.customer_type,
        companyName: user.company_name,
        kvkNumber: user.kvk_number,
        btwNumber: user.btw_number || '',
        contactPerson: user.contact_person,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postal_code,
        country: user.country,
        billingAddress: user.billing_address,
        billingCity: user.billing_city,
        billingPostalCode: user.billing_postal_code,
        billingCountry: user.billing_country,
        billingSameAsShipping: user.billing_same_as_shipping,
      }
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
