import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { sendRepairConfirmation, sendEmail } from '@/lib/email';

// Use Node.js runtime for database compatibility
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    
    // Verify database connection and create table if needed
    try {
      await sql`SELECT 1`;
      
      // Ensure repair_appointments table exists
      await sql`
        CREATE TABLE IF NOT EXISTS repair_appointments (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          device_type TEXT NOT NULL,
          device_model TEXT NOT NULL,
          problem_description TEXT NOT NULL,
          appointment_date DATE,
          appointment_time TIME,
          service_type TEXT NOT NULL DEFAULT 'bring_in',
          shipping_address TEXT DEFAULT '',
          status TEXT NOT NULL DEFAULT 'pending',
          rejection_reason TEXT DEFAULT '',
          admin_notes TEXT DEFAULT '',
          attachments JSONB DEFAULT '[]',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `;
      // Drop NOT NULL constraints on date/time if they exist (pickup requests don't need them)
      await sql`ALTER TABLE repair_appointments ALTER COLUMN appointment_date DROP NOT NULL`.catch(() => {});
      await sql`ALTER TABLE repair_appointments ALTER COLUMN appointment_time DROP NOT NULL`.catch(() => {});
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Database connection failed. Please try again later.' },
        { status: 500 }
      );
    }
    
    const formData = await request.formData();
    
    // Get text fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const device_type = formData.get('device_type') as string;
    const device_model = formData.get('device_model') as string;
    const problem_description = formData.get('problem_description') as string;
    const appointment_date = formData.get('appointment_date') as string;
    const appointment_time = formData.get('appointment_time') as string;
    const service_type = formData.get('service_type') as string;
    const shipping_address = formData.get('shipping_address') as string;

    // Validation
    // Note: appointment_date/time are not collected in the form for either
    // pickup or shipping — LabFix contacts the customer afterwards to schedule.
    if (!name || !email || !phone || !device_type || 
        !device_model || !problem_description) {
      return NextResponse.json(
        { success: false, message: 'Alle verplichte velden moeten worden ingevuld' },
        { status: 400 }
      );
    }

    const id = randomUUID();
    
    // Handle file uploads - NOTE: File uploads not supported on Netlify serverless
    // Files are stored as base64 in the database instead
    const attachments: string[] = [];
    const files = formData.getAll('attachments') as File[];
    
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.size > 0 && file.size < 2 * 1024 * 1024) { // Max 2MB
          try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = buffer.toString('base64');
            const mimeType = file.type || 'application/octet-stream';
            const dataUrl = `data:${mimeType};base64,${base64}`;
            attachments.push(dataUrl);
          } catch (fileError) {
            console.error('Error processing file:', fileError);
          }
        }
      }
    }
    
    await sql`
      INSERT INTO repair_appointments (
        id, name, email, phone, device_type, device_model, 
        problem_description, appointment_date, appointment_time, 
        service_type, shipping_address, status, attachments, created_at, updated_at
      ) VALUES (
        ${id}, ${name}, ${email}, ${phone}, ${device_type}, 
        ${device_model}, ${problem_description}, ${appointment_date || null}, 
        ${appointment_time || null}, ${service_type || 'bring_in'}, 
        ${shipping_address || ''}, 'pending', ${JSON.stringify(attachments)}, NOW(), NOW()
      )
    `;

    // Send email notifications
    try {
      // 1. Send beautiful confirmation email to customer (from info@labfix.nl)
      await sendRepairConfirmation({
        to: email,
        name,
        phone,
        deviceType: device_type,
        deviceModel: device_model,
        problemDescription: problem_description,
        serviceType: service_type as 'pickup' | 'shipping',
        pickupLocation: shipping_address,
        repairId: id,
      });

      // 2. Send admin notification to LabFix (from info@labfix.nl)
      const adminHtml = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1e40af;padding:24px;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:24px">Nieuwe Reparatie Aanvraag</h1>
          </div>
          <div style="padding:24px;background:#fff">
            <p style="font-size:16px"><strong>Er is een nieuwe reparatie aanvraag binnengekomen:</strong></p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Aanvraag ID:</strong></td><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;color:#1e40af">#${id.slice(0,8).toUpperCase()}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Naam:</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${name}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>E-mail:</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${email}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Telefoon:</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${phone}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Apparaat:</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${device_type} - ${device_model}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Service:</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${service_type === 'pickup' ? 'Ophalen' : 'Opsturen'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Datum/Tijd:</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${appointment_date || 'Nog niet ingepland'} ${appointment_time || ''}</td></tr>
            </table>
            <p style="margin-top:16px"><strong>Probleem beschrijving:</strong><br/>${problem_description}</p>
            ${attachments.length > 0 ? `<p style="margin-top:16px"><strong>Bijlagen:</strong> ${attachments.length} foto(s) toegevoegd</p>` : ''}
            <p style="margin-top:24px"><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://labfix.nl'}/geheim-admin" style="background:#1e40af;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block">Bekijk in Admin</a></p>
          </div>
        </div>
      `;

      // Send admin notification to LabFix
      await sendEmail({
        to: 'info@labfix.nl',
        subject: `Nieuwe Reparatie Aanvraag #${id.slice(0,8).toUpperCase()} - ${name}`,
        html: adminHtml,
      });
    } catch (emailError) {
      console.error('Failed to send repair notification emails:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Afspraak succesvol aangemaakt',
      id,
      attachments
    });
  } catch (error: any) {
    console.error('Repair appointment error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { success: false, message: `Database error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = sql`SELECT * FROM repair_appointments`;
    
    if (status) {
      query = sql`SELECT * FROM repair_appointments WHERE status = ${status} ORDER BY created_at DESC`;
    } else {
      query = sql`SELECT * FROM repair_appointments ORDER BY created_at DESC`;
    }

    const appointments = await query;
    
    // Map attachments from JSONB
    const mappedAppointments = appointments.map((apt: any) => ({
      ...apt,
      deviceType: apt.device_type,
      deviceModel: apt.device_model,
      problemDescription: apt.problem_description,
      appointmentDate: apt.appointment_date,
      appointmentTime: apt.appointment_time,
      serviceType: apt.service_type,
      shippingAddress: apt.shipping_address,
      rejectionReason: apt.rejection_reason,
      adminNotes: apt.admin_notes,
      attachments: apt.attachments || [],
      createdAt: apt.created_at,
      updatedAt: apt.updated_at,
    }));
    
    return NextResponse.json({ success: true, appointments: mappedAppointments });
  } catch (error: any) {
    console.error('Fetch repair appointments error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
