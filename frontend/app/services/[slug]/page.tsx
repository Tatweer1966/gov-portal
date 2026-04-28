'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ServiceDetail {
  id: number;
  name_ar: string;
  description_ar: string;
  required_documents: string[];
  fees_ar: string;
  processing_time_ar: string;
  service_type: string;
  department_name_ar: string;
  department_phone: string;
  department_email: string;
  location_address_ar: string;
  application_steps_ar: string[];
  eligibility_criteria_ar: string;
  legal_basis_ar: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// Helper to get the external application URL for a service (if any)
// You can extend this mapping or store the URL in the database.
const getServiceApplyUrl = (slug: string): string => {
  switch (slug) {
    case 'comprehensive-insurance':
      return 'https://uhia.gov.eg/'; // Official portal
    default:
      return '#'; // Fallback – you can also return an internal apply page
  }
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/services/${params.slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setService(data.data);
        else router.push('/services');
        setLoading(false);
      })
      .catch(() => router.push('/services'));
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  if (!service) return null;

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'online': return 'إلكتروني';
      case 'hybrid': return 'مختلط';
      default: return 'حضوري';
    }
  };

  const applyUrl = getServiceApplyUrl(params.slug as string);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/services" className="hover:text-primary transition">الخدمات</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{service.name_ar}</span>
        </div>

        {/* زر العودة إلى جميع الخدمات */}
        <div className="text-right mb-4">
          <Link href="/services" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
            <ArrowLeft className="w-4 h-4" /> جميع الخدمات
          </Link>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{service.name_ar}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-white/20 text-white border-0">
                {getServiceTypeLabel(service.service_type)}
              </Badge>
              {service.legal_basis_ar && (
                <Badge className="bg-white/20 text-white border-0 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> قانوني
                </Badge>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{service.description_ar}</p>

            {service.legal_basis_ar && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span><strong>القانون المنظم:</strong> {service.legal_basis_ar}</span>
              </div>
            )}

            {/* Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Required Documents */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> المستندات المطلوبة
                </h2>
                {service.required_documents?.length > 0 ? (
                  <ul className="space-y-2">
                    {service.required_documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">لا توجد مستندات محددة</p>
                )}
              </div>

              {/* Service Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" /> معلومات الخدمة
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الرسوم:</span>
                    <span className="font-semibold">{service.fees_ar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مدة المعالجة:</span>
                    <span className="font-semibold">{service.processing_time_ar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">نوع الخدمة:</span>
                    <span className="font-semibold">{getServiceTypeLabel(service.service_type)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Steps */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> خطوات التقديم
              </h2>
              {service.application_steps_ar?.length > 0 ? (
                <ol className="space-y-3">
                  {service.application_steps_ar.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground text-sm">لا توجد خطوات محددة</p>
              )}
            </div>

            {/* Eligibility */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" /> شروط الأهلية
              </h2>
              <p className="text-sm text-muted-foreground">{service.eligibility_criteria_ar || 'لا توجد شروط محددة'}</p>
            </div>

            {/* Department Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" /> الجهة المسؤولة
              </h2>
              <div className="space-y-2 text-sm">
                <p><strong>{service.department_name_ar}</strong></p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{service.department_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{service.department_email}</span>
                </div>
                {service.location_address_ar && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{service.location_address_ar}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Button – now a functional link */}
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              تقديم طلب الخدمة <ArrowLeft className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}