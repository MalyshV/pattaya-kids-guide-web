/**
 * Наполнение карточек из сбора 21.10.2026 — вторая партия (13.11.2026): все
 * опубликованные места, у которых на сайте оставалась пометка «[черновик]».
 * Описание RU/EN, «Полезно знать», часы, признаки, категории, цены, контакты;
 * тайский — в prisma/thai-content.json. Занос — prisma/add-harvest-fill-2026-11.ts
 * (заполняет только пустое: правки из админки не затирает).
 *
 * Источники прочитаны 13.11.2026: сайты и страницы самих мест (Facebook,
 * Instagram), свежие публикации; часы — с официальных страниц, а где их нет —
 * с карточки места на карте; цены — только с официальных страниц и прайсов.
 * Бытовые наблюдения из отзывов помечены в тексте словами «по отзывам».
 * Чего источники не говорят, того здесь нет: признак остаётся «уточняется»,
 * часы — пустыми. Сомнения и источники по каждому месту — в описании PR.
 * Места, похожие на закрытые или не детские, сюда не вошли — список в PR.
 */
import type { PlaceFill } from "../../src/lib/import/place-fill";

export const HARVEST_FILL_2026_11: readonly PlaceFill[] = [
  // Kid Soft Play
  {
    slug: "kid-soft-play-pattaya",
    description:
      "Небольшая крытая игровая в торговом центре Lotus's South Pattaya (бывший Tesco Lotus Pattaya Tai), в районе Тепразит. По отзывам, комната не большая, но в ней есть всё нужное для игр. Оплата почасовая, за ребёнка и отдельно за взрослого. По отзывам, за детьми постарше присматривают сотрудники, а с младенцами взрослый должен оставаться внутри. Удобный вариант на час, если вы и так приехали в магазин; своей страницы в соцсетях у игровой нет, поэтому детали лучше уточнять на месте.",
    descriptionEn:
      "A small indoor playroom in the Lotus's South Pattaya mall (formerly Tesco Lotus Pattaya Tai), in the Thepprasit area. According to reviews, the room is not big but has everything needed for play. You pay by the hour, for the child and separately for an accompanying adult. Reviews say staff keep an eye on older children, while babies need an adult with them inside. It is a handy option for an hour if you are at the mall anyway; the playroom has no social media page of its own, so check the details on site.",
    tips: [
      {
        text: "По отзывам, час игры стоит 150 ฿ за ребёнка и 50 ฿ за взрослого.",
        textEn:
          "According to reviews, an hour of play costs 150 ฿ per child and 50 ฿ per adult.",
      },
      {
        text: "По отзывам, с детьми постарше взрослому оставаться не обязательно — присматривают сотрудники; с младенцами нужно быть рядом.",
        textEn:
          "According to reviews, an adult does not have to stay with older children — staff keep an eye on them; babies need an adult nearby.",
      },
    ],
    hours: {
      MON: { open: "10:00", close: "19:50" },
      TUE: { open: "10:00", close: "19:50" },
      WED: { open: "10:00", close: "19:50" },
      THU: { open: "10:00", close: "19:50" },
      FRI: { open: "10:00", close: "19:50" },
      SAT: { open: "10:00", close: "19:50" },
      SUN: { open: "10:00", close: "19:50" },
    },
    flags: { indoor: true },
    categorySlugs: ["indoor-playground"],
  },
  // Bambini Baby Center
  {
    slug: "bambini-baby-center",
    description:
      "Детский центр в жёлтом угловом здании на Siam Country Club Rd, сразу за железнодорожным переездом (примерно 500 м от Сукхумвита). Под одной крышей — педиатрическая клиника, центр развития, консультации по грудному вскармливанию, магазин товаров для детей и, на втором этаже, Bambini Café с игровой зоной. Игровая рассчитана на малышей от 6 месяцев до 6 лет: развивающие игрушки и мягкая зона, рядом кафе с органической едой и напитками для детей и взрослых. Это скорее спокойное место для самых маленьких, чем большая игровая с горками. С 2026 года центр также ведёт плейгруппу для детей 18 месяцев – 3 лет.",
    descriptionEn:
      "A children's centre in a yellow corner building on Siam Country Club Rd, just past the railway crossing (about 500 m from Sukhumvit). Under one roof there is a paediatric clinic, a child development centre, breastfeeding consultations, a baby shop and, on the second floor, Bambini Café with a play area. The play area is meant for little ones from 6 months to 6 years: developmental toys and a soft zone, next to a café serving organic food and drinks for children and adults. It is a quiet spot for the very youngest rather than a big playground with slides. In 2026 the centre also runs a playgroup for children aged 18 months to 3 years.",
    tips: [
      {
        text: "Игровая зона — для детей от 6 месяцев до 6 лет; старшим там будет скучно.",
        textEn:
          "The play area is for children from 6 months to 6 years; older kids will find it too small.",
      },
      {
        text: "Центр просит приходить в игровую только здоровым детям: в том же здании идёт приём педиатра.",
        textEn:
          "The centre asks that only healthy children come to the play area: a paediatrician sees patients in the same building.",
      },
      {
        text: "Приём педиатра: пн–пт 17:00–20:00, сб–вс 12:00–20:00. Обследование развития — только по записи, оно занимает около часа.",
        textEn:
          "Paediatrician hours: Mon–Fri 17:00–20:00, Sat–Sun 12:00–20:00. Developmental assessments are by appointment only and take about an hour.",
      },
      {
        text: "Ориентир: с Сукхумвита сворачивайте в Soi Siam Country Club (напротив Index Living Mall), центр — на углу сразу за переездом, до рынка Jao Sua.",
        textEn:
          "Landmark: turn off Sukhumvit into Soi Siam Country Club (opposite Index Living Mall); the centre is on the corner just past the railway crossing, before Jao Sua market.",
      },
    ],
    hours: {
      MON: { open: "09:00", close: "20:00" },
      TUE: { open: "09:00", close: "20:00" },
      WED: { open: "09:00", close: "20:00" },
      THU: { open: "09:00", close: "20:00" },
      FRI: { open: "09:00", close: "20:00" },
      SAT: { open: "09:00", close: "20:00" },
      SUN: { open: "09:00", close: "20:00" },
    },
    flags: { indoor: true, hasFood: true },
    categorySlugs: ["cafe"],
    contacts: [
      { type: "website", value: "https://www.bambinibabywellness.com/" },
      { type: "facebook", value: "https://www.facebook.com/bambinibabywellness/" },
      { type: "phone", value: "080-542-4656" },
      { type: "line", value: "https://line.me/R/ti/p/%40bambinipattaya" },
      { type: "instagram", value: "https://www.instagram.com/bambini_baby_wellness" },
    ],
  },
  // Suan Banjong x Bunny Shake Cafe
  {
    slug: "bunny-shake-cafe",
    description:
      "Кафе в саду в Нонг Прыа, недалеко от крокодиловой фермы, — на Chaiyapornwithi Soi 21, вдоль мотовея. Сидеть можно по-разному: в зале с кондиционером, под деревьями в саду или у пруда. В меню — горячие блюда (тайская кухня вроде пад кра пао), суфле, торты, кофе и бабл-ти. Детям здесь есть чем заняться: по отзывам, в саду стоит детская площадка, есть крытая игровая комната с игрушками и пруд, где можно покормить рыб. Подходит, чтобы взрослым спокойно выпить кофе или пообедать, пока ребёнок играет рядом.",
    descriptionEn:
      "A garden café in Nong Prue, not far from the Pattaya Crocodile Farm, on Chaiyapornwithi Soi 21 along the motorway. You can sit in an air-conditioned room, under the trees in the garden or by the pond. The menu has savoury Thai dishes such as pad kra pao, soufflés, cakes, coffee and bubble tea. Children have things to do too: according to reviews, there is a playground in the garden, an indoor playroom with toys and a pond where you can feed the fish. A good option if the adults want a quiet coffee or lunch while the child plays nearby.",
    tips: [
      {
        text: "В выходные кафе бывает заполнено — стол можно забронировать и заказать еду заранее через сообщения на странице в Facebook.",
        textEn:
          "The café can get busy at weekends — you can book a table and pre-order food via messages on its Facebook page.",
      },
      {
        text: "Рядом с кафе удобная парковка.",
        textEn: "There is convenient parking at the café.",
      },
      {
        text: "По отзывам, оплата только наличными — возьмите с собой.",
        textEn: "According to reviews, it is cash only — bring some with you.",
      },
      {
        text: "По отзывам, рыб в пруду можно покормить — малышам это обычно нравится больше всего.",
        textEn:
          "According to reviews, you can feed the fish in the pond — small children usually like this most.",
      },
      {
        text: "Ориентир — крокодиловая ферма Паттайи: кафе недалеко от неё, у мотовея.",
        textEn:
          "Landmark: the Pattaya Crocodile Farm — the café is close to it, by the motorway.",
      },
    ],
    hours: {
      MON: { open: "09:00", close: "19:00" },
      TUE: { open: "09:00", close: "19:00" },
      WED: { open: "09:00", close: "19:00" },
      THU: { open: "09:00", close: "19:00" },
      FRI: { open: "09:00", close: "19:00" },
      SAT: { open: "09:00", close: "19:00" },
      SUN: { open: "09:00", close: "19:00" },
    },
    flags: {
      indoor: true,
      outdoor: true,
      hasAirCon: true,
      hasFood: true,
      hasParking: true,
      hasCafeSeating: true,
    },
    categorySlugs: ["cafe-kids-zone"],
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/suanbanjongxbunnyshakecafepattaya/",
      },
      { type: "phone", value: "087 743 0219" },
      { type: "line", value: "bunnyshakepattaya" },
    ],
  },
  // BumbleBee Cafe & Gallery
  {
    slug: "bumblebee-cafe-gallery",
    description:
      "Небольшое арт-кафе в Северной Паттайе, на Chaiyaphon Withi Soi 8: здесь приходят не столько за кофе, сколько порисовать. Можно расписать холст, тканевую сумку, футболку, маску или брелок, слепить фигурку из лёгкой глины, собрать мини-сад; иногда проходят отдельные мастер-классы, например кукла из глины. Рисовать можно и без опыта: преподаватель подскажет, картинку выбираете сами. Работают две смены — утренняя и дневная; заодно можно взять кофе, напитки и сладкое. Это скорее занятие для ребёнка, который любит рисовать и может посидеть за столом час-другой, чем игровое место.",
    descriptionEn:
      "A small art cafe in North Pattaya, on Chaiyaphon Withi Soi 8, where people come to paint rather than just for coffee. You can paint a canvas, a tote bag, a T-shirt, a mask or a keyring, model a figure from air-dry clay or put together a mini garden; occasional special workshops are held too, such as making a clay doll. No experience is needed: a teacher helps, and you choose the picture yourself. There are two sessions, morning and afternoon, and coffee, drinks and sweets are served. It suits a child who enjoys drawing and can sit at a table for an hour or two, rather than one who wants to run around.",
    tips: [
      { text: "По пятницам кафе закрыто.", textEn: "The cafe is closed on Fridays." },
      {
        text: "Рисование на холсте — от 399 ฿ (пост кафе, май 2025); мастер-класс по кукле из глины — 990 ฿, кукла уходит домой в акриловом боксе.",
        textEn:
          "Canvas painting starts from 399 ฿ (cafe post, May 2025); the clay doll workshop is 990 ฿, and the doll goes home in an acrylic box.",
      },
      {
        text: "Смены: утренняя 09:00–12:00 и дневная 13:00–18:00 — на большую картину закладывайте не меньше пары часов.",
        textEn:
          "Sessions: morning 09:00–12:00 and afternoon 13:00–18:00 — allow at least a couple of hours for a larger canvas.",
      },
      {
        text: "Машину можно поставить рядом с кафе.",
        textEn: "You can park right next to the cafe.",
      },
      {
        text: "Краски на ткани не всегда отстирываются — оденьте ребёнка в то, что не жалко.",
        textEn:
          "Fabric paint does not always wash out — dress your child in something you don't mind getting stained.",
      },
    ],
    hours: {
      MON: { open: "09:00", close: "18:00" },
      TUE: { open: "09:00", close: "18:00" },
      WED: { open: "09:00", close: "18:00" },
      THU: { open: "09:00", close: "18:00" },
      FRI: "closed",
      SAT: { open: "09:00", close: "18:00" },
      SUN: { open: "09:00", close: "18:00" },
    },
    flags: { indoor: true, hasFood: true, hasParking: true, hasCafeSeating: true },
    categorySlugs: ["cafe"],
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=100087433202646",
      },
      { type: "phone", value: "083 834 4400" },
    ],
  },
  // Ice-nee Bingsu & Cafe
  {
    slug: "ice-nee-bingsu-cafe",
    description:
      "Семейное кафе в Наклуа, на Pattaya-Naklua Road между сой 13 и 15. Главное в меню — бинсу, корейский десерт из тонкой молочной ледяной стружки с фруктами и топпингами; кроме него есть горячие блюда, супы, салаты и напитки, так что сюда можно прийти и позавтракать, и пообедать. Для малышей в зале есть сухой бассейн с шариками — пока взрослые едят, ребёнку есть чем заняться. По отзывам, в кафе чисто и уютно, цены умеренные. Хороший вариант, чтобы переждать жару с прохладным десертом.",
    descriptionEn:
      "A family café in Naklua, on Pattaya-Naklua Road between Soi 13 and 15. The menu is built around bingsu, the Korean dessert of finely shaved milk ice with fruit and toppings, but there are also hot dishes, soups, salads and drinks, so it works for breakfast or lunch too. Little ones have a ball pit to play in while the adults eat. Reviewers describe it as clean and cosy, with reasonable prices. A good way to sit out the midday heat over a cold dessert.",
    tips: [
      { text: "По вторникам кафе закрыто.", textEn: "The café is closed on Tuesdays." },
      {
        text: "Бинсу — от 79 ฿, блюда — от 59 ฿ (пост кафе, декабрь 2024).",
        textEn: "Bingsu from 79 ฿, dishes from 59 ฿ (café post, December 2024).",
      },
      {
        text: "Еду можно заказать с доставкой через LINE MAN и Grab Food.",
        textEn: "You can also order delivery via LINE MAN and Grab Food.",
      },
    ],
    hours: {
      MON: { open: "10:00", close: "20:00" },
      TUE: "closed",
      WED: { open: "10:00", close: "20:00" },
      THU: { open: "10:00", close: "20:00" },
      FRI: { open: "10:00", close: "20:00" },
      SAT: { open: "10:00", close: "20:00" },
      SUN: { open: "10:00", close: "20:00" },
    },
    flags: { indoor: true, hasFood: true },
    categorySlugs: ["cafe-kids-zone"],
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=100085191823387",
      },
      { type: "instagram", value: "https://www.instagram.com/iceneebingsucafe" },
      { type: "phone", value: "099 151 7990" },
    ],
  },
  // Outback Sports Bar & Restaurant
  {
    slug: "outback-mabprachan",
    description:
      "Ресторан и спорт-бар у озера Мабпрачан, в Восточной Паттайе (Pornprapanimit Soi 29). Днём это скорее семейный ресторан с большим садом: на улице — детская площадка с батутами и горками и игровой уголок, так что дети бегают, пока взрослые едят. Внутри — открытый зал с вентиляторами и экранами, где показывают спортивные трансляции, есть бильярд, по вечерам бывает живая музыка. Кухня международная — завтраки с 7 утра, стейки, швейцарские и европейские блюда, тайская еда; для детей есть отдельное меню и стульчики. Здесь же проводят детские дни рождения.",
    descriptionEn:
      "A restaurant and sports bar by Mabprachan Lake in East Pattaya (Pornprapanimit Soi 29). In the daytime it works more as a family restaurant with a big garden: outside there is a playground with trampolines and slides and a games corner, so children can run around while the adults eat. Indoors is an open-air room with fans and screens showing live sport, a pool table, and live music on some evenings. The food is international — breakfast from 7 am, steaks, Swiss and European dishes, Thai food — with a separate kids' menu and high chairs. Children's birthday parties are held here too.",
    tips: [
      {
        text: "С детьми удобнее приходить днём: вечером это прежде всего спорт-бар с трансляциями и живой музыкой.",
        textEn:
          "With children it is easier to come in the daytime: in the evening it is first of all a sports bar with live matches and music.",
      },
      {
        text: "Завтраки — с 7:00 до 14:00, обед и ужин — с 11:00 до 22:00.",
        textEn: "Breakfast is served 07:00–14:00, lunch and dinner 11:00–22:00.",
      },
      {
        text: "Площадка уличная — в жару лучше утром или ближе к вечеру; возьмите воду и головной убор.",
        textEn:
          "The playground is outdoors — in the heat, come in the morning or late afternoon, and bring water and a hat.",
      },
      {
        text: "Есть бесплатная парковка на месте.",
        textEn: "There is free on-site parking.",
      },
      {
        text: "Детский день рождения можно обсудить по телефону 098 349 9927.",
        textEn: "You can arrange a children's birthday party by phone on 098 349 9927.",
      },
    ],
    hours: {
      MON: { open: "07:00", close: "00:00" },
      TUE: { open: "07:00", close: "00:00" },
      WED: { open: "07:00", close: "00:00" },
      THU: { open: "07:00", close: "00:00" },
      FRI: { open: "07:00", close: "00:00" },
      SAT: { open: "07:00", close: "00:00" },
      SUN: { open: "07:00", close: "00:00" },
    },
    flags: {
      indoor: false,
      outdoor: true,
      hasFood: true,
      hasParking: true,
      hasCafeSeating: true,
      hasFans: true,
    },
    categorySlugs: ["cafe-kids-zone"],
    free: true,
    contacts: [
      { type: "website", value: "https://www.outback-mabprachan.com/" },
      { type: "facebook", value: "https://www.facebook.com/OutbackPattaya" },
      { type: "instagram", value: "https://www.instagram.com/outbacksportsbarthailand" },
      { type: "phone", value: "098 349 9927" },
    ],
  },
  // Rain Forest Cafe
  {
    slug: "rain-forest-cafe-pattaya",
    description:
      "Ресторан-кафе в тропическом саду на Сукхумвите у перекрёстка Чайяпхрук, напротив большой заправки PTT — пять минут от Джомтьена. В центре — большой пруд с карпами кои и небольшим водопадом, вокруг столики и диваны среди деревьев; есть и зал с кондиционером. Детям обычно нравится кормить рыб: пакетик корма продают на месте. Снаружи, на искусственной траве, — детский уголок с качелями и каруселью, рядом могут посидеть взрослые. В меню тайская и европейская кухня, выпечка, торты и мороженое; это место скорее для неспешного семейного обеда или ужина, чем для игровой.",
    descriptionEn:
      "A restaurant-café in a tropical garden on Sukhumvit Road by the Chaiyapruek intersection, opposite the large PTT petrol station — five minutes from Jomtien. At its centre is a big koi pond with a small waterfall, surrounded by tables and sofas among the trees; there is also an air-conditioned dining room. Children usually enjoy feeding the fish — bags of fish food are sold on site. Outside, on artificial grass, there is a small play corner with swings and a carousel, with seats for adults nearby. The menu covers Thai and Western dishes, bakery, cakes and ice cream; it suits an unhurried family lunch or dinner rather than a play session.",
    tips: [
      {
        text: "Корм для рыб — 10 ฿ за пакетик (по отзыву 2024). Рыбы сплываются быстро: сыпьте понемногу и держите малыша за руку у края пруда.",
        textEn:
          "Fish food is 10 ฿ a bag (per a 2024 review). The fish swarm fast: scatter it slowly and hold a toddler's hand at the pond's edge.",
      },
      { text: "По вторникам закрыто.", textEn: "Closed on Tuesdays." },
      {
        text: "В выходные и вечером столик у пруда лучше забронировать: 062 923 6322.",
        textEn: "On weekends and evenings, book a table by the pond: 062 923 6322.",
      },
      {
        text: "По отзывам, приятнее всего прийти ближе к вечеру, до заката: мягче солнце и меньше людей.",
        textEn:
          "According to reviews, late afternoon before sunset is nicest: softer sun and fewer people.",
      },
      {
        text: "Есть парковка и бесплатный Wi-Fi.",
        textEn: "There is parking and free Wi-Fi.",
      },
    ],
    hours: {
      MON: { open: "11:00", close: "22:00" },
      TUE: "closed",
      WED: { open: "11:00", close: "22:00" },
      THU: { open: "11:00", close: "22:00" },
      FRI: { open: "11:00", close: "22:00" },
      SAT: { open: "11:00", close: "22:00" },
      SUN: { open: "11:00", close: "22:00" },
    },
    flags: {
      indoor: true,
      outdoor: true,
      hasAirCon: true,
      hasFood: true,
      hasParking: true,
      hasWifi: true,
      hasCafeSeating: true,
      animalContact: true,
    },
    categorySlugs: ["cafe-kids-zone"],
    free: true,
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/RainForestCafePattaya" },
      { type: "phone", value: "062 923 6322" },
      { type: "line", value: "@aroypattaya" },
    ],
  },
  // Ban Amphur Beach
  {
    slug: "ban-amphur-beach",
    description:
      "Тихий городской пляж в районе Na Jomtien, примерно в 14 км к югу от центра Паттайи (с Сукхумвита — по Na Jomtien Soi 32, дорога около 20 минут). Полоса песка около 800 м лежит за волнорезами: у северного края — пирс, у южного — скалистый мыс. Вода у берега мелкая, в будни людей мало, в выходные заметно больше. Для детей главное — бесплатная игровая площадка у большой парковки: качели, горки, качалки, лазалки и уличные тренажёры. Вдоль пляжа идёт асфальтовая дорожка, можно погулять с коляской; лежаки берут в аренду, еду и напитки приносят из соседних кафе.",
    descriptionEn:
      "A quiet public beach in Na Jomtien, about 14 km south of central Pattaya (turn off Sukhumvit at Na Jomtien Soi 32; roughly a 20-minute drive). The 800 m strip of sand sits behind breakwaters, with a pier at the northern end and a rocky headland to the south. The water near the shore is shallow; weekdays are quiet, weekends noticeably busier. For children the main draw is the free playground next to the large car park: swings, slides, seesaws, climbing frames and outdoor exercise machines. A paved path runs along the beach, so a stroller works fine; sunbeds are for hire, and food and drinks come from the nearby cafes.",
    tips: [
      {
        text: "Тени почти нет: пальмы вдоль дорожки ещё молодые. Возьмите панаму, крем и воду или приходите утром либо ближе к закату.",
        textEn:
          "There is very little shade: the palms along the path are still young. Bring a hat, sunscreen and water, or come in the morning or towards sunset.",
      },
      {
        text: "Лежак стоит около 100 ฿ на день (по отзывам); еду заказывают у тех, кто сдаёт лежаки, или в соседнем кафе.",
        textEn:
          "A sunbed costs about 100 ฿ for the day (according to reviews); food is ordered from the sunbed vendors or a nearby cafe.",
      },
      {
        text: "Основные лежаки стоят далеко от кромки воды — если ребёнок плещется в море, лучше сидеть ближе к берегу.",
        textEn:
          "The main sunbed area is set well back from the waterline — if your child is paddling, it is better to sit closer to the shore.",
      },
      {
        text: "Площадка — у парковки, так что с машины до неё пара шагов. Вход на пляж и площадку бесплатный.",
        textEn:
          "The playground is right by the car park, a few steps from the car. The beach and playground are free.",
      },
      {
        text: "По отзывам, вода не везде чистая и мелкая далеко от берега — для малышей это скорее плюс, для плавания взрослым — минус.",
        textEn:
          "According to reviews, the water is not always clean and stays shallow far out — fine for toddlers, less so for adults who want to swim.",
      },
    ],
    flags: { outdoor: true, indoor: false, hasParking: true, hasFood: true },
    categorySlugs: ["playground"],
    free: true,
  },
  // Greta Resort & Sport Club
  {
    slug: "greta-resort-sport-club",
    description:
      "Загородный курорт и спортивный клуб в На Джомтьене, у дороги к храму Ват Ян (Wat Yansangwararam). Сейчас это прежде всего теннисный клуб: корты для обычного и пляжного тенниса, клубный дом, тайский ресторан и небольшой отель с бассейном; здесь регулярно проходят турниры. В старых русскоязычных обзорах место называли «фермой Грета»: на большой зелёной территории была бесплатная детская площадка, платная детская комната и тайские деревянные домики, а животных с фермы позже убрали. Есть ли детская площадка сейчас, официальные страницы не говорят. Добираться нужно на машине — заехать можно по пути к Ват Яну.",
    descriptionEn:
      "A countryside resort and sports club in Na Jomtien, on the road to Wat Yansangwararam (Wat Yan). Today it is above all a tennis club: tennis and beach-tennis courts, a clubhouse, a Thai restaurant and a small hotel with a pool, and it regularly hosts tournaments. Older Russian-language guides called it “Greta Farm”: the large green grounds had a free playground, a paid kids' room and traditional Thai wooden houses, and the farm animals were later removed. The official pages do not say whether the playground is still there. You need a car to get here — it is easy to combine with a visit to Wat Yan.",
    tips: [
      {
        text: "Перед поездкой ради детской площадки позвоните в клуб: 063 187 6331 — по официальным страницам её наличие не подтверждено.",
        textEn:
          "If you are going for the playground, call the club first: 063 187 6331 — the official pages do not confirm it.",
      },
      {
        text: "В дни турниров на территории много людей и машин — расписание публикуют на странице клуба в Facebook.",
        textEn:
          "On tournament days the grounds are busy — the schedule is posted on the club's Facebook page.",
      },
      {
        text: "Парковка большая (по отзывам).",
        textEn: "There is plenty of parking (according to reviews).",
      },
    ],
    flags: { outdoor: true, hasFood: true, hasParking: true },
    categorySlugs: ["playground"],
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/gretaresortandsportclub" },
      { type: "phone", value: "063 187 6331" },
    ],
  },
  // Jomtien Night Market
  {
    slug: "jomtien-night-market",
    description:
      "Вечерний рынок под открытым небом на Джомтьене, через дорогу от пляжа; вход отмечен большой мельницей в голландском стиле. Работает каждый день с 17:00 до 23:00: больше трёхсот лавок с уличной едой (гриль, морепродукты, сом там, тайские блинчики, фруктовые шейки, есть и европейская кухня) и сувенирами. Едят за общими столами, вечером на сцене играют группы и выступают танцоры; по отзывам, бывает детская дискотека. Прямо через дорогу, у пляжа, — огороженная детская площадка Angry Birds, так что ужин удобно совместить с прогулкой: дети играют, потом все идут к морю.",
    descriptionEn:
      "An open-air evening market in Jomtien, across the road from the beach; the entrance is marked by a large Dutch-style windmill. It opens daily from 17:00 to 23:00, with more than three hundred stalls selling street food (grills, seafood, som tam, Thai pancakes, fruit shakes, plus some European dishes) and souvenirs. You eat at shared tables, and in the evening there are bands and dancers on stage; according to reviews there is sometimes a kids' disco. Directly across the road, by the beach, is the fenced Angry Birds playground, so dinner combines easily with a walk: children play, and then everyone heads to the sea.",
    tips: [
      {
        text: "Столы общие: в пик (с 18:00) место приходится искать или подсаживаться. Чтобы сесть с видом на море, приходите к открытию.",
        textEn:
          "Tables are shared: at peak time (from 18:00) you may have to look for a seat or share. To sit with a sea view, come at opening time.",
      },
      {
        text: "Детская площадка Angry Birds — через дорогу, примерно в минуте ходьбы; она огорожена, вдоль забора стоят скамейки. По отзывам, часть снарядов изношена — проверьте, прежде чем пускать малыша.",
        textEn:
          "The Angry Birds playground is across the road, about a minute's walk; it is fenced, with benches along the fence. According to reviews some equipment is worn — check it before letting a toddler play.",
      },
      {
        text: "Над проходами есть шторы на случай ливня, а по отзывам, туалеты недавно обновили.",
        textEn:
          "The walkways have curtains that are pulled down in heavy rain, and according to reviews the toilets were recently renovated.",
      },
      {
        text: "Удобнее добраться на сонгтэо по Jomtien Beach Road — минут 15 от центра Паттайи.",
        textEn:
          "The easiest way to get there is by songthaew along Jomtien Beach Road — about 15 minutes from central Pattaya.",
      },
    ],
    hours: {
      MON: { open: "17:00", close: "23:00" },
      TUE: { open: "17:00", close: "23:00" },
      WED: { open: "17:00", close: "23:00" },
      THU: { open: "17:00", close: "23:00" },
      FRI: { open: "17:00", close: "23:00" },
      SAT: { open: "17:00", close: "23:00" },
      SUN: { open: "17:00", close: "23:00" },
    },
    flags: { indoor: false, outdoor: true, hasFood: true, hasCoveredArea: true },
    free: true,
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/Jomtien.Night.Market18" },
    ],
  },
  // Khao Mai Kaeo Reservoir Park
  {
    slug: "khao-mai-kaeo-reservoir-park",
    description:
      "Лесной заповедный участок у водохранилища в Кхао Май Кэо, примерно в 20 км к востоку от центра Паттайи. Это не городской парк с площадкой, а место для прогулки на природе: невысокие холмы, лес и сеть тропинок — от пологих дорожек до сложных трасс, которые любят трейлраннеры и маунтинбайкеры. У самого водохранилища, по отзывам, есть где посидеть и устроить пикник. С детьми постарше и в удобной обуви можно пройти короткий круг по лесу; с малышами — скорее выехать к воде с покрывалом. Инфраструктуры почти нет, всё нужное — вода, еда, защита от солнца — берите с собой.",
    descriptionEn:
      "A protected patch of forest by a reservoir in Khao Mai Kaeo, about 20 km east of central Pattaya. It is not a city park with a playground but a place for a walk in nature: low hills, woodland and a network of trails, from gentle paths to technical routes popular with trail runners and mountain bikers. By the reservoir itself, reviewers say, there are spots to sit and have a picnic. With older children in proper shoes you can walk a short loop through the forest; with little ones it is more of a trip to the water with a picnic blanket. There are hardly any facilities, so bring water, food and sun protection.",
    tips: [
      {
        text: "Приезжайте рано утром: прохладнее, и в лесу больше шансов увидеть птиц и животных.",
        textEn:
          "Come early in the morning: it is cooler, and you have a better chance of seeing birds and animals.",
      },
      {
        text: "Тропинки много раз пересекаются, легко заблудиться — держитесь известного маршрута или заранее скачайте трек.",
        textEn:
          "Trails cross many times and it is easy to get lost — stick to a known route or download a track beforehand.",
      },
      {
        text: "Берите воду, перекус и средство от солнца и комаров: кафе и магазинов в парке нет.",
        textEn:
          "Bring water, snacks, sunscreen and insect repellent: there are no cafés or shops in the park.",
      },
      {
        text: "Лучшее время — с ноября по февраль; в сентябре–октябре тропы размывает дождями.",
        textEn:
          "The best months are November to February; in September and October rain washes the trails out.",
      },
      {
        text: "Добираться удобнее на машине: у парка есть парковка. По отзывам, вдоль подъездной дороги бывает мусор.",
        textEn:
          "It is easiest to get there by car: there is a car park. According to reviews, there can be rubbish along the access road.",
      },
    ],
    hours: {
      MON: { open: "07:00", close: "19:00" },
      TUE: { open: "07:00", close: "19:00" },
      WED: { open: "07:00", close: "19:00" },
      THU: { open: "07:00", close: "19:00" },
      FRI: { open: "07:00", close: "19:00" },
      SAT: { open: "07:00", close: "19:00" },
      SUN: { open: "07:00", close: "19:00" },
    },
    flags: { outdoor: true, hasParking: true },
  },
  // Bang Lamung Wildlife Breeding Station
  {
    slug: "bang-lamung-wildlife-breeding-station",
    description:
      "Государственная станция разведения и содержания диких животных на юге Паттайи, примерно в 2 км от горы Khao Chi Chan с изображением Будды. Это не зоопарк с шоу, а место, где живут животные, изъятые у браконьеров и из незаконного содержания, — прежде всего гималайские медведи; по отзывам, на территории есть ещё олени и обезьяны. С ребёнком сюда едут спокойно погулять по ухоженной территории и посмотреть на медведей в вольерах. По отзывам, вход бесплатный, пожертвования — по желанию. Удобно совместить с поездкой к Khao Chi Chan.",
    descriptionEn:
      "A state-run wildlife breeding and care station in south Pattaya, about 2 km from Khao Chi Chan, the hillside Buddha image. It is not a zoo with shows but a place for animals confiscated from poachers and illegal owners — mostly Asiatic black bears; reviewers also mention deer and monkeys on the grounds. With a child, it is a quiet walk around well-kept grounds and a chance to watch the bears in their enclosures. According to reviews, entry is free and donations are optional. It pairs easily with a trip to Khao Chi Chan.",
    tips: [
      {
        text: "По отзывам, оленей на территории лучше не трогать и держаться от них на расстоянии — об этом предупреждают сотрудники.",
        textEn:
          "According to reviews, staff ask visitors to keep their distance from the deer roaming the grounds.",
      },
      {
        text: "По отзывам, медведей можно угостить фруктами или овощами — свежими, без сиропа и сладостей. Уточните правила у сотрудников на месте.",
        textEn:
          "According to reviews, you can offer the bears fresh fruit or vegetables — no syrup or sweets. Check the rules with staff on site.",
      },
      {
        text: "Гулять придётся на улице: возьмите головной убор, воду и удобную обувь; лучшее время — утро.",
        textEn:
          "The visit is all outdoors: bring hats, water and comfortable shoes; mornings are best.",
      },
      {
        text: "Официального сайта и часов работы нет; по отзывам, в отдельные периоды пускают только по выходным — лучше уточнить заранее.",
        textEn:
          "There is no official website or published opening hours; reviewers say public access is sometimes limited to weekends, so check before you go.",
      },
    ],
    flags: { outdoor: true, indoor: false },
  },
  // Camp Chang Adventure Park
  {
    slug: "camp-chang-adventure-park",
    description:
      "Парк активного отдыха со слонами у горы Кхао Чи Чан (Саттахип, к югу от Паттайи): заезд по сою Khao Malako — Wihan Sian, не доезжая до изображения Будды на скале. На территории живут слоны, в том числе слонёнок, козы, черепахи и крокодил; животных можно кормить. Кроме животных здесь ATV, зиплайн, стрельба из лука и тир, а также кафе Elephant Valley Café в домике на дереве посреди сада. Место задумано на полдня-день и рассчитано скорее на семьи со школьниками: часть развлечений взрослая. Парк предлагает и катание на слонах — решите заранее, нужен ли вам этот формат.",
    descriptionEn:
      "An outdoor adventure park with elephants near Khao Chi Chan (Sattahip, south of Pattaya): you reach it via Soi Khao Malako – Wihan Sian, just before the Buddha image carved into the cliff. The park keeps elephants, including a baby elephant, plus goats, tortoises and a crocodile, and you can feed the animals. Beyond the animals there are ATVs, a zipline, archery and a shooting range, as well as Elephant Valley Café, a treehouse café in a garden. It is set up for a half or full day and suits families with school-age children best, since some activities are adult-oriented. The park also offers elephant rides — decide in advance whether that is something you want.",
    tips: [
      {
        text: "Почти всё время проходит на улице: возьмите головные уборы, воду и крем от солнца.",
        textEn: "Almost everything happens outdoors: bring hats, water and sunscreen.",
      },
      {
        text: "Цены на активности на официальной странице не опубликованы — уточните заранее по телефону 094 030 2555 или 090 246 6555.",
        textEn:
          "Activity prices are not published on the official page — ask in advance by phone: 094 030 2555 or 090 246 6555.",
      },
      {
        text: "Рядом — изображение Будды на скале Кхао Чи Чан: их удобно совместить в одной поездке.",
        textEn:
          "The Khao Chi Chan cliff Buddha is next door, so the two are easy to combine in one trip.",
      },
    ],
    hours: {
      MON: { open: "09:00", close: "17:30" },
      TUE: { open: "09:00", close: "17:30" },
      WED: { open: "09:00", close: "17:30" },
      THU: { open: "09:00", close: "17:30" },
      FRI: { open: "09:00", close: "17:30" },
      SAT: { open: "09:00", close: "17:30" },
      SUN: { open: "09:00", close: "17:30" },
    },
    flags: { outdoor: true, animalContact: true, hasFood: true },
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/campchangadventure" },
      { type: "phone", value: "094 030 2555" },
    ],
  },
  // Capybara Coffee
  {
    slug: "capybara-coffee-pattaya",
    description:
      "Кафе с животными в центре Паттайи, филиал тайской сети Capybara Coffee (её кафе есть на Самуи, Пхангане, в Бангкоке, Чиангмае и на Пхукете). Главные здесь — капибары; по описанию сети, в её кафе живут также сурикаты, морские свинки, утки и птицы. За вход платят отдельно, детский билет вдвое дешевле взрослого, а напитки и угощение для капибар покупают на месте. Сеть пишет, что семьи с детьми — желанные гости; формат подойдёт ребёнку, который спокойно ведёт себя с животными и готов слушать правила персонала.",
    descriptionEn:
      "An animal café in central Pattaya, a branch of the Thai chain Capybara Coffee (it also has cafés on Koh Samui, Koh Phangan, in Bangkok, Chiang Mai and Phuket). Capybaras are the main attraction; according to the chain, its cafés also keep meerkats, guinea pigs, ducks and birds. Entry is paid separately, a child ticket is half the adult price, and drinks and capybara snacks are bought on site. The chain says families with children are always welcome; it suits a child who is calm around animals and happy to follow the staff's rules.",
    tips: [
      {
        text: "Угощение для капибар — 100 ฿; чтобы кормить, нужно купить один напиток (он не входит в билет). Напитки — от 80 ฿.",
        textEn:
          "Capybara snacks are 100 ฿; to feed them you need to buy one drink (not included in the ticket). Drinks start at 80 ฿.",
      },
      {
        text: "Часы работы на сайте сети не указаны — перед поездкой уточните по телефону +66 82 060 0768.",
        textEn:
          "The chain's website does not list opening hours — check by phone before you go: +66 82 060 0768.",
      },
      {
        text: "Для групп и праздников можно написать на bookings@capybaracoffeethailand.com.",
        textEn:
          "For groups and parties you can email bookings@capybaracoffeethailand.com.",
      },
    ],
    flags: { hasFood: true, animalContact: true },
    categorySlugs: ["cafe"],
    entryRows: [{ label: "Вход", labelEn: "Entry", child: 200, adult: 400 }],
    note: "Напитки и угощение для животных оплачиваются отдельно.",
    noteEn: "Drinks and animal snacks are paid separately.",
    contacts: [
      {
        type: "website",
        value: "https://www.capybaracoffeethailand.com/capybara-coffee-pattaya/",
      },
      { type: "phone", value: "+66 82 060 0768" },
      { type: "facebook", value: "https://www.facebook.com/capybaracoffeethailand" },
      { type: "instagram", value: "https://www.instagram.com/capybaracoffeethailand/" },
    ],
  },
  // Cat Sky Bar Cafe
  {
    slug: "cat-sky-bar-cafe",
    description:
      "Котокафе на 3-м этаже Royal Garden Plaza, торгового центра на Beach Road в Центральной Паттайе: окна выходят на море. Живёт около 30 кошек полутора десятков пород — бенгалы, сфинксы, шотландские, сиамские; кошки ручные и сами подходят к гостям. Вход платный, за человека: в цену входят носки, порция курицы, чтобы покормить кошек, и напиток; время внутри не ограничено. Хороший вариант на жаркий или дождливый час в помещении с ребёнком, которому интересны животные: кормить и гладить можно, брать кошек на руки — только с разрешения персонала.",
    descriptionEn:
      "A cat café on the 3rd floor of Royal Garden Plaza, the mall on Beach Road in Central Pattaya, with windows looking out over the sea. Around 30 cats of some fifteen breeds live here — Bengals, Sphynxes, Scottish Folds, Siamese — and they are tame and come up to guests on their own. Entry is paid per person and includes socks, a portion of chicken to feed the cats and a drink; there is no time limit. A good indoor option for a hot or rainy hour with a child who loves animals: you can feed and stroke the cats, but pick them up only with the staff's permission.",
    tips: [
      {
        text: "Вход — в носках (их выдают на входе); перед игрой с кошками моют руки.",
        textEn:
          "You go in wearing socks (handed out at the entrance), and wash your hands before playing with the cats.",
      },
      {
        text: "Кошек не берут на руки без разрешения персонала — объясните ребёнку заранее, что лучше дать кошке подойти самой.",
        textEn:
          "Cats are not picked up without staff permission — explain to your child beforehand that it is better to let a cat come to them.",
      },
      {
        text: "Цена и акции меняются: в 2025 году вместо обычных 250 ฿ была акция 199 ฿ — уточните по телефону 099 225 5577.",
        textEn:
          "Prices and promotions change: in 2025 there was a 199 ฿ promotion instead of the usual 250 ฿ — check by phone on 099 225 5577.",
      },
      {
        text: "Своих питомцев приносить нельзя.",
        textEn: "You cannot bring your own pets.",
      },
      {
        text: "Парковка — общая, торгового центра Royal Garden Plaza.",
        textEn: "Parking is the Royal Garden Plaza mall's shared car park.",
      },
    ],
    hours: {
      MON: { open: "11:00", close: "22:00" },
      TUE: { open: "11:00", close: "22:00" },
      WED: { open: "11:00", close: "22:00" },
      THU: { open: "11:00", close: "22:00" },
      FRI: { open: "11:00", close: "22:00" },
      SAT: { open: "11:00", close: "22:00" },
      SUN: { open: "11:00", close: "22:00" },
    },
    flags: { indoor: true, outdoor: false, hasParking: true, animalContact: true },
    entryRows: [
      {
        label: "Вход, без ограничения времени",
        labelEn: "Entry, no time limit",
        child: null,
        adult: 250,
      },
    ],
    note: "Цена за человека; включает носки, корм для кошек и напиток. Отдельной детской цены не нашли. Бывают акции.",
    noteEn:
      "Price per person; includes socks, cat treats and a drink. We found no separate child price. Promotions happen.",
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/Catsky.Pattaya" },
      { type: "line", value: "https://line.me/ti/p/XWYWDOv2mG" },
      { type: "phone", value: "099 225 5577" },
    ],
  },
  // Cat Meow 4289
  {
    slug: "cat-meow-4289",
    description:
      "Котокафе при питомнике мейн-кунов Mainecoon 4289 в районе Понг, восточнее Мабпрачана. Мейн-куны — самая крупная домашняя порода, и здесь их можно гладить, брать на руки и фотографировать; время в кошачьей зоне не ограничено. Вход оплачивается за человека, в цену входят напиток и одноразовые носки. За доплату можно зайти в отдельную зону Exotic: по словам кафе, там живут лисы, сурикаты, еноты, беличьи обезьянки и другие ручные животные. В кафе есть кофе и лёгкая выпечка, при нём работают кошачий груминг и гостиница, а питомник продаёт котят.",
    descriptionEn:
      "A cat café run by the Mainecoon 4289 cattery in the Pong area, east of Mabprachan. Maine Coons are the largest domestic cat breed, and here you can stroke them, hold them and take photos, with no time limit in the cat lounge. Entry is per person and includes a drink and a pair of disposable socks. For an extra fee you can also visit the separate Exotic zone, which the café says is home to foxes, meerkats, raccoons, squirrel monkeys and other tame animals. There is coffee and light bakery, the café also runs cat grooming and a cat hotel, and the cattery sells kittens.",
    tips: [
      {
        text: "Перед входом в кошачью зону моют руки и надевают выданные носки — они входят в цену билета.",
        textEn:
          "Before entering the cat lounge you wash your hands and put on the socks provided — they are included in the ticket.",
      },
      {
        text: "Правила кафе: не брать кошку на руки против её воли, не снимать со вспышкой, детям — не бегать и не кричать рядом со спящими кошками. Стоит обсудить это с ребёнком заранее.",
        textEn:
          "Café rules: don't pick up a cat against its will, no flash photography, and children shouldn't run or shout near sleeping cats. Worth talking this through with your child beforehand.",
      },
      {
        text: "Бронировать заранее не обязательно, но кафе советует записаться через сайт или LINE @catcafe4289.",
        textEn:
          "Booking ahead isn't required, but the café recommends reserving via its website or LINE @catcafe4289.",
      },
      {
        text: "Перед кафе есть парковка примерно на 30 машин.",
        textEn: "There is parking for about 30 cars in front of the café.",
      },
      {
        text: "Своих питомцев приводить можно, но играть с кошками кафе им не дают.",
        textEn:
          "You can bring your own pet, but it won't be allowed to play with the café's cats.",
      },
    ],
    hours: {
      MON: { open: "09:00", close: "18:30" },
      TUE: { open: "09:00", close: "18:30" },
      WED: { open: "09:00", close: "18:30" },
      THU: { open: "09:00", close: "18:30" },
      FRI: { open: "09:00", close: "18:30" },
      SAT: { open: "09:00", close: "18:30" },
      SUN: { open: "09:00", close: "18:30" },
    },
    flags: { indoor: true, hasFood: true, hasParking: true, animalContact: true },
    entryRows: [
      {
        label: "Кошачья зона: время без ограничений, напиток и носки",
        labelEn: "Cat lounge: unlimited time, a drink and socks",
        child: null,
        adult: 399,
      },
      {
        label: "Кошачья зона + зона Exotic",
        labelEn: "Cat lounge + Exotic zone",
        child: null,
        adult: 449,
      },
    ],
    note: "Цена — за человека; отдельный детский билет на сайте не указан.",
    noteEn: "Prices are per person; the website lists no separate child ticket.",
    contacts: [
      { type: "website", value: "https://mainecoon4289.com/" },
      { type: "facebook", value: "https://www.facebook.com/Mainecoon42895" },
      { type: "instagram", value: "https://www.instagram.com/mainecoon4289/" },
      { type: "line", value: "https://line.me/R/ti/p/@catcafe4289" },
      { type: "phone", value: "098-428-9445" },
    ],
  },
  // Chang Thai Thappraya Safari
  {
    slug: "chang-thai-thappraya-safari",
    description:
      "Парк активностей с животными в Понге, к востоку от Сукхумвита, в стороне от города — добираться на машине или такси. Главное здесь — слоны: их кормят и, по отзывам, на них катают. Кроме слонов, по отзывам и фото на странице парка, есть лошади (катание), змеи и тигр, которого можно погладить. Остальная часть программы — для подростков и взрослых: квадроциклы, багги, зиплайн и тир. Единого билета нет — платите за каждую выбранную активность отдельно. На всё уходит от пары часов до полудня.",
    descriptionEn:
      "An animal and activity park in Pong, east of Sukhumvit and away from the city — you need a car or a taxi to get there. The main draw is the elephants: visitors feed them and, according to reviews, ride them. Besides elephants, reviews and photos on the park's page show horses (riding), snakes and a tiger that visitors can pet. The rest of the programme is for teenagers and adults: ATVs, buggies, a zipline and a shooting range. There is no single ticket — you pay separately for each activity you choose. A visit takes from a couple of hours to half a day.",
    tips: [
      {
        text: "Платите за каждую активность отдельно — заранее решите, что выбираете для ребёнка.",
        textEn:
          "Each activity is paid separately — decide in advance what you will choose for your child.",
      },
      {
        text: "Лучше приезжать утром: днём жарко, а территория в основном под открытым небом.",
        textEn:
          "Come in the morning: it gets hot later, and most of the grounds are in the open.",
      },
      {
        text: "Наденьте закрытую обувь, которую не жалко запылить, возьмите воду и солнцезащитный крем.",
        textEn:
          "Wear closed shoes you don't mind getting dusty, and bring water and sunscreen.",
      },
      {
        text: "Квадроциклы, багги и тир — не для малышей; по отзывам, на квадроциклах бывают травмы.",
        textEn:
          "ATVs, buggies and the shooting range are not for small children; according to reviews, ATV injuries do happen.",
      },
      {
        text: "Город далеко — договоритесь о такси в обе стороны или берите машину.",
        textEn: "It is far from town — arrange a taxi both ways or come by car.",
      },
    ],
    hours: {
      MON: { open: "08:00", close: "18:00" },
      TUE: { open: "08:00", close: "18:00" },
      WED: { open: "08:00", close: "18:00" },
      THU: { open: "08:00", close: "18:00" },
      FRI: { open: "08:00", close: "18:00" },
      SAT: { open: "08:00", close: "18:00" },
      SUN: { open: "08:00", close: "18:00" },
    },
    flags: { outdoor: true, animalContact: true },
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=100063773311838",
      },
      {
        type: "instagram",
        value: "https://www.instagram.com/changthai_thappraya_official",
      },
      { type: "phone", value: "081 575 7554" },
    ],
  },
  // Chang Siam Zoo
  {
    slug: "chang-siam-zoo",
    description:
      "Туристический парк с животными в Нонгплалае, к северо-востоку от Паттайи; в продаже билетов встречается под названиями Chang Siam Park и Chang Siam Krating Lai. Главное здесь — слоны: катание на слоне по 10–30 минут, кормление и купание слонов. Кроме того, в программе — кормление тигров, шоу крокодилов и обезьян, катание в конной повозке, фото в тайских костюмах, квадроциклы. Это не зоопарк в привычном смысле, а площадка с шоу и аттракционами с участием животных; заранее посмотрите, какие из них вам подходят, — билеты продают пакетами с разным набором занятий. Добираться удобнее на такси или машине.",
    descriptionEn:
      "A tourist animal park in Nong Pla Lai, north-east of Pattaya; ticket sellers list it as Chang Siam Park or Chang Siam Krating Lai. Elephants are the main attraction: rides of 10–30 minutes, feeding and bathing elephants. The programme also includes tiger feeding, crocodile and monkey shows, a horse-cart ride, photos in Thai costume and ATV rides. It is not a zoo in the usual sense but a venue with animal shows and rides, so look through the activities beforehand and decide which suit you — tickets are sold as packages with different combinations. A taxi or car is the easiest way to get there.",
    tips: [
      {
        text: "Билеты продают пакетами: катание на слоне 10, 15, 20 или 30 минут, к нему по выбору — повозка, кормление тигров, шоу. Сравните состав, прежде чем покупать.",
        textEn:
          "Tickets come as packages: an elephant ride of 10, 15, 20 or 30 minutes, plus optional extras such as a cart ride, tiger feeding or shows. Compare what is included before you buy.",
      },
      {
        text: "Добираться — на такси или Grab: место за городом, общественного транспорта рядом нет.",
        textEn:
          "Get there by taxi or Grab: the park is out of town with no public transport nearby.",
      },
    ],
    flags: { outdoor: true, animalContact: true },
  },
  // Dog Club Pattaya
  {
    slug: "dog-club-pattaya",
    description:
      "Небольшое кафе с собаками в Южной Паттайе, в переулке Soi South Pattaya 11. По залу свободно ходят собаки разных пород — корги, французские бульдоги, самоеды, хаски, колли; их можно гладить и играть с ними без ограничения времени. Вход платный, в билет входят напиток, лакомство для собаки, полароидный снимок и пара носков. Детям ниже 90 см вход бесплатный, ростом 90–120 см — за полцены; место скорее для детей, которые уже спокойно ведут себя с крупными собаками, а малыши — только рядом со взрослым. Свою собаку приводить нельзя.",
    descriptionEn:
      "A small dog café in South Pattaya, on Soi South Pattaya 11. Dogs of several breeds — corgis, French bulldogs, Samoyeds, huskies, a collie — roam the room, and you can pet and play with them with no time limit. Entry is paid and includes a drink, a dog treat, a Polaroid photo and a pair of socks. Children under 90 cm get in free and those 90–120 cm pay half; it suits children who are already calm around big dogs, while toddlers should stay right next to an adult. You cannot bring your own dog.",
    tips: [
      { text: "По средам кафе закрыто.", textEn: "The café is closed on Wednesdays." },
      {
        text: "Носки дают на входе — в зал проходят без обуви.",
        textEn: "Socks are handed out at the entrance — you go in without shoes.",
      },
      {
        text: "Детям ниже 90 см вход бесплатный, но кафе просит, чтобы взрослый всё время был рядом.",
        textEn:
          "Children under 90 cm enter free, but the café asks that an adult stays close the whole time.",
      },
      {
        text: "Свою собаку приводить нельзя — правило безопасности кафе.",
        textEn: "Outside dogs are not allowed, for safety reasons.",
      },
      {
        text: "У кафе есть своя парковка на 8–10 машин.",
        textEn: "There is on-site parking for 8–10 cars.",
      },
    ],
    hours: {
      MON: { open: "11:00", close: "19:30" },
      TUE: { open: "11:00", close: "19:30" },
      WED: "closed",
      THU: { open: "11:00", close: "19:30" },
      FRI: { open: "11:00", close: "19:30" },
      SAT: { open: "11:00", close: "19:30" },
      SUN: { open: "11:00", close: "19:30" },
    },
    flags: { indoor: true, hasFood: true, hasParking: true, animalContact: true },
    entryRows: [
      {
        label: "Вход (напиток, лакомство для собаки, фото, носки)",
        labelEn: "Entry (drink, dog treat, photo, socks)",
        child: 150,
        adult: 300,
      },
    ],
    note: "Детский билет за полцены — рост 90–120 см; ниже 90 см бесплатно. Цены — из поста кафе, март 2026.",
    noteEn:
      "Half-price child ticket — height 90–120 cm; under 90 cm free. Prices from the café's post, March 2026.",
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=100063673312916",
      },
      { type: "phone", value: "097 227 7194" },
    ],
  },
  // Dog'C Blog Felicita
  {
    slug: "dogc-blog-felicita",
    description:
      "Кафе с кошками и собаками, которых взяли из приютов или подобрали после прежних хозяев (тайское название страницы — «кафе собак и кошек из вторых рук»). Находится на дороге вдоль железной дороги (Lieb Tang Rodfai Rd), недалеко от Плавучего рынка Паттайи. Внутри несколько зон: отдельная комната для кошек и зал, где можно поиграть с большими собаками; по отзывам, среди жильцов есть и коза. Животных, по отзывам, вычёсывают и следят за их здоровьем, они спокойные и привыкли к людям. Заходят к животным за отдельную плату, в кафе есть еда и напитки — хороший вариант для ребёнка, который любит животных, на час-полтора.",
    descriptionEn:
      "A café with cats and dogs taken in from shelters or left behind by previous owners (the Thai name of the page reads “second-hand dog and cat café”). It is on the road along the railway (Lieb Tang Rodfai Rd), not far from the Pattaya Floating Market. There are several zones: a separate cat room and a hall where you can play with large dogs; according to reviews, there is even a goat. Reviewers say the animals are groomed, well cared for, calm and used to people. Access to the animal zones is paid separately, and the café serves food and drinks — a good hour or so for a child who loves animals.",
    tips: [
      {
        text: "Угостить животных можно лакомством из кафе — маленький пакетик 100 ฿.",
        textEn:
          "You can treat the animals with snacks sold at the café — a small pack is 100 ฿.",
      },
      {
        text: "Своих питомцев приводить нельзя.",
        textEn: "You cannot bring your own pets.",
      },
      {
        text: "Собаки в зале крупные: малышей лучше держать за руку и спросить у персонала, к кому можно подходить.",
        textEn:
          "The dogs in the hall are large: keep small children close and ask staff which dogs are fine to approach.",
      },
      {
        text: "Ориентир — Плавучий рынок Паттайи: кафе на дороге вдоль железной дороги, неподалёку.",
        textEn:
          "Landmark: the Pattaya Floating Market — the café is nearby, on the road along the railway.",
      },
    ],
    flags: { indoor: true, hasFood: true, animalContact: true },
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/dogcblogfelicita/" },
      { type: "phone", value: "096 924 1655" },
    ],
  },
  // Farm Kratai Pattaya
  {
    slug: "farm-kratai-pattaya",
    description:
      "Небольшая кроличья ферма с кафе в сое Sukhumvit Pattaya 21. Вход бесплатный: можно погладить кроликов, морских свинок и черепах, а крольчат, по отзывам, детям дают подержать на руках. Животных можно покормить, а в кафе — напитки и простые закуски. Площадка под открытым небом, по отзывам — тенистая и просторная; посидеть можно на террасе. Место камерное, на час-полтора — хорошо зайти с малышом вечером, когда спадает жара. Ферма также продаёт крольчат и берёт их на передержку.",
    descriptionEn:
      "A small rabbit farm with a café on Soi Sukhumvit Pattaya 21. Entry is free: children can pet rabbits, guinea pigs and tortoises, and according to reviews they are allowed to hold the baby rabbits. You can feed the animals, and the café serves drinks and simple snacks. It is an open-air spot that reviewers describe as shady and spacious, with seating on a terrace. The place is small, good for an hour or so — a nice evening stop with a little one once the heat drops. The farm also sells baby rabbits and offers rabbit boarding.",
    tips: [
      {
        text: "По отзывам, лучше приходить после 16:00: не так жарко, дует ветерок.",
        textEn: "Reviewers suggest coming after 4 pm, when it is cooler and breezy.",
      },
      {
        text: "Вход свободный; в кафе можно взять напиток, а животных — покормить (стоимость корма уточните на месте).",
        textEn:
          "Entry is free; you can get a drink at the café and feed the animals (check the feed price on site).",
      },
      {
        text: "Еда в кафе — только напитки и закуски; на полноценный обед рассчитывать не стоит.",
        textEn: "The café only has drinks and snacks — don't count on a proper meal.",
      },
      {
        text: "После кроликов стоит помыть ребёнку руки — возьмите влажные салфетки.",
        textEn: "Wash your child's hands after handling the rabbits — bring wet wipes.",
      },
    ],
    hours: {
      MON: { open: "12:00", close: "22:30" },
      TUE: { open: "12:00", close: "22:30" },
      WED: { open: "12:00", close: "22:30" },
      THU: { open: "12:00", close: "22:30" },
      FRI: { open: "12:00", close: "22:30" },
      SAT: { open: "12:00", close: "22:30" },
      SUN: { open: "12:00", close: "22:30" },
    },
    flags: { outdoor: true, animalContact: true, hasFood: true, hasCafeSeating: true },
    free: true,
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=61551378407509",
      },
      { type: "phone", value: "099 258 3777" },
    ],
  },
  // Fox Haus (Twenty Twenty Fox)
  {
    slug: "fox-haus-bang-saray",
    description:
      "Кафе-пекарня в Банг Сарае на Сукхумвите, бывшее Twenty Twenty Fox: белое здание с залом под кондиционером и двор с садом, где можно посидеть на улице. Меню широкое — кофе, свежие соки, выпечка и торты, западная и тайская еда. Кафе называет себя семейным и pet friendly: со своей собакой пускают даже в зал с кондиционером. Своих животных для контакта у кафе, судя по официальной странице, нет — «с животными» здесь значит, что можно прийти со своим питомцем. По отзывам, во дворе много фотозон (шатёр, огород, пляжный навес), а в выходные бывает людно и еду приходится ждать.",
    descriptionEn:
      'A café and bakery in Bang Saray on Sukhumvit Road, formerly Twenty Twenty Fox: a white building with an air-conditioned room and a garden yard with outdoor seating. The menu is broad — coffee, fresh juices, pastries and cakes, Western and Thai food. The café calls itself family- and pet-friendly: dogs are welcome even in the air-conditioned room. Judging by its official page, it has no animals of its own to meet — "with animals" here means you can bring your own pet. Reviewers mention lots of photo spots in the yard (a tent, a vegetable garden, a beach hut), and say it can get busy at weekends, with a wait for food.',
    tips: [
      { text: "По вторникам кафе закрыто.", textEn: "The café is closed on Tuesdays." },
      {
        text: "Как доехать из Паттайи: проехать Нонг Нуч, развернуться под старым мостом Boon Thavorn; кафе — до нового военного учебного центра.",
        textEn:
          "Getting there from Pattaya: drive past Nong Nooch and make a U-turn under the old Boon Thavorn bridge; the café is just before the new military training centre.",
      },
      {
        text: "В профиле кафе указан детский класс по выпечке тортов и печенья — расписание и цену уточняйте по телефону или в LINE.",
        textEn:
          "The café's profile lists a kids' cake and cookie class — ask about dates and price by phone or LINE.",
      },
      {
        text: "По отзывам, в выходные бывает людно, а мест в зале с кондиционером немного.",
        textEn:
          "Reviewers say it gets busy at weekends, and seats in the air-conditioned room are limited.",
      },
    ],
    hours: {
      MON: { open: "09:00", close: "19:00" },
      TUE: "closed",
      WED: { open: "09:00", close: "19:00" },
      THU: { open: "09:00", close: "19:00" },
      FRI: { open: "09:00", close: "19:00" },
      SAT: { open: "09:00", close: "19:00" },
      SUN: { open: "09:00", close: "19:00" },
    },
    flags: {
      indoor: true,
      outdoor: true,
      hasAirCon: true,
      hasFood: true,
      hasCafeSeating: true,
    },
    categorySlugs: ["cafe"],
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/twentytwentyfox" },
      { type: "phone", value: "097-995-5509" },
      { type: "phone", value: "065-505-6266" },
      { type: "line", value: "nune_b" },
    ],
  },
  // Great & Grand Sweet Destination
  {
    slug: "great-grand-sweet-destination",
    description:
      "Парк-«кондитерская» в Нонг Пла Лай, к востоку от города: под открытым небом стоят огромные пряничные домики, рожки мороженого, леденцы и пончики, есть горка у «дерева из мармеладок», лестница из вафель и смотровая площадка на «кремовом» холме. Это в первую очередь место для прогулки и фотографий, а внутри — кафе в стиле американской закусочной с кондиционером, где продают мороженое многих вкусов, молочные коктейли и выпечку. Рядом работает Family Park Pattaya Sheep Farm (ферма с овцами и шоу), и билеты часто продают комбо на оба места. Для малышей и младших школьников здесь интереснее всего: яркие фигуры, горки, мороженое. Вход платный, детям до 3 лет — бесплатно.",
    descriptionEn:
      "A candy-themed park in Nong Pla Lai, east of the city: outdoors there are giant gingerbread houses, ice cream cones, lollipops and doughnuts, a slide at the 'jelly bean tree', a wafer staircase and a lookout on a 'frosting' hill. It is mainly a place to stroll and take photos; inside there is an air-conditioned café in American diner style selling ice cream in many flavours, milkshakes and pastries. Family Park Pattaya Sheep Farm (sheep and animal shows) is next to it, and tickets are often sold as a combo for both. It works best for toddlers and younger school-age children: bright figures, slides and ice cream. Entry is paid; children under 3 go free.",
    tips: [
      {
        text: "Почти всё под открытым небом и без тени — приезжайте к открытию или ближе к вечеру, возьмите панамы и воду.",
        textEn:
          "Almost everything is outdoors with little shade — come at opening time or late afternoon, and bring sun hats and water.",
      },
      {
        text: "Детский билет — для детей 3–10 лет, до 3 лет вход бесплатный.",
        textEn: "The child ticket is for ages 3–10; under-3s enter free.",
      },
      {
        text: "Если хотите заодно на ферму с овцами по соседству, берите комбо-билет — по условиям продавцов оба места нужно посетить в один день.",
        textEn:
          "If you also want the sheep farm next door, get a combo ticket — resellers say both places must be visited on the same day.",
      },
      {
        text: "Добираться удобнее на машине или такси: это за городом, в стороне от Сукхумвита.",
        textEn:
          "It is easiest by car or taxi: the park is out of town, away from Sukhumvit Road.",
      },
    ],
    hours: {
      MON: { open: "08:30", close: "18:00" },
      TUE: { open: "08:30", close: "18:00" },
      WED: { open: "08:30", close: "18:00" },
      THU: { open: "08:30", close: "18:00" },
      FRI: { open: "08:30", close: "18:00" },
      SAT: { open: "08:30", close: "18:00" },
      SUN: { open: "08:30", close: "18:00" },
    },
    flags: { outdoor: true, hasFood: true, hasAirCon: true, hasCafeSeating: true },
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/greatandgrandsweetdestination/",
      },
      { type: "phone", value: "097 469 9919" },
    ],
  },
  // Hong Hong Dog Cafe
  {
    slug: "hong-hong-dog-cafe",
    description:
      "Собачье кафе на North Pattaya Road, примерно в 200 метрах от Сукхумвита, не доезжая до Makro; само кафе называет себя первым собачьим кафе в Паттайе. Здесь живут собаки разных пород — от корги до хаски; первые приехали из Кореи, остальные родились уже здесь. Вход платный, в цену входит один напиток на выбор, и дальше можно сидеть и играть с собаками сколько захочется — время не ограничено. Помещение простое, без лишней мебели, а снаружи есть площадка с искусственным газоном, где собаки бегают вместе с гостями. Кроме напитков, подают лёгкие закуски. Детей пускают с родителями: малыш должен быть всё время рядом со взрослым.",
    descriptionEn:
      "A dog café on North Pattaya Road, about 200 metres from Sukhumvit, just before Makro; it calls itself the first dog café in Pattaya. Dogs of many breeds live here, from corgis to huskies — the first ones came from Korea and the rest were born here. You pay an entry fee that includes one drink of your choice, and then you can sit and play with the dogs for as long as you like, with no time limit. The room is simple, without much furniture, and outside there is an artificial-grass yard where the dogs run around with visitors. Besides drinks there are light snacks. Children come in with their parents and must stay close to an adult the whole time.",
    tips: [
      {
        text: "Дети до 2 лет проходят бесплатно; ребёнок должен быть всё время рядом со взрослым.",
        textEn:
          "Children under 2 enter free; a child must stay close to an adult at all times.",
      },
      {
        text: "Время не ограничено: заплатили за вход — сидите и играйте с собаками, сколько хочется.",
        textEn:
          "There is no time limit: once you have paid the entry, stay and play with the dogs as long as you like.",
      },
      { text: "Своих собак приводить нельзя.", textEn: "You cannot bring your own dog." },
      {
        text: "По отзывам, после обеда многие собаки крепко спят — с активными играми лучше приходить пораньше.",
        textEn:
          "According to reviews, many of the dogs are fast asleep in the afternoon — come earlier if you want them playful.",
      },
    ],
    hours: {
      MON: { open: "10:30", close: "20:00" },
      TUE: { open: "10:30", close: "20:00" },
      WED: { open: "10:30", close: "20:00" },
      THU: { open: "10:30", close: "20:00" },
      FRI: { open: "10:30", close: "20:00" },
      SAT: { open: "10:30", close: "20:00" },
      SUN: { open: "10:30", close: "20:00" },
    },
    flags: { indoor: true, hasFood: true, animalContact: true },
    categorySlugs: ["cafe"],
    entryRows: [
      {
        label: "Вход с одним напитком, без ограничения по времени",
        labelEn: "Entry with one drink, no time limit",
        child: 200,
        adult: 200,
      },
    ],
    note: "Цена за человека. Дети до 2 лет — бесплатно.",
    noteEn: "Price per person. Children under 2 enter free.",
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/HongHongCafePattaya" },
      { type: "instagram", value: "https://www.instagram.com/honghong_dogcafe/" },
      { type: "phone", value: "091 730 6131" },
    ],
  },
  // Khao Chi Chan Elephant Village
  {
    slug: "khao-chi-chan-elephant-village",
    description:
      "Слоновья деревня в На Чом Тхиан, к югу от Паттайи, — у горы Кхао Чи Чан с золотым изображением Будды на скале, почти напротив Viharn Sien. Здесь кормят слонов и крокодилов и катаются на слонах по лесной тропе; для групп и школ проводят экскурсии. В 2024 году деревня получила от Департамента животноводства Таиланда сертификат стандарта GAP для слоновьих лагерей. Обратите внимание: здесь есть катание на слонах, которое многие защитники животных не одобряют, — если для вас это важно, можно ограничиться кормлением. По отзывам, территория чистая и зелёная, есть просторная парковка.",
    descriptionEn:
      "An elephant village in Na Jomtien, south of Pattaya — by Khao Chi Chan hill with the golden Buddha image on the cliff, almost opposite Viharn Sien. Visitors feed elephants and crocodiles and ride elephants along a forest trail; tours are arranged for groups and schools. In 2024 the village received the GAP elephant-camp standard certificate from Thailand's Department of Livestock Development. Note that elephant riding is offered here, which many animal-welfare groups discourage — if that matters to you, you can stick to feeding. Reviewers describe the grounds as clean and green, with plenty of parking.",
    tips: [
      {
        text: "Цены на сайте и в соцсетях не опубликованы — уточните по телефону 096-747-4663 или 081-377-7698 до поездки.",
        textEn:
          "Prices aren't published online — check by phone at 096-747-4663 or 081-377-7698 before you go.",
      },
      {
        text: "Наденьте закрытую обувь и одежду, которую не жалко испачкать.",
        textEn: "Wear closed shoes and clothes you don't mind getting dirty.",
      },
      {
        text: "Рядом — Viharn Sien, Swiss Sheep Farm и смотровая у Будды на скале Кхао Чи Чан: удобно объединить в одну поездку.",
        textEn:
          "Viharn Sien, Swiss Sheep Farm and the Khao Chi Chan Buddha cliff are nearby — easy to combine into one trip.",
      },
      {
        text: "Добираться удобнее на машине или такси: от центра Паттайи — около 30–40 минут.",
        textEn: "It's easiest by car or taxi: about 30–40 minutes from central Pattaya.",
      },
    ],
    hours: {
      MON: { open: "08:30", close: "17:30" },
      TUE: { open: "08:30", close: "17:30" },
      WED: { open: "08:30", close: "17:30" },
      THU: { open: "08:30", close: "17:30" },
      FRI: { open: "08:30", close: "17:30" },
      SAT: { open: "08:30", close: "17:30" },
      SUN: { open: "08:30", close: "17:30" },
    },
    flags: { outdoor: true, hasParking: true, animalContact: true },
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/pattayaelephanttrekking" },
      { type: "phone", value: "096-747-4663" },
      { type: "phone", value: "081-377-7698" },
    ],
  },
  // Little Fields
  {
    slug: "little-fields-pattaya",
    description:
      "Маленькая детская ферма в Понге, в зелени к востоку от города, работающая с 2019 года: здесь дети бегают на воле, трогают землю, возятся в грязи на специальной площадке и знакомятся с природой руками. После перерыва ферма открывается заново — мягкое открытие назначено на 21 ноября 2026 года. Обещают сохранить прежнюю «детскую ферму» — площадку для игр в грязи, детские занятия и обучение через природу — и добавить творческие мастер-классы и wellness-программы (йога, саунд-хилинг) для взрослых, чтобы приезжать можно было всей семьёй. Территория — сад и поле под открытым небом.",
    descriptionEn:
      "A small children's farm in Pong, in the green countryside east of the city, running since 2019: kids play freely outdoors, get muddy on a dedicated mud play area and learn about nature hands-on. After a break the farm is reopening — a soft opening is set for 21 November 2026. The plan is to keep the familiar children's farm — the mud play area, kids' activities and learning through nature — and add creative workshops and wellness sessions (yoga, sound healing) for adults, so the whole family can come together. The grounds are an open-air garden and field.",
    tips: [
      {
        text: "Мягкое открытие — 21 ноября 2026 года, 09:00–17:00. Программу для детей ферма присылает в сообщениях страницы в Facebook — спросите заранее.",
        textEn:
          "Soft opening: 21 November 2026, 09:00–17:00. The farm sends details of the kids' programme via its Facebook page messages — ask in advance.",
      },
      {
        text: "Возьмите ребёнку сменную одежду и обувь, которую не жалко: на ферме есть площадка для игр в грязи.",
        textEn:
          "Bring a change of clothes and shoes you don't mind getting dirty: the farm has a mud play area.",
      },
      {
        text: "Почти всё время — на улице: шляпа, крем от солнца, репеллент и вода пригодятся.",
        textEn:
          "Most of the time is spent outdoors: bring a hat, sunscreen, insect repellent and water.",
      },
      {
        text: "Ферма за городом, в Понге — удобнее всего ехать на машине.",
        textEn: "The farm is out of town in Pong — it's easiest to get there by car.",
      },
    ],
    flags: { outdoor: true },
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/littlefieldspattaya" },
      { type: "phone", value: "065 636 4990" },
    ],
  },
  // Le Refuge Cafe & Animal Sanctuary
  {
    slug: "le-refuge-pattaya",
    description:
      "Кафе с садом и приютом для спасённых экзотических животных в Понге, на трассе 3240. Здесь живут обезьяны (капуцины, саймири, мартышки Кэмпбелла), еноты, козы, черепахи, рептилии и ара; кто именно на виду, зависит от дня. Это не контактный зоопарк: животных не трогают и не кормят, у вольеров ведут себя тихо — приют ставит их благополучие на первое место, а входная плата идёт на их содержание. Обход вольеров проводят на английском, французском и тайском. После можно посидеть в кафе в тропическом саду: бранчи, боулы, тайская еда, детские блюда, смузи и десерты.",
    descriptionEn:
      "A café with a garden and a sanctuary for rescued exotic animals in Pong, on Highway 3240. Residents include monkeys (capuchins, squirrel monkeys, Campbell's monkeys), raccoons, goats, tortoises, reptiles and a macaw; who is out on view depends on the day. This is not a petting zoo: you don't touch or feed the animals, and you keep quiet near the enclosures — the sanctuary puts their welfare first, and the entry fee goes towards their care. Visits are guided in English, French and Thai. Afterwards you can sit in the café in the tropical garden: brunch, bowls, Thai food, kids' dishes, smoothies and desserts.",
    tips: [
      {
        text: "Правила приюта: животных не трогать и не кормить, у вольеров двигаться спокойно и говорить тихо — стоит обсудить с ребёнком заранее.",
        textEn:
          "Sanctuary rules: don't touch or feed the animals, move calmly and speak quietly near the enclosures — worth talking through with your child beforehand.",
      },
      {
        text: "Зона животных закрывается в 18:00, кафе — в 19:00.",
        textEn: "The animal area closes at 18:00, the café at 19:00.",
      },
      {
        text: "Перед визитом приют просит написать в LINE (@292bqmqn) — так можно уточнить, кто из животных будет на виду.",
        textEn:
          "The sanctuary asks you to message on LINE (@292bqmqn) before visiting — a good way to check which animals will be out.",
      },
      {
        text: "Для семьи из четырёх человек действует скидка 15% на вход — покажите предложение с сайта на месте.",
        textEn:
          "A family of four gets 15% off entry — show the offer from the website on arrival.",
      },
    ],
    hours: {
      MON: "closed",
      TUE: { open: "10:00", close: "19:00" },
      WED: { open: "10:00", close: "19:00" },
      THU: { open: "10:00", close: "19:00" },
      FRI: { open: "10:00", close: "19:00" },
      SAT: { open: "10:00", close: "19:00" },
      SUN: { open: "10:00", close: "19:00" },
    },
    flags: {
      outdoor: true,
      indoor: false,
      hasFood: true,
      hasCafeSeating: true,
      animalContact: false,
    },
    entryRows: [
      { label: "Вход в приют", labelEn: "Sanctuary entry", child: 150, adult: 300 },
    ],
    note: "Семье из четырёх человек — скидка 15% (по предложению на сайте, подтверждается на месте).",
    noteEn: "A family of four gets 15% off (offer from the website, confirmed on site).",
    contacts: [
      { type: "website", value: "https://tarzandz.com/pages/le-refuge-pattaya" },
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=61591338422790",
      },
      { type: "instagram", value: "https://www.instagram.com/lerefugecafeanimal" },
      { type: "line", value: "https://line.me/R/ti/p/@292bqmqn" },
      { type: "phone", value: "093 325 0233" },
    ],
  },
  // Loftbit Park
  {
    slug: "loftbit-park",
    description:
      "Тайский ресторан с садом и маленьким зоопарком в Нонг Пла Лай, к востоку от Сукхумвита — у дороги вдоль железной дороги. Сюда приезжают семьями: пока взрослые обедают, дети ходят в загон к кроликам — их здесь много, можно гладить и фотографировать. Ещё в мини-зоопарке живут утки, птицы и мыши, а в большом пруду — карпы, которых можно покормить. Есть уличная детская площадка с горками и качелями и небольшая крытая игровая. Сидеть можно в зале с кондиционером, откуда виден пруд, или в саду под большими деревьями. Вход бесплатный, платите только за еду; в меню — морепродукты и тайская кухня.",
    descriptionEn:
      "A Thai restaurant with a garden and a small zoo in Nong Pla Lai, east of Sukhumvit, by the road along the railway. Families come here because while the adults eat, the children can go into the rabbit enclosure — there are lots of rabbits to stroke and photograph. The mini zoo also has ducks, birds and mice, and the big pond has carp you can feed. There is an outdoor playground with slides and swings and a small indoor play area. You can sit in an air-conditioned dining room overlooking the pond or in the garden under big trees. Entry is free and you only pay for food; the menu is seafood and Thai dishes.",
    tips: [
      {
        text: "Вход в сад и мини-зоопарк бесплатный.",
        textEn: "Entry to the garden and the mini zoo is free.",
      },
      {
        text: "Корм для кроликов — через ящик для пожертвований, фиксированной цены нет.",
        textEn: "Rabbit food is by donation box — there is no fixed price.",
      },
      {
        text: "Открываются в 11:00. Днём в саду жарко — к кроликам и на площадку приятнее идти ближе к вечеру.",
        textEn:
          "Opens at 11:00. The garden is hot at midday — the rabbits and the playground are more pleasant towards the evening.",
      },
      { text: "Есть большая парковка.", textEn: "There is a large car park." },
      {
        text: "Ориентир — дорога вдоль железной дороги; на въезде большая фигура серо-белого кролика.",
        textEn:
          "Landmark: the road along the railway; there is a large grey-and-white rabbit statue at the entrance.",
      },
    ],
    hours: {
      MON: { open: "11:00", close: "22:00" },
      TUE: { open: "11:00", close: "22:00" },
      WED: { open: "11:00", close: "22:00" },
      THU: { open: "11:00", close: "22:00" },
      FRI: { open: "11:00", close: "22:00" },
      SAT: { open: "11:00", close: "22:00" },
      SUN: { open: "11:00", close: "22:00" },
    },
    flags: {
      indoor: true,
      outdoor: true,
      hasAirCon: true,
      hasFood: true,
      hasParking: true,
      hasCoveredArea: true,
      animalContact: true,
    },
    categorySlugs: ["cafe-kids-zone"],
    free: true,
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/loftbitpark/" },
      { type: "phone", value: "083 879 0411" },
    ],
  },
  // Maine Coon Cat Cafe
  {
    slug: "maine-coon-cat-cafe-pattaya",
    description:
      "Небольшое кафе с мейн-кунами в Центральной Паттайе, на Третьей дороге (Pattaya Third Road): рядом с 7-Eleven, напротив въезда в сой Chaloem Phrakiat 21. Это тихое место: любопытные и ласковые мейн-куны гуляют по залу, у них есть свои места для отдыха, а гости сидят с напитком и гладят их. По отзывам, в цену входа входит напиток на выбор и корм для кошек; подают кофе, тайский чай, смузи. У входа разуваются и моют руки — раковина рядом с полкой для обуви. Детям здесь интересно, но кошки — живые и не игрушки: взрослому стоит быть рядом и следить, чтобы ребёнок гладил аккуратно и не шумел.",
    descriptionEn:
      "A small café with Maine Coon cats in Central Pattaya, on Pattaya Third Road: next to a 7-Eleven, opposite the entrance to Soi Chaloem Phrakiat 21. It is a quiet place: curious, affectionate Maine Coons wander around the room and have their own resting spots, and guests sit with a drink and stroke them. According to reviews, the entry price includes a drink of your choice and cat treats; there is coffee, Thai tea and smoothies. Shoes come off at the entrance and you wash your hands — the sink is next to the shoe rack. Children enjoy it, but the cats are not toys: an adult should stay close and make sure the child strokes them gently and keeps the noise down.",
    tips: [
      {
        text: "По отзывам (апрель 2026), вход — 170 ฿ для взрослого и 140 ฿ для ребёнка; в цену входят любой напиток и корм для кошек.",
        textEn:
          "According to reviews (April 2026), entry is 170 ฿ for an adult and 140 ฿ for a child, including any drink and cat treats.",
      },
      {
        text: "Обувь оставляют на полке у входа, руки моют до и после игры с кошками.",
        textEn:
          "Shoes go on the rack by the entrance, and you wash your hands before and after playing with the cats.",
      },
      {
        text: "Говорите тише и следите, как ребёнок берёт кошек: здесь спокойная атмосфера, кошек не тискают.",
        textEn:
          "Keep your voice down and watch how your child handles the cats: the atmosphere is calm and the cats should not be squeezed.",
      },
      {
        text: "По отзывам, народу меньше утром и в начале дня.",
        textEn:
          "According to reviews, it is less crowded in the morning and early afternoon.",
      },
    ],
    flags: { indoor: true, hasFood: true, hasCafeSeating: true, animalContact: true },
    categorySlugs: ["cafe"],
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=61581480447972",
      },
      {
        type: "instagram",
        value: "https://www.instagram.com/maine_coon_cat_cafe_pattaya/",
      },
      { type: "phone", value: "061 243 0221" },
    ],
  },
  // Narak Pets Cafe
  {
    slug: "narak-pets-cafe",
    description:
      "Небольшое котокафе на Thappraya Road, на пути из Паттайи в Джомтьен. По фото в соцсетях кафе, здесь живут в основном кошки, в том числе рэгдоллы, на одном снимке есть и собака; с животными можно поиграть и посидеть рядом. Кафе пишет, что открыто каждый день. Подробностей о ценах, часах и правилах для детей на официальной странице нет — перед визитом лучше написать кафе в Facebook.",
    descriptionEn:
      "A small cat café on Thappraya Road, on the way from Pattaya to Jomtien. Judging by the café's social media photos, it is mostly home to cats, including ragdolls, with a dog in one shot; you can play with the animals and sit with them. The café says it is open every day. Its official page gives no details on prices, hours or rules for children — it's best to message the café on Facebook before you go.",
    tips: [
      {
        text: "Цены и часы кафе не публикует — уточните в сообщениях на странице в Facebook.",
        textEn: "The café doesn't publish prices or hours — ask via its Facebook page.",
      },
    ],
    flags: { indoor: true, animalContact: true },
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=61574272525295",
      },
    ],
  },
  // Mongchang Cafe
  {
    slug: "mongchang-cafe",
    description:
      "Кафе на территории Pattaya Elephant Village, в зелёной зоне к востоку от Сукхумвита (район Нонг Прю; на картах ищется по названию «มองช้างคาเฟ่»). Сюда едут ради вида: за столиками пьют кофе, а рядом ходят слоны. По обзорам, на территории живут и другие животные — белый буйвол, кролики, обезьяны, олени, лошади, — и их можно покормить, а бананы для слонов покупают на месте. Здесь же предлагают катание на слонах, купание слонов и шоу; это решение каждой семьи — многие родители сейчас выбирают места без катания. Кафе работает с 2020 года и активно ведёт страницу, принимает и групповые выезды.",
    descriptionEn:
      "A café inside Pattaya Elephant Village, in the green belt east of Sukhumvit (search for “มองช้างคาเฟ่” on maps). People come for the view: you have a coffee at the tables while elephants walk nearby. According to reviews, the grounds also have other animals — a white buffalo, rabbits, monkeys, deer, horses — that you can feed, and bananas for the elephants are sold on site. The venue also offers elephant rides, elephant bathing and a show; that is each family's call — many parents now prefer places without riding. The café has been open since 2020, keeps its page active and also hosts group outings.",
    tips: [
      {
        text: "Бананы для кормления слонов в стоимость не входят — их покупают на месте (по обзорам).",
        textEn:
          "Bananas for feeding the elephants are not included — you buy them on site (according to reviews).",
      },
      {
        text: "Почти всё время проходит на улице — возьмите головной убор, воду и средство от комаров.",
        textEn:
          "Most of the time is spent outdoors — bring a hat, water and mosquito repellent.",
      },
      {
        text: "Проката колясок и пеленального столика нет, детские стульчики в кафе есть (по обзорам).",
        textEn:
          "There is no stroller rental or changing table; high chairs are available in the café (according to reviews).",
      },
      {
        text: "Если покупали билет через агрегатор — уточните условия заранее: в свежем отзыве жалуются, что их не приняли.",
        textEn:
          "If you bought a ticket through a booking site, check its terms in advance: a recent review complains they were not honoured.",
      },
      {
        text: "Есть парковка (по обзорам).",
        textEn: "There is parking (according to reviews).",
      },
    ],
    flags: {
      outdoor: true,
      hasFood: true,
      hasCafeSeating: true,
      hasParking: true,
      animalContact: true,
    },
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/Mongchangcafe/" },
      { type: "phone", value: "065 692 4291" },
    ],
  },
  // Nine Rabbit House Cafe by Legend Siam
  {
    slug: "nine-rabbit-house-cafe",
    description:
      "Кроличье кафе на территории парка Legend Siam на Сукхумвите, недалеко от сада Нонг Нуч. Зону открыли в июне 2024 года: около 3000 м², больше сотни кроликов разных пород. Устроена она из двух частей. В первой — кафе у воды под деревьями: кролики свободно бегают по газону, а взрослые сидят с напитками и пирожными. Во второй — «кроличий городок» из маленьких домиков с лужайками и водопадом, много мест для фото. Кроликов можно гладить и угощать люцерной; малышам здесь обычно интереснее всего.",
    descriptionEn:
      "A rabbit cafe inside the Legend Siam park on Sukhumvit Road, not far from Nong Nooch Garden. The zone opened in June 2024: about 3,000 m² with more than a hundred rabbits of different breeds. It has two parts. The first is a waterside cafe under the trees, where rabbits roam freely on the lawn while adults sit with drinks and cakes. The second is a 'rabbit village' of little houses with lawns and a waterfall, with plenty of photo spots. You can pet the rabbits and feed them alfalfa; little ones usually enjoy this part the most.",
    tips: [
      {
        text: "Кафе находится внутри Legend Siam — уточните по телефону 033 073 333, нужен ли билет в парк, чтобы пройти к кроликам.",
        textEn:
          "The cafe is inside Legend Siam — call 033 073 333 to check whether you need a park ticket to reach the rabbits.",
      },
      {
        text: "Угощение для кроликов — люцерну — дают на месте; объясните ребёнку, что кролика не поднимают на руки и не тянут за уши.",
        textEn:
          "Alfalfa treats for the rabbits are available on site; explain to your child that rabbits are not picked up or pulled by the ears.",
      },
      {
        text: "Кролики бегают по траве — наденьте ребёнку закрытую обувь и возьмите влажные салфетки.",
        textEn:
          "The rabbits run around on grass — put your child in closed shoes and bring wet wipes.",
      },
    ],
    hours: {
      MON: { open: "10:00", close: "18:00" },
      TUE: { open: "10:00", close: "18:00" },
      WED: { open: "10:00", close: "18:00" },
      THU: { open: "10:00", close: "18:00" },
      FRI: { open: "10:00", close: "18:00" },
      SAT: { open: "10:00", close: "18:00" },
      SUN: { open: "10:00", close: "18:00" },
    },
    flags: {
      outdoor: true,
      indoor: false,
      hasFood: true,
      hasCafeSeating: true,
      animalContact: true,
    },
    contacts: [{ type: "phone", value: "033 073 333" }],
  },
  // On Ground Cafe & Farm
  {
    slug: "on-ground-cafe-farm",
    description:
      "Кафе в саду с небольшой фермой на трассе 36 (байпас), напротив автодрома Bira Circuit, в районе Кхао Май Кэо. По карточке на картах, при кафе живут кролики, мини-пиги, козы, овцы и лошади, и животных можно кормить. С ребёнком сюда заезжают по дороге в сторону Районга или на Bira: выпить кофе, перекусить и спокойно погулять вдоль загонов.",
    descriptionEn:
      "A garden café with a small farm on Highway 36 (the bypass), opposite the Bira Circuit racetrack in the Khao Mai Kaeo area. According to its map listing, rabbits, mini pigs, goats, sheep and horses live by the café, and you can feed the animals. With a child it is a stop on the way towards Rayong or to Bira: a coffee, a snack and an unhurried walk along the pens.",
    tips: [
      {
        text: "Ориентир — напротив автодрома Bira Circuit на трассе 36; удобно, если едете туда или в сторону Районга.",
        textEn:
          "Landmark: opposite Bira Circuit on Highway 36 — handy if you are heading there or towards Rayong.",
      },
    ],
    flags: { outdoor: true, hasFood: true, animalContact: true },
  },
  // Pattaya Elephant Village
  {
    slug: "pattaya-elephant-village",
    description:
      "Слоновья деревня в Восточной Паттайе (Nong Prue), работает с 1973 года; сама себя называет приютом для слонов, которые раньше работали. Сейчас основная часть для гостей — MongChang Cafe: «лесное» кафе среди деревьев, откуда видно слонов. Слонов кормят бананами (их покупают на месте); есть мини-зоопарк, где по разным источникам живут олени, лошади, птицы, обезьяны и гиббоны. Есть и то, что не всем родителям подходит: катание на слоне, купание слонов и шоу с животными. Отдельно — тайская танцевальная программа Kacha Show, ATV-заезды и музей Ганеши. Место живое: в ноябре 2026 года, например, гостей приглашали на встречи с общиной каренов, где показывают традиционное ткачество.",
    descriptionEn:
      "An elephant village in East Pattaya (Nong Prue), running since 1973, which describes itself as a sanctuary for former working elephants. These days the main visitor area is MongChang Cafe, a 'forest' cafe among the trees with a view of the elephants. You can feed the elephants bananas (sold on site), and there is a mini zoo with, according to various sources, deer, horses, birds, monkeys and gibbons. Some things on offer will not suit every parent: elephant rides, elephant bathing and animal shows. Separately there is the Kacha Show of Thai dance, ATV rides and a Ganesha museum. The place is active: in November 2026, for example, it invited visitors to meet members of the Karen community and watch traditional weaving.",
    tips: [
      {
        text: "Здесь есть катание на слонах и шоу с животными. Если для вас это неприемлемо, можно ограничиться кафе и кормлением — или выбрать другое место.",
        textEn:
          "Elephant rides and animal shows are offered here. If that is not acceptable to you, you can stick to the cafe and feeding — or choose another place.",
      },
      {
        text: "Бананы для слонов продают на месте; руку с угощением держите раскрытой ладонью и рядом с ребёнком.",
        textEn:
          "Bananas for the elephants are sold on site; hold the treat on an open palm and stay right next to your child.",
      },
      {
        text: "Бронь — через LINE @mongchangcafe (так сказано в постах деревни, 2026).",
        textEn:
          "Bookings are made via LINE @mongchangcafe (as the village's 2026 posts say).",
      },
      {
        text: "Большая часть времени проходит на улице — возьмите панаму, воду и средство от комаров.",
        textEn:
          "Most of the visit is outdoors — bring a hat, water and mosquito repellent.",
      },
    ],
    flags: {
      outdoor: true,
      indoor: false,
      hasFood: true,
      hasCafeSeating: true,
      animalContact: true,
    },
    contacts: [
      { type: "website", value: "http://www.elephant-village-pattaya.com/" },
      { type: "facebook", value: "https://www.facebook.com/elephantvillagepattaya1" },
      { type: "instagram", value: "https://www.instagram.com/elephantvillagepattaya" },
      { type: "line", value: "@mongchangcafe" },
      { type: "phone", value: "065 692 4291" },
    ],
  },
  // Pettopia Cafe
  {
    slug: "pettopia-cafe",
    description:
      "Небольшое кафе в Восточной Паттайе, на улице Thung Klom-Talman (сой 18), за Сукхумвитом. На своей странице кафе называет себя Pet-Topia Cafe и одновременно пиццерией Pizza Service: тонкая и толстая пицца, еда и напитки. На картах место отмечено как кафе с животными, а в свежих постах кафе пишет от лица своей козы, которая зовёт гостей «поиграть». Сколько животных и можно ли их кормить, официальные страницы не говорят — перед поездкой с ребёнком лучше позвонить.",
    descriptionEn:
      "A small café in East Pattaya, on Thung Klom-Talman Road (Soi 18), east of Sukhumvit. On its page it calls itself Pet-Topia Cafe and also runs as the pizzeria Pizza Service: thin- and thick-crust pizza, food and drinks. Maps list it as an animal café, and recent posts are written in the voice of the café's goat, inviting guests to “come and play”. The official pages do not say how many animals there are or whether you can feed them — call ahead before going with a child.",
    tips: [
      {
        text: "Перед поездкой позвоните: 082 978 3556 или 086 555 7777 — уточните, какие животные сейчас в кафе.",
        textEn:
          "Call before you go: 082 978 3556 or 086 555 7777 — ask which animals are at the café now.",
      },
    ],
    flags: { hasFood: true },
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/Pettopiacafepattaya" },
      { type: "phone", value: "082 978 3556" },
      { type: "phone", value: "086 555 7777" },
    ],
  },
  // Annethong Public Park
  {
    slug: "annethong-public-park",
    description:
      "Небольшой городской парк на северном склоне холма Пратамнак, над пирсом Бали Хай и рядом с надписью PATTAYA CITY на холме. Это скорее место для прогулки, чем для отдельной поездки: дорожки среди пальм, смотровые точки с видом на залив и пирс, тренажёры под открытым небом. По отзывам, рядом наверху есть кафе и платный туалет, а машину оставляют у обочины. Вход свободный. Удобно совместить с прогулкой у Бали Хай или по Пратамнаку утром или ближе к закату, когда не так жарко.",
    descriptionEn:
      "A small city park on the northern slope of Pratumnak Hill, above Bali Hai Pier and next to the PATTAYA CITY sign on the hill. It is more a place for a walk than a destination in itself: palm-lined paths, lookout points over the bay and the pier, and an open-air gym. According to reviews, there is a café and a paid toilet near the top, and people park at the roadside. Entry is free. It pairs well with a stroll around Bali Hai or Pratumnak in the morning or towards sunset, when it is cooler.",
    tips: [
      {
        text: "Приходите утром или ближе к вечеру: днём на склоне жарко, а у надписи PATTAYA CITY по отзывам многолюдно.",
        textEn:
          "Come in the morning or late afternoon: the slope is hot at midday, and reviewers say the PATTAYA CITY sign gets crowded.",
      },
      {
        text: "Возьмите воду и панаму. По отзывам, туалет наверху платный — 5 ฿ с человека.",
        textEn:
          "Bring water and a sun hat. Reviewers say the toilet at the top costs 5 ฿ per person.",
      },
      {
        text: "Дорожки идут по склону, местами с лестницами — для коляски неудобно, малышей лучше взять в переноску.",
        textEn:
          "The paths run up the slope with some steps — awkward for a stroller; a baby carrier is easier.",
      },
      {
        text: "Парковки как таковой нет — по отзывам, машину оставляют у обочины.",
        textEn:
          "There is no proper car park — reviewers say people park at the roadside.",
      },
    ],
    flags: { outdoor: true },
    free: true,
  },
  // Big Robot Pattaya
  {
    slug: "big-robot-pattaya",
    description:
      "Двор-мастерская металлических скульптур на Сукхумвите в Нонгпрю, недалеко от поворота на Тепразит. Фигуры сварены вручную из переработанной стали — листового лома, мотоциклетных цепей, звёздочек и старых шин: трансформеры Бамблби и Оптимус Прайм высотой до 3–4 метров, Халк на мотоцикле, Хищник, миньоны, слон и другие животные. Это не аттракцион и не музей, а площадка, где скульптуры стоят на продажу, но владельцы прямо пишут, что посмотреть на них вживую можно: нужно заранее позвонить, чтобы вас встретили и открыли. Детям, которые любят трансформеров и супергероев, обычно интересно просто походить между фигурами и сфотографироваться. Входной платы на сайте нет, часов работы тоже.",
    descriptionEn:
      "A metal sculpture yard and workshop on Sukhumvit Road in Nong Prue, near the Thepprasit turn. Every figure is hand-welded from recycled steel — scrap plate, motorcycle chain, sprockets and old tyres: Bumblebee and Optimus Prime up to 3–4 metres tall, the Hulk on a motorbike, a Predator, Minions, an elephant and other animals. It is not an attraction or a museum but a yard where the pieces stand for sale; the owners say plainly that you are welcome to come and see them in person, but you need to call ahead so someone is there to let you in. Children who love Transformers and superheroes usually enjoy simply walking among the figures and taking photos. The website lists no entry fee and no opening hours.",
    tips: [
      {
        text: "Перед приездом обязательно позвоните: +66 61 658 3265 — без звонка можно не застать никого на месте. Можно написать и в LINE или WhatsApp (ссылки на сайте).",
        textEn:
          "Be sure to call before you come: +66 61 658 3265 — without a call there may be nobody there. You can also message on LINE or WhatsApp (links on the website).",
      },
      {
        text: "Скульптуры — металлические, со сваренными краями, и стоят под открытым небом: присматривайте, чтобы малыши не залезали на них и не хватались за острые детали.",
        textEn:
          "The sculptures are welded metal with sharp edges and stand outdoors: keep small children from climbing them or grabbing pointy parts.",
      },
      {
        text: "Двор на улице: днём металл на солнце сильно нагревается — лучше приезжать утром или ближе к вечеру.",
        textEn:
          "The yard is outdoors and the metal gets very hot in the midday sun — morning or late afternoon is better.",
      },
      {
        text: "Это место продажи, а не аттракцион: вежливо спросите разрешения, прежде чем фотографироваться с фигурами.",
        textEn:
          "This is a sales yard, not an attraction: politely ask before taking photos with the figures.",
      },
    ],
    flags: { outdoor: true },
    contacts: [
      { type: "website", value: "https://www.big-robot-pattaya.com/" },
      { type: "phone", value: "+66 61 658 3265" },
      { type: "line", value: "https://line.me/ti/p/93kypdJvtF" },
    ],
  },
  // Bira Go Kart Circuit
  {
    slug: "bira-go-kart-circuit",
    description:
      "Спортивная картинговая трасса в комплексе автодрома Bira International Circuit в Понге, у шоссе 36, примерно в 15–20 км от Паттайи. Это не развлекательный картинг, как на набережной, а гоночная трасса по стандарту CIK: её перестраивают в 12 конфигураций, здесь проходят национальные и международные гонки (Rotax Max Challenge, Asian Karting Open). Сюда приезжают гоночные команды на тренировки и старты, в том числе с детьми, которые учатся ездить на карте. Если ребёнок хочет попробовать картинг всерьёз, начинать стоит с вопроса команде или администрации трассы; прокат «пришёл и поехал» с ценами на официальном сайте не описан.",
    descriptionEn:
      "A competition karting track inside the Bira International Circuit complex in Pong, off Highway 36, about 15–20 km from Pattaya. This is not a leisure go-kart track like the ones in town but a CIK-standard racing circuit: it can be reconfigured into 12 layouts and hosts national and international races (Rotax Max Challenge, Asian Karting Open). Racing teams come here to train and compete, including with children who are learning to drive karts. If your child wants to try karting seriously, start by asking a team or the circuit office; the official site does not describe walk-in rentals or prices.",
    tips: [
      {
        text: "Трасса за городом, у шоссе 36 в Понге: добираться на машине или такси.",
        textEn:
          "The track is out of town, off Highway 36 in Pong: you will need a car or a taxi.",
      },
    ],
    flags: { outdoor: true },
    contacts: [
      { type: "website", value: "https://bira.co.th/main?bira=kart" },
      { type: "facebook", value: "https://www.facebook.com/BiraCircuitPattaya/" },
      { type: "instagram", value: "https://www.instagram.com/biracircuit/" },
    ],
  },
  // Chaloem Phra Kiat Park
  {
    slug: "chaloem-phra-kiat-park",
    description:
      "Городской парк на склоне холма Большого Будды (Ват Пхра Яй), между Южной Паттайей и Пратамнаком. Территория идёт в гору: дорожки и лестницы под деревьями, клумбы, виды на город и море, уличные тренажёры. Местные приходят сюда на прогулку и пробежку рано утром и ближе к вечеру, когда спадает жара. По отзывам, в парке живут белки и обезьяны, а на территории отмечена небольшая игровая зона с балансирами. Это место скорее для прогулки с ребёнком постарше, которому интересно лазать по ступенькам и смотреть на обезьян, чем для долгой игры на площадке. Вход бесплатный; на вершине можно продолжить прогулку к храму Большого Будды.",
    descriptionEn:
      "A city park on the slope of Big Buddha Hill (Wat Phra Yai), between South Pattaya and Pratumnak. The grounds climb uphill: shaded paths and stairs, flower beds, views over the city and the sea, and outdoor fitness stations. Locals come here to walk and jog early in the morning and towards evening, when the heat drops. According to reviews, squirrels and monkeys live in the park, and there is a small play area with balance equipment. It works best as a walk with an older child who enjoys climbing steps and watching the monkeys, rather than a long playground stop. Entry is free; at the top you can carry on to the Big Buddha temple.",
    tips: [
      {
        text: "Приходите утром или ближе к закату — днём на склоне жарко.",
        textEn:
          "Come in the morning or towards sunset — the slope gets hot during the day.",
      },
      {
        text: "В парке живут обезьяны (по отзывам) — не кормите их и держите еду и пакеты закрытыми.",
        textEn:
          "Monkeys live in the park (according to reviews) — do not feed them and keep food and bags closed.",
      },
      {
        text: "Парк на склоне, со ступенями — с коляской будет непросто.",
        textEn: "The park is on a slope with steps — not easy with a stroller.",
      },
      {
        text: "Наверху есть отдельная парковка для мотобайков (по отзывам).",
        textEn:
          "There is a separate motorbike parking area at the top (according to reviews).",
      },
      {
        text: "Если пойдёте дальше в храм Большого Будды — одежда должна закрывать плечи и колени.",
        textEn:
          "If you continue to the Big Buddha temple, wear clothes that cover shoulders and knees.",
      },
    ],
    hours: {
      MON: { open: "04:15", close: "22:15" },
      TUE: { open: "04:15", close: "22:15" },
      WED: { open: "04:15", close: "22:15" },
      THU: { open: "04:15", close: "22:15" },
      FRI: { open: "04:15", close: "22:15" },
      SAT: { open: "04:15", close: "22:15" },
      SUN: { open: "04:15", close: "22:15" },
    },
    flags: { outdoor: true, hasCoveredArea: true },
    categorySlugs: ["playground"],
    free: true,
  },
  // Chalerm Rajakumari Public Library
  {
    slug: "chalerm-rajakumari-library-naklua",
    description:
      "Районная публичная библиотека «Chalerm Rajakumari» в Наклуа, в сое Na Kluea 12. Такие библиотеки — государственная сеть, которую с 1991 года открывают по районам Таиланда в честь принцессы Сириндхорн; в Бангламунге она относится к районному центру дополнительного образования. Вход в такие библиотеки бесплатный, книги в основном на тайском. По публикации 2025 года здесь проводили для детей занятия по IT и видео. Подробностей о детском зале, часах и текущих кружках в открытых источниках найти не удалось — перед визитом лучше уточнить.",
    descriptionEn:
      "The Chalerm Rajakumari district public library in Naklua, on Soi Na Kluea 12. These libraries are a state network opened district by district across Thailand since 1991 in honour of Princess Sirindhorn; in Bang Lamung it belongs to the district learning-promotion centre (formerly the non-formal education office). Entry to these libraries is free and the books are mostly in Thai. According to a 2025 publication, it has hosted IT and video activities for children. Details about a children's room, opening hours and current activities could not be found in open sources — check before you go.",
    tips: [
      {
        text: "Часов работы в открытых источниках нет — позвоните или напишите в районный центр дополнительного образования Бангламунга перед визитом.",
        textEn:
          "Opening hours are not published online — contact the Bang Lamung district learning centre before you go.",
      },
      {
        text: "Книги почти все на тайском: ребёнку, который не читает по-тайски, лучше взять свою книжку.",
        textEn:
          "Nearly all books are in Thai: if your child does not read Thai, bring your own book.",
      },
    ],
    flags: { indoor: true },
  },
  // Chill at the Hill
  {
    slug: "chill-at-the-hill-skatepark",
    description:
      "Новый самодельный скейт-парк в Восточной Паттайе: бетонную чашу (bowl) местные скейтеры начали копать летом 2026 года на собственные деньги, мягкое открытие прошло в конце октября 2026-го. По отзывам, рядом небольшой вечерний рынок с едой и напитками, а до 7-Eleven около 100 м. Это место скейт-сообщества, а не детская площадка: приходить стоит с ребёнком или подростком, который уже уверенно катается, и со своей доской и защитой. Открывается ближе к вечеру.",
    descriptionEn:
      "A new DIY skatepark in East Pattaya: local skaters started digging the concrete bowl in summer 2026 with their own money, and it had a soft opening at the end of October 2026. According to reviews, there is a small evening market with food and drinks nearby, and a 7-Eleven about 100 m away. This is a skate-community spot, not a playground: come with a child or teenager who already skates confidently, with their own board and pads. It opens towards the evening.",
    tips: [
      {
        text: "Шлем и защиту берите свои — о прокате нигде не сказано.",
        textEn: "Bring your own helmet and pads — no rental is mentioned anywhere.",
      },
      {
        text: "По карте место открывается в 18:00 — днём там, скорее всего, закрыто.",
        textEn:
          "According to the map listing, it opens at 18:00 — during the day it is most likely closed.",
      },
      {
        text: "По отзывам, еда и напитки — на небольшом вечернем рынке рядом и в 7-Eleven в 100 м.",
        textEn:
          "According to reviews, food and drinks are at the small evening market next door and at a 7-Eleven 100 m away.",
      },
    ],
    flags: { outdoor: true, indoor: false },
    contacts: [{ type: "phone", value: "061 843 4502" }],
  },
  // Datsun & Nissan Museum
  {
    slug: "datsun-nissan-museum-pong",
    description:
      "Частная выставка автомобилей Siam Motors — компании, которая много лет собирала и продавала Datsun и Nissan в Таиланде. Находится в Понге, на Pornprapanimit Rd, рядом с гольф-клубом Siam Country Club, в ухоженном саду (на указателях — Cherdchoomit Garden и Pornprapha Botanical Garden). Для детей самое интересное — снаружи: отреставрированный старый поезд у «станции» Siam Motors, двухмоторный самолёт, пруд со статуей змея и пагоды. Рядом выставлены старые Datsun и Nissan разных лет, проданные в Таиланде. По отзывам, вход свободный, но само здание музея в последние годы бывает закрыто — тогда смотрят только то, что на улице. Это короткая остановка на полчаса-час, например по пути к озеру Мабпрачан.",
    descriptionEn:
      "A private display of cars by Siam Motors, the company that assembled and sold Datsun and Nissan in Thailand for decades. It is in Pong, on Pornprapanimit Rd near the Siam Country Club golf courses, set in a well-kept garden (signposted as Cherdchoomit Garden and Pornprapha Botanical Garden). For children the best part is outdoors: a restored vintage train at the Siam Motors 'station', a twin-prop plane, a pond with a serpent statue and pagodas. Vintage Datsuns and Nissans sold in Thailand over the years are on display nearby. According to reviews entry is free, but the museum building itself has been closed in recent years, so you may only see the outdoor exhibits. It is a short stop of half an hour to an hour, for example on the way to Mabprachan Lake.",
    tips: [
      {
        text: "По отзывам, внутрь здания пускают не всегда — рассчитывайте на прогулку по саду и уличную экспозицию (поезд, самолёт, старые машины).",
        textEn:
          "According to reviews, the building is not always open — plan on a walk around the garden and the outdoor exhibits (train, plane, vintage cars).",
      },
      {
        text: "Некоторые павильоны посвящены предкам семьи владельцев — туда лучше не заходить.",
        textEn:
          "Some pavilions honour the owners' family ancestors — it is best not to go inside them.",
      },
      {
        text: "Это частная территория с охраной на въезде; по отзывам, гостей пропускают без вопросов.",
        textEn:
          "It is private property with a guard at the entrance; according to reviews, visitors are let through without questions.",
      },
    ],
    flags: { indoor: false, outdoor: true },
    free: true,
  },
  // Duck Square Skate Park
  {
    slug: "duck-square-skate-park",
    description:
      "Открытый скейт-парк в комьюнити-моле Duck Square на Pattaya Tai Road (Южная Паттайя), недалеко от Сукхумвита. По отзывам, площадка небольшая: мини-рампа, хаф-пайп и уличные фигуры, вокруг граффити; катаются на скейтах и BMX, собирается местное сообщество скейтеров. Вход, по отзывам, свободный. Это место скорее для детей постарше и подростков, которые уже уверенно стоят на доске или самокате, чем для малышей. В том же комплексе — магазин скейтов, кофейня и кафе, а вечером работают бары и клуб.",
    descriptionEn:
      "An open-air skate park in the Duck Square community mall on Pattaya Tai Road (South Pattaya), close to Sukhumvit Road. Reviewers describe it as fairly small: a mini ramp, a half-pipe and street obstacles, with graffiti all around; people ride skateboards and BMX, and the local skate community hangs out here. According to reviews, entry is free. It suits older children and teens who are already confident on a board or scooter rather than toddlers. The same complex has a skate shop, a coffee shop and cafés, and bars and a club in the evening.",
    tips: [
      {
        text: "Площадка под открытым небом, о тени в отзывах не пишут: днём здесь жарко, удобнее приходить к вечеру.",
        textEn:
          "The park is open-air and reviews don't mention shade: it gets hot in the daytime, so late afternoon is easier.",
      },
      {
        text: "По отзывам, после темноты освещение слабое.",
        textEn: "Reviewers say the lighting after dark is minimal.",
      },
      {
        text: "Возьмите свою доску или самокат, шлем и защиту: прокат и уроки упоминаются только в старых отзывах.",
        textEn:
          "Bring your own board or scooter, a helmet and pads: rentals and lessons are only mentioned in older reviews.",
      },
      {
        text: "По вечерам в комплексе работают бары и клуб — с детьми спокойнее днём или в выходные до вечера.",
        textEn:
          "Bars and a club open in the complex in the evenings — with children it's calmer during the day or on weekend afternoons.",
      },
    ],
    flags: { outdoor: true, hasFood: true },
    free: true,
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/ducksquarepattaya/" },
      { type: "phone", value: "092 246 5842" },
    ],
  },
  // Escape Room Thailand
  {
    slug: "escape-room-thailand-central",
    description:
      "Квест-комнаты сети Escape Room Thailand на 6-м этаже Central Festival Pattaya Beach (вторая точка сети — в MBK в Бангкоке). Команда запирается в оформленной комнате и за отведённое время разгадывает загадки, чтобы выбраться. В Паттайе на сайте сейчас несколько сюжетов: «заколдованный домик ведьмы» (The Enchanted Cottage), побег с чужой планеты (Alien Cavern), побег из тюрьмы, «рай и ад» и хоррор Caged с декорациями «маньяка» — последний явно не для детей. Атмосфера у всех комнат тёмная и пугающая, так что это скорее занятие для подростков вместе со взрослыми, чем для младших школьников. Цены и возрастные правила на сайте не опубликованы — уточняйте при бронировании по телефону.",
    descriptionEn:
      "Escape rooms by Escape Room Thailand on the 6th floor of Central Festival Pattaya Beach (the chain's other branch is at MBK in Bangkok). Your team is locked in a themed room and has a set time to solve puzzles and get out. The Pattaya branch currently lists several stories: a witch's cottage (The Enchanted Cottage), an escape from an alien planet (Alien Cavern), a prison break, Heaven and Hell, and Caged, a horror room with a serial-killer set that is clearly not for children. All the rooms are dark and spooky, so this suits teenagers playing with adults rather than younger children. Prices and age rules are not published on the website — ask when you book by phone.",
    tips: [
      {
        text: "Бронируйте заранее по телефону +66 63 210 8724 или через сайт — и сразу спросите, с какого возраста пускают и какая комната спокойнее.",
        textEn:
          "Book ahead by phone on +66 63 210 8724 or via the website — and ask about the minimum age and which room is the least scary.",
      },
      {
        text: "Комната Caged — хоррор с «маньяком» и бутафорскими частями тел: с детьми её не выбирайте.",
        textEn:
          "The Caged room is a horror set with a 'killer' theme and fake body parts: do not pick it with children.",
      },
      {
        text: "На сайте есть купон на скидку 150 ฿ на одну игру в паттайском филиале — покажите его персоналу до начала игры.",
        textEn:
          "The website has a 150 ฿ discount coupon for one game at the Pattaya branch — show it to staff before the game starts.",
      },
      {
        text: "Это 6-й этаж торгового центра: до или после игры можно поесть в фудкорте и ресторанах Central.",
        textEn:
          "It is on the 6th floor of the mall: you can eat before or after at Central's food court and restaurants.",
      },
    ],
    flags: { indoor: true, hasAirCon: true, hasFood: true, hasParking: true },
    contacts: [
      { type: "website", value: "https://www.escaperoomthailand.com/pattaya/" },
      { type: "phone", value: "+66 63 210 8724" },
      { type: "facebook", value: "https://www.facebook.com/Escaperoomthailand" },
      { type: "instagram", value: "https://www.instagram.com/escaperoomthailand/" },
    ],
  },
  // Fairy Sweet Village
  {
    slug: "fairy-sweet-village",
    description:
      "Кафе-«городок сладостей» на Thappraya Road, напротив подъёма на холм Пратамнак, рядом с судом Паттайи. Это яркие пряничные домики и сказочные декорации для фото, карусель, небольшой сухой бассейн с шариками и зал с кондиционером, где можно передохнуть с напитком. Отдельного билета сейчас нет: по постам кафе за ноябрь 2026 года, вход бесплатный, если заказать один десерт или напиток; есть и вариант с вафлей, которую ребёнок украшает сам (DIY). Приходят сюда скорее на час: погулять по декорациям, пофотографироваться и съесть сладкое. Малышам интереснее всего шарики и карусель.",
    descriptionEn:
      "A sweets-themed 'village' cafe on Thappraya Road, opposite the road up Pratumnak Hill, next to the Pattaya court. Expect brightly coloured candy houses and fairy-tale photo sets, a carousel, a small ball pit and an air-conditioned room where you can rest with a drink. There is no separate ticket at the moment: according to the cafe's posts from November 2026, entry is free when you order one dessert or drink; there is also an option with a waffle your child decorates themselves (DIY). It is more of a one-hour stop: wander through the sets, take photos and have something sweet. Little ones mostly enjoy the ball pit and the carousel.",
    tips: [
      {
        text: "Вход бесплатный при заказе одного десерта или напитка (условия из постов кафе, ноябрь 2026).",
        textEn:
          "Entry is free when you order one dessert or drink (terms from the cafe's posts, November 2026).",
      },
      {
        text: "Есть набор «вафля DIY + два блюда» — ребёнок сам украшает вафлю.",
        textEn:
          "There is a 'DIY waffle + two dishes' set — your child decorates the waffle themselves.",
      },
      {
        text: "По отзывам, большая часть декораций и мест для сидения — на улице, а зал с кондиционером небольшой: в жару лучше прийти утром или ближе к вечеру.",
        textEn:
          "According to reviews, most of the sets and seating are outdoors and the air-conditioned room is small: on hot days come in the morning or towards evening.",
      },
      {
        text: "По отзывам, бассейн с шариками маленький — он скорее для малышей.",
        textEn: "According to reviews, the ball pit is small — it suits toddlers best.",
      },
      {
        text: "Рядом — пирс Бали Хай, откуда уходят лодки на Ко Лан: можно заехать до или после поездки на остров.",
        textEn:
          "Bali Hai Pier, where boats leave for Koh Larn, is nearby: you can stop by before or after an island trip.",
      },
    ],
    hours: {
      MON: { open: "09:30", close: "20:00" },
      TUE: { open: "09:30", close: "20:00" },
      WED: { open: "09:30", close: "20:00" },
      THU: { open: "09:30", close: "20:00" },
      FRI: { open: "09:30", close: "20:00" },
      SAT: { open: "09:00", close: "20:00" },
      SUN: { open: "09:00", close: "20:00" },
    },
    flags: {
      indoor: true,
      outdoor: true,
      hasAirCon: true,
      hasFood: true,
      hasParking: true,
    },
    categorySlugs: ["cafe"],
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/fairysweetvillage" },
      { type: "line", value: "@fairysweetvillage" },
      { type: "phone", value: "095-675-1724" },
    ],
  },
  // Fun City (Central Pattaya)
  {
    slug: "fun-city-central-pattaya",
    description:
      "Игровой зал Fun City в торговом центре Central Pattaya на Beach Road. Fun City — сеть залов игровых автоматов в торговых центрах Central по всему Таиланду: гонки, тиры, музыкальные и спортивные автоматы, «хваталки» с игрушками и автоматы с билетиками, которые потом меняют на призы. Игры оплачивают пополняемой картой, её покупают на кассе зала. Это развлечение на полчаса-час для ребёнка постарше — например, после кино или обеда в ТЦ; в жару и дождь удобно, что всё под крышей.",
    descriptionEn:
      "The Fun City game arcade inside Central Pattaya mall on Beach Road. Fun City is a chain of arcades in Central malls across Thailand: racing and shooting games, music and sports machines, claw machines and ticket games whose tickets are swapped for prizes. You play with a top-up card bought at the counter. It works as a half-hour or hour of fun for an older child — say, after a film or lunch at the mall — and being indoors helps in the heat or rain.",
    tips: [
      {
        text: "Оплата — пополняемой картой зала; в других залах сети карту пополняют наличными или через Thai QR, а деньги на карте не возвращают — пополняйте понемногу.",
        textEn:
          "You pay with the arcade's top-up card; at other branches it is topped up with cash or Thai QR and the balance is non-refundable — top up a little at a time.",
      },
      {
        text: "Парковка — в самом ТЦ Central Pattaya.",
        textEn: "Park at the Central Pattaya mall itself.",
      },
    ],
    flags: { indoor: true, hasAirCon: true, hasFood: true, hasParking: true },
  },
  // Jomtien Fishing Park
  {
    slug: "jomtien-fishing-park",
    description:
      "Платный рыболовный пруд в Джомтьене, на Jomtien Second Road (Thanon Pattayasaisong), между сой Wat Boon и Chaiyapruek. Ловят по принципу «поймал — отпустил»: в пруду много крупных сомов и другой большой рыбы, так что поклёв почти гарантирован. Удочку с катушкой и наживку выдают на месте, сидят под навесами у воды; персонал, по отзывам, внимательный и помогает. По отзывам, сюда приезжают и семьями с детьми школьного возраста на полдня — ребёнку нравится, что рыба точно клюёт. На месте можно поесть и купить напитки.",
    descriptionEn:
      "A pay-to-fish lake in Jomtien, on Jomtien Second Road (Thanon Pattayasaisong), between Soi Wat Boon and Chaiyapruek. It is catch-and-release: the lake is stocked with plenty of big catfish and other large fish, so a bite is almost guaranteed. A rod, reel and bait are provided on site, you fish from covered shelters by the water, and, according to reviews, the staff are attentive and helpful. According to reviews, families with school-age children come here for half a day too — kids love that the fish really do bite. Food and drinks are available on site.",
    tips: [
      {
        text: "По отзывам, своя еда и напитки запрещены — за нарушение штраф; поесть можно на месте.",
        textEn:
          "According to reviews, outside food and drinks are not allowed and there are fines; food is available on site.",
      },
      {
        text: "По отзывам, удочкой может пользоваться только тот, на кого она оплачена: передавать её ребёнку или другому взрослому нельзя. Уточните заранее, нужна ли ребёнку своя.",
        textEn:
          "According to reviews, only the person who paid for a rod may use it: you cannot hand it to a child or another adult. Ask in advance whether your child needs their own.",
      },
      {
        text: "Под навесами жарко (по отзывам) — возьмите воду, панаму и лёгкую одежду.",
        textEn:
          "It gets hot under the shelters (according to reviews) — bring water, a hat and light clothing.",
      },
      {
        text: "Сомы здесь крупные и тянут сильно — маленькому ребёнку рыбу помогает вытащить взрослый или сотрудник.",
        textEn:
          "The catfish here are big and pull hard — a small child will need an adult or staff member to help land one.",
      },
    ],
    flags: { outdoor: true, indoor: false, hasFood: true, hasCoveredArea: true },
  },
  // JungleKart Off-Road Go-Karting
  {
    slug: "junglekart-off-road",
    description:
      "Внедорожный картинг на электрических картах в JungleKart Adventure Park, за городом к востоку от Сукхумвита. Это не гладкая трасса, а грунт: виражи, неровности, а в длинных программах — выезд на тропы в джунглях с подъёмами и грязью. Три формата: 30 минут на собственной грунтовой трассе, час на лесных тропах или полтора часа — и то и другое. Перед заездом проводят инструктаж по безопасности, выдают шлемы; в одном заезде не больше пяти картов, поэтому время бронируют заранее. Это развлечение для подростков и взрослых: минимальный возраст и можно ли ехать ребёнку пассажиром, на сайте не сказано — уточните при бронировании.",
    descriptionEn:
      "Off-road karting in electric karts at JungleKart Adventure Park, out of town east of Sukhumvit. This is no smooth circuit but dirt: berms, rough ground and, on the longer options, real jungle trails with climbs and mud. There are three formats: 30 minutes on the purpose-built dirt track, an hour on the jungle trails, or 90 minutes of both. Every session starts with a safety briefing and helmets; there are at most five karts per session, so book a time in advance. It is aimed at teenagers and adults: the website does not give a minimum age or say whether a child can ride as a passenger, so ask when booking.",
    tips: [
      {
        text: "Нужна закрытая обувь; длинные волосы собирают. Шлем застёгнут всё время на трассе.",
        textEn:
          "Closed-toe shoes are required and long hair must be tied back. Helmets stay fastened the whole time on the track.",
      },
      {
        text: "Возьмите одежду, которую не жалко: трасса грунтовая, на тропах бывает грязь.",
        textEn:
          "Wear clothes you don't mind getting dirty: the track is dirt and the trails can be muddy.",
      },
      {
        text: "В заезде максимум 5 картов — бронируйте заранее через сайт, Facebook, WhatsApp или LINE и спросите про текущие акции.",
        textEn:
          "There are at most 5 karts per session — book ahead via the website, Facebook, WhatsApp or LINE and ask about current promotions.",
      },
      {
        text: "Из отелей Паттайи есть бесплатный трансфер — зависит от района и наличия мест.",
        textEn:
          "Free transfer from Pattaya hotels is available, depending on location and availability.",
      },
      {
        text: "В день рождения именинник едет бесплатно, если с ним двое платящих друзей (нужен документ).",
        textEn:
          "On their birthday, the birthday person rides free with two paying friends (ID required).",
      },
    ],
    flags: { outdoor: true },
    entryRows: [
      {
        label: "Track — трасса, 30 мин",
        labelEn: "Track — 30 min",
        child: null,
        adult: 1450,
      },
      {
        label: "Trek — тропы в джунглях, 60 мин",
        labelEn: "Trek — jungle trails, 60 min",
        child: null,
        adult: 2450,
      },
      {
        label: "Track + Trek, 90 мин",
        labelEn: "Track + Trek, 90 min",
        child: null,
        adult: 3450,
      },
    ],
    note: "Цена за человека (за карт). Детских тарифов и минимального возраста на сайте нет — уточняйте при бронировании.",
    noteEn:
      "Price per person (per kart). The website lists no child rates or minimum age — ask when booking.",
    contacts: [
      { type: "website", value: "https://www.junglekart.shop/go-karting-pattaya" },
      { type: "phone", value: "+66 (0)83 818 1344" },
      { type: "facebook", value: "https://www.facebook.com/JungleKartOfficial" },
      { type: "instagram", value: "https://www.instagram.com/junglekartofficial" },
    ],
  },
  // Koh Samae San Nature Museum (พิพิธภัณฑ์ธรรมชาติเกาะแสมสาร)
  {
    slug: "koh-samae-san-nature-museum",
    description:
      "Музей естественной истории островов и моря Таиланда — на материке, у горы Кхао Ма Чо в Самэсане (район Саттахип), южнее Банг Сарая, примерно в часе езды от Паттайи. Здание стоит прямо напротив пирса, откуда идут лодки на остров Самэсан; музей ведает этим островом, и билеты на остров продают у его входа. Внутри — коллекции раковин и кораллов, геологические образцы и окаменелости, экспозиции об экосистемах островов и леса; живого аквариума нет. С верхнего этажа открывается вид на острова Самэсан и Кхам и побережье Саттахипа. На осмотр обычно хватает около часа — удобно совместить с поездкой на остров или на пляжи Самэсана; интереснее всего детям школьного возраста, которым нравятся ракушки, камни и «настоящие» коллекции.",
    descriptionEn:
      "The Thai Island and Sea Natural History Museum is on the mainland, at Khao Ma Jor in Samae San (Sattahip district), south of Bang Saray, roughly an hour's drive from Pattaya. The building stands right opposite the pier for boats to Koh Samae San; the museum oversees the island, and island tickets are sold at its entrance. Inside are shell and coral collections, geological specimens and fossils, and displays on island and forest ecosystems; there is no live aquarium. The top floor looks out over Koh Samae San, Koh Kham and the Sattahip coast. About an hour is enough for a visit — it pairs well with a trip to the island or the Samae San beaches, and school-age children who like shells, rocks and 'real' collections will get the most out of it.",
    tips: [
      {
        text: "Живых рыб и аквариумов здесь нет — это коллекции и стенды. Если ребёнок ждёт океанариум, предупредите заранее.",
        textEn:
          "There are no live fish or aquariums — it is collections and displays. If your child is expecting an aquarium, tell them beforehand.",
      },
      {
        text: "Если хотите на остров Самэсан, билеты на лодку продают у входа в музей, и число гостей на острове ограничено — в выходные приезжайте с утра или бронируйте заранее (сайт tis-museum.org, тел. 038 432 471).",
        textEn:
          "If you want to go to Koh Samae San, boat tickets are sold at the museum entrance and visitor numbers on the island are capped — on weekends come early or book ahead (tis-museum.org, tel. 038 432 471).",
      },
      {
        text: "Это территория флота: на острове и вокруг пирса действуют правила военно-морской базы — слушайте указания персонала.",
        textEn:
          "This is a navy-run area: navy rules apply on the island and around the pier — follow staff instructions.",
      },
      {
        text: "Ехать от Паттайи около часа на машине по Сукхумвиту на юг — удобно сделать из этого выезд на целый день.",
        textEn:
          "It is about an hour's drive south from Pattaya along Sukhumvit Road — easy to make a full day trip of it.",
      },
    ],
    flags: { indoor: true },
    contacts: [
      { type: "website", value: "https://www.tis-museum.org/" },
      { type: "phone", value: "038 432 471" },
    ],
  },
  // Legend Siam
  {
    slug: "legend-siam",
    description:
      "Большой тематический парк о культуре и истории Таиланда на Сукхумвите в На Джомтьене, к югу от Паттайи. Это город-декорация: улицы в духе разных регионов страны и старого Сиама, храмовая ярмарка, плавучий рынок с едой, огромные ворота и статуи стражей-яков у входа. С ребёнком здесь гуляют, едят, смотрят шоу и катаются: есть прогулка на лодке-лонгтейле, колесо обозрения, «викинг», карусель, зеркальный лабиринт и «дом с привидениями» Baan Mae Nak — часть развлечений платная отдельно от входа. Малыши ниже 90 см проходят бесплатно, для детей ростом 90–140 см — детский билет. Территория в основном под открытым небом, так что лучше приезжать ближе к вечеру.",
    descriptionEn:
      "A large theme park about Thai culture and history on Sukhumvit Road in Na Jomtien, south of Pattaya. It is a stage-set town: streets styled after the country's regions and old Siam, a temple fair, a floating market with food, and a huge gateway guarded by giant yaksha statues. With children you walk, eat, watch shows and take rides: there is a long-tail boat trip, a Ferris wheel, a Viking ship, a carousel, a mirror maze and the Baan Mae Nak haunted house — some of these cost extra on top of entry. Toddlers under 90 cm go free, and children 90–140 cm tall pay the child rate. Most of the park is outdoors, so it is best to come later in the afternoon.",
    tips: [
      {
        text: "Детский билет — для роста 90–140 см, ниже 90 см — бесплатно. Измерьте ребёнка заранее.",
        textEn:
          "The child ticket is for heights of 90–140 cm; under 90 cm is free. Measure your child beforehand.",
      },
      {
        text: "Зеркальный лабиринт Black Magic и дом с привидениями Baan Mae Nak оплачиваются отдельно; дом с привидениями может напугать маленьких.",
        textEn:
          "The Black Magic mirror maze and the Baan Mae Nak haunted house cost extra; the haunted house may frighten little ones.",
      },
      {
        text: "Часы в разных источниках расходятся (закрытие от 18:00 до 20:00, есть упоминание выходного по средам) — проверьте перед поездкой по телефону 083 307 3333.",
        textEn:
          "Opening hours differ between sources (closing from 18:00 to 20:00, and one mentions Wednesday closures) — check before you go: 083 307 3333.",
      },
      {
        text: "Вечером в парке проходит шоу; расписание уточняйте на месте.",
        textEn: "There is an evening show in the park; check the schedule on site.",
      },
      {
        text: "В День детей (вторая суббота января) парк уже делал бесплатный вход для детей и взрослых — следите за анонсами.",
        textEn:
          "On Thai Children's Day (the second Saturday of January) the park has previously offered free entry for children and adults — watch for announcements.",
      },
    ],
    flags: { outdoor: true, hasFood: true },
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/legendsiampattaya" },
      { type: "phone", value: "083 307 3333" },
    ],
  },
  // Level3 Hub
  {
    slug: "level3-hub",
    description:
      "Игровой клуб на третьем этаже комплекса Again Pattaya на North Pattaya Road, напротив Terminal 21. Внутри, в помещении с кондиционером, — четыре зоны: гоночные симуляторы с настоящими рулями и педалями, VR-арена, консольные залы с PlayStation 5 Pro, Nintendo Switch 2 и ретро-PlayStation и игровые компьютеры. Детей пускают на консоли, компьютеры и симуляторы — сотрудники подгоняют гоночное кресло под рост; VR — с 10 лет. Дети до 12 лет играют, когда рядом взрослый, и взрослые могут присоединиться. Оплата — на стойке перед игрой за выбранное время, наличными или по QR PromptPay; бронировать не обязательно. Хороший вариант на дождливый день с детьми школьного возраста.",
    descriptionEn:
      "A gaming lounge on the third floor of Again Pattaya on North Pattaya Road, opposite Terminal 21. Inside, with air-con, there are four zones: racing simulators with real wheels and pedals, a VR arena, console lounges with PlayStation 5 Pro, Nintendo Switch 2 and retro PlayStations, and gaming PCs. Children can use the consoles, PCs and racing rigs — staff adjust the racing seat to their height; VR is from age 10. Under-12s play with a grown-up nearby, and the adults can join in. You pay at the counter before you start, for the time you choose, in cash or by PromptPay QR; no booking is needed. A good option for a rainy day with school-age kids.",
    tips: [
      {
        text: "По будням с 12:00 до 18:00 действует Kids Hour: детям до 14 лет консольный зал — 90 ฿.",
        textEn:
          "On weekdays from 12:00 to 18:00 there is Kids Hour: the console hall for under-14s for 90 ฿.",
      },
      {
        text: "Лифта нет: клуб на третьем этаже, подниматься по жёлтой лестнице (корпус H). С коляской неудобно.",
        textEn:
          "There's no lift: the club is on the third floor, up the yellow staircase (Building H). Not easy with a stroller.",
      },
      {
        text: "Как найти: вход с синей вывеской «again» рядом с McDonald’s, напротив Terminal 21; дальше держаться левее, мимо парковки, до дальнего угла.",
        textEn:
          'How to find it: the entrance with the blue "again" sign is next to McDonald’s, opposite Terminal 21; keep left past the car park to the far corner.',
      },
      {
        text: "Для симуляторов лучше обувь на плоской подошве или носки.",
        textEn: "For the racing rigs, flat shoes or socks work best.",
      },
      {
        text: "На стойке есть кофе, холодные напитки и снеки.",
        textEn: "Coffee, cold drinks and snacks are sold at the counter.",
      },
      {
        text: "Детский день рождения: пакет на два часа по всем зонам и VIP-комната, до 15 гостей — по брони.",
        textEn:
          "Kids' birthdays: a two-hour pack across all zones plus the VIP Room, up to 15 guests — by booking.",
      },
    ],
    hours: {
      MON: { open: "09:00", close: "00:00" },
      TUE: { open: "09:00", close: "00:00" },
      WED: { open: "09:00", close: "00:00" },
      THU: { open: "09:00", close: "00:00" },
      FRI: { open: "09:00", close: "00:00" },
      SAT: { open: "09:00", close: "00:00" },
      SUN: { open: "09:00", close: "00:00" },
    },
    flags: { indoor: true, hasAirCon: true, hasParking: true, hasCafeSeating: true },
    entryRows: [
      {
        label: "Kids Hour — консольный зал, до 14 лет (будни 12:00–18:00)",
        labelEn: "Kids Hour — console hall, under 14 (weekdays 12:00–18:00)",
        child: 90,
        adult: null,
      },
      {
        label: "Консольный зал — за игрока, от",
        labelEn: "Console hall — per player, from",
        child: 80,
        adult: 80,
      },
      {
        label: "Гоночный симулятор — 15 минут, от",
        labelEn: "Sim racing — 15 minutes, from",
        child: 130,
        adult: 130,
      },
      {
        label: "VR-арена — 15 минут, от (с 10 лет)",
        labelEn: "VR arena — 15 minutes, from (age 10+)",
        child: 200,
        adult: 200,
      },
      {
        label: "Игровой компьютер — 30 минут, от",
        labelEn: "Gaming PC — 30 minutes, from",
        child: 70,
        adult: 70,
      },
    ],
    note: "Платите за игру, а не за вход. Дети до 12 лет — со взрослым рядом. Оплата наличными или по QR PromptPay.",
    noteEn:
      "You pay for play time, not for entry. Under-12s need a grown-up nearby. Cash or PromptPay QR.",
    contacts: [
      { type: "website", value: "https://play.level3hub.com/" },
      { type: "instagram", value: "https://instagram.com/level3hub" },
      { type: "line", value: "https://line.me/R/ti/p/@170aiegt" },
      { type: "phone", value: "+66 99 379 8842" },
    ],
  },
  // Mini Golf Pattaya
  {
    slug: "mini-golf-pattaya",
    description:
      "Мини-гольф на 18 лунок при ресторане Bon Appétit на Thappraya Road — на большой дороге между Паттайей и Джомтьеном, напротив отеля Mr Mac's. Поле на улице, рядом с рестораном французской и тайской кухни: взрослые могут сесть в зале с кондиционером или на террасе с вентиляторами, откуда видно поле, пока дети играют. Сам ресторан пишет, что мини-гольф — «для маленьких и больших», и называет атмосферу семейной. Это спокойное занятие на час для детей, которые уже могут удержать клюшку, — удобно совместить с обедом или ужином.",
    descriptionEn:
      "An 18-hole mini golf course at the Bon Appétit restaurant on Thappraya Road — the main road between Pattaya and Jomtien, opposite Mr Mac's Hotel. The course is outdoors next to a French and Thai restaurant: adults can sit in the air-conditioned dining room or on the fan-cooled terrace overlooking the course while the children play. The restaurant describes the mini golf as being for young and old alike and the atmosphere as family-friendly. It is a calm hour's activity for children old enough to hold a putter, and easy to combine with lunch or dinner.",
    tips: [
      { text: "По понедельникам закрыто.", textEn: "Closed on Mondays." },
      {
        text: "Поле на улице — днём жарко, приятнее играть ближе к вечеру.",
        textEn:
          "The course is outdoors — it gets hot by day, so late afternoon is more pleasant.",
      },
      {
        text: "Перед поездкой лучше позвонить: 089 933 7836 — сайт давно не обновлялся.",
        textEn:
          "Call before you go: 089 933 7836 — the website has not been updated for a while.",
      },
    ],
    hours: {
      MON: "closed",
      TUE: { open: "11:00", close: "22:00" },
      WED: { open: "11:00", close: "22:00" },
      THU: { open: "11:00", close: "22:00" },
      FRI: { open: "11:00", close: "22:00" },
      SAT: { open: "11:00", close: "22:00" },
      SUN: { open: "11:00", close: "22:00" },
    },
    flags: {
      outdoor: true,
      hasFood: true,
      hasAirCon: true,
      hasFans: true,
      hasCafeSeating: true,
    },
    contacts: [
      { type: "website", value: "https://restaurantminigolf.wixsite.com/bon-appetit" },
      { type: "phone", value: "089 933 7836" },
      {
        type: "facebook",
        value:
          "https://www.facebook.com/Bon-App%C3%A9tit-Restaurant-et-Mini-Golf-217722428978120/",
      },
    ],
  },
  // Naklua Chalermprakiat Park
  {
    slug: "naklua-chalermprakiat-park",
    description:
      "Городской парк на набережной Наклуа, на Naklua Road, рядом с рыбным рынком Лан Пхо — местные называют его ещё парком Лан Пхо. Небольшой и зелёный: большие деревья, дорожки вдоль залива, лавочки у воды, площадка с тренажёрами, детская площадка с горками и часовая башня. Хорош утром или под вечер, когда спадает жара: дети бегают и катаются с горок, взрослые сидят у моря. Вход свободный. Рядом рынок Лан Пхо — там можно купить морепродукты, и их приготовят на месте.",
    descriptionEn:
      "A city park on the Naklua waterfront, on Naklua Road next to the Lan Pho seafood market — locals also call it Lan Pho Park. It is small and green: big trees, paths along the bay, benches by the water, an outdoor exercise area, a children's playground with slides and a clock tower. It is best in the morning or towards the evening when the heat eases: children run around and use the slides while adults sit by the sea. Entry is free. The Lan Pho market next door sells seafood, and vendors will cook it for you on the spot.",
    tips: [
      {
        text: "Приходите утром или после 16:00 — днём на площадке жарко.",
        textEn: "Come in the morning or after 4 pm — the playground is hot at midday.",
      },
      {
        text: "В октябре 2026 при проверке города часть оборудования на площадке была изношена — посмотрите, в каком состоянии горки, прежде чем пустить ребёнка.",
        textEn:
          "A city inspection in October 2026 found some playground equipment worn — check the slides before letting your child play.",
      },
      {
        text: "Пообедать удобно на соседнем рынке Лан Пхо: покупаете морепродукты, их готовят тут же; по отзывам, наверху есть ресторан.",
        textEn:
          "For lunch, the Lan Pho market next door is convenient: buy seafood and have it cooked on the spot; according to reviews, there is a restaurant upstairs.",
      },
      {
        text: "По отзывам, территория небольшая — это скорее остановка на час, чем на полдня.",
        textEn:
          "According to reviews, the park is small — more of a one-hour stop than a half-day outing.",
      },
      { text: "В парк пускают с собаками.", textEn: "Dogs are allowed in the park." },
    ],
    hours: {
      MON: { open: "04:00", close: "22:00" },
      TUE: { open: "04:00", close: "22:00" },
      WED: { open: "04:00", close: "22:00" },
      THU: { open: "04:00", close: "22:00" },
      FRI: { open: "04:00", close: "22:00" },
      SAT: { open: "04:00", close: "22:00" },
      SUN: { open: "04:00", close: "22:00" },
    },
    flags: { outdoor: true, hasFood: true },
    categorySlugs: ["playground"],
    free: true,
  },
  // Pattaya City Park
  {
    slug: "pattaya-city-park-chaiyaphruek",
    description:
      "Большой городской парк на улице Chaiyaphruek 2, между Джомтьеном и Сукхумвитом. Это просторное открытое поле с пальмами и живыми изгородями: вокруг идёт дорожка для бега и велосипеда, есть баскетбольная, волейбольная и футбольная площадки и, по свежим отзывам, детская площадка. Людей обычно немного, поэтому парк подходит, чтобы покататься с ребёнком на велосипеде или самокате и побегать по траве. Раз в год, в феврале, здесь проходит мотофестиваль Burapa Bike Week — в эти дни парк превращается в ярмарку с концертами. Вход бесплатный.",
    descriptionEn:
      "A large city park on Chaiyaphruek 2 Road, between Jomtien and Sukhumvit. It is a wide open field with palms and hedges: a running and cycling path loops around it, and there are basketball, volleyball and football courts and, according to recent reviews, a children's playground. It is usually quiet, so it works well for riding a bike or scooter with your child and running around on the grass. Once a year, in February, it hosts the Burapa Bike Week motorbike festival, when the park turns into a fair with concerts. Entry is free.",
    tips: [
      {
        text: "Парк открытый, и гулять здесь, по отзывам, лучше утром или ближе к вечеру, когда спадает жара.",
        textEn:
          "The park is open to the sun; according to reviews, mornings or late afternoons are best, once the heat drops.",
      },
      {
        text: "Возьмите велосипед, беговел или самокат: вокруг парка идёт ровная дорожка.",
        textEn:
          "Bring a bike, balance bike or scooter: a smooth path runs around the park.",
      },
      {
        text: "В феврале, во время Burapa Bike Week, в парке шумно и людно — для спокойной прогулки выбирайте другие дни.",
        textEn:
          "In February, during Burapa Bike Week, the park is loud and crowded — pick other days for a quiet walk.",
      },
      {
        text: "По отзывам, в парке живут прикормленные собаки — держите это в голове, если ребёнок их боится.",
        textEn:
          "According to reviews, there are fed street dogs in the park — keep this in mind if your child is afraid of dogs.",
      },
    ],
    flags: { outdoor: true },
    categorySlugs: ["playground"],
    free: true,
  },
  // Pattaya Art Museum
  {
    slug: "pattaya-art-museum",
    description:
      "Частный художественный музей на юге Паттайи, к востоку от Сукхумвита, на дороге Toongklom-Talman; сам себя называет музеем искусства Восточного Таиланда. Трёхэтажное пространство со сменяющимися экспозициями: работы в манере старых мастеров, зарубежные и тайские художники, в основном живопись. При музее работает арт-кафе с кофе и матчей. Специальных детских программ на страницах музея нет, так что это скорее спокойная прогулка с ребёнком постарше, которому интересно рисование, чем развлечение для малышей.",
    descriptionEn:
      "A private art museum in the south of Pattaya, east of Sukhumvit, on Toongklom-Talman Road; it describes itself as the art museum of Eastern Thailand. It is a three-storey space with changing displays: old-master-style works and pieces by international and Thai artists, mostly paintings. There is an art café with coffee and matcha. The museum's pages mention no special children's programmes, so this is more of a quiet outing with an older child who likes drawing than entertainment for little ones.",
    tips: [
      {
        text: "Перед поездкой позвоните: музей открылся недавно, часы и цена входа пока нигде толком не опубликованы.",
        textEn:
          "Call before you go: the museum opened recently, and its hours and ticket price are not clearly published yet.",
      },
      {
        text: "В зале с картинами малышей лучше держать за руку — экспонаты не для касания.",
        textEn:
          "Keep small children close in the galleries — the works are not to be touched.",
      },
    ],
    flags: { indoor: true, hasFood: true, hasCafeSeating: true },
    contacts: [
      { type: "website", value: "https://pattayaartmuseum.com/" },
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=61576550618704",
      },
      { type: "phone", value: "081 846 1966" },
    ],
  },
  // Pattaya City Public Library
  {
    slug: "pattaya-city-public-library",
    description:
      "Городская публичная библиотека Паттайи на Тепразит, в сое 7, рядом с молодёжным центром. Вход свободный для всех. Есть отдельный детский уголок: много детских книг, низкие столики и стульчики, немного места для игры — можно прийти с ребёнком почитать или спокойно позаниматься. Книги в основном на тайском, но есть полки на английском, немецком и французском, газеты и журналы, компьютеры для поиска по каталогу, столы и кабинки для работы. Если оформить читательскую карточку, можно брать домой до 4 книг на 7 дней. Хороший тихий вариант на жаркие дневные часы, когда хочется под крышу и без покупок.",
    descriptionEn:
      "Pattaya's city public library on Thepprasit Soi 7, next to the youth centre. Entry is free for everyone. There is a dedicated children's corner with plenty of picture books, low tables and chairs and a little space to play — a good place to read with your child or have a quiet activity. Most books are in Thai, but there are shelves in English, German and French, plus newspapers and magazines, catalogue computers, and tables and booths for study or work. With a library card you can borrow up to 4 books for 7 days. A quiet option for the hot middle of the day when you want to be indoors without shopping.",
    tips: [
      {
        text: "Воскресенье, понедельник и праздничные дни — выходные. По субботам библиотека открыта до 17:00.",
        textEn:
          "Closed on Sundays, Mondays and public holidays. On Saturdays it is open until 17:00.",
      },
      {
        text: "Чтобы брать книги домой, оформите читательскую карточку на месте: до 4 книг на 7 дней.",
        textEn:
          "To borrow books, sign up for a library card on site: up to 4 books for 7 days.",
      },
      {
        text: "Детские книги почти все на тайском — для чтения на английском или русском лучше взять книжку с собой, а здесь просто посидеть в детском уголке.",
        textEn:
          "Children's books are almost all in Thai — for reading in English, bring your own book and just enjoy the children's corner.",
      },
      {
        text: "В зале тихо: с малышом, который шумит, лучше выбрать время, когда людей меньше, например утро буднего дня.",
        textEn:
          "The reading room is quiet: with a noisy toddler, pick a less busy time such as a weekday morning.",
      },
      {
        text: "Сумки по правилам оставляют на стойке хранения у входа.",
        textEn: "Bags are left at the bag deposit counter by the entrance.",
      },
    ],
    hours: {
      MON: "closed",
      TUE: { open: "08:30", close: "16:30" },
      WED: { open: "08:30", close: "16:30" },
      THU: { open: "08:30", close: "16:30" },
      FRI: { open: "08:30", close: "16:30" },
      SAT: { open: "09:00", close: "17:00" },
      SUN: "closed",
    },
    flags: { indoor: true },
    free: true,
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/libpattaya.pattayacity/" },
    ],
  },
  // Phornprapha Botanic Garden
  {
    slug: "phornprapha-botanic-garden",
    description:
      "Ухоженный сад семьи Пхорнпрапха (основателей компании Siam Motors) в Понге, на дороге к гольф-клубу Siam Country Club; на указателях он же — Cherdchoomit Garden. Компания называет его ботаническим садом, где сохраняют разные виды деревьев и цветов для обучения. На открытой лужайке — пагоды, пруд со статуей змея-наги, а детям интереснее всего старый отреставрированный поезд и двухмоторный самолёт у здания с коллекцией машин Datsun. По описаниям, вход свободный. Это короткая прогулка на полчаса-час — например, по пути к озеру Мабпрачан.",
    descriptionEn:
      "A well-kept garden of the Phornprapha family (founders of Siam Motors) in Pong, on the road to Siam Country Club; it is also signposted as Cherdchoomit Garden. The company calls it a botanic garden that preserves various trees and flowers for education. On the open lawn there are pagodas and a pond with a naga serpent statue, and children usually like the restored vintage train and the twin-prop plane by the building with the Datsun car collection. According to descriptions, entry is free. It makes a short half-hour-to-an-hour walk, for example on the way to Mabprachan Lake.",
    tips: [
      {
        text: "Павильоны на территории — семейные усыпальницы; к ним лучше не подходить и вести себя тихо.",
        textEn:
          "The pavilions on the grounds hold family ancestors' remains; keep away from them and keep voices down.",
      },
      {
        text: "Здание музея Datsun, по отзывам, в последние годы бывает закрыто — тогда смотрят только поезд, самолёт и сад снаружи.",
        textEn:
          "According to reviews, the Datsun museum building has often been closed in recent years — then you only see the train, plane and garden outside.",
      },
      {
        text: "Официальных часов нет; ехать лучше днём и с запасом на то, что ворота могут быть закрыты.",
        textEn:
          "There are no official opening hours; go in the daytime and be prepared for the gate to be closed.",
      },
    ],
    flags: { outdoor: true },
    free: true,
    contacts: [
      {
        type: "website",
        value: "https://www.siammotors.com/en/social-mission/phornprapha-botanic/",
      },
    ],
  },
  // Pet and Play Cafe
  {
    slug: "pet-and-play-cafe",
    description:
      "Кафе-ресторан в Хуай Яе с собачьей площадкой и детской игровой зоной на улице. Его придумали для тех, кто приезжает с собакой: для собак есть отдельный огороженный выгул, а рядом — детская площадка, так что семья может выгулять и собаку, и детей, а взрослые тем временем посидеть с кофе или пообедать. По отзывам, на территории живут овцы и кролики. Кухня тайская и европейская, цены, по отзывам, умеренные. Место за городом, к востоку от Сукхумвита, — удобнее на машине.",
    descriptionEn:
      "A café-restaurant in Huai Yai with a dog park and an outdoor children's play area. It was set up for people who come with a dog: there is a separate fenced run for dogs, and next to it a playground, so a family can let both the dog and the children run while the adults have a coffee or lunch. According to reviews, sheep and rabbits live on the grounds. The food is Thai and Western, and reviewers call the prices reasonable. It is out of town, east of Sukhumvit — easiest to reach by car.",
    tips: [
      {
        text: "Детская площадка и собачий выгул рядом: по отзывам, гости иногда отпускают собак на детскую зону, а персонал не вмешивается. Если ребёнок боится собак, лучше прийти в будний день.",
        textEn:
          "The playground and the dog run are next to each other: according to reviews, some guests let their dogs onto the kids' area and the staff do not step in. If your child is nervous around dogs, a weekday visit is better.",
      },
      {
        text: "Площадка уличная — в жару приходите утром; кафе открывается в 9:00 (часы — с карты).",
        textEn:
          "The playground is outdoors — in the heat, come in the morning; the café opens at 9:00 (hours from the map).",
      },
      {
        text: "Перед поездкой можно позвонить: 095 776 4698.",
        textEn: "You can call ahead: 095 776 4698.",
      },
    ],
    flags: { indoor: false, outdoor: true, hasFood: true, hasCafeSeating: true },
    categorySlugs: ["cafe-kids-zone"],
    free: true,
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=61561136964651",
      },
      { type: "instagram", value: "https://www.instagram.com/petandplaycafe" },
      { type: "phone", value: "095 776 4698" },
    ],
  },
  // Piya Silpakarn Art Gallery
  {
    slug: "piya-silpakarn-art-gallery",
    description:
      "Небольшая частная галерея современного искусства на Сукхумвите, в Северной Паттайе (район Наклуа), — тайское название หอศิลป์ปิยะศิลปาคาร. На первом этаже — арт-кафе One Day Esthetic и лавка с открытками, керамикой и книгами, наверху — выставочный зал и уголок с книгами; выставки меняются, бывают и выставки детских рисунков. Вход в галерею бесплатный. Главное для детей — мастер-классы, их проводят в кафе: рисование на холсте, роспись керамики, тарелок и сумок, свечи, тай-дай; по отзывам, есть занятия и для маленьких. В сезон в саду устраивают семейный кинотеатр под открытым небом с классическими фильмами.",
    descriptionEn:
      "A small private contemporary art gallery on Sukhumvit Road in North Pattaya (Naklua area). On the ground floor there is the One Day Esthetic art café and a shop with postcards, ceramics and books; upstairs is the exhibition hall and a reading corner. Exhibitions change, and sometimes they show children's art. Entry to the gallery is free. For children, the main draw is the workshops held in the café: canvas painting, painting ceramics, plates and bags, candle making and tie-dye; according to reviews, there are sessions for little ones too. In season, the garden hosts a family open-air cinema showing classic films.",
    tips: [
      {
        text: "Вход в галерею бесплатный; мастер-классы и кафе оплачиваются отдельно — цену занятия уточните на месте.",
        textEn:
          "Entry to the gallery is free; workshops and the café are paid separately — check workshop prices on site.",
      },
      {
        text: "Часы в разных источниках расходятся, а по понедельникам галерея, по отзывам, закрыта — позвоните перед поездкой.",
        textEn:
          "Sources give different opening hours, and according to reviews the gallery is closed on Mondays — call before you go.",
      },
      {
        text: "На роспись и рисование наденьте ребёнку одежду, которую не жалко испачкать.",
        textEn:
          "For painting workshops, dress your child in clothes you don't mind getting messy.",
      },
      {
        text: "Сезонный кинотеатр в саду (Pattaya Backyard Cinema) работает в прохладные месяцы, билеты ограничены — расписание публикуют на странице в Facebook.",
        textEn:
          "The seasonal garden cinema (Pattaya Backyard Cinema) runs in the cooler months with limited tickets — the schedule is posted on the Facebook page.",
      },
      {
        text: "По отзывам, парковка у галереи удобная.",
        textEn: "According to reviews, parking at the gallery is convenient.",
      },
    ],
    flags: { indoor: true, hasFood: true, hasCafeSeating: true, hasParking: true },
    free: true,
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/piyasilpakanpattaya" },
      { type: "phone", value: "094 427 3939" },
    ],
  },
  // Pinn Kid's Club
  {
    slug: "pinn-kids-club",
    description:
      "Детский клуб при отеле Pinnacle Grand Jomtien в На Джомтьене (Сукхумвит, сой Na Jomtien 8), открылся в конце 2024 года. Занятия ведут педагог и аниматор: игры, поделки, английский и плавание в игровой форме, а по выходным — отдельные мастер-классы: роспись по фарфору, робототехника, соревнования по стрельбе из лука. Часть программы проходит на улице — на газоне и деревянной игровой площадке в саду отеля. Клуб помогает и с детскими праздниками. Открыт со вторника по воскресенье; можно ли прийти, не живя в отеле, и сколько это стоит, на сайте не сказано — уточняйте по телефону.",
    descriptionEn:
      "A kids' club at the Pinnacle Grand Jomtien resort in Na Jomtien (Sukhumvit Road, Na Jomtien Soi 8), opened in late 2024. Sessions are run by a teacher and an animator: games, crafts, and English and swimming taught through play, plus special weekend workshops such as porcelain painting, robotics and an archery contest. Part of the programme is outdoors, on the lawn and the wooden play structure in the resort garden. The club also helps with children's parties. It is open Tuesday to Sunday; whether non-guests can join and what it costs is not stated on the website — call to check.",
    tips: [
      {
        text: "Перед визитом позвоните (097 243 1265): спросите, пускают ли детей не из отеля, сколько стоит и какие занятия в этот день.",
        textEn:
          "Call before you go (097 243 1265): ask whether non-guests are welcome, what it costs and what is on that day.",
      },
      { text: "По понедельникам клуб закрыт.", textEn: "The club is closed on Mondays." },
      {
        text: "Мастер-классы (фарфор, робототехника, стрельба из лука) — по выходным; расписание лучше уточнить заранее.",
        textEn:
          "Workshops (porcelain painting, robotics, archery) run at weekends; check the schedule in advance.",
      },
      {
        text: "Часть игр проходит на улице — возьмите ребёнку панаму и бутылку воды.",
        textEn:
          "Some games are outdoors — bring a sun hat and a water bottle for your child.",
      },
    ],
    hours: {
      MON: "closed",
      TUE: { open: "09:30", close: "18:00" },
      WED: { open: "09:30", close: "18:00" },
      THU: { open: "09:30", close: "18:00" },
      FRI: { open: "09:30", close: "18:00" },
      SAT: { open: "09:30", close: "18:00" },
      SUN: { open: "09:30", close: "18:00" },
    },
    flags: { indoor: true, outdoor: true },
    contacts: [
      { type: "website", value: "https://pattaya.pinnaclehotels.com/pinn-kids-club/" },
      { type: "phone", value: "097 243 1265" },
      { type: "facebook", value: "https://www.facebook.com/pinnkidsclub" },
      { type: "instagram", value: "https://www.instagram.com/pinnkidsclubpattaya" },
    ],
  },
  // Public Park Soi Chaiyapruek 4
  {
    slug: "public-park-chaiyapruek-4",
    description:
      "Небольшой городской парк в Джомтьене, на Soi Chaiyapruek 4 — переулке от Jomtien Second Road напротив комплекса Riviera (тот же поворот, что к ресторану Ninja BBQ). Внутри — дорожка вокруг большого пруда, ухоженный сад, уличные тренажёры и маленькая детская площадка. По отзывам, здесь чисто и тихо, за садом постоянно следят садовники, есть туалеты. Хорошее место для спокойной прогулки с малышом или пробежки родителя, пока ребёнок играет; специально ехать издалека ради площадки не стоит.",
    descriptionEn:
      "A small public park in Jomtien on Soi Chaiyapruek 4, a lane off Jomtien Second Road opposite the Riviera complex (the same turning as for the Ninja BBQ restaurant). Inside there is a path around a large pond, a well-kept garden, outdoor exercise equipment and a small children's playground. According to reviews it is clean and quiet, gardeners look after it all the time, and there are toilets. A good spot for a calm walk with a toddler or for a parent's jog while the child plays; it is not worth a long trip just for the playground.",
    tips: [
      {
        text: "С главной дороги парк найти непросто: сворачивайте с Jomtien Second Road в Soi Chaiyapruek 4 напротив Riviera.",
        textEn:
          "The park is hard to spot from the main road: turn off Jomtien Second Road into Soi Chaiyapruek 4, opposite the Riviera.",
      },
      {
        text: "Парк открыт с 5:00 до 21:00 (часы — с карты); в жару лучше рано утром или вечером.",
        textEn:
          "The park is open 05:00–21:00 (hours from the map); in the heat, come early morning or in the evening.",
      },
      {
        text: "По отзывам, сюда часто приводят собак без поводка, в том числе на детскую зону.",
        textEn:
          "According to reviews, people often bring dogs off the lead here, including onto the kids' area.",
      },
      {
        text: "У пруда держите малыша за руку.",
        textEn: "Keep hold of a toddler's hand near the pond.",
      },
    ],
    hours: {
      MON: { open: "05:00", close: "21:00" },
      TUE: { open: "05:00", close: "21:00" },
      WED: { open: "05:00", close: "21:00" },
      THU: { open: "05:00", close: "21:00" },
      FRI: { open: "05:00", close: "21:00" },
      SAT: { open: "05:00", close: "21:00" },
      SUN: { open: "05:00", close: "21:00" },
    },
    flags: { indoor: false, outdoor: true },
    categorySlugs: ["playground"],
    free: true,
  },
  // Skatepark Under the Bridge
  {
    slug: "skatepark-under-the-bridge",
    description:
      "Городской скейт-парк в Южной Паттайе, под эстакадой, ведущей к пирсу Бали Хай. Площадку город построил на месте пустыря под мостом; в 2021 году её проверила и одобрила Таиландская ассоциация экстремальных видов спорта. Это огороженная узкая полоса с фигурами для скейта: по отзывам, здесь есть что делать и новичкам, и тем, кто катается уверенно, а у входа дежурит смотритель. Место для детей и подростков со своим скейтом, самокатом или роликами; бетон и тень от эстакады — плюс в жаркий день. Вход бесплатный.",
    descriptionEn:
      "A public skatepark in South Pattaya, under the flyover leading to Bali Hai Pier. The city built it on unused land beneath the bridge, and in 2021 it was inspected and approved by the Thailand Extreme Sports Association. It is a fenced, narrow strip with skate obstacles: according to reviews, there is something for both beginners and confident riders, and a caretaker watches the gate. It suits children and teens who bring their own skateboard, scooter or skates; the shade from the flyover helps on a hot day. Entry is free.",
    tips: [
      {
        text: "Наденьте ребёнку шлем и защиту: по правилам площадки без защитной экипировки кататься нельзя.",
        textEn:
          "Put a helmet and pads on your child: the park's rules require safety gear.",
      },
      {
        text: "Свой скейт, самокат или ролики берите с собой: о прокате на месте нигде не упоминается.",
        textEn:
          "Bring your own skateboard, scooter or skates — there is no mention of rentals on site.",
      },
      {
        text: "Добраться удобно на сонгтэо или такси через приложение — площадка на въезде к пирсу Бали Хай (по отзывам).",
        textEn:
          "It is easy to reach by songthaew or a ride-hailing app — the park is on the approach to Bali Hai Pier (according to reviews).",
      },
    ],
    flags: { outdoor: true, hasCoveredArea: true },
    free: true,
  },
  // Space & Time Cube
  {
    slug: "space-time-cube-central-pattaya",
    description:
      "Музей иммерсивного цифрового искусства на 6-м этаже ТЦ Central Pattaya (Second Road), открылся в конце ноября 2025 года. Это залы, где проекции, свет и звук окружают со всех сторон: космос, путешествие во времени, планеты; есть интерактивные зоны. Отдельно есть «Прыгающий космический корабль» — короткий 4D-фильм на подвижных креслах. Дети приходят в основном ради ярких залов и фотографий, взрослые — за красивыми кадрами. На всё уходит час-полтора, внутри кондиционер, а в самом ТЦ есть где поесть.",
    descriptionEn:
      "An immersive digital art museum on the 6th floor of Central Pattaya mall (Second Road), opened in late November 2025. These are rooms where projections, light and sound surround you: space, time travel, planets; there are interactive zones. Separately there is the Jumping Spacecraft — a short 4D film on moving seats. Children mostly come for the bright rooms and photos, adults for the pictures. A visit takes an hour or so, it is air-conditioned, and the mall has plenty of places to eat.",
    tips: [
      {
        text: "По правилам у продавцов билетов: дети ниже 80 см проходят в главный зал бесплатно, детский билет — на рост 80–140 см, ребёнок всё время с взрослым.",
        textEn:
          "According to ticket sellers' rules: children under 80 cm enter the Main Hall free, the child ticket is for 80–140 cm, and children must stay with an adult.",
      },
      {
        text: "На 4D-корабль не пускают детей ниже 100 см — для малышей берите билет только в главный зал.",
        textEn:
          "Children under 100 cm cannot ride the 4D spacecraft — for little ones, buy a Main Hall-only ticket.",
      },
      {
        text: "Группе от 4 человек в ноябре 2026 действует скидка 10% — акции регулярно публикуют на странице в Facebook.",
        textEn:
          "Groups of 4 or more get 10% off in November 2026 — promotions are posted regularly on the Facebook page.",
      },
      {
        text: "Музей — на одном этаже с кинотеатром; парковка — в ТЦ Central Pattaya.",
        textEn:
          "The museum is on the same floor as the cinema; park at Central Pattaya mall.",
      },
    ],
    flags: { indoor: true, hasAirCon: true, hasFood: true, hasParking: true },
    entryRows: [
      { label: "Главный зал (Main Hall)", labelEn: "Main Hall", child: null, adult: 599 },
    ],
    note: "Цена с официальной страницы (ноябрь 2026), за человека. Цену детского билета (рост 80–140 см) и комбо-билета с 4D-кораблём уточняйте на кассе; дети ниже 80 см — бесплатно.",
    noteEn:
      "Price from the official page (November 2026), per person. Check the child ticket (80–140 cm) and the combo ticket with the 4D spacecraft at the box office; children under 80 cm enter free.",
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=61591994723409",
      },
      { type: "phone", value: "082 420 0008" },
    ],
  },
  // Tarzan Trail Adventure Park
  {
    slug: "tarzan-trail-horseshoe-point",
    description:
      "Верёвочный парк в кронах деревьев на территории конного курорта Horseshoe Point в Понге, в глубине от основных дорог. По описаниям, это трасса примерно из 25–34 этапов: несколько зиплайнов, подвесные мостики, верёвочные качели, вертикальная лестница и велосипед на тросе; проходят её около часа с инструктором. Сам Horseshoe Point — большой зелёный курорт с конной школой, где есть и другие развлечения: стрельба из лука, пейнтбол, водные игры. Трасса рассчитана на ребят постарше и подростков, которые не боятся высоты; минимальный возраст и рост официально нигде не указаны — уточняйте по телефону.",
    descriptionEn:
      "A treetop ropes course on the grounds of the Horseshoe Point equestrian resort in Pong, set back from the main roads. According to descriptions, the trail has about 25–34 stages: several ziplines, suspended bridges, rope swings, a vertical ladder and a sky bike on a cable; it takes around an hour with a guide. Horseshoe Point itself is a large green resort with a riding school and other activities: archery, paintball and water games. The course suits older children and teenagers who are fine with heights; no minimum age or height is published officially — check by phone.",
    tips: [
      {
        text: "Наденьте закрытую обувь и удобную спортивную одежду.",
        textEn: "Wear closed-toe shoes and comfortable sportswear.",
      },
      {
        text: "По отзывам, курорт непросто найти — заранее проложите маршрут; по-английски на ресепшен говорят не всегда.",
        textEn:
          "According to reviews, the resort is hard to find — plan your route in advance; reception staff do not always speak English.",
      },
      {
        text: "Перед поездкой позвоните в Horseshoe Point (038 735 050) и уточните, работает ли трасса, цену и с какого возраста пускают.",
        textEn:
          "Before going, call Horseshoe Point (038 735 050) to check the course is running, the price and the minimum age.",
      },
    ],
    flags: { outdoor: true },
    contacts: [
      { type: "website", value: "https://horseshoepoint.com/en" },
      { type: "phone", value: "038 735 050" },
      { type: "facebook", value: "https://www.facebook.com/horseshoepointresortpattaya" },
    ],
  },
  // The Wave Bowl
  {
    slug: "the-wave-bowl",
    description:
      "Боулинг на нижнем этаже отеля Jomtien Palm Beach Hotel & Resort, в начале набережной Джомтьена. Дорожки стандартные, соревновательного уровня; приходить можно и не живя в отеле — платите за игру и аренду обуви на месте. Хороший вариант на жаркий или дождливый день, когда хочется заняться чем-то в помещении всей семьёй. Детям обычно интереснее с того возраста, когда они уже могут сами толкнуть шар; есть ли бортики и лёгкие детские шары, официальные страницы не говорят. По выходным работает дольше, а днём здесь иногда проходят корпоративы и частные вечеринки.",
    descriptionEn:
      "A bowling alley on the lower floor of the Jomtien Palm Beach Hotel & Resort, at the start of the Jomtien beachfront. The lanes are standard, competition-grade; you do not need to stay at the hotel — you pay per game and for shoe rental on site. A good option for a hot or rainy day when the whole family wants something indoors. Children usually enjoy it once they can push the ball themselves; the official pages do not say whether there are bumpers or light kids' balls. It stays open later at weekends, and company outings and private parties are sometimes held here.",
    tips: [
      {
        text: "Возьмите носки всем, кто будет играть: в прокатной обуви играют в носках, на месте они продаются по 30 ฿ за пару.",
        textEn:
          "Bring socks for everyone who will play: rental shoes are worn with socks, and they sell them on site for 30 ฿ a pair.",
      },
      {
        text: "Аренда обуви — 40 ฿, в цену игры не входит.",
        textEn: "Shoe rental is 40 ฿ and is not included in the game price.",
      },
      {
        text: "Дорожки бывают заняты корпоративами — перед поездкой лучше позвонить в отель: 038 231 352 или написать в LINE @jomtienpalmbeach.",
        textEn:
          "Lanes are sometimes booked for company events — call the hotel before you come (038 231 352) or message LINE @jomtienpalmbeach.",
      },
      {
        text: "Здесь можно устроить детский праздник или частную вечеринку — бронируется через отель.",
        textEn:
          "You can hold a children's party or a private party here — book through the hotel.",
      },
    ],
    hours: {
      MON: { open: "10:00", close: "19:00" },
      TUE: { open: "10:00", close: "19:00" },
      WED: { open: "10:00", close: "19:00" },
      THU: { open: "10:00", close: "19:00" },
      FRI: { open: "10:00", close: "21:00" },
      SAT: { open: "10:00", close: "21:00" },
      SUN: { open: "10:00", close: "21:00" },
    },
    flags: { indoor: true, hasAirCon: true },
    entryRows: [{ label: "Одна игра", labelEn: "One game", child: 140, adult: 140 }],
    note: "Цена за игру на человека; аренда обуви — 40 ฿ отдельно. Цены — из поста боулинга, июль 2025.",
    noteEn:
      "Price per person per game; shoe rental is 40 ฿ extra. Prices from the bowling alley's post, July 2025.",
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/thewavebowl" },
      { type: "website", value: "https://www.jomtien-palmbeach.com/facilities/bowling" },
      { type: "phone", value: "038 231 352" },
      { type: "line", value: "@jomtienpalmbeach" },
    ],
  },
];
