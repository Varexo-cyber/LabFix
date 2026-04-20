import { NextRequest, NextResponse } from 'next/server';
import { sendAdminEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();
    await sendAdminEmail(to, subject, message);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Send email error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
