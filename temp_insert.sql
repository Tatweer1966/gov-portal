SET client_encoding = 'UTF8';
INSERT INTO public.services (service_code, name_ar, slug, category_id, description_ar, fees_ar, processing_time_ar, service_type, is_featured) VALUES
('PRM-001', 'رخصة بناء جديدة', 'building-permit', 1, 'إصدار رخصة بناء جديدة وفقاً لقانون 119 لسنة 2008', '500 جنيه + 15 جنيه/م²', '30 يوم عمل', 'hybrid', true),
('PRM-002', 'بيان صلاحية الموقع', 'site-suitability', 1, 'بيان يثبت صلاحية الموقع للبناء', '250 جنيه', '15 يوم عمل', 'online', true),
('HLT-001', 'العلاج على نفقة الدولة', 'state-funded-treatment', 2, 'تقديم طلب علاج على نفقة الدولة', 'مجاني', '30 يوم عمل', 'online', true),
('SOC-001', 'حماية الطفل', 'child-protection', 3, 'خدمات الدعم والحماية للأطفال', 'مجاني', '24 ساعة', 'online', true),
('EDU-001', 'دليل المدارس', 'schools-directory', 4, 'دليل شامل للمدارس في المحافظة', 'مجاني', 'فوري', 'online', true)
ON CONFLICT (service_code) DO NOTHING;
