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
    const applicationNumber = `JOB-APP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const jobId = formData.get('jobId');
    const userId = formData.get('userId');
    const applicantName = formData.get('applicantName');
    const nationalId = formData.get('applicantNationalId');
    const phone = formData.get('applicantPhone');
    const email = formData.get('applicantEmail');
    const coverLetter = formData.get('coverLetter');
    const cvFile = formData.get('cv') as File;

    let cvUrl = null;
    if (cvFile) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cvs');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${cvFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      cvUrl = `/uploads/cvs/${safeName}`;
    }

    const query = `
      INSERT INTO public.job_applications (application_number, job_id, user_id, applicant_name, applicant_national_id, applicant_phone, applicant_email, cover_letter, cv_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING application_number
    `;
    const result = await pool.query(query, [applicationNumber, jobId, userId, applicantName, nationalId, phone, email, coverLetter, cvUrl]);

    return NextResponse.json({ success: true, message: 'ØªÙ… ØªÙ‚Ø¯ÙŠÙ… Ø·Ù„Ø¨Ùƒ Ø¨Ù†Ø¬Ø§Ø­', applicationNumber: result.rows[0].application_number });
  } catch (error) {
    console.error('Job application error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}

