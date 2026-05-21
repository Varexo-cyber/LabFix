import { NextRequest, NextResponse } from 'next/server';
import { sendAccountConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await sendAccountConfirmation({
      to: email,
      name: 'Test Gebruiker',
      email: email,
      customerType: 'business'
    });

    return NextResponse.json({ success: true, message: 'Account email sent' });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
