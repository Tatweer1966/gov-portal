'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, FileText, User, Phone, Mail, MapPin, CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RequestDetail {
  id: number;
  request_number: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  type: string;
  tracking_number?: string;
  fee_amount?: number;
  payment_status?: string;
  citizen_name?: string;
  citizen_phone?: string;
  citizen_email?: string;
  citizen_address?: string;
  notes?: string;
}

export default function RequestDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const type = searchParams.get('type');

  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    // Fetch all requests for the current user and find the one with matching id
    const userId = localStorage.getItem('userId') || '1';
    fetch(`/api/requests?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.data.find((item: RequestDetail) => item.id === parseInt(id));
          if (found) setRequest(found);
          else setError('الطلب غير موجود');
        } else {
          setError('فشل في جلب بيانات الطلب');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('حدث خطأ في الاتصال');
        setLoading(false);
      });
  }, [id]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      in_progress: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
      resolved: { label: 'تم الحل', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-700', icon: XCircle },
      approved: { label: 'موافق عليه', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      completed: { label: 'مكتمل', color: 'bg-gray-100 text-gray-700', icon: CheckCircle },
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
    const Icon = s.icon;
    return (
      <Badge className={`${s.color} border-0 flex items-center gap-1`}>
        <Icon className="w-3 h-3" /> {s.label}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      service: 'طلب خدمة',
      complaint: 'شكوى',
      social: 'مساعدة اجتماعية',
      booking: 'حجز مركز تكنولوجي',
    };
    return typeMap[type] || type;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
          <p>{error || 'الطلب غير موجود'}</p>
          <Link href="/dashboard" className="inline-block mt-4 text-primary hover:underline">
            العودة إلى لوحة التحكم
          </Link>
        </div>
      </div>
    );
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> العودة إلى لوحة التحكم
        </Link>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold mb-1">تفاصيل الطلب</h1>
                <p className="text-white/80 text-sm">رقم الطلب: {request.request_number}</p>
              </div>
              {getStatusBadge(request.status)}
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">نوع الطلب:</span>
                <span className="font-semibold">{getTypeLabel(request.type)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">تاريخ التقديم:</span>
                <span className="font-semibold">{formatDate(request.created_at)}</span>
              </div>
              {request.tracking_number && (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">رقم التتبع:</span>
                  <span className="font-semibold">{request.tracking_number}</span>
                </div>
              )}
              {request.fee_amount !== undefined && (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">الرسوم:</span>
                  <span className="font-semibold">{request.fee_amount} ج.م</span>
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div className="border-t border-border pt-4">
              <h2 className="text-lg font-bold mb-2">{request.title}</h2>
              <p className="text-muted-foreground whitespace-pre-line">{request.description}</p>
            </div>

            {/* Additional Citizen Data (for certain types) */}
            {(request.citizen_name || request.citizen_phone || request.citizen_email || request.citizen_address) && (
              <div className="border-t border-border pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> بيانات مقدم الطلب
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {request.citizen_name && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{request.citizen_name}</span>
                    </div>
                  )}
                  {request.citizen_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{request.citizen_phone}</span>
                    </div>
                  )}
                  {request.citizen_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{request.citizen_email}</span>
                    </div>
                  )}
                  {request.citizen_address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{request.citizen_address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {request.notes && (
              <div className="border-t border-border pt-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> ملاحظات
                </h3>
                <p className="text-muted-foreground text-sm">{request.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}