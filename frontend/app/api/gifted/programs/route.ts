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
      SELECT p.*, c.name_ar as category_name
      FROM public.gifted_programs p
      LEFT JOIN public.talent_categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.program_code
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Gifted programs error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø¨Ø±Ø§Ù…Ø¬' }, { status: 500 });
  }
}

