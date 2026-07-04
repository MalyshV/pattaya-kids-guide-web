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

  common: {
    detailsCta: "Подробнее",
    descriptionFallback: "Описание скоро добавим.",
    yes: "Есть",
    no: "Нет",
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
      indoor: "В помещении",
      hasFood: "Еда",
      hasWifi: "Wi-Fi",
      canLeaveChild: "Можно оставить ребёнка",
      animalContact: "Животные",
    },
  },

  placeDetails: {
    back: "← Назад к местам",
    eyebrow: "Место",
    detailsTitle: "Подробности",
    fields: {
      type: "Тип",
      food: "Еда",
      wifi: "Wi-Fi",
      childDropOff: "Можно оставить ребёнка",
      animals: "Животные",
    },
    categoriesTitle: "Категории",
    upcomingTitle: "Ближайшие события здесь",
    noUpcoming: "Пока ближайших событий нет.",
  },

  pagination: {
    pageOf: (current: number, totalPages: number): string =>
      `Страница ${current} из ${totalPages}`,
    previous: "Назад",
    next: "Дальше",
    placesAria: "Постраничная навигация по местам",
  },
};
