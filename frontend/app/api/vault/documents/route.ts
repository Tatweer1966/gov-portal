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
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ success: false, error: 'userId Ù…Ø·Ù„ÙˆØ¨' }, { status: 400 });
  }
  try {
    const result = await pool.query(`
      SELECT d.*, c.name_ar as category_name
      FROM public.user_documents d
      JOIN public.document_categories c ON d.category_id = c.id
      WHERE d.user_id = $1
      ORDER BY d.created_at DESC
    `, [userId]);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Vault fetch error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ù…Ø³ØªÙ†Ø¯Ø§Øª' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const documentNumber = `DOC-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const categoryId = formData.get('categoryId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'vault');
    await mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeName);
    await writeFile(filePath, buffer);

    const query = `
      INSERT INTO public.user_documents (document_number, user_id, category_id, title_ar, description, file_path, file_type, file_size)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING document_number
    `;
    const result = await pool.query(query, [documentNumber, userId, categoryId, title, description, `/uploads/vault/${safeName}`, file.type, file.size]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø±ÙØ¹ Ø§Ù„Ù…Ø³ØªÙ†Ø¯', documentNumber: result.rows[0].document_number });
  } catch (error) {
    console.error('Vault upload error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø±ÙØ¹ Ø§Ù„Ù…Ø³ØªÙ†Ø¯' }, { status: 500 });
  }
}

