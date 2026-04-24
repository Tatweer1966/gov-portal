import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const centerId = searchParams.get('centerId');
  const date = searchParams.get('date');
  const serviceId = searchParams.get('serviceId');

  // Mock available time slots (9:00 – 16:00, hourly)
  const slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  return NextResponse.json({ success: true, slots });
}