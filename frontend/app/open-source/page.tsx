'use client';

export const dynamic = 'force-dynamic';

import { Badge } from '@/components/ui/badge';

const components = [
  { name: 'Next.js', license: 'MIT' },
  { name: 'React', license: 'MIT' },
  { name: 'Tailwind CSS', license: 'MIT' },
  { name: 'PostgreSQL', license: 'PostgreSQL License' },
  { name: 'Redis', license: 'BSD-3-Clause' },
  { name: 'MinIO', license: 'AGPL-3.0' },
  { name: 'OpenSearch', license: 'Apache-2.0' },
  { name: 'Leaflet', license: 'BSD-2-Clause' },
  { name: 'Framer Motion', license: 'MIT' },
  { name: 'Lucide Icons', license: 'ISC' },
];

export default function OpenSourcePage() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            الشفافية
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">البرمجيات مفتوحة المصدر المستخدمة</h1>
          <p className="text-muted-foreground">
            هذا المشروع مبني بالكامل على برمجيات مفتوحة المصدر. لا توجد أي مكونات احتكارية.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary/5 border-b border-border">
                  <th className="p-3 text-right font-semibold">المكون</th>
                  <th className="p-3 text-right font-semibold">الترخيص</th>
                </tr>
              </thead>
              <tbody>
                {components.map((c, idx) => (
                  <tr key={c.name} className={idx % 2 === 0 ? 'bg-background' : 'bg-gray-50'}>
                    <td className="p-3 border-b border-border">{c.name}</td>
                    <td className="p-3 border-b border-border">{c.license}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-green-50 rounded-lg p-5 m-6 text-green-800 flex items-start gap-3">
            <span className="text-xl">✅</span>
            <p className="text-sm">لا يوجد حبس تقني – الجهة المتعاقدة تملك الحق الكامل في تعديل وتشغيل النظام.</p>
          </div>
        </div>
      </div>
    </div>
  );
}