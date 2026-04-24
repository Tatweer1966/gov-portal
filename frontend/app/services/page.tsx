'use client';

export const dynamic = 'force-dynamic';



import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Service {
  id: number;
  name_ar: string;
  slug: string;
  description_ar: string;
  is_featured: boolean;
  category_name?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (featuredOnly) params.append('featured', 'true');
      const res = await fetch(`/api/services?${params.toString()}`);
      const data = await res.json();
      if (data.success) setServices(data.data);
      setLoading(false);
    };
    fetchServices();
  }, [search, featuredOnly]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ©</h1>
        <div className="max-w-2xl mx-auto mb-8 flex flex-wrap gap-4 justify-center">
          <input
            type="text"
            placeholder="Ø§Ø¨Ø­Ø« Ø¹Ù† Ø®Ø¯Ù…Ø©..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="rounded text-primary"
            />
            Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ù…Ù…ÙŠØ²Ø© ÙÙ‚Ø·
          </label>
        </div>
        {loading ? (
          <div className="text-center py-12">Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù…ÙŠÙ„...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø®Ø¯Ù…Ø§Øª Ù…Ø·Ø§Ø¨Ù‚Ø©</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 group"
              >
                <h2 className="text-xl font-semibold group-hover:text-primary transition">
                  {service.name_ar}
                </h2>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {service.description_ar || 'Ø§Ø¶ØºØ· Ù„Ø¹Ø±Ø¶ Ø§Ù„ØªÙØ§ØµÙŠÙ„'}
                </p>
                {service.is_featured && (
                  <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Ø®Ø¯Ù…Ø© Ù…Ù…ÙŠØ²Ø©
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
