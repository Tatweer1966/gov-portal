export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://directus:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '';

function assetUrl(fileId?: string | null) {
  if (!fileId) return null;

  const publicUrl =
    process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

  return `${publicUrl}/assets/${fileId}`;
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-_]/g, '');
}

function mapNewsItem(item: any) {
  return {
    id: item.id,
    title_ar: item.title_ar,
    title_en: item.title_en,
    slug: item.slug,
    summary_ar: item.summary_ar,
    summary_en: item.summary_en,
    content_ar: item.content_ar,
    content_en: item.content_en,
    category: item.category,
    priority: item.priority,
    is_featured: item.is_featured,
    published_at: item.published_at,
    featured_image: assetUrl(item.featured_image),
    gallery_images: Array.isArray(item.gallery_images)
      ? item.gallery_images.map((id: string) => assetUrl(id)).filter(Boolean)
      : [],
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get('search');
    const category = searchParams.get('category');

    const url = new URL(`${DIRECTUS_URL}/items/news_articles`);

    url.searchParams.set('sort', '-published_at,-id');
    url.searchParams.set('fields', '*');

    if (category && category !== 'all') {
      url.searchParams.set('filter[category][_eq]', category);
    }

    if (search) {
      url.searchParams.set('filter[_or][0][title_ar][_contains]', search);
      url.searchParams.set('filter[_or][1][summary_ar][_contains]', search);
      url.searchParams.set('filter[_or][2][content_ar][_contains]', search);
    }

    const headers: HeadersInit = {};

    if (DIRECTUS_TOKEN) {
      headers.Authorization = `Bearer ${DIRECTUS_TOKEN}`;
    }

    const res = await fetch(url.toString(), {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Directus fetch error:', errorText);

      return NextResponse.json(
        { success: false, error: 'فشل في جلب الأخبار من Directus' },
        { status: res.status }
      );
    }

    const json = await res.json();

    return NextResponse.json({
      success: true,
      data: Array.isArray(json.data) ? json.data.map(mapNewsItem) : [],
    });
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
    const body = await request.json();

    const payload = {
      data: {
        title_ar: body.title_ar,
        title_en: body.title_en || null,
        slug: body.slug
          ? normalizeSlug(body.slug)
          : normalizeSlug(body.title_ar || ''),
        summary_ar: body.summary_ar || null,
        summary_en: body.summary_en || null,
        content_ar: body.content_ar || '',
        content_en: body.content_en || null,
        category: body.category || null,
        priority: Number(body.priority || 0),
        is_featured: Boolean(body.is_featured),
        published_at: body.published_at || null,
        featured_image: body.featured_image || null,
      },
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (DIRECTUS_TOKEN) {
      headers.Authorization = `Bearer ${DIRECTUS_TOKEN}`;
    }

    const res = await fetch(`${DIRECTUS_URL}/items/news_articles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const json = await res.json();

    if (!res.ok) {
      console.error('Directus create error:', json);

      return NextResponse.json(
        {
          success: false,
          error: json?.errors?.[0]?.message || 'فشل في إضافة الخبر',
        },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: mapNewsItem(json.data),
    });
  } catch (error: any) {
    console.error('Directus POST error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'فشل في إضافة الخبر' },
      { status: 500 }
    );
  }
}