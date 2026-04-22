import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

// Ensure tables exist
async function ensureTables(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      customer_type TEXT DEFAULT 'individual',
      company_name TEXT DEFAULT '',
      kvk_number TEXT DEFAULT '',
      contact_person TEXT DEFAULT '',
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '',
      city TEXT DEFAULT '',
      postal_code TEXT DEFAULT '',
      country TEXT DEFAULT 'Nederland',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  // Add billing columns if they don't exist
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_address TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_city TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_postal_code TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_country TEXT DEFAULT 'Nederland'`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_same_as_shipping BOOLEAN DEFAULT true`;
  } catch {
    // Ignore if columns already exist
  }
  
  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTables(sql);
    const { email } = await request.json();

    // Find user
    const users = await sql`SELECT id, email, company_name, contact_person FROM users WHERE LOWER(email) = ${email.toLowerCase()}`;
    if (users.length === 0) {
      // Don't reveal if email exists
      return NextResponse.json({ success: true, message: 'If this email exists, a reset link has been sent' });
    }

    const user = users[0];
    
    // Generate token
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    // Save token
    await sql`
      INSERT INTO password_reset_tokens (id, user_id, token, expires_at)
      VALUES (${randomUUID()}, ${user.id}, ${token}, ${expiresAt.toISOString()})
    `;

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://stellar-brioche-27fb7f.netlify.app'}/account/reset-password?token=${token}`;
    
    await sendEmail({
      to: user.email,
      subject: 'LabFix - Wachtwoord reset aanvraag',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://stellar-brioche-27fb7f.netlify.app/logo.png" alt="LabFix" style="height: 50px;" />
          </div>
          <h2 style="color: #1e40af;">Wachtwoord reset</h2>
          <p>Beste ${user.contact_person},</p>
          <p>Er is een verzoek ingediend om uw wachtwoord te resetten. Klik op de onderstaande link om een nieuw wachtwoord in te stellen:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">Wachtwoord resetten</a>
          </div>
          <p>Deze link is 24 uur geldig.</p>
          <p>Als u dit verzoek niet heeft ingediend, kunt u deze e-mail negeren.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 12px;">LabFix - Professionele Telefoon & Tablet Onderdelen</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: 'Reset link sent' });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
