import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await sendOrderConfirmation({
      to: email,
      orderId: 'TEST-12345',
      companyName: 'Test Bedrijf',
      contactPerson: 'Test Gebruiker',
      items: [
        {
          name: 'iPhone 15 Pro Max Screen - OLED (Test)',
          quantity: 2,
          price: 89.99
        },
        {
          name: 'Samsung Galaxy S24 Battery (Test)',
          quantity: 1,
          price: 24.50
        }
      ],
      subtotal: 204.48,
      shippingCost: 0,
      total: 204.48,
      shippingAddress: 'Teststraat 123',
      shippingCity: 'Amsterdam',
      shippingPostalCode: '1234 AB',
      shippingCountry: 'Nederland'
    });

    return NextResponse.json({ success: true, message: 'Order email sent' });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
