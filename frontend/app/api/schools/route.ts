import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'postgres',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, name_ar, district, capacity, current_enrollment, grades
      FROM schools
      ORDER BY name_ar
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Schools fetch error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب المدارس' }, { status: 500 });
  }
}