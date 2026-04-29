export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTenant } from '@/lib/tenant';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const host = req.headers.get('host') || '';
    const tenant = getTenant(host);
    const body = await req.json();
    const { citizenName, citizenPhone, citizenEmail, ticketCount, paymentMethod } = body;
    const eventId = parseInt(params.id);

    if (!citizenName || !citizenPhone || !ticketCount || !paymentMethod) {
      return NextResponse.json({ success: false, error: 'بيانات ناقصة' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      await client.query("SET client_encoding = 'UTF8';");

      // Get event price
      const eventRes = await client.query(`SELECT price FROM governorate_events WHERE id = $1`, [eventId]);
      if (eventRes.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'الفعالية غير موجودة' }, { status: 404 });
      }
      const price = parseFloat(eventRes.rows[0].price) || 0;
      const totalPrice = price * ticketCount;

      // Simulate payment (always successful for now)
      // In real life, you would call a payment gateway here.
      const paymentSuccess = true;
      const paymentStatus = paymentSuccess ? 'completed' : 'failed';

      const regNumber = `REG-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      await client.query(`
        INSERT INTO event_registrations (
          registration_number, event_id, citizen_name, citizen_phone, citizen_email,
          ticket_count, total_price, payment_status, payment_method
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [regNumber, eventId, citizenName, citizenPhone, citizenEmail || null, ticketCount, totalPrice, paymentStatus, paymentMethod]);

      return NextResponse.json({
        success: true,
        message: 'تم التسجيل بنجاح',
        registrationNumber: regNumber,
        totalPrice,
        paymentStatus
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Event registration error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}