import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export interface InvoiceItem {
  name: string;
  sku?: string;
  quantity: number;
  price: number; // unit price excl. BTW
}

export interface InvoiceData {
  orderId: string;
  orderDate: string | Date;
  customer: {
    companyName?: string;
    contactPerson: string;
    email: string;
    phone?: string;
    kvkNumber?: string;
    vatNumber?: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  total: number; // total excl. BTW (we'll calculate BTW)
  vatRate?: number; // default 0.21
  paymentMethod?: string;
  paymentStatus?: string;
}

const COLORS = {
  primary: '#1e40af',     // dark blue
  accent: '#dc2626',      // red
  text: '#1e293b',        // dark slate
  muted: '#64748b',       // slate
  light: '#f1f5f9',       // light slate
  border: '#e2e8f0',      // border
  success: '#16a34a',
};

const COMPANY = {
  name: 'LabFix',
  tagline: 'Professionele Reparatieservice',
  kvk: '42035906',
  btw: 'NL005445900B06',
  iban: 'NL36INGB0115171061',
  email: 'info@labfix.nl',
  phone: '+31 6 5113 1133',
  website: 'www.labfix.nl',
};

/**
 * Generate an invoice PDF as a Buffer
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 10, left: 50, right: 50 },
        bufferPages: true,
        info: {
          Title: `Factuur ${data.orderId}`,
          Author: 'LabFix',
          Subject: `Factuur voor bestelling ${data.orderId}`,
          Producer: 'LabFix Invoice System',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ---------- HEADER ----------
      const headerY = 50;
      const pageWidth = doc.page.width;

      // Logo (top-left)
      try {
        const logoPath = path.join(process.cwd(), 'public', 'logo.png');
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 50, headerY, { fit: [120, 60] });
        }
      } catch {
        // No logo? fall back to text
        doc.fontSize(28).fillColor(COLORS.primary).font('Helvetica-Bold')
          .text(COMPANY.name, 50, headerY);
      }

      // Company info (top-right)
      const rightX = pageWidth - 230;
      doc.fontSize(9).fillColor(COLORS.text).font('Helvetica-Bold')
        .text(COMPANY.name, rightX, headerY, { width: 180, align: 'right' });
      doc.font('Helvetica').fillColor(COLORS.muted)
        .text(COMPANY.tagline, rightX, headerY + 13, { width: 180, align: 'right' })
        .text(`KvK: ${COMPANY.kvk}`, rightX, headerY + 28, { width: 180, align: 'right' })
        .text(`BTW: ${COMPANY.btw}`, rightX, headerY + 41, { width: 180, align: 'right' })
        .text(`IBAN: ${COMPANY.iban}`, rightX, headerY + 54, { width: 180, align: 'right' })
        .text(`${COMPANY.email}  |  ${COMPANY.phone}`, rightX, headerY + 67, { width: 180, align: 'right' });

      // Divider
      doc.moveTo(50, 130).lineTo(pageWidth - 50, 130)
        .strokeColor(COLORS.primary).lineWidth(2).stroke();

      // ---------- INVOICE TITLE ----------
      doc.fontSize(28).fillColor(COLORS.text).font('Helvetica-Bold')
        .text('FACTUUR', 50, 150);

      // Invoice meta box (right-aligned)
      const metaY = 150;
      const metaX = pageWidth - 230;
      const orderDate = new Date(data.orderDate);
      const dateStr = orderDate.toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });

      doc.roundedRect(metaX, metaY, 180, 70, 4)
        .fillColor(COLORS.light).fill();

      doc.fillColor(COLORS.muted).fontSize(8).font('Helvetica-Bold')
        .text('FACTUURNUMMER', metaX + 10, metaY + 8, { width: 160 });
      doc.fillColor(COLORS.primary).fontSize(11).font('Helvetica-Bold')
        .text(data.orderId, metaX + 10, metaY + 20, { width: 160 });

      doc.fillColor(COLORS.muted).fontSize(8).font('Helvetica-Bold')
        .text('FACTUURDATUM', metaX + 10, metaY + 40, { width: 160 });
      doc.fillColor(COLORS.text).fontSize(10).font('Helvetica')
        .text(dateStr, metaX + 10, metaY + 52, { width: 160 });

      // ---------- BILL TO ----------
      const billY = 240;
      doc.fillColor(COLORS.muted).fontSize(9).font('Helvetica-Bold')
        .text('FACTUUR AAN', 50, billY);

      let billCursor = billY + 14;
      doc.fillColor(COLORS.text).fontSize(11).font('Helvetica-Bold');
      if (data.customer.companyName) {
        doc.text(data.customer.companyName, 50, billCursor, { width: 250 });
        billCursor += 14;
      }
      doc.fontSize(10).font('Helvetica');
      doc.text(data.customer.contactPerson, 50, billCursor, { width: 250 });
      billCursor += 13;
      doc.fillColor(COLORS.muted);
      doc.text(data.customer.address, 50, billCursor, { width: 250 });
      billCursor += 13;
      doc.text(`${data.customer.postalCode} ${data.customer.city}`, 50, billCursor, { width: 250 });
      billCursor += 13;
      doc.text(data.customer.country, 50, billCursor, { width: 250 });
      billCursor += 13;
      doc.text(data.customer.email, 50, billCursor, { width: 250 });
      billCursor += 13;
      if (data.customer.phone) {
        doc.text(`Tel: ${data.customer.phone}`, 50, billCursor, { width: 250 });
        billCursor += 13;
      }
      // Only show KvK / BTW if customer is a business
      if (data.customer.kvkNumber) {
        doc.text(`KvK: ${data.customer.kvkNumber}`, 50, billCursor, { width: 250 });
        billCursor += 13;
      }
      if (data.customer.vatNumber) {
        doc.text(`BTW: ${data.customer.vatNumber}`, 50, billCursor, { width: 250 });
        billCursor += 13;
      }

      // ---------- ITEMS TABLE ----------
      const tableTop = Math.max(billCursor + 30, 380);
      const tableWidth = pageWidth - 100;
      const colX = {
        desc: 50,
        sku: 280,
        qty: 360,
        unit: 410,
        total: 480,
      };

      // Header background
      doc.roundedRect(50, tableTop, tableWidth, 24, 3)
        .fillColor(COLORS.primary).fill();

      doc.fillColor('#fff').fontSize(9).font('Helvetica-Bold');
      doc.text('OMSCHRIJVING', colX.desc + 8, tableTop + 8);
      doc.text('SKU', colX.sku, tableTop + 8);
      doc.text('AANTAL', colX.qty, tableTop + 8, { width: 40, align: 'right' });
      doc.text('PRIJS', colX.unit, tableTop + 8, { width: 60, align: 'right' });
      doc.text('TOTAAL', colX.total, tableTop + 8, { width: 65, align: 'right' });

      // Rows - dynamic height based on product name wrap
      let rowY = tableTop + 30;
      doc.fillColor(COLORS.text).fontSize(10).font('Helvetica');
      const descColWidth = colX.sku - colX.desc - 12;
      data.items.forEach((item, i) => {
        // Calculate row height based on description wrap
        const nameHeight = doc.heightOfString(item.name, { width: descColWidth });
        const rowHeight = Math.max(22, nameHeight + 10);
        // Alternate row background
        if (i % 2 === 0) {
          doc.rect(50, rowY - 4, tableWidth, rowHeight).fillColor(COLORS.light).fill();
        }
        doc.fillColor(COLORS.text).font('Helvetica').fontSize(10);
        doc.text(item.name, colX.desc + 8, rowY, { width: descColWidth });
        doc.fillColor(COLORS.muted).fontSize(9);
        doc.text(item.sku || '-', colX.sku, rowY + 1, { width: 70, ellipsis: true });
        doc.fillColor(COLORS.text).fontSize(10);
        doc.text(`${item.quantity}x`, colX.qty, rowY, { width: 40, align: 'right' });
        doc.text(`€ ${item.price.toFixed(2)}`, colX.unit, rowY, { width: 60, align: 'right' });
        doc.font('Helvetica-Bold').text(`€ ${(item.price * item.quantity).toFixed(2)}`, colX.total, rowY, { width: 65, align: 'right' });
        doc.font('Helvetica');
        rowY += rowHeight;
      });

      // ---------- TOTALS ----------
      // Prices are already incl. BTW — do NOT add BTW on top
      const vatRate = data.vatRate ?? 0.21;
      const grandTotal = data.subtotal + data.shippingCost;
      // BTW is informational only: back-calculate from incl. price
      const vatAmount = grandTotal - (grandTotal / (1 + vatRate));

      const totalsX = pageWidth - 230;
      let totalsY = rowY + 20;

      const totalRow = (label: string, value: string, opts: { bold?: boolean; big?: boolean; color?: string; italic?: boolean } = {}) => {
        doc.fillColor(opts.color || COLORS.muted).font(opts.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(opts.big ? 12 : 10);
        doc.text(label, totalsX, totalsY, { width: 110, lineBreak: false });
        doc.fillColor(opts.color || COLORS.text).font(opts.bold ? 'Helvetica-Bold' : 'Helvetica');
        doc.text(value, totalsX + 110, totalsY, { width: 70, align: 'right', lineBreak: false });
        totalsY += opts.big ? 20 : 16;
      };

      totalRow('Subtotaal (incl. BTW)', `€ ${data.subtotal.toFixed(2)}`);
      totalRow('Verzending', data.shippingCost === 0 ? 'Gratis' : `€ ${data.shippingCost.toFixed(2)}`);

      // Divider
      doc.moveTo(totalsX, totalsY + 2).lineTo(pageWidth - 50, totalsY + 2)
        .strokeColor(COLORS.border).lineWidth(1).stroke();
      totalsY += 8;

      totalRow('Totaal', `€ ${grandTotal.toFixed(2)}`, { bold: true, big: true, color: COLORS.primary });

      // Informational BTW breakdown (not added, just shown)
      totalsY += 4;
      doc.fillColor(COLORS.muted).font('Helvetica').fontSize(8)
        .text(`Waarvan BTW (${(vatRate * 100).toFixed(0)}%): € ${vatAmount.toFixed(2)}`, totalsX, totalsY, { width: 180, lineBreak: false });

      // ---------- FOOTER ----------
      const footerY = doc.page.height - 70;
      doc.moveTo(50, footerY).lineTo(pageWidth - 50, footerY)
        .strokeColor(COLORS.border).lineWidth(1).stroke();
      doc.fillColor(COLORS.muted).fontSize(8).font('Helvetica')
        .text(
          `${COMPANY.name}  •  KvK ${COMPANY.kvk}  •  BTW ${COMPANY.btw}  •  ${COMPANY.email}  •  ${COMPANY.phone}`,
          50, footerY + 10, { width: pageWidth - 100, align: 'center', lineBreak: false }
        )
        .text(
          'Bedankt voor uw bestelling! Voor vragen kunt u contact met ons opnemen.',
          50, footerY + 24, { width: pageWidth - 100, align: 'center', lineBreak: false }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
