TRUNCATE public.governorate_news;
INSERT INTO public.governorate_news (news_number, title_ar, summary_ar, content_ar, category, priority, is_featured, published_at) VALUES
('NEWS-001', 'افتتاح مشروع تطوير الطرق', 'تم افتتاح المرحلة الأولى من تطوير الطرق', 'تفاصيل المشروع...', 'خدمات', 1, true, NOW()),
('NEWS-002', 'إطلاق حملة نظافة', 'حملة نظافة كبرى في جميع الأحياء', 'تفاصيل الحملة...', 'خدمات', 0, true, NOW()),
('NEWS-003', 'محافظ الجيزة يفتتح معرض الكتاب', 'افتتح المحافظ معرض الكتاب في دورته الـ15', 'تفاصيل المعرض...', 'ثقافة', 1, true, NOW());
