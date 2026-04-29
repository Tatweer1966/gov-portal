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
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    await pool.query(`SET search_path TO ${tenant.schema}, public`);
    await pool.query("SET client_encoding = 'UTF8';");

    const result = await pool.query(`
      SELECT id, title_ar, content_ar, 'page' as type, created_by
      FROM pages
      WHERE status = 'pending_review'
      UNION ALL
      SELECT id, title_ar, content_ar, 'news' as type, created_by
      FROM governorate_news
      WHERE status = 'pending_review'
      LIMIT 50
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Pending content error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المحتوى المنتظر' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, action, type } = await request.json();
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    await pool.query(`SET search_path TO ${tenant.schema}, public`);
    await pool.query("SET client_encoding = 'UTF8';");

    const table = type === 'page' ? 'pages' : 'governorate_news';
    const newStatus = action === 'approve' ? 'published' : 'draft';
    await pool.query(`UPDATE ${table} SET status = $1 WHERE id = $2`, [newStatus, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Content action error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الحالة' },
      { status: 500 }
    );
  }
}