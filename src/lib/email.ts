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

// Transporter voor Varexo (Gmail) - gebruikt voor repair notificaties
const varexoTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_VAREXO || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT_VAREXO || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER_VAREXO || 'info@varexo.nl',
    pass: process.env.SMTP_PASS_VAREXO,
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
      <!-- Header with Logo -->
      <div style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:32px 24px;text-align:center">
        <div style="display:inline-block;background:#fff;padding:12px 24px;border-radius:8px;margin-bottom:16px">
          <img src="https://stellar-brioche-27fb7f.netlify.app/logo.png" alt="LabFix" style="height:60px;width:auto;display:block;" />
        </div>
        <p style="color:#bfdbfe;margin:8px 0 0;font-size:14px">Professionele Reparatieservice</p>
      </div>
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
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div>
            <p style="margin:0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Bestelnummer</p>
            <p style="margin:4px 0 0;color:#1e40af;font-size:20px;font-weight:bold">${data.orderId}</p>
          </div>
          <div style="text-align:right">
            <p style="margin:0;color:#64748b;font-size:12px">Datum</p>
            <p style="margin:4px 0 0;color:#475569;font-size:14px">${new Date().toLocaleDateString('nl-NL')}</p>
          </div>
        </div>
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
  // Repair notifications sent from Varexo (info@varexo.nl) to LabFix admin
  return varexoTransporter.sendMail({
    from: `"Varexo/LabFix" <${process.env.SMTP_USER_VAREXO || 'info@varexo.nl'}>`,
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

  // Admin emails sent from Varexo (info@varexo.nl)
  return varexoTransporter.sendMail({
    from: `"Varexo/LabFix" <${process.env.SMTP_USER_VAREXO || 'info@varexo.nl'}>`,
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
      <!-- Header with Logo -->
      <div style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:32px 24px;text-align:center">
        <div style="display:inline-block;background:#fff;padding:12px 24px;border-radius:8px;margin-bottom:16px">
          <img src="https://stellar-brioche-27fb7f.netlify.app/logo.png" alt="LabFix" style="height:60px;width:auto;display:block;" />
        </div>
        <p style="color:#bfdbfe;margin:8px 0 0;font-size:14px">Professionele Reparatieservice</p>
      </div>
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
          Heeft u vragen? Bel ons ger op <strong style="color:#1e40af">+31 6 5113 1133</strong> of mail naar <strong style="color:#1e40af">info@labfix.nl</strong>.
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
          Heeft u vragen? Bel ons ger op <strong style="color:#1e40af">+31 6 5113 1133</strong> of mail naar <strong style="color:#1e40af">info@labfix.nl</strong>.
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
      <!-- Header with Logo -->
      <div style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:32px 24px;text-align:center">
        <div style="display:inline-block;background:#fff;padding:12px 24px;border-radius:8px;margin-bottom:16px">
          <img src="https://stellar-brioche-27fb7f.netlify.app/logo.png" alt="LabFix" style="height:60px;width:auto;display:block;" />
        </div>
        <p style="color:#bfdbfe;margin:8px 0 0;font-size:14px">Professionele Reparatieservice</p>
      </div>
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
          Heeft u vragen? Bel ons ger op <strong style="color:#1e40af">+31 6 5113 1133</strong> of mail naar <strong style="color:#1e40af">info@labfix.nl</strong>.
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
          Heeft u vragen? Bel ons ger op <strong style="color:#1e40af">+31 6 5113 1133</strong> of mail naar <strong style="color:#1e40af">info@labfix.nl</strong>.
        </p>
      </div>
    `;
  }

  const fullHtml = headerHtml + bodyHtml + footerHtml;

  // Send from LabFix (info@labfix.nl)
  return labfixTransporter.sendMail({
    from: `"LabFix" <${process.env.SMTP_USER_LABFIX || 'info@labfix.nl'}>`,
    to: data.to,
    subject: `LabFix - Reparatie Aanvraag Ontvangen #${data.repairId.slice(0,8).toUpperCase()}`,
    html: fullHtml,
  });
}

