import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

// Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
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
      VALUES (${crypto.randomUUID()}, ${email}, ${companyName || ''})
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
    const subscribers = await sql`SELECT * FROM newsletter_subscribers WHERE is_active = true ORDER BY subscribed_at DESC`;
    return NextResponse.json(subscribers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
