'use client';

export const dynamic = 'force-dynamic';



import { useState } from 'react';

export default function VerifyIdPage() {
  const [nationalId, setNationalId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    const res = await fetch('/api/digital-eg/verify-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nationalId }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ (ØªÙƒØ§Ù…Ù„ Ù…ØµØ± Ø§Ù„Ø±Ù‚Ù…ÙŠØ©)</h1>
          <input type="text" placeholder="Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ù‚ÙˆÙ…ÙŠ (14 Ø±Ù‚Ù…)" value={nationalId} onChange={e => setNationalId(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-4" />
          <button onClick={handleVerify} disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg">{loading ? 'Ø¬Ø§Ø±ÙŠ...' : 'ØªØ­Ù‚Ù‚'}</button>
          {result && <div className={`mt-4 p-3 rounded ${result.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{result.message}</div>}
        </div>
      </div>
    </div>
  );
}
