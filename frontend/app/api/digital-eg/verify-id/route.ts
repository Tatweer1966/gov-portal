export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';

/**
 * Mock implementation of National ID verification.
 * In production, replace with actual call to Digital Egypt API:
 *   https://api.digitalegypt.gov.eg/id/v1/verify
 * Using mutual TLS (mTLS) and environment variables for credentials.
 */

interface VerificationRequest {
  nationalId: string;
}

interface VerificationResponse {
  success: boolean;
  valid?: boolean;      // optional – only present if the API call succeeded
  name?: string | null;
  message?: string;
  error?: string;
  tenant?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Detect tenant (for logging and future multi‑tenant routing)
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);

    // 2. Parse request body
    let body: VerificationRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<VerificationResponse>(
        { success: false, error: 'طلب غير صالح - يجب أن يكون JSON صحيحاً' },
        { status: 400 }
      );
    }

    const { nationalId } = body;

    // 3. Validate input
    if (!nationalId || typeof nationalId !== 'string') {
      return NextResponse.json<VerificationResponse>(
        { success: false, error: 'الرقم القومي مطلوب' },
        { status: 400 }
      );
    }

    // 4. Mock validation rules
    const isValidFormat = /^\d{14}$/.test(nationalId);
    const validFirstDigit = ['2', '3', '4'].includes(nationalId[0]);
    const isValid = isValidFormat && validFirstDigit;

    // 5. Simulate API delay (optional, can be removed)
    await new Promise(resolve => setTimeout(resolve, 200));

    // 6. Prepare response
    if (isValid) {
      const mockName = `${nationalId.slice(0, 4)} **** ${nationalId.slice(-4)}`;
      return NextResponse.json<VerificationResponse>({
        success: true,
        valid: true,
        name: mockName,
        message: 'الرقم القومي صالح',
        tenant: tenant.name,
      });
    } else {
      let reason = '';
      if (!isValidFormat) reason = 'الرقم القومي يجب أن يتكون من 14 رقمًا';
      else if (!validFirstDigit) reason = 'الرقم القومي يجب أن يبدأ بـ 2 أو 3 أو 4';
      return NextResponse.json<VerificationResponse>({
        success: true, // API call itself succeeded (mock always succeeds)
        valid: false,
        message: `الرقم القومي غير صالح: ${reason}`,
        tenant: tenant.name,
      });
    }
  } catch (error) {
    console.error('ID verification error:', error);
    return NextResponse.json<VerificationResponse>(
      { success: false, error: 'حدث خطأ في الخادم الداخلي' },
      { status: 500 }
    );
  }
}