// app/api/forms/complaint/route.ts
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
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    await pool.query(`SET search_path TO ${tenant.schema}, public`);
    await pool.query("SET client_encoding = 'UTF8';");

    const body = await request.json();
    const { fullName, email, phone, subject, description, governorate } = body;

    if (!fullName || !email || !phone || !subject || !description) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة: الاسم الكامل، البريد الإلكتروني، الهاتف، الموضوع، والوصف' },
        { status: 400 }
      );
    }

    const complaintId = `CMP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const result = await pool.query(
      `INSERT INTO complaints (complaint_id, full_name, email, phone, subject, description, governorate)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING complaint_id`,
      [complaintId, fullName, email, phone, subject, description, governorate || tenant.name]
    );

    return NextResponse.json({
      success: true,
      message: 'تم استلام شكواك بنجاح',
      complaintId: result.rows[0].complaint_id,
    });
  } catch (error) {
    console.error('Complaint submission error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إرسال الشكوى' },
      { status: 500 }
    );
  }
}