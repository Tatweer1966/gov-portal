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

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const url = new URL(`${DIRECTUS_URL}/items/news_articles`);

    url.searchParams.set('filter[slug][_eq]', params.slug);
    url.searchParams.set('limit', '1');
    url.searchParams.set('fields', '*');

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
      console.error('Directus fetch by slug error:', errorText);

      return NextResponse.json(
        { success: false, error: 'فشل في جلب الخبر' },
        { status: res.status }
      );
    }

    const json = await res.json();
    const item = json.data?.[0];

    return NextResponse.json({
      success: true,
      data: item ? mapNewsItem(item) : null,
    });
  } catch (error) {
    console.error('Directus slug GET error:', error);

    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}