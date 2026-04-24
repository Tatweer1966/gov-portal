export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST() {
  // Simulate a successful payment
  return NextResponse.json({
    success: true,
    transaction_id: 'MOCK-' + Date.now(),
    message: 'ØªÙ…Øª Ø¹Ù…Ù„ÙŠØ© Ø§Ù„Ø¯ÙØ¹ Ø¨Ù†Ø¬Ø§Ø­ (Ø¨ÙŠØ¦Ø© ØªØ¬Ø±ÙŠØ¨ÙŠØ©)'
  });
}

