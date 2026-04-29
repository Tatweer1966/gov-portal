import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'postgres',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function POST(request: NextRequest) {
  try {
        await pool.query("SET client_encoding = 'UTF8';");
    const body = await request.json();
    const {
      childName,
      childNationalId,
      childBirthDate,
      parentName,
      parentNationalId,
      phone,
      email,
      address,
      district,
      schoolType,
      userId,
    } = body;

    // Validate required fields
    if (!childName || !childNationalId || !childBirthDate || !parentName || !parentNationalId || !phone || !address || !district || !schoolType) {
      return NextResponse.json({ success: false, error: 'جميع الحقول المطلوبة لم يتم إدخالها' }, { status: 400 });
    }

    const trackingNumber = `KG-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO kindergarten_applications (
        tracking_number, user_id,
        child_name, child_national_id, child_birth_date,
        parent_name, parent_national_id, phone, email,
        address, district, school_type, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending')
      RETURNING tracking_number
    `;

    const values = [
      trackingNumber,
      userId || null,
      childName,
      childNationalId,
      childBirthDate,
      parentName,
      parentNationalId,
      phone,
      email || null,
      address,
      district,
      schoolType,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'تم تقديم الطلب بنجاح',
      trackingNumber: result.rows[0].tracking_number,
    });
  } catch (error) {
    console.error('Kindergarten application error:', error);
    return NextResponse.json({ success: false, error: 'فشل في تقديم الطلب' }, { status: 500 });
  }
}