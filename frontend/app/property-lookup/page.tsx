'use client';

export const dynamic = 'force-dynamic';



import { useState } from 'react';

export default function PropertyLookupPage() {
  const [nationalId, setNationalId] = useState('');
  const [property, setProperty] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!nationalId) return;
    setError('');
    const res = await fetch(`/api/property/lookup?nationalId=${nationalId}`);
    const data = await res.json();
    if (data.success) setProperty(data.data);
    else setError(data.error);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Ø§Ù„Ø§Ø³ØªØ¹Ù„Ø§Ù… Ø¹Ù† Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ Ø§Ù„Ù…ÙˆØ­Ø¯ Ù„Ù„Ø¹Ù‚Ø§Ø±</h1>
          <div className="flex gap-3 mb-6">
            <input type="text" placeholder="Ø£Ø¯Ø®Ù„ Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ Ù„Ù„Ø¹Ù‚Ø§Ø± (20 Ø±Ù‚Ù…)" value={nationalId} onChange={e => setNationalId(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" />
            <button onClick={handleSearch} className="bg-primary text-white px-6 py-2 rounded-lg">Ø§Ø³ØªØ¹Ù„Ø§Ù…</button>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {property && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-1">
              <p><strong>Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ­Ø¯:</strong> {property.unified_id}</p>
              <p><strong>Ø§Ù„Ø¹Ù†ÙˆØ§Ù†:</strong> {property.address_ar}</p>
              <p><strong>Ø§Ù„Ù…Ø³Ø§Ø­Ø©:</strong> {property.area} Ù…Â²</p>
              <p><strong>Ø§Ù„Ù†ÙˆØ¹:</strong> {property.type_ar}</p>
              <p><strong>Ø§Ù„Ø­Ø§Ù„Ø©:</strong> {property.status_ar}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
