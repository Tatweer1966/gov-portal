export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import pool from '@/lib/db';
import { getTenant } from '@/lib/tenant';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const host = req.headers.get('host') || '';
    const tenant = getTenant(host);
    const formData = await req.formData();
    const applicantName = formData.get('applicantName') as string;
    const applicantEmail = formData.get('applicantEmail') as string;
    const applicantPhone = formData.get('applicantPhone') as string;
    const applicantNationalId = formData.get('applicantNationalId') as string;
    const experienceYears = formData.get('experienceYears') as string;
    const qualifications = formData.get('qualifications') as string;
    const files = formData.getAll('documents') as File[];

    if (!applicantName || !applicantEmail || !applicantPhone) {
      return NextResponse.json({ success: false, error: 'الاسم والبريد والهاتف إلزامية' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'jobs', tenant.name);
    await mkdir(uploadDir, { recursive: true });
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/jobs/${tenant.name}/${safeName}`);
    }

    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      await client.query("SET client_encoding = 'UTF8';");
      const jobId = parseInt(params.id);
      const appNumber = `APP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      await client.query(`
        INSERT INTO job_applications (
          application_number, job_id, applicant_name, applicant_email, applicant_phone,
          applicant_national_id, experience_years, qualifications, documents_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [appNumber, jobId, applicantName, applicantEmail, applicantPhone,
          applicantNationalId || null, experienceYears ? parseInt(experienceYears) : null,
          qualifications || null, uploadedUrls]);
      return NextResponse.json({ success: true, message: 'تم تقديم الطلب بنجاح', applicationNumber: appNumber });
    } finally { client.release(); }
  } catch (error) {
    console.error('Job application error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}