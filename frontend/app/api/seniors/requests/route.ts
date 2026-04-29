export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTenant } from '@/lib/tenant';

export async function POST(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    const body = await request.json();
    const { citizenName, citizenPhone, citizenAddress, serviceSlug, notes, userId } = body;

    if (!citizenName || !citizenPhone || !serviceSlug || !userId) {
      return NextResponse.json({ success: false, error: 'بيانات ناقصة' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      await client.query("SET client_encoding = 'UTF8';");
      const requestNumber = `SR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      await client.query(`
        INSERT INTO golden_citizen_requests (
          request_number, user_id, service_slug, citizen_name, citizen_phone, citizen_address, notes, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      `, [requestNumber, userId, serviceSlug, citizenName, citizenPhone, citizenAddress || null, notes || null]);
      return NextResponse.json({ success: true, message: 'تم تقديم الطلب', requestNumber });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Senior request error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

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
        SELECT id, request_number, service_slug, citizen_name, citizen_phone, citizen_address, notes, status, created_at
        FROM golden_citizen_requests
        WHERE user_id = $1
        ORDER BY created_at DESC
      `, [userId]);
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Fetch senior requests error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب الطلبات' }, { status: 500 });
  }
}