// app/api/tenant/theme/route.ts
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
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);

    // tenant_settings is in public schema (shared)
    const result = await pool.query(
      `SELECT 
         primary_color, secondary_color, logo_url, footer_text, 
         nav_links, homepage_sections,
         contact_phone, contact_email, address
       FROM tenant_settings
       WHERE tenant_name = $1`,
      [tenant.name]
    );

    if (result.rows.length === 0) {
      // Fallback defaults
      return NextResponse.json({
        primaryColor: '#1e3a8a',
        logoUrl: '/logo.png',
        footerText: 'جميع الحقوق محفوظة',
        navLinks: [{ href: '/', label: 'الرئيسية' }],
        homepageSections: [],
        contactPhone: '02-12345678',
        contactEmail: 'info@giza.gov.eg',
        address: 'ديوان عام المحافظة',
        tenantName: tenant.name,
      });
    }

    const row = result.rows[0];
    return NextResponse.json({
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color,
      logoUrl: row.logo_url,
      footerText: row.footer_text,
      navLinks: row.nav_links,
      homepageSections: row.homepage_sections,
      contactPhone: row.contact_phone,
      contactEmail: row.contact_email,
      address: row.address,
      tenantName: tenant.name,
    });
  } catch (error) {
    console.error('Theme fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}