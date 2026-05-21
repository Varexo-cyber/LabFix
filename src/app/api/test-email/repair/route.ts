import { NextRequest, NextResponse } from 'next/server';
import { sendRepairConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await sendRepairConfirmation({
      to: email,
      serviceType: 'pickup',
      customerName: 'Test Gebruiker',
      companyName: 'Test Bedrijf',
      phone: '+31 6 12345678',
      deviceType: 'iPhone 15 Pro Max',
      deviceBrand: 'Apple',
      problemDescription: 'Scherm is gebarsten en touchscreen werkt niet goed. Toestel valt soms uit.',
      symptoms: 'Touchscreen niet responsief, Barst in scherm, Toestel valt uit',
      urgency: 'standaard',
      pickupAddress: 'Teststraat 123, 1234 AB Amsterdam',
      preferredDate: '2026-05-25',
      preferredTime: '14:00',
      repairId: 'REP-TEST-001'
    });

    return NextResponse.json({ success: true, message: 'Repair email sent' });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
