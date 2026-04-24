'use client';

export const dynamic = 'force-dynamic';



import { useState } from 'react';

const schools = [
  { id: 1, name: 'Ù…Ø¯Ø±Ø³Ø© Ø§Ù„Ù†ÙˆØ± Ù„Ù„Ù…ÙƒÙÙˆÙÙŠÙ†', type: 'Ø¶Ø¹Ø§Ù Ø§Ù„Ø¨ØµØ± ÙˆØ§Ù„Ù…ÙƒÙÙˆÙÙŠÙ†', district: 'Ø§Ù„Ù‡Ø±Ù…', stages: 'ØªÙ…Ù‡ÙŠØ¯ÙŠ - Ø«Ø§Ù†ÙˆÙŠ', fees: 'Ù…Ø¬Ø§Ù†ÙŠØ©' },
  { id: 2, name: 'Ù…Ø¯Ø±Ø³Ø© Ø§Ù„Ø£Ù…Ù„ Ù„Ù„ØµÙ…', type: 'Ø¶Ø¹Ø§Ù Ø§Ù„Ø³Ù…Ø¹ ÙˆØ§Ù„ØµÙ…', district: 'Ø§Ù„Ø¹Ù…Ø±Ø§Ù†ÙŠØ©', stages: 'ØªÙ…Ù‡ÙŠØ¯ÙŠ - Ø«Ø§Ù†ÙˆÙŠ', fees: 'Ù…Ø¬Ø§Ù†ÙŠØ©' },
  { id: 3, name: 'Ù…Ø¯Ø±Ø³Ø© Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„ÙÙƒØ±ÙŠØ©', type: 'Ø¥Ø¹Ø§Ù‚Ø© Ø°Ù‡Ù†ÙŠØ©', district: 'Ø¨ÙˆÙ„Ø§Ù‚ Ø§Ù„Ø¯ÙƒØ±ÙˆØ±', stages: 'ØªÙ…Ù‡ÙŠØ¯ÙŠ - Ø¥Ø¹Ø¯Ø§Ø¯ÙŠ', fees: 'Ù…Ø¬Ø§Ù†ÙŠØ©' },
];

export default function SpecialNeedsSchoolsPage() {
  const [selectedType, setSelectedType] = useState('Ø§Ù„ÙƒÙ„');
  const types = ['Ø§Ù„ÙƒÙ„', 'Ø¶Ø¹Ø§Ù Ø§Ù„Ø¨ØµØ± ÙˆØ§Ù„Ù…ÙƒÙÙˆÙÙŠÙ†', 'Ø¶Ø¹Ø§Ù Ø§Ù„Ø³Ù…Ø¹ ÙˆØ§Ù„ØµÙ…', 'Ø¥Ø¹Ø§Ù‚Ø© Ø°Ù‡Ù†ÙŠØ©'];
  const filtered = schools.filter(s => selectedType === 'Ø§Ù„ÙƒÙ„' || s.type === selectedType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-4">Ù…Ø¯Ø§Ø±Ø³ Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø®Ø§ØµØ©</h1>
        <p className="text-center text-gray-600 mb-6">Ø¯Ù„ÙŠÙ„ Ù…Ø¯Ø§Ø±Ø³ Ø°ÙˆÙŠ Ø§Ù„Ø§Ø­ØªÙŠØ§Ø¬Ø§Øª Ø§Ù„Ø®Ø§ØµØ© ÙÙŠ Ù…Ø­Ø§ÙØ¸Ø© Ø§Ù„Ø¬ÙŠØ²Ø©</p>
        <div className="max-w-md mx-auto mb-8">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(school => (
            <div key={school.id} className="bg-white rounded-xl shadow-md p-5">
              <h2 className="text-xl font-semibold text-primary">{school.name}</h2>
              <p className="text-gray-500 text-sm">{school.type} - {school.district}</p>
              <p className="text-gray-600 mt-2">Ø§Ù„Ù…Ø±Ø§Ø­Ù„: {school.stages}</p>
              <p className="text-primary font-semibold">Ø§Ù„Ø±Ø³ÙˆÙ…: {school.fees}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
