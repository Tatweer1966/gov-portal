export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const governorate = searchParams.get('governorate') || 'Ø§Ù„Ø¬ÙŠØ²Ø©';
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = `
    SELECT l.*, c.name_ar as category_name, u.username as seller_name
    FROM public.marketplace_listings l
    LEFT JOIN public.marketplace_categories c ON l.category_id = c.id
    LEFT JOIN public.users u ON l.user_id = u.id
    WHERE l.status = 'active' AND l.governorate = $1
  `;
  const params: any[] = [governorate];
  let idx = 2;

  if (category && category !== 'all') {
    query += ` AND l.category_id = $${idx++}`;
    params.push(category);
  }
  query += ` ORDER BY l.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
  params.push(limit, offset);

  try {
        await pool.query("SET client_encoding = 'UTF8';");
    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Marketplace listings error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†Ø§Øª' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
        await pool.query("SET client_encoding = 'UTF8';");
    const formData = await request.formData();
    const listingNumber = `LST-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const files = formData.getAll('images') as File[];
    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'marketplace');
    await mkdir(uploadDir, { recursive: true });
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      uploadedUrls.push(`/uploads/marketplace/${safeName}`);
    }

    const body = JSON.parse(formData.get('data') as string);
    const query = `
      INSERT INTO public.marketplace_listings (listing_number, user_id, category_id, title_ar, description_ar, price, price_negotiable, condition, images, location, governorate, district, contact_phone, contact_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING listing_number
    `;
    const result = await pool.query(query, [listingNumber, body.userId, body.categoryId, body.title, body.description, body.price, body.priceNegotiable, body.condition, uploadedUrls, body.location, body.governorate, body.district, body.contactPhone, body.contactEmail]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ù†Ø´Ø± Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†', listingNumber: result.rows[0].listing_number });
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ù†Ø´Ø± Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†' }, { status: 500 });
  }
}

