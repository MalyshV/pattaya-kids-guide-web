/**
 * Наполнение карточек занятий из сбора 21.10.2026 (13.11.2026): все
 * опубликованные занятия, у которых на сайте оставалась пометка «[черновик]».
 * Название EN/TH, описание RU/EN/TH (в конце — как связаться: у занятия нет
 * отдельных полей контактов), «Полезно знать», возраст, цена, таблица групп,
 * категория, обложка и галерея. Занос — prisma/add-activities-fill-2026-11.ts
 * (заполняет только пустое: правки из админки не затирает).
 *
 * Источники прочитаны 13.11.2026: Instagram и Facebook школ (со входом), их
 * сайты, LINE, карточки на картах, отзывы. Цены — только с официальных
 * страниц и прайсов; наблюдения из отзывов помечены «по отзывам». Чего
 * источники не говорят, того здесь нет. Фото — со страниц самих школ,
 * 1024 px, без метаданных, без крупных лиц чужих детей. Сомнения и источники
 * по каждому занятию — в описании PR; не детские и похожие на закрытые сюда
 * не вошли — список в docs/HARVEST_2026_10.md.
 */
import type { ProgramFill } from "../../src/lib/import/program-fill";

export const ACTIVITIES_FILL_2026_11: readonly ProgramFill[] = [
  // Above Academy
  {
    slug: "above-academy-pattaya",
    nameEn: "Acting classes at Above Academy",
    nameTh: "สถาบันสอนการแสดง Above Academy",
    description:
      "Above Academy — школа актёрского мастерства при небольшой кино- и видеостудии (Action Scene Co., Ltd.) в Хуай Яй. Дети учатся играть на камеру и на сцене: упражнения, придуманные самими учениками сценки, съёмки коротких фильмов на площадке, знакомство с тем, как устроены съёмки изнутри. Группы по возрасту: Junior 6–11 лет, Advance от 12 лет, отдельно — взрослые. Ведут на английском и тайском. Пробное занятие — только по предварительной записи, без «зайти с улицы». Цены и расписание в открытых постах не публикуют — уточняйте при записи. Телефон: 061 546 3655, LINE: @aboveacademy, Facebook: facebook.com/AboveAcademy.ActionScene.",
    descriptionEn:
      "Above Academy is an acting school run by a small film and video studio (Action Scene Co., Ltd.) in Huai Yai. Children learn to act on camera and on stage: exercises, scenes they devise themselves, shooting short films on set, and a look at how a film shoot works behind the scenes. Groups by age: Junior 6–11, Advance 12 and up, plus a separate adult class. Classes are taught in English and Thai. Trial lessons are by appointment only, no walk-ins. Prices and timetable aren't published in public posts — please ask when booking. Phone: 061 546 3655, LINE: @aboveacademy, Facebook: facebook.com/AboveAcademy.ActionScene.",
    descriptionTh:
      "Above Academy สถาบันสอนการแสดงของสตูดิโอผลิตภาพยนตร์และสื่อออนไลน์ บริษัท แอ๊คชั่นซีน จำกัด ย่านห้วยใหญ่ เด็ก ๆ ได้ฝึกการแสดงทั้งหน้ากล้องและบนเวที ออกแบบการแสดงด้วยตัวเอง เรียนภาคสนามและถ่ายทำหนังสั้น ได้เรียนรู้ทั้งเบื้องหน้าและเบื้องหลัง แบ่งกลุ่มตามอายุ: Junior 6–11 ปี, Advance 12 ปีขึ้นไป และคลาสผู้ใหญ่ สอนภาษาอังกฤษและภาษาไทย ทดลองเรียนต้องจองล่วงหน้า ไม่รับ walk-in ค่าเรียนและตารางเรียนกรุณาสอบถามตอนจอง โทร 061 546 3655, LINE: @aboveacademy, Facebook: facebook.com/AboveAcademy.ActionScene",
    tips: [
      {
        text: "Пробное занятие — только по записи через LINE @aboveacademy или сообщения на странице в Facebook; без записи не принимают.",
        textEn:
          "Trial lessons are by appointment only — book via LINE @aboveacademy or a Facebook message; no walk-ins.",
        textTh:
          "ทดลองเรียนต้องจองล่วงหน้าทาง LINE @aboveacademy หรือ Inbox เพจ Facebook ไม่รับ walk-in",
      },
      {
        text: "Занятия ведут на английском и тайском — подходит и детям, которые не говорят по-тайски.",
        textEn:
          "Classes are taught in English and Thai, so they work for children who don't speak Thai.",
        textTh: "สอนเป็นภาษาอังกฤษและภาษาไทย",
      },
      {
        text: "Студия сама снимает фильмы и сериалы и время от времени набирает учеников в съёмки: например, весной 2026 искали детей 7–15 лет в сериал.",
        textEn:
          "The studio produces its own films and series and sometimes casts students: in spring 2026, for example, it was looking for children aged 7–15 for a series.",
        textTh:
          "สตูดิโอผลิตภาพยนตร์และซีรีส์เอง และเปิดรับนักเรียนร่วมแสดงเป็นครั้งคราว เช่น ช่วงเมษายน 2026 รับสมัครเด็กอายุ 7–15 ปีเพื่อร่วมแสดงซีรีส์",
      },
    ],
    minAgeMonths: 72,
    classes: [
      {
        name: "Junior",
        nameEn: "Junior",
        nameTh: "Junior",
        ageLabel: "6–11 лет",
        ageLabelEn: "6–11 years",
        ageLabelTh: "6–11 ปี",
        minAgeMonths: 72,
        maxAgeMonths: 132,
        parentRequired: null,
        schedule: "по записи",
        scheduleEn: "by appointment",
        scheduleTh: "ตามนัดหมาย",
      },
      {
        name: "Advance",
        nameEn: "Advance",
        nameTh: "Advance",
        ageLabel: "от 12 лет",
        ageLabelEn: "12+ years",
        ageLabelTh: "12 ปีขึ้นไป",
        minAgeMonths: 144,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "по записи",
        scheduleEn: "by appointment",
        scheduleTh: "ตามนัดหมาย",
      },
    ],
    categorySlugs: ["art"],
  },
  // Art School Pattaya (สอนศิลป์เมืองพัทยา)
  {
    slug: "art-school-pattaya",
    nameEn: "Art School Pattaya (Son Sin Mueang Pattaya)",
    nameTh: "สอนศิลป์เมืองพัทยา",
    description:
      "Небольшая школа рисования в Нонг Прыэ, за железнодорожным переездом на Soi Chaiyapornvithi 8; при студии работает BumbleBee Art Cafe. Берут детей с 5 лет, школьников и взрослых, можно без подготовки: рисунок и основы цвета, акварель, гуашь, акрил и масло, комикс и аниме, лепка из лёгкой корейской глины, цифровой рисунок на iPad (с 6 лет) и 3D-моделирование с печатью на 3D-принтере. Для старших — подготовка портфолио к поступлению на художественные и архитектурные факультеты. Занятия с субботы по четверг (пятница — выходной): утром 9:00–12:00 и днём 13:00–18:00, по предварительной записи за день; материалы дают. Занятие лепкой для детей длится 1–2 часа, работу забирают домой. Стоимость курсов не публикуют — уточняйте. Телефон и LINE: 099 496 9428, Facebook: «สอนศิลป์เมืองพัทยา» (StudioArt.pattaya), Instagram: @artschool_pattaya.",
    descriptionEn:
      'A small art school in Nong Prue, just across the railway on Soi Chaiyapornvithi 8, with the BumbleBee Art Cafe on site. It takes children from age 5, school students and adults, no experience needed: drawing and colour basics, watercolour, poster paint, acrylic and oil, cartoons and anime, Korean air-dry clay modelling, digital drawing on iPad (from age 6) and 3D design with 3D printing. Older students can prepare an admission portfolio for art and architecture faculties. Classes run Saturday to Thursday (closed Fridays): mornings 9:00–12:00 and afternoons 13:00–18:00, booked a day in advance; materials are provided. A children\'s clay session lasts 1–2 hours and the piece goes home with the child. Course prices are not published — please ask. Phone and LINE: 099 496 9428, Facebook: "สอนศิลป์เมืองพัทยา" (StudioArt.pattaya), Instagram: @artschool_pattaya.',
    descriptionTh:
      "โรงเรียนสอนศิลปะขนาดเล็กในหนองปรือ ข้ามทางรถไฟ ซอยชัยพรวิถี 8 ภายในมีร้าน BumbleBee Art Cafe รับเด็กตั้งแต่ 5 ขวบ นักเรียนประถม มัธยม และผู้ใหญ่ ไม่ต้องมีพื้นฐาน สอนวาดเส้นและทฤษฎีสี สีน้ำ สีโปสเตอร์ สีอะคริลิกและสีน้ำมัน วาดการ์ตูนและอนิเมะ ปั้นดินเบาเกาหลี วาดภาพดิจิทัลบน iPad (ตั้งแต่ 6 ขวบ) และออกแบบ 3D พร้อมพิมพ์ด้วยเครื่อง 3D Printer สำหรับนักเรียนโตมีติวพอร์ตโฟลิโอเข้าคณะศิลปกรรมและสถาปัตยกรรม เปิดวันเสาร์–พฤหัสบดี (หยุดวันศุกร์) รอบเช้า 9:00–12:00 น. และรอบบ่าย 13:00–18:00 น. กรุณาจองล่วงหน้า 1 วัน มีอุปกรณ์ให้ คลาสปั้นสำหรับเด็กใช้เวลา 1–2 ชั่วโมง นำผลงานกลับบ้านได้ ค่าเรียนคอร์สไม่ได้ประกาศไว้ กรุณาสอบถาม โทรและ LINE: 099 496 9428 Facebook: สอนศิลป์เมืองพัทยา Instagram: @artschool_pattaya",
    tips: [
      {
        text: "Записываться нужно заранее — минимум за день; в пятницу школа закрыта.",
        textEn: "Book at least a day in advance; the school is closed on Fridays.",
        textTh: "กรุณาจองล่วงหน้าอย่างน้อย 1 วัน โรงเรียนหยุดทุกวันศุกร์",
      },
      {
        text: "Материалы дают на месте, а слепленную работу ребёнок сразу забирает домой.",
        textEn:
          "Materials are provided, and the child takes the finished clay piece home the same day.",
        textTh: "มีอุปกรณ์ให้ และเด็กนำผลงานปั้นกลับบ้านได้ทันที",
      },
      {
        text: "При студии кафе с напитками и закусками — взрослому есть где подождать.",
        textEn:
          "There is a cafe with drinks and snacks at the studio, so an accompanying adult has somewhere to wait.",
        textTh: "ที่ร้านมีเครื่องดื่มและอาหารทานเล่น ผู้ปกครองนั่งรอได้",
      },
      {
        text: "Ориентир — за железнодорожным переездом в Нонг Прыэ, Soi Chaiyapornvithi 8.",
        textEn:
          "Landmark: just across the railway crossing in Nong Prue, Soi Chaiyapornvithi 8.",
        textTh: "จุดสังเกต: ข้ามทางรถไฟหนองปรือ ซอยชัยพรวิถี 8",
      },
      {
        text: "Кроме курсов бывают разовые мастер-классы: например, роспись холста акрилом (399–699 ฿ по прайсу 2023 года) или авторская кукла из глины (990 ฿) — актуальные цены уточняйте.",
        textEn:
          "Besides courses there are one-off workshops, such as acrylic canvas painting (399–699 ฿ in the 2023 price list) or a clay character doll (990 ฿) — check current prices.",
        textTh:
          "นอกจากคอร์สยังมีเวิร์กช็อปครั้งเดียว เช่น วาดภาพสีอะคริลิกบนแคนวาส (399–699 บาท ตามราคาปี 2023) หรือปั้นตุ๊กตาคาแรกเตอร์จากดินเบา (990 บาท) กรุณาสอบถามราคาปัจจุบัน",
      },
    ],
    minAgeMonths: 60,
    categorySlugs: ["art"],
  },
  // Artist Ace — рисование
  {
    slug: "artist-ace-keha",
    nameEn: "Art classes at Artist Ace",
    nameTh: "เรียนศิลปะที่ Artist Ace",
    description:
      "Artist Ace — арт-студия художницы Аси Сербиной в комплексе Keha Pattaya на Thepprasit Road (район Нонг Прыэ), светлое двухэтажное пространство. Занимаются дети и взрослые: рисунок, живопись акрилом, акварелью и гуашью, скетчинг, иллюстрация, объёмные картины, эпоксидная смола. На странице студии в Facebook сказано, что занятия индивидуальные; возраст учеников и расписание на сайте не указаны — уточняйте при записи. Сайт на русском, есть английская версия. Цены по сайту студии: разовое занятие 500 ฿, при оплате курса — 400 ฿ за занятие; курсы на 1, 3 и 6 месяцев — 4 800, 9 600 и 19 200 ฿, уточняйте. Телефон и WhatsApp: 080 753 2816, Instagram: @asyssenna_art, Facebook: facebook.com/artistaceart, Telegram: telegram.me/+XVV068JpRaNmNThi, сайт: artistace.com.",
    descriptionEn:
      "Artist Ace is the art studio of artist Asia Serbina in the Keha Pattaya complex on Thepprasit Road (Nong Prue area), a bright two-storey space. Both children and adults take classes: drawing, acrylic, watercolour and gouache painting, sketching, illustration, textured paintings and epoxy resin. The studio's Facebook page describes the sessions as individual; student ages and a timetable aren't listed on the website, so ask when you book. The website is in Russian with an English version. Prices from the studio's website: a single lesson is 500 ฿, or 400 ฿ per lesson when you pay for a course; courses of 1, 3 and 6 months cost 4,800, 9,600 and 19,200 ฿ — please confirm. Phone and WhatsApp: 080 753 2816, Instagram: @asyssenna_art, Facebook: facebook.com/artistaceart, Telegram: telegram.me/+XVV068JpRaNmNThi, website: artistace.com.",
    descriptionTh:
      "Artist Ace เป็นสตูดิโอศิลปะของศิลปิน Asia Serbina ในโครงการ Keha Pattaya ถนนเทพประสิทธิ์ (ย่านหนองปรือ) พื้นที่สองชั้นที่โปร่งและสว่าง เปิดสอนทั้งเด็กและผู้ใหญ่ ได้แก่ วาดเส้น ระบายสีอะคริลิก สีน้ำ และสีโปสเตอร์ สเก็ตช์ ภาพประกอบ ภาพนูน และงานเรซิน หน้า Facebook ของสตูดิโอระบุว่าเป็นการสอนแบบตัวต่อตัว เว็บไซต์ไม่ได้ระบุอายุผู้เรียนและตารางเรียน กรุณาสอบถามเมื่อจอง เว็บไซต์มีภาษารัสเซียและภาษาอังกฤษ ค่าเรียนตามเว็บไซต์: เรียนครั้งเดียว 500 บาท หากชำระเป็นคอร์สครั้งละ 400 บาท คอร์ส 1, 3 และ 6 เดือน ราคา 4,800, 9,600 และ 19,200 บาท กรุณาสอบถามอีกครั้ง โทรและ WhatsApp 080 753 2816 Instagram: @asyssenna_art Facebook: facebook.com/artistaceart เว็บไซต์ artistace.com",
    tips: [
      {
        text: "Занятия индивидуальные (по странице студии в Facebook), поэтому время подбирают под вас — договаривайтесь заранее по телефону или в WhatsApp.",
        textEn:
          "Sessions are individual (per the studio's Facebook page), so the time is arranged with you — book ahead by phone or WhatsApp.",
        textTh:
          "เป็นการสอนแบบตัวต่อตัว (ตามหน้า Facebook ของสตูดิโอ) จึงนัดเวลาได้ตามสะดวก ควรจองล่วงหน้าทางโทรศัพท์หรือ WhatsApp",
      },
      {
        text: "Разовое занятие стоит 500 ฿ — можно попробовать, прежде чем брать курс; в курсе занятие выходит 400 ฿ (по сайту студии).",
        textEn:
          "A single lesson costs 500 ฿, so you can try it before committing to a course; within a course a lesson works out at 400 ฿ (per the studio's website).",
        textTh:
          "เรียนครั้งเดียว 500 บาท ลองเรียนก่อนตัดสินใจซื้อคอร์สได้ ถ้าซื้อคอร์สตกครั้งละ 400 บาท (ตามเว็บไซต์ของสตูดิโอ)",
      },
      {
        text: "Студия в комплексе Keha Pattaya на Thepprasit Road, дом 449/25 — ориентируйтесь на этот номер.",
        textEn:
          "The studio is in the Keha Pattaya complex on Thepprasit Road, unit 449/25 — look for that number.",
        textTh: "สตูดิโออยู่ในโครงการ Keha Pattaya ถนนเทพประสิทธิ์ เลขที่ 449/25",
      },
    ],
    price: 500,
    priceUnit: "/ занятие",
    priceUnitEn: "/ lesson",
    priceUnitTh: "/ ครั้ง",
    categorySlugs: ["art"],
    cover: "/images/activities/artist-ace-keha.jpg",
    photos: [
      { url: "/images/activities/artist-ace-keha-2.jpg", caption: "Урок на мольберте" },
      { url: "/images/activities/artist-ace-keha-3.jpg", caption: "Работа ученика" },
    ],
    photoRightsNote: "С официальной страницы: сайт студии artistace.com, 2026-11",
    photoSource: "PLACE_OWNER",
  },
  // ATT Pattaya Table Tennis Club — настольный теннис
  {
    slug: "att-table-tennis-pattaya",
    nameEn: "ATT Pattaya Table Tennis Club",
    nameTh: "ปิงปอง ATT Pattaya Table Tennis Club",
    description:
      "Клуб настольного тенниса на 3-м этаже Mike Shopping Mall, в центре Паттайи, в 600 м от Walking Street. Клуб открыт каждый день с 11:00 до 21:00; групповые тренировки — в понедельник, среду и пятницу в 14:00 и 19:00, в остальные дни — турниры для любителей. Отдельных детских групп клуб не объявляет: группы общие, а детей тренеры берут на индивидуальные занятия — главный тренер Kirill (английский, русский) и тренер Bloom (английский, тайский) работают со взрослыми и детьми, помощник тренера Bow — с начинающими детьми. Цены по сайту клуба: групповая тренировка 400 ฿, абонемент на групповые на месяц 3 000 ฿, индивидуальная тренировка от 600 ฿ в час (в зависимости от тренера), аренда стола 200 ฿ в час на двоих — уточняйте. Телефон: 095 410 8727, LINE-группа клуба (ссылка на сайте), Facebook: PATTAYA.TABLETENNIS.SPORT.CLUB, Instagram: @attpattayatabletennis, сайт: table-tennis-pattaya.com.",
    descriptionEn:
      "A table tennis club on the 3rd floor of Mike Shopping Mall in central Pattaya, 600 m from Walking Street. Open daily 11:00–21:00; group training runs on Monday, Wednesday and Friday at 14:00 and 19:00, and on other days there are amateur tournaments. The club doesn't advertise separate kids' groups: the groups are mixed, and children train with coaches one-to-one — head coach Kirill (English, Russian) and coach Bloom (English, Thai) work with adults and children, and assistant coach Bow with children who are just starting. Prices from the club's website: a group session is 400 ฿, a monthly group-training pass 3,000 ฿, a private session from 600 ฿ an hour (depending on the coach), and table rental 200 ฿ an hour for two — please check. Phone: 095 410 8727, the club's LINE group (link on the website), Facebook: PATTAYA.TABLETENNIS.SPORT.CLUB, Instagram: @attpattayatabletennis, website: table-tennis-pattaya.com.",
    descriptionTh:
      "ชมรมปิงปองบนชั้น 3 ห้าง Mike Shopping Mall ใจกลางพัทยา ห่างจาก Walking Street ประมาณ 600 เมตร เปิดทุกวัน 11:00–21:00 ฝึกซ้อมแบบกลุ่มวันจันทร์ พุธ และศุกร์ เวลา 14:00 และ 19:00 ส่วนวันอื่นมีการแข่งขันสำหรับผู้เล่นสมัครเล่น ชมรมไม่ได้แยกกลุ่มสำหรับเด็กโดยเฉพาะ กลุ่มฝึกเป็นแบบรวม ส่วนเด็กสามารถเรียนตัวต่อตัวกับโค้ชได้ — หัวหน้าโค้ช Kirill (อังกฤษ รัสเซีย) และโค้ช Bloom (อังกฤษ ไทย) สอนทั้งผู้ใหญ่และเด็ก ผู้ช่วยโค้ช Bow สอนเด็กที่เพิ่งเริ่มเล่น ราคาตามเว็บไซต์ของชมรม: ฝึกกลุ่มครั้งละ 400 บาท บัตรฝึกกลุ่มรายเดือน 3,000 บาท เรียนตัวต่อตัวเริ่มต้น 600 บาทต่อชั่วโมง (ขึ้นอยู่กับโค้ช) เช่าโต๊ะ 200 บาทต่อชั่วโมงสำหรับ 2 คน — กรุณาสอบถามอีกครั้ง โทร 095 410 8727 กลุ่ม LINE ของชมรม (ลิงก์อยู่บนเว็บไซต์) Facebook: PATTAYA.TABLETENNIS.SPORT.CLUB Instagram: @attpattayatabletennis เว็บไซต์ table-tennis-pattaya.com",
    tips: [
      {
        text: "Отдельных детских групп нет: групповые тренировки общие для детей и взрослых. Для ребёнка спросите индивидуальные занятия — по сайту клуба, с детьми работают Kirill, Bloom и Bow.",
        textEn:
          "There are no separate kids' groups: group sessions are shared by children and adults. For a child, ask about private lessons — per the club's website, Kirill, Bloom and Bow work with children.",
        textTh:
          "ไม่มีกลุ่มเด็กแยกต่างหาก การฝึกกลุ่มเป็นแบบรวมเด็กและผู้ใหญ่ สำหรับเด็กแนะนำให้สอบถามการเรียนตัวต่อตัว ตามเว็บไซต์ของชมรม โค้ช Kirill, Bloom และ Bow สอนเด็ก",
      },
      {
        text: "Тренеры говорят на английском, русском и тайском: Kirill — английский и русский, Bloom и Bow — английский и тайский.",
        textEn:
          "Coaches speak English, Russian and Thai: Kirill — English and Russian, Bloom and Bow — English and Thai.",
        textTh:
          "โค้ชพูดภาษาอังกฤษ รัสเซีย และไทย: Kirill — อังกฤษและรัสเซีย, Bloom และ Bow — อังกฤษและไทย",
      },
      {
        text: "Ракетки можно взять напрокат (от 100 ฿), корзину мячей — за 100 ฿; в «счастливые часы» 11:00–14:00 и 17:00–21:00 вход 100 ฿.",
        textEn:
          "Rackets can be rented (from 100 ฿), a basket of balls is 100 ฿; during happy hours, 11:00–14:00 and 17:00–21:00, entry is 100 ฿.",
        textTh:
          "มีไม้ปิงปองให้เช่า (เริ่มต้น 100 บาท) ตะกร้าลูกปิงปอง 100 บาท ช่วง Happy Hours 11:00–14:00 และ 17:00–21:00 ค่าเข้า 100 บาท",
      },
      {
        text: "В здании Mike Shopping Mall есть большая парковка, в том числе подземная (по сайту клуба).",
        textEn:
          "Mike Shopping Mall has a large car park, including underground parking (per the club's website).",
        textTh:
          "ห้าง Mike Shopping Mall มีที่จอดรถขนาดใหญ่ รวมถึงที่จอดใต้ดิน (ตามเว็บไซต์ของชมรม)",
      },
    ],
    classes: [
      {
        name: "Пн, Ср, Пт — групповая тренировка",
        nameEn: "Mon, Wed, Fri — group training",
        nameTh: "จันทร์ พุธ ศุกร์ — ฝึกกลุ่ม",
        ageLabel: "дети и взрослые",
        ageLabelEn: "kids and adults",
        ageLabelTh: "เด็กและผู้ใหญ่",
        minAgeMonths: 0,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "14:00–15:00 · 19:00–20:00",
        scheduleEn: "14:00–15:00 · 19:00–20:00",
        scheduleTh: "14:00–15:00 · 19:00–20:00",
      },
    ],
    categorySlugs: ["sport"],
  },
  // Baan Pleng Pattaya Music & Art (บ้านเพลงพัทยา)
  {
    slug: "baan-pleng-pattaya-music-art",
    nameEn: "Baan Pleng Pattaya Music & Art",
    nameTh: "บ้านเพลง พัทยา สอนดนตรี ศิลปะ",
    description:
      "Музыкальная школа и магазин инструментов в Понге, на Soi Pornprapanimit 34 (East Pattaya). Учат музыке детей и взрослых: по свежим постам ноября 2026 — фортепиано и клавишные, гитара, ударные, вокал; дети занимаются и в составе маленькой группы-«бэнда» в звукоизолированном классе с кондиционером. Школа устраивает концерты учеников (в 2025 — 18 октября). В названии есть и рисование, но в постах видны только уроки музыки — про рисование уточняйте. При школе продают и чинят инструменты, настраивают пианино. Цены и расписание на странице не публикуют — уточняйте. Телефон: 089 008 6891, Facebook: Baan Pleng Pattaya (บ้านเพลง พัทยา).",
    descriptionEn:
      "A music school and instrument shop in Pong, on Soi Pornprapanimit 34 (East Pattaya). Lessons for children and adults: recent posts from November 2026 show piano and keyboard, guitar, drums and vocals, and kids also play together as a small band in a soundproofed, air-conditioned room. The school holds student concerts (in 2025, on 18 October). Art is in the name, but the posts only show music lessons — ask about art classes. The shop also sells and repairs instruments and tunes pianos. Prices and timetable aren't published on the page — please ask. Phone: 089 008 6891, Facebook: Baan Pleng Pattaya (บ้านเพลง พัทยา).",
    descriptionTh:
      "โรงเรียนสอนดนตรีและร้านเครื่องดนตรีย่านโป่ง ซอยพรประภานิมิตร 34 (พัทยาฝั่งตะวันออก) เปิดสอนทั้งเด็กและผู้ใหญ่ จากโพสต์ล่าสุดเดือนพฤศจิกายน 2026 มีเปียโนและคีย์บอร์ด กีตาร์ กลอง และร้องเพลง เด็ก ๆ ยังได้ฝึกเล่นเป็นวงเล็ก ๆ ในห้องเก็บเสียงติดแอร์ มีงานแสดงดนตรีของนักเรียน (ปี 2025 จัดวันที่ 18 ตุลาคม) ชื่อร้านมีคำว่าศิลปะ แต่ในโพสต์เห็นเฉพาะการสอนดนตรี หากสนใจคลาสศิลปะกรุณาสอบถาม ร้านยังขายและซ่อมเครื่องดนตรี รับจูนเปียโน ค่าเรียนและตารางเรียนไม่ได้ประกาศในเพจ กรุณาสอบถาม โทร 089 008 6891 Facebook: บ้านเพลง พัทยา",
    tips: [
      {
        text: "Цены и расписание в Facebook не публикуют — проще позвонить или написать в Messenger страницы.",
        textEn:
          "Prices and timetable aren't posted on Facebook — it's easiest to call or message the page.",
        textTh: "ค่าเรียนและตารางเรียนไม่ได้ลงในเพจ สะดวกที่สุดคือโทรหรือทักแชทเพจ",
      },
      {
        text: "Раз в год школа устраивает концерт учеников (в 2025 — 18 октября) — ребёнку есть к чему готовиться.",
        textEn:
          "Once a year the school holds a student concert (in 2025, on 18 October) — something for your child to work towards.",
        textTh: "โรงเรียนจัดงานแสดงดนตรีของนักเรียนปีละครั้ง (ปี 2025 วันที่ 18 ตุลาคม)",
      },
      {
        text: "При школе — магазин и мастерская: здесь же можно купить инструмент, отдать в ремонт или вызвать настройщика пианино.",
        textEn:
          "There's a shop and workshop on site: you can buy an instrument, get one repaired or book a piano tuning.",
        textTh: "ที่นี่มีร้านขายและซ่อมเครื่องดนตรี รับจูนเปียโนด้วย",
      },
    ],
    categorySlugs: ["music"],
  },
  // Bangkok Dance Academy Pattaya
  {
    slug: "bangkok-dance-academy-pattaya",
    nameEn: "Ballet and dance at Nareethip School (Bangkok Dance Academy Pattaya)",
    nameTh: "โรงเรียนนรีทิพย์ บางกอกแดนซ์ สาขาพัทยา",
    description:
      "Nareethip School — филиал бангкокской сети танцевальных школ Bangkok Dance Academy на Pattaya–Naklua Road (Наклуа). Главное здесь — балет для детей: младшие учатся держать осанку, двигаться под музыку и выступать, старшие ученицы ездят на конкурсы (в 2025–2026 — Thailand Challenge Cup Dance Competition, YGP Indonesia). Детский балет — с 4 лет; по объявлению сентября 2025 года младшая группа занималась по средам, 17:20–18:10. В той же школе есть музыка: гитара и детский ансамбль NRT Band. Первое пробное занятие бесплатное. Цены в открытых постах не публикуют — уточняйте. Телефон: 081 804 6393, LINE: lin.ee/Rp12E1s, Facebook: facebook.com/NareethipSchool, Instagram: @nareethipschool.",
    descriptionEn:
      "Nareethip School is the Pattaya branch of the Bangkok Dance Academy chain, on Pattaya–Naklua Road in Naklua. The focus is ballet for children: younger pupils work on posture, moving to music and performing, while older students compete (in 2025–2026: Thailand Challenge Cup Dance Competition, YGP Indonesia). Children's ballet starts at age 4; according to a September 2025 announcement, the youngest group met on Wednesdays, 17:20–18:10. The school also teaches music: guitar and a children's band, NRT Band. The first trial class is free. Prices aren't published in public posts — please ask. Phone: 081 804 6393, LINE: lin.ee/Rp12E1s, Facebook: facebook.com/NareethipSchool, Instagram: @nareethipschool.",
    descriptionTh:
      "โรงเรียนนรีทิพย์ บางกอกแดนซ์สาขาพัทยา บนถนนพัทยา–นาเกลือ เน้นบัลเล่ต์สำหรับเด็ก ช่วยเสริมบุคลิกภาพ ความแข็งแรง สมาธิ และการแสดงออก นักเรียนรุ่นโตได้ร่วมแข่งขันทั้งในและต่างประเทศ เช่น Thailand Challenge Cup Dance Competition และ YGP Indonesia คลาสบัลเล่ต์เด็กรับตั้งแต่อายุ 4 ปี ตามประกาศเดือนกันยายน 2025 คลาสเด็กเล็กเรียนทุกวันพุธ 17:20–18:10 น. นอกจากนี้ยังมีคลาสดนตรี เช่น กีตาร์ และวง Junior NRT Band ทดลองเรียนฟรี ค่าเรียนกรุณาสอบถามโดยตรง โทร 081 804 6393, LINE: lin.ee/Rp12E1s, Facebook: facebook.com/NareethipSchool, Instagram: @nareethipschool",
    tips: [
      {
        text: "Первое пробное занятие бесплатное — договоритесь заранее по телефону или в LINE.",
        textEn: "The first trial class is free — arrange it in advance by phone or LINE.",
        textTh: "ทดลองเรียนฟรี กรุณานัดล่วงหน้าทางโทรศัพท์หรือ LINE",
      },
      {
        text: "Объявления школа пишет на тайском, английском и китайском — можно писать по-английски.",
        textEn:
          "The school posts in Thai, English and Chinese, so you can contact them in English.",
        textTh: "โรงเรียนประกาศข้อมูลเป็นภาษาไทย อังกฤษ และจีน ติดต่อเป็นภาษาอังกฤษได้",
      },
      {
        text: "Кроме танцев здесь учат музыке: гитара, детский ансамбль; ученики выступают на городских концертах в Наклуа.",
        textEn:
          "Besides dance, the school teaches music — guitar and a children's band; pupils perform at city concerts in Naklua.",
        textTh:
          "นอกจากเต้นยังมีคลาสดนตรี เช่น กีตาร์ และวงดนตรีเด็ก นักเรียนได้ขึ้นแสดงในงานดนตรีของเมืองพัทยาที่ลานโพธิ์นาเกลือ",
      },
    ],
    minAgeMonths: 48,
    classes: [
      {
        name: "Балет для малышей · Ср",
        nameEn: "Ballet for young children · Wed",
        nameTh: "บัลเล่ต์เด็กเล็ก · พุธ",
        ageLabel: "от 4 лет",
        ageLabelEn: "4+ years",
        ageLabelTh: "4 ปีขึ้นไป",
        minAgeMonths: 48,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "17:20–18:10",
        scheduleEn: "17:20–18:10",
        scheduleTh: "17:20–18:10",
      },
    ],
    categorySlugs: ["dance"],
    cover: "/images/activities/bangkok-dance-academy-pattaya.jpg",
  },
  // Dance Studio Pattaya School — балет
  {
    slug: "dance-studio-pattaya-school",
    nameEn: "Ballet at Dance Studio Pattaya School",
    nameTh: "บัลเลต์ โรงเรียนแดนซ์สตูดิโอพัทยา",
    description:
      "Тайская школа балета и джаз-данса на Pattaya Sai 3 (Третья дорога), работает больше двадцати лет: в 2023 году отмечала 20-летие. Берут детей с 3–3,5 лет, подготовка не нужна. На классических уроках у станка работают над осанкой, гибкостью, равновесием и мышцами корпуса; на джаз-дансе разучивают хореографию под популярную музыку. Раз в год школа проводит церемонию вручения сертификатов ученикам. Посты и общение — на тайском. Расписание групп и цены в открытых источниках не публикуются — уточняйте в сообщениях на странице или по телефону. Телефон: 063 853 9719, 064 792 9494, 081 865 2987, Facebook: Dance Studio Pattaya School.",
    descriptionEn:
      "A Thai ballet and jazz dance school on Pattaya Sai 3 (Third Road) that has been running for more than twenty years — it celebrated its 20th anniversary in 2023. Children are accepted from 3–3.5 years, no experience needed. Classical lessons at the barre work on posture, flexibility, balance and core strength; jazz dance classes learn choreography to popular music. Once a year the school holds a certificate ceremony for its students. Posts and communication are in Thai. Group schedules and prices aren't published — ask via the page's messages or by phone. Phone: 063 853 9719, 064 792 9494, 081 865 2987, Facebook: Dance Studio Pattaya School.",
    descriptionTh:
      "โรงเรียนสอนเต้นบัลเลต์และแจ๊สแดนซ์บนถนนพัทยาสาย 3 เปิดสอนมากว่า 20 ปี (ครบรอบ 20 ปีในปี 2566) รับเด็กตั้งแต่อายุ 3 ขวบครึ่ง ไม่ต้องมีพื้นฐาน คลาสบัลเลต์ฝึกท่าทาง ความยืดหยุ่น การทรงตัว และกล้ามเนื้อแกนกลางลำตัว ส่วนคลาสแจ๊สแดนซ์ฝึกท่าเต้นประกอบเพลงยอดนิยม ทุกปีโรงเรียนจัดพิธีมอบประกาศนียบัตรให้นักเรียน ตารางเรียนและค่าเรียนไม่ได้ประกาศไว้ กรุณาสอบถามทางข้อความในเพจหรือทางโทรศัพท์ โทร 063 853 9719, 064 792 9494, 081 865 2987 Facebook: Dance Studio Pattaya School",
    tips: [
      {
        text: "Начать можно без подготовки: в постах школа пишет, что берёт детей с 3 лет без базы, а в описании страницы — с 3,5 лет.",
        textEn:
          "Children can start with no experience: the school's posts say from age 3, the page description says from 3.5.",
        textTh:
          "เริ่มเรียนได้โดยไม่ต้องมีพื้นฐาน โพสต์ของโรงเรียนระบุว่ารับตั้งแต่ 3 ขวบ ส่วนคำอธิบายเพจระบุ 3 ขวบครึ่ง",
      },
      {
        text: "Кроме балета есть джаз-данс: в постах 2026 года разучивают хореографию под поп-музыку, в том числе песни Lisa.",
        textEn:
          "Besides ballet there is jazz dance: in 2026 posts the class learns choreography to pop music, including songs by Lisa.",
        textTh:
          "นอกจากบัลเลต์ยังมีคลาสแจ๊สแดนซ์ ในโพสต์ปี 2569 มีการฝึกท่าเต้นประกอบเพลงป๊อป รวมถึงเพลงของลิซ่า",
      },
      {
        text: "Страница ведётся на тайском; для записи удобнее написать в сообщения Facebook или позвонить.",
        textEn:
          "The page is run in Thai; to sign up, it's easiest to message on Facebook or call.",
        textTh:
          "เพจใช้ภาษาไทย หากต้องการสมัครเรียน ส่งข้อความทาง Facebook หรือโทรสอบถามได้สะดวกที่สุด",
      },
    ],
    minAgeMonths: 42,
    categorySlugs: ["dance"],
    cover: "/images/activities/dance-studio-pattaya-school.jpg",
  },
  // English Planet Pattaya
  {
    slug: "english-planet-pattaya",
    nameEn: "English Planet Pattaya",
    nameTh: "อิงลิช แพลนเนต สาขาพัทยา",
    description:
      "Паттайский филиал тайской сети языковых школ English Planet (филиалы также в Бангкоке и на Пхукете), Нонг Прыэ. Для детей и подростков 4–16 лет есть программа English for Young Learners: по описанию сети, начинают с понимания на слух и разговора на простых фразах, а не с грамматики, — через игры, песни, рисование и живой диалог. Форматы: маленькая группа по выходным (утром 9:00–12:00 или днём 13:00–16:00), курс от 30 часов, или индивидуально либо вдвоём-втроём с друзьями — дни и время выбираете сами, курс от 20 часов; онлайн или в классе. Есть и курсы для взрослых, подготовка к IELTS/TOEIC, другие языки. Цены сеть пишет примерно: группа — от 5 тысяч ฿ за 30 часов, индивидуально — от 16 тысяч ฿ за 20 часов; точную сумму уточняйте в филиале. Телефон филиала: 033 124 433, LINE: @englishplanet, Facebook: English Planet Pattaya, сайт: elpplanet.com.",
    descriptionEn:
      "The Pattaya branch of English Planet, a Thai chain of language schools (also in Bangkok and Phuket), in Nong Prue. For children and teens aged 4–16 there's the English for Young Learners program: according to the chain, it starts with listening and speaking in simple everyday phrases rather than grammar, through games, songs, art and real conversation. Formats: a small weekend group (9:00–12:00 or 13:00–16:00), courses from 30 hours; or private lessons, alone or with up to two friends, at days and times you choose, from 20 hours; online or onsite. There are also adult courses, IELTS/TOEIC prep and other languages. The chain quotes approximate prices: group from about 5,000 ฿ for 30 hours, private from about 16,000 ฿ for 20 hours — please check the exact amount with the branch. Branch phone: 033 124 433, LINE: @englishplanet, Facebook: English Planet Pattaya, website: elpplanet.com.",
    descriptionTh:
      "อิงลิช แพลนเนต สาขาพัทยา ย่านหนองปรือ เป็นสาขาของเครือสถาบันสอนภาษาอังกฤษ (มีสาขาในกรุงเทพฯ และภูเก็ตด้วย) สำหรับเด็กและวัยรุ่นอายุ 4–16 ปี มีหลักสูตร English for Young Learners ตามข้อมูลของเครือ เน้นให้เด็กฟังและพูดประโยคง่าย ๆ ในชีวิตประจำวันก่อนไวยากรณ์ ผ่านเกม เพลง งานศิลปะ และการสนทนาจริง รูปแบบการเรียน: กลุ่มเล็กวันเสาร์–อาทิตย์ (09.00–12.00 หรือ 13.00–16.00 น.) เริ่มต้น 30 ชั่วโมง หรือเรียนส่วนตัว/แชร์กับเพื่อนไม่เกิน 3 คน เลือกวันและเวลาเองได้ เริ่มต้น 20 ชั่วโมง เรียนออนไลน์หรือที่สาขา นอกจากนี้มีคอร์สผู้ใหญ่ ติว IELTS/TOEIC และภาษาอื่น ค่าเรียนตามโพสต์ของเครือ: กลุ่มประมาณ 5,xxx บาท/30 ชั่วโมง ส่วนตัวประมาณ 16,xxx บาท/20 ชั่วโมง กรุณาสอบถามราคาที่สาขา โทร 033-124-433 LINE: @englishplanet Facebook: English Planet Pattaya เว็บไซต์ elpplanet.com",
    tips: [
      {
        text: "Групповые занятия для детей идут по субботам и воскресеньям: утренняя смена 9:00–12:00 или дневная 13:00–16:00 (по постам сети, ноябрь 2026).",
        textEn:
          "Kids' group classes run on Saturdays and Sundays: a morning slot 9:00–12:00 or an afternoon slot 13:00–16:00 (chain posts, November 2026).",
        textTh:
          "คลาสกลุ่มสำหรับเด็กเรียนวันเสาร์–อาทิตย์ รอบเช้า 09.00–12.00 น. หรือรอบบ่าย 13.00–16.00 น. (ตามโพสต์ของเครือ พฤศจิกายน 2026)",
      },
      {
        text: "Индивидуально можно заниматься не одному: курс разрешают разделить с друзьями, до трёх человек.",
        textEn:
          "Private lessons can be shared: up to three friends can take a course together.",
        textTh: "คอร์สส่วนตัวแชร์เรียนกับเพื่อนได้ไม่เกิน 3 คน",
      },
      {
        text: "Цены в постах указаны неточно («5,xxx», «16,xxx бат») — точную сумму за курс спрашивайте в филиале по телефону 033 124 433.",
        textEn:
          'Prices in posts are only approximate ("5,xxx", "16,xxx baht") — ask the branch for the exact course price at 033 124 433.',
        textTh:
          "ราคาในโพสต์เป็นราคาประมาณ (5,xxx / 16,xxx บาท) สอบถามราคาจริงที่สาขา โทร 033-124-433",
      },
    ],
    minAgeMonths: 48,
    maxAgeMonths: 192,
    categorySlugs: ["languages"],
  },
  // Fast Pro Football Academy
  {
    slug: "fast-pro-football-academy",
    nameEn: "Fast Pro Football Academy",
    nameTh: "Fast Pro Football Academy ฟุตบอลเยาวชนพัทยา",
    description:
      "Детская футбольная академия, тренировки после школы на поле IP Soccer Club в Soi Thepprasit 5 (Thepprasit 5/1). Принимают мальчиков и девочек с 4 лет: в свежих постах — 4–11 лет, раньше набирали и до 15. Тренировки в небольших группах, акцент на радость от игры, выносливость и концентрацию; малышей, по описанию в каталоге pattaya-gym.com, ведут по методике FUNino (игры в маленьких составах на несколько ворот). Первая тренировка бесплатная — можно попробовать, прежде чем записываться. Страница академии ведётся на тайском и английском. Расписание и цены публично не выложены — уточняйте в сообщениях. Телефон: +66 80 595 6949, Facebook: FAST PRO Football Academy Pattaya (fastprofootball), Instagram: @fastprofootball.",
    descriptionEn:
      "A children's football academy with after-school training on the IP Soccer Club pitch in Soi Thepprasit 5 (Thepprasit 5/1). Boys and girls are welcome from age 4: recent posts say 4–11, earlier ones recruited up to 15. Training is in small groups, focused on enjoying the game, stamina and concentration; according to the pattaya-gym.com listing, younger players follow the FUNino method (small-sided games with several goals). The first session is free, so your child can try before signing up. The academy posts in Thai and English. The schedule and prices aren't published — please ask by message. Phone: +66 80 595 6949, Facebook: FAST PRO Football Academy Pattaya (fastprofootball), Instagram: @fastprofootball.",
    descriptionTh:
      "อะคาเดมีฟุตบอลสำหรับเด็ก ฝึกซ้อมหลังเลิกเรียนที่สนาม IP Soccer Club เทพประสิทธิ์ซอย 5 (ซอย 5/1) รับเด็กชายและเด็กหญิงตั้งแต่ 4 ปี โพสต์ล่าสุดระบุอายุ 4–11 ปี ก่อนหน้านี้เคยรับถึง 15 ปี ฝึกเป็นกลุ่มเล็ก เน้นความสนุกในการเล่น ความอดทน และสมาธิ สำหรับเด็กเล็ก ตามข้อมูลในไดเรกทอรี pattaya-gym.com ใช้แนวทาง FUNino (เกมทีมเล็กหลายประตู) ทดลองฝึกซ้อมฟรีก่อนตัดสินใจ เพจของอะคาเดมีใช้ภาษาไทยและอังกฤษ ตารางซ้อมและค่าเรียนไม่ได้ประกาศไว้ กรุณาสอบถามทางข้อความ โทร +66 80 595 6949 Facebook: FAST PRO Football Academy Pattaya (fastprofootball) Instagram: @fastprofootball",
    tips: [
      {
        text: "Первая тренировка бесплатная — её предлагают в каждом наборном посте.",
        textEn: "The first session is free — it's offered in every recruitment post.",
        textTh: "ทดลองฝึกซ้อมฟรีก่อนตัดสินใจ ตามที่ประกาศในทุกโพสต์รับสมัคร",
      },
      {
        text: "Поле — IP Soccer Club в Soi Thepprasit 5; академия пишет, что парковка просторная.",
        textEn:
          "The pitch is IP Soccer Club in Soi Thepprasit 5; the academy mentions ample parking.",
        textTh:
          "สนาม IP Soccer Club เทพประสิทธิ์ซอย 5 ทางอะคาเดมีแจ้งว่ามีที่จอดรถกว้างขวาง",
      },
      {
        text: "Тренировки идут после школы, ближе к вечеру; точные дни и время спрашивайте в сообщениях.",
        textEn:
          "Training is after school, in the late afternoon; ask by message for the exact days and times.",
        textTh: "ฝึกซ้อมหลังเลิกเรียนช่วงเย็น สอบถามวันและเวลาที่แน่นอนทางข้อความ",
      },
    ],
    minAgeMonths: 48,
    maxAgeMonths: 132,
    categorySlugs: ["sport"],
  },
  // Hansoo Gym — тхэквондо (PK Residents)
  {
    slug: "hansoo-gym-pk-residents",
    nameEn: "Hansoo Gym — Taekwondo & Kickboxing (PK Residents)",
    nameTh: "Hansoo Gym เทควันโดและคิกบ็อกซิ่ง สาขา PK Residents",
    description:
      "Новый зал Hansoo Gym (открылся осенью 2026, вторая точка после Toongklom-Talman) в жилом комплексе PK Residents на Soi Phon Prapha Nimit 10, к востоку от Сукхумвита. Учат тхэквондо и кикбоксингу, есть детские и взрослые группы; ведёт тренер Alexandre, команда клуба выступает на чемпионатах Таиланда. По Google Картам зал работает в будни с 17:30 до 19:30 и в субботу с 10:00 до 12:00 — какие из этих часов детские, уточняйте. Первое занятие бесплатное. Посты в соцсетях на английском и тайском. Телефон: 062 373 5067, Instagram: @hansoo.gym, Facebook: Hansoo Gym Pattaya, e-mail: hansoogym.pattaya@gmail.com.",
    descriptionEn:
      "A new Hansoo Gym (opened in autumn 2026, the second location after Toongklom-Talman) in the PK Residents complex on Soi Phon Prapha Nimit 10, east of Sukhumvit. It teaches taekwondo and kickboxing, with kids' and adult groups; coach Alexandre leads the classes, and the club's team competes at Thai national championships. According to Google Maps the gym is open on weekdays 17:30–19:30 and on Saturdays 10:00–12:00 — ask which of these hours are for children. The first class is free. Social media posts are in English and Thai. Phone: 062 373 5067, Instagram: @hansoo.gym, Facebook: Hansoo Gym Pattaya, email: hansoogym.pattaya@gmail.com.",
    descriptionTh:
      "Hansoo Gym สาขาใหม่ (เปิดช่วงปลายปี 2569 เป็นสาขาที่สองต่อจากทุ่งกลม-ตาลหมัน) ในโครงการ PK Residents ซอยพรประภานิมิตร 10 ฝั่งตะวันออกของถนนสุขุมวิท สอนเทควันโดและคิกบ็อกซิ่ง มีคลาสเด็กและผู้ใหญ่ สอนโดยโค้ช Alexandre และทีมของยิมลงแข่งขันชิงแชมป์ประเทศไทย ตาม Google Maps เปิดวันจันทร์–ศุกร์ 17:30–19:30 น. และวันเสาร์ 10:00–12:00 น. กรุณาสอบถามว่ารอบไหนเป็นคลาสเด็ก ทดลองเรียนครั้งแรกฟรี โพสต์ในโซเชียลเป็นภาษาอังกฤษและไทย โทร 062 373 5067 Instagram: @hansoo.gym Facebook: Hansoo Gym Pattaya อีเมล hansoogym.pattaya@gmail.com",
    tips: [
      {
        text: "Первое занятие бесплатное (по описанию страниц клуба).",
        textEn: "The first class is a free trial (per the club's pages).",
        textTh: "ทดลองเรียนครั้งแรกฟรี (ตามข้อมูลในเพจของยิม)",
      },
      {
        text: "У Hansoo две точки — PK Residents и Toongklom-Talman; телефон общий, при записи уточните, в какой зал ехать.",
        textEn:
          "Hansoo has two locations, PK Residents and Toongklom-Talman, sharing one phone number — when booking, check which gym to go to.",
        textTh:
          "Hansoo มี 2 สาขา คือ PK Residents และทุ่งกลม-ตาลหมัน ใช้เบอร์โทรเดียวกัน ตอนนัดควรถามให้ชัดว่าต้องไปสาขาไหน",
      },
      {
        text: "Ученики клуба выступают на соревнованиях: летом 2026 команда из 14 спортсменов привезла с чемпионата Таиланда по кикбоксингу 14 медалей.",
        textEn:
          "Club students compete: in summer 2026 a team of 14 athletes brought home 14 medals from the Thailand Kickboxing Championship.",
        textTh:
          "นักเรียนของยิมลงแข่งขัน: กลางปี 2569 ทีม 14 คนคว้า 14 เหรียญจากการแข่งขันคิกบ็อกซิ่งชิงแชมป์ประเทศไทย",
      },
    ],
    categorySlugs: ["martial-arts"],
  },
  // Hansoo Gym — тхэквондо (Toongklom-Talman)
  {
    slug: "hansoo-gym-toongklom-talman",
    nameEn: "Taekwondo & Kickboxing at Hansoo Gym",
    nameTh: "เทควันโดและคิกบ็อกซิ่ง Hansoo Gym",
    description:
      "Небольшой зал боевых искусств на Toongklom-Talman Road (Нонг Прыэ): тхэквондо и кикбоксинг для детей и взрослых. Тренирует чемпион Alexandre; ученики зала выступают на соревнованиях — на чемпионате Таиланда по кикбоксингу 2026 команда из 14 спортсменов привезла 2 золота, 7 серебряных и 5 бронзовых медалей. Детские тренировки идут вместе со взрослыми или рядом с ними — в постах зала это вторник и четверг. Первое пробное занятие бесплатное. С октября 2026 у Hansoo есть второй зал — в PK Residents (Soi Pornprapanimit 10). Цены и точное время в соцсетях не публикуют — уточняйте. Телефон: 062 373 5067, Instagram: @hansoo.gym, Facebook: Hansoo Gym Pattaya, TikTok: @hansoogympattaya.",
    descriptionEn:
      "A small martial arts gym on Toongklom-Talman Road (Nong Prue): taekwondo and kickboxing for children and adults. Coaching is led by champion Alexandre, and students compete — at the 2026 Thailand Kickboxing Championship the 14-strong team won 2 gold, 7 silver and 5 bronze medals. Kids train in mixed kids-and-adult sessions; the gym's posts mention Tuesdays and Thursdays. The first trial class is free. Since October 2026 Hansoo also has a second gym at PK Residents (Soi Pornprapanimit 10). Prices and exact times aren't posted — please ask. Phone: 062 373 5067, Instagram: @hansoo.gym, Facebook: Hansoo Gym Pattaya, TikTok: @hansoogympattaya.",
    descriptionTh:
      "ยิมศิลปะการต่อสู้ขนาดเล็กบนถนนทุ่งกลม–ตาลหมัน (หนองปรือ) สอนเทควันโดและคิกบ็อกซิ่งทั้งเด็กและผู้ใหญ่ ฝึกโดยโค้ช Alexandre แชมป์ระดับประเทศ นักเรียนของยิมลงแข่งขันจริง ในรายการ Thailand Kickboxing Championship 2026 ทีม 14 คนได้ 2 เหรียญทอง 7 เหรียญเงิน และ 5 เหรียญทองแดง คลาสเด็กเรียนร่วมกับคลาสผู้ใหญ่ ในโพสต์ของยิมคือวันอังคารและวันพฤหัสบดี ทดลองเรียนครั้งแรกฟรี ตั้งแต่ตุลาคม 2026 Hansoo มียิมแห่งที่สองที่ PK Residents (ซอยพรประภานิมิตร 10) ค่าเรียนและเวลาที่แน่นอนไม่ได้ประกาศ กรุณาสอบถาม โทร 062-373-5067 Instagram: @hansoo.gym Facebook: Hansoo Gym Pattaya TikTok: @hansoogympattaya",
    tips: [
      {
        text: "Первое пробное занятие бесплатное (по шапке страниц в Facebook и Linktree).",
        textEn: "The first trial class is free (per the gym's Facebook and Linktree).",
        textTh: "ทดลองเรียนครั้งแรกฟรี (ตามเพจ Facebook และ Linktree ของยิม)",
      },
      {
        text: "У Hansoo два зала: на Toongklom-Talman и с октября 2026 в PK Residents (Soi Pornprapanimit 10) — уточняйте, в каком из них детская группа в нужный день.",
        textEn:
          "Hansoo has two gyms: Toongklom-Talman and, since October 2026, PK Residents (Soi Pornprapanimit 10) — ask which one has the kids' class on the day you need.",
        textTh:
          "Hansoo มี 2 ยิม: ทุ่งกลม–ตาลหมัน และตั้งแต่ตุลาคม 2026 ที่ PK Residents (ซอยพรประภานิมิตร 10) สอบถามว่าคลาสเด็กวันที่ต้องการเรียนอยู่ที่ยิมไหน",
      },
      {
        text: "Детские и взрослые тренировки в постах зала — по вторникам и четвергам; точное время спрашивайте по телефону или в директ.",
        textEn:
          "The gym's posts show kids' and adults' classes on Tuesdays and Thursdays; ask for exact times by phone or DM.",
        textTh:
          "ในโพสต์ของยิมมีคลาสเด็กและผู้ใหญ่วันอังคารและวันพฤหัสบดี สอบถามเวลาที่แน่นอนทางโทรศัพท์หรือข้อความ",
      },
      {
        text: "Зал выставляет учеников на соревнования по кикбоксингу и тхэквондо — если ребёнку интересен спорт, а не только тренировки, спросите про соревновательную группу.",
        textEn:
          "The gym enters students in kickboxing and taekwondo competitions — if your child wants to compete, ask about the competition squad.",
        textTh:
          "ยิมส่งนักเรียนลงแข่งคิกบ็อกซิ่งและเทควันโด หากลูกสนใจแข่งขัน สอบถามเรื่องทีมนักกีฬาได้",
      },
    ],
    categorySlugs: ["martial-arts"],
  },
  // Happen Enjoy Art School — рисование
  {
    slug: "happen-enjoy-art-school",
    nameEn: "Art classes at Happen Enjoy Art School",
    nameTh: "คลาสศิลปะ Happen Enjoy Art School",
    description:
      "Happen Enjoy Art School — небольшая новая художественная студия на улице Phatthanakan (Нонг Прыэ). Учат рисовать с самых основ, есть отдельные занятия для детей и подростков и короткие интенсивные воркшопы, на которых пробуют новую технику и сразу уносят готовую работу; берут и взрослых. Судя по фото осени 2026 года, дети рисуют за столами во дворике студии — акварель, гуашь, фломастеры, крупные декоративные композиции. Можно прийти на пробное занятие. Объявления — на тайском; цены и расписание не публикуют, уточняйте по телефону. Телефон: 082 494 4553, Facebook: Happen enjoy art school.",
    descriptionEn:
      "Happen Enjoy Art School is a small new art studio on Phatthanakan Road (Nong Prue). Lessons start from the basics, with separate classes for children and teenagers and short intensive workshops where you try a new technique and take the finished piece home; adults are welcome too. Photos from autumn 2026 show children painting at tables in the studio's courtyard — watercolour, gouache, markers, large decorative pieces. You can come for a trial lesson. Announcements are in Thai; prices and timetable aren't published, so please ask by phone. Phone: 082 494 4553, Facebook: Happen enjoy art school.",
    descriptionTh:
      "Happen Enjoy Art School สตูดิโอศิลปะเล็ก ๆ เปิดใหม่ บนถนนพัฒนาการ หนองปรือ คลาสเรียนศิลปะสำหรับทุกวัยตั้งแต่พื้นฐาน มีคลาสศิลปะสำหรับเด็กและเยาวชนที่เต็มไปด้วยกิจกรรมสนุกและการเรียนรู้เชิงสร้างสรรค์ และเวิร์กช็อปสั้น ๆ ได้ลองเทคนิคใหม่และสร้างผลงานกลับบ้านได้ทันที รับสอนทั้งเด็กและผู้ใหญ่ ทดลองเรียนได้ ค่าเรียนและตารางเรียนกรุณาสอบถามทางโทรศัพท์ โทร 082 494 4553, Facebook: Happen enjoy art school",
    tips: [
      {
        text: "Можно прийти на пробное занятие — договоритесь по телефону 082 494 4553 или в сообщениях на странице в Facebook.",
        textEn:
          "Trial lessons are available — arrange one by phone (082 494 4553) or a Facebook message.",
        textTh:
          "ทดลองเรียนได้ ติดต่อนัดหมายทางโทร 082 494 4553 หรือข้อความทางเพจ Facebook",
      },
      {
        text: "Объявления только на тайском; если не говорите по-тайски, спросите заранее, на каком языке ведут занятие.",
        textEn:
          "Announcements are in Thai only; if you don't speak Thai, ask in advance which language lessons are taught in.",
        textTh:
          "ประกาศเป็นภาษาไทยเท่านั้น ผู้ปกครองต่างชาติควรสอบถามภาษาที่ใช้สอนล่วงหน้า",
      },
    ],
    categorySlugs: ["art"],
    cover: "/images/activities/happen-enjoy-art-school.jpg",
  },
  // Happy Math Pattaya
  {
    slug: "happy-math-pattaya",
    nameEn: "Happy Math Pattaya Tutoring School",
    nameTh: "โรงเรียนกวดวิชา Happy Math พัทยา",
    description:
      "Тайская репетиторская школа (กวดวิชา) на Sukhumvit Road в Наклуа. Основной предмет — математика, также занимаются естественными науками и языками; есть программа для учеников тайских школ и отдельная — для международных. Берут детей от детского сада до старших классов, перед началом смотрят уровень каждого ученика, а с выпускниками готовятся к вступительным экзаменам — школа каждый год публикует списки поступивших. В учебное время занятия во вторник–пятницу с 15:00 до 20:00 и в субботу с 9:30 до 17:30, на каникулах — со вторника по субботу 9:30–17:30; воскресенье и понедельник — выходные. Сайт и страница — на тайском, на каком языке ведут уроки для иностранных детей, уточняйте. Цены не опубликованы. Телефон: 081 688 4217 (Kru Nui), LINE: nuiwanlaya, Facebook: «โรงเรียนกวดวิชา Happy Math พัทยา» (happymath.nui), сайт: happy-math.adviser-somsak.workers.dev.",
    descriptionEn:
      'A Thai tutoring school (กวดวิชา) on Sukhumvit Road in Naklua. The main subject is maths, with science and languages as well; there is a track for students of Thai schools and a separate one for international-curriculum students. It takes children from kindergarten to upper secondary, assesses each student\'s level before starting, and prepares older students for university entrance exams — the school posts its admission results every year. During term, lessons run Tuesday–Friday 15:00–20:00 and Saturday 9:30–17:30; in the school holidays, Tuesday–Saturday 9:30–17:30. Closed Sundays and Mondays. The website and page are in Thai, so ask which language is used with international students. Prices are not published. Phone: 081 688 4217 (Kru Nui), LINE: nuiwanlaya, Facebook: "โรงเรียนกวดวิชา Happy Math พัทยา" (happymath.nui), website: happy-math.adviser-somsak.workers.dev.',
    descriptionTh:
      "โรงเรียนกวดวิชา Happy Math พัทยา บนถนนสุขุมวิท นาเกลือ เน้นวิชาคณิตศาสตร์ และสอนวิทยาศาสตร์กับภาษาด้วย มีหลักสูตรสำหรับนักเรียนไทยและหลักสูตรนานาชาติ รับนักเรียนตั้งแต่อนุบาลถึงมัธยม วิเคราะห์พื้นฐานนักเรียนรายบุคคลก่อนเริ่มเรียน และติวสอบเข้ามหาวิทยาลัย มีผลงานนักเรียนสอบติดทุกปี ช่วงเปิดเทอมเรียนวันอังคาร–ศุกร์ 15:00–20:00 น. และวันเสาร์ 9:30–17:30 น. ช่วงปิดเทอมวันอังคาร–เสาร์ 9:30–17:30 น. หยุดวันอาทิตย์และวันจันทร์ ค่าเรียนไม่ได้ประกาศไว้ กรุณาสอบถาม โทร 081 688 4217 (ครูนุ้ย) LINE: nuiwanlaya Facebook: โรงเรียนกวดวิชา Happy Math พัทยา เว็บไซต์ happy-math.adviser-somsak.workers.dev",
    tips: [
      {
        text: "В воскресенье и понедельник школа закрыта; в учебное время занятия начинаются с 15:00 — удобно сразу после уроков.",
        textEn:
          "The school is closed on Sundays and Mondays; during term, lessons start at 15:00 — right after school.",
        textTh:
          "หยุดวันอาทิตย์และวันจันทร์ ช่วงเปิดเทอมเริ่มเรียน 15:00 น. ไปเรียนต่อหลังเลิกเรียนได้เลย",
      },
      {
        text: "Есть отдельная программа для детей из международных школ; язык занятий для иностранцев уточняйте заранее — школа общается на тайском.",
        textEn:
          "There is a separate track for international-school students; check the teaching language in advance, as the school communicates in Thai.",
        textTh: "มีหลักสูตรนานาชาติแยกต่างหาก สอบถามภาษาที่ใช้สอนล่วงหน้า",
      },
      {
        text: "Перед началом занятий уровень ученика оценивают индивидуально.",
        textEn: "Each student's level is assessed individually before lessons begin.",
        textTh: "ก่อนเริ่มเรียนมีการวิเคราะห์พื้นฐานนักเรียนรายบุคคล",
      },
    ],
    categorySlugs: ["math"],
  },
  // Healjai Art School
  {
    slug: "healjai-art-school",
    nameEn: "Healjai Art School",
    nameTh: "Healjai Art School สอนศิลปะเด็ก",
    description:
      "Небольшая художественная школа и арт-студия на Sukhumvit Road в Банг Ламунге; ведёт её преподаватель изобразительного искусства Build Juthatip (Kru Biw) с педагогическим образованием по специальности «Art Education». Берут детей с 2 лет: малышам 2–5 лет — сенсорные занятия, лепка, краски и поделки; детям 6–12 лет — основы рисунка, светотень, теория цвета, объёмные работы; есть занятия для подростков и взрослых, в том числе рисование на iPad и подготовка портфолио. Подход — от интересов ребёнка, без рисования «по образцу»; программу подстраивают под каждого. Школа работает каждый день, кроме пятницы, тремя сменами — 10:00–12:00, 13:00–15:00 и 16:00–18:00; день и время родители выбирают сами и бронируют минимум за день. Занятия ведут на тайском; цены в постах не указаны — уточняйте. Телефон: 095 243 6999 (Kru Biw), Facebook: healjai.artschool, Instagram: @healjai.artschool.studio.",
    descriptionEn:
      "A small art school and studio on Sukhumvit Road in Bang Lamung, run by art teacher Build Juthatip (Kru Biw), who trained in Art Education. Children are welcome from age 2: little ones aged 2–5 do sensory play, clay, paint and crafts; children aged 6–12 learn drawing basics, light and shade, colour theory and 3D work; there are also classes for teens and adults, including iPad drawing and portfolio preparation. The approach follows each child's interests rather than copying a model, and lessons are adjusted individually. The school is open every day except Friday in three sessions — 10:00–12:00, 13:00–15:00 and 16:00–18:00; parents choose the day and time and book at least one day ahead. Lessons are taught in Thai; prices aren't listed in the posts — please ask. Phone: 095 243 6999 (Kru Biw), Facebook: healjai.artschool, Instagram: @healjai.artschool.studio.",
    descriptionTh:
      "โรงเรียนสอนศิลปะและสตูดิโอขนาดเล็กบนถนนสุขุมวิท บางละมุง ดูแลโดยครูบิ๊ว (Build Juthatip) ที่จบสายครูศิลปะ (Art Education) โดยตรง รับเด็กตั้งแต่ 2 ขวบ เด็ก 2–5 ขวบเน้นการสำรวจสัมผัส งานปั้น สี และงานประดิษฐ์ เด็ก 6–12 ขวบปูพื้นฐานวาดเส้น แสงเงา ทฤษฎีสี และงาน 3 มิติ และมีคลาสสำหรับวัยรุ่นและผู้ใหญ่ เช่น วาดภาพบน iPad และเตรียมพอร์ตโฟลิโอ การสอนยึดความสนใจของเด็กเป็นศูนย์กลาง ไม่บังคับวาดตามแบบ และปรับให้เหมาะกับผู้เรียนแต่ละคน เปิดทุกวันยกเว้นวันศุกร์ แบ่งเป็น 3 รอบ 10:00–12:00, 13:00–15:00 และ 16:00–18:00 ผู้ปกครองเลือกวันเวลาเองได้ จองล่วงหน้าอย่างน้อย 1 วัน สอนเป็นภาษาไทย โพสต์ไม่ได้ระบุค่าเรียน กรุณาสอบถาม โทร 095 243 6999 (ครูบิ๊ว) Facebook: healjai.artschool Instagram: @healjai.artschool.studio",
    tips: [
      {
        text: "Занятие нужно забронировать хотя бы за день — день и смену (утро, день, вечер) выбираете сами.",
        textEn:
          "Book a lesson at least a day ahead — you choose the day and the session (morning, afternoon or evening).",
        textTh: "จองล่วงหน้าอย่างน้อย 1 วัน เลือกวันและรอบเรียน (เช้า บ่าย เย็น) ได้เอง",
      },
      {
        text: "По пятницам школа закрыта.",
        textEn: "The school is closed on Fridays.",
        textTh: "โรงเรียนปิดทุกวันศุกร์",
      },
      {
        text: "Можно записаться на пробное занятие — через сообщения на странице Facebook или по телефону 095 243 6999.",
        textEn:
          "You can book a trial lesson via Facebook messages or by phone on 095 243 6999.",
        textTh: "จองทดลองเรียนได้ทาง inbox Facebook หรือโทร 095 243 6999",
      },
      {
        text: "Кроме курсов, есть разовые мастер-классы для всей семьи: живопись на холсте, украшения из бусин, раскраска гипсовых фигурок.",
        textEn:
          "Besides courses, there are one-off family workshops: canvas painting, beaded jewellery and plaster figure painting.",
        textTh:
          "นอกจากคอร์สเรียนยังมีเวิร์กช็อปสำหรับครอบครัว เช่น วาดภาพบนผ้าใบ ร้อยลูกปัด และระบายสีปูนปั้น",
      },
    ],
    minAgeMonths: 24,
    classes: [
      {
        name: "Малыши: сенсорика и поделки",
        nameEn: "Little ones: sensory play & crafts",
        nameTh: "เด็กเล็ก: Sensory & Exploration",
        ageLabel: "2–5 лет",
        ageLabelEn: "2–5 years",
        ageLabelTh: "2–5 ขวบ",
        minAgeMonths: 24,
        maxAgeMonths: 71,
        parentRequired: null,
        schedule: "10:00–12:00 · 13:00–15:00 · 16:00–18:00",
        scheduleEn: "10:00–12:00 · 13:00–15:00 · 16:00–18:00",
        scheduleTh: "10:00–12:00 · 13:00–15:00 · 16:00–18:00",
      },
      {
        name: "Основы рисунка",
        nameEn: "Drawing foundations",
        nameTh: "ปูพื้นฐานศิลปะ (Structure & Foundation)",
        ageLabel: "6–12 лет",
        ageLabelEn: "6–12 years",
        ageLabelTh: "6–12 ขวบ",
        minAgeMonths: 72,
        maxAgeMonths: 155,
        parentRequired: null,
        schedule: "10:00–12:00 · 13:00–15:00 · 16:00–18:00",
        scheduleEn: "10:00–12:00 · 13:00–15:00 · 16:00–18:00",
        scheduleTh: "10:00–12:00 · 13:00–15:00 · 16:00–18:00",
      },
      {
        name: "Подростки и взрослые",
        nameEn: "Teens & adults",
        nameTh: "วัยรุ่นและผู้ใหญ่",
        ageLabel: "все возрасты",
        ageLabelEn: "all ages",
        ageLabelTh: "ทุกวัย",
        minAgeMonths: 24,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "10:00–12:00 · 13:00–15:00 · 16:00–18:00",
        scheduleEn: "10:00–12:00 · 13:00–15:00 · 16:00–18:00",
        scheduleTh: "10:00–12:00 · 13:00–15:00 · 16:00–18:00",
      },
    ],
    categorySlugs: ["art"],
    cover: "/images/activities/healjai-art-school.jpg",
  },
  // Home Language School
  {
    slug: "home-language-school",
    nameEn: "Home Language School",
    nameTh: "โรงเรียนภาษา Home Language School",
    description:
      "Языковая школа в Южной Паттайе (Soi Kho Pai 4, у South Pattaya Road) и сертифицированный центр подготовки к экзаменам Cambridge English. Основная часть курсов — для взрослых: английский по уровням A1–A2, подготовка к IELTS Life Skills, испанский и другие языки (на странице школы указаны английский, китайский, тайский, французский и русский). Для детей есть курс фонетики Home Phonics: учат читать по-английски, уровни 1–3, 15 часов; осенью 2026 года он стоил 3 500 ฿ за курс, места ограничены — уточняйте. С какого возраста берут детей и бывают ли детские группы в течение года, в источниках не сказано — спрашивайте у школы. Школа открыта каждый день с 9:00 до 18:00. Телефон и WhatsApp: 084 223 3514, LINE: @homelanguage, Facebook: homelanguageschool, Instagram: @homelanguageschool.",
    descriptionEn:
      "A language school in South Pattaya (Soi Kho Pai 4, off South Pattaya Road) and a certified Cambridge English preparation centre. Most courses are for adults: English by level (A1–A2), IELTS Life Skills preparation, Spanish and other languages (the school's page lists English, Chinese, Thai, French and Russian). For children there is the Home Phonics course, which teaches kids to read in English: levels 1–3, 15 hours; in autumn 2026 it cost 3,500 ฿ per course with limited places — please check. Sources don't say from what age children are accepted or whether there are kids' groups year-round — ask the school. Open daily 9:00–18:00. Phone and WhatsApp: 084 223 3514, LINE: @homelanguage, Facebook: homelanguageschool, Instagram: @homelanguageschool.",
    descriptionTh:
      "โรงเรียนสอนภาษาในพัทยาใต้ (ซอยโข่ไผ่ 4 ใกล้ถนนพัทยาใต้) และเป็นศูนย์เตรียมสอบ Cambridge English ที่ได้รับการรับรอง คอร์สส่วนใหญ่เป็นของผู้ใหญ่ เช่น ภาษาอังกฤษตามระดับ A1–A2 เตรียมสอบ IELTS Life Skills ภาษาสเปน และภาษาอื่น ๆ (เพจของโรงเรียนระบุภาษาอังกฤษ จีน ไทย ฝรั่งเศส และรัสเซีย) สำหรับเด็กมีคอร์ส Home Phonics ฝึกอ่านภาษาอังกฤษ ระดับ 1–3 รวม 15 ชั่วโมง ช่วงปลายปี 2569 ราคาคอร์สละ 3,500 บาท ที่นั่งจำกัด — กรุณาสอบถามอีกครั้ง แหล่งข้อมูลไม่ได้ระบุว่ารับเด็กตั้งแต่อายุเท่าไรและมีกลุ่มเด็กตลอดปีหรือไม่ กรุณาสอบถามโรงเรียน เปิดทุกวัน 09:00–18:00 น. โทรและ WhatsApp 084 223 3514 LINE: @homelanguage Facebook: homelanguageschool Instagram: @homelanguageschool",
    tips: [
      {
        text: "Набор на курс фонетики Home Phonics объявляют отдельными постами, мест немного — следите за страницей школы в Facebook или напишите в LINE заранее.",
        textEn:
          "Enrolment for the Home Phonics course is announced in separate posts and places are limited — follow the school's Facebook page or message on LINE in advance.",
        textTh:
          "การเปิดรับสมัครคอร์ส Home Phonics จะประกาศเป็นรอบ ๆ ที่นั่งมีจำกัด ติดตามเพจ Facebook ของโรงเรียนหรือทัก LINE ล่วงหน้า",
      },
      {
        text: "Школа — подготовительный центр Cambridge English: можно спросить о подготовке ребёнка к кембриджским экзаменам.",
        textEn:
          "The school is a Cambridge English preparation centre: you can ask about preparing your child for Cambridge exams.",
        textTh:
          "โรงเรียนเป็นศูนย์เตรียมสอบ Cambridge English สามารถสอบถามเรื่องการเตรียมสอบ Cambridge สำหรับเด็กได้",
      },
      {
        text: "Связаться можно по телефону, в LINE, WhatsApp и Telegram на один номер; школа работает каждый день с 9:00 до 18:00.",
        textEn:
          "You can reach the school by phone, LINE, WhatsApp or Telegram on the same number; it's open daily 9:00–18:00.",
        textTh:
          "ติดต่อได้ทั้งโทรศัพท์ LINE WhatsApp และ Telegram ที่เบอร์เดียวกัน เปิดทุกวัน 09:00–18:00 น.",
      },
    ],
    price: 3500,
    priceUnit: "/ курс Phonics, 15 часов",
    priceUnitEn: "/ Phonics course, 15 hours",
    priceUnitTh: "/ คอร์ส Phonics 15 ชั่วโมง",
    categorySlugs: ["languages"],
  },
  // Imaxbrain
  {
    slug: "imaxbrain-pattaya",
    nameEn: "Imaxbrain — Math Tutoring & Mental Arithmetic",
    nameTh: "จินตคณิตพัทยา Imax Brain, สมาร์ทเบรนพัทยา",
    description:
      "Репетиторский центр Kru Ji на North Pattaya Road: математика с 1-го класса начальной школы до старших классов, естественные науки, помощь с домашними заданиями и подготовка к вступительным экзаменам в 7-й и 10-й класс (ม.1 и ม.4). Отдельно — ментальная арифметика на счётах (จินตคณิต) в мини-группах; ученики центра с 2005 года ездят на национальные соревнования. Большинство занятий индивидуальные, по сайту — от 250 до 400 ฿ в час в зависимости от предмета, учебники бесплатно; цены уточняйте. Ведут на тайском; есть отдельный курс математики на английском для детей из международных школ. Ориентир — рядом с 7-Eleven и банком GSB (ออมสิน) на North Pattaya Road. Телефон: 081 687 6575, Facebook: facebook.com/IMAXBRAIN, сайт: imaxbrain.com.",
    descriptionEn:
      "Kru Ji's tutoring center on North Pattaya Road: maths from Grade 1 through upper secondary, science, homework help and entrance-exam prep for Grade 7 and Grade 10 (M.1 and M.4). There is also abacus mental arithmetic (จินตคณิต) in small groups; the center has been sending students to national competitions since 2005. Most lessons are one-to-one; according to the website they cost 250–400 ฿ per hour depending on the subject, with free textbooks — please check current prices. Lessons are in Thai; there is a separate maths course in English for international-school students. Landmark: next to a 7-Eleven and the GSB bank (ออมสิน) on North Pattaya Road. Phone: 081 687 6575, Facebook: facebook.com/IMAXBRAIN, website: imaxbrain.com.",
    descriptionTh:
      "จินตคณิตพัทยา Imax Brain (สมาร์ทเบรนพัทยา) โดยครูจิ บนถนนพัทยาเหนือ ติวคณิตศาสตร์ตั้งแต่ ป.1 ถึง ม.ปลาย สอนพิเศษวิทยาศาสตร์ รับสอนการบ้าน และติวสอบเข้า ม.1 และ ม.4 มีคอร์สจินตคณิต (ลูกคิด) เรียนเป็นกลุ่มย่อย และส่งนักเรียนแข่งขันระดับประเทศมาตั้งแต่ปี 2548 ส่วนใหญ่เรียนตัวต่อตัว ค่าเรียนตามเว็บไซต์ประมาณ 250–400 บาทต่อชั่วโมงตามวิชา ฟรีตำรา กรุณาสอบถามราคาล่าสุด สอนเป็นภาษาไทย และมีคอร์ส Math Tutor (Inter) สำหรับเด็กโรงเรียนนานาชาติ จุดสังเกต: ติด 7-Eleven ใกล้ธนาคารออมสิน ถนนพัทยาเหนือ โทร 081 687 6575 Facebook: facebook.com/IMAXBRAIN เว็บไซต์ imaxbrain.com",
    tips: [
      {
        text: "Ориентир — North Pattaya Road, рядом с 7-Eleven и банком GSB (ออมสิน).",
        textEn:
          "Landmark: North Pattaya Road, next to a 7-Eleven and the GSB bank (ออมสิน).",
        textTh: "จุดสังเกต: ถนนพัทยาเหนือ ติด 7-Eleven ใกล้ธนาคารออมสิน",
      },
      {
        text: "Учебники для большинства курсов бесплатные (по сайту центра).",
        textEn: "Textbooks are free for most courses (per the center's website).",
        textTh: "คอร์สส่วนใหญ่ฟรีตำรา (ตามเว็บไซต์)",
      },
      {
        text: "Основной язык занятий — тайский; для детей из международных школ есть отдельный курс Math Tutor (Inter).",
        textEn:
          "Lessons are mainly in Thai; for international-school students there is a separate Math Tutor (Inter) course.",
        textTh:
          "สอนเป็นภาษาไทยเป็นหลัก สำหรับเด็กโรงเรียนนานาชาติมีคอร์ส Math Tutor (Inter)",
      },
    ],
    minAgeMonths: 72,
    categorySlugs: ["math"],
  },
  // JPS Pattaya Swim (Kru Nat) — плавание
  {
    slug: "jps-pattaya-swim",
    nameEn: "Swimming with Kru Nat (JPS Pattaya Swim)",
    nameTh: "ชมรมว่ายน้ำเจพีเอสพัทยาสวิม ครูนัทสอนว่ายน้ำพัทยา",
    description:
      "Клуб плавания JPS Pattaya Swim и тренер Kru Nat в Нонг Прыэ: базовое плавание для детей и взрослых и тренировки спортсменов. В постах осени 2026 — в основном индивидуальные уроки по полтора часа: дети 5–9 лет учатся с нуля (в том числе те, кто боится опускать лицо в воду), ставят технику гребка, повороты и прыжки в воду; есть и детская команда, которая тренируется и выступает на соревнованиях. Время урока подбирают — в постах встречаются утро, день и вечер (например, 18:30–20:00). Командные тренировки проходят в бассейне Nong Ket Yai. Цены на странице не публикуют — уточняйте. Телефон и LINE: 083 437 8817 (в шапке страницы также 099 542 4259), Facebook: ชมรมว่ายน้ำเจพีเอสพัทยาสวิม / ครูนัทสอนว่ายน้ำพัทยา.",
    descriptionEn:
      "JPS Pattaya Swim club and coach Kru Nat in Nong Prue: basic swimming for children and adults, plus training for competitive swimmers. Posts from autumn 2026 show mostly one-to-one lessons of an hour and a half: children aged 5–9 learn from scratch (including those afraid to put their face in the water), work on stroke technique, turns and diving; there's also a kids' squad that trains and races. Lesson times are arranged individually — posts mention mornings, afternoons and evenings (e.g. 18:30–20:00). Squad training takes place at the Nong Ket Yai pool. Prices aren't posted — please ask. Phone and LINE: 083 437 8817 (the page header also lists 099 542 4259), Facebook: JPS Pattaya Swim / Kru Nat (ชมรมว่ายน้ำเจพีเอสพัทยาสวิม).",
    descriptionTh:
      "ชมรมว่ายน้ำเจพีเอสพัทยาสวิม โดยครูนัท ย่านหนองปรือ รับสอนว่ายน้ำขั้นพื้นฐานสำหรับเด็กและบุคคลทั่วไป และฝึกนักกีฬา จากโพสต์ช่วงปลายปี 2026 ส่วนใหญ่เป็นการเรียนตัวต่อตัวครั้งละชั่วโมงครึ่ง เด็กอายุ 5–9 ปีเริ่มเรียนตั้งแต่พื้นฐาน (รวมถึงเด็กที่ไม่กล้าก้มหน้าลงน้ำ) จัดสโตรก ฝึกกลับตัวและกระโดด และมีทีมนักกีฬาเด็กที่ซ้อมและลงแข่งขัน เวลาเรียนนัดได้ตามสะดวก ในโพสต์มีทั้งรอบเช้า บ่าย และเย็น (เช่น 18.30–20.00 น.) ทีมซ้อมที่สระหนองเกตุใหญ่ ค่าเรียนไม่ได้ประกาศในเพจ กรุณาสอบถาม โทร/LINE 083-437-8817 (หัวเพจระบุ 099-542-4259 ด้วย) Facebook: ชมรมว่ายน้ำเจพีเอสพัทยาสวิม / ครูนัทสอนว่ายน้ำพัทยา",
    tips: [
      {
        text: "Уроки в основном индивидуальные, по 1,5 часа; время подбирают под вас — от утра до вечера.",
        textEn:
          "Lessons are mostly one-to-one, 1.5 hours each; the time is arranged to suit you, from morning to evening.",
        textTh:
          "ส่วนใหญ่เรียนตัวต่อตัว ครั้งละ 1 ชั่วโมงครึ่ง นัดเวลาได้ตั้งแต่เช้าถึงเย็น",
      },
      {
        text: "Тренер работает и с детьми, которые боятся воды или уже нахлебались, — начинают с того, чтобы спокойно опускать лицо в воду (по постам страницы).",
        textEn:
          "The coach also works with children who are afraid of water or have had a scare — starting with getting comfortable putting their face in (per the page's posts).",
        textTh:
          "ครูสอนเด็กที่กลัวน้ำหรือเคยสำลักน้ำ เริ่มจากฝึกก้มหน้าลงน้ำให้มั่นใจ (ตามโพสต์ในเพจ)",
      },
      {
        text: "Записываться удобнее через LINE по номеру 083 437 8817 — так указано в каждом посте.",
        textEn:
          "It's easiest to book via LINE using 083 437 8817 — that's the contact given in every post.",
        textTh: "จองเรียนสะดวกทาง LINE หรือโทร 083-437-8817 ตามที่ระบุในทุกโพสต์",
      },
      {
        text: "Командные тренировки детей-спортсменов проходят в бассейне Nong Ket Yai — где будут индивидуальные уроки, уточняйте при записи.",
        textEn:
          "The kids' squad trains at the Nong Ket Yai pool — ask where private lessons take place when you book.",
        textTh: "ทีมนักกีฬาเด็กซ้อมที่สระหนองเกตุใหญ่ สอบถามสถานที่เรียนตัวต่อตัวตอนจอง",
      },
    ],
    categorySlugs: ["swimming"],
  },
  // Junior Pattaya Swim — уроки плавания
  {
    slug: "junior-pattaya-swim-nong-pla-lai",
    nameEn: "JPS Pattaya Swim — swimming lessons",
    nameTh: "ชมรมว่ายน้ำเจพีเอสพัทยาสวิม (JPS Pattaya Swim) — ครูนัทสอนว่ายน้ำ",
    description:
      "JPS Pattaya Swim (Junior Pattaya Swim) — клуб плавания тренера Nat (ครูนัท). Детей учат плавать с нуля, чтобы ребёнок уверенно держался на воде и не боялся глубины, а тех, кто уже плавает, готовят к соревнованиям: ученики клуба выступают на детских турнирах. Взрослых тоже берут. Одна из площадок — бассейн Baan Rai в Нонг Пла Лай (сой Nong Ket Yai 14), по Google Картам занятия там вт–чт и сб–вс с 16:00 до 20:00, пн и пт — выходной. Объявления на тайском; цены в открытых постах не публикуют — уточняйте. Телефон: 099 542 4259 или 083 437 8817, Facebook: facebook.com/juniorpattayaswimming.",
    descriptionEn:
      "JPS Pattaya Swim (Junior Pattaya Swim) is a swimming club run by coach Nat (ครูนัท). Beginners learn from scratch so they feel safe in the water and aren't afraid of deep water, while children who already swim train for competitions: club swimmers take part in junior meets. Adults are welcome too. One of the venues is the Baan Rai pool in Nong Pla Lai (Soi Nong Ket Yai 14); according to Google Maps, lessons there run Tue–Thu and Sat–Sun from 16:00 to 20:00, closed Mon and Fri. Announcements are in Thai; prices aren't published in public posts, so please ask. Phone: 099 542 4259 or 083 437 8817, Facebook: facebook.com/juniorpattayaswimming.",
    descriptionTh:
      "ชมรมว่ายน้ำเจพีเอสพัทยาสวิม โดยครูนัท รับสอนว่ายน้ำขั้นพื้นฐานสำหรับเด็กและบุคคลทั่วไป ให้เป็นทักษะติดตัว ไม่ต้องกลัวจมน้ำ และรับฝึกนักกีฬาโดยโค้ชผู้เชี่ยวชาญ นักกีฬาของชมรมลงแข่งขันว่ายน้ำรุ่นเยาวชน สถานที่สอนแห่งหนึ่งคือสระว่ายน้ำบ้านไร่ หนองเกตุใหญ่ 14 ตำบลหนองปลาไหล ตาม Google Maps เปิดอังคาร–พฤหัส และเสาร์–อาทิตย์ 16:00–20:00 น. ปิดวันจันทร์และศุกร์ ค่าเรียนกรุณาสอบถามโดยตรง โทร 099 542 4259 หรือ 083 437 8817, Facebook: facebook.com/juniorpattayaswimming",
    tips: [
      {
        text: "Занятия в бассейне Baan Rai — после обеда: вт–чт и сб–вс, 16:00–20:00; в понедельник и пятницу выходной (по Google Картам).",
        textEn:
          "Lessons at the Baan Rai pool are in the late afternoon: Tue–Thu and Sat–Sun, 16:00–20:00; closed Mondays and Fridays (per Google Maps).",
        textTh:
          "สระบ้านไร่เปิดช่วงเย็น อังคาร–พฤหัส และเสาร์–อาทิตย์ 16:00–20:00 น. ปิดวันจันทร์และศุกร์ (ตาม Google Maps)",
      },
      {
        text: "Для тех, кто уже плавает, есть спортивная группа: клуб возит учеников на детские соревнования.",
        textEn:
          "Children who already swim can join the competitive squad — the club takes swimmers to junior meets.",
        textTh: "สำหรับเด็กที่ว่ายเป็นแล้ว มีการฝึกนักกีฬาและพาไปแข่งขันรุ่นเยาวชน",
      },
    ],
    categorySlugs: ["swimming"],
  },
  // KIBERone — Sukhumvit
  {
    slug: "kiberone-sukhumvit",
    nameEn: "KIBERone IT & Digital Academy",
    nameTh: "KIBERone สอนเขียนโปรแกรมสำหรับเด็ก พัทยา",
    description:
      "Филиал международной IT-академии для детей KIBERone на Sukhumvit Road в Нонг Прыэ (здание Ratthakit, 2-й и 4-й этажи, вход с обратной стороны). Дети 6–14 лет учатся программированию от Scratch до Python, C#, JavaScript и Lua, делают игры, сайты и мобильные приложения, занимаются 3D-моделированием и работают с ИИ; группы по возрасту — 6–8, 9–11 и 12–14 лет. Занятия очные, раз в неделю по два часа. Ведут на английском, с тайским ассистентом; учеников готовят к международным олимпиадам по программированию. Первое занятие бесплатное, после пробного — скидка 50% на первый месяц. По сайту: 4900 ฿ в месяц (8 часов), для двух и больше детей из одной семьи — 4000 ฿, полгода с седьмым месяцем в подарок — 29 400 ฿; уточняйте. Телефон и WhatsApp: 061 061 9080, LINE: @kiberonepattaya, Facebook и Instagram: pattaya.kiberone.en, сайт: kiberone.pro/pattaya-en.",
    descriptionEn:
      "The Pattaya branch of the international KIBERone IT academy for children, on Sukhumvit Road in Nong Prue (Ratthakit Building, 2nd and 4th floors, entrance from the back). Children aged 6–14 learn programming from Scratch to Python, C#, JavaScript and Lua, build games, websites and mobile apps, do 3D modelling and work with AI; age groups are 6–8, 9–11 and 12–14. Classes are in person, once a week for two hours. Lessons are in English with a Thai teaching assistant, and students are prepared for international coding competitions. The first lesson is free, and after the trial the first month is 50% off. Per the website: 4,900 ฿ a month (8 hours), 4,000 ฿ each for two or more children from one family, or 29,400 ฿ for six months with the seventh free — please check. Phone and WhatsApp: 061 061 9080, LINE: @kiberonepattaya, Facebook and Instagram: pattaya.kiberone.en, website: kiberone.pro/pattaya-en.",
    descriptionTh:
      "KIBERone สาขาพัทยา สถาบันสอน IT สำหรับเด็กระดับนานาชาติ บนถนนสุขุมวิท หนองปรือ (อาคาร Ratthakit ชั้น 2 และชั้น 4 ทางเข้าด้านหลัง) เด็กอายุ 6–14 ปี เรียนเขียนโปรแกรมตั้งแต่ Scratch ไปจนถึง Python, C#, JavaScript และ Lua สร้างเกม เว็บไซต์ และแอปมือถือ ออกแบบ 3D และใช้ AI เป็นเครื่องมือ แบ่งกลุ่มตามอายุ 6–8, 9–11 และ 12–14 ปี เรียนที่สถาบัน สัปดาห์ละครั้ง ครั้งละ 2 ชั่วโมง สอนเป็นภาษาอังกฤษ มีพี่เลี้ยงคนไทย และเตรียมเด็กสำหรับการแข่งขันเขียนโปรแกรมระดับนานาชาติ ทดลองเรียนฟรี 1 ครั้ง และรับส่วนลด 50% สำหรับเดือนแรก ค่าเรียนตามเว็บไซต์: 4,900 บาทต่อเดือน (8 ชั่วโมง) พี่น้องตั้งแต่ 2 คนขึ้นไป คนละ 4,000 บาท แพ็กเกจ 6 เดือนแถม 1 เดือน 29,400 บาท กรุณาสอบถามอีกครั้ง โทรและ WhatsApp 061 061 9080 LINE: @kiberonepattaya Facebook และ Instagram: pattaya.kiberone.en เว็บไซต์ kiberone.pro/pattaya-en",
    tips: [
      {
        text: "Пробное занятие бесплатное; по выходным бывают открытые пробные уроки в 15:00 на час (Roblox + ИИ, игры в VR-очках) — места ограничены, записывайтесь через LINE.",
        textEn:
          "The trial lesson is free; on weekends there are open one-hour trial classes at 15:00 (Roblox + AI, VR games) — places are limited, book via LINE.",
        textTh:
          "ทดลองเรียนฟรี วันหยุดสุดสัปดาห์มีคลาสทดลองเวลา 15:00 น. 1 ชั่วโมง (Roblox + AI และเกม VR) ที่นั่งจำกัด จองทาง LINE",
      },
      {
        text: "Вход в здание Ratthakit — с обратной стороны; есть парковка для машин и мотобайков.",
        textEn:
          "The entrance to the Ratthakit Building is at the back; there is parking for cars and motorbikes.",
        textTh: "ทางเข้าอาคาร Ratthakit อยู่ด้านหลัง มีที่จอดรถยนต์และรถจักรยานยนต์",
      },
      {
        text: "Для братьев и сестёр цена ниже: 4000 ฿ в месяц за ребёнка вместо 4900 ฿ (по сайту).",
        textEn:
          "Siblings pay less: 4,000 ฿ a month per child instead of 4,900 ฿ (per the website).",
        textTh:
          "พี่น้องเรียนด้วยกันได้ราคาพิเศษ คนละ 4,000 บาทต่อเดือน แทน 4,900 บาท (ตามเว็บไซต์)",
      },
      {
        text: "На каникулах бывают интенсивы: например, в октябре 2026 — четырёхдневный лагерь по созданию модов для Minecraft для 8–11 лет, 9:00–12:00, 4700 ฿ (группа до 8 человек).",
        textEn:
          "There are holiday intensives: in October 2026, for example, a four-day Minecraft modding camp for ages 8–11, 9:00–12:00, 4,700 ฿ (up to 8 children).",
        textTh:
          "ช่วงปิดเทอมมีค่ายเรียนเข้มข้น เช่น ตุลาคม 2026 ค่ายสร้างม็อด Minecraft 4 วัน สำหรับอายุ 8–11 ปี เวลา 9:00–12:00 น. ราคา 4,700 บาท (รับ 8 คน)",
      },
    ],
    minAgeMonths: 72,
    maxAgeMonths: 168,
    price: 4900,
    priceUnit: "/ месяц",
    priceUnitEn: "/ month",
    priceUnitTh: "/ เดือน",
    categorySlugs: ["robotics"],
  },
  // KIBERone — Thepprasit
  {
    slug: "kiberone-thepprasit",
    nameEn: "KIBERone coding school (Thepprasit)",
    nameTh: "KIBERone โรงเรียนโค้ดดิ้งสำหรับเด็ก (เทพประสิทธิ์)",
    description:
      "Филиал международной школы программирования и цифровых навыков для детей KIBERone на Thepprasit Road (офис 818/19). Дети 6–14 лет учатся в группах по возрасту — 6–8, 9–11 и 12–14 лет: Scratch, Python, JavaScript, создание игр в Roblox Studio и Minecraft, сайтов и мобильных приложений, 3D-моделирование, дизайн, слепая печать. Занятия офлайн, раз в неделю по 2 часа, в игровом формате; на уроке, кроме преподавателя, есть ассистент, после каждого занятия родители получают отчёт, а пропущенную тему можно бесплатно отработать с преподавателем. Ведут на русском, английском и тайском. Пробный урок бесплатный. Цены по сайту школы: 4 400 ฿ в месяц (4 занятия), для второго ребёнка из семьи — 3 500 ฿; первый месяц со скидкой 50% — уточняйте. Телефон и WhatsApp: +66 96 642 7169, Instagram: @pattaya.kiberone.ru, Facebook: facebook.com/pattaya.kiberone.ru, Telegram: telegram.me/Pattaya_KIBERone_ru, сайт: kiberone.pro/pattaya-ru.",
    descriptionEn:
      "The Thepprasit Road branch (office 818/19) of KIBERone, an international coding and digital skills school for children. Kids aged 6–14 study in age groups — 6–8, 9–11 and 12–14: Scratch, Python, JavaScript, making games in Roblox Studio and Minecraft, websites and mobile apps, 3D modelling, design and touch typing. Classes are in person, once a week for 2 hours, in a playful format; an assistant helps the teacher in every lesson, parents get a report after each class, and a missed topic can be made up with the teacher for free. Lessons are taught in Russian, English and Thai. The trial lesson is free. Prices from the school's website: 4,400 ฿ a month (4 lessons), 3,500 ฿ for a second child from the same family; 50% off the first month — please confirm. Phone and WhatsApp: +66 96 642 7169, Instagram: @pattaya.kiberone.ru, Facebook: facebook.com/pattaya.kiberone.ru, Telegram: telegram.me/Pattaya_KIBERone_ru, website: kiberone.pro/pattaya-en.",
    descriptionTh:
      "KIBERone สาขาถนนเทพประสิทธิ์ (ออฟฟิศ 818/19) โรงเรียนสอนเขียนโปรแกรมและทักษะดิจิทัลสำหรับเด็กระดับนานาชาติ เด็กอายุ 6–14 ปีเรียนเป็นกลุ่มตามวัย 6–8, 9–11 และ 12–14 ปี ได้แก่ Scratch, Python, JavaScript การสร้างเกมใน Roblox Studio และ Minecraft การทำเว็บไซต์และแอปมือถือ การออกแบบ 3 มิติ งานดีไซน์ และการพิมพ์สัมผัส เรียนแบบออฟไลน์ สัปดาห์ละครั้ง ครั้งละ 2 ชั่วโมง ในรูปแบบเกม ทุกคลาสมีผู้ช่วยครู ผู้ปกครองได้รับรายงานหลังเรียนทุกครั้ง และหากขาดเรียนสามารถเรียนชดเชยกับครูได้ฟรี สอนเป็นภาษารัสเซีย อังกฤษ และไทย ทดลองเรียนฟรี ค่าเรียนตามเว็บไซต์: 4,400 บาทต่อเดือน (4 ครั้ง) ลูกคนที่สองในครอบครัวเดียวกัน 3,500 บาท เดือนแรกลด 50% กรุณาสอบถามอีกครั้ง โทรและ WhatsApp +66 96 642 7169 Instagram: @pattaya.kiberone.ru Facebook: facebook.com/pattaya.kiberone.ru เว็บไซต์ kiberone.pro/pattaya-th",
    tips: [
      {
        text: "Пробный урок бесплатный; запись через WhatsApp +66 96 642 7169 или в директ Instagram. После пробного — скидка 50% на первый месяц (по сайту школы).",
        textEn:
          "The trial lesson is free; book via WhatsApp +66 96 642 7169 or Instagram DM. After the trial you get 50% off the first month (per the school's website).",
        textTh:
          "ทดลองเรียนฟรี จองทาง WhatsApp +66 96 642 7169 หรือ Instagram หลังทดลองเรียนได้ส่วนลด 50% สำหรับเดือนแรก (ตามเว็บไซต์)",
      },
      {
        text: "Если пропустили занятие, тему можно бесплатно пройти с преподавателем на дополнительном уроке.",
        textEn:
          "If your child misses a class, the topic can be covered for free in an extra session with the teacher.",
        textTh: "หากขาดเรียน สามารถเรียนชดเชยหัวข้อนั้นกับครูได้ฟรี",
      },
      {
        text: "Пригласите друга — скидка 500 ฿ вам и другу; второму ребёнку из семьи месяц стоит 3 500 ฿ вместо 4 400 ฿.",
        textEn:
          "Refer a friend and you both get 500 ฿ off; a second child from the same family pays 3,500 ฿ a month instead of 4,400 ฿.",
        textTh:
          "ชวนเพื่อนรับส่วนลด 500 บาททั้งสองฝ่าย ลูกคนที่สองในครอบครัวเดียวกันจ่าย 3,500 บาทต่อเดือนแทน 4,400 บาท",
      },
      {
        text: "В Паттайе у KIBERone два адреса — на Thepprasit Road и на Sukhumvit Road (Нонг Прыэ); при записи уточните, на какой площадке будет группа.",
        textEn:
          "KIBERone has two locations in Pattaya — Thepprasit Road and Sukhumvit Road (Nong Prue); when booking, check which one your group meets at.",
        textTh:
          "KIBERone มี 2 สาขาในพัทยา คือถนนเทพประสิทธิ์และถนนสุขุมวิท (หนองปรือ) ตอนจองควรถามว่ากลุ่มเรียนที่สาขาไหน",
      },
      {
        text: "Можно взять сразу полгода: 26 400 ฿ за 6 месяцев и седьмой месяц в подарок (по подсветке «Цены» в Instagram школы, 2024 год) — актуальность уточняйте.",
        textEn:
          "You can pay for six months at once: 26,400 ฿ for 6 months plus a seventh month free (per the school's Instagram highlight “Prices”, 2024) — please check it still applies.",
        textTh:
          "สมัครครั้งเดียว 6 เดือนได้ 26,400 บาท แถมเดือนที่ 7 ฟรี (ตามไฮไลต์ “ราคา” ใน Instagram ของโรงเรียน ปี 2024) กรุณาสอบถามว่ายังใช้ได้หรือไม่",
      },
    ],
    minAgeMonths: 72,
    maxAgeMonths: 179,
    price: 4400,
    priceUnit: "/ месяц",
    priceUnitEn: "/ month",
    priceUnitTh: "/ เดือน",
    classes: [
      {
        name: "Младшая группа",
        nameEn: "Junior group",
        nameTh: "กลุ่มเล็ก",
        ageLabel: "6–8 лет",
        ageLabelEn: "6–8 years",
        ageLabelTh: "6–8 ปี",
        minAgeMonths: 72,
        maxAgeMonths: 107,
        parentRequired: null,
        schedule: "1 раз в неделю, 2 часа",
        scheduleEn: "once a week, 2 hours",
        scheduleTh: "สัปดาห์ละครั้ง 2 ชั่วโมง",
      },
      {
        name: "Средняя группа",
        nameEn: "Middle group",
        nameTh: "กลุ่มกลาง",
        ageLabel: "9–11 лет",
        ageLabelEn: "9–11 years",
        ageLabelTh: "9–11 ปี",
        minAgeMonths: 108,
        maxAgeMonths: 143,
        parentRequired: null,
        schedule: "1 раз в неделю, 2 часа",
        scheduleEn: "once a week, 2 hours",
        scheduleTh: "สัปดาห์ละครั้ง 2 ชั่วโมง",
      },
      {
        name: "Старшая группа",
        nameEn: "Senior group",
        nameTh: "กลุ่มโต",
        ageLabel: "12–14 лет",
        ageLabelEn: "12–14 years",
        ageLabelTh: "12–14 ปี",
        minAgeMonths: 144,
        maxAgeMonths: 179,
        parentRequired: null,
        schedule: "1 раз в неделю, 2 часа",
        scheduleEn: "once a week, 2 hours",
        scheduleTh: "สัปดาห์ละครั้ง 2 ชั่วโมง",
      },
    ],
    categorySlugs: ["robotics"],
  },
  // Kru B — уроки плавания
  {
    slug: "kru-b-swimming-nong-pla-lai",
    nameEn: "Kru B Swimming Lessons (Bp swimming)",
    nameTh: "รับสอนว่ายน้ำพัทยา by ครูบี (Bp swimming)",
    description:
      "Частный тренер по плаванию Kru B (страница «Bp swimming») с коллегой Kru Pha. Занятия проходят в бассейне Mekhouse & Swimming pool в Нонг Пла Лай (Soi Nong Hiang 1/1, к востоку от Сукхумвита); тренер может приехать и в ваш бассейн. Учат базовым навыкам, держаться на воде и спасать себя, ставят технику; берут детей и взрослых, можно прийти одному — подберут группу. По объявлению января 2024 года: будни 16:30–17:30, суббота 8:00–12:00, воскресенье 13:00–18:00, цена «от 1 600 ฿» — за сколько занятий и актуально ли сейчас, уточняйте. У тренера больше 10 лет опыта, тренерские курсы Thai Swimming Association (уровни 1 и 2) и курс по спасению на воде. Ведут на тайском. Телефон: 064 005 7220 (Kru B), 090 418 8065 (Kru Pha), LINE: line.me/ti/p/QhGRLKqJda, Facebook: «รับสอนว่ายน้ำพัทยา Bp swimming».",
    descriptionEn:
      "A private swimming coach, Kru B (page “Bp swimming”), working with colleague Kru Pha. Lessons take place at the Mekhouse & Swimming pool in Nong Pla Lai (Soi Nong Hiang 1/1, east of Sukhumvit); the coach can also come to your own pool. They teach basic skills, water safety and self-rescue, and stroke technique; children and adults are welcome, and you can come on your own and join a group. From a January 2024 announcement: weekdays 16:30–17:30, Saturday 8:00–12:00, Sunday 13:00–18:00, price “from 1,600 ฿” — check how many lessons that covers and whether it's still current. The coach has over 10 years' experience, Thai Swimming Association coaching courses (levels 1 and 2) and water-rescue training. Lessons are in Thai. Phone: 064 005 7220 (Kru B), 090 418 8065 (Kru Pha), LINE: line.me/ti/p/QhGRLKqJda, Facebook: “รับสอนว่ายน้ำพัทยา Bp swimming”.",
    descriptionTh:
      "ครูบี (เพจ Bp swimming) และครูภา รับสอนว่ายน้ำที่สระ Mekhouse & Swimming pool หนองปลาไหล (ซอยหนองเหียง 1/1 ฝั่งตะวันออกของถนนสุขุมวิท) และรับสอนนอกสถานที่ถึงบ้าน สอนทักษะพื้นฐาน การเอาตัวรอดในน้ำ และปรับท่าว่ายให้ถูกต้อง รับทั้งเด็กและผู้ใหญ่ มาคนเดียวก็มีเพื่อนเรียนด้วย ตามประกาศเดือนมกราคม 2567: จันทร์–ศุกร์ 16:30–17:30 น. เสาร์ 08:00–12:00 น. อาทิตย์ 13:00–18:00 น. ค่าเรียนเริ่มต้น 1,600 บาท กรุณาสอบถามจำนวนครั้งและราคาปัจจุบัน ครูมีประสบการณ์สอนมากกว่า 10 ปี ผ่านการอบรมผู้ฝึกสอนจากสมาคมกีฬาว่ายน้ำแห่งประเทศไทย Level 1 และ 2 และการช่วยชีวิตทางน้ำ สอนเป็นภาษาไทย โทร 064 005 7220 (ครูบี) 090 418 8065 (ครูภา) LINE: line.me/ti/p/QhGRLKqJda Facebook: รับสอนว่ายน้ำพัทยา Bp swimming",
    tips: [
      {
        text: "Если до бассейна ехать неудобно, тренер может провести занятие у вас дома, в вашем бассейне (пост ноября 2026).",
        textEn:
          "If the pool is hard to get to, the coach can teach at your home pool (post from November 2026).",
        textTh:
          "หากไม่สะดวกมาเรียนที่สระ ครูสามารถไปสอนที่บ้านได้ (โพสต์เดือนพฤศจิกายน 2569)",
      },
      {
        text: "Мест в группах немного — запишитесь заранее по телефону или в LINE.",
        textEn: "Group places are limited — book ahead by phone or LINE.",
        textTh: "รับนักเรียนจำนวนจำกัด ควรติดต่อจองล่วงหน้าทางโทรศัพท์หรือ LINE",
      },
      {
        text: "Бассейн — Mekhouse & Swimming pool (пул-вилла) в переулке Soi Nong Hiang 1/1; точку тренер даёт в объявлении.",
        textEn:
          "The pool is Mekhouse & Swimming pool (a pool villa) on Soi Nong Hiang 1/1; the coach shares the map pin in the announcement.",
        textTh:
          "สระเรียนคือ Mekhouse & Swimming pool (พูลวิลล่า) ซอยหนองเหียง 1/1 ครูแนบแผนที่ไว้ในโพสต์ประกาศ",
      },
    ],
    categorySlugs: ["swimming"],
  },
  // Kumon Banglamung (Rong Po)
  {
    slug: "kumon-banglamung-rong-po",
    nameEn: "Kumon Banglamung (Rong Po)",
    nameTh: "ศูนย์คุมองบางละมุง (โรงโป๊ะ)",
    description:
      "Центр японской методики Kumon в Банг Ламунге (Rong Po), к северу от Наклуа: на Сукхумвите, напротив въезда в посёлок Coco Park, рядом с Do Home. Три предмета — математика, английский и тайский. Ребёнок каждый день решает короткие листы-задания своего уровня, а в центр приходит заниматься с преподавателем; начать можно с 3–4 лет, уровень подбирают по бесплатному входному тесту. Центр открыт в четверг и пятницу 15:00–20:00 и в субботу 10:00–16:00. По сайту сети Kumon Thailand: 1700 ฿ в месяц за предмет для детей до 6-го класса (с 7-го — 1800 ฿), разовый регистрационный взнос 535 ฿ с фирменной сумкой — в центре уточняйте. Телефон: 062 715 4400, LINE: line.me/ti/p/4eSnFxQezA, e-mail: kumon.cocopark@hotmail.com, Facebook: KUMON Banglamung คุมองบางละมุง.",
    descriptionEn:
      "A Kumon centre in Bang Lamung (Rong Po), north of Naklua, on Sukhumvit Road opposite the entrance to Coco Park village, next to Do Home. Three subjects: maths, English and Thai. Children do short daily worksheets at their own level and come to the centre to work with the instructor; they can start from age 3–4, with the level set by a free placement test. The centre is open Thursday and Friday 15:00–20:00 and Saturday 10:00–16:00. According to Kumon Thailand's website, fees are 1,700 ฿ a month per subject up to Primary 6 (1,800 ฿ from Secondary 1), plus a one-off 535 ฿ registration fee that includes a Kumon bag — please check with the centre. Phone: 062 715 4400, LINE: line.me/ti/p/4eSnFxQezA, email: kumon.cocopark@hotmail.com, Facebook: KUMON Banglamung คุมองบางละมุง.",
    descriptionTh:
      "ศูนย์คุมองบางละมุง (โรงโป๊ะ) ริมถนนสุขุมวิท หน้าหมู่บ้านโคโค่พาร์ค ข้างดูโฮม สอน 3 วิชา คณิตศาสตร์ ภาษาอังกฤษ และภาษาไทย เด็กทำแบบฝึกหัดตามระดับของตนเองทุกวัน และมาเรียนที่ศูนย์กับผู้สอน เริ่มเรียนได้ตั้งแต่อายุ 3–4 ปี ทดสอบวัดระดับฟรี ศูนย์เปิดวันพฤหัสบดีและศุกร์ 15:00–20:00 น. วันเสาร์ 10:00–16:00 น. ค่าเรียนตามเว็บไซต์คุมองประเทศไทย: วิชาละ 1,700 บาทต่อเดือน สำหรับระดับประถม 6 ลงมา (มัธยม 1 ขึ้นไป 1,800 บาท) ค่าลงทะเบียนครั้งเดียว 535 บาท พร้อมกระเป๋าคุมอง กรุณาสอบถามศูนย์อีกครั้ง โทร 062 715 4400, LINE: line.me/ti/p/4eSnFxQezA, อีเมล kumon.cocopark@hotmail.com",
    tips: [
      {
        text: "Входной тест уровня бесплатный — с него начинают, чтобы подобрать ребёнку стартовые задания.",
        textEn:
          "The placement test is free — it's used to choose the right starting worksheets for your child.",
        textTh: "ทดสอบวัดระดับฟรี เพื่อเลือกระดับเริ่มต้นที่เหมาะกับเด็ก",
      },
      {
        text: "Центр работает только три дня: чт и пт 15:00–20:00, сб 10:00–16:00 (по сайту Kumon Thailand).",
        textEn:
          "The centre is open only three days a week: Thu and Fri 15:00–20:00, Sat 10:00–16:00 (per Kumon Thailand's website).",
        textTh:
          "ศูนย์เปิดเพียง 3 วัน: พฤหัสบดีและศุกร์ 15:00–20:00 น. เสาร์ 10:00–16:00 น. (ตามเว็บไซต์คุมองประเทศไทย)",
      },
      {
        text: "Осенью 2026 центр объявлял акцию: при записи в ноябре или декабре регистрационный взнос 535 ฿ не берут и дарят сумку Kumon.",
        textEn:
          "In autumn 2026 the centre ran a promotion: enrol in November or December and the 535 ฿ registration fee is waived, plus a free Kumon bag.",
        textTh:
          "โปรโมชันปลายปี 2569: สมัครเรียนรอบเดือนพฤศจิกายนหรือธันวาคม ฟรีค่าลงทะเบียน 535 บาท และรับกระเป๋าคุมองฟรี",
      },
      {
        text: "Ориентир — Сукхумвит, напротив въезда в посёлок Coco Park, рядом с магазином Do Home.",
        textEn:
          "Landmark: Sukhumvit Road, opposite the entrance to Coco Park village, next to Do Home.",
        textTh: "จุดสังเกต: ถนนสุขุมวิท หน้าหมู่บ้านโคโค่พาร์ค ข้างดูโฮม",
      },
    ],
    minAgeMonths: 36,
    price: 1700,
    priceUnit: "/ месяц за предмет",
    priceUnitEn: "/ month per subject",
    priceUnitTh: "/ เดือน / วิชา",
    categorySlugs: ["math"],
  },
  // Kumon Central Pattaya
  {
    slug: "kumon-central-pattaya",
    nameEn: "Kumon Central Pattaya",
    nameTh: "คุมองเซ็นทรัลพัทยา (ซอยข้างศิลปบรรณ)",
    description:
      "Центр японской методики Kumon на Pattaya Klang Road (Central Pattaya Road), в сое рядом с Sinlapabanna (ศิลปบรรณ). Три предмета: математика, английский и чтение на тайском. Ребёнок работает с листами заданий самостоятельно и в своём темпе, начиная с уровня, который определяют по входному тесту; преподаватель следит за прогрессом. Центр открыт со среды по пятницу 14:00–19:00 и в субботу 10:30–17:00; воскресенье, понедельник и вторник — выходные. По сайту сети Kumon Thailand: 1700 ฿ в месяц за предмет для учеников до 6-го класса включительно, 1800 ฿ — для средней школы, вступительный взнос 535 ฿ (в ноябре–декабре 2026 центр его не берёт) — уточняйте. Телефон и LINE: 086 335 2592 (lin.ee/UTsQTtJj), Facebook: Kumon Central Pattaya (kumon.pattaya), TikTok: @kumonpattaya.",
    descriptionEn:
      "A Kumon centre on Pattaya Klang Road (Central Pattaya Road), in the soi next to Sinlapabanna (ศิลปบรรณ). Three subjects: maths, English and Thai reading. Children work through worksheets on their own and at their own pace, starting from a level set by a placement test; the instructor tracks progress. The centre is open Wednesday to Friday 14:00–19:00 and Saturday 10:30–17:00; closed Sunday, Monday and Tuesday. Per the Kumon Thailand website: 1,700 ฿ a month per subject up to Primary 6, 1,800 ฿ from Secondary 1, plus a one-time 535 ฿ registration fee (waived by this centre for November–December 2026 enrolments) — please check. Phone and LINE: 086 335 2592 (lin.ee/UTsQTtJj), Facebook: Kumon Central Pattaya (kumon.pattaya), TikTok: @kumonpattaya.",
    descriptionTh:
      "ศูนย์คุมองเซ็นทรัลพัทยา บนถนนพัทยากลาง ในซอยข้างศิลปบรรณ เปิดสอน 3 วิชา คณิตศาสตร์ ภาษาอังกฤษ และการอ่านภาษาไทย เด็กทำแบบฝึกหัดด้วยตนเองตามความสามารถ เริ่มจากระดับที่เหมาะสมตามผลทดสอบวัดระดับ ผู้สอนติดตามพัฒนาการ ศูนย์เปิดวันพุธ–ศุกร์ 14:00–19:00 น. และวันเสาร์ 10:30–17:00 น. หยุดวันอาทิตย์ จันทร์ และอังคาร ค่าเรียนตามเว็บไซต์คุมองประเทศไทย: วิชาละ 1,700 บาทต่อเดือน (ป.6 ลงไป) และ 1,800 บาท (ม.1 ขึ้นไป) ค่าลงทะเบียนแรกเข้า 535 บาท (ศูนย์ยกเว้นให้เมื่อสมัครรอบพฤศจิกายน–ธันวาคม 2569) กรุณาสอบถามอีกครั้ง โทรและ LINE 086 335 2592 (lin.ee/UTsQTtJj) Facebook: Kumon Central Pattaya TikTok: @kumonpattaya",
    tips: [
      {
        text: "Перед стартом — бесплатный тест на определение уровня: по нему подбирают, с каких заданий начать.",
        textEn:
          "Before starting there's a free placement test that decides where the child begins.",
        textTh: "ก่อนเริ่มเรียนมีทดสอบวัดระดับฟรี เพื่อเลือกจุดเริ่มต้นที่เหมาะกับเด็ก",
      },
      {
        text: "Воскресенье, понедельник и вторник — выходные; в будни центр открыт с 14:00, так что можно прийти после школы.",
        textEn:
          "Closed Sunday, Monday and Tuesday; on weekdays the centre opens at 14:00, so children can come after school.",
        textTh:
          "หยุดวันอาทิตย์ จันทร์ และอังคาร วันธรรมดาเปิด 14:00 น. มาเรียนหลังเลิกเรียนได้",
      },
      {
        text: "При записи в ноябре–декабре 2026 центр не берёт вступительный взнос 535 ฿ и дарит рюкзак Kumon.",
        textEn:
          "For November–December 2026 enrolments the centre waives the 535 ฿ registration fee and gives a Kumon school bag.",
        textTh:
          "สมัครเรียนรอบพฤศจิกายน–ธันวาคม 2569 ฟรีค่าลงทะเบียนแรกเข้า 535 บาท และรับกระเป๋านักเรียนคุมอง",
      },
      {
        text: "Цена считается за каждый предмет отдельно: два предмета — две месячные оплаты.",
        textEn: "Fees are per subject, so two subjects means two monthly fees.",
        textTh: "ค่าเรียนคิดแยกรายวิชา เรียน 2 วิชาจ่าย 2 วิชา",
      },
    ],
    price: 1700,
    priceUnit: "/ месяц за предмет",
    priceUnitEn: "/ month per subject",
    priceUnitTh: "/ วิชา / เดือน",
    categorySlugs: ["math"],
  },
  // Kumon Nakluea (FN Outlet)
  {
    slug: "kumon-nakluea-fn-outlet",
    nameEn: "Kumon Pattaya–Naklua (FN Outlet)",
    nameTh: "คุมอง พัทยา นาเกลือ (FN Outlet)",
    description:
      "Центр Kumon в торговом центре FN Outlet в Наклуа, у перекрёстка Rong Mai Khid (แยกโรงไม้ขีด) на Sukhumvit Road. По японской методике Kumon дети занимаются математикой, английским и чтением на тайском: каждый получает задания по своему уровню и учится работать самостоятельно, а преподаватели особенно внимательно следят за малышами. Время в центре не фиксированное — ребёнок уходит, когда качественно сделал свою часть. Центр открыт по вторникам и четвергам с 13:00 до 19:00 и по субботам с 13:00 до 18:00. Перед началом — бесплатный тест на уровень. По прайсу Kumon Thailand: 1 700 ฿ в месяц за предмет для учеников до 6-го класса, 1 800 ฿ — для средней школы, вступительный взнос 535 ฿ (сумка и материалы) — уточняйте в центре. Занятия на тайском. Телефон: 089 440 2530, LINE: lin.ee/YbC39sB, Facebook: facebook.com/kumon.nakluea.",
    descriptionEn:
      "A Kumon centre in the FN Outlet mall in Naklua, by the Rong Mai Khid junction (แยกโรงไม้ขีด) on Sukhumvit Road. Following the Japanese Kumon method, children study maths, English and Thai reading: each child gets worksheets at their own level and learns to work independently, with teachers keeping a close eye on the little ones. Time at the centre isn't fixed — a child leaves once their work is done well. The centre is open on Tuesdays and Thursdays 13:00–19:00 and Saturdays 13:00–18:00. A free placement test comes first. Per Kumon Thailand's fee list: 1,700 ฿ a month per subject up to Primary 6, 1,800 ฿ for secondary students, plus a one-off 535 ฿ enrolment fee (bag and materials) — please confirm with the centre. Lessons are in Thai. Phone: 089 440 2530, LINE: lin.ee/YbC39sB, Facebook: facebook.com/kumon.nakluea.",
    descriptionTh:
      "ศูนย์คุมองในห้าง FN Outlet นาเกลือ แยกโรงไม้ขีด ถนนสุขุมวิท เด็ก ๆ เรียนคณิตศาสตร์ ภาษาอังกฤษ และภาษาไทยด้วยระบบคุมองจากญี่ปุ่น แต่ละคนได้รับแบบฝึกหัดตามระดับความสามารถของตนเองและฝึกเรียนรู้ด้วยตัวเอง โดยครูดูแลเด็กเล็กอย่างใกล้ชิด เวลาเรียนที่ศูนย์ไม่ตายตัว เมื่อทำงานเสร็จอย่างมีคุณภาพแล้วก็กลับบ้านได้ ศูนย์เปิดวันอังคารและพฤหัสบดี 13:00–19:00 น. และวันเสาร์ 13:00–18:00 น. ก่อนเริ่มเรียนมีทดสอบวัดระดับฟรี ค่าเรียนตามอัตราของคุมองประเทศไทย: วิชาละ 1,700 บาทต่อเดือนสำหรับนักเรียนระดับ ป.6 ลงไป และ 1,800 บาทสำหรับ ม.1 ขึ้นไป ค่าแรกเข้า 535 บาท (กระเป๋าและอุปกรณ์) กรุณาสอบถามศูนย์อีกครั้ง โทร 089-440-2530 LINE: lin.ee/YbC39sB Facebook: facebook.com/kumon.nakluea",
    tips: [
      {
        text: "Начните с бесплатного теста на уровень — по нему подбирают стартовые задания; центр также проводит акции с бесплатными пробными занятиями (последняя — 21–31 октября 2026).",
        textEn:
          "Start with the free placement test, which sets the starting level; the centre also runs free trial periods (the latest was 21–31 October 2026).",
        textTh:
          "เริ่มจากทดสอบวัดระดับฟรีเพื่อกำหนดระดับเริ่มต้น ศูนย์มีช่วงทดลองเรียนฟรีเป็นระยะ (ครั้งล่าสุด 21–31 ต.ค. 2569)",
      },
      {
        text: "Центр работает только во вторник, четверг (13:00–19:00) и субботу (13:00–18:00) — приходить нужно в эти дни.",
        textEn:
          "The centre is only open on Tuesday, Thursday (13:00–19:00) and Saturday (13:00–18:00), so visits fall on those days.",
        textTh:
          "ศูนย์เปิดเฉพาะวันอังคาร พฤหัสบดี (13:00–19:00 น.) และเสาร์ (13:00–18:00 น.)",
      },
      {
        text: "Если ребёнок справился быстро, его отпустят раньше: в Kumon оценивают качество работы, а не часы в классе (по посту центра).",
        textEn:
          "If a child finishes quickly, they may leave early: Kumon looks at the quality of the work, not hours in class (per the centre's post).",
        textTh:
          "หากเด็กทำงานเสร็จเร็วก็กลับได้ก่อน คุมองดูคุณภาพของงานมากกว่าจำนวนชั่วโมง (ตามโพสต์ของศูนย์)",
      },
      {
        text: "Плата — за каждый предмет отдельно; при записи разово платится взнос 535 ฿, в него входят сумка Kumon и материалы.",
        textEn:
          "Fees are per subject; a one-off 535 ฿ enrolment fee covers a Kumon bag and materials.",
        textTh:
          "ค่าเรียนคิดแยกรายวิชา ค่าแรกเข้า 535 บาทครั้งเดียว ได้กระเป๋าคุมองและอุปกรณ์",
      },
    ],
    price: 1700,
    priceUnit: "/ месяц за предмет",
    priceUnitEn: "/ month per subject",
    priceUnitTh: "/ เดือน / วิชา",
    classes: [
      {
        name: "Вт и Чт",
        nameEn: "Tue & Thu",
        nameTh: "อังคาร–พฤหัส",
        ageLabel: "все уровни",
        ageLabelEn: "all levels",
        ageLabelTh: "ทุกระดับชั้น",
        minAgeMonths: 0,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "13:00–19:00",
        scheduleEn: "13:00–19:00",
        scheduleTh: "13:00–19:00",
      },
      {
        name: "Сб",
        nameEn: "Sat",
        nameTh: "เสาร์",
        ageLabel: "все уровни",
        ageLabelEn: "all levels",
        ageLabelTh: "ทุกระดับชั้น",
        minAgeMonths: 0,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "13:00–18:00",
        scheduleEn: "13:00–18:00",
        scheduleTh: "13:00–18:00",
      },
    ],
    categorySlugs: ["math"],
  },
  // Kumon Pattaya Soi Khao Talo
  {
    slug: "kumon-pattaya-khao-talo",
    nameEn: "Kumon Pattaya Soi Khao Talo",
    nameTh: "คุมองพัทยา ซอยเขาตาโล",
    description:
      "Центр Kumon на Soi Khao Talo, в южной части Паттайи (Нонг Прыэ). Как и во всей сети, ребёнок занимается по рабочим листам в своём темпе, начиная с уровня, который ему по силам, а преподаватель следит за прогрессом. Здесь есть три предмета: математика, английский и тайский язык. Центр открыт по вторникам и четвергам с 15:00 до 19:00 и в субботу с 9:00 до 17:00. Цены по сайту Kumon Thailand: 1 700 ฿ в месяц за предмет для учеников до 6-го класса, 1 800 ฿ — с 1-го класса средней школы, регистрация 535 ฿ (в ноябре 2026 года центр объявлял её бесплатной) — уточняйте. Ведёт центр Kittinan Khiamsanthia. Телефон: 063 189 4245, Facebook: «คุมองพัทยา ซอยเขาตาโล».",
    descriptionEn:
      "A Kumon centre on Soi Khao Talo in the south of Pattaya (Nong Prue). As across the chain, children work through worksheets at their own pace, starting from a level they can manage, while the instructor tracks their progress. Three subjects are taught here: maths, English and Thai. The centre is open Tuesday and Thursday 15:00–19:00 and Saturday 9:00–17:00. Prices from Kumon Thailand's website: 1,700 ฿ a month per subject up to grade 6, 1,800 ฿ from secondary grade 1, plus a 535 ฿ registration fee (the centre announced it free in November 2026) — please check. The centre is run by Kittinan Khiamsanthia. Phone: 063 189 4245, Facebook: “คุมองพัทยา ซอยเขาตาโล”.",
    descriptionTh:
      "ศูนย์คุมองพัทยา ซอยเขาตาโล (หนองปรือ) เด็ก ๆ เรียนด้วยแบบฝึกหัดตามจังหวะของตัวเอง เริ่มจากระดับที่ทำได้ โดยผู้สอนคอยติดตามพัฒนาการ ที่ศูนย์นี้เปิดสอน 3 วิชา คือ คณิตศาสตร์ ภาษาอังกฤษ และภาษาไทย เปิดทำการวันอังคารและพฤหัสบดี 15:00–19:00 น. และวันเสาร์ 09:00–17:00 น. ค่าเรียนตามเว็บไซต์คุมองประเทศไทย: ระดับประถมศึกษาปีที่ 6 ลงมา 1,700 บาทต่อวิชาต่อเดือน ตั้งแต่มัธยมศึกษาปีที่ 1 ขึ้นไป 1,800 บาท ค่าลงทะเบียน 535 บาท (เดือนพฤศจิกายน 2569 ศูนย์ประกาศฟรีค่าลงทะเบียน) — กรุณาสอบถามอีกครั้ง ผู้สอนประจำศูนย์ คุณกิตตินันท์ เขียมสันเทียะ โทร 063 189 4245 Facebook: คุมองพัทยา ซอยเขาตาโล",
    tips: [
      {
        text: "Центр работает не каждый день: вторник и четверг с 15:00 до 19:00, суббота с 9:00 до 17:00 (по странице центра на сайте Kumon Thailand).",
        textEn:
          "The centre isn't open every day: Tuesday and Thursday 15:00–19:00, Saturday 9:00–17:00 (per the centre's page on Kumon Thailand's website).",
        textTh:
          "ศูนย์ไม่ได้เปิดทุกวัน: อังคารและพฤหัสบดี 15:00–19:00 น. เสาร์ 09:00–17:00 น. (ตามหน้าศูนย์บนเว็บไซต์คุมองประเทศไทย)",
      },
      {
        text: "Регистрационный взнос 535 ฿ центр время от времени отменяет: так было при записи в ноябре 2026 года — спросите об акции при звонке.",
        textEn:
          "The centre sometimes waives the 535 ฿ registration fee — it did for November 2026 enrolment — so ask about offers when you call.",
        textTh:
          "ศูนย์มีโปรโมชันฟรีค่าลงทะเบียน 535 บาทเป็นครั้งคราว (เช่น สมัครเรียนเดือนพฤศจิกายน 2569) สอบถามโปรโมชันเมื่อโทรติดต่อ",
      },
      {
        text: "Цена считается за каждый предмет отдельно: два предмета — две месячные оплаты.",
        textEn: "Fees are per subject: two subjects mean two monthly fees.",
        textTh: "ค่าเรียนคิดแยกตามวิชา เรียน 2 วิชาจ่ายค่าเรียนรายเดือน 2 วิชา",
      },
    ],
    price: 1700,
    priceUnit: "/ месяц за предмет",
    priceUnitEn: "/ month per subject",
    priceUnitTh: "/ วิชา / เดือน",
    categorySlugs: ["math"],
    cover: "/images/activities/kumon-pattaya-khao-talo.jpg",
  },
  // Kumon Pattaya Klang
  {
    slug: "kumon-pattaya-klang",
    nameEn: "Kumon Pattaya Klang (Sukhumvit)",
    nameTh: "คุมองพัทยากลาง ถนนสุขุมวิท หลังนำชัยโฮมอิเล็คโทรนิคส์",
    description:
      "Центр Kumon на Сукхумвите, за магазином Numchai Home Electronics (район Central Pattaya Road): математика, английский и чтение на тайском по японской методике. Ребёнок идёт по программе в своём темпе: короткие задания с замером времени в центре и ежедневная домашняя работа, а переход на следующий уровень — после проверочного теста. Центр открыт со вторника по четверг с 15:00 до 19:00 и в субботу с 9:00 до 17:00; руководитель — Uthai Vimonpattanon. Стоимость по общему прайсу Kumon Thailand — 1 700 ฿ в месяц за предмет для начальной школы (1 800 ฿ со средней), плюс разовый вступительный взнос 535 ฿; в центре уточняйте. Пробное занятие и тест на уровень — бесплатно, на встречу записываются заранее. Телефон: 086 980 9722, Instagram: @kumon_pattayaklang, Facebook: «คุมองพัทยากลาง - ถนนสุขุมวิท หลังนำชัยโฮม อิเล็คโทรนิคส์», сайт: th.kumonglobal.com.",
    descriptionEn:
      "A Kumon center on Sukhumvit Road, behind Numchai Home Electronics (near Central Pattaya Road): maths, English and Thai reading using the Japanese method. Each child moves through the program at their own pace — short timed worksheets at the center plus daily homework — and moves up a level after a progress test. The center is open Tuesday to Thursday 15:00–19:00 and Saturday 9:00–17:00; the instructor is Uthai Vimonpattanon. According to Kumon Thailand's national fees it costs 1,700 ฿ a month per subject for primary pupils (1,800 ฿ from secondary), plus a one-time 535 ฿ registration fee — please check with the center. The trial lesson and placement test are free; book an appointment in advance. Phone: 086 980 9722, Instagram: @kumon_pattayaklang, Facebook: “คุมองพัทยากลาง - ถนนสุขุมวิท หลังนำชัยโฮม อิเล็คโทรนิคส์”, website: th.kumonglobal.com.",
    descriptionTh:
      "ศูนย์คุมองพัทยากลาง ถนนสุขุมวิท หลังนำชัยโฮมอิเล็คโทรนิคส์ สอนคณิตศาสตร์ ภาษาอังกฤษ และภาษาไทย ด้วยระบบการเรียนของคุมอง เด็กเรียนตามระดับความสามารถของตัวเอง ทำแบบฝึกหัดที่ศูนย์โดยจับเวลาตามเวลามาตรฐาน (SCT) และทำการบ้านทุกวัน เลื่อนระดับเมื่อสอบผ่าน ศูนย์เปิดวันอังคาร–พฤหัสบดี 15:00–19:00 น. และวันเสาร์ 09:00–17:00 น. ผู้สอนประจำศูนย์คือคุณ Uthai Vimonpattanon ค่าเรียนตามอัตราของคุมองประเทศไทย: ระดับประถม 1,700 บาทต่อวิชาต่อเดือน (มัธยม 1,800 บาท) และค่าแรกเข้า 535 บาท กรุณาสอบถามที่ศูนย์อีกครั้ง ทดลองเรียนและทดสอบวัดระดับฟรี กรุณานัดหมายกับคุณครูล่วงหน้า โทร 086 980 9722 Instagram: @kumon_pattayaklang Facebook: คุมองพัทยากลาง - ถนนสุขุมวิท หลังนำชัยโฮม อิเล็คโทรนิคส์ เว็บไซต์ th.kumonglobal.com",
    tips: [
      {
        text: "Пробное занятие и тест на уровень бесплатные; на встречу с преподавателем нужно записаться заранее по телефону.",
        textEn:
          "The trial lesson and placement test are free; book a meeting with the instructor in advance by phone.",
        textTh: "ทดลองเรียนและทดสอบวัดระดับฟรี กรุณาโทรนัดหมายกับคุณครูล่วงหน้า",
      },
      {
        text: "Kumon — это ежедневные домашние листы: центр советует делать их каждый день и записывать время начала и конца.",
        textEn:
          "Kumon involves daily homework sheets: the center recommends doing them every day and noting the start and finish times.",
        textTh: "คุมองมีการบ้านทุกวัน ศูนย์แนะนำให้แบ่งทำทุกวันและจดเวลาเริ่ม–เสร็จ",
      },
      {
        text: "Центр открыт только вт–чт после обеда и в субботу; в понедельник, пятницу и воскресенье закрыт.",
        textEn:
          "The center is open only Tue–Thu afternoons and on Saturdays; closed on Monday, Friday and Sunday.",
        textTh:
          "ศูนย์เปิดเฉพาะอังคาร–พฤหัสช่วงบ่ายและวันเสาร์ ปิดวันจันทร์ ศุกร์ และอาทิตย์",
      },
      {
        text: "Ориентир — магазин Numchai Home Electronics на Сукхумвите: центр в ряду за ним, перед входом есть столики, где можно подождать ребёнка.",
        textEn:
          "Landmark: Numchai Home Electronics on Sukhumvit — the center is in the row behind it, with tables out front where you can wait.",
        textTh:
          "จุดสังเกต: ร้านนำชัยโฮมอิเล็คโทรนิคส์ ถนนสุขุมวิท ศูนย์อยู่ด้านหลัง หน้าศูนย์มีโต๊ะให้ผู้ปกครองนั่งรอ",
      },
    ],
    price: 1700,
    priceUnit: "/ месяц за предмет",
    priceUnitEn: "/ month per subject",
    priceUnitTh: "/ วิชา / เดือน",
    categorySlugs: ["math"],
    cover: "/images/activities/kumon-pattaya-klang.jpg",
    photos: [
      { url: "/images/activities/kumon-pattaya-klang-2.jpg", caption: "Учебный класс" },
    ],
    photoRightsNote:
      "С официальной страницы: страница центра на сайте Kumon Thailand, 2026-11",
    photoSource: "PLACE_OWNER",
  },
  // Levent Jintakanit Pattaya (เลอวองจินตคณิต)
  {
    slug: "levent-jintakanit-pattaya",
    nameEn: "Levent Finger Mental Arithmetic",
    nameTh: "เลอวองจินตคณิต สาขาพัทยา",
    description:
      "Паттайский филиал тайской сети Levent Jintakanit (เลอวองจินตคณิต; филиалы также в Шрирача, Районге, Бо Вине и Чачэнгсау) — ментальная арифметика на пальцах: дети считают двумя руками, без счётов, и учатся быстро и точно решать примеры в уме, в том числе на слух (диктанты). Принимают детей от последнего года сада до 6-го класса, 5–12 лет; программа идёт по ступеням-книгам, в конце — выпуск. Ученики филиала выступают на чемпионате Таиланда по ментальной арифметике: в 2026 году привезли первое место и несколько призовых. Пробное занятие — по записи. Адрес: 81/88 Moo 12, напротив офиса водоканала (การประปา). Цены не публикуют — уточняйте. Телефон: 064 894 6455, LINE: @leventpattaya, Facebook: เลอวองจินตคณิต สาขาพัทยา.",
    descriptionEn:
      "The Pattaya branch of Levent Jintakanit (เลอวองจินตคณิต), a Thai chain with branches in Si Racha, Rayong, Bo Win and Chachoengsao, teaching finger mental arithmetic: children calculate with both hands, without an abacus, and learn to solve sums quickly and accurately in their heads, including by ear (dictation drills). Ages 5–12, from the last year of kindergarten to Grade 6; the course goes book by book, ending with a graduation. Branch students compete in the Thailand mental arithmetic championship — in 2026 they won a first place and several other prizes. Trial lessons by appointment. Address: 81/88 Moo 12, opposite the waterworks office (การประปา). Prices aren't published — please ask. Phone: 064 894 6455, LINE: @leventpattaya, Facebook: เลอวองจินตคณิต สาขาพัทยา.",
    descriptionTh:
      "เลอวองจินตคณิต สาขาพัทยา (เครือมีสาขาศรีราชา ระยอง บ่อวิน และฉะเชิงเทรา) สอนคำนวณด้วยนิ้วมือทั้งสองข้าง ไม่ใช้ลูกคิด เน้นคิดเลขได้เร็วและแม่นยำ รวมถึงฝึก Dictation คำนวณโจทย์ผ่านการฟัง รับนักเรียนอนุบาล 3 – ป.6 (อายุ 5–12 ปี) เรียนเป็นลำดับขั้นตามเล่มจนจบหลักสูตร หลักสูตรรับรองโดยกระทรวงศึกษาธิการ นักเรียนของสาขาลงแข่งขันชิงแชมป์ประเทศไทย ปี 2026 ได้รางวัลชนะเลิศและรางวัลอื่นอีกหลายรางวัล นัดทดลองเรียนได้ ที่อยู่ 81/88 ม.12 ตรงข้ามการประปา ค่าเรียนไม่ได้ประกาศ กรุณาสอบถาม โทร 064-894-6455 LINE: @leventpattaya Facebook: เลอวองจินตคณิต สาขาพัทยา",
    tips: [
      {
        text: "Пробное занятие назначают через LINE @leventpattaya.",
        textEn: "Book a trial lesson via LINE @leventpattaya.",
        textTh: "นัดทดลองเรียนได้ทาง LINE @leventpattaya",
      },
      {
        text: "Считают на пальцах обеих рук, а не на счётах, — ничего покупать заранее не нужно.",
        textEn:
          "Children count on the fingers of both hands rather than an abacus — nothing to buy in advance.",
        textTh: "คำนวณด้วยนิ้วมือทั้งสองข้าง ไม่ต้องใช้ลูกคิด",
      },
      {
        text: "Ориентир — напротив офиса водоканала (การประปา), 81/88 Moo 12.",
        textEn: "Landmark: opposite the waterworks office (การประปา), 81/88 Moo 12.",
        textTh: "จุดสังเกต: ตรงข้ามการประปา เลขที่ 81/88 ม.12",
      },
      {
        text: "Ведут на тайском: посты и программа — только на тайском языке; про занятия на английском спрашивайте отдельно.",
        textEn:
          "Classes are run in Thai: posts and materials are Thai-only — ask separately about English.",
        textTh: "โพสต์และหลักสูตรเป็นภาษาไทย หากต้องการเรียนเป็นภาษาอังกฤษกรุณาสอบถาม",
      },
    ],
    minAgeMonths: 60,
    maxAgeMonths: 144,
    categorySlugs: ["math"],
  },
  // Math by Zen
  {
    slug: "math-by-zen",
    nameEn: "Math by Zen Tutoring School (Kru Phi Zen)",
    nameTh: "สถาบันกวดวิชา by ครูพี่เซ้น",
    description:
      "Тайская репетиторская школа (กวดวิชา) Kru Phi Zen в Нонг Прыэ, в здании Ruean Phisa. Основатель — преподаватель математики, но школа ведёт и естественные науки (физика, химия, биология), английский, китайский, тайский и обществознание. Берут детей от второго года детского сада (อนุบาล 2) до выпускного класса: помогают подтянуть оценки и готовят к вступительным экзаменам в 7-й и 10-й классы и в университет, а также к национальному тесту O-NET. Можно заниматься индивидуально или в маленькой группе, программу подбирают под задачу; к урокам дают распечатки и видео, классы с кондиционером. Занятия на тайском. Цены не опубликованы, школа называет их доступными — уточняйте. Телефон: 090 992 5291 (Kru Phi Zen), 090 240 8810, LINE: lin.ee/kpK258f, Facebook: «สถาบันกวดวิชาbyครูพี่เซ้น» (MathByZen), Instagram и TikTok: @mathbyzen.",
    descriptionEn:
      'A Thai tutoring school (กวดวิชา) run by Kru Phi Zen in Nong Prue, in the Ruean Phisa building. The founder teaches maths, but the school also covers science (physics, chemistry, biology), English, Chinese, Thai and social studies. It takes children from the second year of kindergarten (Anuban 2) to the final year of secondary school: helping raise grades and preparing for entrance exams into Grade 7, Grade 10 and university, as well as the national O-NET test. Lessons can be one-to-one or in a small group, with the programme tailored to the goal; handouts and videos are provided, and classrooms are air-conditioned. Teaching is in Thai. Prices are not published; the school describes them as affordable — please ask. Phone: 090 992 5291 (Kru Phi Zen), 090 240 8810, LINE: lin.ee/kpK258f, Facebook: "สถาบันกวดวิชาbyครูพี่เซ้น" (MathByZen), Instagram and TikTok: @mathbyzen.',
    descriptionTh:
      "สถาบันกวดวิชา by ครูพี่เซ้น ในหนองปรือ (ตึกเรือนภิษา) ครูพี่เซ้นสอนคณิตศาสตร์ และสถาบันเปิดสอนวิทยาศาสตร์ ฟิสิกส์ เคมี ชีวะ ภาษาอังกฤษ ภาษาจีน ภาษาไทย และสังคมศึกษา สอนตั้งแต่อนุบาล 2 ถึง ม.6 ทั้งเพิ่มเกรดและติวสอบเข้า ม.1 ม.4 และมหาวิทยาลัย รวมถึงข้อสอบ O-NET เลือกเรียนได้ทั้งแบบเดี่ยวและกลุ่มเล็ก ออกแบบหลักสูตรตามเป้าหมาย มีชีทและวิดีโอประกอบการเรียน ห้องเรียนติดแอร์ สอนเป็นภาษาไทย ค่าเรียนไม่ได้ประกาศไว้ กรุณาสอบถาม โทร 090 992 5291 (ครูพี่เซ้น) 090 240 8810 LINE: lin.ee/kpK258f Facebook: สถาบันกวดวิชาbyครูพี่เซ้น Instagram และ TikTok: @mathbyzen",
    tips: [
      {
        text: "Формат на выбор: индивидуально или в маленькой группе — обсудите при записи.",
        textEn:
          "You can choose one-to-one or small-group lessons — discuss it when you sign up.",
        textTh: "เลือกเรียนได้ทั้งแบบเดี่ยวและแบบกลุ่มเล็ก สอบถามตอนสมัคร",
      },
      {
        text: "Занятия ведут на тайском — подходит детям, которые учатся в тайской школе.",
        textEn: "Lessons are in Thai — best suited to children at Thai schools.",
        textTh: "สอนเป็นภาษาไทย เหมาะกับเด็กที่เรียนในโรงเรียนไทย",
      },
      {
        text: "Ориентир — здание Ruean Phisa (ตึกเรือนภิษา) в Нонг Прыэ, 77/47 Moo 1.",
        textEn:
          "Landmark: the Ruean Phisa building (ตึกเรือนภิษา) in Nong Prue, 77/47 Moo 1.",
        textTh: "จุดสังเกต: ตึกเรือนภิษา 77/47 ม.1 ต.หนองปรือ",
      },
      {
        text: "По отзывам на Facebook школу рекомендуют все 44 оставивших оценку.",
        textEn: "On Facebook, all 44 people who left a rating recommend the school.",
        textTh: "บน Facebook ผู้รีวิวทั้ง 44 คนแนะนำสถาบันนี้",
      },
    ],
    categorySlugs: ["math"],
  },
  // Math Million Pattaya
  {
    slug: "math-million-pattaya",
    nameEn: "Math Million tutoring centre",
    nameTh: "สถาบันกวดวิชา Math Million Pattaya",
    description:
      "Math Million — новый тайский центр дополнительных занятий (กวดวิชา) в сои Chaiyaphon Withi. Пять основных предметов — математика, естественные науки, английский, тайский и обществознание — для детей от детского сада до средней школы (M.3); ведут индивидуально (1:1) или в маленьких группах, в центре или онлайн. Для младших есть направление Million Kids — творческие занятия на стыке искусства и науки (например, поделки из термопластика «พลาสติกหด», где дети заодно наблюдают, как материал меняется от нагрева). Для старшеклассников центр проводит интенсивы к экзаменам TGAT и A-Level. Занятия на тайском. Расписание групп и цены не опубликованы — уточняйте; в каникулы бывает бесплатное пробное занятие. Телефон: 086 392 5754, LINE: math1000000, Facebook: страница «สถาบันกวดวิชา Math Million Pattaya».",
    descriptionEn:
      "Math Million is a new Thai tutoring centre (กวดวิชา) on Soi Chaiyaphon Withi. It covers five core subjects — maths, science, English, Thai and social studies — for children from kindergarten to lower secondary (M.3), taught one-to-one or in small groups, at the centre or online. For younger children there's Million Kids, creative sessions mixing art and science (for example shrink-plastic crafts, where kids also watch how the material changes with heat). For older students the centre runs TGAT and A-Level exam prep. Lessons are in Thai. Group times and prices aren't published — please ask; during school holidays there's sometimes a free trial lesson. Phone: 086 392 5754, LINE: math1000000, Facebook: the 'สถาบันกวดวิชา Math Million Pattaya' page.",
    descriptionTh:
      "Math Million สถาบันกวดวิชาเปิดใหม่ ซอยชัยพรวิถี สอน 5 วิชาหลัก ได้แก่ คณิตศาสตร์ วิทยาศาสตร์ ภาษาอังกฤษ ภาษาไทย และสังคมศึกษา สำหรับเด็กตั้งแต่อนุบาลถึงมัธยมต้น (ม.3) เรียนเดี่ยว 1:1 หรือกลุ่มเล็ก ทั้งที่สถาบันและออนไลน์ สำหรับเด็กเล็กมี Million Kids กิจกรรมสร้างสรรค์ที่ผสมศิลปะกับวิทยาศาสตร์ เช่น ศิลปะ DIY พลาสติกหด ที่เด็ก ๆ ได้สังเกตการเปลี่ยนแปลงของพลาสติกเมื่อโดนความร้อน และสำหรับนักเรียนมัธยมปลายมีติว TGAT และ A-Level สอนเป็นภาษาไทย ยังไม่ได้ประกาศตารางเรียนและค่าเรียน กรุณาสอบถาม ช่วงปิดเทอมมีทดลองเรียนฟรีเป็นบางครั้ง โทร 086-392-5754 LINE ID: math1000000 Facebook: สถาบันกวดวิชา Math Million Pattaya",
    tips: [
      {
        text: "Можно заниматься один на один или в маленькой группе, а также онлайн с телефона, планшета или компьютера.",
        textEn:
          "You can choose one-to-one or small-group lessons, or study online from a phone, tablet or computer.",
        textTh:
          "เลือกเรียนเดี่ยว 1:1 หรือกลุ่มเล็กได้ หรือเรียนออนไลน์ผ่านมือถือ แท็บเล็ต หรือคอมพิวเตอร์",
      },
      {
        text: "В октябрьские каникулы 2026 года для малышей было бесплатное пробное занятие Million Kids по выходным — 10:00–11:00 и 13:00–14:00; о следующих спрашивайте в LINE.",
        textEn:
          "During the October 2026 school break there was a free Million Kids trial at weekends, 10:00–11:00 and 13:00–14:00; ask on LINE about the next one.",
        textTh:
          "ช่วงปิดเทอมตุลาคม 2569 มีทดลองเรียน Million Kids ฟรีวันเสาร์–อาทิตย์ 10:00–11:00 และ 13:00–14:00 น. สอบถามรอบถัดไปทาง LINE",
      },
      {
        text: "Центр новый, страница в Facebook небольшая — расписание и цены узнавайте напрямую по телефону 086 392 5754 или в LINE math1000000.",
        textEn:
          "The centre is new and its Facebook page is small — ask for times and prices directly by phone (086 392 5754) or on LINE (math1000000).",
        textTh:
          "สถาบันเพิ่งเปิดใหม่ สอบถามตารางเรียนและค่าเรียนได้โดยตรงที่ 086-392-5754 หรือ LINE math1000000",
      },
    ],
    categorySlugs: ["math"],
  },
  // Math Talent by Dr.Ying
  {
    slug: "math-talent-dr-ying",
    nameEn: "Math & Science Talent by Dr.Ying",
    nameTh: "Math Talent by Dr.Ying สาขาพัทยา",
    description:
      "Филиал тайской сети Math Talent by Dr.Ying (больше 30 филиалов в Таиланде, Лаосе и на Филиппинах), открылся в январе 2026 года в комплексе Numchai Fair в Центральной Паттайе (Pattaya Klang), комната J12. Учат математике и естественным наукам через «визуальное мышление»: объясняют на картинках, через игры, пособия и опыты руками. Берут детей с 3 лет — от первого класса детского сада до 3-го класса средней школы. Группы маленькие, не больше 4 детей; есть классы на тайском и на английском. Пробное занятие — по записи. На школьные каникулы в декабре 2026 — январе 2027 филиал набирает научный лагерь Science Camp: восемь тем с опытами, от 4 900 ฿ — уточняйте. Цены обычных курсов не публикуются. Телефон: 065 445 3059, LINE: @mtpattaya, Facebook: mathtalentpattaya, Instagram: @mathtalentpattaya.",
    descriptionEn:
      "A branch of the Thai chain Math Talent by Dr.Ying (over 30 branches in Thailand, Laos and the Philippines), opened in January 2026 in the Numchai Fair complex in central Pattaya (Pattaya Klang), room J12. Maths and science are taught through “visual thinking”: concepts are explained with pictures, games, manipulatives and hands-on experiments. Children are accepted from age 3 — from kindergarten year 1 to secondary grade 3. Groups are small, no more than 4 children, and there are classes in Thai and in English. Trial lessons are by appointment. For the December 2026 – January 2027 school holidays the branch is running a Science Camp with eight experiment themes, from 4,900 ฿ — please check. Regular course prices aren't published. Phone: 065 445 3059, LINE: @mtpattaya, Facebook: mathtalentpattaya, Instagram: @mathtalentpattaya.",
    descriptionTh:
      "Math Talent by Dr.Ying สาขาพัทยา (เครือมีมากกว่า 30 สาขาในไทย ลาว และฟิลิปปินส์) เปิดเมื่อมกราคม 2569 ที่นำชัยแฟร์ พัทยากลาง ห้อง J12 สอนคณิตศาสตร์และวิทยาศาสตร์แบบ “คิดเป็นภาพ” ผ่านภาพ เกม สื่อการสอน และการทดลองจริง รับเด็กตั้งแต่ 3 ขวบ (อนุบาล 1 ถึง ม.3) ห้องเรียนกลุ่มเล็ก ไม่เกิน 4 คน มีคลาสทั้งภาษาไทยและภาษาอังกฤษ นัดทดลองเรียนได้ ช่วงปิดเทอมธันวาคม 2569 – มกราคม 2570 เปิดคอร์ส Science Camp 8 ธีมการทดลอง เริ่มต้น 4,900 บาท — กรุณาสอบถามอีกครั้ง ค่าเรียนคอร์สปกติไม่ได้ประกาศไว้ โทร 065 445 3059 LINE: @mtpattaya Facebook: mathtalentpattaya Instagram: @mathtalentpattaya",
    tips: [
      {
        text: "Пробное занятие нужно записать заранее по телефону или в LINE; в постах филиал не раз предлагал его бесплатно.",
        textEn:
          "Book a trial lesson in advance by phone or LINE; the branch has repeatedly offered it free in its posts.",
        textTh:
          "นัดทดลองเรียนล่วงหน้าทางโทรศัพท์หรือ LINE ในโพสต์ของสาขามีโปรทดลองเรียนฟรีหลายครั้ง",
      },
      {
        text: "Есть классы на английском — удобно, если ребёнок не говорит по-тайски.",
        textEn: "There are classes in English — handy if your child doesn't speak Thai.",
        textTh: "มีคลาสภาษาอังกฤษ สะดวกสำหรับเด็กที่ไม่ได้พูดภาษาไทย",
      },
      {
        text: "Пока ребёнок на занятии, взрослый может подождать в филиале (по отзыву в посте филиала).",
        textEn:
          "An adult can wait at the branch while the child is in class (per a parent's review shared by the branch).",
        textTh:
          "ผู้ปกครองนั่งรอที่สาขาระหว่างเด็กเรียนได้ (ตามรีวิวผู้ปกครองที่สาขาแชร์)",
      },
      {
        text: "Ориентир — комплекс Numchai Fair в Центральной Паттайе, комната J12.",
        textEn: "Landmark: the Numchai Fair complex in central Pattaya, room J12.",
        textTh: "จุดสังเกต: นำชัยแฟร์ พัทยากลาง ห้อง J12",
      },
    ],
    minAgeMonths: 36,
    categorySlugs: ["math"],
  },
  // Mavinn Muay Thai — детский класс
  {
    slug: "mavinn-muay-thai-pattaya",
    nameEn: "Junior Muay Thai at MAVINN",
    nameTh: "มวยไทยเด็ก Junior Muay Thai ที่ MAVINN",
    description:
      "MAVINN Muay Thai Pattaya — большой зал муай-тай на Thepprasit Road (Нонг Прыэ) с бассейном, сауной, ледяной купелью и проживанием; главный тренер — легенда тайского бокса Namsaknoi. Кроме взрослых классов, здесь есть отдельная детская группа Junior Muay Thai: с понедельника по четверг с 17:30 до 19:00 и в субботу с 10:00 до 11:30 (расписание от октября 2026). Новичков берут, первое занятие — бесплатно. С какого возраста принимают детей и сколько стоит детская группа, зал не публикует — уточняйте. Телефон и WhatsApp: 085 291 9000, Instagram: @mavinn.muaythai.pattaya, Facebook: Mavinn Muaythai Pattaya, сайт: mavinn.com/pattaya.",
    descriptionEn:
      "MAVINN Muay Thai Pattaya is a large Muay Thai camp on Thepprasit Road (Nong Prue) with a pool, sauna, ice bath and on-site accommodation; the head coach is Muay Thai legend Namsaknoi. Besides adult classes, there's a separate kids' group, Junior Muay Thai: Monday to Thursday 17:30–19:00 and Saturday 10:00–11:30 (schedule as of October 2026). Beginners are welcome and the first session is free. The gym doesn't publish the minimum age or the price of the junior class — please ask. Phone and WhatsApp: 085 291 9000, Instagram: @mavinn.muaythai.pattaya, Facebook: Mavinn Muaythai Pattaya, website: mavinn.com/pattaya.",
    descriptionTh:
      "MAVINN Muay Thai Pattaya ค่ายมวยไทยขนาดใหญ่บนถนนเทพประสิทธิ์ (หนองปรือ) มีสระว่ายน้ำ ซาวน่า สระน้ำเย็น และที่พัก หัวหน้าโค้ชคือนำศักดิ์น้อย ยอดมวยไทยระดับตำนาน นอกจากคลาสผู้ใหญ่ ยังมีคลาสเด็ก Junior Muay Thai แยกต่างหาก: วันจันทร์–พฤหัสบดี 17.30–19.00 น. และวันเสาร์ 10.00–11.30 น. (ตารางเดือนตุลาคม 2026) มือใหม่เรียนได้ ทดลองเรียนครั้งแรกฟรี อายุขั้นต่ำและค่าเรียนคลาสเด็กไม่ได้ประกาศ กรุณาสอบถาม โทร/WhatsApp 085-291-9000 Instagram: @mavinn.muaythai.pattaya Facebook: Mavinn Muaythai Pattaya เว็บไซต์ mavinn.com/pattaya",
    tips: [
      {
        text: "Первое занятие бесплатное (по странице зала в Facebook).",
        textEn: "The first session is free (per the gym's Facebook page).",
        textTh: "ทดลองเรียนครั้งแรกฟรี (ตามเพจ Facebook ของค่าย)",
      },
      {
        text: "Детская группа идёт в будни вечером, когда взрослый класс уже закончился, — удобно после школы; в субботу — утром.",
        textEn:
          "The junior class runs on weekday evenings after the adult class ends — handy after school; on Saturdays it's in the morning.",
        textTh:
          "คลาสเด็กวันธรรมดาเป็นช่วงเย็นหลังคลาสผู้ใหญ่ สะดวกหลังเลิกเรียน ส่วนวันเสาร์เป็นช่วงเช้า",
      },
      {
        text: "В воскресенье зал закрыт.",
        textEn: "The gym is closed on Sundays.",
        textTh: "ค่ายปิดวันอาทิตย์",
      },
      {
        text: "Записаться и задать вопросы проще всего через WhatsApp: 085 291 9000.",
        textEn: "WhatsApp is the easiest way to book or ask: 085 291 9000.",
        textTh: "จองหรือสอบถามได้สะดวกทาง WhatsApp 085-291-9000",
      },
    ],
    classes: [
      {
        name: "Пн–Чт",
        nameEn: "Mon–Thu",
        nameTh: "จันทร์–พฤหัส",
        ageLabel: "Junior",
        ageLabelEn: "Junior",
        ageLabelTh: "Junior",
        minAgeMonths: 0,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "17:30–19:00",
        scheduleEn: "17:30–19:00",
        scheduleTh: "17:30–19:00",
      },
      {
        name: "Сб",
        nameEn: "Sat",
        nameTh: "เสาร์",
        ageLabel: "Junior",
        ageLabelEn: "Junior",
        ageLabelTh: "Junior",
        minAgeMonths: 0,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "10:00–11:30",
        scheduleEn: "10:00–11:30",
        scheduleTh: "10:00–11:30",
      },
    ],
    categorySlugs: ["martial-arts"],
    photos: [
      {
        url: "/images/activities/mavinn-muay-thai-pattaya-2.jpg",
        caption: "Расписание зала, группы Junior Muay Thai — жёлтым",
      },
    ],
    photoRightsNote: "С официальной страницы: Instagram зала, 2026-11",
    photoSource: "PLACE_OWNER",
  },
  // Melody Harmony Music Studio
  {
    slug: "melody-harmony-music-studio",
    nameEn: "Music lessons at Melody Harmony Music Studio",
    nameTh: "เรียนดนตรีที่ Melody Harmony Music Studio",
    description:
      "Melody Harmony Music Studio — новая студия современной музыки в комплексе Wonder Space (Банг Ламунг) для детей и взрослых. Учат петь и играть на гитаре, клавишных, барабанах и бас-гитаре, есть занятия в ансамбле и теория музыки. Репертуар — поп, рок, джаз; можно заниматься для себя или готовиться к экзаменам по международным программам Trinity, Rockschool и ABRSM. Первое пробное занятие бесплатное. Объявления на тайском; цены не публикуют — уточняйте при записи. Телефон: 065 841 6666 или 092 925 4457, Facebook: Melody Harmony MUSIC Studio.",
    descriptionEn:
      "Melody Harmony Music Studio is a new contemporary music studio in the Wonder Space complex (Bang Lamung) for children and adults. Lessons cover singing, guitar, keyboard, drums and bass, plus band playing and music theory. Styles include pop, rock and jazz; students can learn for fun or prepare for international exams (Trinity, Rockschool, ABRSM). The first trial lesson is free. Announcements are in Thai; prices aren't published, so please ask when booking. Phone: 065 841 6666 or 092 925 4457, Facebook: Melody Harmony MUSIC Studio.",
    descriptionTh:
      "Melody Harmony Music Studio สตูดิโอสอนดนตรีสำหรับทุกวัย ในโครงการ Wonder Space บางละมุง เปิดสอนร้องเพลง กีตาร์ คีย์บอร์ด กลอง เบส การเล่นดนตรีเป็นวง และทฤษฎีดนตรี รับสอนดนตรีป็อป ร็อก แจ๊ส ตั้งแต่พื้นฐานจนถึงระดับสอบเกรด Trinity, Rockschool และ ABRSM ทดลองเรียนฟรี ค่าเรียนกรุณาสอบถามตอนจองคลาส โทร 065 841 6666 หรือ 092 925 4457, Facebook: Melody Harmony MUSIC Studio",
    tips: [
      {
        text: "Первое занятие бесплатное — запишитесь заранее по телефону 065 841 6666.",
        textEn: "The first lesson is free — book ahead by phone on 065 841 6666.",
        textTh: "ทดลองเรียนฟรี จองล่วงหน้าทางโทร 065 841 6666",
      },
      {
        text: "Можно готовиться к экзаменам Trinity, Rockschool и ABRSM — пригодится, если ребёнок уже занимается всерьёз.",
        textEn:
          "Students can prepare for Trinity, Rockschool and ABRSM grade exams — useful if your child is already serious about music.",
        textTh: "เตรียมสอบเกรด Trinity, Rockschool และ ABRSM ได้",
      },
      {
        text: "Кроме индивидуальных уроков есть игра в ансамбле — ученики выступают вместе, в постах студии есть их записи.",
        textEn:
          "Besides one-to-one lessons there's band playing — the studio posts recordings of its students performing.",
        textTh:
          "นอกจากเรียนเดี่ยว ยังมีการเล่นดนตรีเป็นวง และสตูดิโอโพสต์ผลงานการแสดงของนักเรียน",
      },
    ],
    categorySlugs: ["music"],
  },
  // Mixfight Pattaya — бокс
  {
    slug: "mixfight-pattaya",
    nameEn: "Kids boxing and MMA at MixFight Pattaya",
    nameTh: "มวยและ MMA สำหรับเด็ก MixFight Pattaya",
    description:
      "Клуб единоборств MixFight Pattaya на Thappraya Soi 15 (между Пратамнаком и Джомтьеном) работает с 2012 года: бокс, муай-тай, кикбоксинг, MMA и бразильское джиу-джитсу. Детские группы — с 5 лет, любой уровень подготовки. Тренировка для детей построена как игра: разминка, ловкость, равновесие и реакция, затем основы техники — стойка, передвижения, первые удары и защита; контакт мягкий и под контролем тренера. Детей ведут два тренера: группы «Дети» — в понедельник, среду и пятницу в 17:00, группы до 12 лет — во вторник и четверг в 17:00 и в субботу в 10:00 (по расписанию на сайте). Сайт клуба на русском, английском, тайском и китайском. Первую тренировку бронируют заранее; месяц детских тренировок (12 занятий) — 3 500 ฿, по подсветке «Schedule&price» в Instagram клуба (осень 2025), — уточняйте. WhatsApp и телефон: +66 94 567 8106, Telegram: telegram.me/mixfight_pattaya, Instagram: @mixfight.pattaya, сайт: mixfightpattaya.com.",
    descriptionEn:
      "MixFight Pattaya, a combat sports club on Thappraya Soi 15 (between Pratamnak and Jomtien), has been running since 2012: boxing, Muay Thai, kickboxing, MMA and Brazilian jiu-jitsu. Kids' groups start at age 5, any level. Children's sessions are play-based: a warm-up, agility, balance and reaction drills, then basic technique — stance, footwork, first punches and defence; contact is soft and supervised by the coach. Two coaches run the kids' classes: \"Kids\" groups on Monday, Wednesday and Friday at 17:00, and under-12 groups on Tuesday and Thursday at 17:00 and Saturday at 10:00 (per the club's online schedule). The club's website is in Russian, English, Thai and Chinese. Book the first session in advance; a month of kids' classes (12 sessions) is 3,500 ฿ according to the club's Instagram highlight “Schedule&price” (autumn 2025) — please confirm. WhatsApp and phone: +66 94 567 8106, Telegram: telegram.me/mixfight_pattaya, Instagram: @mixfight.pattaya, website: mixfightpattaya.com.",
    descriptionTh:
      'MixFight Pattaya สโมสรศิลปะการต่อสู้ ทัพพระยา ซอย 15 (ระหว่างพระตำหนักกับจอมเทียน) เปิดมาตั้งแต่ปี 2012 สอนมวยสากล มวยไทย คิกบ็อกซิ่ง MMA และบราซิลเลียนยิวยิตสู กลุ่มเด็กรับตั้งแต่อายุ 5 ปี ทุกระดับ การฝึกสำหรับเด็กเน้นเกมและความสนุก มีวอร์มอัพ ฝึกความคล่องตัว การทรงตัว และปฏิกิริยา จากนั้นเรียนพื้นฐาน ท่ายืน ฟุตเวิร์ก หมัดแรก และการป้องกัน การปะทะเบาและอยู่ในการดูแลของโค้ช มีโค้ชดูแลเด็ก 2 คน กลุ่ม "เด็ก" วันจันทร์ พุธ ศุกร์ 17:00 น. และกลุ่มอายุไม่เกิน 12 ปี วันอังคาร พฤหัสบดี 17:00 น. และวันเสาร์ 10:00 น. (ตามตารางบนเว็บไซต์) เว็บไซต์มีภาษารัสเซีย อังกฤษ ไทย และจีน กรุณาจองครั้งแรกล่วงหน้า ค่าเรียนกลุ่มเด็ก 3,500 บาทต่อเดือน (12 ครั้ง) ตามไฮไลต์ “Schedule&price” ใน Instagram ของสโมสร (ปลายปี 2025) กรุณาสอบถามอีกครั้ง WhatsApp และโทร +66 94 567 8106 Telegram: telegram.me/mixfight_pattaya Instagram: @mixfight.pattaya เว็บไซต์ mixfightpattaya.com',
    tips: [
      {
        text: "На первую тренировку возьмите спортивную форму, воду и полотенце; перчатки на первое время можно взять в клубе.",
        textEn:
          "For the first session bring sportswear, water and a towel; gloves can be borrowed at the club at first.",
        textTh: "ครั้งแรกเตรียมชุดกีฬา น้ำดื่ม และผ้าเช็ดตัว ช่วงแรกยืมนวมที่สโมสรได้",
      },
      {
        text: "О первой тренировке предупредите заранее — через форму на сайте, WhatsApp или Telegram; тренер посмотрит уровень и подскажет группу.",
        textEn:
          "Let the club know before the first session — via the website form, WhatsApp or Telegram; the coach will check the level and suggest a group.",
        textTh:
          "แจ้งล่วงหน้าก่อนมาครั้งแรก ผ่านฟอร์มบนเว็บไซต์ WhatsApp หรือ Telegram โค้ชจะประเมินระดับและแนะนำกลุ่มให้",
      },
      {
        text: "Абонемент привязан к одному направлению и тренеру: если ребёнок захочет и бокс, и муай-тай, нужны два абонемента.",
        textEn:
          "A membership covers one discipline and one coach: if your child wants both boxing and Muay Thai, that's two memberships.",
        textTh:
          "แพ็กเกจผูกกับประเภทกีฬาและโค้ชคนเดียว หากเด็กอยากเรียนทั้งมวยสากลและมวยไทยต้องซื้อ 2 แพ็กเกจ",
      },
      {
        text: "Для дальних районов клуб устраивает трансфер на минибасе, если из одного кондо набирается группа 10–12 человек.",
        textEn:
          "For distant areas the club runs a minibus transfer if a group of 10–12 people from one condo signs up.",
        textTh:
          "สำหรับพื้นที่ไกล สโมสรมีรถมินิบัสรับส่ง หากรวมกลุ่มได้ 10–12 คนจากคอนโดเดียวกัน",
      },
    ],
    minAgeMonths: 60,
    price: 3500,
    priceUnit: "/ месяц (12 занятий)",
    priceUnitEn: "/ month (12 sessions)",
    priceUnitTh: "/ เดือน (12 ครั้ง)",
    classes: [
      {
        name: "Пн, Ср, Пт",
        nameEn: "Mon, Wed, Fri",
        nameTh: "จันทร์ พุธ ศุกร์",
        ageLabel: "с 5 лет",
        ageLabelEn: "from 5 years",
        ageLabelTh: "ตั้งแต่ 5 ปี",
        minAgeMonths: 60,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "17:00",
        scheduleEn: "17:00",
        scheduleTh: "17:00",
      },
      {
        name: "Вт и Чт",
        nameEn: "Tue & Thu",
        nameTh: "อังคาร–พฤหัส",
        ageLabel: "5–12 лет",
        ageLabelEn: "5–12 years",
        ageLabelTh: "5–12 ปี",
        minAgeMonths: 60,
        maxAgeMonths: 144,
        parentRequired: null,
        schedule: "17:00",
        scheduleEn: "17:00",
        scheduleTh: "17:00",
      },
      {
        name: "Сб",
        nameEn: "Sat",
        nameTh: "เสาร์",
        ageLabel: "5–12 лет",
        ageLabelEn: "5–12 years",
        ageLabelTh: "5–12 ปี",
        minAgeMonths: 60,
        maxAgeMonths: 144,
        parentRequired: null,
        schedule: "10:00",
        scheduleEn: "10:00",
        scheduleTh: "10:00",
      },
    ],
    categorySlugs: ["martial-arts"],
    cover: "/images/activities/mixfight-pattaya.jpg",
  },
  // Music Drum School
  {
    slug: "music-drum-school",
    nameEn: "Drum lessons at Music Drum School",
    nameTh: "เรียนกลองที่ Music Drum School",
    description:
      "Music Drum School — студия ударных на Thepprasit Soi 7, где преподаёт музыкант Андрей: высшее музыкально-педагогическое образование (Москва) и 13 лет преподавания. Учат играть на барабанной установке, малом барабане, ксилофоне, перкуссии, есть уроки игры на ханге. Детей берут с 4 лет (по профилю в Instagram; на странице-визитке — с 6), занимаются и подростки, и взрослые. Занятия индивидуальные, по 60 минут, в оборудованной студии со звукоизоляцией; можно выбрать классическую программу с теорией или свободные занятия под свои цели — песни разучивают с первого урока. Ведут на русском и английском. Для детей первое занятие бесплатное. Цены в открытых источниках нет — уточняйте. Телефон: 083 403 4891, WhatsApp: wa.me/message/KWVBHT4QUKYJC1, LINE: line.me/ti/p/p3DlXwWN41, Telegram: telegram.me/andrew_chaplagin, Instagram: @music_school_pattaya.",
    descriptionEn:
      "Music Drum School is a percussion studio on Thepprasit Soi 7, run by musician Andrey, who holds a higher degree in music education (Moscow) and has 13 years of teaching experience. Students learn drum kit, snare drum, xylophone and percussion, and there are handpan (hang) lessons too. Children are taken from age 4 (per the Instagram profile; the link page says from 6), along with teens and adults. Lessons are one-to-one, 60 minutes, in an equipped soundproofed studio; you can choose a classical programme with theory or free-form lessons around your own goals — students play real songs from the first lesson. Taught in Russian and English. The first lesson is free for children. Prices aren't published — please ask. Phone: 083 403 4891, WhatsApp: wa.me/message/KWVBHT4QUKYJC1, LINE: line.me/ti/p/p3DlXwWN41, Telegram: telegram.me/andrew_chaplagin, Instagram: @music_school_pattaya.",
    descriptionTh:
      "Music Drum School สตูดิโอสอนเครื่องกระทบที่เทพประสิทธิ์ ซอย 7 สอนโดยนักดนตรี Andrey จบการศึกษาด้านครุศาสตร์ดนตรีจากมอสโก มีประสบการณ์สอน 13 ปี สอนกลองชุด สแนร์ ระนาดฝรั่ง (ไซโลโฟน) เพอร์คัชชัน และแฮงดรัม รับเด็กตั้งแต่ 4 ขวบ (ตามโปรไฟล์ Instagram ส่วนหน้าลิงก์ระบุตั้งแต่ 6 ขวบ) รวมถึงวัยรุ่นและผู้ใหญ่ เรียนตัวต่อตัวครั้งละ 60 นาทีในสตูดิโอเก็บเสียง เลือกหลักสูตรคลาสสิกพร้อมทฤษฎีหรือเรียนแบบอิสระตามเป้าหมายได้ และได้เล่นเพลงจริงตั้งแต่ครั้งแรก สอนเป็นภาษารัสเซียและอังกฤษ เด็กทดลองเรียนครั้งแรกฟรี ไม่มีการประกาศค่าเรียน กรุณาสอบถาม โทร 083 403 4891 WhatsApp: wa.me/message/KWVBHT4QUKYJC1 LINE: line.me/ti/p/p3DlXwWN41 Instagram: @music_school_pattaya",
    tips: [
      {
        text: "Первое занятие для детей бесплатное — записывайтесь через LINE, WhatsApp или Telegram (по профилю в Instagram).",
        textEn:
          "The first lesson is free for children — book via LINE, WhatsApp or Telegram (per the Instagram profile).",
        textTh:
          "เด็กทดลองเรียนครั้งแรกฟรี จองผ่าน LINE, WhatsApp หรือ Telegram (ตามโปรไฟล์ Instagram)",
      },
      {
        text: "По отзывам, дети начинают и с 4 лет: один из родителей пишет, что сын пришёл в четыре года и занимается уже почти три года.",
        textEn:
          "Per reviews, kids start as young as 4: one parent writes that their son began at four and has been learning for almost three years.",
        textTh:
          "จากรีวิว เด็กเริ่มเรียนได้ตั้งแต่ 4 ขวบ ผู้ปกครองท่านหนึ่งเล่าว่าลูกเริ่มเรียนตอน 4 ขวบและเรียนต่อเนื่องมาเกือบ 3 ปี",
      },
      {
        text: "Уроки индивидуальные, по часу — время договариваете напрямую с преподавателем.",
        textEn:
          "Lessons are one-to-one and last an hour — arrange the time directly with the teacher.",
        textTh: "เรียนตัวต่อตัว ครั้งละ 1 ชั่วโมง นัดเวลากับครูได้โดยตรง",
      },
      {
        text: "Занятия идут на электронной ударной установке в звукоизолированной комнате (по видео в Instagram).",
        textEn:
          "Lessons are on an electronic drum kit in a soundproofed room (per the Instagram videos).",
        textTh: "เรียนบนกลองไฟฟ้าในห้องเก็บเสียง (จากวิดีโอใน Instagram)",
      },
    ],
    minAgeMonths: 48,
    categorySlugs: ["music"],
  },
  // Nareethip Dance School
  {
    slug: "nareethip-dance-school",
    nameEn: "Ballet at Nareethip School",
    nameTh: "บัลเล่ต์ โรงเรียนนรีทิพย์ พัทยา",
    description:
      "Nareethip School (โรงเรียนนรีทิพย์) — школа балета и музыки в Наклуа, в переулке у полицейского участка Банг Ламунга. Главное направление — классический балет для детей: группа для малышей с 4 лет занимается после школы, ученики постарше готовят номера и выступают на конкурсах (в 2026 году — Thailand Challenge Cup Dance Competition, поездка на YGP Indonesia). Кроме балета, школа учит музыке: гитара, в том числе индивидуально, и детский ансамбль Junior NRT Band, который выступает на городских концертах. По закреплённому посту, детская балетная группа 4+ занимается по средам с 17:20 до 18:10. Первое занятие бесплатное — пробное нужно согласовать заранее. Цены не публикуются — уточняйте. Телефон: 081 804 6393, LINE: lin.ee/Rp12E1s, Facebook: nareethipschool, Instagram: @nareethipschool.",
    descriptionEn:
      "Nareethip School (โรงเรียนนรีทิพย์) is a ballet and music school in Naklua, on the lane by the Bang Lamung police station. Its main focus is classical ballet for children: a little ones' group from age 4 meets after school, and older students prepare pieces and dance at competitions (in 2026, the Thailand Challenge Cup Dance Competition and a trip to YGP Indonesia). Besides ballet, the school teaches music: guitar, including one-to-one lessons, and the children's ensemble Junior NRT Band, which plays at city concerts. According to the pinned post, the 4+ ballet group meets on Wednesdays 17:20–18:10. The first lesson is free — arrange the trial in advance. Prices aren't published — please ask. Phone: 081 804 6393, LINE: lin.ee/Rp12E1s, Facebook: nareethipschool, Instagram: @nareethipschool.",
    descriptionTh:
      "โรงเรียนนรีทิพย์ พัทยา โรงเรียนสอนบัลเล่ต์และดนตรีในนาเกลือ ซอยโรงพักบางละมุง เน้นบัลเล่ต์คลาสสิกสำหรับเด็ก มีคลาสเด็กเล็กตั้งแต่ 4 ขวบหลังเลิกเรียน ส่วนนักเรียนที่โตขึ้นฝึกการแสดงและร่วมการแข่งขัน (ปี 2569 Thailand Challenge Cup Dance Competition และ YGP Indonesia) นอกจากบัลเล่ต์ยังมีสอนดนตรี เช่น กีตาร์ รวมถึงเรียนตัวต่อตัว และวง Junior NRT Band ที่ขึ้นแสดงในงานดนตรีของเมืองพัทยา ตามโพสต์ปักหมุด คลาสบัลเล่ต์เด็ก 4 ขวบขึ้นไปเรียนทุกวันพุธ 17:20–18:10 น. ทดลองเรียนฟรี กรุณานัดล่วงหน้า ค่าเรียนไม่ได้ประกาศไว้ กรุณาสอบถาม โทร 081 804 6393 LINE: lin.ee/Rp12E1s Facebook: nareethipschool Instagram: @nareethipschool",
    tips: [
      {
        text: "Пробное занятие бесплатное — школа предлагает его почти в каждом посте; договоритесь заранее по телефону или в LINE.",
        textEn:
          "The trial lesson is free — the school offers it in almost every post; arrange it in advance by phone or LINE.",
        textTh:
          "ทดลองเรียนฟรี (โรงเรียนแจ้งไว้แทบทุกโพสต์) นัดล่วงหน้าทางโทรศัพท์หรือ LINE",
      },
      {
        text: "Посты и общение — на тайском, английском и китайском, так что написать можно и не по-тайски.",
        textEn:
          "Posts and contact are in Thai, English and Chinese, so you can write in English too.",
        textTh: "โพสต์และการติดต่อมีทั้งภาษาไทย อังกฤษ และจีน",
      },
      {
        text: "Для детей постарше есть сценическая практика: конкурсы по балету и выступления ансамбля на городских концертах (например, в парке Лан Пхо в Наклуа).",
        textEn:
          "Older children get stage experience: ballet competitions and ensemble performances at city concerts (for example, at Lan Pho Park in Naklua).",
        textTh:
          "เด็กโตมีโอกาสขึ้นเวที ทั้งการแข่งขันบัลเล่ต์และการแสดงดนตรีของวงในงานของเมือง (เช่น ลานโพธิ์นาเกลือ)",
      },
    ],
    minAgeMonths: 48,
    classes: [
      {
        name: "Балет для малышей, среда",
        nameEn: "Ballet for little ones, Wednesday",
        nameTh: "บัลเล่ต์เด็กเล็ก วันพุธ",
        ageLabel: "от 4 лет",
        ageLabelEn: "4+ years",
        ageLabelTh: "4 ขวบขึ้นไป",
        minAgeMonths: 48,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "17:20–18:10",
        scheduleEn: "17:20–18:10",
        scheduleTh: "17:20–18:10",
      },
    ],
    categorySlugs: ["dance"],
  },
  // Nova Fencing Academy — фехтование
  {
    slug: "nova-fencing-academy",
    nameEn: "Nova Fencing Academy",
    nameTh: "Nova Fencing Academy ฟันดาบพัทยา",
    description:
      "Первая в Паттайе профессиональная школа фехтования — на дороге Toongklom–Talman, рядом со стадионом Chaiyaphruek (Нонг Прыэ). В зале четыре соревновательные дорожки с электронным судейством. Занимаются дети и взрослые с нуля и до соревнований: группы по возрасту и уровню и индивидуальные тренировки; занятие строится из разминки, работы ног, техники клинка, упражнений и контролируемых боёв. На первом занятии новичков знакомят со снаряжением, учат базовым шагам и дают провести первый бой в полной экипировке. Ученики школы ездят на турниры — Chiang Mai Fencing Open, Bangkok Open. Работает ежедневно, в будни с 10:00 до 20:00, в выходные до 19:00; расписание групп и цены пакетов присылают в LINE. Посты на английском и тайском. Телефон: 095 812 7889, LINE: lin.ee/YCCdzxm, Instagram: @novafencingacademypattaya, Facebook: Nova Fencing Academy - Pattaya Thailand, сайт: novafencingthailand.com.",
    descriptionEn:
      "Pattaya's first professional fencing academy, on Toongklom–Talman Road near Chaiyaphruek Stadium (Nong Prue). The hall has four competition pistes with electronic scoring. Children and adults train from complete beginner to competition level, in groups by age and level or in private lessons; a session includes a warm-up, footwork, blade work, drills and controlled sparring. In the first class beginners get to know the equipment, learn basic footwork and fence their first bout in full gear. Students travel to tournaments such as the Chiang Mai Fencing Open and Bangkok Open. Open daily, 10:00–20:00 on weekdays and until 19:00 at weekends; group times and package prices are sent via LINE. Posts are in English and Thai. Phone: 095 812 7889, LINE: lin.ee/YCCdzxm, Instagram: @novafencingacademypattaya, Facebook: Nova Fencing Academy - Pattaya Thailand, website: novafencingthailand.com.",
    descriptionTh:
      "Nova Fencing Academy สถาบันสอนฟันดาบมาตรฐานมืออาชีพแห่งแรกในพัทยา ถนนทุ่งกลม–ตาลหมัน ใกล้สนามกีฬาชัยพฤกษ์ (หนองปรือ) มีสนามแข่ง 4 สนามพร้อมระบบให้คะแนนไฟฟ้า สอนทั้งเด็กและผู้ใหญ่ ตั้งแต่ไม่มีพื้นฐานจนถึงระดับแข่งขัน มีคลาสกลุ่มแบ่งตามอายุและระดับ และคลาสส่วนตัว ในแต่ละคลาสมีวอร์มอัพ ฝึกฟุตเวิร์ก เทคนิคดาบ แบบฝึกหัด และการประลองภายใต้การดูแล คลาสแรกจะได้ทำความรู้จักอุปกรณ์ ฝึกก้าวเท้าพื้นฐาน และสวมชุดฟันดาบครบชุดลงประลองจริง นักเรียนของสถาบันไปแข่งรายการต่าง ๆ เช่น Chiang Mai Fencing Open และ Bangkok Open เปิดทุกวัน จันทร์–ศุกร์ 10:00–20:00 น. เสาร์–อาทิตย์ 10:00–19:00 น. สอบถามตารางคลาสและแพ็กเกจทาง LINE โพสต์เป็นภาษาอังกฤษและไทย โทร 095 812 7889 LINE: lin.ee/YCCdzxm Instagram: @novafencingacademypattaya Facebook: Nova Fencing Academy - Pattaya Thailand เว็บไซต์ novafencingthailand.com",
    tips: [
      {
        text: "Опыт не нужен: на пробном занятии выдают полную экипировку и дают провести первый бой под присмотром тренера.",
        textEn:
          "No experience needed: in the trial class you get full fencing gear and fence a first bout under a coach's supervision.",
        textTh:
          "ไม่ต้องมีประสบการณ์ คลาสทดลองจะได้สวมชุดฟันดาบครบชุดและลองประลองจริงโดยมีโค้ชดูแล",
      },
      {
        text: "У зала есть парковка; ориентир — стадион Chaiyaphruek на дороге Toongklom–Talman.",
        textEn:
          "There is parking at the hall; landmark: Chaiyaphruek Stadium on Toongklom–Talman Road.",
        textTh: "มีที่จอดรถ จุดสังเกต: สนามกีฬาชัยพฤกษ์ ถนนทุ่งกลม–ตาลหมัน",
      },
      {
        text: "Во время выездных турниров школа закрывается на несколько дней (например, 8–13 октября 2026) — перед первым визитом проверьте страницу или напишите в LINE.",
        textEn:
          "The academy closes for a few days during away tournaments (e.g. 8–13 October 2026) — check the page or message on LINE before your first visit.",
        textTh:
          "สถาบันปิดชั่วคราวช่วงไปแข่งต่างจังหวัด (เช่น 8–13 ตุลาคม 2569) ก่อนไปครั้งแรกควรเช็กเพจหรือทักทาง LINE",
      },
      {
        text: "Бывают акции для новичков: на Хэллоуин 2026 предлагали 4 занятия за 2 200 ฿ или подарки новым ученикам — спрашивайте о текущих.",
        textEn:
          "There are offers for newcomers: for Halloween 2026 it was 4 sessions for 2,200 ฿ or gifts for new students — ask about current deals.",
        textTh:
          "มีโปรโมชันสำหรับนักเรียนใหม่ เช่น ช่วงฮาโลวีน 2569 เรียน 4 ครั้ง 2,200 บาท หรือรับของขวัญ สอบถามโปรปัจจุบันได้",
      },
    ],
    categorySlugs: ["sport"],
    cover: "/images/activities/nova-fencing-academy.jpg",
    photos: [
      {
        url: "/images/activities/nova-fencing-academy-2.jpg",
        caption: "Зал с четырьмя дорожками",
      },
    ],
    photoRightsNote:
      "С официальной страницы: сайт академии novafencingthailand.com, 2026-11",
    photoSource: "PLACE_OWNER",
  },
  // Ome Studio My Music
  {
    slug: "ome-studio-my-music",
    nameEn: "Music lessons at Ome Studio My Music",
    nameTh: "เรียนดนตรีกับ Ome Studio My Music (ครูโอม)",
    description:
      "Частный преподаватель музыки Kru Ome (Ome Studio My Music) — классическая гитара, ударные и фортепиано, от самых основ до подготовки к экзаменам на музыкальные грейды. Занятия индивидуальные: у преподавателя дома (район Chaiyapornwithi, Понг) или у вас дома — как договоритесь. Ученики выступают на концертах и конкурсах: осенью 2026 двое детей получили золотые медали на конкурсе пианистов, сейчас преподаватель набирает детей, которых хочет готовить к соревнованиям по гитаре и ударным. Цены не публикует — уточняйте. Телефоны: 065 329 6524, 092 925 4457, Facebook: Ome Studio My Music.",
    descriptionEn:
      "Private music teacher Kru Ome (Ome Studio My Music) teaches classical guitar, drums and piano, from the very basics up to graded music exams. Lessons are one-to-one, either at the teacher's home (Chaiyapornwithi area, Pong) or at yours — by arrangement. Students perform in shows and competitions: in autumn 2026 two children won gold medals at a piano competition, and the teacher is now taking on children he'd like to prepare for guitar and drum competitions. Prices aren't published — please ask. Phone: 065 329 6524, 092 925 4457, Facebook: Ome Studio My Music.",
    descriptionTh:
      "ครูโอม (Ome Studio My Music) รับสอนดนตรีสากล กีตาร์คลาสสิก กลอง และเปียโน ตั้งแต่พื้นฐานจนถึงระดับสอบเกรด เรียนแบบตัวต่อตัว สถานที่สอนที่บ้านคุณครู (ย่านชัยพรวิถี โป่ง) หรือบ้านนักเรียนตามตกลง นักเรียนได้ขึ้นแสดงและลงแข่งขัน ช่วงปลายปี 2026 นักเรียน 2 คนได้เหรียญทองการแข่งขันเปียโน ตอนนี้ครูเปิดรับนักเรียนเพื่อปั้นไปแข่งกีตาร์และกลอง ค่าเรียนไม่ได้ประกาศ กรุณาสอบถาม โทร 065-329-6524, 092-925-4457 Facebook: Ome Studio My Music",
    tips: [
      {
        text: "Преподаватель может приезжать к вам домой — место занятий оговаривается заранее.",
        textEn:
          "The teacher can come to your home — the lesson location is agreed in advance.",
        textTh: "ครูสอนที่บ้านนักเรียนได้ ตกลงสถานที่เรียนล่วงหน้า",
      },
      {
        text: "Учит и с нуля, и до экзаменов на музыкальные грейды; если ребёнку интересны конкурсы — скажите при записи.",
        textEn:
          "Teaches from scratch up to graded music exams; if your child is interested in competitions, mention it when you sign up.",
        textTh: "สอนตั้งแต่พื้นฐานจนถึงสอบเกรด หากลูกสนใจลงแข่งขันแจ้งครูได้ตอนสมัคร",
      },
      {
        text: "Бывают сезонные акции: в октябре 2026 при покупке двух курсов давали скидку 2000 ฿ — спрашивайте о текущих.",
        textEn:
          "There are seasonal offers: in October 2026 buying two courses gave a 2,000 ฿ discount — ask about current ones.",
        textTh:
          "มีโปรโมชันตามเทศกาล เช่น ตุลาคม 2026 ซื้อ 2 คอร์สลด 2,000 บาท สอบถามโปรปัจจุบันได้",
      },
    ],
    categorySlugs: ["music"],
  },
  // One Day Art Studio — рисование
  {
    slug: "one-day-art-studio",
    nameEn: "Art classes and camps at One Day Art Studio",
    nameTh: "คลาสศิลปะและแคมป์ศิลปะ One Day Art Studio",
    description:
      "One Day Art Studio — художественная студия при арт-кафе One Day Aesthetic в Наклуа (сой Nongyai 6). Здесь пишут акрилом на холсте, расписывают керамику, лепят из глины руками и работают на гончарном круге; занятия ведут художники и керамисты, начинать можно без подготовки. Для детей студия устраивает арт-лагеря на каникулах: например, с 7 по 17 апреля 2026 года, с 10:00 до 15:00, дети проектировали роботов, лепили керамику, делали арт-игрушки и шили одежду, обед включён, в конце — выставка работ; записаться можно на отдельные дни. Также помогают готовиться к поступлению в художественную школу. Студия открыта со вторника по воскресенье, 10:00–18:00. Цены не публикуют — уточняйте. Телефон: 095 646 2490, LINE: @onedayartstudio, Facebook: facebook.com/OneDayArtStudioPattaya, Instagram: @oneday_artstudio.",
    descriptionEn:
      "One Day Art Studio is the art studio of the One Day Aesthetic art café in Naklua (Soi Nongyai 6). You can paint on canvas in acrylics, paint ceramics, hand-build with clay or try the pottery wheel; sessions are guided by artists and ceramicists, and no experience is needed. For children the studio runs holiday art camps: from 7 to 17 April 2026, for example, 10:00–15:00 daily, where kids designed robots, made ceramics and art toys and sewed clothes, with lunch included and a final exhibition; you could book single days. The studio also offers tutoring for art school entrance. Open Tuesday to Sunday, 10:00–18:00. Prices aren't published — please ask. Phone: 095 646 2490, LINE: @onedayartstudio, Facebook: facebook.com/OneDayArtStudioPattaya, Instagram: @oneday_artstudio.",
    descriptionTh:
      "One Day Art Studio สตูดิโอศิลปะในร้าน One Day Aesthetic ซอยหนองใหญ่ 6 นาเกลือ มีทั้งเพ้นท์ภาพบนผ้าใบด้วยสีอะคริลิก เพ้นท์เซรามิก ปั้นดินด้วยมือ และเวิร์กช็อปแป้นหมุน มีศิลปินคอยแนะนำ มือใหม่ก็ทำได้ สำหรับเด็กมีแคมป์ศิลปะช่วงปิดเทอม เช่น ONE DAY ART CAMP วันที่ 7–17 เมษายน 2026 เวลา 10:00–15:00 น. เด็ก ๆ ได้ออกแบบหุ่นยนต์ ปั้นเซรามิก ทำ art toy และตัดเย็บเสื้อผ้า รวมอาหารกลางวัน และมีนิทรรศการผลงานหลังจบแคมป์ เลือกลงเป็นรายวันได้ นอกจากนี้ยังมีติวเข้าโรงเรียนศิลปะ เปิดวันอังคาร–อาทิตย์ 10:00–18:00 น. ค่าเรียนกรุณาสอบถาม โทร 095 646 2490, LINE: @onedayartstudio, Facebook: facebook.com/OneDayArtStudioPattaya, Instagram: @oneday_artstudio",
    tips: [
      {
        text: "Можно прийти без записи, если есть места, но студия советует бронировать заранее — через сообщения или LINE @onedayartstudio.",
        textEn:
          "Walk-ins are welcome if there's space, but the studio recommends booking ahead via message or LINE @onedayartstudio.",
        textTh:
          "walk-in ได้หากมีที่ว่าง แต่แนะนำให้จองล่วงหน้าทางข้อความหรือ LINE @onedayartstudio",
      },
      {
        text: "В арт-лагерь на каникулах можно записать ребёнка на отдельные дни — не обязательно на весь срок.",
        textEn:
          "Holiday art camps can be booked by the day — no need to sign up for the whole camp.",
        textTh: "แคมป์ศิลปะช่วงปิดเทอมเลือกลงเป็นรายวันได้ ไม่จำเป็นต้องลงครบทุกวัน",
      },
      {
        text: "Понедельник — выходной; студия работает вт–вс с 10:00 до 18:00.",
        textEn: "Closed on Mondays; open Tue–Sun, 10:00–18:00.",
        textTh: "ปิดวันจันทร์ เปิดอังคาร–อาทิตย์ 10:00–18:00 น.",
      },
      {
        text: "Работы детей студия выставляет: летом 2026 года была групповая выставка учеников в кафе Ordinary Coffee в Северной Паттайе.",
        textEn:
          "The studio exhibits children's work: in summer 2026 there was a group show of students' art at Ordinary Coffee in North Pattaya.",
        textTh:
          "สตูดิโอจัดนิทรรศการผลงานของเด็ก ๆ เช่น นิทรรศการกลุ่มที่ Ordinary Coffee พัทยาเหนือ ช่วงมิถุนายน 2026",
      },
    ],
    categorySlugs: ["art"],
    cover: "/images/activities/one-day-art-studio.jpg",
  },
  // The Pattaya Violin Centre
  {
    slug: "pattaya-violin-centre",
    nameEn: "The Pattaya Violin Centre",
    nameTh: "The Pattaya Violin Centre สอนไวโอลินและเชลโล",
    description:
      "Центр струнных инструментов в комплексе Wonder Space (88/82, East Pattaya): индивидуальные уроки скрипки и виолончели, магазин струнных инструментов и камерные концерты. Руководит австралийский скрипач Graeme Norris — концертмейстер и педагог, ведёт мастер-классы на струнных лагерях в Бангкоке. Среди учеников много детей и подростков: в 2026 году ученики центра взяли золотые призы в детской, юниорской и юношеской категориях конкурса Thailand Strings Competition и Yamaha Thailand International Music Competition, сдают экзамены ABRSM. С января 2027 года центр запускает субботний оркестр для юных струнников Чонбури — открыт для детей из любых школ, с концертом в марте. Занятия ведут на английском. Цены не публикуются — уточняйте. Телефон: 082 083 7606, LINE: @pattayaviolins, Instagram: @pattayaviolins, Facebook: Pattaya Violin-Centre, сайт: mastermusic.asia.",
    descriptionEn:
      "A string instrument centre at Wonder Space (88/82, East Pattaya): private violin and cello lessons, a string instrument shop and chamber concerts. It's run by Australian violinist Graeme Norris, an orchestral leader and teacher who also coaches at string camps in Bangkok. Many students are children and teenagers: in 2026 the centre's students won gold prizes in the kids, junior and youth categories of the Thailand Strings Competition and at the Yamaha Thailand International Music Competition, and they take ABRSM exams. From January 2027 the centre is starting a Saturday orchestra for young string players in Chonburi — open to students from any school, with a concert in March. Lessons are in English. Prices aren't published — please ask. Phone: 082 083 7606, LINE: @pattayaviolins, Instagram: @pattayaviolins, Facebook: Pattaya Violin-Centre, website: mastermusic.asia.",
    descriptionTh:
      "ศูนย์เครื่องสายในโครงการ Wonder Space (88/82 พัทยาฝั่งตะวันออก) สอนไวโอลินและเชลโลแบบตัวต่อตัว มีร้านขายเครื่องสายและจัดคอนเสิร์ตแชมเบอร์ ดูแลโดย Graeme Norris นักไวโอลินชาวออสเตรเลีย หัวหน้าวงออร์เคสตราและครูผู้สอน ซึ่งเป็นโค้ชในค่ายเครื่องสายที่กรุงเทพฯ ด้วย นักเรียนส่วนใหญ่เป็นเด็กและวัยรุ่น ปี 2026 นักเรียนของศูนย์ได้รางวัลเหรียญทองในรุ่นเด็ก รุ่นจูเนียร์ และรุ่นเยาวชน ของ Thailand Strings Competition และ Yamaha Thailand International Music Competition และสอบ ABRSM ตั้งแต่มกราคม 2027 ศูนย์จะเปิดวงออร์เคสตราเยาวชนเครื่องสายในชลบุรีทุกวันเสาร์ เปิดรับนักเรียนจากทุกโรงเรียน มีคอนเสิร์ตในเดือนมีนาคม สอนเป็นภาษาอังกฤษ ไม่ได้ประกาศค่าเรียน กรุณาสอบถาม โทร 082-083-7606 LINE: @pattayaviolins Instagram: @pattayaviolins Facebook: Pattaya Violin-Centre เว็บไซต์ mastermusic.asia",
    tips: [
      {
        text: "С января 2027 года по субботам — оркестр для юных струнников Чонбури, открыт для детей из любых школ; подробности обещают в LINE @pattayaviolins.",
        textEn:
          "From January 2027 there's a Saturday orchestra for young string players in Chonburi, open to children from any school; details will be posted on LINE @pattayaviolins.",
        textTh:
          "ตั้งแต่มกราคม 2027 มีวงออร์เคสตราเยาวชนเครื่องสายทุกวันเสาร์ เปิดรับเด็กจากทุกโรงเรียน ติดตามรายละเอียดทาง LINE @pattayaviolins",
      },
      {
        text: "Ученики готовятся к экзаменам ABRSM и к конкурсам — скажите при записи, если ребёнку это интересно.",
        textEn:
          "Students prepare for ABRSM exams and competitions — mention it when you sign up if your child is interested.",
        textTh: "นักเรียนเตรียมสอบ ABRSM และลงแข่งขัน แจ้งได้ตอนสมัครหากลูกสนใจ",
      },
      {
        text: "Инструмент нужного размера можно подобрать и купить здесь же — при центре работает магазин струнных.",
        textEn:
          "You can choose and buy a correctly sized instrument on site — the centre has a string shop.",
        textTh: "เลือกซื้อเครื่องดนตรีขนาดที่เหมาะกับเด็กได้ที่ศูนย์ มีร้านขายเครื่องสาย",
      },
      {
        text: "Центр устраивает камерные концерты в Cape Dara Resort — хороший повод сводить ребёнка послушать живую классику.",
        textEn:
          "The centre runs chamber concerts at Cape Dara Resort — a good chance to take your child to hear live classical music.",
        textTh:
          "ศูนย์จัดคอนเสิร์ตแชมเบอร์ที่ Cape Dara Resort เป็นโอกาสดีที่จะพาลูกไปฟังดนตรีคลาสสิกสด",
      },
    ],
    categorySlugs: ["music"],
  },
  // Peace Gymnastics
  {
    slug: "peace-gymnastics-pattaya",
    nameEn: "Gymnastics and tumbling at Peace Gymnastics",
    nameTh: "ยิมนาสติก ตีลังกา Peace Gymnastics (ครูหนึ่งยิมนาสติก)",
    description:
      "Peace Gymnastics — небольшой зал гимнастики и акробатики в районе Boonsampan. Занятия ведёт тренер Kru Neung (ครูหนึ่งยิมนาสติก), который преподаёт гимнастику больше 30 лет. Дети учатся кувыркам, сальто и акробатическим элементам на матах и батуте, укрепляют спину и осанку; на фото занятий — небольшие группы детей разного возраста. Занятия проходят по вечерам. Объявления на тайском; возраст, расписание и цены не опубликованы — уточняйте при записи. Записаться можно у Kru Na: телефон 084 348 4285, LINE: line.me/ti/p/SY2rNTBWFA, Facebook: «ยิมนาสติก ตีลังกา» (facebook.com/profile.php?id=61572100268523).",
    descriptionEn:
      "Peace Gymnastics is a small gymnastics and tumbling gym in the Boonsampan area. Classes are led by coach Kru Neung (ครูหนึ่งยิมนาสติก), who has taught gymnastics for more than 30 years. Children learn rolls, flips and acrobatic elements on mats and a trampoline, and work on back strength and posture; class photos show small groups of children of different ages. Lessons are held in the evenings. Announcements are in Thai; ages, timetable and prices aren't published, so please ask when signing up. To enrol, contact Kru Na: phone 084 348 4285, LINE: line.me/ti/p/SY2rNTBWFA, Facebook: «ยิมนาสติก ตีลังกา» (facebook.com/profile.php?id=61572100268523).",
    descriptionTh:
      "Peace Gymnastics ยิมนาสติกและตีลังกา ย่านบุญสัมพันธ์ ควบคุมการสอนโดยครูหนึ่งยิมนาสติก ผู้เชี่ยวชาญการสอนยิมนาสติกประสบการณ์มากกว่า 30 ปี ฝึกตีลังกา แทรมโพลีน แก้ไขร่างกาย เสริมสมาธิและความมั่นใจ เรียนง่าย เป็นไว ปลอดภัย รับสอนช่วงเย็น อายุผู้เรียน ตารางเรียน และค่าเรียน กรุณาสอบถามตอนสมัคร สนใจสอบถาม/สมัครเรียน ครูนา โทร 084 348 4285, LINE: line.me/ti/p/SY2rNTBWFA, Facebook: ยิมนาสติก ตีลังกา",
    tips: [
      {
        text: "Занятия — по вечерам: днём тренер занят, а вечером набор открыт (по посту от ноября 2026).",
        textEn:
          "Lessons are in the evenings — the coach is busy during the day, but evening classes are open (per a November 2026 post).",
        textTh: "เรียนช่วงเย็น (ตามโพสต์เดือนพฤศจิกายน 2026)",
      },
      {
        text: "Записывают через Kru Na: 084 348 4285 или LINE.",
        textEn: "Sign up through Kru Na: 084 348 4285 or LINE.",
        textTh: "สมัครเรียนติดต่อครูนา โทร 084 348 4285 หรือ LINE",
      },
      {
        text: "Посмотреть, как проходят занятия, можно заранее на YouTube-канале тренера (@peaceneeddo9696).",
        textEn:
          "You can see what classes look like beforehand on the coach's YouTube channel (@peaceneeddo9696).",
        textTh: "ดูคลิปการสอนได้ทาง YouTube @peaceneeddo9696",
      },
    ],
    categorySlugs: ["gymnastics"],
    cover: "/images/activities/peace-gymnastics-pattaya.jpg",
  },
  // Pesuso Martial Arts Academy — тхэквондо (Lotus North)
  {
    slug: "pesuso-taekwondo-lotus-north",
    nameEn: "Taekwondo at Pesuso Martial Arts Academy (Lotus North)",
    nameTh: "เทควันโด PESUSO ที่โลตัสพัทยาเหนือ",
    description:
      "Pesuso Martial Arts Academy — школа тхэквондо в отдельном зале на втором этаже Lotus's North Pattaya. Ведёт мастер Джо (Master Joe): более 27 лет тренерского опыта, 6-й дан Kukkiwon, 8-й дан Jidokwan, 7-й дан WPTF, инструктор Kukkiwon второго класса. Детей берут с 2 лет; занятия по возрасту и уровню — отдельные группы для младших и старших детей и группа спортсменов для тех, кто готовится к соревнованиям. Акцент — на безопасность, дисциплину, концентрацию и уверенность в себе. Группы идут с понедельника по четверг днём и вечером и по выходным с утра — см. таблицу ниже. Школа проводит аттестации на цветные и чёрные пояса и выступает с показательными номерами. Занятия на тайском; цены не опубликованы — уточняйте. Телефон: 083 517 1980, LINE: siamtkd80, Facebook: facebook.com/pesusotkd, сайт: pesuso.com.",
    descriptionEn:
      "Pesuso Martial Arts Academy is a taekwondo school with its own hall on the second floor of Lotus's North Pattaya. It's led by Master Joe, who has over 27 years of coaching experience and holds 6th dan Kukkiwon, 8th dan Jidokwan and 7th dan WPTF, and is a Kukkiwon Class 2 instructor. Children are accepted from age 2; classes are split by age and level — separate groups for younger and older children, plus an athletes' group for those training for competitions. The focus is on safety, discipline, concentration and confidence. Groups run Monday to Thursday in the afternoon and evening and at weekends in the morning — see the table below. The school holds colour- and black-belt gradings and gives demonstration performances. Lessons are in Thai; prices aren't published — please ask. Phone: 083 517 1980, LINE: siamtkd80, Facebook: facebook.com/pesusotkd, website: pesuso.com.",
    descriptionTh:
      "PESUSO Martial Arts Academy โรงเรียนเทควันโดในห้องฝึกชั้น 2 ห้างโลตัสพัทยาเหนือ สอนโดยอาจารย์โจ (Master Joe) ประสบการณ์สอนกว่า 27 ปี สายดำดั้ง 6 KUKKIWON ดั้ง 8 JIDOKWAN ดั้ง 7 WPTF และผู้ฝึกสอน KUKKIWON Class 2 รับนักเรียนตั้งแต่อายุ 2 ขวบขึ้นไป ฝึกตามวัยและระดับความสามารถ แบ่งเป็นรอบเด็กเล็ก รอบเด็กโต และรอบนักกีฬาสำหรับผู้ที่เตรียมแข่งขัน เน้นความสนุก ความปลอดภัย ระเบียบวินัย สมาธิ และความมั่นใจ เรียนวันจันทร์–พฤหัสบดีช่วงบ่ายและเย็น และวันเสาร์–อาทิตย์ช่วงเช้า ดูตารางด้านล่าง มีการสอบเลื่อนสายสีและสายดำ และการแสดงโชว์เทควันโด สอนเป็นภาษาไทย ไม่ได้ประกาศค่าเรียน กรุณาสอบถาม โทร 083-517-1980 LINE ID: siamtkd80 Facebook: facebook.com/pesusotkd เว็บไซต์ pesuso.com",
    tips: [
      {
        text: "Зал — на втором этаже Lotus's North Pattaya: удобно совместить тренировку с покупками.",
        textEn:
          "The hall is on the second floor of Lotus's North Pattaya, so training is easy to combine with shopping.",
        textTh: "ห้องฝึกอยู่ชั้น 2 ห้างโลตัสพัทยาเหนือ มาเรียนแล้วซื้อของต่อได้สะดวก",
      },
      {
        text: "Берут малышей с 2 лет — для них отдельная группа «เด็กเล็ก» (по посту школы от 10.11.2026).",
        textEn:
          "Toddlers are taken from age 2, with a separate little kids' group (per the school's post of 10.11.2026).",
        textTh:
          "รับเด็กตั้งแต่ 2 ขวบ มีรอบเด็กเล็กแยกต่างหาก (ตามโพสต์ของโรงเรียน 10.11.2026)",
      },
      {
        text: "Кимоно, пояс и защиту можно купить в школе: по сайту белый добок — 1 200 ฿, пояс — 120 ฿, шлем — 650 ฿.",
        textEn:
          "Uniform, belt and protective gear can be bought at the school: per the website a white dobok is 1,200 ฿, a belt 120 ฿, a helmet 650 ฿.",
        textTh:
          "ซื้อชุด สาย และอุปกรณ์ป้องกันได้ที่โรงเรียน ตามเว็บไซต์ ชุดขาว 1,200 บาท สาย 120 บาท หมวก 650 บาท",
      },
      {
        text: "Свободные места в группах отмечены в расписании на сайте pesuso.com (вкладка «โลตัสพัทยาเหนือ»).",
        textEn:
          "Free spots in each group are shown in the timetable on pesuso.com (the 'โลตัสพัทยาเหนือ' tab).",
        textTh: "ดูที่ว่างของแต่ละรอบได้ในตารางเรียนบน pesuso.com (แท็บ โลตัสพัทยาเหนือ)",
      },
    ],
    minAgeMonths: 24,
    classes: [
      {
        name: "Младшие дети, Пн–Чт",
        nameEn: "Younger kids, Mon–Thu",
        nameTh: "เด็กเล็ก จันทร์–พฤหัส",
        ageLabel: "младшие дети",
        ageLabelEn: "younger kids",
        ageLabelTh: "เด็กเล็ก",
        minAgeMonths: 24,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "14:00–15:00 · 17:00–18:00",
        scheduleEn: "14:00–15:00 · 17:00–18:00",
        scheduleTh: "14:00–15:00 · 17:00–18:00",
      },
      {
        name: "Младшие дети, Сб–Вс",
        nameEn: "Younger kids, Sat–Sun",
        nameTh: "เด็กเล็ก เสาร์–อาทิตย์",
        ageLabel: "младшие дети",
        ageLabelEn: "younger kids",
        ageLabelTh: "เด็กเล็ก",
        minAgeMonths: 24,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "10:00–11:00 · 11:00–12:00 · 12:00–13:00",
        scheduleEn: "10:00–11:00 · 11:00–12:00 · 12:00–13:00",
        scheduleTh: "10:00–11:00 · 11:00–12:00 · 12:00–13:00",
      },
      {
        name: "Старшие дети, Пн–Чт",
        nameEn: "Older kids, Mon–Thu",
        nameTh: "เด็กโต จันทร์–พฤหัส",
        ageLabel: "старшие дети",
        ageLabelEn: "older kids",
        ageLabelTh: "เด็กโต",
        minAgeMonths: 24,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "17:00–18:00 · 18:00–19:00",
        scheduleEn: "17:00–18:00 · 18:00–19:00",
        scheduleTh: "17:00–18:00 · 18:00–19:00",
      },
      {
        name: "Старшие дети, Сб–Вс",
        nameEn: "Older kids, Sat–Sun",
        nameTh: "เด็กโต เสาร์–อาทิตย์",
        ageLabel: "старшие дети",
        ageLabelEn: "older kids",
        ageLabelTh: "เด็กโต",
        minAgeMonths: 24,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "11:00–12:00 · 12:00–13:00",
        scheduleEn: "11:00–12:00 · 12:00–13:00",
        scheduleTh: "11:00–12:00 · 12:00–13:00",
      },
      {
        name: "Спортсмены",
        nameEn: "Athletes",
        nameTh: "นักกีฬา",
        ageLabel: "соревновательная группа",
        ageLabelEn: "competition group",
        ageLabelTh: "รอบนักกีฬา",
        minAgeMonths: 24,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "Пн–Чт 19:00–20:00 · Сб–Вс 13:00–15:00",
        scheduleEn: "Mon–Thu 19:00–20:00 · Sat–Sun 13:00–15:00",
        scheduleTh: "จ.–พฤ. 19:00–20:00 · ส.–อา. 13:00–15:00",
      },
    ],
    categorySlugs: ["martial-arts"],
  },
  // Petchrungruang Gym — муай-тай
  {
    slug: "petchrungruang-gym",
    nameEn: "Petchrungruang Gym — Muay Thai",
    nameTh: "ค่ายมวยเพชรรุ่งเรือง (Petchrungruang Gym)",
    description:
      "Семейный зал муай-тай, основанный в 1986 году, — один из старейших в Паттайе; стоит в жилом переулке Soi Sukhumvit-Pattaya 50. Это не туристический лагерь: здесь каждый день тренируются местные тайские дети — после школы, в дневной группе, — а самые опытные выходят на детские бои. Взрослые и приезжие занимаются в утренних и дневных группах, есть индивидуальные тренировки с тренерами зала, в том числе для детей. Посты на английском, тренеры — тайцы. Расписание и цену для ребёнка уточняйте в сообщениях страницы или по телефону. Телефон: 082 211 6100, Facebook: «Boxing Pattaya - Petchrungruang Gym», Instagram: @petchroungruanggym, e-mail: petchrungruanggym@gmail.com.",
    descriptionEn:
      "A family Muay Thai gym founded in 1986 — one of the oldest in Pattaya — on a residential lane, Soi Sukhumvit-Pattaya 50. It isn't a tourist camp: local Thai children train here every day, after school in the afternoon group, and the more experienced ones take part in kids' fights. Adults and visitors train in morning and afternoon groups, and there are private sessions with the gym's trainers, including for children. Posts are in English; the trainers are Thai. Ask about the schedule and price for a child via page messages or by phone. Phone: 082 211 6100, Facebook: “Boxing Pattaya - Petchrungruang Gym”, Instagram: @petchroungruanggym, email: petchrungruanggym@gmail.com.",
    descriptionTh:
      "ค่ายมวยเพชรรุ่งเรือง ค่ายมวยไทยแบบครอบครัว ก่อตั้งปี 2529 เป็นหนึ่งในค่ายที่เก่าแก่ที่สุดในพัทยา ตั้งอยู่ในซอยสุขุมวิท-พัทยา 50 ไม่ใช่ค่ายสำหรับนักท่องเที่ยว เด็กไทยในพื้นที่มาซ้อมทุกวันหลังเลิกเรียนในรอบบ่าย และเด็กที่มีประสบการณ์ได้ขึ้นชกในรายการเด็ก ผู้ใหญ่และชาวต่างชาติซ้อมได้ทั้งรอบเช้าและรอบบ่าย มีคลาสส่วนตัวกับครูในค่าย รวมถึงสำหรับเด็ก โพสต์เป็นภาษาอังกฤษ ครูผู้สอนเป็นคนไทย สอบถามตารางและค่าเรียนสำหรับเด็กทางข้อความเพจหรือโทรศัพท์ โทร 082 211 6100 Facebook: Boxing Pattaya - Petchrungruang Gym Instagram: @petchroungruanggym อีเมล petchrungruanggym@gmail.com",
    tips: [
      {
        text: "Дети тренируются после школы, в дневной группе — это лучшее время, чтобы прийти посмотреть.",
        textEn:
          "Children train after school in the afternoon group — the best time to come and have a look.",
        textTh: "เด็ก ๆ ซ้อมหลังเลิกเรียนในรอบบ่าย เป็นช่วงเวลาที่เหมาะจะมาดูบรรยากาศ",
      },
      {
        text: "Для детей есть индивидуальные тренировки с тренером (пост февраля 2026); индивидуальные занятия бронируют заранее.",
        textEn:
          "Private sessions with a trainer are available for children (February 2026 post); book private sessions in advance.",
        textTh:
          "มีคลาสส่วนตัวสำหรับเด็กกับครู (โพสต์เดือนกุมภาพันธ์ 2569) ควรจองล่วงหน้า",
      },
      {
        text: "В воскресенье зал закрыт (по закреплённому посту страницы).",
        textEn: "The gym is closed on Sundays (per the page's pinned post).",
        textTh: "ค่ายปิดวันอาทิตย์ (ตามโพสต์ปักหมุดของเพจ)",
      },
    ],
    categorySlugs: ["martial-arts"],
  },
  // Phasook Playgroup
  {
    slug: "phasook-playgroup",
    nameEn: "Phasook Playgroup (Phasook House)",
    nameTh: "บ้านพาสุข พัทยา Phasook Playgroup",
    description:
      "Phasook House (บ้านพาสุข) в Нонг Прыэ — маленький сад-плейгруппа с природным подходом и элементами Монтессори: дети рисуют и мастерят, сами готовят, ухаживают за садом и огородом, свободно играют на улице — в любую погоду, с землёй, листьями и лужами. Форматы: по будням полный день для детей 2–6 лет (9:30–15:30, с обедом и перекусами), воскресный клуб «Happy Sunday» для 3–7 лет (9:30–13:30, темы меняются: Монтессори, рисование, музыка и движение, природа, бытовые навыки, праздники) и группа для малышей вместе с родителем по понедельникам и средам (10:00–11:30). Группы маленькие. Будний сад — 10 000 ฿ в месяц плюс регистрационный взнос; пробный день — 1 350 ฿, засчитывается при записи. Стоимость воскресного клуба и малышовой группы уточняйте. Телефон: 080 804 7679, Facebook: Phasook Playgroup — บ้านพาสุข พัทยา.",
    descriptionEn:
      'Phasook House (บ้านพาสุข) in Nong Prue is a small nature-based playgroup and nursery with Montessori elements: children paint and make things, cook for themselves, help in the garden and play freely outdoors in all weather — with soil, leaves and puddles. Formats: weekday full days for ages 2–6 (9:30–15:30, lunch and snacks included), a "Happy Sunday" club for ages 3–7 (9:30–13:30, rotating themes: Montessori, art, music and movement, nature, life skills, festivals), and a toddler group with a parent on Mondays and Wednesdays (10:00–11:30). Groups are small. The weekday nursery is 10,000 ฿ a month plus a registration fee; a trial day costs 1,350 ฿ and is credited if you enrol. Ask about prices for the Sunday club and toddler group. Phone: 080 804 7679, Facebook: Phasook Playgroup — บ้านพาสุข พัทยา.',
    descriptionTh:
      "บ้านพาสุข พัทยา ย่านหนองปรือ เพลย์กรุ๊ปและเนอสเซอรีขนาดเล็ก แนวทางธรรมชาติผสมมอนเตสซอรี เด็ก ๆ ได้ทำศิลปะ ทำอาหารเอง ดูแลสวนและแปลงผัก และเล่นอิสระกลางแจ้งในทุกสภาพอากาศ รูปแบบกิจกรรม: วันจันทร์–ศุกร์ เต็มวันสำหรับเด็ก 2–6 ปี (09.30–15.30 น. รวมอาหารกลางวันและอาหารว่าง) วันอาทิตย์สุขสันต์ Happy Sunday สำหรับเด็ก 3–7 ปี (09.30–13.30 น. กิจกรรมหมุนเวียนตามธีม เช่น มอนเตสซอรี ศิลปะ ดนตรีและการเคลื่อนไหว ธรรมชาติ ทักษะชีวิต กิจกรรมตามเทศกาล) และกลุ่มเด็กเตาะแตะพร้อมผู้ปกครอง วันจันทร์และวันพุธ (10.00–11.30 น.) กลุ่มเล็ก ดูแลใกล้ชิด ค่าเรียนวันธรรมดา 10,000 บาท/เดือน มีค่าลงทะเบียน ทดลองเรียน 1 วัน 1,350 บาท หักเป็นค่าเรียนได้เมื่อสมัคร ค่าเรียนวันอาทิตย์และกลุ่มเด็กเตาะแตะกรุณาสอบถาม โทร 080-804-7679 Facebook: Phasook Playgroup - บ้านพาสุข พัทยา",
    tips: [
      {
        text: "Пробный день стоит 1 350 ฿ — эта сумма засчитывается в оплату, если ребёнок остаётся.",
        textEn:
          "A trial day costs 1,350 ฿ — it's credited towards fees if your child enrols.",
        textTh: "ทดลองเรียน 1 วัน 1,350 บาท หักเป็นค่าเรียนได้เมื่อสมัคร",
      },
      {
        text: "Перед записью в будний сад предлагают частный день открытых дверей — посмотреть место и оценить готовность ребёнка.",
        textEn:
          "Before enrolling in the weekday nursery you can book a private open house to see the place and assess your child's readiness.",
        textTh:
          "ก่อนสมัครนัด Private Open House เพื่อเยี่ยมชมและประเมินความพร้อมของลูกได้",
      },
      {
        text: "Принимают круглый год, можно начать посреди семестра.",
        textEn: "Enrolment is open all year — children can start mid-term.",
        textTh: "รับสมัครตลอดปี เริ่มเรียนกลางเทอมได้",
      },
      {
        text: "Дети много времени проводят на улице, в том числе после дождя, — одежда, которую не жалко испачкать, и запасной комплект пригодятся.",
        textEn:
          "Children spend lots of time outdoors, including after rain — clothes that can get dirty and a spare set are a good idea.",
        textTh:
          "เด็ก ๆ ใช้เวลากลางแจ้งมาก รวมถึงหลังฝนตก ควรเตรียมเสื้อผ้าที่เปื้อนได้และชุดสำรอง",
      },
      {
        text: "Мероприятия на месяц публикуют календарём — занятие выбираете по календарю и бронируете сообщением в Facebook.",
        textEn:
          "Monthly activities are posted as a calendar — pick one and book by Facebook message.",
        textTh: "เพจลงปฏิทินกิจกรรมประจำเดือน เลือกกิจกรรมแล้วทักจองทางข้อความได้",
      },
    ],
    minAgeMonths: 24,
    maxAgeMonths: 84,
    price: 10000,
    priceUnit: "/ месяц",
    priceUnitEn: "/ month",
    priceUnitTh: "/ เดือน",
    classes: [
      {
        name: "Пн–Пт, сад",
        nameEn: "Mon–Fri, nursery",
        nameTh: "จันทร์–ศุกร์ เนอสเซอรี",
        ageLabel: "2–6 лет",
        ageLabelEn: "2–6 years",
        ageLabelTh: "2–6 ปี",
        minAgeMonths: 24,
        maxAgeMonths: 72,
        parentRequired: false,
        schedule: "9:30–15:30",
        scheduleEn: "9:30–15:30",
        scheduleTh: "9:30–15:30",
      },
      {
        name: "Вс, Happy Sunday",
        nameEn: "Sun, Happy Sunday",
        nameTh: "อาทิตย์ Happy Sunday",
        ageLabel: "3–7 лет",
        ageLabelEn: "3–7 years",
        ageLabelTh: "3–7 ปี",
        minAgeMonths: 36,
        maxAgeMonths: 84,
        parentRequired: false,
        schedule: "9:30–13:30",
        scheduleEn: "9:30–13:30",
        scheduleTh: "9:30–13:30",
      },
      {
        name: "Пн и Ср, малыши с родителем",
        nameEn: "Mon & Wed, toddlers with a parent",
        nameTh: "จันทร์และพุธ เด็กเตาะแตะพร้อมผู้ปกครอง",
        ageLabel: "малыши",
        ageLabelEn: "toddlers",
        ageLabelTh: "เด็กเตาะแตะ",
        minAgeMonths: 24,
        maxAgeMonths: 84,
        parentRequired: true,
        schedule: "10:00–11:30",
        scheduleEn: "10:00–11:30",
        scheduleTh: "10:00–11:30",
      },
    ],
    categorySlugs: ["early-development"],
  },
  // Pimsorn Baan Phasa
  {
    slug: "pimsorn-baan-phasa",
    nameEn: "Pimsorn Baan Phasa Language School",
    nameTh: "Pimsorn - บ้านภาษา",
    description:
      "Небольшая языковая школа (เรียนพิเศษ) в Нонг Прыэ, в начале Soi Siam Country Club. Учат английскому и тайскому с нуля до уверенного чтения и общения, есть и математика; для младших — курс фоники: чтение, правописание, словарь и письмо по правилам грамматики, многое через игры. Группы маленькие, 3–6 детей, перед стартом уровень каждого ребёнка проверяют. Для старших — подтягивание оценок, подготовка к экзаменам TGAT и A-level, к собеседованию на студенческую визу и помощь с планом поступления. Страница и объявления — на тайском. Цены не опубликованы — уточняйте. Телефон: 082 778 5855, Facebook: «Pimsorn - บ้านภาษา» (Pimsorn301).",
    descriptionEn:
      "A small tutoring school (เรียนพิเศษ) in Nong Prue, at the entrance to Soi Siam Country Club. It teaches English and Thai from zero to confident reading and communication, and maths as well; younger children can take a phonics course covering reading, spelling, vocabulary and grammar-based writing, much of it through games. Groups are small, 3–6 children, and each child's level is assessed before starting. For older students there's grade support, TGAT and A-level exam prep, student visa interview coaching and help with university planning. The page and announcements are in Thai. Prices are not published — please ask. Phone: 082 778 5855, Facebook: \"Pimsorn - บ้านภาษา\" (Pimsorn301).",
    descriptionTh:
      "Pimsorn - บ้านภาษา โรงเรียนสอนพิเศษขนาดเล็กในหนองปรือ ปากซอยสยามคันทรีคลับ สอนภาษาอังกฤษและภาษาไทยตั้งแต่ไม่มีพื้นฐานจนอ่านออกและสื่อสารได้ และสอนคณิตศาสตร์ด้วย สำหรับเด็กเล็กมีคอร์ส Phonics ฝึกอ่าน ฝึกสะกด เสริมคำศัพท์ และเขียนตามหลักไวยากรณ์ เรียนผ่านเกมและกิจกรรม เรียนกลุ่มเล็ก 3–6 คน มีวัดระดับก่อนเรียน สำหรับนักเรียนโตมีติวเพิ่มเกรด ติวสอบ TGAT และ A-level ติวสัมภาษณ์วีซ่าเรียนต่อ และวางแผนเข้ามหาวิทยาลัย ค่าเรียนไม่ได้ประกาศไว้ กรุณาสอบถาม โทร 082 778 5855 Facebook: Pimsorn - บ้านภาษา",
    tips: [
      {
        text: "Группы по 3–6 детей, перед началом проверяют уровень ребёнка.",
        textEn: "Groups of 3–6 children; each child's level is checked before starting.",
        textTh: "เรียนกลุ่มละ 3–6 คน มีวัดระดับก่อนเริ่มเรียน",
      },
      {
        text: "Ориентир — начало Soi Siam Country Club в Нонг Прыэ.",
        textEn: "Landmark: the entrance to Soi Siam Country Club in Nong Prue.",
        textTh: "จุดสังเกต: ปากซอยสยามคันทรีคลับ หนองปรือ",
      },
      {
        text: "Школа ориентирована на детей из тайских школ: все объявления на тайском; если ребёнок не говорит по-тайски, спросите заранее, как проходит урок английского.",
        textEn:
          "The school is geared to children at Thai schools — all announcements are in Thai; if your child doesn't speak Thai, ask in advance how the English lessons work.",
        textTh:
          "ประกาศทั้งหมดเป็นภาษาไทย หากเด็กไม่พูดภาษาไทย ควรสอบถามรูปแบบการสอนล่วงหน้า",
      },
      {
        text: "По отзывам на Facebook школу рекомендуют все 12 оставивших оценку.",
        textEn: "On Facebook, all 12 people who left a rating recommend the school.",
        textTh: "บน Facebook ผู้รีวิวทั้ง 12 คนแนะนำโรงเรียนนี้",
      },
    ],
    categorySlugs: ["languages"],
    cover: "/images/activities/pimsorn-baan-phasa.jpg",
  },
  // Planet Football Pattaya
  {
    slug: "planet-football-pattaya",
    nameEn: "Kids' football at Planet Football",
    nameTh: "ฟุตบอลเด็กที่ Planet Football",
    description:
      "Planet Football — спортивный комплекс со стадионом и спортзалом на Soi Siam Country Club, в восточной части Паттайи, вдали от шумного центра и с просторной парковкой; футбольные занятия для детей здесь ведут с 2009 года. Тренеры с лицензиями UEFA и AFC, группы по возрасту и уровню. По субботам утром в спортзале идут занятия для начинающих: Mini Kicks (4–6 лет, родителей часто зовут поучаствовать), Kiddy Kickers (7–9 лет) и Soccer School (10–13 лет) — 400 ฿ за занятие. Для тех, кто хочет играть за команду, есть Development Programme (7–10 и 11–15 лет) — тренировки по субботам, воскресеньям и понедельникам и матчи с соперниками своего уровня, 2 500 ฿ в месяц плюс годовой взнос 2 500 ฿ (три комплекта формы и мяч). В каникулы проводят дневные лагеря, здесь же можно устроить детский день рождения. Цены — по сайту клуба, уточняйте. Телефон: 038 248 212, 063 852 9295, email: info@pattayafootball.com, Facebook: facebook.com/pattayafootball, Instagram: @planetfootballpattaya, сайт: pattayafootball.com.",
    descriptionEn:
      "Planet Football is a sports complex with a stadium and sports hall on Soi Siam Country Club in East Pattaya, away from the busy centre and with plenty of parking; it has run kids' football here since 2009. Coaches hold UEFA and AFC licences, and groups are split by age and ability. On Saturday mornings the sports hall hosts beginners' sessions: Mini Kicks (ages 4–6, parents are often invited to join in), Kiddy Kickers (7–9) and Soccer School (10–13) — 400 ฿ per session. For players who want to join a team there's the Development Programme (ages 7–10 and 11–15), training on Saturdays, Sundays and Mondays with matches against similar-level opponents, 2,500 ฿ a month plus a 2,500 ฿ yearly membership (three kits and a ball). Day camps run in the school holidays, and you can hold a children's birthday party here. Prices from the club's website — please confirm. Phone: 038 248 212, 063 852 9295, email: info@pattayafootball.com, Facebook: facebook.com/pattayafootball, Instagram: @planetfootballpattaya, website: pattayafootball.com.",
    descriptionTh:
      "Planet Football ศูนย์กีฬาที่มีทั้งสนามฟุตบอลและโรงยิม ในซอยสยามคันทรีคลับ พัทยาตะวันออก ห่างจากใจกลางเมืองและมีที่จอดรถกว้างขวาง เปิดสอนฟุตบอลเด็กมาตั้งแต่ปี 2009 โค้ชมีไลเซนส์ UEFA และ AFC แบ่งกลุ่มตามอายุและระดับความสามารถ ทุกเช้าวันเสาร์มีคลาสสำหรับมือใหม่ในโรงยิม ได้แก่ Mini Kicks (4–6 ปี มักชวนผู้ปกครองร่วมกิจกรรมด้วย) Kiddy Kickers (7–9 ปี) และ Soccer School (10–13 ปี) ครั้งละ 400 บาท สำหรับเด็กที่อยากเล่นเป็นทีมมี Development Programme (7–10 ปี และ 11–15 ปี) ฝึกวันเสาร์ อาทิตย์ และจันทร์ พร้อมแข่งกับทีมระดับใกล้เคียงกัน ค่าเรียน 2,500 บาทต่อเดือน และค่าสมาชิกรายปี 2,500 บาท (ได้ชุด 3 ชุดและลูกฟุตบอล) ช่วงปิดเทอมมีแคมป์รายวัน และจัดงานวันเกิดเด็กได้ ราคาตามเว็บไซต์ กรุณาสอบถามอีกครั้ง โทร 038 248 212, 063 852 9295 อีเมล info@pattayafootball.com Facebook: facebook.com/pattayafootball Instagram: @planetfootballpattaya เว็บไซต์ pattayafootball.com",
    tips: [
      {
        text: "На субботние занятия нужны гетры, щитки и бутсы (для Mini Kicks — кроссовки или футзалки: занятие в зале); возьмите сумку с полотенцем и бутылкой воды.",
        textEn:
          "For Saturday sessions bring long socks, shin pads and boots (trainers or futsal shoes for Mini Kicks, which is indoors), plus a bag with a towel and water bottle.",
        textTh:
          "คลาสวันเสาร์ต้องใส่ถุงเท้ายาว สนับแข้ง และรองเท้าสตั๊ด (Mini Kicks ใช้รองเท้าผ้าใบหรือรองเท้าฟุตซอลเพราะเรียนในโรงยิม) และเตรียมกระเป๋าใส่ผ้าขนหนูกับขวดน้ำ",
      },
      {
        text: "Первое занятие можно прийти попробовать, а после него ребёнка регистрируют как члена клуба — на занятиях нужна форма Planet Football Soccer School.",
        textEn:
          "You can try the first session, after which children register as club members — the Planet Football Soccer School kit is worn at sessions.",
        textTh:
          "มาลองเรียนครั้งแรกได้ หลังจากนั้นต้องสมัครเป็นสมาชิก และใส่ชุด Planet Football Soccer School ทุกครั้งที่มาเรียน",
      },
      {
        text: "Рождественский лагерь 14–18 декабря 2026 для детей 7–10 и 11–15 лет, 9:00–15:00, с обедом и поездкой: 8 500 ฿, при оплате до 5 декабря — 7 500 ฿; запись только по email john@pattayafootball.com.",
        textEn:
          "Christmas camp 14–18 December 2026 for ages 7–10 and 11–15, 9:00–15:00, with lunch and a day out: 8,500 ฿, or 7,500 ฿ if paid by 5 December; register by email only at john@pattayafootball.com.",
        textTh:
          "แคมป์คริสต์มาส 14–18 ธันวาคม 2026 สำหรับเด็ก 7–10 และ 11–15 ปี เวลา 9:00–15:00 น. มีอาหารกลางวันและพาเที่ยวนอกสถานที่ ราคา 8,500 บาท ชำระก่อน 5 ธันวาคม 7,500 บาท สมัครทางอีเมล john@pattayafootball.com เท่านั้น",
      },
      {
        text: "Комплекс за городом, в стороне от центра, с большой парковкой — удобно приезжать на машине.",
        textEn:
          "The complex is outside the busy centre with a large car park — easy to reach by car.",
        textTh: "สนามอยู่นอกตัวเมือง มีที่จอดรถกว้าง สะดวกสำหรับผู้ที่ขับรถมา",
      },
    ],
    minAgeMonths: 48,
    maxAgeMonths: 191,
    price: 400,
    priceUnit: "/ занятие",
    priceUnitEn: "/ session",
    priceUnitTh: "/ ครั้ง",
    classes: [
      {
        name: "Mini Kicks — Сб",
        nameEn: "Mini Kicks — Sat",
        nameTh: "Mini Kicks — เสาร์",
        ageLabel: "4–6 лет",
        ageLabelEn: "4–6 years",
        ageLabelTh: "4–6 ปี",
        minAgeMonths: 48,
        maxAgeMonths: 83,
        parentRequired: null,
        schedule: "9:00–10:30",
        scheduleEn: "9:00–10:30",
        scheduleTh: "9:00–10:30",
      },
      {
        name: "Kiddy Kickers — Сб",
        nameEn: "Kiddy Kickers — Sat",
        nameTh: "Kiddy Kickers — เสาร์",
        ageLabel: "7–9 лет",
        ageLabelEn: "7–9 years",
        ageLabelTh: "7–9 ปี",
        minAgeMonths: 84,
        maxAgeMonths: 119,
        parentRequired: null,
        schedule: "9:00–10:30",
        scheduleEn: "9:00–10:30",
        scheduleTh: "9:00–10:30",
      },
      {
        name: "Soccer School — Сб",
        nameEn: "Soccer School — Sat",
        nameTh: "Soccer School — เสาร์",
        ageLabel: "10–13 лет",
        ageLabelEn: "10–13 years",
        ageLabelTh: "10–13 ปี",
        minAgeMonths: 120,
        maxAgeMonths: 167,
        parentRequired: null,
        schedule: "9:00–10:30",
        scheduleEn: "9:00–10:30",
        scheduleTh: "9:00–10:30",
      },
      {
        name: "Development, Сб и Вс",
        nameEn: "Development, Sat & Sun",
        nameTh: "Development เสาร์–อาทิตย์",
        ageLabel: "7–10 лет",
        ageLabelEn: "7–10 years",
        ageLabelTh: "7–10 ปี",
        minAgeMonths: 84,
        maxAgeMonths: 131,
        parentRequired: null,
        schedule: "15:30–17:00",
        scheduleEn: "15:30–17:00",
        scheduleTh: "15:30–17:00",
      },
      {
        name: "Development, Сб и Вс",
        nameEn: "Development, Sat & Sun",
        nameTh: "Development เสาร์–อาทิตย์",
        ageLabel: "11–15 лет",
        ageLabelEn: "11–15 years",
        ageLabelTh: "11–15 ปี",
        minAgeMonths: 132,
        maxAgeMonths: 191,
        parentRequired: null,
        schedule: "13:30–15:00",
        scheduleEn: "13:30–15:00",
        scheduleTh: "13:30–15:00",
      },
      {
        name: "Development, Пн",
        nameEn: "Development, Mon",
        nameTh: "Development จันทร์",
        ageLabel: "7–15 лет",
        ageLabelEn: "7–15 years",
        ageLabelTh: "7–15 ปี",
        minAgeMonths: 84,
        maxAgeMonths: 191,
        parentRequired: null,
        schedule: "17:30–19:00",
        scheduleEn: "17:30–19:00",
        scheduleTh: "17:30–19:00",
      },
    ],
    categorySlugs: ["sport"],
  },
  // Playtune Music Studio
  {
    slug: "playtune-music-studio",
    nameEn: "Playtune Music Studio Pattaya",
    nameTh: "Playtune Music Studio Pattaya",
    description:
      "Детская музыкальная студия в Хуай Яй (Soi Khao Makok 9), открылась в октябре 2025 года. Основательница — преподаватель фортепиано Kru Namhom; занятия строятся на методиках Орфа и Кодая: дети учатся через пение, движение и ритм. Для самых маленьких — Kindermusik: студия официально входит в сеть Kindermusik Thailand, где группы делятся на уровни от рождения до 5 лет. Для детей постарше — фортепиано, вокал, гитара, барабаны и танцы; ученики выступают на конкурсах (в 2026 году — золото и серебро на Thailand International Music Competition) и на ежегодном отчётном концерте. Бывают творческие мастер-классы и семейные праздники. Пробное занятие — по записи. Цены не публикуются — уточняйте. Телефон: 096 935 4495, LINE: @playtunemusic, Facebook: Playtune Music Studio Pattaya, Instagram: @playtunemusic_pattaya, сайт: playtune-musicstudio.com.",
    descriptionEn:
      "A children's music studio in Huay Yai (Soi Khao Makok 9) that opened in October 2025. It was founded by piano teacher Kru Namhom, and lessons follow the Orff and Kodály approaches: children learn through singing, movement and rhythm. For the youngest there is Kindermusik — the studio is an official Kindermusik Thailand location, where groups run in levels from birth to age 5. Older children can take piano, singing, guitar, drums and dance; students perform at competitions (in 2026, gold and silver at the Thailand International Music Competition) and at the annual student showcase. The studio also runs art workshops and family events. Trial lessons are by appointment. Prices aren't published — please ask. Phone: 096 935 4495, LINE: @playtunemusic, Facebook: Playtune Music Studio Pattaya, Instagram: @playtunemusic_pattaya, website: playtune-musicstudio.com.",
    descriptionTh:
      "สตูดิโอดนตรีสำหรับเด็กในห้วยใหญ่ (ซอยเขามะกอก 9) เปิดเมื่อตุลาคม 2568 ก่อตั้งโดยครูน้ำหอม ครูสอนเปียโน การสอนอิงแนวทาง Orff และ Kodály ให้เด็กเรียนรู้ผ่านการร้องเพลง การเคลื่อนไหว และจังหวะ สำหรับเด็กเล็กมีคลาส Kindermusik โดยสตูดิโอเป็นสาขาทางการของ Kindermusik Thailand ซึ่งแบ่งระดับตั้งแต่แรกเกิดถึง 5 ขวบ เด็กโตเรียนเปียโน ร้องเพลง กีตาร์ กลอง และเต้น นักเรียนร่วมการแข่งขัน (ปี 2569 ได้เหรียญทองและเหรียญเงินจาก Thailand International Music Competition) และมีการแสดงประจำปีของนักเรียน นอกจากนี้ยังมีเวิร์กช็อปศิลปะและกิจกรรมครอบครัว นัดทดลองเรียนได้ ค่าเรียนไม่ได้ประกาศไว้ กรุณาสอบถาม โทร 096 935 4495 LINE: @playtunemusic Facebook: Playtune Music Studio Pattaya Instagram: @playtunemusic_pattaya เว็บไซต์ playtune-musicstudio.com",
    tips: [
      {
        text: "Пробное занятие записывайте через LINE или сообщения в Facebook — так студия просит в постах.",
        textEn:
          "Book a trial lesson via LINE or Facebook messages — that's what the studio asks in its posts.",
        textTh: "นัดทดลองเรียนทาง LINE หรือข้อความใน Facebook ตามที่สตูดิโอแจ้งในโพสต์",
      },
      {
        text: "Kindermusik здесь официальный: студия есть в списке филиалов Kindermusik Thailand. Уровни сети: 0–18 месяцев, 1,5–3 года, 3–5 лет — какие группы идут сейчас, уточните.",
        textEn:
          "The Kindermusik here is official: the studio is listed among Kindermusik Thailand locations. Network levels are 0–18 months, 1.5–3 years and 3–5 years — check which groups are running now.",
        textTh:
          "คลาส Kindermusik ที่นี่เป็นของทางการ สตูดิโออยู่ในรายชื่อสาขา Kindermusik Thailand ระดับของเครือ: 0–18 เดือน 1.5–3 ปี และ 3–5 ปี สอบถามว่าตอนนี้เปิดกลุ่มใดบ้าง",
      },
      {
        text: "Раз в год ученики выступают на отчётном концерте: в 2026 году — 29 ноября в Treehouse Garden Café, участие 650 ฿, для зрителей вход свободный.",
        textEn:
          "Students perform at an annual showcase: in 2026 it's on 29 November at Treehouse Garden Café, 650 ฿ per performer, free for the audience.",
        textTh:
          "มีการแสดงประจำปีของนักเรียน ปี 2569 จัดวันที่ 29 พฤศจิกายน ที่ Treehouse Garden Café ค่าสมัครผู้แสดง 650 บาท ผู้ชมเข้าฟรี",
      },
      {
        text: "Занятия для всей семьи: по субботам идут сразу несколько классов, а в студии есть ещё и группа музыки для старшего поколения — можно привести бабушку или дедушку.",
        textEn:
          "Something for the whole family: several classes run on Saturdays, and the studio also has a music group for seniors — grandparents can join too.",
        textTh:
          "เหมาะกับทั้งครอบครัว วันเสาร์มีหลายคลาสพร้อมกัน และสตูดิโอยังมีคลาสดนตรีสำหรับผู้สูงวัย พาคุณตาคุณยายมาเรียนได้",
      },
    ],
    categorySlugs: ["music"],
  },
  // Rangsiya Gym — тхэквондо
  {
    slug: "rangsiya-gym-taekwondo-boonsampan",
    nameEn: "Taekwondo at Rangsiya Gym Pattaya",
    nameTh: "เทควันโด รังสิญา ยิม สาขาพัทยา",
    description:
      "Rangsiya Gym — детская школа тхэквондо в районе Boonsampan (Khao Noi, сой Boonsampan). Занятия ведутся под руководством Kru June (Rangsiya Nisaisom) — чемпионки мира 2011 года, бывшей спортсменки сборной Таиланда и участницы Олимпиады 2012. Принимают детей любого уровня — от новичков до спортсменов: начинают с растяжки, равновесия и стоек, потом учат удары ногами и спарринг в защите; в зале есть соревновательная команда. Группы подбирают по возрасту ребёнка — его нужно назвать при записи. Объявления на тайском; цены не публикуют — уточняйте. Телефон: 096 936 5299, LINE: @920rjrhw, Facebook: Rangsiya Gym Pattaya.",
    descriptionEn:
      "Rangsiya Gym is a children's taekwondo school in the Boonsampan area (Khao Noi, Soi Boonsampan). Training is overseen by Kru June (Rangsiya Nisaisom), the 2011 world champion, former Thai national team athlete and 2012 Olympian. Children of all levels are welcome, from complete beginners to competitors: classes start with stretching, balance and stances, then move on to kicks and sparring in protective gear; the gym has a competition team. Groups are matched to your child's age, so mention it when you enquire. Announcements are in Thai; prices aren't published — please ask. Phone: 096 936 5299, LINE: @920rjrhw, Facebook: Rangsiya Gym Pattaya.",
    descriptionTh:
      "รังสิญา ยิม สาขาพัทยา (สาขาเขาน้อย ซอยบุญสัมพันธ์) ยิมฝึกสอนเทควันโด ควบคุมการเรียนการสอนโดยครูจูน (รังสิญา นิสัยสม) อดีตแชมป์เทควันโดโลกปี 2011 นักกีฬาทีมชาติไทย และนักกีฬาโอลิมปิกปี 2012 เปิดรับเด็ก ๆ ทุกระดับ ตั้งแต่ไม่มีพื้นฐานจนถึงนักกีฬา เริ่มจากยืดเหยียด ทรงตัว และท่าพื้นฐาน ก่อนฝึกเตะและซ้อมคู่ใส่เกราะ ฝึกความแข็งแรง วินัย และสมาธิ แจ้งอายุน้องเพื่อสอบถามคลาสที่เหมาะสม ค่าเรียนกรุณาสอบถาม โทร 096 936 5299, LINE: @920rjrhw, Facebook: Rangsiya Gym Pattaya",
    tips: [
      {
        text: "При записи назовите возраст ребёнка — школа подберёт подходящую группу.",
        textEn:
          "Tell the school your child's age when you enquire — they'll suggest the right class.",
        textTh: "แจ้งอายุน้องเพื่อสอบถามคลาสที่เหมาะสม",
      },
      {
        text: "Опыт не нужен: новички начинают с основ — растяжки, равновесия и стоек.",
        textEn:
          "No experience needed: beginners start with the basics — stretching, balance and stances.",
        textTh: "ไม่มีพื้นฐานก็เริ่มได้ เริ่มจากยืดเหยียด ทรงตัว และท่าพื้นฐาน",
      },
      {
        text: "Ориентир — Khao Noi, сой Boonsampan.",
        textEn: "Landmark: Khao Noi, Soi Boonsampan.",
        textTh: "จุดสังเกต: เขาน้อย ซอยบุญสัมพันธ์",
      },
      {
        text: "У Rangsiya Gym есть отдельный филиал в Саттахипе — не перепутайте контакты: у паттайского 096 936 5299.",
        textEn:
          "Rangsiya Gym also has a separate branch in Sattahip — don't mix up the contacts: the Pattaya branch is 096 936 5299.",
        textTh: "รังสิญา ยิม มีสาขาสัตหีบแยกต่างหาก สาขาพัทยาโทร 096 936 5299",
      },
    ],
    categorySlugs: ["martial-arts"],
  },
  // Regents International School — каникулярные лагеря
  {
    slug: "regents-pattaya-holiday-camps",
    nameEn: "Holiday Camps at Regents International School Pattaya",
    nameTh: "ค่ายช่วงปิดเทอม Regents International School Pattaya",
    description:
      "Британская международная школа Regents в Понге (Восточная Паттайя) на каникулах проводит дневные лагеря на своём кампусе. Летний лагерь — для детей 3–15 лет, открыт и для учеников других школ; в 2026 году шёл с 29 июня по 24 июля, записаться можно было на любые 1–4 недели. В программе спорт, плавание, творчество, STEAM-задания, игры на природе и выезды, у каждой недели своя тема; для детей от 7 лет есть лагерь с английским (EAL), от 8 лет — с проживанием. На осенние каникулы 2026 года впервые провели Little Explorers для малышей 1–6 лет: пять дней с 9:00 до 15:00, Forest School, выпечка с кондитером, визит пожарных и овец с фермы; стоило 15 000 ฿ за неделю, за второго ребёнка — 14 000 ฿, утренний перекус включён, обед — с собой. Цены летнего лагеря — в брошюре школы, уточняйте; даты следующих лагерей тоже. Телефон: 038 418 777, приёмная комиссия: 093 135 7736, e-mail: info@regents-pattaya.co.th, Instagram: @regentspattaya, Facebook: Regents International School Pattaya, сайт: nordangliaeducation.com/risp-pattaya.",
    descriptionEn:
      "Regents, a British international school in Pong (East Pattaya), runs day camps on its campus during the school holidays. The summer camp is for ages 3–15 and is open to children from other schools; in 2026 it ran from 29 June to 24 July, and families could book any 1–4 weeks. It includes sport, swimming, arts, STEAM challenges, outdoor games and trips, with a theme for each week; there's an English-language (EAL) camp from age 7 and a boarding camp from age 8. For the October 2026 break the school ran its first Little Explorers camp for ages 1–6: five days, 9:00–15:00, with Forest School, baking with a local baker, a fire brigade visit and sheep from a farm; it cost 15,000 ฿ per week, 14,000 ฿ for a second child, with a morning snack included and a packed lunch from home. Summer camp prices are in the school's brochure — please ask, and check the dates of upcoming camps too. Phone: 038 418 777, admissions: 093 135 7736, email: info@regents-pattaya.co.th, Instagram: @regentspattaya, Facebook: Regents International School Pattaya, website: nordangliaeducation.com/risp-pattaya.",
    descriptionTh:
      "Regents International School Pattaya โรงเรียนนานาชาติหลักสูตรอังกฤษที่โป่ง (พัทยาตะวันออก) จัดค่ายกลางวันในโรงเรียนช่วงปิดเทอม ค่ายภาคฤดูร้อนสำหรับเด็กอายุ 3–15 ปี เปิดรับทั้งนักเรียน Regents และเด็กจากโรงเรียนอื่น ปี 2026 จัดระหว่าง 29 มิถุนายน – 24 กรกฎาคม เลือกสมัครได้ 1–4 สัปดาห์ มีกีฬา ว่ายน้ำ ศิลปะ กิจกรรม STEAM เล่นกลางแจ้ง และทัศนศึกษา แต่ละสัปดาห์มีธีมต่างกัน มีค่าย EAL เสริมภาษาอังกฤษสำหรับอายุ 7 ปีขึ้นไป และค่ายพักค้างสำหรับอายุ 8 ปีขึ้นไป ช่วงปิดเทอมตุลาคม 2026 จัดค่าย Little Explorers ครั้งแรกสำหรับเด็ก 1–6 ปี 5 วัน เวลา 9:00–15:00 น. มี Forest School ทำขนมกับคนทำเบเกอรี่ ทีมดับเพลิงมาเยี่ยม และแกะจากฟาร์ม ค่าค่าย 15,000 บาทต่อสัปดาห์ คนที่สอง 14,000 บาท รวมอาหารว่างตอนเช้า เตรียมอาหารกลางวันมาเอง ค่าค่ายฤดูร้อนอยู่ในโบรชัวร์ของโรงเรียน กรุณาสอบถาม รวมถึงวันจัดค่ายครั้งถัดไป โทร 038 418 777 ฝ่ายรับสมัคร 093 135 7736 อีเมล info@regents-pattaya.co.th Instagram: @regentspattaya Facebook: Regents International School Pattaya เว็บไซต์ nordangliaeducation.com/risp-pattaya",
    tips: [
      {
        text: "Летний лагерь открыт и для детей не из Regents; записываться можно на отдельные недели.",
        textEn:
          "The summer camp is open to children who don't attend Regents, and you can book individual weeks.",
        textTh:
          "ค่ายฤดูร้อนเปิดรับเด็กที่ไม่ได้เรียนที่ Regents และเลือกสมัครเป็นรายสัปดาห์ได้",
      },
      {
        text: "Места ограничены — запись через онлайн-форму по ссылке в профиле школы; для лагеря с проживанием была скидка за раннюю регистрацию.",
        textEn:
          "Places are limited — sign up via the online form linked in the school's profile; the boarding camp had an early-bird discount.",
        textTh:
          "ที่นั่งจำกัด สมัครผ่านแบบฟอร์มออนไลน์ตามลิงก์ในโปรไฟล์โรงเรียน ค่ายพักค้างมีส่วนลดสมัครล่วงหน้า",
      },
      {
        text: "На Little Explorers давали только утренний перекус: обед, бутылку воды и одежду для игр на улице нужно собрать с собой.",
        textEn:
          "Little Explorers provided only a morning snack: pack lunch, a water bottle and clothes for outdoor play.",
        textTh:
          "ค่าย Little Explorers มีเฉพาะอาหารว่างตอนเช้า ควรเตรียมอาหารกลางวัน ขวดน้ำ และเสื้อผ้าสำหรับเล่นกลางแจ้ง",
      },
      {
        text: "За второго ребёнка на Little Explorers — скидка 1000 ฿.",
        textEn: "A second child at Little Explorers got 1,000 ฿ off.",
        textTh: "ค่าย Little Explorers ลด 1,000 บาทสำหรับพี่น้องคนที่สอง",
      },
    ],
    minAgeMonths: 12,
    maxAgeMonths: 180,
    categorySlugs: ["early-development", "sport"],
    cover: "/images/activities/regents-pattaya-holiday-camps.jpg",
  },
  // Royal Varuna Yacht Club — парусный спорт
  {
    slug: "royal-varuna-yacht-club",
    nameEn: "Youth sailing courses at Royal Varuna Yacht Club",
    nameTh: "คอร์สเรือใบเยาวชน Royal Varuna Yacht Club",
    description:
      "Royal Varuna Yacht Club — старейший яхт-клуб Таиланда (основан в 1957 году) на берегу Пратамнака, сертифицированный учебный центр британской Королевской яхтенной ассоциации (RYA). Для детей до 16 лет клуб проводит пятидневные курсы RYA Youth Stages 1–4 на маленьких швертботах: от спуска лодки на воду и первых галсов до поворотов, переворота и спасения «человека за бортом». На одного инструктора — не больше 6 учеников; в стоимость входят аренда лодки, обучение, спасательное снаряжение, бортовой журнал и сертификат. Курсы идут в школьные каникулы: в 2026 году — 3–7 августа, 12–16 октября и 21–25 декабря. Цена курса — 11 000 ฿ для членов клуба и 14 000 ฿ для остальных (возможна надбавка в сезон), уточняйте. Обучение на английском. Летом 2027 года (28 июня — 4 июля) — лагерь по парусу и охране моря для детей 8–14 лет. Телефон: 038 250 116, email: director@varuna.org, Facebook: facebook.com/RoyalVarunaYachtClub, Instagram: @rvyc_thailand, сайт: varuna.org.",
    descriptionEn:
      "Royal Varuna Yacht Club is Thailand's oldest yacht club (founded in 1957), on the Pratamnak shore, and an RYA (Royal Yachting Association) certified training centre. For under-16s it runs five-day RYA Youth Stages 1–4 courses in small dinghies: from launching and first tacks to gybing, capsize recovery and man-overboard drills. There are no more than 6 students per instructor, and the fee covers boat hire, tuition, safety gear, a logbook and certificate. Courses run in the school holidays: in 2026 on 3–7 August, 12–16 October and 21–25 December. A course costs 11,000 ฿ for club members and 14,000 ฿ for non-members (a seasonal surcharge may apply) — please confirm. Instruction is in English. In summer 2027 (28 June – 4 July) there's a sailing and marine conservation camp for ages 8–14. Phone: 038 250 116, email: director@varuna.org, Facebook: facebook.com/RoyalVarunaYachtClub, Instagram: @rvyc_thailand, website: varuna.org.",
    descriptionTh:
      "Royal Varuna Yacht Club สโมสรเรือใบที่เก่าแก่ที่สุดของไทย (ก่อตั้งปี 1957) ริมทะเลพระตำหนัก เป็นศูนย์ฝึกที่ได้รับการรับรองจาก RYA (Royal Yachting Association) สำหรับเยาวชนอายุไม่เกิน 16 ปี มีคอร์ส RYA Youth Stages 1–4 ระยะเวลา 5 วันบนเรือใบลำเล็ก ตั้งแต่การนำเรือลงน้ำและแล่นใบเบื้องต้น ไปจนถึงการหันเรือ การกู้เรือคว่ำ และการช่วยคนตกน้ำ ครูหนึ่งคนดูแลนักเรียนไม่เกิน 6 คน ค่าเรียนรวมค่าเช่าเรือ ค่าสอน อุปกรณ์ความปลอดภัย สมุดบันทึก และใบประกาศ คอร์สจัดช่วงปิดเทอม ปี 2026 วันที่ 3–7 สิงหาคม 12–16 ตุลาคม และ 21–25 ธันวาคม ค่าเรียนสมาชิก 11,000 บาท บุคคลทั่วไป 14,000 บาท (อาจมีค่าบริการเพิ่มช่วงเทศกาล) กรุณาสอบถามอีกครั้ง สอนเป็นภาษาอังกฤษ ช่วงฤดูร้อนปี 2027 (28 มิถุนายน – 4 กรกฎาคม) มีค่ายเรือใบและอนุรักษ์ทะเลสำหรับเด็กอายุ 8–14 ปี โทร 038 250 116 อีเมล director@varuna.org Facebook: facebook.com/RoyalVarunaYachtClub Instagram: @rvyc_thailand เว็บไซต์ varuna.org",
    tips: [
      {
        text: "Членство в клубе не обязательно: курс открыт и для нечленов, только дороже — 14 000 ฿ вместо 11 000 ฿.",
        textEn:
          "Club membership isn't required: the course is open to non-members too, just pricier — 14,000 ฿ instead of 11,000 ฿.",
        textTh:
          "ไม่จำเป็นต้องเป็นสมาชิก บุคคลทั่วไปเรียนได้ในราคา 14,000 บาท (สมาชิก 11,000 บาท)",
      },
      {
        text: "В группе не больше 6 детей на инструктора, места разбирают быстро — бронируйте заранее через ресепшен или director@varuna.org.",
        textEn:
          "Groups are capped at 6 children per instructor and fill fast — book ahead via reception or director@varuna.org.",
        textTh:
          "ครูหนึ่งคนดูแลไม่เกิน 6 คน ที่นั่งเต็มเร็ว ควรจองล่วงหน้าที่เคาน์เตอร์หรือ director@varuna.org",
      },
      {
        text: "Курс длится 5 дней подряд (пн–пт) и привязан к каникулам: в 2026 году — август, октябрь и декабрь.",
        textEn:
          "Each course runs 5 days in a row (Mon–Fri) during school breaks: in 2026 — August, October and December.",
        textTh:
          "คอร์สเรียนต่อเนื่อง 5 วัน (จันทร์–ศุกร์) ช่วงปิดเทอม ปี 2026 จัดในเดือนสิงหาคม ตุลาคม และธันวาคม",
      },
      {
        text: "Для тех, кто уже ходит под парусом, есть частные уроки: 3 600 ฿ за полдня с инструктором для нечленов (лодка — отдельно).",
        textEn:
          "For those already sailing there are private lessons: 3,600 ฿ for a half day with an instructor for non-members (boat extra).",
        textTh:
          "มีคลาสส่วนตัวสำหรับผู้ที่แล่นเรือเป็นแล้ว ครึ่งวัน 3,600 บาทสำหรับบุคคลทั่วไป (ไม่รวมค่าเรือ)",
      },
    ],
    maxAgeMonths: 203,
    price: 14000,
    priceUnit: "/ курс 5 дней",
    priceUnitEn: "/ 5-day course",
    priceUnitTh: "/ คอร์ส 5 วัน",
    classes: [
      {
        name: "RYA Youth, 3–7 августа 2026",
        nameEn: "RYA Youth, 3–7 Aug 2026",
        nameTh: "RYA Youth 3–7 ส.ค. 2026",
        ageLabel: "до 16 лет",
        ageLabelEn: "16 and under",
        ageLabelTh: "ไม่เกิน 16 ปี",
        minAgeMonths: 0,
        maxAgeMonths: 203,
        parentRequired: null,
        schedule: "Пн–Пт",
        scheduleEn: "Mon–Fri",
        scheduleTh: "จันทร์–ศุกร์",
      },
      {
        name: "RYA Youth, 12–16 октября 2026",
        nameEn: "RYA Youth, 12–16 Oct 2026",
        nameTh: "RYA Youth 12–16 ต.ค. 2026",
        ageLabel: "до 16 лет",
        ageLabelEn: "16 and under",
        ageLabelTh: "ไม่เกิน 16 ปี",
        minAgeMonths: 0,
        maxAgeMonths: 203,
        parentRequired: null,
        schedule: "Пн–Пт",
        scheduleEn: "Mon–Fri",
        scheduleTh: "จันทร์–ศุกร์",
      },
      {
        name: "RYA Youth, 21–25 декабря 2026",
        nameEn: "RYA Youth, 21–25 Dec 2026",
        nameTh: "RYA Youth 21–25 ธ.ค. 2026",
        ageLabel: "до 16 лет",
        ageLabelEn: "16 and under",
        ageLabelTh: "ไม่เกิน 16 ปี",
        minAgeMonths: 0,
        maxAgeMonths: 203,
        parentRequired: null,
        schedule: "Пн–Пт",
        scheduleEn: "Mon–Fri",
        scheduleTh: "จันทร์–ศุกร์",
      },
    ],
    categorySlugs: ["sport"],
    cover: "/images/activities/royal-varuna-yacht-club.jpg",
  },
  // Rugby Rascals — плейгруппа (Rugby School Thailand)
  {
    slug: "rugby-rascals-playgroup",
    nameEn: "Rugby Rascals Playgroup at Rugby School Thailand",
    nameTh: "เพลย์กรุ๊ป Rugby Rascals ที่ Rugby School Thailand",
    description:
      "Rugby Rascals — плейгруппа для малышей от 1 до 3 лет со взрослым в младшем корпусе (Pre-Prep) Rugby School Thailand в Кхао Май Кэу. Дети играют, поют, двигаются под музыку, рисуют, возятся с сенсорными материалами и маленькими игровыми мирами, а взрослые знакомятся между собой. Занятия по вторникам и четвергам с 8:30 до 10:30, только в учебные недели школы. Ведёт руководитель Pre-Prep вместе с сотрудниками школы, по-английски. Приходить могут все семьи, не только ученики школы. Цена по сайту школы: 400 ฿ за ребёнка за занятие, перекус включён; праздничные встречи (Рождество, Сонгкран) могут стоить иначе — уточняйте. Мест немного, записываться нужно заранее. Телефон: 033 141 800 (доб. 1001), email: rugbyrascals@rugbyschool.ac.th, LINE: @rugbyschoolth, сайт: rugbyschool.ac.th.",
    descriptionEn:
      "Rugby Rascals is a playgroup for little ones aged 1 to 3 with an adult, held in the Pre-Prep building of Rugby School Thailand in Khao Mai Kaew. Children play, sing, move to music, do art, messy play and small-world play, while adults get to know each other. Sessions are on Tuesday and Thursday, 8:30–10:30, in school term weeks only. It is led by the Head of Pre-Prep with school staff, in English. All families are welcome, not just the school's own. Price from the school's website: 400 ฿ per child per session, snack included; special sessions (Christmas, Songkran) may be priced differently — please check. Places are limited, so book ahead. Phone: 033 141 800 (ext. 1001), email: rugbyrascals@rugbyschool.ac.th, LINE: @rugbyschoolth, website: rugbyschool.ac.th.",
    descriptionTh:
      "Rugby Rascals เพลย์กรุ๊ปสำหรับเด็กเล็กอายุ 1–3 ปีพร้อมผู้ปกครอง ที่อาคาร Pre-Prep ของ Rugby School Thailand เขาไม้แก้ว เด็ก ๆ ได้เล่น ร้องเพลง เคลื่อนไหวตามจังหวะดนตรี ทำงานศิลปะ เล่นสัมผัส และเล่นบทบาทสมมติ ส่วนผู้ปกครองได้ทำความรู้จักกัน เรียนวันอังคารและพฤหัสบดี 08:30–10:30 น. เฉพาะช่วงเปิดภาคเรียน ดูแลโดยหัวหน้าแผนก Pre-Prep และบุคลากรของโรงเรียน ใช้ภาษาอังกฤษ เปิดรับทุกครอบครัว ไม่จำเป็นต้องเป็นนักเรียนของโรงเรียน ค่าเข้าร่วมตามเว็บไซต์ 400 บาทต่อเด็กต่อครั้ง รวมของว่าง กิจกรรมพิเศษ (คริสต์มาส สงกรานต์) อาจมีราคาต่างออกไป — กรุณาสอบถามอีกครั้ง ที่นั่งจำกัด ควรจองล่วงหน้า โทร 033 141 800 ต่อ 1001 อีเมล rugbyrascals@rugbyschool.ac.th LINE: @rugbyschoolth เว็บไซต์ rugbyschool.ac.th",
    tips: [
      {
        text: "Записывайтесь заранее по email rugbyrascals@rugbyschool.ac.th или через форму на сайте: школа пишет, что плейгруппа популярна и мест немного.",
        textEn:
          "Book ahead by email at rugbyrascals@rugbyschool.ac.th or via the form on the website: the school says the playgroup is popular and places are limited.",
        textTh:
          "จองล่วงหน้าทางอีเมล rugbyrascals@rugbyschool.ac.th หรือแบบฟอร์มบนเว็บไซต์ โรงเรียนแจ้งว่าเพลย์กรุ๊ปเป็นที่นิยมและที่นั่งมีจำกัด",
      },
      {
        text: "Встречи идут только в учебные недели школы — на каникулах их нет; перед поездкой проверьте, идёт ли семестр.",
        textEn:
          "Sessions run only in school term weeks — not during holidays; check that term is on before you go.",
        textTh: "มีกิจกรรมเฉพาะสัปดาห์เปิดภาคเรียน ช่วงปิดเทอมงด ตรวจสอบก่อนเดินทาง",
      },
      {
        text: "В конце семестра бывают праздничные встречи — например, рождественская с Сантой; цена у них может отличаться.",
        textEn:
          "There are festive end-of-term sessions — for example, a Christmas party with Santa; they may be priced differently.",
        textTh:
          "ปลายภาคเรียนมีกิจกรรมพิเศษ เช่น ปาร์ตี้คริสต์มาสกับซานตาคลอส ราคาอาจต่างจากปกติ",
      },
    ],
    minAgeMonths: 12,
    maxAgeMonths: 36,
    price: 400,
    priceUnit: "/ занятие",
    priceUnitEn: "/ session",
    priceUnitTh: "/ ครั้ง",
    classes: [
      {
        name: "Вт и Чт",
        nameEn: "Tue & Thu",
        nameTh: "อังคาร–พฤหัส",
        ageLabel: "1–3 года",
        ageLabelEn: "1–3 years",
        ageLabelTh: "1–3 ปี",
        minAgeMonths: 12,
        maxAgeMonths: 36,
        parentRequired: true,
        schedule: "8:30–10:30",
        scheduleEn: "8:30–10:30",
        scheduleTh: "8:30–10:30",
      },
    ],
    categorySlugs: ["early-development"],
  },
  // Rusich Club
  {
    slug: "rusich-club",
    nameEn: "Rusich Club — hand-to-hand fighting, wrestling, aerial gymnastics",
    nameTh: "Rusich Club ศิลปะการต่อสู้และยิมนาสติกลอยฟ้าสำหรับเด็ก",
    description:
      "Русскоязычный семейный спортклуб в Паттайе, база национальной сборной Таиланда по рукопашному бою (HSIF Thailand). Для детей 4–10 лет — рукопашный бой (пн, ср, пт) и борьба: дзюдо, самбо, джиу-джитсу (вт, чт), занятия по часу в 17:30. С 7 лет — воздушная гимнастика, группы по полтора часа почти каждый будний вечер; с 10 лет — грэпплинг по субботам и функциональный тренинг. Тренеры — действующие спортсмены; дети сдают аттестации, ездят на турниры, клуб устраивает семейные праздники. Первое занятие бесплатное, разовое — 350 ฿ (гимнастика 500 ฿), месяц рукопашного боя три раза в неделю — 3 000 ฿, борьбы два раза в неделю — 2 500 ฿; при покупке нескольких абонементов скидка 10–15 %. Расписание и цены — по сайту клуба, уточняйте. Телефон, WhatsApp и Telegram: +66 62 002 6863, Instagram: @rusich.club, Facebook: facebook.com/rusich.club, сайт: rusich.club.",
    descriptionEn:
      "A Russian-speaking family sports club in Pattaya and home base of Thailand's national hand-to-hand fighting team (HSIF Thailand). For children aged 4–10 there is hand-to-hand fighting (Mon, Wed, Fri) and wrestling — judo, sambo, jiu-jitsu (Tue, Thu), one-hour classes at 17:30. From age 7 there is aerial gymnastics in 90-minute groups on most weekday evenings; from 10, grappling on Saturdays and functional training. Coaches are active athletes; children take grading exams, compete in tournaments, and the club holds family events. The first class is free; a single class is 350 ฿ (gymnastics 500 ฿), a month of hand-to-hand fighting three times a week is 3,000 ฿, wrestling twice a week 2,500 ฿, with a 10–15% discount for several memberships. Schedule and prices are from the club website — please check. Phone, WhatsApp and Telegram: +66 62 002 6863, Instagram: @rusich.club, Facebook: facebook.com/rusich.club, website: rusich.club.",
    descriptionTh:
      "Rusich Club สโมสรกีฬาสำหรับครอบครัวในพัทยา ใช้ภาษารัสเซียเป็นหลัก และเป็นฐานของทีมชาติไทยกีฬาการต่อสู้ประชิดตัว (HSIF Thailand) สำหรับเด็ก 4–10 ปี มีคลาสการต่อสู้ประชิดตัว (จันทร์ พุธ ศุกร์) และมวยปล้ำ ยูโด แซมโบ ยิวยิตสู (อังคาร พฤหัส) คลาสละ 1 ชั่วโมง เวลา 17:30 น. ตั้งแต่ 7 ปีมียิมนาสติกลอยฟ้า คลาสละ 1 ชั่วโมงครึ่ง เกือบทุกเย็นวันธรรมดา ตั้งแต่ 10 ปีมีเกรปปลิ้งวันเสาร์และฟังก์ชันนัลเทรนนิ่ง โค้ชเป็นนักกีฬาที่ยังแข่งขันอยู่ เด็ก ๆ มีการสอบเลื่อนระดับ ลงแข่งขัน และสโมสรจัดกิจกรรมครอบครัว ทดลองเรียนครั้งแรกฟรี ค่าเรียนรายครั้ง 350 บาท (ยิมนาสติก 500 บาท) รายเดือนการต่อสู้ประชิดตัว 3 ครั้ง/สัปดาห์ 3,000 บาท มวยปล้ำ 2 ครั้ง/สัปดาห์ 2,500 บาท ซื้อหลายคอร์สลด 10–15% ตารางและราคาตามเว็บไซต์ของสโมสร กรุณาสอบถามอีกครั้ง โทร/WhatsApp/Telegram: +66 62 002 6863 Instagram: @rusich.club Facebook: facebook.com/rusich.club เว็บไซต์ rusich.club",
    tips: [
      {
        text: "Пробное занятие бесплатное — во всех детских направлениях по сайту клуба.",
        textEn:
          "The trial class is free in all children's programs, per the club website.",
        textTh: "ทดลองเรียนฟรีทุกคลาสเด็ก (ตามเว็บไซต์สโมสร)",
      },
      {
        text: "Тренеры советуют начинать борьбу не раньше 4–5 лет, а рукопашный бой — оптимально с 6–7 лет (по сайту клуба).",
        textEn:
          "Coaches advise starting wrestling no earlier than 4–5, and hand-to-hand fighting ideally at 6–7 (per the club website).",
        textTh:
          "โค้ชแนะนำให้เริ่มมวยปล้ำไม่ก่อนอายุ 4–5 ปี และการต่อสู้ประชิดตัวเหมาะเริ่มที่ 6–7 ปี (ตามเว็บไซต์สโมสร)",
      },
      {
        text: "Если ребёнок ходит на несколько направлений, при покупке двух абонементов скидка 10 %, трёх — 15 %.",
        textEn:
          "If your child does several programs, two memberships get 10% off and three get 15% off.",
        textTh: "ถ้าเด็กเรียนหลายคลาส ซื้อ 2 คอร์สลด 10% ซื้อ 3 คอร์สลด 15%",
      },
      {
        text: "Занятия и общение в клубе — на русском; в постах есть английский перевод.",
        textEn:
          "Classes and club communication are in Russian; posts also come with an English translation.",
        textTh: "สอนและสื่อสารเป็นภาษารัสเซีย โพสต์มีคำแปลภาษาอังกฤษ",
      },
    ],
    minAgeMonths: 48,
    price: 3000,
    priceUnit: "/ месяц (3 раза в неделю)",
    priceUnitEn: "/ month (3 times a week)",
    priceUnitTh: "/ เดือน (3 ครั้งต่อสัปดาห์)",
    classes: [
      {
        name: "Рукопашный бой — Пн, Ср, Пт",
        nameEn: "Hand-to-hand fighting — Mon, Wed, Fri",
        nameTh: "การต่อสู้ประชิดตัว — จันทร์ พุธ ศุกร์",
        ageLabel: "4–10 лет",
        ageLabelEn: "4–10 years",
        ageLabelTh: "4–10 ปี",
        minAgeMonths: 48,
        maxAgeMonths: 120,
        parentRequired: null,
        schedule: "17:30–18:30",
        scheduleEn: "17:30–18:30",
        scheduleTh: "17:30–18:30",
      },
      {
        name: "Борьба (дзюдо, самбо, джиу-джитсу) — Вт и Чт",
        nameEn: "Wrestling (judo, sambo, jiu-jitsu) — Tue & Thu",
        nameTh: "มวยปล้ำ (ยูโด แซมโบ ยิวยิตสู) — อังคาร–พฤหัส",
        ageLabel: "4–10 лет",
        ageLabelEn: "4–10 years",
        ageLabelTh: "4–10 ปี",
        minAgeMonths: 48,
        maxAgeMonths: 120,
        parentRequired: null,
        schedule: "17:30–18:30",
        scheduleEn: "17:30–18:30",
        scheduleTh: "17:30–18:30",
      },
      {
        name: "Воздушная гимнастика — Пн–Пт",
        nameEn: "Aerial gymnastics — Mon–Fri",
        nameTh: "ยิมนาสติกลอยฟ้า — จันทร์–ศุกร์",
        ageLabel: "от 7 лет",
        ageLabelEn: "7+ years",
        ageLabelTh: "7 ปีขึ้นไป",
        minAgeMonths: 84,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "19:00–20:30 · Вт и Чт также 17:00–18:30",
        scheduleEn: "19:00–20:30 · Tue & Thu also 17:00–18:30",
        scheduleTh: "19:00–20:30 · อังคารและพฤหัสมีรอบ 17:00–18:30 ด้วย",
      },
      {
        name: "Грэпплинг — Сб",
        nameEn: "Grappling — Sat",
        nameTh: "เกรปปลิ้ง — เสาร์",
        ageLabel: "от 10 лет",
        ageLabelEn: "10+ years",
        ageLabelTh: "10 ปีขึ้นไป",
        minAgeMonths: 120,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "10:00–11:30",
        scheduleEn: "10:00–11:30",
        scheduleTh: "10:00–11:30",
      },
    ],
    categorySlugs: ["martial-arts"],
    cover: "/images/activities/rusich-club.jpg",
  },
  // S.A.M Singapore Maths Pattaya
  {
    slug: "sam-singapore-maths-pattaya",
    nameEn: "S.A.M Singapore Maths Pattaya",
    nameTh: "S.A.M Singapore Maths สาขาพัทยา",
    description:
      "S.A.M Singapore Maths — центр сингапурской математики в торговом комплексе FN Outlet Pattaya на Сукхумвите. Программа сети рассчитана на детей 4–12 лет: от уровня детского сада до старших классов начальной школы, занятия в небольших группах. Учат по сингапурскому принципу «от предмета к картинке и к числу»: сначала дети решают задачи с игрушками и счётным материалом, потом рисуют схемы (числовые связки, бар-модели) и только затем переходят к записи и уравнениям. Программу советуют детям из международных школ с британской, американской или сингапурской программой и тем, кто учит математику на английском. Перед началом проводят оценку уровня, первое занятие можно попробовать бесплатно. Центр открыт со среды по воскресенье, 10:00–18:00. Цены не публикуют — уточняйте. Телефон: 062 446 6691, LINE: @sampattaya, Facebook: facebook.com/SingaporeMathsPattaya, сайт: singaporemathsthailand.com.",
    descriptionEn:
      "S.A.M Singapore Maths is a Singapore maths centre in the FN Outlet Pattaya mall on Sukhumvit Road. The chain's programme is for children aged 4–12, from kindergarten level to upper primary, in small groups. It follows the Singapore concrete–pictorial–abstract approach: children first solve problems with toys and hands-on materials, then draw models (number bonds, bar models), and only then move to numbers and equations. The programme is recommended for children at international schools following British, American or Singapore curricula and for those learning maths in English. Children take a level assessment before starting, and the first lesson can be tried for free. The centre is open Wednesday to Sunday, 10:00–18:00. Prices aren't published — please ask. Phone: 062 446 6691, LINE: @sampattaya, Facebook: facebook.com/SingaporeMathsPattaya, website: singaporemathsthailand.com.",
    descriptionTh:
      "S.A.M Singapore Maths สาขาพัทยา ที่ FN Outlet Pattaya ถนนสุขุมวิท หลักสูตรคณิตศาสตร์จากสิงคโปร์สำหรับเด็กอายุ 4–12 ปี ตั้งแต่ระดับอนุบาลถึงประถมปลาย เรียนเป็นกลุ่มเล็ก สอนตามหลัก CPA Approach: เริ่มจากสื่อที่จับต้องได้ (Concrete) แล้วจัดความคิดออกมาเป็นภาพ เช่น Number bond, Bar model (Pictorial) ก่อนเข้าสู่ตัวเลขและสมการ (Abstract) เหมาะกับนักเรียนโรงเรียนนานาชาติหลักสูตรอังกฤษ อเมริกัน และสิงคโปร์ รวมถึงผู้ที่เรียนคณิตศาสตร์เป็นภาษาอังกฤษ มีการประเมินระดับก่อนเริ่มเรียน และทดลองเรียนได้ฟรี 1 ครั้ง เปิดวันพุธ–อาทิตย์ 10:00–18:00 น. ค่าเรียนกรุณาสอบถาม โทร 062 446 6691, LINE: @sampattaya, Facebook: facebook.com/SingaporeMathsPattaya, เว็บไซต์ singaporemathsthailand.com",
    tips: [
      {
        text: "Перед началом ребёнок проходит оценку уровня — её нужно забронировать заранее; первое пробное занятие бесплатное.",
        textEn:
          "Children take a level assessment before starting — book it in advance; the first trial lesson is free.",
        textTh: "ก่อนเริ่มเรียนมีการประเมินระดับ ควรนัดล่วงหน้า และทดลองเรียนฟรี 1 ครั้ง",
      },
      {
        text: "Понедельник и вторник — выходные; центр работает ср–вс, 10:00–18:00 (по посту от ноября 2026).",
        textEn:
          "Closed Mondays and Tuesdays; open Wed–Sun, 10:00–18:00 (per a November 2026 post).",
        textTh:
          "ปิดวันจันทร์และอังคาร เปิดพุธ–อาทิตย์ 10:00–18:00 น. (ตามโพสต์เดือนพฤศจิกายน 2026)",
      },
      {
        text: "Ориентир — FN Outlet Pattaya, рядом с рестораном Fu Cheng by Lueat Mu Khun Si.",
        textEn:
          "Landmark: FN Outlet Pattaya, next to the Fu Cheng by Lueat Mu Khun Si restaurant.",
        textTh: "จุดสังเกต: FN Outlet Pattaya ติดกับร้านฟู่เฉิง by เลือดหมูคุณศรี",
      },
      {
        text: "Программа на английском и рассчитана на детей из международных школ — подойдёт, если ребёнок учит математику по-английски.",
        textEn:
          "The programme is in English and designed for international-school pupils — a good fit if your child studies maths in English.",
        textTh:
          "หลักสูตรเหมาะกับนักเรียนโรงเรียนนานาชาติและผู้ที่เรียนคณิตศาสตร์เป็นภาษาอังกฤษ",
      },
    ],
    minAgeMonths: 48,
    maxAgeMonths: 144,
    categorySlugs: ["math"],
  },
  // Sing Taekwondo Pattaya
  {
    slug: "sing-taekwondo-pattaya",
    nameEn: "Sing Taekwondo Pattaya",
    nameTh: "สิงห์เทควันโดพัทยา",
    description:
      "Клуб тхэквондо Sing Taekwondo Pattaya (Kru Sing) занимается в Namchai Fair — за Namchai на Pattaya Klang, под рестораном Chao Samut Seafood. Берут детей с трёх с половиной лет, можно без подготовки: общая физподготовка, ловкость, дисциплина и концентрация, уважение к правилам, а дальше — путь до соревнований; ученики клуба регулярно выступают на турнирах. Тренировки каждый день: с понедельника по четверг три группы — 17:00, 18:00 и 19:00 (по часу), в субботу и воскресенье — 15:00, 16:30 и 18:00 (вечерняя — только для классов A и B). Абонемент — 2000 ฿ в месяц, ходить можно каждый день (по объявлению осени 2026 года, уточняйте). Объявления на тайском. Телефон и LINE: 064 749 8418 (Kru Sing), Facebook: «สิงห์เทควันโดพัทยา Sing TKD Pattaya».",
    descriptionEn:
      'Sing Taekwondo Pattaya (Kru Sing) trains at Namchai Fair — behind Namchai on Pattaya Klang, below Chao Samut Seafood restaurant. Children are welcome from three and a half, no experience needed: fitness, agility, discipline and focus, respect for the rules, and a path into competition; the club\'s students compete regularly. Training runs every day: Monday to Thursday in three one-hour groups at 17:00, 18:00 and 19:00, and on Saturday and Sunday at 15:00, 16:30 and 18:00 (the evening group is for A and B classes only). Membership is 2,000 ฿ a month and you can come every day (per the autumn 2026 announcement — please check). Announcements are in Thai. Phone and LINE: 064 749 8418 (Kru Sing), Facebook: "สิงห์เทควันโดพัทยา Sing TKD Pattaya".',
    descriptionTh:
      "สิงห์เทควันโดพัทยา (ครูสิงห์) สถานที่เรียน นำชัยแฟร์ หลังนำชัยพัทยากลาง ด้านล่างร้านเจ้าสมุทรซีฟู้ด รับเด็กตั้งแต่ 3 ขวบครึ่ง ไม่มีพื้นฐานก็เรียนได้ ฝึกความแข็งแรงและความคล่องตัว สมาธิ วินัย การเคารพกติกาและน้ำใจนักกีฬา พัฒนาตั้งแต่พื้นฐานจนถึงการแข่งขัน นักเรียนของสโมสรลงแข่งขันเป็นประจำ เรียนได้ทุกวัน จันทร์–พฤหัสบดี 3 รอบ 17:00, 18:00 และ 19:00 น. (รอบละ 1 ชั่วโมง) เสาร์–อาทิตย์ 15:00, 16:30 และ 18:00 น. (รอบเย็นเฉพาะคลาส A และ B) ค่าเรียน 2,000 บาทต่อเดือน เรียนได้ทุกวัน (ตามประกาศช่วงปลายปี 2569 กรุณาสอบถามอีกครั้ง) โทรและ LINE 064 749 8418 (ครูสิงห์) Facebook: สิงห์เทควันโดพัทยา Sing TKD Pattaya",
    tips: [
      {
        text: "Абонемент 2000 ฿ в месяц позволяет приходить каждый день — можно выбрать удобную группу.",
        textEn:
          "The 2,000 ฿ monthly membership lets you come every day, so you can pick whichever group suits you.",
        textTh: "ค่าเรียน 2,000 บาทต่อเดือน มาเรียนได้ทุกวัน เลือกรอบที่สะดวกได้",
      },
      {
        text: "Ориентир — Namchai Fair за Namchai на Pattaya Klang, зал под рестораном Chao Samut Seafood.",
        textEn:
          "Landmark: Namchai Fair behind Namchai on Pattaya Klang; the gym is below Chao Samut Seafood restaurant.",
        textTh: "จุดสังเกต: นำชัยแฟร์ หลังนำชัยพัทยากลาง ด้านล่างร้านเจ้าสมุทรซีฟู้ด",
      },
      {
        text: "Самых маленьких берут с 3,5 лет (ответ клуба в комментариях).",
        textEn:
          "The youngest children are accepted from 3.5 years (the club's reply in the comments).",
        textTh: "รับเด็กเล็กตั้งแต่ 3 ขวบครึ่ง (ตามที่สโมสรตอบในคอมเมนต์)",
      },
      {
        text: "Вечерняя группа выходного дня в 18:00 — только для продвинутых классов A и B.",
        textEn: "The weekend 18:00 group is for advanced classes A and B only.",
        textTh: "รอบ 18:00 น. วันเสาร์–อาทิตย์ เฉพาะคลาส A และ B",
      },
    ],
    minAgeMonths: 42,
    price: 2000,
    priceUnit: "/ месяц",
    priceUnitEn: "/ month",
    priceUnitTh: "/ เดือน",
    classes: [
      {
        name: "Пн–Чт",
        nameEn: "Mon–Thu",
        nameTh: "จันทร์–พฤหัส",
        ageLabel: "с 3,5 лет",
        ageLabelEn: "from 3.5 years",
        ageLabelTh: "ตั้งแต่ 3 ขวบครึ่ง",
        minAgeMonths: 42,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "17:00–18:00 · 18:00–19:00 · 19:00–20:00",
        scheduleEn: "17:00–18:00 · 18:00–19:00 · 19:00–20:00",
        scheduleTh: "17:00–18:00 · 18:00–19:00 · 19:00–20:00",
      },
      {
        name: "Сб и Вс",
        nameEn: "Sat & Sun",
        nameTh: "เสาร์–อาทิตย์",
        ageLabel: "с 3,5 лет",
        ageLabelEn: "from 3.5 years",
        ageLabelTh: "ตั้งแต่ 3 ขวบครึ่ง",
        minAgeMonths: 42,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "15:00–16:25 · 16:30–17:55 · 18:00–19:30 (классы A и B)",
        scheduleEn: "15:00–16:25 · 16:30–17:55 · 18:00–19:30 (A & B classes)",
        scheduleTh: "15:00–16:25 · 16:30–17:55 · 18:00–19:30 (คลาส A และ B)",
      },
    ],
    categorySlugs: ["martial-arts"],
  },
  // Rongrian Son Rong Phleng Pattaya (โรงเรียนสอนร้องเพลงพัทยา)
  {
    slug: "singing-school-pattaya",
    nameEn: "Singing lessons at Rongrian Son Rong Phleng Pattaya",
    nameTh: "โรงเรียนสอนร้องเพลงพัทยา",
    description:
      "Небольшая тайская школа вокала (โรงเรียนสอนร้องเพลงพัทยา) в жилом посёлке P.M.C. Home на востоке Паттайи. Ведёт преподаватель Kru Chai: учит петь тайскую эстраду и лук-тхунг, а также зарубежные песни, вместе с вокалом ставит сценическое движение и готовит к конкурсам пения, танца и актёрского мастерства. Судя по постам школы, среди учеников есть дети: регулярно выкладывают видео с уроков девочек-школьниц и отмечают их постепенный прогресс. Занятие длится час, ведётся индивидуально; возможны уроки с выездом. Занятия на тайском. Возраст учеников, расписание и цены школа не публикует — уточняйте по телефону. Телефон: 090 928 3347, Facebook: facebook.com/singing.pattaya.",
    descriptionEn:
      "A small Thai singing school (โรงเรียนสอนร้องเพลงพัทยา) in the P.M.C. Home housing estate in East Pattaya. Teacher Kru Chai teaches Thai pop and luk thung as well as international songs, works on stage movement alongside vocals and prepares students for singing, dance and drama contests. Judging by the school's posts, its students include children: it regularly shares lesson videos of school-age girls and notes their gradual progress. Lessons last an hour and are one-to-one; teaching at your location is possible too. Lessons are in Thai. The school doesn't publish ages, a timetable or prices — please ask by phone. Phone: 090 928 3347, Facebook: facebook.com/singing.pattaya.",
    descriptionTh:
      "โรงเรียนสอนร้องเพลงพัทยา โรงเรียนเล็ก ๆ ในหมู่บ้าน P.M.C. Home พัทยาฝั่งตะวันออก สอนโดยครูชาย ทั้งเพลงไทย ลูกทุ่ง และเพลงสากล ฝึกลีลาบนเวทีควบคู่กับการร้อง และเตรียมความพร้อมสำหรับการประกวดร้อง เต้น และการแสดง จากโพสต์ของโรงเรียน มีนักเรียนเด็กเรียนอยู่ด้วย โดยลงคลิปการเรียนของน้อง ๆ และพัฒนาการเสียงแบบค่อยเป็นค่อยไปเป็นประจำ เรียนครั้งละ 1 ชั่วโมง แบบตัวต่อตัว และมีบริการสอนนอกสถานที่ สอนเป็นภาษาไทย โรงเรียนไม่ได้ประกาศช่วงอายุ ตารางเรียน และค่าเรียน กรุณาสอบถามทางโทรศัพท์ โทร 090-928-3347 Facebook: facebook.com/singing.pattaya",
    tips: [
      {
        text: "Урок длится час (по постам школы); удобное время договаривайте с преподавателем по телефону или в чате Facebook.",
        textEn:
          "A lesson lasts an hour (per the school's posts); agree on a time with the teacher by phone or Facebook chat.",
        textTh:
          "เรียนครั้งละ 1 ชั่วโมง (ตามโพสต์ของโรงเรียน) นัดเวลากับครูทางโทรศัพท์หรือแชท Facebook",
      },
      {
        text: "Можно договориться о занятиях с выездом к вам (#สอนร้องเพลงนอกสถานที่).",
        textEn: "Lessons at your place can be arranged (#สอนร้องเพลงนอกสถานที่).",
        textTh: "สามารถนัดสอนนอกสถานที่ได้",
      },
      {
        text: "Вместе с вокалом школа обещает бесплатно поставить и танцевальные движения к песне.",
        textEn: "Along with singing, the school offers free dance moves for the song.",
        textTh: "เรียนร้องเพลงแถมสอนเต้นและลีลาฟรี",
      },
    ],
    categorySlugs: ["music"],
  },
  // Smart Minds Academy
  {
    slug: "smart-minds-academy",
    nameEn: "Smart Minds Academy — Maths Classes",
    nameTh: "Smart Minds Academy สอนคณิตศาสตร์ พัทยา",
    description:
      "Математика для школьников в Нонг Прыэ у преподавателя с большим опытом — доктора Pongprapan Pongsophon, бывшего доцента университета Kasetsart. Две программы в классе, группы до 15 человек, по два часа раз в неделю. На английском — по британской программе: 4–6 классы (KS2) по средам, 7–9 (KS3, сокращённый IGCSE) по четвергам, 10–12 (IGCSE и A Level) по пятницам, все с 18:00 до 20:00; курс — 30 недель. На тайском — по воскресеньям утром подготовка к вступительным экзаменам: 4–6 классы (сингапурская математика), 7–9 и 10–12. Для старшеклассников и студентов есть индивидуальные занятия по статистике и программированию на Python и R, в том числе онлайн. Цены на сайте не указаны — уточняйте. Телефон: 084 888 8911, e-mail: admissions@smartmindsacademy.net, Facebook: Smart Minds Academy - Pattaya, сайт: smartmindsacademy.net.",
    descriptionEn:
      "Maths for school students in Nong Prue with an experienced teacher, Dr Pongprapan Pongsophon, a former associate professor at Kasetsart University. There are two classroom programs, groups of up to 15, two hours once a week. In English, following the British curriculum: Grades 4–6 (KS2) on Wednesdays, Grades 7–9 (KS3, abridged IGCSE) on Thursdays, Grades 10–12 (IGCSE and A Level) on Fridays, all 18:00–20:00; each course runs 30 weeks. In Thai, on Sunday mornings, entrance-exam prep: Grades 4–6 (Singapore Maths), 7–9 and 10–12. Older students can also book private lessons in statistics and Python or R programming, including online. Prices aren't listed on the website — please ask. Phone: 084 888 8911, email: admissions@smartmindsacademy.net, Facebook: Smart Minds Academy - Pattaya, website: smartmindsacademy.net.",
    descriptionTh:
      "Smart Minds Academy สอนคณิตศาสตร์สำหรับนักเรียนที่หนองปรือ โดย รศ.ดร.พงศ์ประพันธ์ พงษ์โสภณ อดีตอาจารย์มหาวิทยาลัยเกษตรศาสตร์ มีคลาสเรียน 2 หลักสูตร กลุ่มละไม่เกิน 15 คน สัปดาห์ละครั้ง ครั้งละ 2 ชั่วโมง หลักสูตรภาษาอังกฤษตามแนวอังกฤษ: ป.4–6 (KS2) วันพุธ ม.1–3 (KS3/IGCSE) วันพฤหัส ม.4–6 (IGCSE และ A Level) วันศุกร์ เวลา 18:00–20:00 น. หลักสูตร 30 สัปดาห์ หลักสูตรภาษาไทย วันอาทิตย์: ติวสอบเข้า ม.1 สำหรับ ป.4–6 (คณิตศาสตร์สิงคโปร์) ติวสอบเข้า ม.4 สำหรับ ม.1–3 และติวสอบเข้ามหาวิทยาลัยสำหรับ ม.4–6 นอกจากนี้มีสอนตัวต่อตัววิชาสถิติ Python และ R ทั้งเรียนที่พัทยาและออนไลน์ เว็บไซต์ไม่ได้ระบุค่าเรียน กรุณาสอบถาม โทร 084 888 8911 อีเมล admissions@smartmindsacademy.net Facebook: Smart Minds Academy - Pattaya เว็บไซต์ smartmindsacademy.net",
    tips: [
      {
        text: "Есть группы на английском (британская программа KS2–A Level) и на тайском (подготовка к вступительным) — выбирайте по школе, где учится ребёнок.",
        textEn:
          "There are groups in English (British curriculum, KS2 to A Level) and in Thai (entrance-exam prep) — choose according to your child's school.",
        textTh:
          "มีกลุ่มเรียนภาษาอังกฤษ (หลักสูตรอังกฤษ KS2–A Level) และภาษาไทย (ติวสอบเข้า) เลือกตามโรงเรียนที่ลูกเรียนอยู่",
      },
      {
        text: "В группе не больше 15 учеников; курсы на английском длятся 30 недель — записываться лучше к началу курса.",
        textEn:
          "Groups have at most 15 students; English-language courses run for 30 weeks, so it's best to enrol at the start.",
        textTh:
          "กลุ่มละไม่เกิน 15 คน หลักสูตรภาษาอังกฤษยาว 30 สัปดาห์ ควรสมัครตั้งแต่เริ่มคอร์ส",
      },
      {
        text: "На сайте есть бесплатные калькуляторы и еженедельная задача по математике и статистике — можно посмотреть стиль преподавателя до записи.",
        textEn:
          "The website has free calculators and a weekly maths and statistics challenge — a way to see the teacher's style before enrolling.",
        textTh:
          "เว็บไซต์มีเครื่องมือคำนวณฟรีและโจทย์คณิต/สถิติประจำสัปดาห์ ลองดูสไตล์การสอนก่อนสมัครได้",
      },
    ],
    minAgeMonths: 108,
    classes: [
      {
        name: "Ср — на английском (KS2)",
        nameEn: "Wed — in English (KS2)",
        nameTh: "พุธ — ภาษาอังกฤษ (KS2)",
        ageLabel: "4–6 классы",
        ageLabelEn: "Grades 4–6",
        ageLabelTh: "ป.4–6",
        minAgeMonths: 108,
        maxAgeMonths: 144,
        parentRequired: null,
        schedule: "18:00–20:00",
        scheduleEn: "18:00–20:00",
        scheduleTh: "18:00–20:00",
      },
      {
        name: "Чт — на английском (KS3 / IGCSE)",
        nameEn: "Thu — in English (KS3 / IGCSE)",
        nameTh: "พฤหัส — ภาษาอังกฤษ (KS3 / IGCSE)",
        ageLabel: "7–9 классы",
        ageLabelEn: "Grades 7–9",
        ageLabelTh: "ม.1–3",
        minAgeMonths: 144,
        maxAgeMonths: 180,
        parentRequired: null,
        schedule: "18:00–20:00",
        scheduleEn: "18:00–20:00",
        scheduleTh: "18:00–20:00",
      },
      {
        name: "Пт — на английском (IGCSE / A Level)",
        nameEn: "Fri — in English (IGCSE / A Level)",
        nameTh: "ศุกร์ — ภาษาอังกฤษ (IGCSE / A Level)",
        ageLabel: "10–12 классы",
        ageLabelEn: "Grades 10–12",
        ageLabelTh: "ม.4–6",
        minAgeMonths: 180,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "18:00–20:00",
        scheduleEn: "18:00–20:00",
        scheduleTh: "18:00–20:00",
      },
      {
        name: "Вс — на тайском, к вступительным в среднюю школу",
        nameEn: "Sun — in Thai, lower-secondary entrance prep",
        nameTh: "อาทิตย์ — ภาษาไทย ติวสอบเข้า ม.1",
        ageLabel: "4–6 классы",
        ageLabelEn: "Grades 4–6",
        ageLabelTh: "ป.4–6",
        minAgeMonths: 108,
        maxAgeMonths: 144,
        parentRequired: null,
        schedule: "08:00–10:00",
        scheduleEn: "08:00–10:00",
        scheduleTh: "08:00–10:00",
      },
      {
        name: "Вс — на тайском, к вступительным в старшую школу",
        nameEn: "Sun — in Thai, upper-secondary entrance prep",
        nameTh: "อาทิตย์ — ภาษาไทย ติวสอบเข้า ม.4",
        ageLabel: "7–9 классы",
        ageLabelEn: "Grades 7–9",
        ageLabelTh: "ม.1–3",
        minAgeMonths: 144,
        maxAgeMonths: 180,
        parentRequired: null,
        schedule: "10:00–12:00",
        scheduleEn: "10:00–12:00",
        scheduleTh: "10:00–12:00",
      },
      {
        name: "Вс — на тайском, к вступительным в университет",
        nameEn: "Sun — in Thai, university entrance prep",
        nameTh: "อาทิตย์ — ภาษาไทย ติวสอบเข้ามหาวิทยาลัย",
        ageLabel: "10–12 классы",
        ageLabelEn: "Grades 10–12",
        ageLabelTh: "ม.4–6",
        minAgeMonths: 180,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "13:00–15:00",
        scheduleEn: "13:00–15:00",
        scheduleTh: "13:00–15:00",
      },
    ],
    categorySlugs: ["math"],
  },
  // STC Monkeys Taekwondo
  {
    slug: "stc-monkeys-taekwondo",
    nameEn: "Taekwondo at STC Monkeys",
    nameTh: "เทควันโด STC Monkeys Taekwondo",
    description:
      "STC Monkeys Taekwondo — детская команда тхэквондо в Паттайе. Тренировки идут три раза в неделю, в понедельник, среду и пятницу с 17:30 до 19:30 — по два часа, так что времени хватает и на учёбу, и на командные активности. Дни чередуются по темам: пхумсэ (формы), удары по лапам и мишеням, спарринг. Команда регулярно выступает на соревнованиях — от местных турниров до чемпионата Таиланда и международных юношеских стартов (осенью 2026 года — три золота на турнире в Хайнане, Китай), а ещё устраивает совместные поездки, например в аквапарк. Пробное занятие бесплатное. Объявления на тайском; цены не публикуют — уточняйте. Телефон: 084 121 1821, e-mail: monkeys.tkd@gmail.com, Facebook: facebook.com/STCMONKEYS.",
    descriptionEn:
      "STC Monkeys Taekwondo is a children's taekwondo team in Pattaya. Training runs three times a week — Monday, Wednesday and Friday, 17:30–19:30 — two hours each, leaving plenty of time for both learning and team activities. Days rotate by focus: poomsae (forms), kicking pads and targets, and sparring. The team competes regularly, from local events to the Thailand championships and international youth meets (in autumn 2026, three golds at a tournament in Hainan, China), and also goes on team outings, such as a water park trip. The trial class is free. Announcements are in Thai; prices aren't published — please ask. Phone: 084 121 1821, email: monkeys.tkd@gmail.com, Facebook: facebook.com/STCMONKEYS.",
    descriptionTh:
      "STC Monkeys Taekwondo ทีมเทควันโดเด็กในพัทยา เรียนวันจันทร์ พุธ ศุกร์ เวลา 17:30–19:30 น. วันละ 2 ชั่วโมง มีเวลาเรียนและทำกิจกรรมเต็มที่ แบ่งเป็นวันพุมเซ่ วันเตะเป้า และวันไฟต์ติ้ง ทีมส่งนักกีฬาลงแข่งขันสม่ำเสมอ ทั้งรายการในประเทศ ชิงแชมป์ประเทศไทย และรายการเยาวชนระดับนานาชาติ เช่น Free-Trade Port Cup 2026 ที่ไหหลำ ประเทศจีน (3 เหรียญทอง) และมีกิจกรรมทีม เช่น ทริปสวนน้ำ ทดลองเรียนฟรี ค่าเรียนกรุณาสอบถาม โทร 084 121 1821 อีเมล monkeys.tkd@gmail.com, Facebook: facebook.com/STCMONKEYS",
    tips: [
      {
        text: "Пробное занятие бесплатное.",
        textEn: "The trial class is free.",
        textTh: "ทดลองเรียนฟรี",
      },
      {
        text: "Тренировка длится два часа: 17:30–19:30.",
        textEn: "Each session lasts two hours (17:30–19:30).",
        textTh: "เรียนครั้งละ 2 ชั่วโมง (17:30–19:30 น.)",
      },
      {
        text: "Темы дней чередуются: пхумсэ, удары по мишеням и спарринг.",
        textEn: "Days rotate between poomsae, target kicking and sparring.",
        textTh: "แต่ละวันฝึกต่างกัน: พุมเซ่ เตะเป้า และไฟต์ติ้ง",
      },
      {
        text: "Команда регулярно ездит на турниры, в том числе за границу.",
        textEn: "The team regularly travels to tournaments, including abroad.",
        textTh: "ทีมเดินทางไปแข่งขันทั้งในและต่างประเทศ",
      },
    ],
    classes: [
      {
        name: "Пн, Ср и Пт",
        nameEn: "Mon, Wed & Fri",
        nameTh: "จันทร์ พุธ ศุกร์",
        ageLabel: "дети",
        ageLabelEn: "children",
        ageLabelTh: "เด็ก",
        minAgeMonths: 0,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "17:30–19:30",
        scheduleEn: "17:30–19:30",
        scheduleTh: "17:30–19:30",
      },
    ],
    categorySlugs: ["martial-arts"],
  },
  // Suan Son Sin (สอนศิลปะ สวน สอน ศิลป์ พัทยา) — рисование
  {
    slug: "suan-son-sin-art",
    nameEn: "Suan Son Sin Art School",
    nameTh: "สอนศิลปะ สวน สอน ศิลป์ พัทยา",
    description:
      "Художественная школа в доме с садом в посёлке Baan Suan Suwattana — Soi Noen Plub Wan (сой к Siam Country Club), за рынком Wanasin. Преподаватели — художники и дизайнеры с почти двадцатилетним опытом. Учат школьников и взрослых, можно без подготовки: рисунок по уровням — от геометрических фигур и светотени до натюрморта, пейзажа с перспективой и портрета, — теория цвета, акварель, гуашь, акрил, масло, батик, роспись камней и поделки. Для старших — подготовка к поступлению на факультеты живописи, архитектуры, дизайна интерьера и графического дизайна. Занятия только по выходным: в субботу и воскресенье с 9:00 до 12:00 и с 13:00 до 16:00, курс — 8 занятий за два месяца. В октябре 2026 года школа публиковала детские работы недели. Цены уточняйте. Телефон и LINE: 086 994 6537 (Kru Dong), второй преподаватель — 080 181 9551 (Kru Men), Facebook: «สอนศิลปะ สวน สอน ศิลป์ พัทยา».",
    descriptionEn:
      'An art school in a house with a garden in the Baan Suan Suwattana estate — Soi Noen Plub Wan (the soi to Siam Country Club), behind Wanasin market. The teachers are artists and designers with nearly twenty years of experience. It teaches school students and adults, no experience needed: drawing by levels — from geometric shapes and shading to still life, landscape with perspective and portraits — plus colour theory, watercolour, poster paint, acrylic, oil, batik, stone painting and crafts. Older students can prepare for admission to painting, architecture, interior design and graphic design faculties. Classes are on weekends only: Saturday and Sunday 9:00–12:00 and 13:00–16:00, with a course of 8 sessions over two months. In October 2026 the school was posting the children\'s work of the week. Please ask about prices. Phone and LINE: 086 994 6537 (Kru Dong), second teacher: 080 181 9551 (Kru Men), Facebook: "สอนศิลปะ สวน สอน ศิลป์ พัทยา".',
    descriptionTh:
      "โรงเรียนสอนศิลปะ สวน สอน ศิลป์ พัทยา บรรยากาศบ้านสวนร่มรื่น ในหมู่บ้านสวนสุวัฒนา ซอยเนินพลับหวาน (ซอยสยามคันทรีคลับ) หลังตลาดวนาสินธุ์ ครูผู้สอนมีประสบการณ์ด้านศิลปะและการออกแบบเกือบ 20 ปี สอนนักเรียนและบุคคลทั่วไป ไม่มีพื้นฐานก็เรียนได้ วาดเส้นแบ่งตามระดับ ตั้งแต่รูปทรงเรขาคณิตและแสงเงา ไปจนถึงหุ่นนิ่ง ทิวทัศน์และ perspective และภาพคนเหมือน ทฤษฎีสี สีน้ำ สีโปสเตอร์ สีอะคริลิก สีน้ำมัน บาติก เพ้นท์หิน และงาน craft สำหรับนักเรียนโตมีติวสอบเข้าคณะจิตรกรรม สถาปัตย์ มัณฑนศิลป์ และนิเทศศิลป์ เรียนเฉพาะวันเสาร์–อาทิตย์ รอบเช้า 9:00–12:00 น. และรอบบ่าย 13:00–16:00 น. คอร์สละ 8 ครั้ง ภายใน 2 เดือน ช่วงตุลาคม 2569 ทางโรงเรียนยังโพสต์ผลงานเด็ก ๆ ประจำสัปดาห์ กรุณาสอบถามค่าเรียน โทรและ LINE 086 994 6537 (ครูโด่ง) และ 080 181 9551 (ครูเม่น) Facebook: สอนศิลปะ สวน สอน ศิลป์ พัทยา",
    tips: [
      {
        text: "Занятия только по выходным, две смены: 9:00–12:00 и 13:00–16:00.",
        textEn:
          "Classes are on weekends only, in two sessions: 9:00–12:00 and 13:00–16:00.",
        textTh: "เรียนเฉพาะเสาร์–อาทิตย์ 2 รอบ 9:00–12:00 น. และ 13:00–16:00 น.",
      },
      {
        text: "Как найти: в Soi Noen Plub Wan ищите табличку посёлка Baan Suan Suwattana, охрана на въезде подскажет дорогу.",
        textEn:
          "Finding it: in Soi Noen Plub Wan look for the Baan Suan Suwattana estate sign; the guard at the entrance will show you the way.",
        textTh:
          "วิธีไป: ในซอยเนินพลับหวาน มองหาป้ายหมู่บ้านสวนสุวัฒนา เข้ามาได้เลย รปภ. จะบอกทาง",
      },
      {
        text: "Пропуски по курсу можно согласовать: по правилам школы — до 4 раз, предупредив сообщением или в LINE.",
        textEn:
          "Missed lessons can be arranged: school rules allow up to 4 absences if you message or LINE in advance.",
        textTh: "ลาหยุดได้ 4 ครั้งต่อคอร์ส โดยแจ้งทางข้อความหรือ LINE",
      },
      {
        text: "Для подготовки к поступлению нужны свои материалы: планшет A2, дюжина карандашей EE, ластик, канцелярский нож, 4 зажима и около 50 листов бумаги A2.",
        textEn:
          "For exam-prep courses bring your own kit: an A2 drawing board, a dozen EE pencils, an eraser, a cutter, 4 clips and about 50 sheets of A2 paper.",
        textTh:
          "คอร์สติวสอบเตรียมอุปกรณ์เอง: กระดานรองเขียน A2 ดินสอ EE 1 โหล ยางลบ คัตเตอร์ ตัวหนีบ 4 ตัว และกระดาษปรู๊ฟ A2 ประมาณ 50 แผ่น",
      },
    ],
    minAgeMonths: 72,
    categorySlugs: ["art"],
  },
  // Thanita Martial Arts — тхэквондо
  {
    slug: "thanita-martial-arts-nong-prue",
    nameEn: "Taekwondo at Thanita Gym",
    nameTh: "เทควันโด ยิมธนิตา มาสเชี่ยล อาร์ต พัทยา",
    description:
      "Thanita Gym (Thanita Martial Arts Pattaya) — детская школа тхэквондо на 2-м этаже небольшого торгового центра на Soi Khao Noi в Нонг Прыэ. Тренер — выпускник Института физического воспитания (по странице школы). Занимаются в основном дети школьного возраста: на фото с тренировок — группа детей в зале с матами; ученики ездят на соревнования. По справочнику pattaya-gym, кроме тхэквондо здесь учат хапкидо, пенчак-силату и кикбоксингу — уточняйте. До конца декабря 2026 года действует акция к новому семестру: при записи и оплате занятий — форма для тхэквондо, футболка команды и бесплатный вступительный взнос (всего на 1 900 ฿). Цены занятий не публикуются — уточняйте. Телефон: 085 553 5534, Facebook: thanitatkd.",
    descriptionEn:
      "Thanita Gym (Thanita Martial Arts Pattaya) is a children's taekwondo school on the 2nd floor of a small mall on Soi Khao Noi in Nong Prue. The coach is a graduate of the Institute of Physical Education (per the school's page). Most students are school-age children: training photos show a group of kids in a matted hall, and students travel to competitions. According to the pattaya-gym directory, hapkido, pencak silat and kickboxing are also taught — please check. Until the end of December 2026 there is a new-term offer: sign up and pay for classes to get a taekwondo uniform, a team shirt and a waived entry fee (1,900 ฿ in total). Class prices aren't published — please ask. Phone: 085 553 5534, Facebook: thanitatkd.",
    descriptionTh:
      "ยิมธนิตา มาสเชี่ยล อาร์ต พัทยา (ธนิตาเทควันโดพัทยา) โรงเรียนเทควันโดสำหรับเด็ก ชั้น 2 บนห้างย่านซอยเขาน้อย หนองปรือ อาจารย์ผู้สอนจบจากสถาบันการพลศึกษา (ตามเพจของโรงเรียน) นักเรียนส่วนใหญ่เป็นเด็กวัยเรียน และมีการส่งนักกีฬาเข้าร่วมการแข่งขัน ตามข้อมูลของ pattaya-gym นอกจากเทควันโดยังสอนฮับกิโด ปันจักสีลัต และคิกบ็อกซิ่ง — กรุณาสอบถาม ตั้งแต่วันนี้ถึงสิ้นเดือนธันวาคม 2569 มีโปรโมชั่นต้อนรับเปิดเทอม: สมัครและชำระค่าเรียนรับฟรีชุดเทควันโด เสื้อทีม และค่าแรกเข้า รวมมูลค่า 1,900 บาท ค่าเรียนไม่ได้ประกาศไว้ กรุณาสอบถาม โทร 085 553 5534 Facebook: thanitatkd",
    tips: [
      {
        text: "До конца декабря 2026 года при записи бесплатно дают форму (1 000 ฿), футболку команды (400 ฿) и не берут вступительный взнос (500 ฿) — по афише школы.",
        textEn:
          "Until the end of December 2026, new students get a free uniform (1,000 ฿) and team shirt (400 ฿), and the 500 ฿ entry fee is waived — per the school's poster.",
        textTh:
          "ถึงสิ้นเดือนธันวาคม 2569 สมัครเรียนรับฟรีชุดเทควันโด (1,000 บาท) เสื้อทีม (400 บาท) และไม่เสียค่าแรกเข้า (500 บาท) ตามโปสเตอร์ของโรงเรียน",
      },
      {
        text: "Ориентир — 2-й этаж торгового центра на Soi Khao Noi; связаться удобнее всего по телефону 085 553 5534.",
        textEn:
          "Landmark: 2nd floor of the mall on Soi Khao Noi; the easiest way to get in touch is by phone, 085 553 5534.",
        textTh:
          "จุดสังเกต: ชั้น 2 ห้างย่านซอยเขาน้อย ติดต่อสะดวกที่สุดทางโทรศัพท์ 085 553 5534",
      },
    ],
    categorySlugs: ["martial-arts"],
  },
  // THATA Basketball Clinic — баскетбол
  {
    slug: "thata-basketball-clinic-pattaya",
    nameEn: "THATA Basketball Clinic — Pattaya",
    nameTh: "สอนบาสเกตบอลพัทยา THATA Basketball Clinic (TTBC)",
    description:
      "Детские группы баскетбола от чонбурийской клиники THATA (TTBC) в Паттайе — в крытом зале-куполе школы Maryvit (Mariwit) Pattaya, район Наклуа. Занятия по субботам и воскресеньям, две смены по два часа: 13:00–15:00 — базовый курс для начинающих, 15:00–17:00. Курс для детей 6–15 лет: общая физподготовка, основы и техника баскетбола, игра с ровесниками; тренеры — с опытом в баскетболе больше 30 лет, набор круглый год. Первое пробное занятие бесплатное. Цены по выходным: 4 занятия за 60 дней — 2 000 ฿, 8 занятий — 3 800 ฿, 15 занятий за 30 дней — 3 200 ฿, разовое — 600 ฿; уточняйте. Ведут на тайском. Телефон: 081 246 0000 (клиника), 086 401 6164 (магазин THATA), LINE: @THATA-BC, Facebook: facebook.com/thataBasketballClinic, сайт: thatasport.com.",
    descriptionEn:
      "Kids' basketball groups run by the Chonburi-based THATA Basketball Clinic (TTBC) in Pattaya, in the indoor dome court at Maryvit (Mariwit) School Pattaya, Naklua. Classes are on Saturdays and Sundays in two 2-hour sessions: 13:00–15:00 (beginners' basics) and 15:00–17:00. The children's course is for ages 6–15: general fitness, basketball fundamentals and skills, and playing with peers; coaches have over 30 years of basketball experience, and enrolment is open all year. The first trial class is free. Weekend prices: 4 sessions within 60 days — 2,000 ฿, 8 sessions — 3,800 ฿, 15 sessions within 30 days — 3,200 ฿, single session — 600 ฿; please check. Lessons are in Thai. Phone: 081 246 0000 (clinic), 086 401 6164 (THATA shop), LINE: @THATA-BC, Facebook: facebook.com/thataBasketballClinic, website: thatasport.com.",
    descriptionTh:
      "THATA Basketball Clinic (TTBC) สาขาพัทยา สอนบาสเกตบอลสำหรับเด็กที่โดมสนามบาสเกตบอลในร่ม โรงเรียนมารีวิทย์ พัทยา (นาเกลือ) เรียนทุกวันเสาร์และอาทิตย์ 2 รอบ รอบละ 2 ชั่วโมง: 13:00–15:00 น. (คอร์สเริ่มต้นพื้นฐาน) และ 15:00–17:00 น. คอร์สเด็กอายุ 6–15 ปี เน้นพัฒนาร่างกาย พื้นฐานและทักษะบาสเกตบอล และความสนุกกับเพื่อน ๆ โค้ชมีประสบการณ์ด้านบาสเกตบอลกว่า 30 ปี เปิดรับสมัครตลอดปี ทดลองเรียนฟรี 1 ครั้ง ค่าคอร์สรอบเสาร์–อาทิตย์: 4 ครั้ง (อายุคอร์ส 60 วัน) 2,000 บาท 8 ครั้ง 3,800 บาท 15 ครั้ง (อายุคอร์ส 30 วัน) 3,200 บาท รายครั้ง 600 บาท กรุณาสอบถามอีกครั้ง สอนเป็นภาษาไทย โทร 081 246 0000 (คลินิก) 086 401 6164 (ร้าน THATA) LINE: @THATA-BC Facebook: facebook.com/thataBasketballClinic เว็บไซต์ thatasport.com",
    tips: [
      {
        text: "Первое пробное занятие бесплатное — по выходным в обе смены.",
        textEn: "The first trial class is free, on weekends in either session.",
        textTh: "ทดลองเรียนฟรี 1 ครั้ง วันเสาร์–อาทิตย์ ทั้งสองรอบ",
      },
      {
        text: "Новичкам — смена 13:00–15:00, это базовый курс.",
        textEn:
          "Beginners should come to the 13:00–15:00 session — it's the basics course.",
        textTh: "ผู้เริ่มต้นเรียนรอบ 13:00–15:00 น. ซึ่งเป็นคอร์สพื้นฐาน",
      },
      {
        text: "Братьям и сёстрам скидка 5 %, если оплачивать вместе; после двух курсов подряд дарят фирменную майку THATA.",
        textEn:
          "Siblings get 5% off when paid together; after two consecutive courses your child gets a free THATA jersey.",
        textTh:
          "พี่น้องได้ส่วนลด 5% เมื่อชำระพร้อมกัน และเรียนครบ 2 คอร์สรับเสื้อบาสเกตบอล THATA ฟรี",
      },
      {
        text: "Зал крытый (купол) — занятия идут и в жару, и в дождь.",
        textEn: "The court is indoors under a dome, so classes go ahead in heat or rain.",
        textTh: "สนามเป็นโดมในร่ม เรียนได้ทั้งหน้าร้อนและหน้าฝน",
      },
    ],
    minAgeMonths: 72,
    maxAgeMonths: 180,
    price: 2000,
    priceUnit: "/ 4 занятия",
    priceUnitEn: "/ 4 sessions",
    priceUnitTh: "/ 4 ครั้ง",
    classes: [
      {
        name: "Сб и Вс — базовый курс",
        nameEn: "Sat & Sun — basics",
        nameTh: "เสาร์–อาทิตย์ คอร์สพื้นฐาน",
        ageLabel: "6–15 лет",
        ageLabelEn: "6–15 years",
        ageLabelTh: "6–15 ปี",
        minAgeMonths: 72,
        maxAgeMonths: 180,
        parentRequired: null,
        schedule: "13:00–15:00",
        scheduleEn: "13:00–15:00",
        scheduleTh: "13:00–15:00",
      },
      {
        name: "Сб и Вс",
        nameEn: "Sat & Sun",
        nameTh: "เสาร์–อาทิตย์",
        ageLabel: "6–15 лет",
        ageLabelEn: "6–15 years",
        ageLabelTh: "6–15 ปี",
        minAgeMonths: 72,
        maxAgeMonths: 180,
        parentRequired: null,
        schedule: "15:00–17:00",
        scheduleEn: "15:00–17:00",
        scheduleTh: "15:00–17:00",
      },
    ],
    categorySlugs: ["sport"],
  },
  // Top One Pattaya
  {
    slug: "top-one-pattaya",
    nameEn: "Top One Pattaya — after-school tutoring",
    nameTh: "Top One Pattaya เรียนพิเศษ สอนพิเศษ",
    description:
      "Top One Pattaya — филиал тайской сети центров дополнительных занятий, в Центральной Паттайе, за гипермаркетом Nam Chai. Здесь подтягивают по школьным предметам: математика и английский — от детского сада до 12-го класса (М.6), естественные науки — с 1-го по 9-й класс (П.1–М.3), тайский язык — с детского сада до 6-го класса; для малышей есть ещё лепка из корейской глины. Отдельно — курсы подготовки к вступительным экзаменам в 7-й и 10-й классы (М.1 и М.4). Программа ориентирована на детей из тайских школ, занятия на тайском. Цены и расписание не публикуют — уточняйте. Телефон: 062 396 9499 или 091 798 2944, LINE: lin.ee/mdulyDX, Facebook: facebook.com/topone4you, сайт: toponeschool.com.",
    descriptionEn:
      "Top One Pattaya is a branch of a Thai chain of after-school tutoring centres in Central Pattaya, behind the Nam Chai hypermarket. It offers extra lessons in school subjects: maths and English from kindergarten to M.6 (Grade 12), science from P.1 to M.3 (Grades 1–9) and Thai from kindergarten to P.6; for younger children there's also Korean clay modelling. There are separate prep courses for the M.1 and M.4 (Grade 7 and Grade 10) entrance exams. The programme is aimed at children in Thai schools and lessons are in Thai. Prices and timetable aren't published — please ask. Phone: 062 396 9499 or 091 798 2944, LINE: lin.ee/mdulyDX, Facebook: facebook.com/topone4you, website: toponeschool.com.",
    descriptionTh:
      "Top One Pattaya ท็อปวันพัทยา สถาบันกวดวิชา หลังนำชัย พัทยากลาง ที่เดียวจบ ครบทุกวิชา: คณิตศาสตร์และภาษาอังกฤษ ตั้งแต่อนุบาลถึง ม.6 วิทยาศาสตร์ ป.1–ม.3 ภาษาไทย อนุบาลถึง ป.6 และปั้นดินเกาหลีสำหรับเด็กเล็ก มีคอร์สติวสอบเข้า ม.1 และ ม.4 ค่าเรียนและตารางเรียนกรุณาสอบถาม โทร 062 396 9499, 091 798 2944, LINE: lin.ee/mdulyDX, Facebook: facebook.com/topone4you, เว็บไซต์ toponeschool.com",
    tips: [
      {
        text: "Ориентир — за гипермаркетом Nam Chai в Центральной Паттайе.",
        textEn: "Landmark: behind the Nam Chai hypermarket in Central Pattaya.",
        textTh: "จุดสังเกต: หลังนำชัย พัทยากลาง",
      },
      {
        text: "Есть курсы подготовки к вступительным экзаменам в М.1 и М.4 — полезно, если ребёнок поступает в тайскую школу.",
        textEn:
          "There are prep courses for the M.1 and M.4 entrance exams — useful if your child is applying to a Thai school.",
        textTh: "มีคอร์สติวสอบเข้า ม.1 และ ม.4",
      },
      {
        text: "Все объявления только на тайском; спросите заранее, может ли преподаватель объяснять по-английски.",
        textEn:
          "All announcements are in Thai only; ask in advance whether a teacher can explain in English.",
        textTh: "ประกาศทั้งหมดเป็นภาษาไทย ผู้ปกครองต่างชาติควรสอบถามล่วงหน้า",
      },
    ],
    categorySlugs: ["math"],
  },
  // Tos Tennis Academy
  {
    slug: "tos-tennis-academy",
    nameEn: "Tos Tennis Academy",
    nameTh: "Tos Tennis Academy เทนนิสพัทยา",
    description:
      "Теннисная академия Tos Tennis для любого возраста и уровня — от малышей до юниоров, которые выступают на турнирах. С детьми работают по принципу «сначала удовольствие, потом техника»: много игр на корте, а с юниорами отрабатывают углы, высоту над сеткой и вращение. Занятия проходят на нескольких кортах: крытых — Tara Pattana и Greta Sport Club, открытых — Rugby School Thailand и Classic Sport Club; база на Chaiyapreuk Road, район Baan Suan Lalana. Форматы: индивидуальные тренировки, мини-группы, групповые занятия по выходным (10:00–12:00 и 13:00–15:00), теннисные лагеря и клиники. По прайсу академии (август 2025): индивидуально — 1200 ฿ в час на открытом корте и 1700 ฿ на крытом, в группе — 700–900 ฿ в час, занятие выходного дня — 1500–3000 ฿; уточняйте. Страницы ведут на английском и тайском. Телефон: 089 108 4402, LINE: @Tostennis, Facebook: Tos Tennis Academy (tostennis), Instagram: @tostennisacademy.",
    descriptionEn:
      'Tos Tennis Academy teaches all ages and levels — from little ones to juniors who play tournaments. With children the approach is "fun first, skills follow": lots of games on court, while juniors work on angles, net clearance and spin. Sessions run at several venues: indoor courts at Tara Pattana and Greta Sport Club, outdoor courts at Rugby School Thailand and Classic Sport Club; the base is on Chaiyapreuk Road near Baan Suan Lalana. Formats include private lessons, small groups, weekend group classes (10:00–12:00 and 13:00–15:00), tennis camps and clinics. Per the academy\'s price list (August 2025): private lessons 1,200 ฿ an hour outdoors and 1,700 ฿ indoors, group sessions 700–900 ฿ an hour, weekend classes 1,500–3,000 ฿ — please check. The academy posts in English and Thai. Phone: 089 108 4402, LINE: @Tostennis, Facebook: Tos Tennis Academy (tostennis), Instagram: @tostennisacademy.',
    descriptionTh:
      'Tos Tennis Academy สอนเทนนิสทุกวัยทุกระดับ ตั้งแต่เด็กเล็กจนถึงนักกีฬาเยาวชนที่ลงแข่งขัน สำหรับเด็กเน้น "สนุกก่อน แล้วทักษะจะตามมา" มีเกมบนคอร์ตมากมาย ส่วนนักกีฬาเยาวชนฝึกมุมตี ความสูงข้ามเน็ต และการตีสปิน เรียนได้หลายสนาม คอร์ตในร่ม Tara Pattana และ Greta Sport Club คอร์ตกลางแจ้ง Rugby School Thailand และ Classic Sport Club ฐานหลักอยู่ถนนชัยพฤกษ์ ย่านบ้านสวนลลนา มีทั้งเรียนส่วนตัว กลุ่มเล็ก คลาสกลุ่มวันเสาร์–อาทิตย์ (10:00–12:00 และ 13:00–15:00 น.) ค่ายเทนนิส และคลินิก ราคาตามโปสเตอร์ของอะคาเดมี (สิงหาคม 2025): เรียนส่วนตัวชั่วโมงละ 1,200 บาท (คอร์ตกลางแจ้ง) และ 1,700 บาท (คอร์ตในร่ม) เรียนกลุ่มชั่วโมงละ 700–900 บาท คลาสวันหยุด 1,500–3,000 บาท กรุณาสอบถามอีกครั้ง โทร 089 108 4402 LINE: @Tostennis Facebook: Tos Tennis Academy (tostennis) Instagram: @tostennisacademy',
    tips: [
      {
        text: "Пробное занятие можно попросить через комментарий или звонок: академия отвечает телефоном 089 108 4402.",
        textEn:
          "You can ask for a trial lesson by comment or phone: the academy replies with its number, 089 108 4402.",
        textTh: "ขอทดลองเรียนได้ทางคอมเมนต์หรือโทร 089 108 4402",
      },
      {
        text: "Крытый корт дороже: индивидуальное занятие — 1700 ฿ в час против 1200 ฿ на открытом (ответ академии, ноябрь 2025).",
        textEn:
          "Indoor courts cost more: a private lesson is 1,700 ฿ an hour versus 1,200 ฿ outdoors (the academy's reply, November 2025).",
        textTh:
          "คอร์ตในร่มราคาสูงกว่า เรียนส่วนตัวชั่วโมงละ 1,700 บาท คอร์ตกลางแจ้ง 1,200 บาท (ตามที่อะคาเดมีตอบ พ.ย. 2025)",
      },
      {
        text: "Площадок несколько — при записи уточните, на каком корте будет группа ребёнка.",
        textEn:
          "There are several venues — when booking, check which court your child's group uses.",
        textTh: "มีหลายสนาม ตอนสมัครควรถามว่ากลุ่มของเด็กเรียนที่คอร์ตไหน",
      },
      {
        text: "Групповые занятия по выходным идут в двух сменах: 10:00–12:00 и 13:00–15:00.",
        textEn: "Weekend group classes run in two sessions: 10:00–12:00 and 13:00–15:00.",
        textTh: "คลาสกลุ่มวันหยุดมี 2 รอบ 10:00–12:00 และ 13:00–15:00 น.",
      },
    ],
    price: 700,
    priceUnit: "/ час в группе",
    priceUnitEn: "/ hour, group",
    priceUnitTh: "/ ชั่วโมง (กลุ่ม)",
    categorySlugs: ["sport"],
    cover: "/images/activities/tos-tennis-academy.jpg",
  },
  // Venum Training Camp — муай-тай и BJJ для детей
  {
    slug: "venum-training-camp-kids",
    nameEn: "Kids' Muay Thai & BJJ at Venum Training Camp",
    nameTh: "มวยไทยและบราซิลเลียนยิวยิตสูสำหรับเด็ก Venum Training Camp",
    description:
      "Venum Training Camp — большой лагерь единоборств от бренда Venum на Soi Khopai 12 (район Thepprasit — Нонг Прыэ). Основная аудитория — взрослые и приезжие спортсмены, но в расписании есть постоянные детские группы. Muay Thai Kids — с понедельника по субботу, 17:30–18:30. Бразильское джиу-джитсу для детей — 17:00–18:30: в понедельник и среду группа начинающих и продолжающих в ги (кимоно), во вторник и четверг — продвинутые, в пятницу — без ги; по субботам 10:00–11:00 — джиу-джитсу без ги для всех возрастов. Тренеры лагеря работают с международной публикой, занятия идут на английском. Цены на детские занятия на официальных страницах не опубликованы — уточняйте при записи; в форме на сайте есть отдельная тема «Kids Classes». Телефон: 087 285 7699, email: vtc@venum.com, Facebook: facebook.com/VenumTrainingCamp, Instagram: @venumtrainingcamp, сайт: venumtrainingcamp.com.",
    descriptionEn:
      "Venum Training Camp is a large martial arts camp run by the Venum brand on Soi Khopai 12 (Thepprasit – Nong Prue area). Its main audience is adults and visiting athletes, but the timetable includes regular kids' classes. Muay Thai Kids runs Monday to Saturday, 17:30–18:30. Kids' Brazilian jiu-jitsu runs 17:00–18:30: Monday and Wednesday for beginners and intermediates in the gi, Tuesday and Thursday for advanced kids, Friday no-gi; on Saturdays 10:00–11:00 there's no-gi jiu-jitsu for all ages. The coaches work with an international crowd and classes are in English. Prices for kids' classes aren't published on the official pages — ask when booking; the website's contact form has a separate 'Kids Classes' topic. Phone: 087 285 7699, email: vtc@venum.com, Facebook: facebook.com/VenumTrainingCamp, Instagram: @venumtrainingcamp, website: venumtrainingcamp.com.",
    descriptionTh:
      "Venum Training Camp ค่ายศิลปะการต่อสู้ขนาดใหญ่ของแบรนด์ Venum ซอยโขดไผ่ 12 (ย่านเทพประสิทธิ์–หนองปรือ) ลูกค้าหลักเป็นผู้ใหญ่และนักกีฬาจากต่างประเทศ แต่ในตารางมีคลาสเด็กเป็นประจำ Muay Thai Kids วันจันทร์–เสาร์ 17:30–18:30 น. บราซิลเลียนยิวยิตสูสำหรับเด็ก 17:00–18:30 น. วันจันทร์และพุธเป็นกลุ่มเริ่มต้นและระดับกลางแบบใส่ชุด (Gi) วันอังคารและพฤหัสบดีเป็นกลุ่มขั้นสูง วันศุกร์แบบไม่ใส่ชุด (No-Gi) และวันเสาร์ 10:00–11:00 น. มียิวยิตสูแบบ No-Gi สำหรับทุกวัย โค้ชสอนนักเรียนนานาชาติ ใช้ภาษาอังกฤษ ไม่ได้ประกาศราคาคลาสเด็กบนช่องทางทางการ กรุณาสอบถามเมื่อจอง ในแบบฟอร์มบนเว็บไซต์มีหัวข้อ Kids Classes แยกไว้ โทร 087 285 7699 อีเมล vtc@venum.com Facebook: facebook.com/VenumTrainingCamp Instagram: @venumtrainingcamp เว็บไซต์ venumtrainingcamp.com",
    tips: [
      {
        text: "Для записи на детские занятия на сайте в форме связи выберите тему «Kids Classes» — так быстрее ответят именно про детей.",
        textEn:
          "To book kids' classes, pick the 'Kids Classes' topic in the website's contact form so the reply is about children's training.",
        textTh:
          "หากต้องการสมัครคลาสเด็ก เลือกหัวข้อ Kids Classes ในแบบฟอร์มติดต่อบนเว็บไซต์",
      },
      {
        text: "Для джиу-джитсу в будни нужна форма-ги (пн, ср, вт и чт), а пятница и суббота — занятия без ги, в спортивной одежде.",
        textEn:
          "Weekday BJJ (Mon–Thu) is in the gi; Friday and Saturday sessions are no-gi, in regular sportswear.",
        textTh:
          "ยิวยิตสูวันจันทร์–พฤหัสบดีใส่ชุด Gi ส่วนวันศุกร์และเสาร์เป็นแบบ No-Gi ใส่ชุดกีฬาธรรมดา",
      },
      {
        text: "Субботнее занятие 10:00–11:00 открыто для всех возрастов — удобный вариант попробовать джиу-джитсу.",
        textEn:
          "The Saturday 10:00–11:00 session is open to all ages — an easy way to try jiu-jitsu.",
        textTh:
          "คลาสวันเสาร์ 10:00–11:00 น. เปิดสำหรับทุกวัย เหมาะสำหรับลองเรียนยิวยิตสู",
      },
      {
        text: "По отзывам на странице Facebook, лагерь рекомендуют 98% из 388 оставивших отзыв.",
        textEn:
          "Per reviews on its Facebook page, 98% of 388 reviewers recommend the camp.",
        textTh: "จากรีวิวบน Facebook มีผู้แนะนำ 98% จาก 388 รีวิว",
      },
    ],
    classes: [
      {
        name: "Muay Thai Kids, Пн–Сб",
        nameEn: "Muay Thai Kids, Mon–Sat",
        nameTh: "Muay Thai Kids จันทร์–เสาร์",
        ageLabel: "дети",
        ageLabelEn: "kids",
        ageLabelTh: "เด็ก",
        minAgeMonths: 0,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "17:30–18:30",
        scheduleEn: "17:30–18:30",
        scheduleTh: "17:30–18:30",
      },
      {
        name: "BJJ Kids в ги, Пн и Ср",
        nameEn: "BJJ Kids gi, Mon & Wed",
        nameTh: "BJJ Kids (Gi) จันทร์–พุธ",
        ageLabel: "начинающие и продолжающие",
        ageLabelEn: "beginners & intermediate",
        ageLabelTh: "เริ่มต้นและระดับกลาง",
        minAgeMonths: 0,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "17:00–18:30",
        scheduleEn: "17:00–18:30",
        scheduleTh: "17:00–18:30",
      },
      {
        name: "BJJ Advanced Kids, Вт и Чт",
        nameEn: "BJJ Advanced Kids, Tue & Thu",
        nameTh: "BJJ Advanced Kids อังคาร–พฤหัส",
        ageLabel: "продвинутые",
        ageLabelEn: "advanced",
        ageLabelTh: "ขั้นสูง",
        minAgeMonths: 0,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "17:00–18:30",
        scheduleEn: "17:00–18:30",
        scheduleTh: "17:00–18:30",
      },
      {
        name: "BJJ Kids без ги, Пт",
        nameEn: "BJJ Kids no-gi, Fri",
        nameTh: "BJJ Kids (No-Gi) ศุกร์",
        ageLabel: "начинающие и продолжающие",
        ageLabelEn: "beginners & intermediate",
        ageLabelTh: "เริ่มต้นและระดับกลาง",
        minAgeMonths: 0,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "17:00–18:30",
        scheduleEn: "17:00–18:30",
        scheduleTh: "17:00–18:30",
      },
      {
        name: "Джиу-джитсу без ги, Сб",
        nameEn: "Jiu-jitsu no-gi, Sat",
        nameTh: "ยิวยิตสู No-Gi เสาร์",
        ageLabel: "все возрасты",
        ageLabelEn: "all ages",
        ageLabelTh: "ทุกวัย",
        minAgeMonths: 0,
        maxAgeMonths: 216,
        parentRequired: null,
        schedule: "10:00–11:00",
        scheduleEn: "10:00–11:00",
        scheduleTh: "10:00–11:00",
      },
    ],
    categorySlugs: ["martial-arts"],
  },
  // Wisdom Camps — каникулярные лагеря
  {
    slug: "wisdom-camps-rugby-school",
    nameEn: "Wisdom Camp at Rugby School Thailand — holiday camps",
    nameTh: "Wisdom Camp ค่ายปิดเทอม ณ Rugby School Thailand",
    description:
      "Каникулярные лагеря на кампусе международной школы Rugby School Thailand в Кхао Май Каэо (к востоку от Паттайи): 80 акров с бассейном, озёрами, лесом и крытым спортцентром. Лагеря проходят на Рождество, весной (Сонгкран) и летом; дети 7–12 лет, можно приезжать на день или жить в пансионе с воспитателями, медсёстрами и ночной сменой. В программе водные виды спорта (поло, сап-борды на озере), бушкрафт и походы, велосипед, спорт в зале, творчество, кино под открытым небом, дискотека и выезд в аквапарк. Всё на английском, переводчика нет — нужен хотя бы базовый уровень; в лагерь приезжают дети из разных стран. Ближайшие смены: Рождественский лагерь 15–20 декабря 2026 (новинка — «ночёвка» на две ночи для 6–8 лет, 17–19 декабря), весенний 4–10 апреля 2027, летний 27 июня – 10 июля 2027. Цены на Рождество — от 23 250 ฿ за дневной формат, от 25 000 ฿ с ночёвкой и от 28 350 ฿ с проживанием; уточняйте. Телефон: 061 418 0923, 033 141 800, e-mail: hello@wisdom.camp, Facebook: Wisdom Camp, сайт: wisdom.camp.",
    descriptionEn:
      "Holiday camps on the campus of Rugby School Thailand in Khao Mai Kaew (east of Pattaya): 80 acres with a pool, lakes, forest and an indoor sports centre. Camps run at Christmas, in spring (Songkran) and in summer for children aged 7–12, as day campers or boarders with house staff, nurses and a night crew. Activities include water sports (water polo, paddleboarding on the lake), bushcraft and hiking, mountain biking, indoor sports, arts and crafts, outdoor movie nights, a camp disco and a waterpark trip. Everything is in English with no interpreter, so children need at least basic English; campers come from many countries. Upcoming: Christmas Camp 15–20 December 2026 (new: a two-night Sleepover for ages 6–8, 17–19 December), Spring Camp 4–10 April 2027, Summer Camp 27 June – 10 July 2027. Christmas prices: from 23,250 ฿ for day camp, from 25,000 ฿ with the sleepover and from 28,350 ฿ residential — please check. Phone: 061 418 0923, 033 141 800, email: hello@wisdom.camp, Facebook: Wisdom Camp, website: wisdom.camp.",
    descriptionTh:
      "Wisdom Camp ค่ายปิดเทอมในพื้นที่โรงเรียนนานาชาติ Rugby School Thailand เขาไม้แก้ว (ทางตะวันออกของพัทยา) พื้นที่ 80 เอเคอร์ มีสระว่ายน้ำ ทะเลสาบ ป่า และศูนย์กีฬาในร่ม จัดช่วงคริสต์มาส ปิดเทอมเมษายน (สงกรานต์) และปิดเทอมฤดูร้อน สำหรับเด็กอายุ 7–12 ปี เลือกแบบไป–กลับหรือพักค้างคืน มีทีมดูแล พยาบาล และเจ้าหน้าที่กะกลางคืน กิจกรรมมีกีฬาทางน้ำ (โปโลน้ำ แพดเดิลบอร์ดในทะเลสาบ) บุชคราฟต์ เดินป่า ปั่นจักรยานเสือภูเขา กีฬาในร่ม ศิลปะประดิษฐ์ ดูหนังกลางแจ้ง ดิสโก้ และทริปสวนน้ำ ใช้ภาษาอังกฤษทั้งหมด ไม่มีล่าม เด็กควรมีภาษาอังกฤษพื้นฐาน และมีเด็กจากหลายประเทศเข้าร่วม รอบที่กำลังจะมาถึง: ค่ายคริสต์มาส 15–20 ธันวาคม 2569 (ใหม่: ค่ายค้างคืน 2 คืนสำหรับเด็ก 6–8 ปี 17–19 ธันวาคม) ค่ายเมษายน 4–10 เมษายน 2570 ค่ายฤดูร้อน 27 มิถุนายน – 10 กรกฎาคม 2570 ราคาค่ายคริสต์มาส: แบบไป–กลับเริ่มต้น 23,250 บาท แบบค้างคืนเริ่มต้น 25,000 บาท แบบพักประจำเริ่มต้น 28,350 บาท กรุณาสอบถามอีกครั้ง โทร 061 418 0923, 033 141 800 อีเมล hello@wisdom.camp Facebook: Wisdom Camp เว็บไซต์ wisdom.camp",
    tips: [
      {
        text: "Нужен хотя бы базовый английский: всё на английском, переводчика нет.",
        textEn:
          "Children need at least basic English: everything is in English and there is no interpreter.",
        textTh: "เด็กควรมีภาษาอังกฤษพื้นฐาน เพราะใช้ภาษาอังกฤษทั้งหมดและไม่มีล่าม",
      },
      {
        text: "Для первого опыта с ночёвкой есть короткий формат: на Рождество 2026 — две ночи для детей 6–8 лет, можно прийти с другом.",
        textEn:
          "For a first taste of sleeping away there's a short format: at Christmas 2026, two nights for ages 6–8, and friends can come together.",
        textTh:
          "สำหรับการค้างคืนครั้งแรก มีค่ายสั้น 2 คืนช่วงคริสต์มาส 2569 สำหรับเด็ก 6–8 ปี ชวนเพื่อนมาด้วยได้",
      },
      {
        text: "При записи нужны копия паспорта ребёнка и медицинская страховка; счёт приходит на e-mail, оплатить нужно в течение 48 часов. Скидка Early Bird — только первым 50 участникам.",
        textEn:
          "Registration requires a copy of the child's passport and medical insurance; the invoice comes by email and must be paid within 48 hours. Early Bird pricing is for the first 50 campers only.",
        textTh:
          "ตอนสมัครต้องแนบสำเนาพาสปอร์ตเด็กและประกันสุขภาพ ใบแจ้งหนี้ส่งทางอีเมล ต้องชำระภายใน 48 ชั่วโมง ราคา Early Bird สำหรับ 50 คนแรกเท่านั้น",
      },
      {
        text: "В день заезда можно заказать 90-минутную экскурсию по кампусу Rugby School Thailand.",
        textEn:
          "On drop-off day you can request a 90-minute tour of the Rugby School Thailand campus.",
        textTh:
          "วันส่งเด็กเข้าค่าย สามารถขอทัวร์ชมโรงเรียน Rugby School Thailand 90 นาทีได้",
      },
    ],
    minAgeMonths: 84,
    maxAgeMonths: 155,
    price: 23250,
    priceUnit: "/ неделя (дневной формат, Рождество 2026)",
    priceUnitEn: "/ week (day camp, Christmas 2026)",
    priceUnitTh: "/ สัปดาห์ (แบบไป–กลับ คริสต์มาส 2569)",
    classes: [
      {
        name: "Рождественский лагерь, 15–20 декабря 2026",
        nameEn: "Christmas Camp, 15–20 Dec 2026",
        nameTh: "ค่ายคริสต์มาส 15–20 ธ.ค. 2569",
        ageLabel: "7–12 лет",
        ageLabelEn: "7–12 years",
        ageLabelTh: "7–12 ปี",
        minAgeMonths: 84,
        maxAgeMonths: 155,
        parentRequired: false,
        schedule: "дневной или с проживанием",
        scheduleEn: "day or residential",
        scheduleTh: "ไป–กลับ หรือพักค้างคืน",
      },
      {
        name: "«Ночёвка», 17–19 декабря 2026",
        nameEn: "Sleepover Camp, 17–19 Dec 2026",
        nameTh: "ค่ายค้างคืน 17–19 ธ.ค. 2569",
        ageLabel: "6–8 лет",
        ageLabelEn: "6–8 years",
        ageLabelTh: "6–8 ปี",
        minAgeMonths: 72,
        maxAgeMonths: 107,
        parentRequired: false,
        schedule: "2 ночи",
        scheduleEn: "2 nights",
        scheduleTh: "2 คืน",
      },
      {
        name: "Весенний лагерь (Сонгкран), 4–10 апреля 2027",
        nameEn: "Spring Camp (Songkran), 4–10 Apr 2027",
        nameTh: "ค่ายสงกรานต์ 4–10 เม.ย. 2570",
        ageLabel: "7–12 лет",
        ageLabelEn: "7–12 years",
        ageLabelTh: "7–12 ปี",
        minAgeMonths: 84,
        maxAgeMonths: 155,
        parentRequired: false,
        schedule: "1 неделя",
        scheduleEn: "1 week",
        scheduleTh: "1 สัปดาห์",
      },
      {
        name: "Летний лагерь, 27 июня – 10 июля 2027",
        nameEn: "Summer Camp, 27 Jun – 10 Jul 2027",
        nameTh: "ค่ายฤดูร้อน 27 มิ.ย. – 10 ก.ค. 2570",
        ageLabel: "7–12 лет",
        ageLabelEn: "7–12 years",
        ageLabelTh: "7–12 ปี",
        minAgeMonths: 84,
        maxAgeMonths: 155,
        parentRequired: false,
        schedule: "1 или 2 недели",
        scheduleEn: "1 or 2 weeks",
        scheduleTh: "1 หรือ 2 สัปดาห์",
      },
    ],
    cover: "/images/activities/wisdom-camps-rugby-school.jpg",
    photos: [
      {
        url: "/images/activities/wisdom-camps-rugby-school-2.jpg",
        caption: "Бушкрафт в лесу",
      },
      {
        url: "/images/activities/wisdom-camps-rugby-school-3.jpg",
        caption: "Комната в пансионе",
      },
    ],
    photoRightsNote: "С официальной страницы: сайт лагеря wisdom.camp, 2026-11",
    photoSource: "PLACE_OWNER",
  },
  // Working Together — рисование для детей
  {
    slug: "working-together-art",
    nameEn: "Kids' art classes at Working Together",
    nameTh: "คลาสศิลปะเด็ก Working Together",
    description:
      "Working Together — детская художественная студия в комплексе Wonder Space (88/82, East Pattaya). Здесь не добиваются «самого красивого рисунка»: ребёнок сам выбирает, чем заняться, и работает в свободном стиле — лепит из лёгкой глины, рисует и пишет красками, мастерит поделки, собирает работы из смешанных материалов. Иногда занятия вырастают из увлечений детей: например, ученик два часа строил из бумаги и глины диораму по игре Roblox. Готовую работу каждый раз забирают домой. Бесплатное пробное занятие — 15 минут. Бывают и разовые мастер-классы и каникулярные лагеря (весной 2026 — арт-лагерь для 6–13 лет вместе с музеем Ripley's). Открыто: пн–пт 13:00–20:00, сб–вс 10:00–19:00, вторник — выходной. Цены на занятия не публикуют — уточняйте. Телефон: 095 951 1947, LINE: workingtogether, Facebook: Working Together — สอนศิลปะสำหรับเด็กพัทยา.",
    descriptionEn:
      "Working Together is a children's art studio at Wonder Space (88/82, East Pattaya). The aim isn't the \"prettiest picture\": children choose what to do and work freestyle — modelling with light clay, drawing and painting, crafts and mixed-media pieces. Sometimes projects grow out of kids' own interests — one student spent two hours building a paper-and-clay diorama based on Roblox. Children take their work home every time. There's a free 15-minute trial. The studio also runs one-off workshops and holiday camps (in spring 2026, an art camp for ages 6–13 with Ripley's museum). Open Mon–Fri 13:00–20:00, Sat–Sun 10:00–19:00, closed Tuesdays. Class prices aren't published — please ask. Phone: 095 951 1947, LINE: workingtogether, Facebook: Working Together — สอนศิลปะสำหรับเด็กพัทยา.",
    descriptionTh:
      "Working Together คลาสศิลปะสำหรับเด็กในโครงการ Wonder Space (88/82 พัทยาฝั่งตะวันออก) ไม่ได้เน้นให้วาดสวยที่สุด แต่ให้เด็กเลือกกิจกรรมที่สนใจได้แบบ Free Style & Free Idea ทั้งปั้นดินเบา วาดภาพระบายสี งานประดิษฐ์ และสื่อผสม บางครั้งผลงานเกิดจากสิ่งที่เด็กชอบ เช่น นักเรียนใช้เวลา 2 ชั่วโมงสร้างโมเดลฉากจากเกม Roblox ด้วยกระดาษและดินเบา ได้ผลงานกลับบ้านทุกครั้ง ทดลองเรียนฟรี 15 นาที มีเวิร์กช็อปพิเศษและค่ายช่วงปิดเทอม (ต้นปี 2026 มีค่ายศิลปะสำหรับเด็ก 6–13 ปี ร่วมกับพิพิธภัณฑ์ Ripley's) เปิด จันทร์–ศุกร์ 13.00–20.00 น. เสาร์–อาทิตย์ 10.00–19.00 น. หยุดวันอังคาร ค่าเรียนไม่ได้ประกาศ กรุณาสอบถาม โทร 095-951-1947 LINE: workingtogether Facebook: Working Together-สอนศิลปะสำหรับเด็กพัทยา",
    tips: [
      {
        text: "Пробное занятие бесплатное — 15 минут, работу ребёнок забирает с собой.",
        textEn: "The trial is free — 15 minutes, and your child takes the artwork home.",
        textTh: "ทดลองเรียนฟรี 15 นาที พร้อมรับผลงานกลับบ้าน",
      },
      {
        text: "По вторникам студия закрыта; в будни работает с 13:00 — удобно после школы.",
        textEn: "Closed on Tuesdays; on weekdays it opens at 13:00 — handy after school.",
        textTh: "หยุดวันอังคาร วันธรรมดาเปิด 13.00 น. สะดวกหลังเลิกเรียน",
      },
      {
        text: "Перед каникулами студия объявляет лагеря и мастер-классы — следите за страницей в Facebook.",
        textEn:
          "Before school holidays the studio announces camps and workshops — watch its Facebook page.",
        textTh: "ช่วงก่อนปิดเทอมมีประกาศค่ายและเวิร์กช็อป ติดตามได้ที่เพจ Facebook",
      },
      {
        text: "В том же комплексе Wonder Space — центр скрипки The Pattaya Violin Centre.",
        textEn: "The Pattaya Violin Centre is in the same Wonder Space complex.",
        textTh: "ในโครงการ Wonder Space เดียวกันมี The Pattaya Violin Centre",
      },
    ],
    categorySlugs: ["art"],
  },
];
