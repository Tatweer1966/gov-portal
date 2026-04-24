export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const faq = {
  'ترخيص بناء': 'يمكنك التقديم عبر خدمة "رخصة بناء جديدة" في قسم الخدمات.',
  'مواعيد المراكز التكنولوجية': 'المراكز التكنولوجية تعمل من الأحد إلى الخميس، 9 ص – 5 م.',
  'علاج على نفقة الدولة': 'قدم طلب عبر خدمة العلاج على نفقة الدولة.',
};

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const lower = (message || '').toLowerCase();
  let answer = 'شكراً لسؤالك. يرجى التواصل مع خدمة العملاء 12345.';
  for (const [k, v] of Object.entries(faq)) {
    if (lower.includes(k.toLowerCase())) {
      answer = v;
      break;
    }
  }
  return NextResponse.json({ success: true, response: answer });
}

