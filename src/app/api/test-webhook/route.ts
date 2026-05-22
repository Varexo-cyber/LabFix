import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Test webhook - simuleert Mollie webhook voor testdoeleinden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { molliePaymentId, orderId } = body;

    if (!molliePaymentId || !orderId) {
      return NextResponse.json({ 
        error: 'Missing molliePaymentId or orderId',
        example: {
          molliePaymentId: 'tr_xxxxxxxx',
          orderId: 'ORD-XXXXXX'
        }
      }, { status: 400 });
    }

    // Roep de echte webhook aan
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stellar-brioche-27fb7f.netlify.app';
    
    const formData = new URLSearchParams();
    formData.append('id', molliePaymentId);

    console.log('🧪 Test webhook - calling real webhook with:', { molliePaymentId, orderId });

    const response = await fetch(`${baseUrl}/api/payments/mollie/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Test webhook executed',
      molliePaymentId,
      orderId,
      webhookResponse: result,
      status: response.status,
      check: {
        netlifyLogs: 'Bekijk Netlify Functions logs voor details',
        geheimAdmin: `Check geheim-admin → Bestellingen voor order ${orderId}`,
        email: 'Check of bevestigingsmail is verstuurd'
      }
    });

  } catch (error: any) {
    console.error('Test webhook error:', error);
    return NextResponse.json({ 
      error: error.message,
      tip: 'Zorg dat je een geldige molliePaymentId gebruikt die in de payments tabel staat'
    }, { status: 500 });
  }
}

// GET - toon instructies
export async function GET() {
  return NextResponse.json({
    message: 'Test Webhook Endpoint',
    howToUse: {
      step1: 'Maak eerst een betaling aan via de checkout (maak geen echte betaling)',
      step2: 'Haal de molliePaymentId op uit de payments tabel in geheim-admin of database',
      step3: 'POST naar dit endpoint met: { molliePaymentId: "tr_xxxx", orderId: "ORD-xxxx" }',
      step4: 'Check Netlify logs en geheim-admin voor resultaat'
    },
    example: {
      method: 'POST',
      url: '/api/test-webhook',
      body: {
        molliePaymentId: 'tr_7UhSN2zuHs',
        orderId: 'ORD-2025ABC123'
      }
    }
  });
}
