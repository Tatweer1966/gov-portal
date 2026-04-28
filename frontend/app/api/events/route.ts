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

    // 2. Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'upcoming';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 3. Build dynamic query (no schema prefix)
    let query = `SELECT * FROM governorate_events WHERE status = $1`;
    const params: any[] = [status];
    let idx = 2;

    if (status === 'upcoming') {
      query += ` AND start_date >= CURRENT_DATE`;
    }
    query += ` ORDER BY start_date ASC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(limit, offset);

    // 4. Execute query
    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Events fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الفعاليات' },
      { status: 500 }
    );
  }
}