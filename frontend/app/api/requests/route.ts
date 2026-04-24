export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  const mockRequests = [
    {
      id: 1,
      request_number: 'REQ-001',
      title: 'طلب خدمة نموذجي',
      description: 'وصف الخدمة',
      status: 'pending',
      created_at: new Date().toISOString(),
      type: 'service',
    },
    {
      id: 2,
      request_number: 'REQ-002',
      title: 'شكوى بخصوص خدمة',
      description: 'تفاصيل الشكوى',
      status: 'in_progress',
      created_at: new Date().toISOString(),
      type: 'complaint',
    },
  ];

  return NextResponse.json({
    success: true,
    data: mockRequests,
    pagination: { page: 1, totalPages: 1 },
  });
}

