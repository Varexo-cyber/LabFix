import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// LabFix transporter for customer emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_LABFIX || 'smtp.zoho.eu',
  port: parseInt(process.env.SMTP_PORT_LABFIX || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER_LABFIX || 'info@labfix.nl',
    pass: process.env.SMTP_PASS_LABFIX,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();
    
    // Build full email with header, message content, and footer
    const fullHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:32px 24px;text-align:center">
          <h1 style="color:#fff;margin:0">LabFix</h1>
          <p style="color:#bfdbfe;margin:4px 0 0;font-size:12px">Professionele Reparatieservice</p>
        </div>
        
        <!-- Content -->
        <div style="padding:24px;background:#fff">
          <p style="color:#475569;font-size:14px;line-height:1.6;margin-bottom:20px;">
            Beste klant,<br><br>
            Hieronder vindt u een update over uw bestelling:
          </p>
          
          ${message}
        </div>
        
        <!-- Footer -->
        <div style="background:#1e293b;padding:24px;text-align:center">
          <p style="color:#fff;margin:0 0 8px 0;font-size:14px;font-weight:600;">Met vriendelijke groet,</p>
          <p style="color:#60a5fa;margin:0 0 16px 0;font-size:16px;font-weight:bold;">Het LabFix Team</p>
          <p style="color:#94a3b8;margin:8px 0;font-size:12px">KvK: 42035906 | BTW: NL005445900B06</p>
          <p style="color:#94a3b8;margin:4px 0;font-size:12px">📞 +31 6 5113 1133 | ✉️ info@labfix.nl</p>
          <p style="color:#64748b;margin:16px 0 0;font-size:11px">Bank: NL36INGB0115171061</p>
        </div>
      </div>
    `;
    
    // Send from LabFix (info@labfix.nl) to customer
    await transporter.sendMail({
      from: '"LabFix" <info@labfix.nl>',
      to,
      subject,
      html: fullHtml,
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Send email error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
