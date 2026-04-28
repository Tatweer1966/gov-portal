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
    await pool.query(`SET search_path TO ${tenant.schema}, public`);

    // 2. Query categories (table is now schema‑qualified via search_path)
    const result = await pool.query(`
      SELECT * FROM talent_categories
      WHERE is_active = true
      ORDER BY id
    `);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Talent categories error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الفئات' },
      { status: 500 }
    );
  }
}