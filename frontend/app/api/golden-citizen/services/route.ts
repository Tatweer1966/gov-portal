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
  const searchParams = request.nextUrl.searchParams;
  const volunteerId = searchParams.get('volunteerId');
  if (!volunteerId) {
    return NextResponse.json({ success: false, error: 'volunteerId Ù…Ø·Ù„ÙˆØ¨' }, { status: 400 });
  }
  try {
    const result = await pool.query(`
      SELECT * FROM public.golden_citizen_services WHERE volunteer_id = $1 AND is_active = true
    `, [volunteerId]);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Volunteer services error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø®Ø¯Ù…Ø§Øª' }, { status: 500 });
  }
}

