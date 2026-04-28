'use client';

export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, CheckCircle2, Info, Mail, Phone } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function SponsorshipPolicyPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            سياسات ولوائح
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">سياسة الإعلانات والرعاية</h1>
          <p className="text-muted-foreground">آخر تحديث: أبريل 2026</p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8 space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Shield className="w-6 h-6" /> المبادئ العامة
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> المحتوى التحريري مستقل تماماً عن الإعلانات – لا تأثير للرعاة على الأخبار أو الخدمات.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> الإفصاح عن أي محتوى مدعوم أو منشور برعاية بشكل واضح.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> رفض أي إعلان يتعارض مع القوانين المصرية أو الآداب العامة أو يروج لمنتجات محظورة.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> لا نتحمل مسؤولية محتوى الإعلانات أو مواقع الجهات الراعية الخارجية.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <FileText className="w-6 h-6" /> أنواع الإعلانات المسموح بها
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-muted-foreground">
              <div className="bg-gray-50 rounded-lg p-3">📢 بانرات إعلانية (رئيسية أو جانبية)</div>
              <div className="bg-gray-50 rounded-lg p-3">📝 إعلانات نصية (Sponsored Posts)</div>
              <div className="bg-gray-50 rounded-lg p-3">🏷️ رعاية أقسام أو صفحات متخصصة</div>
              <div className="bg-gray-50 rounded-lg p-3">🎉 رعاية فعاليات ومؤتمرات المحافظة</div>
              <div className="bg-gray-50 rounded-lg p-3">📧 نشرات بريدية مدعومة</div>
              <div className="bg-gray-50 rounded-lg p-3">📱 إعلانات داخل التطبيقات (في المستقبل)</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Info className="w-6 h-6" /> شروط القبول
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
              <li>أن تكون الجهة مقدمة الطلب مسجلة رسمياً في مصر.</li>
              <li>ألا يروج الإعلان لمنتجات مخالفة للقانون (مشروبات كحولية، منتجات تبغ، أدوية غير مرخصة، أسلحة، مواد إباحية).</li>
              <li>ألا يحوي الإعلان أي تمييز عنصري أو جنسي أو ديني.</li>
              <li>ألا يستخدم شعار المحافظة أو صور المسؤولين بطريقة مضللة دون موافقة مسبقة.</li>
              <li>يحق للمحافظة رفض أي إعلان دون إبداء أسباب.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Mail className="w-6 h-6" /> آلية التقديم والمراجعة
            </h2>
            <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
              <li>تقديم طلب رسمي عبر البريد الإلكتروني: <strong className="text-primary">sponsorship@giza.gov.eg</strong></li>
              <li>إرفاق نموذج الإعلان أو الوسائط المقترحة (صور، فيديوهات، نصوص).</li>
              <li>تتم المراجعة خلال 5 أيام عمل من قبل لجنة متخصصة.</li>
              <li>في حال القبول، يتم إخطار مقدم الطلب وتوقيع عقد الرعاية.</li>
              <li>مدة العقد تحدد حسب طبيعة الرعاية (شهرية، سنوية، أو لفعالية محددة).</li>
            </ol>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 text-center border border-primary/10">
            <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              للاستفسارات، يمكنكم التواصل على البريد الإلكتروني:
              <strong className="text-primary block mt-1">sponsorship@giza.gov.eg</strong>
              أو الاتصال على <strong className="text-primary">١٦١٦١</strong> (تحويلة ٨٨٨)
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}