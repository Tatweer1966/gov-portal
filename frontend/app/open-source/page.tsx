'use client';

export const dynamic = 'force-dynamic';

const components = [
  { name: 'Next.js', license: 'MIT' }, { name: 'React', license: 'MIT' }, { name: 'Tailwind CSS', license: 'MIT' },
  { name: 'PostgreSQL', license: 'PostgreSQL License' }, { name: 'Redis', license: 'BSD-3-Clause' },
  { name: 'MinIO', license: 'AGPL-3.0' }, { name: 'OpenSearch', license: 'Apache-2.0' },
];

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">Ø§Ù„Ø¨Ø±Ù…Ø¬ÙŠØ§Øª Ù…ÙØªÙˆØ­Ø© Ø§Ù„Ù…ØµØ¯Ø± Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…Ø©</h1>
          <p className="mb-4">Ù‡Ø°Ø§ Ø§Ù„Ù…Ø´Ø±ÙˆØ¹ Ù…Ø¨Ù†ÙŠ Ø¨Ø§Ù„ÙƒØ§Ù…Ù„ Ø¹Ù„Ù‰ Ø¨Ø±Ù…Ø¬ÙŠØ§Øª Ù…ÙØªÙˆØ­Ø© Ø§Ù„Ù…ØµØ¯Ø±. Ù„Ø§ ØªÙˆØ¬Ø¯ Ø£ÙŠ Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ø­ØªÙƒØ§Ø±ÙŠØ©.</p>
          <table className="w-full border-collapse">
            <thead><tr className="bg-gray-100"><th className="border p-2">Ø§Ù„Ù…ÙƒÙˆÙ†</th><th className="border p-2">Ø§Ù„ØªØ±Ø®ÙŠØµ</th></tr></thead>
            <tbody>
              {components.map(c => <tr key={c.name}><td className="border p-2">{c.name}</td><td className="border p-2">{c.license}</td></tr>)}
            </tbody>
          </table>
          <div className="mt-6 bg-green-50 p-4 rounded-lg">
            <p className="text-green-800">âœ… Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø­Ø¨Ø³ ØªÙ‚Ù†ÙŠ â€“ Ø§Ù„Ø¬Ù‡Ø© Ø§Ù„Ù…ØªØ¹Ø§Ù‚Ø¯Ø© ØªÙ…Ù„Ùƒ Ø§Ù„Ø­Ù‚ Ø§Ù„ÙƒØ§Ù…Ù„ ÙÙŠ ØªØ¹Ø¯ÙŠÙ„ ÙˆØªØ´ØºÙŠÙ„ Ø§Ù„Ù†Ø¸Ø§Ù….</p>
          </div>
        </div>
      </div>
    </div>
  );
}
