export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTenant } from '@/lib/tenant';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    const body = await request.json();
    const { applicantName, applicantType, nationalId, registrationNumber, contactEmail, contactPhone } = body;

    if (!applicantName || !applicantType || !contactEmail || !contactPhone) {
      return NextResponse.json({ success: false, error: 'جميع الحقول المطلوبة غير مكتملة' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      await client.query("SET client_encoding = 'UTF8';");

      // Check tender exists and still active
      const tenderCheck = await client.query(`SELECT id, status FROM tenders WHERE id = $1`, [parseInt(params.id)]);
      if (tenderCheck.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'المناقصة غير موجودة' }, { status: 404 });
      }
      if (tenderCheck.rows[0].status !== 'active') {
        return NextResponse.json({ success: false, error: 'المناقصة مغلقة أو غير متاحة' }, { status: 400 });
      }

      const applicationNumber = `APP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const result = await client.query(`
        INSERT INTO tender_applications (
          application_number, tender_id, applicant_name, applicant_type,
          national_id, registration_number, contact_email, contact_phone
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING application_number
      `, [applicationNumber, parseInt(params.id), applicantName, applicantType,
          nationalId || null, registrationNumber || null, contactEmail, contactPhone]);
      return NextResponse.json({ success: true, message: 'تم تقديم طلبكم بنجاح', applicationNumber: result.rows[0].application_number });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Tender application error:', error);
    return NextResponse.json({ success: false, error: 'فشل في تقديم الطلب' }, { status: 500 });
  }
}