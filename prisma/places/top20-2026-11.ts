/**
 * Наполнение карточек из сбора 21.10.2026 — первая партия («топ-20»,
 * решение 11.11; в ней 18 мест — два отложены до звонка): описание RU/EN, «Полезно знать», часы, признаки, цены,
 * контакты. Занос — prisma/add-top20-2026-11.ts (заполняет только пустое).
 *
 * Источники — официальные сайты и страницы самих мест, прочитанные 11.11.2026;
 * часы и цены с карт и из агрегаторов не брали. Бытовые наблюдения из отзывов
 * помечены в тексте словами «по отзывам». Чего официальные страницы не
 * говорят, того здесь нет: признак остаётся «уточняется», часы — пустыми.
 * Список сомнений по каждому месту — в описании PR.
 */
import type { PlaceFill } from "../../src/lib/import/place-fill";

const EVERY_DAY = (open: string, close: string): NonNullable<PlaceFill["hours"]> => ({
  MON: { open, close },
  TUE: { open, close },
  WED: { open, close },
  THU: { open, close },
  FRI: { open, close },
  SAT: { open, close },
  SUN: { open, close },
});

export const TOP20_2026_11: readonly PlaceFill[] = [
  // ── Крытые игровые ──
  {
    slug: "coco-play-beach-road",
    description:
      "Большая игровая на набережной Северной Паттайи, при ресторане Fat Coco (3-я сой Beach Road). Зон две. " +
      "На улице, на первом этаже, — водная зона Coco Pool: бассейн и водные горки, вокруг столики, есть раздевалки. " +
      "Через второй этаж заходят в крытую двухэтажную игровую с кондиционером: горки, сухой бассейн с шариками, " +
      "зона активных игр и уголок с костюмами для переодевания. Пускают не только гостей отеля The Cruise Hotel — билет покупают на месте; сеанс в игровой длится 3 часа, водная зона оплачивается отдельно.",
    descriptionEn:
      "A large play centre on the North Pattaya beachfront, at the Fat Coco restaurant (Beach Road Soi 3). There are two zones. " +
      "Outdoors on the ground floor is the Coco Pool water zone: a pool and water slides, with tables around it and changing rooms. " +
      "The second floor leads into an air-conditioned two-storey indoor playground: slides, a ball pit, " +
      "an active play zone and a dress-up corner with costumes. It is open to non-guests of The Cruise Hotel too — you buy a ticket on site; a playground session lasts 3 hours, and the water zone is paid separately.",
    tips: [
      {
        text: "Сеанс — 3 часа. Малыши ростом до 65 см и гости старше 60 лет проходят бесплатно.",
        textEn: "A session is 3 hours. Babies under 65 cm and guests over 60 enter free.",
      },
      {
        text: "Внутри работает кондиционер — возьмите ребёнку лёгкую кофту и носки.",
        textEn:
          "The indoor area is air-conditioned — bring a light top and socks for your child.",
      },
      {
        text: "В водную зону нужен купальник; полотенце возьмите своё или купите на месте. В туалетах есть шкафчики.",
        textEn:
          "Swimwear is required in the water zone; bring a towel or buy one on site. There are lockers in the restrooms.",
      },
      {
        text: "Глубина бассейна — 1,1–1,2 м: малыши купаются только под присмотром взрослого. Есть жилеты и доски для плавания.",
        textEn:
          "The pool is 1.1–1.2 m deep: small children swim only under adult supervision. Life vests and float boards are available.",
      },
      {
        text: "Водная горка — для детей до 10 лет и весом до 60 кг.",
        textEn: "The water slide is for children up to age 10 and up to 60 kg.",
      },
      {
        text: "Свою еду и напитки в водную зону приносить нельзя.",
        textEn: "You cannot bring your own food and drinks into the water zone.",
      },
      {
        text: "В загруженные дни игровая советует позвонить перед приездом: 038 259 550.",
        textEn:
          "On busy days the playground recommends calling before you come: 038 259 550.",
      },
    ],
    hours: EVERY_DAY("10:00", "19:00"),
    flags: { indoor: true, outdoor: true, hasAirCon: true, hasFood: true },
    categorySlugs: ["indoor-playground"],
    entryRows: [
      {
        label: "Крытая игровая Coco Play — сеанс 3 часа",
        labelEn: "Coco Play indoor playground — 3-hour session",
        child: 300,
        adult: 300,
      },
      {
        label: "Водная зона Coco Pool",
        labelEn: "Coco Pool water zone",
        child: 100,
        adult: 100,
      },
    ],
    note: "Игровая: детский билет — рост 65–160 см, взрослый — от 160 см; гостям отеля The Cruise Hotel вход бесплатный. Водная зона оплачивается отдельно, цена за человека.",
    noteEn:
      "Playground: child ticket — height 65–160 cm, adult — over 160 cm; entry is free for guests of The Cruise Hotel. The water zone is paid separately, per person.",
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/cocoplaypattaya" },
      { type: "instagram", value: "https://www.instagram.com/cocoplaypattaya" },
      { type: "phone", value: "038 259 550" },
    ],
  },
  {
    slug: "funtasea-kids-world-royal-cliff",
    description:
      "Детский клуб при отеле Royal Cliff Beach Hotel на Пратамнаке: крытое помещение с кондиционером, около 200 м². " +
      "Внутри — мягкая игровая с горками и сухим бассейном с шариками, лабиринт, комната для занятий, книги и развивающие игрушки; " +
      "для взрослых есть зона ожидания. Клуб рассчитан на детей 2–12 лет и открыт не только гостям отеля — оплата почасовая. " +
      "Со вторника по воскресенье идёт расписание: свободная игра чередуется с платными мастер-классами (роспись кружек и футболок, " +
      "рисование на холсте, лепка, бусы) и кулинарным классом. Вход — от ресепшен Royal Cliff Beach Hotel, через лобби.",
    descriptionEn:
      "A kids' club at the Royal Cliff Beach Hotel on Pratumnak: an air-conditioned indoor space of about 200 m². " +
      "Inside there is a soft play area with slides and a ball pit, a maze, an activity room, books and educational toys, " +
      "plus a waiting area for adults. The club is for children aged 2–12 and is open to non-hotel guests too — you pay by the hour. " +
      "From Tuesday to Sunday there is a daily schedule: free play alternates with paid workshops (mug and T-shirt painting, " +
      "canvas painting, clay, beads) and a cooking class. Enter from the Royal Cliff Beach Hotel reception, through the lobby.",
    tips: [
      {
        text: "С 12:30 до 13:30 в клубе перерыв — приходите утром или после обеда.",
        textEn:
          "The club closes for a break from 12:30 to 13:30 — come in the morning or after lunch.",
      },
      {
        text: "С ребёнком 2–4 лет внутри должен оставаться взрослый — один на каждого малыша.",
        textEn:
          "A child aged 2–4 must have an adult inside with them — one adult per toddler.",
      },
      {
        text: "Мастер-классы оплачиваются отдельно от почасового входа: от 150 до 500 ฿ за занятие.",
        textEn:
          "Workshops are paid separately from the hourly entry: 150 to 500 ฿ per session.",
      },
      {
        text: "Кулинарный класс (для 8–12 лет) бронируйте минимум за два дня.",
        textEn: "Book the cooking class (ages 8–12) at least two days ahead.",
      },
    ],
    hours: {
      MON: "closed",
      TUE: { open: "09:00", close: "17:30" },
      WED: { open: "09:00", close: "17:30" },
      THU: { open: "09:00", close: "17:30" },
      FRI: { open: "09:00", close: "17:30" },
      SAT: { open: "09:00", close: "17:30" },
      SUN: { open: "09:00", close: "17:30" },
    },
    flags: { indoor: true, hasAirCon: true },
    categorySlugs: ["indoor-playground"],
    entryRows: [
      {
        label: "Гости не из отеля — 1 час",
        labelEn: "Non-hotel guests — 1 hour",
        child: 150,
        adult: null,
      },
      {
        label: "Гости отеля — 1 час",
        labelEn: "Hotel guests — 1 hour",
        child: 100,
        adult: null,
      },
    ],
    note: "Цена за человека в час. Мастер-классы — отдельно: 150–380 ฿ за занятие, кулинарный класс — 500 ฿.",
    noteEn:
      "Price per person per hour. Workshops are extra: 150–380 ฿ per session, the cooking class is 500 ฿.",
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/funtasea.royalcliff/" },
      { type: "phone", value: "038 250 421 (доб. 2064)" },
    ],
  },
  {
    slug: "holiday-inn-kids-club",
    description:
      "Крытая игровая 455 м² с кондиционером на 4 этаже корпуса Bay Tower отеля Holiday Inn Pattaya. " +
      "Внутри — интерактивные игровые зоны, батутная комната (с 5 лет), отдельная комната для малышей 3–6 лет и уголок творчества. " +
      "Клуб рассчитан в основном на детей от 3 лет и пускает тех, кто не живёт в отеле: билет на 2,5 часа или на весь день. " +
      "Каждый день идут занятия по расписанию — подвижные игры, поделки, семейная игра; по выходным и в праздники бывает " +
      "тематическая программа на весь день. На том же этаже — кафе-бар Splash Deli & Bar с закусками и напитками.",
    descriptionEn:
      "An air-conditioned 455 m² indoor play space on the 4th floor of the Bay Tower at Holiday Inn Pattaya. " +
      "Inside there are interactive play zones, a bounce room (ages 5+), a separate toddler room for ages 3–6 and a craft corner. " +
      "The club is mainly for children aged 3 and up and welcomes non-hotel guests with a 2.5-hour or a full-day ticket. " +
      "There are scheduled activities every day — active games, crafts, a family game — and on weekends and holidays " +
      "a themed full-day programme. On the same floor you will find the Splash Deli & Bar with snacks and drinks.",
    tips: [
      {
        text: "Нужны нескользящие носки — возьмите свои или купите на стойке клуба.",
        textEn:
          "Non-slip socks are required — bring your own or buy a pair at the club desk.",
      },
      {
        text: "В будни билеты дешевле: 300 ฿ за 2,5 часа против 500 ฿ в выходные и праздники.",
        textEn:
          "Weekdays are cheaper: 300 ฿ for 2.5 hours versus 500 ฿ on weekends and holidays.",
      },
      {
        text: "В батутную комнату пускают только с 5 лет — малышам 3–6 лет отведена своя комната.",
        textEn:
          "The bounce room is for ages 5 and up — children aged 3–6 have their own room.",
      },
      {
        text: "Есть платные программы с присмотром: Kids Camp (с 5 лет) и Day Care (3–5 лет). Доступны ли они тем, кто не живёт в отеле, уточните в клубе.",
        textEn:
          "There are paid supervised programmes: Kids Camp (ages 5+) and Day Care (ages 3–5). Ask the club whether non-hotel guests can use them.",
      },
    ],
    hours: {
      MON: { open: "10:00", close: "19:00" },
      TUE: { open: "10:00", close: "19:00" },
      WED: { open: "10:00", close: "19:00" },
      THU: { open: "10:00", close: "19:00" },
      FRI: { open: "10:00", close: "19:00" },
      SAT: { open: "09:00", close: "19:00" },
      SUN: { open: "09:00", close: "19:00" },
    },
    flags: { indoor: true, hasAirCon: true, hasFood: true },
    categorySlugs: ["indoor-playground"],
    entryRows: [
      {
        label: "Будни — 2,5 часа",
        labelEn: "Weekdays — 2.5 hours",
        child: 300,
        adult: 200,
      },
      {
        label: "Будни — весь день",
        labelEn: "Weekdays — full day",
        child: 400,
        adult: 200,
      },
      {
        label: "Выходные и праздники — 2,5 часа",
        labelEn: "Weekends and holidays — 2.5 hours",
        child: 500,
        adult: 300,
      },
      {
        label: "Выходные и праздники — весь день",
        labelEn: "Weekends and holidays — full day",
        child: 600,
        adult: 300,
      },
    ],
    note: "Цены для тех, кто не живёт в отеле; гостям отеля вход бесплатный. Мастер-классы — отдельно, 150–230 ฿.",
    noteEn:
      "Prices for non-hotel guests; entry is free for hotel guests. Workshops are extra, 150–230 ฿.",
    contacts: [
      { type: "website", value: "https://pattaya.holidayinn.com/facilities/kids-club" },
      { type: "phone", value: "038 725 555" },
      { type: "facebook", value: "https://www.facebook.com/HolidayInnPTY" },
      { type: "instagram", value: "https://www.instagram.com/holidayinn_pattaya/" },
    ],
    replaceTypes: ["website"],
  },

  // ── Аттракционы ──
  {
    slug: "e-gokart-terminal-21",
    description:
      "Трасса электрокартинга сети Playerbox под открытым небом у торгового центра Terminal 21; зона ожидания — под крышей. " +
      "Катаются и дети, и взрослые: детский карт (рост 110–125 см) едет не быстрее 8 км/ч, обычный (от 125 см) — до 24 км/ч. " +
      "Заезд длится 8 минут, шлем и шапочку под него выдают. Бронировать не нужно — приходите и платите на стойке; " +
      "за гонщиками на трассе следит персонал.",
    descriptionEn:
      "An open-air electric go-kart track by the Playerbox chain next to the Terminal 21 mall; the waiting area is under a roof. " +
      "Both children and adults can ride: the kid kart (height 110–125 cm) is limited to 8 km/h, the regular kart (125 cm and up) goes up to 24 km/h. " +
      "A race lasts 8 minutes, and a helmet with a liner is provided. No booking needed — just come and pay at the desk; " +
      "staff watch the drivers on the track.",
    tips: [
      {
        text: "Наденьте обувь с закрытой пяткой — в шлёпанцах на трассу не пустят.",
        textEn:
          "Wear shoes with a closed heel — flip-flops are not allowed on the track.",
      },
      {
        text: "Длинные волосы нужно собрать, шарфы на трассе запрещены.",
        textEn: "Long hair must be tied back, and scarves are not allowed on the track.",
      },
      {
        text: "Самостоятельно едут при росте от 110 см — измерьте ребёнка заранее.",
        textEn: "Children ride on their own from 110 cm — measure your child beforehand.",
      },
    ],
    hours: EVERY_DAY("12:00", "21:00"),
    flags: { outdoor: true },
    entryRows: [
      {
        label: "Детский карт (рост 110–125 см) — 8 минут",
        labelEn: "Kid kart (height 110–125 cm) — 8 minutes",
        child: 300,
        adult: null,
      },
      {
        label: "Обычный карт (рост от 125 см) — 8 минут",
        labelEn: "Regular kart (125 cm and up) — 8 minutes",
        child: null,
        adult: 350,
      },
      {
        label: "Два заезда подряд — 16 минут",
        labelEn: "Two races in a row — 16 minutes",
        child: 590,
        adult: 590,
      },
    ],
    note: "Шлем и одноразовая шапочка под него входят в цену.",
    noteEn: "A helmet and a disposable liner are included in the price.",
    contacts: [
      { type: "website", value: "https://playerbox.co/venues/terminal-21-pattaya" },
    ],
    replaceTypes: ["website"],
  },

  {
    slug: "sanctuary-of-truth",
    description:
      "Огромный резной деревянный храм-музей у моря в Наклуа: строится с 1981 года и собран на деревянных соединениях, без гвоздей. " +
      "Детям здесь интересно не только здание. У смотровой площадки есть мини-зоопарк — кроликов, коз, овец и оленей можно кормить; " +
      "по территории катают в конной карете и на старинной деревянной лодке; в открытой мастерской видно, как резчики работают над деталями храма. " +
      "На территории также есть катание на слонах и их кормление. Внутри храма все ходят в касках. " +
      "Экскурсии идут по расписанию на разных языках, в том числе аудио-экскурсия на русском. Есть рестораны с видом на храм и кафе у пруда.",
    descriptionEn:
      "A huge carved wooden temple-museum by the sea in Naklua: under construction since 1981 and assembled with wooden joints, without nails. " +
      "There is more for children than the building itself. Next to the viewpoint is a mini zoo where you can feed rabbits, goats, sheep and deer; " +
      "you can ride around the grounds in a horse-drawn carriage or on an old wooden boat; and in the open workshop you can watch carvers at work on parts of the temple. " +
      "Elephant rides and elephant feeding are also offered on the grounds. Everyone wears a hard hat inside the temple. " +
      "Guided tours run on a schedule in several languages. There are restaurants overlooking the temple and a café by the pond.",
    tips: [
      {
        text: "Цену билета считают по росту: ниже 110 см — бесплатно, 110–140 см — детский билет.",
        textEn:
          "Ticket price depends on height: under 110 cm is free, 110–140 cm is a child ticket.",
      },
      {
        text: "Одевайтесь скромно: на входе можно взять шаль или саронг под залог 200 ฿.",
        textEn:
          "Dress modestly: a shawl or sarong can be borrowed at the entrance for a 200 ฿ deposit.",
      },
      {
        text: "Закладывайте 2–4 часа: сама экскурсия идёт около 45–60 минут.",
        textEn: "Allow 2–4 hours: the guided tour itself takes about 45–60 minutes.",
      },
      {
        text: "Русская аудио-экскурсия идёт по расписанию — в 9:20, 11:30, 14:30 и 16:30; удобно подгадать приезд.",
        textEn:
          "Tours run on a fixed schedule by language — check the timetable on the official site before you go.",
      },
      {
        text: "Дневной билет продают до 17:00, вечерний сеанс — с 18:20 до 20:30, он дороже.",
        textEn:
          "Day tickets are sold until 17:00; the evening session runs 18:20–20:30 and costs more.",
      },
    ],
    hours: EVERY_DAY("08:00", "20:30"),
    flags: { outdoor: true, hasFood: true, hasParking: true, animalContact: true },
    entryRows: [
      {
        label: "Днём (08:00–18:00)",
        labelEn: "Daytime (08:00–18:00)",
        child: 250,
        adult: 500,
      },
      {
        label: "Вечером (18:20–20:30)",
        labelEn: "Evening (18:20–20:30)",
        child: 350,
        adult: 700,
      },
    ],
    note: "Детский билет — рост 110–140 см, взрослый — от 140 см; ниже 110 см бесплатно. Купленные билеты не возвращают и не меняют.",
    noteEn:
      "Child ticket: height 110–140 cm; adult: 140 cm and up; under 110 cm is free. Tickets are non-refundable and cannot be exchanged.",
    contacts: [
      { type: "facebook", value: "https://www.facebook.com/sanctuaryoftruthmuseum" },
      { type: "instagram", value: "https://www.instagram.com/sotm_thailand" },
      { type: "phone", value: "038 110 653" },
    ],
  },
  {
    slug: "pado-media-art-space",
    description:
      "Иммерсивная выставка медиа-искусства в Наклуа (Pattaya Sai 3): около 4 300 м² залов, где свет и изображение заполняют стены и пол. " +
      "Тем двенадцать — космос, цветы, лес, волна, северное сияние, небесные фонарики, водопад. " +
      "Зал Playground сделан для детей: «мелковый» детский мир, в котором можно участвовать. " +
      "Всё в помещении, поэтому подходит и в дождь, и в жару. Коляски дают бесплатно под залог, есть зона отдыха для малышей и бесплатные шкафчики.",
    descriptionEn:
      "An immersive media art exhibition in Naklua (Pattaya Sai 3): about 4,300 m² of rooms where light and images fill the walls and floor. " +
      "There are twelve themes — space, flowers, forest, wave, aurora, sky lanterns, waterfall. " +
      "The Playground room is made for children: a chalk-drawn kids' world they can take part in. " +
      "Everything is indoors, so it works on rainy and hot days alike. Strollers are lent free against a deposit, and there is a rest area for babies and toddlers plus free lockers.",
    tips: [
      {
        text: "Покормите ребёнка заранее: еды внутри нет, пронести можно только детское питание и воду.",
        textEn:
          "Feed your child beforehand: no food is sold inside, and only baby food and water may be brought in.",
      },
      {
        text: "Коляску можно не везти — её бесплатно дают на стойке информации под залог.",
        textEn:
          "You can leave the stroller at home — one is lent free at the information desk against a deposit.",
      },
      {
        text: "На осмотр уходит 1–2 часа; вход и касса закрываются в 20:00.",
        textEn: "A visit takes 1–2 hours; entry and the ticket desk close at 20:00.",
      },
      {
        text: "Выйти и вернуться нельзя; исключение — уход за малышом, тогда обратно проводит сотрудник.",
        textEn:
          "No re-entry; the exception is caring for a baby — a staff member will let you back in.",
      },
      {
        text: "В навигаторе ищите «PADO Media Art Space» или «KP Art Center».",
        textEn:
          "In your navigation app, search for “PADO Media Art Space” or “KP Art Center”.",
      },
    ],
    hours: EVERY_DAY("10:00", "21:00"),
    flags: { indoor: true, hasFood: false, hasParking: true },
    entryRows: [
      {
        label: "Полная цена",
        labelEn: "Full price",
        child: 599,
        adult: 999,
      },
      {
        label: "Сезонная цена (с 1 ноября)",
        labelEn: "Seasonal price (from 1 November)",
        child: 499,
        adult: 599,
      },
    ],
    note: "Детский билет — рост 95–134 см, взрослый — от 135 см; ниже 95 см бесплатно, по одному ребёнку на взрослого с билетом. Срок сезонной цены на сайте не указан.",
    noteEn:
      "Child ticket: height 95–134 cm; adult: 135 cm and up; under 95 cm is free, one child per paying adult. The site does not say when the seasonal price ends.",
    contacts: [{ type: "phone", value: "095 120 9955" }],
  },
  {
    slug: "thai-wake-park-pattaya",
    description:
      "Кабельный вейк-парк на озере примерно в 20 минутах езды от города. Кататься можно с 6 лет: для детей и новичков каждый день идёт " +
      "медленная сессия на полтора часа — канат едет на малой скорости, рядом тренер. Спасательный жилет и доска для новичков входят в билет, " +
      "шлем обязателен; уметь плавать не нужно. Те, кто не катается, проходят бесплатно и ждут в тени у воды — на территории есть ресторан и бар. " +
      "Если канат останавливают из-за ливня или ветра, время билета ставят на паузу.",
    descriptionEn:
      "A cable wake park on a lake about 20 minutes' drive from the city. Riding is allowed from age 6: for children and beginners there is a daily " +
      "1.5-hour low-speed session — the cable runs slowly and a coach is nearby. A life vest and a beginner board are included in the ticket, " +
      "a helmet is mandatory, and you do not need to know how to swim. Non-riders enter free and can wait in the shade by the water — there is a restaurant and bar on site. " +
      "If the cable stops because of heavy rain or wind, your ticket time is paused.",
    tips: [
      {
        text: "Ребёнку 6–14 лет берите медленную сессию — её бронируют онлайн.",
        textEn:
          "For a child aged 6–14, take the low-speed session — it is booked online.",
      },
      {
        text: "Возьмите купальник или одежду, которую не жалко намочить, полотенце, солнцезащитный крем и сменную одежду.",
        textEn:
          "Bring swimwear or clothes you don't mind getting wet, a towel, sunscreen and a change of clothes.",
      },
      {
        text: "Ценные вещи лучше оставить дома: шкафчиков нет, душевые есть.",
        textEn: "Leave valuables at home: there are no lockers, but there are showers.",
      },
      {
        text: "Свою еду и напитки приносить нельзя.",
        textEn: "You cannot bring your own food and drinks.",
      },
      {
        text: "Парк за городом — добираться удобнее на машине или Grab; парковка бесплатная.",
        textEn:
          "The park is out of town — a car or Grab is the easiest way to get there; parking is free.",
      },
    ],
    hours: {
      MON: { open: "10:30", close: "18:00" },
      TUE: { open: "10:30", close: "18:00" },
      WED: { open: "10:30", close: "18:00" },
      THU: { open: "10:30", close: "18:00" },
      FRI: { open: "10:30", close: "18:00" },
      SAT: { open: "09:00", close: "18:00" },
      SUN: { open: "09:00", close: "18:00" },
    },
    flags: { outdoor: true, hasFood: true, hasParking: true },
    entryRows: [
      {
        label: "Медленная сессия для детей с 6 лет и новичков — 1,5 часа",
        labelEn: "Low-speed session for children 6+ and beginners — 1.5 hours",
        child: 450,
        adult: 450,
      },
      {
        label: "Обычный билет — 2 часа",
        labelEn: "Regular ticket — 2 hours",
        child: null,
        adult: 695,
      },
      {
        label: "Обычный билет — 4 часа",
        labelEn: "Regular ticket — 4 hours",
        child: null,
        adult: 895,
      },
      {
        label: "Обычный билет — весь день",
        labelEn: "Regular ticket — full day",
        child: null,
        adult: 1095,
      },
    ],
    note: "Жилет и доска для новичков входят в цену; шлем к обычному билету — 60 ฿ в день, в медленной сессии он включён. Зрители проходят бесплатно.",
    noteEn:
      "A life vest and a beginner board are included; a helmet with a regular ticket is 60 ฿ per day and is included in the low-speed session. Spectators enter free.",
    contacts: [{ type: "website", value: "https://www.thaiwakepark.com/en/pattaya" }],
    replaceTypes: ["website"],
  },

  // ── Кафе с детскими зонами ──
  {
    slug: "art-studio-cafe-boonsampan",
    description:
      "Творческое кафе на Soi Boonsampan с двумя мастер-классами: живопись на холсте и тафтинг — ковёр своими руками. " +
      "Опыт не нужен, материалы и помощь мастера входят в цену. Платят за холст, а не за человека: родитель, который помогает ребёнку " +
      "с той же работой, и все, кто просто смотрит, не платят. Живопись занимает 2–4 часа, картину забирают сразу; " +
      "тафтинг — 2–6 часов, маленьким детям он подходит только вместе со взрослым, а готовый коврик отдают через 3–4 дня.",
    descriptionEn:
      "A creative café on Soi Boonsampan with two workshops: painting on canvas and tufting — making your own rug. " +
      "No experience needed; materials and help from an instructor are included. You pay per canvas, not per person: a parent helping a child " +
      "with the same piece and anyone just watching do not pay. Painting takes 2–4 hours and you take the picture home right away; " +
      "tufting takes 2–6 hours, suits small children only together with an adult, and the finished rug is ready in 3–4 days.",
    tips: [
      {
        text: "Бронируйте через LINE не позже 18:00 накануне — бронь действует после подтверждения сотрудником.",
        textEn:
          "Book via LINE by 18:00 the day before — a booking is valid once staff confirm it.",
      },
      {
        text: "Депозит 200 ฿ за холст входит в цену, но не возвращается; перенести можно до 18:00 накануне.",
        textEn:
          "The 200 ฿ deposit per canvas is part of the price but non-refundable; you can reschedule until 18:00 the day before.",
      },
      {
        text: "Если ребёнок и родитель делают одну работу, платить нужно только за один холст.",
        textEn: "If a child and a parent work on one piece, you pay for one canvas only.",
      },
      {
        text: "Приходите с запасом: занятие должно закончиться до 18:00, а живопись занимает до 4 часов.",
        textEn:
          "Come early: the session must finish by 18:00, and painting can take up to 4 hours.",
      },
    ],
    hours: EVERY_DAY("09:00", "18:00"),
    entryRows: [
      {
        label: "Живопись — холст 20×20 см",
        labelEn: "Painting — 20×20 cm canvas",
        child: 299,
        adult: 299,
      },
      {
        label: "Тафтинг — коврик 35×35 см",
        labelEn: "Tufting — 35×35 cm rug",
        child: 1090,
        adult: 1090,
      },
    ],
    note: "Цена за одну работу, а не за человека. Холсты и коврики большего размера стоят дороже — цены уточняйте при брони.",
    noteEn:
      "Price per piece, not per person. Larger canvases and rugs cost more — ask when booking.",
    contacts: [
      { type: "phone", value: "086 998 4231" },
      { type: "line", value: "https://lin.ee/sub0Zzx" },
      { type: "instagram", value: "https://www.instagram.com/artstudiocafe.pty/" },
    ],
    replaceTypes: ["instagram"],
  },
  {
    slug: "miffys-voyage-cafe",
    description:
      "Тематическое кафе с зайчиком Миффи в Premium Outlet Pattaya — второе такое в Таиланде. Этажей два: " +
      "на первом — столики кафе и магазин с сувенирами, на втором — детская игровая зона с сухим бассейном. " +
      "В меню — рис, паста, боулы и десерты: тосты, блинчики, манго со стики-райсом, какигори; есть блюда для детей. " +
      "Платы за вход нет — только заказ.",
    descriptionEn:
      "A Miffy-themed café at Premium Outlet Pattaya — the second of its kind in Thailand. It has two floors: " +
      "café tables and a souvenir shop on the ground floor, and a children's play zone with a ball pit upstairs. " +
      "The menu has rice dishes, pasta, bowls and desserts: toast, pancakes, mango sticky rice, kakigori; there are dishes for children too. " +
      "There is no entry fee — you only pay for what you order.",
    tips: [
      {
        text: "В будни кафе открывается на час позже, чем в выходные: в 11:00 вместо 10:00.",
        textEn:
          "On weekdays the café opens an hour later than on weekends: at 11:00 instead of 10:00.",
      },
      {
        text: "Если у кого-то в семье день рождения в этом месяце, скажите на кассе: действует скидка 10 %.",
        textEn:
          "If someone in the family has a birthday this month, mention it at the counter for a 10% discount.",
      },
    ],
    hours: {
      MON: { open: "11:00", close: "20:00" },
      TUE: { open: "11:00", close: "20:00" },
      WED: { open: "11:00", close: "20:00" },
      THU: { open: "11:00", close: "20:00" },
      FRI: { open: "11:00", close: "20:00" },
      SAT: { open: "10:00", close: "20:00" },
      SUN: { open: "10:00", close: "20:00" },
    },
    flags: { hasFood: true },
    categorySlugs: ["cafe"],
    contacts: [{ type: "phone", value: "094 229 4563" }],
  },
  {
    slug: "pa-boon-cafe-5",
    description:
      "Семейный сад-ресторан сети Pa Boon в Нонг Пла Лай: открытая территория с прудом, где плавают карпы, фигурами динозавров " +
      "и мини-фермой. Для детей есть площадка под навесом. Столики стоят на улице под вентиляторами — кондиционера нет. " +
      "С утра подают кофе, выпечку и завтраки, позже — тайскую кухню.",
    descriptionEn:
      "A family garden restaurant of the Pa Boon chain in Nong Pla Lai: open grounds with a carp pond, dinosaur figures " +
      "and a mini farm. For children there is a playground under a canopy. Tables are outdoors under fans — there is no air conditioning. " +
      "Coffee, pastries and breakfast are served in the morning, Thai food later in the day.",
    tips: [
      {
        text: "С 08:00 работают только кофе, выпечка и завтраки — тайское меню подают с 10:00, в выходные с 09:30.",
        textEn:
          "From 08:00 only coffee, pastries and breakfast are served — the Thai menu starts at 10:00, on weekends at 09:30.",
      },
      {
        text: "Кондиционера нет: столики под навесом и вентиляторами — в жару приезжайте утром или ближе к вечеру.",
        textEn:
          "There is no air conditioning: tables are under a canopy with fans — on hot days come in the morning or towards evening.",
      },
    ],
    hours: EVERY_DAY("08:00", "00:00"),
    flags: {
      outdoor: true,
      hasFood: true,
      hasAirCon: false,
      hasCoveredArea: true,
      hasFans: true,
      animalContact: true,
    },
    categorySlugs: ["cafe"],
  },
  {
    slug: "tigertoys-cafe",
    description:
      "Кафе с трассой для детских электромобилей: дети катаются, родители пьют кофе. Катание оплачивается отдельно от еды, по времени. " +
      "Машин три класса: Standard подходит малышам с 1 года — машинкой может управлять взрослый с пульта; " +
      "Performance и High Performance — крупнее и быстрее, для детей постарше и для родителей. " +
      "В кафе есть еда, напитки и сладости, а детские электромобили здесь же продаются.",
    descriptionEn:
      "A café with a track for children's electric cars: kids drive while parents have coffee. Rides are paid separately from food, by time. " +
      "There are three classes of cars: Standard suits toddlers from age 1 — an adult can steer the car by remote control; " +
      "Performance and High Performance are bigger and faster, for older children and parents. " +
      "The café serves food, drinks and sweets, and also sells children's electric cars.",
    tips: [
      {
        text: "По вторникам кафе закрыто; внеплановые выходные и рабочие вторники объявляют на странице в Facebook.",
        textEn:
          "The café is closed on Tuesdays; extra days off and working Tuesdays are announced on its Facebook page.",
      },
      {
        text: "Малышам от года подойдёт тариф Standard: машинкой можно управлять с пульта.",
        textEn:
          "For toddlers from age 1, take the Standard rate: the car can be steered by remote control.",
      },
      {
        text: "Объясните ребёнку заранее, что таранить другие машины нельзя: за намеренную поломку штраф 2 000 ฿.",
        textEn:
          "Explain to your child beforehand that ramming other cars is not allowed: deliberate damage carries a 2,000 ฿ fine.",
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
    flags: { hasFood: true },
    categorySlugs: ["cafe"],
    entryRows: [
      {
        label: "Standard (с 1 года) — 30 минут",
        labelEn: "Standard (age 1+) — 30 minutes",
        child: 200,
        adult: null,
      },
      {
        label: "Performance — 20 минут",
        labelEn: "Performance — 20 minutes",
        child: 300,
        adult: null,
      },
      {
        label: "High Performance — 15 минут",
        labelEn: "High Performance — 15 minutes",
        child: 300,
        adult: 300,
      },
    ],
    note: "Цена за заезд на одной машине; еда и напитки оплачиваются отдельно.",
    noteEn: "Price per ride in one car; food and drinks are paid separately.",
    contacts: [{ type: "phone", value: "086 849 4347" }],
  },
  {
    slug: "slowride-coffee-cafe",
    description:
      "Ресторан-кафе в саду в Нонг Пла Лай: тайская и западная кухня, кофе и выпечка. Для детей есть площадка, " +
      "а взрослые выбирают между столиками в саду и залом с кондиционером. По отзывам, посреди территории течёт ручей с карпами, " +
      "у входа живут попугаи, а в глубине сада — козы и куры. По вечерам здесь бывают винные дегустации и ужины для взрослых.",
    descriptionEn:
      "A garden restaurant-café in Nong Pla Lai: Thai and Western food, coffee and pastries. There is a playground for children, " +
      "and adults can choose between tables in the garden and an air-conditioned hall. According to reviews, a stream with carp runs through the grounds, " +
      "parrots live near the entrance, and there are goats and chickens deeper in the garden. In the evenings there are wine tastings and dinners for adults.",
    tips: [
      {
        text: "Горячее готовят с 11:00 до 21:00 — утром с 08:00 работают только кофе и напитки.",
        textEn:
          "Hot food is served from 11:00 to 21:00 — from 08:00 only coffee and drinks are available.",
      },
      {
        text: "В жару можно пересесть из сада в зал с кондиционером.",
        textEn: "On hot days you can move from the garden to the air-conditioned hall.",
      },
      {
        text: "По отзывам, днём в беседке играет живая музыка — учитывайте, если ребёнок спит в коляске.",
        textEn:
          "According to reviews, there is live music in the gazebo in the afternoon — keep it in mind if your child naps in the stroller.",
      },
    ],
    hours: EVERY_DAY("08:00", "22:00"),
    flags: {
      indoor: true,
      outdoor: true,
      hasAirCon: true,
      hasFood: true,
      hasParking: true,
    },
    categorySlugs: ["cafe"],
    contacts: [{ type: "phone", value: "098 898 8188" }],
  },

  {
    slug: "the-chalet-cafe",
    description:
      "Кафе с садом на территории Wisdom Valley в Кхао Май Кео: кофе, напитки и выпечка, вокруг цветы, а оформление меняют по сезонам. " +
      "Рядом с кафе — большая карусель, она работает сеансами по расписанию. По отзывам, здесь же есть детская площадка с горкой " +
      "и трасса с поворотами и горками для велосипедов, самокатов и скейтов; велосипеды дают в прокат. Платы за вход нет.",
    descriptionEn:
      "A café with a garden on the Wisdom Valley grounds in Khao Mai Kaeo: coffee, drinks and pastries, flowers all around, and seasonal decorations. " +
      "Next to the café is a large carousel that runs in sessions on a schedule. According to reviews, there is also a playground with a slide " +
      "and a track with turns and bumps for bikes, scooters and skateboards; bikes can be rented. There is no entry fee.",
    tips: [
      {
        text: "Карусель работает сеансами: в будни 10:00–12:00 и 17:00–19:00, в выходные и праздники ещё и 13:00–15:00.",
        textEn:
          "The carousel runs in sessions: weekdays 10:00–12:00 and 17:00–19:00, on weekends and holidays also 13:00–15:00.",
      },
      {
        text: "По отзывам, катание на карусели бесплатное.",
        textEn: "According to reviews, carousel rides are free.",
      },
      {
        text: "Перед праздниками загляните на страницу кафе: на Новый год оно закрывалось на несколько дней.",
        textEn:
          "Check the café's page before holidays: it has closed for a few days over New Year.",
      },
    ],
    hours: EVERY_DAY("08:00", "19:00"),
    flags: { outdoor: true, hasFood: true },
    categorySlugs: ["cafe"],
    contacts: [
      {
        type: "facebook",
        value: "https://www.facebook.com/profile.php?id=61559440660378",
      },
      { type: "instagram", value: "https://www.instagram.com/the.chaletcafe" },
    ],
  },
  {
    slug: "a-la-campagne-na-jomtien",
    description:
      "Комплекс в стиле французской деревни в На Джомтьене: несколько ресторанов, чайная, лавка Petit Marché, сад и ферма. " +
      "На ферме живут лошади, свинья, коза и куры на свободном выгуле, растут органические овощи и травы. " +
      "Детям предлагают покормить животных и собрать яйца — билеты покупают в лавке в день визита. " +
      "Среди деревьев стоит детская площадка Hedwig: домик на дереве, башня и сетка для лазания, вход на неё бесплатный.",
    descriptionEn:
      "A French-village-style complex in Na Jomtien: several restaurants, a tea house, the Petit Marché shop, a garden and a farm. " +
      "The farm has horses, a pig, a goat and free-range chickens, and grows organic vegetables and herbs. " +
      "Children can feed the animals and collect eggs — tickets are bought at the shop on the day of your visit. " +
      "Among the trees is the Hedwig playground: a tree house, a tower and a climbing net, free to enter.",
    tips: [
      {
        text: "Билеты на кормление животных и сбор яиц продают в лавке Petit Marché с 10:00 до 17:00, бронировать не нужно.",
        textEn:
          "Tickets for feeding the animals and collecting eggs are sold at the Petit Marché shop from 10:00 to 17:00; no booking needed.",
      },
      {
        text: "Мастер-классы лучше бронировать заранее по телефону.",
        textEn: "Workshops are best booked ahead by phone.",
      },
    ],
    hours: EVERY_DAY("10:00", "20:00"),
    flags: { outdoor: true, hasFood: true, animalContact: true },
    categorySlugs: ["cafe"],
    contacts: [{ type: "phone", value: "094 412 5005" }],
  },

  // ── С животными ──
  {
    slug: "swiss-sheep-farm-pattaya",
    description:
      "Ферма в «швейцарском» стиле в сои Кхао Чи Чан, рядом с аквапарком Ramayana. Здесь можно покормить овец, осликов и лошадей " +
      "и погулять по территории с домиками и местами для фотографий. Вход бесплатный, корм для животных покупают на месте. " +
      "По вечерам овцы сами бегут обратно в загон — на это стоит посмотреть.",
    descriptionEn:
      "A Swiss-style farm on Soi Khao Chi Chan, next to the Ramayana water park. You can feed sheep, donkeys and horses " +
      "and walk around the grounds with chalets and photo spots. Entry is free; animal feed is bought on site. " +
      "In the evening the sheep run back to their pen by themselves — worth watching.",
    tips: [
      {
        text: "Вход бесплатный, платят только за корм для животных.",
        textEn: "Entry is free; you only pay for animal feed.",
      },
      {
        text: "Ферма под открытым небом и закрывается в 17:00 — в жару удобнее приезжать с утра.",
        textEn:
          "The farm is open-air and closes at 17:00 — on hot days it is easier to come in the morning.",
      },
    ],
    hours: EVERY_DAY("08:00", "17:00"),
    flags: { outdoor: true, animalContact: true },
    free: true,
    contacts: [{ type: "phone", value: "099 123 4134" }],
  },
  {
    slug: "animal-paradise-cafe",
    description:
      "Ресторан и кафе с мини-зоопарком в Понге: еда, напитки, десерты и животные в одном месте. " +
      "Есть отдельная кошачья комната — в ноябре 2026 года открыли новую, больше прежней. " +
      "У входа — уголок раскрашивания: гипсовые фигурки, рамки или тканевые сумки покупают в кафе, краски дают бесплатно. " +
      "По отзывам, в мини-зоопарке живут капибары, карликовые козы, валлаби, черепахи, олени и мини-пиги, их можно кормить.",
    descriptionEn:
      "A restaurant and café with a mini zoo in Pong: food, drinks, desserts and animals in one place. " +
      "There is a separate cat room — a new, larger one opened in November 2026. " +
      "By the entrance is a colouring corner: plaster figures, frames or cloth bags are bought at the café, and paints are free. " +
      "According to reviews, the mini zoo has capybaras, pygmy goats, wallabies, tortoises, deer and mini pigs, and you can feed them.",
    tips: [
      {
        text: "В кошачью комнату пускают на 15 минут, в сменных тапочках — их выдают на месте.",
        textEn:
          "Visits to the cat room last 15 minutes, in indoor slippers provided on site.",
      },
      {
        text: "По отзывам, вход бесплатный, а корм для животных стоит 20–30 ฿ за порцию.",
        textEn:
          "According to reviews, entry is free and animal feed costs 20–30 ฿ per portion.",
      },
    ],
    hours: EVERY_DAY("10:00", "20:00"),
    flags: { hasFood: true, animalContact: true },
    categorySlugs: ["cafe"],
    entryRows: [
      {
        label: "Кошачья комната — набор лакомств, 15 минут",
        labelEn: "Cat room — treat set, 15 minutes",
        child: 50,
        adult: 50,
      },
    ],
    note: "Цена — от 50 ฿ за набор; один набор — не больше чем на двоих.",
    noteEn: "Price is from 50 ฿ per set; one set covers up to two people.",
  },
  {
    slug: "wind-of-heaven-horse-riding",
    description:
      "Конный клуб с уроками верховой езды для детей и взрослых любого уровня. Детям можно начинать с 5–6 лет: " +
      "есть групповые уроки (в группе не больше пяти всадников), частные занятия и детский лагерь на полдня — " +
      "дети чистят и кормят лошадей, знакомятся с конюшней и занимаются ездой. Лошадь подбирает тренер по уровню всадника; " +
      "шлем обязателен, шлем и сапоги новичкам дают в клубе. Занятия — только по предварительной записи. " +
      "Конные прогулки по тропам — с 14 лет.",
    descriptionEn:
      "A horse riding club with lessons for children and adults of any level. Children can start from age 5–6: " +
      "there are group lessons (no more than five riders per group), private lessons and a half-day kids' camp — " +
      "children groom and feed the horses, get to know the stable and practise riding. The coach chooses a horse to match the rider's level; " +
      "a helmet is mandatory, and helmets and boots are lent to beginners. Lessons are by appointment only. " +
      "Trail rides are for ages 14 and up.",
    tips: [
      {
        text: "Наденьте длинные брюки или леггинсы: в шортах к занятию не допускают.",
        textEn: "Wear long trousers or leggings: shorts are not allowed for lessons.",
      },
      {
        text: "Записывайтесь заранее по телефону или в WhatsApp; групповые уроки идут в будни после 17:00.",
        textEn:
          "Book ahead by phone or WhatsApp; group lessons run on weekdays after 17:00.",
      },
      {
        text: "Ехать вдвоём с ребёнком на одной лошади нельзя.",
        textEn: "Riding together with a child on one horse is not allowed.",
      },
    ],
    flags: { outdoor: true, animalContact: true },
    entryRows: [
      {
        label: "Групповой урок — 45 минут",
        labelEn: "Group lesson — 45 minutes",
        child: 1500,
        adult: 1500,
      },
      {
        label: "Частный урок — 1 час",
        labelEn: "Private lesson — 1 hour",
        child: 2500,
        adult: 2500,
      },
      {
        label: "Детский лагерь на полдня — 3 часа",
        labelEn: "Half-day kids' camp — 3 hours",
        child: 3500,
        adult: null,
      },
      {
        label: "Конная прогулка по тропам (с 14 лет) — 1,5–2 часа",
        labelEn: "Trail ride (ages 14+) — 1.5–2 hours",
        child: null,
        adult: 3500,
      },
    ],
    note: "Цена за человека. Групповые уроки — с понедельника по пятницу.",
    noteEn: "Price per person. Group lessons run Monday to Friday.",
    contacts: [{ type: "phone", value: "061 169 1007" }],
  },

  // ── Парки ──
  {
    slug: "nongprue-public-park",
    description:
      "Небольшой городской парк в Нонгпры с большим прудом в центре: вокруг пруда идёт дорога для прогулок и бега, много тени от деревьев. " +
      "Для детей есть площадка с игровым оборудованием, рядом — уличные тренажёры, крытое футбольное поле и площадка для такро. " +
      "Вход бесплатный. Официальное название — парк в честь 82-летия короля Пумипона; находится позади муниципального детского сада Нонгпры.",
    descriptionEn:
      "A small city park in Nongprue with a large pond in the middle: a road for walking and jogging runs around the pond, with plenty of shade from the trees. " +
      "For children there is a playground with play equipment; nearby are outdoor fitness machines, a covered football pitch and a takraw court. " +
      "Entry is free. The official name is the park commemorating King Bhumibol's 82nd birthday; it sits behind the Nongprue municipal kindergarten.",
    flags: { outdoor: true },
    categorySlugs: ["playground"],
    free: true,
  },
];
