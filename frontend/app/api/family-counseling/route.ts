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

    // 2. Parse request body
    const body = await request.json();
    const { requestType, description, preferredDate, preferredTime, userId } = body;

    // Optional: validate required fields
    if (!requestType || !description || !userId) {
      return NextResponse.json(
        { success: false, error: 'نوع الطلب، الوصف، ومعرف المستخدم كلها مطلوبة' },
        { status: 400 }
      );
    }

    // Generate unique request number
    const requestNumber = `FCR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO family_counseling_requests (
        request_number, user_id, request_type, description, preferred_date, preferred_time
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING request_number
    `;
    const values = [
      requestNumber,
      userId,
      requestType,
      description,
      preferredDate || null,
      preferredTime || null,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'تم استلام طلب الاستشارة',
      requestNumber: result.rows[0].request_number,
    });
  } catch (error) {
    console.error('Family counseling error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إرسال الطلب' },
      { status: 500 }
    );
  }
}