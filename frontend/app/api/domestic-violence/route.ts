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

    // 2. Switch to tenant's schema
    await pool.query(`SET search_path TO ${tenant.schema}, public`);

    // 3. Parse request body
    const body = await request.json();
    const {
      reporterName,
      reporterPhone,
      victimName,
      victimAge,
      victimGender,
      incidentLocation,
      violenceType,
      description,
      isUrgent,
    } = body;

    // Validate required fields (basic check)
    if (!reporterName || !reporterPhone) {
      return NextResponse.json(
        { success: false, error: 'اسم المبلغ ورقم الهاتف مطلوبان' },
        { status: 400 }
      );
    }

    // Generate unique report number
    const reportNumber = `DVR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO domestic_violence_reports (
        report_number, reporter_name, reporter_phone, victim_name,
        victim_age, victim_gender, incident_location, violence_type,
        description, is_urgent
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING report_number
    `;
    const values = [
      reportNumber,
      reporterName,
      reporterPhone,
      victimName || null,
      victimAge ? parseInt(victimAge) : null,
      victimGender || null,
      incidentLocation || null,
      violenceType || null,
      description || null,
      isUrgent === true,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'تم استلام البلاغ',
      reportNumber: result.rows[0].report_number,
    });
  } catch (error) {
    console.error('Domestic violence error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إرسال البلاغ' },
      { status: 500 }
    );
  }
}