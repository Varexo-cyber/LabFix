import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();
    const isBusiness = body.customerType === 'business';

    // Check existing email
    const existingEmail = await sql`SELECT id FROM users WHERE LOWER(email) = ${body.email.toLowerCase()}`;
    if (existingEmail.length > 0) {
      return NextResponse.json({ success: false, message: 'Email is al geregistreerd' }, { status: 400 });
    }

    // Check existing KVK (only for business)
    if (isBusiness && body.kvkNumber) {
      const existingKvk = await sql`SELECT id FROM users WHERE kvk_number = ${body.kvkNumber}`;
      if (existingKvk.length > 0) {
        return NextResponse.json({ success: false, message: 'KVK nummer is al geregistreerd' }, { status: 400 });
      }
    }

    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Set display name
    const displayName = isBusiness 
      ? (body.contactPerson || body.companyName)
      : `${body.firstName} ${body.lastName}`;

    await sql`
      INSERT INTO users (id, email, password, customer_type, first_name, last_name, company_name, kvk_number, contact_person, phone, address, city, postal_code, country)
      VALUES (${id}, ${body.email}, ${hashedPassword}, ${body.customerType || 'individual'}, ${body.firstName || ''}, ${body.lastName || ''}, ${body.companyName || ''}, ${body.kvkNumber || ''}, ${body.contactPerson || ''}, ${body.phone || ''}, ${body.address || ''}, ${body.city || ''}, ${body.postalCode || ''}, ${body.country || 'Nederland'})
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

    return NextResponse.json({ success: true, message: 'Account aangemaakt' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
