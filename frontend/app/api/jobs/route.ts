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
  const governorate = searchParams.get('governorate') || 'Ø§Ù„Ø¬ÙŠØ²Ø©';
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = `
    SELECT j.*, e.company_name_ar, c.name_ar as category_name
    FROM public.job_listings j
    LEFT JOIN public.employers e ON j.employer_id = e.id
    LEFT JOIN public.job_categories c ON j.category_id = c.id
    WHERE j.is_active = true AND j.application_deadline >= CURRENT_DATE AND j.governorate = $1
  `;
  const params: any[] = [governorate];
  let idx = 2;

  if (category && category !== 'all') {
    query += ` AND j.category_id = $${idx++}`;
    params.push(category);
  }
  if (search) {
    query += ` AND (j.title_ar ILIKE $${idx} OR j.description_ar ILIKE $${idx+1})`;
    params.push(`%${search}%`, `%${search}%`);
    idx += 2;
  }
  query += ` ORDER BY j.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„ÙˆØ¸Ø§Ø¦Ù' }, { status: 500 });
  }
}

