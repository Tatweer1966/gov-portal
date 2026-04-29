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
      const result = await client.query(`
        SELECT id, name_ar, name_en, address_ar, phone, email, working_hours_ar, latitude, longitude
        FROM tech_centers
        WHERE is_active = true
        ORDER BY name_ar
      `);
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Tech centers fetch error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب المراكز التكنولوجية' }, { status: 500 });
  }
}