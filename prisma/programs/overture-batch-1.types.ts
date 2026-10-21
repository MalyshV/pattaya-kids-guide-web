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
  /// поля ниже — с партий сбора 21.10.2026; уходят в пометку «[черновик]»
  instagramUrl?: string | null;
  phone?: string | null;
  lineUrl?: string | null;
  about?: string | null;
  otherSources?: readonly string[];
};
