import { plural } from "@/lib/plural";

/**
 * Все видимые пользователю тексты интерфейса — на русском, в одном месте.
 * Тон: спокойный, нейтральный к обоим родителям (маме и папе).
 * Имена переменных/полей/slug остаются на английском — их не переводим.
 */
export const ru = {
  brand: "Pattaya Kids Guide",

  meta: {
    title: "Pattaya Kids Guide",
    description: "Спокойный гид по детским местам и событиям Паттайи — для родителей.",
  },

  nav: {
    places: "Места",
    events: "События",
    activities: "Занятия",
    aria: "Разделы сайта",
  },

  notFound: {
    eyebrow: "404",
    title: "Такой страницы нет",
    description:
      "Возможно, в адресе опечатка или ссылка устарела. Всё самое полезное — в каталоге мест.",
    cta: "← К местам",
  },

  common: {
    detailsCta: "Подробнее",
    descriptionFallback: "Описание скоро добавим.",
    // «Есть/Нет» — для полей-состояний (Еда, Wi-Fi, Животные)
    yes: "Есть",
    no: "Нет",
    // «Да/Нет» — для полей-вопросов («Можно ли…?»)
    affirmative: "Да",
    negative: "Нет",
    // третье состояние факта: данные ещё не проверены (не выдаём пробел за «нет»)
    unknown: "уточняется",
  },

  openStatus: {
    openHours: (hours: number): string =>
      `Открыто ещё ~${hours} ${plural(hours, ["час", "часа", "часов"])}`,
    openNow: "Открыто сейчас",
    closingSoon: "Скоро закрытие",
    opensAt: (time: string): string => `Откроется в ${time}`,
    closedToday: "Сегодня закрыто",
  },

  places: {
    heroTitle: "Места, куда пойти с ребёнком в Паттайе",
    heroDescription:
      "Спокойно выбирайте места для детей: фильтры по крытым площадкам, еде, Wi-Fi и другим полезным мелочам.",
    sectionTitle: "Места",
    count: (total: number): string =>
      `${total} ${plural(total, ["место", "места", "мест"])}`,
    emptyTitle: "Ничего не нашлось",
    emptyHint: "Попробуйте убрать один из фильтров.",
    emptyWorkTitle: "Пока таких мест немного",
    emptyWorkHint:
      "Мы наполняем каталог местами, где удобно поработать рядом с ребёнком. Попробуйте пока убрать этот фильтр.",
    badgeIndoor: "В помещении",
    badgeOutdoor: "На улице",
    addressFallback: "Адрес уточняется",
    features: {
      food: "Еда",
      wifi: "Wi-Fi",
      childDropOff: "Можно оставить ребёнка",
      animals: "Животные",
    },
  },

  placeFilters: {
    title: "Фильтры",
    subtitle: "Выберите, что важно",
    reset: "Сбросить",
    apply: "Показать",
    labels: {
      workFriendly: "Можно поработать",
      indoor: "В помещении",
      outdoor: "На улице",
      hasFood: "Еда",
      hasWifi: "Wi-Fi",
      canLeaveChild: "Можно оставить ребёнка",
      animalContact: "Животные",
    },
    workFriendlyHint: "Wi-Fi, кондиционер и место, где можно посидеть",
  },

  placeDetails: {
    back: "← Назад к местам",
    eyebrow: "Место",
    addressTitle: "Адрес",
    openInMaps: "Открыть в Google Maps",
    detailsTitle: "Подробности",
    fields: {
      type: "Тип",
      food: "Еда",
      wifi: "Wi-Fi",
      airCon: "Кондиционер",
      parking: "Парковка",
      powerOutlets: "Розетки",
      cafeSeating: "Есть где посидеть",
      childDropOff: "Можно оставить ребёнка",
      animals: "Животные",
    },
    scheduleTitle: "Часы работы",
    days: {
      MON: "Понедельник",
      TUE: "Вторник",
      WED: "Среда",
      THU: "Четверг",
      FRI: "Пятница",
      SAT: "Суббота",
      SUN: "Воскресенье",
    },
    closed: "Выходной",
    today: "сегодня",
    pricingTitle: "Цены",
    entryLabel: "Вход",
    priceFree: "Бесплатно",
    priceUnknown: "Цена уточняется",
    tipsTitle: "Полезно знать",
    tipVerified: (period: string): string => `проверено: ${period}`,
    contactsTitle: "Контакты",
    contactChannels: {
      phone: "Телефон",
      email: "Почта",
      website: "Сайт",
      instagram: "Instagram",
      facebook: "Facebook",
      line: "LINE",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    programsTitle: "Программы и абонементы",
    programTypes: {
      CAMP: "Лагерь",
      MEMBERSHIP: "Абонемент",
      COURSE: "Занятия",
    },
    programOldPrice: (price: string): string => `было ${price}`,
    ageTitle: "Для какого возраста",
    amenitiesTitle: "Удобства",
    staffLanguagesTitle: "Язык персонала",
    birthdayTitle: "День рождения",
    birthdayHas: "Здесь проводят детские дни рождения",
    categoriesTitle: "Категории",
    upcomingTitle: "Ближайшие события здесь",
    noUpcoming: "Пока ближайших событий нет.",
  },

  events: {
    heroTitle: "События для детей в Паттайе",
    heroDescription: "Смотрите, что идёт сейчас, что впереди и что уже прошло.",
    sectionTitle: "События",
    count: (total: number): string =>
      `${total} ${plural(total, ["событие", "события", "событий"])}`,
    emptyTitle: "Ничего не нашлось",
    emptyHint: "Попробуйте другой фильтр или посмотрите все события.",
  },

  activities: {
    heroTitle: "Занятия для детей в Паттайе",
    heroDescription:
      "Развивашки, студии и секции: куда записать ребёнка на регулярные занятия — плавание, музыку, рисование и не только.",
    sectionTitle: "Занятия",
    count: (total: number): string =>
      `${total} ${plural(total, ["занятие", "занятия", "занятий"])}`,
    emptyTitle: "Пока занятий немного",
    emptyHint: "Наполняем каталог — скоро здесь появятся студии и секции.",
    emptyFilteredHint:
      "Под эти фильтры пока ничего нет — попробуйте изменить возраст или тип.",
    placeLabel: "Место",
    ageLabel: "Возраст:",
    filterAgeTitle: "Возраст ребёнка",
    filterTypeTitle: "Тип занятий",
    filterAny: "Любой",
    filterAll: "Все",
    ageBuckets: {
      "0-1": "До 1 года",
      "1-3": "1–3 года",
      "3-6": "3–6 лет",
      "6-12": "6–12 лет",
    },
  },

  activityCard: {
    detailsCta: "Открыть место",
  },

  activityDetails: {
    back: "← Назад к занятиям",
    whereTitle: "Где проходит",
  },

  eventCard: {
    starts: "Начало",
    ends: "Конец",
    dateTbd: "Дата уточняется",
    locationTbd: "Место уточняется",
    placeLabel: "Место",
    viewPlace: "Открыть место",
    statusOngoing: "Сейчас идёт",
    statusPast: "Уже прошло",
  },

  eventFilters: {
    title: "Фильтры",
    subtitle: "Когда хотите пойти",
    showAll: "Показать все",
    labels: {
      upcoming: "Предстоящие",
      ongoing: "Сейчас",
      past: "Прошедшие",
    },
  },

  eventDetails: {
    back: "← Назад к событиям",
    eyebrow: "Событие",
    detailsTitle: "Подробности",
    when: "Когда",
    start: "Начало",
    end: "Конец",
    location: "Место проведения",
    address: "Адрес",
    notSpecified: "Не указано",
    placeTitle: "Место",
    placeLabel: "Место",
    noPlace: "Событие не привязано к месту.",
  },

  pagination: {
    pageOf: (current: number, totalPages: number): string =>
      `Страница ${current} из ${totalPages}`,
    previous: "Назад",
    next: "Дальше",
    placesAria: "Постраничная навигация по местам",
    eventsAria: "Постраничная навигация по событиям",
  },
};
