export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const applicationNumber = `GIFT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const files = formData.getAll('documents') as File[];
    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gifted');
    await mkdir(uploadDir, { recursive: true });
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      uploadedUrls.push(`/uploads/gifted/${safeName}`);
    }

    const body = JSON.parse(formData.get('data') as string);
    const query = `
      INSERT INTO public.gifted_applications (application_number, applicant_type, applicant_name, applicant_phone, applicant_email, student_name, student_national_id, student_birth_date, student_grade, student_school, student_governorate, student_district, talent_category_id, talent_description, achievements, supporting_docs)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING application_number
    `;
    const result = await pool.query(query, [applicationNumber, body.applicantType, body.applicantName, body.applicantPhone, body.applicantEmail, body.studentName, body.studentNationalId, body.studentBirthDate, body.studentGrade, body.studentSchool, body.studentGovernorate, body.studentDistrict, body.talentCategoryId, body.talentDescription, body.achievements, uploadedUrls]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„ØªØ±Ø´ÙŠØ­', applicationNumber: result.rows[0].application_number });
  } catch (error) {
    console.error('Gifted apply error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}

