import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendAccountConfirmation } from '@/lib/email';
import { randomUUID } from 'crypto';
import { createCustomer as msSyncCustomer, findMsCustomerByEmail } from '@/lib/mobilesentrix-new';

export const runtime = 'nodejs';

// ── Anti-spam helpers ───────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // max 3 registrations per IP per hour
const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) || []).filter((t: number) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  ipHits.set(ip, hits);
  if (ipHits.size > 5000) {
    Array.from(ipHits.entries()).forEach(([key, times]) => {
      if (times.every((t: number) => now - t >= RATE_LIMIT_WINDOW_MS)) ipHits.delete(key);
    });
  }
  return hits.length > RATE_LIMIT_MAX;
}

function getClientIp(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', 'tempmail.com', 'mailinator.com', 'guerrillamail.com', 'yopmail.com',
  'throwawaymail.com', 'fakeinbox.com', 'sharklasers.com', 'getairmail.com', 'temp.inbox',
  'mailcatch.com', 'tempr.email', 'anonbox.net', 'trashmail.com', 'getnada.com',
  'inboxbear.com', 'burnermail.io', 'tempmailaddress.com', 'mailtemporaire.com', 'dispostable.com',
  'tempmailplus.com', 'tmpmail.org', 'tmpbox.net', 'throwam.com', 'moakt.com', 'emailondeck.com'
]);

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && DISPOSABLE_DOMAINS.has(domain);
}

function looksLikeSpam(name: string, address: string, city: string, phone: string): boolean {
  const fields = [name, address, city];
  for (const raw of fields) {
    const value = (raw || '').trim();
    if (!value) continue;

    // Long single "word" with no spaces is a strong bot signal.
    const hasNoSpaces = !/\s/.test(value);
    const isLong = value.length >= 12;
    if (hasNoSpaces && isLong) {
      const letters = value.replace(/[^a-zA-Z]/g, '');
      if (letters.length >= 10) {
        const vowels = (letters.match(/[aeiouAEIOU]/g) || []).length;
        const vowelRatio = vowels / letters.length;
        if (vowelRatio < 0.22) return true;
        let switches = 0;
        for (let i = 1; i < letters.length; i++) {
          const prevUpper = letters[i - 1] === letters[i - 1].toUpperCase();
          const curUpper = letters[i] === letters[i].toUpperCase();
          if (prevUpper !== curUpper) switches++;
        }
        if (switches / letters.length > 0.45) return true;
      }
    }
  }

  // Phone should contain only digits and be a reasonable length (mobile NL is 10 digits).
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length > 0 && (digits.length < 7 || digits.length > 15)) return true;

  return false;
}

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
    const body = await request.json();
    customerType = body.customerType || 'individual';
    const isBusiness = customerType === 'business';
    let displayName = isBusiness
      ? (body.contactPerson || body.companyName || '')
      : `${body.firstName || ''} ${body.lastName || ''}`.trim();

    // ── Anti-spam layer 1: Honeypot ──
    // The hidden "company" field is invisible to humans. If filled, it's a bot.
    if (typeof body.company === 'string' && body.company.trim() !== '') {
      console.warn('Register spam blocked: honeypot filled');
      return NextResponse.json({ success: true, message: 'Account succesvol aangemaakt' });
    }

    // ── Anti-spam layer 2: Time trap ──
    // Real users need seconds to fill the form. Bots submit instantly.
    if (typeof body.elapsedMs === 'number' && body.elapsedMs >= 0 && body.elapsedMs < 3500) {
      console.warn('Register spam blocked: submitted too fast', body.elapsedMs);
      return NextResponse.json({ success: true, message: 'Account succesvol aangemaakt' });
    }

    // ── Anti-spam layer 3: Disposable email domains ──
    if (isDisposableEmail(body.email || '')) {
      console.warn('Register spam blocked: disposable email', body.email);
      return NextResponse.json({ success: false, message: 'E-mailadres is niet toegestaan.' }, { status: 400 });
    }

    // ── Anti-spam layer 4: Content heuristics ──
    // Detect the random gibberish bot pattern (screenshots: random names/addresses/phone numbers).
    if (looksLikeSpam(displayName, body.address || '', body.city || '', body.phone || '')) {
      console.warn('Register spam blocked: gibberish heuristic', {
        name: displayName,
        address: body.address,
        city: body.city,
      });
      return NextResponse.json({ success: true, message: 'Account succesvol aangemaakt' });
    }

    // ── Anti-spam layer 5: Per-IP rate limiting ──
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      console.warn('Register spam blocked: rate limit', ip);
      return NextResponse.json(
        { success: false, message: 'Te veel registraties vanaf dit IP. Probeer het later opnieuw.' },
        { status: 429 }
      );
    }

    const sql = getDb();
    await ensureTable(sql);

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
    displayName = isBusiness 
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

    // Send beautiful welcome email
    try {
      const finalDisplayName = displayName || (isBusiness
        ? (body.contactPerson || body.companyName || 'LabFix Klant')
        : `${body.firstName || ''} ${body.lastName || ''}`.trim() || 'LabFix Klant');

      await sendAccountConfirmation({
        to: body.email,
        name: finalDisplayName,
        email: body.email,
        customerType: isBusiness ? 'business' : 'individual',
        companyName: isBusiness ? body.companyName : undefined,
        kvkNumber: isBusiness ? body.kvkNumber : undefined,
        btwNumber: isBusiness ? body.btwNumber : undefined,
        phone: body.phone,
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
