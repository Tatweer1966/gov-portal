export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { nationalId } = await request.json();
  const isValid = /^\d{14}$/.test(nationalId);
  return NextResponse.json({
    success: true,
    valid: isValid,
    name: isValid ? 'Ù…Ø­Ù…Ø¯ Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…ÙˆØ¯' : null,
    message: isValid ? 'Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ ØµØ§Ù„Ø­' : 'Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ ØºÙŠØ± ØµØ§Ù„Ø­'
  });
}

