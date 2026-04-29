export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTenant } from '@/lib/tenant';

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      await client.query("SET client_encoding = 'UTF8';");

      const searchParams = request.nextUrl.searchParams;
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const limit = parseInt(searchParams.get('limit') || '20');
      const offset = parseInt(searchParams.get('offset') || '0');

      let query = `
        SELECT j.id, j.job_number, j.title_ar, j.description_ar, j.qualifications_ar,
               j.location, j.governorate, j.employment_type,
               j.salary_from, j.salary_to, j.employer_name,
               c.name_ar as category_name
        FROM job_listings j
        LEFT JOIN job_categories c ON j.category_id = c.id
        WHERE j.is_active = true
      `;
      const params: any[] = [];
      let idx = 1;

      if (category && category !== 'all') {
        query += ` AND j.category_id = $${idx++}`;
        params.push(category);
      }
      if (search) {
        query += ` AND (j.title_ar ILIKE $${idx} OR j.description_ar ILIKE $${idx + 1})`;
        params.push(`%${search}%`, `%${search}%`);
        idx += 2;
      }
      query += ` ORDER BY j.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
      params.push(limit, offset);

      const result = await client.query(query, params);
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب الوظائف' }, { status: 500 });
  }
}