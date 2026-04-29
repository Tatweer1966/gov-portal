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
    // 1. Tenant detection
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);

    // 2. Switch to tenant's schema
    await pool.query(`SET search_path TO ${tenant.schema}, public`);
    await pool.query("SET client_encoding = 'UTF8';");

    // 3. Query documents (table name is now schema‑qualified via search_path)
    const result = await pool.query(`
      SELECT id, title_ar, category, file_url, file_size, publish_date
      FROM government_documents
      WHERE is_active = true
      ORDER BY publish_date DESC
    `);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Documents error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الوثائق' },
      { status: 500 }
    );
  }
}