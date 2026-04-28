export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://directus:8055';

/**
 * IMPORTANT: This endpoint is for Directus integration.
 * Your current CMS is Strapi, not Directus.
 * If you are not using Directus, you can safely delete this file.
 * For multi‑tenant support, we add a 'tenant' filter.
 */

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);

    // Build query with tenant filter
    const url = new URL(`${DIRECTUS_URL}/items/news_articles`);
    url.searchParams.set('sort', '-published_at');
    if (tenant.name !== 'giza') {
      url.searchParams.set('filter[tenant][_eq]', tenant.name);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Directus fetch error:', errorText);
      return NextResponse.json(
        { success: false, error: 'فشل في جلب الأخبار من Directus' },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json({ success: true, data: data.data });
  } catch (error) {
    console.error('Directus GET error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    const body = await request.json();

    // Automatically inject tenant field if not provided
    if (body && !body.tenant) {
      body.tenant = tenant.name;
    }

    const response = await fetch(`${DIRECTUS_URL}/items/news_articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Directus creation failed');
    }
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Directus POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في إضافة الخبر' },
      { status: 500 }
    );
  }
}