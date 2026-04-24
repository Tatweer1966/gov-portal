export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  if (!query) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    let unionQuery = '';
    const params: any[] = [`%${query}%`, `%${query}%`];
    let paramIndex = 3;

    if (type === 'all' || type === 'services') {
      unionQuery += `
        SELECT 'service' as type, id, name_ar as title, description_ar as description, slug as url, null as date
        FROM public.services
        WHERE name_ar ILIKE $1 OR description_ar ILIKE $2
      `;
    }
    if (type === 'all' || type === 'news') {
      if (unionQuery) unionQuery += ' UNION ALL ';
      unionQuery += `
        SELECT 'news' as type, id, title_ar as title, summary_ar as description, CONCAT('/news/', id) as url, published_at as date
        FROM public.governorate_news
        WHERE status = 'published' AND (title_ar ILIKE $1 OR summary_ar ILIKE $2)
      `;
    }
    if (type === 'all' || type === 'events') {
      if (unionQuery) unionQuery += ' UNION ALL ';
      unionQuery += `
        SELECT 'event' as type, id, title_ar as title, description_ar as description, CONCAT('/events/', id) as url, start_date as date
        FROM public.governorate_events
        WHERE status = 'upcoming' AND (title_ar ILIKE $1 OR description_ar ILIKE $2)
      `;
    }
    if (type === 'all' || type === 'marketplace') {
      if (unionQuery) unionQuery += ' UNION ALL ';
      unionQuery += `
        SELECT 'listing' as type, id, title_ar as title, description_ar as description, CONCAT('/marketplace/', id) as url, created_at as date
        FROM public.marketplace_listings
        WHERE status = 'active' AND (title_ar ILIKE $1 OR description_ar ILIKE $2)
      `;
    }

    const finalQuery = `
      SELECT * FROM (${unionQuery}) AS combined
      ORDER BY date DESC NULLS LAST
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(limit, offset);

    const result = await pool.query(finalQuery, params);
    const countQuery = `SELECT COUNT(*) FROM (${unionQuery}) AS combined`;
    const countResult = await pool.query(countQuery, params.slice(0, 2));
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({ success: true, results: result.rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø§Ù„Ø¨Ø­Ø«' }, { status: 500 });
  }
}

