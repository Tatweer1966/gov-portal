export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'postgres',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function POST(req: NextRequest) {
  try {
        await pool.query("SET client_encoding = 'UTF8';");
    const body = await req.json();
    const { centerId, serviceId, citizenName, citizenNationalId, citizenPhone, citizenEmail, bookingDate, bookingTime, notes, userId } = body;
    const bookingNumber = `BK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const query = `
      INSERT INTO service_bookings (booking_number, user_id, center_id, service_id,
        citizen_name, citizen_national_id, citizen_phone, citizen_email,
        booking_date, booking_time, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING booking_number
    `;
    const result = await pool.query(query, [bookingNumber, userId, centerId, serviceId,
      citizenName, citizenNationalId, citizenPhone, citizenEmail, bookingDate, bookingTime, notes]);
    return NextResponse.json({ success: true, message: 'تم الحجز بنجاح', bookingNumber: result.rows[0].booking_number });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'فشل في الحجز' }, { status: 500 });
  }
}
