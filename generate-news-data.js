const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'postgres',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
});

const newsData = [
  {
    title_ar: "محافظ الجيزة يفتتح معرض الجيزة للكتاب في دورته الـ15",
    summary_ar: "شهد المهندس عادل النجار محافظ الجيزة افتتاح معرض الجيزة للكتاب بحضور عدد من الكتاب والمثقفين.",
    content_ar: "يشارك في المعرض 100 دار نشر ويستمر حتى 10 مايو القادم. تضمن الافتتاح تكريم عدد من الأدباء والمبدعين من أبناء المحافظة.",
    category: "ثقافة",
    priority: 1,
    is_featured: true,
  },
  {
    title_ar: "إنجاز 80% من مشروع توسعة طريق الحفرية",
    summary_ar: "أعلن المحافظ ارتفاع نسبة الإنجاز بمشروع توسعة وتطوير طريق الحفرية بدءًا من محور الفريق كمال عامر وحتى مشتل القاهرة.",
    content_ar: "المشروع يربط بين عدة محاور رئيسية لتسهيل حركة المرور، ويشمل رصف الطبقة الرابطة وتوسعة الطريق إلى 4 حارات مرورية.",
    category: "خدمات",
    priority: 2,
    is_featured: true,
  },
  {
    title_ar: "القبض على تشكيل عصابي تخصص في سرقة السيارات",
    summary_ar: "تمكنت الأجهزة الأمنية من القبض على تشكيل عصابي مكون من 4 أفراد تخصص في سرقة السيارات بمنطقة بولاق الدكرور.",
    content_ar: "اعترف المتهمون بارتكاب 12 واقعة سرقة، وتم اتخاذ الإجراءات القانونية اللازمة.",
    category: "أمن",
    priority: 1,
    is_featured: true,
  },
  {
    title_ar: "ندوة عن ترشيد استهلاك المياه بمدارس الجيزة",
    summary_ar: "نظمت شركة مياه الشرب ندوة توعوية عن ترشيد استهلاك المياه بمدرسة النيل الابتدائية.",
    content_ar: "تناولت الندوة طرق ترشيد المياه وكيفية إصلاح التسريبات المنزلية، وشارك فيها 200 طالب.",
    category: "صحة",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "بدء تلقي طلبات التصالح في مخالفات البناء للمرحلة الثالثة",
    summary_ar: "أعلنت المحافظة عن بدء تلقي طلبات التصالح في مخالفات البناء وفقاً لقانون 187 لسنة 2023.",
    content_ar: "يمكن للمواطنين التقديم عبر المراكز التكنولوجية أو بوابة المحافظة الإلكترونية.",
    category: "خدمات",
    priority: 1,
    is_featured: true,
  },
  {
    title_ar: "احتفالية كبرى بمناسبة عيد الشرطة",
    summary_ar: "شهدت المحافظة احتفالية كبرى بمناسبة عيد الشرطة، حيث تم تكريم أسر الشهداء.",
    content_ar: "حضر الاحتفالية القيادات التنفيذية والأمنية، وتم عرض فيلم تسجيلي عن بطولات رجال الشرطة.",
    category: "أخبار عامة",
    priority: 1,
    is_featured: false,
  },
  {
    title_ar: "افتتاح وحدة مطافئ جديدة بمدينة 6 أكتوبر",
    summary_ar: "تم افتتاح وحدة مطافئ جديدة بمنطقة الصناعات الصغيرة في السادس من أكتوبر.",
    content_ar: "تضم الوحدة 5 سيارات إطفاء حديثة وطاقم مدرب للتعامل مع الحرائق في المنطقة الصناعية.",
    category: "خدمات",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "محافظ الجيزة يتفقد أعمال تطوير حديقة الأورمان",
    summary_ar: "تفقد المحافظ أعمال تطوير حديقة الأورمان النباتية والتي تشمل إنشاء مناطق جلوس ومسارح مفتوحة.",
    content_ar: "تأتي أعمال التطوير ضمن خطة المحافظة لتحسين الخدمات الترفيهية للمواطنين.",
    category: "ثقافة",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "القبض على 15 متهماً في حملة أمنية موسعة",
    summary_ar: "شنت الأجهزة الأمنية حملة موسعة أسفرت عن ضبط 15 متهماً مطلوبين في قضايا متنوعة.",
    content_ar: "تم اتخاذ الإجراءات القانونية وجاري العرض على النيابة العامة.",
    category: "أمن",
    priority: 1,
    is_featured: true,
  },
  {
    title_ar: "بدء التسجيل لرياض الأطفال للعام الدراسي الجديد",
    summary_ar: "أعلنت مديرية التربية والتعليم بدء التسجيل لمرحلة رياض الأطفال (KG1) إلكترونياً.",
    content_ar: "يمكن لأولياء الأمور التقديم عبر بوابة المحافظة التعليمية حتى نهاية مايو.",
    category: "خدمات",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "توزيع 5000 كرتونة مواد غذائية على الأسر الأكثر احتياجاً",
    summary_ar: "قامت المحافظة بتوزيع كراتين مواد غذائية ضمن مبادرة سحور الخير.",
    content_ar: "شمل التوزيع مناطق الوراق والعمرانية وبولاق الدكرور.",
    category: "اجتماعي",
    priority: 1,
    is_featured: false,
  },
  {
    title_ar: "إطلاق قافلة طبية مجانية بقرية كفر غطاطي",
    summary_ar: "نظمت مديرية الصحة قافلة طبية مجانية شملت 8 تخصصات طبية.",
    content_ar: "تم الكشف على 1200 مريض وصرف الأدوية بالمجان.",
    category: "صحة",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "محافظ الجيزة يشارك في مؤتمر الاستثمار بالمحافظة",
    summary_ar: "شارك المحافظ في مؤتمر الاستثمار الذي حضره أكثر من 100 مستثمر.",
    content_ar: "تم عرض فرص الاستثمار في المنطقة اللوجستية وأطراف المحافظة.",
    category: "اقتصاد",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "رفع كفاءة الطرق الداخلية بـ 12 حياً",
    summary_ar: "أعلنت المحافظة رفع كفاءة الطرق الداخلية في 12 حياً ضمن خطة الصيانة السنوية.",
    content_ar: "شملت الأعمال رصف وإعادة إنارة وتركيب مطبات صناعية.",
    category: "خدمات",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "دورة تدريبية للشباب على ريادة الأعمال",
    summary_ar: "نظم مركز الشباب دورة تدريبية حول ريادة الأعمال بالتعاون مع جهاز تنمية المشروعات.",
    content_ar: "شارك في الدورة 50 شاباً وتم عرض قصص نجاح محلية.",
    category: "اقتصاد",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "حملة نظافة كبرى بمنطقة الهرم",
    summary_ar: "نفذت أحياء الهرم حملة نظافة مكبرة شملت رفع المخلفات ونقلها.",
    content_ar: "شارك في الحملة 200 عامل وتم رفع 500 طن مخلفات.",
    category: "خدمات",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "تكريم المتفوقين في الثانوية العامة",
    summary_ar: "كرم المحافظ أوائل الثانوية العامة وتوزيع جوائز تشجيعية.",
    content_ar: "حضر التكريم أولياء الأمور ومديري المدارس.",
    category: "تعليم",
    priority: 1,
    is_featured: true,
  },
  {
    title_ar: "افتتاح مركز تكنولوجي جديد بفيصل",
    summary_ar: "تم افتتاح مركز تكنولوجي جديد بحي فيصل لخدمة المواطنين.",
    content_ar: "يقدم المركز خدمات استخراج بطاقات الرقم القومي وتجديد التراخيص.",
    category: "خدمات",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "ندوة عن مكافحة الإدمان في المدارس الثانوية",
    summary_ar: "نظم صندوق مكافحة الإدمان ندوة توعوية في مدرسة السعيدية الثانوية.",
    content_ar: "تناولت الندوة أضرار المخدرات وكيفية حماية الشباب.",
    category: "صحة",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "محافظ الجيزة يوجه بتشكيل لجنة لمراجعة الإشغالات",
    summary_ar: "وجه المحافظ بتشكيل لجنة لمراجعة قرارات تراخيص الإشغالات والتعديات.",
    content_ar: "تهدف اللجنة إلى تنظيم الشوارع الرئيسية ورفع كفاءة المظهر الحضاري.",
    category: "خدمات",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "إطلاق مبادرة 'زرع شجرة' في المدارس",
    summary_ar: "أطلقت المحافظة مبادرة لزراعة 5 آلاف شجرة في المدارس والمرافق العامة.",
    content_ar: "تهدف المبادرة إلى زيادة المساحات الخضراء وتحسين البيئة.",
    category: "بيئة",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "تنظيم معرض للصناعات اليدوية والتراثية",
    summary_ar: "نظمت المحافظة معرضاً للصناعات اليدوية شارك فيه 50 عارضاً.",
    content_ar: "عُرضت منتجات الخيامية والنحاس والسجاد اليدوي.",
    category: "ثقافة",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "رفع درجة الاستعداد لاستقبال فصل الشتاء",
    summary_ar: "أعلنت غرفة العمليات رفع درجة الاستعداد لاستقبال موجة الطقس السيئ.",
    content_ar: "تم تجهيز فرق للطوارئ لسحب المياه وحالات التكدس المروري.",
    category: "خدمات",
    priority: 1,
    is_featured: true,
  },
  {
    title_ar: "محافظ الجيزة يستقبل سفير دولة الإمارات",
    summary_ar: "استقبل المحافظ سفير دولة الإمارات لبحث سبل التعاون المشترك.",
    content_ar: "تناول اللقاء مناقشة مشروعات تطوير البنية التحتية والاستثمار.",
    category: "سياسة",
    priority: 0,
    is_featured: false,
  },
  {
    title_ar: "تسليم 500 عقد دعم لأصحاب الحرف الصغيرة",
    summary_ar: "سلم المحافظ 500 عقد دعم مالي لأصحاب الحرف والصناعات الصغيرة.",
    content_ar: "يشمل الدعم تمويل مشروعات بتسهيلات ميسرة.",
    category: "اقتصاد",
    priority: 0,
    is_featured: false,
  },
];

async function generateNews() {
  console.log('📰 Generating synthetic news data...');
  let inserted = 0;

  for (const item of newsData) {
    const newsNumber = `NEWS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const publishedAt = new Date();
    publishedAt.setDate(publishedAt.getDate() - Math.floor(Math.random() * 30)); // random date in last 30 days

    const query = `
      INSERT INTO governorate_news (
        news_number, title_ar, summary_ar, content_ar, category,
        priority, is_featured, published_at, views, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'published')
      ON CONFLICT (news_number) DO NOTHING
    `;
    const values = [
      newsNumber, item.title_ar, item.summary_ar, item.content_ar,
      item.category, item.priority, item.is_featured, publishedAt,
      Math.floor(Math.random() * 500), // random views
    ];
    try {
      const res = await pool.query(query, values);
      if (res.rowCount > 0) inserted++;
      console.log(`✅ Added: ${item.title_ar}`);
    } catch (err) {
      console.error(`❌ Failed: ${item.title_ar}`, err.message);
    }
    // Small delay to avoid timestamp collisions
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  console.log(`\n✨ Inserted ${inserted} news articles out of ${newsData.length}`);
  await pool.end();
}

generateNews().catch(console.error);