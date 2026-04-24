export interface TechCenter {
  id: number;
  name_ar: string;
  district: string;
  address_ar: string;
  phone: string;
  working_hours_ar: string;
  latitude: number;
  longitude: number;
  services: { id: number; name_ar: string }[];
}
