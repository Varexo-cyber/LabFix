import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = getDb();
    const users = await sql`SELECT id, email, company_name, kvk_number, contact_person, phone, address, city, postal_code, country, created_at FROM users ORDER BY created_at DESC`;

    const mapped = users.map((u: any) => ({
      id: u.id,
      email: u.email,
      companyName: u.company_name,
      kvkNumber: u.kvk_number,
      contactPerson: u.contact_person,
      phone: u.phone,
      address: u.address,
      city: u.city,
      postalCode: u.postal_code,
      country: u.country,
      createdAt: u.created_at,
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
