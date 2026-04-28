export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';

// Define a type for FAQ data: each tenant has a dictionary of question -> answer
interface FaqMap {
  [key: string]: string;
}

interface FaqDatabase {
  default: FaqMap;
  [tenant: string]: FaqMap | undefined;
}

// Tenant-specific FAQ (extend as needed)
const faq: FaqDatabase = {
  default: {
    'ترخيص بناء': 'يمكنك التقديم عبر خدمة "رخصة بناء جديدة" في قسم الخدمات.',
    'مواعيد المراكز التكنولوجية': 'المراكز التكنولوجية تعمل من الأحد إلى الخميس، 9 ص – 5 م.',
    'علاج على نفقة الدولة': 'قدم طلب عبر خدمة العلاج على نفقة الدولة.',
  },
  // Alexandria-specific overrides (optional)
  alexandria: {
    'ترخيص بناء': 'للاستفسار عن تراخيص البناء في الإسكندرية، يرجى زيارة منطقة المنشية.',
  },
};

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const lower = (message || '').toLowerCase();

    // Detect tenant
    const host = req.headers.get('host') || '';
    const tenant = getTenant(host);
    const tenantFaq = (tenant.name && faq[tenant.name]) || faq.default;

    let answer = 'شكراً لسؤالك. يرجى التواصل مع خدمة العملاء 12345.';
    for (const [k, v] of Object.entries(tenantFaq)) {
      if (lower.includes(k.toLowerCase())) {
        answer = v;
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