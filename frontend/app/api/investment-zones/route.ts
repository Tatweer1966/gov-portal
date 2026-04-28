export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'gov-portal-db',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    await pool.query(`SET search_path TO ${tenant.schema}, public`);

    // Query investment zones from tenant-specific table
    const result = await pool.query(`
      SELECT name_ar, lat, lng, land_area_ar, incentives_ar
      FROM investment_zones
      WHERE is_active = true
      ORDER BY display_order
    `);

    const zones = result.rows.map(row => ({
      name: row.name_ar,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      land: row.land_area_ar,
      incentives: row.incentives_ar,
    }));

    // If no zones in database, return default for the tenant (optional)
    if (zones.length === 0) {
      // Hardcoded fallback per tenant (could be moved to database seeding)
      const fallbackZones: Record<string, any[]> = {
        giza: [
          { name: 'منطقة 6 أكتوبر الصناعية', lat: 29.9375, lng: 30.9297, land: '500 فدان', incentives: 'إعفاء ضريبي 50% لمدة 5 سنوات' },
          { name: 'منطقة العبور الصناعية', lat: 30.1267, lng: 31.4365, land: '300 فدان', incentives: 'تسهيلات ائتمانية' },
          { name: 'منطقة بدر الزراعية', lat: 30.1378, lng: 31.7167, land: '1000 فدان', incentives: 'دعم تقني وأسمدة مدعومة' },
        ],
        alexandria: [
          { name: 'برج العرب الصناعية', lat: 30.9536, lng: 29.5761, land: '1500 فدان', incentives: 'إعفاء ضريبي 30% لمدة 3 سنوات' },
          { name: 'منطقة العامرية', lat: 31.0760, lng: 29.8895, land: '800 فدان', incentives: 'تخصيص أراضٍ بأسعار مخفضة' },
        ],
      };
      return NextResponse.json({ success: true, data: fallbackZones[tenant.name] || [] });
    }

    return NextResponse.json({ success: true, data: zones });
  } catch (error) {
    console.error('Investment zones error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب المناطق الاستثمارية' }, { status: 500 });
  }
}