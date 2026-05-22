import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateInvoicePDF, InvoiceData } from '@/lib/invoice';

export const runtime = 'nodejs';

// Sample data for preview/test
function getSampleInvoiceData(orderId: string): InvoiceData {
  return {
    orderId: orderId || 'TEST-12345',
    orderDate: new Date(),
    customer: {
      companyName: 'Test Bedrijf B.V.',
      contactPerson: 'Jan de Vries',
      email: 'klant@voorbeeld.nl',
      phone: '+31 6 1234 5678',
      kvkNumber: '12345678',
      vatNumber: 'NL123456789B01',
      address: 'Voorbeeldstraat 123',
      postalCode: '1234 AB',
      city: 'Amsterdam',
      country: 'Nederland',
    },
    items: [
      { name: 'iPhone 15 Pro Max Screen - OLED', sku: 'IP15PM-OLED', quantity: 2, price: 89.99 },
      { name: 'Samsung Galaxy S24 Battery', sku: 'SGS24-BAT', quantity: 1, price: 24.50 },
      { name: 'iPad Pro 12.9 LCD Display', sku: 'IPADP-LCD', quantity: 1, price: 199.00 },
    ],
    subtotal: 403.48,
    shippingCost: 0,
    total: 403.48,
    paymentMethod: 'iDEAL',
    paymentStatus: 'Betaald',
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const isTest = url.searchParams.get('test') === '1' || id === 'TEST-12345' || id === 'preview';
    const isDownload = url.searchParams.get('download') === '1';

    let invoiceData: InvoiceData;

    if (isTest) {
      invoiceData = getSampleInvoiceData(id || 'TEST-12345');
    } else {
      // Fetch order from DB
      const sql = getDb();
      const orders = await sql`SELECT * FROM orders WHERE id = ${id}`;
      if (orders.length === 0) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      const order: any = orders[0];

      const items = Array.isArray(order.items)
        ? order.items
        : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);

      const contactPerson =
        order.contact_person ||
        [order.first_name, order.last_name].filter(Boolean).join(' ').trim() ||
        order.user_email;

      invoiceData = {
        orderId: order.id,
        orderDate: order.created_at,
        customer: {
          companyName: order.company_name || undefined,
          contactPerson,
          email: order.user_email,
          phone: order.phone || undefined,
          kvkNumber: order.kvk_number || undefined,
          vatNumber: order.vat_number || undefined,
          address: order.shipping_address || '',
          postalCode: order.shipping_postal_code || '',
          city: order.shipping_city || '',
          country: order.shipping_country || 'Nederland',
        },
        items: items.map((it: any) => ({
          name: it.product?.name || it.name || 'Product',
          sku: it.product?.sku || it.sku || '',
          quantity: it.quantity || 1,
          price: parseFloat(it.priceAtPurchase ?? it.price ?? 0),
        })),
        subtotal: parseFloat(order.subtotal || 0),
        shippingCost: parseFloat(order.shipping_cost || 0),
        total: parseFloat(order.total || 0),
        paymentMethod: order.payment_method || undefined,
        paymentStatus: order.status === 'paid' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
          ? 'Betaald'
          : 'Open',
      };
    }

    const pdfBuffer = await generateInvoicePDF(invoiceData);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${isDownload ? 'attachment' : 'inline'}; filename="factuur-${invoiceData.orderId}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('Invoice generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
