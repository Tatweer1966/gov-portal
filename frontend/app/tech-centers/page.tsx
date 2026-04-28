'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamicImport from 'next/dynamic';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Calendar, CheckCircle2 } from 'lucide-react';

// Dynamically import map component (no SSR)
const MapComponent = dynamicImport(() => import('@/components/MapComponent'), { ssr: false });

interface TechCenter {
  id: number;
  name_ar: string;
  district: string;
  address_ar: string;
  phone: string;
  working_hours_ar: string;
  latitude: number;
  longitude: number;
  services: { id: number; name_ar: string }[];
}

interface BookingForm {
  centerId: number;
  serviceId: number;
  serviceName: string;
  citizenName: string;
  citizenNationalId: string;
  citizenPhone: string;
  citizenEmail: string;
  bookingDate: string;
  bookingTime: string;
  notes: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function TechCentersPage() {
  const [centers, setCenters] = useState<TechCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState<TechCenter | null>(null);
  const [selectedService, setSelectedService] = useState<{ id: number; name_ar: string } | null>(null);
  const [bookingStep, setBookingStep] = useState<'select' | 'datetime' | 'form' | 'confirm'>('select');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [form, setForm] = useState<BookingForm>({
    centerId: 0,
    serviceId: 0,
    serviceName: '',
    citizenName: '',
    citizenNationalId: '',
    citizenPhone: '',
    citizenEmail: '',
    bookingDate: '',
    bookingTime: '',
    notes: '',
  });
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all tech centers
  useEffect(() => {
    fetch('/api/tech-centers')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCenters(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch available times when date changes
  useEffect(() => {
    if (form.bookingDate && selectedCenter && selectedService) {
      setLoadingTimes(true);
      fetch(`/api/tech-centers/available-times?centerId=${selectedCenter.id}&date=${form.bookingDate}&serviceId=${selectedService.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setAvailableTimes(data.slots);
          setLoadingTimes(false);
        })
        .catch(() => setLoadingTimes(false));
    } else {
      setAvailableTimes([]);
    }
  }, [form.bookingDate, selectedCenter, selectedService]);

  const startBooking = (center: TechCenter, service: { id: number; name_ar: string }) => {
    setSelectedCenter(center);
    setSelectedService(service);
    setForm({
      centerId: center.id,
      serviceId: service.id,
      serviceName: service.name_ar,
      citizenName: '',
      citizenNationalId: '',
      citizenPhone: '',
      citizenEmail: '',
      bookingDate: '',
      bookingTime: '',
      notes: '',
    });
    setBookingStep('datetime');
    setAvailableTimes([]);
  };

  const handleDateTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bookingDate || !form.bookingTime) {
      alert('يرجى اختيار التاريخ والوقت');
      return;
    }
    setBookingStep('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.citizenName || !form.citizenNationalId || !form.citizenPhone) {
      alert('يرجى إكمال جميع الحقول المطلوبة');
      return;
    }
    setSubmitting(true);
    const res = await fetch('/api/tech-centers/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        centerId: form.centerId,
        serviceId: form.serviceId,
        citizenName: form.citizenName,
        citizenNationalId: form.citizenNationalId,
        citizenPhone: form.citizenPhone,
        citizenEmail: form.citizenEmail,
        bookingDate: form.bookingDate,
        bookingTime: form.bookingTime,
        notes: form.notes,
        userId: localStorage.getItem('userId') || '1',
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`تم الحجز بنجاح! رقم التتبع: ${data.bookingNumber}`);
      setBookingStep('confirm');
    } else {
      alert('حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.');
    }
    setSubmitting(false);
  };

  const resetBooking = () => {
    setSelectedCenter(null);
    setSelectedService(null);
    setBookingStep('select');
    setForm({
      centerId: 0,
      serviceId: 0,
      serviceName: '',
      citizenName: '',
      citizenNationalId: '',
      citizenPhone: '',
      citizenEmail: '',
      bookingDate: '',
      bookingTime: '',
      notes: '',
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري تحميل المراكز التكنولوجية...</div>;

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="bg-accent/20 text-accent-foreground border-0 mb-3 text-xs px-3 py-1 rounded-full">
            خدمات حكومية
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">المراكز التكنولوجية</h1>
          <p className="text-muted-foreground">استعرض المراكز التكنولوجية واحجز موعدك إلكترونياً</p>
        </div>

        {/* Map */}
        <div className="h-96 mb-8 rounded-xl overflow-hidden shadow-md">
          <MapComponent centers={centers} onSelectCenter={(center) => setSelectedCenter(center)} />
        </div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center, idx) => (
            <motion.div
              key={center.id}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all"
            >
              <div className="p-5">
                <h2 className="text-xl font-bold text-primary mb-1">{center.name_ar}</h2>
                <p className="text-sm text-muted-foreground">{center.district}</p>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {center.address_ar}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {center.phone}</p>
                  <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {center.working_hours_ar}</p>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-sm">الخدمات المتاحة:</h3>
                  <ul className="mt-2 space-y-2">
                    {center.services.map(s => (
                      <li key={s.id} className="flex justify-between items-center text-sm">
                        <span>{s.name_ar}</span>
                        <button
                          onClick={() => startBooking(center, s)}
                          className="text-primary text-xs font-semibold hover:underline"
                        >
                          حجز
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedCenter && selectedService && bookingStep !== 'select' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                حجز موعد في {selectedCenter.name_ar} – {selectedService.name_ar}
              </h2>
              <button onClick={resetBooking} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="p-6">
              {bookingStep === 'datetime' && (
                <form onSubmit={handleDateTimeSubmit} className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">اختر التاريخ *</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={form.bookingDate}
                      onChange={e => setForm({ ...form, bookingDate: e.target.value })}
                      className="w-full border border-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">اختر الوقت *</label>
                    {loadingTimes ? (
                      <div className="text-muted-foreground">جاري تحميل الأوقات المتاحة...</div>
                    ) : availableTimes.length === 0 ? (
                      <div className="text-red-500">لا توجد أوقات متاحة في هذا التاريخ</div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map(time => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setForm({ ...form, bookingTime: time })}
                            className={`p-2 border rounded-lg text-center transition ${
                              form.bookingTime === time
                                ? 'bg-primary text-white border-primary'
                                : 'hover:border-primary'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between gap-3 pt-4">
                    <button type="button" onClick={resetBooking} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={!form.bookingDate || !form.bookingTime}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                      التالي
                    </button>
                  </div>
                </form>
              )}

              {bookingStep === 'form' && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-1">الاسم الكامل *</label>
                      <input
                        type="text"
                        required
                        value={form.citizenName}
                        onChange={e => setForm({ ...form, citizenName: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">الرقم القومي *</label>
                      <input
                        type="text"
                        required
                        value={form.citizenNationalId}
                        onChange={e => setForm({ ...form, citizenNationalId: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">رقم الهاتف *</label>
                      <input
                        type="tel"
                        required
                        value={form.citizenPhone}
                        onChange={e => setForm({ ...form, citizenPhone: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={form.citizenEmail}
                        onChange={e => setForm({ ...form, citizenEmail: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">ملاحظات (اختياري)</label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div className="flex justify-between gap-3 pt-4">
                    <button type="button" onClick={() => setBookingStep('datetime')} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                      رجوع
                    </button>
                    <button type="submit" disabled={submitting} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50">
                      {submitting ? 'جاري الحجز...' : 'تأكيد الحجز'}
                    </button>
                  </div>
                </form>
              )}

              {bookingStep === 'confirm' && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">تم حجز موعدك بنجاح!</h3>
                  <p className="text-muted-foreground">سيتم التواصل معك لتأكيد الحجز.</p>
                  <button onClick={resetBooking} className="mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
                    إغلاق
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}