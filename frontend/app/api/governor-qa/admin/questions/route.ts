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

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    await pool.query(`SET search_path TO ${tenant.schema}, public`);

    const result = await pool.query(`
      SELECT q.*, a.answer_text as existing_answer
      FROM governor_qa_questions q
      LEFT JOIN governor_qa_answers a ON q.id = a.question_id
      WHERE q.status IN ('pending', 'answered')
      ORDER BY q.created_at ASC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Admin questions error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الأسئلة' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    await pool.query(`SET search_path TO ${tenant.schema}, public`);

    const body = await request.json();
    const { questionId, answerText, answeredBy, answeredByTitle, publish } = body;

    // Check if answer already exists
    const existing = await pool.query(
      'SELECT id FROM governor_qa_answers WHERE question_id = $1',
      [questionId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE governor_qa_answers
         SET answer_text = $1, answer_date = NOW(), is_published = $2
         WHERE question_id = $3`,
        [answerText, publish || true, questionId]
      );
    } else {
      await pool.query(
        `INSERT INTO governor_qa_answers (question_id, answer_text, answered_by, answered_by_title, is_published)
         VALUES ($1, $2, $3, $4, $5)`,
        [questionId, answerText, answeredBy, answeredByTitle, publish || true]
      );
    }

    await pool.query(
      `UPDATE governor_qa_questions SET status = $1 WHERE id = $2`,
      [publish ? 'published' : 'answered', questionId]
    );

    return NextResponse.json({ success: true, message: 'تم حفظ الإجابة' });
  } catch (error) {
    console.error('Save answer error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حفظ الإجابة' },
      { status: 500 }
    );
  }
}