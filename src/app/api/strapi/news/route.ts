import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://strapi:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    if (!API_TOKEN) {
      return NextResponse.json({ success: false, error: 'API token not configured' }, { status: 500 });
    }

    const body = await request.json();

    const strapiData = {
      data: {
        title_ar: body.title_ar,
        title_en: body.title_en,
        slug: body.slug,
        summary_ar: body.summary_ar,
        summary_en: body.summary_en,
        content_ar: body.content_ar,
        content_en: body.content_en,
        category: body.category,
        priority: body.priority,
        is_featured: body.is_featured,
        published_at_custom: body.published_at_custom,
      },
    };

    const res = await fetch(${STRAPI_URL}/api/news-articles, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Bearer ,
      },
      body: JSON.stringify(strapiData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Strapi error:', data);
      return NextResponse.json(
        { success: false, error: data.error?.message || 'Strapi API error' },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
