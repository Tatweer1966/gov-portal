# generate-test-data.ps1
Write-Host "Generating synthetic test data..." -ForegroundColor Cyan

$DIRECTUS_URL = "http://localhost:8055"
$POSTGRES_HOST = "postgres"
$POSTGRES_USER = "govportal"
$POSTGRES_DB = "govportal_app"
$POSTGRES_PASSWORD = "GovPortal@2025"

# ------------------------------
# 1. Directus: News Articles (10)
# ------------------------------
Write-Host "Creating 10 news articles in Directus..." -ForegroundColor Yellow
$newsTitles = @(
    "افتتاح مشروع تطوير البنية التحتية بالجيزة",
    "محافظ الجيزة يتابع أعمال رصف طريق الحفرية",
    "ورشة عمل حول التحول الرقمي للمواطنين",
    "إطلاق حملة نظافة كبرى بمناطق غرب الجيزة",
    "تكريم أوائل الثانوية العامة بالمحافظة",
    "افتتاح معرض الجيزة للكتاب في دورته الـ15",
    "محافظ الجيزة يزور مستشفى أم المصريين",
    "ندوة عن ترشيد استهلاك المياه بمدارس الجيزة",
    "إنجاز 80% من مشروع محور الفريق كمال عامر",
    "الاحتفال بعيد الشرطة بالجيزة"
)
$newsSlugs = @(
    "افتتاح-مشروع-تطوير-البنية-التحتية",
    "محافظ-الجيزة-يطّلع-على-أعمال-رصف-طريق-الحفرية",
    "ورشة-عمل-حول-التحول-الرقمي",
    "إطلاق-حملة-نظافة-كبرى-غرب-الجيزة",
    "تكريم-أوائل-الثانوية-العامة",
    "معرض-الجيزة-للكتاب-الدورة-15",
    "محافظ-الجيزة-يزور-مستشفى-أم-المصريين",
    "ندوة-ترشيد-استهلاك-المياه-مدارس-الجيزة",
    "إنجاز-نسبة-80-من-محور-كمال-عامر",
    "الاحتفال-بعيد-الشرطة-بالجيزة"
)
$newsSummaries = @(
    "شهد المهندس عادل النجار محافظ الجيزة حفل افتتاح مشروع تطوير البنية التحتية.",
    "تفقد المحافظ أعمال رصف الطبقة الرابعة بطريق الحفرية بطول 2 كم.",
    "نظمت المحافظة ورشة عمل لتدريب المواطنين على الخدمات الإلكترونية.",
    "انطلقت حملة نظافة شاملة بمشاركة شركة نهضة مصر وشركة الجيزة الخضراء.",
    "كرم المحافظ 50 طالباً من أوائل الثانوية العامة بحضور أولياء الأمور.",
    "افتتح المحافظ معرض الكتاب بحضور عدد من الكتاب والمثقفين.",
    "تفقد المحافظ سير العمل بمستشفى أم المصريين والخدمات المقدمة للمرضى.",
    "نظمت شركة المياه ندوة توعوية عن ترشيد استهلاك المياه بمدارس النيل.",
    "أعلن المحافظ ارتفاع نسبة الإنجاز بمشروع محور الفريق كمال عامر.",
    "احتفلت المحافظة بعيد الشرطة وتكريم أسر الشهداء."
)
$newsContents = @(
    "تفاصيل المشروع تشمل إنشاء شبكات صرف صحي ورصف طرق جديدة بتكلفة 50 مليون جنيه.",
    "تشمل الأعمال رصف الطبقة الرابطة وتوسعة الطريق إلى 4 حارات مرورية.",
    "تم تدريب 200 مواطن على كيفية استخدام بوابة المحافظة للحصول على الخدمات.",
    "شارك في الحملة 500 عامل وتأتي ضمن خطة النظافة الشاملة للمحافظة.",
    "تم تكريم الطلاب في قاعة المؤتمرات بحضور مديري المدارس.",
    "يشارك في المعرض 100 دار نشر ويستمر حتى 10 مايو القادم.",
    "قام المحافظ بجولة تفقدية داخل الأقسام واستمع إلى شكاوى المواطنين.",
    "تناولت الندوة طرق ترشيد المياه وكيفية إصلاح التسريبات المنزلية.",
    "المشروع يربط بين عدة محاور رئيسية لتسهيل حركة المرور.",
    "شهد الحفل عرضاً عسكرياً وتكريم ضباط الشرطة المتميزين."
)

for ($i=0; $i -lt 10; $i++) {
    $body = @{
        title_ar = $newsTitles[$i]
        title_en = ""
        slug = $newsSlugs[$i]
        summary_ar = $newsSummaries[$i]
        summary_en = ""
        content_ar = $newsContents[$i]
        content_en = ""
        category = "أخبار عامة"
        priority = Get-Random -Minimum 0 -Maximum 2
        is_featured = $true
        published_at = (Get-Date).AddDays(-(Get-Random -Minimum 1 -Maximum 30)).ToString("yyyy-MM-ddTHH:mm:ssZ")
    } | ConvertTo-Json -Depth 3
    try {
        Invoke-RestMethod -Uri "$DIRECTUS_URL/items/news_articles" -Method Post -Body $body -ContentType "application/json" | Out-Null
        Write-Host "  Added news article: $($newsTitles[$i])" -ForegroundColor Green
    } catch {
        Write-Host "  Failed to add news article: $_" -ForegroundColor Red
    }
}

# ------------------------------
# 2. Directus: Services (10)
# ------------------------------
Write-Host "`nCreating 10 services in Directus..." -ForegroundColor Yellow
$serviceNames = @(
    "رخصة بناء جديدة", "بيان صلاحية الموقع", "العلاج على نفقة الدولة",
    "التأمين الصحي الشامل", "حماية الطفل", "مكافحة الإدمان",
    "دليل المدارس", "الرقم القومي الموحد للعقار", "توصيل مياه", "رخصة لافتات"
)
$serviceSlugs = @(
    "رخصة-بناء-جديدة", "بيان-صلاحية-الموقع", "العلاج-على-نفقة-الدولة",
    "التأمين-الصحي-الشامل", "حماية-الطفل", "مكافحة-الإدمان",
    "دليل-المدارس", "الرقم-القومي-الموحد-للعقار", "توصيل-مياه", "رخصة-لافتات"
)
$serviceDesc = @(
    "إصدار رخصة بناء وفقاً للقانون 119 لسنة 2008",
    "بيان يثبت صلاحية الموقع للبناء",
    "تقديم طلب علاج على نفقة الدولة",
    "التسجيل في منظومة التأمين الصحي الشامل",
    "خدمات الدعم والحماية للأطفال",
    "خدمات علاج وتأهيل لمدمني المخدرات",
    "دليل شامل للمدارس في المحافظة",
    "الحصول على الرقم القومي الموحد للعقار",
    "طلب توصيل خدمة المياه للعقار",
    "تصريح لتركيب الافتات الإعلانية"
)

for ($i=0; $i -lt 10; $i++) {
    $body = @{
        name_ar = $serviceNames[$i]
        name_en = ""
        slug = $serviceSlugs[$i]
        description_ar = $serviceDesc[$i]
        description_en = ""
        is_featured = $true
        display_order = $i
    } | ConvertTo-Json -Depth 3
    try {
        Invoke-RestMethod -Uri "$DIRECTUS_URL/items/services" -Method Post -Body $body -ContentType "application/json" | Out-Null
        Write-Host "  Added service: $($serviceNames[$i])" -ForegroundColor Green
    } catch {
        Write-Host "  Failed to add service: $_" -ForegroundColor Red
    }
}

# ------------------------------
# 3. Directus: Events (5)
# ------------------------------
Write-Host "`nCreating 5 events in Directus..." -ForegroundColor Yellow
$eventTitles = @(
    "معرض الجيزة للكتاب", "ماراثون الجيزة الرياضي", "احتفالية عيد الأم",
    "مؤتمر الاستثمار بالمحافظة", "ليالي الجيزة الرمضانية"
)
$eventDesc = @(
    "الدورة 15 لمعرض الكتاب بمشاركة 100 دار نشر",
    "ماراثون سنوي بشارع النيل لمسافات 5 و10 كم",
    "احتفالية بتكريم الأمهات المثاليات بالمحافظة",
    "لقاء مع المستثمرين لعرض فرص الاستثمار",
    "فعاليات ثقافية وفنية خلال شهر رمضان"
)
$eventLocations = @(
    "أرض المعارض - الجيزة",
    "شارع النيل - الجيزة",
    "ديوان عام المحافظة",
    "مركز المؤتمرات - الشيخ زايد",
    "حديقة الأورمان"
)
$startDates = @(
    "2025-05-10", "2025-06-15", "2025-04-01", "2025-05-20", "2026-03-01"
)

for ($i=0; $i -lt 5; $i++) {
    $body = @{
        title_ar = $eventTitles[$i]
        title_en = ""
        description_ar = $eventDesc[$i]
        description_en = ""
        start_date = $startDates[$i]
        end_date = $startDates[$i]
        location_ar = $eventLocations[$i]
        location_en = ""
        is_active = $true
    } | ConvertTo-Json -Depth 3
    try {
        Invoke-RestMethod -Uri "$DIRECTUS_URL/items/events" -Method Post -Body $body -ContentType "application/json" | Out-Null
        Write-Host "  Added event: $($eventTitles[$i])" -ForegroundColor Green
    } catch {
        Write-Host "  Failed to add event: $_" -ForegroundColor Red
    }
}

# ------------------------------
# 4. PostgreSQL: Users (5)
# ------------------------------
Write-Host "`nCreating 5 users in PostgreSQL..." -ForegroundColor Yellow

$users = @(
    @{username="ahmed_mohamed"; email="ahmed@demo.com"; national_id="12345678901234"; phone="01001234567"; password="hashed123"; role="citizen"; governorate="giza"}
    @{username="sara_hassan"; email="sara@demo.com"; national_id="12345678905678"; phone="01001234568"; password="hashed123"; role="citizen"; governorate="alexandria"}
    @{username="mohamed_ali"; email="mohamed@demo.com"; national_id="12345678909999"; phone="01001234569"; password="hashed123"; role="citizen"; governorate="giza"}
    @{username="fatma_mostafa"; email="fatma@demo.com"; national_id="12345678901234"; phone="01001234570"; password="hashed123"; role="citizen"; governorate="giza"}
    @{username="ali_ibrahim"; email="ali@demo.com"; national_id="12345678903333"; phone="01001234571"; password="hashed123"; role="citizen"; governorate="giza"}
)

foreach ($user in $users) {
    $insert = @"
INSERT INTO users (username, email, national_id, phone, password_hash, role, governorate, email_verified)
SELECT * FROM (SELECT '$($user.username)', '$($user.email)', '$($user.national_id)', '$($user.phone)', '$($user.password)', '$($user.role)', '$($user.governorate)', true) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = '$($user.email)');
"@
    docker compose exec -T postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -c $insert 2>$null
    Write-Host "  Added user: $($user.username)" -ForegroundColor Green
}

# ------------------------------
# 5. PostgreSQL: Service Applications (5), Complaints (5), Marketplace Listings (5)
# ------------------------------
Write-Host "`nCreating 5 service applications..." -ForegroundColor Yellow
$services = @("1","2","3","4","5") # assuming IDs 1-5 exist in services table
for ($i=1; $i -le 5; $i++) {
    $appId = "APP-$(Get-Date -Format "yyyyMMddHHmmss")$i"
    $userId = $i
    $serviceId = $i
    $data = "{`"description`":`"Service application test $i`"}"
    $insert = @"
INSERT INTO service_applications (application_id, service_id, user_id, application_data, status, submitted_at)
VALUES ('$appId', $serviceId, $userId, '$data', 'pending', NOW());
"@
    docker compose exec -T postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -c $insert 2>$null
    Write-Host "  Added service application $i" -ForegroundColor Green
}

Write-Host "`nCreating 5 complaints..." -ForegroundColor Yellow
$complaints = @(
    @{subject="شكوى حول خدمة المرور"; desc="تأخر استخراج رخصة القيادة"},
    @{subject="شكوى حول النظافة"; desc="تراكم القمامة بشارع النيل"},
    @{subject="شكوى حول كهرباء"; desc="انقطاع الكهرباء المتكرر"},
    @{subject="شكوى حول مياه"; desc="انخفاض ضغط المياه بالعمرانية"},
    @{subject="شكوى حول ترخيص"; desc="تأخر تجديد رخصة المحل"}
)
for ($i=1; $i -le 5; $i++) {
    $compId = "CMP-$(Get-Date -Format "yyyyMMddHHmmss")$i"
    $userId = $i
    $subject = $complaints[$i-1].subject
    $desc = $complaints[$i-1].desc
    $insert = @"
INSERT INTO complaints (complaint_id, user_id, full_name, email, phone, subject, description, governorate, status, created_at)
VALUES ('$compId', $userId, 'Test User', 'test$i@example.com', '0123456789$i', '$subject', '$desc', 'giza', 'pending', NOW());
"@
    docker compose exec -T postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -c $insert 2>$null
    Write-Host "  Added complaint $i" -ForegroundColor Green
}

Write-Host "`nCreating 5 marketplace listings..." -ForegroundColor Yellow
$listings = @(
    @{title="عسل نحل طبيعي"; desc="عسل نحل 100% إنتاج منزلي"; price="250"; district="الهرم"; contact="01000000001"},
    @{title="غرفة نوم مستعملة بحالة جيدة"; desc="غرفة نوم كاملة"; price="3500"; district="العمرانية"; contact="01000000002"},
    @{title="دروس خصوصة لغة عربية"; desc="مدرس خبرة 10 سنوات"; price="150"; district="فيصل"; contact="01000000003"},
    @{title="توصيل مشاوير داخل الجيزة"; desc="خدمة توصيل سريعة"; price="50"; district="بولاق"; contact="01000000004"},
    @{title="لاب توب مستعمل"; desc="ماركة ديل i5, 8GB RAM"; price="8000"; district="الدقي"; contact="01000000005"}
)
for ($i=1; $i -le 5; $i++) {
    $listId = "LST-$(Get-Date -Format "yyyyMMddHHmmss")$i"
    $userId = $i
    $title = $listings[$i-1].title
    $desc = $listings[$i-1].desc
    $price = $listings[$i-1].price
    $district = $listings[$i-1].district
    $phone = $listings[$i-1].contact
    $insert = @"
INSERT INTO marketplace_listings (listing_number, user_id, title_ar, description_ar, price, governorate, district, contact_phone, status, created_at)
VALUES ('$listId', $userId, '$title', '$desc', $price, 'الجيزة', '$district', '$phone', 'active', NOW());
"@
    docker compose exec -T postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -c $insert 2>$null
    Write-Host "  Added listing: $title" -ForegroundColor Green
}

Write-Host "`nAll test data generated successfully!" -ForegroundColor Green