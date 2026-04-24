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
    const applicationId = `APP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const serviceId = formData.get('serviceId');
    const userId = formData.get('userId');
    const applicationData = JSON.parse(formData.get('applicationData') as string);
    const files = formData.getAll('documents') as File[];

    const uploadedFiles: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'applications');
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);
      uploadedFiles.push(`/uploads/applications/${safeName}`);
    }

    const query = `
      INSERT INTO public.service_applications (application_id, service_id, user_id, application_data, uploaded_documents, submitted_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING application_id
    `;
    const result = await pool.query(query, [applicationId, serviceId, userId, JSON.stringify(applicationData), uploadedFiles]);

    return NextResponse.json({ success: true, message: 'ØªÙ… ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨ Ø¨Ù†Ø¬Ø§Ø­', applicationId: result.rows[0].application_id });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}

