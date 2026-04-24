export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  const suggestions = [
    'ترخيص بناء',
    'المراكز التكنولوجية',
    'تقديم شكوى',
    'الخدمات الاجتماعية'
  ].filter(s => s.includes(q));
  return NextResponse.json({ suggestions });
}

