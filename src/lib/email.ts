import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const itemRows = data.items
    .map(
      (item) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${(item.price * item.quantity).toFixed(2)}</td></tr>`
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff">
      <div style="background:#1e40af;padding:24px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">LabFix</h1>
        <p style="color:#93c5fd;margin:4px 0 0">Uw bestelling is ontvangen</p>
      </div>
      <div style="padding:24px">
        <p>Beste ${data.contactPerson},</p>
        <p>Bedankt voor uw bestelling bij LabFix! Wij hebben uw bestelling ontvangen en gaan er zo snel mogelijk mee aan de slag.</p>
        
        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0;font-weight:bold;color:#1e40af">Bestelnummer: ${data.orderId}</p>
          <p style="margin:4px 0 0;color:#64748b;font-size:14px">Bedrijf: ${data.companyName}</p>
        </div>

        <h3 style="color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:8px">Bestelde artikelen</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f1f5f9">
              <th style="padding:8px;text-align:left">Product</th>
              <th style="padding:8px;text-align:center">Aantal</th>
              <th style="padding:8px;text-align:right">Prijs</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>
        
        <div style="margin-top:16px;text-align:right">
          <p style="margin:4px 0;color:#64748b">Subtotaal: €${data.subtotal.toFixed(2)}</p>
          <p style="margin:4px 0;color:#64748b">Verzending: ${data.shippingCost === 0 ? 'Gratis' : '€' + data.shippingCost.toFixed(2)}</p>
          <p style="margin:4px 0;font-size:18px;font-weight:bold;color:#1e40af">Totaal: €${data.total.toFixed(2)}</p>
          <p style="margin:4px 0;font-size:12px;color:#94a3b8">Excl. BTW</p>
        </div>

        <h3 style="color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:8px;margin-top:24px">Verzendadres</h3>
        <p style="margin:4px 0">${data.companyName}</p>
        <p style="margin:4px 0">${data.shippingAddress}</p>
        <p style="margin:4px 0">${data.shippingPostalCode} ${data.shippingCity}</p>
        <p style="margin:4px 0">${data.shippingCountry}</p>

        <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;border-left:4px solid #22c55e">
          <p style="margin:0;font-weight:bold;color:#166534">Wat nu?</p>
          <p style="margin:8px 0 0;color:#166534;font-size:14px">Wij verwerken uw bestelling zo snel mogelijk. U ontvangt een e-mail zodra uw bestelling is verzonden met de track & trace informatie.</p>
        </div>

        <p style="margin-top:24px;color:#64748b;font-size:14px">Heeft u vragen? Neem gerust contact met ons op via <a href="mailto:info@labfix.nl" style="color:#1e40af">info@labfix.nl</a></p>
      </div>
      <div style="background:#1e293b;padding:16px;text-align:center">
        <p style="color:#94a3b8;margin:0;font-size:12px">© ${new Date().getFullYear()} LabFix - Alle rechten voorbehouden</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"LabFix" <${process.env.SMTP_USER || 'info@labfix.nl'}>`,
    to: data.to,
    subject: `LabFix - Orderbevestiging ${data.orderId}`,
    html,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendAdminEmail(to: string, subject: string, message: string) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1e40af;padding:24px;text-align:center">
        <h1 style="color:#fff;margin:0">LabFix</h1>
      </div>
      <div style="padding:24px;background:#fff">
        ${message.split('\n').map(line => `<p>${line}</p>`).join('')}
      </div>
      <div style="background:#1e293b;padding:16px;text-align:center">
        <p style="color:#94a3b8;margin:0;font-size:12px">© ${new Date().getFullYear()} LabFix</p>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: `"LabFix" <${process.env.SMTP_USER || 'info@labfix.nl'}>`,
    to,
    subject,
    html,
  });
}
