export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTenant } from '@/lib/tenant';

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ success: false, error: 'userId مطلوب' }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      const result = await client.query(`
        SELECT r.*, e.title_ar as event_title
        FROM event_registrations r
        JOIN governorate_events e ON r.event_id = e.id
        WHERE r.citizen_phone = $1
        ORDER BY r.registration_date DESC
      `, [userId]); // using phone as user identifier; adjust with your auth system
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('My registrations error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب التسجيلات' }, { status: 500 });
  }
}