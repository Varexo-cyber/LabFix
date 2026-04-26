import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

// Ensure table exists
async function ensureTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      company_name TEXT DEFAULT '',
      subscribed_at TIMESTAMP DEFAULT NOW(),
      is_active BOOLEAN DEFAULT true
    )
  `;
}

// Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const { email, companyName } = await request.json();

    // Check if already subscribed
    const existing = await sql`SELECT id FROM newsletter_subscribers WHERE LOWER(email) = ${email.toLowerCase()}`;
    
    if (existing.length > 0) {
      // Reactivate if unsubscribed
      await sql`UPDATE newsletter_subscribers SET is_active = true WHERE id = ${existing[0].id}`;
      return NextResponse.json({ success: true, message: 'Subscription reactivated' });
    }

    // Add new subscriber
    await sql`
      INSERT INTO newsletter_subscribers (id, email, company_name)
      VALUES (${randomUUID()}, ${email}, ${companyName || ''})
    `;

    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welkom bij LabFix Nieuwsbrief',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://stellar-brioche-27fb7f.netlify.app/logo.png" alt="LabFix" style="height: 50px;" />
          </div>
          <h2 style="color: #1e40af;">Welkom!</h2>
          <p>Bedankt voor uw aanmelding voor de LabFix nieuwsbrief.</p>
          <p>U ontvangt nu als eerste:</p>
          <ul>
            <li>Nieuwe producten en aanbiedingen</li>
            <li>Technische updates en tips</li>
            <li>Exclusieve B2B kortingen</li>
          </ul>
          <p>Met vriendelijke groet,<br/>Het LabFix Team</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: 'Successfully subscribed' });
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Get all subscribers (for admin)
export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const subscribers = await sql`SELECT * FROM newsletter_subscribers WHERE is_active = true ORDER BY subscribed_at DESC`;
    return NextResponse.json(subscribers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a subscriber (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }
    
    // Soft delete - mark as inactive instead of hard delete
    await sql`UPDATE newsletter_subscribers SET is_active = false WHERE id = ${id}`;
    
    return NextResponse.json({ success: true, message: 'Subscriber removed' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
