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
    const suggestionNumber = `SUG-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { eventId, citizenName, citizenPhone, citizenEmail, suggestionText, suggestionType } = body;

    const query = `
      INSERT INTO public.event_suggestions (suggestion_number, event_id, citizen_name, citizen_phone, citizen_email, suggestion_text, suggestion_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING suggestion_number
    `;
    const result = await pool.query(query, [suggestionNumber, eventId, citizenName, citizenPhone, citizenEmail, suggestionText, suggestionType]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø§Ù‚ØªØ±Ø§Ø­Ùƒ', suggestionNumber: result.rows[0].suggestion_number });
  } catch (error) {
    console.error('Suggestion error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø§Ù‚ØªØ±Ø§Ø­' }, { status: 500 });
  }
}

