const { execSync } = require('child_process');
const DIRECTUS_URL = 'http://localhost:8055';

// Directus admin credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin1234';

let adminToken = null;

async function login() {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const data = await res.json();
    if (!data.data?.access_token) throw new Error(`Login failed: ${JSON.stringify(data)}`);
    adminToken = data.data.access_token;
    console.log('✅ Logged into Directus as admin');
}

async function createCollection(name, fields) {
    // Check if collection already exists
    const checkRes = await fetch(`${DIRECTUS_URL}/collections/${name}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (checkRes.ok) {
        console.log(`⚠️ Collection '${name}' already exists, skipping creation`);
        return;
    }

    // Create collection
    const createRes = await fetch(`${DIRECTUS_URL}/collections`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ collection: name, meta: { singleton: false } }),
    });
    if (!createRes.ok) {
        const err = await createRes.text();
        throw new Error(`Failed to create collection ${name}: ${err}`);
    }
    console.log(`✅ Created collection: ${name}`);

    // Add fields
    for (const field of fields) {
        const fieldRes = await fetch(`${DIRECTUS_URL}/fields/${name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify(field),
        });
        if (!fieldRes.ok) {
            const err = await fieldRes.text();
            console.error(`⚠️ Failed to add field ${field.field} to ${name}: ${err}`);
        } else {
            console.log(`   + Added field: ${field.field}`);
        }
    }
}

async function setPublicPermission(collection, action, enabled) {
    // Get Public role ID
    const roleRes = await fetch(`${DIRECTUS_URL}/roles?filter[name][_eq]=Public`, {
        headers: { Authorization: `Bearer ${adminToken}` },
    });
    const roleData = await roleRes.json();
    const publicRole = roleData.data[0];
    if (!publicRole) throw new Error('Public role not found');

    // Check if permission already exists
    const permRes = await fetch(`${DIRECTUS_URL}/permissions?filter[collection][_eq]=${collection}&filter[role][_eq]=${publicRole.id}&filter[action][_eq]=${action}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
    });
    const permData = await permRes.json();
    const existing = permData.data[0];

    if (enabled) {
        if (existing) {
            console.log(`   ⚠️ Permission ${action} on ${collection} already exists`);
            return;
        }
        await fetch(`${DIRECTUS_URL}/permissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
                collection,
                role: publicRole.id,
                action,
                permissions: {},
                fields: '*',
            }),
        });
        console.log(`   ✅ Enabled public ${action} for ${collection}`);
    } else {
        if (existing) {
            await fetch(`${DIRECTUS_URL}/permissions/${existing.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            console.log(`   ❌ Disabled public ${action} for ${collection}`);
        }
    }
}

async function postDirectus(collection, data) {
    const res = await fetch(`${DIRECTUS_URL}/items/${collection}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ data }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Directus error ${res.status}: ${text}`);
    }
    return res.json();
}

async function runSQL(sql) {
    const escaped = sql.replace(/"/g, '\\"');
    execSync(`docker compose exec -T postgres psql -U govportal -d govportal_app -c "${escaped}"`, { stdio: 'inherit' });
}

async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function main() {
    try {
        await login();

        // 1. Create collections if they don't exist
        console.log('\n📦 Setting up Directus collections...');

        // news_articles (already exists? check)
        await createCollection('news_articles', [
            { field: 'title_ar', type: 'string', meta: { required: true, interface: 'input' } },
            { field: 'title_en', type: 'string', meta: { required: false } },
            { field: 'slug', type: 'string', meta: { required: true }, schema: { is_unique: true } },
            { field: 'summary_ar', type: 'text', meta: { required: false } },
            { field: 'summary_en', type: 'text' },
            { field: 'content_ar', type: 'text', meta: { required: true } },
            { field: 'content_en', type: 'text' },
            { field: 'category', type: 'string' },
            { field: 'priority', type: 'integer', schema: { default_value: 0 } },
            { field: 'is_featured', type: 'boolean', schema: { default_value: false } },
            { field: 'published_at', type: 'datetime' },
            { field: 'featured_image', type: 'uuid', meta: { special: ['file'] } },   // relation to directus_files
            { field: 'gallery_images', type: 'json', meta: { special: ['cast-json'] } },
        ]);

        // services collection
        await createCollection('services', [
            { field: 'name_ar', type: 'string', meta: { required: true } },
            { field: 'name_en', type: 'string' },
            { field: 'slug', type: 'string', meta: { required: true }, schema: { is_unique: true } },
            { field: 'description_ar', type: 'text' },
            { field: 'description_en', type: 'text' },
            { field: 'is_featured', type: 'boolean', schema: { default_value: false } },
            { field: 'display_order', type: 'integer', schema: { default_value: 0 } },
        ]);

        // events collection
        await createCollection('events', [
            { field: 'title_ar', type: 'string', meta: { required: true } },
            { field: 'title_en', type: 'string' },
            { field: 'description_ar', type: 'text' },
            { field: 'description_en', type: 'text' },
            { field: 'start_date', type: 'date' },
            { field: 'end_date', type: 'date' },
            { field: 'location_ar', type: 'string' },
            { field: 'location_en', type: 'string' },
            { field: 'is_active', type: 'boolean', schema: { default_value: true } },
        ]);

        // 2. Set public permissions (read + temporary create for services/events)
        console.log('\n🔐 Setting public permissions...');
        await setPublicPermission('news_articles', 'read', true);
        await setPublicPermission('news_articles', 'create', false);   // keep read-only
        await setPublicPermission('services', 'read', true);
        await setPublicPermission('services', 'create', true);   // enable for data generation
        await setPublicPermission('events', 'read', true);
        await setPublicPermission('events', 'create', true);

        // 3. Generate synthetic data (using admin token)
        console.log('\n📝 Generating test data...');

        // News (10)
        const newsData = [
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
        for (const item of newsData) {
            await postDirectus('news_articles', item);
            console.log(`   ✅ Added news: ${item.title_ar}`);
            await sleep(300);
        }

        // Services (10)
        const servicesData = [
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
        for (const item of servicesData) {
            await postDirectus('services', item);
            console.log(`   ✅ Added service: ${item.name_ar}`);
            await sleep(300);
        }

        // Events (5)
        const eventsData = [
            { title_ar: "معرض الجيزة للكتاب", description_ar: "الدورة 15 لمعرض الكتاب بمشاركة 100 دار نشر", start_date: "2026-05-10", location_ar: "أرض المعارض - الجيزة", is_active: true },
            { title_ar: "ماراثون الجيزة الرياضي", description_ar: "ماراثون سنوي بشارع النيل لمسافات 5 و10 كم", start_date: "2026-06-15", location_ar: "شارع النيل - الجيزة", is_active: true },
            { title_ar: "احتفالية عيد الأم", description_ar: "احتفالية بتكريم الأمهات المثاليات بالمحافظة", start_date: "2026-04-01", location_ar: "ديوان عام المحافظة", is_active: true },
            { title_ar: "مؤتمر الاستثمار بالمحافظة", description_ar: "لقاء مع المستثمرين لعرض فرص الاستثمار", start_date: "2026-05-20", location_ar: "مركز المؤتمرات - الشيخ زايد", is_active: true },
            { title_ar: "ليالي الجيزة الرمضانية", description_ar: "فعاليات ثقافية وفنية خلال شهر رمضان", start_date: "2026-03-01", location_ar: "حديقة الأورمان", is_active: true },
        ];
        for (const item of eventsData) {
            await postDirectus('events', item);
            console.log(`   ✅ Added event: ${item.title_ar}`);
            await sleep(300);
        }

        // 4. PostgreSQL data (users, complaints, applications, marketplace)
        console.log('\n🐘 Adding PostgreSQL data...');
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
        console.log('   ✅ PostgreSQL data added.');

        // 5. Revoke public create permissions for services/events (optional)
        console.log('\n🔐 Revoking temporary public create permissions...');
        await setPublicPermission('services', 'create', false);
        await setPublicPermission('events', 'create', false);

        console.log('\n🎉 All done! Your portal is now fully populated with test data.');
    } catch (err) {
        console.error('\n❌ Error:', err.message);
        // Attempt to revert permissions on error
        try {
            await setPublicPermission('services', 'create', false);
            await setPublicPermission('events', 'create', false);
        } catch (_) {}
    }
}

main();