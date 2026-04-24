'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamicImport from 'next/dynamic';

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
      alert('ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„ÙˆÙ‚Øª');
      return;
    }
    setBookingStep('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.citizenName || !form.citizenNationalId || !form.citizenPhone) {
      alert('ÙŠØ±Ø¬Ù‰ Ø¥ÙƒÙ…Ø§Ù„ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©');
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
      alert(`ØªÙ… Ø§Ù„Ø­Ø¬Ø² Ø¨Ù†Ø¬Ø§Ø­! Ø±Ù‚Ù… Ø§Ù„ØªØªØ¨Ø¹: ${data.bookingNumber}`);
      setBookingStep('confirm');
      // Optionally reset or close modal
    } else {
      alert('Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„Ø­Ø¬Ø². ÙŠØ±Ø¬Ù‰ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.');
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

  if (loading) return <div className="p-8 text-center">Ø¬Ø§Ø±ÙŠ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ù…Ø±Ø§ÙƒØ² Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ©...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <span className="text-3xl">ðŸ“</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Ø§Ù„Ù…Ø±Ø§ÙƒØ² Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ©</h1>
          <p className="text-gray-600">Ø§Ø³ØªØ¹Ø±Ø¶ Ø§Ù„Ù…Ø±Ø§ÙƒØ² Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ© ÙˆØ§Ø­Ø¬Ø² Ù…ÙˆØ¹Ø¯Ùƒ Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ§Ù‹</p>
        </div>

        {/* Map */}
        <div className="h-96 mb-8 rounded-xl overflow-hidden shadow-md">
          <MapComponent centers={centers} onSelectCenter={(center) => setSelectedCenter(center)} />
        </div>

        {/* Centers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map(center => (
            <div key={center.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-primary">{center.name_ar}</h2>
              <p className="text-gray-600 text-sm">{center.district}</p>
              <p className="text-gray-600 text-sm mt-2">ðŸ“ {center.address_ar}</p>
              <p className="text-gray-600 text-sm">ðŸ“ž {center.phone}</p>
              <p className="text-gray-600 text-sm">ðŸ•’ {center.working_hours_ar}</p>
              <div className="mt-3">
                <h3 className="font-semibold text-sm">Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ù…ØªØ§Ø­Ø©:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {center.services.map(s => (
                    <li key={s.id} className="flex justify-between items-center">
                      {s.name_ar}
                      <button
                        onClick={() => startBooking(center, s)}
                        className="text-primary text-xs hover:underline"
                      >
                        Ø­Ø¬Ø²
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedCenter && selectedService && bookingStep !== 'select' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Ø­Ø¬Ø² Ù…ÙˆØ¹Ø¯ ÙÙŠ {selectedCenter.name_ar}
                  {selectedService && ` â€“ ${selectedService.name_ar}`}
                </h2>
                <button onClick={resetBooking} className="text-gray-500 hover:text-gray-700">âœ•</button>
              </div>

              <div className="p-6">
                {/* Step 1: Date & Time */}
                {bookingStep === 'datetime' && (
                  <form onSubmit={handleDateTimeSubmit} className="space-y-4">
                    <div>
                      <label className="block font-medium mb-1">Ø§Ø®ØªØ± Ø§Ù„ØªØ§Ø±ÙŠØ® *</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={form.bookingDate}
                        onChange={e => setForm({ ...form, bookingDate: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Ø§Ø®ØªØ± Ø§Ù„ÙˆÙ‚Øª *</label>
                      {loadingTimes ? (
                        <div className="text-gray-500">Ø¬Ø§Ø±ÙŠ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø£ÙˆÙ‚Ø§Øª Ø§Ù„Ù…ØªØ§Ø­Ø©...</div>
                      ) : availableTimes.length === 0 ? (
                        <div className="text-red-500">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø£ÙˆÙ‚Ø§Øª Ù…ØªØ§Ø­Ø© ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„ØªØ§Ø±ÙŠØ®</div>
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
                      <button
                        type="button"
                        onClick={resetBooking}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Ø¥Ù„ØºØ§Ø¡
                      </button>
                      <button
                        type="submit"
                        disabled={!form.bookingDate || !form.bookingTime}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                      >
                        Ø§Ù„ØªØ§Ù„ÙŠ
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 2: Personal Information */}
                {bookingStep === 'form' && (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-1">Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„ *</label>
                        <input
                          type="text"
                          required
                          value={form.citizenName}
                          onChange={e => setForm({ ...form, citizenName: e.target.value })}
                          className="w-full border rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ *</label>
                        <input
                          type="text"
                          required
                          value={form.citizenNationalId}
                          onChange={e => setForm({ ...form, citizenNationalId: e.target.value })}
                          className="w-full border rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ *</label>
                        <input
                          type="tel"
                          required
                          value={form.citizenPhone}
                          onChange={e => setForm({ ...form, citizenPhone: e.target.value })}
                          className="w-full border rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ</label>
                        <input
                          type="email"
                          value={form.citizenEmail}
                          onChange={e => setForm({ ...form, citizenEmail: e.target.value })}
                          className="w-full border rounded-lg p-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Ù…Ù„Ø§Ø­Ø¸Ø§Øª (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)</label>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div className="flex justify-between gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setBookingStep('datetime')}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Ø±Ø¬ÙˆØ¹
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                      >
                        {submitting ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø­Ø¬Ø²...' : 'ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø¬Ø²'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Confirmation */}
                {bookingStep === 'confirm' && (
                  <div className="text-center py-6">
                    <div className="text-green-600 text-5xl mb-4">âœ“</div>
                    <h3 className="text-xl font-bold mb-2">ØªÙ… Ø­Ø¬Ø² Ù…ÙˆØ¹Ø¯Ùƒ Ø¨Ù†Ø¬Ø§Ø­!</h3>
                    <p className="text-gray-600">Ø³ÙŠØªÙ… Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ Ù„ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø¬Ø².</p>
                    <button
                      onClick={resetBooking}
                      className="mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                    >
                      Ø¥ØºÙ„Ø§Ù‚
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
