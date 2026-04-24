export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const questionNumber = `Q-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { userType, userName, userPhone, userEmail, questionText, category, isAnonymous } = body;

    const query = `
      INSERT INTO public.governor_qa_questions (question_number, user_type, user_name, user_phone, user_email, question_text, category, is_anonymous)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING question_number
    `;
    const result = await pool.query(query, [questionNumber, userType, userName, userPhone, userEmail, questionText, category, isAnonymous]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø³Ø¤Ø§Ù„Ùƒ', questionNumber: result.rows[0].question_number });
  } catch (error) {
    console.error('Ask question error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø³Ø¤Ø§Ù„' }, { status: 500 });
  }
}

