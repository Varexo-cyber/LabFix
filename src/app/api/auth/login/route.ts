import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
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
      companyName: user.company_name,
      kvkNumber: user.kvk_number,
      contactPerson: user.contact_person,
      phone: user.phone,
      address: user.address,
      city: user.city,
      postalCode: user.postal_code,
      country: user.country,
      createdAt: user.created_at,
    };

    return NextResponse.json({ success: true, user: userData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
