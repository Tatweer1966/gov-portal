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
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = `
    SELECT s.*, c.name_ar as category_name
    FROM public.services s
    LEFT JOIN public.service_categories c ON s.category_id = c.id
    WHERE s.is_online = true
  `;
  const params: any[] = [];
  let idx = 1;

  if (category && category !== 'all') {
    query += ` AND s.category_id = $${idx++}`;
    params.push(category);
  }
  if (featured === 'true') {
    query += ` AND s.is_featured = true`;
  }
  if (search) {
    query += ` AND (s.name_ar ILIKE $${idx} OR s.description_ar ILIKE $${idx+1})`;
    params.push(`%${search}%`, `%${search}%`);
    idx += 2;
  }

  query += ` ORDER BY s.display_order, s.name_ar LIMIT $${idx++} OFFSET $${idx++}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    const countQuery = `SELECT COUNT(*) FROM public.services WHERE is_online = true`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({ success: true, data: result.rows, pagination: { limit, offset, total } });
  } catch (error) {
    console.error('Services fetch error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø®Ø¯Ù…Ø§Øª' }, { status: 500 });
  }
}

