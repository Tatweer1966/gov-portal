import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const nationalId = request.nextUrl.searchParams.get('nationalId');
  if (!nationalId) {
    return NextResponse.json({ success: false, error: 'الرقم القومي للعقار مطلوب' }, { status: 400 });
  }

  // Mock data – replace with real database lookup
  const mockProperty = {
    unified_id: '12345678901234567890',
    address_ar: 'شارع النيل، العمرانية، الجيزة',
    area: 250,
    type_ar: 'سكني',
    status_ar: 'موثق',
  };

  // In production, query the database or external service
  return NextResponse.json({ success: true, data: mockProperty });
}