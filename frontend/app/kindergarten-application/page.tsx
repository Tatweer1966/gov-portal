'use client';

export const dynamic = 'force-dynamic';



import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KindergartenApplicationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    childName: '', childNationalId: '', childBirthDate: '',
    parentName: '', parentNationalId: '', phone: '', email: '',
    address: '', district: '', schoolType: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    const newTracking = `KG-${Date.now()}`;
    setTrackingNumber(newTracking);
    setSubmitted(true);
    // You can also call an API endpoint here (e.g., /api/kindergarten/apply)
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">âœ“</div>
          <h2 className="text-2xl font-bold mb-2">ØªÙ… ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨ Ø¨Ù†Ø¬Ø§Ø­</h2>
          <p className="text-gray-600 mb-4">Ø±Ù‚Ù… Ø§Ù„ØªØªØ¨Ø¹: <strong className="text-primary">{trackingNumber}</strong></p>
          <button onClick={() => router.push('/dashboard')} className="bg-primary text-white px-6 py-2 rounded-lg">Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø·Ù„Ø¨</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Ø§Ù„ØªÙ‚Ø¯ÙŠÙ… Ù„Ø±ÙŠØ§Ø¶ Ø§Ù„Ø£Ø·ÙØ§Ù„ (KG1)</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø·ÙÙ„</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Ø§Ù„Ø§Ø³Ù… Ø§Ù„Ø«Ù„Ø§Ø«ÙŠ *" required onChange={e => setFormData({...formData, childName: e.target.value})} className="border rounded-lg p-2" />
              <input type="text" placeholder="Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ (14 Ø±Ù‚Ù…) *" required onChange={e => setFormData({...formData, childNationalId: e.target.value})} className="border rounded-lg p-2" />
              <input type="date" placeholder="ØªØ§Ø±ÙŠØ® Ø§Ù„Ù…ÙŠÙ„Ø§Ø¯ *" required onChange={e => setFormData({...formData, childBirthDate: e.target.value})} className="border rounded-lg p-2" />
            </div>
            <h2 className="text-lg font-semibold">Ø¨ÙŠØ§Ù†Ø§Øª ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Ø§Ø³Ù… ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø± *" required onChange={e => setFormData({...formData, parentName: e.target.value})} className="border rounded-lg p-2" />
              <input type="text" placeholder="Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ *" required onChange={e => setFormData({...formData, parentNationalId: e.target.value})} className="border rounded-lg p-2" />
              <input type="tel" placeholder="Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ *" required onChange={e => setFormData({...formData, phone: e.target.value})} className="border rounded-lg p-2" />
              <input type="email" placeholder="Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ" onChange={e => setFormData({...formData, email: e.target.value})} className="border rounded-lg p-2" />
            </div>
            <h2 className="text-lg font-semibold">Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø³ÙƒÙ†</h2>
            <input type="text" placeholder="Ø§Ù„Ø¹Ù†ÙˆØ§Ù† *" required onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border rounded-lg p-2" />
            <input type="text" placeholder="Ø§Ù„Ù…Ù†Ø·Ù‚Ø© *" required onChange={e => setFormData({...formData, district: e.target.value})} className="w-full border rounded-lg p-2" />
            <h2 className="text-lg font-semibold">Ù†ÙˆØ¹ Ø§Ù„Ù…Ø¯Ø±Ø³Ø©</h2>
            <div className="flex gap-4">
              <label><input type="radio" name="schoolType" value="public" onChange={() => setFormData({...formData, schoolType: 'public'})} /> Ø±Ø³Ù…ÙŠØ© (Ø¹Ø±Ø¨ÙŠØ©)</label>
              <label><input type="radio" name="schoolType" value="language" onChange={() => setFormData({...formData, schoolType: 'language'})} /> Ø±Ø³Ù…ÙŠØ© Ù„Ù„ØºØ§Øª (ØªØ¬Ø±ÙŠØ¨ÙŠØ©)</label>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90">ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨</button>
          </form>
        </div>
      </div>
    </div>
  );
}
