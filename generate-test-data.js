const { execSync } = require('child_process');
const DIRECTUS_URL = 'http://localhost:8055';

// 🔑 Replace this with your actual full‑access token
const API_TOKEN = 'full-access-token-123456';

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function postDirectus(collection, data) {
    const url = `${DIRECTUS_URL}/items/${collection}`;
    const body = JSON.stringify({ data });
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`
        },
        body,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Directus error ${res.status}: ${text}`);
    }
    return res.json();
}

async function runSQL(sql) {
    // Escape double quotes for shell
    const escaped = sql.replace(/"/g, '\\"');
    return execSync(`docker compose exec -T postgres psql -U govportal -d govportal_app -c "${escaped}"`, { stdio: 'inherit' });
}

async function main() {
    console.log('Generating synthetic test data using API token...');

    // 1. News articles (10)
    const news = [
        { title_ar: "افتتاح مشروع تطوير البنية التحتية بالجيزة", slug: "افتتاح-مشروع-تطوير-البنية-التحتية", summary_ar: "شهد المهندس عادل النجار محافظ الجيزة حفل افتتاح مشروع تطوير البنية التحتية.", content_ar: "تفاصيل المشروع تشمل إنشاء شبكات صرف صحي ورصف طرق جديدة بتكلفة 50 مليون جنيه.", published_at: new Date().toISOString(), is_featured: true },
        { title_ar: "محافظ الجيزة يتابع أعمال رصف طريق الحفرية", slug: "محافظ-الجيزة-يطّلع-على-أعمال-رصف-طريق-الحفرية", summary_ar: "تفقد المحافظ أعمال رصف الطبقة الرابعة بطريق الحفرية بطول 2 كم.", content_ar: "تشمل الأعمال رصف الطبقة الرابطة وتوسعة الطريق إلى 4 حارات مرورية.", published_at: new Date().toISOString(), is_featured: true },
        { title_ar: "ورشة عمل حول التحول الرقمي للمواطنين", slug: "ورشة-عمل-حول-التحول-الرقمي", summary_ar: "نظمت المحافظة ورشة عمل لتدريب المواطنين على الخدمات الإلكترونية.", content_ar: "تم تدريب 200 مواطن على كيفية استخدام بوابة المحافظة للحصول على الخدمات.", published_at: new Date().toISOString(), is_featured: false },
        { title_ar: "إطلاق حملة نظافة كبرى بمناطق غرب الجيزة", slug: "إطلاق-حملة-نظافة-كبرى-غرب-الجيزة", summary_ar: "انطلقت حملة نظافة شاملة بمشاركة شركة نهضة مصر وشركة الجيزة الخضراء.", content_ar: "شارك في الحملة 500 عامل وتأتي ضمن خطة النظافة الشاملة للمحافظة.", published_at: new Date().toISOString(), is_featured: true },
        { title_ar: "تكريم أوائل الثانوية العامة بالمحافظة", slug: "تكريم-أوائل-الثانوية-العامة", summary_ar: "كرم المحافظ 50 طالباً من أوائل الثانوية العامة بحضور أولياء الأمور.", content_ar: "تم تكريم الطلاب في قاعة المؤتمرات بحضور مديري المدارس.", published_at: new Date().toISOString(), is_featured: false },
        { title_ar: "افتتاح معرض الجيزة للكتاب في دورته الـ15", slug: "معرض-الجيزة-للكتاب-الدورة-15", summary_ar: "افتتح المحافظ معرض الكتاب بحضور عدد من الكتاب والمثقفين.", content_ar: "يشارك في المعرض 100 دار نشر ويستمر حتى 10 مايو القادم.", published_at: new Date().toISOString(), is_featured: true },
        { title_ar: "محافظ الجيزة يزور مستشفى أم المصريين", slug: "محافظ-الجيزة-يزور-مستشفى-أم-المصريين", summary_ar: "تفقد المحافظ سير العمل بمستشفى أم المصريين والخدمات المقدمة للمرضى.", content_ar: "قام المحافظ بجولة تفقدية داخل الأقسام واستمع إلى شكاوى المواطنين.", published_at: new Date().toISOString(), is_featured: false },
        { title_ar: "ندوة عن ترشيد استهلاك المياه بمدارس الجيزة", slug: "ندوة-ترشيد-استهلاك-المياه-مدارس-الجيزة", summary_ar: "نظمت شركة المياه ندوة توعوية عن ترشيد استهلاك المياه بمدارس النيل.", content_ar: "تناولت الندوة طرق ترشيد المياه وكيفية إصلاح التسريبات المنزلية.", published_at: new Date().toISOString(), is_featured: false },
        { title_ar: "إنجاز 80% من مشروع محور الفريق كمال عامر", slug: "إنجاز-نسبة-80-من-محور-كمال-عامر", summary_ar: "أعلن المحافظ ارتفاع نسبة الإنجاز بمشروع محور الفريق كمال عامر.", content_ar: "المشروع يربط بين عدة محاور رئيسية لتسهيل حركة المرور.", published_at: new Date().toISOString(), is_featured: true },
        { title_ar: "الاحتفال بعيد الشرطة بالجيزة", slug: "الاحتفال-بعيد-الشرطة-بالجيزة", summary_ar: "احتفلت المحافظة بعيد الشرطة وتكريم أسر الشهداء.", content_ar: "شهد الحفل عرضاً عسكرياً وتكريم ضباط الشرطة المتميزين.", published_at: new Date().toISOString(), is_featured: false },
    ];
    for (const item of news) {
        try {
            await postDirectus('news_articles', item);
            console.log(`✅ Added news: ${item.title_ar}`);
        } catch (err) { console.error(`❌ Failed news: ${item.title_ar}`, err.message); }
        await sleep(300);
    }

    // 2. Services (10)
    const services = [
        { name_ar: "رخصة بناء جديدة", slug: "رخصة-بناء-جديدة", description_ar: "إصدار رخصة بناء وفقاً للقانون 119 لسنة 2008", is_featured: true },
        { name_ar: "بيان صلاحية الموقع", slug: "بيان-صلاحية-الموقع", description_ar: "بيان يثبت صلاحية الموقع للبناء", is_featured: true },
        { name_ar: "العلاج على نفقة الدولة", slug: "العلاج-على-نفقة-الدولة", description_ar: "تقديم طلب علاج على نفقة الدولة", is_featured: true },
        { name_ar: "التأمين الصحي الشامل", slug: "التأمين-الصحي-الشامل", description_ar: "التسجيل في منظومة التأمين الصحي الشامل", is_featured: true },
        { name_ar: "حماية الطفل", slug: "حماية-الطفل", description_ar: "خدمات الدعم والحماية للأطفال", is_featured: true },
        { name_ar: "مكافحة الإدمان", slug: "مكافحة-الإدمان", description_ar: "خدمات علاج وتأهيل لمدمني المخدرات", is_featured: true },
        { name_ar: "دليل المدارس", slug: "دليل-المدارس", description_ar: "دليل شامل للمدارس في المحافظة", is_featured: true },
        { name_ar: "الرقم القومي الموحد للعقار", slug: "الرقم-القومي-الموحد-للعقار", description_ar: "الحصول على الرقم القومي الموحد للعقار", is_featured: true },
        { name_ar: "توصيل مياه", slug: "توصيل-مياه", description_ar: "طلب توصيل خدمة المياه للعقار", is_featured: true },
        { name_ar: "رخصة لافتات", slug: "رخصة-لافتات", description_ar: "تصريح لتركيب الافتات الإعلانية", is_featured: true },
    ];
    for (const item of services) {
        try {
            await postDirectus('services', item);
            console.log(`✅ Added service: ${item.name_ar}`);
        } catch (err) { console.error(`❌ Failed service: ${item.name_ar}`, err.message); }
        await sleep(300);
    }

    // 3. Events (5)
    const events = [
        { title_ar: "معرض الجيزة للكتاب", description_ar: "الدورة 15 لمعرض الكتاب بمشاركة 100 دار نشر", start_date: "2025-05-10", location_ar: "أرض المعارض - الجيزة", is_active: true },
        { title_ar: "ماراثون الجيزة الرياضي", description_ar: "ماراثون سنوي بشارع النيل لمسافات 5 و10 كم", start_date: "2025-06-15", location_ar: "شارع النيل - الجيزة", is_active: true },
        { title_ar: "احتفالية عيد الأم", description_ar: "احتفالية بتكريم الأمهات المثاليات بالمحافظة", start_date: "2025-04-01", location_ar: "ديوان عام المحافظة", is_active: true },
        { title_ar: "مؤتمر الاستثمار بالمحافظة", description_ar: "لقاء مع المستثمرين لعرض فرص الاستثمار", start_date: "2025-05-20", location_ar: "مركز المؤتمرات - الشيخ زايد", is_active: true },
        { title_ar: "ليالي الجيزة الرمضانية", description_ar: "فعاليات ثقافية وفنية خلال شهر رمضان", start_date: "2025-03-01", location_ar: "حديقة الأورمان", is_active: true },
    ];
    for (const item of events) {
        try {
            await postDirectus('events', item);
            console.log(`✅ Added event: ${item.title_ar}`);
        } catch (err) { console.error(`❌ Failed event: ${item.title_ar}`, err.message); }
        await sleep(300);
    }

    // 4. PostgreSQL data – users, complaints, etc.
    console.log('Adding PostgreSQL data...');
    runSQL(`
        INSERT INTO users (username, email, national_id, phone, password_hash, role, governorate, email_verified)
        SELECT * FROM (VALUES 
            ('ahmed_mohamed', 'ahmed@demo.com', '12345678901234', '01001234567', 'hashed_demo', 'citizen', 'giza', true),
            ('sara_hassan', 'sara@demo.com', '12345678905678', '01001234568', 'hashed_demo', 'citizen', 'alexandria', true),
            ('mohamed_ali', 'mohamed@demo.com', '12345678909999', '01001234569', 'hashed_demo', 'citizen', 'giza', true),
            ('fatma_mostafa', 'fatma@demo.com', '12345678901234', '01001234570', 'hashed_demo', 'citizen', 'giza', true),
            ('ali_ibrahim', 'ali@demo.com', '12345678903333', '01001234571', 'hashed_demo', 'citizen', 'giza', true)
        ) AS tmp(username, email, national_id, phone, password_hash, role, governorate, email_verified)
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = tmp.email);
    `);
    runSQL(`
        INSERT INTO service_applications (application_id, service_id, user_id, application_data, status, submitted_at)
        SELECT 'APP-'||generate_series||NOW()::text, generate_series, generate_series, '{"description":"Service application test"}'::jsonb, 'pending', NOW()
        FROM generate_series(1,5);
    `);
    runSQL(`
        INSERT INTO complaints (complaint_id, user_id, full_name, email, phone, subject, description, governorate, status, created_at)
        SELECT 'CMP-'||g.s||NOW()::text, g.s, 'Test User', 'test'||g.s||'@example.com', '0123456789'||g.s, 
               CASE g.s WHEN 1 THEN 'شكوى حول خدمة المرور' WHEN 2 THEN 'شكوى حول النظافة' WHEN 3 THEN 'شكوى حول كهرباء' WHEN 4 THEN 'شكوى حول مياه' ELSE 'شكوى حول ترخيص' END,
               'نص الشكوى', 'giza', 'pending', NOW()
        FROM generate_series(1,5) g(s);
    `);
    runSQL(`
        INSERT INTO marketplace_listings (listing_number, user_id, title_ar, description_ar, price, governorate, district, contact_phone, status, created_at)
        SELECT 'LST-'||g.s||NOW()::text, g.s,
               CASE g.s WHEN 1 THEN 'عسل نحل طبيعي' WHEN 2 THEN 'غرفة نوم مستعملة' WHEN 3 THEN 'دروس خصوصة لغة عربية' WHEN 4 THEN 'توصيل مشاوير' ELSE 'لاب توب مستعمل' END,
               CASE g.s WHEN 1 THEN 'عسل نحل 100% إنتاج منزلي' WHEN 2 THEN 'غرفة نوم كاملة' WHEN 3 THEN 'مدرس خبرة 10 سنوات' WHEN 4 THEN 'خدمة توصيل سريعة' ELSE 'ماركة ديل i5' END,
               CASE g.s WHEN 1 THEN 250 WHEN 2 THEN 3500 WHEN 3 THEN 150 WHEN 4 THEN 50 ELSE 8000 END,
               'الجيزة', CASE g.s WHEN 1 THEN 'الهرم' WHEN 2 THEN 'العمرانية' WHEN 3 THEN 'فيصل' WHEN 4 THEN 'بولاق' ELSE 'الدقي' END,
               '0100000000'||g.s, 'active', NOW()
        FROM generate_series(1,5) g(s);
    `);
    console.log('✅ PostgreSQL data added.');
    console.log('All test data generated successfully!');
}

main().catch(console.error);