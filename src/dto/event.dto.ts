export type EventDto = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  /// возраст в месяцах; null = афиша не указала («для всех») — фильтр не прячет
  minAgeMonths: number | null;
  maxAgeMonths: number | null;
  locationName: string | null;
  address: string | null;
};
