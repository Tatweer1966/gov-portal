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
        SELECT id, full_name, profession, specialization, bio
        FROM golden_citizen_volunteers
        WHERE status = 'approved' AND verified = true
        ORDER BY rating DESC
      `);
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Volunteers fetch error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب المتطوعين' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    const body = await request.json();
    const {
      fullName, nationalId, phone, email, profession, specialization,
      bio, availableDays, availableHours, location, governorate, district
    } = body;

    // Basic validation
    if (!fullName || !nationalId || !phone || !profession || !bio) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول المطلوبة ليست مكتملة' },
        { status: 400 }
      );
    }

    const volunteerCode = `VOL-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      await client.query("SET client_encoding = 'UTF8';");
      await client.query(`
        INSERT INTO golden_citizen_volunteers (
          volunteer_code, full_name, national_id, phone, email,
          profession, specialization, bio, available_days, available_hours,
          location, governorate, district, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        volunteerCode, fullName, nationalId, phone, email || null,
        profession, specialization || null, bio,
        availableDays || null, availableHours || null,
        location || null, governorate || tenant.name, district || null,
        'pending'
      ]);
      return NextResponse.json({ success: true, message: 'تم تسجيل طلب التطوع', volunteerCode });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Volunteer registration error:', error);
    return NextResponse.json({ success: false, error: 'فشل في التسجيل' }, { status: 500 });
  }
}