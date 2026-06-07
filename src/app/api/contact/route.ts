import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

// LabFix transporter for notification emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_LABFIX || 'smtp.zoho.eu',
  port: parseInt(process.env.SMTP_PORT_LABFIX || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER_LABFIX || 'info@labfix.nl',
    pass: process.env.SMTP_PASS_LABFIX,
  },
});

const CONTACT_NOTIFY_TO = process.env.CONTACT_NOTIFY_TO || 'info@labfix.nl';

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Send a notification email to LabFix when a new contact message arrives
async function sendContactNotification(data: { name: string; email: string; subject: string; message: string }) {
  const { name, email, subject, message } = data;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:24px;text-align:center">
        <h1 style="color:#fff;margin:0">Nieuw contactbericht</h1>
        <p style="color:#bfdbfe;margin:4px 0 0;font-size:12px">Via het contactformulier op labfix.nl</p>
      </div>
      <div style="padding:24px;background:#fff">
        <p style="margin:4px 0;font-size:14px;"><strong>Naam:</strong> ${escapeHtml(name)}</p>
        <p style="margin:4px 0;font-size:14px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:4px 0;font-size:14px;"><strong>Onderwerp:</strong> ${escapeHtml(subject)}</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-top:16px;">
          <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
        </div>
      </div>
      <div style="background:#1e293b;padding:16px;text-align:center">
        <p style="color:#94a3b8;margin:0;font-size:11px">Dit bericht is ook opgeslagen in het admin-paneel.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"LabFix Website" <info@labfix.nl>',
    to: CONTACT_NOTIFY_TO,
    replyTo: email,
    subject: `Nieuw contactbericht: ${subject}`,
    html,
  });
}

// Ensure table exists
async function ensureTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT DEFAULT 'Geen onderwerp',
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      admin_notes TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

// POST - Create new contact message
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Naam, email en bericht zijn verplicht' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ongeldig email adres' },
        { status: 400 }
      );
    }

    // Insert into database
    const result = await sql`
      INSERT INTO contact_messages (name, email, subject, message, status, created_at)
      VALUES (${name}, ${email}, ${subject || 'Geen onderwerp'}, ${message}, 'unread', NOW())
      RETURNING *
    `;

    // Send notification email to LabFix (do not fail the request if email fails)
    try {
      await sendContactNotification({
        name,
        email,
        subject: subject || 'Geen onderwerp',
        message,
      });
    } catch (emailError) {
      console.error('Contact notification email failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Bericht succesvol verstuurd',
      data: result[0]
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan bij het versturen' },
      { status: 500 }
    );
  }
}

// GET - Get all contact messages (for admin)
export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let result;
    
    if (status) {
      result = await sql`
        SELECT * FROM contact_messages 
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      result = await sql`
        SELECT * FROM contact_messages 
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    // Get counts
    const unreadCount = await sql`SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'`;
    const totalCount = await sql`SELECT COUNT(*) as count FROM contact_messages`;

    return NextResponse.json({
      success: true,
      data: result,
      counts: {
        total: totalCount[0].count,
        unread: unreadCount[0].count
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan' },
      { status: 500 }
    );
  }
}
