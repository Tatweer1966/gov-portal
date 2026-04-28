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
      currentGrade,
      currentSchoolId,
      requestedSchoolId,
      reason,
      userId,
    } = body;

    if (!studentName || !studentNationalId || !currentGrade || !currentSchoolId || !requestedSchoolId) {
      return NextResponse.json({ success: false, error: 'جميع الحقول المطلوبة لم يتم إدخالها' }, { status: 400 });
    }

    // Check if requested school has vacancy for the grade
    const schoolResult = await pool.query(
      'SELECT capacity, current_enrollment, grades FROM schools WHERE id = $1',
      [requestedSchoolId]
    );
    if (schoolResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'المدرسة المطلوبة غير موجودة' }, { status: 404 });
    }

    const school = schoolResult.rows[0];
    const grades = school.grades || [];
    if (!grades.includes(currentGrade)) {
      return NextResponse.json({ success: false, error: 'هذه المدرسة لا تقبل هذا الصف الدراسي' }, { status: 400 });
    }

    if (school.current_enrollment >= school.capacity) {
      return NextResponse.json({ success: false, error: 'المدرسة ممتلئة، لا توجد أماكن شاغرة' }, { status: 400 });
    }

    // Generate unique request number
    const requestNumber = `TR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO school_transfer_requests (
        request_number, student_name, student_national_id,
        current_grade, current_school_id, requested_school_id,
        reason, status, user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
      RETURNING request_number
    `;
    const values = [
      requestNumber,
      studentName,
      studentNationalId,
      currentGrade,
      currentSchoolId,
      requestedSchoolId,
      reason || null,
      userId || null,
    ];
    const result = await pool.query(query, values);

    // Optionally increment current_enrollment? No, only after approval. We'll keep pending.

    return NextResponse.json({
      success: true,
      message: 'تم استلام طلب التحويل',
      requestNumber: result.rows[0].request_number,
    });
  } catch (error) {
    console.error('Transfer request error:', error);
    return NextResponse.json({ success: false, error: 'فشل في تقديم الطلب' }, { status: 500 });
  }
}