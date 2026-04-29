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
        await pool.query("SET client_encoding = 'UTF8';");
    const body = await request.json();
    const requestNumber = `INS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { headOfFamilyName, headOfFamilyNationalId, headOfFamilyPhone, headOfFamilyEmail, governorate, district, address, familyMembers, userId } = body;

    const query = `
      INSERT INTO public.comprehensive_health_insurance_requests (request_number, user_id, head_of_family_name, head_of_family_national_id, head_of_family_phone, head_of_family_email, governorate, district, address, family_members)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, userId, headOfFamilyName, headOfFamilyNationalId, headOfFamilyPhone, headOfFamilyEmail, governorate, district, address, JSON.stringify(familyMembers)]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„ØªØ³Ø¬ÙŠÙ„', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Insurance registration error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const nationalId = searchParams.get('nationalId');
  const insuranceNumber = searchParams.get('insuranceNumber');
  if (!nationalId && !insuranceNumber) {
    return NextResponse.json({ success: false, error: 'Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ Ø£Ùˆ Ø±Ù‚Ù… Ø§Ù„ØªØ£Ù…ÙŠÙ† Ù…Ø·Ù„ÙˆØ¨' }, { status: 400 });
  }
  try {
        await pool.query("SET client_encoding = 'UTF8';");
    let query = `
      SELECT r.*, c.card_serial_number, c.expiry_date
      FROM public.comprehensive_health_insurance_requests r
      LEFT JOIN public.health_insurance_cards c ON r.id = c.request_id
      WHERE 
    `;
    let param: string;
    if (nationalId) {
      query += ` r.head_of_family_national_id = $1`;
      param = nationalId;
    } else {
      query += ` r.insurance_number = $1`;
      param = insuranceNumber!;
    }
    const result = await pool.query(query, [param]);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª ØªØ£Ù…ÙŠÙ†ÙŠØ©' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Insurance inquiry error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø§Ù„Ø§Ø³ØªØ¹Ù„Ø§Ù…' }, { status: 500 });
  }
}

