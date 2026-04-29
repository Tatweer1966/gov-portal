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

export async function GET(request: NextRequest) {
  try {
        await pool.query("SET client_encoding = 'UTF8';");
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    // tenant_settings is in public schema (shared)
    const result = await pool.query(
      `SELECT primary_color, secondary_color, logo_url, footer_text
       FROM tenant_settings
       WHERE tenant_name = $1`,
      [tenant.name]
    );

    if (result.rows.length === 0) {
      // Fallback to default theme
      return NextResponse.json({
        primary_color: '#0066CC',
        secondary_color: '#003366',
        logo_url: '/logo.png',
        footer_text: 'جميع الحقوق محفوظة',
      });
    }

    const row = result.rows[0];
    return NextResponse.json({
      primary_color: row.primary_color,
      secondary_color: row.secondary_color,
      logo_url: row.logo_url,
      footer_text: row.footer_text,
    });
  } catch (error) {
    console.error('Theme fetch error:', error);
    return NextResponse.json(
      { error: 'فشل في جلب إعدادات المظهر' },
      { status: 500 }
    );
  }
}