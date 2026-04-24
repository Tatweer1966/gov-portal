-- ============================================
-- DEMO ENRICHMENT FOR APP DATABASE
-- ============================================
\connect govportal_app;

-- ============================================
-- 1. SERVICES
-- ============================================
INSERT INTO public.services (
    service_code, name_ar, name_en, slug, category_id,
    description_ar, fees_ar, processing_time_ar, service_type, is_featured
)
SELECT
    v.service_code,
    v.name_ar,
    v.name_en,
    v.slug,
    sc.id,
    v.description_ar,
    v.fees_ar,
    v.processing_time_ar,
    v.service_type,
    v.is_featured
FROM (
    VALUES
    ('PRM-003', 'رخصة هدم', 'Demolition Permit', 'demolition-permit', 'permits', 'تصريح لهدم المباني الآيلة للسقوط', '250 جنيه', '15 يوم عمل', 'online', false),
    ('PRM-004', 'رخصة كهرباء', 'Electrical Permit', 'electrical-permit', 'permits', 'تصريح لتركيب وتوصيل الكهرباء', '150 جنيه', '10 يوم عمل', 'online', true),
    ('PRM-005', 'رخصة سباكة', 'Plumbing Permit', 'plumbing-permit', 'permits', 'تصريح لأعمال السباكة والصرف الصحي', '150 جنيه', '10 يوم عمل', 'online', false),
    ('PRM-006', 'رخصة تكييف', 'HVAC Permit', 'hvac-permit', 'permits', 'تصريح لتركيب أجهزة التكييف المركزية', '300 جنيه', '14 يوم عمل', 'online', false),
    ('PRM-007', 'رخصة أسوار', 'Fence Permit', 'fence-permit', 'permits', 'تصريح لبناء الأسوار والبوابات', '100 جنيه', '7 يوم عمل', 'online', false),
    ('PRM-008', 'رخصة أسطح', 'Roofing Permit', 'roofing-permit', 'permits', 'تصريح لأعمال الأسطح والعزل', '200 جنيه', '10 يوم عمل', 'online', false),
    ('PRM-009', 'رخصة رافعات', 'Crane Permit', 'crane-permit', 'permits', 'تصريح تشغيل الرافعات في مواقع البناء', '500 جنيه', '20 يوم عمل', 'in_person', false),
    ('PRM-010', 'رخصة لافتات', 'Sign Permit', 'sign-permit', 'permits', 'تصريح لتركيب اللافتات الإعلانية', '100 جنيه', '5 يوم عمل', 'online', true),
    ('PRM-011', 'رخصة مصاعد', 'Elevator Permit', 'elevator-permit', 'permits', 'تصريح تركيب وصيانة المصاعد', '400 جنيه', '15 يوم عمل', 'in_person', false),
    ('HLT-003', 'تطعيم السفر', 'Travel Vaccination', 'travel-vaccination', 'health', 'خدمة تطعيم المسافرين ضد الأمراض', 'مجاني', 'فوري', 'online', true),
    ('HLT-004', 'الكشف الطبي للمدارس', 'School Medical Checkup', 'school-medical', 'health', 'فحص طبي للطلاب قبل بدء العام الدراسي', '50 جنيه', '3 أيام', 'online', false),
    ('SOC-003', 'الدعم النفسي للشباب', 'Youth Psychological Support', 'youth-psych', 'social', 'جلسات دعم نفسي للشباب', 'مجاني', '48 ساعة', 'online', true),
    ('SOC-004', 'مكافحة التنمر', 'Anti-Bullying', 'anti-bullying', 'social', 'برنامج توعوي ودعم لضحايا التنمر', 'مجاني', 'فوري', 'online', false),
    ('EDU-003', 'منحة التفوق', 'Excellence Scholarship', 'scholarship', 'education', 'تقديم طلب الحصول على منحة التفوق', 'مجاني', '30 يوم', 'online', true),
    ('EDU-004', 'تسجيل طالب جديد', 'New Student Registration', 'new-student', 'education', 'تسجيل الطلاب المستجدين في المدارس', 'مجاني', '14 يوم', 'online', true),
    ('PRP-003', 'تعديل بيانات عقار', 'Property Data Update', 'property-update', 'property', 'تعديل البيانات المسجلة للعقار', '100 جنيه', '7 أيام', 'online', false),
    ('PRP-004', 'إلغاء تسجيل عقار', 'Property De-registration', 'property-dereg', 'property', 'إلغاء تسجيل عقار من السجل العقاري', '50 جنيه', '10 أيام', 'online', false),
    ('UTL-002', 'توصيل غاز طبيعي', 'Natural Gas Connection', 'gas-connection', 'utilities', 'طلب توصيل خدمة الغاز الطبيعي', 'حسب المقايسة', '21 يوم', 'online', true),
    ('UTL-003', 'توصيل إنترنت', 'Internet Connection', 'internet-connection', 'utilities', 'طلب توصيل خدمة الإنترنت فائق السرعة', 'مجاني', '7 أيام', 'online', false),
    ('UTL-004', 'تغيير عداد كهرباء', 'Electricity Meter Replacement', 'meter-change', 'utilities', 'طلب تغيير عداد الكهرباء', '100 جنيه', '5 أيام', 'online', false)
) AS v(service_code, name_ar, name_en, slug, category_slug, description_ar, fees_ar, processing_time_ar, service_type, is_featured)
JOIN public.service_categories sc
  ON sc.slug = v.category_slug
ON CONFLICT (service_code) DO NOTHING;

-- ============================================
-- 2. GOVERNORATE NEWS
-- ============================================
INSERT INTO public.governorate_news (
    news_number, title_ar, summary_ar, content_ar, category, priority, is_featured, published_at
)
SELECT *
FROM (
    VALUES
    ('NEWS-004', 'افتتاح حديقة جديدة بالهرم', 'افتتح محافظ الجيزة حديقة عامة جديدة بمنطقة الهرم', 'تفاصيل الحديقة الجديدة وخدماتها للمواطنين...', 'خدمات', 0, true, NOW()),
    ('NEWS-005', 'ندوة عن ترشيد استهلاك المياه', 'نظمت شركة المياه ندوة توعوية في مدرسة النيل', 'تم تناول سبل ترشيد الاستهلاك وأهمية الحفاظ على المياه...', 'بيئة', 0, false, NOW()),
    ('NEWS-006', 'فوز فرق الجيزة ببطولة الجمهورية للكاراتيه', 'حقق فريق الجيزة المركز الأول في بطولة الجمهورية للكاراتيه', 'فوز مستحق بعد منافسة قوية مع فرق المحافظات...', 'رياضة', 1, true, NOW()),
    ('NEWS-007', 'غداً إجازة رسمية بمناسبة عيد العمال', 'أعلنت المحافظة تعطيل العمل غداً', 'بمناسبة عيد العمال المبارك...', 'عامة', 0, false, NOW()),
    ('NEWS-008', 'إطلاق حملة نظافة كبرى', 'أطلقت المحافظة حملة نظافة شملت جميع الأحياء', 'بمشاركة المتطوعين وشركات النظافة...', 'خدمات', 0, true, NOW()),
    ('NEWS-009', 'افتتاح معرض الجيزة للكتاب', 'افتتح معرض الكتاب في دورته الـ20', 'بمشاركة 200 دار نشر مصرية وعربية...', 'ثقافة', 1, true, NOW()),
    ('NEWS-010', 'القبض على تشكيل عصابي', 'تمكنت الأجهزة الأمنية من القبض على 5 متهمين', 'متخصصين في سرقة السيارات...', 'أمن', 1, false, NOW()),
    ('NEWS-011', 'بدء التقديم لرياض الأطفال', 'أعلنت المديرية بدء تلقي طلبات التقديم لمرحلة KG1', 'التقديم إلكترونياً عبر بوابة المحافظة...', 'تعليم', 1, true, NOW()),
    ('NEWS-012', 'مبادرة دعم الشباب', 'إطلاق مبادرة لدعم الشباب المقبلين على الزواج', 'قروض ميسرة ودورات تأهيلية...', 'اجتماعي', 0, true, NOW()),
    ('NEWS-013', 'تطوير مستشفى الهرم', 'انتهاء المرحلة الأولى من تطوير مستشفى الهرم', 'إضافة أقسام جديدة ورفع كفاءة الخدمات...', 'صحة', 0, false, NOW()),
    ('NEWS-014', 'ندوة عن العنف الأسري', 'ندوة توعوية بالتعاون مع المجلس القومي للمرأة', 'طرق التبليغ عن حالات العنف...', 'اجتماعي', 1, true, NOW()),
    ('NEWS-015', 'افتتاح طريق الجيزة - الفيوم', 'افتتاح الطريق الجديد بطول 50 كم', 'يخدم 3 ملايين مواطن...', 'خدمات', 0, true, NOW()),
    ('NEWS-016', 'مسابقة حفظ القرآن', 'إعلان نتائج مسابقة حفظ القرآن الكريم', 'فوز 20 طالباً من مختلف الإدارات...', 'ديني', 0, false, NOW()),
    ('NEWS-017', 'دورة تدريبية للمعلمين', 'دورة تدريبية عن تطوير مهارات المعلمين', 'بمشاركة 500 معلم من المحافظة...', 'تعليم', 0, true, NOW()),
    ('NEWS-018', 'معرض المنتجات الحرفية', 'معرض للحرف اليدوية والمنتجات البيئية', 'بمشاركة 50 عارضاً...', 'اقتصاد', 0, false, NOW()),
    ('NEWS-019', 'مبادرة الكشف المبكر عن الأمراض', 'قافلة طبية مجانية بالهرم', 'الكشف المبكر عن الضغط والسكر...', 'صحة', 1, true, NOW()),
    ('NEWS-020', 'تكريم أوائل الثانوية العامة', 'تكريم الطلاب الأوائل في شهادة الثانوية العامة', 'بحضور المحافظ ومدير المديرية...', 'تعليم', 1, true, NOW()),
    ('NEWS-021', 'مسابقة أفضل حديقة', 'إعلان نتائج مسابقة أفضل حديقة بحي', 'فوز حديقة الأورمان بالمركز الأول...', 'بيئة', 0, false, NOW()),
    ('NEWS-022', 'افتتاح مركز شباب جديد', 'افتتاح مركز شباب فيصل بعد تطويره', 'يشمل ملاعب وحمام سباحة...', 'رياضة', 0, true, NOW()),
    ('NEWS-023', 'قافلة بيطرية مجانية', 'قافلة بيطرية لعلاج الماشية', 'بالتعاون مع مديرية الطب البيطري...', 'خدمات', 0, false, NOW())
) AS v(news_number, title_ar, summary_ar, content_ar, category, priority, is_featured, published_at)
ON CONFLICT (news_number) DO NOTHING;

-- ============================================
-- 3. EVENTS
-- ============================================
INSERT INTO public.governorate_events (
    event_number, title_ar, event_type, description_ar, start_date, end_date, location_ar, is_free, status
)
SELECT *
FROM (
    VALUES
    ('EV-004', 'ليالي الجيزة الرمضانية', 'religious', 'فعاليات دينية وثقافية خلال شهر رمضان', '2025-03-01'::date, '2025-03-30'::date, 'حديقة الأورمان', true, 'upcoming'),
    ('EV-005', 'مؤتمر الاستثمار العقاري', 'conference', 'لقاء المستثمرين والجهات الحكومية', '2025-11-10'::date, '2025-11-12'::date, 'مركز المنارة', false, 'upcoming'),
    ('EV-006', 'معرض الجيزة للصناعات الغذائية', 'festival', 'عرض المنتجات الغذائية المحلية', '2025-12-01'::date, '2025-12-05'::date, 'أرض المعارض', false, 'upcoming'),
    ('EV-007', 'ماراثون الجيزة الدولي', 'sports', 'ماراثون بمشاركة دولية', '2025-12-20'::date, '2025-12-20'::date, 'شارع النيل', false, 'upcoming'),
    ('EV-008', 'حفل عيد الفلاح', 'festival', 'احتفالية عيد الفلاح المصري', '2025-09-09'::date, '2025-09-09'::date, 'مجمع الإصدارات', true, 'upcoming'),
    ('EV-009', 'ندوة التغيرات المناخية', 'conference', 'ندوة علمية حول التغيرات المناخية', '2025-10-05'::date, '2025-10-05'::date, 'قاعة المؤتمرات', true, 'upcoming'),
    ('EV-010', 'معرض الجيزة للكتاب', 'festival', 'الدورة الـ15 لمعرض الكتاب', '2025-04-20'::date, '2025-04-30'::date, 'أرض المعارض', false, 'upcoming'),
    ('EV-011', 'بطولة الجيزة للشطرنج', 'sports', 'بطولة مفتوحة للشطرنج', '2025-11-15'::date, '2025-11-17'::date, 'نادي الصيد', false, 'upcoming'),
    ('EV-012', 'مهرجان الجيزة للفيلم القصير', 'festival', 'عرض أفلام قصيرة لشباب المخرجين', '2025-12-10'::date, '2025-12-12'::date, 'سينما الهناجر', false, 'upcoming'),
    ('EV-013', 'يوم اليتيم', 'social', 'احتفالية لأطفال دور الأيتام', '2025-04-01'::date, '2025-04-01'::date, 'حديقة الأهرامات', true, 'upcoming'),
    ('EV-014', 'ملتقى التوظيف السنوي', 'conference', 'لقاء بين الشركات والباحثين عن عمل', '2025-05-20'::date, '2025-05-21'::date, 'مركز المنارة', true, 'upcoming'),
    ('EV-015', 'معرض المنتجات الحرفية', 'festival', 'منتجات الأسر المنتجة', '2025-06-15'::date, '2025-06-20'::date, 'شارع فيصل', true, 'upcoming'),
    ('EV-016', 'ورشة عمل السلامة المنزلية', 'workshop', 'توعية ربات البيوت', '2025-07-10'::date, '2025-07-10'::date, 'مركز تدريب', true, 'upcoming'),
    ('EV-017', 'مهرجان الموسيقى العربية', 'concert', 'حفلات لكبار المطربين', '2025-08-20'::date, '2025-08-25'::date, 'دار الأوبرا', false, 'upcoming'),
    ('EV-018', 'بطولة الجيزة للكاراتيه', 'sports', 'بطولة المحافظة للكاراتيه', '2025-09-25'::date, '2025-09-27'::date, 'الصالة المغطاة', false, 'upcoming'),
    ('EV-019', 'معرض الزهور', 'festival', 'معرض الزهور والنباتات', '2025-10-10'::date, '2025-10-15'::date, 'حديقة الأورمان', true, 'upcoming'),
    ('EV-020', 'ندوة مكافحة الفساد', 'conference', 'دور المجتمع المدني في مكافحة الفساد', '2025-11-05'::date, '2025-11-05'::date, 'ديوان عام المحافظة', true, 'upcoming'),
    ('EV-021', 'مهرجان الجيزة للفنون التشكيلية', 'festival', 'معرض فني لفنانين الجيزة', '2025-12-01'::date, '2025-12-10'::date, 'قصر الفنون', true, 'upcoming'),
    ('EV-022', 'حفل خيري للأطفال', 'concert', 'حفل غنائي لدعم أطفال مرضى السرطان', '2025-12-25'::date, '2025-12-25'::date, 'مسرح البالون', false, 'upcoming'),
    ('EV-023', 'سباق الدراجات الهوائية', 'sports', 'سباق توعوي للدراجات', '2026-01-15'::date, '2026-01-15'::date, 'شوارع المحافظة', true, 'upcoming')
) AS v(event_number, title_ar, event_type, description_ar, start_date, end_date, location_ar, is_free, status)
ON CONFLICT (event_number) DO NOTHING;

-- ============================================
-- 4. MARKETPLACE LISTINGS
-- ============================================
INSERT INTO public.marketplace_listings (
    listing_number, user_id, category_id, title_ar, description_ar, price, governorate, district, contact_phone, status
)
SELECT
    v.listing_number,
    u.id,
    mc.id,
    v.title_ar,
    v.description_ar,
    v.price,
    v.governorate,
    v.district,
    v.contact_phone,
    v.status
FROM (
    VALUES
    ('LST-003', 'ahmed_mohamed', 'منتجات غذائية', 'خضار وفاكهة عضوية', 'منتجات عضوية طازجة من أرض المزرعة', 50, 'الجيزة', 'الهرم', '01234567892', 'active'),
    ('LST-004', 'ahmed_mohamed', 'ملابس وأزياء', 'ملابس أطفال شتوية', 'ملابس جديدة بحالة ممتازة مقاسات مختلفة', 200, 'الجيزة', 'العمرانية', '01234567893', 'active'),
    ('LST-005', 'ahmed_mohamed', 'أثاث منزلي', 'كنبة 3 مقاعد', 'كنبة مستعملة بحالة جيدة جداً', 2500, 'الجيزة', 'فيصل', '01234567894', 'active'),
    ('LST-006', 'sara_hassan', 'إلكترونيات', 'لابتوب Dell', 'معالج i7 رام 16 جيجا SSD 512', 8000, 'الإسكندرية', 'وسط', '01234567895', 'active'),
    ('LST-007', 'sara_hassan', 'خدمات مهنية', 'تصميم مواقع', 'خدمة تصميم مواقع احترافية', 5000, 'الإسكندرية', 'الرمل', '01234567896', 'active'),
    ('LST-008', 'ahmed_mohamed', 'منتجات غذائية', 'عسل نحل طبيعي', 'عسل من خلايا النحل الجبلية', 300, 'الجيزة', 'بولاق الدكرور', '01234567897', 'active'),
    ('LST-009', 'ahmed_mohamed', 'أثاث منزلي', 'طقم كنب صالون', 'طقم كنب فاخر جديد لم يستخدم', 4500, 'الجيزة', 'الدقي', '01234567898', 'active'),
    ('LST-010', 'sara_hassan', 'إلكترونيات', 'شاشة 55 بوصة', 'شاشة سمارت 4K لم تستخدم إلا شهراً', 12000, 'الإسكندرية', 'سيدي جابر', '01234567899', 'active'),
    ('LST-011', 'ahmed_mohamed', 'ملابس وأزياء', 'فستان سهرة', 'فستان أنيق لون أسود مقاس L', 600, 'الجيزة', 'المهندسين', '01234567900', 'active'),
    ('LST-012', 'ahmed_mohamed', 'خدمات مهنية', 'دروس خصوصة رياضيات', 'مدرس رياضيات خبرة 10 سنوات', 200, 'الجيزة', 'الهرم', '01234567901', 'active'),
    ('LST-013', 'sara_hassan', 'منتجات غذائية', 'مربى منزلي', 'مربى فراولة وبرتقال طبيعي', 40, 'الإسكندرية', 'محرم بك', '01234567902', 'active'),
    ('LST-014', 'ahmed_mohamed', 'أثاث منزلي', 'مرتبة طبية', 'مرتبة لتقويم العمود الفقري', 1500, 'الجيزة', 'فيصل', '01234567903', 'active'),
    ('LST-015', 'ahmed_mohamed', 'إلكترونيات', 'سماعات بلوتوث', 'سماعات لاسلكية عالية الجودة', 350, 'الجيزة', 'العمرانية', '01234567904', 'active'),
    ('LST-016', 'sara_hassan', 'خدمات مهنية', 'تنظيف منازل', 'خدمة تنظيف شاملة', 300, 'الإسكندرية', 'المنتزه', '01234567905', 'active'),
    ('LST-017', 'ahmed_mohamed', 'منتجات غذائية', 'بيض بلدي', 'بيض بلدي طازج من المزرعة', 80, 'الجيزة', 'الهرم', '01234567906', 'active'),
    ('LST-018', 'ahmed_mohamed', 'ملابس وأزياء', 'شنطة يد جلد', 'شنطة يد جلد طبيعي ماركة', 500, 'الجيزة', 'الدقي', '01234567907', 'active'),
    ('LST-019', 'sara_hassan', 'أثاث منزلي', 'سجادة صلاة', 'سجادة صلاة فاخرة حرير', 200, 'الإسكندرية', 'العطارين', '01234567908', 'active'),
    ('LST-020', 'ahmed_mohamed', 'إلكترونيات', 'تابلت سامسونج', 'تابعت بحالة ممتازة مع كفر', 2500, 'الجيزة', 'بولاق', '01234567909', 'active'),
    ('LST-021', 'ahmed_mohamed', 'خدمات مهنية', 'صيانة أجهزة', 'صيانة أجهزة كهربائية منزلية', 150, 'الجيزة', 'فيصل', '01234567910', 'active'),
    ('LST-022', 'sara_hassan', 'منتجات غذائية', 'زيت زيتون', 'زيت زيتون بلدي بكر ممتاز', 120, 'الإسكندرية', 'الظاهرية', '01234567911', 'active')
) AS v(listing_number, username, category_name_ar, title_ar, description_ar, price, governorate, district, contact_phone, status)
JOIN public.users u
  ON u.username = v.username
JOIN public.marketplace_categories mc
  ON mc.name_ar = v.category_name_ar
ON CONFLICT (listing_number) DO NOTHING;

-- ============================================
-- 5. JOB LISTINGS
-- ============================================
INSERT INTO public.job_listings (
    job_number, category_id, title_ar, description_ar, location, governorate, employment_type, salary_from, salary_to, application_deadline
)
SELECT
    v.job_number,
    jc.id,
    v.title_ar,
    v.description_ar,
    v.location,
    v.governorate,
    v.employment_type,
    v.salary_from,
    v.salary_to,
    v.application_deadline
FROM (
    VALUES
    ('JOB-003', 'تكنولوجيا المعلومات', 'مطور Frontend', 'مطلوب مطور React خبرة 3 سنوات', 'الجيزة', 'الجيزة', 'full_time', 8000, 12000, '2026-12-31'::date),
    ('JOB-004', 'تكنولوجيا المعلومات', 'مطور Backend', 'خبرة Node.js و PostgreSQL', 'الجيزة', 'الجيزة', 'full_time', 9000, 14000, '2026-12-31'::date),
    ('JOB-005', 'الهندسة', 'مهندس مدني', 'خبرة في الإشراف على المشاريع', 'الجيزة', 'الجيزة', 'full_time', 10000, 15000, '2026-12-31'::date),
    ('JOB-006', 'الهندسة', 'مهندس كهرباء', 'لشركة مقاولات كبرى', 'الإسكندرية', 'الإسكندرية', 'full_time', 8000, 12000, '2026-12-31'::date),
    ('JOB-007', 'التعليم', 'مدرس لغة عربية', 'للمرحلة الإعدادية', 'الجيزة', 'الجيزة', 'full_time', 5000, 7000, '2026-12-31'::date),
    ('JOB-008', 'التعليم', 'مدرس لغة إنجليزية', 'للمرحلة الثانوية', 'الإسكندرية', 'الإسكندرية', 'part_time', 6000, 8000, '2026-12-31'::date),
    ('JOB-009', 'الطب والتمريض', 'طبيب عام', 'عيادات خاصة', 'الجيزة', 'الجيزة', 'full_time', 15000, 20000, '2026-12-31'::date),
    ('JOB-010', 'الطب والتمريض', 'ممرضة', 'خبرة في العناية المركزة', 'الإسكندرية', 'الإسكندرية', 'full_time', 6000, 8000, '2026-12-31'::date),
    ('JOB-011', 'المبيعات', 'مندوب مبيعات', 'لشركة أدوية', 'الجيزة', 'الجيزة', 'full_time', 5000, 7000, '2026-12-31'::date),
    ('JOB-012', 'المبيعات', 'مدير تسويق', 'خبرة لا تقل عن 5 سنوات', 'الإسكندرية', 'الإسكندرية', 'full_time', 15000, 20000, '2026-12-31'::date),
    ('JOB-013', 'تكنولوجيا المعلومات', 'محلل بيانات', 'خبرة SQL و Power BI', 'الجيزة', 'الجيزة', 'full_time', 10000, 15000, '2026-12-31'::date),
    ('JOB-014', 'تكنولوجيا المعلومات', 'أخصائي أمن معلومات', 'خبرة في أمن الشبكات', 'الجيزة', 'الجيزة', 'full_time', 12000, 18000, '2026-12-31'::date),
    ('JOB-015', 'الهندسة', 'مهندس ميكانيكا', 'لشركة صناعية', 'الإسكندرية', 'الإسكندرية', 'full_time', 9000, 13000, '2026-12-31'::date),
    ('JOB-016', 'التعليم', 'مدرسة رياضيات', 'للمرحلة الإعدادية', 'الجيزة', 'الجيزة', 'full_time', 5000, 7000, '2026-12-31'::date),
    ('JOB-017', 'الطب والتمريض', 'صيدلي', 'خبرة في صيدلية مجتمعية', 'الإسكندرية', 'الإسكندرية', 'full_time', 8000, 10000, '2026-12-31'::date),
    ('JOB-018', 'المبيعات', 'سكرتير تنفيذي', 'إجادة اللغة الإنجليزية', 'الجيزة', 'الجيزة', 'full_time', 6000, 8000, '2026-12-31'::date),
    ('JOB-019', 'تكنولوجيا المعلومات', 'مهندس DevOps', 'خبرة Docker و Kubernetes', 'الجيزة', 'الجيزة', 'full_time', 15000, 20000, '2026-12-31'::date),
    ('JOB-020', 'الهندسة', 'مهندس معماري', 'خبرة في التصميم', 'الإسكندرية', 'الإسكندرية', 'full_time', 10000, 14000, '2026-12-31'::date),
    ('JOB-021', 'التعليم', 'مدرس علوم', 'للمرحلة الإعدادية', 'الجيزة', 'الجيزة', 'full_time', 5000, 7000, '2026-12-31'::date),
    ('JOB-022', 'الطب والتمريض', 'أخصائي علاج طبيعي', 'خبرة في تأهيل الإصابات', 'الإسكندرية', 'الإسكندرية', 'full_time', 8000, 10000, '2026-12-31'::date)
) AS v(job_number, category_name_ar, title_ar, description_ar, location, governorate, employment_type, salary_from, salary_to, application_deadline)
JOIN public.job_categories jc
  ON jc.name_ar = v.category_name_ar
ON CONFLICT (job_number) DO NOTHING;

-- ============================================
-- 6. COMPLAINTS
-- ============================================
INSERT INTO public.complaints (
    complaint_id, user_id, full_name, email, phone, subject, description, governorate, status
)
SELECT
    v.complaint_id,
    u.id,
    v.full_name,
    v.email,
    v.phone,
    v.subject,
    v.description,
    v.governorate,
    v.status
FROM (
    VALUES
    ('CMP-003', 'ahmed_mohamed', 'أحمد محمد', 'ahmed@demo.com', '01234567890', 'تأخر في استلام البطاقة', 'لم أستلم بطاقة الرقم القومي بعد 3 أشهر', 'الجيزة', 'pending'),
    ('CMP-004', 'ahmed_mohamed', 'أحمد محمد', 'ahmed@demo.com', '01234567890', 'مشكلة في الموقع الإلكتروني', 'لا أستطيع تسجيل الدخول', 'الجيزة', 'under_review'),
    ('CMP-005', 'sara_hassan', 'سارة حسن', 'sara@demo.com', '01234567891', 'الإنارة المعطلة', 'إنارة الشارع معطلة منذ أسبوع', 'الإسكندرية', 'in_progress'),
    ('CMP-006', 'sara_hassan', 'سارة حسن', 'sara@demo.com', '01234567891', 'تراكم القمامة', 'القمامة تتراكم أمام المنزل', 'الإسكندرية', 'pending'),
    ('CMP-007', 'ahmed_mohamed', 'أحمد محمد', 'ahmed@demo.com', '01234567890', 'الضجيج من الجيران', 'شكوى من الضوضاء المستمرة', 'الجيزة', 'resolved'),
    ('CMP-008', 'sara_hassan', 'سارة حسن', 'sara@demo.com', '01234567891', 'مخالفة بناء', 'بناء مخالف في العمارة المجاورة', 'الإسكندرية', 'under_review'),
    ('CMP-009', 'ahmed_mohamed', 'أحمد محمد', 'ahmed@demo.com', '01234567890', 'عيوب في الطريق', 'حفر وتشققات في الطريق الرئيسي', 'الجيزة', 'pending'),
    ('CMP-010', 'sara_hassan', 'سارة حسن', 'sara@demo.com', '01234567891', 'انقطاع المياه', 'انقطاع المياه المتكرر', 'الإسكندرية', 'in_progress'),
    ('CMP-011', 'ahmed_mohamed', 'أحمد محمد', 'ahmed@demo.com', '01234567890', 'ازدحام مروري', 'ازدحام شديد أمام المدرسة', 'الجيزة', 'pending'),
    ('CMP-012', 'sara_hassan', 'سارة حسن', 'sara@demo.com', '01234567891', 'السرقة', 'تعرضت للسرقة في المنطقة', 'الإسكندرية', 'under_review'),
    ('CMP-013', 'ahmed_mohamed', 'أحمد محمد', 'ahmed@demo.com', '01234567890', 'خدمة العملاء', 'سوء معاملة من موظف خدمة العملاء', 'الجيزة', 'resolved'),
    ('CMP-014', 'sara_hassan', 'سارة حسن', 'sara@demo.com', '01234567891', 'عيوب في الكهرباء', 'انقطاع الكهرباء لساعات طويلة', 'الإسكندرية', 'pending'),
    ('CMP-015', 'ahmed_mohamed', 'أحمد محمد', 'ahmed@demo.com', '01234567890', 'مستشفى عام', 'سوء الخدمة في المستشفى العام', 'الجيزة', 'under_review'),
    ('CMP-016', 'sara_hassan', 'سارة حسن', 'sara@demo.com', '01234567891', 'الروائح الكريهة', 'روائح من مصنع قريب', 'الإسكندرية', 'in_progress'),
    ('CMP-017', 'ahmed_mohamed', 'أحمد محمد', 'ahmed@demo.com', '01234567890', 'تأخر في التصالح', 'لم يتم الرد على طلب التصالح', 'الجيزة', 'pending'),
    ('CMP-018', 'sara_hassan', 'سارة حسن', 'sara@demo.com', '01234567891', 'مخالفة مرورية', 'سيارات متوقفة بشكل عشوائي', 'الإسكندرية', 'resolved'),
    ('CMP-019', 'ahmed_mohamed', 'أحمد محمد', 'ahmed@demo.com', '01234567890', 'عيوب في المدرسة', 'تسرب المياه في فصول المدرسة', 'الجيزة', 'under_review'),
    ('CMP-020', 'sara_hassan', 'سارة حسن', 'sara@demo.com', '01234567891', 'التمييز', 'تعرضت للتمييز في خدمة حكومية', 'الإسكندرية', 'pending'),
    ('CMP-021', 'ahmed_mohamed', 'أحمد محمد', 'ahmed@demo.com', '01234567890', 'تطبيق المواقف', 'المواقف العشوائية للسيارات', 'الجيزة', 'in_progress'),
    ('CMP-022', 'sara_hassan', 'سارة حسن', 'sara@demo.com', '01234567891', 'الحافلات المدرسية', 'تأخر الحافلات المدرسية يومياً', 'الإسكندرية', 'pending')
) AS v(complaint_id, username, full_name, email, phone, subject, description, governorate, status)
JOIN public.users u
  ON u.username = v.username
ON CONFLICT (complaint_id) DO NOTHING;

-- ============================================
-- 7. GOLDEN CITIZEN VOLUNTEERS
-- ============================================
INSERT INTO public.golden_citizen_volunteers (
    volunteer_code, full_name, national_id, phone, profession, specialization, bio, governorate, district, status, verified
)
SELECT *
FROM (
    VALUES
    ('VOL-003', 'أحمد سعيد', '12345678901235', '01234567912', 'محامي', 'قضايا أسرية', 'استشارات قانونية مجانية للأسر المتضررة', 'الجيزة', 'الهرم', 'approved', true),
    ('VOL-004', 'نادية عادل', '12345678901236', '01234567913', 'أخصائية نفسية', 'إرشاد أسري', 'جلسات دعم نفسي للشباب', 'الجيزة', 'العمرانية', 'approved', true),
    ('VOL-005', 'كريم مصطفى', '12345678901237', '01234567914', 'مهندس', 'كهرباء منزلية', 'صيانة كهربائية مجانية', 'الإسكندرية', 'وسط', 'approved', true),
    ('VOL-006', 'منى إبراهيم', '12345678901238', '01234567915', 'مدرسة', 'لغة إنجليزية', 'دروس تقوية مجانية', 'الإسكندرية', 'الرمل', 'approved', true),
    ('VOL-007', 'حسن علي', '12345678901239', '01234567916', 'طبيب', 'أسنان', 'كشوفات أسنان مجانية', 'الجيزة', 'الدقي', 'approved', true),
    ('VOL-008', 'فاطمة محمود', '12345678901240', '01234567917', 'أخصائية اجتماعية', 'رعاية مسنين', 'زيارات منزلية لكبار السن', 'الجيزة', 'فيصل', 'approved', true),
    ('VOL-009', 'محمود خليل', '12345678901241', '01234567918', 'مدرب', 'لياقة بدنية', 'تمارين مجانية للشباب', 'الإسكندرية', 'سيدي جابر', 'approved', true),
    ('VOL-010', 'هبة رشدي', '12345678901242', '01234567919', 'خبيرة تغذية', 'تغذية صحية', 'استشارات تغذية مجانية', 'الجيزة', 'المهندسين', 'approved', true),
    ('VOL-011', 'أمير يوسف', '12345678901243', '01234567920', 'مبرمج', 'تدريب برمجة', 'دورات برمجة مجانية للشباب', 'الإسكندرية', 'المنتزه', 'approved', true),
    ('VOL-012', 'شيماء عادل', '12345678901244', '01234567921', 'خياطة', 'تفصيل ملابس', 'تفصيل مجاني للأيتام', 'الجيزة', 'بولاق', 'approved', true)
) AS v(volunteer_code, full_name, national_id, phone, profession, specialization, bio, governorate, district, status, verified)
ON CONFLICT (volunteer_code) DO NOTHING;

-- ============================================
-- 8. GIFTED APPLICATIONS
-- ============================================
INSERT INTO public.gifted_applications (
    application_number, applicant_type, student_name, student_national_id, student_birth_date, student_grade, student_school, talent_category_id, talent_description
)
SELECT
    v.application_number,
    v.applicant_type,
    v.student_name,
    v.student_national_id,
    v.student_birth_date,
    v.student_grade,
    v.student_school,
    tc.id,
    v.talent_description
FROM (
    VALUES
    ('GIFT-002', 'parent', 'مريم أحمد', '12345678901245', '2012-05-10'::date, 'السادس الابتدائي', 'مدرسة النيل', 'موهبة علمية (STEM)', 'تفوق في الرياضيات والبرمجة'),
    ('GIFT-003', 'teacher', 'يوسف سامي', '12345678901246', '2011-08-15'::date, 'الأول الإعدادي', 'مدرسة العمرانية', 'موهبة أدبية', 'شاعر متميز حاصل على جوائز'),
    ('GIFT-004', 'self', 'فاطمة خالد', '12345678901247', '2010-03-20'::date, 'الثالث الإعدادي', 'مدرسة الهرم', 'موهبة فنية', 'رسامة موهوبة شاركت في معارض'),
    ('GIFT-005', 'parent', 'عمر هشام', '12345678901248', '2013-11-25'::date, 'الخامس الابتدائي', 'مدرسة فيصل', 'موهبة علمية (STEM)', 'مبتكر في الروبوتات'),
    ('GIFT-006', 'teacher', 'ليلى محمود', '12345678901249', '2012-07-30'::date, 'السادس الابتدائي', 'مدرسة الدقي', 'موهبة أدبية', 'كاتبة قصص قصيرة')
) AS v(application_number, applicant_type, student_name, student_national_id, student_birth_date, student_grade, student_school, talent_category_name_ar, talent_description)
JOIN public.talent_categories tc
  ON tc.name_ar = v.talent_category_name_ar
ON CONFLICT (application_number) DO NOTHING;

-- ============================================
-- 9. GIFTED PROGRAMS
-- ============================================
INSERT INTO public.gifted_programs (
    program_code, name_ar, name_en, category_id, description_ar, program_type, duration_hours, max_participants
)
SELECT
    v.program_code,
    v.name_ar,
    v.name_en,
    tc.id,
    v.description_ar,
    v.program_type,
    v.duration_hours,
    v.max_participants
FROM (
    VALUES
    ('PRG-SCI-02', 'معسكر العلوم المتقدمة', 'Advanced Science Camp', 'موهبة علمية (STEM)', 'معسكر تدريبي في الفيزياء والكيمياء', 'summer_camp', 60, 30),
    ('PRG-ART-02', 'ورشة الإبداع الفني', 'Art Creativity Workshop', 'موهبة فنية', 'ورشة في الرسم والأشغال اليدوية', 'enrichment', 40, 20)
) AS v(program_code, name_ar, name_en, talent_category_name_ar, description_ar, program_type, duration_hours, max_participants)
JOIN public.talent_categories tc
  ON tc.name_ar = v.talent_category_name_ar
ON CONFLICT (program_code) DO NOTHING;

-- ============================================
-- 10. TECH CENTERS
-- ============================================
INSERT INTO public.tech_centers (
    name_ar, name_en, governorate, district, address_ar, address_en, latitude, longitude, phone, working_hours_ar, working_hours_en
)
SELECT *
FROM (
    VALUES
    ('مركز تكنولوجي بالجيزة - فيصل', 'Tech Center - Faisal', 'الجيزة', 'فيصل', 'شارع فيصل بجوار مسجد الاستقامة', 'Faisal St. next to Al Istiqama Mosque', 29.9872, 31.2119, '02-12345678', 'الأحد - الخميس: 9 ص - 5 م', 'Sunday - Thursday: 9 AM - 5 PM'),
    ('مركز تكنولوجي بالإسكندرية - الرمل', 'Tech Center - Raml', 'الإسكندرية', 'الرمل', 'شارع سعد زغلول بجوار مديرية الأمن', 'Saad Zaghloul St. near Security Directorate', 31.2001, 29.9187, '03-12345678', 'الأحد - الخميس: 9 ص - 5 م', 'Sunday - Thursday: 9 AM - 5 PM'),
    ('مركز تكنولوجي بالجيزة - المهندسين', 'Tech Center - Mohandessin', 'الجيزة', 'المهندسين', 'شارع جامعة الدول العربية', 'Gamaet El Dowal El Arabia St.', 30.0315, 31.2112, '02-12345678', 'الأحد - الخميس: 9 ص - 5 م', 'Sunday - Thursday: 9 AM - 5 PM')
) AS v(name_ar, name_en, governorate, district, address_ar, address_en, latitude, longitude, phone, working_hours_ar, working_hours_en)
ON CONFLICT (name_ar) DO NOTHING;

-- ============================================
-- 11. PROPERTY-RELATED DATA
-- unified_property_records removed because it does not exist in init-app schema
-- add examples using existing property tables instead
-- ============================================
INSERT INTO public.building_violation_reconciliation (
    request_number, applicant_name, applicant_national_id, applicant_phone,
    property_address, governorate, district, land_area, built_area, violation_description, status
)
SELECT *
FROM (
    VALUES
    ('REC-003', 'خالد سعيد', '12345678901235', '01234567892', 'المهندسين - الجيزة', 'الجيزة', 'المهندسين', 120, 100, 'مخالفة في الارتفاعات', 'pending'),
    ('REC-004', 'نادية عادل', '12345678901236', '01234567893', 'فيصل - الجيزة', 'الجيزة', 'فيصل', 80, 60, 'مخالفة استخدام تجاري', 'pending')
) AS v(request_number, applicant_name, applicant_national_id, applicant_phone, property_address, governorate, district, land_area, built_area, violation_description, status)
ON CONFLICT (request_number) DO NOTHING;

INSERT INTO public.hand_possession_legalization (
    request_number, applicant_name, applicant_national_id, applicant_phone,
    property_type, property_address, governorate, district, land_area, possession_years, possession_description, status
)
SELECT *
FROM (
    VALUES
    ('LEG-003', 'منى إبراهيم', '12345678901238', '01234567915', 'سكني', 'سيدي جابر - الإسكندرية', 'الإسكندرية', 'سيدي جابر', 600, 12, 'وضع يد مستقر منذ سنوات', 'pending')
) AS v(request_number, applicant_name, applicant_national_id, applicant_phone, property_type, property_address, governorate, district, land_area, possession_years, possession_description, status)
ON CONFLICT (request_number) DO NOTHING;

-- ============================================
-- 12. COMPREHENSIVE HEALTH INSURANCE REQUESTS
-- ============================================
INSERT INTO public.comprehensive_health_insurance_requests (
    request_number, user_id, head_of_family_name, head_of_family_national_id, head_of_family_phone, governorate, district, family_members
)
SELECT
    v.request_number,
    u.id,
    v.head_of_family_name,
    v.head_of_family_national_id,
    v.head_of_family_phone,
    v.governorate,
    v.district,
    v.family_members
FROM (
    VALUES
    (
      'INS-003', 'ahmed_mohamed', 'أحمد محمد', '12345678901234', '01234567890', 'الجيزة', 'الهرم',
      '[
        {"name":"أحمد محمد","nationalId":"12345678901234","relation":"رب الأسرة","birthDate":"1980-01-01","gender":"ذكر"},
        {"name":"فاطمة محمد","nationalId":"12345678905678","relation":"زوجة","birthDate":"1985-05-05","gender":"أنثى"},
        {"name":"محمد أحمد","nationalId":"12345678909012","relation":"ابن","birthDate":"2010-10-10","gender":"ذكر"}
      ]'::jsonb
    ),
    (
      'INS-004', 'sara_hassan', 'سارة حسن', '12345678905678', '01234567891', 'الإسكندرية', 'وسط',
      '[
        {"name":"سارة حسن","nationalId":"12345678905678","relation":"رب الأسرة","birthDate":"1982-02-02","gender":"أنثى"},
        {"name":"ليلى سارة","nationalId":"12345678901235","relation":"ابنة","birthDate":"2012-12-12","gender":"أنثى"}
      ]'::jsonb
    )
) AS v(request_number, username, head_of_family_name, head_of_family_national_id, head_of_family_phone, governorate, district, family_members)
JOIN public.users u
  ON u.username = v.username
ON CONFLICT (request_number) DO NOTHING;

-- ============================================
-- 13. STATE FUNDING TREATMENT REQUESTS
-- ============================================
INSERT INTO public.state_funding_treatment_requests (
    request_number, user_id, citizen_name, citizen_national_id, citizen_phone, governorate, district, diagnosis_ar, required_treatment_ar, urgency_level
)
SELECT
    v.request_number,
    u.id,
    v.citizen_name,
    v.citizen_national_id,
    v.citizen_phone,
    v.governorate,
    v.district,
    v.diagnosis_ar,
    v.required_treatment_ar,
    v.urgency_level
FROM (
    VALUES
    ('TRT-003', 'ahmed_mohamed', 'أحمد محمد', '12345678901234', '01234567890', 'الجيزة', 'الهرم', 'عملية قلب مفتوح', 'علاج القلب', 'high'),
    ('TRT-004', 'sara_hassan', 'سارة حسن', '12345678905678', '01234567891', 'الإسكندرية', 'وسط', 'علاج الأورام', 'العلاج الكيماوي', 'emergency'),
    ('TRT-005', 'ahmed_mohamed', 'خالد سعيد', '12345678901235', '01234567892', 'الجيزة', 'فيصل', 'زراعة كلى', 'جراحة زراعة', 'high'),
    ('TRT-006', 'sara_hassan', 'منى إبراهيم', '12345678901236', '01234567893', 'الإسكندرية', 'الرمل', 'علاج عظام', 'تركيب مفصل', 'normal'),
    ('TRT-007', 'ahmed_mohamed', 'محمود علي', '12345678901237', '01234567894', 'الجيزة', 'الدقي', 'علاج عيون', 'جراحة الليزك', 'normal')
) AS v(request_number, username, citizen_name, citizen_national_id, citizen_phone, governorate, district, diagnosis_ar, required_treatment_ar, urgency_level)
JOIN public.users u
  ON u.username = v.username
ON CONFLICT (request_number) DO NOTHING;

-- ============================================
-- 14. GOVERNMENT DOCUMENTS
-- use WHERE NOT EXISTS because schema has no unique key for title_ar
-- ============================================
INSERT INTO public.government_documents (title_ar, category, file_url, file_size, publish_date)
SELECT v.title_ar, v.category, v.file_url, v.file_size, v.publish_date
FROM (
    VALUES
    ('دليل المستثمر في الجيزة 2025', 'guide', '/docs/investor-guide-2025.pdf', 512, '2025-03-01'::date),
    ('تقرير التنمية المستدامة 2025', 'report', '/docs/sustainability-report-2025.pdf', 1024, '2025-02-15'::date),
    ('لائحة المراكز التكنولوجية', 'law', '/docs/tech-centers-regulation.pdf', 256, '2025-01-10'::date),
    ('إحصاءات السكان 2025', 'statistic', '/docs/population-stats-2025.pdf', 2048, '2025-04-01'::date),
    ('دليل الخدمات الحكومية', 'guide', '/docs/services-guide.pdf', 768, '2025-05-01'::date)
) AS v(title_ar, category, file_url, file_size, publish_date)
WHERE NOT EXISTS (
    SELECT 1
    FROM public.government_documents gd
    WHERE gd.title_ar = v.title_ar
);

-- ============================================
-- 15. USER DOCUMENTS
-- ============================================
INSERT INTO public.user_documents (user_id, document_number, category_id, title_ar, file_path, file_type)
SELECT
    u.id,
    v.document_number,
    v.category_id,
    v.title_ar,
    v.file_path,
    v.file_type
FROM (
    VALUES
    ('ahmed_mohamed', 'DOC-003', 1, 'بطاقة الرقم القومي', '/uploads/vault/national-id-1.pdf', 'application/pdf'),
    ('ahmed_mohamed', 'DOC-004', 2, 'شهادة ميلاد', '/uploads/vault/birth-cert-1.pdf', 'application/pdf'),
    ('ahmed_mohamed', 'DOC-005', 3, 'عقد ملكية العقار', '/uploads/vault/property-deed-1.pdf', 'application/pdf'),
    ('sara_hassan', 'DOC-006', 1, 'بطاقة الرقم القومي', '/uploads/vault/national-id-2.pdf', 'application/pdf'),
    ('sara_hassan', 'DOC-007', 2, 'شهادة ميلاد', '/uploads/vault/birth-cert-2.pdf', 'application/pdf')
) AS v(username, document_number, category_id, title_ar, file_path, file_type)
JOIN public.users u
  ON u.username = v.username
ON CONFLICT (document_number) DO NOTHING;

-- ============================================
-- 16. CHATBOT TRAINING DATA
-- use WHERE NOT EXISTS because no unique key
-- ============================================
INSERT INTO public.chatbot_training_data (question, answer, category, keywords)
SELECT v.question, v.answer, v.category, v.keywords
FROM (
    VALUES
    ('كيف أقدم طلب ترخيص محل تجاري؟', 'يمكنك تقديم الطلب عبر خدمة "ترخيص المحلات التجارية" في قسم الخدمات. المستندات المطلوبة: عقد الإيجار، البطاقة الضريبية، شهادة الدفاع المدني.', 'licenses', ARRAY['ترخيص', 'محل', 'تجاري']),
    ('ما هي شروط الحصول على قرض الزواج؟', 'شروط الحصول على قرض الزواج: أن يكون المتقدم مصري الجنسية، لا يقل عمره عن 21 سنة، وله دخل ثابت. يمكن التقديم عبر بنك ناصر الاجتماعي.', 'loans', ARRAY['قرض', 'زواج', 'شروط']),
    ('كيف أبلغ عن حيوان ضال؟', 'يمكنك الإبلاغ عبر خدمة "الإبلاغ عن مشكلة" في الموقع، أو الاتصال على الخط الساخن 12345.', 'complaints', ARRAY['حيوان', 'ضال', 'إبلاغ']),
    ('ما هي رسوم ترخيص السيارة؟', 'رسوم ترخيص السيارة تختلف حسب نوع السيارة وسعة المحرك. تبدأ من 300 جنيه سنوياً.', 'transport', ARRAY['رسوم', 'ترخيص', 'سيارة'])
) AS v(question, answer, category, keywords)
WHERE NOT EXISTS (
    SELECT 1
    FROM public.chatbot_training_data c
    WHERE c.question = v.question
);