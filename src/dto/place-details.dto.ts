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

export type PlaceDetailsDto = PlaceDto & {
  categories: PlaceCategoryDto[];
  amenities: PlaceAmenityDto[];
  ageGroups: PlaceAgeGroupDto[];
  birthdayInfo: PlaceBirthdayInfoDto;
};
