'use client';

export const dynamic = 'force-dynamic';



import { useState, useEffect } from 'react';

interface School {
  id: number;
  name: string;
  district: string;
  type: string;
  stages: string[];
}

const schoolsData: School[] = [
  { id: 1, name: 'Ù…Ø¯Ø±Ø³Ø© 6 Ø£ÙƒØªÙˆØ¨Ø± Ø§Ù„Ø±Ø³Ù…ÙŠØ© Ø§Ù„Ù…ØªÙ…ÙŠØ²Ø© Ù„Ù„ØºØ§Øª', district: '6 Ø£ÙƒØªÙˆØ¨Ø±', type: 'Ø±Ø³Ù…ÙŠØ© Ù…ØªÙ…ÙŠØ²Ø© Ù„Ù„ØºØ§Øª', stages: ['KG1', 'KG2', 'Ø§Ø¨ØªØ¯Ø§Ø¦ÙŠ', 'Ø¥Ø¹Ø¯Ø§Ø¯ÙŠ'] },
  { id: 2, name: 'Ù…Ø¯Ø±Ø³Ø© Ø§Ù„Ø¹Ù…Ø±Ø§Ù†ÙŠØ© Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© Ù„Ù„ØºØ§Øª', district: 'Ø§Ù„Ø¹Ù…Ø±Ø§Ù†ÙŠØ©', type: 'ØªØ¬Ø±ÙŠØ¨ÙŠØ© Ù„ØºØ§Øª', stages: ['KG1', 'KG2', 'Ø§Ø¨ØªØ¯Ø§Ø¦ÙŠ', 'Ø¥Ø¹Ø¯Ø§Ø¯ÙŠ', 'Ø«Ø§Ù†ÙˆÙŠ'] },
  { id: 3, name: 'Ù…Ø¯Ø±Ø³Ø© Ù…ØµØ·ÙÙ‰ ÙƒØ§Ù…Ù„ Ø§Ù„Ø±Ø³Ù…ÙŠØ© Ø§Ù„Ù…ØªÙ…ÙŠØ²Ø© Ù„Ù„ØºØ§Øª', district: 'Ø§Ù„Ø¹Ù…Ø±Ø§Ù†ÙŠØ©', type: 'Ø±Ø³Ù…ÙŠØ© Ù…ØªÙ…ÙŠØ²Ø© Ù„Ù„ØºØ§Øª', stages: ['Ø§Ø¨ØªØ¯Ø§Ø¦ÙŠ', 'Ø¥Ø¹Ø¯Ø§Ø¯ÙŠ'] },
  { id: 4, name: 'Ù…Ø¯Ø±Ø³Ø© Ø§Ù„Ù‡Ø±Ù… Ø§Ù„Ø«Ø§Ù†ÙˆÙŠØ© Ø¨Ù†ÙŠÙ†', district: 'Ø§Ù„Ù‡Ø±Ù…', type: 'Ø±Ø³Ù…ÙŠØ©', stages: ['Ø«Ø§Ù†ÙˆÙŠ'] },
  { id: 5, name: 'Ù…Ø¯Ø±Ø³Ø© ÙÙŠØµÙ„ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯ÙŠØ© Ø¨Ù†Ø§Øª', district: 'ÙÙŠØµÙ„', type: 'Ø±Ø³Ù…ÙŠØ©', stages: ['Ø¥Ø¹Ø¯Ø§Ø¯ÙŠ'] },
];

export default function SchoolsDirectoryPage() {
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('Ø§Ù„ÙƒÙ„');

  const districts = ['Ø§Ù„ÙƒÙ„', '6 Ø£ÙƒØªÙˆØ¨Ø±', 'Ø§Ù„Ø¹Ù…Ø±Ø§Ù†ÙŠØ©', 'Ø§Ù„Ù‡Ø±Ù…', 'ÙÙŠØµÙ„'];
  const filtered = schoolsData.filter(s =>
    (filterDistrict === 'Ø§Ù„ÙƒÙ„' || s.district === filterDistrict) &&
    s.name.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Ø¯Ù„ÙŠÙ„ Ø§Ù„Ù…Ø¯Ø§Ø±Ø³</h1>
        <div className="max-w-2xl mx-auto mb-8 flex flex-wrap gap-4 justify-center">
          <input
            type="text"
            placeholder="Ø§Ø¨Ø­Ø« Ø¹Ù† Ù…Ø¯Ø±Ø³Ø©..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-primary"
          />
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {districts.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(school => (
            <div key={school.id} className="bg-white rounded-xl shadow-md p-5">
              <h2 className="text-xl font-semibold text-primary">{school.name}</h2>
              <p className="text-gray-500 text-sm">{school.type} - {school.district}</p>
              <p className="text-gray-600 mt-2">Ø§Ù„Ù…Ø±Ø§Ø­Ù„: {school.stages.join(' - ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
