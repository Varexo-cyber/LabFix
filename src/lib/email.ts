import nodemailer from 'nodemailer';

// Transporter voor LabFix (Zoho Mail) - gebruikt voor klant emails (orderbevestigingen)
const labfixTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_LABFIX || 'smtp.zoho.eu',
  port: parseInt(process.env.SMTP_PORT_LABFIX || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER_LABFIX || 'info@labfix.nl',
    pass: process.env.SMTP_PASS_LABFIX,
  },
});


interface OrderEmailData {
  to: string;
  orderId: string;
  companyName: string;
  contactPerson: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  invoiceBuffer?: Buffer; // optional invoice PDF
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const itemRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;font-size:14px">${item.name}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:14px;color:#64748b">${item.quantity}x</td>
          <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:14px;font-weight:600">€${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const headerHtml = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
      <!-- Header: top red accent bar -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
        <tr>
          <td style="height:5px;background:linear-gradient(90deg,#dc2626 0%,#ef4444 50%,#dc2626 100%);font-size:0;line-height:0">&nbsp;</td>
        </tr>
      </table>
      <!-- Header: logo on clean charcoal background -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border-collapse:collapse">
        <tr>
          <td align="center" style="padding:48px 24px 40px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
              <tr>
                <td align="center" style="background:#fff;padding:20px 40px;border-radius:14px">
                  <img src="https://labfix.nl/logo.png" alt="LabFix" width="170" style="height:auto;display:block;border:0;outline:none;text-decoration:none" />
                </td>
              </tr>
            </table>
            <p style="color:#94a3b8;margin:24px 0 0;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600">Professionele Reparatieservice</p>
          </td>
        </tr>
      </table>
  `;

  const footerHtml = `
      <!-- Footer with Contact Info -->
      <div style="background:#1e293b;padding:24px;text-align:center;color:#94a3b8;font-size:12px">
        <p style="margin:0 0 8px">
          <strong style="color:#fff">LabFix Repair Center</strong>
        </p>
        <p style="margin:4px 0">KvK: 42035906 | BTW: NL005445900B06</p>
        <p style="margin:4px 0">Bank: NL36INGB0115171061</p>
        <p style="margin:8px 0">
          <span style="color:#60a5fa">📞 +31 6 5113 1133</span> |
          <span style="color:#60a5fa">✉️ info@labfix.nl</span>
        </p>
        <p style="margin:16px 0 0;font-size:11px;color:#64748b">© ${new Date().getFullYear()} LabFix - Alle rechten voorbehouden</p>
      </div>
      <p style="text-align:center;color:#94a3b8;font-size:11px;padding:8px 24px;margin:0">
        Dit is een automatisch gegenereerde e-mail. U hoeft hier niet op te reageren.
      </p>
    </div>
  `;

  const bodyHtml = `
    <!-- Content -->
    <div style="padding:32px 24px;background:#fff">
      <h2 style="color:#1e293b;font-size:24px;margin:0 0 8px">Bedankt voor uw bestelling! 🎉</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 24px">Uw orderbevestiging</p>

      <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
        Beste ${data.contactPerson},<br><br>
        Bedankt voor uw bestelling bij LabFix! Wij hebben uw bestelling ontvangen en gaan er zo snel mogelijk mee aan de slag.
      </p>

      <!-- Order Info Badge -->
      <div style="background:#eff6ff;border:2px solid #3b82f6;border-radius:8px;padding:20px;margin:24px 0">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
          <tr>
            <td align="left" valign="middle" style="padding:0">
              <p style="margin:0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Bestelnummer</p>
              <p style="margin:4px 0 0;color:#1e40af;font-size:20px;font-weight:bold">${data.orderId}</p>
            </td>
            <td align="right" valign="middle" style="padding:0;white-space:nowrap">
              <p style="margin:0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Datum</p>
              <p style="margin:4px 0 0;color:#475569;font-size:14px;font-weight:600">${new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Order Items -->
      <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0">
        <h3 style="color:#1e293b;font-size:16px;margin:0 0 16px;border-bottom:2px solid #e2e8f0;padding-bottom:8px">📦 Bestelde Artikelen</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f1f5f9">
              <th style="padding:12px 8px;text-align:left;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Product</th>
              <th style="padding:12px 8px;text-align:center;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Aantal</th>
              <th style="padding:12px 8px;text-align:right;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Prijs</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <!-- Order Summary -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;padding-top:16px;border-top:2px solid #e2e8f0">
          <tr>
            <td style="padding:8px 0;color:#64748b">Subtotaal (incl. BTW)</td>
            <td style="padding:8px 0;color:#475569;text-align:right">€ ${data.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Verzending</td>
            <td style="padding:8px 0;color:#22c55e;font-weight:600;text-align:right">${data.shippingCost === 0 ? 'Gratis' : '€ ' + data.shippingCost.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:0;border-top:2px solid #e2e8f0;height:1px;line-height:1px;font-size:1px">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:16px 0 4px 0;color:#1e293b;font-weight:bold;font-size:16px">Totaal</td>
            <td style="padding:16px 0 4px 0;color:#1e40af;font-weight:bold;font-size:20px;text-align:right">€ ${data.total.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:0 0 8px 0;color:#94a3b8;font-size:11px;text-align:right;font-style:italic">Waarvan BTW (21%): € ${(data.total - data.total / 1.21).toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <!-- Shipping Address -->
      <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0">
        <h3 style="color:#1e293b;font-size:16px;margin:0 0 16px;border-bottom:2px solid #e2e8f0;padding-bottom:8px">🚚 Verzendadres</h3>
        <p style="margin:4px 0;color:#475569;font-size:14px;font-weight:600">${data.companyName}</p>
        <p style="margin:4px 0;color:#64748b;font-size:14px">${data.shippingAddress}</p>
        <p style="margin:4px 0;color:#64748b;font-size:14px">${data.shippingPostalCode} ${data.shippingCity}</p>
        <p style="margin:4px 0;color:#64748b;font-size:14px">${data.shippingCountry}</p>
      </div>

      <!-- Track Order Button -->
      <div style="text-align:center;margin:32px 0">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://labfix.nl'}/account" style="background:linear-gradient(135deg,#dc2626 0%,#ef4444 100%);color:#fff;padding:16px 32px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 6px rgba(220,38,38,0.3)">
          Bekijk Mijn Bestellingen →
        </a>
      </div>

      <p style="color:#64748b;font-size:14px;margin:24px 0 0">
        Met vriendelijke groet,<br>
        <strong>Het LabFix Team</strong>
      </p>
    </div>
  `;

  const fullHtml = headerHtml + bodyHtml + footerHtml;

  const attachments = data.invoiceBuffer
    ? [
        {
          filename: `factuur-${data.orderId}.pdf`,
          content: data.invoiceBuffer,
          contentType: 'application/pdf',
        },
      ]
    : undefined;

  return labfixTransporter.sendMail({
    from: `"LabFix" <${process.env.SMTP_USER_LABFIX || 'info@labfix.nl'}>`,
    to: data.to,
    subject: `LabFix - Orderbevestiging ${data.orderId} 🎉`,
    html: fullHtml,
    attachments,
  });
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // Internal notifications (e.g. admin alerts) are sent TO info@labfix.nl.
  // Sending FROM info@labfix.nl TO info@labfix.nl is a self-send that Zoho
  // filters out / files in "Sent" instead of the Inbox — so the notification
  // never arrives. We send FROM noreply@labfix.nl with Reply-To info@labfix.nl
  // so it reliably lands in the inbox while replies still go to info@.
  return labfixTransporter.sendMail({
    from: `"LabFix" <${process.env.SMTP_NOREPLY || 'noreply@labfix.nl'}>`,
    replyTo: `"LabFix" <${process.env.SMTP_USER_LABFIX || 'info@labfix.nl'}>`,
    to,
    subject,
    html,
  });
}

// Customer-facing emails sent from LabFix (info@labfix.nl) — e.g. password reset
export async function sendCustomerEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  return labfixTransporter.sendMail({
    from: `"LabFix" <${process.env.SMTP_USER_LABFIX || 'info@labfix.nl'}>`,
    to,
    subject,
    html,
  });
}

export async function sendAdminEmail(to: string, subject: string, message: string) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1e40af;padding:24px;text-align:center">
        <h1 style="color:#fff;margin:0">LabFix</h1>
        <p style="color:#93c5fd;margin:4px 0 0;font-size:12px">KvK: 42035906 | BTW: NL005445900B06</p>
      </div>
      <div style="padding:24px;background:#fff">
        ${message.split('\n').map(line => `<p>${line}</p>`).join('')}
      </div>
      <div style="background:#1e293b;padding:16px;text-align:center">
        <p style="color:#94a3b8;margin:0;font-size:12px">© ${new Date().getFullYear()} LabFix | Bank: NL36INGB0115171061</p>
      </div>
    </div>
  `;

  // Admin emails sent from LabFix (info@labfix.nl)
  return labfixTransporter.sendMail({
    from: `"LabFix" <${process.env.SMTP_USER_LABFIX || 'info@labfix.nl'}>`,
    to,
    subject,
    html,
  });
}

// ==========================================
// ACCOUNT REGISTRATION CONFIRMATION EMAIL
// ==========================================

interface AccountEmailData {
  to: string;
  name: string;
  email: string;
  customerType: 'individual' | 'business';
  companyName?: string;
  kvkNumber?: string;
  btwNumber?: string;
  phone?: string;
}

export async function sendAccountConfirmation(data: AccountEmailData) {
  const isBusiness = data.customerType === 'business';

  const headerHtml = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
      <!-- Header: top red accent bar -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
        <tr>
          <td style="height:5px;background:linear-gradient(90deg,#dc2626 0%,#ef4444 50%,#dc2626 100%);font-size:0;line-height:0">&nbsp;</td>
        </tr>
      </table>
      <!-- Header: logo on clean charcoal background -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border-collapse:collapse">
        <tr>
          <td align="center" style="padding:48px 24px 40px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
              <tr>
                <td align="center" style="background:#fff;padding:20px 40px;border-radius:14px">
                  <img src="https://labfix.nl/logo.png" alt="LabFix" width="170" style="height:auto;display:block;border:0;outline:none;text-decoration:none" />
                </td>
              </tr>
            </table>
            <p style="color:#94a3b8;margin:24px 0 0;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600">Professionele Reparatieservice</p>
          </td>
        </tr>
      </table>
  `;

  const footerHtml = `
      <!-- Footer with Contact Info -->
      <div style="background:#1e293b;padding:24px;text-align:center;color:#94a3b8;font-size:12px">
        <p style="margin:0 0 8px">
          <strong style="color:#fff">LabFix Repair Center</strong>
        </p>
        <p style="margin:4px 0">KvK: 42035906 | BTW: NL005445900B06</p>
        <p style="margin:4px 0">Bank: NL36INGB0115171061</p>
        <p style="margin:8px 0">
          <span style="color:#60a5fa">📞 +31 6 5113 1133</span> |
          <span style="color:#60a5fa">✉️ info@labfix.nl</span>
        </p>
        <p style="margin:16px 0 0;font-size:11px;color:#64748b">© ${new Date().getFullYear()} LabFix - Alle rechten voorbehouden</p>
      </div>
      <p style="text-align:center;color:#94a3b8;font-size:11px;padding:8px 24px;margin:0">
        Dit is een automatisch gegenereerde e-mail. U hoeft hier niet op te reageren.
      </p>
    </div>
  `;

  let bodyHtml = '';

  if (isBusiness) {
    // BUSINESS ACCOUNT EMAIL
    bodyHtml = `
      <!-- Content -->
      <div style="padding:32px 24px;background:#fff">
        <h2 style="color:#1e293b;font-size:24px;margin:0 0 24px">Welkom bij LabFix! 🎉</h2>

        <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
          Beste ${data.name},<br><br>
          Bedankt voor uw registratie! Uw account is succesvol aangemaakt.
        </p>

        <!-- Success Badge -->
        <div style="background:#dcfce7;border:2px solid #22c55e;border-radius:8px;padding:16px;margin:24px 0">
          <p style="margin:0;color:#166534;font-weight:bold;font-size:14px">
            ✅ Account succesvol aangemaakt
          </p>
          <p style="margin:8px 0 0;color:#166534;font-size:13px">
            U kunt nu inloggen en gebruik maken van alle zakelijke voordelen.
          </p>
        </div>

        <!-- Account Details -->
        <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0">
          <h3 style="color:#1e293b;font-size:16px;margin:0 0 16px;border-bottom:2px solid #e2e8f0;padding-bottom:8px">Uw Account Gegevens</h3>
          <table style="width:100%;font-size:14px;color:#475569">
            <tr><td style="padding:8px 0;width:120px;color:#64748b">Bedrijf:</td><td style="padding:8px 0;font-weight:bold">${data.companyName || 'Niet ingevuld'}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">KVK-nummer:</td><td style="padding:8px 0">${data.kvkNumber || 'Niet ingevuld'}</td></tr>
            ${data.btwNumber ? `<tr><td style="padding:8px 0;color:#64748b">BTW-nummer:</td><td style="padding:8px 0">${data.btwNumber}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#64748b">E-mail:</td><td style="padding:8px 0">${data.email}</td></tr>
            ${data.phone ? `<tr><td style="padding:8px 0;color:#64748b">Telefoon:</td><td style="padding:8px 0">${data.phone}</td></tr>` : ''}
          </table>
        </div>

        <!-- Benefits -->
        <div style="background:#eff6ff;border-radius:8px;padding:20px;margin:24px 0;border-left:4px solid #3b82f6">
          <h4 style="color:#1e40af;font-size:14px;margin:0 0 12px">Uw Zakelijke Voordelen</h4>
          <ul style="color:#1e40af;font-size:13px;line-height:1.8;margin:0;padding-left:20px">
            <li>✓ Exclusieve zakelijke prijzen</li>
            <li>✓ Mogelijkheid tot op rekening</li>
            <li>✓ Snelle reparatieservice</li>
            <li>✓ Directe contactpersoon</li>
            <li>✓ Maandelijkse facturatie mogelijk</li>
          </ul>
        </div>

        <!-- Login Button -->
        <div style="text-align:center;margin:32px 0">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://labfix.nl'}/account/login" style="background:linear-gradient(135deg,#dc2626 0%,#ef4444 100%);color:#fff;padding:16px 32px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 6px rgba(220,38,38,0.3)">
            Inloggen bij Mijn Account →
          </a>
        </div>

        <p style="color:#475569;font-size:14px;line-height:1.6;margin:24px 0">
          Heeft u vragen? Bel ons gerust op <strong style="color:#1e40af">+31 6 5113 1133</strong> of mail naar <strong style="color:#1e40af">info@labfix.nl</strong>.
        </p>

        <p style="color:#64748b;font-size:14px;margin:24px 0 0">
          Met vriendelijke groet,<br>
          <strong>Het LabFix Team</strong>
        </p>
      </div>
    `;
  } else {
    // INDIVIDUAL ACCOUNT EMAIL
    bodyHtml = `
      <!-- Content -->
      <div style="padding:32px 24px;background:#fff">
        <h2 style="color:#1e293b;font-size:24px;margin:0 0 24px">Welkom bij LabFix! 🎉</h2>

        <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
          Beste ${data.name},<br><br>
          Bedankt voor uw registratie! Uw account is succesvol aangemaakt.
        </p>

        <!-- Success Badge -->
        <div style="background:#dcfce7;border:2px solid #22c55e;border-radius:8px;padding:16px;margin:24px 0">
          <p style="margin:0;color:#166534;font-weight:bold;font-size:14px">
            ✅ Account succesvol aangemaakt
          </p>
          <p style="margin:8px 0 0;color:#166534;font-size:13px">
            U kunt nu inloggen en reparaties aanvragen of producten bestellen.
          </p>
        </div>

        <!-- Account Details -->
        <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0">
          <h3 style="color:#1e293b;font-size:16px;margin:0 0 16px;border-bottom:2px solid #e2e8f0;padding-bottom:8px">Uw Account Gegevens</h3>
          <table style="width:100%;font-size:14px;color:#475569">
            <tr><td style="padding:8px 0;width:120px;color:#64748b">Naam:</td><td style="padding:8px 0;font-weight:bold">${data.name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">E-mail:</td><td style="padding:8px 0">${data.email}</td></tr>
            ${data.phone ? `<tr><td style="padding:8px 0;color:#64748b">Telefoon:</td><td style="padding:8px 0">${data.phone}</td></tr>` : ''}
          </table>
        </div>

        <!-- Benefits -->
        <div style="background:#eff6ff;border-radius:8px;padding:20px;margin:24px 0;border-left:4px solid #3b82f6">
          <h4 style="color:#1e40af;font-size:14px;margin:0 0 12px">Uw Voordelen</h4>
          <ul style="color:#1e40af;font-size:13px;line-height:1.8;margin:0;padding-left:20px">
            <li>✓ Eenvoudig reparaties aanvragen</li>
            <li>✓ Bekijk uw reparatiehistorie</li>
            <li>✓ Snelle bestellingen</li>
            <li>✓ Gratis ophalen in regio Den Haag</li>
            <li>✓ Track & trace van uw reparaties</li>
          </ul>
        </div>

        <!-- Login Button -->
        <div style="text-align:center;margin:32px 0">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://labfix.nl'}/account/login" style="background:linear-gradient(135deg,#dc2626 0%,#ef4444 100%);color:#fff;padding:16px 32px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 6px rgba(220,38,38,0.3)">
            Inloggen bij Mijn Account →
          </a>
        </div>

        <p style="color:#475569;font-size:14px;line-height:1.6;margin:24px 0">
          Heeft u vragen? Bel ons gerust op <strong style="color:#1e40af">+31 6 5113 1133</strong> of mail naar <strong style="color:#1e40af">info@labfix.nl</strong>.
        </p>

        <p style="color:#64748b;font-size:14px;margin:24px 0 0">
          Met vriendelijke groet,<br>
          <strong>Het LabFix Team</strong>
        </p>
      </div>
    `;
  }

  const fullHtml = headerHtml + bodyHtml + footerHtml;

  // Send from LabFix (info@labfix.nl)
  return labfixTransporter.sendMail({
    from: `"LabFix" <${process.env.SMTP_USER_LABFIX || 'info@labfix.nl'}>`,
    to: data.to,
    subject: `Welkom bij LabFix - Uw account is aangemaakt! 🎉`,
    html: fullHtml,
  });
}

// ==========================================
// REPAIR CONFIRMATION EMAILS (Customer)
// ==========================================

interface RepairEmailData {
  to: string;
  name: string;
  phone: string;
  deviceType: string;
  deviceModel: string;
  problemDescription: string;
  serviceType: 'pickup' | 'shipping';
  pickupLocation?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  repairId: string;
}

export async function sendRepairConfirmation(data: RepairEmailData) {
  const isPickup = data.serviceType === 'pickup';

  const headerHtml = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
      <!-- Header: top red accent bar -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
        <tr>
          <td style="height:5px;background:linear-gradient(90deg,#dc2626 0%,#ef4444 50%,#dc2626 100%);font-size:0;line-height:0">&nbsp;</td>
        </tr>
      </table>
      <!-- Header: logo on clean charcoal background -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border-collapse:collapse">
        <tr>
          <td align="center" style="padding:48px 24px 40px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
              <tr>
                <td align="center" style="background:#fff;padding:20px 40px;border-radius:14px">
                  <img src="https://labfix.nl/logo.png" alt="LabFix" width="170" style="height:auto;display:block;border:0;outline:none;text-decoration:none" />
                </td>
              </tr>
            </table>
            <p style="color:#94a3b8;margin:24px 0 0;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600">Professionele Reparatieservice</p>
          </td>
        </tr>
      </table>
  `;

  const footerHtml = `
      <!-- Footer with Contact Info -->
      <div style="background:#1e293b;padding:24px;text-align:center;color:#94a3b8;font-size:12px">
        <p style="margin:0 0 8px">
          <strong style="color:#fff">LabFix Repair Center</strong>
        </p>
        <p style="margin:4px 0">KvK: 42035906 | BTW: NL005445900B06</p>
        <p style="margin:4px 0">Bank: NL36INGB0115171061</p>
        <p style="margin:8px 0">
          <span style="color:#60a5fa">📞 +31 6 5113 1133</span> |
          <span style="color:#60a5fa">✉️ info@labfix.nl</span>
        </p>
        <p style="margin:16px 0 0;font-size:11px;color:#64748b">© ${new Date().getFullYear()} LabFix - Alle rechten voorbehouden</p>
      </div>
      <p style="text-align:center;color:#94a3b8;font-size:11px;padding:8px 24px;margin:0">
        Dit is een automatisch gegenereerde e-mail. U hoeft hier niet op te reageren.
      </p>
    </div>
  `;

  let bodyHtml = '';

  if (isPickup) {
    // PICKUP EMAIL TEMPLATE
    bodyHtml = `
      <!-- Content -->
      <div style="padding:32px 24px;background:#fff">
        <h2 style="color:#1e293b;font-size:24px;margin:0 0 24px">Uw Reparatie Aanvraag is Ontvangen!</h2>

        <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
          Beste ${data.name},<br><br>
          Bedankt voor uw aanvraag. We hebben uw ophaalverzoek ontvangen en zullen contact met u opnemen.
        </p>

        <!-- Status Badge -->
        <div style="background:#fef3c7;border:2px solid #fbbf24;border-radius:8px;padding:16px;margin:24px 0">
          <p style="margin:0;color:#92400e;font-weight:bold;font-size:14px">
            ⏳ Status: In Behandeling
          </p>
          <p style="margin:8px 0 0;color:#92400e;font-size:13px">
            We nemen binnen 24 uur contact met u op om een afspraak te maken.
          </p>
        </div>

        <!-- Summary Box -->
        <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0">
          <h3 style="color:#1e293b;font-size:16px;margin:0 0 16px;border-bottom:2px solid #e2e8f0;padding-bottom:8px">Samenvatting Reparatie Aanvraag</h3>
          <table style="width:100%;font-size:14px;color:#475569">
            <tr><td style="padding:8px 0;width:120px;color:#64748b">Aanvraag ID:</td><td style="padding:8px 0;font-weight:bold;color:#1e40af">#${data.repairId.slice(0,8).toUpperCase()}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Naam:</td><td style="padding:8px 0">${data.name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Telefoon:</td><td style="padding:8px 0">${data.phone}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Apparaat:</td><td style="padding:8px 0">${data.deviceType} ${data.deviceModel}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Service:</td><td style="padding:8px 0;color:#059669;font-weight:bold">✓ Ophalen aan huis</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Ophaaladres:</td><td style="padding:8px 0">${data.pickupLocation || 'Nog niet bevestigd'}</td></tr>
          </table>
        </div>

        <!-- What happens next -->
        <div style="background:#ecfdf5;border-radius:8px;padding:20px;margin:24px 0;border-left:4px solid #10b981">
          <h4 style="color:#065f46;font-size:14px;margin:0 0 12px">Wat gebeurt er nu?</h4>
          <ol style="color:#065f46;font-size:13px;line-height:1.8;margin:0;padding-left:20px">
            <li>We bellen u binnen 24 uur om een afspraak te maken</li>
            <li>We komen uw apparaat ophalen op het afgesproken tijdstip</li>
            <li>We repareren uw apparaat (meestal binnen 1-2 werkdagen)</li>
            <li>We brengen het gerepareerd terug</li>
          </ol>
        </div>

        <p style="color:#475569;font-size:14px;line-height:1.6;margin:24px 0">
          Heeft u vragen? Bel ons gerust op <strong style="color:#1e40af">+31 6 5113 1133</strong> of mail naar <strong style="color:#1e40af">info@labfix.nl</strong>.
        </p>
      </div>
    `;
  } else {
    // SHIPPING EMAIL TEMPLATE
    bodyHtml = `
      <!-- Content -->
      <div style="padding:32px 24px;background:#fff">
        <h2 style="color:#1e293b;font-size:24px;margin:0 0 24px">Uw Reparatie Aanvraag is Ontvangen!</h2>

        <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
          Beste ${data.name},<br><br>
          Bedankt voor uw aanvraag. We hebben uw verzoek om op te sturen ontvangen.
        </p>

        <!-- Status Badge -->
        <div style="background:#fef3c7;border:2px solid #fbbf24;border-radius:8px;padding:16px;margin:24px 0">
          <p style="margin:0;color:#92400e;font-weight:bold;font-size:14px">
            ⏳ Status: In Behandeling
          </p>
          <p style="margin:8px 0 0;color:#92400e;font-size:13px">
            We sturen u binnen 24 uur een offerte met het verzendadres.
          </p>
        </div>

        <!-- Summary Box -->
        <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0">
          <h3 style="color:#1e293b;font-size:16px;margin:0 0 16px;border-bottom:2px solid #e2e8f0;padding-bottom:8px">Samenvatting Reparatie Aanvraag</h3>
          <table style="width:100%;font-size:14px;color:#475569">
            <tr><td style="padding:8px 0;width:120px;color:#64748b">Aanvraag ID:</td><td style="padding:8px 0;font-weight:bold;color:#1e40af">#${data.repairId.slice(0,8).toUpperCase()}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Naam:</td><td style="padding:8px 0">${data.name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Telefoon:</td><td style="padding:8px 0">${data.phone}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Apparaat:</td><td style="padding:8px 0">${data.deviceType} ${data.deviceModel}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Service:</td><td style="padding:8px 0;color:#059669;font-weight:bold">✓ Opsturen</td></tr>
          </table>
        </div>

        <!-- Shipping Instructions -->
        <div style="background:#fff7ed;border-radius:8px;padding:20px;margin:24px 0;border-left:4px solid #f97316">
          <h4 style="color:#9a3412;font-size:14px;margin:0 0 12px">📦 Verpakkingsinstructies</h4>
          <ul style="color:#9a3412;font-size:13px;line-height:1.8;margin:0;padding-left:20px">
            <li>Gebruik een stevige doos met voldoende bescherming (bubble wrap, noppenfolie)</li>
            <li>Zorg dat het apparaat niet kan bewegen tijdens transport</li>
            <li>Vermeld uw naam en reparatie-ID duidelijk op de doos: <strong>#${data.repairId.slice(0,8).toUpperCase()}</strong></li>
            <li>Stuur de lader mee zodat we het apparaat kunnen testen</li>
            <li>Geen originele doos? Gebruik kranten of foam ter bescherming</li>
          </ul>
        </div>

        <!-- What happens next -->
        <div style="background:#ecfdf5;border-radius:8px;padding:20px;margin:24px 0;border-left:4px solid #10b981">
          <h4 style="color:#065f46;font-size:14px;margin:0 0 12px">Wat gebeurt er nu?</h4>
          <ol style="color:#065f46;font-size:13px;line-height:1.8;margin:0;padding-left:20px">
            <li>U ontvangt binnen 24 uur een offerte via e-mail</li>
            <li>Bij akkoord ontvangt u het verzendadres</li>
            <li>U stuurt het apparaat op (verzendkosten zijn voor uw rekening)</li>
            <li>We repareren uw apparaat (meestal binnen 1-2 werkdagen)</li>
            <li>We sturen het gratis retour naar u terug</li>
          </ol>
        </div>

        <p style="color:#475569;font-size:14px;line-height:1.6;margin:24px 0">
          Heeft u vragen? Bel ons gerust op <strong style="color:#1e40af">+31 6 5113 1133</strong> of mail naar <strong style="color:#1e40af">info@labfix.nl</strong>.
        </p>
      </div>
    `;
  }

  const fullHtml = headerHtml + bodyHtml + footerHtml;

  // Send from noreply so the mailserver doesn't auto-copy the confirmation
  // to the sending account inbox (info@labfix.nl). Reply-To ensures the
  // customer can still reply directly to LabFix.
  return labfixTransporter.sendMail({
    from: `"LabFix" <${process.env.SMTP_NOREPLY || 'noreply@labfix.nl'}>`,
    replyTo: `"LabFix" <${process.env.SMTP_USER_LABFIX || 'info@labfix.nl'}>`,
    to: data.to,
    subject: `LabFix - Reparatie Aanvraag Ontvangen #${data.repairId.slice(0,8).toUpperCase()}`,
    html: fullHtml,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Order Status Update Email (processing / shipped / delivered)
// ─────────────────────────────────────────────────────────────────────────────
interface OrderStatusEmailData {
  to: string;
  orderId: string;
  contactPerson: string;
  status: 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  shippingCarrier?: string; // e.g. "PostNL", "DHL"
  shippingPostcode?: string; // needed for PostNL deep-link
}

const STATUS_CONFIG = {
  processing: {
    emoji: '⚙️',
    title: 'Uw bestelling wordt verwerkt!',
    subject: 'Uw bestelling wordt verwerkt',
    headline: 'Uw bestelling wordt nu verwerkt 📦',
    message: 'Goed nieuws! Uw bestelling is in behandeling genomen en wordt zorgvuldig voor verzending klaargemaakt. U ontvangt een nieuwe e-mail zodra uw pakket onderweg is.',
    color: '#3b82f6',
    bgColor: '#dbeafe',
  },
  shipped: {
    emoji: '🚚',
    title: 'Uw bestelling is onderweg!',
    subject: 'Uw bestelling is verzonden',
    headline: 'Uw pakket is onderweg! 🚚',
    message: 'Goed nieuws! Uw bestelling is verzonden en is nu onderweg naar u toe. U kunt het pakket volgen met onderstaande track & trace code.',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
  },
  delivered: {
    emoji: '✅',
    title: 'Uw bestelling is geleverd!',
    subject: 'Uw bestelling is geleverd',
    headline: 'Uw pakket is bezorgd! ✅',
    message: 'Uw pakket is succesvol afgeleverd. We hopen dat u tevreden bent met uw bestelling. Heeft u vragen of opmerkingen? Laat het ons gerust weten.',
    color: '#10b981',
    bgColor: '#d1fae5',
  },
} as const;

function buildTrackingButtonHtml(trackingNumber: string, carrier: string, postcode?: string): string {
  const carrierLower = carrier.toLowerCase();
  let trackUrl = '';
  if (carrierLower.includes('postnl')) {
    // PostNL URL format: /track-and-trace/{barcode}-{country}-{postcode}
    // Without a valid postcode PostNL treats whatever is in that slot as the postcode → "niet gevonden".
    // If we have a postcode use it; otherwise fall back to the simpler tracktrace URL that does not require postcode.
    const pc = (postcode || '').replace(/\s+/g, '').toUpperCase();
    if (pc && /^[0-9]{4}[A-Z]{2}$/.test(pc)) {
      trackUrl = `https://jouw.postnl.nl/track-and-trace/${encodeURIComponent(trackingNumber)}-NL-${pc}`;
    } else {
      // Generic PostNL track-and-trace search (no postcode required)
      trackUrl = `https://postnl.nl/tracktrace/?B=${encodeURIComponent(trackingNumber)}&P=&D=NL&T=C&L=NL`;
    }
  } else if (carrierLower.includes('dhl')) {
    trackUrl = `https://www.dhl.com/nl-nl/home/tracking/tracking-parcel.html?submit=1&tracking-id=${encodeURIComponent(trackingNumber)}`;
  } else if (carrierLower.includes('dpd')) {
    trackUrl = `https://www.dpd.com/tracking/?parcelNumber=${encodeURIComponent(trackingNumber)}`;
  } else if (carrierLower.includes('ups')) {
    trackUrl = `https://www.ups.com/track?tracknum=${encodeURIComponent(trackingNumber)}`;
  } else {
    trackUrl = `https://www.google.com/search?q=${encodeURIComponent(trackingNumber + ' track and trace')}`;
  }
  return `<a href="${trackUrl}" style="background:linear-gradient(135deg,#dc2626 0%,#ef4444 100%);color:#fff;padding:16px 32px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 6px rgba(220,38,38,0.3)">Volg uw pakket</a>`;
}

export async function sendOrderStatusUpdate(data: OrderStatusEmailData) {
  const cfg = STATUS_CONFIG[data.status];
  const carrier = data.shippingCarrier || 'PostNL';

  const headerHtml = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
      <!-- Header: top red accent bar -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
        <tr>
          <td style="height:5px;background:linear-gradient(90deg,#dc2626 0%,#ef4444 50%,#dc2626 100%);font-size:0;line-height:0">&nbsp;</td>
        </tr>
      </table>
      <!-- Header: logo on clean charcoal background -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border-collapse:collapse">
        <tr>
          <td align="center" style="padding:48px 24px 40px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
              <tr>
                <td align="center" style="background:#fff;padding:20px 40px;border-radius:14px">
                  <img src="https://labfix.nl/logo.png" alt="LabFix" width="170" style="height:auto;display:block;border:0;outline:none;text-decoration:none" />
                </td>
              </tr>
            </table>
            <p style="color:#94a3b8;margin:24px 0 0;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600">Professionele Reparatieservice</p>
          </td>
        </tr>
      </table>
  `;

  const trackingBlock = data.trackingNumber
    ? `
      <div style="background:${cfg.bgColor};border:2px solid ${cfg.color};border-radius:8px;padding:24px;margin:24px 0;text-align:center">
        <p style="margin:0 0 8px;color:#475569;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:600">Track &amp; Trace</p>
        <p style="margin:0 0 4px;color:#64748b;font-size:13px">Vervoerder: <strong style="color:#1e293b">${carrier}</strong></p>
        <p style="margin:8px 0 16px;color:${cfg.color};font-size:22px;font-weight:bold;letter-spacing:1px">${data.trackingNumber}</p>
        ${buildTrackingButtonHtml(data.trackingNumber, carrier, data.shippingPostcode)}
      </div>
    `
    : '';

  const bodyHtml = `
    <div style="padding:32px 24px">
      <h2 style="color:#1e293b;font-size:24px;margin:0 0 8px">${cfg.headline}</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 24px">${cfg.title}</p>

      <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
        Beste ${data.contactPerson},<br><br>
        ${cfg.message}
      </p>

      <div style="background:#eff6ff;border:2px solid #3b82f6;border-radius:8px;padding:20px;margin:24px 0">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
          <tr>
            <td align="left" valign="middle" style="padding:0">
              <p style="margin:0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Bestelnummer</p>
              <p style="margin:4px 0 0;color:#1e40af;font-size:20px;font-weight:bold">${data.orderId}</p>
            </td>
            <td align="right" valign="middle" style="padding:0;white-space:nowrap">
              <p style="margin:0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Status</p>
              <p style="margin:4px 0 0;color:${cfg.color};font-size:14px;font-weight:bold;text-transform:uppercase">${cfg.emoji} ${data.status}</p>
            </td>
          </tr>
        </table>
      </div>

      ${trackingBlock}

      <div style="text-align:center;margin:32px 0">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://labfix.nl'}/account" style="background:linear-gradient(135deg,#dc2626 0%,#ef4444 100%);color:#fff;padding:16px 32px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 6px rgba(220,38,38,0.3)">
          Bekijk Mijn Bestellingen →
        </a>
      </div>

      <p style="color:#64748b;font-size:14px;margin:24px 0 0">
        Met vriendelijke groet,<br>
        <strong>Het LabFix Team</strong>
      </p>
    </div>
  `;

  const footerHtml = `
      <div style="background:#1e293b;padding:24px;text-align:center;color:#94a3b8;font-size:12px">
        <p style="margin:0 0 8px"><strong style="color:#fff">LabFix Repair Center</strong></p>
        <p style="margin:4px 0">KvK: 42035906 | BTW: NL005445900B06</p>
        <p style="margin:4px 0">Bank: NL36INGB0115171061</p>
        <p style="margin:8px 0">
          <span style="color:#60a5fa">📞 +31 6 5113 1133</span> |
          <span style="color:#60a5fa">✉️ info@labfix.nl</span>
        </p>
        <p style="margin:16px 0 0;font-size:11px;color:#64748b">© ${new Date().getFullYear()} LabFix - Alle rechten voorbehouden</p>
      </div>
      <p style="text-align:center;color:#94a3b8;font-size:11px;padding:8px 24px;margin:0">Dit is een automatisch gegenereerde e-mail. U hoeft hier niet op te reageren.</p>
    </div>
  `;

  return labfixTransporter.sendMail({
    from: `"LabFix" <${process.env.SMTP_USER_LABFIX || 'info@labfix.nl'}>`,
    to: data.to,
    subject: `LabFix - ${cfg.subject} (${data.orderId})`,
    html: headerHtml + bodyHtml + footerHtml,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Return / Retour emails
// ─────────────────────────────────────────────────────────────────────────────

const RETURN_REASON_LABELS: Record<string, string> = {
  defect: 'Product is defect / kapot',
  wrong: 'Verkeerd product ontvangen',
  not_needed: 'Niet meer nodig (herroepingsrecht)',
  damaged: 'Beschadigd aangekomen',
  other: 'Anders',
};

function returnReasonLabel(reason: string): string {
  return RETURN_REASON_LABELS[reason] || reason;
}

// Shared LabFix email shell (header + footer)
function labfixShell(innerHtml: string): string {
  const header = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
        <tr><td style="height:5px;background:linear-gradient(90deg,#dc2626 0%,#ef4444 50%,#dc2626 100%);font-size:0;line-height:0">&nbsp;</td></tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border-collapse:collapse">
        <tr>
          <td align="center" style="padding:40px 24px 32px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
              <tr><td align="center" style="background:#fff;padding:18px 36px;border-radius:14px">
                <img src="https://labfix.nl/logo.png" alt="LabFix" width="160" style="height:auto;display:block;border:0;outline:none;text-decoration:none" />
              </td></tr>
            </table>
            <p style="color:#94a3b8;margin:20px 0 0;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600">Professionele Reparatieservice</p>
          </td>
        </tr>
      </table>
  `;
  const footer = `
      <div style="background:#1e293b;padding:24px;text-align:center;color:#94a3b8;font-size:12px">
        <p style="margin:0 0 8px"><strong style="color:#fff">LabFix Repair Center</strong></p>
        <p style="margin:4px 0">KvK: 42035906 | BTW: NL005445900B06</p>
        <p style="margin:8px 0">
          <span style="color:#60a5fa">📞 +31 6 5113 1133</span> |
          <span style="color:#60a5fa">✉️ info@labfix.nl</span>
        </p>
        <p style="margin:16px 0 0;font-size:11px;color:#64748b">© ${new Date().getFullYear()} LabFix - Alle rechten voorbehouden</p>
      </div>
    </div>
  `;
  return header + innerHtml + footer;
}

interface ReturnAdminData {
  returnId: string;
  orderId: string;
  msIncrementId: string;
  contactPerson: string;
  userEmail: string;
  phone: string;
  reason: string;
  description: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: { name: string; quantity: number }[];
}

// Notification to LabFix admin (info@labfix.nl) when a customer requests a return
export async function sendReturnRequestAdmin(data: ReturnAdminData) {
  const itemRows = data.items
    .map(
      (it) =>
        `<tr>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:14px">${it.name}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:14px;color:#64748b">${it.quantity}x</td>
        </tr>`
    )
    .join('');

  const body = `
    <div style="padding:32px 24px;background:#fff">
      <h2 style="color:#dc2626;font-size:22px;margin:0 0 8px">🔄 Nieuwe retouraanvraag</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 24px">Een klant heeft een retour aangevraagd. Vraag een retourlabel aan bij MobileSentrix en stuur deze naar de klant.</p>

      <div style="background:#fef2f2;border:2px solid #fca5a5;border-radius:8px;padding:20px;margin:0 0 24px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
          <tr>
            <td style="padding:0"><p style="margin:0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Retour-ID</p>
            <p style="margin:4px 0 0;color:#b91c1c;font-size:18px;font-weight:bold">${data.returnId}</p></td>
            <td align="right" style="padding:0"><p style="margin:0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">LabFix bestelling</p>
            <p style="margin:4px 0 0;color:#475569;font-size:16px;font-weight:600">${data.orderId}</p></td>
          </tr>
        </table>
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin:0 0 24px">
        <tr><td style="padding:6px 0;color:#64748b;font-size:14px">MobileSentrix order #</td><td style="padding:6px 0;text-align:right;font-size:14px;font-weight:600">${data.msIncrementId || '—'}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Reden</td><td style="padding:6px 0;text-align:right;font-size:14px;font-weight:600">${returnReasonLabel(data.reason)}</td></tr>
      </table>

      ${data.description ? `<div style="background:#f8fafc;border-left:4px solid #dc2626;padding:14px 16px;margin:0 0 24px;border-radius:4px">
        <p style="margin:0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Toelichting klant</p>
        <p style="margin:8px 0 0;color:#334155;font-size:14px;line-height:1.5">${data.description}</p>
      </div>` : ''}

      <h3 style="color:#1e293b;font-size:16px;margin:24px 0 8px">Klantgegevens</h3>
      <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin:0 0 24px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Naam</td><td style="padding:6px 0;text-align:right;font-size:14px;font-weight:600">${data.contactPerson || '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;font-size:14px">E-mail</td><td style="padding:6px 0;text-align:right;font-size:14px;font-weight:600">${data.userEmail}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Telefoon</td><td style="padding:6px 0;text-align:right;font-size:14px;font-weight:600">${data.phone || '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;font-size:14px;vertical-align:top">Adres</td><td style="padding:6px 0;text-align:right;font-size:14px;font-weight:600">${data.shippingAddress || '—'}<br>${data.shippingPostalCode || ''} ${data.shippingCity || ''}<br>${data.shippingCountry || ''}</td></tr>
        </table>
      </div>

      <h3 style="color:#1e293b;font-size:16px;margin:24px 0 8px">Producten</h3>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
        ${itemRows}
      </table>
    </div>
  `;

  // Admin notification sent from LabFix (info@labfix.nl) to LabFix admin (info@labfix.nl)
  return labfixTransporter.sendMail({
    from: `"LabFix" <${process.env.SMTP_USER_LABFIX || 'info@labfix.nl'}>`,
    to: process.env.RETURN_ADMIN_EMAIL || 'info@labfix.nl',
    replyTo: data.userEmail,
    subject: `🔄 Retouraanvraag ${data.returnId} - bestelling ${data.orderId}`,
    html: labfixShell(body),
  });
}

interface ReturnConfirmationData {
  to: string;
  returnId: string;
  orderId: string;
  contactPerson: string;
  reason: string;
  items: { name: string; quantity: number }[];
}

// Confirmation to the customer that their return request was received
export async function sendReturnConfirmation(data: ReturnConfirmationData) {
  const itemRows = data.items
    .map(
      (it) =>
        `<tr>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:14px">${it.name}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:14px;color:#64748b">${it.quantity}x</td>
        </tr>`
    )
    .join('');

  const body = `
    <div style="padding:32px 24px;background:#fff">
      <h2 style="color:#1e293b;font-size:24px;margin:0 0 8px">Uw retouraanvraag is ontvangen ✅</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 24px">Retour-ID: <strong>${data.returnId}</strong></p>

      <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">
        Beste ${data.contactPerson},<br><br>
        Bedankt voor uw retouraanvraag voor bestelling <strong>${data.orderId}</strong>. We hebben uw aanvraag in goede orde ontvangen en gaan ermee aan de slag.
      </p>

      <div style="background:#eff6ff;border:2px solid #3b82f6;border-radius:8px;padding:20px;margin:0 0 24px">
        <p style="margin:0 0 8px;color:#1e40af;font-size:16px;font-weight:bold">📦 Wat gebeurt er nu?</p>
        <ol style="margin:0;padding-left:20px;color:#334155;font-size:14px;line-height:1.7">
          <li>Uw retour staat nu <strong>in afwachting</strong>.</li>
          <li>Binnen <strong>3 werkdagen</strong> ontvangt u per e-mail een <strong>retourlabel</strong>.</li>
          <li>Verpak het product <strong>goed en stevig</strong> in de originele verpakking of een vergelijkbare doos, zodat het onbeschadigd retour kan.</li>
          <li>Plak het retourlabel op het pakket en lever het in bij het aangegeven afgiftepunt.</li>
        </ol>
      </div>

      <div style="background:#fffbeb;border:2px solid #f59e0b;border-radius:8px;padding:16px 20px;margin:0 0 24px">
        <p style="margin:0;color:#92400e;font-size:14px;line-height:1.6">
          <strong>⚠️ Let op — retourkosten:</strong> De kosten voor het terugsturen van uw bestelling zijn voor eigen rekening. Deze kosten worden niet vergoed.
        </p>
      </div>

      <h3 style="color:#1e293b;font-size:16px;margin:24px 0 8px">Te retourneren producten</h3>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin:0 0 24px">
        ${itemRows}
      </table>

      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:24px 0 0">
        Heeft u vragen over uw retour? Neem gerust contact met ons op via <a href="mailto:info@labfix.nl" style="color:#dc2626">info@labfix.nl</a> onder vermelding van uw retour-ID.
      </p>
    </div>
  `;

  return labfixTransporter.sendMail({
    from: `"LabFix" <${process.env.SMTP_USER_LABFIX || 'info@labfix.nl'}>`,
    to: data.to,
    subject: `LabFix - Retouraanvraag ontvangen (${data.returnId})`,
    html: labfixShell(body),
  });
}
