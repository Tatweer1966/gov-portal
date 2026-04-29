export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTenant } from '@/lib/tenant';

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'معرف المستخدم مطلوب' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      await client.query("SET client_encoding = 'UTF8';");
      const result = await client.query(`
        SELECT id, document_number, title_ar, file_url as file_path, file_size, uploaded_at as created_at
        FROM user_documents
        WHERE user_id = $1
        ORDER BY uploaded_at DESC
      `, [parseInt(userId)]);
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Vault documents error:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب المستندات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);
    const formData = await request.formData();
    const userId = formData.get('userId');
    const title = formData.get('title');
    const file = formData.get('file') as File;

    if (!userId || !title || !file) {
      return NextResponse.json({ success: false, error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    // Generate document number
    const documentNumber = `DOC-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    // Generate a safe file name
    const ext = file.name.split('.').pop();
    const safeName = `${documentNumber}.${ext}`;
    const uploadDir = `/app/public/uploads/documents`;
    // Ensure directory exists (you might need to create it beforehand)
    // For container, you can rely on volume mount or create on the fly
    const fileUrl = `/uploads/documents/${safeName}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Write file to the container's public folder
    const fs = require('fs');
    const path = require('path');
    const fullPath = path.join(process.cwd(), 'public', 'uploads', 'documents');
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
    fs.writeFileSync(path.join(fullPath, safeName), fileBuffer);

    const client = await pool.connect();
    try {
      await client.query(`SET search_path TO ${tenant.schema}, public`);
      await client.query("SET client_encoding = 'UTF8';");
      await client.query(`
        INSERT INTO user_documents (document_number, user_id, title_ar, file_url, file_size)
        VALUES ($1, $2, $3, $4, $5)
      `, [documentNumber, parseInt(userId as string), title, fileUrl, file.size]);
      return NextResponse.json({ success: true, message: 'تم رفع المستند', documentNumber });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Vault upload error:', error);
    return NextResponse.json({ success: false, error: 'فشل في رفع المستند' }, { status: 500 });
  }
}