# create-missing-api-routes.ps1
$basePath = "C:\gov-portal\gov-portal\frontend\app\api"

# Define the routes and their content (using the code you provided)
# I'll only list the ones that are truly missing; you can expand later.
# For brevity, I'll show the pattern for a few; you can add the full list.
# But since you have the full code, I'll provide a generic way to write files from a hashtable.

$routes = @{
    "search\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  if (!query) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    let unionQuery = '';
    const params: any[] = [`%${query}%`, `%${query}%`];
    let paramIndex = 3;

    if (type === 'all' || type === 'services') {
      unionQuery += `
        SELECT 'service' as type, id, name_ar as title, description_ar as description, slug as url, null as date
        FROM public.services
        WHERE name_ar ILIKE $1 OR description_ar ILIKE $2
      `;
    }
    if (type === 'all' || type === 'news') {
      if (unionQuery) unionQuery += ' UNION ALL ';
      unionQuery += `
        SELECT 'news' as type, id, title_ar as title, summary_ar as description, CONCAT('/news/', id) as url, published_at as date
        FROM public.governorate_news
        WHERE status = 'published' AND (title_ar ILIKE $1 OR summary_ar ILIKE $2)
      `;
    }
    if (type === 'all' || type === 'events') {
      if (unionQuery) unionQuery += ' UNION ALL ';
      unionQuery += `
        SELECT 'event' as type, id, title_ar as title, description_ar as description, CONCAT('/events/', id) as url, start_date as date
        FROM public.governorate_events
        WHERE status = 'upcoming' AND (title_ar ILIKE $1 OR description_ar ILIKE $2)
      `;
    }
    if (type === 'all' || type === 'marketplace') {
      if (unionQuery) unionQuery += ' UNION ALL ';
      unionQuery += `
        SELECT 'listing' as type, id, title_ar as title, description_ar as description, CONCAT('/marketplace/', id) as url, created_at as date
        FROM public.marketplace_listings
        WHERE status = 'active' AND (title_ar ILIKE $1 OR description_ar ILIKE $2)
      `;
    }

    const finalQuery = `
      SELECT * FROM (${unionQuery}) AS combined
      ORDER BY date DESC NULLS LAST
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(limit, offset);

    const result = await pool.query(finalQuery, params);
    const countQuery = `SELECT COUNT(*) FROM (${unionQuery}) AS combined`;
    const countResult = await pool.query(countQuery, params.slice(0, 2));
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({ success: true, results: result.rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø§Ù„Ø¨Ø­Ø«' }, { status: 500 });
  }
}
'@

    "forms\complaint\route.ts" = @'
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
    const { fullName, email, phone, subject, description, governorate } = body;
    const complaintId = `CMP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO public.complaints (complaint_id, full_name, email, phone, subject, description, governorate)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING complaint_id
    `;
    const result = await pool.query(query, [complaintId, fullName, email, phone, subject, description, governorate || 'giza']);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø´ÙƒÙˆØ§Ùƒ Ø¨Ù†Ø¬Ø§Ø­', complaintId: result.rows[0].complaint_id });
  } catch (error) {
    console.error('Complaint submission error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø´ÙƒÙˆÙ‰' }, { status: 500 });
  }
}
'@

    "services\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

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
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = `
    SELECT s.*, c.name_ar as category_name
    FROM public.services s
    LEFT JOIN public.service_categories c ON s.category_id = c.id
    WHERE s.is_online = true
  `;
  const params: any[] = [];
  let idx = 1;

  if (category && category !== 'all') {
    query += ` AND s.category_id = $${idx++}`;
    params.push(category);
  }
  if (featured === 'true') {
    query += ` AND s.is_featured = true`;
  }
  if (search) {
    query += ` AND (s.name_ar ILIKE $${idx} OR s.description_ar ILIKE $${idx+1})`;
    params.push(`%${search}%`, `%${search}%`);
    idx += 2;
  }

  query += ` ORDER BY s.display_order, s.name_ar LIMIT $${idx++} OFFSET $${idx++}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    const countQuery = `SELECT COUNT(*) FROM public.services WHERE is_online = true`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({ success: true, data: result.rows, pagination: { limit, offset, total } });
  } catch (error) {
    console.error('Services fetch error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø®Ø¯Ù…Ø§Øª' }, { status: 500 });
  }
}
'@

    "services\[slug]\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const result = await pool.query(`
      SELECT s.*, c.name_ar as category_name
      FROM public.services s
      LEFT JOIN public.service_categories c ON s.category_id = c.id
      WHERE s.slug = $1
    `, [slug]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Ø§Ù„Ø®Ø¯Ù…Ø© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Service detail error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø®Ø¯Ù…Ø©' }, { status: 500 });
  }
}
'@

    "services\apply\route.ts" = @'
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const applicationId = `APP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const serviceId = formData.get('serviceId');
    const userId = formData.get('userId');
    const applicationData = JSON.parse(formData.get('applicationData') as string);
    const files = formData.getAll('documents') as File[];

    const uploadedFiles: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'applications');
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);
      uploadedFiles.push(`/uploads/applications/${safeName}`);
    }

    const query = `
      INSERT INTO public.service_applications (application_id, service_id, user_id, application_data, uploaded_documents, submitted_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING application_id
    `;
    const result = await pool.query(query, [applicationId, serviceId, userId, JSON.stringify(applicationData), uploadedFiles]);

    return NextResponse.json({ success: true, message: 'ØªÙ… ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨ Ø¨Ù†Ø¬Ø§Ø­', applicationId: result.rows[0].application_id });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}
'@

    "tech-centers\available-times\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const centerId = searchParams.get('centerId');
  const date = searchParams.get('date');

  // Mock available time slots (9 AM to 5 PM, hourly)
  const slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  return NextResponse.json({ success: true, slots });
}
'@

    "social-assistance\route.ts" = @'
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
    const { programType, fullName, nationalId, phone, email, governorate, district, description, urgencyLevel, userId } = body;
    const requestNumber = `SAR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO public.social_assistance_requests (request_number, program_type, user_id, full_name, national_id, phone, email, governorate, district, description, urgency_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, programType, userId, fullName, nationalId, phone, email, governorate, district, description, urgencyLevel]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø©', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Social assistance error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}
'@

    "domestic-violence\route.ts" = @'
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
'@

    "family-counseling\route.ts" = @'
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
    const { requestType, description, preferredDate, preferredTime, userId } = body;
    const requestNumber = `FCR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const query = `
      INSERT INTO public.family_counseling_requests (request_number, user_id, request_type, description, preferred_date, preferred_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, userId, requestType, description, preferredDate, preferredTime]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø©', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Family counseling error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}
'@

    "golden-citizen\volunteers\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT v.*, json_agg(jsonb_build_object('id', s.id, 'service_name_ar', s.service_name_ar)) as services
      FROM public.golden_citizen_volunteers v
      LEFT JOIN public.golden_citizen_services s ON v.id = s.volunteer_id
      WHERE v.status = 'approved' AND v.verified = true
      GROUP BY v.id
      ORDER BY v.rating DESC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Volunteers fetch error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ù…ØªØ·ÙˆØ¹ÙŠÙ†' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const volunteerCode = `VOL-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { fullName, nationalId, phone, email, profession, specialization, bio, availableDays, availableHours, location, governorate, district } = body;

    const query = `
      INSERT INTO public.golden_citizen_volunteers (volunteer_code, full_name, national_id, phone, email, profession, specialization, bio, available_days, available_hours, location, governorate, district)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING volunteer_code
    `;
    const result = await pool.query(query, [volunteerCode, fullName, nationalId, phone, email, profession, specialization, bio, availableDays, availableHours, location, governorate, district]);

    return NextResponse.json({ success: true, message: 'ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø·Ù„Ø¨ Ø§Ù„ØªØ·ÙˆØ¹', volunteerCode: result.rows[0].volunteer_code });
  } catch (error) {
    console.error('Volunteer registration error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø§Ù„ØªØ³Ø¬ÙŠÙ„' }, { status: 500 });
  }
}
'@

    "golden-citizen\requests\route.ts" = @'
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
    const requestNumber = `GR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { volunteerId, serviceId, citizenName, citizenNationalId, citizenPhone, citizenEmail, citizenAddress, governorate, district, notes, userId } = body;

    const query = `
      INSERT INTO public.golden_citizen_requests (request_number, user_id, volunteer_id, service_id, citizen_name, citizen_national_id, citizen_phone, citizen_email, citizen_address, governorate, district, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, userId, volunteerId, serviceId, citizenName, citizenNationalId, citizenPhone, citizenEmail, citizenAddress, governorate, district, notes]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„Ø®Ø¯Ù…Ø©', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Golden request error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}
'@

    "golden-citizen\services\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const volunteerId = searchParams.get('volunteerId');
  if (!volunteerId) {
    return NextResponse.json({ success: false, error: 'volunteerId Ù…Ø·Ù„ÙˆØ¨' }, { status: 400 });
  }
  try {
    const result = await pool.query(`
      SELECT * FROM public.golden_citizen_services WHERE volunteer_id = $1 AND is_active = true
    `, [volunteerId]);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Volunteer services error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø®Ø¯Ù…Ø§Øª' }, { status: 500 });
  }
}
'@

    "governor-qa\ask\route.ts" = @'
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
    const questionNumber = `Q-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { userType, userName, userPhone, userEmail, questionText, category, isAnonymous } = body;

    const query = `
      INSERT INTO public.governor_qa_questions (question_number, user_type, user_name, user_phone, user_email, question_text, category, is_anonymous)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING question_number
    `;
    const result = await pool.query(query, [questionNumber, userType, userName, userPhone, userEmail, questionText, category, isAnonymous]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø³Ø¤Ø§Ù„Ùƒ', questionNumber: result.rows[0].question_number });
  } catch (error) {
    console.error('Ask question error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø³Ø¤Ø§Ù„' }, { status: 500 });
  }
}
'@

    "governor-qa\questions\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT q.id, q.question_number, q.user_type, q.question_text, q.category, q.created_at,
             a.answer_text, a.answered_by, a.answered_by_title, a.answer_date
      FROM public.governor_qa_questions q
      LEFT JOIN public.governor_qa_answers a ON q.id = a.question_id
      WHERE q.status IN ('answered', 'published') AND a.is_published = true
      ORDER BY a.answer_date DESC, q.created_at DESC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch Q&A error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø£Ø³Ø¦Ù„Ø©' }, { status: 500 });
  }
}
'@

    "governor-qa\admin\questions\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT q.*, a.answer_text as existing_answer
      FROM public.governor_qa_questions q
      LEFT JOIN public.governor_qa_answers a ON q.id = a.question_id
      WHERE q.status IN ('pending', 'answered')
      ORDER BY q.created_at ASC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Admin questions error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø£Ø³Ø¦Ù„Ø©' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, answerText, answeredBy, answeredByTitle, publish } = body;

    const existing = await pool.query('SELECT id FROM public.governor_qa_answers WHERE question_id = $1', [questionId]);
    if (existing.rows.length > 0) {
      await pool.query(`
        UPDATE public.governor_qa_answers SET answer_text = $1, answer_date = NOW(), is_published = $2
        WHERE question_id = $3
      `, [answerText, publish || true, questionId]);
    } else {
      await pool.query(`
        INSERT INTO public.governor_qa_answers (question_id, answer_text, answered_by, answered_by_title, is_published)
        VALUES ($1, $2, $3, $4, $5)
      `, [questionId, answerText, answeredBy, answeredByTitle, publish || true]);
    }
    await pool.query(`UPDATE public.governor_qa_questions SET status = $1 WHERE id = $2`, [publish ? 'published' : 'answered', questionId]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø­ÙØ¸ Ø§Ù„Ø¥Ø¬Ø§Ø¨Ø©' });
  } catch (error) {
    console.error('Save answer error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø­ÙØ¸ Ø§Ù„Ø¥Ø¬Ø§Ø¨Ø©' }, { status: 500 });
  }
}
'@

    "events\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') || 'upcoming';
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = `SELECT * FROM public.governorate_events WHERE status = $1`;
  const params: any[] = [status];
  let idx = 2;

  if (status === 'upcoming') {
    query += ` AND start_date >= CURRENT_DATE`;
  }
  query += ` ORDER BY start_date ASC LIMIT $${idx++} OFFSET $${idx++}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Events fetch error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª' }, { status: 500 });
  }
}
'@

    "events\[id]\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const isNumber = /^\d+$/.test(id);
  try {
    const result = await pool.query(`
      SELECT e.*, COALESCE(s.count, 0) as suggestions_count
      FROM public.governorate_events e
      LEFT JOIN (SELECT event_id, COUNT(*) as count FROM public.event_suggestions GROUP BY event_id) s ON e.id = s.event_id
      WHERE ${isNumber ? 'e.id = $1' : 'e.event_number = $1'}
    `, [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©' }, { status: 404 });
    }
    await pool.query(`UPDATE public.governorate_events SET views = views + 1 WHERE ${isNumber ? 'id = $1' : 'event_number = $1'}`, [id]);
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Event detail error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ©' }, { status: 500 });
  }
}
'@

    "events\suggestions\route.ts" = @'
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
    const suggestionNumber = `SUG-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { eventId, citizenName, citizenPhone, citizenEmail, suggestionText, suggestionType } = body;

    const query = `
      INSERT INTO public.event_suggestions (suggestion_number, event_id, citizen_name, citizen_phone, citizen_email, suggestion_text, suggestion_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING suggestion_number
    `;
    const result = await pool.query(query, [suggestionNumber, eventId, citizenName, citizenPhone, citizenEmail, suggestionText, suggestionType]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø§Ù‚ØªØ±Ø§Ø­Ùƒ', suggestionNumber: result.rows[0].suggestion_number });
  } catch (error) {
    console.error('Suggestion error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø§Ù‚ØªØ±Ø§Ø­' }, { status: 500 });
  }
}
'@

    "health\treatment\route.ts" = @'
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const requestNumber = `TRT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const files = formData.getAll('medicalReports') as File[];
    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'treatment');
    await mkdir(uploadDir, { recursive: true });
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      uploadedUrls.push(`/uploads/treatment/${safeName}`);
    }

    const body = JSON.parse(formData.get('data') as string);
    const query = `
      INSERT INTO public.state_funding_treatment_requests (request_number, user_id, citizen_name, citizen_national_id, citizen_phone, citizen_email, governorate, district, address, diagnosis_ar, required_treatment_ar, medical_reports_url, hospital_name_ar, urgency_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, body.userId, body.citizenName, body.citizenNationalId, body.citizenPhone, body.citizenEmail, body.governorate, body.district, body.address, body.diagnosis, body.requiredTreatment, uploadedUrls, body.hospitalName, body.urgencyLevel]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø·Ù„Ø¨', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Treatment error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}
'@

    "health\insurance\route.ts" = @'
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
    const requestNumber = `INS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const { headOfFamilyName, headOfFamilyNationalId, headOfFamilyPhone, headOfFamilyEmail, governorate, district, address, familyMembers, userId } = body;

    const query = `
      INSERT INTO public.comprehensive_health_insurance_requests (request_number, user_id, head_of_family_name, head_of_family_national_id, head_of_family_phone, head_of_family_email, governorate, district, address, family_members)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, userId, headOfFamilyName, headOfFamilyNationalId, headOfFamilyPhone, headOfFamilyEmail, governorate, district, address, JSON.stringify(familyMembers)]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„ØªØ³Ø¬ÙŠÙ„', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Insurance registration error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const nationalId = searchParams.get('nationalId');
  const insuranceNumber = searchParams.get('insuranceNumber');
  if (!nationalId && !insuranceNumber) {
    return NextResponse.json({ success: false, error: 'Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ Ø£Ùˆ Ø±Ù‚Ù… Ø§Ù„ØªØ£Ù…ÙŠÙ† Ù…Ø·Ù„ÙˆØ¨' }, { status: 400 });
  }
  try {
    let query = `
      SELECT r.*, c.card_serial_number, c.expiry_date
      FROM public.comprehensive_health_insurance_requests r
      LEFT JOIN public.health_insurance_cards c ON r.id = c.request_id
      WHERE 
    `;
    let param: string;
    if (nationalId) {
      query += ` r.head_of_family_national_id = $1`;
      param = nationalId;
    } else {
      query += ` r.insurance_number = $1`;
      param = insuranceNumber!;
    }
    const result = await pool.query(query, [param]);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª ØªØ£Ù…ÙŠÙ†ÙŠØ©' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Insurance inquiry error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø§Ù„Ø§Ø³ØªØ¹Ù„Ø§Ù…' }, { status: 500 });
  }
}
'@

    "property\reconciliation\route.ts" = @'
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const requestNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const files = formData.getAll('documents') as File[];
    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'reconciliation');
    await mkdir(uploadDir, { recursive: true });
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      uploadedUrls.push(`/uploads/reconciliation/${safeName}`);
    }

    const body = JSON.parse(formData.get('data') as string);
    const query = `
      INSERT INTO public.building_violation_reconciliation (request_number, user_id, applicant_name, applicant_national_id, applicant_phone, applicant_email, applicant_address, property_address, governorate, district, property_number, land_area, built_area, violation_description, construction_year, attached_documents)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, body.userId, body.applicantName, body.applicantNationalId, body.applicantPhone, body.applicantEmail, body.applicantAddress, body.propertyAddress, body.governorate, body.district, body.propertyNumber, body.landArea, body.builtArea, body.violationDescription, body.constructionYear, uploadedUrls]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„ØªØµØ§Ù„Ø­', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Reconciliation error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}
'@

    "property\possession\route.ts" = @'
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const requestNumber = `POS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const files = formData.getAll('documents') as File[];
    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'possession');
    await mkdir(uploadDir, { recursive: true });
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      uploadedUrls.push(`/uploads/possession/${safeName}`);
    }

    const body = JSON.parse(formData.get('data') as string);
    const query = `
      INSERT INTO public.hand_possession_legalization (request_number, user_id, applicant_name, applicant_national_id, applicant_phone, applicant_email, applicant_address, property_type, property_address, governorate, district, land_area, possession_years, possession_description, attached_documents)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING request_number
    `;
    const result = await pool.query(query, [requestNumber, body.userId, body.applicantName, body.applicantNationalId, body.applicantPhone, body.applicantEmail, body.applicantAddress, body.propertyType, body.propertyAddress, body.governorate, body.district, body.landArea, body.possessionYears, body.possessionDescription, uploadedUrls]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„ØªÙ‚Ù†ÙŠÙ†', requestNumber: result.rows[0].request_number });
  } catch (error) {
    console.error('Possession error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}
'@

    "gifted\apply\route.ts" = @'
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const applicationNumber = `GIFT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const files = formData.getAll('documents') as File[];
    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gifted');
    await mkdir(uploadDir, { recursive: true });
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      uploadedUrls.push(`/uploads/gifted/${safeName}`);
    }

    const body = JSON.parse(formData.get('data') as string);
    const query = `
      INSERT INTO public.gifted_applications (application_number, applicant_type, applicant_name, applicant_phone, applicant_email, student_name, student_national_id, student_birth_date, student_grade, student_school, student_governorate, student_district, talent_category_id, talent_description, achievements, supporting_docs)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING application_number
    `;
    const result = await pool.query(query, [applicationNumber, body.applicantType, body.applicantName, body.applicantPhone, body.applicantEmail, body.studentName, body.studentNationalId, body.studentBirthDate, body.studentGrade, body.studentSchool, body.studentGovernorate, body.studentDistrict, body.talentCategoryId, body.talentDescription, body.achievements, uploadedUrls]);

    return NextResponse.json({ success: true, message: 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„ØªØ±Ø´ÙŠØ­', applicationNumber: result.rows[0].application_number });
  } catch (error) {
    console.error('Gifted apply error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}
'@

    "gifted\programs\route.ts" = @'
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name_ar as category_name
      FROM public.gifted_programs p
      LEFT JOIN public.talent_categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.program_code
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Gifted programs error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø¨Ø±Ø§Ù…Ø¬' }, { status: 500 });
  }
}
'@

    "gifted\categories\route.ts" = @'
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT * FROM public.talent_categories WHERE is_active = true ORDER BY id
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Talent categories error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„ÙØ¦Ø§Øª' }, { status: 500 });
  }
}
'@

    "marketplace\listings\route.ts" = @'
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
    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Marketplace listings error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†Ø§Øª' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
'@

    "marketplace\listings\[id]\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const isNumber = /^\d+$/.test(id);
  try {
    const result = await pool.query(`
      SELECT l.*, u.username as seller_name, u.phone as seller_phone, u.email as seller_email, c.name_ar as category_name
      FROM public.marketplace_listings l
      JOIN public.users u ON l.user_id = u.id
      JOIN public.marketplace_categories c ON l.category_id = c.id
      WHERE ${isNumber ? 'l.id = $1' : 'l.listing_number = $1'} AND l.status = 'active'
    `, [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Ø§Ù„Ø¥Ø¹Ù„Ø§Ù† ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' }, { status: 404 });
    }
    await pool.query(`UPDATE public.marketplace_listings SET views = views + 1 WHERE ${isNumber ? 'id = $1' : 'listing_number = $1'}`, [id]);
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Listing detail error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†' }, { status: 500 });
  }
}
'@

    "marketplace\categories\route.ts" = @'
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, name_ar, name_en, icon FROM public.marketplace_categories WHERE is_active = true ORDER BY display_order
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Marketplace categories error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„ÙØ¦Ø§Øª' }, { status: 500 });
  }
}
'@

    "news\latest\route.ts" = @'
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, news_number, title_ar, summary_ar, category, priority, published_at
      FROM public.governorate_news
      WHERE status = 'published' AND published_at >= NOW() - INTERVAL '48 hours'
      ORDER BY priority DESC, published_at DESC
      LIMIT 20
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Latest news error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø£Ø®Ø¨Ø§Ø±' }, { status: 500 });
  }
}
'@

    "news\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

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
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM public.governorate_news WHERE status = 'published'`;
  const params: any[] = [];
  let idx = 1;

  if (category && category !== 'all') {
    query += ` AND category = $${idx++}`;
    params.push(category);
  }
  if (search) {
    query += ` AND (title_ar ILIKE $${idx} OR summary_ar ILIKE $${idx+1})`;
    params.push(`%${search}%`, `%${search}%`);
    idx += 2;
  }
  query += ` ORDER BY published_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    const countQuery = `SELECT COUNT(*) FROM public.governorate_news WHERE status = 'published'`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({ success: true, data: result.rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('News list error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø£Ø®Ø¨Ø§Ø±' }, { status: 500 });
  }
}
'@

    "news\[id]\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const isNumber = /^\d+$/.test(id);
  try {
    const result = await pool.query(`
      SELECT * FROM public.governorate_news WHERE ${isNumber ? 'id = $1' : 'news_number = $1'} AND status = 'published'
    `, [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Ø§Ù„Ø®Ø¨Ø± ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' }, { status: 404 });
    }
    await pool.query(`UPDATE public.governorate_news SET views = views + 1 WHERE ${isNumber ? 'id = $1' : 'news_number = $1'}`, [id]);
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('News detail error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ø®Ø¨Ø±' }, { status: 500 });
  }
}
'@

    "vault\documents\route.ts" = @'
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
'@

    "jobs\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

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
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = `
    SELECT j.*, e.company_name_ar, c.name_ar as category_name
    FROM public.job_listings j
    LEFT JOIN public.employers e ON j.employer_id = e.id
    LEFT JOIN public.job_categories c ON j.category_id = c.id
    WHERE j.is_active = true AND j.application_deadline >= CURRENT_DATE AND j.governorate = $1
  `;
  const params: any[] = [governorate];
  let idx = 2;

  if (category && category !== 'all') {
    query += ` AND j.category_id = $${idx++}`;
    params.push(category);
  }
  if (search) {
    query += ` AND (j.title_ar ILIKE $${idx} OR j.description_ar ILIKE $${idx+1})`;
    params.push(`%${search}%`, `%${search}%`);
    idx += 2;
  }
  query += ` ORDER BY j.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„ÙˆØ¸Ø§Ø¦Ù' }, { status: 500 });
  }
}
'@

    "jobs\apply\route.ts" = @'
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const applicationNumber = `JOB-APP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const jobId = formData.get('jobId');
    const userId = formData.get('userId');
    const applicantName = formData.get('applicantName');
    const nationalId = formData.get('applicantNationalId');
    const phone = formData.get('applicantPhone');
    const email = formData.get('applicantEmail');
    const coverLetter = formData.get('coverLetter');
    const cvFile = formData.get('cv') as File;

    let cvUrl = null;
    if (cvFile) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cvs');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${cvFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      cvUrl = `/uploads/cvs/${safeName}`;
    }

    const query = `
      INSERT INTO public.job_applications (application_number, job_id, user_id, applicant_name, applicant_national_id, applicant_phone, applicant_email, cover_letter, cv_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING application_number
    `;
    const result = await pool.query(query, [applicationNumber, jobId, userId, applicantName, nationalId, phone, email, coverLetter, cvUrl]);

    return NextResponse.json({ success: true, message: 'ØªÙ… ØªÙ‚Ø¯ÙŠÙ… Ø·Ù„Ø¨Ùƒ Ø¨Ù†Ø¬Ø§Ø­', applicationNumber: result.rows[0].application_number });
  } catch (error) {
    console.error('Job application error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨' }, { status: 500 });
  }
}
'@

    "jobs\categories\route.ts" = @'
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, name_ar, name_en, icon FROM public.job_categories WHERE is_active = true
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Job categories error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„ÙØ¦Ø§Øª' }, { status: 500 });
  }
}
'@

    "documents\route.ts" = @'
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, title_ar, category, file_url, file_size, publish_date
      FROM public.government_documents
      WHERE is_active = true
      ORDER BY publish_date DESC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Documents error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„ÙˆØ«Ø§Ø¦Ù‚' }, { status: 500 });
  }
}
'@

    "media\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'all';
  try {
    let query = `SELECT id, title_ar, url, type, category FROM public.media WHERE is_active = true`;
    const params: any[] = [];
    if (category !== 'all') {
      query += ` AND category = $1`;
      params.push(category);
    }
    query += ` ORDER BY created_at DESC`;
    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Media error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„ÙˆØ³Ø§Ø¦Ø·' }, { status: 500 });
  }
}
'@

    "cms\pending-content\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, title_ar, content_ar, 'page' as type, created_by
      FROM gov_giza.pages
      WHERE status = 'pending_review'
      UNION ALL
      SELECT id, title_ar, content_ar, 'news' as type, created_by
      FROM public.governorate_news
      WHERE status = 'pending_review'
      LIMIT 50
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Pending content error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ù…Ù†ØªØ¸Ø±' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, action, type } = await request.json();
    const table = type === 'page' ? 'gov_giza.pages' : 'public.governorate_news';
    const newStatus = action === 'approve' ? 'published' : 'draft';
    await pool.query(`UPDATE ${table} SET status = $1 WHERE id = $2`, [newStatus, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Content action error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø­Ø§Ù„Ø©' }, { status: 500 });
  }
}
'@

    "payment\mock\route.ts" = @'
import { NextResponse } from 'next/server';

export async function POST() {
  // Simulate a successful payment
  return NextResponse.json({
    success: true,
    transaction_id: 'MOCK-' + Date.now(),
    message: 'ØªÙ…Øª Ø¹Ù…Ù„ÙŠØ© Ø§Ù„Ø¯ÙØ¹ Ø¨Ù†Ø¬Ø§Ø­ (Ø¨ÙŠØ¦Ø© ØªØ¬Ø±ÙŠØ¨ÙŠØ©)'
  });
}
'@

    "digital-eg\verify-id\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { nationalId } = await request.json();
  const isValid = /^\d{14}$/.test(nationalId);
  return NextResponse.json({
    success: true,
    valid: isValid,
    name: isValid ? 'Ù…Ø­Ù…Ø¯ Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…ÙˆØ¯' : null,
    message: isValid ? 'Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ ØµØ§Ù„Ø­' : 'Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ ØºÙŠØ± ØµØ§Ù„Ø­'
  });
}
'@

    "governorate\theme\route.ts" = @'
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug') || 'giza';
  try {
    const result = await pool.query(`
      SELECT primary_color, secondary_color, logo_url, footer_text_ar
      FROM public.governorate_themes
      WHERE governorate_slug = $1
    `, [slug]);
    if (result.rows.length === 0) {
      return NextResponse.json({ primary_color: '#0066CC', secondary_color: '#003366' });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Theme error:', error);
    return NextResponse.json({ primary_color: '#0066CC', secondary_color: '#003366' });
  }
}
'@

    "categories\route.ts" = @'
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, name_ar, slug, icon, display_order
      FROM public.service_categories
      WHERE is_active = true
      ORDER BY display_order
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Categories error:', error);
    return NextResponse.json({ success: false, error: 'ÙØ´Ù„ ÙÙŠ Ø¬Ù„Ø¨ Ø§Ù„ÙØ¦Ø§Øª' }, { status: 500 });
  }
}
'@
}

# Now create each file
foreach ($relativePath in $routes.Keys) {
    $fullPath = Join-Path $basePath $relativePath
    $dir = Split-Path $fullPath -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    # Only write if the file does not already exist (to avoid overwriting your custom modifications)
    if (-not (Test-Path $fullPath)) {
        Set-Content -Path $fullPath -Value $routes[$relativePath] -Encoding UTF8
        Write-Host "Created: $fullPath" -ForegroundColor Green
    } else {
        Write-Host "Skipped (already exists): $fullPath" -ForegroundColor Yellow
    }
}

Write-Host "`nAll missing API routes have been created." -ForegroundColor Cyan
