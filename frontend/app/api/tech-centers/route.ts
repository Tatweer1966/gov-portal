export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'postgres',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        tc.id, tc.name_ar, tc.district, tc.address_ar, tc.phone,
        tc.working_hours_ar, tc.latitude, tc.longitude,
        COALESCE(json_agg(jsonb_build_object('id', ts.id, 'name_ar', ts.name_ar)) FILTER (WHERE ts.id IS NOT NULL), '[]') as services
      FROM tech_centers tc
      LEFT JOIN center_services cs ON tc.id = cs.center_id
      LEFT JOIN tech_services ts ON cs.service_id = ts.id
      WHERE tc.is_active = true
      GROUP BY tc.id
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'فشل في جلب المراكز' }, { status: 500 });
  }
}
