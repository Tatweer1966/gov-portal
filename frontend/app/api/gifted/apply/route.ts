export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
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

    // 2. Parse multipart form data
    const formData = await request.formData();
    const applicationNumber = `GIFT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // 3. Handle file uploads (tenant‑isolated folder)
    const files = formData.getAll('documents') as File[];
    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gifted', tenant.name);
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/gifted/${tenant.name}/${safeName}`);
    }

    // 4. Parse JSON data
    const dataString = formData.get('data') as string;
    if (!dataString) {
      throw new Error('Missing form data');
    }
    const body = JSON.parse(dataString);

    // 5. Insert application into tenant‑specific table
    const query = `
      INSERT INTO gifted_applications (
        application_number, applicant_type, applicant_name, applicant_phone,
        applicant_email, student_name, student_national_id, student_birth_date,
        student_grade, student_school, student_governorate, student_district,
        talent_category_id, talent_description, achievements, supporting_docs
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING application_number
    `;
    const values = [
      applicationNumber,
      body.applicantType,
      body.applicantName,
      body.applicantPhone,
      body.applicantEmail,
      body.studentName,
      body.studentNationalId,
      body.studentBirthDate,
      body.studentGrade,
      body.studentSchool,
      body.studentGovernorate,
      body.studentDistrict,
      body.talentCategoryId,
      body.talentDescription,
      body.achievements || null,
      uploadedUrls,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'تم استلام طلب الترشيح',
      applicationNumber: result.rows[0].application_number,
    });
  } catch (error) {
    console.error('Gifted apply error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إرسال الطلب' },
      { status: 500 }
    );
  }
}