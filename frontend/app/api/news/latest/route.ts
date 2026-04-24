export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
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
      SELECT id, news_number, title_ar, summary_ar, category, priority, published_at
      FROM public.governorate_news
      WHERE status = 'published' AND published_at >= NOW() - INTERVAL '48 hours'
      ORDER BY priority DESC, published_at DESC
      LIMIT 20
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Latest news error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø£Ø®Ø¨Ø§Ø±' }, { status: 500 });
  }
}

