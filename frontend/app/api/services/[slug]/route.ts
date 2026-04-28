import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'gov-portal-db',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const result = await pool.query(
      `SELECT 
        id,
        name_ar,
        description_ar,
        required_documents,
        fees_ar,
        processing_time_ar,
        service_type,
        department_name_ar,
        department_phone,
        department_email,
        location_address_ar,
        application_steps_ar,
        eligibility_criteria_ar,
        legal_basis_ar
      FROM services
      WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'الخدمة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Service fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب بيانات الخدمة' },
      { status: 500 }
    );
  }
}