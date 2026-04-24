-- ============================================
-- APP DATABASE SEED
-- ============================================
\connect govportal_app;

-- ============================================
-- SEED DATA FOR GOVERNMENT PORTAL
-- ============================================

-- ============================================
-- 1. SERVICE CATEGORIES
-- ============================================
INSERT INTO public.service_categories (name_ar, name_en, slug, icon, display_order) VALUES
('التراخيص والتصاريح', 'Permits & Licenses', 'permits', '📋', 1),
('الخدمات الصحية', 'Health Services', 'health', '🏥', 2),
('الخدمات الاجتماعية', 'Social Services', 'social', '🤝', 3),
('الخدمات التعليمية', 'Educational Services', 'education', '📚', 4),
('الخدمات العقارية', 'Property Services', 'property', '🏠', 5),
('المرافق والبنية التحتية', 'Utilities & Infrastructure', 'utilities', '⚡', 6),
('سوق المحافظة', 'Marketplace', 'marketplace', '🛒', 7),
('بوابة التوظيف', 'Job Portal', 'jobs', '💼', 8),
('رعاية الموهوبين', 'Gifted & Talented', 'gifted', '🌟', 9),
('المراكز التكنولوجية', 'Tech Centers', 'tech-centers', '💻', 10)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. SERVICES
-- ============================================
INSERT INTO public.services (
    service_code, name_ar, name_en, slug, category_id,
    description_ar, description_en,
    fees_ar, fees_en,
    processing_time_ar, processing_time_en,
    service_type, is_featured
) VALUES
(
    'PRM-001', 'رخصة بناء جديدة', 'New Building Permit', 'building-permit',
    (SELECT id FROM public.service_categories WHERE slug = 'permits'),
    'إصدار رخصة بناء جديدة وفقاً للقانون.', 'Issue a new building permit.',
    '500 جنيه + 15 جنيه/م²', 'EGP 500 + EGP 15/m²',
    '30 يوم عمل', '30 business days',
    'hybrid', true
),
(
    'HLT-001', 'العلاج على نفقة الدولة', 'State-Funded Treatment', 'state-funded-treatment',
    (SELECT id FROM public.service_categories WHERE slug = 'health'),
    'تقديم طلب علاج على نفقة الدولة.', 'Apply for state-funded medical treatment.',
    'مجاني', 'Free',
    '30 يوم عمل', '30 business days',
    'online', true
),
(
    'HLT-002', 'التأمين الصحي الشامل', 'Comprehensive Health Insurance', 'health-insurance',
    (SELECT id FROM public.service_categories WHERE slug = 'health'),
    'التسجيل في منظومة التأمين الصحي الشامل.', 'Register for comprehensive health insurance.',
    'حسب الشريحة', 'Depends on bracket',
    '21 يوم عمل', '21 business days',
    'online', true
),
(
    'PRP-001', 'الرقم القومي الموحد للعقار', 'Unified Property Number', 'unified-property-number',
    (SELECT id FROM public.service_categories WHERE slug = 'property'),
    'الحصول على الرقم القومي الموحد للعقار.', 'Obtain unified property number.',
    '500 جنيه', 'EGP 500',
    '21 يوم عمل', '21 business days',
    'online', true
),
(
    'TECH-001', 'المراكز التكنولوجية', 'Tech Centers', 'tech-centers',
    (SELECT id FROM public.service_categories WHERE slug = 'tech-centers'),
    'حجز موعد في المراكز التكنولوجية.', 'Book an appointment at a tech center.',
    'مجاني', 'Free',
    '24 ساعة', '24 hours',
    'online', true
)
ON CONFLICT (service_code) DO NOTHING;

-- ============================================
-- 3. USERS
-- ============================================
INSERT INTO public.users (username, email, national_id, phone, password_hash, role, governorate, email_verified) VALUES
('ahmed_mohamed', 'ahmed@demo.com', '12345678901234', '01234567890', 'hashed_demo_password', 'citizen', 'giza', true),
('sara_hassan', 'sara@demo.com', '12345678905678', '01234567891', 'hashed_demo_password', 'citizen', 'alexandria', true),
('author_giza', 'author.giza@demo.com', NULL, NULL, 'hashed_demo_password', 'author', 'giza', true),
('reviewer_giza', 'reviewer.giza@demo.com', NULL, NULL, 'hashed_demo_password', 'reviewer', 'giza', true),
('publisher_giza', 'publisher.giza@demo.com', NULL, NULL, 'hashed_demo_password', 'publisher', 'giza', true),
('admin_giza', 'admin.giza@demo.com', NULL, NULL, 'hashed_demo_password', 'governorate_admin', 'giza', true),
('super_admin', 'super.admin@demo.com', NULL, NULL, 'hashed_demo_password', 'super_admin', NULL, true)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- 4. THEMES
-- ============================================
INSERT INTO public.governorate_themes (governorate_slug, primary_color, secondary_color, logo_url, footer_text_ar, is_custom) VALUES
('giza', '#8B4513', '#D2691E', '/images/giza-logo.png', 'محافظة الجيزة – دار الضيافة', true),
('alexandria', '#1E3A8A', '#3B82F6', '/images/alex-logo.png', 'محافظة الإسكندرية – عروس البحر', true)
ON CONFLICT (governorate_slug) DO NOTHING;

-- ============================================
-- 5. NEWS
-- ============================================
INSERT INTO public.governorate_news (news_number, title_ar, summary_ar, content_ar, category, priority, is_featured, published_at) VALUES
('NEWS-001', 'محافظ الجيزة يفتتح معرض الكتاب', 'افتتح محافظ الجيزة اليوم معرض الكتاب.', 'تفاصيل الخبر...', 'ثقافة', 1, true, NOW() - INTERVAL '12 hours'),
('NEWS-002', 'بدء تلقي طلبات التصالح', 'أعلنت المحافظة عن بدء تلقي طلبات التصالح.', 'تفاصيل الخبر...', 'خدمات', 0, false, NOW() - INTERVAL '30 hours')
ON CONFLICT (news_number) DO NOTHING;

-- ============================================
-- 6. EVENTS
-- ============================================
INSERT INTO public.governorate_events (event_number, title_ar, event_type, description_ar, start_date, end_date, location_ar, is_free, status) VALUES
('EV-001', 'مهرجان الجيزة للثقافة والفنون', 'festival', 'مهرجان ثقافي وفني.', '2026-10-15', '2026-10-25', 'منطقة الأهرامات', false, 'upcoming'),
('EV-002', 'معرض الجيزة للكتاب', 'festival', 'معرض دولي للكتاب.', '2026-04-20', '2026-04-30', 'أرض المعارض', false, 'upcoming'),
('EV-003', 'ماراثون الجيزة الرياضي', 'sports', 'ماراثون سنوي.', '2026-12-20', '2026-12-20', 'شارع النيل', false, 'upcoming')
ON CONFLICT (event_number) DO NOTHING;

-- ============================================
-- 7. MARKETPLACE CATEGORIES
-- ============================================
INSERT INTO public.marketplace_categories (name_ar, name_en, icon, display_order) VALUES
('منتجات غذائية', 'Food Products', '🍎', 1),
('ملابس وأزياء', 'Clothing', '👕', 2),
('أثاث منزلي', 'Furniture', '🛋️', 3),
('إلكترونيات', 'Electronics', '📱', 4),
('خدمات مهنية', 'Professional Services', '💼', 5)
ON CONFLICT (name_ar) DO NOTHING;

-- ============================================
-- 8. JOB CATEGORIES
-- ============================================
INSERT INTO public.job_categories (name_ar, name_en, icon) VALUES
('تكنولوجيا المعلومات', 'IT', '💻'),
('الهندسة', 'Engineering', '🔧'),
('التعليم', 'Education', '📚'),
('الطب والتمريض', 'Healthcare', '🏥'),
('المبيعات', 'Sales', '📊')
ON CONFLICT (name_ar) DO NOTHING;

-- ============================================
-- 9. TALENT CATEGORIES
-- ============================================
INSERT INTO public.talent_categories (name_ar, name_en, description_ar, assessment_methods) VALUES
('موهبة علمية (STEM)', 'STEM Talent', 'الطلاب المتميزون في العلوم والتكنولوجيا والهندسة والرياضيات', ARRAY['اختبار STEM', 'مشاريع بحثية']),
('موهبة أدبية', 'Literary Talent', 'الطلاب المتميزون في الكتابة والشعر', ARRAY['تقييم كتابي', 'مسابقة إلقاء شعر']),
('موهبة فنية', 'Artistic Talent', 'الطلاب المتميزون في الرسم والموسيقى', ARRAY['تقييم أعمال', 'اختبار أداء'])
ON CONFLICT (name_ar) DO NOTHING;

-- ============================================
-- 10. CHATBOT TRAINING
-- ============================================
INSERT INTO public.chatbot_training_data (question, answer, category, keywords) VALUES
('كيف أحصل على ترخيص بناء؟', 'يمكنك التقديم عبر خدمة رخصة بناء جديدة.', 'permits', ARRAY['ترخيص', 'بناء', 'رخصة']),
('كيف أتقدم للعلاج على نفقة الدولة؟', 'يمكنك التقديم عبر خدمة العلاج على نفقة الدولة.', 'health', ARRAY['علاج', 'نفقة الدولة', 'صحة']),
('ما هي مواعيد عمل المراكز التكنولوجية؟', 'المراكز التكنولوجية تعمل من الأحد إلى الخميس من 9 صباحاً حتى 5 مساءً.', 'tech centers', ARRAY['مركز تكنولوجي', 'مواعيد'])
ON CONFLICT DO NOTHING;

-- ============================================
-- 11. TECH CENTERS
-- ============================================
INSERT INTO public.tech_centers (
    name_ar, name_en, governorate, district,
    address_ar, address_en, latitude, longitude,
    phone, working_hours_ar, working_hours_en
) VALUES
(
    'مركز تكنولوجي بالجيزة - العمرانية',
    'Tech Center - Omraneya',
    'الجيزة',
    'العمرانية',
    'شارع جامعة الدول العربية، بجوار مجلس مدينة العمرانية',
    'Gamet El Dowal St., next to Omraneya city council',
    30.0315,
    31.2112,
    '02-12345678',
    'الأحد - الخميس: 9 ص - 5 م',
    'Sunday - Thursday: 9 AM - 5 PM'
),
(
    'مركز تكنولوجي بالجيزة - الهرم',
    'Tech Center - Haram',
    'الجيزة',
    'الهرم',
    'شارع خاتم المرسلين، بجوار مكتب بريد الهرم',
    'Khatem El Morsaleen St., next to Haram post office',
    29.9872,
    31.2119,
    '02-12345679',
    'الأحد - الخميس: 9 ص - 5 م',
    'Sunday - Thursday: 9 AM - 5 PM'
)
ON CONFLICT (name_ar) DO NOTHING;

-- ============================================
-- 12. TECH SERVICES
-- ============================================
INSERT INTO public.tech_services (name_ar, name_en, description_ar, description_en, estimated_duration_minutes, fee_ar, fee_en) VALUES
('استخراج بطاقة رقم قومي', 'National ID Card Issuance', 'إصدار بطاقة الرقم القومي', 'Issue national ID card', 30, '50 جنيه', 'EGP 50'),
('تجديد بطاقة رقم قومي', 'National ID Card Renewal', 'تجديد بطاقة الرقم القومي', 'Renew national ID card', 20, '50 جنيه', 'EGP 50'),
('استخراج قيد عائلي', 'Family Registry Extract', 'استخراج قيد عائلي', 'Issue family registry extract', 15, 'مجاني', 'Free')
ON CONFLICT (name_ar) DO NOTHING;

INSERT INTO public.center_services (center_id, service_id)
SELECT c.id, s.id
FROM public.tech_centers c
CROSS JOIN public.tech_services s
ON CONFLICT DO NOTHING;

-- ============================================
-- 13. VOLUNTEERS
-- ============================================
INSERT INTO public.golden_citizen_volunteers (
    volunteer_code, full_name, national_id, phone,
    profession, specialization, bio, governorate, district, status, verified
) VALUES
('VOL-001', 'د. أحمد محمود', '12345678901234', '01234567890', 'طبيب', 'أطفال', 'أخصائي أطفال بخبرة 10 سنوات', 'الجيزة', 'الهرم', 'approved', true),
('VOL-002', 'أستاذة فاطمة علي', '12345678905678', '01234567891', 'مدرس', 'لغة عربية', 'مدرسة لغة عربية بخبرة 15 سنة', 'الجيزة', 'العمرانية', 'approved', true)
ON CONFLICT (volunteer_code) DO NOTHING;

-- ============================================
-- 14. JOB LISTINGS
-- ============================================
INSERT INTO public.job_listings (
    job_number, employer_id, category_id, title_ar, description_ar,
    location, governorate, employment_type, salary_from, salary_to, application_deadline
) VALUES
(
    'JOB-001',
    NULL,
    (SELECT id FROM public.job_categories WHERE name_ar = 'تكنولوجيا المعلومات'),
    'مطور برمجيات',
    'مطلوب مطور برمجيات للعمل على بوابة المحافظة',
    'الجيزة',
    'الجيزة',
    'full_time',
    8000,
    12000,
    '2026-12-31'
),
(
    'JOB-002',
    NULL,
    (SELECT id FROM public.job_categories WHERE name_ar = 'التعليم'),
    'مدرسة لغة عربية',
    'مطلوب مدرسة لغة عربية للمرحلة الإعدادية',
    'الجيزة',
    'الجيزة',
    'full_time',
    5000,
    7000,
    '2026-12-31'
)
ON CONFLICT (job_number) DO NOTHING;

-- ============================================
-- 15. GOVERNMENT DOCUMENTS
-- ============================================
INSERT INTO public.government_documents (title_ar, category, file_url, file_size, publish_date) VALUES
('تقرير التنمية البشرية لمحافظة الجيزة 2025', 'report', '/docs/human-dev-report-2025.pdf', 2048, '2025-01-15'),
('موازنة المحافظة للعام المالي 2025/2026', 'statistic', '/docs/budget-2025-26.pdf', 1024, '2025-02-01'),
('قانون التصالح في مخالفات البناء رقم 187 لسنة 2023', 'law', '/docs/law-187-2023.pdf', 512, '2023-06-01')
ON CONFLICT DO NOTHING;

-- ============================================
-- 16. Q&A
-- ============================================
INSERT INTO public.governor_qa_questions (question_number, user_type, user_name, question_text, category, status) VALUES
('Q-001', 'citizen', 'أحمد محمد', 'ما هي خطوات استخراج ترخيص بناء جديد؟', 'خدمية', 'answered'),
('Q-002', 'investor', 'شركة النيل', 'ما هي الحوافز الاستثمارية المقدمة؟', 'استثمارية', 'answered')
ON CONFLICT (question_number) DO NOTHING;

INSERT INTO public.governor_qa_answers (question_id, answer_text, answered_by, answered_by_title, is_published)
SELECT
    q.id,
    'يمكنك التقديم عبر خدمة رخصة البناء في بوابة المحافظة.',
    'د. أحمد سعيد',
    'محافظ الجيزة',
    true
FROM public.governor_qa_questions q
WHERE q.question_number = 'Q-001'
ON CONFLICT (question_id) DO NOTHING;

-- ============================================
-- 17. MARKETPLACE LISTINGS
-- ============================================
INSERT INTO public.marketplace_listings (
    listing_number, user_id, category_id, title_ar, description_ar,
    price, governorate, district, contact_phone, status
) VALUES
(
    'LST-001',
    (SELECT id FROM public.users WHERE username = 'ahmed_mohamed'),
    (SELECT id FROM public.marketplace_categories WHERE name_ar = 'منتجات غذائية'),
    'عسل نحل طبيعي',
    'عسل نحل طبيعي 100% إنتاج منزلي',
    250,
    'الجيزة',
    'الهرم',
    '01234567890',
    'active'
),
(
    'LST-002',
    (SELECT id FROM public.users WHERE username = 'ahmed_mohamed'),
    (SELECT id FROM public.marketplace_categories WHERE name_ar = 'خدمات مهنية'),
    'دروس خصوصية لغة عربية',
    'مدرس لغة عربية خبرة 10 سنوات',
    150,
    'الجيزة',
    'العمرانية',
    '01234567891',
    'active'
)
ON CONFLICT (listing_number) DO NOTHING;

-- ============================================
-- 18. SAFE TRIGGER RECREATION
-- ============================================
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_applications_updated_at ON public.service_applications;
CREATE TRIGGER update_service_applications_updated_at
BEFORE UPDATE ON public.service_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_complaints_updated_at ON public.complaints;
CREATE TRIGGER update_complaints_updated_at
BEFORE UPDATE ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_marketplace_listings_updated_at ON public.marketplace_listings;
CREATE TRIGGER update_marketplace_listings_updated_at
BEFORE UPDATE ON public.marketplace_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_applications_updated_at ON public.job_applications;
CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_assistance_updated_at ON public.social_assistance_requests;
CREATE TRIGGER update_social_assistance_updated_at
BEFORE UPDATE ON public.social_assistance_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reconciliation_updated_at ON public.building_violation_reconciliation;
CREATE TRIGGER update_reconciliation_updated_at
BEFORE UPDATE ON public.building_violation_reconciliation
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_possession_updated_at ON public.hand_possession_legalization;
CREATE TRIGGER update_possession_updated_at
BEFORE UPDATE ON public.hand_possession_legalization
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_governorate_news_updated_at ON public.governorate_news;
CREATE TRIGGER update_governorate_news_updated_at
BEFORE UPDATE ON public.governorate_news
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_governorate_events_updated_at ON public.governorate_events;
CREATE TRIGGER update_governorate_events_updated_at
BEFORE UPDATE ON public.governorate_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_gifted_applications_updated_at ON public.gifted_applications;
CREATE TRIGGER update_gifted_applications_updated_at
BEFORE UPDATE ON public.gifted_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_governor_qa_questions_updated_at ON public.governor_qa_questions;
CREATE TRIGGER update_governor_qa_questions_updated_at
BEFORE UPDATE ON public.governor_qa_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_state_funding_treatment_requests_updated_at ON public.state_funding_treatment_requests;
CREATE TRIGGER update_state_funding_treatment_requests_updated_at
BEFORE UPDATE ON public.state_funding_treatment_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_comprehensive_health_insurance_requests_updated_at ON public.comprehensive_health_insurance_requests;
CREATE TRIGGER update_comprehensive_health_insurance_requests_updated_at
BEFORE UPDATE ON public.comprehensive_health_insurance_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_golden_citizen_volunteers_updated_at ON public.golden_citizen_volunteers;
CREATE TRIGGER update_golden_citizen_volunteers_updated_at
BEFORE UPDATE ON public.golden_citizen_volunteers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_golden_citizen_requests_updated_at ON public.golden_citizen_requests;
CREATE TRIGGER update_golden_citizen_requests_updated_at
BEFORE UPDATE ON public.golden_citizen_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tech_centers_updated_at ON public.tech_centers;
CREATE TRIGGER update_tech_centers_updated_at
BEFORE UPDATE ON public.tech_centers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_bookings_updated_at ON public.service_bookings;
CREATE TRIGGER update_service_bookings_updated_at
BEFORE UPDATE ON public.service_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();