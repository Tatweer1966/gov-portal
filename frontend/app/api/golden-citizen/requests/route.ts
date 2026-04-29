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

export async function POST(request: NextRequest) {
  try {
    // 1. Tenant detection
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    await pool.query(`SET search_path TO ${tenant.schema}, public`);
    await pool.query("SET client_encoding = 'UTF8';");

    // 2. Parse request body
    const body = await request.json();
    const {
      volunteerId,
      serviceId,
      citizenName,
      citizenNationalId,
      citizenPhone,
      citizenEmail,
      citizenAddress,
      governorate,
      district,
      notes,
      userId,
    } = body;

    // Validate required fields
    if (!citizenName || !citizenPhone || !userId) {
      return NextResponse.json(
        { success: false, error: 'اسم المواطن ورقم الهاتف ومعرف المستخدم كلها مطلوبة' },
        { status: 400 }
      );
    }

    // Generate unique request number
    const requestNumber = `GR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO golden_citizen_requests (
        request_number, user_id, volunteer_id, service_id,
        citizen_name, citizen_national_id, citizen_phone, citizen_email,
        citizen_address, governorate, district, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING request_number
    `;
    const values = [
      requestNumber,
      userId,
      volunteerId || null,
      serviceId || null,
      citizenName,
      citizenNationalId || null,
      citizenPhone,
      citizenEmail || null,
      citizenAddress || null,
      governorate || tenant.name, // fallback to tenant name
      district || null,
      notes || null,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'تم استلام طلب الخدمة',
      requestNumber: result.rows[0].request_number,
    });
  } catch (error) {
    console.error('Golden request error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إرسال الطلب' },
      { status: 500 }
    );
  }
}