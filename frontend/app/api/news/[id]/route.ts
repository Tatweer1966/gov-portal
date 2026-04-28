// app/api/news/[id]/route.ts
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    await pool.query(`SET search_path TO ${tenant.schema}, public`);

    const result = await pool.query(
      `SELECT id, title_ar, content_ar, summary_ar, category,
              priority, is_featured, published_at, views
       FROM governorate_news
       WHERE id = $1 AND status = 'published'`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'الخبر غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('News detail error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الخبر' },
      { status: 500 }
    );
  }
}