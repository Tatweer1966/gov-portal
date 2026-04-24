'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TechCenter } from '@/types/tech-center';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  centers: TechCenter[];
  onSelectCenter: (center: TechCenter) => void;
}

export default function MapComponent({ centers, onSelectCenter }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;
    leafletMap.current = L.map(mapRef.current).setView([30.0444, 31.2357], 11);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(leafletMap.current);
    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  useEffect(() => {
    if (!leafletMap.current) return;
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    centers.forEach(center => {
      if (center.latitude && center.longitude) {
        const marker = L.marker([center.latitude, center.longitude])
          .addTo(leafletMap.current!)
          .bindPopup(`<b>${center.name_ar}</b><br/>اضغط للتفاصيل`);
        marker.on('click', () => onSelectCenter(center));
        markersRef.current.push(marker);
      }
    });
    if (centers.length > 0 && markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      leafletMap.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [centers, onSelectCenter]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}