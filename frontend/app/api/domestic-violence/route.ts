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
    const reportNumber = `DVR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { reporterName, reporterPhone, victimName, victimAge, victimGender, incidentLocation, violenceType, description, isUrgent } = body;

    const query = `
      INSERT INTO public.domestic_violence_reports (report_number, reporter_name, reporter_phone, victim_name, victim_age, victim_gender, incident_location, violence_type, description, is_urgent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING report_number
    `;
    const result = await pool.query(query, [reportNumber, reporterName, reporterPhone, victimName, victimAge, victimGender, incidentLocation, violenceType, description, isUrgent]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø¨Ù„Ø§Øº', reportNumber: result.rows[0].report_number });
  } catch (error) {
    console.error('Domestic violence error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¨Ù„Ø§Øº' }, { status: 500 });
  }
}

