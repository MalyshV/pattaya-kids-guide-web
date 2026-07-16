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
    birthdays: "Дни рождения",
    aria: "Разделы сайта",
    langAria: "Выбор языка",
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
    // лайтбокс: клик по фото увеличивает, шарик-кнопка закрывает
    zoomPhoto: "Увеличить фото",
    closePhoto: "Закрыть фото",
    // «Есть/Нет» — для полей-состояний (Еда, Wi-Fi, Животные)
    yes: "Есть",
    no: "Нет",
    // «Да/Нет» — для полей-вопросов («Можно ли…?»)
    affirmative: "Да",
    negative: "Нет",
    // третье состояние факта: данные ещё не проверены (не выдаём пробел за «нет»)
    unknown: "уточняется",
    backToTop: "Наверх",
  },

  share: {
    cta: "Поделиться",
    copied: "Ссылка скопирована",
  },

  // «Память родителя» — закладки без регистрации (нейминг «Избранное» пока
  // рабочий, кандидат на вычитку). Хранится в браузере.
  memory: {
    navTitle: "Избранное",
    pageTitle: "Избранное",
    pageIntro:
      "Места, занятия и события, которые вы сохранили или где уже были. Список хранится только в этом браузере — без регистрации.",
    saveLabel: "Сохранить",
    savedLabel: "Сохранено",
    saveAria: "Сохранить в избранное",
    savedAria: "Убрать из сохранённого",
    visitLabel: "Были здесь",
    visitedLabel: "Были здесь",
    visitAria: "Отметить «были здесь»",
    visitedAria: "Убрать отметку «были здесь»",
    savedSection: "Сохранённое",
    visitedSection: "Были здесь",
    emptyTitle: "Пока пусто",
    emptyHint:
      "Нажимайте ♡ на карточках, чтобы сохранить, и ✓ — чтобы отметить, где уже были. Всё появится здесь.",
    remove: "Убрать",
    entityPlace: "Место",
    entityActivity: "Занятие",
    entityEvent: "Событие",
  },

  // Возраст ребёнка — сквозной вход (места + занятия). Выбор в URL, мультивыбор
  // для семей с двумя детьми.
  age: {
    question: "Сколько лет ребёнку?",
    hint: "Можно выбрать два возраста, если детей двое",
    all: "Все возрасты",
    buckets: {
      "0-1": "До 1 года",
      "1-3": "1–3 года",
      "3-6": "3–6 лет",
      "6-12": "6–12 лет",
    },
    showingFor: (labels: string[]): string =>
      labels.length === 1
        ? `Показываю для ребёнка: ${labels[0]}`
        : `Показываю для детей: ${labels.join(" и ")}`,
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
    emptyOpenNowTitle: "Сейчас открытых мест нет",
    emptyOpenNowHint:
      "Часы работы у всех разные — загляните чуть позже или выключите «Пойти сейчас», чтобы увидеть все места.",
    emptyMorningTitle: "Утром пока мало что открыто",
    emptyMorningHint:
      "Большинство детских мест открывается позже. Попробуйте выключить «Открыто с утра».",
    emptyShelterTitle: "Пока таких мест немного",
    emptyShelterHint:
      "Собираем места, где хорошо укрыться от жары и дождя. Попробуйте пока выключить этот фильтр.",
    badgeIndoor: "В помещении",
    badgeOutdoor: "На улице",
    addressFallback: "Адрес уточняется",
    // «Рядом со мной»: статусы определения геопозиции. Спокойный тон,
    // отказ — не ошибка, а подсказка, как включить, если захочется.
    nearLocating: "Определяем, что рядом…",
    nearDenied:
      "Не получилось узнать местоположение. Если захотите увидеть ближайшее — разрешите доступ к геопозиции в настройках браузера.",
    nearFailed: "Не получилось определить местоположение.",
    nearRetry: "Попробовать ещё раз",
    nearUnavailable: "В этом браузере геолокация недоступна.",
    // ссылку ?near=true могли прислать — промпт геолокации без согласия не показываем
    nearInvite:
      "Показать ближайшие места? Понадобится доступ к геопозиции — она останется в вашем браузере.",
    nearInviteCta: "Определить моё местоположение",
    // переключатель Список|Карта и подписи карты
    viewList: "Список",
    viewMap: "Карта",
    viewToggleAria: "Вид: список или карта",
    mapYouAreHere: "Вы здесь",
    mapMissingNote: (count: number): string =>
      `${count} ${plural(count, ["место", "места", "мест"])} без точных координат — ${
        count === 1 ? "оно есть" : "они есть"
      } в списке`,
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
    apply: "Применить",
    applying: "Применяю…",
    labels: {
      indoor: "В помещении",
      outdoor: "На улице",
      hasFood: "Еда",
      hasWifi: "Wi-Fi",
      hasAirCon: "Кондиционер",
      hasParking: "Парковка",
      canLeaveChild: "Можно оставить ребёнка",
      animalContact: "Животные",
    },
  },

  // строка поиска по местам и занятиям (подсказки на лету)
  search: {
    placeholder: "Найти место или занятие…",
    ariaLabel: "Поиск по местам и занятиям",
    empty: "Ничего не нашлось. Попробуйте другое слово — например, название или «батуты»",
    typePlace: "место",
    typeActivity: "занятие",
  },

  scenarios: {
    title: "Быстрый выбор",
    openNow: "Пойти сейчас",
    openNowHint: "Открыто прямо сейчас или откроется в ближайшие полчаса",
    openNowActive: "Показываю только то, что открыто сейчас",
    openMorning: "Открыто с утра",
    openMorningHint: "Работает рано — открывается к 9:00",
    openMorningActive: "Показываю места, которые открыты с утра",
    workFriendly: "Можно поработать",
    workFriendlyHint: "Wi-Fi, кондиционер и место, где можно посидеть",
    workFriendlyActive: "Показываю, где удобно поработать рядом с ребёнком",
    shelter: "Спрятаться от жары",
    shelterHint:
      "В помещении с кондиционером или под навесом с вентиляторами — и от дождя",
    shelterActive: "Показываю, где укрыться от жары и дождя",
    nearMe: "Рядом со мной",
    nearMeHint: "Ближайшие места сверху. Геопозиция остаётся в вашем браузере",
    nearMeActive:
      "Сначала ближайшие; расстояния — по прямой. Геопозиция остаётся в браузере",
  },

  // Лендинг «Дни рождения»: все площадки с пакетами и условиями в одном месте.
  birthdays: {
    metaTitle: (cityName: string): string =>
      `День рождения ребёнка в ${cityName === "Паттайя" ? "Паттайе" : cityName}: площадки, пакеты и цены`,
    heroTitle: "День рождения ребёнка в Паттайе",
    heroDescription:
      "Площадки, где проводят детские дни рождения: пакеты, цены, депозиты и контакты — всё проверено и собрано в одном месте.",
    guestsLabel: "Гости:",
    guestsFrom: (min: number): string => `от ${min}`,
    guestsRange: (min: number, max: number): string => `${min}–${max}`,
    depositLabel: "Депозит:",
    depositYes: "Да",
    depositNo: "Нет",
    preBookLabel: "Бронировать:",
    preBookDays: (days: number): string =>
      `за ${days} ${plural(days, ["день", "дня", "дней"])}`,
    openPlace: "Страница места",
    emptyTitle: "Площадки собираются",
    emptyHint:
      "Мы уточняем пакеты дней рождения у мест города — скоро здесь появится подборка.",
  },

  placeDetails: {
    back: "← Назад к местам",
    eyebrow: "Место",
    // сводка-чипы в шапке: ключевые факты без прокрутки; чип без данных пропускается
    summary: {
      ageRange: (min: number, max: number): string => `${min}–${max} лет`,
      entryFrom: (price: string): string => `вход от ${price}`,
      entryFree: "вход бесплатный",
      canLeave: "можно оставить ребёнка",
      canLeaveFrom: (age: string): string => `можно оставить ${age}`,
      todayUntil: (time: string): string => `сегодня до ${time}`,
    },
    photosTitle: "Фотографии",
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
    entryTitle: "Стоимость входа",
    entryChild: "Ребёнок",
    entryAdult: "Взрослый",
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
    activitiesTitle: "Занятия",
    membershipsTitle: "Абонементы",
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
    birthdayAllLink: "Все площадки для дня рождения",
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
    detailsCta: "Подробнее",
  },

  activityDetails: {
    back: "← Назад к занятиям",
    // краткое «где» в шапке — чтобы не листать вниз ради главного вопроса
    heroWhere: "Где:",
    whereTitle: "Где проходит",
    classesTitle: "Классы и расписание",
    classCol: "Класс",
    ageCol: "Возраст",
    timeCol: "Дни и время",
    withParent: "с родителем",
    withoutParent: "без родителя",
    parentDepends: "с родителем или без",
    classLegend:
      "«С родителем» — 45 мин, вы участвуете. «Без родителя» — 1 час, вы наблюдаете из лобби.",
  },

  eventCard: {
    starts: "Начало",
    ends: "Конец",
    ageLabel: "Возраст",
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
    activitiesAria: "Постраничная навигация по занятиям",
  },
};
