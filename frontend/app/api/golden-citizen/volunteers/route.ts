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

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT v.*, json_agg(jsonb_build_object('id', s.id, 'service_name_ar', s.service_name_ar)) as services
      FROM public.golden_citizen_volunteers v
      LEFT JOIN public.golden_citizen_services s ON v.id = s.volunteer_id
      WHERE v.status = 'approved' AND v.verified = true
      GROUP BY v.id
      ORDER BY v.rating DESC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Volunteers fetch error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ù…ØªØ·ÙˆØ¹ÙŠÙ†' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const volunteerCode = `VOL-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { fullName, nationalId, phone, email, profession, specialization, bio, availableDays, availableHours, location, governorate, district } = body;

    const query = `
      INSERT INTO public.golden_citizen_volunteers (volunteer_code, full_name, national_id, phone, email, profession, specialization, bio, available_days, available_hours, location, governorate, district)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING volunteer_code
    `;
    const result = await pool.query(query, [volunteerCode, fullName, nationalId, phone, email, profession, specialization, bio, availableDays, availableHours, location, governorate, district]);

    return NextResponse.json({ success: true, message: 'ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø·Ù„Ø¨ Ø§Ù„ØªØ·ÙˆØ¹', volunteerCode: result.rows[0].volunteer_code });
  } catch (error) {
    console.error('Volunteer registration error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø§Ù„ØªØ³Ø¬ÙŠÙ„' }, { status: 500 });
  }
}

