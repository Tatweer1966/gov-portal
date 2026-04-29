export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTenant } from '@/lib/tenant';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      await client.query("SET client_encoding = 'UTF8';");
      const result = await client.query(
        `SELECT id, service_name_ar FROM golden_citizen_services WHERE volunteer_id = $1 AND is_active = true`,
        [parseInt(params.id)]
      );
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Volunteer services error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب الخدمات' }, { status: 500 });
  }
}