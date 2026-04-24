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
      SELECT id, title_ar, content_ar, 'page' as type, created_by
      FROM gov_giza.pages
      WHERE status = 'pending_review'
      UNION ALL
      SELECT id, title_ar, content_ar, 'news' as type, created_by
      FROM public.governorate_news
      WHERE status = 'pending_review'
      LIMIT 50
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Pending content error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ù…Ù†ØªØ¸Ø±' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, action, type } = await request.json();
    const table = type === 'page' ? 'gov_giza.pages' : 'public.governorate_news';
    const newStatus = action === 'approve' ? 'published' : 'draft';
    await pool.query(`UPDATE ${table} SET status = $1 WHERE id = $2`, [newStatus, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Content action error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø­Ø§Ù„Ø©' }, { status: 500 });
  }
}

