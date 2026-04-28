'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { TechCenter } from '@/types/tech-center';

interface MapComponentProps {
  centers: TechCenter[];
  onSelectCenter: (center: TechCenter) => void;
}

export default function MapComponent({ centers, onSelectCenter }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const leafletPromise = useRef<Promise<any> | null>(null);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Dynamically import Leaflet JS
    leafletPromise.current = import('leaflet').then(L => {
      // Fix marker icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      return L;
    });
    leafletPromise.current.then(() => setIsLeafletReady(true));
  }, []);

  // Initialize map once Leaflet is ready
  useEffect(() => {
    if (!isLeafletReady || !mapRef.current || leafletMap.current) return;
    leafletPromise.current?.then(L => {
      leafletMap.current = L.map(mapRef.current).setView([30.0444, 31.2357], 11);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      }).addTo(leafletMap.current);
    });
    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, [isLeafletReady]);

  // Update markers when centers change or map is ready
  useEffect(() => {
    if (!leafletMap.current || !isLeafletReady) return;
    leafletPromise.current?.then(L => {
      // Remove old markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add new markers
      centers.forEach(center => {
        if (center.latitude && center.longitude) {
          const marker = L.marker([center.latitude, center.longitude])
            .addTo(leafletMap.current)
            .bindPopup(`<b>${center.name_ar}</b><br/>اضغط للتفاصيل`);
          marker.on('click', () => onSelectCenter(center));
          markersRef.current.push(marker);
        }
      });

      // Fit bounds if there are markers
      if (markersRef.current.length > 0) {
        const group = L.featureGroup(markersRef.current);
        leafletMap.current.fitBounds(group.getBounds().pad(0.1));
      }
    });
  }, [centers, onSelectCenter, isLeafletReady]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}