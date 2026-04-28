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
    const body = await request.json();
    const {
      studentName,
      studentNationalId,
      studentBirthDate,
      studentGrade,
      disabilityType,
      disabilityDetails,
      supportNeeds,
      guardianName,
      guardianRelation,
      guardianPhone,
      guardianEmail,
      address,
      schoolId,
      notes,
      documents,
      userId,
    } = body;

    if (!studentName || !studentNationalId || !guardianName || !guardianPhone || !address) {
      return NextResponse.json({ success: false, error: 'جميع الحقول المطلوبة لم يتم إدخالها' }, { status: 400 });
    }

    const requestNumber = `SNE-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO special_needs_enrollments (
        request_number, student_name, student_national_id, student_birth_date, student_grade,
        disability_type, disability_details, support_needs,
        guardian_name, guardian_relation, guardian_phone, guardian_email, address,
        school_id, notes, documents, status, user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'pending', $17)
      RETURNING request_number
    `;

    const values = [
      requestNumber,
      studentName,
      studentNationalId,
      studentBirthDate,
      studentGrade,
      disabilityType,
      disabilityDetails,
      supportNeeds,
      guardianName,
      guardianRelation,
      guardianPhone,
      guardianEmail,
      address,
      schoolId,
      notes,
      documents || [],
      userId || null,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'تم استلام طلب الالتحاق',
      requestNumber: result.rows[0].request_number,
    });
  } catch (error) {
    console.error('Enrollment request error:', error);
    return NextResponse.json({ success: false, error: 'فشل في تقديم الطلب' }, { status: 500 });
  }
}