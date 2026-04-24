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
    const requestNumber = `GR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { volunteerId, serviceId, citizenName, citizenNationalId, citizenPhone, citizenEmail, citizenAddress, governorate, district, notes, userId } = body;

    const query = `
      INSERT INTO public.golden_citizen_requests (request_number, user_id, volunteer_id, service_id, citizen_name, citizen_national_id, citizen_phone, citizen_email, citizen_address, governorate, district, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, userId, volunteerId, serviceId, citizenName, citizenNationalId, citizenPhone, citizenEmail, citizenAddress, governorate, district, notes]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„Ø®Ø¯Ù…Ø©', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Golden request error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}

