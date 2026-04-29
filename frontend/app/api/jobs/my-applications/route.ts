export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTenant } from '@/lib/tenant';

export async function GET(req: NextRequest) {
  try {
    const host = req.headers.get('host') || '';
    const tenant = getTenant(host);
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ success: false, error: 'معرف المستخدم مطلوب' }, { status: 400 });
    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      const result = await client.query(`
        SELECT a.*, j.title_ar as job_title
        FROM job_applications a
        JOIN job_listings j ON a.job_id = j.id
        WHERE a.applicant_phone = $1
        ORDER BY a.submitted_at DESC
      `, [userId]);
      return NextResponse.json({ success: true, data: result.rows });
    } finally { client.release(); }
  } catch (error) {
    console.error('My applications error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب طلباتك' }, { status: 500 });
  }
}