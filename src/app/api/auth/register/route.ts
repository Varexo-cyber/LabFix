import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';
import { randomUUID } from 'crypto';
import { createCustomer as msSyncCustomer, findMsCustomerByEmail } from '@/lib/mobilesentrix-new';

export const runtime = 'nodejs';

// Ensure table exists with all columns
async function ensureTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      customer_type TEXT DEFAULT 'individual',
      company_name TEXT DEFAULT '',
      kvk_number TEXT DEFAULT '',
      btw_number TEXT DEFAULT '',
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
  
  // Fix existing empty KVK strings to NULL so UNIQUE constraint works for particuliers
  try {
    await sql`UPDATE users SET kvk_number = NULL WHERE kvk_number = '' OR (kvk_number IS NOT NULL AND TRIM(kvk_number) = '')`;
  } catch {}
  // Allow NULL in kvk_number so particuliers can register without KVK
  try { await sql`ALTER TABLE users ALTER COLUMN kvk_number DROP NOT NULL`; } catch {}
  // Ensure kvk_number unique constraint allows multiple NULLs (DROP and recreate as partial index)
  try { await sql`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_kvk_number_key`; } catch {}
  try { await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_kvk_number_unique ON users (kvk_number) WHERE kvk_number IS NOT NULL`; } catch {}

  // Add missing columns if they don't exist
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS btw_number TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_address TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_city TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_postal_code TEXT DEFAULT ''`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_country TEXT DEFAULT 'Nederland'`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_same_as_shipping BOOLEAN DEFAULT true`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS ms_customer_id TEXT DEFAULT ''`;
  } catch {
    // Ignore if columns already exist
  }
}

export async function POST(request: NextRequest) {
  let customerType = 'individual';
  try {
    const sql = getDb();
    await ensureTable(sql);
    const body = await request.json();
    customerType = body.customerType || 'individual';
    const isBusiness = customerType === 'business';

    // Check existing email
    const existingEmail = await sql`SELECT id FROM users WHERE LOWER(email) = ${body.email.toLowerCase()}`;
    if (existingEmail.length > 0) {
      return NextResponse.json({ success: false, message: 'Email is al geregistreerd' }, { status: 400 });
    }

    // Fix any remaining empty KVK strings to NULL before insert
    try { await sql`UPDATE users SET kvk_number = NULL WHERE kvk_number = '' OR (kvk_number IS NOT NULL AND TRIM(kvk_number) = '')`; } catch {}

    // Check existing KVK (only for business)
    if (isBusiness && body.kvkNumber) {
      const existingKvk = await sql`SELECT id FROM users WHERE kvk_number = ${body.kvkNumber}`;
      if (existingKvk.length > 0) {
        return NextResponse.json({ success: false, message: 'Dit KVK-nummer is al geregistreerd. Wil je inloggen?' }, { status: 400 });
      }
    }

    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Set display name
    const firstName = (body.firstName || '').trim();
    const lastName = (body.lastName || '').trim();
    const displayName = isBusiness 
      ? (body.contactPerson || body.companyName || 'LabFix Klant')
      : `${firstName} ${lastName}`.trim() || 'LabFix Klant';

    // ── MobileSentrix customer sync ───────────────────────────────────────
    let msCustomerId = '';
    try {
      const nameParts = displayName.split(' ');
      const msFirstname = (body.firstName || nameParts[0] || 'LabFix').trim();
      const msLastname = (body.lastName || nameParts.slice(1).join(' ') || 'Klant').trim();
      const msUsername = body.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 9000 + 1000);
      const countryCode = body.country === 'Nederland' || !body.country ? 'NL' : body.country;

      const msTimeout = new Promise<null>((_, reject) => setTimeout(() => reject(new Error('MS sync timeout')), 8000));
      const msResult = await Promise.race([msSyncCustomer({
        firstname: msFirstname,
        lastname: msLastname,
        username: msUsername,
        email: body.email,
        mobile: (body.phone || '0000000000').replace(/\D/g, ''),
        password: body.password,
        company: body.companyName || `${msFirstname} ${msLastname}`,
        company_short: (body.companyName || msFirstname).substring(0, 8),
        street: [body.address || 'Onbekend'],
        city: body.city || 'Onbekend',
        region: '',
        postcode: body.postalCode || '0000AA',
        country_id: countryCode,
        telephone: (body.phone || '0000000000').replace(/\D/g, ''),
        vat_numbers: body.btwNumber ? [{ vat_prefix: 'VAT', vat_number: body.btwNumber }] : [],
      }), msTimeout]);

      if (msResult?.success) {
        // Find the new customer's ID via search
        const foundId = await findMsCustomerByEmail(body.email);
        msCustomerId = foundId || '';
      } else if (msResult?.message?.includes('already an account')) {
        // Customer already exists at MS, look up ID
        const foundId = await findMsCustomerByEmail(body.email);
        msCustomerId = foundId || '';
      }
    } catch (msErr: any) {
      console.error('MS customer sync failed (LabFix account still created):', msErr.message);
    }
    // ─────────────────────────────────────────────────────────────────────

    // Use NULL for KVK when empty so UNIQUE constraint allows multiple particuliers
    const kvkValue = (isBusiness && body.kvkNumber) ? body.kvkNumber : null;

    await sql`
      INSERT INTO users (id, email, password, customer_type, first_name, last_name, company_name, kvk_number, btw_number, contact_person, phone, address, city, postal_code, country, ms_customer_id)
      VALUES (${id}, ${body.email}, ${hashedPassword}, ${body.customerType || 'individual'}, ${body.firstName || ''}, ${body.lastName || ''}, ${body.companyName || ''}, ${kvkValue}, ${body.btwNumber || ''}, ${body.contactPerson || ''}, ${body.phone || ''}, ${body.address || ''}, ${body.city || ''}, ${body.postalCode || ''}, ${body.country || 'Nederland'}, ${msCustomerId})
    `;

    // Send welcome email
    try {
      const emailContent = isBusiness ? `
        <h2 style="color: #1e40af;">Welkom bij LabFix!</h2>
        <p>Beste ${body.contactPerson},</p>
        <p>Uw zakelijke account is succesvol aangemaakt. U kunt nu inloggen en producten bestellen.</p>
        <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Bedrijf:</strong> ${body.companyName}</p>
          <p style="margin: 8px 0 0;"><strong>KVK:</strong> ${body.kvkNumber}</p>
        </div>
      ` : `
        <h2 style="color: #1e40af;">Welkom bij LabFix!</h2>
        <p>Beste ${body.firstName},</p>
        <p>Uw account is succesvol aangemaakt. U kunt nu inloggen en producten bestellen.</p>
      `;

      await sendEmail({
        to: body.email,
        subject: 'Welkom bij LabFix - Uw account is aangemaakt',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://stellar-brioche-27fb7f.netlify.app/logo.png" alt="LabFix" style="height: 50px;" />
            </div>
            ${emailContent}
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://stellar-brioche-27fb7f.netlify.app/account/login" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">Inloggen</a>
            </div>
            <p>Heeft u vragen? Neem contact met ons op via <a href="mailto:info@labfix.nl">info@labfix.nl</a></p>
            <p>Met vriendelijke groet,<br/>Het LabFix Team</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Welcome email failed:', emailErr);
    }

    return NextResponse.json({ success: true, message: 'Account aangemaakt', msCustomerId });
  } catch (error: any) {
    console.error('Registration error:', error);
    // Friendly error messages
    const msg = error.message || '';
    if (msg.includes('users_email')) {
      return NextResponse.json({ success: false, message: 'Dit e-mailadres is al geregistreerd. Wil je inloggen?' }, { status: 400 });
    }
    if (msg.includes('users_kvk_number_key') || msg.includes('users_kvk_number_unique')) {
      if (customerType === 'business') {
        return NextResponse.json({ success: false, message: 'Dit KVK-nummer is al geregistreerd. Wil je inloggen?' }, { status: 400 });
      }
      return NextResponse.json({ success: false, message: 'Er is een fout opgetreden. Probeer het opnieuw.' }, { status: 500 });
    }
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return NextResponse.json({ success: false, message: 'Dit account bestaat al. Probeer in te loggen.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Er is een fout opgetreden. Probeer het opnieuw.', _debug: msg, _stack: error.stack?.slice(0, 800) }, { status: 500 });
  }
}
