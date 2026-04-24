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
    const { requestType, description, preferredDate, preferredTime, userId } = body;
    const requestNumber = `FCR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO public.family_counseling_requests (request_number, user_id, request_type, description, preferred_date, preferred_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, userId, requestType, description, preferredDate, preferredTime]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø©', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Family counseling error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}

