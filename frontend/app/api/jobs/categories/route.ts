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
        await pool.query("SET client_encoding = 'UTF8';");
    const result = await pool.query(`
      SELECT id, name_ar, name_en, icon FROM public.job_categories WHERE is_active = true
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Job categories error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„ÙØ¦Ø§Øª' }, { status: 500 });
  }
}

