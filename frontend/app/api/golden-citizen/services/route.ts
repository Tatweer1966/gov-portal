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

    const searchParams = request.nextUrl.searchParams;
    const volunteerId = searchParams.get('volunteerId');

    if (!volunteerId) {
      return NextResponse.json(
        { success: false, error: 'volunteerId مطلوب' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT * FROM golden_citizen_services WHERE volunteer_id = $1 AND is_active = true`,
      [volunteerId]
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Volunteer services error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الخدمات' },
      { status: 500 }
    );
  }
}