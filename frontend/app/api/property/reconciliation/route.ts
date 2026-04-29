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
        await pool.query("SET client_encoding = 'UTF8';");
    const formData = await request.formData();
    const requestNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const files = formData.getAll('documents') as File[];
    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'reconciliation');
    await mkdir(uploadDir, { recursive: true });
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      uploadedUrls.push(`/uploads/reconciliation/${safeName}`);
    }

    const body = JSON.parse(formData.get('data') as string);
    const query = `
      INSERT INTO public.building_violation_reconciliation (request_number, user_id, applicant_name, applicant_national_id, applicant_phone, applicant_email, applicant_address, property_address, governorate, district, property_number, land_area, built_area, violation_description, construction_year, attached_documents)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, body.userId, body.applicantName, body.applicantNationalId, body.applicantPhone, body.applicantEmail, body.applicantAddress, body.propertyAddress, body.governorate, body.district, body.propertyNumber, body.landArea, body.builtArea, body.violationDescription, body.constructionYear, uploadedUrls]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„ØªØµØ§Ù„Ø­', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Reconciliation error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}

