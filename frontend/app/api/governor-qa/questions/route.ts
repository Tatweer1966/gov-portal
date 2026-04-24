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

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT q.id, q.question_number, q.user_type, q.question_text, q.category, q.created_at,
             a.answer_text, a.answered_by, a.answered_by_title, a.answer_date
      FROM public.governor_qa_questions q
      LEFT JOIN public.governor_qa_answers a ON q.id = a.question_id
      WHERE q.status IN ('answered', 'published') AND a.is_published = true
      ORDER BY a.answer_date DESC, q.created_at DESC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch Q&A error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø£Ø³Ø¦Ù„Ø©' }, { status: 500 });
  }
}

