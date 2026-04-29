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
        `SELECT * FROM tenders WHERE id = $1`,
        [parseInt(params.id)]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'المناقصة غير موجودة' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Tender detail error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب تفاصيل المناقصة' }, { status: 500 });
  }
}