import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email';
import { generateInvoicePDF } from '@/lib/invoice';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const items = [
      { name: 'iPhone 15 Pro Max Screen - OLED (Test)', sku: 'IP15PM-OLED', quantity: 2, price: 89.99 },
      { name: 'Samsung Galaxy S24 Battery (Test)', sku: 'SGS24-BAT', quantity: 1, price: 24.50 },
    ];
    const subtotal = 204.48;
    const shippingCost = 0;
    const total = 204.48;

    // Generate sample invoice PDF
    let invoiceBuffer: Buffer | undefined;
    try {
      invoiceBuffer = await generateInvoicePDF({
        orderId: 'TEST-12345',
        orderDate: new Date(),
        customer: {
          companyName: 'Test Bedrijf B.V.',
          contactPerson: 'Test Gebruiker',
          email,
          phone: '+31 6 1234 5678',
          kvkNumber: '12345678',
          vatNumber: 'NL123456789B01',
          address: 'Teststraat 123',
          postalCode: '1234 AB',
          city: 'Amsterdam',
          country: 'Nederland',
        },
        items,
        subtotal,
        shippingCost,
        total,
        paymentMethod: 'iDEAL',
        paymentStatus: 'Betaald',
      });
    } catch (e) {
      console.error('Sample invoice PDF generation failed:', e);
    }

    await sendOrderConfirmation({
      to: email,
      orderId: 'TEST-12345',
      companyName: 'Test Bedrijf',
      contactPerson: 'Test Gebruiker',
      items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      subtotal,
      shippingCost,
      total,
      shippingAddress: 'Teststraat 123',
      shippingCity: 'Amsterdam',
      shippingPostalCode: '1234 AB',
      shippingCountry: 'Nederland',
      invoiceBuffer,
    });

    return NextResponse.json({ success: true, message: 'Order email sent (with PDF invoice)' });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
