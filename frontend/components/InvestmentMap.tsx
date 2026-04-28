'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components (no SSR)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface Zone {
  name: string;
  lat: number;
  lng: number;
  land: string;
  incentives: string;
}

export default function InvestmentMap() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // 1. Load Leaflet CSS by adding a <link> tag to the head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // 2. Load Leaflet JavaScript and fix marker icons
    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setMapReady(true);
    }).catch(err => console.error('Leaflet import error', err));

    // 3. Fetch zones from API
    fetch('/api/investment-zones')
      .then(res => res.json())
      .then(data => {
        setZones(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !mapReady) {
    return <div className="h-full w-full flex items-center justify-center bg-gray-100">جاري تحميل الخريطة...</div>;
  }

  if (!loading && zones.length === 0) {
    return <div className="h-full w-full flex items-center justify-center bg-gray-100">لا توجد مناطق استثمارية متاحة</div>;
  }

  return (
    <MapContainer center={[30.0444, 31.2357]} zoom={8} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {zones.map(zone => (
        <Marker key={zone.name} position={[zone.lat, zone.lng]}>
          <Popup>
            <div className="text-right">
              <h3 className="font-bold">{zone.name}</h3>
              <p>المساحة: {zone.land}</p>
              <p>الحوافز: {zone.incentives}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}