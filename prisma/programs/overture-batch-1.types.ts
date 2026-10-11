export type DraftProgram = {
  slug: string;
  name: string;
  venueAddress: string;
  venueLatitude: number;
  venueLongitude: number;
  googleMapsUrl: string;
  /// slug из ActivityCategory; null = подходящей категории в справочнике нет
  categorySlug: string | null;
  /// только проверенные открывающиеся сайты; null = своего сайта нет
  website: string | null;
  /// только официальные страницы
  facebookUrl: string | null;
};
