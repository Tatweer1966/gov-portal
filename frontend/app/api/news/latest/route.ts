export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getTenant } from '@/lib/tenant';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'gov-portal-db',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest) {
  try {
    // Determine tenant from the request host (or fallback to header set by middleware)
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);

    // Switch to the tenant's schema for this connection
    await pool.query(`SET search_path TO ${tenant.schema}, public`);
    await pool.query("SET client_encoding = 'UTF8';");

    const result = await pool.query(`
      SELECT id, news_number, title_ar, summary_ar, category, priority, published_at
      FROM governorate_news
      WHERE status = 'published' AND published_at >= NOW() - INTERVAL '48 hours'
      ORDER BY priority DESC, published_at DESC
      LIMIT 20
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Latest news error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب آخر الأخبار' },
      { status: 500 }
    );
  }
}