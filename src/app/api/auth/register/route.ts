import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();

    // Check existing email
    const existingEmail = await sql`SELECT id FROM users WHERE LOWER(email) = ${body.email.toLowerCase()}`;
    if (existingEmail.length > 0) {
      return NextResponse.json({ success: false, message: 'Email is al geregistreerd' }, { status: 400 });
    }

    // Check existing KVK
    const existingKvk = await sql`SELECT id FROM users WHERE kvk_number = ${body.kvkNumber}`;
    if (existingKvk.length > 0) {
      return NextResponse.json({ success: false, message: 'KVK nummer is al geregistreerd' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(body.password, 10);

    await sql`
      INSERT INTO users (id, email, password, company_name, kvk_number, contact_person, phone, address, city, postal_code, country)
      VALUES (${id}, ${body.email}, ${hashedPassword}, ${body.companyName}, ${body.kvkNumber}, ${body.contactPerson}, ${body.phone || ''}, ${body.address || ''}, ${body.city || ''}, ${body.postalCode || ''}, ${body.country || 'Nederland'})
    `;

    return NextResponse.json({ success: true, message: 'Account aangemaakt' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
