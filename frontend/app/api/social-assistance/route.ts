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
    const { programType, fullName, nationalId, phone, email, governorate, district, description, urgencyLevel, userId } = body;
    const requestNumber = `SAR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO public.social_assistance_requests (request_number, program_type, user_id, full_name, national_id, phone, email, governorate, district, description, urgency_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, programType, userId, fullName, nationalId, phone, email, governorate, district, description, urgencyLevel]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø©', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Social assistance error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}

