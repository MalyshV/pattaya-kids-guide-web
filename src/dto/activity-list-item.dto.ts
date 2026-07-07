export type ActivityCategoryDto = {
  id: string;
  name: string;
  slug: string;
};

/**
 * Занятие в сквозной ленте «Занятия»: программа места (COURSE/CAMP) вместе с
 * местом (обязательно — в ленте место не очевидно) и категориями.
 */
export type ActivityListItemDto = {
  id: string;
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
  place: {
    name: string;
    slug: string;
    address: string;
  };
  categories: ActivityCategoryDto[];
};
