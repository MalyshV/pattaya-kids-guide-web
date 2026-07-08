export type ActivityCategoryDto = {
  id: string;
  name: string;
  slug: string;
};

/** Возрастной класс внутри занятия (напр. классы гимнастики Little Gym). */
export type ActivityClassDto = {
  id: string;
  name: string;
  ageLabel: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  parentRequired: boolean | null;
  schedule: string;
};

/**
 * Занятие в сквозной ленте «Занятия»: программа места (COURSE/CAMP) вместе с
 * местом (обязательно — в ленте место не очевидно) и категориями.
 */
export type ActivityListItemDto = {
  id: string;
  slug: string | null;
  imageUrl: string | null;
  type: string;
  name: string;
  description: string | null;
  price: number | null;
  oldPrice: number | null;
  currency: string;
  priceUnit: string | null;
  minAgeMonths: number | null;
  maxAgeMonths: number | null;
  startDate: Date | null;
  endDate: Date | null;
  // каталожное место (со своей страницей) ИЛИ null — тогда текстовое место ниже
  place: {
    name: string;
    slug: string;
    address: string;
  } | null;
  venueName: string | null;
  venueAddress: string | null;
  categories: ActivityCategoryDto[];
  classes: ActivityClassDto[];
};
