export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://directus:8055';

export async function GET() {
  const res = await fetch(`${DIRECTUS_URL}/items/news_articles?sort=-published_at`);
  const data = await res.json();
  return NextResponse.json({ success: true, data: data.data });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${DIRECTUS_URL}/items/news_articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
