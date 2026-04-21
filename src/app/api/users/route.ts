import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = getDb();
    const users = await sql`SELECT id, email, customer_type, company_name, kvk_number, contact_person, first_name, last_name, phone, address, city, postal_code, country, created_at FROM users ORDER BY created_at DESC`;

    const mapped = users.map((u: any) => ({
      id: u.id,
      email: u.email,
      customerType: u.customer_type || 'individual',
      companyName: u.company_name,
      kvkNumber: u.kvk_number,
      contactPerson: u.contact_person,
      firstName: u.first_name,
      lastName: u.last_name,
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
