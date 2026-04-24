export const dynamic = 'force-dynamic';

﻿import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://directus:8055';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const res = await fetch(`${DIRECTUS_URL}/items/news_articles?filter[slug][_eq]=${slug}`);
  const data = await res.json();
  const article = data.data?.[0] || null;
  return NextResponse.json({ success: !!article, data: article });
}