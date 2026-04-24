'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const zones = [
  { name: 'منطقة 6 أكتوبر الصناعية', lat: 29.9375, lng: 30.9297, incentives: 'إعفاء ضريبي 50% لمدة 5 سنوات', land: '500 فدان' },
  { name: 'منطقة العبور الصناعية', lat: 30.1267, lng: 31.4365, incentives: 'تسهيلات ائتمانية', land: '300 فدان' },
  { name: 'منطقة بدر الزراعية', lat: 30.1378, lng: 31.7167, incentives: 'دعم تقني وأسمدة مدعومة', land: '1000 فدان' },
];

export default function InvestmentMap() {
  return (
    <MapContainer center={[30.0444, 31.2357]} zoom={8} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {zones.map(zone => (
        <Marker key={zone.name} position={[zone.lat, zone.lng]}>
          <Popup><div className="text-right"><h3 className="font-bold">{zone.name}</h3><p>المساحة: {zone.land}</p><p>الحوافز: {zone.incentives}</p></div></Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
