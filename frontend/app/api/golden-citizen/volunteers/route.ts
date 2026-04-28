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

    const result = await pool.query(`
      SELECT v.*, json_agg(jsonb_build_object('id', s.id, 'service_name_ar', s.service_name_ar)) as services
      FROM golden_citizen_volunteers v
      LEFT JOIN golden_citizen_services s ON v.id = s.volunteer_id
      WHERE v.status = 'approved' AND v.verified = true
      GROUP BY v.id
      ORDER BY v.rating DESC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Volunteers fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المتطوعين' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    await pool.query(`SET search_path TO ${tenant.schema}, public`);

    const body = await request.json();
    const volunteerCode = `VOL-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const {
      fullName,
      nationalId,
      phone,
      email,
      profession,
      specialization,
      bio,
      availableDays,
      availableHours,
      location,
      governorate,
      district,
    } = body;

    // Basic validation
    if (!fullName || !nationalId || !phone) {
      return NextResponse.json(
        { success: false, error: 'الاسم الكامل، الرقم القومي، ورقم الهاتف كلها مطلوبة' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO golden_citizen_volunteers (
        volunteer_code, full_name, national_id, phone, email,
        profession, specialization, bio, available_days, available_hours,
        location, governorate, district
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING volunteer_code
    `;
    const values = [
      volunteerCode,
      fullName,
      nationalId,
      phone,
      email || null,
      profession || null,
      specialization || null,
      bio || null,
      availableDays || null,
      availableHours || null,
      location || null,
      governorate || tenant.name,
      district || null,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل طلب التطوع',
      volunteerCode: result.rows[0].volunteer_code,
    });
  } catch (error) {
    console.error('Volunteer registration error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في التسجيل' },
      { status: 500 }
    );
  }
}