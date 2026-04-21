import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getDb();
    const { id } = params;
    const body = await request.json();

    // Update appointment
    await sql`
      UPDATE repair_appointments 
      SET 
        status = ${body.status},
        rejection_reason = ${body.rejection_reason || ''},
        admin_notes = ${body.admin_notes || ''},
        updated_at = NOW()
      WHERE id = ${id}
    `;

    // Fetch updated appointment for email
    const [appointment] = await sql`
      SELECT * FROM repair_appointments WHERE id = ${id}
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Afspraak bijgewerkt',
      appointment 
    });
  } catch (error: any) {
    console.error('Update repair appointment error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getDb();
    const { id } = params;

    await sql`DELETE FROM repair_appointments WHERE id = ${id}`;

    return NextResponse.json({ 
      success: true, 
      message: 'Afspraak verwijderd' 
    });
  } catch (error: any) {
    console.error('Delete repair appointment error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
