export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTenant } from '@/lib/tenant';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const host = req.headers.get('host') || '';
    const tenant = getTenant(host);
    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      await client.query("SET client_encoding = 'UTF8';");
      const result = await client.query(`
        SELECT id, job_number, title_ar, description_ar, qualifications_ar,
               location, employment_type, salary_from, salary_to, employer_name
        FROM job_listings WHERE id = $1 AND is_active = true
      `, [parseInt(params.id)]);
      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'الوظيفة غير موجودة' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: result.rows[0] });
    } finally { client.release(); }
  } catch (error) {
    console.error('Job detail error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب تفاصيل الوظيفة' }, { status: 500 });
  }
}