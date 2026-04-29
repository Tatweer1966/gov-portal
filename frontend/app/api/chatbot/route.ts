export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';

// Define the type for the FAQ data
type FaqMap = Record<string, string>;

// FAQ data per tenant (and default fallback)
const faq: Record<string, FaqMap> = {
  default: {
    'ترخيص بناء': 'يمكنك التقديم عبر خدمة "رخصة بناء جديدة" في قسم الخدمات.',
    'مواعيد المراكز التكنولوجية': 'المراكز التكنولوجية تعمل من الأحد إلى الخميس، 9 ص – 5 م.',
    'علاج على نفقة الدولة': 'قدم طلب عبر خدمة العلاج على نفقة الدولة.',
  },
  alexandria: {
    'ترخيص بناء': 'للاستفسار عن تراخيص البناء في الإسكندرية، يرجى زيارة منطقة المنشية.',
  },
};

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const lower = (message || '').toLowerCase();

    const host = req.headers.get('host') || '';
    const tenant = getTenant(host);
    // Select the appropriate FAQ map, fallback to default
    const tenantFaq: FaqMap = (tenant.name && faq[tenant.name]) || faq.default;

    let answer = 'شكراً لسؤالك. يرجى التواصل مع خدمة العملاء 12345.';
    for (const [key, value] of Object.entries(tenantFaq)) {
      if (lower.includes(key.toLowerCase())) {
        answer = value;
        break;
      }
    }

    return NextResponse.json({ success: true, response: answer });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}