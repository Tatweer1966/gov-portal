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
    const { fullName, email, phone, subject, description, governorate } = body;
    const complaintId = `CMP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO public.complaints (complaint_id, full_name, email, phone, subject, description, governorate)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING complaint_id
    `;
    const result = await pool.query(query, [complaintId, fullName, email, phone, subject, description, governorate || 'giza']);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø´ÙƒÙˆØ§Ùƒ Ø¨Ù†Ø¬Ø§Ø­', complaintId: result.rows[0].complaint_id });
  } catch (error) {
    console.error('Complaint submission error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø´ÙƒÙˆÙ‰' }, { status: 500 });
  }
}

