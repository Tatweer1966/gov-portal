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
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM public.governorate_news WHERE status = 'published'`;
  const params: any[] = [];
  let idx = 1;

  if (category && category !== 'all') {
    query += ` AND category = $${idx++}`;
    params.push(category);
  }
  if (search) {
    query += ` AND (title_ar ILIKE $${idx} OR summary_ar ILIKE $${idx+1})`;
    params.push(`%${search}%`, `%${search}%`);
    idx += 2;
  }
  query += ` ORDER BY published_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    const countQuery = `SELECT COUNT(*) FROM public.governorate_news WHERE status = 'published'`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({ success: true, data: result.rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('News list error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø£Ø®Ø¨Ø§Ø±' }, { status: 500 });
  }
}

