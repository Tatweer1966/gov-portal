'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
// ... rest of the component

// ... rest of your existing code unchanged
import Link from 'next/link';

const programs = [
  { id: 'child-protection', title: 'Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø·ÙÙ„', icon: 'ðŸ‘¶', desc: 'Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø¯Ø¹Ù… ÙˆØ§Ù„Ø­Ù…Ø§ÙŠØ© Ù„Ù„Ø£Ø·ÙØ§Ù„', link: '/social-services/request?type=child_protection', hotline: '16000' },
  { id: 'addiction', title: 'Ù…ÙƒØ§ÙØ­Ø© Ø§Ù„Ø¥Ø¯Ù…Ø§Ù†', icon: 'ðŸ’Š', desc: 'Ø¹Ù„Ø§Ø¬ ÙˆØªØ£Ù‡ÙŠÙ„ Ù…Ø¬Ø§Ù†ÙŠ', link: '/social-services/request?type=addiction', hotline: '16023' },
  { id: 'women', title: 'Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ù…Ø±Ø£Ø©', icon: 'ðŸ‘©', desc: 'Ø­Ù…Ø§ÙŠØ© Ù…Ù† Ø§Ù„Ø¹Ù†Ù Ø§Ù„Ø£Ø³Ø±ÙŠ', link: '/social-services/domestic-violence-report', hotline: '15115' },
  { id: 'elderly', title: 'Ø±Ø¹Ø§ÙŠØ© ÙƒØ¨Ø§Ø± Ø§Ù„Ø³Ù†', icon: 'ðŸ‘´', desc: 'Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„Ù…Ù†Ø²Ù„ÙŠØ©', link: '/social-services/request?type=elderly_care' },
  { id: 'psychological', title: 'Ø§Ù„Ø¯Ø¹Ù… Ø§Ù„Ù†ÙØ³ÙŠ', icon: 'ðŸ§ ', desc: 'Ø¬Ù„Ø³Ø§Øª Ø§Ø³ØªØ´Ø§Ø±ÙŠØ©', link: '/social-services/request?type=psychological_support' },
  { id: 'family', title: 'Ø§Ù„ØªÙˆØ¹ÙŠØ© Ø§Ù„Ø£Ø³Ø±ÙŠØ©', icon: 'ðŸ‘ª', desc: 'Ø¨Ø±Ø§Ù…Ø¬ ØªÙˆØ¹ÙˆÙŠØ©', link: '/social-services/family-counseling' },
];

export default function SocialServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"><span className="text-3xl">ðŸ¤</span></div>
          <h1 className="text-3xl font-bold mb-2">Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ÙŠØ©</h1>
          <p className="text-gray-600">Ø¨Ø±Ø§Ù…Ø¬ Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø£Ø³Ø±Ø© Ø§Ù„Ù…ØµØ±ÙŠØ© â€“ Ø¯Ø¹Ù… ÙˆØ§Ø³ØªØ´Ø§Ø±Ø§Øª Ù…Ø¬Ø§Ù†ÙŠØ©</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-md p-5">
              <div className="text-4xl mb-3">{p.icon}</div>
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <p className="text-gray-600 text-sm my-2">{p.desc}</p>
              {p.hotline && <div className="bg-green-50 text-green-700 text-sm p-2 rounded mb-3">Ø§Ù„Ø®Ø· Ø§Ù„Ø³Ø§Ø®Ù†: {p.hotline}</div>}
              <Link href={p.link} className="inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90">ØªÙ‚Ø¯ÙŠÙ… Ø·Ù„Ø¨</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
