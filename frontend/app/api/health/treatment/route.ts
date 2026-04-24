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
    const requestNumber = `TRT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const files = formData.getAll('medicalReports') as File[];
    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'treatment');
    await mkdir(uploadDir, { recursive: true });
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      uploadedUrls.push(`/uploads/treatment/${safeName}`);
    }

    const body = JSON.parse(formData.get('data') as string);
    const query = `
      INSERT INTO public.state_funding_treatment_requests (request_number, user_id, citizen_name, citizen_national_id, citizen_phone, citizen_email, governorate, district, address, diagnosis_ar, required_treatment_ar, medical_reports_url, hospital_name_ar, urgency_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, body.userId, body.citizenName, body.citizenNationalId, body.citizenPhone, body.citizenEmail, body.governorate, body.district, body.address, body.diagnosis, body.requiredTreatment, uploadedUrls, body.hospitalName, body.urgencyLevel]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø·Ù„Ø¨', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Treatment error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}

