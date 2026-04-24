'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';

export default function AboutGovernoratePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const t = {
    ar: {
      title: 'محافظة الجيزة',
      subtitle: 'بوابة التاريخ والحضارة',
      intro: 'تُعد محافظة الجيزة واحدة من أكبر المحافظات المصرية وأكثرها تنوعاً، حيث تضم أهرامات الجيزة وأبو الهول، إحدى عجائب الدنيا السبع. تمتد المحافظة على مساحة واسعة وتشمل أحياء حضارية وحديثة، وتعتبر وجهة سياحية عالمية.',
      history: 'التاريخ العريق',
      historyText: 'تأسست محافظة الجيزة ككيان إداري حديث في القرن التاسع عشر، لكن تاريخ المنطقة يعود إلى عصر الدولة القديمة عندما شُيدت أهرامات الجيزة (حوالي 2580-2560 ق.م). كانت الجيزة جزءاً من إقليم "منف" عاصمة مصر القديمة. في العصر الإسلامي، ازدهرت المنطقة كمركز للزراعة والتجارة. شهدت الجيزة تطوراً كبيراً في القرنين العشرين والحادي والعشرين لتصبح امتداداً طبيعياً للقاهرة الكبرى، وتضم الآن أحياء حديثة مثل الشيخ زايد ومدينة 6 أكتوبر.',
      landmarks: 'المعالم الأثرية والسياحية',
      landmarksList: [
        { name: 'أهرامات الجيزة', desc: 'الهرم الأكبر للملك خوفو (هرم خوفو)، هرم خفرع، وهرم منقرع – وهي آخر عجائب الدنيا السبع القديمة المتبقية.' },
        { name: 'أبو الهول', desc: 'تمثال ضخم برأس إنسان وجسم أسد، يبلغ طوله 73 متراً وارتفاعه 20 متراً، يحرس هضبة الأهرامات منذ آلاف السنين.' },
        { name: 'المتحف المصري الكبير', desc: 'أكبر متحف أثري في العالم يضم أكثر من 100 ألف قطعة أثرية، يقع على بعد 2 كم من الأهرامات.' },
        { name: 'حديقة الأورمان النباتية', desc: 'واحدة من أقدم الحدائق النباتية في العالم، تضم آلاف الأنواع النادرة من النباتات والأشجار.' },
        { name: 'قرية الفراعنة', desc: 'قرية سياحية تحاكي الحياة الفرعونية القديمة بعروضها التفاعلية ومعارضها.' },
        { name: 'مركز المنارة للمؤتمرات', desc: 'أكبر مركز مؤتمرات في أفريقيا، يستضيف الفعاليات الدولية والمؤتمرات الكبرى.' },
        { name: 'شارع النيل', desc: 'منطقة ترفيهية مطلة على النيل تضم مطاعم وكافيهات وحدائق عامة.' },
        { name: 'سور مجرى العيون', desc: 'قناة مائية أثرية من العصر الأيوبي كانت تنقل المياه إلى القاهرة القديمة.' }
      ],
      famous: 'أبرز الشخصيات العامة',
      famousList: [
        { name: 'أحمد زويل', bio: 'عالم كيميائي مصري حاصل على جائزة نوبل في الكيمياء عام 1999 لأبحاثه في كيمياء الفيمتو ثانية. ولد في دمنهور لكنه ارتبط بالجيزة حيث تلقى تعليمه المبكر.' },
        { name: 'يوسف وهبي', bio: 'ممثل ومخرج مسرحي كبير، أحد رواد الفن المصري، أسس فرقة مسرحية في الجيزة وقدم أعمالاً خالدة.' },
        { name: 'صلاح جاهين', bio: 'شاعر ورسام كاريكاتيري، ولد في القاهرة وعاش في الجيزة. اشتهر بأعماله الوطنية وكتابة ملحمة الشاعرية.' },
        { name: 'فؤاد المهندس', bio: 'ممثل كوميدي كبير، من مواليد الجيزة، ويُعتبر أيقونة الكوميديا المصرية.' },
        { name: 'محمد صلاح', bio: 'لاعب كرة قدم عالمي، ولد في قرية نجريج بمحافظة الغربية لكنه ارتبط بالجيزة عبر نادى المقاولون العرب .' },
        { name: 'عمرو دياب', bio: 'مطرب عالمي، ولد في بورسعيد لكنه انتقل للعيش في الجيزة وساهم في تنشيط الحركة الفنية بها.' }
      ],
      map: 'خريطة المحافظة',
      activities: 'أنشطة يمكنك القيام بها',
      activitiesList: [
        'زيارة الأهرامات وأبو الهول والمتحف الكبير',
        'تسلق الهرم الأكبر (بعد الحصول على تصريح)',
        'ركوب الخيل أو العربات حول هضبة الأهرامات',
        'التنزه في حديقة الأورمان',
        'تناول الطعام على النيل في الزمالك أو الجزيرة',
        'التسوق في مولات الشيخ زايد ومدينة 6 أكتوبر',
        'حضور عروض الصوت والضوء عند الأهرامات ليلاً',
        'زيارة دير القديس سمعان الخراز بالمقطم'
      ],
      culture: 'الثقافة والفنون',
      cultureText: 'تحتضن الجيزة العديد من المهرجانات الثقافية مثل معرض الجيزة للكتاب ومهرجان الجاز الدولي. كما تنتشر فيها المسارح وصالات العرض، وتشتهر بالصناعات اليدوية كالخيامية والنقش على النحاس.'
    },
    en: {
      title: 'Giza Governorate',
      subtitle: 'Gateway to History and Civilization',
      intro: 'Giza Governorate is one of the largest and most diverse governorates in Egypt, home to the Pyramids of Giza and the Great Sphinx, one of the Seven Wonders of the Ancient World. It extends over a vast area and includes both historic and modern districts, making it a top global tourist destination.',
      history: 'Rich History',
      historyText: 'Giza Governorate was established as a modern administrative entity in the 19th century, but the region’s history dates back to the Old Kingdom when the Pyramids of Giza were built (c. 2580-2560 BC). Giza was part of the "Memphis" region, the capital of ancient Egypt. In the Islamic era, the area flourished as an agricultural and commercial center. Giza saw significant development in the 20th and 21st centuries, becoming a natural extension of Greater Cairo, now including modern districts like Sheikh Zayed and 6 October City.',
      landmarks: 'Landmarks & Tourist Attractions',
      landmarksList: [
        { name: 'Pyramids of Giza', desc: 'The Great Pyramid of Khufu, Pyramid of Khafre, and Pyramid of Menkaure – the last remaining wonder of the ancient world.' },
        { name: 'Great Sphinx', desc: 'A colossal statue with a human head and lion’s body, 73 m long and 20 m high, guarding the Giza Plateau.' },
        { name: 'Grand Egyptian Museum (GEM)', desc: 'The largest archaeological museum in the world, housing over 100,000 artifacts, located 2 km from the Pyramids.' },
        { name: 'Orman Botanical Garden', desc: 'One of the oldest botanical gardens in the world, featuring thousands of rare plant and tree species.' },
        { name: 'Pharaohs Village', desc: 'A themed tourist village that recreates ancient Egyptian life with interactive exhibits and shows.' },
        { name: 'Manara International Conference Center', desc: 'Africa’s largest convention center, hosting international events and conferences.' },
        { name: 'Nile Corniche', desc: 'A leisure promenade along the Nile with restaurants, cafes, and public gardens.' },
        { name: 'Sour Magra Al Oyoun', desc: 'An ancient aqueduct from the Ayyubid era that once carried water to Old Cairo.' }
      ],
      famous: 'Notable Figures',
      famousList: [
        { name: 'Ahmed Zewail', bio: 'Egyptian chemist and Nobel Prize winner (1999) for his work on femtochemistry. He studied in Giza early in his life.' },
        { name: 'Youssef Wahbi', bio: 'Renowned actor and theatre director, a pioneer of Egyptian drama who founded a theatre company in Giza.' },
        { name: 'Salah Jaheen', bio: 'Poet and caricature artist, known for his nationalist works and the famous "Sahran" series.' },
        { name: 'Fouad El-Mohandes', bio: 'Legendary comedic actor, born in Giza, considered an icon of Egyptian comedy.' },
        { name: 'Mohamed Salah', bio: 'World‑class footballer, born in Nagrig but associated with Giza through clubs like Al Ahly and Pyramids FC.' },
        { name: 'Amr Diab', bio: 'Internationally acclaimed singer, lived in Giza and contributed to its cultural scene.' }
      ],
      map: 'Governorate Map',
      activities: 'Things to Do',
      activitiesList: [
        'Visit the Pyramids, Sphinx, and the Grand Egyptian Museum',
        'Climb the Great Pyramid (with a permit)',
        'Go horse or carriage riding around the Pyramid Plateau',
        'Stroll through the Orman Botanical Garden',
        'Dine on a Nile boat in Zamalek or Gezira',
        'Shop at the modern malls of Sheikh Zayed and 6 October City',
        'Watch the Sound & Light Show at the Pyramids at night',
        'Visit St. Simon the Tanner Monastery in Mokattam'
      ],
      culture: 'Culture & Arts',
      cultureText: 'Giza hosts numerous cultural festivals such as the Giza Book Fair and the International Jazz Festival. It has many theatres and galleries, and is known for traditional crafts like khayamiya (tent‑making) and copper engraving.'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4 gap-2">
          <button onClick={() => setLang('ar')} className={`px-3 py-1 rounded ${lang === 'ar' ? 'bg-primary text-white' : 'bg-gray-200'}`}>العربية</button>
          <button onClick={() => setLang('en')} className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}>English</button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t[lang].title}</h1>
          <p className="text-primary text-lg mb-6">{t[lang].subtitle}</p>
          <p className="text-gray-700 leading-relaxed mb-8">{t[lang].intro}</p>

          {/* History Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t[lang].history}</h2>
            <p className="text-gray-700 leading-relaxed">{t[lang].historyText}</p>
          </section>

          {/* Landmarks Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t[lang].landmarks}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {t[lang].landmarksList.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-primary mb-2">{item.name}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Famous Figures */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t[lang].famous}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {t[lang].famousList.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-primary mb-2">{item.name}</h3>
              </div>
              ))}
            </div>
          </section>

          {/* Activities */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t[lang].activities}</h2>
            <ul className="grid md:grid-cols-2 gap-2 list-disc list-inside text-gray-700">
              {t[lang].activitiesList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Culture */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t[lang].culture}</h2>
            <p className="text-gray-700 leading-relaxed">{t[lang].cultureText}</p>
          </section>

          {/* Map Placeholder */}
          <section>
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t[lang].map}</h2>
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center text-gray-500">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.60311266886!2d31.15421304143055!3d30.013055630529995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e21f1ad9a9d%3A0x6cebf6edf3c4fbb1!2sGiza%20Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Giza Map"
              ></iframe>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}