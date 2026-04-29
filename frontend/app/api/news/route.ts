import pool, { setTenantSchema } from '@/lib/db';
import { getTenant } from '@/lib/tenant';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    const client = await pool.connect();
    try {
      await setTenantSchema(client, tenant.schema);
      // Force UTF‑8 encoding for this connection
      await client.query("SET client_encoding = 'UTF8';");
      
      const result = await client.query(`
        SELECT id, title_ar, summary_ar, content_ar, category,
               priority, is_featured, published_at, views
        FROM governorate_news
        WHERE status = 'published'
        ORDER BY published_at DESC
      `);
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('News list error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب الأخبار' }, { status: 500 });
  }
}