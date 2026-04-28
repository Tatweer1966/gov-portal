export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getTenant } from '@/lib/tenant';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'gov-portal-db',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function POST(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    await pool.query(`SET search_path TO ${tenant.schema}, public`);

    const body = await request.json();
    const questionNumber = `Q-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { userType, userName, userPhone, userEmail, questionText, category, isAnonymous } = body;

    // Basic validation (optional)
    if (!questionText) {
      return NextResponse.json(
        { success: false, error: 'نص السؤال مطلوب' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO governor_qa_questions (
        question_number, user_type, user_name, user_phone, user_email,
        question_text, category, is_anonymous
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING question_number
    `;
    const values = [
      questionNumber,
      userType || null,
      userName || null,
      userPhone || null,
      userEmail || null,
      questionText,
      category || null,
      isAnonymous === true,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'تم استلام سؤالك',
      questionNumber: result.rows[0].question_number,
    });
  } catch (error) {
    console.error('Ask question error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إرسال السؤال' },
      { status: 500 }
    );
  }
}