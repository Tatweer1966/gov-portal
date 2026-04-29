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
      const status = searchParams.get('status') || 'active';
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const offset = (page - 1) * limit;

      const result = await client.query(`
        SELECT id, tender_number, title_ar, description_ar, category, type,
               status, submission_deadline, opening_date, budget_ar, is_featured
        FROM tenders
        WHERE status = $1
        ORDER BY submission_deadline ASC
        LIMIT $2 OFFSET $3
      `, [status, limit, offset]);

      const countResult = await client.query(`SELECT COUNT(*) FROM tenders WHERE status = $1`, [status]);
      const total = parseInt(countResult.rows[0].count);

      return NextResponse.json({
        success: true,
        data: result.rows,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Tenders fetch error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب المناقصات' }, { status: 500 });
  }
}