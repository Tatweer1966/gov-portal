export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://directus:8055';

/**
 * Multi‑tenant file upload to Directus.
 * Adds the tenant name as a custom field (if the Directus files collection has a 'tenant' column).
 * If your Directus does not support tenant tagging, remove the appended field.
 */

export async function POST(request: NextRequest) {
  try {
    // 1. Detect tenant from the Host header
    const host = request.headers.get('host') || '';
    const tenant = getTenant(host);

    // 2. Read the incoming multipart form data
    const formData = await request.formData();

    // 3. (Optional) Inject tenant field into the file metadata
    //    Assumes the Directus 'directus_files' collection has a 'tenant' text field.
    //    If not, you can comment out this block.
    if (!formData.has('tenant')) {
      formData.append('tenant', tenant.name);
    }

    // 4. Forward the upload to Directus
    const response = await fetch(`${DIRECTUS_URL}/files`, {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type header – fetch will set the correct multipart boundary automatically
    });

    // 5. Parse Directus response
    const data = await response.json();
    if (!response.ok) {
      console.error('Directus upload error:', data);
      const errorMessage = data.message || 'فشل في رفع الملف';
      return NextResponse.json({ success: false, error: errorMessage }, { status: response.status });
    }

    // 6. Return success with file ID
    return NextResponse.json({
      success: true,
      fileId: data.data.id,
      tenant: tenant.name, // optional debugging info
    });
  } catch (error: any) {
    console.error('Directus upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ في رفع الملف' },
      { status: 500 }
    );
  }
}