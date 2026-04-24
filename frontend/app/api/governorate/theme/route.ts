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

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug') || 'giza';
  try {
    const result = await pool.query(`
      SELECT primary_color, secondary_color, logo_url, footer_text_ar
      FROM public.governorate_themes
      WHERE governorate_slug = $1
    `, [slug]);
    if (result.rows.length === 0) {
      return NextResponse.json({ primary_color: '#0066CC', secondary_color: '#003366' });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Theme error:', error);
    return NextResponse.json({ primary_color: '#0066CC', secondary_color: '#003366' });
  }
}

