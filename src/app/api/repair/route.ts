import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

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
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
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
    if (!name || !email || !phone || !device_type || 
        !device_model || !problem_description || !appointment_date || 
        !appointment_time) {
      return NextResponse.json(
        { success: false, message: 'Alle verplichte velden moeten worden ingevuld' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    
    // Handle file uploads
    const attachments: string[] = [];
    const files = formData.getAll('attachments') as File[];
    
    if (files && files.length > 0) {
      // Create upload directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'repair-attachments', id);
      await mkdir(uploadDir, { recursive: true });
      
      for (const file of files) {
        if (file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${Date.now()}_${file.name}`;
          const filePath = join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          attachments.push(`/uploads/repair-attachments/${id}/${fileName}`);
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
        ${device_model}, ${problem_description}, ${appointment_date}, 
        ${appointment_time}, ${service_type || 'bring_in'}, 
        ${shipping_address || ''}, 'pending', ${JSON.stringify(attachments)}, NOW(), NOW()
      )
    `;

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
