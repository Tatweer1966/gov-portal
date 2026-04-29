export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getTenant } from '@/lib/tenant';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'gov-portal-db',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function POST(request: NextRequest) {
  try {
    // 1. Tenant detection
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    await pool.query(`SET search_path TO ${tenant.schema}, public`);
    await pool.query("SET client_encoding = 'UTF8';");

    // 2. Parse request body
    const body = await request.json();
    const {
      eventId,
      citizenName,
      citizenPhone,
      citizenEmail,
      suggestionText,
      suggestionType,
    } = body;

    // Validate required fields
    if (!eventId || !citizenName || !citizenPhone || !suggestionText) {
      return NextResponse.json(
        { success: false, error: 'معرف الفعالية، اسم المواطن، رقم الهاتف، ونص الاقتراح كلها مطلوبة' },
        { status: 400 }
      );
    }

    // Generate unique suggestion number
    const suggestionNumber = `SUG-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO event_suggestions (
        suggestion_number, event_id, citizen_name, citizen_phone,
        citizen_email, suggestion_text, suggestion_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING suggestion_number
    `;
    const values = [
      suggestionNumber,
      eventId,
      citizenName,
      citizenPhone,
      citizenEmail || null,
      suggestionText,
      suggestionType || null,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'تم استلام اقتراحك',
      suggestionNumber: result.rows[0].suggestion_number,
    });
  } catch (error) {
    console.error('Suggestion error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إرسال الاقتراح' },
      { status: 500 }
    );
  }
}