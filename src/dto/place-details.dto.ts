import type { PlaceDto } from "@/dto/place.dto";

export type PlaceCategoryDto = {
  id: string;
  name: string;
  slug: string;
};

export type PlaceAmenityDto = {
  id: string;
  name: string;
  slug: string;
  group: {
    id: string;
    name: string;
    slug: string;
  };
};

export type PlaceAgeGroupDto = {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
};

export type PlaceBirthdayInfoDto = {
  hasPackages: boolean;
  minGuests: number | null;
  maxGuests: number | null;
  depositRequired: boolean;
  preBookingDays: number | null;
  notes: string | null;
} | null;

export type PlaceScheduleDto = {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export type PlacePricingDto = {
  priceType: string;
  audience: string;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string;
};

export type PlaceLanguageDto = {
  id: string;
  code: string;
  name: string;
};

export type PlaceTipDto = {
  id: string;
  text: string;
  topic: string | null;
  verifiedAt: Date | null;
};

export type PlaceContactDto = {
  id: string;
  type: string;
  value: string;
};

export type PlaceDetailsDto = PlaceDto & {
  categories: PlaceCategoryDto[];
  amenities: PlaceAmenityDto[];
  ageGroups: PlaceAgeGroupDto[];
  birthdayInfo: PlaceBirthdayInfoDto;
  schedules: PlaceScheduleDto[];
  pricing: PlacePricingDto[];
  staffLanguages: PlaceLanguageDto[];
  tips: PlaceTipDto[];
  contacts: PlaceContactDto[];
};
